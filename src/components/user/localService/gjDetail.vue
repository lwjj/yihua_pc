<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item class="cursor" @click.native='$router.go(-1)'>返回</el-breadcrumb-item>
        <el-breadcrumb-item>{{topTitle}}详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="contact" style="margin-top: 10px;">
      <ul>
        <!-- <li><span style="color:#999;">状态</span><span>{{details.state1}}</span><span></span></li> -->
        <li style="border:none;"><span style="color:#999;">联系人</span><span>{{organInfoDto.userName}}</span>
        <span v-show="details.isLookPhone==0&&details.userId!=userId"  class="cursor" @click="openConfrim">
         <span class="lookIcon">
            <img width="20" src="../../../assets/images/rent/supply/chakan.png" alt="">
           查看
         </span>
         </span>
        </li>
        <li><span style="color:#999;">电话</span><span>{{organInfoDto.phone}}</span><span style="color:#999;font-size:12px;">已被查看{{details.lookNumber}}次</span></li>
        <li style="color:#999;font-size:12px;">联系时请说是在【八爪网】看到的</li>
      </ul>
      <!-- 状态 -->
    </div>

    <div class="declares" style="margin:.2rem 0" v-if="price!=undefined&&price!=''">
      <ol>
        <li v-if="show" style="color:#333;"><p>投标登记</p><span style="width:3rem;text-align:right">{{time}}</span></li>
        <li v-if="!show" style="color:#333;"><p>报价</p><span style="width:3rem;text-align:right">{{time}}</span></li>
      </ol>
      <div class="textar">
        <div><p>报价</p><span class="aa">{{price}}</span></div>
        <div>
          <p>附言</p>
          <i class="aa">
            {{postscript}}
          </i>
        </div>
      </div>
    </div>

    <div class="declares">
      <ul v-if="show">
        <li><p>项目名称</p><span>{{details.title}}</span></li>
        <li><p>招标金额</p><span>{{details.money==0?'面议':details.money}}</span></li>
        <li><p>发布日期</p><span>{{details.startTime}}</span></li>
        <li><p>截至日期</p><span>{{details.endTime}}</span></li>
        <li><p>买家地址</p><span>{{details.address}}</span></li>
        <li><p>交货日期</p><span>{{details.deliveryTime}}</span></li>
        <li><p>交货地址</p><span>{{details.deliveryAddress}}</span></li>
      </ul>
      <ul v-if="!show">
        <li><p>标题</p><span>{{details.title}}<i v-if="details.isUrgent==1">急</i></span></li>
        <li><p>采购数量</p><span>{{details.number==-1?'面议':details.number}}</span></li>
        <li><p>发布日期</p><span>{{details.startTime}}</span></li>
        <li><p>截至日期</p><span>{{details.endTime}}</span></li>
        <li><p>买家地址</p><span>{{details.deliveryAddress}}</span></li>
      </ul>
    </div>

    <div class="declares" style="">
      <ol>
        <li style="color:#666;"><p>产品/服务</p><span>数量</span><span>金额(元)</span></li>
        <li v-for="(item,index) in list" :key="index"><p>
          {{item.productService}}</p>
          <span >{{item.number}}</span>
          <span>{{item.money}}</span></li>
      </ol>
      <div class="pdlr2 shuoming">说明： {{details.explains}}</div>
      
      <div class="important-input-div" v-show="keyword.length>0">
        <input v-show="keyword[0]" type="text" maxlength="10" v-model="keyword[0]" disabled="disabled" placeholder="">
        <input v-show="keyword[1]" placeholder="" maxlength="10" v-model="keyword[1]" type="text" disabled="disabled">
        <input v-show="keyword[2]" placeholder="" maxlength="10" v-model="keyword[2]" type="text" disabled="disabled">
      </div>
      <div class="images" v-if="imgList.length>0">
        <yd-lightbox :num="imgList.length">
          <yd-lightbox-img :onerror="imgs" v-for="(item,index) in imgList" :key="index" :src="item.path"></yd-lightbox-img>
        </yd-lightbox>
      </div>
    </div>
    <!-- 投标要求 -->
      <div class="list_item">
        <div class="label">投标要求</div>
        <div class="labelContent">{{details.isOffer?details.isOffer:"不限"}}</div>
      </div>
      <div class="list_item">
        <div class="label">范围</div>
        <div class="labelContent">{{details.scopeValueStr}}</div>
      </div>
      <div class="list_item">
        <div class="label">供应商要求</div>
        <div class="labelContent">{{details.levelCondition}}</div>
      </div>
      <div class="list_item" v-if="show">
        <div class="label">商家资质要求</div>
        <div class="labelContent">{{details.seniority==null?'暂无':details.seniority}}</div>
      </div> 
      <el-col v-if="details.isLookPhone*1>0">
        <div class="declares" style="margin:.2rem 0" v-show="details.isRegister==0&&details.userId!=userInfo.guid">
      
          <div >
            <div class="list_item">
              <div class="label" style="width:187px" v-if="!show">投标登记(由采购方联系您)</div>
              <div class="label" style="width:140px" v-if="show">报价</div>
            </div>
            <div class="list_item">
              <div class="label">我的报价</div>
              <div class="labelContent">
                <el-input v-model="myOffer" type="number" :max="10000000" :maxlength="9" placeholder="请输入价格"></el-input>
              </div>
            </div>
            <div class="list_item mt1">
              <div class="label">我的附言</div>
              <div class="labelContent">
                  <el-input type="textarea" v-model="myExplain" :rows='3' resize="none"></el-input>
              </div>
            </div>
            <div class="list_item mt1">
              <div class="label"></div>
              <el-button type="primary"  @click="addRegister">确定</el-button>
            </div> 
          </div>
        </div>
      </el-col>

      <div class="alertText" v-show="alertT">
        <ul>
          <li class="a"><p class="font28">产品/服务：</p><span><input @blur="nameBlur()" maxlength="50" v-model="info.name" type="text"
                                                                placeholder="请填写"></span></li>
          <li class="a"><p class="font28">数量：</p><span><input @blur="phoneBlur()" v-model="info.mobile" oninput="value= this.value.slice(0,9)" onkeyup="value=this.value.slice(0,9)" type="number"
                                                              placeholder="请填写"></span></li>
          <li class="a"><p class="font28">价格：</p><span><input @blur="idBlur()" v-model="info.decorationId" oninput="value= this.value.slice(0,9)" onkeyup="value=this.value.slice(0,9)" type="number"
                                                              placeholder="请填写"></span></li>
          <li>
            <button @click="cancel">取 消</button>
            <button @click="confirm">确 定</button>
          </li>
        </ul>
      </div>
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
import {
  LightBox,
  LightBoxImg,
  LightBoxTxt
} from "vue-ydui/dist/lib.rem/lightbox";
/* 使用px：import {Accordion, AccordionItem} from 'vue-ydui/dist/lib.px/accordion'; */

Vue.component(LightBox.name, LightBox);
Vue.component(LightBoxImg.name, LightBoxImg);
Vue.component(LightBoxTxt.name, LightBoxTxt);
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
      myExplain: null
    };
  },
  methods: {
    openConfrim() {
      this.$confirm(
        "是否支付" + this.para.value + "商机点查看联系方式",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(res => {
          this.lookPhone();
        })
        .catch(() => {});
    },
    lookPhone() {
      let data = {};
      data.guid = this.$route.query.guid;
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
          this.lookPhonePara();
        },
        this
      );
    }
  },
  mounted() {
    if (this.$route.query.type == 2) {
      this.topTitle = "采购单";
    } else if (this.$route.query.type == 1) {
      this.topTitle = "招标单";
      this.show = true;
    } else {
      this.topTitle = "产品服务";
    }
    this.getDetail();
    if (this.$route.query) {
      this.price = this.$route.query.b;
      this.postscript = this.$route.query.a;
      this.time = this.$route.query.c;
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  height: 100%;
  background: #fff;
  overflow: auto;
}
.content {
  padding: 20px 30px;
  margin: 20px 0;
  background: #fff;
}

#new_progress {
  padding-left: 300px;
  padding-right: 40px;
  height: 100%;
  overflow: scroll;
}
.contact {
  width: 100%;
  margin-bottom: 0.2rem;
  background: white;
  display: flex;
}

.contact > ul {
  width: 100%;
}

.contact > ul > li {
  display: flex;
  height: 35px;
  align-items: center;
  padding: 0 0.3rem;
  border-bottom: 1px solid #ececec;
}

.contact > ul > li > span:nth-child(1) {
  text-align: right;
  width: 60px;
}

.contact > ul > li > span:nth-child(2) {
  // flex: 1;
  margin-left: 0.2rem;
  width: 120px;
}

.contact > ul > li > span:nth-child(3) {
  width: 1.8rem;
  display: block;
  display: flex;
  align-items: center;
  .lookIcon {
    background: #f2725e;
    padding: 3px 8px;
    color: #fff;
    border-radius: 4px;
    img {
      width: 14px;
      height: 14px;
      margin-right: 5px;
    }
    display: flex;
    align-items: center;
  }
}

.contact > ul > li > span:nth-child(3) > a {
  background: #f2725e;
  display: flex;
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
  font-size: 12px;
  color: #777;
}

.declares > ul li > span {
  flex: 1;
  /* height: 0.6rem; */
  line-height: 0.6rem;
  display: flex;
  align-items: center;
  // border-radius: 0.05rem;
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
  border-top: 1px solid #ddd;
}

.declares > ol li {
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 0 10px;
  /*height: .8rem;*/
  align-items: center;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.declares > ol li > p {
  padding: 0 0.2rem 0 60px;
  border: none;
  text-align: left;
  width: 150px;
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
  font-size: 12px;
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
  border-bottom: 1px solid #f3f6f5;
  font-size: 0.28rem;
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
.shuoming {
  line-height: 2;
}
.list_item {
  font-size: 14px;
  background: #fff;
  min-height: 30x;
  line-height: 30px;
  padding: 0 20px;
  align-items: center;
  display: flex;
  .label {
    width: 100px;
    padding-right: 10px;
    text-align: right;
  }
  .labelContent {
    flex: 1;
  }
}
</style>
