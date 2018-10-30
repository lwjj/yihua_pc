export default [
    //消息中心
    {
        path: "/message",
        name: "消息中心",
        hidden: true,
        component: index => require(["@/components/message"], index),
        children: [
            {
                path: '/message/newList',
                name: "newList",
                component: newList => require(['@/components/message/newList'],newList)
            },
            {
                path: "/message/propertyMessage/:guid",
                name: "propertyMessage",
                component: propertyMessage => require(["@/components/message/propertyMessage"], propertyMessage),
            },
            {
                path: "/message/electricityMessage/:guid",
                name: "electricityMessage",
                component: electricityMessage => require(["@/components/message/electricityMessage"], electricityMessage),
            },
            {
                path: "/message/circleMessage/:guid",
                name: "circleMessage",
                component: circleMessage => require(["@/components/message/circleMessage"], circleMessage),
            },
            {
                path: "/message/platformMessage/:guid",
                name: "platformMessage",
                component: platformMessage => require(["@/components/message/platformMessage"], platformMessage),
            },
            {
                path: "/message/pushMessage/:guid",
                name: "pushMessage",
                component: pushMessage => require(["@/components/message/pushMessage"], pushMessage),
            },
            {
                path: "/message/messageMain",
                name: "messageMain",
                component: messageMain => require(["@/components/message/messageMain"], messageMain),
            },
            {
                path: "/message/setUpMessage",
                name: "setUpMessage",
                component: setUpMessage => require(["@/components/message/setUpMessage"], setUpMessage),
            },
        ]
    }
]