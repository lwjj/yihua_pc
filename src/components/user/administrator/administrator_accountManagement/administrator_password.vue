<template>
     <div id="wealth">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/administrator' }">
                    管理员
                </el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/user/administrator/administrator_accountManagement/administrator_accountManagement' }">
                    账户管理
                    </el-breadcrumb-item>
                <el-breadcrumb-item>
                    密码设置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="main">
                <div class="first1">
                    <el-button @click="selectType(1)">通过原密码修改</el-button>
                    <el-button @click="selectType(2)">手机短信初始化密码</el-button>
                </div>
                <div class="first1">
                <el-row v-if="type==1">
                    <el-col style="text-align:center;">
                        <h4>密码修改</h4>
                    </el-col>
                    <el-col style="font-size:13px;color:#ddd;">为了保障你的数据安全，修改密码前请填写原密码</el-col>
                    <el-col>
                        <span>原密码</span>
                        <el-input v-model="pwd1" placeholder="请输入"></el-input>
                    </el-col>
                    <el-col>
                        <span>设置新密码</span>
                        <el-input v-model="pwd2" type="password" placeholder="请输入密码"></el-input>
                    </el-col>
                    <el-col>
                        <span>确认新密码</span>
                        <el-input v-model="pwd3" type="password" placeholder="请输入密码"></el-input>
                    </el-col>
                    <el-col style="text-align:center;">
                        <el-button style="width:50%;" @click="forget(1)">确定</el-button>
                    </el-col>
                </el-row>
                <el-row v-if="type==2">
                    <el-col style="text-align:center;">
                        <h4>忘记密码</h4>
                    </el-col>
                    <el-col>
                        <span>请输入手机号</span>
                        <el-input v-model="forget1" placeholder="请输入手机号"></el-input>
                    </el-col>
                    <el-col>
                        <span>请输入验证码</span>
                        <el-input v-model="forget2" type="password" placeholder="请输入验证码">
                             <el-button slot="append" @click="verification" :disabled="ma">{{countdown}}</el-button>
                        </el-input>
                    </el-col>
                    <el-col>
                        <span>新密码</span>
                        <el-input v-model="forget3" type="password" placeholder="请输入6-12新密码"></el-input>
                    </el-col>
                    <el-col>
                        <span>确认新密码</span>
                        <el-input v-model="forget4" type="password" placeholder="请再次输入密码"></el-input>
                    </el-col>
                    <el-col style="text-align:center;">
                        <el-button style="width:50%;" @click="forget(2)">确定</el-button>
                    </el-col>
                </el-row>    
                </div>
            </div>
        </div>
     </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      organInfo: {},
      pwd1: "",
      pwd2: "",
      pwd3: "",
      type: 1,
      forget1: "",
      forget2: "",
      forget3: "",
      forget4: "",
      countdown: "发送验证码",
      ma: false
    };
  },
  methods: {
    verification() {
      if (this.forget1 !== "" && this.forget1.length == 11) {
        var data = {
          account: this.forget1
        };
        this.$ajax(
          `${this.subUrl.user}/user/accountVerify`,
          data,
          res => {
            if (res.code == 1) {
              this.$message({
                message: "验证码已发送",
                type: "success"
              });
              this.countdown = 60;
              this.countdown1();
            }
          },
          this
        );
      } else {
        if (this.forget1 == "") {
          this.$message({
            message: "手机号不能为空",
            type: "error"
          });
        } else {
          this.$message({
            message: "请输入正确手机号格式",
            type: "error"
          });
        }
      }
    },
    selectType(num) {
      if (num == 1) {
        this.type = 1;
        this.forget1 = "";
        this.forget2 = "";
        this.forget3 = "";
        this.forget4 = "";
      } else {
        this.type = 2;
        this.pwd1 = "";
        this.pwd2 = "";
        this.pwd3 = "";
      }
    },
    forget(num) {
      if (num == 2) {
        if (
          this.forget4.length > 5 &&
          this.forget4.length < 13 &&
          this.forget3 == this.forget4 &&
          this.forget2.length == 6
        ) {
          var data = {
            account: this.forget1,
            verificationCode: this.forget2,
            newPassword: this.forget4
          };
          this.$ajax(
            `${this.subUrl.user}/user/resetPassword`,
            data,
            res => {
              if (res.code == 1) {
                if (res.code == 1) {
                  this.$message({
                    message: "修改成功",
                    type: "suceess"
                  });
                  this.$router.push({
                    path:
                      "/user/administrator/administrator_accountManagement/administrator_accountManagement"
                  });
                }
              } else {
                this.$message({
                  message: "验证码不正确",
                  type: "error"
                });
              }
            },
            this
          );
        } else {
          if (this.forget4.length < 6 && this.forget4.length > 12) {
            this.$message({
              message: "请输入正确的密码格式",
              type: "error"
            });
          } else if (this.forget3 !== this.forget4) {
            this.$message({
              message: "两次密码不一致",
              type: "error"
            });
          } else if (this.forget2.length !== 6) {
            this.$message({
              message: "验证码格式不对",
              type: "error"
            });
          }
        }
      } else if (num == 1) {
        if (
          this.pwd2 == this.pwd3 &&
          (this.pwd2.length > 5 && this.pwd2.length < 13) &&
          (this.pwd1.length > 5 && this.pwd1.length < 13)
        ) {
          var data = {
            userId: this.userInfo.guid,
            password: this.pwd1,
            newPassword: this.pwd3,
            token: this.$getkey()
          };
          this.$ajax(
            `${this.subUrl.user}/user/updatePassword`,
            data,
            res => {
              if (res.code == 1) {
                this.$message({
                  message: "修改成功",
                  type: "suceess"
                });
                this.$router.push({
                  path:
                    "/user/administrator/administrator_accountManagement/administrator_accountManagement"
                });
              } else {
                this.$message({
                  message: "原密码不正确",
                  type: "error"
                });
              }
            },
            this
          );
        } else {
          if (this.pwd2 !== this.pwd3) {
            this.$message({
              message: "两次密码不一致",
              type: "error"
            });
          } else if (this.pwd1.length < 6 && this.pwd1.length > 12) {
            this.$message({
              message: "原密码格式不对",
              type: "error"
            });
          } else if (this.pwd2.length < 6 && this.pwd2.length > 12) {
            this.$message({
              message: "原密码格式错误",
              type: "error"
            });
          }
        }
      }
    },
    countdown1() {
      this.countdown--;
      t = setTimeout(this.countdown1, 1000);
      this.ma = true;
      if (this.countdown < 0) {
        this.countdown = "发送验证码";
        clearTimeout(t);
        this.ma = false;
      }
    }
  },
  updated() {},
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
  }
};
</script>
<style lang="scss" scoped>
#wealth {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: scroll;
  .box {
    height: 100%;
    margin-top: 10px;
    width: 98%;
    margin-left: 1%;
    background: #fff;
    .main {
      width: 25%;
      margin-left: 30%;
      padding-top: 100px;
      .first1 {
        margin-top: 10px;
        margin-bottom: 10px;
        .el-button {
          width: 47%;
        }
        .el-row {
          .el-col {
            margin-bottom: 10px;
          }
        }
      }
    }
  }
}
.clear {
  clear: both;
}
</style>