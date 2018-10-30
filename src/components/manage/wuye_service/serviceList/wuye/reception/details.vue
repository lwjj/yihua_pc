<template>
<div class="newRightContent" style="overflow:auto">
<div class="bgwhite border" style="height:100%;overflow:auto">
  <div class="layout_my yd-layout" style="width:750px;" v-if="showUser && !showReplay">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
            <el-breadcrumb-item  @click.native='$back'>接待单</el-breadcrumb-item>
            <el-breadcrumb-item>接待单详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

    <div class="organInfos">
      <div class="name">
        <p class="font32 font600 textHidden">{{dateils.customerName}}</p>
        <!-- <span v-show="dateils.status!=null" class="font22" :style="{border:'1px solid '+mainColor,color:mainColor}">{{dateils.status}}</span> -->
        <!-- 上报中：1，已接单：2，处理中：3，待确认：4，已完成：5，关闭：6,不同意：7） -->
          <span class="pdlr1 state state2" v-if="dateils.status == 1">上报中</span>
          <span class="pdlr1 state state2" v-if="dateils.status == 2">已接单</span>
          <span class="pdlr1 state state2" v-if="dateils.status == 3">处理中</span>
          <span class="pdlr1 state state2" v-if="dateils.status == 4">待确认</span>
          <span class="pdlr1 state state1" v-if="dateils.status == 5">已完成</span>
          <span class="pdlr1 state stateClose" v-if="dateils.status == 6">关闭</span>
          <span class="pdlr1 state state0" v-if="dateils.status == 7">不同意</span>
      </div>
      <div class="info">
         <ul>
           <li><span>报告人：</span><p>{{dateils.applyUserName}}</p></li>
           <li><span>单号：</span><p>{{dateils.guid}}</p></li>
           <li><span>接待时间：</span><p>{{dateils.receptionDate}}</p></li>
           <li><span>接待地点：</span><p>{{dateils.receptionAddr}}</p></li>
           <li><span>填写日期：</span><p>{{dateils.createDate}}</p></li>
           <li><span>重要等级：</span><p><span v-if="dateils.reLevel == 1">一般</span><span v-if="dateils.reLevel == 2">重要</span>
                  <span v-if="!dateils.reLevel">无</span>
              </p>
          </li>
          
         </ul>
      </div>
    </div>
    <div class="details">
       <ul>
           <li v-for="(item,index) in typeArr" :key="index">
              <yd-icon name='selected' v-if="item.selected" custom size='.4rem' :color='mainColor'></yd-icon>
               <!-- <i v-if="active==index*1 + 1"><img  src="../../../../../../assets/images/rent/estate/select_active.png" alt=""></i> -->
               <i v-else><img src="../../../../../../assets/images/rent/estate/select.png" alt=""></i>
               <p class="font30 font600">{{item.name}}</p>
           </li>
       </ul>
       

        <div class="ss">
          <p class="textHidden4">{{dateils.detailContent}}</p>
        </div>
        <div class="images" v-if="commAccessoryList && commAccessoryList.length">
           <yd-lightbox :num='commAccessoryList.length'>
             <ul class="" style="overflow:hidden">
              <li v-for="(item,index) in commAccessoryList" style="float:left;margin:0 10px 10px 0" :key="index">
                <!-- <img :src="item.path" alt=""> -->
                <yd-lightbox-img :src="item.path" style="width:1.12rem;height:1.12rem"></yd-lightbox-img>
                </li>
            </ul> 
          </yd-lightbox> 
        </div>
    </div>
   
    <div class='buttons'  v-if="result.tasks  && result.reception.status == 4 "><button @click="agree4" :style="{background:mainColor}">确定完成</button></div>
    <div class='buttons'  v-if=" result.tasks &&result.reception.status == 5 && result.tasks.name=='待评价'"><button @click="confirm" :style="{background:mainColor}">评价</button></div>
    <div v-show="show2" class="evaluate" @click="show2 = false">
      <div class="" @click.stop="''">
         <el-card class="box-card">
                <div class="text h8 item flex">
                  <el-rate v-model="rate1"></el-rate> 
                  <span>速度</span>
                </div>
                 <div class="text h8 item flex">
                  <el-rate v-model="rate2"></el-rate> 
                  <span>服务</span>
                </div> 
            </el-card> 
            <el-input name="" type='textarea' :max='300' class='mt2' style="width:100%;" resize='none'  :rows='3' size='medium' v-model="rate3"  placeholder="请输入评语"></el-input>
             <el-button type="primary" class="mt2" @click.native='release'>发布评价</el-button>
      </div> 
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
     
    <!-- 显示意见和获取 -->
    <div class="mask" v-if="showAdvice" @click="showAdvice = false">
      <div class="bgwhite" style="padding:.5rem 0;" @click.stop='""'>
        <div class="top" style="padding:0 .5rem;">
          <yd-textarea class="border pdlr1" maxlength='100' placeholder='请输入备注' v-model="remark" style="margin:.03rem 0;">

          </yd-textarea>
        </div>
        <div class="flex-row h7" @click="showUser=false"> 
          <input type="text"  class="flex1 jusCenter" readonly placeholder="选择执行人" style="height:100%;margin: 0.2rem .5rem 0;">
        </div>
      </div>
    </div>
    <!-- agree2 -->
    <!-- 完成评价 -->
      <!-- <div class="flex-row h8 center jusCenter" @click="showEvaluate = true" v-if="tasks && result.reception.status == 5" :style="{background:mainColor,color:'#fff',margin:'.3rem .5rem','border-radius':'.1rem'}">
        评价
      </div> -->
        <!-- 客服处理 -->
        <div class="flex-row h9 bgwhite bt font32" v-if='result.tasks && result.reception.status==1' slot='bottom'>
        <!-- 111 -->
        <div class="flex1 jusCenter br" @click="disagree1">
          <yd-icon custom name='delete' color='#f00'></yd-icon>
          <!-- <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/disagree.png" alt=""> -->
          <span style='color:#ff483f;'>关闭</span>
        </div>
        <div class="flex1 center jusCenter" @click='agree1'>
          <yd-icon custom name='selected' style="padding-top:.1rem;" class="mr1" size='.4rem' :color='mainColor'></yd-icon>
          <!-- <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/select_active.png" alt=""> -->
          <span :style='{color:mainColor}'>安排处理</span>
        </div>
      </div>
      <!-- 审批人处理 -->
        <div class="flex-row h9 bgwhite bt font32" style='overflow:hidden;' v-if='result.tasks && result.reception.status==2' slot='bottom'>
        <!-- 111 -->
        <!-- <div class="flex1 jusCenter br" @click="disagree2">
          <yd-icon custom name='delete' color='#f00'></yd-icon>
          <span style='color:#ff483f;'>拒绝</span>
        </div> -->
        <div class="flex1 center jusCenter" @click='agree2'>
          <yd-icon custom name='selected' style="padding-top:.1rem;" class="mr1" size='.4rem' :color='mainColor'></yd-icon>
          <!-- <img style="width:.4rem;height:.4rem;" class="mr1" src="../../../../../../assets/images/rent/estate/select_active.png" alt=""> -->
          <span :style='{color:mainColor}'>分派</span>
        </div>
      </div>
      <!-- 处理人确定 -->
      <div class="flex-row h9 bgwhite bt font32" style='overflow:hidden;box-sizing:border-box' v-if='result.tasks && result.reception.status==3' slot='bottom'>
        <!-- 111 -->
        <div class="flex1 jusCenter " @click="agree3">
          <span :style='{color:mainColor}' class="flex1  jusCenter center">执行人确定</span>
        </div>
      </div>
    </div>
     <departMent v-if='!showUser' @setUserId='setUserId'></departMent>
      <replay v-if="showReplay" @operate="operate" ></replay>
</div>
</div>
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";
import { TextArea } from "vue-ydui/dist/lib.rem/textarea";
import { Input } from "vue-ydui/dist/lib.rem/input";
import {
  Confirm,
  Alert,
  Toast,
  Notify,
  Loading
} from "vue-ydui/dist/lib.rem/dialog";
import { Rate } from "vue-ydui/dist/lib.rem/rate";
import departMent from "../repair/department_manager";
import replay from "../rectification/replay";
Vue.component(Rate.name, Rate);
import {TimeLine, TimeLineItem} from 'vue-ydui/dist/lib.rem/timeline';
Vue.component(TimeLine.name, TimeLine);
Vue.component(TimeLineItem.name, TimeLineItem);
import "@/assets/css/wuye.css";

//预览图片引入组件
import {
  LightBox,
  LightBoxImg,
  LightBoxTxt
} from "vue-ydui/dist/lib.rem/lightbox";
/* 使用px：import {Accordion, AccordionItem} from 'vue-ydui/dist/lib.px/accordion'; */

Vue.component(LightBox.name, LightBox);
Vue.component(LightBoxImg.name, LightBoxImg);
Vue.component(LightBoxTxt.name, LightBoxTxt);

Vue.prototype.$dialog = {
  confirm: Confirm,
  alert: Alert,
  toast: Toast,
  notify: Notify,
  loading: Loading
};

Vue.component(Input.name, Input);

Vue.component(TextArea.name, TextArea);
var userInfo;
export default {
  components: {
    departMent,
    replay
  },
  data() {
    userInfo = JSON.parse(decodeURIComponent(localStorage.getItem("userInfo")));
    return {
      rate1: 5,
      rate2: 5,
      rate3: "",
      rete3: "", //报错未找到哪使用了这个数据
      userInfo: userInfo,
      organInfo: {},
      showUser: true,
      showReplay: false,
      commAccessoryList: [],
      showAdvice: false,
      active: "",
      show1: true,
      show2: false,
      images: [],
      remark: "",
      getkey: "",
      mainColor: "",
      input8: "",
      alertT: false,
      info: {
        name: "",
        tel: "",
        pid: ""
      },
      list: [],
      getHearLog: {
        domain: "",
        token: "",
        name: ""
      },
      imgName: [],
      imgUrl: [],

      statusList: [],
      d: true,
      userId: "",
      receptionId: "",
      dateils: {},
      type: ["车位", "横幅", "专用电梯"],
      status: ["上报成功", "已接单", "处理成功", "已评价", "关闭"],
      tasksRecordList: [],
      typeArr: [
        { name: "车位", value: 1 },
        { name: "横幅", value: 2 },
        { name: "专用电梯", value: 3 }
      ],
      result: {},
      tasks: null
    };
  },
  computed: {
    lists() {
      return this.list;
    }
  },
  methods: {
    setUserId(e) {
      this.showUser = true;
      if (e) {
        console.log(e);
        this.approverName = e.userName;
        this.approverId = e.userId;
        let data = {
          token: this.$getkey(),
          userId: userInfo.guid,
          receptionId: this.result.reception.guid,
          assigneeId: e.userId
        };
        if (this.currentType == 1) {
          this.$ajax(
            `${this.subUrl.activity}/reception/serviceHandle`,
            data,
            res => {
              this.getReception();
              this.$dialog.toast({ mes: "已提交给审批人", icon: "success" });
            },
            this
          );
        } else if (this.currentType == 2) {
          data.opinion = 1;
          data.comment = this.remark ? this.remark : "";
          this.$ajax(
            `${this.subUrl.activity}/reception/manageAssign`,
            data,
            res => {
              this.getReception();
              this.$dialog.toast({ mes: "已安排处理", icon: "success" });
            },
            this
          );
        } else if (this.currentType == 3) {
        }
        this.remark = "";
        this.showAdvice = false;
      }
    },
    // 带回复的
    operate(e) {
      this.showReplay = false;
      if (e) {
        console.log(e);
        var data = {
          token: this.$getkey(),
          userId: userInfo.guid,
          receptionId: this.result.reception.guid,
          remark: e
        };
        // 经理拒绝
        if (this.replayType == 1) {
          data.opinion = 2;
          this.$ajax(
            `${this.subUrl.activity}/reception/manageAssign`,
            data,
            res => {
              this.$dialog.toast({
                mes: "已拒绝",
                icon: "success",
                timeout: 1000
              });
              this.getReception();
            },
            this
          );
        } else if (this.replayType == 2) {
          this.$ajax(
            `${this.subUrl.activity}/reception/executorHandle`,
            data,
            res => {
              this.$dialog.toast({
                mes: "已确定",
                icon: "success",
                timeout: 1000
              });
              this.getReception();
            },
            this
          );
        }
      }
    },
    // 客服关闭
    disagree1() {
      console.log(this);
      console.log(userInfo);
      this.$confirm("是否关闭接待").then(() => {
        var data = {
          token: this.$getkey(),
          userId: userInfo.guid,
          receptionId: this.result.reception.guid
        };
        this.$ajax(
          `${this.subUrl.activity}/reception/close`,
          data,
          res => {
            this.getReception();
            this.$dialog.toast({ mes: "已关闭接待", icon: "success" });
          },
          this
        );
      });
    },
    // 客服同意
    agree1() {
      this.currentType = 1;
      this.showUser = false;
    },
    agree2() {
      // 经理同意
      this.currentType = 2;
      this.showAdvice = true;
    },
    //执行人确定
    agree3() {
      // this.showReplay = true;
      // this.replayType = 2;
      this.$confirm("是否确认处理完成").then(() => {
        var data = {
          token: this.$getkey(),
          userId: userInfo.guid,
          receptionId: this.result.reception.guid
        };
        this.$ajax(
          `${this.subUrl.activity}/reception/executorHandle`,
          data,
          res => {
            this.$dialog.toast({
              mes: "已确定",
              icon: "success",
              timeout: 1000
            });
            this.getReception();
          },
          this
        );
      });
    },
    // 租户确定
    agree4() {
      this.$confirm("是否确定完成").then(() => {
        var data = {
          token: this.$getkey(),
          userId: userInfo.guid,
          receptionId: this.result.reception.guid
        };
        this.$ajax(
          `${this.subUrl.activity}/reception/userConfirm`,
          data,
          res => {
            this.getReception();
            this.$dialog.toast({ mes: "已确定", icon: "success" });
          },
          this
        );
      });
    },
    disagree2() {
      this.showReplay = true;
      this.replayType = 1;
    },
    release() {
      if (this.rate3 == "") {
        return this.$dialog.toast({ mes: "请输入评语", timeout: "400" });
      }
      let data = {
        token: this.$getkey(),
        userId: userInfo.guid,
        speedEvaluate: this.rate1,
        serviceEvaluate: this.rate2,
        comment: this.rate3,
        receptionId: this.result.reception.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/reception/evaluate`,
        data,
        res => {
          this.showEvaluate = false;
          this.$dialog.toast({
            mes: "已评价",
            timeout: "400",
            icon: "success"
          });
          this.rate3 = "";
          this.getReception();
        },
        this
      );
      this.show2 = false;
    },
    confirm() {
      this.show2 = true;
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      history.back();
    },
    // 获取邀请信息列表
    getReception() {
      var data = {
        token: this.getkey,
        userId: this.userId,
        receptionId: this.receptionId
      };
      this.xhr
        .post(
          `${this.subUrl.activity}/reception/getReception`,
          qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
            console.log(res);
            this.dateils = res.data.data.reception;
            res.data.data.tasksRecordList.forEach(element => {
              element.createTime = element.createTime.split(" ")[0];
            });
            var arr = res.data.data.reception.type.split(",");
            for (var [i, val] of arr.entries()) {
              this.$set(this.typeArr[val - 1], "selected", true);
            }
            this.tasksRecordList = res.data.data.tasksRecordList;
            this.commAccessoryList = res.data.data.commAccessoryList;
            this.active = this.dateils.type;
            this.result = res.data.data;
            // console.log(res)
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
    this.getkey = fn.getIng();
    console.log(this.$route);
    this.receptionId = this.$route.query.guid;
    this.getReception();
  },
  beforeUpdate() {
    // this.imgName.forEach(item=>{
    //     this.imgUrl.push(this.getHearLog.domain+'/'+item)
    // })

    if (this.imgName.length >= 5) {
      this.show1 = false;
    }
  }
};
</script>
<style scoped>
.timeLineItemFirst{
  font-weight: 600;
}
div{
  font-size: 14px;
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
.organInfos {
  width: 100%;
}
.name {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0.3rem;
  background: white;
  border-bottom: 1px solid #f3f6f5;
}
.name > p {
  width: 5.5rem;
}
.name > span {
  border-radius: 0.05rem;
  /* border: 1px solid #2d88d4;
  color: #2d88d4; */
  padding: 0.05rem 0.1rem;
}
span {
  font-size: 14px;
}
.info {
  width: 100%;
  background: white;
  padding: 0.1rem 0.3rem;
  font-size: 14px;
  position: relative;
}
.info ul li {
  display: flex;
  height: 0.5rem;
}
.info ul li > span {
  width: 1.3rem;
  text-align: right;
  color: #666;
}
.info ul li > p {
  flex: 1;
  margin-left: 0.2rem;
  font-size: 14px;
}
.info > p {
  font-size: 0.28rem;
  color: #2d88d4;
  position: absolute;
  bottom: 0.15rem;
  right: 0.3rem;
}

.details {
  width: 100%;
  margin-top: 0.2rem;
  background: white;
  padding: 0.2rem;
  border-bottom: 1px solid #e5e5e5;
}
.details > ul {
  width: 100%;
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  align-content: center;
}
.details > ul li {
  display: flex;
  margin-bottom: 0.2rem;
  justify-content: center;
  align-items: center;
}
.details > ul li > i {
  width: 0.4rem;
  height: 0.4rem;
  /* margin-right: 0.1rem; */
}
.details > ul li > i > img {
  width: 100%;
  height: 100%;
}
.ss {
  border: 1px solid #ddd;
  border-radius: 0.05rem;
  padding: 0.2rem 0.2rem;
  line-height: 0.4rem;
}

.images {
  margin-top: 0.2rem;
  display: flex;
}
.images > p {
  border: 2px dashed #ddd;
  width: 1.2rem;
  height: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.1rem;
  position: relative;
}
.images > p > img {
  width: 0.6rem;
  height: 0.6rem;
}
.images > ul {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}
.images > ul > li {
  width: 1.2rem;
  height: 1.2rem;
  margin: 0 0.1rem;
}
.images > ul > li > img {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 0.1rem;
}
.images > p > input {
  width: 100%;
  height: 0.9rem;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
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

.evaluate {
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  transform: translate(0, 0, 0);
}
.evaluate ul {
  background: #f8f8f9;
  border-radius: 0.2rem;
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  display: flex;
  flex-flow: column;
  align-items: center;
}
.evaluate > div {
  width: 600px;
  padding: 30px 50px;
  background: #fff;
  position: absolute;
  border-radius: 0.2rem;

  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
}
.evaluate ul li {
  display: flex;
  justify-content: center;
  align-items: center;
}
.evaluate ul li:nth-child(1) {
  width: 100%;
  height: 1rem;
  margin-top: 0.2rem;
  justify-content: flex-start;
  padding: 0 0.5rem;
}
.evaluate ul li:nth-child(1) p {
  margin-right: 0.3rem;
  color: #686868;
}
.evaluate ul li:nth-child(2) p {
  margin-right: 0.3rem;
  color: #686868;
}
.evaluate ul li:nth-child(2) {
  width: 100%;
  height: 1rem;
  justify-content: flex-start;
  padding: 0 0.5rem;
}
.evaluate ul li:nth-child(3) {
  margin-top: 0.3rem;
  width: 90%;
  height: 2.4rem;
  /* border: 1px solid #e9e9ea; */
  border-radius: 0.1rem;
}
.evaluate ul li:nth-child(3) textarea {
  width: 100%;
  height: 2.4rem;
  border-radius: 0.1rem;
}
.evaluate ul li:nth-child(4) {
  width: 100%;
  height: 1rem;
  border-top: 1px solid #eaeae9;
  background: white;
  margin-top: 0.25rem;
  border-radius: 0 0 0.2rem 0.2rem;
}

.status {
  width: 100%;
  background: #f8f8f9;
  margin-top: 0.3rem;
}
.one {
  width: 100%;
  min-height: 2rem;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  /* border-bottom: 1px solid #f2f3f3; */
  background: #f8f8f9;
  margin-bottom: 0.2rem;
}
.tag {
  width: 5.5rem;
  box-sizing: border-box;
  min-height: 1.7rem;
  border: 1px solid #e4e4e4;
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
  border-color: transparent #d3d3d3 transparent transparent;
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
  z-index: 111;
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
  width: 0.18rem;
  height: 0.18rem;
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
  font-size: 14px;
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
  z-index: 110;
  top: -2rem;
}
.status > div:nth-child(1) > .z > .wire {
  display: none;
}
</style>
