<template>
    <div class="library_box">
        <el-input placeholder="搜索" suffix-icon="el-icon-search" v-model="value2" style="width:200px; height:40px;position:absolute;top:-40px;right:150px;" @change="changeValue2"></el-input>
        <div class="library_box_table">
            <el-table ref="multipleTable" height="100%" @selection-change="handleSelectionChange" :data="tableData4" style="width:100%" border>
                <el-table-column type="selection" min-width="3%"></el-table-column>
                <el-table-column prop="title" label="标题" min-width="30%"></el-table-column>
                <el-table-column prop="bp" label="点数" min-width="15%"></el-table-column>
                <el-table-column prop="createDate" label="日期" min-width="25%"></el-table-column>
                <el-table-column prop="status" label="状态" min-width="13%">
                </el-table-column>  
                <el-table-column prop="operation" label="操作" min-width="7%">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="deleteRow(scope.$index,tableData4,scope.row)" type="text">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="kaId" label="详情" min-width="7%">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="goView(tableData4,scope.row)" type="text">
                            查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table> 
            <div class="choose flex jusB" style="align-items:center;">
                <div>
                    <el-button @click="toggleSelection">取消全选</el-button>
                    <el-button @click="deleteAll">删除</el-button>
                </div>
                <el-pagination v-if="pageCount" background class="center" style="margin-right:10px;padding:14px 0;float:right" layout="prev,pager,next" :total="pageCount" @current-change="handleCurrentChange" ></el-pagination>
            </div>
            <div style="clear:both"></div> 
        </div>
    </div>
    
</template>
<script>
export default {
  data() {
    return {
      tableData4: [],
      userInfo: {},
      organInfo: {},
      bp: 0,
      createDate: "",
      fine: 0,
      title: "",
      pageSize: 0,
      pageCount: 0,
      status: "",
      kaId: "",
      multipleSelection: [],
      allkaIds: [],
      value2: ""
    };
  },
  methods: {
    changeValue2() {
      this.collection(1);
    },
    handleCurrentChange(pageNo) {
      this.collection(pageNo);
    },
    goView(kaid, rows) {
      this.$router.push({
        name: "blackstone_view",
        params: { hid: rows.kaId, road: 1 }
      });
    },
    deleteRow(index, rows, kaid) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          var data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            type: 1,
            kaIds: kaid.kaId
          };
          this.$ajax(
            `${this.subUrl.bd}/knowAll/delLib`,
            data,
            res => {
              this.libraryType = res.data;
              this.$emit("refresh");
            },
            this
          );
          rows.splice(index, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    collection(pageNo) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        type: 1,
        pageSize: 7,
        pageNo: pageNo,
        keyword: this.value2
      };
      this.$ajax(
        `${this.subUrl.bd}/knowAll/myLib`,
        data,
        res => {
          this.libraryType = res.data;
          this.tableData4 = res.data.list;
          this.pageCount = Number(this.libraryType.pageCount) * 10;
          this.pageSize = this.tableData4.length;
          for (var i = 0; i < this.tableData4.length; i++) {
            if (this.tableData4[i].status == 0) {
              this.tableData4[i].status = "下架";
            } else if (this.tableData4[i].status == 1) {
              this.tableData4[i].status = "正常";
            } else if (this.tableData4[i].status == 2) {
              this.tableData4[i].status = "过期";
            }
          }
        },
        this
      );
    },
    toggleSelection() {
      this.$refs.multipleTable.clearSelection();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteAll() {
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.allkaIds.push(this.multipleSelection[i].kaId);
      }
      var a = this.allkaIds.join(",");
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            kaIds: a,
            type: 1
          };
          this.$ajax(
            `${this.subUrl.bd}/knowAll/delLib`,
            data,
            res => {
              if (res.code == 1) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.$emit('refresh');
              } else {
                this.$message({
                  type: "error",
                  message: "删除失败!"
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
    this.collection(1);
  }
};
</script>
<style lang="scss" scoped>
.library_box {
  height: auto;
  background: #fff;
  height: calc(100% - 50px);
  padding-top: 5px;
  position: relative;
  .library_box_table {
    position: absolute;
    top: 10px;
    bottom: 50px;
    left: 0;
    right: 0;
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
    .choose {
      height: 50px;
    }
  }
}
</style>
