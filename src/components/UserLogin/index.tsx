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

interface UserLoginProps {
  onLoginSuccess?: (userInfo: UserInfo) => void;
  onLogout?: () => void;
}

const UserLogin: React.FC<UserLoginProps> = ({ onLoginSuccess, onLogout }) => {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [loginForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    // 使用工具类获取用户信息
    return LocalStorageUtils.get('current_logined_user_profile');
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.retCode === '0') {
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
    // 使用工具类移除存储的用户信息
    LocalStorageUtils.remove('current_logined_user_profile');
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