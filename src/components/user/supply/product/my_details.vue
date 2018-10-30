<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native="$router.go(-1)">返回</el-breadcrumb-item>
        <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="contact">
      <div class="info">
        <ul>
          <li style="border-bottom:1px solid #ddd;line-height:30px;"  v-show="bm.type==1||bm.type==3"><span>状态</span><p>{{status}}</p></li>
          <li style="border-bottom:1px solid #ddd;line-height:30px;" v-show="bm.type==4"><span>邀联时间</span><p>{{detail.createTime}}</p></li>
          <li><span>产品名称</span><p>{{titleT}}</p></li>
          <li v-if='organInfo1.organName'><span>供应商</span><p>{{organInfo1.organName}}</p></li>
          <li v-show="organInfo1.vipType!=''"><span></span><p><i v-show="organInfo1.vipType!=''" style="background:#C8E7FF;color:#61BBFF;">{{organInfo1.vipType}}</i>
            <i style="background:#FFE7C8;color:#666;">{{organInfo1.years}}年</i></p></li>
          <li><span>联系人</span><p>{{organInfo1.userName}}</p></li>
          <li v-show="bm.type==3 || bm.type==4"><span>电话</span><p>{{organInfo1.phone}}</p></li>
          <li><span>地区</span><p>{{organInfo1.organAddress}}</p></li>
        </ul>
      </div>
      <div class="group_buying" v-show="bm.type==2">
        <div>团购进行中</div>
        <div>
          <ul>
            <li style="height:.8rem;"><p>已参加</p><span style="color:#F2725E;font-size:.8rem;">{{productOrder.paGroupNum}}</span><a>倒计时</a></li>
            <li><span style="margin-left:.3rem;color:#999">{{priceList[0]}}</span>
              <a>
                <template>
                  <yd-countdown slot="right" :time="productOrder.endTime">
                    <em>{%d1}{%d2}</em>天
                    <em>{%h1}{%h2}</em>时
                    <em>{%m1}{%m2}</em>分
                  </yd-countdown>
                </template>
              </a>
            </li>
            <li><span style="margin-left:.3rem;color:#999">{{priceList[1]}}</span><a>服务区域 {{productOrder.scopeValueStr}}</a></li>
          </ul>
        </div>
      </div>


      <div class="contact" v-show="bm.type==1">
        <ul>
          <li><span style="color:#999;">状态</span><span>{{detail.state1}}</span>
            <span style="color:#999;font-size:.24rem;">{{detail.createTime}}</span></li>
          <li><span style="color:#999;">联系人</span><span>{{detail.name}}</span></li>
          <li><span style="color:#999;">电话</span><span>{{detail.phone}}</span></li>
          <li><span style="color:#999;">预约时间</span><span>{{detail.createTime}}</span></li>
          <li>
            <p>留言</p>
            <i class="bb">
              <yd-textarea slot="right" readonly :placeholder="detail.remarks" maxlength="100"></yd-textarea>
            </i>
          </li>
          <li style="color:#999;font-size:.24rem;">稍后商家联系您确认</li>
        </ul>
      </div>
      <div class="contact" v-show="bm.type==2">
        <ul>
          <li><span></span>
            <span style="color:#999;font-size:.24rem;">{{detail.createTime}}</span></li>
          <li><span style="color:#999;">联系人</span><span>{{detail.name}}</span></li>
          <li><span style="color:#999;">电话</span><span>{{detail.phone}}</span></li>
          <li><span style="color:#999;">所在地址</span><span>{{detail.address}}</span></li>
          <li>
            <p>备注</p>
            <i class="bb">
              <yd-textarea slot="right" readonly :placeholder="detail.remarks" maxlength="100"></yd-textarea>
            </i>
          </li>
          <li style="height:0;"></li>
        </ul>
      </div>

      <div class="declares" style="margin:.2rem 0" v-show="bm.type==3">
        <div class="textar">
          <div>
            <p>我的留言</p>
            <i class="bb">
              <yd-textarea slot="right" readonly :placeholder="detail.message" maxlength="100"></yd-textarea>
            </i>
          </div>
          <div style="margin:0 0;"><p></p>
            <span style="text-align: right;height:.4rem;color:#999;" class="aa">{{detail.messageTime}}</span></div>
        </div>
        <!-- <ol>
            <li style="color:#333;">
                <yd-checkbox v-model="checkbox">允许同品类其他优质供应商联系我</yd-checkbox></li>
        </ol> -->
      </div>

      <div class="declares" style="margin:.2rem 0" v-show="bm.type==3">
        <ol>
          <li style="color:#333;">供应商留言</li>
        </ol>
        <div class="textar">
          <div><p>报价</p><span class="bb"><input disabled="disabled" v-model="detail.offer" type="text"></span></div>
          <div>
            <p>附言</p>
            <i class="bb">
              <yd-textarea slot="right" readonly :placeholder="detail.explains" maxlength="100"></yd-textarea>
            </i>
          </div>
          <div style="margin:0 0;"><p></p>
            <span style="text-align: right;height:.4rem;color:#999;" class="aa">2017-12-12 15:30</span></div>
        </div>
      </div> 
      <div class="bottoms" v-show="detail.state==0" v-if="bm.type==1||bm.type==2">
          <span @click="delBespeak" v-show="bm.type==1"><i><img style="width: 30px;margin-bottom: -10px;margin-right: 5px" src="../../../../assets/images/rent/supply/disagree.png" alt=""></i>取消预约</span>
          <span @click="delBespeak" v-show="bm.type==2"><i><img style="width: 30px;margin-bottom: -10px;margin-right: 5px" src="../../../../assets/images/rent/supply/disagree.png" alt=""></i>取消团购</span>
      </div> 
    </div>
  </div>
</template>
<script>
import Vue from "vue";

import { Radio, RadioGroup } from "vue-ydui/dist/lib.rem/radio";
import { Button, ButtonGroup } from "vue-ydui/dist/lib.rem/button";
/* 使用px：import {Button, ButtonGroup} from 'vue-ydui/dist/lib.px/button'; */

Vue.component(Button.name, Button);
Vue.component(ButtonGroup.name, ButtonGroup);
Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);

import { CheckBox, CheckBoxGroup } from "vue-ydui/dist/lib.rem/checkbox";
/* 使用px：import {CheckBox, CheckBoxGroup} from 'vue-ydui/dist/lib.px/checkbox'; */

Vue.component(CheckBox.name, CheckBox);
Vue.component(CheckBoxGroup.name, CheckBoxGroup);

import { CellGroup, CellItem } from "vue-ydui/dist/lib.rem/cell";
/* 使用px：import {CellGroup, CellItem} from 'vue-ydui/dist/lib.px/cell'; */

Vue.component(CellGroup.name, CellGroup);
Vue.component(CellItem.name, CellItem);
import { TextArea } from "vue-ydui/dist/lib.rem/textarea"; 
Vue.component(TextArea.name, TextArea);
export default {
  data() {
    var userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    return {
      topTitle: "",
      userInfo,
      comment: "",
      details: "",
      imgs: "",
      info: {},
      imgList: [],
      show: false,
      price: "",
      time: "",
      label: "",
      postscript: "",
      components: "",
      organInfoDto: {},
      list: [],
      keyword: [],
      userId: "",
      alertT: false,
      myOffer: null,
      myExplain: null,
      title: "",
      detail: {},
      organInfo1: {},
      titleT: "",
      status: "",
      productOrder: {},
      priceList: [],
      bm: {
        type: 1,
        token: "",
        guid: "",
        type1: null
      }
    };
  },
  methods: {
    delBespeak() {
      let data = {};
      data.guid = this.bm.guid;
      data.token = this.$getkey();
      this.$ajax(
        `${this.subUrl.bd}/opportunity/delBespeak`,
        data,
        res => {
          this.$dialog.toast({ mes: "取消成功！" });
          this.$router.go(-1);
        },
        this
      );
    },
    lookPhone() {
      let data = {};
      data.guid = this.guid;
      data.token = this.$getkey();
      data.lookType = this.$route.query.type;
      data.payType = 2;
      this.$ajax(
        `${this.subUrl.bd}/purchase/lookPhone`,
        data,
        res => {
          this.organInfoDto.phone = res.data.account;
          this.details.isLookPhone = 1;
          this.details.lookNumber++;
          this.$dialog.toast({ mes: "支付成功！" });
        },
        this
      );
    },
    lookPhonePara() {
      let data = {};
      data.token = this.$getkey();
      data.type = "lookPhone";
      this.$ajax(
        `${this.subUrl.bd}/purchase/lookPhonePara`,
        data,
        res => {
          this.para = res.data.para;
          console.log(this.para.value);
        },
        this
      );
    },
    addRegister() {
      if (this.myOffer == null) {
        return this.$message.error("请填写报价！");
      }
      if (this.myExplain == null) {
        return this.$message.error("请填写附言！");
      }
      let data = {};
      data.type = this.$route.query.type;
      data.token = this.$getkey();
      data.myOffer = this.myOffer;
      data.myExplain = this.myExplain;
      data.poId = this.$route.query.guid;
      this.$ajax(
        `${this.subUrl.bd}/purchase/addRegister`,
        data,
        res => {
          this.$message.success("报价成功！");
          this.details.isRegister = 1;
        },
        this
      );
    },
    cancel() {
      this.alertT = false;
    },
    confirm() {},
    getDetail(type) {
      var data = {};
      data.token = this.$getkey();
      data.guid = this.$route.query.guid;
      data.type = this.bm.type1;
      var url = "/purchase/aboutInfo";
      if (type == 3) {
        url = "/purchase/inquiryInfo";
      }
      if (type == 4) {
        url = "/purchase/contactInfo";
      }
      if (type == 5) {
        url = "/purchase/tenderInfo";
        data.type=5
      }
      this.$ajax(
        `${this.subUrl.bd}/` + url,
        data,
        res => {
          if (type == 4) {
            this.detail = res.data;
            this.organInfo1 = res.data.organInfoDto3;
            if (this.organInfo1.vipType == 1) {
              this.organInfo1.vipType = "基础";
            } else if (this.organInfo1.vipType == 2) {
              this.organInfo1.vipType = "中级";
            } else if (this.organInfo1.vipType == 3) {
              this.organInfo1.vipType = "高级";
            } else if (this.organInfo1.vipType == 4) {
              this.organInfo1.vipType = "金牌";
            } else if (this.organInfo1.vipType == 0) {
              this.organInfo1.vipType = "";
            }
            return;
          }
          if (type == 5) {
            this.detail = res.data;
            this.organInfo1 = res.data.tenderOrderInfo.organInfoDto3;
            console.log(this.organInfo1)
            if (this.organInfo1.vipType == 1) {
              this.organInfo1.vipType = "基础";
            } else if (this.organInfo1.vipType == 2) {
              this.organInfo1.vipType = "中级";
            } else if (this.organInfo1.vipType == 3) {
              this.organInfo1.vipType = "高级";
            } else if (this.organInfo1.vipType == 4) {
              this.organInfo1.vipType = "金牌";
            } else if (this.organInfo1.vipType == 0) {
              this.organInfo1.vipType = "";
            }
            return;
          }
          if (type == 3) {
            this.detail = res.data;
            this.organInfo1 = res.data.organInfoDto3;
            if (this.organInfo1.vipType == 1) {
              this.organInfo1.vipType = "基础";
            } else if (this.organInfo1.vipType == 2) {
              this.organInfo1.vipType = "中级";
            } else if (this.organInfo1.vipType == 3) {
              this.organInfo1.vipType = "高级";
            } else if (this.organInfo1.vipType == 4) {
              this.organInfo1.vipType = "金牌";
            } else if (this.organInfo1.vipType == 0) {
              this.organInfo1.vipType = "";
            }
            return;
          }
          console.log(res);
          this.organInfo1 = res.data.organInfoDto3;
          this.detail = res.data;
          this.productOrder = res.data.productOrder;
          this.priceList = this.productOrder.priceSectionDescribe.split(",");
          if (this.organInfo1.vipType == 1) {
            this.organInfo1.vipType = "基础";
          } else if (this.organInfo1.vipType == 2) {
            this.organInfo1.vipType = "中级";
          } else if (this.organInfo1.vipType == 3) {
            this.organInfo1.vipType = "高级";
          } else if (this.organInfo1.vipType == 4) {
            this.organInfo1.vipType = "金牌";
          } else if (this.organInfo1.vipType == 0) {
            this.organInfo1.vipType = "";
          }
          if (this.detail.state == 0) {
            this.detail.state1 = "未联";
          } else if (this.detail.state == 1) {
            this.detail.state1 = "已联";
          } else if (this.detail.state == 2) {
            this.detail.state1 = "已取消";
          }
        },
        this
      );
    }
  },
  mounted() {
    this.bm.guid = this.$route.query.guid;
    if (this.$route.query.type == 1) {
      this.title = "我的预约";
      this.bm.type = 1;
      this.bm.type1 = 2;
    } else if (this.$route.query.type == 2) {
      this.title = "我的团购";
      this.bm.type = 2;
      this.bm.type1 = 1;
    } else if (this.$route.query.type == 3) {
      this.title = "我的询价";
      this.bm.type = 3;
    } else if (this.$route.query.type == 4) {
      this.title = "我的邀联";
      this.bm.type = 4;
    } else if (this.$route.query.type == 5) {
    }
    this.status = this.$route.query.status;
    this.titleT = this.$route.query.title;
    this.getDetail(this.$route.query.type);
    if (this.$route.query) {
      this.price = this.$route.query.b;
      this.postscript = this.$route.query.a;
      this.time = this.$route.query.c;
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  padding: 20px 30px;
  margin: 20px 0;
  background: #fff;
}

#new_progress {
  padding-left: 300px;
  padding-right: 40px;
  height: auto;
}
.contact {
  width: 100%;
  margin-bottom: 0.2rem;
  background: white;
}

.contact > ul {
  width: 100%;
}

.contact > ul > li {
  display: flex;
  height: 0.7rem;
  align-items: center;
  padding: 0 0.3rem;
  /*border-bottom: 1px solid #ECECEC;*/
}

.contact > ul > li > span:nth-child(1) {
  width: 1.4rem;
  text-align: right;
}

.contact > ul > li > span:nth-child(2) {
  flex: 1;
  margin-left: 0.2rem;
}

.contact > ul > li > span:nth-child(3) {
  width: 1.8rem;
}

.contact > ul > li > span:nth-child(3) > a {
  background: #f2725e;
  display: flex;
  height: 0.6rem;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: 0.1rem;
}

.contact > ul > li > span:nth-child(3) > a > i {
  width: 0.3rem;
  height: 0.3rem;
  margin-right: 0.1rem;
}

.contact > ul > li > span:nth-child(3) > a > i > img {
  width: 100%;
  height: 100%;
}

.send {
  margin: 0;
}

.choose_item {
  height: 0.6rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ececec;
}

.choose_item span {
  margin-right: 0.2rem;
}

.buttonBox {
  padding: 0 0.2rem 0.3rem;
}

.important-input-div {
  width: 100%;
  background: #ffffff;
  padding-bottom: 0.5em;
  display: flex;
  flex-wrap: wrap;
  padding: 0.2rem 0.3rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.important-input-div input {
  width: 1.45rem;
  font-size: 0.26rem;
  color: #333;
  /*font-weight: 600;*/
  line-height: 0.38rem;
  border: none;
  border: 1px solid #ddd;
  border-radius: 0.05rem;
  text-align: center;
  margin-right: 0.2rem;
}

.to-select {
  width: 100%;
  margin-top: 1em;
  border-bottom: 1px solid #e6e6e6;
}

.to-select > div > span {
  transform: rotate(90deg);
}

/*transform:rotate(45deg)*/

.important-input-div input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  font-size: 14px;
  color: #666;
  opacity: 1;
}

.important-input-div input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  font-size: 14px;
  color: #666;
  opacity: 1;
}

.important-input-div input:-ms-input-placeholder {
  font-size: 14px;
  color: #666;
  opacity: 1;
}

.important-input-div input::-webkit-input-placeholder {
  font-size: 14px;
  color: #666;
  opacity: 1;
}

.er {
  margin-left: 0.4rem;
  border-bottom: 1px solid #ececec;
}

.declares {
  width: 100%;
  background: white;
}

.declares > ul > li > span > i {
  padding: 0.02rem 0.02rem;
  color: #f2725e;
  border: 1px solid #f2725e;
  margin-left: 0.2rem;
  border-radius: 0.1rem;
}

.declares > ul {
  width: 100%;
  padding: 0.1rem 0.3rem;
}

.declares > ul li {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}

.declares > ul li > p {
  width: 1.4rem;
  display: flex;
  height: 0.6rem;
  justify-content: flex-end;
  align-items: center;
  font-size: 0.3rem;
  color: #777;
}

.declares > ul li > span {
  flex: 1;
  /* height: 0.6rem; */
  line-height: 0.6rem;
  display: flex;
  align-items: center;
  border-radius: 0.05rem;
  margin-left: 0.2rem;
  display: inline-block;
  word-break: break-all;
}

.declares > ul li > span > input {
  width: 100%;
  height: 100%;
  border: none;
  margin-left: 0.1rem;
}

.declares > ol {
  width: 100%;
  margin-bottom: 0.2rem;
}

.declares > ol li {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  /*height: .8rem;*/
  align-items: center;
  padding: 0.1rem 0.4rem;
  border-bottom: 1px solid #e4e4e4;
}

.declares > ol li > p {
  flex: 1;
  padding: 0 0.2rem 0 0;
  border: none;
}

.declares > ol li > span {
  width: 1.5rem;
  height: 0.8rem;
  line-height: 0.8rem;
}

.declares > ol li:nth-child(1) {
  border-bottom: 1px solid #ececec;
}

.textar {
  display: flex;
  padding: 0.1rem 0.3rem;
  flex-flow: column;
}

.textar > div {
  display: flex;
  flex-flow: row;
  align-items: center;
  margin: 0.2rem 0;
}

.textar > div > p {
  width: 1.6rem;
  display: flex;
  justify-content: center;
  height: 0.7rem;
  align-items: center;
  font-size: 0.3rem;
  color: #777;
}

.textar > div > span.bb {
  flex: 1;
  height: 0.7rem;
  border: 1px solid #d9d9d9;
  border-radius: 0.05rem;
}

.textar > div > span.aa {
  flex: 1;
  height: 0.7rem;
  line-height: 0.7rem;
}

.textar > div > span > input {
  width: 100%;
  height: 100%;
  border: none;
  margin-left: 0.1rem;
}

.textar > span {
  width: 100%;
  height: 100%;
  border: 1px solid #d9d9d9;
}

.textar > div > i.bb {
  flex: 1;
  border: 1px solid #d9d9d9;
  padding: 0 0.1rem;
}

.textar > div > i.aa {
  flex: 1;
}

.images {
  width: 100%;
  padding: 0 0.4rem 0.2rem;
}
.images > div {
  width: 100%;
  display: flex;
  flex-flow: row;
  align-items: center;
}
.images > div > img {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 0.1rem;
  margin-right: 0.15rem;
}

.declares ol li > a {
  width: 2rem;
  display: flex;
  flex-flow: row;
  align-items: center;
  color: #0093d2;
}

.declares ol li > a > i {
  border-radius: 50%;
  width: 0.4rem;
  height: 0.4rem;
  background: #0093d2;
  font-size: 0.4rem;
  display: flex;
  margin-right: 0.2rem;
  color: white;
  justify-content: center;
  align-items: center;
}

.alertText {
  width: 100%;
  position: fixed;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.alertText > ul {
  width: 6.5rem;
  height: 5rem;
  background: white;
  padding: 0.2rem 0.3rem;
  border-radius: 0.2rem;
  display: flex;
  flex-flow: column;
  justify-content: center;
}

.alertText ul li.a {
  width: 100%;
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 0.1rem 0;
}

.alertText ul li.a > span {
  border-radius: 0.05rem;
  flex: 1;
  border: 1px solid #e6e7e7;
  height: 0.7rem;
  display: flex;
  align-items: center;
}

.alertText ul li.a > p {
  width: 1.8rem;
  text-align: right;
}

.alertText ul li.a > span > input {
  border: none;
  margin-left: 0.2rem;
  height: 100%;
  width: 100%;
}

.alertText ul li:nth-child(4) {
  margin-top: 0.2rem;
  display: flex;
  justify-content: space-around;
}

.alertText ul li:nth-child(4) > button {
  font-size: 0.32rem;
  font-weight: 600;
  color: white;
  padding: 0.2rem 0.5rem;
  border: none;
  border-radius: 0.1rem;
}

.info {
  width: 100%;
  background: white;
  /*border-bottom: 1px solid #F3F6F5;*/
  font-size: 14px;
  padding: 0.1rem 0;
  margin-bottom: 0.2rem;
}

.info ul li {
  display: flex;
  padding: 0.1rem 0.2rem;
}

.info ul li > span {
  width: 1.3rem;
  text-align: right;
  color: #9d9e9d;
}

.info ul li > p {
  flex: 1;
  padding: 0 0.2rem;
  display: flex;
}

.info ul li > a {
  text-align: right;
  display: flex;
  padding: 0.03rem 0.05rem;
  border-radius: 0.05rem;
  font-size: 14px;
  align-items: center;
}

.info ul li > a > i {
  display: flex;
  width: 0.3rem;
  height: 0.3rem;
  background: red;
  margin-right: 0.05rem;
}

.info ul li > a > i > img {
  width: 100%;
  height: 100%;
}

.info ul li > p > i {
  width: 0.8rem;
  height: 0.35rem;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.2rem;
}
.contact {
  width: 100%;
  margin: 0;
  background: white;
}

.contact > ul {
  width: 100%;
}

.contact > ul > li:first-child,
.contact > ul > li:last-child {
  border-bottom: 1px solid #ececec;
  border-top: 1px solid #ececec;
  height: 0.7rem;
}

.contact > ul > li {
  display: flex;
  align-items: center;
  padding: 0 0.3rem;
  margin: 0.2rem 0;
}

.contact > ul > li > span:nth-child(1) {
  width: 1.4rem;
  text-align: right;
}

.contact > ul > li > span:nth-child(2) {
  flex: 1;
  margin-left: 0.2rem;
}

.contact > ul > li > span:nth-child(3) {
  flex: 1;
}

.contact > ul > li > span:nth-child(3) > a {
  background: #f2725e;
  display: flex;
  height: 0.6rem;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: 0.1rem;
}

.contact > ul > li > span:nth-child(3) > a > i {
  width: 0.3rem;
  height: 0.3rem;
  background: white;
  margin-right: 0.1rem;
}

.contact > ul > li > span:nth-child(3) > a > i > img {
  width: 100%;
  height: 100%;
}

.contact > ul > li > p {
  width: 1.4rem;
  display: flex;
  justify-content: flex-end;
  height: 0.7rem;
  align-items: center;
  font-size: 0.3rem;
  color: #777;
  margin-right: 0.2rem;
}

.contact > ul > li > i {
  flex: 1;
  /*border: 1px solid #d9d9d9;*/
  padding: 0 0.1rem;
}

.declares {
  width: 100%;
  background: white;
}

.declares > ol {
  width: 100%;
  margin-bottom: 0.2rem;
}

.declares > ol li {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  height: 0.8rem;
  color: #777;
  padding: 0 0.4rem;
  align-items: center;
}

.declares > ol li > p {
  flex: 1;
  height: 0.8rem;
  line-height: 0.8rem;
}

.declares > ol li > span {
  width: 1.5rem;
  height: 0.8rem;
  line-height: 0.8rem;
}

.declares > ol li:nth-child(1) {
  border-bottom: 1px solid #ececec;
  border-top: 1px solid #ececec;
}

.textar {
  display: flex;
  padding: 0.1rem 0.3rem;
  flex-flow: column;
}

.textar > div {
  display: flex;
  flex-flow: row;
  align-items: center;
  margin: 0.1rem 0;
}

.textar > div > p {
  width: 1.6rem;
  display: flex;
  justify-content: center;
  height: 0.7rem;
  align-items: center;
  font-size: 0.3rem;
  color: #777;
}

.textar > div > span.bb {
  flex: 1;
  height: 0.7rem;
  border: 1px solid #d9d9d9;
  border-radius: 0.05rem;
}

.textar > div > span.aa {
  flex: 1;
  height: 0.7rem;
  line-height: 0.7rem;
}

.textar > div > span > input {
  width: 100%;
  height: 100%;
  border: none;
  margin-left: 0.1rem;
}

.textar > span {
  width: 100%;
  height: 100%;
  border: 1px solid #d9d9d9;
}

.textar > div > i.bb {
  flex: 1;
  border: 1px solid #d9d9d9;
  padding: 0 0.1rem;
}

.textar > div > i.aa {
  flex: 1;
}

.imgas.a > a {
  display: flex;
  height: 1rem;
  width: 1rem;
  margin-top: 0.2rem;
}

.imgas.a > a > img {
  height: 1rem;
  width: 1rem;
  border-radius: 0.1rem;
  margin-right: 0.3rem;
}

.imgas.a {
  display: flex;
  flex-flow: column;
}

.declares ol li > a {
  width: 2rem;
  display: flex;
  flex-flow: row;
  align-items: center;
  color: #0093d2;
}

.declares ol li > a > i {
  border-radius: 50%;
  width: 0.4rem;
  height: 0.4rem;
  background: #0093d2;
  font-size: 0.4rem;
  display: flex;
  margin-right: 0.2rem;
  color: white;
  justify-content: center;
  align-items: center;
}

.info {
  width: 100%;
  background: white;
  /*border-bottom: 1px solid #F3F6F5;*/
  font-size: 14px;
  padding: 0.1rem 0;
}

.info ul li {
  display: flex;
  padding: 0.1rem 0.2rem;
  align-items: center;
}

.info ul li > span {
  width: 1.3rem;
  text-align: right;
  color: #9d9e9d;
}

.info ul li > p {
  flex: 1;
  padding: 0 0.2rem;
  display: flex;
}

.info ul li > a {
  text-align: right;
  display: flex;
  padding: 0.03rem 0.05rem;
  border-radius: 0.05rem;
  font-size: 14px;
  align-items: center;
}

.info ul li > a > i {
  display: flex;
  width: 0.3rem;
  height: 0.3rem;
  background: red;
  margin-right: 0.05rem;
}

.info ul li > a > i > img {
  width: 100%;
  height: 100%;
}

.info ul li > p > i {
  width: 0.8rem;
  height: 0.35rem;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.2rem;
}

.bottoms {
  width: 100%;
  background: white;
  height: 1rem;
  display: flex;
  justify-content: space-around;
}

.bottoms > span {
  font-size: 0.32rem;
  color: #333;
  display: flex;
  align-items: center;
  font-weight: 600;
}

.bottoms > span > i {
  display: flex;
  width: 0.5rem;
  height: 0.5rem;
  margin-right: 0.2rem;
}

.bottoms > span > i > img {
  height: 100%;
  width: 100%;
}

.group_buying {
  width: 100%;
  background: white;
}

.group_buying > div:nth-child(1) {
  width: 100%;
  border-bottom: 1px solid #f3f6f5;
  border-top: 1px solid #f3f6f5;
  padding: 0.1rem 0.3rem;
  color: #f2725e;
  font-size: 0.3rem;
  font-weight: 600;
}

.group_buying > div:nth-child(2) > ul {
  width: 100%;
  padding: 0.3rem 0;
}

.group_buying > div:nth-child(2) > ul > li {
  display: flex;
  padding: 0.05rem 0;
  align-items: center;
}

.group_buying > div:nth-child(2) > ul > li > p {
  width: 1.3rem;
  text-align: right;
  color: #9d9e9d;
}

.group_buying > div:nth-child(2) > ul > li > span {
  flex: 1;
  padding: 0 0.2rem;
}

.group_buying > div:nth-child(2) > ul > li > a {
  width: 3.6rem;
  color: #9d9e9d;
}

.group_buying > div:nth-child(2) > ul > li > a em {
  padding: 0.1rem 0.06rem;
  border: 1px solid #f5f5f4;
  margin-right: 0.05rem;
}
</style>
