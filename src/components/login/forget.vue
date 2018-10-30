<!--  -->
<template>
  <el-form ref="form" class="form" :model="forgetData" :rules="formRule" label-width="100px">
    <div class="setpass">修改密码</div>
    <el-form-item label="手机" prop="phone">
        <el-input v-model="forgetData.phone" placeholder="请输入手机号" :maxlength="11"></el-input>
    </el-form-item>
    <el-form-item label="验证码" prop="code">
      <div class="flex">
        <el-input style="display: inline-block" v-model="forgetData.code" placeholder="验证码" class="get-code mr1"></el-input>
        <el-button :disabled="disabled" type="primary" @click.native="sendCode1">{{btnValue}}</el-button>
      </div>
    </el-form-item>
    <el-form-item label="设置密码" prop="password1">
        <el-input class="setcode_input" type="password"
                       v-model="forgetData.password1" placeholder="请输入8-16位数字+字母组合新密码" :maxlength="12"></el-input>
    </el-form-item>
    <el-form-item label="重新输入" prop="password2">
        <el-input class="setcode_input" type="password"
                       v-model="forgetData.password2" placeholder="再输输入新密码" :maxlength="12"></el-input>
    </el-form-item>
    <el-form-item>
       <div class="flex">
         <el-button style="width:300px" type="primary" @click="confirm">确认修改</el-button>
         <el-button style="width:300px" type="default" @click="$router.go(-1)">返回登录</el-button>
       </div>
    </el-form-item>
    </el-form>
</template>

<script>
export default {
  data() {
    var that = this;
    return {
      url: "/register/rent",
      regPass: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
      regPhone: /^1[3456789]\d{9}$/,
      btnValue: "发送验证码",
      disabled: false,
      forgetData: {
        phone: "",
        code: "",
        password1: "",
        password2: ""
      },
      inputType: "false",
      formRule: {
        phone: [
          {
            required: true,
            trigger: "blur",
            message: "请输入手机号"
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            trigger: "change",
            message: "请输入正确的手机号"
          }
        ],
        code: {
          required: true,
          trigger: "blur",
          message: "请输入验证码"
        },
        password1: [
          {
            required: true,
            trigger: "blur",
            message: "请输入密码"
          },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
            message: "请输入8-16位数字加字母组合密码"
          }
        ],
        password2: [
          {
            required: true,
            trigger: "blur",
            message: "请输入密码"
          },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
            message: "请输入8-16位数字加字母组合密码"
          },
          {
            validator: checkPass,
            trigger: "change"
          }
        ]
      }
    };
    function checkPass(rule, value, cb) {
      if (that.forgetData.password1 !== that.forgetData.password2) {
        return cb(new Error("两次密码输入不一致"));
      }
      cb();
    }
  },
  methods: {
    //获取验证码
    sendCode1() {
      var that = this;
      console.log(this);
      if (
        this.forgetData.phone == "" ||
        typeof this.forgetData.phone == "undefined"
      ) {
        this.$message.error("手机号不能为空");
        return;
      } else if (!this.regPhone.test(this.forgetData.phone)) {
        this.$message.error("手机号格式错误");
        return;
      }
      this.sendCodeSuccess();
    },

    sendCodeSuccess() {
      //倒计时
      this.disabled = true;
      var num = 60;
      this.btnValue = num + "秒后重新获取";
      var timer = setInterval(() => {
        num--;
        this.btnValue = num + "秒后重新获取";
        if (num === 0) {
          this.btnValue = "获取验证码";
          this.disabled = false;
          clearInterval(timer);
        }
      }, 1000);
      // 发送请求
      var data = {
        mobile: this.forgetData.phone
      };
      this.$ajax(
        `${this.subUrl.user}/user/getVerificationCode`,
        data,
        res => {
          if (res.code == 1) {
            console.log(res.data);
            this.$message({
              message: "已发送",
              type: "success",
              duration: 1500
            });
          } else {
            this.$message(res.data.msg);
          }
        },
        this
      );
    },

    //确认修改
    confirm() {
      this.$refs.form.validate(flag => {
        if (flag) {
          if (this.forgetData.userName == "") {
            return this.$message.error("请输入用户名");
          } else if (this.forgetData.phone == "") {
            return this.$message.error("手机号");
          } else if (!this.regPhone.test(this.forgetData.phone)) {
            return this.$message.error("请输入正确的手机号");
          } else if (this.forgetData.code == "") {
            return this.$message.error("请输入验证码");
          } else if (this.forgetData.password1 == "") {
            return this.$message.error("请输入密码");
          } else if (this.forgetData.password2 == "") {
            return this.$message.error("请再次输入密码");
          } else if (this.forgetData.password1 !== this.forgetData.password2) {
            return this.$message.error("两次输入密码不一样");
          } else if (!this.regPass.test(this.forgetData.password1)) {
            return this.$message.error("密码格式不正确");
          }
          var data = {
            account: this.forgetData.phone,
            verificationCode: this.forgetData.code,
            newPassword: this.forgetData.password1
          };
          this.$ajax(
            `${this.subUrl.user}/user/resetPassword`,
            data,
            res => {
              if (res.code == 1) {
                this.$message.success("修改成功");
                location.href = "#/account/login";
              }
            },
            this
          );
        }
      });
    }
  },
  mounted() {}
};
</script>
<style lang='scss' scoped>
.form {
  width: 560px;
  margin: 100px auto 0;
  background: #fff;
  padding: 50px;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
}
.setpass {
  text-align: center;
  padding-bottom: 20px;
}
</style>
