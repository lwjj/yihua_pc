
export default [
  // 经理建立管理处月报明细
  {
    path: "/manage/manage_report/mymonth",
    component: mymonth => require(["@/components/manage/manage_report/build_month"], mymonth)
  },
  {
    path: "/manage/manage_report/build_monreport/:id",
    component: build_monreport => require(["@/components/manage/manage_report/build_monreport"], build_monreport)
  },
  {
    path: "/manage/manage_report/monrep_del/:id",
    component: monrep_del => require(["@/components/manage/manage_report/monrep_del"], monrep_del)
  }, {
    path: "/manage/manage_report/empDetail/:id",
    component: emptyDetail => require(["@/components/manage/manage_report/emptyDetail"], emptyDetail)
  },

  // 物业服务单
  {
    path: "/estate/serviceList/rectification/add",
    component: outPut =>
      require([
        "@/components/manage/wuye_service/serviceList/rectification/add"
      ], outPut)
  },
  {
    path: "/estate/serviceList/wuye/rectification/add",
    component: outPut =>
      require([
        "@/components/manage/wuye_service/serviceList/wuye/rectification/add"
      ], outPut)
  },
  // 投诉建议
  {
    path: "/estate/serviceList/wuye/complain",
    component: complain =>
      require([
        "@/components/manage/wuye_service/serviceList/wuye/complain/index"
      ], complain)
  },
  {
    path: '/estate/serviceList/wuye/add_complain',
    component: add_complain => require(['@/components/manage/wuye_service/serviceList/wuye/complain/addComplain'], add_complain)
  }, {
    path: '/estate/serviceList/wuye/complain_detail',
    component: complain_detail => require(['@/components/manage/wuye_service/serviceList/wuye/complain/order_details'], complain_detail)
  },
  // 入驻
  {
    path: '/estate/serviceList/settled/add',
    component: settled => require(['@/components/manage/wuye_service/serviceList/settled/declares'], settled)
  },
  //  {
  //   path: '/estate/serviceList/settled',
  //   component: settled => require(['@/components/manage/wuye_service/serviceList/settled/model'], settled)
  // }, 
  {
    path: '/estate/serviceList/wuye/settled',
    component: settled => require(['@/components/manage/wuye_service/serviceList/wuye/settled/list'], settled)
  }, {
    path: '/estate/serviceList/wuye/settled/add',
    component: settled => require(['@/components/manage/wuye_service/serviceList/wuye/settled/add'], settled)
  }
  , {
    path: '/estate/serviceList/settle_detail',
    component: settle_detail => require(['@/components/manage/wuye_service/serviceList/settled/order_details'], settle_detail)
  }, {
    path: '/estate/serviceList/wuye/settle_detail',
    component: settle_detail => require(['@/components/manage/wuye_service/serviceList/wuye/settled/order_details'], settle_detail)
  },
  // 退租
  {
    path: "/estate/serviceList/wuye/exit_rent",
    component: output =>
      require([
        "@/components/manage/wuye_service/serviceList/wuye/exit_rent/index"
      ], output)
  },
  {
    path: "/estate/serviceList/wuye/exit_rent/declares",
    component: exists => require(['@/components/manage/wuye_service/serviceList/wuye/exit_rent/declares'], exists)
  },
  // 放行条
  {
    path: '/estate/serviceList/wuye/release_pass',
    component: release_pass => require(['@/components/manage/wuye_service/serviceList/wuye/release_pass/index'], release_pass)
  },
  {
    path: '/estate/serviceList/wuye/release_pass/declares',
    component: declares => require(['@/components/manage/wuye_service/serviceList/wuye/release_pass/declares'], declares)
  },
  {
    path: '/estate/serviceList/wuye/release_pass/details',
    component: details => require(['@/components/manage/wuye_service/serviceList/wuye/release_pass/details'], details)
  },
  {
    path: '/estate/serviceList/wuye/release_pass/add',
    component: add => require(['@/components/manage/wuye_service/serviceList/wuye/release_pass/add'], add)
  },
  //租赁询问
  {
    path: '/estate/serviceList/wuye/lease',
    component: lease => require(['@/components/manage/wuye_service/serviceList/wuye/lease/index'], lease)
  },
  {
    path: '/estate/serviceList/lease/add',
    component: lease => require(['@/components/manage/wuye_service/serviceList/lease/add'], lease)
  }, {
    path: '/estate/serviceList/wuye/lease/add',
    component: lease => require(['@/components/manage/wuye_service/serviceList/wuye/lease/add'], lease)
  },
  // 外勤服务
  {
    path: "/estate/serviceList/waiqing",
    component: output => require(['@/components/manage/wuye_service/serviceList/waiqing/index'], output)
  }, {
    path: "/setIndustury",
    component: output => require(['@/components/manage/wuye_service/serviceList/waiqing/setIndustury'], output)
  },
  {
    path: "/estate/serviceList/waiqing/add",
    component: output => require(['@/components/manage/wuye_service/serviceList/waiqing/csadd'], output)
  },

  {
    path: "/estate/serviceList/waiqing/detail",
    component: output => require(['@/components/manage/wuye_service/serviceList/waiqing/order_details'], output)
  },
  {
    path: "/estate/serviceList/waiqing/setting",
    component: output => require(['@/components/manage/wuye_service/serviceList/waiqing/setting'], output)
  },
  // 特约写字楼
  {
    path: "/estate/serviceList/building",
    component: output => require(['@/components/manage/wuye_service/serviceList/building/index'], output)
  }, {
    path: "/estate/serviceList/building/operate",
    component: output => require(['@/components/manage/wuye_service/serviceList/building/operate'], output)
  },
  {
    path: "/estate/serviceList/building/detail",
    component: output => require(['@/components/manage/wuye_service/serviceList/building/detail'], output)
  },
  // 入驻
  {
    path: "/estate/serviceList/setting",
    component: output => require(['@/components/manage/wuye_service/serviceList/setting/index'], output)
  }, {
    path: "/estate/serviceList/setting/add/:guid",
    component: output => require(['@/components/manage/wuye_service/serviceList/setting/add'], output)
  }, {
    path: "/estate/serviceList/setting/add",
    component: output => require(['@/components/manage/wuye_service/serviceList/setting/add'], output)
  }, {
    path: "/estate/serviceList/wuye/lease/details",
    component: output => require(['@/components/manage/wuye_service/serviceList/wuye/lease/detail'], output)
  },
  // 缴费


  {
    path: '/estate/serviceList/payment',
    component: payment => require(['@/components/manage/wuye_service/serviceList/payment/index'], payment)
  },
  {
    path: '/estate/serviceList/payment/expense/:guid',
    component: expense => require(['@/components/manage/wuye_service/serviceList/payment/expense'], expense)
  }, {
    path: '/estate/serviceList/payment/moneyset',
    component: expense => require(['@/components/manage/wuye_service/serviceList/wuye/payment/moneySet'], expense)
  }, {
    path: '/estate/serviceList/newPayment/:id',
    component: expense => require(['@/components/manage/wuye_service/serviceList/payment/add'], expense)
  },
  // 报修
  {
    path: '/estate/repair',
    component: repair => require(['@/components/manage/wuye_service/serviceList/repair/index'], repair)
  }, {
    path: '/estate/wuye/repair',
    component: repair => require(['@/components/manage/wuye_service/serviceList/wuye/repair/index'], repair)
  }
  , {
    path: '/estate/to_repair',
    component: repair => require(['@/components/manage/wuye_service/serviceList/repair/toRepair'], repair)
  }, {
    path: '/estate/wuye/to_repair',
    component: repair => require(['@/components/manage/wuye_service/serviceList/wuye/repair/toRepair'], repair)
  }
  , {
    path: '/estate/wuye/order_detail',
    component: order_submit => require(['@/components/manage/wuye_service/serviceList/wuye/repair/order_details'], order_submit)
  }
  , {
    path: '/estate/select_type',
    component: selectType => require(['@/components/manage/wuye_service/serviceList/repair/selectType'], selectType)
  }, {
    path: '/estate/wuye/select_type',
    component: selectType => require(['@/components/manage/wuye_service/serviceList/wuye/repair/selectType'], selectType)
  },
  // 整改

  {
    path: '/estate/serviceList/rectification',
    component: rectification => require(['@/components/manage/wuye_service/serviceList/rectification/index'], rectification)
  },
  {
    path: '/estate/serviceList/rectification/details',
    component: details => require(['@/components/manage/wuye_service/serviceList/rectification/details'], details)
  },

  {
    path: '/estate/serviceList/notice',
    component: notice => require(['@/components/manage/wuye_service/serviceList/notice/index'], notice)
  },
  {
    path: '/estate/serviceList/notice/details',
    component: details => require(['@/components/manage/wuye_service/serviceList/notice/details'], details)
  },

  {
    path: '/estate/serviceList/reception',
    component: reception => require(['@/components/manage/wuye_service/serviceList/reception/index'], reception)
  },
  {
    path: '/estate/serviceList/reception/declares',
    component: declares => require(['@/components/manage/wuye_service/serviceList/reception/declares'], declares)
  },
  {
    path: '/estate/serviceList/wuye/reception/details',
    component: details => require(['@/components/manage/wuye_service/serviceList/wuye/reception/details'], details)
  },

  {
    path: '/estate/serviceList/renovation',
    component: renovation => require(['@/components/manage/wuye_service/serviceList/renovation/index'], renovation)
  },
  {
    path: '/estate/serviceList/renovation/declares',
    component: declares => require(['@/components/manage/wuye_service/serviceList/renovation/declares'], declares)
  },
  {
    path: '/estate/serviceList/renovation/details',
    component: details => require(['@/components/manage/wuye_service/serviceList/renovation/details'], details)
  },
  {
    path: '/estate/serviceList/release_pass',
    component: release_pass => require(['@/components/manage/wuye_service/serviceList/release_pass/index'], release_pass)
  },
  {
    path: '/estate/serviceList/release_pass/declares',
    component: declares => require(['@/components/manage/wuye_service/serviceList/release_pass/declares'], declares)
  },
  {
    path: '/estate/serviceList/release_pass/details',
    component: details => require(['@/components/manage/wuye_service/serviceList/release_pass/details'], details)
  },
  {
    path: '/estate/serviceList/release_pass/add',
    component: add => require(['@/components/manage/wuye_service/serviceList/release_pass/add'], add)
  },
  {
    path: '/estate/serviceList/lease',
    component: lease => require(['@/components/manage/wuye_service/serviceList/lease/index'], lease)
  },
  {
    path: '/estate/serviceList/exit_rent',
    component: exit_rent => require(['@/components/manage/wuye_service/serviceList/exit_rent/index'], exit_rent)
  },
  {
    path: '/estate/serviceList/exit_rent/declares',
    component: declares => require(['@/components/manage/wuye_service/serviceList/exit_rent/declares'], declares)
  },
  {
    path: '/estate/serviceList/exit_rent/details',
    component: details => require(['@/components/manage/wuye_service/serviceList/exit_rent/details'], details)
  },
  // 管理处部分
  {
    path: '/estate/serviceList/wuye/payment',
    component: payment => require(['@/components/manage/wuye_service/serviceList/wuye/payment/index'], payment)
  },
  {
    path: '/estate/serviceList/wuye/payment/expense/:guid',
    component: expense => require(['@/components/manage/wuye_service/serviceList/wuye/payment/expense'], expense)
  }, {
    path: '/estate/serviceList/wuye/newPayment/:id',
    component: expense => require(['@/components/manage/wuye_service/serviceList/wuye/payment/add'], expense)
  },


  {
    path: '/estate/serviceList/wuye/rectification',
    component: rectification => require(['@/components/manage/wuye_service/serviceList/wuye/rectification/index'], rectification)
  },
  {
    path: '/estate/serviceList/wuye/rectification/details',
    component: details => require(['@/components/manage/wuye_service/serviceList/wuye/rectification/details'], details)
  },

  {
    path: '/estate/serviceList/wuye/notice',
    component: notice => require(['@/components/manage/wuye_service/serviceList/wuye/notice/index'], notice)
  },
  {
    path: '/estate/serviceList/wuye/notice/details',
    component: details => require(['@/components/manage/wuye_service/serviceList/wuye/notice/details'], details)
  },

  {
    path: '/estate/serviceList/wuye/reception',
    component: reception => require(['@/components/manage/wuye_service/serviceList/wuye/reception/index'], reception)
  },
  {
    path: '/estate/serviceList/wuye/reception/declares',
    component: declares => require(['@/components/manage/wuye_service/serviceList/wuye/reception/declares'], declares)
  },
  {
    path: '/estate/serviceList/wuye/reception/details/:id',
    component: details => require(['@/components/manage/wuye_service/serviceList/wuye/reception/details'], details)
  },

  {
    path: '/estate/serviceList/wuye/renovation',
    component: renovation => require(['@/components/manage/wuye_service/serviceList/wuye/renovation/index'], renovation)
  },
  {
    path: '/estate/serviceList/wuye/renovation/declares',
    component: declares => require(['@/components/manage/wuye_service/serviceList/wuye/renovation/declares'], declares)
  },
  {
    path: '/estate/serviceList/wuye/renovation/details',
    component: details => require(['@/components/manage/wuye_service/serviceList/wuye/renovation/details'], details)
  },
  {
    path: "/manage/pinzhi",
    component: pinzhi => require(['@/components/manage/pinzhi'], pinzhi)
  },
  {
    path: "/manage/work",
    component: pinzhi => require(['@/components/manage/work'], pinzhi)
  }, {
    path: "/manage/building",
    component: pinzhi => require(['@/components/manage/building'], pinzhi)
  }
]

// "品质管理": "/manage/pinzhi",
//   "工作管理": "/manage/work",
//     "楼宇信息": "/manage/building"
