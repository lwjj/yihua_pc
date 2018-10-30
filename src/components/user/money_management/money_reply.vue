<template>
    <div id="wealth">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path:'/user/money_management'}">财务审批</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path:'/user/money_management/money_managementDetails/'+this.$route.params.guid}">财务送批详情</el-breadcrumb-item>
                <el-breadcrumb-item>批复</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="first1">
                <div class="first1_1">快捷回复</div>
                <div class="first1_2">
                    <div class="first1_left">
                            <div>
                                <el-radio :label="1" v-model="radio1" @change="change(1)">
                                    {{content1}}
                                </el-radio>
                                <el-button type="text" @click="changeShow(1)">修改</el-button>
                            </div>
                            <div>
                                <el-radio :label="1" v-model="radio2" @change="change(2)">
                                    {{content2}}
                                </el-radio>
                                <el-button type="text" @click="changeShow(2)">修改</el-button>
                            </div>
                            <div>
                                <el-radio :label="1" v-model="radio3" @change="change(3)">
                                    {{content3}}
                                </el-radio>
                                <el-button type="text" @click="changeShow(3)">修改</el-button>
                            </div>
                            <div>
                                <el-radio :label="1" v-model="radio4" @change="change(4)">
                                    选择输入内容
                                </el-radio>
                            </div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="first1_3" v-if='showtextarea==true'>
                    <el-input
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 6}"
                    placeholder="请输入内容"
                    v-model="textarea1">
                    </el-input> 
                </div>
                <div class="upload_photo mt2 mb2">
                    <el-upload
                        :action="uploadUrl"
                        accept='image/jpeg,image/png'
                        list-type="picture-card"
                        :data='otherData'
                        :before-upload="beforeAvatarUpload"
                        :on-preview="handlePictureCardPreview"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        :limit='1'
                        :on-exceed='uploadMax'
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible" size="tiny">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </div>
                <div class="first1_4">
                    <el-button @click="SendReply">发送</el-button>
                </div>
                <div class="first1_5" v-if="openChange==true">
                    <p>修改快捷回复</p>
                    <el-input v-model="input" placeholder="请输入内容"></el-input>
                    <el-button @click="changeMain(1)">保存</el-button>
                    <el-button @click="changeMain(2)" >取消</el-button>    
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import fn from "@/assets/js/common";
import Vue from "vue";
import qs from "qs";
import VuePreview from "vue-preview";
export default {
  data() {
    this.uploadUrl = "http://up-z2.qiniu.com";
    return {
      otherData: {},
      showtextarea:false,
      dialogImageUrl: "",
      uploadHash: {},
      dialogVisible: false,
      userInfo: {},
      organInfo: {},
      data1: [],
      radio1: 1,
      content1: "",
      guid1: "",
      radio2: 0,
      content2: "",
      guid2: "",
      radio3: 0,
      content3: "",
      guid3: "",
      radio4: 0,
      n: 1,
      textarea1: "",
      images: [],
      imgs: [],
      accessorys: "",
      imgUrl1: "",
      imgUrl2: "",
      imgUrl3: "",
      imgUrl4: "",
      getHearLog: {
        domain: "",
        token: "",
        name: "",
        pid: null
      },
      input: "",
      reply: "",
      openChange: false
    };
  },
  methods: {
    // 上传函数控制
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
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadSuccess(res) {
      this.uploadHash[res.key] = res.key;
    },
    uploadMax() {
      this.$message.error("最多上传1张图片");
    },
    handleRemove(file, fileList) {
      delete this.uploadHash[file.response.key];
    },
    uploadError() {
      this.$message.error("上传失败");
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
    // 上传函数结束
    getMain() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/user/getFr`,
        data,
        res => {
          this.data1 = res.data;
          this.content1 = this.data1[0].content;
          this.content2 = this.data1[1].content;
          this.content3 = this.data1[2].content;
          this.guid1 = this.data1[0].guid;
          this.guid2 = this.data1[1].guid;
          this.guid3 = this.data1[2].guid;
        },
        this
      );
    },
    change(n) {
      if (n == 1) {
        this.radio2 = 0;
        this.radio3 = 0;
        this.radio4 = 0;
        this.showtextarea=false;
        
      } else if (n == 2) {
        this.radio1 = 0;
        this.radio3 = 0;
        this.radio4 = 0;
        this.showtextarea=false;
        
      } else if (n == 3) {
        this.radio1 = 0;
        this.radio2 = 0;
        this.radio4 = 0;
        this.showtextarea=false;
      } else {
        this.radio1 = 0;
        this.radio2 = 0;
        this.radio3 = 0;
        this.showtextarea=true;
      }
    },
    changeShow(n) {
      this.n = n;
      this.openChange = true;
    },
    changeMain(n) {
      if (n == 1) {
        if (this.n == 1) {
          var data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            frId: this.guid1,
            content: this.input
          };
          this.$ajax(
            `${this.subUrl.user}/user/editFr`,
            data,
            res => {
              if (res.code == 1) {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.getMain();
                this.openChange = false;
                this.input = "";
              } else {
                this.$message({
                  message: "修改失败",
                  type: "error"
                });
                this.openChange = false;
                this.input = "";
              }
            },
            this
          );
        } else if (this.n == 2) {
          var data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            frId: this.guid2,
            content: this.input
          };
          this.$ajax(
            `${this.subUrl.user}/user/editFr`,
            data,
            res => {
              if (res.code == 1) {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.getMain();
                this.openChange = false;
                this.input = "";
              } else {
                this.$message({
                  message: "修改失败",
                  type: "error"
                });
                this.openChange = false;
                this.input = "";
              }
            },
            this
          );
        } else if (this.n == 3) {
          var data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            frId: this.guid3,
            content: this.input
          };
          this.$ajax(
            `${this.subUrl.user}/user/editFr`,
            data,
            res => {
              if (res.code == 1) {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.getMain();
                this.openChange = false;
                this.input = "";
              } else {
                this.$message({
                  message: "修改失败",
                  type: "error"
                });
                this.openChange = false;
                this.input = "";
              }
            },
            this
          );
        }
      } else {
        this.$message({
          message: "已取消修改",
          type: "warning"
        });
        this.openChange = false;
        this.input = "";
      }
    },
    SendReply() {
      if (this.radio1 == 1) {
        this.reply = this.content1;
      } else if (this.radio2 == 1) {
        this.reply = this.content2;
      } else if (this.radio3 == 1) {
        this.reply = this.content3;
      } else if (this.radio4 == 1) {
        this.reply = this.textarea1;
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        orId: this.$route.params.guid,
        reply: this.reply,
        accessorys: this.accessorys,
        type: this.$route.params.num
      };
      var arr = [];
      for (var i in this.uploadHash) {
        arr.push(i);
      }
      data.accessorys = arr.join(",");
      this.$ajax(
        `${this.subUrl.activity}/ownersCom/ocReport/reply`,
        data,
        res => {
          if (res.code == 1) {
            this.$message({
              message: "批复成功",
              type: "success"
            });
            this.$router.push(
              "/user/money_management/money_managementDetails/" +
                this.$route.params.guid
            );
          } else {
            this.$message({
              message: "批复失败",
              type: "error"
            });
            this.$router.push(
              "/user/money_management/money_managementDetails/" +
                this.$route.params.guid
            );
          }
        },
        this
      );
    },
    update() {},
    update(e) {
      let file = e.target.files[0]; //详细信息
      let d = new Date();
      let type = file.name.split("."); //点切割

      let tokenParem = {
        putPolicy:
          '{"name":"$(fname)","size":"$(fsize)","w":"$(imageInfo.width)","h":"$(imageInfo.height)","hash":"$(etag)"}',
        key:
          "orderReview/" +
          d.getFullYear() +
          "/" +
          (d.getMonth() + 1) +
          "/" +
          d.getDate() +
          "/" +
          d.valueOf() +
          "." +
          type[type.length - 1],
        bucket: this.getHearLog.domain //七牛的地址，这个是你自己配置的（变量）
      };
      let param = new FormData(); //创建form对象
      param.append("chunk", "0"); //断点传输
      param.append("chunks", "1");
      param.append("file", file, file.name);
      //console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };

      this.token = this.getHearLog.token;
      //console.log(this.token)
      param.append("token", this.token);

      this.uploading(param, config, file.name); //然后将参数上传七牛
      return;
    },
    uploading(param, config, pathName) {
      this.xhr.post("http://up-z2.qiniu.com", param, config).then(response => {
        //for(var i=0;i<=this.imgs.length;i++){
        //    if(this.imgs[i]!==response.data.key){
        //  this.imgs.push(response.data.key);
        //   }
        // }

        //this.accessorys=this.imgs.join(",")
        this.getHearLog.name = response.data.key;
        // this.getHearLog.name=response.data.key;
        console.log(this.imgs);
        console.log(this.accessorys);
        //this.data.organLogo=this.getHearLog.domain+'/'+this.imgs
        if (this.getHearLog.name != "") {
          if (this.getHearLog.pid == 1) {
            this.imgUrl1 = this.getHearLog.domain + "/" + this.getHearLog.name;
            this.imgs[0] = this.getHearLog.name;
          } else if (this.getHearLog.pid == 2) {
            this.imgUrl2 = this.getHearLog.domain + "/" + this.getHearLog.name;
            this.imgs[1] = this.getHearLog.name;
          } else if (this.getHearLog.pid == 3) {
            this.imgUrl3 = this.getHearLog.domain + "/" + this.getHearLog.name;
            this.imgs[2] = this.getHearLog.name;
          } else if (this.getHearLog.pid == 4) {
            this.imgUrl4 = this.getHearLog.domain + "/" + this.getHearLog.name;
            this.imgs[3] = this.getHearLog.name;
          }
        }
        let localArr = this.images.map((val, index, arr) => {
          return arr[index].localSrc;
        });
        //console.log(this.images)
        if (!~localArr.indexOf(pathName)) {
          this.images.push({
            src: this.showUrl + response.data.key,
            localSrc: pathName
          });
        } else {
          this.$message({
            message: "已上传过该图片！",
            type: "error"
          });
        }
      });
    },
    getQiniuInfo(pid) {
      this.xhr
        .post(`${this.subUrl.user}/qiniu/getInfo?token=` + this.getkey)
        .then(res => {
          //console.log(res.data)
          if (res.data.code == 1) {
            this.getHearLog = res.data.data;
            this.getHearLog.pid = pid;
          }
        });
    },
    addImg(pid) {
      this.getQiniuInfo(pid);
    }
  },
  updated() {
    console.log(this.input);
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getMain();
    this.getkey = fn.getIng();
    this.getUploadToken();
  }
};
</script>
<style lang="scss" scoped>
.clear {
  clear: both;
}
#wealth {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: scroll;
  .box {
    margin-top: 10px;
    width: 98%;
    margin-left: 1%;
    height: 100%;
    background: #fff;
    .first1 {
      padding-top: 30px;
      position: relative;
      width: 500px;
      margin-left: 5%;
      .first1_1 {
        margin-bottom: 10px;
      }
      .first1_2 {
        margin-bottom: 10px;
        .first1_left {
          float: left;
          div {
            margin-top: 5px;
          }
        }
      }
      .first1_3 {
        .img_box {
          margin-top: 10px;
          div {
            display: inline-block;
            width: 49%;
            height: 100px;
            div {
              float: left;
              width: 49%;
              height: 100px;
              border: 1px solid #ddd;
              position: relative;
              .el-button {
                width: 100%;
                height: 100%;
                border: 0;
              }
              .file {
                position: absolute;
                width: 98%;
                height: 98%;
                opacity: 0;
                z-index: 999;
                top: 0;
                left: 0;
              }
              i {
                position: absolute;
                font-size: 50px;
                top: 20px;
                left: 43px;
              }

              img {
                width: 98%;
                height: 98%;
              }
            }
          }
        }
      }
      .first1_4 {
        .el-button {
          width: 100%;
          margin-top: 10px;
        }
      }
      .first1_5 {
        position: absolute;
        top: 185px;
        width: 100%;
        border: 1px solid #ddd;
        background: #fff;
        z-index: 999;
        text-align: center;
        p {
          padding: 10px 0;
        }
        .el-button {
          margin: 10px 0;
          width: 20%;
        }
      }
    }
  }
}
</style>
