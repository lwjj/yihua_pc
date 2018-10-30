<template>
<div id='quality'>
    <div class="title">
        <div class="text">值班表</div>
        <!-- <span class="build_icon" @click="turnTo('/task/year_sched/buildyear/'+yearValue+'/'+deptId)">
          <i class="el-icon-plus">&nbsp;&nbsp;添加计划</i>
        </span> -->
        <el-button v-if="dateType==1||dateType==2" 
            type="primary" size="small" class="build_icon"  
            @click="turnTo('/manage/watch_bill/edit_bill/'+dateType)">编辑</el-button>
    </div>
    <div class="layout" v-if="loading">
          <!-- 筛选条件 -->
    <div class="filtrate">
          <!-- tab切换 -->
      <el-menu :default-active="activeIndex" 
      class="el-menu-demo"
       mode="horizontal" 
       active-text-color="#1e82d2" 
       @select="filterDay">
        <el-menu-item index="1">今天</el-menu-item>
        <el-menu-item index="2">明天</el-menu-item>
        <el-menu-item index="3">昨天</el-menu-item>
      </el-menu>
    </div>
    <div class="watchBill">
       <ul class="delList clearfix">
        <li><i>日期时间：</i><span>{{watchData.watchDate}}&nbsp;&nbsp;{{watchData.week}}</span></li>
        <li><i>管理处总调度：</i><span v-if="watchData.dispatcher">{{watchData.dispatcher.name}}</span></li>  
        <li><i>联系电话：</i> <span v-if="watchData.dispatcher">{{watchData.dispatcher.account}}</span></li>
        <li><i>管理处当值总值班：</i><span v-if="watchData.watch">{{watchData.watch.name}}</span></li>  
        <li><i>联系电话：</i> <span v-if="watchData.watch">{{watchData.watch.account}}</span></li>       
      </ul>
    </div>
      <!-- 表单 -->
    <div class="watchDept" v-if="true">
      <ul class="clearfix">
        <li><i class="el-icon-date"></i>早班</li>
        <li>客户部：<span v-if="list[0][0].userInfo">{{this.list[0][0].userInfo.name}}</span></li>
        <li>工程部：<span v-if="list[0][1].userInfo">{{this.list[0][1].userInfo.name}}</span></li>
        <li>秩序部：<span v-if="list[0][2].userInfo">{{this.list[0][2].userInfo.name}}</span></li>
      </ul>
      <ul class="clearfix">
        <li><i class="el-icon-date"></i>中班</li>
        <li>客户部：<span v-if="list[1][0].userInfo">{{this.list[1][0].userInfo.name}}</span></li>
        <li>工程部：<span v-if="list[1][1].userInfo">{{this.list[1][1].userInfo.name}}</span></li>
        <li>秩序部：<span v-if="list[1][2].userInfo">{{this.list[1][2].userInfo.name}}</span></li>
      </ul>
      <ul class="clearfix">
        <li><i class="el-icon-date"></i>晚班</li>
        <li>客户部：<span v-if="list[2][0].userInfo">{{this.list[2][0].userInfo.name}}</span></li>
        <li>工程部：<span v-if="list[2][1].userInfo">{{this.list[2][1].userInfo.name}}</span></li>
        <li>秩序部：<span v-if="list[2][2].userInfo">{{this.list[2][2].userInfo.name}}</span></li>
      </ul>
    </div>
    <div class="phone">
      <ul>
        <li v-for="(item,index) in this.watchData.deptList" :key="index">{{item.deptName}}电话：<span>{{item.tel}}</span></li>
      </ul>
    </div>
</div>

</div>
</template>
<script>
export default {
  data() {
    return {
      loading:false,
      dateType:"1",
      activeIndex: "1",
      userInfo: {},
      organInfo: {},
      watchData: "",
      status: "",
      statusId: "",
      list:"",
      // 固定数据   0：待审核 1：已通过 2：驳回
      stateList: [
        {
          value: "",
          label: "所有状态"
        },
        {
          value: "0",
          label: "待审核"
        },
        {
          value: "1",
          label: "已通过"
        },
        {
          value: "2",
          label: "驳回"
        }
      ]
    };
  },
  methods: {
    turnTo(e) {
      this.$router.push(e);
    },
    // 筛选状态
    filterStatus(e) {
      this.statusId = e;
      console.log(e);
      this.getList();
    },
    // 筛选天
    filterDay(e){  
      console.log(e,"day")
      this.dateType = e;
      this.getList();
    },
    // 获取列表
    getList() {
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid,
        dateType: this.dateType
      };
      console.log(data, "data");
      this.$ajax(
        `${this.subUrl.activity}/watchBill/getWatchBill`,
        data,
        res => {
          console.log(res, "getList");
          this.watchData = res.data;
          this.list = res.data.list;
          this.loading = true;
        },
        this
      );
    },

  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    console.log(this.userInfo);
    console.log(this.organInfo);
    this.getList();
  }
};
</script>
<style lang="scss" scoped>
#quality {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: scroll;
}
.layout {
 padding-left: 10px;
}
.filtrate {
  width: 100%;
  height: 60px;
  background: #fff;
  line-height: 60px;
  padding-left: 20px;
  .el-menu {
    background: #fff;
    li{
      margin: 0 10%;
    }
    // font-size: 16px;
  }
}
.build_icon{
  position: absolute;
  right: 450px;
  top: 25px;
}
//tab 切换
.el-menu-item {
  font-size: 16px;
  font-weight: 700;
}

.delList {
  background: #fff;
  padding: 20px 100px;
  margin: 20px 0;
  li {
    width: 50%;
    padding: 5px 0;
    float: left;
     i{
        display: inline-block;
        width: 150px;
        text-align: right;
      }
    &:first-of-type {
      width: 100%;
    }
  }
  span {
    padding-left: 20px;
  }
}
.watchDept{
  background: #fff;
  padding: 0 100px;
  ul{
    border-bottom: 1px dashed #888;
    padding: 30px 0 ; 
    li{
      padding-left:10px;  
      float: left;
      width: 25%;
      &:first-of-type{
        width: 80px;
        font-weight: 700;
      }
      span{
        padding-left: 5px;
      }
    }
  }
}
.phone{
   background: #fff;
   padding: 30px 100px;
   li{
     padding: 10px;
     span{
       padding-left: 20px;
     }
   }
}
</style>