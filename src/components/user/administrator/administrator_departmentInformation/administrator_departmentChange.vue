<template>
     <div id="wealth">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/administrator' }">管理员</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path:'/user/administrator/administrator_departmentInformation/administrator_departmentInformation'}">部门管理</el-breadcrumb-item>
                <el-breadcrumb-item v-if="type==1"><a>新增成员</a></el-breadcrumb-item>
                <el-breadcrumb-item v-if="type==2"><a>修改信息</a></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="main">
                <div class="first1">
                    <h3 v-if="type==1">新增成员</h3>
                    <h3 v-if="type==2">修改信息</h3>
                </div>
                <div class="tips">*新增时平台会短信通知该成员账号和初始密码，无需再次注册直接登录</div>
                <div class="first2">
                    <h4>行政部</h4>
                    <span>姓名：</span>
                    <el-input :maxlength="20" v-model="name"></el-input>
                    <span>手机号</span>
                    <el-input :maxlength="11" v-model="phone"></el-input> 
                </div>
                <el-collapse v-model="activeName" accordion>
                    <el-collapse-item title="职务" name="1">
                        <div v-for="(item,index) in data1" :key="item.guid">
                            <span>{{item.postName}}</span>
                            <el-button type="text" @click="select1(index,item.guid)">{{item.status}}</el-button>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="新增权限" name="2">
                        <div v-for="(item1,index) in data2" :key="item1.guid">
                            <span>{{item1.postName}}</span>
                            <el-button type="text" @click="select2(index,item1.guid)">{{item1.status}}</el-button>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <el-button style="width:100%;margin-top:10px;" @click="submit">提交</el-button>
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
      data1: [],
      data2: [],
      data3: [],
      data4: [],
      activeName: "",
      type: "",
      organId: "",
      name: "",
      phone: "",
      title: "",
      guid: "",
      userId: "",
      all1: [],
      all2: [],
      queryData: []
    };
  },
  methods: {
    getDetails() {
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/admin/postManage/postList`,
        data,
        res => {
          if (this.type == 2) {
            this.data1 = res.data.fixedPost;
            for (var i = 0; i < this.data1.length; i++) {
              for (var b = 0; b < this.queryData.length; b++) {
                if (this.queryData[b] == this.data1[i].guid) {
                  this.data1[i].status = "已选择";
                  this.all1.push(this.data1[i].guid);
                } else {
                  if (this.data1[i].status !== "已选择") {
                    this.data1[i].status = "未选择";
                  }
                }
              }
            }
            this.data3 = this.data1;

            this.data2 = res.data.dynamicPost;
            for (var a = 0; a < this.data2.length; a++) {
              for (var c = 0; c < this.queryData.length; c++) {
                if (this.queryData[c] == this.data2[a].guid) {
                  this.data2[a].status = "已选择";
                  this.all2.push(this.data2[a].guid);
                } else {
                  if (this.data2[a].status !== "已选择") {
                    this.data2[a].status = "未选择";
                  }
                }
              }
            }
            this.data4 = this.data2;
          } else if (this.type == 1) {
            this.data1 = res.data.fixedPost;
            for (var i = 0; i < this.data1.length; i++) {
              this.data1[i].status = "未选择";
            }
            this.data3 = this.data1;
            this.data2 = res.data.dynamicPost;
            for (var a = 0; a < this.data2.length; a++) {
              this.data2[a].status = "未选择";
            }
            this.data4 = this.data2;
          }
        },
        this
      );
    },
    select1(index, guid) {
      this.data1 = [];
      if (this.data3[index].status == "未选择") {
        this.data3[index].status = "已选择";
        for (var i = 0; i < this.data3.length; i++) {
          if (this.data3[i].guid !== this.data3[index].guid) {
            this.data3[i].status = "未选择";
          }
        }
        this.all1 = [];
        this.all1.push(guid);
      }
      this.data1 = this.data3;
      console.log(this.all1);
    },
    select2(index, guid) {
      this.data2 = [];
      if (this.data4[index].status == "未选择") {
        this.data4[index].status = "已选择";
        this.all2.push(guid);
      } else {
        this.data4[index].status = "未选择";
        for (var i = 0; i < this.all2.length; i++) {
          if (this.all2[i] == guid) {
            this.all2.splice(i, 1);
          }
        }
      }
      this.data2 = this.data4;
    },
    submit() {
      if (this.type == 1) {
        if (
          /^1[3|4|5|8][0-9]\d{4,8}$/.test(this.phone) &&
          this.name !== undefined &&
          this.all1.length > 0
        ) {
          var a;
          if (this.all1.length > 0) {
            if (this.all2.length > 0) {
              a = this.all1.join(",") + "," + this.all2.join(",");
            } else {
              a = this.all1.join(",");
            }
          }
          var data = {
            token: this.$getkey(),
            organId: this.organInfo.guid,
            DepartmentId: this.guid,
            name: this.name,
            account: this.phone,
            postIdList: a
          };
          this.$ajax(
            `${this.subUrl.user}/admin/deptManage/addStaff`,
            data,
            res => {
              if (res.code == 1) {
                this.$message({
                  message: "新增成功",
                  type: "success"
                });
                this.$router.push({
                  path:
                    "/user/administrator/administrator_departmentInformation/administrator_departmentInformation"
                });
              } else {
                this.$message({
                  message: "新增失败",
                  type: "success"
                });
              }
            },
            this
          );
        } else {
          console.log(this.all1.length);
          if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.phone)) {
            this.$message({
              message: "手机格式不正确",
              type: "error"
            });
          } else if (this.name == undefined) {
            this.$message({
              message: "姓名不能为空",
              type: "error"
            });
          } else if (this.all1.length < 1) {
            this.$message({
              message: "固定岗位最少选择一个",
              type: "error"
            });
          }
          // else if(this.all2.length<1){
          //    this.$message({
          //         message: '新增岗位最少选择一个',
          //         type: 'error'
          //     });
          // }
        }
      } else {
        if (
          /^1[3|4|5|8][0-9]\d{4,8}$/.test(this.phone) &&
          this.name !== undefined &&
          this.all1.length > 0 &&
          this.all2.length > 0
        ) {
          var a = this.all1.join(",") + "," + this.all2.join(",");
          var data = {
            token: this.$getkey(),
            organId: this.organInfo.guid,
            userId: this.userId,
            name: this.name,
            account: this.phone,
            postIdList: a
          };
          this.$ajax(
            `${this.subUrl.user}/admin/deptManage/editStaff`,
            data,
            res => {
              if (res.code == 1) {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$router.push({
                  path:
                    "/user/administrator/administrator_departmentInformation/administrator_departmentInformation"
                });
              } else {
                this.$message({
                  message: "修改失败",
                  type: "success"
                });
              }
            },
            this
          );
        } else {
          if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.phone)) {
            this.$message({
              message: "手机格式不正确",
              type: "error"
            });
          } else if (this.name == undefined) {
            this.$message({
              message: "姓名不能为空",
              type: "error"
            });
          } else if (this.all1.length < 1) {
            this.$message({
              message: "固定岗位最少选择一个",
              type: "error"
            });
          } else if (this.all2.length < 1) {
            this.$message({
              message: "新增岗位最少选择一个",
              type: "error"
            });
          }
        }
      }
    },
    getMainAll() {
      var data = {
        token: this.$getkey(),
        organId: this.organId,
        keyword: this.name,
        deptId: this.guid
      };
      this.$ajax(
        `${this.subUrl.user}/admin/deptManage/organDepartmentInfo`,
        data,
        res => {
          var a = [];
          a = res.data[0].empList;
          for (var i = 0; i < a.length; i++) {
            if (a[i].userName == this.name) {
              this.queryData = a[i].postIds;
            }
          }
          this.getDetails();
        },
        this
      );
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
    this.type = this.$route.query.type;
    this.organId = this.$route.query.organId;
    this.name = this.$route.query.name;
    this.userId = this.$route.query.userId;
    this.phone = this.$route.query.phone;
    this.title = this.$route.query.title;
    this.guid = this.$route.query.guid;
    this.getMainAll();
  }
};
</script>
<style lang="scss" scoped>
#wealth {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: auto;
  .tips {
    color: #ec0000;
    line-height: 2;
  }
  .box {
    height: 100%;
    margin-top: 10px;
    background: #fff;
    .main {
      padding:20px 10px;
      width: 600px;
      .first1 {
        line-height: 2;
        display: none;
      }
      .first2 {
        h4 {
          margin-bottom: 10px;
        }
        .el-input {
          width: 100%;
          margin: 5px 0;
        }
      }
      .el-collapse {
        .el-collapse-item {
          div {
            padding: 5px 0;
            position: relative;
            span {
              display: inline-block;
              width: 70%;
            }
            .el-button {
              position: absolute;
              right: 0;
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