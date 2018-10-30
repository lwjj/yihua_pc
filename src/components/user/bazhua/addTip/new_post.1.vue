<template>
  <div class="newRightContent" style="overflow:auto">
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <!-- <el-breadcrumb-item :to="{ path: '/bazhua/circle' }">个人中心</el-breadcrumb-item> -->
          <el-breadcrumb-item>发布帖子</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    <div class="relative bgwhite" style="height:100%;padding:20px 0;">
      <div>
        <div style="padding: 0 10px;background: #fff;margin-top: 10px">
          <div class="list_item">
            <div class="label">标题</div>
            <el-input type="text" placeholder="请输入标题" :maxlength="50"></el-input>
            <div class="isImportant">
              <yd-checkbox class="topCheck" style="float:right" v-model="checkbox" size="15">急</yd-checkbox>
          </div>
          <div class="list_item">
            <div class="label">详情</div>
            <el-input type="textarea" :maxlength="2000" ></el-input>
            <div></div>
          </div>
        </div>
        </div>
      </div> 
        <textarea name="" id="" v-model="text" cols="10" placeholder="请输入帖子详情" maxlength="600" rows="5">
        </textarea>
          <div class="text-right">{{text.length}}/600</div>
          <div class="important-input-div">
            <input type="text" v-model="keyword[0]" maxlength="10" placeholder="输入关键词">
            <input placeholder="输入关键词" maxlength="10" v-model="keyword[1]" type="text">
            <input placeholder="输入关键词" maxlength="10" v-model="keyword[2]" type="text">
          </div>
          <div style="width: 100%;background:#fff;margin:10px 0; ">
                 <el-upload
                :action="uploadUrl"
                list-type="picture-card"
                :data='otherData'
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePictureCardPreview"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :limit='7'
                :on-exceed='uploadMax'
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog  :visible.sync="dialogVisible" size="tiny">
                <img :src="dialogImageUrl" alt="">
              </el-dialog>
          </div>
          <yd-accordion-item title="帖子类型" style="margin-bottom:.2rem;background:#fff;" open>
            <div style="padding: .24rem;">
              <yd-radio-group v-model="TypeList" v-for="(item,index) in tipType" :key="index">
                <yd-radio class="choose_item" @click.native="chooseBbsType(item)" :val="item.guid">
                  {{item.dictDataValue}}
                </yd-radio>
                <yd-radio v-if="item.childDictData.length>0" @click.native="chooseBbsType(el)" class="er choose_item"
                          v-for="(el,index) in item.childDictData" :key="index" :val="el.guid">
                  {{el.dictDataValue}}
                </yd-radio>
              </yd-radio-group>
            </div>
          </yd-accordion-item>
          <!-- 发布范围 -->
          <yd-accordion-item  v-if="userInfo.organType!= 5" title="发布范围" style="margin-bottom:.2rem;background:#fff;" open>
            <div style="padding: .24rem;">
              <yd-radio-group v-model="TypeList1">
                <yd-radio class="choose_item" v-for="(item,index) in disList" :key="index" :val="index">
                  <span class="scope">{{item.name}}</span>
                  <span>{{item.scopeName}}</span>
                </yd-radio>
              </yd-radio-group>
            </div>
          </yd-accordion-item>
          <yd-accordion-item title="期限" style="margin-bottom:.2rem;background:#fff;" open>
            <yd-cell-group title="" style="margin:0">
              <yd-cell-item type="radio">
                <span slot="left">永久</span>
                <input slot="right" type="radio" value="1" v-model="TypeList2"/>
              </yd-cell-item>
              <yd-cell-item type="radio">
                <span slot="left">截止日期</span>
                <!--<yd-datetime slot='left' type="date" class="endTime" v-model="endTime"-->
                <!--start-date="2017-01-01"></yd-datetime>-->
                <input slot="right" type="radio" value="2" v-model="TypeList2"/>

              </yd-cell-item>
              <div class="block">
                <el-date-picker v-if="TypeList2==2"
                                v-model="endTime"
                                type="date"
                                placeholder="选择日期">
                </el-date-picker>
              </div>
            </yd-cell-group>

          </yd-accordion-item>
          <yd-accordion-item title="报名人数" style="margin-bottom:.2rem; background:#fff;" open>
            <div style="padding: .24rem;">
              <yd-checkbox-group v-model="TypeList3">
                <div class="getDate">
                  <yd-checkbox class="choose_item" val="1" shape="circle">人数</yd-checkbox>
                  <yd-input class="people" :max='12' v-model="peopleNum" regex="^\d{1,12}$"></yd-input>
                </div>

              </yd-checkbox-group>
            </div>
          </yd-accordion-item>
          <div class="to-select">
            <div class="agreement flex center">
              <yd-checkbox class="agree" v-model="agree">同意平台</yd-checkbox><i @click.stop="showXieyi=true" class="checkXieyi cursor">圈子服务</i>
            </div>
            <div class="buttonBox">
              <yd-button size="large" class="send" @click.native="sendPost" color='#fff' type="primary">
                立即发布
              </yd-button>
            </div>
          </div>
        </div>
      </div> 
    <!-- </div> -->
    <!-- </div> -->
  <!-- </div> -->



</template>
<script>
import Vue from "vue";
import xieyi from "@/components/login/agreement";

import { Radio, RadioGroup } from "vue-ydui/dist/lib.rem/radio";
/* 使用px：import {Radio, RadioGroup} from 'vue-ydui/dist/lib.px/radio'; */
import { Button, ButtonGroup } from "vue-ydui/dist/lib.rem/button";
/* 使用px：import {Button, ButtonGroup} from 'vue-ydui/dist/lib.px/button'; */

Vue.component(Button.name, Button);
Vue.component(ButtonGroup.name, ButtonGroup);
Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);

import { CheckBox, CheckBoxGroup } from "vue-ydui/dist/lib.rem/checkbox";
/* 使用px：import {CheckBox, CheckBoxGroup} from 'vue-ydui/dist/lib.px/checkbox'; */

Vue.component(CheckBox.name, CheckBox);
Vue.component(CheckBoxGroup.name, CheckBoxGroup);

import { CellGroup, CellItem } from "vue-ydui/dist/lib.rem/cell";
/* 使用px：import {CellGroup, CellItem} from 'vue-ydui/dist/lib.px/cell'; */

Vue.component(CellGroup.name, CellGroup);
Vue.component(CellItem.name, CellItem);
export default {
  components: {
    xieyi
  },
  data() {
    let TypeListCircle;
    var userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    var userType = userInfo.organType;
    if (userType == 1) {
      TypeListCircle = 1;
    } else if (userType == 5) {
      TypeListCircle = 2;
    } else {
      TypeListCircle = 3;
    }
    var circleType = 2;
    var organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.uploadUrl = "http://up-z2.qiniu.com";
    return {
      showXieyi: false,
      organInfo,
      uploadFileList: [],
      uploadPreviewList: [],
      title: "",
      text: "",
      endTime: "",
      TypeList2: 1,
      userInfo,
      circleType,
      disList: [],
      tipType: [],
      TypeList: "",
      imageKeyList: [],
      TypeList1: -1,
      TypeList3: [],
      peopleNum: "",
      keyword: [],
      checkbox: false,
      agree: false,
      imageUrl: "",
      imageUrlList: [],
      getData: "",
      dialogImageUrl: "",
      dialogVisible: false,
      otherData: {},
      imgsAll: []
    };
  },
  methods: {
    closeXieyi() {
      this.showXieyi = false;
    },
    delThisPic(index) {
      this.uploadPreviewList.splice(index, 1);
      this.uploadFileList.splice(index, 1);
    },
    setImgPreview() {
      this.uploadPreviewList = [];
      for (var i = 0; i < this.uploadFileList.length; i++) {
        this.uploadPreviewList.push(this.$getImgUrl(this.uploadFileList[i]));
      }
      console.log(this.uploadPreviewList);
    },
    update(e) {
      var flag = false;
      this.imageUrl = this.getData.imageUrl;
      for (var i = 0; i < e.target.files.length; i++) {
        let file = e.target.files[i];
        var a = file.name.indexOf(".");
        if (
          file.name.slice(a + 1) !== "png" &&
          file.name.slice(a + 1) !== "jpg"
        ) {
          flag = true;
        } else {
          this.uploadFileList.push(file);
        }
      }
      if (flag) {
        return this.$message({
          message: "上传视频格式只支持png,jpg格式",
          type: "error"
        });
      }
      console.log(this.uploadFileList);
      this.setImgPreview();
      return;
      //先从自己的服务端拿到token
    },
    uploadImg(length, cb) {
      let d = new Date();
      this.token = this.getLogoMsg.token;
      this.imageUrl = this.getLogoMsg.domain;
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
          ".png",
        bucket: this.imageUrl //七牛的地址，这个是你自己配置的（变量）
      };
      let param = new FormData(); //创建form对象
      param.append("chunk", "0"); //断点传输
      param.append("chunks", "1");
      var file = this.uploadFileList[this.imgIndex];
      console.log(file);
      param.append(`file`, file, file.name);
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      param.append("token", this.token);
      this.uploading(param, config, file.name, res => {
        this.imgIndex = parseInt(this.imgIndex) + 1;
        if (this.imgIndex < this.imgLength) {
          this.uploadImg(length, function() {
            cb && cb();
          });
        } else {
          cb && cb();
        }
      }); //然后将参数上传七牛
    },
    getQiniuMsg() {
      var data = {
        token: this.$getkey()
      };
      this.xhr
        .post(`${this.subUrl.user}/qiniu/getInfo?token=` + data.token)
        .then(res => {
          if (res.data.code == 1) {
            this.getLogoMsg = res.data.data;
          } else if (res.data.code == "-902") {
            // fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    uploading(param, config, pathName, cb) {
      this.xhr.post("http://up-z2.qiniu.com", param, config).then(response => {
        this.organLogo = response.data.key;
        this.imageKeyList.push(this.organLogo);
        this.imageUrlList.push(this.imageUrl + "/" + response.data.key);
        this.showLogo = true;
        cb && cb(response.data);
      });
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
      this.$message.error("最多上传7张图片");
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
    },
    loadList() {},
    sendPost() {
      console.log(this.TypeList);
      if (!this.agree) {
        return this.$message.error("请勾选平台圈子服务");
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      if (this.title == "") {
        return this.$message.error("请输入标题");
      } else if (this.text == "") {
        return this.$message.error("请输入内容");
      } else if (!this.keyword[0] && !this.keyword[1] && !this.keyword[2]) {
        return this.$message.error("请输入关键词");
      } else if (this.TypeList == "") {
        // else if (this.uploadPreviewList.length == 0) {
        //   this.$dialog.toast({mes: "请添加图片", timeout: 400});
        //   return;
        // }
        return this.$message.error("请选择帖子类型");
      } else if (this.TypeList1 === -1) {
        if (this.userInfo.organType != 5) {
          return this.$message.error("请选择发布范围");
        }
      } else if (this.TypeList2 == "") {
        return this.$message.error("请选择截止时间");
      }
      data.title = this.title;
      data.isUrgency = this.checkbox ? 1 : 0;
      data.content = this.text;
      data.keyword = this.keyword.join(",");

      if (this.userInfo.organType != 5) {
        data.organId = this.organInfo.guid;
      } else {
        if (!this.organInfo) {
          data.organId = 0;
        } else if (this.organInfo.guid) {
          data.organId = this.organInfo.guid;
        }
      }
      // console.log(this.organInfo);
      // 帖子id
      data.type = this.TypeList;
      data.typePid = this.bbsType.pId;

      console.log(JSON.stringify(this.bbsType));
      data.circleType = this.circleType;

      // 发布范围
      if (this.userInfo.organType != 5) {
        data.scope = this.disList[this.TypeList1].scope;
        data.scopeValue = this.disList[this.TypeList1].scopeValue;
      } else {
        data.scope = 0;
        data.scopeValue = 0;
      }

      // data.releaseRange = this.TypeList1;
      //截止时间
      if (this.TypeList2 == 1) {
        data.deadline = "9999-12-31 00:00:00";
      } else if (this.TypeList2 == 2) {
        data.deadline = this.endTime + " 23:59:59";
      }
      //报名人数
      console.log(this.TypeList3);
      if (this.TypeList3.length >= 1) {
        if (this.peopleNum == "") {
          return this.$message.error("请输入报名人数");
        } else if (!/\d{1,12}/.test(this.peopleNum)) {
          return this.$message.error("请输入正确的报名人数");
        } else {
          data.applicantNum = this.peopleNum;
        }
      }
      this.imgLength = this.uploadFileList.length;
      this.imgIndex = 0;
      var a = [];
      for (var key in this.imgsAll) {
        this.imgsAll[key];
        a.push(this.imgsAll[key]);
      }
      data.imageNames = a.join(",");
      this.imageKeyList = [];
      this.imageUrlList = [];
      this.imageKeyList = [];
      this.uploadFileList = [];
      this.uploadPreviewList = [];
      this.$ajax(
        `${this.subUrl.sc}/bbs/saveBbs`,
        data,
        res => {
          // this.$dialog.loading.close();
          this.$message.success("发布成功");
          this.$router.push("/bazhua/circle");
          this.imageKeyList = [];
          this.imageUrlList = [];
          this.imageKeyList = [];
          this.uploadFileList = [];
          this.uploadPreviewList = [];
          this.cancel();
        },
        this
      );
    },
    chooseBbsType(item) {
      console.log(item);
      this.bbsType = item;
    },
    getbbsType() {
      var data = {
        token: this.$getkey(),
        circleType: this.circleType
      };
      this.$ajax(
        `${this.subUrl.sc}/bbs/getBBsType`,
        data,
        res => {
          this.tipType = res.data;
        },
        this
      );
    },
    getDistrict() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.bd}/knowAll/userDistrict`,
        data,
        res => {
          this.disList = res.data;
        },
        this
      );
    }
  },
  mounted() {
    this.getbbsType();
    this.getQiniuMsg();
    // 获取任务类型
    this.getDistrict();
    this.getUploadToken();
  }
};
</script>
<style lang="scss" scoped>
.content {
  padding: 20px 30px;
  margin: 20px 0;
  background: #fff;
}

// #new_progress {
//   padding-left: 300px;
//   padding-right: 40px;
//   padding-bottom: 100px;
//   height: 100%;
//   overflow: scroll;
// }
#new_progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.people {
  width: 60%;
  margin-left: 0.3rem;
  /*border: 1px solid #ddd;*/
  padding: 0 0.1rem;
  height: 0.5rem;
}

.getDate {
  display: flex;
  align-items: center;
  line-height: 0.6rem;
}

.endTime {
  text-align: left;
  text-indent: 3em;
}
.list_item {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  .label {
    white-space: nowrap;
    padding-right: 10px;
  }
  .isImportant {
    padding-left: 20px;
  }
}
/* 同意协议 */

.agreement {
  display: flex;
  height: 0.9rem;
  align-items: center;
  justify-content: center;
}

.agreement .agree {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.send {
  margin: 0;
}

.choose_item {
  height: 0.6rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ececec;
}

.choose_item span {
  margin-right: 0.2rem;
}

.buttonBox {
  padding: 0 0.2rem 0.3rem;
}

.top-write {
  width: 100%;
  background: #fff;
  padding-bottom: 0;
  height: 0.84rem;
  border-bottom: 1px solid #ddd;
  align-items: center;
  line-height: 47px;
}

.topCheck {
  display: flex;
  align-items: center;
}

.top-write > div {
  display: flex;
  width: 100%;
  margin-left: 0.5em;
  border-bottom: 1px solid #e6e6e6;
}

.top-write-input {
  width: 400px;
  height: 2.3em;
  line-height: 47px;
  font-size: 0.3rem;
  color: #333;
  border: none;
  padding: 0.3rem;
  background: #fff;
}

.post-textarea {
  padding: 1em;
  width: 100%;
  background: #fff;
}

.post-textarea textarea {
  width: 100%;
  background: #fff;
  border: none;
  font-size: 14px;
}

.post-textarea div {
  color: #999999;
  padding-bottom: 0.3em;
  border-bottom: 1px dashed #e6e6e6;
}

.important-input-div {
  width: 100%;
  background: #ffffff;
  padding-bottom: 0.5em;
  display: flex;
  flex-wrap: wrap;
  padding: 0 0.3rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.important-input-div input {
  width: 1.45rem;
  font-size: 0.26rem;
  color: #999999;
  line-height: 0.38rem;
  border: none;
  border: 1px solid #ddd;
  border-radius: 0.05rem;
  text-align: center;
  margin-right: 0.2rem;
}

.show-send-pic {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  padding-bottom: 2em;
  padding: 0 0.2rem;
}

.logo-img-div {
  width: 1.56rem;
  height: 1.56rem;
  /* margin: 1%; */
  border: 1px solid #e6e6e6;
  margin-top: 0.1rem;
  border-radius: 6px;
  position: relative;
  background: #fff;
  margin-right: 0.2rem;
  margin-bottom: 0.2rem;
  overflow: hidden;
  padding: 0;
  display: inline-block;
}

.logo-img-div img {
  width: 100%;
  height: 100%;
  margin: 0;
}

.logo-img-div a {
  display: block;
  position: absolute;
  right: -0.1rem;
  top: -0.1rem;
}

.hid-input {
  opacity: 0;
  position: absolute;
  width: 5em;
  height: 5em;
}

.add-logo-img {
  width: 2em !important;
  height: 2em !important;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -1em !important;
  margin-top: -1em !important;
}

.to-select {
  width: 100%;
  background: #fff;
  margin-top: 1em;
  border-bottom: 1px solid #e6e6e6;
}

.to-select > div > span {
  transform: rotate(90deg);
}

/*transform:rotate(45deg)*/

.important-input-div input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  font-size: 0.24rem;
  color: #999999;
  opacity: 1;
}

.important-input-div input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  font-size: 0.24rem;
  color: #999999;
  opacity: 1;
}

.important-input-div input:-ms-input-placeholder {
  font-size: 0.24rem;
  color: #999999;
  opacity: 1;
}

.important-input-div input::-webkit-input-placeholder {
  font-size: 0.24rem;
  color: #999999;
  opacity: 1;
}

.er {
  margin-left: 0.4rem;
  border-bottom: 1px solid #ececec;
}
</style>
