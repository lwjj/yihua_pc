<template>
<div class="newRightContent" style="overflow:auto">
 <div class="border bgwhite">
    <yd-layout class="yd-layout" style="width:750px;"  v-if='showUser && showTable && !showOrder'>
      <!-- <yd-navbar class="header" slot="navbar" v-title="'入驻详情'" v-show="!userAgent.isWX" title="入驻详情" color="#fff" :bgcolor="mainColor" height=".88rem">
          <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>
      </yd-navbar> -->
      <div class="title">
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
            <el-breadcrumb-item  @click.native='$back'>入驻单</el-breadcrumb-item>
            <el-breadcrumb-item>入驻详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

       <div class="relative">
          <div class="flex-row flex-end bgwhite" v-if="settled.status" style="position: absolute;right: .2rem" >
          <span class="state stateClose" v-if="settled.status == 0">已关闭</span>
          <span class="state state0" v-if="settled.status == 1">已完成</span>
          <span class="state state1" v-if="settled.status == 2">客服受理 </span>
          <span class="state state2" v-if="settled.status == 3">待抄表</span>
          <span class="state state3" v-if="settled.status == 4">已抄表</span>
        </div>
      <div class="organInfos" v-if="settled.status" >
        <div class="info">
          <ul>
            <li><span>企业名称：</span><p>{{settled.clientInfo.organName}}</p></li>
            <li><span>所在行业：</span><p>{{settled.clientInfo.industry}}</p></li>
            <li><span>租用单元：</span><p>{{settled.clientInfo.ridName}}{{settled.clientInfo.unitName}}</p></li>
            <li  v-if="settled.contractNo"><span>合同编号：</span><p>{{settled.contractNo}}</p></li>
            <li v-if="settled.startTime"><span>开始日期：</span><p>{{settled.startTime.substr(0,10)}}</p></li>
            <li  v-if="settled.endtime"><span>结束日期：</span><p>{{settled.endtime.substr(0,10)}}</p></li>
            <li v-if="settled.paymentDate"><span>缴费日期：</span><p>{{settled.paymentDate.substr(0,10)}}</p></li>
            <li style="height:auto" v-if="settled.remark"><span>备注信息：</span><p class="" style="max-width:80%;word-break:break-all;">{{settled.remark}}</p></li>
          </ul>
        </div>
      </div>

      <div class="text1">
        <ul>
          <li style="height:auto"><p>通信地址</p><span style="max-width:80%;word-break:break-all;">{{settled.contactAddress}}</span></li>
          <li><p>联系人</p><span>{{settled.contactName}}</span></li>
          <li><p>联系电话</p><span>{{settled.contactPhone}}</span></li>
        </ul>
      </div>
      <div class="staff" v-if='meterReadList && meterReadList.length > 0'>
          <p class="font28">抄表信息</p>
          <div class="bb" v-for="(item,index) in meterReadList" :key="index">
            <div class="flex-row foCo9 pdlr25" style="line-height: .65rem">
              <span  style="width: 50%" class="nowrap"><span>抄表人:</span><span>{{item.meterReadUsername}}</span></span>
              <span  style="width: 50%" class="nowrap"><span>抄表时间:</span><span>{{item.meterRead.substr(0,10)}}</span></span>
            </div>
            <div class="flex-row foCo9 pdlr25" style="line-height: .65rem">
              <span style="width: 50%"><span>本期读数:</span><span>{{item.reading}}</span></span>
              <span style="width: 50%"><span>上期读数:</span><span>{{item.ppReading}}</span></span>
              <span style="width: 50%"><span>使用情况:</span><span>{{item.dosage}}</span></span>
            </div>
          </div>
          <!--<ul>-->
            <!--<li>-->
                <!--<p>-->
                  <!--<span>{{meterRead.project}}</span>-->
                    <!--<i>抄表人：{{meterRead.meterReadUsername}}</i>-->
                <!--</p>-->
                <!--<p>-->
                    <!--<span>本期读数：{{meterRead.reading}}</span>-->
                    <!--<i>时间：2017-10-10</i>-->
                <!--</p>-->
            <!--</li>-->
          <!--</ul>-->
      </div>
      <!-- 流程记录 -->
      <yd-timeline class="timeLine" style="padding:0 10px">
        <yd-timeline-item class="timeLineItem" v-for="(item,index) in tasksRecordList" :key="index">
             <yd-icon v-if="index == 0" name='tongxinyuan' slot="icon" :color='mainColor' size='.5rem' custom></yd-icon>
             <div class="timeLineItemFirst" :style="{color:mainColor}">{{item.title}}</div>
             <div>处理时间：{{item.createTime}}</div>
             <div>处理人：{{item.usetName}}</div>
             <div v-if='item.remark'>备注：{{item.remark}}</div>
        </yd-timeline-item> 
    </yd-timeline>  
      <!--客服处理弹窗-->
      <div class="mask" v-if="showList" @click="showList = false">
        <div class="bgwhite foCo6" style="min-width:600px;width:auto;max-width:1000px;padding: .5rem .3rem;" @click.stop="''">
          <div class="listBox">
            <div class="list_item">
              <div class="list_sigle">操作</div>
              <div class="list_sigle">项目名</div>
              <div class="list_sigle">上期读数</div>
              <div class="list_sigle">本期读数</div>
              <div class="list_sigle">实际用量</div>
              <div class="list_sigle">抄表人</div>
              <div class="list_sigle">抄表时间</div>
            </div>

            <div class="list_item" v-for="(item,index) in tableList"   :key="index">
              <div class="list_sigle fuColor3">
                <el-button type="danger" @click="deleteItem(index)" size="small">删除</el-button>
              </div>
              <div class="list_sigle">{{item.project}}</div>
              <div class="list_sigle">{{item.ppReading}}</div>
              <div class="list_sigle">{{item.reading}}</div>
              <div class="list_sigle">{{item.dosage}}</div>
              <div class="list_sigle">{{item.meterReadUsername}}</div>
              <div class="list_sigle">{{item.meterRead.split(' ')[0]}}</div>
            </div>
          </div>
          <div class="flex-row mt2">
            <yd-button type="hollow" @click.native="showTable = false">新增</yd-button>
          </div>
          <div class="flex h8 jusCenter mt2 radius" @click="zhiConfirm" :style="{color:'#fff',background:mainColor}">
            确定
          </div>
        </div>
      </div> 
      <!--同意入驻-->
      <div class="flex-row h9 bgwhite jusCenter bt" v-if='settled.status == 2 && tasks' style="overflow: hidden" slot="bottom">
        <div class="flex-row jusCenter center br"  style="width: 50%;margin-bottom:0" @click="closeOrder" >
          <yd-icon name="disagree" class="mr1" :color="'#f00'" size=".35rem" custom></yd-icon>
          <span :style="{color:'#f00'}">关闭</span>
        </div>
        <div class="flex-row jusCenter center" @click="completeOrder" style="width: 50%;margin-bottom:0">
          <yd-icon name="selected" class="mr1" :color="mainColor" size=".42rem" custom></yd-icon>
          <span :style="{color:mainColor}">完善入驻单</span>
        </div>
      </div>
        <div class="flex-row h9 bgwhite jusCenter" @click="showList=true" v-if='settled.status == 3 && tasks' slot="bottom">
          <img src="../../../../../../assets/images/rent/estate/select_active.png" class="chooseIcon" alt="">
          <span :style="{color:mainColor}">抄表</span>
      </div>
      <div class="flex-row h9 bgwhite jusCenter" @click="agreeRuZhu" v-if='settled.status == 4 && tasks' slot="bottom">
        <img src="../../../../../../assets/images/rent/estate/select_active.png" class="chooseIcon" alt="">
        <span :style="{color:mainColor}">同意入驻</span>
      </div>
       </div>
      <!--省略指派抄表人-->
      <!--<div class="flex-row h8 bgwhite jusCenter"  @click="showUser = false" v-if='settled.status == 2 && tasks' slot="bottom">-->
        <!--<img src="../../../../../../assets/images/rent/estate/select_active.png" class="chooseIcon" alt="">-->
        <!--<span :style="{color:mainColor}">指派抄表人</span>-->
      <!--</div>-->
    </yd-layout>
    <departMent v-if='!showUser' @setUserId='setUserId'></departMent>
    <mTable v-if="!showTable" @setTable="setTable"></mTable>
    <!--完善入驻单模板-->
    <orderDetail v-if="showOrder" :orderParams="orderParams" @confirmOrder="confirmOrder"></orderDetail>
  </div>
</div>
 
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";
import departMent from "../repair/department_manager";
import mTable from "../../exit_rent/table";
import orderDetail from "./addSettled";
import {
  Confirm,
  Alert,
  Toast,
  Notify,
  Loading
} from "vue-ydui/dist/lib.rem/dialog";

import { Button, ButtonGroup } from "vue-ydui/dist/lib.rem/button";
/* 使用px：import {Button, ButtonGroup} from 'vue-ydui/dist/lib.px/button'; */

Vue.component(Button.name, Button);
Vue.component(ButtonGroup.name, ButtonGroup);
/* 使用px：import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.px/dialog'; */

Vue.prototype.$dialog = {
  confirm: Confirm,
  alert: Alert,
  toast: Toast,
  notify: Notify,
  loading: Loading
};
import "@/assets/css/wuye.css";
import { TimeLine, TimeLineItem } from "vue-ydui/dist/lib.rem/timeline";
Vue.component(TimeLine.name, TimeLine);
Vue.component(TimeLineItem.name, TimeLineItem);

export default {
  components: {
    departMent,
    mTable,
    orderDetail
  },
  data() {
    return {
      showOrder: false,
      showUser: true,
      toChaobiao: false,
      orderParams: {},
      showList: false,
      showTable: true,
      tableList: [],
      meterReadList: [],
      add: false,
      organInfo: {},
      userInfo: {},
      getkey: "",
      mainColor: "",
      titleT: "",
      show: true,
      s: true,
      p: true,
      decorationId: null,
      statusList: [],
      lists: [],
      decoration: {},
      decorationRowList: [],
      accessoryFiles: [],
      settled: {},
      tasks: null,
      tasksRecordList: [],
      meterRead: [],
      obj: {
        project: "",
        ppReading: "",
        reading: "",
        dosage: ""
      }
    };
  },
  methods: {
    //提交单子
    confirmOrder(e) {
      this.showOrder = false;
      if (e) {
        this.getDetail();
      }
    },
    //点击显示数据
    completeOrder() {
      this.showOrder = true;
    },
    //点击关闭订单（暂时没有）
    closeOrder() {
      this.$confirm("是否关闭订单", "提示", { type: "warning" }).then(() => {
        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          settledId: this.settled.guid
        };
        this.$ajax(
          `${this.subUrl.activity}/caa/close`,
          data,
          res => {
            this.getDetail();
            this.$dialog.toast({ mes: "关闭成功" });
          },
          this
        );
      });
      // this.$dialog.confirm({
      //   title: "",
      //   mes: "是否关闭订单",
      //   opts: () => {
      //     var data = {
      //       token: this.$getkey(),
      //       userId: this.userInfo.guid,
      //       settledId: this.settled.guid
      //     };
      //     this.$ajax(
      //       `${this.subUrl.activity}/caa/close`,
      //       data,
      //       res => {
      //         this.getDetail();
      //         this.$dialog.toast({ mes: "关闭成功" });
      //       },
      //       this
      //     );
      //   }
      // });
    },
    deleteItem(e) {
      this.tableList.splice(e, 1);
      this.$dialog.toast({ mes: "删除成功", timeout: 500 });
    },
    setTable(e) {
      this.showTable = true;
      if (e) {
        e.meterRead = e.meterRead + " 00:00:00";
        this.tableList.push(e);
      }
    },
    zhiConfirm() {
      if (this.tableList.length == 0) {
        return this.$dialog.toast({ mes: "请添加抄表记录" });
      }
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        settledId: this.settled.guid
      };
      this.$ajax1(
        `${this.subUrl.activity}/caa/meterRead?${this.$qs.stringify(data)}`,
        this.tableList,
        res => {
          this.showList = false;
          this.getDetail();
          return this.$dialog.toast({ mes: "已抄表", icon: "success" });
        },
        this
      );
    },
    agreeRuZhu() {
      this.$confirm("是否同意入驻", "提示", { type: "warning" }).then(res => {
        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          settledId: this.settled.guid
        };
        this.$ajax(
          `${this.subUrl.activity}/caa/complete`,
          data,
          res => {
            this.$dialog.toast({
              mes: "已同意入驻",
              icon: "success"
            });
            this.getDetail();
          },
          this
        );
      });
    },
    // 添加
    setUserId(e) {
      console.log(e);
      this.showUser = true;
      if (e) {
        console.log(JSON.stringify(e));
        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          settledId: this.settled.guid,
          meterReadId: e.userId
        };
        this.$ajax(
          `${this.subUrl.activity}/caa/assign`,
          data,
          res => {
            this.$dialog.toast({
              mes: "已指派抄表人",
              icon: "success",
              timeout: 400
            });
            this.getDetail();
            // this.$router.go(-1);
          },
          this
        );
      }
    },
    toggle() {
      this.show = !this.show;
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      history.back();
    },
    // 详情
    getDetail() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        settledId: this.$route.query.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/caa/settledDetail`,
        data,
        res => {
          this.detail = res.data;
          this.orderParams = res.data;
          this.settled = res.data.settled;
          this.tasks = res.data.tasks;
          this.tasksRecordList = res.data.tasksRecordList;
          this.meterReadList = res.data.meterReadList;
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
    this.userId = this.userInfo.guid;
    this.getkey = fn.getIng();
    this.decorationId = this.$route.query.guid;

    this.getDetail();
  }
};
</script>
<style lang='scss' scoped>
.timeLineItem {
  font-size: 14px;
  div {
    margin-bottom: 5px;
    padding-left: 5px;
  }
}
.timeLineItemFirst {
  font-weight: 600;
}
/* 抄表 */
/*列表*/
.list_item {
  height: 0.7rem;
  overflow-x: auto;
  white-space: nowrap;
  align-items: center;
  /*margin-top: -1px;*/
  display: flex;
  width: 12rem;
  border-top: 1px solid #ddd;
}

.list_item:last-child {
  border-bottom: 1px solid #ddd;
}

.listBox {
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  max-height: 2.84rem;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.list_item .list_sigle {
  width: 2rem;
  padding: 0 0.1rem;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flex-row-nowarp .label {
  text-align: right;
  padding-right: 0.1rem;
}

.flex-row-nowarp input {
  padding: 0 0.1rem;
  box-sizing: border-box;
  width: 3.4rem;
}

.state {
  border: 1px solid #2d88d4;
  padding: 0.02rem 0.05rem;
  color: #2d88d4;
  margin: 0.3rem 0.3rem 0 0.3rem;
}
.layout_my .header:after {
  display: none;
}
.layout_my {
  background: #eef3fa;
}

.layout_my .blue_box {
  height: 0.88rem;
  background-size: 100% 100%;
}
.organInfos {
  width: 100%;
  background: white;
}
.name {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0.3rem;
  background: white;
  border-bottom: 1px solid #f3f6f5;
}
.name span {
  display: flex;
  border-radius: 0.05rem;
  border: 1px solid #2d88d4;
  color: #2d88d4;
  padding: 0.05rem 0.1rem;
}

.info {
  width: 100%;
  background: white;
  border-bottom: 1px solid #f3f6f5;
  padding: 0.2rem 0.4rem;
  font-size: 14px;
}
.info ul li {
  display: flex;
  line-height: 2;
  position: relative;
}
.info ul li > span {
  width: 1.6rem;
  text-align: right;
  color: #666;
  font-size: 14px;
}
.info ul li > i {
  padding: 0.02rem 0.05rem;
  border: 1px solid #2d88d4;
  font-size: 0.22rem;
  position: absolute;
  right: 0;
  top: 0;
  border-radius: 0.05rem;
  color: #2d88d4;
}

.out {
  width: 100%;
  height: calc(100vh - 0.88rem);
  overflow-y: scroll;
}
.text1 {
  width: 100%;
  background: white;
  margin-top: 0.3rem;
}
.text1 ul {
  width: 100%;
  padding: 0.1rem 0.1rem;
}
.text1 ul > li {
  line-height: 2;
  display: flex;
  align-items: center;
}
.text1 ul > li > p {
  width: 1.6rem;
  text-align: right;
  color: #666;
}
.text1 ul > li > span {
  flex: 1;
  font-size: 14px;
  color: #333;
  padding: 0 0.2rem;
}

.staff {
  width: 100%;
  display: flex;
  flex-flow: column;
  background: white;
  margin-top: 0.3rem;
}
.staff > p {
  width: 100%;
  height: 0.8rem;
  padding: 0 0.3rem;
  display: flex;
  align-items: center;
  border-top: 1px solid #d7d7d7;
  border-bottom: 1px solid #d7d7d7;
  color: #b0b0b0;
}
.staff > ul {
  width: 100%;
  padding: 0 0.3rem;
}
.staff > ul > li {
  height: 1.4rem;
  border-bottom: 1px solid #eff2f2;
  display: flex;
  justify-content: space-between;
  position: relative;
  align-items: center;
}
.staff > ul > li > p {
  padding: 0.1rem 0.1rem;
  display: flex;
  flex-flow: column;
}
.staff > ul > li > p > i {
  font-size: 0.24rem;
  color: #999;
  margin-top: 0.1rem;
}

.aaa {
  height: 0.8rem;
  display: flex;
  justify-content: space-between;
  padding: 0 0.4rem;
  align-items: center;
  background: white;
  margin-top: 0.3rem;
}
.aaa > a {
  width: 1.6rem;
  height: 0.6rem;
  border-radius: 0.04rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.aaa > p > span {
  margin-right: 0.2rem;
}

.status {
  width: 100%;
  background: #fafefd;
  margin-top: 0.3rem;
}
.one {
  width: 100%;
  height: 2rem;
  background: #f8f8f9;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #f2f3f3;
}
.tag {
  width: 70%;
  height: 1.7rem;
  border: 1px solid #f2f3f3;
  position: relative;
  background-color: #fff;
  border-radius: 0.1rem;
}
.arrow {
  position: absolute;
  width: 0.3rem;
  height: 0.3rem;
  top: 0.6rem;
  left: -0.4rem;
}
.arrow * {
  display: block;
  border-width: 0.2rem;
  position: absolute;
  border-style: dashed solid dashed dashed;
  font-size: 0;
  line-height: 0;
}
.arrow em {
  border-color: transparent #f2f3f3 transparent transparent;
}
.arrow span {
  border-color: transparent #fff transparent transparent;
  left: 1px;
}

.one .dot {
  width: 0.6rem;
  height: 0.6rem;
  background: #f8f8f9;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 889;
}
.z {
  position: relative;
  width: 0.6rem;
  height: 0.6rem;
  margin-right: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dot ul {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  background: #999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dot ul li {
  width: 0.16rem;
  height: 0.16rem;
  background: white;
  border-radius: 50%;
}
.dot > div:nth-child(1) {
  width: 0.26rem;
  height: 0.26rem;
  background: #999;
  border-radius: 0.26rem;
}
.status > div:first-child .dot ul {
  background: #23ac38;
}

.result {
  width: 100%;
  height: 100%;
  padding: 0.2rem 0.3rem;
}
.result ul {
  width: 100%;
}
.result ul li:nth-child(1) {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
}
.result ul li:nth-child(1) > p {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b1b1b1;
  font-size: 0.24rem;
}
.result ul li:nth-child(1) > p > i {
  width: 0.3rem;
  height: 0.3rem;
  margin-right: 0.1rem;
}
.result ul li:nth-child(1) > p > i > img {
  height: 100%;
  width: 100%;
}
.result ul li:nth-child(1) > span {
  font-weight: 600;
  margin-bottom: 0.1rem;
  font-size: 0.3rem;
}
.result ul li:nth-child(2),
.result ul li:nth-child(3) {
  font-size: 0.28rem;
  color: #8a8a8a;
  margin-bottom: 0.05rem;
}

.wire {
  width: 0.04rem;
  height: 2rem;
  background: #b1b1b1;
  position: absolute;
  z-index: 888;
  top: -2rem;
}
.status > div:nth-child(1) > .z > .wire {
  display: none;
}

.text {
  position: relative;
  display: flex;
  flex-flow: column;
  width: 100%;
  background: white;
  border-top: 1px solid #e6e8e7;
}
.text > p {
  width: 100%;
  height: 0.7rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.4rem;
  border-bottom: 1px solid #e6e8e7;
}
.text > ul {
  width: 100%;
  padding: 0.1rem 0.3rem;
}
.text > ul > li {
  width: 100%;
  height: 0.5rem;
  display: flex;
  align-items: center;
}
.text > ul > li > p {
  width: 1.6rem;
  text-align: center;
}
.text > i {
  width: 1rem;
  height: 1rem;
  background: red;
  position: absolute;
  right: 0.5rem;
  top: 0.8rem;
}
.text > ol {
  width: 100%;
  padding: 0.1rem 0.4rem;
}
.text > ol > li {
  border-bottom: 1px solid #e6e8e7;
  width: 100%;
  justify-content: space-between;
  display: flex;
  align-items: center;
  height: 0.7rem;
}
.text > ol > li:last-child {
  border: none;
}
.text > div {
  width: 100%;
  display: flex;
}
.text > div > i {
  width: 1.4rem;
  height: 1.4rem;
  margin: 0.1rem 0.25rem;
  border-radius: 0.1rem;
}
.text > div > i > img {
  width: 100%;
  height: 100%;
  border-radius: 0.1rem;
}

.feedback {
  width: 100%;
  padding: 0.1rem 0.4rem;
  display: flex;
  flex-flow: column;
  background: white;
  margin-top: 0.3rem;
}
.feedback > span {
  width: 100%;
  height: 0.6rem;
  color: #c5c5c5;
  font-size: 0.24rem;
  display: flex;
  align-items: center;
}
.feedback > p {
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 0.1rem;
}
.feedback > p > img {
  width: 100%;
  height: 100%;
}

.buttons {
  width: 100%;
  margin: 0.4rem 0;
  display: flex;
  justify-content: center;
}
.buttons > button {
  width: 90%;
  height: 0.8rem;
  color: white;
  font-size: 0.3rem;
  font-weight: 600;
  border-radius: 0.1rem;
  border: none;
}
</style>
