<template>
  <div class="body">
    <div class="tableContent">
      <el-table :data="tableData" height="100%" border style="width: 100%">
        <el-table-column fixed prop="createDate" label="日期" min-width="10%"></el-table-column>
        <el-table-column prop="title" label="标题" min-width="10%"> </el-table-column>
        <el-table-column prop="content" label="内容" min-width="10%"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="10%">
            <template slot-scope="scope">
                <el-button @click="handleClick(scope.row,scope.$index)" type="text" size="small">
                    删除
                </el-button>
            </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paginationRight" v-if="pageCount > 0">
      <el-pagination background layout="prev,pager,next" :total=pageCount @current-change="select"></el-pagination>
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
      ye: "",
      news: 0
    };
  },
  methods: {
    getDetails(pageNo) {
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid,
        pageNo: pageNo,
        pageSize: 12,
        type: 1
      };
      this.$ajax(
        `${this.subUrl.user}/admin/latestNews/organNews`,
        data,
        res => {
          this.pageCount = res.data.pageCount * 10;
          this.tableData = res.data.list;
        },
        this
      );
    },
    select(val) {
      this.ye = val;
      this.getDetails(val);
    },
    handleClick(index, rows) {
      console.log(index);
      console.log(rows);
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
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
            newsId: index.guid
          };
          this.$ajax(
            `${this.subUrl.user}/admin/latestNews/delOrganNews`,
            data,
            res => {
              console.log(res.data);
            },
            this
          );
          this.getDetails(this.ye);
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
.tableContent {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 50px;
}
</style>

