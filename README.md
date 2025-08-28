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
## 打包上传
在`config.ts`设置打包路径：
```
publicPath: process.env.NODE_ENV === 'development' ? '/' : '/electric/',
```
并且配置路由的基础路径：
```
base: '/electric/'
```
上传到服务器`/usr/share/nginx/html/medical`下
## nginx配置
### 静态资源
nginx配置
```
        location /electric/ {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            alias /usr/share/nginx/html/medical/;
            try_files $uri $uri/ =404;
        }
```
### 动态资源
客户端请求 → Nginx (location匹配) → upstream定义的后端服务
- upstream：定义后端服务器组，定义一个名为 medical-api 的后端服务器集群（上游服务）。后续可以：配置多个服务器 server 192.168.1.10:8080; server 192.168.1.11:8080;健康检查：自动检测后端服务器状态；故障转移：当某个服务器宕机时自动切换到其他服务器；会话保持：配置会话粘性
- location：定义请求路由规则，匹配特定的 URL 路径，并定义如何处理这些请求。后续可以：路由匹配：根据 URL 路径将请求导向不同的处理方式；代理配置：设置反向代理的各种参数；缓存控制：配置缓存策略；访问控制：设置权限验证

前端请求：http://localhost/api/auth/login
× 有nginx这步不需要，仅限于dev下图快，Umi代理重写直接代理到后端接口
↓ Nginx接收
Nginx匹配：location /medical-api/ 
↓ 转发到后端
最终请求：http://localhost:25432/auth/login

```
http {
    upstream medical-api {
        server localhost:25432;
    }
    server {
        location /medical-api/ {
            proxy_pass http://medical-api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### 其他运维
nginx windows日志监控
```
Get-Content -Path D:\software\nginx-1.28.0\logs\access.log -Wait
Get-Content -Path D:\software\nginx-1.28.0\logs\error.log -Wait
```

## 代理逻辑
前端页面：
- 1 用户访问前端`localhost/electric`（生产`https://www.changtianml.com/electric`）
- 2 nginx通过反向代理的location将其转换成`D:/git_repo/umi-learn/dist/`（生产`/usr/share/nginx/html/medical`）

后端交互：
- 1 用户从前端交互访问`api`接口请求后端
- 2 Umi通过proxy将`api`转换成`http://localhost/medical-api/`（生产`https://changtianml.com/medical-api/`）
- 3 nginx通过反向代理的location将其转换成`http://medical-api/`
- 4 nginx通过反向代理的upstream将其转换成`localhost:25432`

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


## CSV文件加载
论文复现的展示页面中希望能通过csv文件展示卡片的情况，这样解耦方便维护，流程是
- 先在`public/data`下面放置csv文件，内容如下
```
title,description,link,difficulty,field,date
"U-Net医学影像分割实战","Python深度学习","https://mp.weixin.qq.com/s/vS58ppcNtE-ZvKzDgxFASQ","高级","JCR1区","2025-08-13"
```
- 然后编写`utils/CSVLoader`读取，依赖于
```
  "dependencies": {
    "papaparse": "^5.5.3",
  },
  "devDependencies": {
    "@types/papaparse": "^5.3.16",
  }
```
- 最后`pages/PaperReproduction`再读取渲染即可
