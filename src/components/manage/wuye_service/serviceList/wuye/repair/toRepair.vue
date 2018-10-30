<template>
  <div class="newRightContent" style="overflow:auto">
    <div class="bgwhite border">
      <yd-layout class="layout_my yd-layout" style="width:750px;padding:20px 0 30px;" v-show='isShow && showUser'>
        <div class="title">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
            <el-breadcrumb-item @click.native="$router.back">报修单</el-breadcrumb-item>
            <el-breadcrumb-item>新建报修单</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      <!-- <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'报修单'" title="报修单" color="#fff" :bgcolor="mainColor"
        height=".88rem">
        <span @click="$router.go(-1)" slot="left">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </span>
        <div slot="right" class="edit" style="color: #fff;">
          <a @click="sureToRepair">
            提交
          </a>
        </div>
      </yd-navbar> -->
      <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem" @click='setShow()'>
        <div style="width:1.68rem;text-align:right;" class="mr2">报修类型</div>
        <input class="clear-input flex1" style="height:.65rem" readonly v-bind:placeholder=typeName v-model="typeName" type="text">
      </div>
      <!-- 这部分租户与管理员区分部分结束 -->
      
     <div v-if="userInfo.organType == 3">
        <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem">
        <!-- 左边 -->
        <div style="width:1.68rem" class="mr2"></div>
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
        
         </div>
         <!-- 这部分结束 -->
      
      <div class="flex-row h8 bgwhite flex-start" style="padding-right:.6rem">
        <div style="width:1.7rem;text-align:right;" class="mr2">选择租户</div>
        <input type="text" style="height:.65rem;" class="clear-input flex1" v-model="rentName" readonly @click="chooseUser" placeholder="选择租户">
      </div>
   </div>
      <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem" @click='addFast()'>
        <div style="width:1.7rem;text-align:right;" class="mr2">加急</div>
         <yd-checkbox v-model="checkbox1" :color='mainColor'><span style="visibility:hidden">.</span></yd-checkbox>
      </div>
      <!--<div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem">-->
        <!--<div style="width:1.7rem;text-align:right;" class="mr2">维修位置</div>-->
        <!--<input class="clear-input"  v-model="location" style="height:.65rem" type="text">-->
      <!--</div>-->

      <div class="text-more">
        <textarea v-model="descripTion" placeholder="详情描述"> </textarea>
        <textarea v-model="whyToRepair" placeholder="备注"> </textarea>
        <div class="show-send-pic">
          
          <!--<div v-if="imageUrlList&&imageUrlList.length==0" style="border: none" class="logo-img-div"></div>
          <div v-if="imageUrlList&&imageUrlList.length==0" style="border: none" class="logo-img-div"></div>-->
          <div class="logo-img-div" v-for="(item,index) in imageUrlList" :key="index">
            <img v-if="showLogo" :src="item" alt="" class="fileImg">
            <a @click="delThisPic(index)">
              <yd-icon name="error" class="del-this-pic"></yd-icon>
            </a>
            <!--<img v-if="" :src="mechanismMsg.organLogo" alt="" class="fileImg">-->
            <!--<img v-if="!showLogo" src="../../../../../../assets/images/rent/my/admin/add-logo.png" alt="" class="fileImg add-logo-img">-->
            <!--<input class="file hid-input"  name="file[]" type="file" accept="image/png,image/gif,image/jpeg" @change="update"multiple/>-->
          </div>
          <!--<div v-if="imageUrlList&&imageUrlList.length>0&&((imageUrlList.length+1)%3!=0)" style="border: none" class="logo-img-div"></div>
          <div v-if="imageUrlList&&imageUrlList.length>0&&(imageUrlList.length+1)%3==1" style="border: none" class="logo-img-div"></div>-->
          <div class="logo-img-div">
            <!--<img v-if="showLogo"  :src="imageUrl" alt="" class="fileImg">-->
            <!--<img v-if="" :src="mechanismMsg.organLogo" alt="" class="fileImg">-->
            <img src="../../../../../../assets/images/rent/estate/photo.png" alt="" class="fileImg add-logo-img">
            <!-- <img src="../../../../../../assets/images/rent/my/admin/add-logo.png" alt="" class="fileImg add-logo-img"> -->
            <input class="file hid-input"  type="file" accept="image/jpg,image/png" @change="update" multiple/>
          </div>
        </div>
         <div class="pdlr2">
            <el-button type="primary" @click="sureToRepair">提交</el-button>
          </div>
      </div>
      <vue-pickers v-show="show1" slot="bottom" class="slideBox" :selectData="pickData1" v-on:cancel="close" v-on:confirm="confirmFn"></vue-pickers>
      <vue-pickers v-show="show2" slot="bottom" class="slideBox" :selectData="pickData2" v-on:cancel="close" v-on:confirm="confirmFn1"></vue-pickers>
    </yd-layout>
    <!-- 选择类型 -->
    <seleceType v-show='!isShow' @getParams='getParams' @myCancel='myCancel'></seleceType>
    <departMent v-if='!showUser' :organId='this.unit.organId' @setAssignId='setUserId'></departMent>
    </div>
    

  </div>
</template>
<script>
import fn from "@/assets/js/product";
import qs from "qs";
import { Icons } from "vue-ydui/dist/lib.rem/icons";
import seleceType from "./selectType";
import VuePickers from "vue-pickers";
import departMent from "../complain/department_manager";
import Vue from "vue";
import { CheckBox, CheckBoxGroup } from "vue-ydui/dist/lib.rem/checkbox";
/* 使用px：import {CheckBox, CheckBoxGroup} from 'vue-ydui/dist/lib.px/checkbox'; */

Vue.component(CheckBox.name, CheckBox);
Vue.component(CheckBoxGroup.name, CheckBoxGroup);

export default {
  components: {
    seleceType,
    VuePickers,
    departMent
  },
  data() {
    return {
      //详情
      descripTion:'',
      checkbox1: false,
      showUser: true,
      isShow: true,
      value: "",
      value1: "",
      organInfo: "",
      hasMessage: {
        count: 99,
        new: true
      },
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
      show1: false,
      show2: false,
      value2: "",
      result: [],
      url: this.fromRoute ? this.fromRoute : "",
      userInfo: "",
      mainColor: "",
      getLogoMsg: {},
      getData: "",
      imageUrl: "",
      imageUrlList: [],
      imageKeyList: [],
      options: [],
      options1: [],
      showLogo: false,
      whyToRepair: "",
      typeName: "请选择",
      typeGuid: "",
      location: "",
      submitData: {},
      rentName: "",
      rentUserId: ""
    };
  },
  methods: {
    chooseUser() {
      if (!this.unit.organId) {
        return this.$message({ message: "请选择单元", type: "error" });
      }
      if (!this.depNum) {
        return this.$message({ message: "该单元暂无用户", type: "error" });
      }
      this.showUser = false;
    },
    setUnit(index) {
      console.log(this.options1[index]);
      let obj = this.options1[index];
      this.unit = obj;
      this.$getDepNum(obj.organId, res => {}, this);
      this.submitData.roomNumber = obj.guid;
      this.submitData.acceptOrgId = obj.organId;
    },
    setUserId(e) {
      this.showUser = true;
      if (e) {
        this.rentName = e.userName;
        this.rentUserId = e.userId;
      }
    },
    setShow() {
      console.log(111);
      this.isShow = false;
    },
    getParams(data) {
      console.log(data);
      this.typeGuid = data.type;
      this.typeName = data.typeName;
      this.isShow = true;
    },
    chooseDong() {
      if (this.pickData1.pData1.length == 0) {
        return this.$message({ message: "数据为空", timeout: 1000 });
      } else {
        this.show1 = true;
      }
    },
    chooseUnit() {
      if (this.pickData2.pData1.length == 0) {
        return this.$message({ message: "数据为空", timeout: 1000 });
      } else {
        this.show2 = true;
      }
    },
    getDong(id) {
      this.xhr
        .post(
          `${this.subUrl.common}/comm/getBuildingRid`,
          qs.stringify({
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
              message: res.data.msg
            });
            this.pickData2.pData1 = [];
            this.pickData3.pData1 = [];
          }
        });
    },
    getUnit(id) {
      let obj = this.options[id];
      id = obj.guid;
      this.submitData.buildingRidId = obj.guid;
      this.xhr
        .post(
          `${this.subUrl.common}/comm/getEnterUnit`,
          qs.stringify({
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
            console.log(this.options1);
          } else {
            this.$dialog.alert({
              message: res.data.msg
            });
          }
        });
    },
    close: function() {
      this.show1 = false;
      this.show2 = false;
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
      console.log(e.select1);
      this.roomNumber = e.select1.guid;
      this.acceptOrgId = e.select1.organId;
      this.show2 = false;
    },
    myCancel() {
      this.isShow = true;
    },
    delThisPic(index) {
      this.imageKeyList.splice(index, 1);
      this.imageUrlList.splice(index, 1);
    },
    update(e) {
      this.imageUrl = this.getData.imageUrl;
      for (var i = 0; i < e.target.files.length; i++) {
        let file = e.target.files[i];
        let d = new Date();
        let type = file.name.split(".");
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
          bucket: "http://oysfye6yt.bkt.clouddn.com" //七牛的地址，这个是你自己配置的（变量）
        };
        let param = new FormData(); //创建form对象
        param.append("chunk", "0"); //断点传输
        param.append("chunks", "1");
        param.append("file", file, file.name);
        let config = {
          headers: { "Content-Type": "multipart/form-data" }
        };
        this.token = this.getLogoMsg.token;
        this.imageUrl = this.getLogoMsg.domain;
        param.append("token", this.token);
        this.uploading(param, config, file.name); //然后将参数上传七牛
      }
      return;

      //先从自己的服务端拿到token
    },
    getQiniuMsg() {
      var data = {
        organId: this.organInfo.guid,
        token: this.getkey,
        pageNo: 1,
        pageSeze: 15
      };
      this.xhr
        .post(`${this.subUrl.user}/qiniu/getInfo?token=` + data.token)
        .then(res => {
          if (res.data.code == 1) {
            //            console.log(res.data.data.token)
            this.getLogoMsg = res.data.data;
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            this.$message({ message: res.data.msg });
          }
        });
    },
    uploading(param, config, pathName) {
      this.xhr.post("http://up-z2.qiniu.com", param, config).then(response => {
        this.organLogo = response.data.key;
        this.imageKeyList.push(this.organLogo);
        this.imageUrlList.push(this.imageUrl + "/" + response.data.key);
        this.showLogo = true;
      });
    },
    itemClickHandler() {},
    addFast() {},
    sureToRepair() {
      // 租户不需要选择
      if (this.userInfo.organType == 1) {
        this.rentUserId = this.userInfo.guid;
      }
      var accessorys = this.imageKeyList.join(",");
      var data = {
        token: this.getkey,
        userId: this.rentUserId,
        typeId: this.typeGuid,
        location: this.location,
        remark: this.whyToRepair,
        accessorys: accessorys,
        descripTion: this.descripTion
      };

      if (!this.typeGuid) {
        return this.$message({ message: "请选择报修类型" });
      } else if (!data.remark) {
        return this.$message({ message: "请输入详情描述" });
      } else if (this.rentUserId == "") {
        return this.$message({ message: "请选择租户" });
      } else if (accessorys == "") {
        // return this.$message({ message: "请上传附件" });
        // return;
      }
      if (this.checkbox1) {
        data.level = 2;
      } else {
        data.level = 1;
      }
      if (this.typeGuid && this.typeGuid != "") {
        this.xhr
          .post(
            `${this.subUrl.activity}/repairs/subRepairsBill?` +
              qs.stringify(data)
          )
          .then(res => {
            if (res.data.code == 1) {
              // this.$router.push('/estate/order_submit')
              this.$router.go(-1);
            } else if (res.data.code == "-902") {
              //-902
              /*重新登录*/
              fn.re_login(this);
            } else {
              this.$message({ message: res.data.msg });
            }
          });
      }
    },
    getJobInfo(cb) {
      var data = {
        organId: this.organInfo.guid,
        token: this.getkey,
        pageNo: 1,
        pageSeze: 15
      };
      this.xhr
        .post(
          `${this.subUrl.user}/admin/postManage/postList?token=` +
            data.token +
            "&organId=" +
            data.organId
        )
        .then(res => {
          if (res.data.code == 1) {
            cb && cb();
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            this.$message({ message: res.data.msg });
          }
        });
    },
    clearLoacl() {
      this.alertS = true;
    },
    quit() {
      this.alertS = false;
    },
    getUserInfo(cb) {
      var data = { userId: this.userId, token: this.getkey };
      this.xhr
        .post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data))
        .then(res => {
          if (res.data.code == 1) {
            this.userInfo = res.data.data.userInfo;
            this.organInfo = res.data.data.organInfo;
            cb && cb();
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$message({ message: res.data.msg });
          }
        });
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    this.userId = this.userInfo.guid;
    this.getkey = fn.getIng();
    this.userId = this.userInfo.guid;
    this.getQiniuMsg();
    this.getDong(this.userInfo.buildingId);
    var that = this;
    this.getUserInfo(function() {
      that.getJobInfo();
    });
  }
};
</script>
<style scoped>
.top-select-type {
  width: 100%;
  padding-left: 1.5em;
  padding-right: 1.5em;
  background: #ffffff;
  line-height: 3.5em;
}
.top-select-type div {
  display: inline-block;
  width: 75%;
  padding: 0 1em;
  border-radius: 0.4em;
  background: #fff;
  border: 1px solid #e6e6e6;
  color: #999999;
  position: relative;
}

.top-select-type img {
  position: absolute;
  right: 0.6em;
  top: 0.7em;
  width: 1.5em;
  height: auto;
}

.layout_my {
  /*background: #f7f7f9;*/
}

.layout_my .header:after {
  display: none;
}

.text-more {
  width: 100%;
  padding: 0.6em;
  background: #fafefd;
  border-radius: 5px;
  margin-top: 6%;
}

.text-more textarea {
  width: 100%;
  border: 1px solid #e6e6e6;
  background: #ffffff;
  border-radius: 5px;
  height: 10em;
  padding: 0.5em;
}

.logo-img-div {
  width: 2rem;
  height: 2rem;
  margin: 1%;
  border-radius: 0.1rem;
  /* border: 1px solid #e6e6e6; */
  /* min-height: 7em; */
  padding: 0.5em;
  margin-top: 0.5em;
  position: relative;
  background: #fafefd;
  display: inline-block;
}

.logo-img-div img {
  width: 100%;
  height: 100%;
  margin: 0;
}

.hid-input {
  opacity: 0;
  position: absolute;
  width: 5em;
  height: 5em;
}

.add-logo-img {
  width: 1.5rem !important;
  height: 1.5rem !important;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.show-send-pic {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

.clear-input {
  width: 75%;
  border-radius: 3px;
  border: 1px solid #e6e6e6;
  background: #ffffff;
  line-height: 1.8em;
  padding: 0.3em 0.5em;
}
.clear-input {
  color: #000;
}
.del-this-pic {
  position: absolute;
  color: #22ac38;
  top: -8px !important;
  right: -6px !important;
  font-size: 18px !important;
}
</style>
