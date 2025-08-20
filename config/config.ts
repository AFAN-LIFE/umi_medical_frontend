import { defineConfig } from "umi";
import routes from './routes';


export default defineConfig({
  // routes: [
  //   { path: "/", component: "index" },
  //   { path: "/docs", component: "docs" },
  //   { path: "/count", component: "count" },
  // ],
  npmClient: 'pnpm',
  routes,  // 配置式路由，简写不冒号了，抽出来更好，否则太长了
  externals: {}, // {}表示开启配置，要使用antd需要开启这个配置
  historyWithQuery: {}, // 开启query参数传递
});
