function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'https://__bridge_loaded__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
}


module.exports = {
  random() {
    "use strict";
    return (Math.random() * 3000).toString(2);
  },
  getTimeStamp() {
    "use strict";
    return new Date().getTime();
  },
  a: 'web',
  arr: ["YiHua", "1.0"],
  getPa() {
    "use strict";
    return "YiHuaProject!@#$666"
  },
  setIng(a) {
    "use strict";
    var b = parseInt(Math.random() * a.length / 2);
    localStorage.setItem('headUrlBuffer', a.substr(0, b));
    localStorage.setItem('userNameBuffer', a.substr(b, a.length));
  },
  getIng() {
    "use strict";
    var a = localStorage.getItem('headUrlBuffer');
    var b = localStorage.getItem('userNameBuffer');
    return a + b;
  },
  re_login(that) {
    "use strict";
    that.$alert({
      message: "验证过期，请重新登录", callback: () => {
        if (that.userAgent.isAndroid) {
          console.log('执行安卓的方法')
          if (window.WebViewJavascriptBridge) {
            window.WebViewJavascriptBridge.callHandler(
              "reLogin",
              { param: "this is a relogin data" },
              function () {
              }
            );
          }
          // 是IOS时那边有监听下列url
        } else if (that.userAgent.isIOS) {
          console.log('执行ios的方法')
          setupWebViewJavascriptBridge(function (bridge) {
            /* Initialize your app here */
            bridge.registerHandler('receiveLogin', function (data, responseCallback) {
              console.log("reciviceDate", data)
              responseCallback(data)
            })
            bridge.callHandler('reLogin', { 'reloginData': 'to relogin' }, function responseCallback(responseData) {
              console.log("JS received response:", responseData)
            })
          })
        }
        setTimeout(() => {
          console.log(that)
          that.$router.push('/');
        }, 0)
      }
    });

  },
  getToday(a, b) {
    if (b) {
      var d = new Date(b);
    } else {
      var d = new Date();
    }
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var t = d.getDate();
    var h = d.getHours();
    var min = d.getMinutes();
    var s = d.getSeconds();
    m = m < 10 ? '0' + m : m;
    t = t < 10 ? '0' + t : t;
    h = h < 10 ? '0' + h : h;
    min = min < 10 ? '0' + min : min;
    s = s < 10 ? '0' + s : s;
    // a只要不为false,返回2017-12-04 14:23:56格式,不存在时只返回当天
    if (a) {
      return [y, m, t].join('-') + " " + [h, min, s].join(':');
    } else {
      //false时只有天数 没有时间
      return [y, m, t].join('-');
    }
  },
  // 添加天数 传入当前时间,添加的天数,由于main.js为将整个对象复制,所以不能使用this.getToday()
  addDay(current, d) {
    if (typeof d != 'number') {
      return alert("请输入数字类型的天数");
    } else {
      console.log(current)
      var a = new Date(current).getTime();
      //转化成毫秒
      var b = d * 24 * 3600 * 1000;
      var c = Number(a) + Number(b);
      c = new Date(c);
      // 这个this是指的vue实例,并不是当前对象
      c = this.$today(false, c)
      return c;
    }
  }
}
