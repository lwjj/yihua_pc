<template>
<div id='quality'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/user/we_business' }">本楼业务</el-breadcrumb-item>
            <el-breadcrumb-item>物业收益</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="layout">
        <div class="filtrate">
            <ul class="income_title">
              <li><h4>全部</h4><span>{{income.earning}}商机点</span></li>
              <li><h4>购买写字楼业务</h4><span>{{income.sosEarning}}商机点</span></li>
            </ul>
        </div>    
        <!-- 表单 -->
      <div class="inform_table">
        <el-table
        border
          :data="tableData"
          height="100%"
          >
          <el-table-column
          type="index"
          header-align="center"
            label="序号"
            width="100"
            >
          </el-table-column>
          <el-table-column
          header-align="center"
            prop="createTime"
            label="时间"
            >
          </el-table-column>
          <el-table-column
          header-align="center"
            prop="organName"
            label="商家名称"
            >
          </el-table-column>
          <el-table-column
          header-align="center"
          label="商机点"
            >
            <template slot-scope="scope">
              <div>+{{scope.row.bp}}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column
          header-align="center"
            label="操作"
            >
            <template slot-scope="scope">
              <el-button type="primary" plain size="small" @click="turnTo('/user/we_business/building_unit/unit_del/'+scope.row.guid)">详情</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <div class="paginationRight">
        <el-pagination
          v-if="rowCount>0"
          background
          style="float:right;"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="12"
          :total="rowCount">
        </el-pagination>
      </div> 
    </div>
</div>
</template>
<script>
export default {
  data() {
    this.mHeight = tableHeight - 20; // 定义的 window.tableHeight
    return {
      rowCount: "",
      userInfo: {},
      organInfo: {},
      tableData: [],
      income: {}
    };
  },
  methods: {
    handleCurrentChange(pageNo) {
      this.getList(pageNo);
    },
    turnTo(e) {
      this.$router.push(e);
    },
    getIncome() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/earning/earning`,
        data,
        res => {
          console.log(res, "getIncome");
          this.income = res.data;
        },
        this
      );
    },
    // 获取列表
    getList(pageNo = 1) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        pageNo: pageNo,
        pageSize: "12"
      };
      this.$ajax(
        `${this.subUrl.user}/earning/getList`,
        data,
        res => {
          console.log(res, "getList");
          this.tableData = res.data.list;
          this.rowCount = +res.data.rowCount;
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
    this.getIncome();
  }
};
</script>
<style lang="scss" scoped>
#quality {
  height: 100%;
  .text {
    i {
      padding: 20px 20px;
    }
  }
}
.layout {
  position: relative;
  height: 100%;
}
.filtrate {
  height: 30px;
  background: #fff;
  padding: 10px 20px;
  // margin-top: 10px;
  margin-left: 10px;
  line-height: 30px;
  .income_title {
    li {
      height: 30px;
      float: left;
      margin-left: 15px;
      margin-right: 30px;
    }
    h4 {
      float: left;
      font-weight: 700;
      padding-right: 10px;
    }
  }
}
//tab 切换
.el-menu-item {
  font-size: 16px;
  font-weight: 700;
}
.inform_table {
  position: absolute;
  left: 0;
  right: 0;
  top: 45px;
  bottom: 50px;
  margin: 0;
  padding-left: 10px;
  text-align: center;
  .el-table {
    font-size: 15px;
  }
}
// emerType
.emerType {
  color: #888;
}
</style>