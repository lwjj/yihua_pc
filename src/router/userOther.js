export default [
    //房屋管理
    {
        path: "/user/building_management/index",
        name:"building_management",
        component: index => require(["@/components/user/building_management/index"], index),
    },
    {
        path: "/user/building_management/building_show",
        name:"building_show",
        component: building_show => require(["@/components/user/building_management/building_show"], building_show),
    },
    {
        path: "/user/building_management/building_maintenance",
        name:"building_maintenance",
        component: building_maintenance => require(["@/components/user/building_management/building_maintenance"], building_maintenance),
    },
    //我的卡卷  
    {
        path: "/user/cardVolume",
        name:"cardVolume",
        component: index => require(["@/components/user/cardVolume"], index),
        children:[
            {
                path: "/user/cardVolume/cardVolume_myCoupons",
                name:"cardVolume_myCoupons",
                component: cardVolume_myCoupons => require(["@/components/user/cardVolume/cardVolume_myCoupons"], cardVolume_myCoupons),    
            },
            {
                path: "/user/cardVolume/cardVolume_myMembers",
                name:"cardVolume_myMembers",
                component: cardVolume_myMembers => require(["@/components/user/cardVolume/cardVolume_myMembers"], cardVolume_myMembers),    
            },
            {
                path: "/user/cardVolume/cardVolume_myCard",
                name:"cardVolume_myCard",
                component: cardVolume_myCard => require(["@/components/user/cardVolume/cardVolume_myCard"], cardVolume_myCard),    
            }
        ]
    }, 
    //财务管理
    {
        path: "/user/money_management",
        name:"money_management",
        component: index => require(["@/components/user/money_management"], index)
    },
    {
        path: "/user/money_management/money_managementDetails/:orId", 
        component: money_managementDetails => require(["@/components/user/money_management/money_managementDetails"], money_managementDetails)    
    },
    {
        path: "/user/money_management/money_reply/:num/:guid", 
        component: money_reply => require(["@/components/user/money_management/money_reply"], money_reply)
    },
    //关系管理
    {
        path: "/user/relationship_between",
        name:"relationship_between",
        component: index => require(["@/components/user/relationship_between"], index)
    },
    //设置
    {
        path: "/user/setUp",
        name:"setUp",
        component: index => require(["@/components/user/setUp"], index),
        children:[
            {
                path: "/user/setUp/myself",
                name:"myself",
                component: myself => require(["@/components/user/setUp/myself"], myself),
            },
            {
                path: "/user/setUp/myFootprint",
                name:"myFootprint",
                component: myFootprint => require(["@/components/user/setUp/myFootprint"], myFootprint),
            },
            {
                path: "/user/setUp/myInvitation",
                name:"myInvitation",
                component: myInvitation => require(["@/components/user/setUp/myInvitation"], myInvitation),
            },
            {
                path: "/user/setUp/myAbout",
                name:"myAbout",
                component: myAbout => require(["@/components/user/setUp/myAbout"], myAbout),
            },
            {
                path: "/user/setUp/myPassword",
                name:"myPassword",
                component: myPassword => require(["@/components/user/setUp/myPassword"], myPassword),
            },
            {
                path: "/user/setUp/assistant",
                name:"assistant",
                component: assistant => require(["@/components/user/setUp/assistant"], assistant),
            },
            {
                path: "/user/setUp/backInstitutions",
                name:"backInstitutions",
                component: backInstitutions => require(["@/components/user/setUp/backInstitutions"], backInstitutions),
            }   
        ]
    },
]