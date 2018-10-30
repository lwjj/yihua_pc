<template>
  <div id="new_progress" style="margin-top: 10px">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item class="cursor" @click.native="back">返回</el-breadcrumb-item>
        <el-breadcrumb-item>{{details.titleText}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--<yd-navbar height=".88rem" slot='navbar' :title="details.titleText" :bgcolor="mainColor" color="#fff">-->
      <!--<span class="addClickArea" slot="left" @click="back" style="color: #fff;">-->
        <!--<yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>-->
      <!--</span>-->
    <!--</yd-navbar>-->

    <div class="main">
      <div class="info">
      <ul>
        <li><span>供应商</span><p>{{details.organName}}</p></li>
        <li><span></span><p><i v-show="details.vipType!=''" style="background:#C8E7FF;color:#61BBFF;">{{details.vipType}}</i>
          <i style="background:#FFE7C8;color:#FFB454;">{{details.years}}年</i></p></li>
        <li><span>公司地址</span><p>{{details.organAddress}}</p></li>
        <li><span>联系人</span><p>{{details.userName}}</p></li>
        <li><span>联系电话</span><p>{{details.phone}}</p></li>

      </ul>
    </div>

    <div class="declares">
      <ol>
        <li style="color:#666;"><p>我的备注</p><span style="text-align:right;font-size:14px;"><el-button size="mini" @click="supplierRemarks" type="primary">保存</el-button></span></li>
      </ol>
      <div class="textar">
          <el-input type="textarea" :rows="4" resize="none" style="width: 100%;border: none;" slot="right" v-model="details.remarks" placeholder="暂无消息" :maxlength="100"></el-input>
      </div>
    </div>

    <div class="declares">
      <ol>
        <li style="color:#666;"><p>往来记录</p></li>
        <li v-for="(item,index) in details.myInquiryListDto" :key="index"><p class="textHidden1">【{{item.type}}】{{item.title}}</p>
          <span>{{item.createTime}}</span></li>
      </ol>
    </div>

    <yd-cell-group>
      <yd-cell-item arrow type="link" :href="'/user/we_business/supply/bussnessCard?userId='+details.optUserId+'&oName='+details.organName">
        <span slot="left">商家名片</span>
      </yd-cell-item>
    </yd-cell-group>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Radio, RadioGroup } from "vue-ydui/dist/lib.rem/radio";
/* 使用px：import {Radio, RadioGroup} from 'vue-ydui/dist/lib.px/radio'; */
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
export default {
  data() {
    var userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    return {
      topTitle: "",
      userInfo,
      comment: "",
      details: {},
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
      myExplain: null
    };
  },
  methods: {
    supplierRemarks() {
      let data = {
        token: this.$getkey(),
        guid: this.details.guid,
        remarks: this.details.remarks
      };
      this.$ajax(
        `${this.subUrl.bd}/opportunity/supplierRemarks`,
        data,
        res => {
          this.$message.success("保存成功");
        },
        this
      );
      // this.xhr.post(`${this.subUrl.bd}/opportunity/supplierRemarks`, qs.stringify(data) ).then((res) => {
      //   if (res.data.code == 1) {
      //     this.$dialog.toast({mes: '保存成功！'});
      //   } else if (res.data.code == '-902'){
      //     fn.re_login(this);
      //   } else {
      //     this.$dialog.toast({mes: res.data.msg});
      //   }
      // })
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
    getDetail() {
      var data = {};
      data.token = this.$getkey();
      data.guid = this.$route.query.guid;
      var url =
        this.$route.query.type * 1 == 2
          ? "purchase/purchasingInfo"
          : "purchase/tenderInfo";
      this.$ajax(
        `${this.subUrl.bd}/` + url,
        data,
        res => {
          if (this.$route.query.type * 1 == 1) {
            if (res.data.tenderOrderInfo.state == 0) {
              res.data.tenderOrderInfo.state1 = "已删除";
            } else if (res.data.tenderOrderInfo.state == 1) {
              res.data.tenderOrderInfo.state1 = "已上线";
            } else if (res.data.tenderOrderInfo.state == 2) {
              res.data.tenderOrderInfo.state1 = "已下线";
            } else if (res.data.tenderOrderInfo.state == 3) {
              res.data.tenderOrderInfo.state1 = "审核中";
            } else if (res.data.tenderOrderInfo.state == 4) {
              res.data.tenderOrderInfo.state1 = "未通过";
            }
            if (res.data.tenderOrderInfo.keyword != "") {
              this.keyword = res.data.tenderOrderInfo.keyword.split(",");
            }
            this.details = res.data.tenderOrderInfo;
            if (this.details.levelCondition == 0) {
              this.details.levelCondition = "不限";
            } else if (this.details.levelCondition == 1) {
              this.details.levelCondition = "基础商家";
            } else if (this.details.levelCondition == 2) {
              this.details.levelCondition = "中级商家";
            } else if (this.details.levelCondition == 3) {
              this.details.levelCondition = "高级商家";
            } else if (this.details.levelCondition == 4) {
              this.details.levelCondition = "金牌商家";
            }
            if (this.details.isOffer == 0) {
              this.details.isOffer = "不限";
            } else if (this.details.isOffer == 1) {
              this.details.isOffer = "报价须含税";
            } else if (this.details.isOffer == 2) {
              this.details.isOffer = "物流费由商家承担";
            }
            this.details.startTime = this.details.startTime.split(" ")[0];
            this.details.endTime = this.details.endTime.split(" ")[0];
            this.details.deliveryTime = this.details.deliveryTime.split(" ")[0];
            if (this.details.userId == this.userId) {
              this.yaobiao = true;
            }
            this.organInfoDto = res.data.tenderOrderInfo.organInfoDto3;
            this.list = res.data.tenderOrderInfo.purchaseDetailsList;
            this.imgList = res.data.tenderOrderInfo.accessoryList;
          } else {
            this.info = res.data;
            if (res.data.purchasingInfo.state == 0) {
              res.data.purchasingInfo.state1 = "已删除";
            } else if (res.data.purchasingInfo.state == 1) {
              res.data.purchasingInfo.state1 = "已上线";
            } else if (res.data.purchasingInfo.state == 2) {
              res.data.purchasingInfo.state1 = "已下线";
            } else if (res.data.purchasingInfo.state == 3) {
              res.data.purchasingInfo.state1 = "审核中";
            } else if (res.data.purchasingInfo.state == 4) {
              res.data.purchasingInfo.state1 = "未通过";
            }
            if (res.data.purchasingInfo.keyword != "") {
              this.keyword = res.data.purchasingInfo.keyword.split(",");
            }
            this.details = res.data.purchasingInfo;
            console.log(this.details.userId, 111111111111);
            if (this.details.levelCondition == 0) {
              this.details.levelCondition = "不限";
            } else if (this.details.levelCondition == 1) {
              this.details.levelCondition = "基础";
            } else if (this.details.levelCondition == 2) {
              this.details.levelCondition = "中级";
            } else if (this.details.levelCondition == 3) {
              this.details.levelCondition = "高级";
            } else if (this.details.levelCondition == 4) {
              this.details.levelCondition = "金牌";
            }
            this.details.startTime = this.details.startTime.split(" ")[0];
            this.details.endTime = this.details.endTime.split(" ")[0];

            this.organInfoDto = res.data.purchasingInfo.organInfoDto3;
            this.list = res.data.purchasingInfo.purchaseDetailsList;
          }
        },
        this
      );
    }
  },
  mounted() {
    this.userId = this.userInfo.guid;
    // this.getkey = fn.getIng();
    this.details = JSON.parse(
      decodeURIComponent(localStorage.getItem("libraryList"))
    )
      ? JSON.parse(decodeURIComponent(localStorage.getItem("libraryList")))
      : {};
    console.log(this.details);
    if (this.details.vipType == 1) {
      this.details.vipType = "基础";
    } else if (this.details.vipType == 2) {
      this.details.vipType = "中级";
    } else if (this.details.vipType == 3) {
      this.details.vipType = "高级";
    } else if (this.details.vipType == 4) {
      this.details.vipType = "金牌";
    } else if (this.details.vipType == 0) {
      this.details.vipType = "";
    }

    if (this.details.myInquiryListDto.length > 0) {
      this.details.myInquiryListDto.forEach(element => {
        if (element.type == 1) {
          element.type = "预约";
        } else if (element.type == 2) {
          element.type = "团购";
        } else if (element.type == 3) {
          element.type = "询价";
        } else if (element.type == 4) {
          element.type = "邀联";
        } else if (element.type == 5) {
          element.type = "邀标";
        }
        element.createTime = element.createTime.split(" ")[0];
      });
    }

    console.log(this.details);
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
  .main {
    height: 100%;
    background: #fff;
  }
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
  border-bottom: 1px solid #ececec;
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
  font-size: 0.24rem;
  color: #666;
  opacity: 1;
}

.important-input-div input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  font-size: 0.24rem;
  color: #666;
  opacity: 1;
}

.important-input-div input:-ms-input-placeholder {
  font-size: 0.24rem;
  color: #666;
  opacity: 1;
}

.important-input-div input::-webkit-input-placeholder {
  font-size: 0.24rem;
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
  /*border: 1px solid #d9d9d9;*/
}

.textar > div > i.bb {
  flex: 1;
  /*border: 1px solid #d9d9d9;*/
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
  border-bottom: 1px solid #f3f6f5;
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
  font-size: 0.24rem;
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
  font-size: 0.24rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.2rem;
}
</style>
