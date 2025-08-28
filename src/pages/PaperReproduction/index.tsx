// src/pages/collections/index.tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';
import { loadPapersFromCSV, PaperItem } from '@/utils/CSVLoader';
import { Card, Row, Col, Button, Spin, Alert, Empty, Tag } from 'antd';

const CollectionsPage: React.FC = () => {
  const [papers, setPapers] = useState<PaperItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 模拟收藏的文章数据
  // 从CSV加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 替换为您的CSV文件路径
        const data = await loadPapersFromCSV('/data/papers.csv');
        setPapers(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleBack = () => {
    history.push('/');
  };

  const handleArticleClick = (link: string) => {
    window.open(link, '_blank');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '初级': return 'green';
      case '中级': return 'blue';
      case '高级': return 'red';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Spin size="large" />
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <Alert
            message="错误"
            description={error}
            type="error"
            showIcon
          />
          <Button 
            type="primary" 
            onClick={() => window.location.reload()}
            style={{ marginTop: '16px' }}
          >
            重试
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 顶部导航栏 - 保持不变 */}
      <div className={styles.header}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          className={styles.backButton}
        >
          返回首页
        </Button>
        <h1 className={styles.title}>我的收藏</h1>
        <div className={styles.placeholder}></div>
      </div>

      {/* 文章列表 - 从CSV加载数据 */}
      <div className={styles.articlesContainer}>
        <Row gutter={[16, 16]}>
          {papers.length === 0 ? (
            <Empty 
              description="暂无收藏的论文" 
              style={{ margin: '40px auto', gridColumn: '1 / -1' }}
            />
          ) : (
            papers.map(paper => (
              <Col xs={24} sm={12} lg={8} key={paper.title}>
                <Card 
                  className={styles.articleCard}
                  onClick={() => handleArticleClick(paper.link)}
                  hoverable
                >
                  <div className={styles.articleHeader}>
                    <span className={styles.source}>{paper.field}</span>
                    <span className={styles.time}>{paper.date}</span>
                  </div>
                  <h3 className={styles.articleTitle}>{paper.title}</h3>
                  <p className={styles.articleDesc}>{paper.description}</p>
                  <div className={styles.tags}>
                    <Tag color={getDifficultyColor(paper.difficulty)}>
                      {paper.difficulty}
                    </Tag>
                    <Tag color="purple">{paper.field}</Tag>
                  </div>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </div>
    </div>
  );
};

export default CollectionsPage;