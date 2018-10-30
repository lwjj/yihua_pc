<template>
<div class="newRightContent" style="overflow:auto">
  <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
            <el-breadcrumb-item @click.native='$back'>入驻单</el-breadcrumb-item>
            <el-breadcrumb-item>新增入驻</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="border bgwhite">
          <div class="yd-layout" style="width:750px;"> 
            <div class="usuallyBox" style="padding:.5rem 0 1px;">
              <div class="list_item">
                <span class="label">管理处</span> 
                <el-select class="flex1" 
                  style="border-radius:.1rem;border:0; height:.65rem;padding:0"
                  @change="getDong"
                  v-model="value" placeholder="请选择大厦">
                  <el-option
                    v-for="(item,index) in options"
                    :key="index"
                    :label="item.text"
                    :value="index">
                  </el-option>
                </el-select> 
                <!-- <input class="flex1" type="text" placeholder="请选择大厦" @click="chooseBuilding" v-model="building.text" readonly> -->
              </div>
              <div class="list_item">
                <span class="label">栋</span>
                <el-select class="flex1" 
                  style="border-radius:.1rem; border:0;height:.65rem;padding:0"
                  @change="getUnit"
                  v-model="value1" placeholder="请选择栋">
                  <el-option
                    v-for="(item,index) in options1"
                    :key="index"
                    :label="item.text"
                    :value="index">
                  </el-option>
                </el-select> 
                <!-- <input class="flex1" type="text" placeholder="请选择栋" @click="chooseDong" v-model="dong.text" readonly> -->
              </div>
              <div class="list_item">
                <span class="label">单元号</span>
                <el-select class="flex1" 
                  style="border-radius:.1rem;border:0; height:.65rem;padding:0"
                  @change="setUnit"
                  v-model="value2" placeholder="请选择单元号">
                  <el-option
                    v-for="(item,index) in options2"
                    :key="index"
                    :label="item.text"
                    :value="index">
                  </el-option>
                </el-select> 
                <!-- <input class="flex1" type="text" placeholder="请选择单元号"  @click="chooseUnit" v-model="unit.text" readonly> -->
              </div>
              <div class="list_item">
                <span class="label">联系人</span>
                <input class="flex1" type="text" maxlength="50" v-model="params.contactName" placeholder="请输入联系人">
              </div>
              <div class="list_item">
                <span class="label">联系电话</span>
                <input class="flex1" type="number" oninput="value = this.value.slice(0,11)"  v-model="params.contactPhone" onkeyup="value = this.value.slice(0,11)" placeholder="请输入手机号">
              </div>
              <div class="list_item">
                <span class="label">联系地址</span>
                <input class="flex1" type="text" maxlength="50"  v-model="params.contactAddress" placeholder="请输入联系地址">
              </div>
              <div class="h8 flex-row-nowarp jusCenter font32 foCoF" @click="submitOrder" style="margin: 1rem auto 1rem;width: 5.6rem;border-radius: .1rem" :style="{background:mainColor}">确定</div>
            </div>
            <vue-pickers v-show="show1" slot="bottom" class="slideBox" :selectData="pickData1" v-on:cancel="close" v-on:confirm="confirmFn"></vue-pickers>
            <vue-pickers v-show="show2" slot="bottom" class="slideBox" :selectData="pickData2" v-on:cancel="close" v-on:confirm="confirmFn1"></vue-pickers>
            <vue-pickers v-show="show3" slot="bottom" class="slideBox" :selectData="pickData3" v-on:cancel="close" v-on:confirm="confirmFn2"></vue-pickers>
          </div>
        </div>
      </div>
 
</template>
<script>
import Vue from "vue";
import qs from "qs";
// import VuePickers from "vue-pickers";
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
    // VuePickers
  },
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    return {
      value: "",
      value1: "",
      value2: "",
      options: [],
      options1: [],
      options2: [],
      params: {},
      building: {},
      unit: {},
      dong: {},
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
      pickData3: {
        columns: 1,
        isChange: false,
        pData1: []
      },
      show1: false,
      show2: false,
      show3: false
    };
  },
  methods: {
    submitOrder() {
      if (!this.building.text) return this.$dialog.toast({ mes: "请选择大厦" });
      if (!this.dong.text) return this.$dialog.toast({ mes: "请选择栋" });
      if (!this.unit.text) return this.$dialog.toast({ mes: "请选择单元" });
      if (!this.params.contactName)
        return this.$dialog.toast({ mes: "请输入联系人" });
      if (!this.params.contactPhone)
        return this.$dialog.toast({ mes: "请输入手机号" });
      if (!/^1[356789]\d{9}$/.test(this.params.contactPhone))
        return this.$dialog.toast({ mes: "手机号格式错误" });
      if (!this.params.contactAddress)
        return this.$dialog.toast({ mes: "请输入联系人地址" });
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        buildingId: this.building.guid,
        unitId: this.unit.guid //单元号Id
      };
      data = Object.assign({}, data, this.params);
      this.$ajax(
        `${this.subUrl.activity}/caa/lesseeAddSettled`,
        data,
        res => {
          return this.$dialog.toast({
            mes: "申请入驻单成功",
            icon: "success",
            callback: () => {
              this.$router.go(-1);
            }
          });
        },
        this
      );
    },
    //确认选择
    confirmFn(e) {
      this.show1 = false;
      this.dong = {};
      this.unit = {};
      this.building = e.select1;
      this.getDong(e.select1.guid);
    },
    confirmFn1(e) {
      this.show2 = false;
      this.unit = {};
      this.dong = e.select1;
      this.getUnit(e.select1.guid);
    },
    confirmFn2(e) {
      this.show3 = false;
      this.unit = e.select1;
    },
    setUnit(e) {
      this.unit = this.options2[e];
    },
    //选择大厦
    chooseBuilding() {
      if (this.pickData1.pData1.length == 0)
        return this.$dialog.toast({
          mes: "暂无数据",
          timeout: 400
        });
      this.show1 = true;
    },
    /*关闭弹窗*/
    close() {
      this.show1 = false;
      this.show2 = false;
      this.show3 = false;
    },
    //选择栋
    chooseDong() {
      if (this.pickData2.pData1.length == 0)
        return this.$dialog.toast({
          mes: "暂无数据",
          timeout: 400
        });
      this.show2 = true;
    },
    //选择单元
    chooseUnit() {
      if (this.pickData3.pData1.length == 0)
        return this.$dialog.toast({
          mes: "暂无数据",
          timeout: 400
        });
      this.show3 = true;
    },
    //获取大厦
    getBuilding() {
      this.$ajax(
        `${this.subUrl.user}/comm/officeBuildingList`,
        {},
        res => {
          console.log(res.data.data);
          let l = res.data.length;
          let arr = [];
          for (let i = 0; i < l; i++) {
            let obj = res.data[i];
            obj.text = obj.buildingName;
            obj.value = obj.buildingAddress;
            arr.push(obj);
          }
          this.pickData1.pData1 = arr;
          this.options = arr;
        },
        this
      );
    },
    //获取栋
    getDong(id) {
      let obj = this.options[id];
      this.building = obj;
      id = obj.guid;
      this.$ajax(
        `${this.subUrl.user}/comm/getBuildingRid`,
        { buildingId: id },
        res => {
          console.log(res.data.data);
          let l = res.data.length;
          let arr = [];
          for (let i = 0; i < l; i++) {
            let obj = res.data[i];
            obj.value = res.data[i].guid;
            obj.text = res.data[i].ridName;
            arr.push(obj);
          }
          this.pickData2.pData1 = arr;
          this.options1 = arr;
        },
        this
      );
    },
    getUnit(id) {
      this.dong = this.options1[id];
      id = this.dong.guid;
      this.$ajax(
        `${this.subUrl.user}/comm/getBuildingUnit`,
        { ridId: id },
        res => {
          console.log(res.data.data);
          let l = res.data.length;
          let arr = [];
          for (let i = 0; i < l; i++) {
            let obj = res.data[i];
            obj.value = res.data[i].ridId;
            obj.text = res.data[i].unitName;
            arr.push(obj);
          }
          this.pickData3.pData1 = arr;
          this.options2 = arr;
        },
        this
      );
    }
  },
  mounted() {
    this.getBuilding();
    this.$set(this.params,'contactPhone',this.userInfo.account)
    this.$set(this.params,'contactName',this.userInfo.name)
  }
};
</script>

<style scoped>
.list_item {
  height: 0.9rem;
}
.usuallyBox {
  background: #fff;
}

.usuallyBox .list_item {
  height: 0.8rem;
  display: flex;
  flex-flow: row nowrap;
  position: relative;
  justify-content: space-between;
  align-items: center;
  padding-right: 0.3rem;
}

.yd-tab-box .yd-tab-panel {
  position: absolute;
  top: 0.84rem;
  bottom: 0;
  left: 0;
  right: 0;
}

.usuallyBox .list_item .label {
  text-align: right;
  width: 1.8rem;
  max-width: 2rem;
  margin-right: 0.2rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: #666;
}

.usuallyBox .list_item .flex1 {
  height: 0.65rem;
  /* border: 1px solid #ddd; */
  padding: 0 0.1rem;
  color: #999;
  -webkit-border-radius: 0.1rem;
  -moz-border-radius: 0.1rem;
  border-radius: 0.1rem;
}
</style>
