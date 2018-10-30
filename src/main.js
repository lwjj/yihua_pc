// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'

import Vue from 'vue'
import router from './router'
import App from './App.vue'
import "vue-ydui/dist/ydui.base.css";
import "./assets/js/rem";
import YDUI from "vue-ydui";
Vue.use(YDUI);
// 使用UI框架
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import "@/assets/font1/iconfont.css";
import 'font-awesome/css/font-awesome.css'
import './assets/css/common.css'
import './assets/css/myElement.css'
import 'swiper/dist/css/swiper.min.css';
import './assets/js/md5';
Vue.use(ElementUI);
// 使用cookie
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
Vue.config.productionTip = true;
import axios from 'axios';
import qs from 'qs';
import fn from '@/assets/js/common.js'
Vue.prototype.$getkey = fn.getIng;
Vue.prototype.$getToday = fn.getToday;
Vue.prototype.$addDay = fn.addDay;
Vue.prototype.$today = fn.getToday;
Vue.prototype.$getPrint = function getPrint(e) {
    let subOutputRankPrin = document.getElementById('printcode');
    var options = { format: "CODE128", displayValue: true, fontSize: 18, height: 100 };
    document.body.innerHTML = subOutputRankPrin.innerHTML;
    window.print();
    window.location.reload();
    document.body.innerHTML = oldContent;
}
Vue.prototype.$getPrint2 = function getPrint(e) {
    let subOutputRankPrin = document.getElementById('printcode2');
    var options = { format: "CODE128", displayValue: true, fontSize: 18, height: 100 };
    document.body.innerHTML = subOutputRankPrin.innerHTML;
    window.print();
    window.location.reload();
    document.body.innerHTML = oldContent;
}

function deleteCookie() {
    Vue.cookies.remove('userName')
    Vue.cookies.remove('password')
    Vue.cookies.remove('isRemenber')
};
// 表格
// 引入样式
import 'vue-easytable/libs/themes-base/index.css'
// 导入 table 和 分页组件
import {
    VTable,
    VPagination
} from 'vue-easytable'


Vue.component(VTable.name, VTable)
Vue.component(VPagination.name, VPagination)
//
// 注册到全局
var a;
function setImg(arr, el) {
    console.log(el.isFirst,'el.isFirst')
    if (!el.isFirst) {
        el.sliders = [];
        a = 0;
        el.isFirst = true;
    }
    if (a == arr.length) {
        el.isFirst = false;
        return;
    } else {
        var obj = arr[a];
        if (arr[a]) {
            var img = new Image();
            img.src = obj.path;
            obj.msrc = obj.path
            obj.src = obj.path;
            img.onload = function () {
                obj.w = this.width;
                obj.h = this.height;
                obj.alt = 'picture' + a;
                el.sliders.push(JSON.parse(JSON.stringify(obj)));
                a++;
                if (arr.length != 1) {
                    setImg(arr, el);
                }
            }
        }

    }
}
Vue.prototype.$setImg = setImg;
// 重复代码 生成第二个图片
// 注册到全局
var a1;
function setImg1(arr, el) {
    if (!el.isFirst1) {
        el.sliders1 = [];
        a1 = 0;
        el.isFirst1 = true;
    }
    if (a1 == arr.length) {
        el.isFirst1 = false;
        return;
    } else {
        var obj = arr[a1];
        if (arr[a1]) {
            var img = new Image();
            img.src = obj.path;
            obj.msrc = obj.path
            obj.src = obj.path;
            img.onload = function () {
                obj.w = this.width;
                obj.h = this.height;
                obj.alt = 'picture' + a1;
                el.sliders1.push(JSON.parse(JSON.stringify(obj)));
                a1++;
                if (arr.length != 1) {
                    setImg(arr, el);
                }
            }
        }

    }
}
Vue.prototype.$setImg1 = setImg1;
// 图片预览
import VuePreview from 'vue-preview'
// import { start } from 'repl';
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
    console.log = function () { }
    baseUrl = 'http://www.bazhuawang.com:8888'
} else if (location.href.indexOf('192.168.3.234') > -1) {
    console.log = function () { }
    baseUrl = 'http://192.168.3.234:8888'
} else if (location.href.indexOf('121.15.166.3') > -1) {
    baseUrl = 'http://121.15.166.3:8888'
    console.log = function () { }
} else {
//  baseUrl = 'http://192.168.3.234:8888'
       baseUrl = 'http://121.15.166.3:8888'
}
// baseUrl = 'http://121.15.166.3:8888'
// baseUrl = 'http://www.bazhuawang.com:8888'
// baseUrl = 'http://121.15.166.3:8888'
import Vuex from 'vuex'
Vue.use(Vuex)
// console.log(Store,'xxxxxxxxxxx')
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

Vue.prototype.back = function () {
    this.$router.go(-1);
}
//判断是否有权限
Vue.prototype.$getRoot = function (cb, el) {
    el.$ajax(`${el.subUrl.user}/user/getPermissions`, { token: el.$getkey(), userId: el.userInfo.guid, }, res => {
        el.$store.commit('setRootList', res.data);
        cb && cb(res.data);
    }, el)
}

Vue.prototype.$ajax2 = function (url, data, cb, el, err) {
    el.$dialog.loading.open('加载中');
    Vue.prototype.xhr.post(url, qs.stringify(data)).then(
        res => {
            el.$dialog.loading.close();
            if (res.data.code == 1) {
                cb && cb(res.data);
            } else if (res.data.code == -902) {
                fn.re_login(el);
            } else {
                var txt = res.data.msg ? res.data.msg : "返回错误";
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
    xhr.post(url, qs.stringify(data)).then((res) => {
        data = res.data;
        if (data.code == 1) {
            cb && cb(data);
        } else if (data.code == -902) {
            localStorage.clear();
            el.$message.error("登录失效,请重新登录");
            el.$router.push('/');
        } else {
            if (data) {
                el.$message.error(data.msg);
            }
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
        } else if (data.code == -902) {
            localStorage.clear();
            el.$message.error("登录失效,请重新登录");
            el.$router.push('/');
        } else {
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
// 获取部门人数
Vue.prototype.$getDepNum = function (organId, cb, el) {
    el.$ajax(`${el.subUrl.user}/admin/deptManage/organDepartmentInfo`, { organId, token: el.$getkey(), }, res => {
        var num = 0;
        for (var i of res.data) {
            num += i.empList.length;
        }
        el.depNum = num;
        if (!el.depNum) {
            return el.$message({ message: "该单元无总经理角色，请提醒添加", type: "error" });
        }
    }, el)
}
// 限制输入多少位
Vue.prototype.setNum = function setNum(para, key, len) {
    para[key] = para[key].replace(/[\D]/g, '');
    if (len) {
        para[key] = para[key].substr(0, len);
    }
};
// 获取任务单最新数量
Vue.prototype.$getTaskNum = function (cb, el) {
    if (el.userInfo.organType != 3) return;
    el.$ajax(`${el.subUrl.activity}/taskBill/statistics`, { token: el.$getkey(), userId: el.userInfo.guid }, res => {
        cb && cb(res);
    }, el)
}
// 获取消息类型
Vue.prototype.$getMessage = function (cb, el) {
    console.log(el.userInfo.organType,'xxx',!el.$getkey(), 'console.log')
    if (!el.$getkey()) return;
    // if (el.userInfo.organType > 3) return;
    el.$ajax(`${el.subUrl.user}/user/messageRemind`, { token: el.$getkey() }, res => {
        el.messageObj = res.data;
        var show1 = true;
        var show2 = true;
        var show3 = true;
        var show4 = true;
        var show5 = true;
        // 本楼业务
        var show6 = true;
        var show7 = true;
        // 物业服务和物业管理加起来的消息算物业管理
        var service = true;
        // 物业管理
        for (var i in el.messageObj.proManageMr) {
            if (el.messageObj.proManageMr[i] > 0) {
                show2 = false;
            }
        }
        // 物业服务
        for (var i in el.messageObj.proServiceMr) {
            if (el.messageObj.proServiceMr[i] > 0) {
                service = false;
            }
        }
        // 个人中心 供求市场
        for (var i in el.messageObj.marketMr) {
            if (el.messageObj.marketMr[i] > 0) {
                show4 = false;
            }
        }
        // 本楼业务
        for (var i in el.messageObj.houseBusMr) {
            if (el.messageObj.houseBusMr[i] > 0) {
                show6 = false;
            }
        }
        // 消息
        for (var i in el.messageObj.messageMr) {
            if (el.messageObj.messageMr[i] > 0) {
                show5 = false;
            }
        }
        // el.show1 = show1;
        el.show2 = show2 && service;
        el.service = service;
        el.show3 = show3;
        // 用且true为隐藏红点，false显示，只要有一个有消息即显示
        el.show4 = show4 && show6;
        el.show4 = show4;
        el.show5 = show5;
        cb && cb(res)
    }, el)
}
// 获取用户类型
Vue.prototype.$getUserInfo = function (cb, el) {
    el.$ajax(`${el.subUrl.user}/user/getUserInfo`, {
        token: el.$route.query.token,
        userId: el.$route.query.userId,
    }, res => {
        res = res.data;
        localStorage.setItem(
            "userInfo",
            encodeURIComponent(JSON.stringify(res.userInfo))
        );
        localStorage.setItem(
            "organInfo",
            encodeURIComponent(JSON.stringify(res.organInfo))
        );
        fn.setIng(el.$route.query.token);
        var a = res.userInfo.organType;
        var b = res.userInfo.admin ? 1 : 0;
        localStorage.setItem("organType", a);
        localStorage.setItem("isManger", b);
        localStorage.setItem("user_Id", res.userInfo.guid);
        localStorage.setItem("organ_Id", res.organInfo.guid);
        localStorage.setItem(
            "mainColor",
            this.$color[res.userInfo.organType]
        );
        cb && cb(res)
    }, el)
}
var rootList = {
    weBusiness: [],
};
if (localStorage.getItem('rootList') !== 'undefined') {
    rootList = JSON.parse(localStorage.getItem('rootList'))
}
const store = new Vuex.Store({
    state: {
        count: 0,
        activeMenu: "",
        newMessageNum: 0,
        all: {},
        rootList: rootList,//权限列表
    },
    mutations: {
        setActivemenu(state, n) {
            state.activeMenu = n;
        },
        increment(state) {
            state.count++
        }, setMessageNum(state, num) {
            state.newMessageNum = num;
        }, setAllmessage(state, message) {
            state.all = message;
        }, setRootList(state, data) {
            localStorage.setItem('rootList', JSON.stringify(data))
            state.rootList = data;
        }
    }
})
// 全局变量 表格的高度
window.tableHeight = Number(Vue.prototype.$getClientHeight()) - 200
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
        App
    },
    render: h => h(App),
})
