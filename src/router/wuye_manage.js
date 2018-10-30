export default [
    // 商家管理员
    {
        path: "/mechant/administrator",
        component: index => require(["@/components/user/administrator/mechant_admin"], index),
    },
    {
        path: "/business/member",
        component: index => require(["@/components/user/administrator/member"], index),

    },
    {
        path: "/wuye/manage",
        component: wuye => require(['@/components/user/wuye/index'], wuye),
    }, {
        path: "/wuye/month",
        component: wuye => require(['@/components/user/wuye/month'], wuye),
    }, {

        path: "/wuye/month/detail/:id",
        component: wuye => require(['@/components/user/manager/monrep_del'], wuye),
    }, {
        path: "/wuye/search",
        component: wuye => require(['@/components/user/wuye/highsearch'], wuye),
    }, {
        path: "/wuye/exitSearch",
        component: wuye => require(['@/components/user/wuye/highsearch/exitSearch'], wuye),
    }, 
    {
        path: "/wuye/exitAssistant",
        component: wuye => require(['@/components/user/wuye/highsearch/exitAssistant'], wuye),
    },{

        path: "/wuye/month/detail/:id",
        component: wuye => require(['@/components/user/manager/monrep_del'], wuye),
    },
    {
        path: "/wuye/search/detail",
        component: wuye => require(['@/components/user/wuye/highsearch/detail'], wuye),
    }, {
        path: "/wuye/message",
        component: wuye => require(['@/components/user/wuye/message'], wuye),
    },
    {
        path: "/wuye/message/detail",
        component: wuye => require(['@/components/user/wuye/message/detail'], wuye),
    }, {
        path: "/wuye/message/add",
        component: wuye => require(['@/components/user/wuye/message/add'], wuye),
    }, {
        path: "/wuye/projectManager",
        component: wuye => require(['@/components/user/wuye/projectManager'], wuye),
    }, {
        path: "/wuye/allManagement",
        component: wuye => require(['@/components/user/wuye/allManagement'], wuye),
    },
    // 外勤服务
    {
        path: "/mechant/serviceList/waiqing",
        component: output => require(['@/components/user/service/estate/waiqing/index'], output)
    }, {
        path: "/mechant/setIndustury",
        component: output => require(['@/components/user/service/estate/waiqing/setIndustury'], output)
    },
    {
        path: "/mechant/serviceList/waiqing/add",
        component: output => require(['@/components/user/service/estate/waiqing/csadd'], output)
    },

    {
        path: "/mechant/serviceList/waiqing/detail",
        component: output => require(['@/components/user/service/estate/waiqing/order_details'], output)
    },
    {
        path: "/mechant/serviceList/waiqing/setting",
        component: output => require(['@/components/user/service/estate/waiqing/setting'], output)
    },
    // 特约写字楼
    {
        path: "/mechant/serviceList/building",
        component: output => require(['@/components/user/service/estate/building/index'], output)
    }, {
        path: "/mechant/serviceList/building/operate",
        component: output => require(['@/components/user/service/estate/building/operate'], output)
    },
    {
        path: "/mechant/serviceList/building/detail",
        component: output => require(['@/components/user/service/estate/building/detail'], output)
    },
    // {
    //     path: "/entprise/deparment",
    //     component: deparment => require(['@/components/ent/enterprise/ent_sec/personManger/index'], deparment)
    // }
]
