<template>
<div class="register_form">
    <el-form ref="form" class="form" :model="registerData" label-width="80px">
     <!--用户信息-->
      <el-form-item label="" label-width="0">
        <div class="font600 center" style="font-size: 18px">个人注册</div>
      </el-form-item>

    <el-form-item label="用户名" prop="userName">
        <el-input v-model="registerData.userName" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item label="手机" prop="phone">
        <el-input v-model="registerData.phone" placeholder="请输入手机号" :maxlength="11"></el-input>
    </el-form-item>
    <el-form-item label="验证码" prop="code">
      <div class="flex-row-nowrap">
        <el-input class="flex1 get-code mr1" v-model="registerData.code" placeholder="验证码"></el-input>
        <el-button :disabled="disabled" type="primary" @click.native="sendCode1">{{btnValue}}</el-button>
      </div>
    </el-form-item>
    <el-form-item label="设置密码" prop="password">
      <div class="flex-row-nowrap">
        <el-input class="setcode_input" :type="inputType?'password':'text'"
                  v-model="registerData.password" placeholder="6-12数字+字母组合" :maxlength="12"></el-input>
        <div class="eyes get-code" @click.stop.prevent="openEyes()">
          <img v-if="inputType" src="../../assets/images/register/closeeye.png" alt="">
          <img v-if="!inputType" src="../../assets/images/register/openeye.png" alt="">
        </div>
      </div>
    </el-form-item>
       <el-form-item>
          <div class="cursor" @click="showXieyi=true">查看<span class="checkXieyi">注册协议</span></div> 
        </el-form-item>
    <el-form-item>
      <div class="flex-row-nowrap">
        <el-button style="width:500px" type="primary" @click="register">同意协议并注册</el-button>
        <el-button style="width:500px" type="" @click="$router.go(-1)">返回</el-button>
      </div>
    </el-form-item>
    </el-form>
    <xieyi class="xie" v-if="showXieyi" :type='7' @closeXieyi='closeXieyi'></xieyi> 
    
</div>

</template>

<script>
import xieyi from "./agreement";

export default {
  components:{
    xieyi,
  },
  data() {
    return {
      showXieyi:false,
      url: "/register/rent",
      regPass: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
      regPhone: /^1[3578]\d{9}$/,
      btnValue: "获取验证码",
      disabled: false,
      registerData: {
        userName: "",
        phone: "",
        code: "",
        password: ""
      },
      inputType: "false"
    };
  },
  methods: {
     closeXieyi() {
      this.showXieyi = false;
    },
    //获取验证码
    sendCode1() {
      var that = this;
      if (
        this.registerData.phone == "" ||
        typeof this.registerData.phone == "undefined"
      ) {
        this.$message.error("手机号不能为空");
        return;
      } else if (!this.regPhone.test(this.registerData.phone)) {
        this.$message.error("手机号格式错误");
        return;
      }
      //倒计时
      this.disabled = true;
      var num = 60;
      this.btnValue = num + "秒后重新获取";
      var timer = setInterval(function() {
        num--;
        that.btnValue = num + "秒后重新获取";
        if (num === 0) {
          that.btnValue = "获取验证码";
          that.disabled = false;
          clearInterval(timer);
        }
      }, 1000);
      // 发送请求
      var data = {
        mobile: that.registerData.phone
      };
      this.$ajax(
        `${this.subUrl.user}/user/getVerificationCode`,
        data,
        res => {
          if (res.code == 1) {
            console.log(res.data);
            that.$message({
              message: "已发送",
              type: "success",
              duration: 1500
            });
          } else {
            that.$message(res.data.msg);
          }
        },
        this
      );
    },
    // 显示密码
    openEyes() {
      if (this.inputType) {
        this.inputType = false;
      } else {
        this.inputType = true;
      }
    },
    //检查是否注册过
    verify(phone, data) {
      this.$ajax(
        `${this.subUrl.user}/user/register`,
        data,
        res1 => {
          if (res1.code == 1) {
            this.$message({
              message: "注册成功",
              type: "success",
              duration: 1500
            });
            location.href = "#/account/login";
          } else {
            this.$message({
              mes: res1.msg
            });
          }
        },
        this
      );
      // this.$ajax(
      //   `${this.subUrl.user}/user/accountVerify`,
      //   { account: phone },
      //   res => {
      //     console.log(2);
      //     console.log(res);
      //     // 未注册
      //     console.log(res.code,'code')
      //     if (res.code == 1) {
      //       console.log(3)
      //       this.$ajax(
      //         `${this.subUrl.user}/user/register`,
      //         data,
      //         res1 => {
      //           if (res1.code == 1) {
      //             console.log(4);
      //             this.$message({
      //               message: "注册成功",
      //               type: "success",
      //               duration: 1500
      //             });
      //             //location.href = "#/register_success/1";
      //           } else {
      //             console.log(5);
      //             this.$message({
      //               mes: res1.msg
      //             });
      //           }
      //         },
      //         this
      //       );
      //     } else if (res.code == 1 || res.code == -1) {
      //       console.log(6);
      //       this.$message.error("账号已注册");
      //     }
      //   },
      //   this
      // );
    },
    //注册
    register() {
      if (this.registerData.userName == "") {
        return this.$message.error("请输入用户名");
      } else if (this.registerData.phone == "") {
        return this.$message.error("手机号");
      } else if (!this.regPhone.test(this.registerData.phone)) {
        return this.$message.error("请输入正确的手机号");
      } else if (this.registerData.code == "") {
        return this.$message.error("请输入验证码");
      } else if (this.registerData.password == "") {
        return this.$message.error("请输入密码");
      } else if (!this.regPass.test(this.registerData.password)) {
        return this.$message.error("密码格式不正确");
      }
      var data = {
        type: 5,
        userName: this.registerData.userName,
        mobile: this.registerData.phone,
        verificationCode: this.registerData.code,
        password: this.registerData.password
      };
      console.log(data);
      this.verify(this.registerData.phone, data);
    }
  },
  mounted() {
    console.log(this.$route.params);
    /*设置用户类型,辨别主颜色*/
    localStorage.setItem("userType", this.$route.params.type);
  }
};
</script>
<style scoped>
.form {
  width: 600px;
  margin: 20px auto;
  background: #fff;
  padding: 30px 50px 30px 20px;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
}
.title_type {
  text-align: center;
}
.setcode_input {
  width: 450px;
  float: left;
}
.eyes {
  float: left;
  margin-left: 10px;
}
.eyes img {
  width: 30px;
}
</style>
