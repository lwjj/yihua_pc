<template>
<div id='inform_del'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>稽查详情</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/wuye_contact/wuye_audit/wuye_audit' }">物业稽查</el-breadcrumb-item>
            <el-breadcrumb-item>稽查详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="del" v-show="show">
        <div class="del_title clearfix">
            <h4>{{informDel.title}}</h4>
             <!--1：已下发，2：已回复，3：关闭,4：未读，5：待回复, -->
            <span class="idea" v-if="informDel.status==2">已回复</span>
            <span class="idea" v-if="informDel.status==4">未阅</span>
            <span class="idea" v-if="informDel.status==5">待回复</span>
        </div>
      <ul class="delList clearfix">
        <li><a>稽查对象：</a><span>{{informDel.examineObjName}}</span></li>
        <li><a>稽查日期：</a><span>{{informDel.examineDate}}</span></li>
        <li><a>稽查组长：</a><span>{{informDel.examineLead}}</span></li>
        <li><a>稽查组员：</a><span>{{informDel.examineMember}}</span></li>
        <li><a>填写人：</a><span>{{informDel.userName}}</span></li>
        <li><a>发布日期：</a><span>{{informDel.createDate}}</span></li>
        <li><a>单号：</a><span>{{informDel.guid}}</span></li>
      </ul>
      <div class="info">
        <p>{{informDel.content}}</p>
         <vue-preview class='imgPath' :slides="sliders" v-if='sliders'  @close="''"></vue-preview>
      </div>
       <div class="approval">
          <div class="comment_title">审批信息</div>
           <p class="comment_text" v-if="this.informDel.status == 2">{{informDel.improveComment}}</p>
                <img class="preview-img" v-for="(item,index) in tubImg" :key="index" :src="item.path" height="100" @click="$preview.open(index,tubImg)" alt="">
           <div  v-if="this.informDel.status==4||this.informDel.status ==5" >
                <el-input 
                    :maxlength="200"
                    type="textarea" 
                    :autosize="{minRows: 5}" 
                    placeholder="请输入审批意见" 
                    v-model="improveComment"  
                    class="idea_text">
                    </el-input>
                <!-- 照片附件 -->
                <div class="avatar-uploader" style="margin-top:10px;">
                  <el-upload
                  :action="uploadUrl"
                  list-type="picture-card"
                  :data='otherData'
                  :before-upload="beforeAvatarUpload"
                  :on-preview="handlePictureCardPreview"
                  :on-success="uploadSuccess"
                  :on-error="uploadError"
                  :limit='4'
                  :on-exceed='uploadMax'
                  :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" size="tiny">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </div>
           </div>
      </div>
     <div class="lead_idea"   v-if="this.informDel.status==4||this.informDel.status ==5" >
            <el-button type="primary" @click="send">转发</el-button>
            <el-button class="subBtn" type="success" @click="submit">通过</el-button>
      </div>
    </div>
    <sendMen v-show="sendShow" @checkMen="sendMen"></sendMen>
</div>


</template>
<script>
import sendMen from "../../../choose_people/choose_employ";
export default {
  components: {
    sendMen
  },
  data() {
    this.uploadUrl = "http://up-z2.qiniu.com";
    return {
      sliders:null,
      show: true,
      sendShow: false,
      userInfo: "",
      organInfo: "",
      otherData:{},
      informDel: {},
      imgsAll:[],
      dialogImageUrl: "",
      dialogVisible: false,
      userIdListId: "",
      improveComment: "",
      accessorys: "",
      obj:{},
      tubImg:[],
      common:[],

    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 上报
    submit() {
      if (this.improveComment == "") {
        this.$message.error("请填写回复内容");
        return;
      }
      var a=[]
      for(var key in this.imgsAll){
        this.imgsAll[key]
        a.push(this.imgsAll[key])
      }
      this.accessorys=a.join(",")
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        propertyExamineId: this.$route.params.id,
        improveComment: this.improveComment,
        accessorys: this.accessorys
      };
      this.$ajax(
        `${this.subUrl.activity}/propertyExamine/manageReport`,
        data,
        res => {
          console.log(res, "forwardByManage");
          this.$message.success("提交成功");
          this.back();
        },
        this
      );
    },
    // 转发
    send() {
      this.show = false;
      this.sendShow = true;
    },
    sendMen(checkList) {
      this.show = true;
      this.sendShow = false;
      let arr = [];
      checkList.forEach(ele => {
        arr.push(ele.split(",")[0]);
      }, this);
      this.userIdListId = arr.join(",");

      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        propertyExamineId: this.$route.params.id,
        userIds: this.userIdListId
      };
      this.$ajax(
        `${this.subUrl.activity}/propertyExamine/manageForward`,
        data,
        res => {
          console.log(res, "forwardByManage");
          this.$message.success("转发成功");
        },
        this
      );
    },

    //请求详情页面
    getInfoDel() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        organType: this.organInfo.organType,
        propertyExamineId: this.$route.params.id
      };
      console.log(data, "infodel");
      this.$ajax(
        `${this.subUrl.activity}/propertyExamine/getExamineDetail`,
        data,
        res => {
          console.log(res, "res");
          this.informDel = res.data;
          if(res.data.accessoryList){
            this.$setImg(res.data.accessoryList,this);
          }
          if(res.data.replyAccessoryList){
            this.tubImg=res.data.replyAccessoryList
            for(var i=0;i<this.tubImg.length;i++){
              this.tubImg[i].w=600
              this.tubImg[i].h=400
            }
          }  
        },
        this
      );
    },
    //上传图片
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
    this.getInfoDel();
    this.getUploadToken();
  }
};
</script>
<style lang="scss" scoped>
#inform_del {
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
  padding-bottom: 200px;
}
.del_title {
  margin-top: 20px;
  padding: 10px 40px;
  background: #fff;
  border-bottom: 1px solid #ccc;
  h4 {
    float: left;
  }
  .idea {
    padding-left: 100px;
    font-weight: 400;
    font-size: 15px;
  }
}
.delList {
  background: #fff;
  padding: 20px 50px;
  li {
    width: 50%;
    padding: 5px 0;
    float: left;
    a{
      display:inline-block;
      width:80px;
      text-align:right
    }
    &:first-of-type {
      width: 100%;
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
  p {
    padding: 5px 5px 100px 5px;
    border: 1px solid #ccc;
  }
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

.lead_idea {
  padding: 20px 50px;
  background: #fff;
  margin: 20px 0;
  text-align: center;
  .subBtn {
    margin-left: 100px;
  }
}
.upload_photo {
  padding: 20px 0;
}
.approval {
  padding: 20px 50px;
  background: #fff;
  margin: 20px 0;
}
.comment_title {
  padding: 10px 0;
}
.comment_text {
  padding: 5px 5px 50px 10px;
  border: 1px solid #ccc;
}
</style>