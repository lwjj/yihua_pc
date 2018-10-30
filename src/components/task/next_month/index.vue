<template>
<div id='subTemplate'>
      <div class="title">
        <div class="text">下月计划</div>
    </div>
    <div class="layout clearfix">
    <!-- 筛选条件 -->
    <div class="filtrate">
      <div class="block">
          <el-date-picker
      v-model="dateValue"
      type="month"
      @change="filteDate"
      format="yyyy 年 MM 月"
      value-format="yyyy-MM"
      placeholder="选择月(默认为下月)">
    </el-date-picker>
      <el-select v-model="type" v-if="userInfo.postType == 2" placeholder="请选择部门" @change="filterDept">
        <el-option
          v-for="(item,index) in deptType"
          :key="index"
          :label="item.deptName"
          :value="item.guid">
        </el-option>
      </el-select>
      
   </div>
</div>

<!-- 计划表单 -->
<div class="inform_table">
   <el-table
    :data="tableData"
    border
    :height="mHeight"
    >
    <el-table-column
      type="index"
      label="序号"
      width="60px"
      align="center"
      >
    </el-table-column>
    <el-table-column
      prop="taskName"
      label="工作内容"
      >
    </el-table-column>
    <el-table-column
      prop="taskDetail"
      label="标准/细化点"
      >
    </el-table-column>
    <el-table-column
      prop="completionDate"
      label="截至时间"
      width="180px"
      >
    </el-table-column>
    <el-table-column
      label="责任人"
      >
       <template slot-scope="scope">
         <span v-for="(item,index) in scope.row.executorInfo" :key="index">{{item.name}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="progress"
      label="进度结论(%)"
      width="140px"
      align="center"
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
    this.mHeight = Number(this.$getClientHeight()) - 155;

    return {
      userInfo: {},
      organInfo: {},
      dateValue: "",
      //默认选中的部门
      deptId: "",
      type: "",
      deptType: [],
      allProgress: {},
      tableData: []
    };
  },
  methods: {
    turnTo(e) {
      this.$router.push(e);
    },
    handleClick(row) {
      console.log(row);
    },
    // 筛选部门
    filterDept(e) {
      console.log(e, "deptId");
      this.deptId = e;
      this.getWork();
    },
    // 筛选日期
    filteDate() {
      this.getWork();
    },
    // 获取部门
    getDpet() {
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid
      };
      console.log(data, "deptdata");
      this.$ajax(
        `${this.subUrl.user}/admin/deptManage/organDepartmentInfo`,
        data,
        res => {
          console.log(res, "dept");
          this.deptType = res.data;
        },
        this
      );
    },
    //获取下月工作
    getWork() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        queryDeptId: this.deptId,
        month: this.dateValue
      };
      console.log(data, "workdata");
      this.$ajax(
        `${this.subUrl.activity}/taskBill/getNmPlan`,
        data,
        res => {
          console.log(res, "nextmonth");
          this.tableData = res.data.list;
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
    this.deptId = this.userInfo.deptId;
    this.type = this.userInfo.deptName;
    this.getDpet();
    this.getWork();
    console.log(this.userInfo, "userInfo");
    console.log(this.organInfo, "organInfo");
  }
};
</script>
<style lang="scss" scoped>
#subTemplate {
  padding-left: 260px;
  padding-right: 10px;
  height: 100%;
  overflow: auto;
}
.text {
  float: left;
}
.filtrate {
  height: 50px;
  line-height: 60px;
  background: #fff;
  padding-right: 10px;
  .block {
    float: right;
  }
}
.selectDept {
  float: left;
}
.selectMon {
  padding-left: 50px;
  float: left;
}
.work_header {
  position: absolute;
  right: 50px;
  top: 30px;
  span {
    padding: 0 20px;
  }
}
// 计划表单
.year_table {
  text-align: center;
  .el-table {
    font-size: 15px;
  }
}
</style> 