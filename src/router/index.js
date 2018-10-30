import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
import mRouter from './index_manager.js'
import cRouter from './index_circle.js'
import money from './money.js'
import ent from './enterprise'
import message from './message.js'
import userOther from './userOther.js'
import wuye_manager from './wuye_manage'

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/account/login",
      hidden: true
    },
    // 注册登录
    {
      path: "/account",
      name: "账号",
      hidden: true,
      component: account => require(["@/components/login/account"], account),
      children: [{
        path: "/account/login",
        component: login => require(["@/components/login/login"], login)
      },
      {
        path: "/account/rent",
        component: login => require(["@/components/login/rent"], login)
      }, {
        path: "/account/company",
        component: company => require(["@/components/login/company"], company)
      }, {
        path: "/account/manage",
        component: manage => require(["@/components/login/manage"], manage)
      }, {
        path: "/account/business",
        component: business => require(["@/components/login/business"], business)
      }, {
        path: "/account/personal",
        component: personal => require(["@/components/login/personal"], personal)
      }, {
        path: "/account/choose_register",
        component: login => require(["@/components/login/choose_register"], login)
      },
      {
        path: "/account/forget",
        component: forget => require(["@/components/login/forget"], forget)
      }
      ]
    },
    {
      path: '/otherLogin',
      component: otherLogin => require(['@/components/login/otherLogin'], otherLogin)
    },

    // 主页
    {
      path: "/index",
      name: "主页",
      hidden: true,
      component: index => require(["@/components/index"], index),
      children: [{
        path: "/qixing",
        component: index => require(["@/components/qixing"], index)
      }, {
        path: "/bazhua",
        component: index => require(["@/components/bazhua"], index),
        children: [...cRouter]
      },
      // 任务单
      {
        path: "/task",
        name: '任务单',
        hidden: true,
        component: index => require(["@/components/task"], index),
        children: [{
          path: "/task/new_progress",
          component: index => require(["@/components/task/new_progress"], index),
          meta: {
            keepAlive: true,
          }
        },
        {
          path: "/task/taskStatics",
          component: index => require(["@/components/task/taskStatics"], index)
        }, {
          path: "/task/new_progress/task_del/:id",
          component: task_del => require(["@/components/task/common/task_del"], task_del)
        },
        {
          path: "/task/received",
          component: index => require(["@/components/task/received"], index),
          meta: {
            keepAlive: true
          }
        }, {
          path: "/task/received/task_del/:id/:type",
          component: task_del => require(["@/components/task/common/task_del"], task_del)
        },
        {
          path: "/task/received/task_del/:id/0",
          component: task_del => require(["@/components/task/common/task_del"], task_del),
          meta: {
            keepAlive: true,
          }
        },

        {
          path: "/task/allocate",
          component: index => require(["@/components/task/allocate"], index),
          meta: {
            keepAlive: true,
          }
        }, {
          path: "/task/allocate/task_del/:id/:type",
          component: task_del => require(["@/components/task/common/task_del"], task_del)
        }, {
          path: "/task/allocate/build_task/:id",
          component: build_task => require(["@/components/task/allocate/build_task"], build_task)
        }, {
          path: "/task/allocate/task_progress/:id",
          component: task_progress => require(["@/components/task/allocate/task_progress"], task_progress)
        }, {
          path: "/task/allocate/progress_del/:id",
          component: progress_del => require(["@/components/task/allocate/progress_del"], progress_del)
        },

        {
          path: "/task/year_sched",
          component: index => require(["@/components/task/year_sched"], index),
          meta: {
            keepAlive: true
          }
        }, {
          path: "/task/year_sched/buildyear/:yearValue/:deptId",
          component: buildyear => require(["@/components/task/year_sched/buildyear"], buildyear)
        },


        {
          path: "/task/summary",
          component: index => require(["@/components/task/summary"], index),
          meta: {
            keepAlive: true
          }
        },
        {
          path: "/task/summary/summary_detail",
          component: summary_detail => require(["@/components/task/summary/summary_detail"], summary_detail)
        }, {
          path: "/task/next_month",
          component: index => require(["@/components/task/next_month"], index),
          meta: {
            keepAlive: true
          }
        }, {
          path: "/task/kanban",
          component: index => require(["@/components/task/kanban"], index)
        }, {
          path: "/task/current_work",
          component: index => require(["@/components/task/current_work"], index),
          meta: {
            keepAlive: true
          }
        }
        ]

      },
      // 物业管理
      {
        path: "/manage",
        name: "物业管理",
        hidden: true,
        component: index => require(["@/components/manage"], index),
        children: [
          // 采购
          {
            path: "/manage/purchase",
            component: index => require(["@/components/manage/purchase"], index)
          }, {
            path: "/manage/purchase/pur_del/:id",
            component: pur_del => require(["@/components/manage/purchase/pur_del"], pur_del)
          }, {
            path: "/manage/purchase/build_pur",
            component: build_pur => require(["@/components/manage/purchase/build_pur"], build_pur)
          },
          // 值班表
          {
            path: "/manage/watch_bill",
            component: index => require(["@/components/manage/watch_bill"], index)
          },
          {
            path: "/manage/watch_bill/edit_bill/:type",
            component: edit_bill => require(["@/components/manage/watch_bill/edit_bill"], edit_bill)
          },
          // 突发事件
          {
            path: "/manage/emergency",
            component: index => require(["@/components/manage/emergency"], index)
          }, {
            path: "/manage/emergency/emer_del/:id",
            component: emer_del => require(["@/components/manage/emergency/emer_del"], emer_del)
          }, {
            path: "/manage/emergency/build_emer",
            component: build_emer => require(["@/components/manage/emergency/build_emer"], build_emer)
          },
          // 通知
          {
            path: "/manage/inform",
            component: index => require(["@/components/manage/inform"], index),
            meta: {
            keepAlive: true
          }
          }, {
            path: "/manage/inform/inform_del/:id",
            name:'inform_del',
            component: inform_del => require(["@/components/manage/inform/inform_del"], inform_del)
          }, {
            path: "/manage/inform/build_inform",
            component: build_inform => require(["@/components/manage/inform/build_inform"], build_inform)
          },
          // 管理处月报
          ...mRouter,
          {
            path: "/manage/manage_report",
            component: index => require(["@/components/manage/manage_report"], index)
          },

          {
            path: "/manage/manage_report/build_monreport/:id",
            component: build_monreport => require(["@/components/manage/manage_report/build_monreport"], build_monreport)
          },
          {
            path: "/manage/manage_report/monrep_del/:id",
            component: monrep_del => require(["@/components/manage/manage_report/monrep_del"], monrep_del)
          },
          //通讯录
          {
            path: "/manage/address_book/address_book",
            component: address_book => require(["@/components/manage/address_book/address_book"], address_book)
          },
          //房屋信息
          {
            path: "/manage/manage_building/building_unit",
            component: building_unit => require(["@/components/manage/manage_building/building_unit"], building_unit)
          },
          {
            path: "/manage/manage_building/building_del/:id",
            component: building_del => require(["@/components/manage/manage_building/building_del"], building_del)
          },
          {
            path: "/manage/manage_building/building_msg",
            component: building_msg => require(["@/components/manage/manage_building/building_msg"], building_msg)
          },
          //管理处调度
          {
            path: "/manage/scheduling/scheduling_show",
            component: scheduling_show => require(["@/components/manage/scheduling/scheduling_show"], scheduling_show)
          },
          {
            path: "/manage/scheduling/scheduling_editor",
            component: scheduling_editor => require(["@/components/manage/scheduling/scheduling_editor"], scheduling_editor)
          },
          //会议纪要
          {
            path: "/manage/meeting",
            component: index => require(["@/components/manage/meeting"], index)
          }, {
            path: "/manage/meeting/build_meet",
            component: build_meet => require(["@/components/manage/meeting/build_meet"], build_meet)
          }, {
            path: "/manage/meeting/meet_del/:id",
            component: meet_del => require(["@/components/manage/meeting/meet_del"], meet_del)
          }, {
            path: "/manage/meeting/track_bill/:id",
            component: track_bill => require(["@/components/manage/meeting/track_bill"], track_bill)
          },

          {
            path: "/manage/mission",
            component: index => require(["@/components/manage/mission"], index)
          },
          // 其他汇报
          {
            path: "/manage/other_report",
            component: index => require(["@/components/manage/other_report"], index)
          }, {
            path: "/manage/other_report/build_other",
            component: build_other => require(["@/components/manage/other_report/build_other"], build_other)
          }, {
            path: "/manage/other_report/report_del/:id",
            component: report_del => require(["@/components/manage/other_report/report_del"], report_del)
          },
          // 品质稽查
          {
            path: "/manage/quality",
            component: index => require(["@/components/manage/quality"], index)
          }, {
            path: "/manage/quality/quality_del/:id",
            component: quality_del => require(["@/components/manage/quality/quality_del"], quality_del)
          }, {
            path: "/manage/quality/track_bill/:id",
            component: track_bill => require(["@/components/manage/quality/track_bill"], track_bill)
          }, {
            path: "/manage/quality/build_quality",
            component: build_quality => require(["@/components/manage/quality/build_quality"], build_quality)
          },
          // 工作列报
          {
            path: "/manage/work_report",
            component: index => require(["@/components/manage/work_report"], index)
          }, {
            path: "/manage/work_report/build_day/:id",
            component: build_day => require(["@/components/manage/work_report/build_day"], build_day)
          }, {
            path: "/manage/work_report/build_week/:id",
            component: build_week => require(["@/components/manage/work_report/build_week"], build_week)
          }, {
            path: "/manage/work_report/build_month/:id",
            component: build_month => require(["@/components/manage/work_report/build_month"], build_month)
          }, {
            path: "/manage/work_report/build_year/:id",
            component: build_month => require(["@/components/manage/work_report/build_year"], build_month)
          }, {
            path: "/manage/work_report/report_del/:id",
            component: report_del => require(["@/components/manage/work_report/report_del"], report_del)
          },
          // 物业往来
          {
            path: "/manage/wuye_contact",
            component: index => require(["@/components/manage/wuye_contact"], index),
            // 子路由
            children: [
              {
                path: "/manage/wuye_contact/rela_manage/rela_manage",
                component: rela_manage => require(["@/components/manage/wuye_contact/rela_manage/rela_manage"], rela_manage)
              },
              {
                path: "/manage/wuye_contact/wuye_inform/wuye_inform",
                component: wuye_inform => require(["@/components/manage/wuye_contact/wuye_inform/wuye_inform"], wuye_inform)
              },
              {
                path: "/manage/wuye_contact/wuye_audit/wuye_audit",
                component: wuye_audit => require(["@/components/manage/wuye_contact/wuye_audit/wuye_audit"], wuye_audit)
              },
              {
                path: "/manage/wuye_contact/project_rep/project_rep",
                component: project_rep => require(["@/components/manage/wuye_contact/project_rep/project_rep"], project_rep)
              },
            ]
          },
          {
            path: "/manage/wuye_contact/rela_manage/rela_del/:id",
            component: rela_del => require(["@/components/manage/wuye_contact/rela_manage/rela_del"], rela_del)
          },
          {
            path: "/manage/wuye_contact/rela_manage/build_rela",
            component: build_rela => require(["@/components/manage/wuye_contact/rela_manage/build_rela"], build_rela)
          },
          {
            path: "/manage/wuye_contact/wuye_inform/inform_del/:id",
            component: inform_del => require(["@/components/manage/wuye_contact/wuye_inform/inform_del"], inform_del)
          },
          {
            path: "/manage/wuye_contact/wuye_audit/audit_del/:id",
            component: audit_del => require(["@/components/manage/wuye_contact/wuye_audit/audit_del"], audit_del)
          },


          // 租户审核
          {
            path: "/manage/tenant_audit",
            component: index => require(["@/components/manage/tenant_audit"], index)
          },
          {
            path: "/manage/tenant_audit/build_audit",
            component: build_audit => require(["@/components/manage/tenant_audit/build_audit"], build_audit)
          },
          {
            path: "/manage/tenant_audit/audit_del/:id",
            component: audit_del => require(["@/components/manage/tenant_audit/audit_del"], audit_del)
          },

          {
            path: "/manage/wuye_manage",
            component: index => require(["@/components/manage/wuye_manage"], index)
          },
          // 物业服务
          {
            path: "/manage/wuye_service",
            component: index => require(["@/components/manage/wuye_service"], index)
          },

          // 业委会往来
          {
            path: "/manage/yewei_contact",
            component: index => require(["@/components/manage/yewei_contact"], index)
          },
          {
            path: "/manage/yewei_contact/finance_del/:id",
            component: finance_del => require(["@/components/manage/yewei_contact/finance_del"], finance_del)
          },
          {
            path: "/manage/yewei_contact/finance_delivery",
            component: finance_delivery => require(["@/components/manage/yewei_contact/finance_delivery"], finance_delivery)
          },
          {
            path: "/manage/yewei_contact/yewei_set",
            component: yewei_set => require(["@/components/manage/yewei_contact/yewei_set"], yewei_set)
          },
          {
            path: "/manage/yewei_contact/yewei_del",
            component: yewei_del => require(["@/components/manage/yewei_contact/yewei_del"], yewei_del)
          },
        ]
      },
      // 物业服务单
      // 企业服务
      {
        path: '/entprise',
        component: entprise => require(['@/components/ent/Index.vue'], entprise),
        children: [...ent],
      },

      ...message,      // 个人中心
      {
        path: "/user",
        name: "个人中心",
        hidden: true,
        component: index => require(["@/components/user"], index),
        children: [
          //管理处助手  
          {
            path: "/user/myAssistant",
            component: index => require(["@/components/user/myAssistant/index"], index),
          },
          {
            path: "/user/local_service",
            component: post_del => require(["@/components/user/localService/index"], post_del),
          },
          {
            path: "/user/property_inspection",
            component: post_del => require(["@/components/user/wuye/property"], post_del),
          },
          {
            path: "/user/audit_report",
            component: post_del => require(["@/components/user/wuye/audit_report"], post_del),
          },
          {
            path: "/user/inspection_details",
            component: post_del => require(["@/components/user/wuye/inspection_details"], post_del),
          },
          {
            path: "/user/local_service/tipDetail",
            component: post_del => require(["@/components/user/localService/tipDetail"], post_del)
          },
          {
            path: "/user/local_service/gjDetail",
            component: post_del => require(["@/components/user/localService/gjDetail"], post_del)
          },
          {
            path: "/user/local_service/proService",
            component: post_del => require(["@/components/user/localService/proService"], post_del)
          },
          {
            path: "/user/local_service/bussnessCard",
            component: post_del => require(["@/components/user/localService/bussnessCard"], post_del)
          },
          {
            path: "/user/local_service/myShop",
            component: post_del => require(["@/components/user/localService/myShop"], post_del)
          },
          {
            path: "/user/local_service/shopDetail",
            component: post_del => require(["@/components/user/localService/shopDetail"], post_del)
          },
          {
            path: "/user/local_service/userInfo",
            component: post_del => require(["@/components/user/localService/userInfo"], post_del)
          },
          // 物业公司物业管理
          ...wuye_manager,
          //本楼业务
          {
            path: "/user/we_business",
            component: index => require(["@/components/user/we_business"], index)
          },
          // 楼宇单元
          {
            path: "/user/we_business/building_unit/building_unit",
            component: building_unit => require(["@/components/user/we_business/building_unit/building_unit"], building_unit)
          },
          {
            path: "/user/we_business/building_unit/unit_del/:id",
            component: unit_del => require(["@/components/user/we_business/building_unit/unit_del"], unit_del)
          },
          {
            path: "/user/we_business/building_unit/unit_msg",
            component: unit_msg => require(["@/components/user/we_business/building_unit/unit_msg"], unit_msg)
          },
          // 物业收益
          {
            path: "/user/we_business/wuye_income/income",
            component: income => require(["@/components/user/we_business/wuye_income/income"], income)
          },
          // 商家管理
          {
            path: "/user/we_business/business_manage",
            component: index => require(["@/components/user/we_business/business_manage"], index)
          },
          {
            path: "/user/we_business/business_manage/business_card/:id",
            component: business_card => require(["@/components/user/we_business/business_manage/business_card"], business_card)
          },
          // 客户管理
          {
            path: "/user/we_business/customer_manage",
            component: index => require(["@/components/user/we_business/customer_manage"], index)
          },
          // 租户采购
          {
            name: "tenant",
            path: "/user/we_business/tenant",
            component: index => require(["@/components/user/tenant/index"], index)
          },
          {
            path: "/user/we_business/tenant/mechant_detail",
            component: detail => require(["@/components/user/tenant/mechant_detail"], detail)
          },
          {
            path: "/user/we_business/tenant/detail",
            component: detail => require(["@/components/user/tenant/detail"], detail)
          },
          {
            path: "/user/we_business/inviteAdd",
            component: index => require(["@/components/user/inviteAdd/index"], index)
          },
          // 本楼采购
          {
            path: "/user/we_business/we_purchase",
            component: index => require(["@/components/user/we_business/we_purchase"], index)
          },
          {
            path: "/user/we_business/we_purchase/post_del/:id",
            component: post_del => require(["@/components/user/we_business/we_purchase/post_del"], post_del)
          },
          {
            path: "/user/we_business/we_purchase/purchase_del/:id/:type",
            component: purchase_del => require(["@/components/user/we_business/we_purchase/purchase_del"], purchase_del)
          },
          // 楼圈管理
          {
            path: "/user/we_business/building_manage",
            component: index => require(["@/components/user/we_business/building_manage"], index)
          },
          {
            path: "/user/we_business/building_manage/post_del/:id",
            component: post_del => require(["@/components/user/we_business/building_manage/post_del"], post_del)
          },
          {
            path: "/user/we_business/local_service",
            component: post_del => require(["@/components/user/localService/index"], post_del)
          },
          {
            path: "/user/we_business/local_service/tipDetail",
            component: post_del => require(["@/components/user/localService/tipDetail"], post_del)
          },
          {
            path: "/user/we_business/local_service/gjDetail",
            component: post_del => require(["@/components/user/localService/gjDetail"], post_del)
          },
          {
            path: "/user/we_business/local_service/proService",
            component: post_del => require(["@/components/user/localService/proService"], post_del)
          },
          {
            path: "/user/we_business/local_service/bussnessCard",
            component: post_del => require(["@/components/user/localService/bussnessCard"], post_del)
          },
          {
            path: "/user/we_business/local_service/myShop",
            component: post_del => require(["@/components/user/localService/myShop"], post_del)
          },
          {
            path: "/user/we_business/local_service/shopDetail",
            component: post_del => require(["@/components/user/localService/shopDetail"], post_del)
          },
          {
            path: "/user/we_business/local_service/userInfo",
            component: post_del => require(["@/components/user/localService/userInfo"], post_del)
          }, ...money,
          ...userOther,
          {
            path: "/user/we_business/myCircle",
            component: index => require(["@/components/user/bazhua/index"], index),
            children: [
              {
                path: "/user/we_business/bazhua/circle",
                component: mymonth => require(["@/components/user/bazhua/circle/index"], mymonth)
              },
              {
                path: "/user/we_business/bazhua/myTip",
                component: mymonth => require(["@/components/user/bazhua/myTip/index"], mymonth)
              },
              {
                path: "/user/we_business/bazhua/myAdd",
                component: mymonth => require(["@/components/user/bazhua/myAdd/index"], mymonth)
              },
              {
                path: "/user/we_business/bazhua/myComment",
                component: mymonth => require(["@/components/user/bazhua/myComment/index"], mymonth)
              },
              {
                path: "/user/we_business/bazhua/myGet",
                component: mymonth => require(["@/components/user/bazhua/myGet/index"], mymonth)
              },
              {
                path: "/user/we_business/bazhua/myFriend",
                component: mymonth => require(["@/components/user/bazhua/myFriend/index"], mymonth)
              },
              {
                path: "/user/we_business/bazhua/tipDetail",
                component: mymonth => require(["@/components/user/bazhua/tipDetail"], mymonth)
              },
              {
                path: "/user/we_business/bazhua/userInfo",
                component: mymonth => require(["@/components/user/bazhua/userInfo"], mymonth)
              },
              {
                path: "/user/we_business/bazhua/userInfo1",
                component: mymonth => require(["@/components/user/bazhua/userInfo"], mymonth)
              },
              {
                path: "/user/we_business/bazhua/addTip",
                component: mymonth => require(["@/components/user/bazhua/addTip/new_post"], mymonth)
              },
            ]
          },
          {
            path: "/user/we_business/supply/bussnessAsk",
            component: mymonth => require(["@/components/user/supply/product/bussnessAsk"], mymonth)
          },
          {
            path: "/user/we_business/supply/bussnessList",
            component: mymonth => require(["@/components/user/supply/product/bussnessAskList.vue"], mymonth),
          },
          {
            path: "/user/we_business/supply/my_details",
            component: mymonth => require(["@/components/user/supply/product/my_details"], mymonth)
          },
          {
            path: "/user/we_business/supply/yaobiao",
            component: mymonth => require(["@/components/user/supply/product/yaobiao"], mymonth)
          },
          {
            path: "/user/we_business/supply/product_collection",
            component: mymonth => require(["@/components/user/supply/product/product_collection"], mymonth)
          },
          {
            path: "/user/we_business/supply/purchase_collection",
            component: mymonth => require(["@/components/user/supply/purchase/purchase_collection"], mymonth)
          },
          {
            path: "/user/we_business/supply/push_information",
            component: mymonth => require(["@/components/user/supply/purchase/push_information"], mymonth)
          },
          {
            path: "/user/we_business/supply/push_detail",
            component: mymonth => require(["@/components/user/supply/purchase/push_detail"], mymonth)
          },
          {
            path: "/user/we_business/supply/inquiry",
            component: mymonth => require(["@/components/user/supply/product/inquiry"], mymonth)
          },
          {
            path: "/user/we_business/supply/supplier_details",
            component: mymonth => require(["@/components/user/supply/product/supplier_details"], mymonth)
          },
          {
            path: "/user/we_business/supply/supplier",
            component: mymonth => require(["@/components/user/supply/product/supplier"], mymonth)
          },
          {
            path: "/user/we_business/supply/my_business",
            meta:{
              keepAlive:true
        		},
            component: mymonth => require(["@/components/user/supply/purchase/my_business"], mymonth)
          },
          {
            path: "/user/we_business/supply/my_customer",
            component: mymonth => require(["@/components/user/supply/purchase/my_customer"], mymonth)
          },
          {
            path: "/user/we_business/supply/push_management",
            component: mymonth => require(["@/components/user/supply/purchase/push_management"], mymonth)
          },
          {
            path: "/user/we_business/supply/card_manage",
            component: mymonth => require(["@/components/user/supply/purchase/card_manage"], mymonth)
          },
          {
            path: "/user/we_business/supply/release_products",
            component: mymonth => require(["@/components/user/supply/product/release_products"], mymonth)
          },
          {
            path: "/user/we_business/supply/release_purchase",
            component: mymonth => require(["@/components/user/supply/purchase/release_purchase"], mymonth)
          },
          {
            path: "/user/we_business/supply/tender_invitation",
            component: mymonth => require(["@/components/user/supply/purchase/tender_invitation"], mymonth)
          },
          {
            path: "/user/we_business/supply/level_list",
            component: mymonth => require(["@/components/user/supply/purchase/level_list"], mymonth)
          },
          {
            path: '/supply/product/my_details1/:type/:guid',
            component: my_details1 => require(['@/components/user/supply/purchase/my_details1'], my_details1)
          },
          {
            path: "/user/supply",
            component: index => require(["@/components/user/supply/index"], index),
            children: [
              {
                path: "/user/we_business/supply/purchase",
                component: mymonth => require(["@/components/user/supply/purchase/index"], mymonth)
              },
              {
                path: "/user/we_business/supply/product",
                component: mymonth => require(["@/components/user/supply/product/index"], mymonth)
              },
              {
                path: "/user/we_business/supply/find",
                component: mymonth => require(["@/components/user/supply/find/index"], mymonth),
                meta:{
                  // keepAlive:true
                }
              },
              {
                path: "/user/we_business/supply/tipDetail",
                component: post_del => require(["@/components/user/supply/find/tipDetail"], post_del)
              },
              {
                path: "/user/we_business/supply/gjDetail",
                component: post_del => require(["@/components/user/supply/find/gjDetail"], post_del)
              },
              {
                path: "/user/we_business/supply/proService",
                component: post_del => require(["@/components/user/supply/find/proService"], post_del)
              },
              {
                path: "/user/we_business/supply/bussnessCard",
                component: post_del => require(["@/components/user/supply/find/bussnessCard"], post_del)
              },
              {
                path: "/user/we_business/supply/myShop",
                component: post_del => require(["@/components/user/supply/find/myShop"], post_del)
              },
              {
                path: "/user/we_business/supply/shopDetail",
                component: post_del => require(["@/components/user/supply/find/shopDetail"], post_del)
              },
              {
                path: "/user/we_business/supply/userInfo",
                component: post_del => require(["@/components/user/supply/find/userInfo"], post_del)
              },
            ]
          }
        ]
      }
      ]
    },
  ]
});
