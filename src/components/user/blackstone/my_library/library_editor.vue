<template>
    <div id="library">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{path:'/user/blackstone/blackstone_my'}">百事通</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path:'/user/blackstone/my_library/library_collection'}">我的文库</el-breadcrumb-item>
                <el-breadcrumb-item>编辑文库</el-breadcrumb-item>  
            </el-breadcrumb>
        </div>
        <div class="layout">
          <div class="library_main">
            <div >
                <div class="library_body">
                    <el-input type="text" class="library_input" :maxlength="20" v-model="uploadContent.title" placeholder="标题(最大限度20字)"></el-input>
                    <el-input class="library_input1" :rows="8" type="textarea" v-model="uploadContent.content" :maxlength="5000" placeholder="请输入内容(最大限度5000字)"></el-input>
                    <div class="library_input2">
                        <el-input type="text" v-model="keyword1" :maxlength="4" placeholder="可填写关键词(最大限度4字)"></el-input>
                        <el-input type="text" v-model="keyword2" :maxlength="4" placeholder="可填写关键词(最大限度4字)"></el-input>
                        <p>{{uploadContent.content.length}}/5000</p>
                        <h4>注：关键字可提高搜索率</h4>
                    </div>
                    <div class="library_input3">
                        <el-upload
                            style="width:500px;"
                            :action="uploadUrl"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :data='otherData'
                            :before-upload="setBefore" 
                            :on-success="uploadSuccess" 
                            :limit="4"
                            :file-list="fileList">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload> 
                    </div>
                </div>
                <div class="library_right">
                    <div class="library_radio">
                        <el-radio v-model="radio"  :label="0">免费</el-radio>
                        <el-radio class="radio1" v-model="radio" :label="1">
                            商机点
                            <el-input v-if='radio==1' type="number" style="width:150px;" v-model="expectBp" :maxlength="10"></el-input>
                        </el-radio>
                        <el-radio v-model="uploadPosition" :label="1" style="margin-left:30px;">个人类型</el-radio>
                        <el-radio v-model="uploadPosition" :label="2">企业类型</el-radio>
                        <el-select v-model="value11" style="margin-left:90.22px" placeholder="请选择">
                            <el-option v-for="item in ButtonType" :key="item.guid" :label="item.dictDataName" :value="item.guid">
                            </el-option>
                        </el-select>
              
                    </div>
                    <div class="library_address">               
                        <div>
                            <a class="left"><el-radio v-model="scope1" :label="0">片区</el-radio></a>
                            <a class="right">{{address.area}}</a>
                        </div>
                        <p class="clear"></p>
                        <div>
                            <a class="left"><el-radio v-model="scope1" :label="1">本区</el-radio></a>
                            <a class="right">{{address.area1}}</a>
                        </div>
                        <p class="clear"></p>
                        <div>
                            <a class="left"><el-radio v-model="scope1" :label="2">片市</el-radio></a>
                            <a class="right">{{address.city}}</a>
                        </div>
                        <p class="clear"></p>
                        <div>
                            <a class="left"><el-radio v-model="scope1" :label="3">片省</el-radio></a>
                            <a class="right">{{address.province}}</a>
                        </div>
                        <p class="clear"></p>
                        <div>
                            <a class="left"><el-radio v-model="scope1" :label="4">全国</el-radio></a>
                            <a class="right">{{address.countries}}</a>
                        </div>
                        <p class="clear"></p>
                        <div class="library_bottom">
                            <el-button style="text-align:center;margin-top:20px" @click="uploadAll">
                                同意平台服务协议并发布
                            </el-button>
                        </div>      
                    </div>
                </div>
                <div class="clear"></div>
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
      img: {
        imgUrl1: "",
        imgUrl2: "",
        imgUrl3: "",
        imgUrl4: ""
      },
      bcpic: "",
      acc: {
        acc1: "",
        acc2: "",
        acc3: "",
        acc4: ""
      },
      imgPath: [],
      images: [],
      imageName: [],
      radio: 0,
      getkey: "",
      userInfo: {},
      organInfo: {},
      keyword1: "",
      keyword2: "",
      expectBp: "",
      token: "",
      scope1: 0,
      uploadPosition: 1,
      address: {
        area: "",
        area1: "",
        city: "",
        province: "",
        countries: ""
      },
      addressScope: {
        areaValue: 0,
        area1Value: 0,
        cityValue: 0,
        provinceValue: 0,
        countriesValue: 0
      },
      uploadContent: {
        title: "",
        content: "",
        typeId: "",
        publishType: 0,
        keyword: "",
        bp: "",
        scope1: "",
        scopeValue: 0,
        accessorys: ""
      },
      getHearLog: {
        domain: "",
        token: "",
        name: "",
        pid: null
      },
      uploadUrl: "",
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      otherData: {},
      imgsAll: [],
      ButtonType: [],
      value11: ""
    };
  },
  methods: {
    getTitle1() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        type: this.userInfo.organType == 1 ? 2 : 1
      };
      this.$ajax(
        `${this.subUrl.user}/comm/getKaType`,
        data,
        res => {
          this.ButtonType = res.data;
        },
        this
      );
    },
    picShow(pic) {
      this.bcpic = this.img[pic];
    },
    getAddress() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.bd}/knowAll/userDistrict`,
        data,
        res => {
          var a = res.data;
          for (var i = 0; i < a.length; i++) {
            if (a[i].scope == 0) {
              this.address.countries = a[i].scopeName;
              this.addressScope.countriesValue = a[i].scopeValue;
              continue;
            } else if (a[i].scope == 1) {
              this.address.province = a[i].scopeName;
              this.addressScope.provinceValue = a[i].scopeValue;
              continue;
            } else if (a[i].scope == 2) {
              this.address.city = a[i].scopeName;
              this.addressScope.cityValue = a[i].scopeValue;
              continue;
            } else if (a[i].scope == 3) {
              this.address.area1 = a[i].scopeName;
              this.addressScope.area1Value = a[i].scopeValue;
              continue;
            } else if (a[i].scope == 4) {
              this.address.area = a[i].scopeName;
              this.addressScope.areaValue = a[i].scopeValue;
              continue;
            }
          }
        },
        this
      );
    },
   
    uploadAll() {
      var reg = /^[0-9]*$/;
      var a = [];
      for (let v of this.fileList) {
        a.push({
          fileName: v.name,
          path: v.key
        });
      }
      this.images = a;
      if (this.uploadContent.title == "") {
        this.$message({
          message: "标题不能为空！",
          type: "error"
        });
        return;
      } else if (this.uploadContent.content == "") {
        this.$message({
          message: "内容不能为空！",
          type: "error"
        });
        return;
      } else if (
        this.radio == 1 &&
        (this.expectBp == "" || !reg.test(this.expectBp))
      ) {
        this.$message({
          message: "请输入有效商机点！",
          type: "error"
        });
        return;
      } else if (this.images.length == 0 && this.radio == 1) {
        // else if (this.images.length > 0 && this.radio == 0) {
        //   this.$message({
        //     message: "如有附件请填写商机点",
        //     type: "error"
        //   });
        //   return;
        // }
        this.$message({
          message: "如没附件请勿填写商机点",
          type: "error"
        });
        return;
      } else if (this.uploadContent.scope1 == null) {
        this.$message({
          message: "请选择片区！",
          type: "error"
        });
        return;
      } else {
        if(this.radio==0){
        	this.expectBp=0
        }

        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          kaId: this.uploadContent.kaId,
          title: this.uploadContent.title,
          content: this.uploadContent.content,
          typeId: this.value11,
          publishType: this.uploadPosition,
          // keyword: this.keyword1+','+this.keyword2,     
          bp: this.expectBp,
          scope:this.scope1,
          scopeValue: this.uploadContent.scopeValue
        };
      if (this.keyword1 && this.keyword2) {
        data.keyword = this.keyword1 + "," + this.keyword2;
      } else if (this.keyword1 == "" && this.keyword2) {
        data.keyword = this.keyword1+','+this.keyword2;;
      } else if (this.keyword1 && this.keyword2 == "") {
        console.log(this.keyword1,'this.keyword1')
        data.keyword = this.keyword1+','+this.keyword2;;
      } else {
        data.keyword = "";
      }
        this.$ajax1(
          `${this.subUrl.bd}/knowAll/edit?${this.$qs.stringify(data)}`,
          a,
          res => {
            console.log(this.uploadContent.accessorys);
            this.$message({
              message: "上传成功！",
              type: "success"
            });
            this.$router.push({
              path: "/user/blackstone/my_library/library_upload"
            });
          },
          this
        );
      }
    },
    update(e) {
      let file = e.target.files[0]; //详细信息
      let d = new Date();
      let type = file.name.split("."); //点切割
      console.log(type);
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
      console.log(param.get("file")); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      //先从自己的服务端拿到token
      this.token = this.getHearLog.token;

      param.append("token", this.token);
      this.uploading(param, config, file.name); //然后将参数上传七牛
      return;
    },
    uploading(param, config, pathName) {
      this.xhr.post("http://up-z2.qiniu.com", param, config).then(response => {
        this.imageName.push(response.data.key);
        this.uploadContent.accessorys = this.imageName.join(",");
        this.getHearLog.name = response.data.key;
        if (this.getHearLog.name != "") {
          if (this.getHearLog.pid == 1) {
            this.img.imgUrl1 =
              this.getHearLog.domain + "/" + this.getHearLog.name;
            this.acc.acc1 = this.getHearLog.name;
          } else if (this.getHearLog.pid == 2) {
            this.img.imgUrl2 =
              this.getHearLog.domain + "/" + this.getHearLog.name;
            this.acc.acc2 = this.getHearLog.name;
          } else if (this.getHearLog.pid == 3) {
            this.img.imgUrl3 =
              this.getHearLog.domain + "/" + this.getHearLog.name;
            this.acc.acc3 = this.getHearLog.name;
          } else if (this.getHearLog.pid == 4) {
            this.img.imgUrl4 =
              this.getHearLog.domain + "/" + this.getHearLog.name;
            this.acc.acc4 = this.getHearLog.name;
          }
        }
        let localArr = this.images.map((val, index, arr) => {
          return arr[index].localSrc;
        });
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
          if (res.data.code == 1) {
            this.getHearLog = res.data.data;
            this.getHearLog.pid = pid;
          }
        });
    },
    addImg(pid) {
      this.getQiniuInfo(pid);
    },
    getUploadToken() {
      this.$ajax(
        `${this.subUrl.user}/qiniu/getInfo`,
        { token: this.$getkey() },
        res => {
          console.log(res.data, "token");
          this.domain = res.data.domain;
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
      window.open(file.url, "_blank");
    },
    setBefore(e) {
      this.fileName = e.name;
    },
    uploadSuccess(res) {
      console.log(res);
      this.imgsAll[res.key] = res.key;
      this.fileList.push({
        name: this.fileName,
        url: this.domain + "/" + res.key,
        key: res.key
      });
    },
    uploadError() {
      this.$message.error("上传失败");
    },
    uploadMax() {
      this.$message.error("最多上传4个文件");
    },
    getEditorMain() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        kaId: this.uploadContent.kaId
      };
      this.$ajax(
        `${this.subUrl.bd}/knowAll/detail`,
        data,
        res => {
          var text = res.data.knowAll;
          this.uploadPosition = text.publishType
          this.uploadContent.title = text.title;
          this.expectBp = text.bp;
          this.uploadContent.content = text.content;
          this.value11 = text.typeId;
          if (text.keyword.indexOf(",") != '-1') {
            console.log(text.keyword.indexOf(","),'zouzli')
            var keywords = text.keyword.split(",");
            this.keyword1 = keywords[0];
            this.keyword2 = keywords[1];
          } else {
            console.log('zouzliunderfind')
            this.keyword1 = '';
            this.keyword2 = '';
          }
          console.log('this.keyword1:',this.keyword1,'this.keyword2',this.keyword2)
          if (text.bp == 0) {
            this.radio = 0;
          } else {
            this.expectBp = text.bp;
            this.radio = 1;
          }
          console.log(text.scope);
          if (text.scope == 0) {
            this.scope1 = 0;
          } else if (text.scope == 1) {
            this.scope1 = 1;
          } else if (text.scope == 2) {
            this.scope1 = 2;
          } else if (text.scope == 3) {
            this.scope1 = 3;
          } else if (text.scope == 4) {
            this.scope1 = 4;
          }
          for (var i = 0; i < res.data.commAccessoryList.length; i++) {
              this.fileList.push({
                  name:res.data.commAccessoryList[i].fileName,
                  url:res.data.commAccessoryList[i].path,
                  key:res.data.commAccessoryList[i].key
              })
            this.imgsAll[res.data.commAccessoryList[i].fileName] =
              res.data.commAccessoryList[i].fileName;
          }
          console.log(this.imgsAll);
        },
        this
      );
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
      delete this.imgsAll[file.name];
    }
  },
  updated() {
    // this.getMain();
    console.log(this.imgPath);
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    console.log(this.userInfo.deptId,5555555555)
    this.uploadContent.typeId = this.userInfo.deptId;
    this.uploadContent.kaId = this.$route.params.hid;
    this.getkey = fn.getIng();
    this.getAddress();
    this.uploadUrl = "http://up-z2.qiniu.com";
    this.getUploadToken();
    this.getEditorMain();

    this.getTitle1();

  }
};
</script>
<style lang="scss" scoped>
#library {
  height: 100%;
  padding-left: 260px;
}
.layout {
  background: #f1f1f1;
  position: relative;
  height: 100%;
}
.clear {
  clear: both;
}
.left {
  float: left;
}
.right {
  float: right;
}
.library_main {
  background: #fff;
  bottom: 70px;
  right: 0;
  left: 0;
  top: 0;
  position: absolute;
  height: auto;
}
.library_body {
  padding-left: 20px;
  padding-top: 10px;
  box-sizing: border-box;
  width: 100%;
  background: #fff;
  .library_input {
    width: 770px;
    display: block;
  }
  .library_input1 {
    margin-top: 10px;
    width: 770px;
    display: block;
  }
  .library_input2 {
    width: 770px;
    margin-top: 10px;
    .el-input {
      display: inline-block;
      width: 38%;
    }
    p {
      float: right;
      margin-top: 10px;
    }
    h4 {
      padding: 2px 2px;
      margin: 0;
      color: #ddd;
    }
  }
  .library_input3 {
    margin-top: 10px;
  }
}
.library_right {
  padding-left: 20px;
  padding-top: 10px;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  .library_radio {
    .el-radio {
      margin-left: 0;
    }
  }
  .library_address {
    margin-top: 10px;
    width: 770px;
    div {
      width: 100%;
      border-top: 1px dashed #ddd;
      a {
        padding-top: 20px;
        padding-bottom: 20px;
        margin-right: 30px;
      }
    }
  }
  .library_bottom {
    width: 100%;
    text-align: center;
    padding-bottom: 20px;
    margin-bottom: 100px;
  }
}
</style>

