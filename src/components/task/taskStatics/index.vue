<template>
<div id='new_progress'>
    <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item class="cursor" @click.native='back'>最新进度</el-breadcrumb-item>
            <el-breadcrumb-item>{{receiveQuery.typeName}}进度({{receiveQuery.progress}}%)</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="layout clearfix">
        <!-- 最新进度 --> 
    <!-- 筛选条件 -->
    <div class="filtrate">
       <div class="blockblock mt1">
        <el-date-picker
            v-model="dateValue"
            class="mr1"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期" @change="filterDate">
        </el-date-picker>
  
        <el-select  v-if="receiveQuery.type!=2" v-model="type" class="mr1"
            placeholder="请选择类型" @change="filterTaskType">
            <el-option
            v-for="(item,index) in taskType"
            :key="index"
            :label="item.dictDataName"
            :value="item.guid">
            </el-option>
        </el-select>
        <el-select  v-model="state" placeholder="请选择状态" v-if="receiveQuery.type!=3"  @change="filterStatus">
            <el-option
            v-for="item in stateList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
  </div>
</div>
  <!-- 导航
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1">全部</el-menu-item>
      <el-menu-item index="2">未读</el-menu-item>
      <el-menu-item index="3">完成</el-menu-item>
      <el-menu-item index="4">异常</el-menu-item>
    </el-menu> -->
<!-- 任务表单 -->
  <div class="tableContent">
    <el-table
    border
     :data="taskList">
      <el-table-column
        label="任务名"
        show-overflow-tooltip
        prop='taskName'
      > 
      </el-table-column>
      <el-table-column
        label="类型"
        width="180"
        show-overflow-tooltip
        prop='typeName'
      > 
      </el-table-column>
      <el-table-column
        label="发布人"
        width="180"
        show-overflow-tooltip
        prop='userName'
      > 
      </el-table-column>
      <el-table-column
        label="启动时间"
        width="180"
        show-overflow-tooltip
        prop='startDate'
      > 
      </el-table-column>
      <el-table-column
        label="截止时间"
        width="180"
        show-overflow-tooltip
        prop='completionDate'
      > 
      </el-table-column>
      <el-table-column
        label="进度（%）"
        width="100"
        show-overflow-tooltip
        prop='progress'
      > 
      </el-table-column>
      
      <!-- 状态 -->
      <el-table-column
        label="状态"
        width="180"
        show-overflow-tooltip
      >  
      <template slot-scope="scope">
      <el-tag size="small" color="#fa6e5a" class="state" v-show="scope.row.status==0">关闭</el-tag>
      <el-tag size="small" color="#64c88c" class="state" v-show="scope.row.status==1">完成</el-tag>
      <el-tag size="small" color="#aab4be" class="state" v-show="scope.row.status==2">草稿</el-tag>
      <el-tag size="small" color="#1e82d2" class="state" v-show="scope.row.status==3">未启动</el-tag>
      <el-tag size="small" color="#fab43c" class="state" v-show="scope.row.status==4">进行中</el-tag>  
      <el-tag size="small" color="#6ec8fa" class="state" v-show="scope.row.status==5">验收</el-tag>
      <el-tag size="small" color="#fa6478" class="state" v-show="scope.row.status==6">超时未完成</el-tag>
      <el-tag size="small" color="#fa5018" class="state" v-show="scope.row.status==7">超时完成</el-tag>
      <el-tag size="small" color="#ff5018" class="state" v-show="scope.row.status==8">异常</el-tag>
      </template>
      </el-table-column>
      <el-table-column
        label="详情"
        width="100"
      > 
      <template slot-scope="scope">
        <el-button size="mini" type="primary"  @click="turnTo('/task/new_progress/task_del/'+scope.row.guid)">详情</el-button>
      </template>      
      
      </el-table-column>
    </el-table>
  </div>
  <div class="paginationRight" v-if="pageCount > 0">
  <el-pagination
        background
        @current-change='changePage'
        v-if="pageCount > 0"
      layout="prev, pager, next"
      :page-count='pageCount'
      >
    </el-pagination>
  </div>
 

   <!-- <div class="task_content" v-for="(item,index) in taskList" :key="index"  @click="turnTo('/task/new_progress/task_del/'+item.guid)">
     <div class="task_header">
      <span class="el-icon-tickets"></span>
      <span class="type">类型:{{item.typeName}}</span>
      <span class="publish">发布人:{{item.userName}}</span>
      <el-tag size="small" color="#fa6e5a" class="state" v-show="item.status==0">关闭</el-tag>
      <el-tag size="small" color="#64c88c" class="state" v-show="item.status==1">完成</el-tag>
      <el-tag size="small" color="#aab4be" class="state" v-show="item.status==2">草稿</el-tag>
      <el-tag size="small" color="#1e82d2" class="state" v-show="item.status==3">未启动</el-tag>
      <el-tag size="small" color="#fab43c" class="state" v-show="item.status==4">进行中</el-tag>  
      <el-tag size="small" color="#6ec8fa" class="state" v-show="item.status==5">验收</el-tag>
      <el-tag size="small" color="#fa6478" class="state" v-show="item.status==6">超时未完成</el-tag>
      <el-tag size="small" color="#fa5018" class="state" v-show="item.status==7">超时完成</el-tag>
     </div>
     <div class="task_main">
       <p>{{item.taskName}}</p>
       <div class="progress">
         <el-progress :percentage="item.progress"></el-progress>
       </div>
       <div class="time">
         <span v-text="item.startDate.split(' ')[0]"></span>
         <span>至</span>
         <span v-text="item.completionDate.split(' ')[0]"></span>
       </div>
     </div>
   </div> -->
</div>
</div>
</template>
<script>
export default {
  data() {
    var userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    return {
      pageNo: 1,
      pageCount: 1,
      activeIndex: "1",
      dateValue: [],
      type: "",
      state: "",
      typeId: "",
      receiveQuery: {},
      statusId: "",
      userInfo,
      statistics: [],
      taskList: [],
      taskType: [],
      // 固定数据   0关闭，1完成，2草稿，3未启动，4进行中，5验收,6超时未完成，7超时完成
      stateList: [
        {
          value: "",
          label: "所有状态"
        },
        {
          value: "2",
          label: "草稿"
        },
        {
          value: "3",
          label: "未启动"
        },
        {
          value: "4",
          label: "进行中"
        },
        {
          value: "1",
          label: "完成"
        },
        {
          value: "0",
          label: "关闭"
        },
        {
          value: "5",
          label: "验收"
        },
        {
          value: "6",
          label: "超时未完成"
        },
        {
          value: "7",
          label: "超时完成"
        },
        {
          value: "8",
          label: "异常"
        }
      ],
      value: "",
      deptId: ""
    };
  },
  methods: {
    filterDeptId(e) {
      console.log(e,"456666666666666666666666");
    },
    changePage(e) {
      this.pageNo = e;
      this.getTask();
    },
    //任务统计
    getProgress() {
      // var userId = localStorage.getItem("user_Id")
      // console.log(userId)
      this.$ajax(
        `${this.subUrl.activity}/taskBill/statistics`,
        {
          token: this.$getkey(),
          userId: localStorage.getItem("user_Id")
        },
        res => {
          console.log(res.data);
          this.statistics = res.data.list;
        },
        this
      );
    },
    // 筛选日期
    filterDate() {
      console.log(this.dateValue, "date");
      this.getTask();
    },
    // 获取任务类型
    getTaskType() {
      this.$ajax(
        `${this.subUrl.user}/comm/getTaskType`,
        "",
        res => {
          console.log(res.data, "taskType");
          let obj = { dictDataName: "全部类型", guid: "" };
          res.data.unshift(obj);
          this.taskType = res.data;
          // this.startDate = this.taskType.startDate.split(" ")[0]
          // this.completionDate = this.taskType.completionDate.split(" ")[0]
        },
        this
      );
    },
    // 筛选任务类型
    filterTaskType(e) {
      console.log(e, "typeId");
      this.typeId = e;
      this.getTask();
    },
    // 筛选状态
    filterStatus(e) {
      this.pageNo = 1;
      console.log(e, "statusId");
      this.statusId = e;
      this.getTask();
    },
    // 获取任务 筛选任务
    getTask(taskBillType = 0) {
      var date1, date2;
      if (this.dateValue) {
        date1 = this.dateValue[0] + " 00:00:00";
        date2 = this.dateValue[1] + " 23:59:59";
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        type: taskBillType,
        startDate: date1,
        endDate: date2,
        typeId: this.typeId,
        status: this.state,
        pageSize: 12,
        pageNo: this.pageNo
      };
      if (this.deptId) data.deptId = this.deptId;
      if (this.status == "") {
        delete data.status;
      } 
      console.log(data);
      this.$ajax(
        `${this.subUrl.activity}/taskBill/taskProgress/getTaskList`,
        data,
        res => {
          console.log(res.data);
          // 分页需要数字
          this.pageCount = res.data.pageCount * 1;
          this.taskList = res.data.list;
        },
        this
      );
    },

    // 查看任务详情
    turnTo(e) {
      this.$router.push(e);
    }
  },
  mounted() {
    // 任务统计
    console.log(this.$route.query);
    this.receiveQuery = this.$route.query;
    if (this.receiveQuery.type == 1) {
      this.deptId = this.receiveQuery.deptId;
    } else if (this.receiveQuery.type == 2) {
      this.typeId = this.receiveQuery.typeId;
    } else {
      this.state = 8;
    }
    this.dateValue[0] = this.receiveQuery.startDate.substr(0,10)
    this.dateValue[1] = this.receiveQuery.endDate.substr(0,10)
    // this.getProgress();
    // 获取任务类型
    this.getTaskType();
    // 获取任务
    this.getTask();
  }
};
</script>
<style lang="scss" scoped>
.paginationRight{
  position:static;
}
#new_progress {
  padding-left: 300px;
  padding-right: 40px;
  height: 100%;
  overflow: scroll;
}
.show {
  top: 3.6rem;
}
.layout {
  position: relative;
  padding-bottom: 200px;
  //   padding-top: 40px;
}
.tableContent {
  padding: 10px;
}
.new_progress {
  background: #fff;
  margin: 0 0 20px;
  .tip {
    color: #999;
    line-height: 56px;
    padding: 0 20px;
    border-bottom: 1px solid #ccc;
  }
  .sideBar {
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    padding: 10px 20px;
  }
  .circle_bar {
    width: 10%;
    // padding: 20px 20px 0 20px;
    float: left;
    text-align: center;
  }
}
.filtrate {
  height: 40px;
  background: #fff;
  padding: 0 10px;
}
.block {
  float: left;
  margin-right: 10px;
}

.el-menu {
  background-color: #fff;
}
.el-menu--horizontal li {
  padding: 0 80px;
}

// 任务内容
.task_content {
  padding: 0px 0 50px 0px;
  margin: 20px 0;
  background: #fff;
  .task_header {
    height: 30px;
    border-bottom: 1px solid #ccc;
    span {
      float: left;
      height: 30px;
      line-height: 29px;
    }
    // .icon {
    //   width: 30px;
    //   background: red;
    //   margin: 0 20px;
    // }
    .el-icon-tickets {
      font-size: 18px;
      padding: 0px 10px;
    }
    .publish {
      padding-left: 200px;
    }
    .state {
      float: right;
      margin-right: 50px;
    }
  }
  .task_main {
    padding: 10px 20px;
    p {
      padding: 10px 0px;
      font-size: 18px;
      font-weight: 700;
    }
    .progress {
      .el-progress {
        float: left;
        width: 400px;
      }
    }
    .time {
      float: right;
      margin-right: 20px;
      span {
        color: #999;
        font-size: 15px;
      }
    }
  }
}
</style> 