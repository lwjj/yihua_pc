<template>
    <div class="tR_box">
        <el-table :data=tableData height="100%" border style="width:100%;min-width:800px;">
            <el-table-column prop="createTime" label="充值时间" min-width="20%"></el-table-column>
            <el-table-column prop="businessPoint" label="购买商机点" min-width="20%"></el-table-column>
            <el-table-column prop="totalFee" label="支付金额" min-width="20%"></el-table-column>
            <el-table-column prop="puyType" label="支付方式" min-width="20%"></el-table-column>
            <el-table-column prop="status" label="状态" min-width="20%"></el-table-column>
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
        pageSize: 12
      };
      this.$ajax(
        `${this.subUrl.user}/asset/getBuyLog`,
        data,
        res => {
          this.tableData = res.data.list;
          this.pageCount = res.data.pageCount * 10;
          console.log(this.pageCount);
          for (var i = 1; i <= this.tableData.length; i++) {
            this.tableData[i - 1].number = i;
          }
          for (var p = 0; p < this.tableData.length; p++) {
            if (
              this.tableData[p].puyType == 1 ||
              this.tableData[p].puyType == 5 ||
              this.tableData[p].puyType == 6
            ) {
              this.tableData[p].puyType = "微信支付";
            } else if (
              this.tableData[p].puyType == 2 ||
              this.tableData[p].puyType == 7
            ) {
              this.tableData[p].puyType = "支付宝支付";
            } else if (this.tableData[p].puyType == 3) {
              this.tableData[p].puyType = "银行支付";
            } else if (this.tableData[p].puyType == 4) {
              this.tableData[p].puyType = "苹果内购";
            }

            if (this.tableData[p].businessPoint !== null) {
              this.tableData[p].businessPoint =
                this.tableData[p].businessPoint + "个商机点";
            } else {
              this.tableData[p].businessPoint = "0个商机点";
            }

            this.tableData[p].totalFee =
              this.tableData[p].totalFee.toFixed(2) + "元";

            this.tableData[p].status =
              this.tableData[p].status == 0
                ? "失败"
                : this.tableData[p].status == 1 ? "成功" : "未支付";
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
