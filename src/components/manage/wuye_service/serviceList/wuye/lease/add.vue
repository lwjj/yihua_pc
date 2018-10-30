<template>
<div class="newRightContent" style="overflow:auto">
  <div class="border bgwhite">
    <yd-layout class="yd-layout" v-if="showBuilding && showUser" style="width:750px;">
      <!-- <yd-navbar slot="navbar" title="租赁问询" height=".88rem" color="#fff" :bgcolor="mainColor">
        <div class="addClickArea" slot="left" @click="$router.go(-1)">
          <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
        </div>
        <div class="addRightClickArea" style="color:#fff" @click="mSubmit" slot="right">提交</div>
      </yd-navbar> -->
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
           <el-breadcrumb-item to='/manage/wuye_service'>物业服务单</el-breadcrumb-item>
           <el-breadcrumb-item @click.native="$back">租赁</el-breadcrumb-item>
           <el-breadcrumb-item>新增</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
     <div class="relative">
      <div class="bgwhite usuallyBox bb" style="padding:.1rem 0rem .3rem;">
        <div class="list_item" @click="showBuilding = false">
          <div class="label">写字楼</div>
          <input type="text" class="flex1" readonly  placeholder="请选择" maxlength="30" v-model="buildingName">
        </div>

        <div v-if="userInfo.organType == 3">
          <div class="list_item">
          <div class="label">选择单元</div>
          <el-select class="mr1" 
            style="border-radius:.1rem; flex:1;height:.65rem"
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
              class="" 
              style="border-radius:.1rem;flex:1; height:.65rem"
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
        <div class="list_item label">
          <div class="label">选择用户</div>
          <input type="text" class="flex1" style="height:.68rem" v-model="rentUserName" @click="chooseUser"
                 placeholder="选择用户" readonly>
        </div>
        </div>

        <div class="list_item">
          <div class="label">面积需求</div>
          <input type="number" class="flex1" onkeyup='value = this.value.substr(0,5)' placeholder="请输入面积/单位：平米" maxlength="5" v-model="area">
        </div>
        <div class="list_item">
          <div class="label">何时入驻</div>
           <el-date-picker
             style="flex:1"
              v-model="settledTime"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            :clearable="false"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
           <!-- <yd-datetime type="date"  class="flex1" v-model="settledTime" slot="right"></yd-datetime> -->
          <!-- <input type="text" class="flex1" placeholder="" maxlength="30" v-model="settledTime"> -->
        </div>
        <div class="list_item">
          <div class="label">主要用途</div>
          <input type="text" class="flex1" placeholder="" maxlength="30" v-model="muse">
        </div>
      </div>
      <div class="bgwhite usuallyBox bb mt3 bt" style="padding:.1rem 0rem .3rem;">
        <div class="list_item"><span class="label">其它备注</span></div>
        <div style="padding:0 .5rem;">
          <yd-textarea class="border"  v-model="remark" maxlength="300" style="padding:20px 10px;"></yd-textarea>
        </div>
        <div class="list_item flex-start mt2"> 
          <el-button style="margin-left:30px;" @click="mSubmit" type="primary">提交</el-button>
        </div>
      </div>
     </div>
      
    </yd-layout>
    <chooseBuilding v-show="!showBuilding" @receive="setBuilding"></chooseBuilding>
    <departMent v-if='!showUser' :organId="unit.organId" @setUserId='setUserId'></departMent>
    <vue-pickers v-show="showDong" slot="bottom" class="slideBox" :selectData="pickData1" v-on:cancel="close" v-on:confirm="confirmFn"></vue-pickers>
    <vue-pickers v-show="showUnit" slot="bottom" class="slideBox" :selectData="pickData2" v-on:cancel="close" v-on:confirm="confirmFn1"></vue-pickers>
  </div>
</div>
  
</template>

<script>
import Vue from "vue";
import chooseBuilding from "../../lease/building";
import VuePickers from "vue-pickers";
import departMent from "../renovation/department_manager";
import { DateTime } from "vue-ydui/dist/lib.rem/datetime";
import "@/assets/css/wuye.css";
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
import { TextArea } from "vue-ydui/dist/lib.rem/textarea";
/* 使用px：import {TextArea} from 'vue-ydui/dist/lib.px/textarea'; */

Vue.component(TextArea.name, TextArea);
/* 使用px：import {DateTime} from 'vue-ydui/dist/lib.px/datetime'; */

Vue.component(DateTime.name, DateTime);
import qs from "qs";
export default {
  components: {
    chooseBuilding,
    VuePickers,
    departMent
  },
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    this.buildingId = this.userInfo.buildingId;
    this.buildingName = this.userInfo.buildingName;
    console.log(this.userInfo.buildingId, this.userInfo.buildingName);
    return {
      showBuilding: true,
      // buildingName: "",
      // buildingId: "",
      area: "",
      muse: "",
      settledTime: this.$today(),
      remark: "",
      showUser: true,
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
      showDong: false,
      showUnit: false,
      dong: {},
      unit: {},
      rentUserName: "",
      rentUserId: "",
      value: "",
      value1: "",
      options: [],
      options1: []
    };
  },
  methods: {
    setBuilding(e) {
      this.showBuilding = true;
      if (e) {
        console.log(JSON.stringify(e));
        this.buildingId = e.guid;
        this.buildingName = e.buildingName;
      }
    },
    mSubmit() {
      if (this.userInfo.organType == 1) {
        this.rentUserId = this.userInfo.guid;
        // this.buildingId = this.userInfo.buildingId;
      }
      console.log(this.remark, "111s");
      if (this.buildingId == "") {
        return this.$dialog.toast({ mes: "请选择写字楼", timeout: 800 });
      } else if (this.rentUserId == "") {
        return this.$dialog.toast({ mes: "请选择用户", timeout: 800 });
      } else if (this.area == "") {
        return this.$dialog.toast({ mes: "请输入面积需求", timeout: 800 });
      } else if (this.muse == "") {
        return this.$dialog.toast({ mes: "请输入主要用途", timeout: 800 });
      } else if (this.remark == "") {
        return this.$dialog.toast({ mes: "请输入其它备注", timeout: 800 });
      }
      let data = {
        token: this.$getkey(),
        userId: this.rentUserId,
        buildingId: this.buildingId,
        muse: this.muse,
        area: this.area,
        settledTime: this.settledTime + " 00:00:00",
        remark: this.remark
      };
      this.$ajax(
        `${this.subUrl.activity}/lease/leaseAsk`,
        data,
        res => {
          this.$dialog.toast({
            mes: "提交成功",
            icon: "success",
            timeout: 800
          });
          this.$router.go(-1);
        },
        this
      );
    },
    setUserId(e) {
      console.log(111);
      this.showUser = true;
      if (e) {
        this.rentUserId = e.userId;
        this.rentUserName = e.userName;
      }
    },
    setAssignId(e) {
      this.showAssign = true;
      console.log(this.showAssign);
      if (e) {
        this.assignId = e.userId;
        this.assignName = e.userName;
      }
    },
    chooseUser() {
      console.log(this.unit.organId, this.unit, this.unit.organId == "");
      if (!this.unit.organId) {
        return this.$dialog.toast({ mes: "请选择单元号" });
      } else {
        if (!this.depNum) {
          return this.$message({ message: "该单元暂无用户", type: "error" });
        }
        this.showUser = false;
      }
      this.rentOrganId = this.unit.organId;
    },
    chooseAssign() {
      console.log(111);
      this.showAssign = false;
    },
    close() {
      this.showDong = false;
      this.showUnit = false;
    },
    confirmFn(e) {
      this.dong = e.select1;
      console.log(JSON.stringify(e.select1));
      this.showDong = false;
      this.unit = {};
      this.getUnit(this.dong.guid);
    },
    confirmFn1(e) {
      this.unit = e.select1;
      console.log(this.unit.guid);
      console.log(e.select1);
      this.rentUserId = "";
      this.rentUser = "";
      this.showUnit = false;
    },
    setUnit(index) {
      let e = {
        select1: this.options1[index]
      };
      this.unit = e.select1;
      this.$getDepNum(this.unit.organId, res => {}, this);
      this.rentUserId = "";
      this.rentUser = "";
      this.showUnit = false;
    },
    chooseDong() {
      if (this.pickData1.pData1.length == 0) {
        return this.$dialog.toast({ mes: "数据为空", timeout: 1000 });
      } else {
        this.showDong = true;
        console.log(this.showDong);
      }
    },
    chooseUnit() {
      if (this.pickData2.pData1.length == 0) {
        return this.$dialog.toast({ mes: "数据为空", timeout: 1000 });
      } else {
        this.showUnit = true;
      }
    },
    getDong(id) {
      console.log(this.userInfo);
      console.log(id);
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
              mes: res.data.msg
            });
            this.pickData2.pData1 = [];
            this.pickData3.pData1 = [];
          }
        });
    },
    getUnit(id) {
      this.dong = this.options[id];
      id = this.dong.guid;
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
          } else {
            this.$dialog.alert({
              mes: res.data.msg
            });
          }
        });
    }
  },
  mounted() {
    this.getDong(this.userInfo.buildingId);
  }
};
</script>

<style scoped>
.usuallyBox .list_item .flex1 {
  color: #333;
}
</style>
