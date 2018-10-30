<template>
<div class="">
    <div id="wealth" v-if="showMember" >
        <div class="title">
            <div class="text">管理员</div>
        </div>
        <div class="box bgwhite" style="padding-bottom:100px;">
            <div class="main">
                <div class="first1">
                    <img width="128" height="128" :src="userInfo.headPortrait">

                </div>
                <div class="first2">
                    <el-row>
                        <el-col>
                            名称：{{userInfo.name}}
                        </el-col>
                        <el-col>手机：{{userInfo.account}}</el-col>
                        <el-col>岗位:{{userInfo.postName}}</el-col>
                        <el-col>部门：{{userInfo.deptName}}</el-col>
                        <el-col class="only" style="width:500px">
                            <el-button @click="inviteCode1">邀请码</el-button>
                            <el-input class="mr1" v-model="ma">
                                <el-button @click="changeCode" slot="append" icon="el-icon-edit"></el-button>
                            </el-input>
                           <el-button type="primary" @click="showMember = false">发送</el-button>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="main2">
                <el-row :gutter="20" style="width:800px"> 
                    <el-col :span="4" style="width:200px">
                        <router-link to="/business/member">
                            <img src="../../../assets/images/administrator/job.png">
                            <span>人员信息</span>
                        </router-link>
                    </el-col>  
                </el-row>
            </div>
        </div>
    </div>
    <menber v-if="!showMember" @sendCode="sendCode"></menber>
</div> 
</template>
<script>
import menber from "./memberModel";
import menber1 from "./member";
export default {
  components: {
    menber
  },
  data() {
    return {
      userInfo: {},
      showMember: true,
      organInfo: {},
      ma: ""
    };
  },
  methods: {
    sendCode(e) {
      console.log(this.organInfo);
      this.showMember = true;
      if (e) {
        let data = {
          token: this.$getkey(),
          userIds: e.join(","),
          organId: this.organInfo.guid
        };
        this.$ajax(
          `${this.subUrl.user}/admin/resendInvite`,
          data,
          res => {
            this.$dialog.toast({ mes: "重发邀请码成功", icon: "success" });
          },
          this
        );
      }
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
    margin-top: 10px;
    background: #fff;
    width: 98%;
    margin-left: 1%;
    height: 100%;
    .main {
      padding-top: 20px;
      margin-left: 2%;
      width: 96%;
      .first1 {
        width: 20%;

        text-align: right;
        img {
          border-radius: 50%;
        }
      }
      .first2 {
        width: 60%;
        width: 30%;

        margin-left: 20px;
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
              width: 45%;
              margin-left: 15px;
            }
          }
        }
      }
    }
    .main2 {
      width: 100%;
      .el-row {
        .el-col {
          margin-top: 10px;
          text-align: center;
          img {
            vertical-align: middle;
          }
          span {
            margin-left: 10px;
            font-size: 20px;
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
