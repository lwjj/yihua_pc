<template>
    <div class="newRightContent">
        <div class="title">
             <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item @click.native="back">返回</el-breadcrumb-item>
                <el-breadcrumb-item>报价详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="centerBox bgwhite" style="height:100%">
            <div class="tableList">
                <el-table
                    :data="tableList"
                    height="100%"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="offerTime"
                    label="报价时间"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="organInfoDto3.organName"
                    label="机构名"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="organInfoDto3.userName"
                    label="用户名">
                    </el-table-column>
                     <el-table-column
                    prop="myOffer"
                    label="报价">
                    </el-table-column>
                     <el-table-column 
                    label="会员等级">
                    <template slot-scope="scope">
                        <span v-if="scope.row.organInfoDto3.vipType == 1">基础会员</span>
                        <span v-if="scope.row.organInfoDto3.vipType == 2">中级会员</span>
                        <span v-if="scope.row.organInfoDto3.vipType == 3">高级会员</span>
                        <span v-if="scope.row.organInfoDto3.vipType == 4">钻石会员</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="myExplain"
                    label="备注">
                        
                    </el-table-column>
                </el-table>
                <el-pagination
                    v-if="pageCount>0"
                    background
                    :page-count="pageCount"
                    layout="prev, pager, next"
                    @current-change='changePage'>
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      tableList: [],
      userInfo: {},
      organInfo: {},
      pageCount: 1,
      pageNo: 1
    };
  },
  methods: {
    changePage(e) {
      return;
      this.pageNo = e;
      this.tableList = [];
      this.getList();
    },
    getList() {
      var data = {
        token: this.$getkey(),
        guid: this.$route.query.guid,
        orderType: this.$route.query.type,
        pageNo: this.pageNo
      };
      this.$ajax(
        `${this.subUrl.bd}/purchase/registerList`,
        data,
        res => {
          this.pageCount = res.data.pageCount * 1;
          this.pageNo++;
          this.tableList = res.data.list;
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
    this.getList();
  }
};
</script>