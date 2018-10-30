<template>
<div id='pur_del'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>详情</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/other_report' }">汇报</el-breadcrumb-item>
            <el-breadcrumb-item>汇报详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="del">
        <ul class="del_title">
            <li v-show="this.Del.status==1">状态:<span>待审批</span></li>
            <li v-show="this.Del.status==2">状态:<span>同意</span></li>
            <li v-show="this.Del.status==3">状态:<span>不同意</span></li>
        </ul>      
      <ul class="delList clearfix">
        <li>汇报标题:<span>{{Del.reportTitle}}</span></li>
        <li>汇报类型:<span>{{Del.reportTypeName}}</span></li>
        <li>关键词:<span>{{Del.reportKeyword}}</span></li>
        <li>汇报部门:<span>{{Del.deptName}}</span></li>
        <li>汇报人:<span>{{Del.userName}}</span></li>
        <li>汇报时间:<span>{{createDate}}</span></li>
        <!-- <li>汇报对象:<span>{{Del.deptName}}</span></li> -->
        <li>单号:<span>{{Del.guid}}</span></li>
      </ul>
      <div class="info">
        <div>
          <span>详情</span> 
        </div>
        <p>{{Del.reportContent}}</p>
        <vue-preview style="margin-right:30px;" class='imgPath' :slides="sliders" v-if='sliders'  @close="''"></vue-preview> 
      </div>
      </div>
      <div class="delCon">
          <div>经理意见</div>
          <p v-show="this.Del.status == 2 ||this.Del.status == 3">{{Del.manageComment}}</p>
          <textarea  placeholder="请输入审批意见" v-show="Del.status==1 && tasks" v-model="manageComment" class="idea_text"></textarea>
      </div>
       <!-- <div class="delCon">
          <div>主任意见</div>
          <p v-show="this.Del.status == 2 ||this.Del.status == 3">{{Del.directorComment}}</p>
          <textarea placeholder="请输入审批意见" v-show="this.Del.status==1" v-model="directorComment" class="idea_text"></textarea>
      </div> -->
        <div class="lead_idea" v-show="Del.status==1&&tasks">
            <el-button class="subBtn" type="danger" @click="no">不同意</el-button>
            <el-button class="subBtn" type="success" @click="yes">同意</el-button>
      </div>
    </div>


</template>
<script>
export default {
  data() {
    return {
      sliders:null,
      opinion: "",
      manageComment: "",
      imgBox: [],
      Del: {},
      startTime: "",
      endTime: "",
      createDate: "",
      tasks: null,
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    //请求详情页面
    getDel() {
      var data = {
        token: this.$getkey(),
        userId: localStorage.getItem("user_Id"),
        otherReportBillId: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.activity}/otherReportBill/getOtherRBDetaiil`,
        data,
        res => {
          console.log(res, "res");
          console.log(res.data.otherReportBill);
          this.Del = res.data.otherReportBill;
          this.tasks = res.data.tasks;
          this.imgBox = res.data.commAccessoryList;
          if(res.data.commAccessoryList){
            this.$setImg(res.data.commAccessoryList,this);
          } 
          // li时间格式化
          if (this.Del.createDate) {
            this.createDate = this.Del.createDate.split(" ")[0];
          }
        },
        this
      );
    },
    yes() {
      this.opinion = "同意";
      this.submitComment();
    },
    no() {
      this.opinion = "不同意";
      this.submitComment();
    },
    //审批
    submitComment() {
      if (this.manageComment == "") {
        this.$message.error("请填写审批意见");
        return;
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        otherRepBillId: this.$route.params.id,
        opinion: this.opinion,
        comment: this.manageComment
      };
      this.$ajax(
        `${this.subUrl.activity}/otherReportBill/approve`,
        data,
        res => {
          console.log(res, "comentres");
          this.$message.success("审批成功");
          this.back();
        },
        this
      );
    },
    back() {
      this.$router.go(-1);
    }
    // handleRemove(file, fileList) {
    //   console.log(file, fileList);
    // },
    // handlePictureCardPreview(file) {
    //   this.dialogImageUrl = file.url;
    //   this.dialogVisible = true;
    // }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getDel();
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
.del_title {
  margin-top: 20px;
  padding: 10px 50px;
  background: #fff;
  border-bottom: 1px solid #ccc;
  span {
    padding-left: 10px;
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

.info {
  padding: 20px 50px;
  background: #fff;
  margin: 20px 0;
  p {
    padding: 10px 10px 100px 10px;
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
.delCon {
  padding: 20px 50px;
  background: #fff;
  p {
    padding: 5px 5px 30px 5px;
    border: 1px solid #ccc;
  }
  .idea_text {
    margin-top: 10px;
    padding: 10px;
    font-size: 16px;
    width: 100%;
    min-height: 100px;
  }
}
.lead_idea {
  padding: 20px 50px;
  background: #fff;
  margin: 20px 0;
  text-align: center;
  .subBtn {
    margin: 0 20px;
  }
}
</style>