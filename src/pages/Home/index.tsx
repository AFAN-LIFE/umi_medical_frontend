import React, { useState } from 'react';
import { Card, Input, Button, Tabs, Badge, Row, Col, Upload, message } from 'antd';
import { 
  CloudUploadOutlined, 
  SearchOutlined, 
  AppstoreOutlined,
  BellOutlined,
  FileTextOutlined,
  HeartOutlined,
  CameraOutlined,
  DatabaseOutlined,
  EditOutlined,
  RobotOutlined
} from '@ant-design/icons';
import { history } from "umi";
import styles from './index.less';
import UserLogin, { UserInfo } from '@/components/UserLogin';

const { TabPane } = Tabs;

const HomePage: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  // 功能卡片数据
  const featureCards = [
    {
      id: 'data_preprocessing',
      title: '数据清洗',
      description: '对您的数据进行清洗、转换、采样和预处理',
      icon: <BellOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      path: 'https://changtianml.com/medical', // 完整URL
      isHot: false,
    },
    {
      id: 'feature_engineering',
      title: '特征工程',
      description: '对您的数据进行清洗、转换、采样和预处理',
      icon: <BellOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      path: 'https://changtianml.com/medical', // 完整URL
      isHot: false,
    },    
    {
      id: 'subscription',
      title: '文献订阅',
      description: '订阅关心的  关键词,定时收到最新热门文献推送',
      icon: <BellOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      path: '/subscription',
      isHot: false,
    },
    {
      id: 'upload-pdf',
      title: '上传PDF',
      description: '上传英文PDF文件,在线划词翻译为中文',
      icon: <FileTextOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      path: '/upload-pdf',
      isHot: true,
    },
    {
      id: 'collections',
      title: '我的收藏',
      description: '查看已经收藏的文献,自动关联PDF,云端管理',
      icon: <HeartOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
      path: '/collections',
      isHot: false,
    },
    {
      id: 'follow-journals',
      title: '关注期刊',
      description: '像朋友圈一样查看期刊最新发表的文献',
      icon: <CameraOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      path: '/follow-journals',
      isHot: false,
    },
    {
      id: 'journal-search',
      title: '期刊检索',
      description: '检索期刊,查阅期刊的IF因子和投稿网站',
      icon: <DatabaseOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      path: '/journal-search',
      isHot: false,
    },
    {
      id: 'notes',
      title: '我的笔记',
      description: '可随时查看笔记内容,便于知识整理与重点标记',
      icon: <EditOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      path: '/notes',
      isHot: false,
    },
    {
      id: 'ai-review',
      title: 'AI综述',
      description: '基于您的研究方向,AI为您生成了撰写综述',
      icon: <RobotOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      path: '/ai-review',
      isHot: true,
    },
    {
      id: 'ai-journal-selection',
      title: 'AI选刊',
      description: 'AI选刊工具,根据待投文章的title推荐期刊',
      icon: <RobotOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      path: '/ai-journal-selection',
      isHot: false,
    },
    {
      id: 'academic-ai',
      title: '学术AI',
      description: '基于SCI文献回答问题,所有答案都有参考文献',
      icon: <RobotOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      path: '/academic-ai',
      isHot: true,
    },
  ];

  const handleCardClick = (path: string) => {
    history.push(path);
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      message.info(`搜索: ${searchText}`);
      // 这里可以添加实际的搜索逻辑
    }
  };

  const handleUpload = (file: any) => {
    message.success('文件上传成功！');
    return false; // 阻止默认上传行为
  };

  const handleLoginSuccess = (userInfo: UserInfo) => {
    console.log('用户登录成功:', userInfo);
    // 可以在这里处理登录成功后的逻辑
  };

  const handleLogout = () => {
    console.log('用户退出登录');
    // 可以在这里处理退出登录后的逻辑
  };

  return (
    <div className={styles.container}>
      {/* 顶部导航栏 */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <h1>长天医疗平台</h1>
        </div>
        
        <div className={styles.userSection}>
          <UserLogin 
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
          />
        </div>
      </div>
      {/* 搜索区域 */}
      <div className={styles.searchSection}>
        <Tabs defaultActiveKey="1" className={styles.tabs}>
          <TabPane tab="文献搜索" key="1">
            <div className={styles.searchBar}>
              <Input
                placeholder="拖拽PDF到文本框上传/翻译"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={handleSearch}
                className={styles.searchInput}
                suffix={
                  <div className={styles.searchIcons}>
                    <Upload
                      accept=".pdf"
                      beforeUpload={handleUpload}
                      showUploadList={false}
                    >
                      <CloudUploadOutlined className={styles.icon} />
                    </Upload>
                    <SearchOutlined className={styles.icon} onClick={handleSearch} />
                    <AppstoreOutlined className={styles.icon} />
                  </div>
                }
              />
              <Button 
                type="primary" 
                size="large" 
                onClick={handleSearch}
                className={styles.searchButton}
              >
                搜索 文献
              </Button>
            </div>
          </TabPane>
          <TabPane tab="学术AI" key="2">
            <div className={styles.searchBar}>
              <Input
                placeholder="向AI提问学术问题..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={handleSearch}
                className={styles.searchInput}
                suffix={
                  <div className={styles.searchIcons}>
                    <RobotOutlined className={styles.icon} />
                    <SearchOutlined className={styles.icon} onClick={handleSearch} />
                    <AppstoreOutlined className={styles.icon} />
                  </div>
                }
              />
              <Button 
                type="primary" 
                size="large" 
                onClick={handleSearch}
                className={styles.searchButton}
              >
                提问 AI
              </Button>
            </div>
          </TabPane>
        </Tabs>
      </div>

      {/* 功能卡片网格 */}
      <div className={styles.featureGrid}>
        <Row gutter={[24, 24]}>
          {featureCards.map((card) => (
            <Col xs={24} sm={8} md={6} lg={6} xl={6} key={card.id}>
              <Card
                hoverable
                className={styles.featureCard}
                onClick={() => handleCardClick(card.path)}
              >
                {card.isHot && (
                  <div className={styles.hotBadge}>
                    <Badge.Ribbon text="热门" color="red" />
                  </div>
                )}
                <div className={styles.cardContent}>
                  <div className={styles.cardIcon}>
                    {card.icon}
                  </div>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDescription}>{card.description}</p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
