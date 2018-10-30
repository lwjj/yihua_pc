export default [
  // 经理建立管理处月报明细
  {
    path: "/bazhua/circle",
    component: mymonth => require(["@/components/bazhua/circle/index"], mymonth)
  },
  {
    path: "/bazhua/myTip",
    component: mymonth => require(["@/components/bazhua/myTip/index"], mymonth)
  },
  {
    path: "/bazhua/myAdd",
    component: mymonth => require(["@/components/bazhua/myAdd/index"], mymonth)
  },
  {
    path: "/bazhua/myComment",
    component: mymonth => require(["@/components/bazhua/myComment/index"], mymonth)
  },
  {
    path: "/bazhua/myGet",
    component: mymonth => require(["@/components/bazhua/myGet/index"], mymonth)
  },
  {
    path: "/bazhua/myFriend",
    component: mymonth => require(["@/components/bazhua/myFriend/index"], mymonth)
  },
  {
    path: "/bazhua/tipDetail",
    component: mymonth => require(["@/components/bazhua/tipDetail"], mymonth)
  },
  {
    path: "/bazhua/userInfo",
    component: mymonth => require(["@/components/bazhua/userInfo"], mymonth)
  },
  {
    path: "/bazhua/userInfo1",
    component: mymonth => require(["@/components/bazhua/userInfo"], mymonth)
  },
  {
    path: "/bazhua/addTip",
    component: mymonth => require(["@/components/bazhua/addTip/new_post"], mymonth)
  },

]
