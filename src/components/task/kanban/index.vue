<template>
  <div class="newRightContent">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>看板</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
       <div class="border content bgWhite">
           <div class="box" v-if="info.watchBillDtoList">
               <div class="list">
                   <div class="top">
                       <img src="../../../assets/images/task-icon/date.png" alt="">
                      <span> {{info.sysCurrentDate.substr(0,7)}}</span>
                   </div>
                   <div class="center">{{info.sysCurrentDate.substr(8,2)}}</div>
                   <div class="bottom">{{info.watchBillDtoList.week}}</div>
               </div>
               <div class="list" @click="turnTo('/manage/meeting')">
                   <div class="top">
                       <img width="60" height="58" src="../../../assets/images/task-icon/edit.png" alt="">
                       <span>会议纪要</span>
                   </div>
                   <div class="center" v-for="(item,index) in info.examineBillList" v-if="index<2" :key="index">{{item.title}}</div>
               </div>
               <div class="list"  @click="turnTo('/manage/inform')">
                   <div class="top">
                       <img width="60" height="59" src="../../../assets/images/task-icon/message.png" alt="">
                       <span>通知</span>
                   </div>
                   <div class="center" v-for="(item,index) in info.commMessageList" v-if="index<2" :key="index">{{item.title}}</div>
               </div>
               <div class="list" @click="turnTo('/manage/scheduling/scheduling_show')">
                   <div class="top">
                       <img width="60" height="60" src="../../../assets/images/task-icon/diaodu.png" alt="">
                       <span>管理处调度</span>
                   </div>
                   <div class="center" v-for="(item,index) in info.watchBillDtoList.deptList" :key="index">{{item.deptName}}:{{item.phone?item.phone:"无"}}</div>
               </div>
               <div class="list"  @click="turnTo('/manage/emergency')">
                   <div class="top">
                       <img width="60" height="61" src="../../../assets/images/task-icon/jicha.png" alt="">
                       <span>突发事件</span>
                   </div>
                   <div class="center" v-for="(item,index) in info.emergencyBillList" v-if="index<2" :key="index">{{item.eventDetail}}</div>
               </div>
               <div class="list" @click="turnTo('/manage/quality')">
                   <div class="top">
                       <img width="60" height="59" src="../../../assets/images/task-icon/cha.png" alt="">
                       <span>品质稽查</span>
                   </div>
                   <!-- <div class="center" v-for="(item,index) in info.emergencyBillList" v-if="index<2" :key="index">{{item.eventDetail}}</div> -->
               </div>
           </div>
       </div>
  </div>
 
</template>
<script>
export default {
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    return {
      info: {}
    };
  },
  methods: {
    getInfo() {
      let data = {
        userId: this.userInfo.guid,
        token: this.$getkey(),
        organId: this.organInfo.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/infoBar/getInformationBar`,
        data,
        res => {
          console.log(res.data);
          this.info = res.data;
        },
        this
      );
    },
    turnTo(url) {
      this.$router.push(url);
    }
  },
  mounted() {
    this.getInfo();
  }
};
</script>

<style lang="scss" scoped>
.content {
  padding: 10px;
  background: #fff;
  height: 100%;
}
.box::after {
  content: "";
  display: block;
  clear: both;
}
.box > .list {
  float: left;
  width: 300px;
  margin-right: 15px;
  margin-bottom: 15px;
  height: 180px;
  border-radius: 10px;
  background: #30a7ff;
  color: #fff;
  cursor: pointer;
  .top {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    align-items: center;
    font-size: 18px;
  }
  .center {
    text-align: left;
    max-width: 80%;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0 20px;
    height: 100%;
    line-height: 1.5;
  }
}
.box > .list:nth-child(1) {
  width: 200px;
  cursor: auto;
  .top {
    justify-content: center;
    img {
      margin-right: 10px;
    }
  }
  .center {
    font-size: 40px;
    text-align: center;
  }
  .bottom {
    text-align: center;
    font-size: 20px;
  }
}
.box > .list:nth-child(5) {
  background: #ff6564;
}
.box > .list:nth-child(6) {
  background: #5781fc;
}
</style>

