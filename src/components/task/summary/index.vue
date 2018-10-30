<template>
<div id='subTemplate'>
      <div class="title">
        <div class="text">上月总结</div>
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
          placeholder="选择月(默认为上月)">
        </el-date-picker>
        <el-select v-model="type" placeholder="请选择部门" v-if="userInfo.postType == 2" @change="filterDept">
          <el-option
            v-for="(item,index) in deptType"
            :key="index"
            :label="item.deptName"
            :value="item.guid">
          </el-option>
        </el-select>
    </div>
   <div class="work_header">
    <span>完成度:&nbsp;{{this.allProgress.progress}}%</span>
    <a><router-link to="/task/summary/summary_detail">明细说明</router-link></a>
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
      width="180"
      >
    </el-table-column>
    <el-table-column
      prop="taskDetail"
      label="标准/细化点"
      >
    </el-table-column>
    <el-table-column
    width="180px"
      prop="completionDate"
      label="截至时间"
      >
    </el-table-column>
    <el-table-column
      label="责任人"
      width="120"
      >
       <template slot-scope="scope">
         <span v-for="(item,index) in scope.row.executorInfo" :key="index">{{item.name}}</span>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      width="140px"
      prop="progress"
      label="进度结论(%)"
      >
    </el-table-column>
    <!-- <el-table-column
    header-align="center"
      label="操作"
      >
      <template slot-scope="scope">
        <el-button el-button type="primary" plain size="small">查看</el-button>
      </template>
    </el-table-column> -->
  </el-table>
 </div>
</div>
</div>
</template>
<script>
export default {
  data() {
    this.mHeight = Number(this.$getClientHeight()) - 145;
    return {
      userInfo: {},
      organInfo: {},
      dateValue: "",
      //默认选中的部门
      deptId: "425439551796805632",
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
          for (var i of res.data) {
            if (i.guid == this.userInfo.deptId) {
              this.deptId = i.guid;
              this.type = i.deptName;
            }
          }
          this.deptType = res.data;
        },
        this
      );
    },
    //获取上月总结
    getWork() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        queryDeptId: this.deptId,
        month: this.dateValue
      };
      console.log(data, "workdata");
      this.$ajax(
        `${this.subUrl.activity}/taskBill/getLmSummary`,
        data,
        res => {
          console.log(res, "summary");
          this.allProgress = res.data;
          this.tableData = res.data.list;
        },
        this
      );
    }
  },
  activated() {
    if (this.isFirst) {
      this.getWork();
    } else {
      this.isFirst = true;
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
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
  overflow: scroll;
}
.text {
  float: left;
}

.layout {
  position: relative;
  // padding-top: 20px;
  // padding-bottom: 200px;
}
.filtrate {
  height: 50px;
  line-height: 60px;
  padding-right: 10px;
  background: #fff;
  .block {
    float: right;
  }
}
.work_header {
  padding-right: 10px;
  span {
    padding: 0 20px;
  }
  a {
    color: #1e82d2;
    cursor: pointer;
  }
}
</style> 