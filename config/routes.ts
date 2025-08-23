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
        path: "*",    // 匹配不到上面就是404
        component: "404", 
    },
]

export default routes;