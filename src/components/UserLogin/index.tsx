import React, { useState } from 'react';
import { Modal, Form, Input, Button, Avatar, Dropdown, Space, message } from 'antd';
import { UserOutlined, LoginOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import styles from './index.less';
import { aesEncode } from '@/utils/EncryptUtil'; // 引入加密函数

export interface UserInfo {
  username: string;
  xAuthToken?: string;
}

interface UserLoginProps {
  onLoginSuccess?: (userInfo: UserInfo) => void;
  onLogout?: () => void;
}

const UserLogin: React.FC<UserLoginProps> = ({ onLoginSuccess, onLogout }) => {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [loginForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    const savedUser = localStorage.getItem('user_info');
    return savedUser ? JSON.parse(savedUser) : null;
  });

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
      const response = await fetch('/auth-api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.retCode === '0') {
          const userData = {
            username: result.data.username,
            xAuthToken: result.data.xAuthToken,
          };
          setUserInfo(userData);
          localStorage.setItem('local_user_name', result.data.xAuthToken);
          message.success('登录成功！');
          setIsLoginModalVisible(false);
          loginForm.resetFields();
          onLoginSuccess?.(userData);
        } else {
          message.error(result.retMsg || '登录失败');
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
    localStorage.removeItem('user_info');
    message.success('已退出登录');
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