<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native="back">返回</el-breadcrumb-item>
        <el-breadcrumb-item>发布采购</el-breadcrumb-item>
        <!--<el-breadcrumb-item></el-breadcrumb-item>-->
      </el-breadcrumb>
    </div>
    <div style="width: 100%;background:#fff">
      <Class changeNo=1 v-show="!showshow" @bmData='bmData' style="margin-bottom: 100px"></Class>
      <xieyi class="xie" v-if="showXieyi" :type='11' @closeXieyi='closeXieyi'></xieyi>
      <div class="edit" v-show="showshow" style="max-width: 100%">
        <div>
          <yd-cell-group>
            <yd-cell-item arrow type="link" href="" @click.native="open">
              <span class="font30" slot="left">选择采购/招标分类</span>
              <span class="yd_bu font28" slot="right">{{bm.className==null?'请选择':bm.className}}</span>
            </yd-cell-item>
          </yd-cell-group>
        </div>
        <div class="declares">
          <ul>
            <li class="mb1"><p>标题</p><span style="border:0"><el-input v-model="bm.title" :maxlength="40" type="text"></el-input></span>
            <el-checkbox v-model="isUrgent">急</el-checkbox>
              <!-- <yd-checkbox v-model="isUrgent" size="16">急</yd-checkbox> -->
            </li>
            <!-- <li><p>采购数量</p><span><input v-model="bm.number" oninput='value=this.value.slice(0,9)'
                                        onkeyup='value=this.value.slice(0,9)' type="number"></span></li> -->
            <li><p>截止日期</p>
            <!-- <span style="display:flex;align-items:center;">
              <yd-datetime type="date" v-model="bm.endTime" slot="right"></yd-datetime>
              </span> -->
               <el-date-picker
                  style="flex:1"
                  v-model="bm.endTime"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
            </li>
            <li><p>交货地址</p><span style="border:0"><el-input  v-model="bm.deliveryAddress" :maxlength="100" type="text"></el-input></span></li>
          </ul>
        </div>

        <div class="declares" style="margin:.2rem 0">
          <ol>
            <li style="color:#666;"><p>产品/服务</p><span>数量</span><span>金额</span><span>操作</span></li>
            <li v-show="bm.purchaseDetailsList.length>0" v-for="(item,index) in bm.purchaseDetailsList" :key="index">
              <p>{{item.productService}}</p><span>{{item.number}}</span><span>{{item.money}}</span><span><el-button type="text" @click="deleteIndex(index)">删除</el-button></span>
            </li>
            <li><a @click="add"><i>+</i>添加</a></li>
          </ol>
          <div class="textar">
          <!-- <span>
            <yd-textarea slot="right" placeholder="说明/附言" style="padding:.1rem" v-model="bm.explains"
                         :maxlength="300"></yd-textarea>
          </span> -->
          <el-input type="textarea" v-model="bm.explains"  placeholder="说明/附言,最多300字"  :maxlength="300"  :rows="5" resize="none"></el-input>
          </div>
          <div class="important-input-div flex">
            <el-input v-model="keyword[0]" class="flex1 mr1" @blur="keywordS" :maxlength="10" placeholder="输入关键词"></el-input>
            <el-input v-model="keyword[1]" class="flex1 mr1" @blur="keywordS" :maxlength="10" placeholder="输入关键词"></el-input>
            <el-input v-model="keyword[2]" class="flex1 mr1" @blur="keywordS" :maxlength="10" placeholder="输入关键词"></el-input>
            <!-- <input type="text" v-model="keyword[0]" @blur="keywordS" :maxlength="10" placeholder="输入关键词">
            <input placeholder="输入关键词" @blur="keywordS" :maxlength="10" v-model="keyword[1]" type="text">
            <input placeholder="输入关键词" @blur="keywordS" :maxlength="10" v-model="keyword[2]" type="text"> -->
          </div>
        </div>
        <div class="list_item">
          <div class="label">发布范围</div>
            <el-select class="labelContent" v-model="bm.positionCondition" placeholder="请选择">
              <el-option
                v-for="(item,index) in pianList"
                :key="index"
                :label="item.name"
                :value="index">
              </el-option>
            </el-select>
        </div>

         <div class="list_item">
          <div class="label">供应商要求</div>
            <el-select class="labelContent" v-model="bm.levelCondition" placeholder="请选择">
              <el-option
                v-for="(item,index) in supplyList"
                :key="index"
                :label="item.name"
                :value="index">
              </el-option>
            </el-select>
        </div>
        <div class="list_item">
          <div class="label"></div>
          <el-checkbox :color='mainColor' v-model="checkbox1">勾选即表示同意</el-checkbox><span class="agreement" @click="showXieyi=true">发布采购/招标协议</span>
        </div>
         <div class="list_item">
           <div class="label"></div>
           <div class="labelContent">
             <el-button type="primary" @click="openConfrim">立即发布</el-button>
           </div>
         </div>
        <div class="to-select">
                  <!-- <div class="buttonBox">
            <yd-button size="large" class="send" @click.native="openConfrim" :bgcolor="mainColor" color='#fff'
                       type="primary">立即发布
            </yd-button>
          </div> -->
        </div>

        <div class="alertText" v-show="alertT">
          <ul>
            <li class="a"><p class="font28">产品/服务：</p><span style="border:0"><el-input v-model="childs.productService" type="text"
                                                                 placeholder="请填写" :maxlength="50"></el-input></span></li>
          <li class="a"><p class="font28">数量：</p>
          <span style="border:0">
            <el-input type="text" v-model="childs.number" :maxlength="9"></el-input>
            </span></li>
          <li class="a"><p class="font28">价格：</p><span style="border:0"><el-input v-model="childs.money" placeholder="请填写" :maxlength="12"></el-input></span></li>
          <li>
              <el-button @click="cancel">取消</el-button>
              <el-button @click="confirm" type="primary">确定</el-button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Radio, RadioGroup } from "vue-ydui/dist/lib.rem/radio";
import { Button, ButtonGroup } from "vue-ydui/dist/lib.rem/button";
Vue.component(Button.name, Button);
Vue.component(ButtonGroup.name, ButtonGroup);
Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);

import { CheckBox, CheckBoxGroup } from "vue-ydui/dist/lib.rem/checkbox";

Vue.component(CheckBox.name, CheckBox);
Vue.component(CheckBoxGroup.name, CheckBoxGroup);

import { CellGroup, CellItem } from "vue-ydui/dist/lib.rem/cell";
Vue.component(CellGroup.name, CellGroup);
Vue.component(CellItem.name, CellItem);

import { TextArea } from "vue-ydui/dist/lib.rem/textarea";
Vue.component(TextArea.name, TextArea);
import {
  Confirm,
  Alert,
  Toast,
  Notify,
  Loading
} from "vue-ydui/dist/lib.rem/dialog";
import { DateTime } from "vue-ydui/dist/lib.rem/datetime";
import { Layout } from "vue-ydui/dist/lib.rem/layout";
import { Icons } from "vue-ydui/dist/lib.rem/icons";
import { Accordion, AccordionItem } from "vue-ydui/dist/lib.rem/accordion";

Vue.component(Accordion.name, Accordion);
Vue.component(AccordionItem.name, AccordionItem);
Vue.component(CellItem.name, CellItem);
Vue.component(RadioGroup.name, RadioGroup);
Vue.component(Icons.name, Icons);
Vue.component(Layout.name, Layout);

Vue.component(DateTime.name, DateTime);
import Class from "./classification.vue";
import store from "@/store";

import xieyi from "@/components/login/agreement.vue";

export default {
  components: {
    Class,
    xieyi
  },
  data() {
    let userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    let mainColor = this.$color[userInfo.organType];
    let endTime = this.$today();
    var organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    // 圈子类型 1企业 2 个人 3 物业
    //用户类型 1:租户；2:商家；3:管理处；4:物业公司；5:其他（个人）；6：业主 0为空
    // 根据用户类型判断
    var userType = userInfo.organType;
    let TypeListCircle;
    if (userType == 1) {
      TypeListCircle = 1;
    } else if (userType == 5) {
      TypeListCircle = 2;
    } else {
      TypeListCircle = 3;
    }
    return {
      showXieyi: false,
      showAgreement: false,
      agreementType: 11,
      showshow: true,
      picked: false,
      peopleNum: "",
      organInfo,
      mainColor,
      checkbox1: true,
      userInfo,
      imgLength: 0,
      imgIndex: 0,
      TypeListCircle,
      bbsList: [],
      pianList: [],
      uploadFileList: [],
      uploadPreviewList: [],
      selectList: [],
      keyword: [],
      checkbox: false,
      agree: false,
      title: "",
      showTab: 0,
      text: "",
      getData: "",
      getLogoMsg: "",
      imageUrlList: [],
      imageKeyList: [],
      imageUrl: "",
      TypeList: "",
      TypeList1: -1,
      TypeList2: "",
      TypeList3: [],
      endTime,
      alertT: false,
      info: {
        name: "",
        mobile: null,
        decorationId: null,
        type: ""
      },
      supplyList: [
        {
          name: "不限",
          value: 0
        },
        {
          name: "基础会员",
          value: 1
        },
        {
          name: "中级会员",
          value: 2
        },
        {
          name: "高级会员",
          value: 3
        },
        {
          name: "金牌会员",
          value: 4
        }
      ],
      regId: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
      regName: /^[a-zA-Z\u4e00-\u9fa5]+$/,
      regPhone: /^1[3578]\d{9}$/,
      bm: {
        className: "",
        token: "",
        title: "",
        number: 1,
        startTime: "",
        endTime: this.$today(),
        deliveryAddress: "",
        explains: "",
        isUrgent: 2,
        keyword: "",
        positionCondition: 0,
        scopeValue: 0,
        levelCondition: 0,
        purchaseDetailsList: [],
        payType: 2,
        fatherClassId: null,
        classId: null
      },
      isUrgent: false,
      childs: {
        money: null,
        number: null,
        productService: null
      },
      para: {
        value: null
      }
    };
  },
  watch: {
    isUrgent: "gent"
  },
  methods: {
    clearNoNum(obj) {
      //先把非数字的都替换掉，除了数字和.
      obj.value = obj.value.replace(/[^\d.]/g, "");
      //必须保证第一个为数字而不是.
      obj.value = obj.value.replace(/^\./g, "");
      //保证只有出现一个.而没有多个.
      obj.value = obj.value.replace(/\.{2,}/g, ".");
      //保证.只出现一次，而不能出现两次以上
      obj.value = obj.value
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
    },
    closeXieyi() {
      this.showXieyi = false;
    },
    mBack() {
      this.showAgreement = false;
    },
    lookPhonePara() {
      let data = {};
      data.token = this.$getkey();
      data.type = "releasePurchase";
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
    openConfrim() {
      this.releasePurchasing();
    },
    bmData(e) {
      this.showshow = true;
      if (e) {
        this.bm.className = e.name;
        this.bm.classId = e.guid;
        this.bm.fatherClassId = e.fguid;
      }
    },
    open() {
      this.showshow = false;
    },
    deleteIndex(index) {
      this.bm.purchaseDetailsList.splice(index, 1);
    },
    //发布采购
    releasePurchasing() {
      if (this.bm.classId == null || this.bm.fatherClassId == null) {
        this.$dialog.toast({ mes: "请选择分类！" });
        return;
      }
      if (this.bm.title == "") {
        this.$dialog.toast({ mes: "标题不能为空！" });
        return;
      }
      if (this.bm.deliveryAddress == "") {
        this.$dialog.toast({ mes: "请填写交货地址！" });
        return;
      }
      if (this.bm.purchaseDetailsList.length <= 0) {
        this.$dialog.toast({ mes: "请添加产品服务！" });
        return;
      }
      if (this.bm.explains == "") {
        this.$dialog.toast({ mes: "说明处内容不能为空！" });
        return;
      }
      if (!this.checkbox1)
        return this.$dialog.toast({ mes: "请同意发布采购协议" });
      let data = {};
      data.token = this.$getkey();
      data.title = this.bm.title;
      data.number = this.bm.number;
      data.endTime = this.bm.endTime;
      data.deliveryAddress = this.bm.deliveryAddress;
      data.explains = this.bm.explains;
      data.isUrgent = this.bm.isUrgent;
      data.keyword = this.bm.keyword;
      data.positionCondition = this.bm.positionCondition;
      data.scopeValue = this.bm.scopeValue;
      data.levelCondition = this.bm.levelCondition;
      // data.purchaseDetailsList=this.bm.purchaseDetailsList;
      data.payType = this.bm.payType;
      data.fatherClassId = this.bm.fatherClassId;
      data.classId = this.bm.classId;
      this.$confirm("此次需支付" + this.para.value + "商机点！").then(() => {
        this.$ajax1(
          `${this.subUrl.bd}/purchase/releasePurchasing?${this.$qs.stringify(
            data
          )}`,
          this.bm.purchaseDetailsList,
          res => {
            this.$dialog.toast({ mes: "发布成功！" });
            this.back();
          },
          this
        );
      });

      store.guid = null;
      store.name = null;
      store.fguid = null;
    },

    gent() {
      if (this.isUrgent == false) {
        this.bm.isUrgent = 2;
      } else {
        this.bm.isUrgent = 1;
      }
      console.log(this.bm.isUrgent);
    },
    keywordS() {
      this.bm.keyword = this.keyword.join(",");
    },
    add() {
      this.alertT = true;
    },
    confirm() {
      if (!this.childs.productService)
        return this.$dialog.toast({ mes: "产品服务不能为空" });
      if (!this.childs.number)
        return this.$dialog.toast({ mes: "数量不能为空" });
      if (!this.childs.money)
        return this.$dialog.toast({ mes: "价格不能为空" });
      if (!(this.childs.money * 1 >= 0)) {
        return this.$dialog.toast({ mes: "输入的价格不正确" });
      }
      this.bm.purchaseDetailsList.push({
        money: this.childs.money,
        number: this.childs.number,
        productService: this.childs.productService
      });
      this.childs = {};
      this.alertT = false;
    },
    // 获取发布范围
    getPlace(data) {
      data = data ? data : {};
      data.userId = this.userInfo.guid;
      data.token = this.$getkey();
      this.$ajax(
        `${this.subUrl.bd}/knowAll/userDistrict`,
        data,
        res => {
          this.pianList = res.data.reverse();
        },
        this
      );
    },
    selectTab(index) {
      this.showTab = index;
    },
    cancel() {
      this.alertT = false;
    },
    back() {
      this.$back(this);
      store.guid = null;
      store.name = null;
      store.fguid = null;
    }
  },
  updated() {
    if (typeof this.childs.number == "string") {
      this.childs.number = this.childs.number.replace(/\D/g, "");
    }
    if (typeof this.childs.money == "string") {
      this.childs.money = this.childs.money.replace(/[^\d|\.]+/g, "");
    }
  },
  mounted() {
    this.userId = this.userInfo.guid;
    this.lookPhonePara();
    this.getPlace();
  },
  beforeUpdate() {}
};
</script>
<style scoped>
@import url(../../../../assets/css/list.css);
#new_progress {
  padding-left: 300px;
  padding-right: 40px;
  height: auto;
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
  width: 200px;
  font-size: 14px;
  color: #999999;
  line-height: 60px;
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
  font-size: 12px;
  color: #999999;
  opacity: 1;
}

.important-input-div input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  font-size: 12px;
  color: #999999;
  opacity: 1;
}

.important-input-div input:-ms-input-placeholder {
  font-size: 12px;
  color: #999999;
  opacity: 1;
}

.important-input-div input::-webkit-input-placeholder {
  font-size: 12px;
  color: #999999;
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

.declares ul {
  width: 100%;
  padding: 0.2rem 0.4rem;
}
.list_item {
  margin-bottom: 10px;
}

.declares ul li {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.declares ul li > p {
  width: 1.6rem;
  text-align: right;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.declares ul li > span {
  flex: 1;
  height: 34px;
  border: 1px solid #d9d9d9;
  border-radius: 0.05rem;
  margin-right: 0.2rem;
  display: inline-block;
}

.declares ul li > span > input {
  width: 900px;
  height: 100%;
  border: none;
  padding: 0 0.1rem;
  box-sizing: border-box;
  display: inline-block;
}

.declares ol {
  width: 100%;
}

.declares ol li {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  height: 0.8rem;
  color: #777;
  padding: 0 0.4rem;
  align-items: center;
}

.declares ol li > p {
  flex: 1;
}

.declares ol li > span {
  width: 1.5rem;
}

.declares ol li:nth-child(1) {
  border-bottom: 1px solid #ececec;
}

.textar {
  display: flex;
  padding: 0.1rem 0.3rem;
}

.textar > span {
  width: 100%;
  height: 100%;
  border: 1px solid #d9d9d9;
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

.alertText {
  z-index: 999;
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
  width: 600px;
  background: white;
  padding: 50px 20px;
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
  padding-left: 100px;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
