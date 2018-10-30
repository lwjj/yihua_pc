<template>
<div id='subTemplate'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>突发事件详情</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/emergency' }">突发事件</el-breadcrumb-item>
            <el-breadcrumb-item>突发事件详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="del">
      <ul class="delList clearfix">
        <li>事件类别:<span>{{emerDel.typeName}}</span></li>
        <li>审批意见:
          <span v-if="emerDel.status == 1">待审批</span>
          <span v-if="emerDel.status == 2">同意</span>
          <span v-if="emerDel.status == 3">不同意</span>
        </li>
        <li>发生地点:<span>{{emerDel.occurPlace}}</span></li>
        <li>发生时间:<span>{{emerDel.occurDate}}</span></li>
        <li>发现人:<span>{{emerDel.finder}}</span></li>
        <li>报告人:<span>{{emerDel.userName}}</span></li>
        <li>报告时间:<span>{{emerDel.createDate}}</span></li>
        <li>单号:<span>{{emerDel.guid}}</span></li>
      </ul>
      <div class="delCon">
          <div>事件详情</div>
          <p>{{emerDel.eventDetail}} </p>
          <!-- <el-input type="textarea" :autosize="{minRows: 6}" v-model="desc"></el-input> -->
      </div>
      <div class="delCon">
          <div>损失情况</div>
          <p>{{emerDel.lossSituation}}</p>
      </div>
      <div class="delCon">
          <div>处理情况</div>
          <p>{{emerDel.dealWith}}</p>
      </div>
      <div class="delCon" v-show="emerDel.manageComment">
          <div>经理审批意见</div>
          <p>{{emerDel.manageComment}}</p>
      </div>
      <!-- 附件 照片 -->
            <ul class="photo clearfix" >
              <vue-preview class='imgPath':slides="sliders" v-if='sliders && sliders.length > 0'  @close="''"></vue-preview>
              
              <!-- <li v-for="(item,index) in imgList" :key="index">
                  <img 
                    class="preview-img" 
                    :key="index" 
                    :src="item.src" 
                    height="100" 
                    @click="$preview.open(index, imgList)"
                    >
              </li> -->
            </ul>
        <!-- <div class="people">
            汇报人: <span>{{emerDel.userName}}</span> <br>
            收件人: <span>{{emerDel.receiverName}}</span> 
        </div> -->
        

        <!-- ????????   流程问题 -->
      <div class="delCon"  v-if="userInfo.postType==3 && tasks">
          <div>经理意见</div>
          <p v-if="emerDel.status == 2 ||emerDel.status == 3">{{emerDel.manageComment}}</p>
          <textarea placeholder="请输入审批意见" v-if="emerDel.status==1" v-model="manageComment" class="idea_text"></textarea>
          <div class="manage_idea" v-if="this.emerDel.status==1">
            <el-button class="subBtn" type="primary" @click="manageComt">确定</el-button>
          </div>
      </div>  

       <div class="delCon" v-if="userInfo.postType==2 && tasks">
          <div>主任意见</div>
          <p v-if="emerDel.status == 2 ||emerDel.status == 3">{{emerDel.directorComment}}</p>
          <textarea placeholder="请输入审批意见" :maxlength="200"   v-if="emerDel.status==1" v-model="directorComment" class="idea_text"></textarea>
           <div class="lead_idea" v-if="emerDel.status==1">
            <el-button type="danger" @click="no">不同意</el-button>
            <el-button class="subBtn" type="success" @click="yes">同意</el-button>
          </div>
      </div>

       <div class="delCon" v-if="emerDel.directorComment">
          <div>处理意见</div>
          <p>{{emerDel.directorComment}}</p>
      </div>
        
    </div>
</div>

</template>
<script>
export default {
  data() {
    return {
      imgList: [],
      userInfo: "",
      organInfo: "",
      sliders: null,
      optoin: "",
      manageComment: "",
      directorComment: "",
      emerDel: {},
      tasks: null,
      dialogImageUrl: "",
      dialogVisible: false
      // desc: "同意同意同意同意"
    };
  },
  methods: {
    //请求详情页面
    getEmerDel() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        emergencyId: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.activity}/emergencyBill/getEmergencyBill`,
        data,
        res => {
          console.log(res, "res");
          this.emerDel = res.data.emergencyBill;
          // 图片预览设置
          this.imgList = res.data.commAccessoryList;
          this.tasks = res.data.tasks;
          if (res.data.commAccessoryList) {
            this.$setImg(res.data.commAccessoryList, this);
          }
          // for (let val of this.imgList) {
          //   let img = document.createElement("img");
          //   img.src = val.path;
          //   val.src = val.path;
          //   img.onload = function() {
          //     // 防止网速慢时图片未加载获取不到图片宽高
          //     val.w = img.width;
          //     val.h = img.height;
          //   };
          // }
          // console.log(this.emerDel, "emerDel");
        },
        this
      );
    },
    yes() {
      this.opinion = "同意";
      this.dirctComt();
    },
    no() {
      this.opinion = "不同意";
      this.dirctComt();
    },
    //主任审批
    dirctComt() {
      if (this.directorComment == "") {
        this.$message.error("请填写审批意见");
        return;
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        postType: this.userInfo.postType,
        emergencyBillId: this.$route.params.id,
        opinion: this.opinion,
        comment: this.directorComment
      };
      this.$ajax(
        `${this.subUrl.activity}/emergencyBill/approve`,
        data,
        res => {
          console.log(res, "comentres");
          this.$message.success("审批成功");
          this.back();
        },
        this
      );
    },
    //经理审批
    manageComt() {
      if (this.manageComment == "") {
        this.$message.error("请填写审批意见");
        return;
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        postType: this.userInfo.postType,
        emergencyBillId: this.$route.params.id,
        opinion: "11",
        comment: this.manageComment
      };
      this.$ajax(
        `${this.subUrl.activity}/emergencyBill/approve`,
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
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getEmerDel();
  }
};
</script>
<style lang="scss" scoped>
#subTemplate {
  overflow: scroll;
  .text {
    i {
      padding: 20px 20px;
    }
  }
}
.del {
  margin-left: 10px;
  padding-bottom: 50px;
  background: #fff;
}
.delList {
  padding: 20px 50px;
  margin-top: 20px;
  li {
    width: 50%;
    padding: 5px 0;
    float: left;
  }
  span {
    padding-left: 20px;
  }
}

.manage_idea {
  padding: 20px 0px;
  background: #fff;
}
.lead_idea {
  padding: 10px 50px;
  background: #fff;
  margin: 20px 0;
  text-align: center;
  .subBtn {
    margin-left: 100px;
  }
}
.photo {
  padding-left: 50px;
  li {
    float: left;
    margin: 10px 10px;
    width: 120px;
    height: 120px;
    overflow: hidden;
    img {
      display: block;
      height: 100%;
    }
  }
}
.delCon {
  padding: 5px 50px;
  background: #fff;
  p {
    padding: 5px 5px 40px 5px;
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
.people {
  padding: 10px 50px;
  background: #fff;
  span {
    padding: 5px 10px;
    display: inline-block;
  }
}
</style>