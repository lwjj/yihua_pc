<template>
<div class="newRightContent" style="overflow:auto">
  <div class="border bgwhite">
    <yd-layout v-show="showUser" class="yd-layout" style="width:750px">
        <!-- <yd-navbar title="上报违规" slot='navbar' v-show="!userAgent.isWX" :bgcolor='mainColor' color='#fff' height='.88rem'>
            <div slot="left" @click="$router.go(-1)">
              <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
            </div>
        </yd-navbar> -->
        <div class="title">
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
            <el-breadcrumb-item  @click.native='$back'>整修单</el-breadcrumb-item>
            <el-breadcrumb-item>上报违规</el-breadcrumb-item>
        </el-breadcrumb>
        </div>
        <div style="padding:.4rem 0" class="bgwhite">
            <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem">
          <!-- 左边 -->
          <div style="width:1.68rem;text-align:right;" class="mr2">楼宇单元</div>
          <el-select class=" flex1 mr1" 
            style="border-radius:.1rem; height:.65rem"
              @change="getUnit"
                v-model="value" placeholder="请选择栋">
                <el-option
                  v-for="(item,index) in options"
                  :key="index"
                  :label="item.text"
                  :value="index">
                </el-option>
              </el-select>

            <el-select v-model="value1" 
              class=" flex1" 
              style="border-radius:.1rem; height:.65rem"
              @change="setUnit"
              placeholder="请选择单元">
                <el-option
                  v-for="(item,index) in options1"  
                  :key="item.guid"
                  :label="item.text"
                  :value="index">
                </el-option>
              </el-select>
          <!-- <input type="text" @click='chooseDong' placeholder="栋" v-model='dong.text' class="clear-input pdlr2 flex1 mr1" style="border-radius:.1rem;width:1.8rem;height:.65rem"
            readonly>
          <input type="text" @click='chooseUnit' placeholder="单元号" v-model='unit.text' class="clear-input pdlr2 flex1" style="border-radius:.1rem;width:1.8rem;height:.65rem"
            readonly> -->
          <div></div>
        </div>
        

        <!-- 联系人 -->
        <!-- v-model="unit.ownerInfo.userName" -->
        <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem">
          <div style="width:1.7rem;text-align:right;" class="mr2" >联系人</div>
          <input class="clear-input flex1 pdlr1" readonly v-model="rentName" style="height:.65rem" type="text">
        </div>
        <!-- 联系电话 -->
        <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem">
          <div style="width:1.7rem;text-align:right;" class="mr2">联系电话</div>
          <input class="clear-input flex1 pdlr1" readonly maxlength="11" v-model="rentPhone" style="height:.65rem" type="text">
        </div>
        <!-- <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem">
          <div style="width:1.7rem;text-align:right;" class="mr2">审批人</div>
          <input class="clear-input flex1 pdlr1"  readonly @click="showUser=false" v-model="approverName" style="height:.65rem" type="text">
        </div> -->
        <!-- 检查日期 -->
        <!-- <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem">
          <div style="width:1.7rem;text-align:right;" class="mr2">上报时间</div>
          <yd-datetime type='date' class="border flex1 pdlr1" v-model="startTime" style="height:.68rem"></yd-datetime>
        </div> -->
        <!--  -->
        <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem">
          <div style="width:1.7rem;text-align:right;" class="mr2">业主信息</div>
          <div style="width:2rem">{{ownerName}}</div>
          <div style="width:2rem">{{ownerPhone}}</div>
        </div>
        <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem;min-height:.8rem;height:auto">
          <div style="width:1.7rem;text-align:right;" class="mr2">违规内容</div>
          <yd-textarea  style="flex:1;height:3rem;" v-model="content" class="border pdlr1" :show-counter='false' maxlength=300>

          </yd-textarea>
        </div>
        <div class="flex-row-nowarp">
          <div style="width:1.7rem;text-align:right;" class="mr2">附件</div>
          <div class="upload_photo flex1 mt2">
            <el-upload
            :action="uploadUrl"
            accept='image/jpeg,image/png'
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
        <!-- 确定 -->
        <div class="flex-row-nowarp flex-start mt2">
          <div style="width:1.7rem;text-align:left;" class="mr2"></div>
            <yd-button type='hollow' @click.native="confirm">确定</yd-button>
        </div>
      </div>
      <!-- <vue-pickers v-show="show1" slot="bottom" class="slideBox" :selectData="pickData1" v-on:cancel="close" v-on:confirm="confirmFn"></vue-pickers>
      <vue-pickers v-show="show2" slot="bottom" class="slideBox" :selectData="pickData2" v-on:cancel="close" v-on:confirm="confirmFn1"></vue-pickers> -->
    </yd-layout>
    <departMent v-if='!showUser' @setUserId='setUserId'></departMent>

</div>
</div>
</template>
<script>
// import VuePickers from "vue-pickers";
import departMent from "../repair/department_manager";
import Vue from "vue";
import { Button, ButtonGroup } from "vue-ydui/dist/lib.rem/button";
/* 使用px：import {Button, ButtonGroup} from 'vue-ydui/dist/lib.px/button'; */

Vue.component(Button.name, Button);
Vue.component(ButtonGroup.name, ButtonGroup);
import { TextArea } from "vue-ydui/dist/lib.rem/textarea";
/* 使用px：import {TextArea} from 'vue-ydui/dist/lib.px/textarea'; */

Vue.component(TextArea.name, TextArea);
import {
  Confirm,
  Alert,
  Toast,
  Notify,
  Loading
} from "vue-ydui/dist/lib.rem/dialog";
/* 使用px：import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.px/dialog'; */

Vue.prototype.$dialog = {
  confirm: Confirm,
  alert: Alert,
  toast: Toast,
  notify: Notify,
  loading: Loading
};
export default {
  components: {
    departMent
  },
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    this.uploadUrl = "http://up-z2.qiniu.com";
    return {
      otherData: {},
      dialogImageUrl: "",
      uploadHash: {},
      showUser: true,
      dialogVisible: false,
      approverName: "",
      value: "",
      value1: "",
      options: [],
      options1: [],
      pickData1: {
        columns: 1,
        isChange: false,
        pData1: []
      },
      pickData2: {
        columns: 1,
        isChange: false,
        pData1: []
      },
      dong: {},
      unit: {},

      rentName: "",
      rentPhone: "",
      ownerName: "",
      ownerPhone: "",
      show1: false,
      show2: false,
      name: "",
      phone: "",
      startTime: "",
      content: ""
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
      this.$message.error("最多上传4张图片");
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
    setUserId(e) {
      this.showUser = true;
      console.log(this.result);
      if (e) {
        console.log(e);
        this.approverName = e.userName;
        this.approverId = e.userId;
      }
    },
    confirm() {
      if (!this.dong.text) {
        return this.$dialog.toast({ mes: "请选择栋" });
      } else if (!this.unit.text) {
        return this.$dialog.toast({ mes: "请选择单元" });
      } else if (!this.unit.organId) {
        return this.$dialog.toast({ mes: "该单元没有企业入驻,请重新选择!" });
      } else if (!this.content) {
        return this.$dialog.toast({ mes: "请输入违规内容" });
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        issueOrganId: this.unit.organId,
        content: this.content
        // approverId: this.approverId
      };
      var arr = [];
      for (var i in this.uploadHash) {
        arr.push(i);
      }
      data.accessorys = arr.join(",");
      this.$ajax(
        `${this.subUrl.activity}/rectification/addRectification`,
        data,
        res => {
          this.$dialog.toast({
            mes: "上报成功!",
            icon: "success",
            callback: res => {
              this.$router.go(-1);
            }
          });
        },
        this
      );
    },
    chooseDong() {
      if (this.pickData1.pData1.length == 0) {
        return this.$dialog.toast({ mes: "数据为空", timeout: 1000 });
      } else {
        this.show1 = true;
      }
    },
    chooseUnit() {
      if (this.pickData2.pData1.length == 0) {
        return this.$dialog.toast({ mes: "数据为空", timeout: 1000 });
      } else {
        this.show2 = true;
      }
    },
    setUnit(index) {
      let obj = this.options1[index];
      this.unit = obj;
      this.roomNumber = obj.guid;
      this.acceptOrgId = obj.organId;
      this.$getDepNum(this.unit.organId, res => {}, this);
      if (!obj.clientInfo) {
        return;
      }
      this.rentName = obj.clientInfo.name;
      this.rentPhone = obj.clientInfo.account;
      this.ownerName = obj.ownerInfo.name;
      this.ownerPhone = obj.ownerInfo.account;
    },
    getDong(id) {
      console.log(id);
      this.xhr
        .post(
          `${this.subUrl.common}/comm/getBuildingRid`,
          this.$qs.stringify({
            buildingId: id
          })
        )
        .then(res => {
          if (res.data.code == 1) {
            let len = res.data.data.length;
            let arr = [];
            for (var i = 0; i < len; i++) {
              var obj = res.data.data[i];
              obj.value = res.data.data[i].guid;
              obj.text = res.data.data[i].ridName;
              arr.push(obj);
            }
            this.pickData1.pData1 = arr;
            this.options = arr;
          } else {
            this.$dialog.alert({
              mes: res.data.msg
            });
            this.pickData2.pData1 = [];
            this.pickData3.pData1 = [];
          }
        });
    },
    getUnit(id) {
      let obj = this.options[id];
      this.dong = obj;
      id = obj.guid;
      this.xhr
        .post(
          `${this.subUrl.common}/comm/getEnterUnit`,
          this.$qs.stringify({
            ridId: id
          })
        )
        .then(res => {
          if (res.data.code == 1) {
            let len = res.data.data.length;
            let arr = [];
            for (var i = 0; i < len; i++) {
              var obj = res.data.data[i];
              console.log();
              obj.value = res.data.data[i].ridId;
              obj.text = res.data.data[i].unitName;
              arr.push(obj);
            }
            this.pickData2.pData1 = arr;
            this.options1 = arr;
          } else {
            this.$dialog.alert({
              mes: res.data.msg
            });
          }
        });
    },
    confirmFn(e) {
      this.dong = e.select1;
      console.log(JSON.stringify(e.select1));
      this.show1 = false;
      this.buildingRidId = e.select1.guid;
      this.getUnit(this.dong.guid);
      this.unit = {};
      this.roomNumber = "";
      this.acceptOrgId = "";
    },
    confirmFn1(e) {
      console.log(JSON.stringify(e.select1));
      this.unit = e.select1;
      this.roomNumber = e.select1.guid;
      this.acceptOrgId = e.select1.organId;
      if (!e.select1.clientInfo) {
        return this.$dialog.toast({ mes: "该单元无总经理，请选择其它单元" });
      }
      this.rentName = e.select1.clientInfo.name;

      this.rentPhone = e.select1.clientInfo.account;
      this.ownerName = e.select1.ownerInfo.name;
      this.ownerPhone = e.select1.ownerInfo.account;
      this.show2 = false;
    },
    close: function() {
      this.show1 = false;
      this.show2 = false;
    }
  },
  mounted() {
    this.getDong(this.userInfo.buildingId);
    this.getUploadToken();
  }
};
</script>

