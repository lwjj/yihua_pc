<template>
<div class="newRightContent" style="overflow:auto">
 <div class="border bgwhite">
    <div class="yd-layout" style="width:750px" v-show='!showUser && !showHangye'>
      <!-- <yd-navbar height='.88rem' :bgcolor='mainColor' color='#fff' slot='navbar' title="办理入驻">
        <yd-navbar-back-icon slot="left" @click.native='$router.go(-1)' color="#fff"></yd-navbar-back-icon>
      </yd-navbar> -->
      <div class="title">
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
            <el-breadcrumb-item  @click.native='$back'>入驻单</el-breadcrumb-item>
            <el-breadcrumb-item>新建入驻单</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="flex-box">
        <div class="flex-row h7">
          <span class="label font30">企业名称</span>
          <el-autocomplete
              class="flex1 font28 foCo6"
              v-model="value2" 
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              @select="handleSelect"
            >
          </el-autocomplete>
        </div>
        <!--  -->
        <div class="flex-row h7">
          <span class="label font30">所在行业</span>
          <input type="text" class="flex1 font28 foCo6 pdlr1" @click="chooseHangye" placeholder="请选择行业" readonly v-model='currentCompany.industry'>
        </div>
        <!--  -->
        <div class="flex-row-nowarp h7">
          <span class="label font30">租用单元</span>
           <el-select class=" flex1 mr1" 
            style="border-radius:.1rem; height:.65rem"
              @change="getUnit"
                v-model='value1' placeholder="请选择栋">
                <el-option
                  v-for="(item,index) in options"
                  :key="index"
                  :label="item.text"
                  :value="index">
                </el-option>
              </el-select>
               <el-select 
               v-model='value3' 
              class="flex1" 
              style="border-radius:.1rem; height:.65rem"
              @change="setUnit" 
              placeholder="请选择单元">
                <el-option
                  v-for="(item,index) in options1"  
                  :key="index"
                  :label="item.text"
                  :value="index">
                </el-option>
              </el-select>
          <!-- <input type="text" class="flex1 font28 foCo6 pdlr1 mr1" @click="chooseDong" placeholder="选择栋" readonly
                 v-model='currentCompany.ridName'>
          <input type="text" class="flex1 font28 foCo6 pdlr1" @click="chooseUnit" placeholder="选择单元" readonly
                 v-model='currentCompany.unitName'> -->
        </div>
        <!--  -->
        <div class="flex-row h7">
          <span class="label font30">合同编号</span>
          <input type="text" class="flex1 font28 foCo6 pdlr1" placeholder="请输入合同编号（选填）" maxlength='100' v-model='submitData.contractNo'>
        </div>
        <!--  -->
        <div class="flex-row h7">
          <span class="label font30">开始日期</span>
          <el-date-picker
            class="flex1 font28 foCo6"
            v-model="submitData.startTime"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :clearable='false'
            type="date"
            placeholder="选择日期">
          </el-date-picker> 
        </div>
        <!--  -->
        <div class="flex-row h7">
          <span class="label font30">结束日期</span>
          <el-date-picker
            class="flex1 font28 foCo6"
            v-model="submitData.endTime"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :clearable='false'
            type="date"
            placeholder="选择日期">
          </el-date-picker> 
        </div>
        <div class="flex-row h7">
          <span class="label font30">缴费日期</span>
          <el-date-picker
            class="flex1 font28 foCo6"
            v-model="submitData.paymentDate"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :clearable='false'
            type="date"
            placeholder="选择日期">
          </el-date-picker> 
        </div>
        <!--  -->
        <div class="flex-row">
          <span class="label font30">备注信息</span>
          <textarea class="flex1 font28 foCo6 pdlr1 border" placeholder="请输入备注信息（选填）" maxlength='300' style='height:2rem;'
                    v-model="submitData.remark"></textarea> 
        </div>
      </div>
      <!-- 通信 -->
      <div class="flex-box">
        <div class="flex-row h7">
          <span class="label font30">通信地址</span>
          <input type="text" class="flex1 font28 foCo6 pdlr1" placeholder="请输入通信地址" maxlength='100' v-model='submitData.contactAddress'>
        </div>
        <div class="flex-row h7">
          <span class="label font30">联系人</span>
          <input type="text" class="flex1 font28 foCo6 pdlr1" placeholder="请输入联系人" maxlength='20' v-model='submitData.contactName'>
        </div>
        <div class="flex-row h7">
          <span class="label font30">联系电话</span>
          <input type="text" maxlength="11" class="flex1 font28 foCo6 pdlr1" placeholder="请输入联系电话" v-model='submitData.contactPhone' @change.lazy = "getStatus">
        </div>
      </div>
      <!-- <div class="flex-row bgwhite" style='padding:.1rem .2rem;height:.9rem;margin-bottom:.3rem'>
        <span class="label font30 ">抄表人</span>
        <input type="text" maxlength="20" placeholder="请选择抄表人" readonly @click="showUser = true"
               class="flex1 font28 foCo6 pdlr1" style='text-align:right' v-model='settled.userName'>
      </div> -->
      <div class="pdlr2 mt2 mb2">
        <div style="width:100px"></div>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
      <!-- <div class="flex-row h9 bgwhite jusCenter bt font32" @click="submit"
           :style='{color:mainColor,margin:"0 0 .2rem;"}'>
      </div> -->
      <vue-pickers v-show="show1" slot="bottom" class="slideBox" :selectData="pickData1" v-on:cancel="close"
                   v-on:confirm="confirmFn"></vue-pickers>
      <vue-pickers v-show="show2" slot="bottom" class="slideBox" :selectData="pickData2" v-on:cancel="close"
                   v-on:confirm="confirmFn1"></vue-pickers>
    </div>
    <departMent v-if='showUser' @setUserId='setUserId'></departMent>
    <hangye v-if="showHangye" @chooseSuccess='chooseSuccess'></hangye>
  </div>
</div>
 
</template>
<script>
import VuePickers from "vue-pickers";
import departMent from "../repair/department_manager";
import hangye from "./hangye";
import qs from "qs";
import "@/assets/css/wuye.css";
import Vue from "vue";
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
    departMent,
    hangye
  },
  data() {
    var userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    var organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    var mainColor = this.$color[userInfo.organType];
    return {
      value: "",
      value2: "",
      value1: "",
      value3: "",
      restaurants: [],
      state1: "",
      state2: "",
      showHangye: false,
      showUser: false,
      userInfo: userInfo,
      organInfo: organInfo,
      currentCompany: {},
      mainColor: mainColor,
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
      show1: false,
      show2: false,
      dong: {},
      unit: {},
      settled: {},
      submitData: {
        token: this.$getkey(),
        userId: userInfo.guid,
        startTime: this.$today(),
        endTime: this.$addDay(this.$today(), 365),
        paymentDate: this.$today(),
        contactName:'',
        contactPhone:''
        // settledOrganId:''
      },
      showFlag: {
        organShow: 0
      },

      dong: {},
      unit: {},
      list: [],
      contactPhone:"",
      settledWay:'',//入驻方式:1=扩建，2=搬迁
      submitContent:{},
      Guid:""
    };
  },
  methods: {
    open2() {
        this.$confirm('请选择搬迁或者扩建', '提示', {
          distinguishCancelAndClose:true,
          confirmButtonText: '扩建',
          cancelButtonText: '搬迁',
          type: 'warning'

        }).then(() => {
          let data = {}
          data = this.submitContent
          data.settledWay = 1
          console.log(data,"111")
          this.$ajax(
          `${this.subUrl.activity}/caa/addSettled`,
          data,

         res => {
          this.$dialog.toast({
            mes: "已办理入驻",
            timeout: 400,
            icon: "success"
          });
          this.$router.go(-1);
        },
        this
      );
        }).catch(action => {

          // this.$message({
          //     type: 'info',
          //     message: action === 'cancel'
          //       ? '放弃保存并离开页面'
          //       : '停留在当前页面'
          //   })
          if(action == 'close'){
            
          }else{
          let data = {}
          data = this.submitContent
          data.settledWay = 2 
          this.$ajax(
        `${this.subUrl.activity}/caa/addSettled`,
        data,
        res => {
          this.$dialog.toast({
            mes: "已办理入驻",
            timeout: 400,
            icon: "success"
          });
          this.$router.go(-1);
        },
        this
      );  
          }
       
        });
      },
    chooseHangye() {
      this.showHangye = true;
    },
    chooseSuccess(e) {
      if (e) {
        this.currentCompany.industry = e.require.name;
        this.currentCompany.industryId = e.require.guid;
      }
      this.showHangye = false;
    },
    setUserId(e) {
      this.showUser = false;
      if (e) {
        this.settled.userName = e.userName;
        this.submitData.principalId = e.userId;
      }
    },
    changeEmpty(e) {
      this.currentCompany = {};
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },

    handleSelect(item) {
      item = JSON.parse(JSON.stringify(item));
      this.Guid = item.guid
      this.getInfo()
      console.log(item,"item.............")
      this.currentCompany = item;
      if (this.currentCompany.account) {
        this.contractNo = this.currentCompany.account;
      } else {
        this.contractNo = "";
      }
      for (var [i, val] of this.options.entries()) {
        if (val.guid == item.ridId) {
          this.value1 = i;
        }
      }
      for (var [i, val] of this.options1.entries()) {
        if (val.guid == item.unitId) {
          this.value3 = i;
        }
      }
      console.log(this.value1, this.value1, "options1", this.options1);
      this.getUnit(this.value1);
      if (!this.currentCompany.ridId || !this.currentCompany.unitId) return;
      // this.getUnit(this.currentCompany.ridId);
    },
    submit() {
      var reg = /^1[3456789]\d{9}$/;
      var data = Object.assign({}, this.submitData);
      data.startTime = data.startTime + " 00:00:00";
      data.endtime = data.endTime + " 00:00:00";
      data.paymentDate = data.paymentDate + " 00:00:00";
      data.settledOrganId = this.currentCompany.guid;
      data.ridId = this.currentCompany.ridId;
      data.unitId = this.currentCompany.unitId;
      //   直系领导
      data.principalId = "";
      console.log(JSON.stringify(this.currentCompany));
      if (data.settledOrganId) {
        // return this.$dialog.toast({ mes: "请选择公司", timeout: 400 });
      } else {
        if (!this.value2)
          return this.$dialog.toast({ mes: "请选择公司或输入公司名" });
        if (!this.currentCompany.industryId)
          return this.$dialog.toast({ mes: "请选择行业类型" });
        if (!this.currentCompany.ridId) {
          return this.$dialog.toast({ mes: "请选择栋" });
        }
        if (!this.currentCompany.ridId)
          return this.$dialog.toast({ mes: "请选择单元号" });
      }
      console.log(this.currentCompany.industryId, "行业id");
      if (!this.currentCompany.industryId)
        return this.$dialog.toast({ mes: "请选择行业类型" });
      if (!data.ridId) {
        return this.$dialog.toast({ mes: "请选择栋", timeout: 400 });
      } else if (!data.unitId) {
        return this.$dialog.toast({ mes: "请选择单元", timeout: 400 });
      } else if (!data.contactAddress) {
        return this.$dialog.toast({ mes: "请输入联系地址", timeout: 400 });
      } else if (!data.contactName) {
        // else if (!data.contractNo) {
        //   return this.$dialog.toast({ mes: "请输入合同编号", timeout: 400 });
        // }
        return this.$dialog.toast({ mes: "请输入联系人", timeout: 400 });
      } else if (data.contactPhone == "") {
        return this.$dialog.toast({ mes: "请输入手机号", timeout: 400 });
      } else if (!reg.test(data.contactPhone)) {
        return this.$dialog.toast({ mes: "请输入正确的手机号", timeout: 400 });
      }
      // else if (!data.principalId) {
      //   return this.$dialog.toast({ mes: "请选择抄表人", timeout: 400 });
      // }
      data.remark = data.remark ? data.remark : "";
      delete data.ridId;
      if (!data.settledOrganId) {
        delete data.settledOrganId;
        data.organName = this.value2;
        data.industryType = this.currentCompany.industryId;
      }
      data.principalId = this.principalId ? this.principalId : "";
      data.contractNo = this.contractNo ? this.contractNo : "";

      this.submitContent = data

      if(this.isSettled==2){
            this.open2()
          }else{
        this.$ajax(
        `${this.subUrl.activity}/caa/addSettled`,
        data,
        res => {
          this.$dialog.toast({
            mes: "已办理入驻",
            timeout: 400,
            icon: "success"
          });
          this.$router.go(-1);
        },
        this
      );
      }
 
    },
    getStatus(){
      var data = {
        token: this.$getkey(),
        contactPhone: this.submitData.contactPhone
      };
      this.$ajax(
        `${this.subUrl.activity}/caa/queryPhoneIsSettled`,
        data,
        res => {
          this.isSettled = res.data.isSettled
        },
        this
      );
    },
    showList() {
      this.$set(this.showFlag, "organShow", 1);
    },
    chooseCompany(index) {
      this.currentCompany = this.list[index];
      this.getUnit(this.currentCompany.ridId);
      this.$set(this.showFlag, "organShow", 0);
    },
    //获取当前管理处下的入驻
    getlist() {
      
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/caa/getTenement`,
        data,
        res => {
          for (var val of res.data) {
            val.value = val.organName ? val.organName : "无";
          }
          this.list = res.data;
          this.restaurants = res.data;
        },
        this
      );
    },
    // 选择行业
    close: function() {
      this.show1 = false;
      this.show2 = false;
    },
    showEdit() {
      this.father = false;
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
              mes: res.data.msg
            });
            this.pickData2.pData1 = [];
            this.pickData3.pData1 = [];
          }
        });
    },
    // PC端已改为下标
    getUnit(id) {
      console.log(id,"321");
      if (!id && id !== 0) return;
      this.dong = this.options[id];
      // this.currentCompany.unitName = "";
      // this.currentCompany.unitId = "";
      id = this.options[id].guid;
      this.currentCompany.ridName = this.dong.text;
      this.currentCompany.ridId = this.dong.guid;
      let temporary = id
      this.xhr
        .post(
          `${this.subUrl.common}/comm/getBuildingUnit`,
          qs.stringify({
            ridId: id
          })
        )
        .then(res => {
          if (res.data.code == 1) {
            let len = res.data.data.length;
            let arr = res.data.data;
            this.pickData2.pData1 = arr;
            for (var i of arr) {
              i.text = i.unitName;
            }


            this.options1 = arr;
            console.log(res.data, "res.data123");
            this.contactPhone = this.currentCompany.tel
           // console.log(this.contactPhone,"contactPhonecontactPhonecontactPhone")
            for (var [i, val] of this.options1.entries()) {
              console.log(val.guid, this.currentCompany.unitId);
              if (val.guid == this.currentCompany.unitId) {
                this.value3 = i;
              }
            }
          } else {
            this.$dialog.alert({
              mes: res.data.msg
            });
          }
        });

    },
       getInfo(){
         this.xhr
           .post(
             `${this.subUrl.activity}/caa/getGMByOrganId`,
              qs.stringify({
               token:this.$getkey(),
               organId:this.Guid
              })
           )
           .then(res => {
             console.log(res,"99999999999999")
             this.submitData.contactPhone = res.data.data.userInfo.account
             this.submitData.contactName = res.data.data.userInfo.name
           })
       },
    confirmFn(e) {
      this.dong = e.select1;
      this.show1 = false;
      //改变当前的栋和单元号
      this.currentCompany.ridId = e.select1.guid;
      this.currentCompany.ridName = e.select1.text;
      this.currentCompany.unitId = "";
      this.currentCompany.unitName = "";
      this.getUnit(this.dong.guid);
    },
    confirmFn1(e) {
      JSON.stringify(e.select1);
      this.unit = e.select1;
      this.currentCompany.unitName = e.select1.text;
      this.currentCompany.organId = e.organId;
      this.show2 = false;
    },
    setUnit(e) {
      e = {
        select1: this.options1[e]
      };
      this.currentCompany.unitId = e.select1.guid;
      this.currentCompany.unitName = e.select1.text;
      this.currentCompany.organId = e.organId;
      if (e.organId) {
        this.$getDepNum(e.organId, res => {}, this);
      }
    }
  },
  mounted() {
    this.getlist();
    this.getDong(this.userInfo.buildingId);
  }
};
</script>
<style scoped>
.mylist {
  position: absolute;
  top: 0.8rem;
  background: #fff;
  left: 1.9rem;
  right: 0.3rem;
  border: 1px solid #ddd;
  max-height: 6rem;
  overflow: scroll;
  padding: 0.2rem;
}

.mylist > div {
  padding: 0 0.2rem;
  height: 0.6rem;
  line-height: 0.6rem;
}

.label {
  width: 1.6rem;
  text-align: right;
  padding-right: 0.2rem;
  color: #333;
}

.flex-box {
  padding: 0.2rem 0.3rem;
  background: #fafefd;
  margin-bottom: 0.2rem;
  position: relative;
}

.flex-box > div {
  margin-bottom: 0.2rem;
}

.flex-row-nowarp input {
  width: 2rem;
}

.flex-box input {
  border-radius: 0.05rem;
  background: #fff;
}
</style>
