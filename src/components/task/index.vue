<template>
 <!-- 任务单二级菜单 -->
<div id='task'>
   <!-- 头部 -->
    <div class="all_header">
      <!-- 搜索栏 -->
      <!-- <el-autocomplete
        class="inline-input"
        placeholder="搜索内容"
      ></el-autocomplete> -->
    </div>
   
  <div class="submenu">
  <router-link to="/task/new_progress">
     <div class="menu new_progress">
    <div class="sub_icon ">
      <img src="../../assets/images/task-icon/new.png" alt="">
    </div>
    <div class="text">最新进度</div>
  </div>
  </router-link>
  <router-link to="/task/allocate">
  <div class="menu">
    <div class="sub_icon">
      <img src="../../assets/images/task-icon/fen.png" alt="">
    </div>
    <div class="text">我分配的</div>
  </div>
  </router-link>
  <router-link to="/task/received"  v-if="userInfo.postType >= 3">
     <div class="menu">
    <div class="sub_icon">
      <img src="../../assets/images/task-icon/shou.png" alt="">
    </div>
    <el-badge :value="taskNum" :max="9" class="item" :hidden="taskNum==0">
      <div class="text">我收到的</div>
    </el-badge>
  </div>
  </router-link>
  <router-link to="/task/year_sched">
  <div class="menu">
    <div class="sub_icon">
      <img src="../../assets/images/task-icon/year.png" alt="">
    </div>
    <div class="text">年度计划</div>
  </div>
  </router-link>
  <router-link to="/task/summary">
  <div class="menu">
    <div class="sub_icon">
      <img src="../../assets/images/task-icon/shang.png" alt="">
    </div>
    <div class="text">上月总结</div>
  </div>
  </router-link>
  <router-link to="/task/current_work">
  <div class="menu">
    <div class="sub_icon">
      <img src="../../assets/images/task-icon/ben.png" alt="">
    </div>
    <div class="text">本月工作</div>
  </div>
  </router-link>
  <router-link to="/task/next_month">
  <div class="menu">
    <div class="sub_icon">
      <img src="../../assets/images/task-icon/xia.png" alt="">
    </div>
    <div class="text">下月计划</div>
  </div>
  </router-link>
   <router-link to="/task/kanban" v-if="userInfo.postType == 2">
    <div class="menu">
      <div class="sub_icon" :style="{background:getRandomColor()}">
        <!-- <img src="../../assets/images/task-icon/xia.png" alt=""> -->
        <div>看</div>
      </div>
      <div class="text">看板</div>
    </div>
  </router-link>
</div>
<div class="mainContent">
  <keep-alive>
    <router-view v-if="$route.meta.keepAlive"></router-view> 
  </keep-alive>
  <router-view v-if="!$route.meta.keepAlive"></router-view> 
</div>
  </div>
</template>
<script>
export default {
  name: "",
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    return {
      title: "",
      taskNum: 0,
      fuColor: ["#3eb7e6", "#62c88c", "#fab23e", "#fa697c", "#adb8c0"]
    };
  },

  methods: {
    getRandomColor() {
      return this.$fuColor[parseInt(Math.random() * 5)];
    }
  },
  mounted() {
    this.$store.commit("setActivemenu", 2);

    this.$getTaskNum(res => {
      this.taskNum = res.data.newTasksNum;
    }, this);
  }
};
</script>
<style lang="scss" scoped>
// 该组件下的状态文字大小修改
.el-tag.state {
  font-size: 14px;
}
#task {
  height: 100%;
  background: #f2f2f7;
  // 第二级内容
  .submenu {
    float: left;
    overflow-x: hidden;
    width: 260px;
    height: 100%;
    position: absolute;
    background: #fff;
    border: 1px solid #f3f3f7;
    .menu {
      height: 65px;
      box-sizing: border-box;
      // border: 1px solid #e7e7e7;
      .sub_icon {
        width: 35px;
        height: 35px;
        margin: 15px;
        float: left;
        overflow: hidden;
        border-radius: 50%;
        background: #fff;
        text-align: center;
        line-height: 35px;
        font-size: 20px;
        color: #fff;
        font-weight: 600;
        img {
          width: 100%;
          height: 100%;
          display: inline-block;
          border-radius: 50%;
        }
      }
      .text {
        line-height: 65px;
      }
    }
  }
}

// 第三级内容
.mainContent {
  width: 100%;
  height: 100%;
  overflow: hidden;
  float: left;
}
// 路由激活
.router-link-active {
  .menu {
    background: #f2f2f7;
  }
}
</style>