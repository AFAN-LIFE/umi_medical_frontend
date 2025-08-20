const routes =  [
    { 
        path: "/", 
        component: "index",  // 自动去pages目录下查找，也可以指定目录
        titie: "首页"
    },
    { 
        path: "/count", 
        component: "count", 
        titie: "计数器"
    },
    { 
        path: "/user", 
        component: "user",  
        titie: "个人中心",
        routes: [
                { 
                    path: "/user", 
                    redirect: '/user/order'  // 重定向
                },
                { 
                    path: "/user/order", 
                    component: "user/order",  
                    titie: "订单管理"
                },
                { 
                    path: "/user/profile", 
                    component: "user/profile",  
                    titie: "个人想信息"
                },
        ]
    },
    { 
        path: "*",    // 匹配不到上面就是404
        component: "404", 
    },
]

export default routes;