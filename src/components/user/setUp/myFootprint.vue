<template>
    <div class="box">
        <div class="first">
           <div class="topFix">
              <el-input @change="getMain(1)" class="w25" placeholder="请输入要搜索内容" v-model="keyword">
                <i slot="suffix" class="el-icon-search el-input__icon"></i>
              </el-input>
              <el-button @click="empty">清空个人足迹</el-button>
           </div>
            <el-table height="calc(100% - 50px)" border :data="tableData" style="width: 100%">
                <el-table-column prop="createTime" label="创建时间" min-width="23%"></el-table-column>
                <el-table-column prop="method" label="方法" min-width="23%"></el-table-column>
                <el-table-column prop="optName" label="操作" min-width="23%"></el-table-column>
                <el-table-column prop="remark" label="备注" :formatter="formatData" min-width="23%"></el-table-column>
                <el-table-column label="删除" fixed="right" width="120px">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="deleteItem(scope)">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <div class="paginationRight">
              <el-pagination v-show="pageCount>0" background layout="prev, pager, next" @current-change="select" :total="pageCount"></el-pagination>
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
      tableData: [],
      pageCount: 1,
      keyword: ""
    };
  },
  methods: {
    // 设置数据
    deleteItem({ row, index }) {
      this.$confirm("是否删除当前足迹", "提示", { type: "warning" })
        .then(res => {
          let data = {
            token: this.$getkey(),
            trackId: row.guid
          };
          this.$ajax(
            `${this.subUrl.user}/user/deleteTrack`,
            data,
            res => {
              this.$message.success("删除成功");
              this.getMain();
            },
            this
          );
        })
        .catch(() => {});
    },
    empty() {
      this.$confirm("是否清空足迹", "提示", { type: "warning" })
        .then(res => {
          let data = {
            token: this.$getkey()
          };
          this.$ajax(
            `${this.subUrl.user}/user/deleteUserTrack`,
            data,
            res => {
              this.$message.success("清空成功");
              this.getMain();
            },
            this
          );
        })
        .catch(() => {});
    },
    formatData(a, b, c) {
      return c ? c : "无";
    },
    getMain(page) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        keyword: this.keyword,
        pageNo: page
      };
      this.$ajax(
        `${this.subUrl.user}/user/myTrack`,
        data,
        res => {
          this.pageCount = res.data.pageCount * 10;
          this.tableData = res.data.list;
        },
        this
      );
    },
    select(val) {
      this.getMain(val);
    },
    handleClick() {
      this.$confirm("是否清空足迹, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var data = {
            token: this.$getkey(),
            userId: this.userInfo.guid
          };
          this.$ajax(
            `${this.subUrl.user}/user/deleteUserTrack`,
            data,
            res => {
              if (res.code == 1) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getMain(1);
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
    this.getMain();
  }
};
</script>
<style lang="scss" scoped>
.box {
  height: 100%;
  background: #fff;
  position: relative;
  overflow: visible !important;
  .first {
    height: 100%;
    position: relative;
    .topFix {
      position: absolute;
      top: -50px;
      height: 50px;
      overflow: hidden;
      z-index: 3;
      right: 10px;
    }
    .el-button {
      margin-left: 10px;
    }
  }
}
.clear {
  clear: both;
}
</style>