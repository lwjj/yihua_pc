<template>
  <div class="newRightContent" style="overflow:auto">
    <div class="border bgwhite">
      <div class="layout_my yd-layout w75" v-if='showUser'>
        <div class="title">
          <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item v-if="userInfo.organType == 3" :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
              <el-breadcrumb-item @click.native="$router.go(-1)">服务订单</el-breadcrumb-item>
              <el-breadcrumb-item>详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      <!-- <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'接单详情'" title="接单详情" color="#fff" :bgcolor="mainColor"
        height=".88rem">
        <yd-navbar-back-icon slot="left" class="addClickArea" @click.native='$router.go(-1)' color="#fff"></yd-navbar-back-icon>
      </yd-navbar> -->
      <div class="flex-row pd3 bgwhite h8 font32 bb" v-if="result.repairsBill">
        <span>{{result.repairsBill.customerInfo.ridName}}{{result.repairsBill.customerInfo.unitName}}{{result.repairsBill.customerInfo.organName}}</span>
        <span class="pull-right state state1" v-if="result.repairsBill.status==0">已完成</span>
        <span class="pull-right state stateClose" v-if="result.repairsBill.status==1">已关闭</span>
        <span class="pull-right state state2" v-if="result.repairsBill.status==2">草稿</span>
        <span class="pull-right state state2" v-if="result.repairsBill.status==3">客服分配</span>
        <span class="pull-right state state2" v-if="result.repairsBill.status==4">经理分配</span>
        <span class="pull-right state state2" v-if="result.repairsBill.status==5">派单</span>
        <span class="pull-right state state2" v-if="result.repairsBill.status==6">抢单</span>
        <span class="pull-right state state2" v-if="result.repairsBill.status==7">分单</span>
        <span class="pull-right state state2" v-if="result.repairsBill.status==8">处理中</span>
        <span class="pull-right state state2" v-if="result.repairsBill.status==9">用户评价</span>
        <span class="pull-right state stateClose" v-if="result.repairsBill.status==10">客服评价</span>
      </div>

      <!--维修上详情-->
      <div class="mt2 bt bb relative" v-if="result.repairsBill.repairsInfo">
        <div class="contact" @click="contactUS" :style="{color:mainColor,borderColor:mainColor}">
          <yd-icon name="tel2" size=".3rem" :color='mainColor' custom ></yd-icon>
          <span>联系</span>
        </div>
        <div class="contact"></div>
        <div class="div-row">
          <div>维修商</div>{{result.repairsBill.repairsInfo.organName}}
        </div>
        <div class="div-row">
          <div>维修员</div>{{result.repairsBill.repairsInfo.name}}
        </div>
      </div>

      <div v-if="hide" class="mt2">
        <div class="div-row">
          <div>报修人</div>
          {{result.repairsBill.customerInfo.name }}
        </div>
        <div class="div-row">
          <div>单号</div>
          {{result.repairsBill.guid}}
        </div>
        <div class="div-row">
          <div>报修类型</div>
          {{result.repairsBill.typeName }}
        </div>
         <div class="div-row">
          <div>重要等级</div>
          <span v-if="result.repairsBill.level == 1">一般</span>
          <span v-if="result.repairsBill.level == 2">重要</span>
          <span v-if="!result.repairsBill">无</span>
        </div>
        <div class="div-row" v-if="result.repairsBill&&result.repairsBill.speedRating">
          <div>速度评价</div>
          <el-rate
            v-model="result.repairsBill.speedRating"
            disabled
            text-color="#ff9900"
            score-template="{value}"
            style="text-align:left;line-height:20px">
          </el-rate>
        </div>
        <div class="div-row" v-if="result.repairsBill&&result.repairsBill.serviceRating">
          <div>服务评价</div>
          <el-rate
            v-model="result.repairsBill.serviceRating"
            disabled
            text-color="#ff9900"
            score-template="{value}"
            style="text-align:left;line-height:20px">
          </el-rate>
        </div>
        <div class="div-row" v-if="result.repairsBill&&result.repairsBill.costPerformanceRating">
          <div>性价比评价</div>
          <el-rate
            v-model="result.repairsBill.costPerformanceRating"
            disabled
            text-color="#ff9900"
            score-template="{value}"
            style="text-align:left;line-height:20px">
          </el-rate>
        </div>
        <div class="div-row" v-if="result.repairsBill.repairsInfo&&result.repairsBill.overallRating">
          <div>总评价</div>
          <el-rate
            v-model="result.repairsBill.overallRating"
            disabled
            text-color="#ff9900"
            score-template="{value}"
            style="text-align:left;line-height:20px">
          </el-rate>
        </div>
        <div class="div-row" v-if="result.repairsBill.repairsInfo&&result.repairsBill.csOverallRating ">
          <div>客服总评价</div>
          <el-rate
            v-model="result.repairsBill.csOverallRating "
            disabled
            text-color="#ff9900"
            score-template="{value}"
            style="text-align:left;line-height:20px">
          </el-rate>
        </div>
        <!--<div class="div-row">-->
          <!--<div>具体位置</div>-->
          <!--{{result.repairsBill.location}}-->
        <!--</div>-->
      </div>
      <div class="div-row" v-if="result.repairsBill">
        <div>报修时间</div>
        {{result.repairsBill.createDate}}
        <!--<a class="pull-right hide-or-show" :style="`color:${mainColor};border:1px soiid ${mainColor}`" v-if="hide" @click="hideDiv">隐藏</a>-->
        <!--<a class="pull-right hide-or-show" :style="`color:${mainColor};border:1px soiid ${mainColor}`" v-if="!hide" @click="hideDiv">展开</a>-->
      </div>
      <div class="title-img"></div>
      <div class="order-detail" v-if="result.repairsBill">
        <div class="div-remark">{{result.repairsBill.remark}}</div>
        <br>
        <div class="img-flex">
          <!-- <div style="margin:0  0  .1rem .1rem;" v-for="item,index in result.commAccessoryList">
            <img v-if="result.commAccessoryList.length%5!=0" :src="item.path" alt="">
          </div> -->
        </div>
      </div>
      <yd-lightbox style="padding:0 .2rem;" class="bgwhite" :num='result.commAccessoryList?result.commAccessoryList.length:0'>
        <yd-lightbox-img style="width:2rem;height:2rem;margin-right:.1rem" v-for="(item, key) in result.commAccessoryList" :key="key" :src="item.path"></yd-lightbox-img>
      </yd-lightbox>
      <yd-timeline>
        <yd-timeline-item v-for='(item,index) in result.tasksRecordList' :key='index'>
          <!-- <img style="width:.4rem;height:.4rem" src="../../../../../assets/images/rent/estate/chooseSelected.png" slot="icon" v-if='index==0'
            alt=""> -->
            <yd-icon name='tongxinyuan' custom size='.5rem' slot="icon" :color='mainColor'></yd-icon>
          <div class="font32" :style="`color:${mainColor}`">{{item.title}}</div>
          <div class="font28 flex-row  flex-start">
            <span v-if='result.repairsBill.status'>操作人:</span>
            <span>{{item.usetName}}</span>
          </div>
          <div class="font28 flex-row flex-start" v-if='item.remark'>
            <span>备注:</span>
            <span>{{item.remark}}</span>
          </div>
          <p>{{item.createTime}}</p>
        </yd-timeline-item>
      </yd-timeline>
      <div class="order-detail-ing" v-if='showStyle'>
        <div v-if="showEvaluate||showStyle" class="black-bg" @click="cancel"></div>
        <div v-if="showStyle" class="fixed-evaluate select-style">
          <div class="flex-row h9 pdl3" style='border-bottom:1px dashed #ddd'>请选择处理模式</div>
          <div class="flex-row h9 jusCenter foCo3" style='border-bottom:1px dashed #ddd' @click='chooseUser(1)'>
            <img v-if='serviceMode ==1' class="chooseIcon" src="../../../../../assets/images/rent/estate/select_active.png" alt="">
            <img class="chooseIcon" v-else src="../../../../../assets/images/rent/estate/selected.png" alt="">
            <span>内部调度</span>
          </div>
          <div class="flex-row h9 jusCenter" @click='chooseUser(2)'>
            <img v-if='serviceMode ==2' class="chooseIcon" src="../../../../../assets/images/rent/estate/select_active.png" alt="">
            <img class="chooseIcon" v-else src="../../../../../assets/images/rent/estate/selected.png" alt="">
            <span>外部派单</span>
          </div>
        </div>
      </div>

      <!-- 评价框 -->
       <div class="mask" v-if="showEvaluate" @click="showEvaluate=false" style="position:fixed;">
          <div class="bgwhite" @click.stop='""'>
            <!-- <yd-cell-group>
              <yd-cell-item>
                <yd-rate slot="left" v-model="rate1"></yd-rate>
                <span slot="right">速度</span>
              </yd-cell-item>
              <yd-cell-item>
                <yd-rate slot="left" v-model="rate2"></yd-rate>
                <span slot="right">服务</span>
              </yd-cell-item>
              <yd-cell-item>
                <yd-rate slot="left" v-model="rate3"></yd-rate>
                <span slot="right">性价比</span>
              </yd-cell-item>
            </yd-cell-group>
            <textarea name="" style="border:1px solid #ddd;padding:.1rem;width:100%;" v-model="comment" placeholder="请输入评语"></textarea>
             <yd-button type="hollow" class="mt3" @click.native='sureToEvaluate'>发布评价</yd-button> -->
             <el-card class="box-card">
                <div class="text h8 item flex">
                  <el-rate v-model="speedRating"></el-rate> 
                  <span>速度</span>
                </div>
                 <div class="text h8 item flex">
                  <el-rate v-model="serviceRating"></el-rate> 
                  <span>服务</span>
                </div>
                 <div class="text h8 item flex">
                  <el-rate v-model="costPerformanceRating"></el-rate> 
                  <span>性价比</span>
                </div> 
            </el-card> 
            <el-input name="" type='textarea' :max='300' class='mt2' style="width:100%;" resize='none'  :rows='3' size='medium' v-model="comment"  placeholder="请输入评语"></el-input>
             <el-button type="primary" class="mt2" @click.native='sureToEvaluate'>发布评价</el-button>
          </div>
          
        </div>

      <!-- 接单备注 -->
      <div class="mask" v-if="showMask" style="z-index:1000">
       <div class="bgwhite">
         <div class="flex-row jusCenter mb2">处理方式</div>
         <div class="flex-row"><input class="flex1 h7 pdlr1" v-model="remark" style="width:auto" type="text" placeholder="备注"></div>
         <div class="flex-row jusCenter" style="margin:.4rem 0 .2rem">
           <div class="flex1 h7 jusCenter foCoF" style="background:#f00" @click="confirm(0)">拒绝处理</div>
           <div class="flex1 h7 jusCenter foCoF" :style="{background:mainColor}" @click="confirm(1)">确认处理</div>
         </div>
       </div>
      </div>
      <!-- 接单支付 -->
       <div class="mask" v-if="showPay" @click="showPay=false" style="z-index:1000">
        <div class="bgwhite" @click.stop="''">
          <div>需支付</div>
          <div class="jusCenter fuColor2 font36">{{result.bp?result.bp:0}}个商机点</div>
          <yd-cell-group title="" class="mt3">
            <yd-cell-item class="h9" v-for="(item,index) in payList" :key="index" type="radio">
                <yd-icon :name='item.icon' custom slot="icon" class='mr2' size='.5rem' :color='item.color'></yd-icon>
                <span slot="left">{{item.name}}</span>
                <input slot="right" type="radio" :value="item.value" v-model="payWay"/>
            </yd-cell-item>
            <div class="flex-row h8 jusCenter font32 radius mt3" @click="acceptOrder" :style="{background:mainColor,color:'#fff'}">确定</div>
          </yd-cell-group>
        </div>
      </div>
      <!-- 关闭评价 -->
      <!-- <div class="mask" v-show="showcloseCommet" @click="showcloseCommet = false">
        <div class="bgwhite" @click.stop="''">
          <yd-textarea placeholder="请输入评语" v-model="comment" style="height:1.7rem;padding:.1rem;border:1px solid #ddd;margin-bottom:.3rem;"></yd-textarea>
        <yd-button type='hollow'  @click.native="closeCommet">确定</yd-button>
        </div>
      </div> -->

      <div class="mask" v-show="showcloseCommet" @click="showcloseCommet = false">
        <div class="bgwhite" @click.stop="''">
           <!-- <yd-cell-group title="">
              <yd-cell-item>
                  <yd-rate slot="left" v-model="rate4"></yd-rate>
                  <span slot="right">速度</span>
              </yd-cell-item>
              <yd-cell-item>
                  <yd-rate slot="left" v-model="rate5"></yd-rate>
                  <span slot="right">服务</span>
              </yd-cell-item>
              <yd-cell-item>
                  <yd-rate slot="left" v-model="rate6"></yd-rate>
                  <span slot="right">性价比</span>
              </yd-cell-item>
           </yd-cell-group>
        <yd-textarea placeholder="请输入评语" v-model="comment" style="height:1.6rem;padding:.1rem;border:1px solid #ddd;margin-bottom:.3rem;"></yd-textarea>
        <yd-button type='hollow'  @click.native="closeCommet">确定</yd-button> -->
           <el-card class="box-card">
                <div class="text h8 item flex">
                  <el-rate v-model="rate4"></el-rate> 
                  <span>速度</span>
                </div>
                 <div class="text h8 item flex">
                  <el-rate v-model="rate5"></el-rate> 
                  <span>服务</span>
                </div>
                 <div class="text h8 item flex">
                  <el-rate v-model="rate6"></el-rate> 
                  <span>性价比</span>
                </div> 
            </el-card> 
            <el-input name="" type='textarea' :max='300' class='mt2' style="width:100%;" resize='none'  :rows='3' size='medium' v-model="comment"  placeholder="请输入评语"></el-input>
             <el-button type="primary" class="mt2" @click.native='closeCommet'>确定</el-button>
        </div>
      </div>

      <!-- 状态 0：完成，1:关闭 2:草稿，3:客服分配，4:经理分配，5:派单，6:抢单，7:分单，8:处理，9:用户评价，10:客服评价关闭 -->
      <!--  && result.tasks -->
       <div class="evaluate-over-submit text-center" @click="showcloseCommet=true" v-if="result.repairsBill.status==10 && result.tasks"  >
        客服评价
      </div>
      <!-- && result.tasks -->
      <!-- 点击显示评价框 -->
       <div class="evaluate-over-submit text-center" :style="{color:mainColor}" v-if="result.repairsBill.status==9  && result.tasks"
         @click="showEvaluate=true">
        发布评价
      </div>
      <!-- 处理  -->
      <div class="evaluate-over-submit text-center" :style="{color:mainColor}" v-if="result.repairsBill.status==8 && result.tasks"
         @click="showMask=true">
        确定处理
      </div>
      <!-- 经理指派 -->
      <div class="flex-row h9 bgwhite bt font32" v-if='(result.repairsBill.status==4) && result.tasks' >
        <div class="flex1 jusCenter br">
          <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../assets/images/rent/estate/disagree.png" alt="">
          <span style='color:#ff483f;'>拒绝</span>
        </div>
        <div class="flex1 jusCenter" @click='showStyle=true'>
          <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../assets/images/rent/estate/select_active.png" alt="">
          <span :style='{color:mainColor}'>分派</span>
        </div>
      </div>
      <!-- 客服分配 -->
      <!--  -->
      <div class="flex-row h9 bgwhite bt font32"  v-if='(result.repairsBill.status==3) && result.tasks' >
        <div class="flex1 jusCenter br">
          <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../assets/images/rent/estate/disagree.png" alt="">
          <span style='color:#ff483f;cursor: pointer;' @click='closeTask'>任务关闭</span>
        </div>
        <div class="flex1 jusCenter" @click='showStyle=true'>
          <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../assets/images/rent/estate/select_active.png" alt="">
          <span :style='{color:mainColor}'>接单</span>
        </div>
      </div>
       <!-- 接单 -->
      <div class="flex-row jusCenter bgwhite h9 bt" v-if="result.repairsBill.status == 5 || result.repairsBill.status == 6" @click="showPay=true" >
        
        <span :style='{color:mainColor}' class="font32">接单</span>
      </div>
      
      <!-- 商家分单 -->
      <div class="flex-row h9 bgwhite bt font32" v-if='(result.repairsBill.status==7) && result.tasks'>
        <!--<div class="flex1 jusCenter br">-->
          <!--<img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../assets/images/rent/estate/disagree.png" alt="">-->
          <!--<span style='color:#ff483f;'>取消</span>-->
        <!--</div>-->
        <div class="flex1 jusCenter" @click='showUser=false'>
          <yd-icon name='selected' class="mr1" :color='mainColor' custom size='.45rem'></yd-icon>
          <span :style='{color:mainColor}'>分单</span>
        </div>
      </div>
    </div>
    
    <departMent v-if='!showUser' @setUserId='setUserId'></departMent>
    </div>
    
  </div>
</template>
<script>
// 部分覆盖样式
import "@/assets/css/wuye.css";
import fn from "@/assets/js/product";
import qs from "qs";
import "vue-ydui/dist/ydui.base.css";
import departMent from "../wuye/repair/department_manager";
import Vue from "vue";
import { Rate } from "vue-ydui/dist/lib.rem/rate";
import { TimeLine, TimeLineItem } from "vue-ydui/dist/lib.rem/timeline";
import {
  LightBox,
  LightBoxImg,
  LightBoxTxt
} from "vue-ydui/dist/lib.rem/lightbox";
Vue.component(LightBox.name, LightBox);
Vue.component(LightBoxImg.name, LightBoxImg);
Vue.component(LightBoxTxt.name, LightBoxTxt);

Vue.component(TimeLine.name, TimeLine);
Vue.component(TimeLineItem.name, TimeLineItem);
Vue.component(Rate.name, Rate);
import { CellGroup, CellItem } from "vue-ydui/dist/lib.rem/cell";
Vue.component(CellGroup.name, CellGroup);
Vue.component(CellItem.name, CellItem);
import { Icons } from "vue-ydui/dist/lib.rem/icons";
/* 使用px：import {Icons} from 'vue-ydui/dist/lib.px/icons'; */

Vue.component(Icons.name, Icons);
import { TextArea } from "vue-ydui/dist/lib.rem/textarea";
/* 使用px：import {TextArea} from 'vue-ydui/dist/lib.px/textarea'; */

Vue.component(TextArea.name, TextArea);
import { Button, ButtonGroup } from "vue-ydui/dist/lib.rem/button";
/* 使用px：import {Button, ButtonGroup} from 'vue-ydui/dist/lib.px/button'; */

Vue.component(Button.name, Button);
Vue.component(ButtonGroup.name, ButtonGroup);

export default {
  components: {
    departMent
  },
  data() {
    return {
      // 1个人账号，2企业账号
      rate4: 5,
      rate5: 5,
      rate6: 5,
      payList: [
        {
          name: "个人账号",
          value: "1",
          icon: "gerenzhanghao",
          color: "#8ca7ff"
        },
        {
          name: "企业账号",
          value: "2",
          icon: "qiye",
          color: "#ffcd55"
        }
      ],
      payWay: 1,
      showPay: false,
      showcloseCommet: false,
      showMask: false,
      showUser: true,
      organInfo: "",
      hasMessage: {
        count: 99,
        new: true
      },
      value2: "",
      result: { repairsBill: { customerInfo: {} } },
      url: this.fromRoute ? this.fromRoute : "",
      userInfo: "",
      mainColor: "",
      guid: "",
      showEvaluate: false,
      comment: "",
      serviceMode: -1,
      speedRating: 5,
      serviceRating: 5,
      costPerformanceRating: 5,
      showStyle: "",
      StatusDescript: "",
      hide: true,
      rate1: 5,
      rate2: 5,
      rate3: 5,
      // rate1: 5,
      // rate2: 5,
      // rate3: 6,
      remark: ""
    };
  },

  methods: {
    confirmDo() {},
    contactUS() {
      this.$alert(`请联系${this.result.repairsBill.repairsInfo.account}`, {
        callback: () => {
          location.href = `tel://${
            this.result.repairsBill.repairsInfo.account
          }`;
        }
      });
    },
    acceptOrder() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        orderId: this.result.repairsBill.guid,
        type: this.payWay
      };
      this.$ajax(
        `${this.subUrl.activity}/serviceOrder/orderTaking`,
        data,
        res => {
          this.showPay = false;
          this.$message({ message: "已接单", type: "success" });
          this.getOrderDetail();
        },
        this
      );
    },
		closeTask(){
			console.log(111)
    	var data = {
        userId: this.userId,
        token: this.getkey,
        orderId: this.guid
      };
      this.$confirm('是否关闭任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
		      this.$ajax(
		        `${this.subUrl.activity}/serviceOrder/closeTask`,
		        data,
		        res => {
		          this.showcloseCommet = false;
		          this.comment = "";
		          this.$message({ message: "关闭成功!", type: "success" });
		          this.getOrderDetail();
		        },
		        this
		      );
		      });
    },
    closeCommet() {
      // if (this.comment == "") {
      //   return this.$message({ message: "请输入评语" });
      // }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        taskId: this.result.repairsBill.guid,
        comment: this.comment,
        speedRating: this.rate4,
        serviceRating: this.rate5,
        costPerformanceRating: this.rate6
      };
      this.$ajax(
        `${this.subUrl.activity}/repairs/csEvaluation`,
        data,
        res => {
          this.showcloseCommet = false;
          this.comment = "";
          this.$message({ message: "评价成功!", type: "success" });
          this.getOrderDetail();
        },
        this
      );
    },
    setUserId(e) {
      console.log(e);
      this.showUser = true;
      console.log(this.result);
      if (e) {
        var data = {
          token: this.$getkey(),
          serviceMode: this.serviceMode,
          taskId: this.result.repairsBill.guid,
          userId: this.userInfo.guid,
          managerId: e.userId
        };
        this.showStyle = false;
        console.log(data);
        if (this.result.repairsBill.status == 3) {
          this.$ajax(
            `${this.subUrl.activity}/repairs/csAllocation`,
            data,
            res => {
              this.$message({
                message: "成功!",
                type: "success"
              });
              this.getOrderDetail();
            },
            this
          );
        } else if (this.result.repairsBill.status == 4) {
          data.result = 1;
          data.handleId = data.managerId;
          this.$ajax(
            `${this.subUrl.activity}/repairs/managerAllocation`,
            data,
            res => {
              this.$message({
                message: "成功!",
                type: "success"
              });
              this.getOrderDetail();
            },
            this
          );
        } else if (this.result.repairsBill.status == 7) {
          data.result = 1;
          data.handleId = data.managerId;
          this.$ajax(
            `${this.subUrl.activity}/serviceOrder/allocation`,
            data,
            res => {
              this.$message({
                message: "分配成功!",
                type: "success",
                timeout: 1500
              });

              this.getOrderDetail();
            },
            this
          );
        }
      }
    },
    // 处理方式
    confirm(e) {
      if (this.remark == "") {
        return this.$message({
          message: "请输入备注！"
        });
      }
      console.log(this);
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        taskId: this.result.repairsBill.guid,
        result: e,
        remark: this.remark
      };
      this.$ajax(
        `${this.subUrl.activity}/repairs/handle`,
        data,
        res => {
          this.showMask = false;
          let txt = e ? "已处理!" : "已拒绝处理!";
          this.$message({ message: txt });
          this.getOrderDetail();
        },
        this
      );
    },
    // 选择调度模式
     chooseUser(e) {
      this.serviceMode = e;
      if (e == 1) {
        this.showUser = false;
      } else {
        var data = {
          token: this.$getkey(),
          serviceMode: 2,
          taskId: this.result.repairsBill.guid,
          userId: this.userInfo.guid
        };
        this.showStyle = false;
        console.log(data);
        if (this.result.repairsBill.status == 3) {
          data.organIds = "";
          this.$ajax(
            `${this.subUrl.activity}/repairs/csAllocation`,
            data,
            res => {
              this.$message.success('外派成功')
              this.getOrderDetail();
            },
            this
          );
        }
      }
    },
    hideDiv() {
      this.hide = !this.hide;
    },
    itemClickHandler() {},
    clearLoacl() {
      this.alertS = true;
    },
    cancel() {
      this.showEvaluate = false;
      this.showStyle = false;
    },
    quit() {
      this.alertS = false;
    },
    toEvaluate() {
      this.showEvaluate = true;
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
    },
    sureToEvaluate(cb) {
      // if (!this.comment || this.comment == "") {
      //   return this.$message({ message: "请输入评语!", type: "error" });
      // }
      var data = {
        userId: this.userId,
        token: this.getkey,
        taskId: this.guid,
        speedRating: this.speedRating,
        serviceRating: this.serviceRating,
        costPerformanceRating: this.costPerformanceRating,
        comment: this.comment
      };
      this.xhr
        .post(
          `${this.subUrl.activity}/repairs/userEvaluation?` + qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
            this.showEvaluate = false;
            this.comment = "";
            this.getOrderDetail();
            this.$message({ message: "评价成功!", type: "success" });
            this.getOrderDetail();
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$message({ message: res.data.msg });
          }
        });
    },
    getStatusToSHow(status) {
      switch (status) {
        case 0:
          this.StatusDescript = "已完成";
        case 1:
          this.StatusDescript = "已关闭";
        case 2:
          this.StatusDescript = "草稿";
        case 3:
          this.StatusDescript = "客服分配";
        case 4:
          this.StatusDescript = "经理分配";
        case 5:
          this.StatusDescript = "派单";
        case 6:
          this.StatusDescript = "抢单";
        case 7:
          this.StatusDescript = "分单";
        case 8:
          this.StatusDescript = "处理中";
        case 9:
          this.StatusDescript = "用户评价";
        case 10:
          this.StatusDescript = "客服评价";
      }
    },
    getOrderDetail(cb) {
      var data = {
        userId: this.userId,
        token: this.getkey,
        orderId: this.guid
      };
      this.xhr
        .post(
          `${this.subUrl.activity}/serviceOrder/getOrderDetail?` +
            qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
            console.log("获取详情！");
            this.result = res.data.data;
            this.getStatusToSHow(this.result.repairsBill.status);
            cb && cb();
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$message({ message: res.data.msg, type: "error" });
          }
        });
    }
  },
  mounted() {
    if (this.$route.query.guid) {
      this.guid = this.$route.query.guid;
    }
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
    var that = this;
    this.getUserInfo(function() {
      that.getOrderDetail();
    });
  }
};
</script>
<style scoped>
.contact {
  position: absolute;
  right: 0.3rem;
  border: 1px solid #ddd;
  padding: 0.03rem 0.05rem;
  font-size: 0.24rem;
  bottom: 0.1rem;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
.mask {
  z-index: 20;
}
.mask > div {
  position: absolute;
  left: 50%;
  right: 0;
  top: 50%;

  transform: translate(-50%, -50%);
  padding: 0.3rem 0.5rem;
  border-radius: 0.1rem;
}
/* 弹窗 */

.select-style {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 300000;
}

.fixed-evaluate {
  margin: 0;
}

.status-type01 {
  font-size: 0.24rem;
  border: 1px solid #5881ff;
  line-height: 1.2em;
  color: #5881ff;
  padding: 0.03rem 0.05rem;
}

.status-type02 {
  font-size: 0.24rem;
  padding: 0.03rem 0.05rem;
  border: 1px solid orange;
  line-height: 1.2em;
  color: orange;
}
.status-type03 {
  font-size: 0.24rem;
  padding: 0.03rem 0.05rem;
  border: 1px solid #999999;
  line-height: 1.2em;
  color: #999999;
}

.div-row {
  width: 100%;
  color: #333333;
  background: #ffffff;
  padding-left: 1em;
  line-height: 2.5em;
  font-size: 15px;
}

.div-row div {
  display: inline-block;
  width: 20%;
  text-align: right;
  margin-right: 1.5em;
  color: #6b6b6b !important;
}

/*.layout_my{*/

/*background: #f7f7f9;*/

/*}*/

.layout_my .header:after {
  display: none;
}

.title-img {
  font-size: 12px;
  height: 1em;
  color: #5b6b6b;
  padding-left: 1.5em;
  line-height: 2.5em;
}

.img-flex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

.div-remark {
  line-height: 1.8em;
  min-height: 6em;
  padding: 0 0.5em;
  padding-top: 0.5em;
  border: 1px solid #eeeeee;
  margin: 0.3em 0.5em;
}

.img-flex div > img {
  width: 1.5rem;
  height: 1.5rem;
}

.order-detail {
  width: 100%;
  background: #ffffff;
  border-radius: 4px;
  padding-top: 0.3em;
}

.left-list-item {
  width: 1.5em;
  height: 1.5em;
  padding: 0.44em;
  border-radius: 0.75em;
  background: rgb(0, 147, 210);
  border: 1px solid rgb(0, 147, 210);
  margin-left: 8%;
  margin-bottom: 6.5em;
}

.left-list-item > div {
  width: 100%;
  height: 100%;
  border-radius: 0.35em;
  background: #fff;
  padding: 0.168em;
}

.left-list-item > div > div {
  width: 100%;
  height: 6em;
  background: rgb(153, 151, 153);
  margin-top: 1em;
}

.triangle {
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  /* border-top: 10px solid #5851c3; */
  border-right: 0px solid transparent;
  border-bottom: 15px solid #ffffff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  float: left;
  margin-left: 18%;
  margin-top: -31%;
}

.order-detail-ing {
  padding-top: 12%;
  margin-top: 1em;
  width: 100%;
  background: rgb(248, 248, 249);
  padding-bottom: 0.01em;
  margin-bottom: 3em;
}

.order-ing-content {
  float: left;
  margin-left: 18%;
  left: 15px;
  margin-top: -37%;
  width: 65%;
  position: absolute;
  min-height: 7em;
  background: #ffffff;
}

.order-ing-content div {
  line-height: 2em;
  padding-left: 1em;
  color: #6b6b6b;
}

.order-ing-content div > span {
  line-height: 1em;
  font-size: 12px;
  padding-left: 1em;
  float: right;
  margin: 0.5em;
  color: #6b6b6b;
}

.order-ing-content .div-first-child {
  font-size: 16px;
  color: #5881ff;
  min-height: 32px;
}

.btn-sure-ok {
  position: fixed;
  bottom: 0;
  background: #ffffff;
  border-top: 1px solid #e6e6e6;
  line-height: 4em;
  color: #6b6b6b;
  width: 100%;
}

.hide-or-show {
  margin-right: 1em;
  font-size: 12px;
  color: #5881ff;
}

.width-100 {
  width: 100%;
  line-height: 2.5em;
}

.width-100 img-div {
  padding-left: 10%;
}
</style>
