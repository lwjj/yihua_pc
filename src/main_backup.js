// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import App from './App.vue'
import "vue-ydui/dist/ydui.base.css";
import "./assets/js/rem";
import YDUI from "vue-ydui";

Vue.use(YDUI);
// 使用UI框架
import ElementUI from 'element-ui'
// import ElementUI from 'element-theme-default'
import 'element-ui/lib/theme-chalk/index.css'
// import 'element-ui/lib/theme-default/index.css'
import 'element-theme-default/lib/index.css'
import "@/assets/font1/iconfont.css";
import 'font-awesome/css/font-awesome.css'
import './assets/css/common.css'
// import './assets/css/common_wechat.css'
import './assets/css/myElement.css'

import './assets/js/md5';
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.min.css';
Vue.use(ElementUI);
Vue.config.productionTip = false;
import axios from 'axios';
import qs from 'qs';
import fn from '@/assets/js/common.js'

Vue.prototype.$getkey = fn.getIng;
Vue.prototype.$getToday = fn.getToday;
Vue.prototype.$addDay = fn.addDay;
Vue.prototype.$today = fn.getToday;

// 表格
// 引入样式
import 'vue-easytable/libs/themes-base/index.css'
// 导入 table 和 分页组件
import {
  VTable,
  VPagination
} from 'vue-easytable'

// 注册到全局
Vue.component(VTable.name, VTable)
Vue.component(VPagination.name, VPagination)


// 图片预览
import VuePreview from 'vue-preview'
Vue.use(VuePreview)

function getPara() {
  var arr = [];
  var a = fn.random();
  var b = fn.getTimeStamp();
  arr = fn.arr;
  arr.push(fn.a);
  arr.push(a);
  arr.push(b);
  var b = arr[1] + a + b + fn.getPa();
  return {
    a: arr.join('/'),
    b: b.MD5(32)
  }
};

var obj = getPara();

// axios.get()
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时

    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
Vue.prototype.subUrl = {
  bd: "bd",
  activity: "/activiti",
  user: "/user",
  login: "/user",
  logout: "/user",
  common: "/user",
  organ: "/user",
  admin: "/user/admin",
  sc: "/sc"
};
Vue.prototype.$qs = qs;
let baseUrl = '';
if (location.href.indexOf('bazhuawang') > -1) {
  baseUrl = 'http://www.bazhuawang.com:8888'
} else if (location.href.indexOf('192.168.3.234') > -1) {
  baseUrl = 'http://192.168.3.234:8888'
} else if (location.href.indexOf('121.15.166.3') > -1) {
  baseUrl = 'http://121.15.166.3:8888'
} else {
  baseUrl = 'http://192.168.3.234:8888'
}
Vue.prototype.baseUrl = baseUrl;
const xhr = axios.create({
  // baseURL: 'http://192.168.3.234:8888',
  baseURL: baseUrl,
  timeout: 30000,
  headers: {
    'AppToken': obj.a,
    'sign': obj.b
  }

});

Vue.prototype.$ajax2 = function (url, data, cb, el, err) {
  el.$dialog.loading.open('加载中');
  Vue.prototype.xhr.post(url, qs.stringify(data)).then(
    res => {
      console.log(el)
      el.$dialog.loading.close();
      if (res.data.code == 1) {
        console.log(res.data.data);
        cb && cb(res.data);
      } else if (res.data.code == -902) {
        fn.re_login(el);
      } else {
        var txt = res.data.msg ? res.data.msg : "返回错误";
        console.log(txt)
        el && el.$dialog.toast({ mes: txt, timeout: 1500 });
      }
      el.request = false;
    },
    res => {
      err && err(res);
      el.$dialog.loading.close();
      var txt = res.data.msg ? res.data.msg : "返回错误";
      el.request = false;
      el && el.$dialog.toast({ mes: '请求超时', timeout: 1500 });
    }
  );
};
// 将图片或视频生成本地预览地址
Vue.prototype.$getImgUrl = function (file) {
  var url = null;
  if (window.createObjectURL) {
    // basic
    url = window.createObjectURL(file);
  } else if (window.URL && typeof window.URL.createObjectURL == "function") {
    // mozilla(firefox)
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL) {
    // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
};
Vue.prototype.xhr = xhr
// url,传递数据,返回函数,最后一个将vue的参数返回
Vue.prototype.$ajax = function (url, data, cb, el) {
  if (localStorage.getItem('token')) {
    data.token = localStorage.getItem('token');
  }
  xhr.post(url, qs.stringify(data)).then((res) => {
    data = res.data;
    if (data.code == 1) {
      cb && cb(data);
    } else if (data.code == 902) {
      el.$message.error("登录失效,请重新登录");
      el.$router.push('/');
    } else {
      console.log("main.js");
      el.$message.error(data.msg);
    }
  }, (res) => {
    el.$message.error("请求错误");
  })
}
Vue.prototype.xhr1 = axios.create({
  // baseURL: "http://192.168.3.234:8888",
  baseURL: baseUrl,
  // baseURL: 'http://120.78.155.96:8888',
  timeout: 30000,
  headers: {
    AppToken: obj.a,
    sign: obj.b,
    "Content-Type": "application/json"
  }
});
Vue.prototype.$ajax1 = function (url, data, cb, el) {
  if (localStorage.getItem('token')) {
    data.token = localStorage.getItem('token');
  }
  Vue.prototype.xhr1.post(url, JSON.stringify(data)).then((res) => {
    data = res.data;
    if (data.code == 1) {
      cb && cb(data);
    } else if (data.code == 902) {
      el.$message.error("登录失效,请重新登录");
      el.$router.push('/');
    } else {
      console.log("main.js")
      el.$message.error(data.msg);
    }
  }, (res) => {
    el.$message.error("请求错误");
  })
}

//1:租户；2:商家；3:管理处；4:物业公司；5:其他（个人）；6：业主 0为空
//根据用户类型设置主色
Vue.prototype.$color = [
  "",
  "#23ac38",
  "#fab23e",
  "#1e82d2",
  "#1e82d2",
  "#1e82d2",
  "#1e82d2",
  "#1e82d2",
];
// 辅助颜色
Vue.prototype.$fuColor = [
  "#3eb7e6",
  "#62c88c",
  "#fab23e",
  "#fa697c",
  "#adb8c0"
];
Vue.prototype.$back = function () {
  history.go(-1);
};

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  },
  render: h => h(App)
})
Vue.prototype.$getClientHeight = function () {
  var clientHeight = 0;
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
  } else {
    var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
  }
  return clientHeight;
}

// 过滤时间 只显示日期
Vue.filter('date', input => {
  if (input) {
    return input.split(" ")[0]
  }
})

//自定义date filter
var oneDay = 24 * 3600 * 1000;
Vue.filter("times", function (item) {
  if (item) {
    var myDate = new Date(item).getTime();
    var d = new Date().setHours(0, 0, 0, 0) + oneDay;
    if ((d - myDate) / oneDay < 1) return "今天 " + item.substr(11, 18);
    if ((d - myDate) / oneDay < 2) {
      return "昨天 " + item.substr(11, 18);
    } else {
      return item;
    }
  }
});


// 全局变量 表格的高度
window.tableHeight = Number(Vue.prototype.$getClientHeight()) - 200
