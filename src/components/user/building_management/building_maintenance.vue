<template>
    <div id="wealth">
        <!-- 包裹 -->
        <div v-show="!showAdd && !showDetail">
            <div class="title">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/user/building_management/index' }">房屋管理</el-breadcrumb-item>
                    <el-breadcrumb-item><a @click="goBack">房屋详情</a></el-breadcrumb-item>
                    <el-breadcrumb-item>设备维护明细说明</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="box">
                <div class="add">
                    <el-button type="primary" @click="edit(null)" class="el-icon-plus">新建</el-button>
                </div>
                <div class="tableBox">
                    <el-table :data='tableData' border>
                        <el-table-column label="内容" prop="content" show-overflow-tooltip></el-table-column>
                        <el-table-column label="标准化明细" prop="detailing" show-overflow-tooltip></el-table-column>
                        <el-table-column label="创建时间" prop="createTime" width="170"></el-table-column>
                        <el-table-column label="截止时间" prop="endTime" width="170"></el-table-column>
                        <el-table-column label="责任人" prop="name" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column width="180" label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" @click='edit(scope.row)' type="primary">编辑</el-button>
                                <el-button size="mini" @click='checkDetail(scope.row)' type="primary">详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="tablebottom">
                <el-pagination  background  layout="prev, pager, next" @current-change='changePage' v-if="pageCount > 0" :page-count="pageCount"></el-pagination>
                </div>
            </div>
        </div>
        <add v-if="showAdd" :details='details' @receiveAdd='receiveAdd'></add>
        <detail v-if="showDetail" :details='details' @receiveDetail='receiveDetail'></detail>
       
    </div>
</template>
<script>
import add from "./add";
import detail from "./detail";
export default {
  components: {
    add,
    detail
  },
  data() {
    return {
      userInfo: {},
      showAdd: false,
      showDetail: false,
      organInfo: {},
      tableData: [],
      pageCount: 1,
      pageNo: 1
    };
  },
  methods: {
    edit(e) {
      this.details = e;
      this.showAdd = true;
    },
    checkDetail(e) {
      this.details = e;
      this.showDetail = true;
    },
    receiveDetail() {
      this.showDetail = false;
    },
    receiveAdd(e) {
      if (e) {
        this.pageNo = 1;
        this.getList();
      }
      this.showAdd = false;
    },
    goBack() {
      this.$router.back();
    },
    // 获取列表
    changePage(e) {
      this.pageNo = e;
      this.getList();
    },
    getList() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        pageNo: this.pageNo,
        unitId: this.$route.query.unitId
      };
      this.$ajax(
        `${this.subUrl.user}/buildingUnit/getMaintainList`,
        data,
        res => {
          this.tableData = res.data.list;
          this.pageCount = res.data.pageCount * 1;
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
<style lang="scss" scoped>
.clear {
  clear: both;
}
#wealth {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow-x: scroll;
  .box {
    background: #fff;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 280px;
    top: 75px;
    .add {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0 20px;
    }
    .tableBox {
      position: absolute;
      left: 0;
      right: 0;
      top: 60px;
      bottom: 50px;
      height: auto;
      padding: 0 10px;
      border: 0;
    }
    .tablebottom {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 50px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
