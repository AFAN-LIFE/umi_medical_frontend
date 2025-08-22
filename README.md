# 项目启动
基本指令
```
npm i pnpm -g  # 安装npnm
pnpm install # 安装依赖
pnpm dev # 运行项目
pnpm build
```

其他依赖安装方法，更推荐package.json管理
```
pnpm i antd qs styled-components @umijs/plugins
```
# 项目上传
在`config.ts`设置打包路径：
```
publicPath: process.env.NODE_ENV === 'development' ? '/' : '/electric/',
```
上传到服务器`/usr/share/nginx/html`下

nginx配置
```
        location /electric/ {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            alias /usr/share/nginx/html/medical/;
            try_files $uri $uri/ =404;
        }
```

# 用户加密
基于`crpyto-js`，代码在`utils/EncryptUtils.ts`s
```
"crypto-js": "^4.2.0"
```

# 页面布局
## 网格
参考：https://ant.design/components/grid-cn

Antd 的 Grid 系统将屏幕宽度分为 24 等分，每个 Col 的数值表示占据多少份。
gutter={[24, 24]}:
- 第一个数字 24: 列之间的水平间距（24px）
- 第二个数字 24: 行之间的垂直间距（24px）

屏幕尺寸的适配参数：
- xs (超小屏幕) 屏幕宽度: < 576px xs={24}: 占据24/24，即100%宽度，每行显示1个卡片，适用于：手机竖屏
- sm (小屏幕) 屏幕宽度: ≥ 576px sm={12}: 占据12/24，即50%宽度，每行显示2个卡片 适用于：手机横屏、小平板
- md (中屏幕) 屏幕宽度: ≥ 768px md={8}: 占据8/24，即33.33%宽度，每行显示3个卡片 适用于：平板、小笔记本
- lg (大屏幕) 屏幕宽度: ≥ 992px lg={6}: 占据6/24，即25%宽度，每行显示4个卡片 适用于：普通桌面显示器
- xl (超大屏幕) 屏幕宽度: ≥ 1200px xl={6}: 占据6/24，即25%宽度，每行显示4个卡片 适用于：大尺寸显示器

卡片数量：`每行卡片数量 = 24 / Col的数值`
- xs={24} → 24/24 = 1个/行
- sm={12} → 24/12 = 2个/行
- md={8} → 24/8 = 3个/行
- lg={6} → 24/6 = 4个/行
- xl={4} → 24/4 = 6个/行

```tsx
<div className={styles.featureGrid}>
    <Row gutter={[24, 24]}>
        {featureCards.map((card) => (
        <Col xs={24} sm={12} md={8} lg={8} xl={8} key={card.id}>
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
```

## 卡片
参考：https://ant.design/components/card-cn
