import React, { useState } from 'react';
import { Modal, Form, Input, Button, Avatar, Dropdown, Space, message } from 'antd';
import { UserOutlined, LoginOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import styles from './index.less';
import { aesEncode } from '@/utils/EncryptUtil'; // 引入加密函数
import { LocalStorageUtils } from '@/utils/StorageUtils'; // 导入工具类

export interface UserInfo {
  userId: number;
  username: string;
  xAuthToken: string;
  nickName?: string | null;
  email?: string | null;
  avatar?: string | null;
  phone?: string;
  createTime?: string;
  loginDate?: string;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
  enabled?: boolean;
  disabled?: boolean;
  deleted?: boolean;
  resourceAuthorities?: any[];
  roleAuthorities?: any[];
  medical_token?: string;
}

const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
  return LocalStorageUtils.get('current_logined_user_profile');
});

interface UserLoginProps {
  onLoginSuccess?: (userInfo: UserInfo) => void;
  // () => void - 表示这是一个没有参数、没有返回值的函数类型
  // 这里的?.是可选链操作符，表示如果onLogout存在则调用它
  onLogout?: () => void;  
}

// Token过期处理函数
const handleTokenExpired = () => {
  message.error('登录已过期，请重新登录');
  setUserInfo(null);
  LocalStorageUtils.remove('current_logined_user_profile');
  onLogout?.();
};


const LOCAL_STORAGE_TOKEN_EXPIRE = 'token_expire'

// 添加响应拦截器
const setupResponseInterceptor = (onTokenExpired: () => void) => {
  const originalFetch = window.fetch;
   
  // 每次请求都会经过这里
  window.fetch = async (...args) => {
    // 先执行原始请求
    const response = await originalFetch(...args);
    
    // 克隆响应以便可以多次读取
    const clonedResponse = response.clone();
    
    // 检查响应中是否包含Token过期信息
    try {
      const data = await clonedResponse.json();
      if (data.message === LOCAL_STORAGE_TOKEN_EXPIRE) {
      // 4. 如果Token过期，执行处理函数
      handleTokenExpired();
      }
    } catch (e) {
      // 响应不是JSON格式，忽略错误
    }
    
    return response;
  };
};

const UserLogin: React.FC<UserLoginProps> = ({ onLoginSuccess, onLogout }) => {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [loginForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    // 使用工具类获取用户信息
    return LocalStorageUtils.get('current_logined_user_profile');
  });

    // Token过期处理函数
  const handleTokenExpired = () => {
    message.error('登录已过期，请重新登录');
    setUserInfo(null);
    LocalStorageUtils.remove('current_logined_user_profile');
    onLogout?.();
  };

    // 设置响应拦截器
  useEffect(() => {
    setupResponseInterceptor(handleTokenExpired);
  }, []);

    // 定期验证Token的函数
  const verifyTokenPeriodically = async () => {
    if (!userInfo?.xAuthToken) return;
    
    try {
      const response = await fetch('/medical-api/auth/verify-token', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Auth-Token': userInfo.xAuthToken
        },
        body: JSON.stringify({ token: userInfo.xAuthToken }),
      });
      
      const result = await response.json();
      
      if (!result.success && result.message === LOCAL_STORAGE_TOKEN_EXPIRE) {
        handleTokenExpired();
      }
    } catch (error) {
      console.error('Token验证失败:', error);
    }
  };

    // 设置定期Token验证
  useEffect(() => {
    if (userInfo?.xAuthToken) {
      // 每5分钟验证一次Token
      const intervalId = setInterval(verifyTokenPeriodically, 5 * 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [userInfo?.xAuthToken]);


  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      // 使用开发提供的加密函数加密密码
      const encryptedPassword = aesEncode(values.password);
      // 准备请求数据
      const requestData = {
        username: values.username,
        password: encryptedPassword // 使用加密后的密码
      };
      // 这里替换为实际的API调用
      const response = await fetch('/medical-api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      console.log('登录响应:', response);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // 构建完整的用户信息对象
          const userData: UserInfo = {
            userId: result.data.userId,
            username: result.data.username,
            xAuthToken: result.data.xAuthToken,
            nickName: result.data.nickName,
            email: result.data.email,
            avatar: result.data.avatar,
            phone: result.data.phone,
            createTime: result.data.createTime,
            loginDate: result.data.loginDate,
            accountNonExpired: result.data.accountNonExpired,
            accountNonLocked: result.data.accountNonLocked,
            credentialsNonExpired: result.data.credentialsNonExpired,
            enabled: result.data.enabled,
            disabled: result.data.disabled,
            deleted: result.data.deleted,
            resourceAuthorities: result.data.resourceAuthorities || [],
            roleAuthorities: result.data.roleAuthorities || [],
            medical_token: result.data.medical_token,
          };
          setUserInfo(userData);
          // 使用工具类存储用户信息到localStorage
          LocalStorageUtils.set('current_logined_user_profile', userData);
          LocalStorageUtils.set('i18nextLng', 'en'); // 设置语言
          message.success('登录成功！');
          setIsLoginModalVisible(false);
          loginForm.resetFields();
          onLoginSuccess?.(userData);
        } else {
          message.error(result.message || '登录失败');
        }
      } else {
        message.error('登录请求失败');
      }
    } catch (error) {
      console.error('登录错误:', error);
      message.error('登录过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUserInfo(null);
    // 使用工具类移除存储的用户信息
    LocalStorageUtils.remove('current_logined_user_profile');
    message.success('已退出登录');
    // handleLogout 负责基础的登出清理工作（必做）
    // onLogout 让父组件有机会添加额外的登出逻辑（选做）
    onLogout?.();
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <div className={styles.userLogin}>
      {userInfo ? (
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space className={styles.userInfo} style={{ cursor: 'pointer' }}>
            <Avatar 
              size="small" 
              icon={<UserOutlined />} 
              style={{ backgroundColor: '#1890ff' }}
            />
            <span className={styles.userName}>{userInfo.username}</span>
          </Space>
        </Dropdown>
      ) : (
        <Button 
          type="primary" 
          icon={<LoginOutlined />}
          onClick={() => setIsLoginModalVisible(true)}
          className={styles.loginButton}
        >
          登录
        </Button>
      )}

      <Modal
        title="用户登录"
        open={isLoginModalVisible}
        onCancel={() => {
          setIsLoginModalVisible(false);
          loginForm.resetFields();
        }}
        footer={null}
        width={400}
      >
        <Form form={loginForm} layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserLogin;