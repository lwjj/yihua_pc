<template>
<div id='subTemplate'>
      <div class="title">
        <div class="text">本月工作</div>
    </div>
    <div class="layout clearfix">
    <!-- 筛选条件 -->
    <div class="filtrate">
      <div class="block">
      <el-select v-model="type" v-if="userInfo.postType == 2" placeholder="请选择部门" @change="filterDept">
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
      show-overflow-tooltip
      
      >
    </el-table-column>
    <el-table-column
      prop="taskDetail"
      show-overflow-tooltip
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
      prop="executorInfo"
      label="责任人"
      width="120"
      >
      <template slot-scope="scope">
         <span v-for="(item,index) in scope.row.executorInfo" :key="index">{{item.name}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="progress"
      label="进度结论(%)"
      align="center"
      width="140px"
      >
    </el-table-column>
    <!-- <el-table-column
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
      yearValue: this.$today().substr(0, 4),
      //默认选中的部门
      deptId: "",
      type: "",
      deptType: [],
      allProgress: {},
      tableData: []
      // executorInfo:[]
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
    //获取本月工作
    getWork() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        queryDeptId: this.deptId
      };
      console.log(data, "workdata");
      this.$ajax(
        `${this.subUrl.activity}/taskBill/getMonthWork`,
        data,
        res => {
          console.log(res, "dept");
          this.allProgress = res.data;
          this.tableData = res.data.list;
          // this.executorInfo=res.data.list.executorInfo
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

.filtrate {
  height: 50px;
  line-height: 60px;
  background: #fff;
  .block {
    float: right;
  }
}
.work_header {
  span {
    padding: 0 20px;
  }
}
</style> 