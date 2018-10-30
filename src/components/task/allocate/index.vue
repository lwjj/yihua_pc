<template>
<div id='allocate'>
      <div class="title" style="width:100%">
        <div class="text">我分配的任务</div>
        
    </div>
    <el-button v-if="showBuild" @click="turnTo('/task/allocate/build_task/0')" class="el-icon-plus newGoodTask" >新建任务</el-button>
    
    <div class="layout clearfix">
    <!-- 筛选条件 -->
    <div class="filtrate">
       <div class="block">
      <!-- <span class="demonstration">筛选条件</span> -->
      <el-date-picker
      class="mr1"
        v-model="dateValue"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期" @change="filterDate">
    </el-date-picker> 
   <el-select class="mr1" v-model="type" placeholder="请选择类型" @change="filterTaskType">
    <el-option
      v-for="(item,index) in taskType"
      :key="index"
      :label="item.dictDataName"
      :value="item.guid">
    </el-option>
  </el-select>
   <el-select v-model="state" placeholder="请选择状态"  @change="filterStatus">
    <el-option
      v-for="item in stateList"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  </div>
</div>

  <div class="tableContent">
    <el-table
    height="100%"
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
      </template>
      </el-table-column>
      <el-table-column
        label="详情"
        width="100"
      > 
      <template slot-scope="scope">
        <el-button size="mini" type="primary"  @click="clickTask(scope.row)">详情</el-button>
      </template>      
      
      </el-table-column>
    </el-table>
  </div>
  <div class="paginationRight" v-if="pageCount > 0">
    <el-pagination
        background
        @current-change='changePage'
      layout="prev, pager, next"
      :page-count='pageCount'
      >
    </el-pagination>
  </div>
</div>
</div>
</template>
<script>
export default {
  data() {
    return {
      showBuild: false,
      pageNo: 1,
      pageCount: 1,
      activeIndex: "1",
      dateValue: "",
      type: "",
      state: "",
      typeId: "",
      statusId: "",
      statistics: [],
      taskList: [],
      taskType: [],
      // 固定数据
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
        }
      ],
      value: ""
    };
  },
  methods: {
    changePage(e) {
      this.pageNo = e;
      this.getTask();
    },
    // 筛选日期
    filterDate() {
      this.getTask();
    },
    // 获取任务类型
    getTaskType() {
      this.$ajax(
        `${this.subUrl.user}/comm/getTaskType`,
        "",
        res => {
          let obj = { dictDataName: "全部类型", guid: "" };
          res.data.unshift(obj);
          this.taskType = res.data;
        },
        this
      );
    },
    // 筛选任务类型
    filterTaskType(e) {
      this.typeId = e;
      this.getTask();
    },
    // 筛选状态
    filterStatus(e) {
      this.statusId = e;
      this.getTask();
    },
    // 查看任务 或 草稿
    clickTask(obj) {
      if (obj.status == 2) {
        this.turnTo("/task/allocate/build_task/" + obj.guid);
      } else {
        this.turnTo("/task/allocate/task_del/" + obj.guid + "/0");
      }
    },
    // 获取任务
    getTask(taskBillType = 2) {
      var date1, date2;
      if (this.dateValue) {
        date1 = this.dateValue[0] + " 00:00:00";
        date2 = this.dateValue[1] + " 00:00:00";
      }
      var data = {
        token: this.$getkey(),
        userId: localStorage.getItem("user_Id"),
        type: taskBillType,
        startDate: date1,
        endDate: date2,
        pageNo: this.pageNo,
        pageSize: 12,
        typeId: this.typeId,
        status: this.statusId
      };
      this.$ajax(
        `${this.subUrl.activity}/taskBill/taskProgress/getTaskList`,
        data,
        res => {
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
  activated() {
    if (this.isFirst) {
      this.getTask();
    } else {
      this.isFirst = true;
    }
  },
  mounted() {
    // 获取任务类型
    this.getTaskType();
    // 获取任务
    this.getTask();
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.$getRoot(res => {
      if (res.taskBill && res.taskBill.subclass.length > 0) {
        for (let v of res.taskBill.subclass) {
          if (v.alias == "add") {
            this.showBuild = true;
          }
        }
      }
    }, this);
  }
};
</script>
<style lang="scss" scoped>
.tableContent {
  padding: 10px;
  position: absolute;
  left: 0;
  right: 0;
  top: 70px;
  bottom: 40px;
}

#allocate {
  padding-left: 300px;
  padding-right: 40px;
  height: 100%;
  overflow: scroll;
}
.text {
  float: left;
}
.build_icon {
  float: right;
  text-align: center;
  cursor: pointer;
  margin-right: 500px;
  background: #fff;
}
.layout {
  position: relative;
  height: 100%;
  padding-top: 20px;
  padding-bottom: 200px;
}
.filtrate {
  height: 40px;
  background: #fff;
  padding: 0 10px;
}
.block {
  float: left;
}
// 导航栏
.el-menu {
  background-color: #fff;
}
.el-menu--horizontal li {
  padding: 0 80px;
}
.newGoodTask {
  position: absolute;
  right: 20px;
  top: 0;
  top: 20px;
}
// 任务内容
.task_content {
  // width: 100%;
  padding: 0px 0 50px 0px;
  margin: 20px 0;
  background: #fff;
  .task_header {
    height: 30px;
    border-bottom: 1px solid #ccc;
    span {
      float: left;
      height: 30px;
      line-height: 30px;
    }
    .el-icon-tickets {
      font-size: 18px;
      padding: 0px 10px;
    }
    .state {
      float: right;
      margin-right: 50px;
    }
  }
  .publish {
    padding-left: 200px;
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