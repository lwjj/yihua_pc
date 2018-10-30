<template>
<div id='inform_del'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>财务送批详情</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/yewei_contact' }">业主往来</el-breadcrumb-item>
            <el-breadcrumb-item>财务送批详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="del" v-if="loading">
        <div class="del_title clearfix">
            <h4>{{informDel.title}}</h4>
            <span class="idea" v-if="informDel.status==0">不同意</span>
            <span class="idea" v-if="informDel.status==1">同意</span>
            <span class="idea" v-if="informDel.status==2">待审批</span>
        </div>
      <ul class="delList clearfix">
        <li>管理处：<span>{{informDel.info.organName}}</span></li>
        <li>创建时间：<span>{{informDel.createTime}}</span></li>
        <li>编制：<span>{{informDel.info.name}}</span></li>
        <li>启动时间：<span>{{informDel.startTime | date}}</span></li>
        <li>单号：<span>{{informDel.guid}}</span></li>
        <li>完成时间：<span>{{informDel.endTime | date}}</span></li>
      </ul>
      <div class="info">
        <p>{{informDel.content}}</p>
        
        <!-- <div v-if="imgArr.length > 0">
          图片附件
          <vue-preview class='imgPath' :slides="sliders" v-if='sliders'  @close="''"></vue-preview>
        </div>
         -->
        <div v-if="otherArr.length > 0">
            <!-- <div class="label">其他附件</div> -->
            <div class="label">附件</div>
            <div class="" style="width:500px;">
                <div class="flex jusB mb1" v-for="(item,index) in otherArr" :key="index">
                    <div class="labelTitle">{{item.fileName}}</div>
                    <el-button type="primary" size="mini" @click="downLoadFile(item.path,item.fileName)">下载</el-button>
                </div>
            </div>
        </div>

      </div>
       <div class="approval" v-if="informDel.status!=2">
          <div class="comment_title">审批意见</div>
           <p class="comment_text">{{informDel.reply}}</p>
          <vue-preview class='imgPath' :slides="sliders1" v-if='sliders1'  @close="''"></vue-preview>
           
<!--            
           <ul class="photo clearfix" >
            <li v-for="(item,index) in imgs" :key="index">
                <img class="preview-img"
                     :src="item.path"
                     :key="index"
                      height="100"
                      @click="$preview.open(index, imgs)">
            </li>
        </ul> -->
      </div>
   <!-- 业委会专有 -->
     <div class="approval" v-if="informDel.status ==2 && userInfo.organType == 7">
                <el-input 
                    type="textarea" 
                    :autosize="{minRows: 5}" 
                    placeholder="请输入审批意见" 
                    v-model="theReply"  
                    class="idea_text">
                </el-input>
                <div class="avatar-uploader">
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
            <div class="lead_idea">
                <el-button class="subBtn" type="primary" @click="onReply(0)">不同意</el-button>
                <el-button class="subBtn" type="primary" @click="onReply(1)">同意</el-button>
          </div>
    </div>
    </div>
</div>


</template>
<script>
export default {
  data() {
    this.uploadUrl = "http://up-z2.qiniu.com";
    return {
      loading: false,
      sliders: null,
      sliders1: null,
      userInfo: {},
      organInfo: {},
      informDel: {},
      imgs: [],
      theReply: "",
      accessorys: "",
      dialogImageUrl: "",
      dialogVisible: false,
      otherData: {},
      imgsAll: [],
      //回显图片
      imgArr: [],
      otherArr: [],
      fileName:""
    };
  },
  methods: {
    downLoadFile(url,fileName) {
      open(`${url}?attname=${encodeURIComponent(fileName)}`, "_blank");
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
    // 业委会 审批
    onReply(type) {
      if (this.theReply == "") {
        this.$message.error("请填写回复内容");
        return;
      }
      var a = [];
      for (var key in this.imgsAll) {
        this.imgsAll[key];
        a.push(this.imgsAll[key]);
      }
      this.accessorys = a.join(",");
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        orId: this.$route.params.id,
        reply: this.theReply,
        accessorys: this.accessorys,
        type: type
      };
      this.$ajax(
        `${this.subUrl.activity}/ownersCom/ocReport/reply`,
        data,
        res => {
          console.log(res, "theReply");
          this.$message.success("回复成功");
          this.back();
        },
        this
      );
    },

    //请求详情页面
    getInfoDel() {
      var that = this
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        orId: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.activity}/ownersCom/ocReport/Detail`,
        data,
        res => {
          var imgArr = [];
          var otherArr = [];
          if (res.data.commAccessoryList) {
            for (var b of res.data.commAccessoryList) {
              var temp = b.fileName.split(".");
              var tempFile = temp[temp.length - 1];
              console.log(tempFile);
              // if (
              //   tempFile == "jpg" ||
              //   tempFile == "jpeg" ||
              //   tempFile == "png" ||
              //   tempFile == "gif"
              // ) {
              //   imgArr.push(b);
              //   that.imgArr.push(b)
              // } else {
                otherArr.push(b);
              // }
            }
          }

          this.otherArr = otherArr;
          this.informDel = res.data.ocReport;
          this.loading = true;
          console.log(res.data);
          if (res.data.commAccessoryList) {
            this.$setImg(res.data.commAccessoryList, this);
          }
          if (res.data.replyAccessoryList) {
            this.$setImg1(res.data.replyAccessoryList, this);
          }
          this.imgs = res.data.replyAccessoryList;
          console.log(this.imgs,'imgs')
          for (let val of this.imgs) {
            let img = document.createElement("img");
            img.src = val.path;
            val.src = val.path;
            img.onload = function() {
              // 防止网速慢时图片未加载获取不到图片宽高
              val.w = img.width;
              val.h = img.height;
            };
          }
        },
        this
      );
    },
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

      if (isImage == -1) {
        this.$message.error("上传图片格式有误!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
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
      width: 120px;
      height: 120px;
      display: block;
    }
  }
}

.lead_idea {
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