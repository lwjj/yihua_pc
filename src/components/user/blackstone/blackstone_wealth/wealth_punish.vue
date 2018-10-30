<template>
<div class="library_box">
    <el-input placeholder="搜索" suffix-icon="el-icon-search" v-model="value2" style="width:200px; height:40px;position:absolute;top:-50px;right:10px;" @change="changeValue2"></el-input>
    <div class="library_box_table">
        <el-table :data="tableData" height='100%' style="width: 100%" border>
            <el-table-column prop="number" label="序号" min-width="10%"></el-table-column>
            <el-table-column prop="title" label="标题" min-width="35%"></el-table-column>
            <el-table-column prop="bp" label="费用" min-width="25%"></el-table-column>
            <el-table-column prop="createDate" label="日期" min-width="23%"></el-table-column>
            <el-table-column prop="kaId" label="详情" min-width="7%">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="goView(tableData,scope.row)" type="text">
                        查看
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="pageCount>0" background class="center" style="margin-right:10px;padding:14px 0;float:right;" layout="prev,pager,next" :total="pageCount" @current-change="handleCurrentChange" ></el-pagination>
        <div style="clear:both"></div> 
    </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      userInfo: {},
      organInfo: {},
      pageCount: 0,
      pageSize: 0,
      total: 0,
      value2: ""
    };
  },
  methods: {
    changeValue2() {
      this.getMain(1);
    },
    handleCurrentChange(pageNo) {
      this.getMain(pageNo);
    },
    goView(kaid, rows) {
      console.log(rows);
      this.$router.push({
        name: "blackstone_view",
        params: { hid: rows.kaId, road: 6 }
      });
    },
    getMain(pageNo) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        type: 4,
        pageNo: pageNo,
        pageSize: 8,
        keyword: this.value2
      };
      this.$ajax(
        `${this.subUrl.bd}/knowAll/myLib`,
        data,
        res => {
          this.pageCount = Number(res.data.pageCount) * 10;
          this.tableData = res.data.list;
          for (var i = 1; i <= this.tableData.length; i++) {
            this.tableData[i - 1].number = i;
          }
          console.log(this.tableData);
        },
        this
      );
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getMain(1);
  }
};
</script>
<style lang="scss" scoped>
.library_box {
  height: auto;
  background: #fff;
  padding-top: 5px;
  position: relative;
  height: calc(100% - 50px);
  .library_box_table {
    margin-left: 10px;
    height: calc(100% - 60px);
    margin-right: 10px;
  }
}
</style>