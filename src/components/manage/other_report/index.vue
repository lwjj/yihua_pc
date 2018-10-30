<template>
<div id='subTemplate'>
    <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/work'}">工作管理</el-breadcrumb-item>
            <el-breadcrumb-item>汇报</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="layout" style="padding:10px 10px 0 10px;margin-bottom:50px;height:100%;position:relative;">
          <!-- 筛选条件 -->
    <div class="filtrate">
      <!-- tab切换 -->
      <el-menu :default-active="activeIndex"
       mode="horizontal"
       active-text-color="#1e82d2"
       @select="filteraaType">
        <el-menu-item index="1" v-if="userInfo.postType >=3">向上汇报</el-menu-item>
        <el-menu-item index="2" v-if="userInfo.postType <=3">审批下属</el-menu-item>
      </el-menu>
       <div class="block">
      <el-date-picker
        style="width:300px"
        class="mr1"
        v-model="dateValue"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
         @change="filterDate"
        >
      </el-date-picker>
      <!-- 类型筛选 -->
      <el-select class="mr1" style="width:120px" v-model="reportType" placeholder="请选择类型" @change="filterReportType">
        <el-option
          v-for="item in reportTypeList"
          :key="item.value"
          :label="item.dictDataName"
          :value="item.guid">
        </el-option>
      </el-select>
      <el-select class="mr1" style="width:120px" v-model="status" placeholder="请选择状态" @change="filterStatus">
        <el-option
          v-for="item in stateList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="print">打印表格</el-button>
      <el-button style="margin-left:0;" v-if="userInfo.postType >=3" @click="turnTo('/manage/other_report/build_other')"><i class="el-icon-plus"></i>&nbsp;新建</el-button>
    </div>
  </div>
  <!-- 表单 -->
<div class="inform_table">
   <el-table :data="tableData" border style="width: 100%" :height="mHeight">
    <el-table-column
    header-align="center"
      prop="createDate"
      label="日期"
      :formatter="formatTime"
       min-width="13%"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="reportTitle"
      label="标题"
       show-overflow-tooltip
        min-width="34%"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="userName"
      label="汇报人"
       show-overflow-tooltip
        min-width="22%"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
     prop="reportTypeName"
      label="类型"
       min-width="13%"
      >
       <!-- <template slot-scope="scope">
         <div>{{scope.row.occurDate}}</div>
         <span class="workType">类型:【{{scope.row.typeName}}】</span>
      </template> -->
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="status"
      label="状态"
       :formatter="formatStatus"
        min-width="9%"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      label="操作"
       min-width="9%"
      >
      <template slot-scope="scope">
        <el-button plain size="small" @click="turnTo('/manage/other_report/report_del/'+scope.row.guid)">详情</el-button>
        <!-- <el-button type="danger" plain size="small">编辑</el-button> -->
      </template>
    </el-table-column>
  </el-table>
 </div>

 <el-pagination
            v-if="rowCount"
            background
            class="page"
            style="position:absolute;right:20px;bottom:10px;padding:2px 5px;"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :page-size="18"
            :total="rowCount">
        </el-pagination>
  <div id="printcode" v-show="print1">
   <el-table :data="tableData" border :style="{height:tableData.length*49+48+'px'}">
    <el-table-column
    align="center"
      prop="createDate"
      label="日期"
      :formatter="formatTime"
      width="160px"

      >
    </el-table-column>
    <el-table-column
    align="center"
      prop="reportTitle"
      label="标题"
       show-overflow-tooltip
      width="640px"
      >
    </el-table-column>
    <el-table-column
    align="center"
      prop="userName"
      label="汇报人"
       show-overflow-tooltip
      width="244px"
      >
    </el-table-column>
    <el-table-column
    align="center"
      prop="reportTypeName"
      label="类型"
      width="160px"
      >
       <!-- <template slot-scope="scope">
         <div>{{scope.row.occurDate}}</div>
         <span class="workType">类型:【{{scope.row.typeName}}】</span>
      </template> -->
    </el-table-column>
    <el-table-column
    align="center"
      prop="status"
      label="状态"
       :formatter="formatStatus"
      width="160px"
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
    this.mHeight = Number(this.$getClientHeight()) - 200;

    return {
      print1: false,
      rowCount: "",
      activeIndex: "1",
      userInfo: {},
      organInfo: {},
      dateValue: "",
      tableData: [],
      reportTypeId: "",
      reportTypeList: [],
      reportType: "",
      aaTypeId: "1",
      status: "",
      statusId: "",
      // 固定数据  1,待审批；2同意；3，不同意
      stateList: [
        {
          value: "",
          label: "所有状态"
        },
        {
          value: "1",
          label: "待审批"
        },
        {
          value: "2",
          label: "同意"
        },
        {
          value: "3",
          label: "不同意"
        }
      ]
    };
  },
  methods: {
    //打印
    print() {
      this.$getPrint();
    },
    turnTo(e) {
      this.$router.push(e);
    },
    // 筛选日期
    filterDate() {
      this.getReport();
    },
    // 筛选状态
    filterStatus(e) {
      this.statusId = e;
      this.getReport();
    },
    // 筛选类型
    filterReportType(e) {
      this.reportTypeId = e;
      this.getReport();
    },
    //汇报类型
    filteraaType(e) {
      if (e == 1) {
        this.aaTypeId = "1";
      } else {
        this.aaTypeId = "2";
      }
      this.getReport();
    },
    //获取类型
    getReportType() {
      this.$ajax(
        `${this.subUrl.activity}/otherReportBill/getReportCategory`,
        "",
        res => {
          console.log(res, "type");
          var obj = { dictDataName: "所有类型", guid: "" };
          res.data.HBC.unshift(obj);
          this.reportTypeList = res.data.HBC;
        },
        this
      );
    },
    handleCurrentChange(pageNo) {
      this.getReport(pageNo);
    },
    //获取
    getReport(pageNo) {
      console.log(this.userInfo, "userInfo");
      var date1, date2;
      if (this.dateValue) {
        date1 = this.dateValue[0] + " 00:00:00";
        date2 = this.dateValue[1] + " 00:00:00";
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        postType: this.userInfo.postType,
        organId: this.organInfo.guid,
        aaType: this.aaTypeId,
        reportType: this.reportTypeId,
        deptId: "",
        startDate: date1,
        endDate: date2,
        status: this.statusId,
        pageNo: pageNo,
        pageSize: "18"
      };
      console.log(data, "workdata");
      this.$ajax(
        `${this.subUrl.activity}/otherReportBill/listOtherRepBill`,
        data,
        res => {
          console.log(res, "report");
          this.tableData = res.data.list;
          this.rowCount = +res.data.rowCount;
        },
        this
      );
    },
    // 过滤状态   1：待审批，2：同意 ，3：不同意
    formatStatus(val) {
      //console.log(val)
      if (val.status == 1) {
        return "待审批";
      } else if (val.status == 2) {
        return "同意";
      } else if (val.status == 3) {
        return "不同意";
      }
    },
    //时间格式化
    formatTime(row, column) {
      var date = row[column.property];
      return date.split(" ")[0];
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    console.log(this.userInfo, "用户信息info....");
    console.log(this.organInfo);
    this.getReportType();
    this.getReport();
  }
};
</script>
<style lang="scss" scoped>
#subTemplate {
  overflow: auto;
} 
.filtrate {
  width: 100%;
  height: 60px;
  background: #fff;
  line-height: 60px;
  padding-left: 20px;
  .el-menu {
    background: #fff;
    float: left;
    // font-size: 16px;
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
// 表格
.inform_table {
  text-align: center;
}
// workType
.workType {
  color: #888;
}
</style>
