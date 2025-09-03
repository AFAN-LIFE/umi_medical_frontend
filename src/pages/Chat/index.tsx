import React, { useEffect, useState, useRef } from 'react';
import Chat, { Bubble, useMessages } from '@chatui/core';
import '@chatui/core/dist/index.css';
import { useLocation } from 'umi';
import { LocalStorageUtils } from '@/utils/StorageUtils';

export default function() {
  // 后端请求状态
  const [isProcessing, setIsProcessing] = useState(false);
  const streamingMessageIdRef = useRef<string | null>(null);
  const accumulatedTextRef = useRef<string>('');
  // 接受跳转参数
  const location = useLocation();

    // 从state或query中获取参数
  const getQueryFromLocation = () => {
    // 优先从state中获取（隐式传参）
    if (location.state && location.state.searchText) {
      return location.state.searchText;
    }
    
    // 如果state中没有，尝试从query参数获取（兼容旧方式）
    const params = new URLSearchParams(location.search);
    return params.get('searchText') || '';
  };

  const query = getQueryFromLocation();
  console.log('Received query:', query);
  
  // 动态初始消息
  const initialMessages = [
    {
      type: 'system',
      content: { text: '长天医疗建模平台智能客服小逸 为您服务' },
    },
    {
      type: 'text',
      content: { text: 'Hi，我是你的专属智能助理小逸，有问题请随时找我哦~' },
      user: {
        avatar: '/robot_avatar.png',
      },
    },
    // ... 是将数组展开的语法，类似python的 *query
    ...(query
      ? [{
          type: 'text',
          content: { text: `我要生成文献综述：${query}` },
          position: 'right',
        }]
      : []),
  ];

// 默认快捷短语，可选
const defaultQuickReplies = [
  {
    icon: 'message',
    name: '联系人工服务',
    isNew: true,
    isHighlight: true,
  },
  {
    name: '短语1',
    isNew: true,
  },
  {
    name: '短语2',
    isHighlight: true,
  },
  {
    name: '短语3',
  },
];

  // 消息列表
  const { messages, appendMsg, updateMsg} = useMessages(initialMessages);

  // 发送请求到后端
  const sendRequestToBackend = async (queryText: string) => {
    setIsProcessing(true);
    
    // 获取 medical_token
    const userInfo = LocalStorageUtils.get('current_logined_user_profile');
    const medical_token = userInfo?.medical_token;
    
    if (!medical_token) {
      appendMsg({
        type: 'text',
        content: { text: '未登录或未获取到 medical_token，无法生成文献综述。' },
      });
      setIsProcessing(false);
      return;
    }

    try {
      // 先添加一个空消息用于流式更新
      const loadingMessage = appendMsg({
        type: 'text',
        content: { text: '正在生成中...' },
      });
      
      // 记录这个消息的id
      streamingMessageIdRef.current = loadingMessage._id;

      const response = await fetch('/medical-api/llm/abstract_generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${medical_token}`,
        },
        body: JSON.stringify({ query: queryText }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      // 使用 ReadableStream 处理流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullText = '';

      // 不断获取后端发来的数据块
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        console.log('Received chunk:', chunk);
        accumulatedTextRef.current += chunk;

        // 正确使用 updateMsg：第一个参数是消息ID，第二个参数是 MessageWithoutId
        if (streamingMessageIdRef.current) {
          updateMsg(streamingMessageIdRef.current, {
            type: 'text',
            content: { text: accumulatedTextRef.current },
          });
        }
      }

      // 处理最后的解码内容
      const finalChunk = decoder.decode();
      if (finalChunk) {
        accumulatedTextRef.current += finalChunk;
        if (streamingMessageIdRef.current) {
          updateMsg(streamingMessageIdRef.current, {
            type: 'text',
            content: { text: accumulatedTextRef.current },
          });
        }
      }

    } catch (err) {
      console.error('请求出错:', err);
      if (streamingMessageIdRef.current) {
        updateMsg(streamingMessageIdRef.current, {
          type: 'text',
          content: { text: '请求出错，请检查网络或稍后重试。' },
        });
      } else {
        appendMsg({
          type: 'text',
          content: { text: '请求出错，请检查网络或稍后重试。' },
        });
      }
    } finally {
      setIsProcessing(false);
      streamingMessageIdRef.current = null;
    }
  };

  // 在组件挂载时自动发送请求（如果有query参数）
  useEffect(() => {
    if (query && query.trim()) {
      // 延迟一下确保消息已经渲染完成
      setTimeout(() => {
        sendRequestToBackend(query);
      }, 100);
    }
  }, [query]); // 依赖query，当query变化时重新执行


  // 发送回调（用户手动发送）
  async function handleSend(type: string, val: string) {
    if (type === 'text' && val.trim()) {
      appendMsg({
        type: 'text',
        content: { text: val },
        position: 'right',
      });

      await sendRequestToBackend(val);
    }
  }


  // 快捷短语回调，可根据 item 数据做出不同的操作，这里以发送文本消息为例
  function handleQuickReplyClick(item) {
    handleSend('text', item.name);
  }

  function renderMessageContent(msg) {
    const { type, content } = msg;

    // 根据消息类型来渲染
    switch (type) {
      case 'text':
        return <Bubble content={content.text} />;
      case 'image':
        return (
          <Bubble type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        );
      default:
        return null;
    }
  }

  return (
    <Chat
      navbar={{ title: '智能助理' }}
      messages={messages}
      renderMessageContent={renderMessageContent}
      quickReplies={defaultQuickReplies}
      onQuickReplyClick={handleQuickReplyClick}
      onSend={handleSend}
      // 可选：在请求过程中禁用输入
      disableSend={isProcessing}
    />
  );
}