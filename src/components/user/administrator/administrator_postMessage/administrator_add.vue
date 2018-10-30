<template>
     <div id="wealth">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/administrator' }">管理员</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path:'/user/administrator/administrator_postMessage/administrator_postMessage'}">岗位管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{$route.params.name == '1'?'添加岗位':'编辑岗位'}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="main">
                <div class="first1">
                    <h3>岗位名称</h3>
                    <el-input v-model="postName"></el-input>
                </div>
                <div class="first2">
                    <h3>分配权限</h3>
                    <div class="clear"></div>
                    <div>
                        <el-tree :data="data1" node-key="guid" ref="tree" :default-checked-keys='chooseEd' accordion show-checkbox :props="defaultProps"></el-tree>
                    </div>
                    <div>
                        <el-button v-if="$route.params.name=='1'" style="text-align:center;" @click="getCheckedKeys">确定添加</el-button>
                        <el-button v-if="$route.params.name!=='1'" style="text-align:center;" @click="getCheckedKeys">确定修改</el-button>
                    </div>
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
      postName: "",
      data: [],
      data1: [],
      chooseEd: [],
      tempData: [],

      defaultProps: {
        id: "id",
        children: "children",
        label: "label",
        pid: "pid",
        guid: "guid"
      },
      id: 1
    };
  },
  methods: {
    getRoot(postId) {
      var data = {
        postId
      };
      if (postId == "0") return;
      this.$ajax(`${this.subUrl.user}/admin/postManage/allocate`, data, res => {
        console.log(res.data, this.tempData);
        for (var v of res.data) {
          for (var s of this.tempData) {
            if (v.functionId == s.guid) {
              this.chooseEd.push({
                id: 1,
                guid: v.functionId,
                label: v.name
              });
            }
          }
        }
        console.log(this.chooseEd);
        this.$refs.tree.setCheckedNodes(this.chooseEd);
      });
    },
    getDetails(postId) {
      if (this.$route.params.name !== "1") {
        this.postName = this.$route.params.name;
      }
      var data = {
        organType: this.userInfo.organType
      };
      if (postId) data.postId = postId;
      this.$ajax(
        `${this.subUrl.user}/admin/postManage/permissionNodes`,
        data,
        res => {
          this.data = res.data;
          if (postId) {
            console.log(this.chooseEd);
            console.log(this.tempData, res.data, "xxx");
          } else {
            this.tempData = res.data;
            if (this.$route.params.guid) {
              this.getRoot(this.$route.params.guid);
            }
            // 一级
            for (var i = 0; i < this.data.length; i++) {
              if (this.data[i].pid == 0) {
                var n = {};
                n.id = this.id;
                n.label = this.data[i].name;
                n.children = [];
                n.pid = this.data[i].pid;
                n.guid = this.data[i].guid;
                this.data1.push(n);
                this.id = this.id + 1;
              }
            }
            //二级
            for (var a = 0; a < this.data1.length; a++) {
              for (var b = 0; b < this.data.length; b++) {
                if (this.data1[a].guid == this.data[b].pid) {
                  var n = {};
                  n.id = this.id;
                  n.label = this.data[b].name;
                  n.children = [];
                  n.pid = this.data[b].pid;
                  n.guid = this.data[b].guid;

                  this.data1[a].children.push(n);
                  this.id = this.id + 1;
                }
              }
            }
            //三级
            for (var c = 0; c < this.data1.length; c++) {
              for (var d = 0; d < this.data1[c].children.length; d++) {
                for (var e = 0; e < this.data.length; e++) {
                  if (this.data1[c].children[d].guid == this.data[e].pid) {
                    var n = {};
                    n.id = this.id;
                    n.label = this.data[e].name;
                    n.children = [];
                    n.pid = this.data[e].pid;
                    n.guid = this.data[e].guid;
                    this.data1[c].children[d].children.push(n);

                    this.id = this.id + 1;
                  }
                }
              }
            }
            //四级
            for (var f = 0; f < this.data1.length; f++) {
              for (var g = 0; g < this.data1[f].children.length; g++) {
                for (
                  var h = 0;
                  h < this.data1[f].children[g].children.length;
                  h++
                ) {
                  for (var j = 0; j < this.data.length; j++) {
                    if (
                      this.data1[f].children[g].children[h].guid ==
                      this.data[j].pid
                    ) {
                      var n = {};
                      n.id = this.id;
                      n.label = this.data[j].name;
                      n.children = [];
                      n.pid = this.data[j].pid;
                      n.guid = this.data[j].guid;
                      this.data1[f].children[g].children[h].children.push(n);
                      this.id = this.id + 1;
                    }
                  }
                }
              }
            }
          }
        },
        this
      );
    },
    getCheckedKeys() {
      if (this.$route.params.name == "1") {
        if (this.postName == "") {
          this.$message({
            message: "岗位名称不能为空",
            type: "error"
          });
        } else if (this.$refs.tree.getCheckedKeys().length == 0) {
          this.$message({
            message: "权限不能为空",
            type: "error"
          });
        } else {
          var a = this.$refs.tree.getCheckedKeys();
          a = a.join(",");
          var data = {
            token: this.$getkey(),
            organId: this.organInfo.guid,
            postName: this.postName,
            functionIds: a
          };
          this.$ajax(
            `${this.subUrl.user}/admin/postManage/addPost`,
            data,
            res => {
              if (res.code == 1) {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.$router.push({
                  path:
                    "/user/administrator/administrator_postMessage/administrator_postMessage"
                });
              }
            },
            this
          );
        }
      } else {
        if (this.postName == "") {
          this.$message({
            message: "岗位名称不能为空",
            type: "error"
          });
        } else if (this.$refs.tree.getCheckedKeys().length == 0) {
          this.$message({
            message: "权限不能为空",
            type: "error"
          });
        } else {
          var a = this.$refs.tree.getCheckedKeys();
          a = a.join(",");
          var data = {
            token: this.$getkey(),
            postId: this.$route.params.guid,
            postName: this.postName,
            functionIds: a
          };
          this.$ajax(
            `${this.subUrl.user}/admin/postManage/editPost`,
            data,
            res => {
              if (res.code == 1) {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$router.go(-1);
              }
            },
            this
          );
        }
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
    this.getDetails();
  }
};
</script>
<style lang="scss" scoped>
.clear {
  clear: both;
}
#wealth {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: auto;
  .box {
    height: 100%;
    margin-top: 10px;
    background: #fff;
    overflow: auto;
    .main {
      width: 60%;
      margin-left: 10%;
      padding-top: 20px;
      .first2 {
        text-align: center;
        h3 {
          float: left;
        }
        .el-button {
          margin-top: 15px;
        }
      }
    }
  }
}
.clear {
  clear: both;
}
</style>