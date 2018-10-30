<template>
<div id='inform'>
    <div class="layout">
          <!-- 筛选条件 -->
    <div class="filtrate">
       <div class="block">
      <!-- <span class="demonstration">筛选条件</span> -->
      <el-date-picker
        v-model="dateValue" 
        type="month"
        format="yyyy年MM月"
        value-format="yyyy-MM"
        placeholder="选择月份"
         @change="filterDate" 
        >
      </el-date-picker>
   <el-select style="width:150px" v-model="status" placeholder="请选择状态" @change="filterStatus">
    <el-option
      v-for="item in stateList"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <el-button v-if="userInfo.postType == 2" @click="turnTo('/manage/manage_report/build_monreport/0')"><i class="el-icon-plus"></i>&nbsp;新建</el-button>
  </div>
  </div>
  <!-- 表单 -->
<div class="inform_table">
   <el-table
   border
    :data="tableData"
    :height="mHeight"
    >
    <el-table-column
    header-align="center"
      prop="createDate"
      label="日期"
      :formatter="formatTime"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      label="年月"
      prop="month"
      :formatter="formatMonth"
      >
      <!-- <template slot-scope="scope">
        <span v-html="scope.row.createDate"></span>
      </template> -->
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="reportOrganName"
      label="物业公司名称"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="status"
      label="状态"
       :formatter="formatStatus"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      label="操作"
      >
      <template slot-scope="scope">
        <el-button v-if="scope.row.status==1" type="primary" plain size="small" @click="turnTo('/manage/manage_report/monrep_del/'+scope.row.guid)">详情</el-button>
        <el-button v-if="scope.row.status==0" type="primary" plain size="small" @click="turnTo('/manage/manage_report/build_monreport/'+scope.row.guid)">编辑</el-button>
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
  :page-size="12"
  :total="rowCount">
</el-pagination>

</div>
</div>
</template>
<script>
export default {
  data() {
    this.mHeight = tableHeight - 61; // 定义的 window.tableHeight

    return {
      rowCount: "",
      userInfo: {},
      organInfo: {},
      dateValue: "",
      tableData: [],
      status: "",
      statusId: "",
      // 固定数据
      stateList: [
        {
          value: "",
          label: "全部类型"
        },
        {
          value: "0",
          label: "未上报"
        },
        {
          value: "1",
          label: "已上报"
        }
      ]
    };
  },
  methods: {
    turnTo(e) {
      this.$router.push(e);
    },
    handleCommand(command) {
      this.turnTo(command);
    },
    // 筛选日期
    filterDate() {
      this.getRep();
    },
    // 筛选状态
    filterStatus(e) {
      this.statusId = e;
      this.getRep();
    },
    // 下一页
    handleCurrentChange(pageNo) {
      this.getRep(pageNo);
    },
    //获取
    getRep(pageNo = 1) {
      var date1, date2;
      if (this.dateValue) {
        date1 = this.dateValue[0] + " 00:00:00";
        date2 = this.dateValue[1] + " 00:00:00";
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        startDate: date1,
        endDate: date2,
        status: this.statusId,
        pageSize: "12",
        pageNo: pageNo
      };
      console.log(data, "monthRepdata");
      this.$ajax(
        `${this.subUrl.activity}/manageMonRep/queryMonthRep`,
        data,
        res => {
          console.log(res, "monthRep");
          this.tableData = res.data.list;
          this.rowCount = +res.data.rowCount;
        },
        this
      );
    },
    // 过滤状态
    formatStatus(val) {
      //console.log(val)
      if (val.status == 0) {
        return "未上报";
      } else if (val.status == 1) {
        return "已上报";
      }
    },
    //el-table时间格式化
    formatTime(row, column) {
      var date = row[column.property];
      return date.split(" ")[0];
    },
    //月份格式化
    formatMonth(row, column) {
      var date = row[column.property];
      return date + "月";
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    //this.getRepType()
    this.getRep();
  }
};
</script>
<style lang="scss" scoped>
#inform {
  height: 100%;
}
.layout {
}
.filtrate {
  width: 100%;
  height: 60px;
  background: #fff;
  line-height: 60px;
  padding-left: 20px;
  border-top: 1px solid #ccc;
}
.block {
  float: right;
  margin-right: 10px;
  display: inline-block;
  .el-range-editor.el-input__inner {
    padding: 0 10px;
  }
}
.build_btn {
  float: right;
  margin: 12px 30px;
}
// 表格
.inform_table {
  text-align: center;
}
.page {
  text-align: right;
}
</style>