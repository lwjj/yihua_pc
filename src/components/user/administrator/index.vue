<template>
    <div id="wealth">
        <div class="title">
            <div class="text">管理员</div>
        </div>
        <div class="box">
            <div class="main">
                <div class="first1">
                    <img :src="userInfo.headPortrait">
                </div>
                <div class="first2">
                    <el-row>
                        <el-col>
                            名称：{{userInfo.name}}
                        </el-col>
                        <el-col>手机：{{userInfo.account}}</el-col>
                        <el-col>岗位：{{userInfo.postName}}</el-col>
                        <el-col>部门：{{userInfo.deptName}}</el-col>
                        <el-col v-if="userInfo.organType == 3" class="manageTel">
                          客服电话设置：
                          <el-input :maxlength="11" v-model='info.tel'></el-input>
                          <el-button @click="changePhone">修改</el-button>
                        </el-col>
                        <el-col class="only">
                            <el-button @click="inviteCode1">邀请码</el-button>
                            <el-input v-model="ma">
                                <el-button @click="changeCode" slot="append" icon="el-icon-edit"></el-button>
                            </el-input>
                            <router-link to="/user/administrator/administrator_departmentOfChoice/administrator_departmentOfChoice">
                                <el-button style="margin-left:10px;" >发送</el-button>
                            </router-link>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="main2">
                <div>
                    <router-link to="/user/administrator/administrator_latestNews/administrator_all">
                        <img src="../../../assets/images/administrator/message.png">
                        <p>最新消息</p>
                    </router-link>
                </div>
                <div>
                    <router-link to="/user/administrator/administrator_postMessage/administrator_postMessage">
                        <img src="../../../assets/images/administrator/job.png">
                        <p>岗位管理</p>
                    </router-link>
                </div>
                <div>
                    <router-link to="/user/administrator/administrator_departmentInformation/administrator_departmentInformation">
                        <img src="../../../assets/images/administrator/bumen.png">
                        <p>部门管理</p>
                    </router-link>
                </div>
                <div>
                    <router-link to="/user/administrator/administrator_accountManagement/administrator_accountManagement">
                        <img src="../../../assets/images/administrator/account.png">
                        <p>机构信息</p>
                    </router-link>
                </div>
                <div>
                    <router-link to="/user/administrator/administrator_about/administrator_about">
                        <img src="../../../assets/images/administrator/about.png">
                        <p>关于</p>
                    </router-link>
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
      info: {
        tel: ""
      },
      ma: ""
    };
  },
  methods: {
    changePhone() {
      if (!this.info.tel) return this.$message.error("请输入手机号");
      if (!/^1[3456789]\d{9}$/.test(this.info.tel)) return this.$message.error("请输入正确的手机号");
      let data = {
        token:this.$getkey(),
        tel:this.info.tel,
      }
      this.$ajax(`${this.subUrl.user}/admin/accountManage/setScTel`,data,res=>{
        this.$message.success('设置成功');
      },this)
    },
    getPhone() {
      this.$ajax(
        `${this.subUrl.user}/admin/accountManage/getScTel`,
        { token: this.$getkey() },
        res => {
          this.info = res.data;
        },
        this
      );
    },
    inviteCode1() {
      this.ma = "";
      var a = [];
      for (var i = 0; i < 6; i++) {
        a.push(Math.floor(Math.random() * 10));
      }
      this.ma = a.join("");
      this.changeCode();
    },
    changeCode() {
      if (/^[0-9]{6}$/.test(this.ma)) {
        var data = {
          token: this.$getkey(),
          organId: this.organInfo.guid,
          inviteCode: this.ma
        };
        this.$ajax(
          `${this.subUrl.user}/admin/editShibboleth`,
          data,
          res => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.$set(this.organInfo, "inviteCode", this.ma);
              localStorage.setItem(
                "organInfo",
                encodeURIComponent(JSON.stringify(this.organInfo))
              );
            } else {
              this.$message({
                type: "error",
                message: "修改失败!"
              });
            }
          },
          this
        );
      } else {
        this.$message({
          type: "error",
          message: "邀请码长度为六位且全为数字!"
        });
      }
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.ma = this.organInfo.inviteCode;
    this.getPhone();
    console.log(this.userInfo);
  }
};
</script>
<style lang="scss" scoped>
.manageTel {
  display: flex;
  white-space: nowrap;
  align-items: center;
  width: 400px;
  & > * {
    margin-right: 10px;
  }
}
#wealth {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: auto;
  .box {
    margin-top: 10px;
    margin-right: 0 !important;
    background: #fff;
    width: 100% !important;
    height: 100%;
    .main {
      padding-top: 20px;
      .first1 {
        width: 20%;
        float: left;
        img {
          border-radius: 50%;
          width: 128px;
          height: 128px;
          margin: 25px;
        }
      }
      .first2 {
        margin-left: 20px;
        display: inline-block;
        .el-row {
          .el-col {
            margin-bottom: 30px;
            .bt {
              margin-left: 50px;
            }
          }
          .only {
            .el-button {
              float: left;
            }
            .el-input {
              float: left;
              width: 150px;
              margin-left: 15px;
            }
          }
        }
      }
    }
    .main2 {
      div {
        float: left;
        width: 130px;
        height: 80px;
        text-align: center;
      }
    }
  }
}
.clear {
  clear: both;
}
</style>
