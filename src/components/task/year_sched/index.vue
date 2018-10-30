<template>
<div id='year_sched'>
      <div class="title">
        <div class="text">年度计划</div>
       <!-- <span class="build_icon" @click="turnTo('/task/year_sched/buildyear/'+yearValue+'/'+deptId)">
          <i class="el-icon-plus">&nbsp;&nbsp;添加计划</i>
        </span> -->
    </div>
    <div class="layout clearfix">
    <!-- 筛选条件 -->
    <div class="filtrate">
       <div class="block">
        <el-button @click="print">打印表格</el-button>
        <el-date-picker
        @change="filterYear"
          v-model="yearValue"
          align="left"
          type="year"
          format="yyyy 年度计划"
          value-format="yyyy"
          placeholder="选择年度">
        </el-date-picker> 
        <el-select style="width:150px" v-model="type" placeholder="请选择部门" @change="filterDept">
          <el-option
            v-for="(item,index) in deptType"
            :key="index"
            :label="item.deptName"
            :value="index">
          </el-option>
        </el-select>
        <el-button v-if="showBuild" class="build_btn" @click="turnTo('/task/year_sched/buildyear/'+yearValue+'/'+acturyId+ '?name='+deptName)"><i class="el-icon-plus"></i>&nbsp;新建</el-button>
      </div>
      <div class="marktable">
        <span>制表人:{{this.marktable.userName}}</span>
        <span>复核人:{{this.marktable.examinerName}}</span>
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
      prop="content"
      label="工作内容"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="month"
      align="center"
      width="140px"
      label="时间安排(月份)"
      >
    </el-table-column>
    <el-table-column
      prop="userName"
      label="责任人"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="time"
      align="center"
      label="频次"
      width="80px"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="progress"
      align="center"
      width="140px"
      label="完成情况(%)"
      >
    </el-table-column>
    <el-table-column 
      fixed="right"
      min-width="160px"
      label="操作"
      >
      <template slot-scope="scope">
        <el-button type="primary" :disabled="!(currentYear === yearValue && scope.row.month > currentMonth)" size="mini" @click="edit(scope)">编辑</el-button>
      </template>
    </el-table-column>
    <!-- <el-table-column
    header-align="center"
     align="center"
     width="140px"
      label="操作"
      >
      <template slot-scope="scope">
        <el-button el-button type="primary" plain size="small">编辑</el-button>
      </template>
    </el-table-column> -->
  </el-table>
  
 </div>
      <!-- <el-pagination  
            v-if="rowCount"
            background
            style="float:right;"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="rowCount">
        </el-pagination> -->
  <div class="inform_table2" id="printcode" v-show="print1">
   <el-table
    :data="tableData"
    border
    :height="mHeight"
    >
    <el-table-column
      type="index"
      label="序号"
      width="100px"
      align="center"
      >
    </el-table-column>
    <el-table-column
      prop="content"
      label="工作内容"
      width="640px"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="month"
      align="center"
      width="160px"
      label="时间安排(月份)"
      >
    </el-table-column>
    <el-table-column
      prop="userName"
      label="责任人"
      width="200px"
      align="center"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="time"
      align="center"
      label="频次"
      width="100px"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="progress"
      align="center"
      width="160px"
      label="完成情况(%)"
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
      // rowCount: "",
      userInfo: {},
      showBuild: false,
      organInfo: {},
      yearValue: "",
      //默认选中的部门
      deptId: "",
      type: "",
      deptName: "",
      deptType: [],
      marktable: {},
      tableData: [],
      print1: false,
      value: ""
      // {
      //   index: "1",
      //   work_con: "上海市普陀区金沙江路金沙江路金沙江路金沙江路金沙江路金沙江路金沙江路金沙江路 1518 弄",
      //   time_plan: "2018/1/1",
      //   res_people: "汪东城",
      //   times: "5",
      //   complete: "58%"
      // }
    };
  },
  methods: {
    edit({ row, index }) {
      this.$router.push(
        "/task/year_sched/buildyear/" +
          this.yearValue +
          "/" +
          this.acturyId +
          "?name=" +
          this.deptName +
          `&${this.$qs.stringify(row)}`
      );
    },
    turnTo(e) {
      this.$router.push(e);
    },
    handleClick(row) {},
    // 筛选部门
    filterDept(e) {
      this.deptId = e;
      this.acturyId = this.deptType[e].guid;
      this.deptName = this.deptType[e].deptName;
      this.getYearPlan();
    },
    // 筛选年度
    filterYear(e) {
      this.yearValue = e;
      this.getYearPlan();
    },
    // 获取部门
    getDpet() {
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/admin/deptManage/organDepartmentInfo`,
        data,
        res => {
          this.type = this.userInfo.deptId;
          this.deptType = res.data;
          if (res.data) {
            for (var [i, val] of res.data.entries()) {
              if (val.deptName == this.userInfo.deptName) {
                this.type = i;
                this.deptId = i;
              }
            }
          }
          this.getYearPlan();
          // this.selectDept = this.deptType[0].value;
        },
        this
      );
    },
    // 获取年计划
    getYearPlan() {
      var data = {
        token: this.$getkey(),
        year: this.yearValue,
        deptId: this.deptType[this.deptId].guid
      };
      this.$ajax(
        `${this.subUrl.activity}/yearlyPlan/getPlan`,
        data,
        res => {
          if (res.data) {
            this.marktable = res.data;
            this.tableData = res.data.monthlyPlanList;
            // this.rowCount = +res.data.monthlyPlanList.length;
          } else {
            this.tableData = [];
          }
        },
        this
      );
    },
    //打印
    print(e) {
      let subOutputRankPrin = document.getElementById("printcode");
      var options = {
        format: "CODE128",
        displayValue: true,
        fontSize: 18,
        height: 100
      };
      document.body.innerHTML = subOutputRankPrin.innerHTML;
      window.print();
      window.location.reload();
      document.body.innerHTML = oldContent;
    }
  },
  activated() {
    if (this.isFirst) {
      this.getYearPlan();
    }
    this.isFirst = true;
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    let d = new Date();
    this.yearValue = d.getFullYear() + "";
    this.currentYear = this.yearValue;
    this.currentMonth = d.getMonth() + 1;
    this.acturyId = this.userInfo.deptId;
    this.deptName = this.userInfo.deptName;
    // this.showBuild = true;
    this.$getRoot(res => {
      var arr = res.taskBill;
      if (arr.subclass.length > 0) {
        for (var v of arr.subclass) {
          console.log(v.alias);
          if ((v.alias = "yearPlan")) {
            if (v.subclass && v.subclass.length > 0) {
              this.showBuild = true;
            }
          }
        }
      }
    }, this);
    this.getDpet();
  }
};
</script>
<style lang="scss" scoped>
#year_sched {
  padding-left: 260px;
  padding-right: 10px;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
}
.text {
  float: left;
}
.build_icon {
  float: right;
  text-align: center;
  cursor: pointer;
}
.layout {
  position: relative;
  padding-right: 10px;
  background: #fff;
  height: 100%;
  // padding-bottom: 200px;
}
.filtrate {
  height: 60px;
  line-height: 60px;
  background: #fff;
}
.block {
  position: relative;
  float: right;
}
.marktable {
  position: absolute;
  left: 20px;
  top: 0px;
  span {
    padding-left: 10px;
  }
}

.inform_table {
  margin-bottom: 0;
  margin-top: 0;
  padding-right: 0;
}
</style> 