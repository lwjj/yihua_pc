<template>
<div class="newRightContent"> 
   <div class="layout_my" style="height:100%">
     <div class="title">
          <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
              <el-breadcrumb-item>缴费单</el-breadcrumb-item>
          </el-breadcrumb>
     </div>
     <!-- {{contentList}} -->
      <div class="tableBox" style="padding-top:10px;line-height:50px;">
        <div style="min-width:1130px;"> 
          <div style="float:left;margin-bottom:10px;">
            <span>状态：</span>
            <el-select @change='changeData1' v-model="value1" clearable placeholder="请选择"  style="width:120px;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :change-on-select='false'
                :label="item.name"
                :value="item.value">
              </el-option>
              
          </el-select>
          </div>  
          <div style="float:left;margin-left:10px;">
            <span>缴费单类型：</span>
            <el-select @change='changeData2' v-model="value2" clearable placeholder="请选择"  style="width:120px;">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :change-on-select='false'
                :label="item.name"
                :value="item.value">
              </el-option>
              
          </el-select>
          </div>
          <div style="float:left;margin-left:10px;">
            时间选择:
            <el-date-picker
              v-model="value3"
              type="daterange"
              range-separator="至"
              value-format="yyyy-MM-dd"
              @change="changeData2"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:300px;">
            </el-date-picker>
          </div>
          <div style="float:right;margin-right:10px;">
            <div class="flex" v-if="showBuild">
              <el-dropdown>
                <el-button>新建</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="toAdd(0)">物业缴费单</el-dropdown-item>
                  <el-dropdown-item @click.native="toAdd(1)">专项缴费单</el-dropdown-item> 
                </el-dropdown-menu>
              </el-dropdown>
              <!-- <el-button type="primary" icon='el-icon-plus' @click="show2 = true">新建</el-button>  -->

                  <el-button class="ml1" @click.native='$router.push("/estate/serviceList/payment/moneyset")'>银行卡设置</el-button>
            </div>
          </div>
          <div style="float:right;margin-right:10px;margin-left:10px;">
          <el-button @click="print">打印表格</el-button>
          </div>
          <div class="clear:both"></div>
        </div>
          <el-table :data="contentList" height="250" border style="width: 100%">  
            <el-table-column prop="guid" label="单号" min-width="19%" align="center"></el-table-column>
            <el-table-column min-width="25%" prop="organResult.organName" show-overflow-tooltip	align="center" label="公司"></el-table-column>
            <el-table-column label="缴费类型"  prop='name' min-width="10%" align="center"> </el-table-column>
            <el-table-column label="创建时间"  width="170" prop='createDate' align="center"> </el-table-column>
            <el-table-column prop="guid" label="租户单元" show-overflow-tooltip	 align="center" min-width="20%">
              <template slot-scope="scope" >
                <span v-if="scope.row.organResult">
                  {{scope.row.organResult.ridName}} {{scope.row.organResult.unitName}} 
                </span>
              </template>
            </el-table-column>
            <el-table-column label="是否已读" min-width="10%" align="center">
              <template slot-scope="scope"> 
                <span  v-if='scope.row.isRead==0'>未读</span>
                <span  v-if='scope.row.isRead==1'>已读</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" min-width="8%" align="center">
              <!-- （0：未缴，1：已读，2：催缴，3：已缴 ） ,  -->
              <template slot-scope="scope"> 
                <span  v-if='scope.row.state==0'>未缴</span>
                <span  v-if='scope.row.state==1'>催缴</span>
                <span  v-if='scope.row.state==2'>已缴</span>
              </template>
            </el-table-column>
            <el-table-column label="详情" min-width="8%" align="center"> 
              <template slot-scope="scope">
                <el-button  plain size="small" @click="turnTo('/estate/serviceList/wuye/payment/expense/'+scope.row.guid+'#'+scope.row.type)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="pageCount > 0"
            class="tableBottom"
            background
            @current-change='changeData'
            layout="prev, pager, next"
            :page-count="pageCount"
            style="bottom:-10px;"
            >
          </el-pagination>
          <div id="printcode" v-show="print1">
            <el-table :data="contentList"  :style="{height:contentList.length*49+48+'px'}"  border>  
            <el-table-column prop="guid" label="单号" width="240px" align="center" ></el-table-column>
            <el-table-column width="350px" prop="organResult.organName" show-overflow-tooltip	align="center" label="公司" ></el-table-column>
            <el-table-column label="缴费类型" width="350px" prop='name' align="center"> </el-table-column>
            <el-table-column prop="guid" label="租户单元" show-overflow-tooltip	 align="center" width="120px">
              <template slot-scope="scope" >
                <span v-if="scope.row.organResult">
                  {{scope.row.organResult.ridName}} {{scope.row.organResult.unitName}} 
                </span>
              </template>
            </el-table-column>
             <el-table-column label="是否已读" width="180px" align="center">
              <!-- （0：未缴，1：已读，2：催缴，3：已缴 ） ,  -->
              <template slot-scope="scope"> 
                <span  v-if='scope.row.isRead==0'>未读</span>
                <span  v-if='scope.row.isRead==1'>已读</span> 
              </template>
            </el-table-column>
            <el-table-column label="状态" width="180px" align="center">
              <!-- （0：未缴，1：已读，2：催缴，3：已缴 ） ,  -->
              <template slot-scope="scope"> 
                <span  v-if='scope.row.state==0'>未缴</span>
                <span  v-if='scope.row.state==1'>催缴</span>
                <span   v-if='scope.row.state==2'>已缴</span> 
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <yd-actionsheet slot="bottom" :items="myItems2" v-model="show2"></yd-actionsheet>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";
import store from "@/store";
import { DateTime } from "vue-ydui/dist/lib.rem/datetime";
import { Tab, TabPanel } from "vue-ydui/dist/lib.rem/tab";

Vue.component(Tab.name, Tab);
Vue.component(TabPanel.name, TabPanel);
Vue.component(DateTime.name, DateTime);
import { ActionSheet } from "vue-ydui/dist/lib.rem/actionsheet";
/* 使用px：import {ActionSheet} from 'vue-ydui/dist/lib.px/actionsheet'; */

Vue.component(ActionSheet.name, ActionSheet);
export default {
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    this.userId = this.userInfo.guid;
    this.getkey = fn.getIng();
    return {
      showBuild: false,
      filter: false,
      chooseList: [
        {
          name: "全部",
          value: ""
        },
        {
          name: "物业费",
          value: 1
        },
        {
          name: "专项费",
          value: 2
        }
      ],
      pageCount: 1,
      pageNo: 1,
      print1: false,
      // （0：未缴，1：已读，2：催缴，3：已缴 ） ,
      options: [
        {
          name: "全部",
          value: ""
        },
        {
          name: "未缴",
          value: 0
        },
        {
          name: "催缴",
          value: 1
        },
        {
          name: "已缴",
          value: 2
        }
      ],

      currentIndex: 1,
      serviceList: [
        {
          name: "缴费",
          img: "../../../../assets/images/rent/estate/search.png",
          path: "/estate/serviceList/wuye/payment"
        }
      ],
      show2: false,
      myItems2: [
        {
          label: "物业缴费单",
          callback: () => {
            console.log(1);
            this.$router.push("/estate/serviceList/wuye/newPayment/1");
          }
        },
        {
          label: "专项缴费单",
          callback: () => {
            console.log(2);

            this.$router.push("/estate/serviceList/wuye/newPayment/2");
          }
        }
      ],
      myColor: ["#fab23e", "#3eb7e6", "#3eb7e6", "#fa697c"],
      contentList: [],
      show: false,
      show1: false,
      options1: [{ value: "", name: "全部" },{ value: 1, name: "物业费" }, { value: 2, name: "专项费" }],
      screen: {
        startTime: this.$addDay(this.$today(), -180),
        endTime: this.$addDay(this.$today(), 1),
        content: "",
        type: null
      },
      pageNo: 1,
      pageSize: 12,
      pageCount: null,
      keyword: "",
      tabindex: -1,
      currentStatus: -1,
      currentIndex: -1,
      value1: "",
      value2: "",
      value3: ""
    };
  },
  methods: {
    //打印
    print() {
      this.$getPrint();
    },
    toAdd(e) {
      if (e === 0) {
        this.$router.push("/estate/serviceList/wuye/newPayment/1");
      } else {
        this.$router.push("/estate/serviceList/wuye/newPayment/2");
      }
    },
    changeData(e) {
      this.pageNo = e;
      this.payList();
    },
    changeData1(e) {
      this.pageNo = 1;
      this.payList();
    },
    changeData2(e) {
      console.log(e, this.value1);
      this.pageNo = 1;
      this.payList();
    },
    cancelFilter() {
      this.tabindex = -1;
      this.filter = false;
      console.log(this.tabIndex, 11111);
    },
    // 催缴
    reminder(i, val) {
      console.log(i, val);
      this.$ajax(`${this.subUrl.activity}`);
    },
    chooseType(e) {
      for (var i in this.chooseList) {
        if (e == i) {
          this.$set(this.chooseList[i], "selected", true);
        } else {
          this.$set(this.chooseList[i], "selected", false);
        }
      }
      console.log(this.chooseList);
      this.currentIndex = e;
    },
    chooseStatus(e) {
      for (var i in this.statusList) {
        if (e == i) {
          this.$set(this.statusList[i], "selected", true);
        } else {
          this.$set(this.statusList[i], "selected", false);
        }
      }
      console.log(this.statusList);
      this.currentStatus = e;
    },
    //点击筛选
    callback(e) {
      console.log(e);
      this.filter = true;
      this.tabindex = e;
    },
    scrollHandler() {
      // if (store.loading || this.pageNo > this.pageCount) {
      //   return;
      // }
      // let listDom = this.$refs.listDom;
      // if (
      //   listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight <
      //   100
      // ) {
      //   this.payList();
      // }
    },
    loadList() {
      this.payList();
    },
    toggle1(index) {
      this.screen.type = this.types[index].id;
    },
    toggle() {
      this.show1 = !this.show1;
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      history.back();
    },
    filterSccess() {
      this.pageCount = null;
      this.pageNo = 1;
      this.payList();
    },
    // 获取信息列表
    confirm() {
      console.log(this.currentIndex, this.currentStatus);
      this.contentList = [];
      this.pageNo = 1;
      this.payList();
      this.filter = false;
      this.cancelFilter();
    },
    cancel() {
      this.filter = false;
    },
    payList() {
      var data = {
        userId: this.userId,
        token: this.getkey,
        startTime: this.screen.startTime + " 00:00:00",
        entTime: this.screen.endTime + " 23:59:59",
        pageNo: this.pageNo,
        pageSize: 12
      };
      // if (this.currentIndex * 1 > 0) {
      //   data.type = this.chooseList[this.currentIndex].value;
      // }
      if (this.value2 > -1) {
        data.type = this.value2;
      }
      if (this.value1 > -1) {
        data.state = this.value1;
      }

      if (this.value3) {
        data.startTime = this.value3[0] + " 00:00:00";
        data.entTime = this.value3[1] + " 23:59:59";
      }
      console.log(data);
      this.xhr
        .post(`${this.subUrl.activity}/pay/payList`, qs.stringify(data))
        .then(res => {
          if (res.data.code == 1) {
            res.data.data.list.forEach(element => {
              if (element.type == 1) {
                element.name = "物业费";
              } else {
                element.name = "专项费";
              }
              element.createDate = element.createDate;
            });
            console.log(res.data.data.list);
            this.pageCount = res.data.data.pageCount * 1;
            this.contentList = res.data.data.list;
            this.pageNo++;
            this.show1 = false;
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$message.error(res.data.msg);
          }
        });
    }
  },
  mounted() {
    this.payList();
    this.$getRoot(res => {
      this.rootList = res;
      for (var a of this.rootList.propertyService.subclass) {
        if (a.name == "缴费单") {
          if (a.subclass.length > 0) {
            this.showBuild = true;
          }
        }
      }
    }, this);
  }
};
import "@/assets/css/wuye.css";
</script>
<style scoped>
.mylabel > .flex1 {
  margin-bottom: 2px;
  border-bottom: 2px solid #fff;
}

.active.flex1 {
  border-bottom: 2px solid rgb(30, 130, 210);
}
/* .el-table__body-wrapper{
  height:auto !important
}
.is-scrolling-none{
  height:auto !important
} */
.state {
  border-radius: 0.05rem;
  border: 1px solid #ddd;
  padding: 0 0.1rem;
  line-height: 0.5rem;
  height: 0.5rem;
}

.state0 {
  color: #fab23e;
  border-color: #fab23e;
}

.state1 {
  color: #3eb7e6;
  border-color: #3eb7e6;
}

.state2 {
  color: #fa697c;
  border-color: #fa697c;
}

.filterChild {
  padding: 0 1rem 0.45rem;
}

.layout_my .header:after {
  display: none;
}

.layout_my {
  background: #f7f7f9;
}

.layout_my .blue_box {
  height: auto;
  background: #0093d2;
  background-size: 100% 100%;
}

.search {
  position: relative;
  width: 100%;
  height: 0.85rem;
  background: white;
  display: flex;
  flex-flow: row;
  padding: 0.15rem 0.3rem;
  border-bottom: 1px solid #e8e8e8;
}

.search > div:nth-child(1) {
  flex: 1;
  background: #ebebed;
  border-radius: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search > div:nth-child(1) > i {
  width: 0.35rem;
  height: 0.35rem;
  margin-right: 0.1rem;
}

.search > div:nth-child(1) > i > img {
  width: 100%;
  height: 100%;
}

.search > div:nth-child(1) > span {
  width: 2.4rem;
}

.search > div:nth-child(1) > span > input {
  width: 100%;
  font-size: 0.24rem;
  color: #a2a1a6;
  border: none;
}

.search > div:nth-child(2) {
  width: 1.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.screen {
  width: 100%;
  position: absolute;
  height: calc(100vh - 0.85rem);
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
  left: 0;
}

.screen ul {
  background: #f6f6f6;
}

.screen ul li {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
}

.screen ul li:nth-child(1) {
  width: 100%;
  padding: 0.1rem 0.3rem;
}

.screen ul li:nth-child(2) {
  width: 100%;
  padding: 0.1rem 0.3rem;
  justify-content: center;
}

.screen ul li:nth-child(2) > span {
  background: white;
  width: 3rem;
  height: 0.7rem;
  border: 1px solid #e9e9e9;
  display: flex;
  align-items: center;
}

.screen ul li:nth-child(2) > i {
  margin: 0 0.3rem;
}

.screen ul li:nth-child(2) > span > input {
  width: 3rem;
  height: 0.7rem;
  border: none;
}

.screen ul li:nth-child(3) {
  width: 100%;
  padding: 0.1rem 0.3rem;
}

.screen ul li:nth-child(4) {
  width: 100%;
  padding: 0.1rem 0.3rem;
  justify-content: space-between;
}

.screen ul li:nth-child(4) > a {
  background: white;
  width: 29%;
  height: 0.7rem;
  border: 1px solid #f0f0f0;
  display: flex;
  color: #999;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.2rem;
}

.screen ul li:nth-child(5) {
  width: 100%;
  height: 0.95rem;
  background: white;
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  align-items: center;
}

.screen ul li:nth-child(5) button {
  width: 50%;
  height: 0.95rem;
  border: none;
  border-top: 1px solid #e4e4e4;
  font-size: 0.3rem;
  font-weight: 600;
  color: #a2a2a2;
}

.screen ul li:nth-child(5) button:hover {
  color: #1e82d2;
}

.screen ul li:nth-child(5) button.aa {
  border-left: 1px solid #e4e4e4;
}

.contentList {
  width: 100%;
  height: calc(100vh - 1.75rem);
  overflow-y: scroll;
}

.content {
  width: 100%;
  display: flex;
  flex-flow: column;
  padding: 0.1rem 0.2rem;
  background: white;
  margin-top: 0.2rem;
}

.top {
  border-bottom: 1px dashed #aaaaaa;
  color: #747474;
  display: flex;
  align-content: center;
  font-size: 0.24rem;
  justify-content: space-between;
}

.top > p {
  height: 0.6rem;
  display: flex;
  align-items: center;
  flex: 1;
}

.top > p > i {
  height: 0.3rem;
  width: 0.3rem;
  margin-right: 0.1rem;
}

.top > p > i > img {
  width: 100%;
  height: 100%;
}

.bottom {
  display: flex;
  flex-flow: row;
  padding: 0.1rem 0 0.1rem 0.1rem;
}

.bottom > p {
  flex: 1;
  display: flex;
  flex-flow: column;
  justify-content: center;
}

.bottom > p > a {
  font-size: 0.26rem;
  color: #747474;
  margin-top: 0.2rem;
}

.bottom > p > span {
  font-size: 0.32rem;
  color: #000;
  margin: 0.1rem 0;
  font-weight: 600;
}

.bottom > span {
  width: 2rem;
  height: 1.2rem;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: flex-end;
}

.bottom > span > span {
  margin-bottom: 0.4rem;
  border-radius: 0.04rem;
  font-size: 0.22rem;
}

.bottom > span > p {
  display: flex;
  font-size: 0.26rem;
  color: #747474;
}

.bottom > span > p > i {
  height: 0.3rem;
  width: 0.3rem;
  margin-right: 0.1rem;
}

.bottom > span > p > i > img {
  width: 100%;
  height: 100%;
}

.add {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0);
  position: fixed;
  left: 0;
  top: -0.05rem;
}

.add ul {
  width: 3rem;
  height: 1.6rem;
  background: white;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #e5e5e5;
  border-radius: 0.1rem;
  position: absolute;
  right: 0.1rem;
  top: 1rem;
}

.add ul li:nth-child(1) {
  border-bottom: 1px solid #e5e5e5;
  position: relative;
  z-index: 666;
}

.add ul li:nth-child(1) > span {
  display: flex;
  width: 0.25rem;
  height: 0.25rem;
  position: absolute;
  top: -0.25rem;
  z-index: 555;
  right: 0.15rem;
}

.add ul li:nth-child(1) > span > img {
  width: 100%;
  height: 100%;
}

.add ul li {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 0.8rem;
}
</style>
