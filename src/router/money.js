export default [
    //企业财富
    {
        path: "/user/enterprise_wealth",
        component: index => require(["@/components/user/enterprise_wealth"], index),
        children: [
            {
                path: "/user/enterprise_wealth/enterprise_details",
                name: "enterprise_details",
                component: enterprise_details => require(["@/components/user/enterprise_wealth/enterprise_details/enterprise_details"], enterprise_details),
                children: [
                    {
                        path: "/user/enterprise_wealth/enterprise_details/enterprise_ticketRecord",
                        name: "enterprise_ticketRecord",
                        component: enterprise_ticketRecord => require(["@/components/user/enterprise_wealth/enterprise_details/enterprise_ticketRecord"], enterprise_ticketRecord)
                    },
                    {
                        path: "/user/enterprise_wealth/enterprise_details/enterprise_prepaidPhoneRecords",
                        name: "enterprise_prepaidPhoneRecords",
                        component: enterprise_prepaidPhoneRecords => require(["@/components/user/enterprise_wealth/enterprise_details/enterprise_prepaidPhoneRecords"], enterprise_prepaidPhoneRecords)
                    },
                    {
                        path: "/user/enterprise_wealth/enterprise_details/enterprise_incomeDetails",
                        name: "enterprise_incomeDetails",
                        component: enterprise_incomeDetails => require(["@/components/user/enterprise_wealth/enterprise_details/enterprise_incomeDetails"], enterprise_incomeDetails)
                    },
                    {
                        path: "/user/enterprise_wealth/enterprise_details/enterprise_statement",
                        name: "enterprise_statement",
                        component: enterprise_statement => require(["@/components/user/enterprise_wealth/enterprise_details/enterprise_statement"], enterprise_statement)
                    }
                ]
            },
            {
                path: "/user/enterprise_wealth/enterprise_ticket/enterprise_ticket/:sjd",
                name: "enterprise_ticket",
                component: enterprise_ticket => require(["@/components/user/enterprise_wealth/enterprise_ticket/enterprise_ticket"], enterprise_ticket)
            },
            {
                path: "/user/enterprise_wealth/enterprise_ticket/enterprise_account",
                name: "enterprise_account",
                component: enterprise_account => require(["@/components/user/enterprise_wealth/enterprise_ticket/enterprise_account"], enterprise_account)
            },
            {
                path: "/user/enterprise_wealth/enterprise_ticket/enterprise_add",
                name: "enterprise_add",
                component: enterprise_add => require(["@/components/user/enterprise_wealth/enterprise_ticket/enterprise_add"], enterprise_add)
            },
            {
                path: "/user/enterprise_wealth/enterprise_ticket/enterprise_success",
                name: "enterprise_success",
                component: enterprise_success => require(["@/components/user/enterprise_wealth/enterprise_ticket/enterprise_success"], enterprise_success)
            },
            {
                path: "/user/enterprise_wealth/enterprise_membersBuy/enterprise_membersBuy/:type",
                name: "enterprise_membersBuy",
                component: enterprise_membersBuy => require(["@/components/user/enterprise_wealth/enterprise_membersBuy/enterprise_membersBuy"], enterprise_membersBuy)
            },
            {
                path: "/user/enterprise_wealth/enterprise_membersBuy/enterprise_buyType",
                name: "enterprise_buyType",
                component: enterprise_buyType => require(["@/components/user/enterprise_wealth/enterprise_membersBuy/enterprise_buyType"], enterprise_buyType)
            },
            {
                path: "/user/enterprise_wealth/enterprise_topUp/enterprise_topUp",
                name: "enterprise_topUp",
                component: enterprise_topUp => require(["@/components/user/enterprise_wealth/enterprise_topUp/enterprise_topUp"], enterprise_topUp)
            },
            {
                path: "/user/enterprise_wealth/enterprise_BusinessModule/enterprise_BusinessModule/:guid/:name/:title/:sjd",
                name: "enterprise_BusinessModule",
                component: enterprise_BusinessModule => require(["@/components/user/enterprise_wealth/enterprise_BusinessModule/enterprise_BusinessModule"], enterprise_BusinessModule)
            },
            {
                path: "/user/enterprise_wealth/enterprise_BusinessModule/enterprise_addBModule",
                name: "enterprise_addBModule",
                component: enterprise_addBModule => require(["@/components/user/enterprise_wealth/enterprise_BusinessModule/enterprise_addBModule"], enterprise_addBModule)
            }
        ]
    },
    //个人财富
    {
        path: "/user/personal_wealth",
        component: index => require(["@/components/user/personal_wealth"], index),
        children: [
            {
                path: "/user/personal_wealth/personal_details",
                name: "personal_details",
                component: personal_details => require(["@/components/user/personal_wealth/personal_details/personal_details"], personal_details),
                children: [
                    {
                        path: "/user/personal_wealth/personal_details/personal_ticketRecord",
                        name: "personal_ticketRecord",
                        component: personal_ticketRecord => require(["@/components/user/personal_wealth/personal_details/personal_ticketRecord"], personal_ticketRecord)
                    },
                    {
                        path: "/user/personal_wealth/personal_details/personal_prepaidPhoneRecords",
                        name: "personal_prepaidPhoneRecords",
                        component: personal_prepaidPhoneRecords => require(["@/components/user/personal_wealth/personal_details/personal_prepaidPhoneRecords"], personal_prepaidPhoneRecords)
                    },
                    {
                        path: "/user/personal_wealth/personal_details/personal_integralSubsidiary",
                        name: "personal_integralSubsidiary",
                        component: personal_integralSubsidiary => require(["@/components/user/personal_wealth/personal_details/personal_integralSubsidiary"], personal_integralSubsidiary)
                    },
                    {
                        path: "/user/personal_wealth/personal_details/personal_otherConsumer",
                        name: "personal_otherConsumer",
                        component: personal_otherConsumer => require(["@/components/user/personal_wealth/personal_details/personal_otherConsumer"], personal_otherConsumer)
                    },
                    {
                        path: "/user/personal_wealth/personal_details/personal_InviteBusinessmen",
                        name: "personal_InviteBusinessmen",
                        component: personal_InviteBusinessmen => require(["@/components/user/personal_wealth/personal_details/personal_InviteBusinessmen"], personal_InviteBusinessmen)
                    },
                    {
                        path: "/user/personal_wealth/personal_details/personal_blackstone",
                        name: "personal_blackstone",
                        component: personal_blackstone => require(["@/components/user/personal_wealth/personal_details/personal_blackstone"], personal_blackstone)
                    },
                    {
                        path: "/user/personal_wealth/personal_details/personal_seeBusiness",
                        name: "personal_seeBusiness",
                        component: personal_seeBusiness => require(["@/components/user/personal_wealth/personal_details/personal_seeBusiness"], personal_seeBusiness)
                    }
                ]
            },
            {
                path: "/user/personal_wealth/personal_ticket/personal_ticket/:sjd",
                name: "personal_ticket",
                component: personal_ticket => require(["@/components/user/personal_wealth/personal_ticket/personal_ticket"], personal_ticket)
            },
            {
                path: "/user/personal_wealth/personal_ticket/personal_account",
                name: "personal_account",
                component: personal_account => require(["@/components/user/personal_wealth/personal_ticket/personal_account"], personal_account)
            },
            {
                path: "/user/personal_wealth/personal_ticket/personal_add",
                name: "personal_add",
                component: personal_add => require(["@/components/user/personal_wealth/personal_ticket/personal_add"], personal_add)
            },
            {
                path: "/user/personal_wealth/personal_ticket/personal_success",
                name: "personal_success",
                component: personal_success => require(["@/components/user/personal_wealth/personal_ticket/personal_success"], personal_success)
            },
            {
                path: "/user/personal_wealth/personal_membersBuy/personal_membersBuy/:type",
                name: "personal_membersBuy",
                component: personal_membersBuy => require(["@/components/user/personal_wealth/personal_membersBuy/personal_membersBuy"], personal_membersBuy)
            },
            {
                path: "/user/personal_wealth/personal_membersBuy/personal_buyType",
                name: "personal_buyType",
                component: personal_buyType => require(["@/components/user/personal_wealth/personal_membersBuy/personal_buyType"], personal_buyType)
            },
            {
                path: "/user/personal_wealth/personal_topUp/personal_topUp",
                name: "personal_topUp",
                component: personal_topUp => require(["@/components/user/personal_wealth/personal_topUp/personal_topUp"], personal_topUp)
            },
            {
                path: "/user/personal_wealth/personal_BusinessModule/personal_BusinessModule/:guid/:name/:title/:sjd",
                name: "personal_BusinessModule",
                component: personal_BusinessModule => require(["@/components/user/personal_wealth/personal_BusinessModule/personal_BusinessModule"], personal_BusinessModule)
            },
            {
                path: "/user/personal_wealth/personal_BusinessModule/personal_addBModule",
                name: "personal_addBModule",
                component: personal_addBModule => require(["@/components/user/personal_wealth/personal_BusinessModule/personal_addBModule"], personal_addBModule)
            }
        ]
    },
    //管理员
    {
        path: "/user/administrator",
        component: index => require(["@/components/user/administrator"], index),
    },

    {
        path: "/user/administrator/administrator_latestNews/administrator_latestNews",
        component: administrator_latestNews => require(["@/components/user/administrator/administrator_latestNews/administrator_latestNews"], administrator_latestNews),
        children: [
            {
                path: "/user/administrator/administrator_latestNews/administrator_all",
                component: administrator_all => require(["@/components/user/administrator/administrator_latestNews/administrator_all"], administrator_all)
            },
            {
                path: "/user/administrator/administrator_latestNews/administrator_system",
                component: administrator_system => require(["@/components/user/administrator/administrator_latestNews/administrator_system"], administrator_system)
            },
            {
                path: "/user/administrator/administrator_latestNews/administrator_add",
                component: administrator_add => require(["@/components/user/administrator/administrator_latestNews/administrator_add"], administrator_add)
            },
        ]
    },
    {
        path: "/user/administrator/administrator_postMessage/administrator_postMessage",
        component: administrator_postMessage => require(["@/components/user/administrator/administrator_postMessage/administrator_postMessage"], administrator_postMessage),
    },
    {
        path: "/user/administrator/administrator_departmentOfChoice/administrator_departmentOfChoice",
        component: administrator_departmentOfChoice => require(["@/components/user/administrator/administrator_departmentOfChoice/administrator_departmentOfChoice"], administrator_departmentOfChoice),
    },
    {
        path: "/user/administrator/administrator_postMessage/administrator_add/:name/:guid",
        component: administrator_add => require(["@/components/user/administrator/administrator_postMessage/administrator_add"], administrator_add),
    },
    {
        path: "/user/administrator/administrator_accountManagement/administrator_accountManagement",
        component: administrator_accountManagement => require(["@/components/user/administrator/administrator_accountManagement/administrator_accountManagement"], administrator_accountManagement),
    },
    {
        path: "/user/administrator/administrator_accountManagement/administrator_password",
        component: administrator_password => require(["@/components/user/administrator/administrator_accountManagement/administrator_password"], administrator_password),
    },
    {
        path: "/user/administrator/administrator_departmentInformation/administrator_departmentInformation",
        component: administrator_departmentInformation => require(["@/components/user/administrator/administrator_departmentInformation/administrator_departmentInformation"], administrator_departmentInformation),
    },
    {
        path: "/user/administrator/administrator_departmentInformation/administrator_departmentChange",
        name: "administrator_departmentChange",
        component: administrator_departmentChange => require(["@/components/user/administrator/administrator_departmentInformation/administrator_departmentChange"], administrator_departmentChange),
    },
    {
        path: "/user/administrator/administrator_about/administrator_about",
        component: administrator_about => require(["@/components/user/administrator/administrator_about/administrator_about"], administrator_about),
    },
    //百事通
    {
        path: "/user/blackstone",
        component: index => require(["@/components/user/blackstone"], index),
        children: [
            //百事通
            {
                path: "/user/blackstone/blackstone_my",
                name: "blackstone_my",
                component: blackstone_my => require(["@/components/user/blackstone/blackstone_my/blackstone_my"], blackstone_my)
            },
            {
                //百事通详情
                path: "/user/blackstone/blackstone/blackstone_view/:hid/:road",
                name: "blackstone_view",
                component: blackstone_view => require(
                    ["@/components/user/blackstone/blackstone_my/blackstone_view"], blackstone_view)
            },
            //举报
            {
                path: "/user/blackstone/blackstone_my/blackstone_report/:hid/:text",
                name: "blackstone_report",
                component: blackstone_report => require(
                    ["@/components/user/blackstone/blackstone_my/blackstone_report"], blackstone_report)
            },
            {
                //我的财富
                path: "/user/blackstone/blackstone_wealth",
                component: blackstone_wealth => require(
                    ["@/components/user/blackstone/blackstone_wealth/blackstone_wealth"], blackstone_wealth),
                children: [
                    {
                        path: "/user/blackstone/blackstone_wealth/wealth_download",
                        component: wealth_download => require(["@/components/user/blackstone/blackstone_wealth/wealth_download"], wealth_download)
                    },
                    {
                        path: "/user/blackstone/blackstone_wealth/wealth_upload",
                        component: wealth_upload => require(["@/components/user/blackstone/blackstone_wealth/wealth_upload"], wealth_upload)
                    },
                    {
                        path: "/user/blackstone/blackstone_wealth/wealth_punish",
                        component: wealth_punish => require(["@/components/user/blackstone/blackstone_wealth/wealth_punish"], wealth_punish)
                    }
                ]
            },
            //我的文库
            {
                path: "/user/blackstone/my_library",
                component: my_library => require(
                    ["@/components/user/blackstone/my_library/my_library"], my_library),
                children: [
                    {
                        path: "/user/blackstone/my_library/library_collection",
                        component: library_collection => require(["@/components/user/blackstone/my_library/library_collection"], library_collection)
                    },
                    {
                        path: "/user/blackstone/my_library/library_download",
                        component: library_download => require(["@/components/user/blackstone/my_library/library_download"], library_download)
                    },
                    {
                        path: "/user/blackstone/my_library/library_upload",
                        component: library_upload => require(["@/components/user/blackstone/my_library/library_upload"], library_upload)
                    }
                ]
            },
            {
                //我的文库上传
                path: "/user/blackstone/my_library/library_uploadLibrary",
                name: "library_uploadLibrary",
                component: library_uploadLibrary => require(
                    ["@/components/user/blackstone/my_library/library_uploadLibrary"], library_uploadLibrary)
            },
            {
                //我的文库上传
                path: "/user/blackstone/my_library/library_editor/:hid",
                name: "library_editor",
                component: library_editor => require(
                    ["@/components/user/blackstone/my_library/library_editor"], library_editor)
            }
        ]
    }
]