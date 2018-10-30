<template>
     <div id="wealth">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/administrator' }">管理员</el-breadcrumb-item>
                <el-breadcrumb-item>岗位管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="main">
                <div class="first1">
                    <h3>固定岗位</h3>
                    <el-button @click="goAdd">添加</el-button>    
                </div>
                <div class="first2">
                    <h3>新增岗位</h3>
                    <el-button @click="delAll">全删</el-button>      
                </div>
                <div class="clear"></div>
                <el-table class="table" :data="tableData1" style="width: 48%;margin-right:2%;">
                    <el-table-column prop="postName" label="职位"
                        min-width="50%">
                    </el-table-column>
                </el-table>
                <el-table class="table" :data="tableData2" style="width: 50%">
                    <el-table-column prop="postName" label="职位"
                        min-width="60%">
                    </el-table-column>
                    <el-table-column prop="date" label="操作"
                        min-width="30%">
                        <template slot-scope="scope">
                            <el-button @click="delHandleClick(scope.row)" type="text" size="small">删除</el-button>
                            <el-button @click="changeHandleClick(scope.row)" type="text" size="small">修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>  
                
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
      tableData1: [],
      tableData2: [],
      tableData3: [],
      tableData4: [],
      dAll: [],
      a: ""
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
          this.tableData1 = [];
          this.tableData2 = [];
          this.tableData1 = res.data.fixedPost;
          this.tableData4 = res.data.dynamicPost;
          this.tableData3 = res.data.dynamicPost;
          console.log(this.tableData2);
          for (var i = 0; i < this.tableData3.length; i++) {
            if (this.tableData3[i].type < 6) {
              this.tableData1.push(this.tableData3[i]);
            }
          }
          for (var b = 0; b < this.tableData4.length; b++) {
            if (this.tableData4[b].type > 6) {
              this.tableData2.push(this.tableData4[b]);
            }
          }
          for (var a = 0; a < this.tableData2.length; a++) {
            this.dAll.push(this.tableData2[a].guid);
          }
          console.log(this.dAll);
        },
        this
      );
    },
    goAdd() {
      this.$router.push({
        path:
          "/user/administrator/administrator_postMessage/administrator_add/1/0"
      });
    },
    changeHandleClick(scope) {
      this.$router.push({
        path:
          "/user/administrator/administrator_postMessage/administrator_add/" +
          scope.postName +
          "/" +
          scope.guid
      });
    },
    delAll() {
      this.a = this.dAll.join(",");
      this.$confirm("此操作将永久删除所有岗位, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var data = {
            token: this.$getkey(),
            postIds: this.a
          };
          this.$ajax(
            `${this.subUrl.user}/admin/postManage/batchDelPost`,
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
    delHandleClick(scopea) {
      this.$confirm("此操作将永久删除该岗位, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var data = {
            token: this.$getkey(),
            postId: scopea.guid
          };
          this.$ajax(
            `${this.subUrl.user}/admin/postManage/delPost`,
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
  overflow: scroll;
  .box {
    height: 100%;
    margin-top: 10px;
    overflow: auto;
    background: #fff;
    padding: 0 20px;
    .main {
      width: 1000px;
      padding-top: 20px;
      .first1 {
        float: left;
        width: 48%;
        margin-right: 2%;
        h3 {
          float: left;
          margin-top: 7px;
        }
        .el-button {
          float: right;
        }
      }
      .first2 {
        width: 50%;
        float: left;
        h3 {
          float: left;
          margin-top: 7px;
        }
        .el-button {
          float: right;
          margin-bottom: 5px;
        }
      }
      .table {
        float: left;
      }
    }
  }
}
.clear {
  clear: both;
}
</style>