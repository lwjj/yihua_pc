<template>
     <div id="wealth">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/administrator' }">管理员</el-breadcrumb-item>
                <el-breadcrumb-item>部门管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="main">
                <div class="main-top">
                    <h3>部门管理</h3>
                    <el-button type="text" @click="popUp">添加</el-button>
                    <div class="clear"></div>
                </div>
                <div class="first1">
                    <el-collapse v-model="activeName" accordion>
                        <el-collapse-item v-for="item in data" :key="item.guid" :title=item.deptName :name=item.no>
                            <el-button type="text" @click="addDepartment(1,item.organId,item.guid,item.deptName)">添加员工</el-button>
                            <el-button type="text" @click="changeDepartment(item.organId,item.guid)">修改</el-button>
                            <el-button type="text" @click="delDepartment(item.organId,item.guid)">删除</el-button>
                            <div v-for="item1 in item.empList" :key="item1.userId">
                                <div class="information">
                                    <p>{{item1.userName}}<span>{{item1.account}}</span></p>
                                    <p>
                                        岗位：
                                        <i>
                                            {{item1.post}}
                                        </i>
                                    </p>
                                </div>
                                <div style="width:80px;float:right;border:0;">
                                    <el-button class="only1" type="text" @click="delEmployees(item1.userId)">删除</el-button>
                                    <el-button @click="addEmployees(2,item.organId,item.guid,item.deptName,item1.userName,item1.account,item1.userId)" class="only1" type="text">编辑</el-button>
                                    <div class="clear" style="border:0;"></div>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
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
      activeName: ""
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
          this.data = res.data;
          console.log(this.data);
          for (var i = 0; i < this.data.length; i++) {
            this.data[i].deptName =
              this.data[i].deptName + "(" + this.data[i].empList.length + ")";
          }
        },
        this
      );
    },
    popUp() {
      this.$prompt("添加部门请添加部门名称(长度为1-8)", "添加部门", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[\u4E00-\u9FA5]|[a-zA-Z0-9]{1,8}$/,
        inputErrorMessage: "格式不正确"
      })
        .then(({ value }) => {
          var data = {
            token: this.$getkey(),
            organId: this.organInfo.guid,
            departmentName: value
          };
          this.$ajax(
            `${this.subUrl.user}/admin/deptManage/addDepartment`,
            data,
            res => {
              if (res.code == 1) {
                this.$message({
                  type: "success",
                  message: "添加成功"
                });
                this.getDetails();
              } else {
                this.$message({
                  type: "error",
                  message: "添加失败"
                });
              }
            },
            this
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    delDepartment(organId1, guid1, userName, account) {
      this.$confirm("此操作将永久删除该部门, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var data = {
            token: this.$getkey(),
            organId: organId1,
            DepartmentId: guid1
          };
          this.$ajax(
            `${this.subUrl.user}/admin/deptManage/delDepartment`,
            data,
            res => {
              if (res.code == 1) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                this.getDetails();
              } else {
                this.$message({
                  type: "error",
                  message: "删除失败"
                });
              }
            },
            this
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addDepartment(num, organId1, guid1, deptName1) {
      this.$router.push({
        path:
          "/user/administrator/administrator_departmentInformation/administrator_departmentChange",
        name: "administrator_departmentChange",
        query: {
          type: num,
          guid: guid1,
          organId: organId1,
          title: deptName1
        }
      });
    },
    changeDepartment(organId1, guid1) {
      this.$prompt("请填写（长度为1-8）", "编辑部门名称", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[\u4E00-\u9FA5]|[a-zA-Z0-9]{1,8}$/,
        inputErrorMessage: "格式不正确"
      })
        .then(({ value }) => {
          var data = {
            token: this.$getkey(),
            organId: organId1,
            deptId: guid1,
            departmentName: value
          };
          this.$ajax(
            `${this.subUrl.user}/admin/deptManage/editDepartment`,
            data,
            res => {
              if (res.code == 1) {
                this.$message({
                  type: "success",
                  message: "编辑成功"
                });
                this.getDetails();
              } else {
                this.$message({
                  type: "error",
                  message: "编辑失败"
                });
              }
            },
            this
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    delEmployees(userId) {
      this.$confirm("此操作将永久删除该员工, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var data = {
            token: this.$getkey(),
            userIds: userId
          };
          this.$ajax(
            `${this.subUrl.user}/admin/deptManage/batchDelStaff`,
            data,
            res => {
              if (res.code == 1) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                this.getDetails();
              } else {
                this.$message({
                  type: "error",
                  message: "删除失败"
                });
              }
            },
            this
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addEmployees(
      num,
      organId1,
      guid1,
      deptName1,
      userName1,
      account1,
      userId1
    ) {
      this.$router.push({
        path:
          "/user/administrator/administrator_departmentInformation/administrator_departmentChange",
        name: "administrator_departmentChange",
        query: {
          type: num,
          guid: guid1,
          organId: organId1,
          title: deptName1,
          userId: userId1,
          name: userName1,
          phone: account1
        }
      });
    }
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
                float: left;
                width: 39px;
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