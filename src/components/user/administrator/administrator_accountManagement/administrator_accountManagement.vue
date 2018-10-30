<template>
     <div id="wealth">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/administrator' }">管理员</el-breadcrumb-item>
                <el-breadcrumb-item>机构信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="main">
                <div class="first1">
                    <p>管理处信息</p>
                    <el-button @click="select1" type="text">修改</el-button>
                    <!-- <div>
                        <p>管理员密码设置</p>
                        <el-button @click="gopwd" type="text">修改</el-button>
                    </div>        -->
                </div>
                <div class="first2">
                    <el-row>
                        <el-col>
                            <span>管理处名称：</span>
                            <el-input v-model="data.organName" :disabled="ok"></el-input>
                        </el-col>
                        <el-col>
                            <span>楼宇名称：</span>
                            <el-input v-model="data.buildingName" :disabled="ok"></el-input>
                        </el-col>
                        <el-col>
                            <span>所在地址：</span>
                            <el-input v-model="data.buildingAddress" :disabled="ok"></el-input>
                        </el-col>
                        <el-col>
                            <span>企业logo：</span>
                            <div class="imgLogo">
                                <img :src="data.organLogo">
                            </div>
                        </el-col>
                        <el-col v-show="!ok">
                                上传图片
                               <el-upload
                                    :action="uploadUrl"
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
                        </el-col>
                        <el-col v-show="!ok" style="text-align:center;">
                            <el-button style="width:20%;" @click="changeNo">取消</el-button>
                            <el-button style="width:20%;" @click="changeOk">确定</el-button>
                        </el-col>
                    </el-row>
                </div>   
            </div>
        </div>
     </div>
</template>
<script>
import fn from "@/assets/js/common";
import Vue from "vue";
import qs from "qs";
export default {
  data() {
    return {
      userInfo: {},
      organInfo: {},
      data: {},
      ok: true,
      getHearLog: {
        domain: "",
        token: "",
        name: "",
        pid: null
      },
      getkey: "",
      imageName: [],
      imgs: "",
      images: [],
      uploadUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,
      otherData: {},
      imgsAll: []
    };
  },
  methods: {
    getDetails() {
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/admin/accountManage/organInfo`,
        data,
        res => {
          this.data = res.data;
        },
        this
      );
    },
    select1() {
      if (this.ok == true) {
        this.ok = false;
      } else {
        this.ok = true;
      }
    },
    gopwd() {
      this.$router.push({
        path:
          "/user/administrator/administrator_accountManagement/administrator_password"
      });
    },
    changeNo() {
      this.getDetails();
      this.ok = true;
    },
    changeOk() {
      if (this.imgs == "") {
        this.imgs = this.data.organLogo;
      }
      var a = [];
      for (var key in this.imgsAll) {
        this.imgsAll[key];
        a.push(this.imgsAll[key]);
      }
      this.imgs = a.toString();
      console.log(this.imgs);
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid,
        organName: this.data.organName,
        buildingName: this.data.buildingName,
        address: this.data.address,
        organLogo: this.imgs
      };
      this.$ajax(
        `${this.subUrl.user}/admin/accountManage/editOrganInfo`,
        data,
        res => {
          if (res.code == 1) {
            this.$message({
              message: "上传成功",
              type: "success"
            });
            this.getDetails();
            this.ok = true;
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
      this.$message.error("最多上传1张图片");
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
  updated() {},
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getDetails();
    this.uploadUrl = "http://up-z2.qiniu.com";
    this.getUploadToken();
  }
};
</script>
<style lang="scss" scoped>
.imgLogo {
  width: 200px;
  height: 200px;
  vertical-align: middle;
  text-align: center;
  overflow: hidden;
  img {
    width: 100%;
    vertical-align: middle;
  }
}
#wealth {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: auto;
  .box {
    height: 100%;
    margin-top: 10px;
    background: #fff;
    .main {
      width: 450px;
      margin: 0 auto;
      padding-top: 20px;
      .first1 {
        p {
          float: left;
          margin-top: 9px;
        }
        .el-button {
          margin-left: 20px;
        }
        div {
          float: right;
        }
      }
      .first2 {
        .el-row {
          .el-col {
            margin-top: 10px;
          }
        }
      }
    }
  }
}
.clear {
  clear: both;
}
.file {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
</style>