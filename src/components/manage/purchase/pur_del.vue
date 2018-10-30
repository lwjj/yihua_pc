<template>
<div id='pur_del'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>采购销售详情</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/purchase' }">采购销售</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="del">
      <ul class="delList clearfix">
        <li>申请类型:<span v-show="Del.type == 1">【采购】</span><span v-show="Del.type == 2">【供应】</span></li>
        <li><span style="margin-left:10px;">状态:</span>
            <!-- 状态 0:关闭, 1:完成, 2:草稿 3:待审批 4:同意 5:不同意 , -->
          <span v-show="Del.status == 0">关闭</span>
          <span v-show="Del.status == 1">完成</span>
          <span v-show="Del.status == 2">草稿</span>
          <span v-show="Del.status == 3">待审批</span>
          <span v-show="Del.status == 4">同意</span>
          <span v-show="Del.status == 5">不同意</span>
        </li>
        <li>申请标题:<span>{{Del.title}}</span></li>
        <li>创建时间:<span>{{Del.createTime}}</span></li>
        <li>启动时间:<span>{{Del.startTime}}</span></li>
        <li>完成时间:<span>{{Del.completionDate}}</span></li>
        <li><span style="margin-left:10px;">单号:</span><span>{{Del.guid}}</span></li>
      </ul>
      <div class="delCon">
          <div class="del_tit">详情描述</div>
          <p>{{Del.detail}}</p>
          <!-- <ul style="width:100%;margin-top:10px;">
            <li style="width:24%;height:150px;float:left;margin-right:10px;" v-for="(item,index) in showImg" :key="index">
              <img style="width:100%;height:150px;" :src="item.path">
            </li>
          </ul> -->
           <vue-preview class='imgPath' :slides="sliders" v-if='sliders'  @close="''"></vue-preview>
          <div class="clear"></div>
      </div>
      
      <!-- 附件 照片 -->
        
        </div>
        <div class="people">
            申请人: <span v-if="Del.userInfo">{{Del.userInfo.name}}</span> <br>
            汇报对象: <span v-if="Del.reportUserInfo">{{Del.reportUserInfo.name}}</span> 
        </div>
         <!-- <div class="delCon" v-show="this.userInfo.postType==3">
          <div>经理意见</div>
          <p v-show="this.Del.status == 2 ||this.Del.status == 3">{{Del.manageComment}}</p>
          <textarea placeholder="请输入审批意见" v-show="this.Del.status==1" v-model="manageComment" class="idea_text"></textarea>
          <div class="manage_idea" v-show="this.Del.status==1">
            <el-button class="subBtn" type="primary" @click="manageComt">确定</el-button>
          </div>
      </div>   -->
       <!-- <div class="delCon" v-if="this.userInfo.postType==2"> -->
       <div class="delCon" v-if="Del.approvalInfo">
          <div style="padding:10px 0 ;">主任意见</div>
          <p v-if="Del.status !== 3">{{Del.approvalInfo}}</p>
      </div>
       <div class="delCon" v-if="Del.status==3&&userInfo.postType ==2">
          <div style="padding:10px 0 ;">主任意见</div>
          <textarea placeholder="请输入审批意见" v-model="approvalInfo" class="idea_text"></textarea>
           <div class="lead_idea">
            <el-button type="danger" @click="dirctComt(0)">不同意</el-button>
            <el-button class="subBtn" type="success" @click="dirctComt(1)">同意</el-button>
          </div>
      </div>
        
    </div>
</div>

</template>
<script>
export default {
  data() {
    return {
      sliders:null,
      userInfo: "",
      organInfo: "",
      otherData:{},
      imgsAll:[],
      optoin: "",
      approvalInfo: "",
      Del: {},
      dialogImageUrl: "",
      dialogVisible: false,
      showImg:[]
    };
  },
  methods: {
    //请求详情页面
    getDel() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        pasaId: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.activity}/pasa/detail`,
        data,
        res => {
          this.Del = res.data.pasa;
          this.showImg=res.data.commAccessoryList
          if(res.data.commAccessoryList){
            this.$setImg(res.data.commAccessoryList,this);
          }  
        },
        this
      );
    },
     //主任审批
    dirctComt(val) {
      if (this.approvalInfo == "") {
        this.$message.error("请填写审批意见");
        return;
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        pasaId: this.$route.params.id,
        result: val,  //1同意 0不同意
        approvalInfo: this.approvalInfo
      };
      this.$ajax(
        `${this.subUrl.activity}/pasa/myReport/approval`,
        data,
        res => {
          console.log(res, "dirctComt");
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
    },
     //图片上传
    getUploadToken() {
      this.$ajax(
        `${this.subUrl.user}/qiniu/getInfo`,
        { token: this.$getkey() },
        res => {
          console.log(res.data, "token");
          var obj = {
            chunk: 0,
            chunks: 1,
            token: res.data.token
          };
          this.otherData = obj;
          // obj.token;
        },
        this
      );
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadSuccess(res) {
        this.imgsAll[res.key] = res.key;
    },
    uploadError() {
      this.$message.error("上传失败");
    },
    uploadMax() {
      this.$message.error("最多上传4张图片");
    },
    beforeAvatarUpload(file) {
        const isImage = file.type.indexOf("image");
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (isImage==-1) {
            this.$message.error('上传图片格式有误!');
            return false
        }
        if (!isLt2M) {
             this.$message.error('上传头像图片大小不能超过 2MB!');
             return false
        }
        return isImage && isLt2M;
    },
    handleRemove(file, fileList) {
      delete this.imgsAll[file.response.key];
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getDel();
    this.getUploadToken()
  }
};
</script>
<style lang="scss" scoped>
.clear{
  clear:both;
}
#pur_del {
  height: 100%;
  padding-left: 280px;
  padding-right: 20px;
  overflow: scroll;
  .text {
    i {
      padding: 20px 20px;
    }
  }
}
.del {
  padding-bottom: 40px;
  background: #fff;
}
.delList {
  background: #fff;
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
.upload_photo {
  background: #fff;
  padding: 20px 0 20px 50px;
  .pho_title {
    padding-bottom: 10px;
  }
}
.delCon {
  padding: 5px 50px;
  background: #fff;
  p {
    padding: 5px 5px 50px 5px;
    border: 1px solid #ccc;
  }
  .idea_text {
    margin-top: 10px;
    padding: 10px;
    font-size: 16px;
    width: 100%;
    min-height: 100px;
  }
  .del_tit{
      padding: 10px 0;
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