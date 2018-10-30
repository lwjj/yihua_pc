<template>
<div id='inform'>
    <div class="title">
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/building'}">楼宇信息</el-breadcrumb-item>
            <el-breadcrumb-item>业主往来</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <!-- 未绑定 -->
    <div class="layout1" v-if="bindStatus==0">
       <div class="filtrate">
         <el-tag class="bindTitle" type="danger">未绑定委员会</el-tag>
       <div class="block">
          <el-button style="width:100px;" size="medium" type="primary" @click="turnTo('/manage/yewei_contact/yewei_set')">设置</el-button>
      </div>
      </div>
    </div>
    <!-- 待对方确认 -->
    <div class="layout2" v-if="bindStatus==2">
       <div class="filtrate">
         <div class="organBox" @click="turnTo('/manage/yewei_contact/yewei_del')">
            <el-tag type="warning" size="medium" class="bindTitle">待对方确认</el-tag>
            <span v-if="setInfo.ownersComInfo">【{{setInfo.ownersComInfo.organName}}】</span>
        </div>
      </div>
    </div>
    <!-- 已绑定 -->
    <div class="layout" v-if="bindStatus==1">
          <!-- 筛选条件 -->
    <div class="filtrate">
      <div class="organBox" @click="turnTo('/manage/yewei_contact/yewei_del')">
         <el-tag type="success" size="medium" class="bindTitle">已绑定</el-tag>
         <span v-if="setInfo.ownersComInfo">【{{setInfo.ownersComInfo.organName}}】</span>
      </div>
       <div class="block">
      <!-- <span class="demonstration">筛选条件</span> -->
      <el-date-picker
        style="width:300px"
        v-model="dateValue"
        type="daterange"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="filterDate" >
      </el-date-picker>
   <el-select style="width:120px" v-model="status"  placeholder="请选择状态" @change="filterStatus" >
    <el-option
      v-for="item in stateList"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <el-button @click="print">打印表格</el-button>
  <el-button style="margin-left:0;" @click="turnTo('/manage/yewei_contact/finance_delivery')"><i class="el-icon-plus"></i>&nbsp;财务送批</el-button>
  </div>
  </div>
  <!-- 表单 -->
<div class="inform_table">
   <el-table
    :data="tableData"
    :height="mHeight"
    border
    >
    <el-table-column
    header-align="center"
      label="日期"
      min-width="20%"
      >
      <template slot-scope="scope">
        <div>{{scope.row.createTime | times}}</div>
      </template>
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="guid"
      label="编号"
      min-width="20%"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="title"
      label="标题"
      min-width="40%"
      show-overflow-tooltip
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="status"
      label="状态"
      min-width="10%"
      :formatter="formatStatus"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      label="操作"
      min-width="10%"
      >
      <template slot-scope="scope">
        <el-button  plain size="small" @click="turnTo('/manage/yewei_contact/finance_del/'+scope.row.guid)">详情</el-button>
        <!-- <el-button type="danger" plain size="small">删除</el-button> -->
      </template>
    </el-table-column>
  </el-table>
 </div>
 <el-pagination
  v-if="rowCount"
  class="page"
  background
   @current-change="handleCurrentChange"
  layout="prev, pager, next"
  :page-size=13
  :total="rowCount">
</el-pagination>
<div  id="printcode" v-show="print1">
   <el-table
    :data="tableData"
    :style="{height:tableData.length*49+48+'px'}"
    border
    >
    <el-table-column
    align="center"
      label="日期"
      width="240px"
      >
      <template slot-scope="scope">
        <div>{{scope.row.createTime | times}}</div>
      </template>
    </el-table-column>
    <el-table-column
    align="center"
      prop="guid"
      label="编号"
      width="240px"
      >
    </el-table-column>
    <el-table-column
    align="center"
      prop="title"
      label="标题"
      width="643px"
      show-overflow-tooltip
      >
    </el-table-column>
    <el-table-column
    align="center"
      prop="status"
      label="状态"
      width="240px"
      :formatter="formatStatus"
      >
    </el-table-column>
  </el-table>
 </div>
</div>
</div>

</template>
<script>
export default {
  data() {
    this.mHeight = tableHeight; // 定义的 window.tableHeight
    return {
      setInfo: {},
      print1:false,
      rowCount: "",
      userInfo: {},
      organInfo: {},
      dateValue: "",
      tableData: [],
      status: "",
      statusId: "",
      bindStatus: "",
      // 固定数据   0：不同意 1：同意 2：待审批 3：草稿 ,
      stateList: [
        {
          value: "",
          label: "所有状态"
        },
        {
          value: "0",
          label: "不同意"
        },
        {
          value: "1",
          label: "同意"
        },
        {
          value: "2",
          label: "待审批"
        }
      ]
    };
  },
  methods: {
    //打印
    print(){
      this.$getPrint();
    },
    turnTo(e) {
      this.$router.push(e);
    },
    // 筛选日期
    filterDate() {
      this.getList();
    },
    // 筛选状态
    filterStatus(e) {
      this.statusId = e;
      this.getList();
    },
    // 下一页
    handleCurrentChange(pageNo) {
      this.getList(pageNo);
    },
    // 业委会设置     0：未绑定 1：已绑定 2：待确认
    setYewei() {
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/ownersCom/relation/info`,
        data,
        res => {
          console.log(res, "setYewei");
          this.setInfo = res.data;
          this.bindStatus = res.data.status;
          // if(this.bindStatus == 0){
          //   this.bindMessage ="未板绑定委员会"
          // }else if(this.bindStatus== 2){
          //   this.bindMessage ="待对方确认"
          // }
        },
        this
      );
    },
    // 获取  财务报告列表
    getList(pageNo) {
      if(pageNo==undefined){
        pageNo=1  
      }
      let date1, date2;
      if (this.dateValue) {
        date1 = this.dateValue[0] + " 00:00:00";
        date2 = this.dateValue[1] + " 23:59:59";
      }
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        startDate: date1,
        endDate: date2,
        status: this.statusId,
        pageNo: pageNo,
        pageSize: 15
      };
      this.$ajax(
        `${this.subUrl.activity}/ownersCom/ocReport/getList`,
        data,
        res => {
          console.log(res, "getList");
          this.tableData = res.data.list;
          this.rowCount = +res.data.rowCount;
        },
        this

      );
    },
    // 过滤状态   0：不同意 1：同意 2：待审批 3：草稿 ,
    formatStatus(val) {
      //console.log(val)
      if (val.status == 0) {
        return "不同意";
      } else if (val.status == 1) {
        return "同意";
      } else if (val.status == 2) {
        return "待审批";
      }
    },
    //时间格式化
    formatTime(row, column) {
      let date = row[column.property];
      if (date) {
        return date.split(" ")[0];
      }
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    console.log(this.userInfo);
    console.log(this.organInfo);
    this.setYewei();
    this.getList();
  }
};
</script>
<style lang="scss" scoped>
#inform {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  // overflow: scroll;
}
.bindTitle {
  margin-left: 50px;
}
.layout {
}
.filtrate {
  width: 100%;
  height: 60px;
  background: #fff;
  line-height: 60px;
  padding-left: 20px;
}
.block {
  float: right;
  margin-right: 10px;
  display: block;
  .el-range-editor.el-input__inner {
    padding: 0 10px;
  }
}
// 表格
.inform_table {
  text-align: center;
}
.page {
  text-align: right;
}
.el-tag {
  font-size: 16px;
}
.organBox {
  float: left;
  cursor: pointer;
}
</style>