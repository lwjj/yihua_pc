<template>
  <yd-layout class="layout_my">
      <yd-navbar class="header" slot="navbar" v-title="'接待'" title="接待" v-show="!userAgent.isWX" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft addClickArea" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
         <span @click="turnTo('/estate/serviceList/reception/declares')" slot="right" class="edit spanRight addRightClickArea" style="color: #fff;font-size:.6rem;">+</span>
      </yd-navbar>
      <div class="headTab" slot="top">
        <div class="flex-row h9">
          <div :class='["flex1","jusCenter" ,{active:currentIndex == 0}]' :style="currentIndex == 0?`color:${mainColor};border-bottom:2px solid ${mainColor}`:``" @click="chooseIndex(0)">
            <span>起止日期</span>
            <yd-icon name='toDown' v-if="currentIndex != 0" size='.2rem' color='#444' custom></yd-icon>
            <yd-icon name='shangla' v-if="currentIndex == 0" :color='mainColor' size='.2rem' custom></yd-icon>
          </div>
          <div :class='["flex1","jusCenter" ,{active:currentIndex == 1}]' :style="currentIndex == 1?`color:${mainColor};border-bottom:2px solid ${mainColor}`:``" @click="chooseIndex(1)">
            <span>全部状态</span>
            <yd-icon name='toDown' v-if="currentIndex !=1" size='.2rem' color='#444' custom></yd-icon>
            <yd-icon name='shangla' v-if="currentIndex == 1" :color='mainColor' size='.2rem' custom></yd-icon>
          </div>
        </div>
      </div>

     <div class="mask" style="top:1.78rem" v-if="isFilter" @click="cancelIndex()">
      <div class="filter" @click.stop="''">
        <!-- 筛选时间 -->
        <div class="timeFilter" v-show="currentIndex == 0">
          <div class="flex-row h8">开始时间</div>
          <div class="flex-row h8">
             <yd-datetime  class="flex1 bgwhite border pdlr2" style="text-align:center" type="date" v-model="startTime"></yd-datetime>
            
          </div>
          <div class="flex-row h8">结束时间</div>
          <div class="flex-row h8">
             <yd-datetime  class="flex1 bgwhite border pdlr2"  type="date" v-model="endTime"></yd-datetime>
          </div>
        </div>
         <!-- 筛选状态 -->
         <div class="flex-row statusFilte flex-start" v-show="currentIndex == 1">
           <yd-button v-for="(item,index) in statusArr" :key="index" @click.native="currentIndex1 == index?currentIndex1= -1:currentIndex1 = index" type='hollow' :style="currentIndex1 == index?`border:1px solid ${mainColor};color:${mainColor}`:``" :class="['myButton',{active:index == currentIndex1}]" >
             {{item.name}}
           </yd-button>
         </div>
        
          <div class="flex-row h9 bgwhite bt font32" style="margin-top:.3rem;">
            <div class="flex1 jusCenter br"  @click="cancelIndex()">取消</div>
            <div class="flex1 jusCenter" @click="confirm()" :style="{color:mainColor}">确定</div>
          </div>
          <!-- <yd-button type='hollow' class="mt2">确定</yd-button> -->
        </div>
    </div>
    <div class="contentList" @scroll="scrollHandler" ref="listDom">
       <div class="content" v-for="(item,index) in contentList" :key="index" @click="turnTo('/estate/serviceList/wuye/reception/details/888#'+item.guid)">
              <div class="top">
                    <p></p>
                    <span>单号：{{item.guid}}</span>
              </div>
              <!-- {{1111111111111111111111111}} -->
              <div class="bottom">
                   <i><img src="../../../../../assets/images/rent/estate/document.png" alt=""></i>
                   <p>
                   <span style="width:4rem" class="textHidden">{{item.detailContent}}</span>
                   <a style="width:2rem" class="textHidden">{{item.customerName}}<span class="cc"></span></a>
                   </p>
                   <span>
                      <span class="pdlr1 state state2" v-if="item.status == 1">上报中</span>
                      <span class="pdlr1 state state2" v-if="item.status == 2">接单</span>
                      <span class="pdlr1 state state2" v-if="item.status == 3">处理中</span>
                      <span class="pdlr1 state state2" v-if="item.status == 4">待确认</span>
                      <span class="pdlr1 state state1" v-if="item.status == 5">已完成</span>
                      <span class="pdlr1 state stateClose" v-if="item.status == 6">关闭</span>
                      <span class="pdlr1 state state0" v-if="item.status == 7">不同意</span>
                      <p class="flex"><i><img src="../../../../../assets/images/rent/estate/date.png" alt=""></i>{{item.createDate}}</p>
                   </span>
              </div>

        </div>
        <div  class="Section" v-show="pageSize>=5">
            <div v-if="pageNo <= pageCount">
              <div class="a b1">
                <ul>
               <li></li>
               <li></li>
               <li></li>
                </ul></div>

            </div>
            <div v-else>啦啦啦，啦啦啦，没有数据啦~~</div>
        </div>
    </div>

  </yd-layout>
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";
import store from "@/store";
import { DateTime } from "vue-ydui/dist/lib.rem/datetime";
Vue.component(DateTime.name, DateTime);

export default {
  data() {
    return {
      num: 0,
      mainColor: "",
      organInfo: "",
      userInfo: "",
      contentList: [],
      userId: "",
      organId: "",
      organType: "",
      // （上报中：1，已接单：2，处理中：3，待确认：4，已完成：5，关闭：6,不同意：7） ,
      // tabs: [
      //   "上报中",
      //   "已接单",
      //   "处理中",
      //   "待确认",
      //   "已完成",
      //   "关闭",
      //   "不同意"
      // ],
      statusArr: [
        {
          name: "全部",
          value: -1
        },
        {
          name: "上报中",
          value: 1
        },
        {
          name: "已接单",
          value: 2
        },
        {
          name: "处理中",
          value: 3
        },
        {
          name: "待确认",
          value: 4
        },
        {
          name: "已完成",
          value: 5
        },
        {
          name: "关闭",
          value: 6
        },
        {
          name: "不同意",
          value: 7
        }
      ],

      active: null,
      show: false,
      show1: false,
      pageNo: 1,
      pageSize: 5,
      pageCount: null,
      keyword: "",
      isFilter: false,
      startTime: this.$addDay(this.$today(), -180),
      endTime: this.$today(),
      currentIndex: -1,
      currentIndex1: 0,
      status: null
    };
  },
  methods: {
    chooseIndex(e) {
      this.currentIndex = e;
      this.isFilter = true;
    },
    cancelIndex() {
      this.currentIndex = -1;
      this.isFilter = false;
    },
    scrollHandler() {
      if (store.loading || this.pageNo > this.pageCount) {
        return;
      }
      let listDom = this.$refs.listDom;
      if (
        listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight <
        100
      ) {
        this.listReceptoin();
      }
    },
    toggle() {
      this.show1 = !this.show1;
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      this.$router.go(-1);
    },
    tabClick(index) {
      this.num = index;
      this.status = index + 1;
    },
    // 获取信息列表
    Determine() {
      this.pageNo = 1;
      this.listReceptoin();
      this.show1 = false;
    },
    search() {
      this.pageNo = 1;
      this.listReceptoin();
    },
    chooseIndex(e) {
      this.currentIndex = e;
      this.isFilter = true;
    },
    cancelIndex() {
      this.currentIndex = -1;
      this.isFilter = false;
    },
    confirm() {
      this.pageNo = 1;
      // this.$refs.infinitescrollDemo.$emit("ydui.infinitescroll.reInit");
      this.contentList = [];
      this.listReceptoin();
      this.currentIndex = -1;
      this.isFilter = false;
    },
    listReceptoin() {
      // if (this.show1) {
      //   var data = {
      //     token: this.getkey,
      //     userId: this.userId,
      //     organId: this.organId,
      //     organType: this.organType,
      //     pageNo: this.pageNo,
      //     pageSize: this.pageSize,
      //     startDate: this.startDate + " 00:00:00",
      //     endDate: this.endDate + " 23:59:59"
      //   };
      //   if (this.status != null) {
      //     data.status = this.status;
      //   }
      // } else {
      //   var data = {
      //     token: this.getkey,
      //     userId: this.userId,
      //     organId: this.organId,
      //     organType: this.organType,
      //     pageNo: this.pageNo,
      //     pageSize: this.pageSize
      //   };
      //   if (this.keyword != null) {
      //     data.keywordOrNo = this.keyword;
      //   }
      // }
      var data = {
        token: this.getkey,
        userId: this.userId,
        organId: this.organId,
        organType: this.organType,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        startDate: this.startTime + " 00:00:00",
        endDate: this.endTime + " 23:59:59"
      };
      if (this.currentIndex1 > 0) {
        data.status = this.statusArr[this.currentIndex1].value;
      }
      this.xhr
        .post(
          `${this.subUrl.activity}/reception/listReceptoin?` +
            qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
            // console.log(res)
            res.data.data.list.forEach(item => {
              if (item.createDate != null) {
                item.createDate = item.createDate.split(" ")[0];
              }
            });
            this.pageCount = res.data.data.pageCount;
            if (this.pageNo >= 2) {
              this.contentList = this.contentList.concat(res.data.data.list);
            } else {
              this.contentList = res.data.data.list;
            }
            this.pageNo++;
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
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    this.userId = this.userInfo.guid;
    this.organId = this.organInfo.guid;
    this.organType = this.organInfo.organType;
    this.getkey = fn.getIng();
    this.listReceptoin();
  },
  beforeUpdate() {
    // console.log(this.pageNo)
  }
};
</script>
<style scoped>
.headTab{
  background: #fff;
  margin-bottom: 0;
  border-bottom: 1px solid #e4e4e4;

}
.layout_my .header:after {
  display: none;
}
.layout_my {
  background: #f7f7f9;
}

.layout_my .blue_box {
  height: 0.88rem;
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
  background: rgba(0, 0, 0, 0.1);
  z-index: 999;
  left: 0;
}
.screen ul {
  background: #f6f6f6;
  height: 5rem;
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
.screen ul li:nth-child(4) > a.ative {
  border: 1px solid #999;
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
  padding-top: .2rem;
  width: 100%;
  height: calc(100vh - 1.75rem);
  overflow-y: auto;
  background: #e1f2f3;
}
.contentList > div:nth-child(1) {
  margin: 0;
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
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  font-size: 0.24rem;
}
.top > p {
  height: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
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

.cc {
  margin-left: 0.8rem;
}

.bottom {
  display: flex;
  flex-flow: row;
  padding: 0.1rem 0 0.1rem 0.1rem;
}
.bottom > i {
  width: 1rem;
  height: 1.2rem;
}
.bottom > i > img {
  width: 100%;
  height: 100%;
}

.bottom > p {
  flex: 1;
  display: flex;
  flex-flow: column;
  justify-content: center;
  padding: 0 0.2rem;
}
.bottom > p > a {
  font-size: 0.24rem;
  color: #747474;
  padding: 0.1rem 0;
}
.bottom > p > span {
  font-size: 0.32rem;
  color: #000;
  padding: 0.1rem 0;
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
  margin-bottom: 0.3rem;
  border-radius: 0.04rem;
  font-size: 0.22rem;
  padding: 0.02rem 0.1rem;
}
.bottom > span > p {
  display: flex;
  font-size: 0.24rem;
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
</style>
