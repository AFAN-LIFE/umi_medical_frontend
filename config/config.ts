import { defineConfig } from "umi";
import routes from './routes';


export default defineConfig({
  // ====================基础配置=========================
  // 基本配置 NODE_ENV 是一个环境变量
  // pnpm dev NODE_ENV的值是development
  // pnpm build NODE_ENV的值是production
  devtool: process.env.NODE_ENV === 'development' ? 'eval' : false,

  // 打包后的文件会带hash，处理浏览器缓存问题
  hash: true, 

  // 配置图片的打包方式，大于10KB，单独打包成一个图片，如果小于10KB，打包Base64
  inlineLimit: 10000,

  // 配置js的压缩方式
  jsMinifier: 'esbuild',
  jsMinifierOptions: {},

  // 配置umi插件，自己去网上找找
  plugins: [], 

  // 配置打包后的资源的导入路径，默认是/
  publicPath: process.env.NODE_ENV === 'development' ? '/' : '/electric/',

  // 配置网站的标题
  title: "AFAN",

  // ====================浏览器兼容性=========================
  // 默认全量引入polyfill来处理ES6+中的API兼容，也可以手动按需引入
  polyfill: {},
  // 兼容 ie11
  // targets: {
  //     ie: 11,
  // },

  // ====================路由相关=========================
  routes,  // 配置式路由，简写不冒号了，抽出来更好，否则太长了
  // history: { 
  //   type: "hash" // 使用Hash路由
  // },
  // 让 history 带上 query。除了通过 useNavigate 进行的跳转场景，此时还需自行处理 query。
  historyWithQuery: {},  // 开启query参数传递，但是感觉query没什么特殊的哈哈
  base: '/electric/', // 配置部署应用时的基础路径

  // ====================配置代理=========================
  // 好像没效果
  proxy: {
    '/api/': {
      'target':  process.env.NODE_ENV === 'development' ? 'http://localhost/medical-api/' : 'https://changtianml.com/medical-api/',
      'changeOrigin': true,
      'secure': false, // 如果目标服务器使用 HTTPS 且证书无效，可以设置为 false
    },
  },

  // ====================配置webpack=========================
  // chainWebpack(memo, { env, webpack }) {
  //   // memo表示现有的webpack配置，env表示环境变量，webpack对象，自己研几怎么配置
  //   // // 设置 alias
  //   // memo.resolve.alias.set('foo', '/tmp/to/foo');
  //   // // 添加额外插件
  //   // memo.plugin('hello').use(Plugin, [...args]);
  //   // // 删除 Umi 内置插件
  //   // memo.plugins.delete('hmr');
  // },

  // ====================配置额外扩展项=========================  
  extraBabelIncludes: [],  // 配置额外需要做Bable编译NPM包或目录
  extraBabelPlugins: [],  // 配置额外的bable插件
  extraBabelPresets: [],  // 配置额外的bable插件集
  // 配合headScripts可以把项目中的一些三方模块，单独在html文件中导入，导入也可以是一个cdn地址, 这样可以减少主js的大小
  externals: {}, // {}表示开启配置，要使用antd需要开启这个配置，
  links: [],  // 配置额外的links标签，可以再项目中引入一些样式
  metas: [], // 配置额外的meta标签，比如项目的一些关键字

  npmClient: 'pnpm',
});
