<template>
<!--根元素-->
  <div class="newRightContent" style="height:100vh">
      <div class="bgwhite border" style="height:calc(100% - 20px);overflow-y:auto">
        <yd-layout v-show="showAdd" style="width:750px; margin:10px;" class="border">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item v-if="userInfo.organType == 3" :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
              <el-breadcrumb-item @click.native="$router.go(-1)">服务订单</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
          <!-- <yd-navbar height='.88rem' slot="navbar" color='#fff' :bgcolor='mainColor' title="服务订单" v-title="'服务订单'">
              <div class="addClickArea" slot="left" @click="$router.go(-1)" color='#fff'>
                <yd-navbar-back-icon color='#fff'></yd-navbar-back-icon>
              </div>
              
          </yd-navbar> -->
          <div class="list_item" @click="chooseType">
            <span>类型：</span>
            <input type="text" class="label" readonly placeholder="请选择类型" v-model="typeName">
            <yd-icon name='you' custom size='.4rem' color='#666'></yd-icon>
          </div>
          <div class="list_item">
            <span>重要</span>
             <yd-checkbox v-model="radio1" :color='mainColor'><span style="visibility:hidden">.</span></yd-checkbox>
          </div>
          <!-- 输入框 -->
          <div class="list_box">
              <yd-textarea class="mInput" placeholder="请输入备注" v-model="remark" maxlength="300"></yd-textarea>
          </div>
          <yd-lightbox>
            <div class="imgBox"> 
             
             <div class="imgList" v-for="(item,index) in uploadPreviewList" :key="index">
               <yd-icon name='delete' custom :color='mainColor' @click.native="delThisPic(index)" class="delete"></yd-icon>
               <img :src="item" alt="">
             </div>
              <label class="imgList" @click="checkImg" for="uploadImg">
                  <input type="file" :disabled='isDisabled' id="uploadImg" accept="image/jpg,image/jpeg,image/png" @change="update" multiple="multiple">
              </label>
          </div>
          </yd-lightbox>
          
            <div class="orderModel">
                <div class="o_title">订单模式</div>
                <yd-radio-group v-model="radio" :color='mainColor'>
                    <div class="item">
                        <yd-radio val="3">抢单</yd-radio>
                    </div>
                    <div class="item">
                         <yd-radio val="2">指派商家</yd-radio>
                    </div>
                </yd-radio-group>
            </div>
            <div class="buttons">
                <yd-button class="button" size="large" type="hollow" @click.native="submitOrder" :bgcolor='mainColor' color='#fff'>确定</yd-button>
            </div> 
      </yd-layout>
      <Industury v-if="!showAdd" @chooseSuccess='chooseSuccess'></Industury>
      </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Radio, RadioGroup } from "vue-ydui/dist/lib.rem/radio";
/* 使用px：import {Radio, RadioGroup} from 'vue-ydui/dist/lib.px/radio'; */

Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);

import { TextArea } from "vue-ydui/dist/lib.rem/textarea";
/* 使用px：import {TextArea} from 'vue-ydui/dist/lib.px/textarea'; */

Vue.component(TextArea.name, TextArea);
import { CheckBox, CheckBoxGroup } from "vue-ydui/dist/lib.rem/checkbox";
/* 使用px：import {CheckBox, CheckBoxGroup} from 'vue-ydui/dist/lib.px/checkbox'; */

Vue.component(CheckBox.name, CheckBox);
Vue.component(CheckBoxGroup.name, CheckBoxGroup);
import {
  LightBox,
  LightBoxImg,
  LightBoxTxt
} from "vue-ydui/dist/lib.rem/lightbox";
/* 使用px：import {Accordion, AccordionItem} from 'vue-ydui/dist/lib.px/accordion'; */

Vue.component(LightBox.name, LightBox);
Vue.component(LightBoxImg.name, LightBoxImg);
Vue.component(LightBoxTxt.name, LightBoxTxt);
import Industury from "./hangye";

export default {
  components: {
    Industury
  },
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    return {
      showAdd: true,
      imgList: [],
      typeName: "",
      radio1: false,
      remark: "",
      uploadPreviewList: [],
      uploadFileList: [],
      imageKeyList: [],
      radio: 2,
      getLogoMsg: {},
      isDisabled: false
    };
  },
  methods: {
    chooseType() {
      this.showAdd = false;
    },
    chooseSuccess(e) {
      this.showAdd = true;
      if (e) {
        this.typeId = e.require.guid;
        this.typeName = e.require.name;
        console.log(e);
      }
    },
    // 生成预览图片
    setImgPreview() {
      this.uploadPreviewList = [];
      for (var i = 0; i < this.uploadFileList.length; i++) {
        this.uploadPreviewList.push(this.$getImgUrl(this.uploadFileList[i]));
      }
      console.log(this.uploadPreviewList);
    },
    checkImg() {
      console.log(this.uploadFileList);
      if (this.uploadFileList.length >= 4) {
        this.isDisabled = true;
        return this.$dialog.toast({ mes: "最多上传4张照片" });
      } else {
        this.isDisabled = false;
      }
    },
    update(e) {
      // this.imageUrl = this.getData.imageUrl;
      if (e.target.files.length > 4) {
        return this.$message({ message: "最多上传4张照片", type: "error" });
      }
      for (var i = 0; i < e.target.files.length; i++) {
        let file = e.target.files[i];
        this.uploadFileList.push(file);
      }
      console.log(this.uploadFileList);
      this.setImgPreview();
      if (this.uploadFileList.length >= 4) {
        this.isDisabled = true;
        return this.$message({ message: "最多上传4张照片", type: "error" });
      } else {
        this.isDisabled = false;
      }
      return;
      //先从自己的服务端拿到token
    },
    uploading(param, config, pathName, cb) {
      this.xhr.post("http://up-z2.qiniu.com", param, config).then(response => {
        this.organLogo = response.data.key;
        this.imageKeyList.push(this.organLogo);
        cb && cb(response.data);
      });
    },
    // 上传图片
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
      param.append("token", this.getLogoMsg.token);
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
    // 获取千牛token
    getQiniuMsg() {
      var data = {
        token: this.$getkey()
      };
      this.xhr
        .post(`${this.subUrl.user}/qiniu/getInfo?token=` + data.token)
        .then(res => {
          if (res.data.code == 1) {
            this.getLogoMsg = res.data.data;
            console.log(res.data.data, "参数");
          } else if (res.data.code == "-902") {
            // fn.re_login(this);
          } else {
            return this.$message({ message: res.data.msg, type: "error" });
          }
        });
    },
    // 删除单张图片
    delThisPic(index) {
      this.uploadPreviewList.splice(index, 1);
      this.uploadFileList.splice(index, 1);
    },
    // 提交订单
    submitOrder() {
      if (!this.typeName)
        return this.$message({ message: "请输入类型名字", type: "error" });
      if (!this.remark)
        return this.$message({ message: "请输入详情", type: "error" });
      let data = {
        userId: this.userInfo.guid,
        token: this.$getkey(),
        typeId: this.typeId,
        location: "",
        remark: this.remark,
        serviceMode: this.radio
      };
      if (this.radio) {
        data.level = 2;
      } else {
        data.level = 1;
      }
      console.log(this.radio);
      this.fullscreenLoading = true;
      if (this.uploadFileList == 0) {
        data.accessorys = "";
        this.$ajax(
          `${this.subUrl.activity}/serviceOrder/subSerceOrder`,
          data,
          res => {
            this.$message({
              message: "上报成功",
              type: "success"
            });
            this.$router.go(-1);
          },
          this
        );
      } else {
        this.imgLength = this.uploadFileList.length;
        this.imgIndex = 0;
        this.uploadImg(length, res => {
          console.log(this.imageKeyList);
          data.accessorys = this.imageKeyList.join(",");
          this.$ajax(
            `${this.subUrl.activity}/serviceOrder/subSerceOrder`,
            data,
            res => {
              this.$message({
                message: "上报成功",
                type: "success"
              });
              this.$router.go(-1);
            },
            this
          );
        });
      }
    }
  },
  mounted() {
    // 获取token（千牛上传）
    this.getQiniuMsg();
  }
};
</script>
<style scoped>
.list_item {
  background: #fff;
  display: flex;
  padding: 0 0.45rem;
  height: 0.88rem;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e4e4e4;
}
.list_item .label {
  height: 0.6rem;
  border: none;
}
.list_box {
  margin-top: 0.44rem;
  padding: 0.28rem 0.34rem 0;
  border-top: 1px solid #e4e4e4;
  background: #fafefd;
}
.list_box .mInput {
  background: #fff;
  border-radius: 0.05rem;
  border: 1px solid #e4e4e4;
  height: 3.1rem;
  box-sizing: border-box;
  padding: 0.2rem 0.2rem 0.5rem 0.2rem;
}
.imgBox {
  display: flex;
  align-items: flex-start;
  padding: 0.28rem 0.4rem;
  background: #fafefd;
  border-bottom: 1px solid #e4e4e4;
}
.imgBox .imgList {
  display: block;
  width: 1.2rem;
  height: 1.2rem;
  margin-bottom: 0.1rem;
  overflow: hidden;
  margin-right: 0.1rem;
  position: relative;
}
.imgBox .imgList:last-child {
  background: url("../../../../../assets/images/rent/estate/photo.png")
    no-repeat left top;
  background-size: 100%;
}
.imgBox .imgList input {
  display: block;
  width: 0px;
  height: 0px;
  overflow: hidden;
  visibility: hidden;
}
.imgBox .imgList img {
  width: 100%;
  max-height: 1.2rem;
}
.imgBox .imgList .delete {
  overflow: hidden;
  position: absolute;
  right: -0.1rem;
  top: -0.1rem;
}

.orderModel {
  background: #fafefd;
  margin-top: 0.28rem;
  border-top: 1px solid #e4e4e4;
  border-bottom: 1px solid #e4e4e4;
}
.orderModel .o_title {
  line-height: 0.6rem;
  padding: 0 0.4rem;
  background: #fff;
}
.orderModel .item {
  display: flex;
  padding: 0 0.5rem;
  border-top: 1px solid #e4e4e4;
  align-items: center;
  height: 0.88rem;
  background: #fafefd;
}
.buttons {
  text-align: center;
  margin: 1rem 0;
}
.buttons .button {
  background: #f00;
  height: 0.88rem;
  width: 6.4rem;
  margin: 0 auto;
}
</style>
