export default [
    // 外勤服务
    {
        path: "/entprise/serviceList/waiqing",
        meta:{
            keepAlive:true
        },
        component: output => require(['@/components/manage/wuye_service/serviceList/waiqing/index'], output)
    }, {
        path: "/setIndustury",
        component: output => require(['@/components/manage/wuye_service/serviceList/waiqing/setIndustury'], output)
    },
    {
        path: "/entprise/serviceList/waiqing/add",
        component: output => require(['@/components/manage/wuye_service/serviceList/waiqing/csadd'], output)
    },

    {
        path: "/entprise/serviceList/waiqing/detail",
        component: output => require(['@/components/manage/wuye_service/serviceList/waiqing/order_details'], output)
    },
    {
        path: "/entprise/serviceList/waiqing/setting",
        component: output => require(['@/components/manage/wuye_service/serviceList/waiqing/setting'], output)
    },
    // 特约写字楼
    {
        path: "/entprise/serviceList/building",
        component: output => require(['@/components/manage/wuye_service/serviceList/building/index'], output)
    }, {
        path: "/entprise/serviceList/building/operate",
        component: output => require(['@/components/manage/wuye_service/serviceList/building/operate'], output)
    },
    {
        path: "/entprise/serviceList/building/detail",
        component: output => require(['@/components/manage/wuye_service/serviceList/building/detail'], output)
    },
    // 部门人员
    {
        path: "/entprise/deparment",
        component: deparment => require(['@/components/ent/enterprise/ent_sec/personManger/index'], deparment)
    }, {
        path: "/entprise/workstation",
        component: deparment => require(['@/components/ent/work'], deparment)
    },
    {
        path: "/entprise/mechant_library",
        component: deparment => require(['@/components/ent/shangji'], deparment)
    },
    // 我的助手
    {
        path: "/myassistant",
        component: outPut =>
            require([
                "@/components/ent/enterprise/ent_sec/myassistant/index"
            ], outPut)
    },
    // 任务进度
    {
        path: "/taskProcess",
        component: outPut =>
            require([
                "@/components/ent/enterprise/ent_sec/taskProcess/index"
            ], outPut)
    },
    {
        path: "/taskProcess/add",
        component: outPut =>
            require([
                "@/components/ent/enterprise/ent_sec/taskProcess/add"

            ], outPut)
    }, {
        path: "/taskProcess/detail/:id",
        component: outPut =>
            require([
                "@/components/ent/enterprise/ent_sec/taskProcess/detail"
            ], outPut)
    }, {
        path: "/taskProcess/tongzhi",
        component: outPut =>
            require([
                "@/components/ent/enterprise/ent_sec/taskProcess/tongzhi"
            ], outPut)
    }, {
        path: "/taskProcess/update/:id",
        component: outPut =>
            require([
                "@/components/ent/enterprise/ent_sec/taskProcess/updateProgress"
            ], outPut)
    }, {
        path: "/taskProcess/updateDetail/:id",
        component: outPut =>
            require([
                "@/components/ent/enterprise/ent_sec/taskProcess/updateDetail"
            ], outPut)
    },
    //汇报进度
    {
        path: "/taskreplay",
        meta: {
            keepAlive:true
        },
        component: outPut =>
            require([
                "@/components/ent/enterprise/ent_sec/taskreplay/index"
            ], outPut)
    }, {
        path: "/taskreplay/add",
        component: outPut =>
            require([
                "@/components/ent/enterprise/ent_sec/taskreplay/add"

            ], outPut)
    }, {
        path: "/taskreplay/detail/:id",
        component: outPut =>
            require([
                "@/components/ent/enterprise/ent_sec/taskreplay/detail"
            ], outPut)
    }, {
        path: "/myassistant",
        component: outPut =>
            require([
                "@/components/ent/enterprise/ent_sec/myassistant/index"
            ], outPut)
    },
    // 供求管理
    {
        path: "/supplyManager",
        component: outPut =>
            require([
                "@/components/ent/enterprise/ent_sec/supplyManager/index"
            ], outPut)
    }, {
        path: "/supplyManager/add",
        component: outPut =>
            require([
                "@/components/ent/enterprise/ent_sec/supplyManager/add"
            ], outPut)
    }, {
        path: "/supplyManager/detail",
        component: outPut =>
            require([
                "@/components/ent/enterprise/ent_sec/supplyManager/detail"
            ], outPut)
    }, 
]