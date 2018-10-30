<template>
<div id='task_del'>
    <div class="title">
        <div class="text"><i @click="back" class="el-icon-arrow-left"></i>任务详情</div>
    </div>
    <div class="del">
      <ul class="delList clearfix">
        <li>状态:<span class="state" v-show="taskDel.taskBill.status==3">未启动</span><span class="state" v-show="taskDel.taskBill.status==4">进行中</span><span class="state" v-show="taskDel.taskBill.status==1">完成</span><span class="state" v-show="taskDel.taskBill.status==0">关闭</span><span class="state" v-show="taskDel.taskBill.status==5">验收</span><span class="state" v-show="taskDel.taskBill.status==6">超时未完成</span><span class="state" v-show="taskDel.taskBill.status==7">超时完成</span>
      </li>
        <li>标题:<span>{{taskDel.taskBill.taskName}}</span></li>
        <li>起止时间:<span>{{taskDel.taskBill.startDate}}</span></li>
        <li>创建时间:<span>{{taskDel.taskBill.createDate}}</span></li>
        <li>类型:<span>{{taskDel.taskBill.typeName}}</span></li>
        <li>单号:<span>{{taskDel.taskBill.guid}}</span></li>
      </ul>
      <div class="info">
        <p>{{taskDel.taskBill.taskDetail}}</p>
        <ul class="photo clearfix" >
            <li v-for="(item,index) in taskDel.commAccessoryList" :key="index">
                <img :src="item.path" alt="">
            </li>
        </ul>
      </div>
      <div class="people">
          <div class="ptitle">执行人信息</div>
          <p>创建人:<span>{{taskDel.taskBill.userName}}</span></p>
          <p >执行人:<span v-for="(item,index) in taskDel.taskBill.executorInfo" :key="index">{{item.name}}</span></p>
          <!-- name 报错 -->
          <p>验证人:<span>{{taskDel.taskBill.identifierInfo.name}}</span></p>  
      </div>
      <div class="assign clearfix" v-for="(item,index) in taskDel.taskProgressList" :key="index">
          <ul class="person clearfix">
              <li>指派人</li>
              <li>{{item.userName}}</li>
          </ul>
          <ul class="complete clearfix">
              <li>完成度</li>
              <li>{{item.progress}}%</li>
          </ul>
          <ul class="update clearfix">
              <li>更新时间</li>
              <li>{{item.updataTime}}</li>
          </ul>
      </div>
      <div class="state_bar">
          <el-steps :active="0"  space="300px">
            <el-step :title="item.title" v-for="(item,index) in taskDel.tasksRecordList" :key="index" :description="item.createTime"></el-step>
        </el-steps>
      </div>
      
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
          console.log(res,"res");
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
    this.getTaskDel();
  }
};
</script>
<style lang="scss" scoped>
#task_del {
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
.delList {
  background: #fff;
  padding: 20px 50px;
  margin: 20px 0;
  li {
    width: 50%;
    padding: 5px 0;
    &:first-of-type {
      width: 100%;
    }
    &:nth-of-type(1),
    &:nth-of-type(2),
    &:nth-of-type(3) {
      float: left;
    }
    &:nth-of-type(4),
    &:nth-of-type(5) {
      float: right;
    }
  }
  span {
    padding-left: 20px;
  }
}
.info {
  padding: 20px 50px;
  background: #fff;
  margin: 20px 0;
  p{
    padding: 5px 5px 100px 5px ;
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
        display: block
      }
    }
  }
}
.people {
  padding: 10px 50px 20px 50px;
  background: #fff;
  margin: 20px 0;
  .ptitle {
    color: #888;
    height: 30px;
    border-bottom: 1px solid #ccc;
  }
  p {
    padding-left: 50px;
    span {
      padding-left: 20px;
    }
  }
}
.assign {
  padding: 20px 50px;
  background: #fff;
  margin: 20px 0;

  ul {
    float: left;
    width: 200px;
    li {
      height: 40px;
      line-height: 40px;
      text-align: center;
      &:first-of-type {
        color: #888;
        border-bottom: 1px solid #ccc;
      }
    }
  }
}
.state_bar {
  height: 70px;
  padding: 20px 100px;
  background: #fff;
}
</style>