<template>
<div id='quality'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/user/we_business' }">本楼业务</el-breadcrumb-item>
            <el-breadcrumb-item>本楼采购</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="layout">
        <div class="filtrate">
            <div class="block">
            <el-select style="width:150px" v-model="type"  @change="selectType" >
                <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.dictDataName"
                :value="item.guid">
                </el-option>
            </el-select>
            </div>
        </div>    
  <!-- 表单 -->
<div class="inform_table">
   <el-table
    :data="tableData"
    :height="mHeight"
    >
    <!-- <el-table-column
    align="center"
    type="selection"
    width="100"
      >
    </el-table-column> -->
    <el-table-column
    header-align="center"
    align="center"
      label="日期"
      >
      <template slot-scope="scope">
          <div>{{scope.row.startTime | times}}</div>
      </template>
    </el-table-column>
    <el-table-column  
      label="企业名称"
      prop="organName"
      >
    </el-table-column>
    <el-table-column  
      label="标题"
      prop="title"
      >
    </el-table-column>
    <el-table-column            
    header-align="center"
    align="center"
      label="操作"
      >
      <template slot-scope="scope">
        <!-- <el-button type="primary" plain size="small" @click="turnTo('/user/we_business/we_purchase/post_del/'+scope.row.guid)">推荐商家</el-button> -->
        <!-- <el-button v-if="scope.row.type == " type="primary" plain size="small" @click="turnTo('/user/we_business/we_purchase/post_del/'+scope.row.guid)">详情</el-button> -->
        <el-button v-if="scope.row.type == 6 ||scope.row.type == 7" type="primary" plain size="small" @click="turnTo('/user/we_business/we_purchase/purchase_del/'+scope.row.guid+'/'+scope.row.type)">详情</el-button>
      </template>
    </el-table-column>
  </el-table>
 </div>
        <el-pagination
            v-if="rowCount"
            background
            style="float:right;"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :page-size="12"
            :total="rowCount">
        </el-pagination>

</div>

</div>
</template>
<script>
export default {
  data() {
    this.mHeight = tableHeight; // 定义的 window.tableHeight

    return {
      rowCount: "",
      userInfo: {},
      organInfo: {},
      tableData: [],
      type: "求租",
      typeId: "407701363947470848", // 默认求租
      typeList: []
    };
  },
  methods: {
    // 下一页
    handleCurrentChange(pageNo) {
      this.getList(pageNo);
    },
    turnTo(e) {
      this.$router.push(e);
    },
    // 筛选状态
    selectType(e) {
      this.typeId = e;
      this.getList();
    },
    //获取采购、招标类（一级目录）
    getType() {
      var data = {
        token: this.$getkey()
      };
      this.$ajax(
        `${this.subUrl.bd}/buildingBuy/getBbsCommon`,
        data,
        res => {
          console.log(res, "getType");
          this.typeList = res.data;
        },
        this
      );
    },
    // 获取商家

    // 选择商家
    handleSelectionChange(val) {
      console.log(val, "val");
      let arr = [];
      for (let ele of val) {
        arr.push(ele.organId);
      }
      this.organList = arr.join();
      console.log(this.organList, "organlist");
    },

    // 获取列表
    getList(pageNo = 1) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        type: this.typeId,
        pageNo: pageNo,
        pageSize: "12"
      };
      this.$ajax(
        `${this.subUrl.bd}/buildingBuy/listBbsByManage`,
        data,
        res => {
          console.log(res, "getList");
          this.tableData = res.data.pagination.list;
          this.rowCount = +res.data.pagination.rowCount;
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
    this.getType();
  }
};
</script>
<style lang="scss" scoped>
#quality {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: scroll;
  .text {
    i {
      padding: 20px 20px;
    }
  }
}
.layout {
  position: relative;
  // padding-top: 20px;
  padding-bottom: 200px;
}
.filtrate {
  width: 100%;
  height: 60px;
  background: #fff;
  line-height: 60px;
  padding-left: 20px;
  .thisTit {
    padding-left: 50px;
  }
}
//tab 切换
.el-menu-item {
  font-size: 16px;
  font-weight: 700;
}
.block {
  float: right;
  margin-right: 10px;
  display: block;
  .el-range-editor.el-input__inner {
    padding: 0 10px;
  }
}
.inform_table {
  // text-align: center;
}
// emerType
.emerType {
  color: #888;
}
</style>