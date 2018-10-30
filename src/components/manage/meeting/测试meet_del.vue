<template>
<div id='meet_del'>
    <div class="title">
        <div class="text"><i @click="back" class="el-icon-arrow-left"></i>会议详情</div>
    </div>
    <div class="del">
        <!-- <div class="del_title">
            <span>标题:关于招聘人员培训</span>
        </div>       -->
      <ul class="delList clearfix">
        <li>汇报人:<span>马小云</span></li>
        <li>会议地点:<span>会议室</span></li>
        <li>会议时间:<span>2020/10/10</span></li>
        <li>参与人:<span>将委员,李四,王三</span></li>
        <li>单号:<span>14528524695455</span></li>
      </ul>

      <!-- 会议内容 -->
   <div class="meet_content"  @click="turnTo('/manage/meeting/meet_summary')">
     <div class="meet_header">
      <span class="el-icon-tickets"></span>
      <p class="meet_text">会议内容会议内容会议内容会议内容</p>
      <span class="time">2018-1-1</span>
    </div>
     <ul class="meet_bottom clearfix">
          <li class="speak">发言人:老五</li>
          <li class="carray">执行人:林九</li>
          <li class="verify">验证人:蒋委员长</li>
       </ul>
    </div>
       
     </div>
   </div>
       <!-- <div class="work_content">
            <ul class="con_title clearfix">
                <li>工作内容</li>
                <li>进度</li>
               
            </ul>
            <ul class="con_list clearfix">
                <li><p>1.房间里的撒娇佛决定离开房间酸辣粉撒旦法</p></li>
                <li>执行人:<span>吴彦祖</span></li>
                <li>完成进度:<span>20%</span></li>
            </ul>
            <ul class="con_list clearfix">
                <li><p>1.房间里的撒娇佛决定离开房间酸辣粉撒旦法</p></li>
                <li>执行人:<span>吴彦祖</span></li>
                <li>完成进度:<span>20%</span></li>
            </ul>
            <ul class="con_list clearfix">
                <li><p>1.房间里的撒娇佛决定离开房间酸辣粉撒旦法</p></li>
                <li>执行人:<span>吴彦祖</span></li>
                <li>完成进度:<span>20%</span></li>
            </ul>
            <ul class="con_list clearfix">
                <li><p>1.房间里的撒娇佛决定离开房间酸辣粉撒旦法</p></li>
                <li>执行人:<span>吴彦祖</span></li>
                <li>完成进度:<span>20%</span></li>
            </ul>
        </div> -->
      <!-- <div class="info">
        <p>132456</p>
        <ul class="photo clearfix" >
            <li v-for="(item,index) in taskDel.commAccessoryList" :key="index">
                <img :src="item.path" alt="">
            </li>
        </ul>
      </div>
      <div class="lead_idea">
          <div>审批意见</div>
           <p>132456</p>
      </div> -->
    </div>
</div>

</template>
<script>
export default {
  data() {
    return {
      id: "",
      taskDel: {},
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    // 查看详情
    turnTo(e) {
      this.$router.push(e);
    },
    //请求详情页面
    getTaskDel() {
      var data = {
        token: this.$getkey(),
        userId: localStorage.getItem("user_Id"),
        taskId: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.activity}/taskBill/taskProgress/taskBillDetail`,
        data,
        res => {
          console.log(res, "res");
          this.taskDel = res.data;
          console.log(this.taskDel, "taskDel");
        },
        this
      );
    },

    back() {
      this.$router.go(-1);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  },
  mounted() {
    // this.getTaskDel();
  }
};
</script>
<style lang="scss" scoped>
#meet_del {
  height: 100%;
  padding-left: 300px;
  padding-right: 40px;
  overflow: scroll;
  .text {
    i {
      padding: 20px 20px;
    }
  }
}
.del {
  padding-bottom: 200px;
}
.del_title {
  margin-top: 20px;
  padding: 10px 40px;
  background: #fff;
  border-bottom: 1px solid #ccc;
  .idea {
    float: right;
  }
}
.delList {
  background: #fff;
  padding: 20px 50px;
  li {
    width: 50%;
    padding: 5px 0;
    float: left;
  }
  span {
    padding-left: 20px;
  }
}
//会议内容
.meet_content {
  margin-top:20px; 
  padding: 20px;
  background: #fff;
  .meet_header{
    padding-bottom: 20px;
    .meet_text{
      margin: 0;
      display: inline-block;
      font-size: 20px;
      font-weight: 600;
    }
    .time{
      float: right;
      padding-right:50px;
    }
  }
  .meet_bottom{
    li{
      float: left;
      width: 33%;
      font-size: 15px;
      color: #999;
    }
  }
}

.work_content {
  margin-top: 20px;
  padding: 10px 40px;
  background: #fff;
  .con_title {
    li {
      width: 50%;
      float: left;
      border-bottom: 1px solid #ccc;
      padding: 10px 0;
    }
  }
  .con_list {
    margin: 30px 0;
    li {
      &:nth-of-type(1) {
        p {
          margin: 0 0 5px 0;
        }
      }
      &:nth-of-type(2),
      &:nth-of-type(3) {
        width: 50%;
        float: left;
        color: #999;
      }
    }
  }
}
.info {
  padding: 20px 50px;
  background: #fff;
  margin: 20px 0;
  p {
    padding: 5px 5px 100px 5px;
    border: 1px solid #ccc;
  }
  .photo {
    li {
      float: left;
      margin: 10px 10px;
      border: 1px solid #ccc;
      img {
        width: 150;
        height: 150px;
        display: block;
      }
    }
  }
}
.lead_idea {
  padding: 20px 50px;
  background: #fff;
  margin: 20px 0;
  p {
    padding: 5px 5px 100px 5px;
    border: 1px solid #ccc;
  }
}
</style>