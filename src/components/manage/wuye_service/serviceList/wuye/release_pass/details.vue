<template>
  <div class="newRightContent" style="overflow:auto">
    <div class="border bgwhite">
      <yd-layout class="yd-layout" style="width:750px">
        <!-- <yd-navbar class="header" :title="title?title:'客户放行条'" slot="navbar" v-show="!userAgent.isWX"  color="#fff" :bgcolor="mainColor" height=".88rem">
         <div class="addClickArea" slot="left" @click="back">
            <span ><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </div>
      </yd-navbar> -->
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
            <el-breadcrumb-item @click.native="$back">放行条</el-breadcrumb-item>
            <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
        </el-breadcrumb> 
      </div>
    <div class="out">
     <div class="organInfos">
      <div class="info">
         <ul>
           <li><span>客户单位：</span><p>{{clientInfo.organName}}</p>
              <!-- <i>{{releasePass.status}}</i> -->
              <i class="pdlr1 state state0" v-if="releasePass.status == 0">不同意</i>
              <i class="pdlr1 state state1" v-if="releasePass.status == 1">同意</i>
              <i class="pdlr1 state state2" v-if="releasePass.status == 2">经理审批中</i>
              <i class="pdlr1 state state3" v-if="releasePass.status == 3">客服审批中</i>
           </li>
           <li><span>使用单元：</span><p>{{clientInfo.ridName}}{{clientInfo.unitName}}</p></li>
           <li><span>办理人：</span><p>{{clientInfo.name}}</p></li>
           <li><span>联系电话：</span><p>{{clientInfo.account}}</p></li>
           <li><span>办理时间：</span><p>{{releasePass.createDate}}</p></li>
           <li><span>单号：</span><p>{{releasePass.guid}}</p></li>
         </ul>
      </div>
     </div>

     <div class="text" style="margin-top:.3rem;">
      <p>
        <span style="color:#999">放行信息</span>
        <i v-if="releasePass.releaseType" style="color:red;font-size:.22rem;">{{releasePass.releaseType==1?"24小时内一次有效":"24小时内多次有效"}}</i>
      </p>
      <ul>
          <li v-show="releasePass.type==1"><p>客户名字</p><span>{{releasePass.releaseName}}</span></li>
          <li v-show="releasePass.type==2"><p>携带人</p><span>{{releasePass.releaseName}}</span></li>
          <li><p>手机号码</p><span>{{releasePass.releaseMobile}}</span></li>
          <li><p>身份证号</p><span>{{releasePass.idCard}}</span></li>
          <li v-show="releasePass.type==1"><p>车牌号码</p><span>{{releasePass.noOrTime}}</span></li>
          <li v-show="releasePass.type==2"><p>搬离时间</p><span>{{releasePass.noOrTime}}</span></li>
      </ul>
      <i v-if="releasePass.status == 1"><img class="bgwhite" @click="showCode = true" :src="`${imgUrl}/releasePass/QRCode?&token=${token}&releasePassId=${releasePass.guid}`" alt=""></i>

     </div>
    <div class="mask" v-if="showCode" @click="showCode = false">
       <img @click.stop="''" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#fff;width:4rem;height:4rem;" :src="`${imgUrl}/releasePass/QRCode?&token=${token}&releasePassId=${releasePass.guid}`" alt="">

    </div>
     <div class="text" v-show="releasePassRowList.length>0">
      <p style="font-weight:600"><span>物品名称</span><i>数量</i></p>
      <ol>
        <li v-for="(item,index) in releasePassRowList" :key="index"><p>{{item.itemName}}</p><span>{{item.amount}}</span></li>
      </ol>
      <div>
        <yd-lightbox :num='releasePassRowList.length' style="padding:0 .2rem .3rem">
          <i style="width:1.2rem;height: 1.2rem;" v-for="(item,index) in releasePassRowList" :key="index">
            <yd-lightbox-img v-if="item.images"  style="width:1.2rem;height: 1.2rem;" class="img" :src="item.images"></yd-lightbox-img>
            <!-- <img :src="item.images" alt=""> -->
          </i>

        </yd-lightbox>

      </div>
     </div>

     <div v-show="releasePass.type==2&&releasePass.ownerPs!='http://oysfye6yt.bkt.clouddn.com/'" class="feedback">
       <span>业主签字同意函</span>
        <yd-lightbox style="padding:0 .2rem .3rem">
            <yd-lightbox-img style="width:1.2rem;height: 1.2rem;" class="img" :src="releasePass.ownerPs"></yd-lightbox-img>

        </yd-lightbox>
       <!-- <p><img :src="releasePass.ownerPs" alt=""></p> -->
     </div>

     <div class="text" style="margin-top:.3rem;"  v-if="releasePass.organInfo!=null">
      <p><span style="color:#999">办理信息</span>
      <i style="border-radius:.05rem;padding:.05rem .1rem;border:1px solid red;color:red;font-size:.22rem;" @click="callWaiter(releasePass.organInfo.account)">联系客服</i></p>
      <ul>
          <li><p>物业名称</p><span>{{releasePass.organInfo.organName}}</span></li>
          <li><p>办理日期</p><span>{{releasePass.releaseDate}}</span></li>
          <li><p>办理人</p><span>{{releasePass.organInfo.name}}</span></li>
      </ul>
     </div>

      <div class="text" style="margin-top:.3rem;"  v-if="releasePassLogList.length > 0">
      <p><span style="color:#999">放行信息</span>
      <i style="border-radius:.05rem;padding:.05rem .1rem;border:1px solid red;color:red;font-size:.22rem;" @click="callWaiter(releasePass.organInfo.account)">联系客服</i></p>
      <ul v-for="(item,index) in releasePassLogList" :key="index">
          <!-- <li><p>物业名称</p><span>{{releasePass.organInfo.organName}}</span></li> -->
          <li><p>进出时间</p><span>{{item.createDate}}</span></li>
          <li><p>办理人</p><span>{{item.userName}}</span></li>
      </ul>
     </div>
      <!-- 管理处可以放行租户不可以，并且放行一次的已经放行过不显示按钮  releaseType (integer, optional): 办理类型： 1：24小时内一次有效；2：24小时内多次有效 ,-->
     <div class='buttons' v-if="releasePass.status == 1 && userInfo.organType == 3 && !(releasePass.releaseType  == 1&&releasePassLogList.length ==1)">
       <button @click.stop="confirmFang" :style="{background:mainColor}">确定</button>
     </div>
     <div class="mask" v-if="showFangXing" @click="showFangXing=false">
       <div class="bgwhite" @click.stop='""'>
         <div class="flex-row jusCenter">办理类型</div>
         <yd-radio-group v-model="banliType" class="center" :color='mainColor' >
            <yd-radio val="1" class="flex1 jusCenter h7" style="width:100%;">24小时一次内有效</yd-radio>
            <yd-radio val="2" class="flex1 jusCenter h7" style="width:100%;">24小时多次内有效</yd-radio>
          </yd-radio-group>
          <div class="flex h7 jusCenter" style="padding:.5rem 1.2rem;">
            <yd-button type='hollow' @click.native='confirm'>确定</yd-button>
          </div>
       </div>
     </div>
    </div>
    <div class="flex-row h9 bgwhite bt font32" v-if='tasks && releasePass.status==3' slot='bottom'>
      <div class="flex1 jusCenter br" @click="disagree1">
        <yd-icon custom name='delete' color='#f00'></yd-icon>
        <span style='color:#ff483f;'>不同意</span>
      </div>
      <div class="flex1 center jusCenter" @click='showFangXing=true'>
        <yd-icon custom name='selected' style="padding-top:.1rem;" class="mr1" size='.4rem' :color='mainColor'></yd-icon>
        <span :style='{color:mainColor}'>同意放行</span>
      </div>
    </div>
  </yd-layout>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";
import "@/assets/css/wuye.css";
import {
  LightBox,
  LightBoxImg,
  LightBoxTxt
} from "vue-ydui/dist/lib.rem/lightbox";
/* 使用px：import {Accordion, AccordionItem} from 'vue-ydui/dist/lib.px/accordion'; */
import { Radio, RadioGroup } from "vue-ydui/dist/lib.rem/radio";
/* 使用px：import {Radio, RadioGroup} from 'vue-ydui/dist/lib.px/radio'; */

Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);
import { Button, ButtonGroup } from "vue-ydui/dist/lib.rem/button";
/* 使用px：import {Button, ButtonGroup} from 'vue-ydui/dist/lib.px/button'; */

Vue.component(Button.name, Button);
Vue.component(ButtonGroup.name, ButtonGroup);
Vue.component(LightBox.name, LightBox);
Vue.component(LightBoxImg.name, LightBoxImg);
Vue.component(LightBoxTxt.name, LightBoxTxt);

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
  data() {
    return {
      mainColor: "",
      titleT: "",
      imgUrl: this.baseUrl + this.subUrl.activity,
      token: this.$getkey(),
      show: true,
      title: "",
      showCode: false,
      s: true,
      p: true,
      d: true,
      statusList: [],
      token: "",
      userId: "",
      releasePassId: null,
      releasePass: {},
      releasePassRowList: [],
      clientInfo: {},
      ownerInfo: {},
      tasks: null,
      banliType: 1,
      showFangXing: false,
      releasePassLogList: []
    };
  },
  methods: {
    disagree1() {
      // 租户拒绝放行
      this.$confirm("是否拒绝放行", "提示", { type: "warning" }).then(() => {
        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          releasePassId: this.releasePass.guid,
          opinion: 0,
          releaseType: 1
        };
        this.$ajax(
          `${this.subUrl.activity}/releasePass/serviceHandle`,
          data,
          res => {
            this.$message({ message: "已拒绝放行", type: "success" });
            this.getReleasePass();
          },
          this
        );
      });
    },
    // 确定放行
    confirmFang() {
      this.$confirm("是否确定放行", "提示", { type: "warning" }).then(() => {
        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          releasePassId: this.releasePass.guid
        };
        this.$ajax(
          `${this.subUrl.activity}/releasePass/handleRelease`,
          data,
          res => {
            this.$message({ message: "已放行", type: "success" });
            this.getReleasePass();
          },
          this
        );
      });
    },
    agree1() {
      // 租户经理同意放行
      this.$confirm("是否同意放行", "提示", { type: warning }).then(() => {
        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          releasePassId: this.releasePass.guid,
          opinion: 1
        };
        this.$ajax(
          `${this.subUrl.activity}/releasePass/manageApprove`,
          data,
          res => {
            this.$dialog.toast({
              mes: "已提交管理处客服审批",
              type: "success"
            });
            this.getReleasePass();
          },
          this
        );
      });
    },
    // 客服同意
    confirm() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        releasePassId: this.releasePass.guid,
        releaseType: this.banliType,
        opinion: 1
      };
      this.$ajax(
        `${this.subUrl.activity}/releasePass/serviceHandle`,
        data,
        res => {
          this.$message({ message: "已同意放行", type: "success" });
          this.showFangXing = false;
          this.getReleasePass();
        },
        this
      );
    },
    callWaiter: function(e) {
      this.$confirm("是否联系客服" + e, "提示", { type: "success" }).then(
        () => {
          location.href = `tel://${e}`;
        }
      );
    },
    toggle() {
      this.show = !this.show;
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      this.$back(this);
    },
    // 获取邀请信息列表
    getReleasePass() {
      var data = {
        userId: this.userId,
        token: this.token,
        releasePassId: this.releasePassId
      };
      this.xhr
        .post(
          `${this.subUrl.activity}/releasePass/getReleasePass`,
          qs.stringify(data)
        )
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.releasePass = res.data.data.releasePass;
            this.clientInfo = res.data.data.releasePass.clientInfo;
            this.ownerInfo = res.data.data.releasePass.ownerInfo;
            this.releasePassRowList = res.data.data.releasePassRowList;
            this.releasePassLogList = res.data.data.releasePassLogList;
            if (this.releasePass.type == 1) {
              this.title = "客户放行条";
            } else {
              this.title = "物品放行条";
            }
            this.tasks = res.data.data.tasks;
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
    if (this.$route.query.token) {
      this.$getUserInfo(res => {
        this.mainColor = this.$color[this.userInfo.organType];
        this.userId = this.userInfo.guid;
        this.token = fn.getIng();
        this.releasePassId = this.$route.query.guid;
        this.getReleasePass();

        console.log(this.$route.query.guid);
      }, this);
    } else {
      this.userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      this.organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      this.mainColor = this.$color[this.userInfo.organType];
      this.userId = this.userInfo.guid;
      this.token = fn.getIng();
      this.releasePassId = this.$route.query.guid;
      this.getReleasePass();

      console.log(this.$route.query.guid);
    }
  }
};
</script>
<style scoped>
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
.flex-row {
  height: 50px;
}
.name > span {
  border-radius: 0.05rem;
  border: 1px solid #2d88d4;
  color: #2d88d4;
}

.info {
  width: 100%;
  background: white;
  border-bottom: 1px solid #f3f6f5;
  padding: 0.2rem 0.3rem;
  font-size: 0.28rem;
}
.info ul li {
  display: flex;
  height: 0.5rem;
  align-items: center;
  position: relative;
}
.info ul li > span {
  width: 1.6rem;
  text-align: right;
  color: #9d9e9d;
}
.info ul li > i {
  padding: 0.02rem 0.05rem;
  /* border: 1px solid #2d88d4; */
  font-size: 0.22rem;
  position: absolute;
  right: 0;
  top: 0.06rem;
  border-radius: 0.05rem;
  /* color: #2d88d4; */
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
  position: absolute;
  overflow: hidden;
  right: 0.5rem;
  top: 0.8rem;
}
.text > i img {
  width: 100%;
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
