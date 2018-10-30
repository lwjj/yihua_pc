<template>
    <div id="wealth">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>我的助手</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="first1">
                    <el-table :data="tableData" style="width: 100%">
                        <el-table-column fixed prop="createDate" label="创建时间" min-width="25%"></el-table-column>
                        <el-table-column prop="name" label="姓名" min-width="25%"></el-table-column>
                        <el-table-column prop="account" label="电话" min-width="25%"></el-table-column>
                        <el-table-column fixed="right" label="操作" min-width="25%">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                      v-if="pageCount>0"
                        background
                        layout="prev, pager, next"
                        :total="pageCount"
                        @current-change="select"
                        style="margin-top:20px;text-align:right;">
                    </el-pagination>
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
      pageCount: 0
    };
  },
  methods: {
    getMain(pageNo) {
      if (pageNo == undefined) {
        pageNo = 1;
      }
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid,
        pageNo: pageNo,
        pageSize: 10
      };
      this.$ajax(
        `${this.subUrl.activity}/myhelper/myhelperList`,
        data,
        res => {
          this.tableData = res.data.list;
          this.pageCount = res.data.pageCount * 10;
        },
        this
      );
    },
    select(val) {
      this.getMain(val);
    },
    handleClick(row) {
      var data = {
        token: this.$getkey(),
        userId: row.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/myhelper/applyList`,
        data,
        res => {
          if (res.code == 1) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getMain(1);
          } else {
            this.$message({
              message: "删除失败，请联系管理员",
              type: "error"
            });
          }
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
    this.getMain();
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
    margin-top: 10px;
    margin-left: 1%;
    height: 100%;
    background: #fff;
    overflow: auto;
    position: relative;
    .first1 {
      padding-top: 10px;
      margin-left: 1%;
    }
  }
}
</style>
