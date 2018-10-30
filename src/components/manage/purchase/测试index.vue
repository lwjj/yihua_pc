<template>
<div id='purchase'>
      <div class="title">
        <div class="text">采购销售</div>
    </div>
    <div class="layout clearfix">
    <!-- 筛选条件 -->
    <div class="filtrate">
       <div class="block">
      <!-- <span class="demonstration">筛选条件</span> -->
      <el-date-picker
        style="width:250px"
        v-model="dateValue"
        type="daterange"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期" @change="filterDate">
      </el-date-picker>
  </div>
   <el-select style="width:150px" v-model="state" placeholder="请选择状态"  @change="filterStatus">
    <el-option
      v-for="item in department"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
   <el-select style="width:150px" v-model="type" placeholder="请选择类型" @change="filterTaskType">
    <el-option
      v-for="(item,index) in taskType"
      :key="index"
      :label="item.dictDataName"
      :value="item.guid">
    </el-option>
  </el-select>
   <el-select style="width:150px" v-model="state" placeholder="请选择状态"  @change="filterStatus">
    <el-option
      v-for="item in stateList"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</div>
<!-- 导航
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
    <el-menu-item index="1">全部</el-menu-item>
    <el-menu-item index="2">未读</el-menu-item>
    <el-menu-item index="3">完成</el-menu-item>
    <el-menu-item index="4">异常</el-menu-item>
  </el-menu> -->
<!-- 采购表单 -->
   <div class="task_content" v-for="(item,index) in taskList" :key="index"  @click="turnTo('/manage/purchase/pur_del')">
     <div class="task_header">
      <span class="el-icon-tickets"></span>
      <span class="type">类型:采购</span>
      <span class="state" v-show="true">同意</span>
     </div>
     <div class="task_main">
       <p>采购了一批黄金</p>
          <span class="depart">部门:工程部</span>
          <span class="apply">申请人:蒋委员长</span>
       <div class="time">
         <span>{{item.startDate}}</span>
       </div>
     </div>
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
      department: [
        {
          value: "",
          label: "所有部门"
        }
      ],
      // 固定数据 所有状态
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
      ],
      value: ""
    };
  },
  methods: {
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
        typeId: this.typeId,
        status: this.statusId
      };
      console.log(data);
      this.$ajax(
        `${this.subUrl.activity}/taskBill/taskProgress/getTaskList`,
        data,
        res => {
          console.log(res.data);
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
    // 获取任务类型
    this.getTaskType();
    // 获取任务
    this.getTask();
  }
};
</script>
<style lang="scss" scoped>
#purchase {
  padding-left: 300px;
  padding-right: 40px;
  height: 100%;
  overflow: scroll;
}
.text {
  float: left;
}
.layout {
  position: relative;
  padding-top: 20px;
  padding-bottom: 200px;
}
.filtrate {
  height: 40px;
  background: #fff;
}
.block {
  display: inline;
}
// 导航栏
.el-menu {
  background-color: #fff;
}
.el-menu--horizontal li {
  padding: 0 80px;
}

// 任务内容
.task_content {
  // width: 100%;
  height: 150px;
  // padding: 0px 50px;
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
  .apply {
    position: absolute;
    left: 30%;
  }
  .task_main {
    padding: 0px 20px;
    p {
      padding: 10px 0px;
      font-size: 18px;
      font-weight: 700;
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