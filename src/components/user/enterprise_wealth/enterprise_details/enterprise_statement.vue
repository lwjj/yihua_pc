<template>
    <div class="tR_box">
        <el-table :data=tableData height="100%" border style="width:100%">
            <el-table-column prop="createTime" label="时间" min-width="20%"></el-table-column>
            <el-table-column prop="explains" label="消费方式" min-width="20%"></el-table-column>
            <el-table-column prop="businessPoint" label="商机点" min-width="20%"></el-table-column>
        </el-table>
        <el-pagination  class="center" v-if="pageCount > 0" style="padding:10px 0;text-align:right" background layout="prev,pager,next" :total=pageCount @current-change="select"></el-pagination>
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
      var data = {
        token: this.$getkey(),
        userId: this.organInfo.organAccount,
        pageNo: pageNo,
        pageSize: 12,
        consumeType: 2
      };
      this.$ajax(
        `${this.subUrl.user}/asset/getBpLog`,
        data,
        res => {
          this.tableData = res.data.list;
          this.pageCount = res.data.pageCount * 10;
          console.log(this.pageCount);
          for (var i = 1; i <= this.tableData.length; i++) {
            this.tableData[i - 1].number = i;
          }
          for (var p = 0; p < this.tableData.length; p++) {
            if (this.tableData[p].businessPoint !== null) {
              this.tableData[p].businessPoint =
                "-" + this.tableData[p].businessPoint;
            } else {
              this.tableData[p].businessPoint = "0";
            }

            this.tableData[p].explains = this.tableData[p].explains;
          }
        },
        this
      );
    },
    select(val) {
      this.getMain(val);
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
.tR_box {
  width: 98%;
  margin-left: 15px;
  margin-top: 10px;
}
</style>
