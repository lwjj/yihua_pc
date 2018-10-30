<template>
<div class="newRightContent" style="overflow:auto">
<div class="border bgwhite">
<yd-layout class="layout_my yd-layout" style="width:750px;" v-show="!showRent && !showOrgan">
    <div class="title">
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
            <el-breadcrumb-item @click.native="back">退租单</el-breadcrumb-item>
            <el-breadcrumb-item>新建退租单</el-breadcrumb-item>

        </el-breadcrumb>
    </div> 
    <div class="declares">
        <ul class="bgwhite">
          <div>
            <div v-if="userInfo.organType == 1">
              <li><p>租用单元</p><i>{{userInfo.ridName}}{{userInfo.unitName}}</i></li>
              <li><p>租户名称</p><i>{{userInfo.organName}}</i></li>
            </div>
            <div v-else>
              <li><p>选择栋:</p>
              <span style="border:0">
                <!-- <input type="text"  @click='chooseDong' readonly placeholder="选择栋"  maxlength="40" v-model="dong.text"> -->
                <el-select class=" flex1" 
                  style="border-radius:.1rem; height:.65rem;"
                    @change="getUnit"
                      v-model="value" placeholder="请选择栋">
                      <el-option
                        v-for="(item,index) in options"
                        :key="index"
                        :label="item.text"
                        :value="index">
                      </el-option>
                  </el-select>
                </span>
            </li>
            <li>
              <p>选择单元:</p>
              <span style="border:0">
                <!-- <input type="text"  @click='chooseUnit' readonly placeholder="选择单元"  maxlength="40" v-model="unit.text"> -->
                <el-select class=" flex1" 
                  style="border-radius:.1rem; height:.65rem;"
                    @change="setUnit"
                      v-model="value1" placeholder="请选择栋">
                      <el-option
                        v-for="(item,index) in options1"
                        :key="index"
                        :label="item.text"
                        :value="index">
                      </el-option>
                  </el-select>
                </span>
            </li>
            <!-- <li><p>选择用户:</p><span><input type="text"  @click='chooseRent' readonly placeholder="选择用户"  maxlength="40" v-model="rentUserName"></span></li> -->
            </div>
          </div> 
           <li v-if="info.startTime"><p>起止时间:</p><i style='line-height:40px;height:40px;'>{{info.startTime.replace(/-/g,'/').split(' ')[0]}}-{{info.endtime.replace(/-/g,'/').split(' ')[0]}}</i></li>
            <li><p style="height:.7rem;">迁出原因</p><span><input type="text" maxlength="40" v-model="bm.cause"></span></li>
            <li><p style="height:.7rem;">迁出时间</p>
            <span style="display:flex;justify-content:center;align-items:center;border:0">
               <el-date-picker
                  class="flex1"
                  v-model="bm.applyLeaveTime"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
            </span></li>
            <div v-if="userInfo.organType == 3">
              <li>
                <p style="height:.7rem;">客服意见</p>
                <el-input class="flex1" v-model="bm.csOpinion"></el-input>
              </li>
               <li>
                <p style="height:.7rem;">业主意见</p>
                <el-input class="flex1" v-model="bm.ownerOpinion"></el-input>
              </li>
               <li>
                <p style="height:.7rem;">物业意见</p>
                <el-input class="flex1" v-model="bm.proOpinion"></el-input>
              </li>
              <!-- <li v-if="userInfo.organType == 3">
                <p style="height:.7rem">经理审批</p>
                <el-input class="flex1" @focus="showOrgan=true" v-model="managerUserName" @click="showOrgan=true;alert(1)" placeholder="请选择审批经理"></el-input>
              </li> -->
            </div>
        </ul>
        <div v-if="info.ownerInfo" class="bgwhite">
            <p>业主信息</p>
            <ol>
            <li><p>业主</p><i>{{info.ownerInfo.name}}</i></li>
            <li><p>手机号</p><i>{{info.ownerInfo.account}}</i></li>
            </ol>
        </div>
    </div>
    <div class="pdlr2 mt2 mb2 bgwhite">
      <span style="display:inline-block;width:90px;"></span>
      <el-button type="primary" @click="addSurrender">提交</el-button>
    </div>
     <vue-pickers v-show="show1" slot="bottom" class="slideBox" :selectData="pickData1" v-on:cancel="close" v-on:confirm="confirmFn"></vue-pickers>
    <vue-pickers v-show="show2" slot="bottom" class="slideBox" :selectData="pickData2" v-on:cancel="close" v-on:confirm="confirmFn1"></vue-pickers>
  </yd-layout>
  <departMent v-if='showRent' @setUserId='setUserId' :organId='organId'></departMent>
  <departMent v-if='showOrgan' @setUserId='setManageId' :organId='organInfo.guid'></departMent> 
</div>
</div>

  
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";
import { DateTime } from "vue-ydui/dist/lib.rem/datetime";
import store from "@/store";
Vue.component(DateTime.name, DateTime);
import VuePickers from "vue-pickers";
import departMent from "../renovation/department_manager";
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
    VuePickers,
    departMent
  },
  data() {
    return {
      managerUserId: "",
      managerUserName: "",
      info: {},
      showOrgan: false,
      mainColor: "",
      rentUserName: "",
      userInfo: {},
      organInfo: {},
      disabled: false,
      title: "",
      contentList: [],
      organId: "",
      show: false,
      showRent: false,
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
      bm: {
        token: "",
        userId: "",
        surrenderOrganId: "",
        unitId: "",
        cause: "",
        applyLeaveTime: this.$today()
      },
      dong: {},
      unit: {},
      value: "",
      value1: "",
      options: [],
      options1: []
    };
  },
  methods: {
    setUserId(e) {
      this.showRent = false;
      if (e) {
        console.log(e);
        this.rentUserName = e.userName;
        this.rentUserId = e.userId;
        this.getSettleInfo();
      }
    },
    chooseRent() {
      if (!this.organId) return this.$dialog.toast({ mes: "请选择单元号" });
      this.showRent = true;
    },
    chooseDong() {
      if (this.pickData1.pData1.length == 0) {
        return this.$dialog.toast({ mes: "数据为空", timeout: 1000 });
      } else {
        console.log(111);
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
    setManageId(e) {
      if (e) {
        this.managerUserId = e.userId;
        this.managerUserName = e.userName;
      }
      this.showOrgan = false;
    },
    getDong(id) {
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
      this.dong = this.options[id];
      id = this.dong.guid;
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
      console.log(e.select1);
      this.roomNumber = e.select1.guid;
      this.organId = e.select1.organId;
      this.show2 = false;
    },
    setUnit(e) {
      let obj = this.options1[e];
      this.unit = obj;
      this.roomNumber = obj.guid;
      this.organId = obj.organId;
      if (obj.clientInfo) {
        this.rentUserId = obj.clientInfo.userId;
        this.getSettleInfo();
      } else {
        return this.$message.error("暂无入驻信息，请选择其它单元");
      }
    },
    close: function() {
      this.show1 = false;
      this.show2 = false;
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      history.back();
    },
    addSurrender() {
      let data = {
        token: this.bm.token,
        cause: this.bm.cause,
        applyLeaveTime: this.bm.applyLeaveTime + " 00:00:00",
        endtime: this.info.endtime,
        startTime: this.info.startTime
      };
      // 租户
      if (this.userInfo.organType == 1) {
        data.userId = this.userInfo.guid;
        data.surrenderOrganId = this.organInfo.guid;
      } else {
        data.userId = this.rentUserId;
        data.surrenderOrganId = this.organId;
        if (!this.rentUserId) {
          return this.$dialog.toast({ mes: "请选择租户" });
        }
        if (!this.bm.csOpinion) {
          return this.$dialog.toast({ mes: "请输入客服部意见" });
        }
        if (!this.bm.proOpinion) {
          return this.$dialog.toast({ mes: "请输入物业意见" });
        }
        if (!this.bm.ownerOpinion) {
          return this.$dialog.toast({ mes: "请输入业主意见" });
        }
        // if (!this.managerUserId)
        //   return this.$dialog.toast({ mes: "请选择审批经理" });
        data.csOpinion = this.bm.csOpinion;
        data.proOpinion = this.bm.csOpinion;
        data.ownerOpinion = this.bm.ownerOpinion;
        // data.managerUserId = this.managerUserId;
      }
      if (this.bm.cause == "") {
        return this.$dialog.toast({ mes: "请输入迁出原因" });
      }
      // 管理处的操作会直接退租需做提示
      if (this.userInfo.organType == 3) {
        this.$confirm("该操作会直接将租户进行退租，是否确定要退租", {
          type: "warning"
        }).then(() => {
          this.xhr
            .post(
              `${this.subUrl.activity}/surrender/addSurrender`,
              qs.stringify(data)
            )
            .then(res => {
              if (res.data.code == 1) {
                this.$dialog.toast({ mes: "退租成功", icon: "success" });
                this.$router.go(-1);
              } else if (res.data.code == "-902") {
                //-902
                /*重新登录*/
                fn.re_login(this);
              } else {
                this.$dialog.toast({ mes: res.data.msg });
              }
            });
        });
      } else {
        this.xhr
          .post(
            `${this.subUrl.activity}/surrender/addSurrender`,
            qs.stringify(data)
          )
          .then(res => {
            if (res.data.code == 1) {
              this.$dialog.toast({ mes: "申请成功", icon: "success" });
              this.$router.go(-1);
            } else if (res.data.code == "-902") {
              //-902
              /*重新登录*/
              fn.re_login(this);
            } else {
              this.$dialog.toast({ mes: res.data.msg });
            }
          });
      }
    },
    getSettleInfo() {
      let data = {
        token: this.$getkey(),
        userId: this.rentUserId
      };
      this.$ajax(
        `${this.subUrl.activity}/surrender/surrenderInfo`,
        data,
        res => {
          console.log(this.info);
          this.info = res.data;
        },
        this
      );
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
    this.bm.userId = this.userInfo.guid;
    this.bm.surrenderOrganId = this.organInfo.guid;
    this.bm.unitId = this.userInfo.unitId;
    this.bm.token = fn.getIng();
    console.log(this.organInfo, this.userInfo);
    if (this.userInfo.organType == 1) {
      this.disabled = true;
      this.value = this.userInfo.ridName;
      this.value1 = this.userInfo.unitName;
      this.rentUserId = this.userInfo.guid;
      this.getSettleInfo();
    } else {
      this.getDong(this.userInfo.buildingId);
    }
  }
};
</script>
<style scoped>
.layout_my .header:after {
  display: none;
}

.layout_my .blue_box {
  height: 0.88rem;
  background: #0093d2;
  background-size: 100% 100%;
}

.declares {
  width: 100%;
}
.declares ul {
  width: 100%;
  padding: 0.2rem 0.4rem;
  border-bottom: 1px solid #d9d9d9;
}
.declares ul li {
  display: flex;
  flex-flow: row;
  justify-content: center;
  margin: 0.2rem 0;
}
.declares ul li > p {
  width: 1.6rem;
  display: flex;
  justify-content: center;
  line-height: 40px;
  align-items: center;
  font-size: 14px;
  color: #777;
}
.declares ul li > span {
  flex: 1;
  height: 0.7rem;
  border: 1px solid #d9d9d9;
  border-radius: 0.05rem;
}
.declares ul li > i {
  flex: 1;
  height: 0.5rem;
  display: flex;
  align-items: center;
}
.declares ul li > span > input {
  width: 100%;
  height: 100%;
  border: none;
  margin-left: 0.1rem;
}
.declares > div {
  margin-top: 0.2rem;
  border-top: 1px solid #d9d9d9;
}
.declares > div > p {
  padding: 0.2rem 0.3rem;
  border-bottom: 1px solid #d9d9d9;
}
.declares > div ol {
  width: 100%;
  padding: 0.1rem 0;
  border-bottom: 1px solid #d9d9d9;
}
.declares > div ol li {
  display: flex;
  flex-flow: row;
  justify-content: center;
  margin: 0.2rem 0;
}
.declares > div ol li > p {
  width: 1.6rem;
  display: flex;
  justify-content: center;
  height: 0.5rem;
  align-items: center;
  font-size: 0.3rem;
  color: #777;
}
.declares > div ol li > i {
  flex: 1;
  height: 0.5rem;
  display: flex;
  align-items: center;
}
.declares > div ol li > span > input {
  width: 100%;
  height: 100%;
  border: none;
  margin-left: 0.1rem;
}
</style>
