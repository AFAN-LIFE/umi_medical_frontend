import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Input, Button, Avatar, Spin, Typography, Divider, Alert } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AcademicAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AbortController | null>(null);

  // 示例初始消息
  const initialMessages: Message[] = [
    {
      id: '1',
      type: 'ai',
      content: '您好！我是pubmed.pro学术AI，根据海量SCI文献知识库回答您的问题，提供专业的科研内容，所有答案都有真实文献支持。',
      timestamp: new Date()
    }
  ];

  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    // 创建新的AbortController用于中断请求
    controllerRef.current = new AbortController();

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: inputValue.trim(),
          history: messages.slice(-6).map(m => ({
            role: m.type,
            content: m.content
          }))
        }),
        signal: controllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      const decoder = new TextDecoder();
      let aiMessage = '';

      // 添加初始AI消息
      const aiMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: aiMessageId,
        type: 'ai',
        content: '',
        timestamp: new Date()
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiMessage += chunk;

        // 更新AI消息内容
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId ? { ...msg, content: aiMessage } : msg
        ));
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('请求被用户中断');
      } else {
        setError(error.message || '请求失败，请稍后重试');
        console.error('请求错误:', error);
      }
    } finally {
      setIsLoading(false);
      controllerRef.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleStop = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages(initialMessages);
    setError(null);
  };

  return (
    <PageContainer 
      title="学术AI" 
      onBack={() => history.push('/')}
      className={styles.container}
    >
      <div className={styles.chatContainer}>
        <Card className={styles.chatCard}>
          {/* 消息列表 */}
          <div className={styles.messages}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${message.type === 'user' ? styles.userMessage : styles.aiMessage}`}
              >
                <div className={styles.messageContent}>
                  <Avatar
                    icon={message.type === 'user' ? <UserOutlined /> : <RobotOutlined />}
                    className={styles.avatar}
                    style={{ backgroundColor: message.type === 'user' ? '#1890ff' : '#52c41a' }}
                  />
                  <div className={styles.messageBubble}>
                    <Paragraph className={styles.messageText}>
                      {message.content}
                    </Paragraph>
                    <div className={styles.messageTime}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={styles.loading}>
                <Spin size="small" />
                <span style={{ marginLeft: 8 }}>AI正在思考...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 错误提示 */}
          {error && (
            <Alert
              message="错误"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
              style={{ marginBottom: 16 }}
            />
          )}

          {/* 输入区域 */}
          <div className={styles.inputArea}>
            <TextArea
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="输入您想要了解的内容，比如：青光眼的最新研究进展、冠心病的预后如何"
              autoSize={{ minRows: 2, maxRows: 4 }}
              disabled={isLoading}
              className={styles.textArea}
            />
            <div className={styles.actions}>
              <Button 
                icon={<SendOutlined />} 
                type="primary" 
                onClick={handleSubmit}
                loading={isLoading}
                disabled={!inputValue.trim()}
              >
                发送
              </Button>
              {isLoading && (
                <Button onClick={handleStop} danger>
                  停止
                </Button>
              )}
              <Button onClick={handleClear}>
                清空对话
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AcademicAI;