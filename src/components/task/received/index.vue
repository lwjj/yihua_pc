<template>
<div id='new_progress'>
      <div class="title">
        <div class="text">我收到的</div>
    </div>
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
 
   <el-select v-model="type" class="mr1" placeholder="请选择类型" @change="filterTaskType">
    <el-option
      v-for="(item,index) in taskType"
      :key="index"
      :label="item.dictDataName"
      :value="item.guid">
    </el-option>
  </el-select>
   <el-select v-model="state" class="mr1" placeholder="请选择状态"  @change="filterStatus">
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
      border
      height="100%"
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
        <el-button size="mini" type="primary"  @click="turnTo('/task/received/task_del/'+scope.row.guid + '/1')">详情</el-button>
      </template> 
      </el-table-column>
    </el-table>
  </div>
  <div class="paginationRight" v-if="pageCount > 0">
    <el-pagination
      v-if="pageCount > 0"
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
    var userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    return {
      pageCount: 1,
      activeIndex: "1",
      dateValue: "",
      type: "",
      state: "",
      typeId: "",
      statusId: "",
      userInfo,
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
      console.log(e, "statusId");
      this.statusId = e;
      this.getTask();
    },
    // 获取任务 筛选任务
    getTask(taskBillType = 1) {
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
        typeId: this.typeId,
        status: this.statusId
      };
      console.log(data);
      this.$ajax(
        `${this.subUrl.activity}/taskBill/taskProgress/getTaskList`,
        data,
        res => {
          console.log(res.data);
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
  }
};
</script>
<style lang="scss" scoped>
#new_progress {
  padding-left: 300px;
  padding-right: 40px;

  height: 100%;
  overflow: scroll;
}
.layout {
  position: relative;
  height: 100%;
}
.new_progress {
  padding: 20px 50px;
  background: #fff;
  margin: 20px 0;
  .tip {
    color: #999;
    height: 30px;
    border-bottom: 1px solid #ccc;
  }
  .circle_bar {
    padding: 20px 20px 0 0;
    float: left;
    text-align: center;
  }
}
.filtrate {
  background: #fff;
  padding: 10px;
  overflow: hidden;
}
.block {
  float: left;
}
.el-menu {
  background-color: #fff;
}
.el-menu--horizontal li {
  padding: 0 80px;
}
.tableContent {
  padding: 10px;
  position: absolute;
  left: 0;
  right: 0;
  top: 50px;
  bottom: 40px;
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