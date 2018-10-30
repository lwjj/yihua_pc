<template>
    <div class="tR_box">
        <el-table height="100%" border :data=tableData style="width:100%">
            <el-table-column prop="createTime" label="时间" min-width="20%"></el-table-column>
            <el-table-column prop="explains" label="说明" min-width="20%"></el-table-column>
            <el-table-column prop="type" label="支付方式" min-width="20%"></el-table-column>
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
        consumeType: 1
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
                "+" + this.tableData[p].businessPoint;
            } else {
              this.tableData[p].businessPoint = "0";
            }

            switch (this.tableData[p].type) {
              case 1:
                this.tableData[p].type = "充值";
                break;
              case 2:
                this.tableData[p].type = "兑换";
                break;
              case 3:
                this.tableData[p].type = "邀请商家";
                break;
              case 4:
                this.tableData[p].type = "百事通";
                break;
              case 5:
                this.tableData[p].type = "查看商机";
                break;
              case 6:
                this.tableData[p].type = "其他消费";
                break;
              case 7:
                this.tableData[p].type = "赠送";
                break;
              case 8:
                this.tableData[p].type = "返点";
                break;
              case 9:
                this.tableData[p].type = "采购";
                break;
              case 10:
                this.tableData[p].type = "招标";
                break;
              case 11:
                this.tableData[p].type = "产品";
                break;
              case 12:
                this.tableData[p].type = "推送";
                break;
              default:
                this.tableData[p].type = "系统错误";
            }
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
</style>
