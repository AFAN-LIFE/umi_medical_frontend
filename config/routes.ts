const routes =  [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: '@/pages/Home',
    },
    {
      name: '论文复现',
      path: '/paper-reproduction',
      component: '@/pages/PaperReproduction',
    },
    { 
        path: "*",    // 匹配不到上面就是404
        component: "404", 
    },
]

export default routes;