<template>
    <div class="tR_box">
        <el-table :data=tableData height="100%" border style="width:100%">
            <el-table-column prop="createTime" label="日期" min-width="20%"></el-table-column>
            <el-table-column prop="puyType" label="账号" min-width="20%"></el-table-column>
            <el-table-column prop="money" label="总换金额" min-width="20%"></el-table-column>
            <el-table-column prop="integral" label="积分数" min-width="20%"></el-table-column>
            <el-table-column prop="businessPoint" label="商机点" min-width="20%"></el-table-column>
        </el-table>
        <el-pagination  class="center" v-if="pageCount > 0" style="padding:10px 0;text-align:right" background layout="prev,pager,next" :total="pageCount" @current-change="select"></el-pagination>
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
        pageSize: 12
      };
      this.$ajax(
        `${this.subUrl.user}/asset/getExchangeLog`,
        data,
        res => {
          this.tableData = res.data.list;
          this.pageCount = res.data.pageCount * 10;
          console.log(this.tableData);
          for (var i = 1; i <= this.tableData.length; i++) {
            this.tableData[i - 1].number = i;
          }
          for (var p = 0; p < this.tableData.length; p++) {
            if (this.tableData[p].puyType == 1) {
              this.tableData[p].puyType = "微信";
            } else if (this.tableData[p].puyType == 2) {
              this.tableData[p].puyType = "支付宝";
            } else if (this.tableData[p].puyType == 3) {
              this.tableData[p].puyType = "银行";
            }
            this.tableData[p].money = this.tableData[p].money.toFixed(2);
            if (this.tableData[p].integral == null) {
              this.tableData[p].integral = 0;
            }
            this.tableData[p].businessPoint = this.tableData[p].businessPoint;
          }
          this.pageCount = Number(res.data.pageCount * 10);
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
