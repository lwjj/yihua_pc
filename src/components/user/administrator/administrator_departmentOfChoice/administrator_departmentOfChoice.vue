<template>
     <div id="wealth">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/administrator' }">管理员</el-breadcrumb-item>
                <el-breadcrumb-item>发送邀请码</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="main">
                <div class="main-top">
                    <h3>发送</h3>
                </div>
                <div class="first1">
                    <el-collapse v-model="activeName" accordion>
                        <el-collapse-item v-for="(item,index) in data" :key="item.guid" :title=item.deptName :name=item.no>
                            <div v-for="(item1,index1) in item.empList" :key="item1.userId">
                                <div class="information">
                                    <p>{{item1.userName}}<span>{{item1.account}}</span></p>
                                    <p>
                                        岗位：
                                        <i>
                                            {{item1.post}}
                                        </i>
                                    </p>
                                </div>
                                <el-button type="text" class="only1" @click="select(item1,index,index1)">{{item1.status}}</el-button>
                                <div class="clear"></div>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
                <div style="text-align:center;
                margin-top:10px;">
                    <el-button style=" width:100%;" @click="send">确定发送</el-button>
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
      data: {},
      data1: {},
      activeName: "",
      isSelect: "未选择",
      allcode: []
    };
  },
  methods: {
    getDetails() {
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/admin/deptManage/organDepartmentInfo`,
        data,
        res => {
          this.data1 = res.data;
          this.data = res.data;
          console.log(this.data);
          for (var i = 0; i < this.data.length; i++) {
            this.data[i].deptName =
              this.data[i].deptName + "(" + this.data[i].empList.length + ")";
            for (var a = 0; a < this.data[i].empList.length; a++) {
              this.data[i].empList[a].status = "未选择";
            }
          }
        },
        this
      );
    },
    select(item, index, index1) {
      this.data = {};
      if (this.data1[index].empList[index1].status == "选中") {
        this.data1[index].empList[index1].status = "未选中";
        this.data = this.data1;
        for (var i = 0; i < this.allcode.length; i++) {
          if (this.data1[index].empList[index1].userId == this.allcode[i]) {
            this.allcode.splice(i, 1);
          }
        }
      } else {
        this.data1[index].empList[index1].status = "选中";
        this.data = this.data1;
        this.allcode.push(this.data1[index].empList[index1].userId);
      }
    },
    send() {
      if (this.allcode.length > 0) {
        var a = this.allcode.join(",");
        var data = {
          token: this.$getkey(),
          organId: this.organInfo.guid,
          userIds: a
        };
        this.$ajax(
          `${this.subUrl.user}/admin/resendInvite`,
          data,
          res => {
            if (res.code == 1) {
              this.$message({
                message: "发送成功",
                type: "success"
              });
              this.$router.push({ path: "/user/administrator" });
            } else {
              this.$message({
                message: "发送失败",
                type: "success"
              });
            }
          },
          this
        );
      } else {
        this.$message({
          message: "请选择发送人员",
          type: "warning"
        });
      }
    }
  },
  updated() {
    console.log(this.allcode);
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getDetails();
  }
};
</script>
<style lang="scss" scoped>
#wealth {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: auto;
  .box {
    height: 100%;
    margin-top: 10px;
    background: #fff;
    .main {
      width: 50%;
      margin-left: 20%;
      padding-top: 20px;
      .main-top {
        h3 {
          text-align: center;
        }
        .el-button {
          float: right;
          width: 10%;
        }
      }
      .first1 {
        .el-collapse {
          .el-collapse-item {
            .el-button {
              margin: 0;
              width: 10%;
            }
            div.clear {
              border: 0;
            }
            div {
              border-bottom: 1px solid #ddd;
              padding-top: 5px;
              .information {
                float: left;

                border-bottom: 0;
                p span {
                  margin-left: 30px;
                }
              }
              .only1 {
                float: right;

                margin-top: 15px;
              }
            }
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