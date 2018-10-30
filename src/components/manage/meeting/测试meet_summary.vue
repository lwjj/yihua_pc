<template>
<div id='pur_del'>
    <div class="title">
        <div class="text"><i @click="back" class="el-icon-arrow-left"></i>会议纪要表</div>
    </div>
    <div class="del">
        <div class="del_title">
            <span></span>
        </div>
      <ul class="delList clearfix">
        <li>发言人:<span>张三</span></li>
        <li>内容:<span>会议的具体内容会议的具体内容会议的具体内容会议的具体内容</span></li>
        <li>执行人:<span>张三</span></li>
        <li>截止日期:<span>2018-1-30</span></li>
        <li>验证人:<span>张三</span></li>
        <li>完成情况:<span>80%</span></li>
      </ul>
      <!-- <div class="info">
        <p>132456</p>
        <ul class="photo clearfix" >
            <li v-for="(item,index) in taskDel.commAccessoryList" :key="index">
                <img :src="item.path" alt="">
            </li>
        </ul>
      </div>
      <div class="lead_idea">
          <div>主任/经理意见</div>
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
#pur_del {
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
    padding: 5px 0;
  }
  span {
    padding-left: 20px;
  }
  p{}
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