<template>
  <div class="login_form clearfix">
    <div class="layout">
      <el-form class="form" label-width="80px">
        <el-form-item label="" label-width="0" prop="userName">
          <div class="center font16 font600">账号登录</div>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input  @input="getOptons" placeholder="请输入手机号" v-model="loginData.userName"
                    id="phone" name="phone" :maxlength="11" @blur="phoneBlur"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" id="password" v-model="loginData.password"
                    name="password" :maxlength="12" type="password" @keypress.enter.native="MyLogin"></el-input>
        </el-form-item> 
         <el-form-item label="角色" prop="password">
           <el-select class="flex1" v-model="roleGuid" @change="changeRole">
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.name"
              :value="item.guid">
            </el-option>
        </el-select>
        </el-form-item> 
        <el-form-item label="验证码" v-if="showSetCode" class="flex" prop="code">
          <div class="flex flex1" style="flex-flow: row nowrap;margin-left: -80px;align-items: center;width:300px;">
            <el-input class="flex1" style="display:block" placeholder="请输入验证码" v-model="confirmCode"></el-input>
            <div style="width:100px;display:flex;align-item:center;">
              <img style="cursor: pointer" v-if="showCodeUrl" @click="getUrl" :src="codeUrl" alt="">
            </div>
          </div> 
        </el-form-item>
        <el-form-item label="邀请码" prop="code" v-show="showCode">
          <el-input placeholder="请输入邀请码" v-model="loginData.code"></el-input>
        </el-form-item>
        <el-checkbox style='padding-left:80px;' v-model="isRemenber">3天免登陆</el-checkbox>
        <a class="forget" @click="$router.push('/account/forget')">忘记密码</a>
        <el-form-item>
          <el-button class="loginBtn" type="primary" @click="MyLogin" :loading="logining">登录</el-button>
          <el-button class="loginBtn" type="primary" plain @click="$router.push('/account/choose_register')">注册
          </el-button>
        </el-form-item>
        <div class="ProtocolBox">
          <span>登录即代表同意<span class="cursor checkXieyi" @click="showXieyi = true">平台服务协议</span></span>
        </div>
      </el-form>
    </div>
    <xieyi v-if="showXieyi" @closeXieyi='showXieyi = false' :type='10'></xieyi>
  </div>

</template>

<script>
import fn from "../../assets/js/common.js";
import xieyi from "./agreement.vue";

export default {
  components: {
    xieyi
  },
  data() {
    return {
      loginType: 1,
      logining: false,
      isRemenber: false,
      confirmCode: "",
      codeUrl: "",
      showXieyi: false,
      showSetCode: false,
      roleGuid: "",
      isLogin: false,
      options: [
        // { name: "租户", value: 1 },
        // { name: "商家", value: 2 },
        // { name: "管理处", value: 3 },
        // { name: "物业公司", value: 4 },
        // { name: "个人", value: 5 },
        // { name: "业主", value: 6 },
        // { name: "业委会", value: 7 }
      ],
      showCodeUrl: true,
      reg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
      regPhone: /^1[356789]\d{9}$/,
      loginData: {
        userName: "",
        password: "",
        code: "",
        isLogin: false
      },
      SDK: {},

      isregister: false,
      showCode: false,
      passwordText: "密码不能为空",
      passwordFlag: false,
      phoneText: "手机号不能为空",
      phoneFlag: false,
      codeFlag: false,
      codeText: "邀请码不能为空",
      showForget: false
    };
  },
  methods: {
    // 获取多角色
    getOptons(cb) {
      if (this.regPhone.test(this.loginData.userName)) {
        this.timer = setTimeout(() => {
          var data = {
            account: this.loginData.userName
          };
          this.$ajax(
            `${this.subUrl.user}/user/getMultiRole`,
            data,
            res => {
              if (res.data.length > 0) {
                var tempArr = [];
                for (var v of res.data) {
                  switch (v.organType) {
                    case 1:
                      v.name = "租户" + "-" + v.name;
                      break;
                    case 2:
                      v.name = "商家" + "-" + v.name;
                      break;
                    case 3:
                      v.name = "管理处" + "-" + v.name;
                      break;
                    case 4:
                      v.name = "物业公司" + "-" + v.name;
                      break;
                    case 5:
                      v.name = "个人" + "-" + v.name;
                      break;
                    case 6:
                      v.name = "业主" + "-" + v.name;
                      break;
                    case 7:
                      v.name = "业委会" + "-" + v.name;
                      break;
                    default:
                      break;
                  }
                  this.roleGuid = res.data[0].guid;
                  this.options = res.data;
                  this.isNeedCode();
                  this.isNeedCode1();
                  if(typeof cb == 'function'){
                    cb();
                  }
                }
              } else {
                this.options = [];
                this.roleGuid = "";
              }
            },
            this
          );
        });
      } else {
        this.roleGuid = "";
        this.options = [];
        this.isNeedCode();
      }
    },
    // 修改角色需要继续判定
    changeRole() {
      this.isNeedCode();
      this.isNeedCode1();
    },
    getUrl() {
      this.showCodeUrl = false;
      if (this.codeUrl.indexOf("?") == -1) {
        this.codeUrl =
          this.codeUrl +
          "?random=" +
          Math.random() +
          "&account=" +
          this.loginData.userName;
      } else {
        this.codeUrl =
          this.baseUrl +
          this.subUrl.user +
          "/user/createImageCode" +
          "?random=" +
          Math.random() +
          "&account=" +
          this.loginData.userName;
      }
      this.confirmCode = "";
      this.showCodeUrl = true;
    },
    MyLogin() {
      if (this.logining) return;
      var that = this;
      var pass = this.loginData.password;
      if (this.loginData.userName == "") {
        this.$message.error("手机号不能为空");
        return;
      } else if (!this.regPhone.test(this.loginData.userName)) {
        this.$message.error("手机号格式错误");
        return;
      }
      if (this.showSetCode) {
        if (!this.confirmCode) {
          return this.$message.error("请输入验证码");
        }
      }
      if (pass == "") {
        this.$message.error("密码不能为空");
        return;
      }
      //  else if (!this.reg.test(pass)) {
      //   this.$message.error("密码格式错误");
      //   return;
      // }
      this.isNeedCode();
      this.isNeedCode1();
      // 邀请码
      if (this.showCode) {
        if (this.loginData.code == "") {
          this.codeFlag = true;
          this.codeText = "邀请码不能为空";
          this.$message.error(this.codeText);
          return;
        } else {
          this.codeFlag = true;
        }
      }
      var data = {
        account: this.loginData.userName,
        inviteCode: this.loginData.code,
        password: this.loginData.password,
        source: 1
      };
      if (this.roleGuid) data.userId = this.roleGuid;
      if (!this.showCode) {
        delete data.inviteCode;
      }
      if (this.showSetCode) {
        data.code = this.confirmCode;
      }
      // that.$dialog.loading.open('登录中');
      // setTimeout(() => {
      //   that.$dialog.loading.close();
      // }, 2000);
      // 验证账号是否注册
      localStorage.clear();
      this.logining = true;
      let accountData = {
        account: this.loginData.userName
      };
      if (this.roleGuid) accountData.userId = data.roleGuid;
      this.xhr
        .post(
          `${this.subUrl.user}/user/accountVerify`,
          this.$qs.stringify(accountData)
        )
        .then(res => {
          if (res.data.code == -903) {
            this.logining = false;
            return this.$message.error("账号未注册");
          } else {
            this.xhr
              .post(`${this.subUrl.user}/user/login`, this.$qs.stringify(data))
              .then(res => {
                this.logining = false;
                if (res.data.code == 1) {
                  res.data = res.data.data;
                  res.data.userInfo = res.data.userInfo
                    ? res.data.userInfo
                    : {};
                  res.data.organInfo = res.data.organInfo
                    ? res.data.organInfo
                    : {};
                  localStorage.setItem(
                    "userInfo",
                    encodeURIComponent(JSON.stringify(res.data.userInfo))
                  );
                  localStorage.setItem(
                    "organInfo",
                    encodeURIComponent(JSON.stringify(res.data.organInfo))
                  );
                  localStorage.setItem(
                    "to",
                    encodeURIComponent(res.data.token)
                  );
                  fn.setIng(res.data.token);
                  var a = res.data.userInfo.organType;
                  var b = res.data.userInfo.admin ? 1 : 0;
                  localStorage.setItem("organType", a);
                  localStorage.setItem("isManger", b);
                  localStorage.setItem("user_Id", res.data.userInfo.guid);
                  localStorage.setItem("organ_Id", res.data.organInfo.guid);
                  localStorage.setItem(
                    "mainColor",
                    that.$color[res.data.userInfo.organType]
                  );
                  var c = 3;
                  // this.$message.success("登录成功");
                  if (this.isRemenber) {
                    this.$cookies.set(
                      "userName",
                      this.loginData.userName,
                      "3d"
                    );
                    this.$cookies.set("isRemenber", this.isRemenber, "3d");
                    this.$cookies.set(
                      "password",
                      this.loginData.password,
                      "3d"
                    );
                  } else {
                    this.$cookies.remove("userName");
                    this.$cookies.remove("isRemenber");
                    this.$cookies.remove("password");
                  }
                  // 登陆成功设置cookies,若token失效3天登陆是否还需要有效
                  // var url = `/index/${a}/${b}/${c}/rent/my`;
                  var url = "";
                  document.onkeyup = null;
                  switch (res.data.userInfo.organType * 1) {
                    case 1:
                      url = "/manage/wuye_service";
                      break;
                    case 2:
                      url = "/user/we_business/supply/find";
                      break;
                    case 3:
                      url = "/manage/wuye_service";
                      break;
                    case 4:
                      url = "/wuye/manage";
                      break;
                    case 5:
                      url =
                        "/user/personal_wealth/personal_details/personal_ticketRecord";
                      break;
                    case 6:
                      url =
                        "/user/personal_wealth/personal_details/personal_ticketRecord";
                      break;
                    case 7:
                      url =
                        "/user/personal_wealth/personal_details/personal_ticketRecord";
                      break;
                  }
                  that.$router.push(url);
                  that.isLogin = true;
                } else {
                  this.$message.error(res.data.msg);
                }
                this.getUrl();
              })
              .catch(() => {
                this.logining = false;
              });
          }
        });
    },
    // 是否需要验证码
    isNeedCode1() {
      if (this.regPhone.test(this.loginData.userName)) {
        this.timer = setTimeout(() => {
          let data = {
            account: this.loginData.userName
          };
          this.xhr
            .post(
              `${this.subUrl.user}/user/accountVerifyCode`,
              this.$qs.stringify(data)
            )
            .then(res => {
              if (res.data.code == -904) {
                this.getUrl();
                this.showSetCode = true;
              } else {
                this.showSetCode = false;
              }
            });
        }, 200);
      }
    },
    // 是否需要注册和是否需要邀请码
    isNeedCode() {
      if (this.regPhone.test(this.loginData.userName)) {
        this.timer = setTimeout(() => {
          let data = {
            account: this.loginData.userName
          };
          if (this.roleGuid) data.userId = this.roleGuid;
          this.xhr
            .post(
              `${this.subUrl.user}/user/accountVerify`,
              this.$qs.stringify(data)
            )
            .then(res => {
              if (res.data.code == 1) {
                if (!this.codeUrl) {
                  this.getUrl();
                }
                this.showCode = false;
              } else if (res.data.code == -1) {
                this.showCode = true;
              }
            });
        }, 200);
      }
    },
    phoneBlur() {}
  },
  mounted() {
    if (this.loginData.userName) {
      this.getUrl();
    }
    this.isRemenber = this.$cookies.get("isRemenber") ? true : false;
    if (this.isRemenber) {
      let userName = this.$cookies.get("userName");
      let password = this.$cookies.get("password");
      this.$set(this.loginData, "userName", userName);
      this.$set(this.loginData, "password", password);
      this.getOptons(res => {
        this.MyLogin();
      });
    }
  },
  //
  created() {
    var that = this;
    document.onkeyup = function(e) {
      var key = window.event.keyCode;
      if (key == 13) {
        that.MyLogin();
      }
    };
  }
};
</script>
<style lang="scss" scoped>
.el-radio {
  margin-left: 0;
  margin-right: 10px;
  margin-bottom: 5px;
}
.login_form {
  width: 100%;
  height: 100%;
  padding-bottom: 200px;
}

.layout {
  // background: url("/src/assets/images/register/loginbanner.png") #1e82d2
  background: url("../../assets/images/register/loginbanner.png") #1e82d2
    no-repeat 15% 80px;
  position: absolute;
  left: 0;
  right: 0;
  top: 80px;
  bottom: 0;
}

.loginBtn {
  width: 140px;
  height: 36px;
  margin-top: 25px;
}

.form {
  position: absolute;
  left: 60%;
  top: 20%;
  // transform: translateY(-50%);
  background: #fff;
  padding: 30px 50px 30px 20px;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
  width: 450px;
}

.forget {
  text-align: right;
  position: absolute;
  right: 60px;
  bottom: 150px;
  color: #1e82d2;
  cursor: pointer;
}

.ProtocolBox {
  padding: 0 0 20px 80px;
  font-size: 15px;
  color: #999;
  text-align: center;
  a {
    color: #1e82d2;
    text-decoration: underline;
  }
}
</style>
