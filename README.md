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

# 新手创建
```
pnpm dlx create-umi@latest
```

# 其他工具
## favicon转换
https://favicon.io/favicon-converter/

# commit说明

- 250819 约定式路由配置：这种路由不是很灵活
    - 先注释config/config.ts中的路由表 
    - 在pages下面增加user/order.tsx和user/profile.tsx二级页面
    - 修改layouts/index.tsx的基本页面布局，添加React的styled-components样式，增加NavLink跳转和一些页面美化
    - 修改pages/user.tsx的基本页面布局，增加二级页面的跳转

- 250819 项目文件基本配置
    - .env 基本环境变量，端口和地址 
    - package.json 依赖管理
    - config/config.ts 非运行配置，和.umirc.ts二选一
    - public 静态资源目录，打包会进入dist，可以代码应用
    - src/app.ts 运行时配置，可以修改路由、render方法
    - src/layouts 全局布局，启动项目会先加载layout组件
    - src/pages 页面级别的组件，约定式路由，但是已经被路由规则config/config.ts给覆盖；这里已经增加count.ts做了测试