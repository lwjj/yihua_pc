<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native="back">返回</el-breadcrumb-item>
        <el-breadcrumb-item>发布招标</el-breadcrumb-item>
        <!--<el-breadcrumb-item></el-breadcrumb-item>-->
      </el-breadcrumb>
    </div>
    <div style="width: 100%">
    <Class changeNo=1 v-show="!showshow" @bmData='bmData'></Class>
    <!-- <agreement v-if="showAgreement" :agreementType="agreementType" @back="mBack"></agreement> -->
     <xieyi class="xie" v-if="showXieyi" :type='11' @closeXieyi='closeXieyi'></xieyi>  
    
    <div class="edit bgwhite" v-show="showshow && !showAgreement">
      <!--<yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'发布招标'" title="发布招标"-->
                 <!--:bgcolor="mainColor" color="#fff">-->
      <!--<span class="addClickArea" slot="left" @click="back" style="color: #fff;">-->
        <!--<yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>-->
      <!--</span>-->
      <!--</yd-navbar>-->

      <yd-cell-group>
        <yd-cell-item arrow type="link" href="" @click.native="open">
          <span style="font-size:14px;" slot="left">选择采购/招标分类</span>
          <span class="yd_bu font28" slot="right">{{bm.className==null?'请选择':bm.className}}</span>
        </yd-cell-item>
      </yd-cell-group>

      <div class="declares">
        <ul>
          <li><p>项目名称</p><span><input v-model="bm.title" type="text" maxlength="40"></span></li>
          <li><p>招标金额</p><span><input v-model="bm.money" type="number" :maxlength="7"></span></li>
          <li><p>截止日期</p>
               <el-date-picker
                  v-model="bm.endTime"
                  style="flex:1"
                  :clearable="false"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              <!-- <yd-datetime type="date" v-model="bm.endTime" slot="right"></yd-datetime> -->
         </li>
          <li><p>买家地址</p><span><input v-model="bm.address" type="text" maxlength="100"></span></li>
          <li><p>交货日期</p>
            <el-date-picker
                style="flex:1"
                class="mt1"
              v-model="bm.deliveryTime"
              :clearable="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </li>
          <li><p>交货地址</p><span><input v-model="bm.deliveryAddress"  type="text" maxlength="100"></span></li>
        </ul>
      </div>

      <div class="declares" style="margin:.2rem 0">
        <ol>
          <li sytle="color:#666"><p>产品/服务</p><span>数量</span><span>金额</span><span style="display:inline-block;width:100px;">操作</span></li>
          <li v-for="(item,index) in bm.purchaseDetailsList" :key="index">
            <p>{{item.productService}}</p><span>{{item.number}}</span><span>{{item.money}}</span>
            <span style="display:inline-block;width:100px;"><el-button type='danger' size='mini' @click="deleteItem(index)" class="">删除</el-button></span></li>
          <li><a @click="add"><i>+</i>添加</a></li>
        </ol>
        <div class="textar">
          <el-input type="textarea" v-model="bm.explains"  placeholder="说明/附言,最多300字"  :maxlength="300"  :rows="5" resize="none"></el-input>
        </div>
        
        <div class="important-input-div flex">
            <el-input v-model="keyword[0]" class="flex1 mr1" @blur="keywordS" :maxlength="10" placeholder="输入关键词"></el-input>
            <el-input v-model="keyword[1]" class="flex1 mr1" @blur="keywordS" :maxlength="10" placeholder="输入关键词"></el-input>
            <el-input v-model="keyword[2]" class="flex1 mr1" @blur="keywordS" :maxlength="10" placeholder="输入关键词"></el-input>
          </div>
        <div class="details">
          <div class="text">上传图片/拍照</div>
          <div class="images">
            <el-upload
                :action="uploadUrl"
                list-type="picture-card"
                :data='otherData'
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePictureCardPreview"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :limit='5'
                :on-exceed='uploadMax'
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" size="tiny">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
          </div>
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
                v-for="(item,index) in supplyList1" :key="index"
                :label="item.name"
                :value="index">
              </el-option>
            </el-select>
        </div>

        <div class="list_item">
          <div class="label">投标要求</div>
            <el-select class="labelContent" v-model="bm.seniority" placeholder="请选择">
              <el-option label="不限" :value="0"></el-option>
              <el-option label="报价需含税" :value="1"></el-option>
              <el-option label="物流费须由商家承担" :value="2"></el-option>
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
      <div class="alertText" v-show="alertT">
          <ul>
            <li class="a"><p>产品/服务：</p><span style='border:0'><el-input v-model="childs.productService" type="text" placeholder="请输入产品服务" :maxlength="50">
                                                                 </el-input></span></li>
          <li class="a"><p>数量：</p><span style='border:0'><el-input type="number" v-model="childs.number" placeholder="请输入数量" :maxlength="9" ></el-input></span></li>
          <li class="a"><p>价格：</p><span style='border:0'><el-input v-model="childs.money" placeholder="请输入价格" :maxlength="12"></el-input></span></li>
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
/* 使用px：import {CellGroup, CellItem} from 'vue-ydui/dist/lib.px/cell'; */

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
// import {Radio, RadioGroup} from 'vue-ydui/dist/lib.rem/radio';
// import {CellGroup, CellItem} from 'vue-ydui/dist/lib.rem/cell';
// import {Switch} from 'vue-ydui/dist/lib.rem/switch';
import { Accordion, AccordionItem } from "vue-ydui/dist/lib.rem/accordion";

Vue.component(Accordion.name, Accordion);
Vue.component(AccordionItem.name, AccordionItem);
// Vue.component(Switch.name, Switch);

// Vue.component(CellGroup.name, CellGroup);
Vue.component(CellItem.name, CellItem);
// Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);
Vue.component(Icons.name, Icons);
Vue.component(Layout.name, Layout);

Vue.component(DateTime.name, DateTime);
// import fn from "@/assets/js/product";
import Class from "./classification.vue";
import agreement from "./agreement.vue";
import store from "@/store";
import xieyi from "@/components/login/agreement.vue";

export default {
  components: {
    Class,
    agreement,
    xieyi
  },
  data() {
    let userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    let mainColor = this.$color[userInfo.organType];
    let endTime = this.$today();
    let organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    // 圈子类型 1企业 2 个人 3 物业
    //用户类型 1:租户；2:商家；3:管理处；4:物业公司；5:其他（个人）；6：业主 0为空
    // 根据用户类型判断
    let userType = userInfo.organType;
    let TypeListCircle;
    if (userType == 1) {
      TypeListCircle = 1;
    } else if (userType == 5) {
      TypeListCircle = 2;
    } else {
      TypeListCircle = 3;
    }
    this.uploadUrl = "http://up-z2.qiniu.com";
    return {
      supplyList1: [
        {
          name: "不限"
        },
        {
          name: "基础会员"
        },
        {
          name: "中级会员"
        },
        {
          name: "高级会员"
        },
        {
          name: "金牌会员"
        }
      ],
      dialogImageUrl: "",
      levelCondition: 0,
      dialogVisible: false,
      otherData: {},
      imgsAll: [],
      showXieyi: false,
      showAgreement: false,
      agreementType: 11,
      showshow: true,
      picked: false,
      checkbox1: true,
      peopleNum: "",
      organInfo,
      mainColor,
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

      getHearLog: {
        domain: "",
        token: "",
        name: ""
      },
      imgName: [],
      imgUrl: [],
      show1: true,
      images: [],
      datetime2: this.$today(),
      datetime1: this.$today(),
      bm: {
        token: "",
        title: "",
        endTime: this.$today(),
        deliveryTime: this.$today(),
        deliveryAddress: "",
        address: "",
        purchaseDetailsList: [],
        explains: "",
        keyword: "",
        isOffer: 0,
        positionCondition: 4,
        scopeValue: 0,
        isUrgent: 2,
        accessory: "",
        payType: 2,
        seniority: 0,
        money: null,
        classId: null,
        fatherClassId: null,
        className: null
      },
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
  methods: {
    // 删除单项产品服务报价
    deleteItem(index) {
      this.bm.purchaseDetailsList.splice(index, 1);
    },
    getUploadToken() {
      this.$ajax(
        `${this.subUrl.user}/qiniu/getInfo`,
        { token: this.$getkey() },
        res => {
          console.log(res.data, "token");
          var obj = {
            chunk: 0,
            chunks: 1,
            token: res.data.token
          };
          this.otherData = obj;
          // obj.token;
        },
        this
      );
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadSuccess(res) {
      this.imgsAll[res.key] = res.key;
    },
    uploadError() {
      this.$message.error("上传失败");
    },
    uploadMax() {
      this.$message.error("最多上传5张图片");
    },
    beforeAvatarUpload(file) {
      const isImage = file.type.indexOf("image");
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (isImage == -1) {
        this.$message.error("上传图片格式有误!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
      }
      return isImage && isLt2M;
    },
    handleRemove(file, fileList) {
      delete this.imgsAll[file.response.key];
    },
    closeXieyi() {
      this.showXieyi = false;
    },
    mBack() {
      this.showAgreement = false;
    },
    delImg(index) {
      this.imgName.splice(index, 1);
      this.imgUrl.splice(index, 1);
      console.log(this.imgUrl);
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
      this.releaseTender();
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
    //发布招标
    releaseTender() {
      console.log(this.bm);
      this.bm.accessory = this.imgName.join(",");
      if (this.bm.classId == null || this.bm.fatherClassId == null) {
        this.$dialog.toast({ mes: "请选择分类！" });
        return;
      }

      if (this.bm.title == "") {
        this.$dialog.toast({ mes: "项目名称不能为空！" });
        return;
      }
      if (!this.bm.money) {
        return this.$dialog.toast({ mes: "招标金额不能为空" });
      }
      if (!(this.bm.money * 1 >= 0)) {
        return this.$dialog.toast({ mes: "请输入正确的招标金额" });
      }
      if (this.bm.address == "") {
        this.$dialog.toast({ mes: "请填写买家地址！" });
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
        this.$dialog.toast({ mes: "产品/服务说明内容不能为空！" });
        return;
      }
      // if (this.bm.positionCondition)
      //   return this.$dialog.toast({ mes: "请选择发布范围" });
      // if (!this.bm.seniority)
      //   return this.$dialog.toast({ mes: "请选择投标要求" });
      // if (!this.bm.levelCondition)
      //   return this.$dialog.toast({ mes: "请选供应商要求" });
      if (!this.checkbox1) return this.$dialog.toast({ mes: "请同意招标协议" });
      var a = [];
      for (var key in this.imgsAll) {
        this.imgsAll[key];
        a.push(this.imgsAll[key]);
      }
      this.bm.accessory = a.join(",");
      let data = {};
      data.token = this.$getkey();
      data.title = this.bm.title;
      data.money = this.bm.money;
      data.endTime = this.bm.endTime;
      data.deliveryTime = this.bm.deliveryTime;
      data.deliveryAddress = this.bm.deliveryAddress;
      data.address = this.bm.address;
      data.explains = this.bm.explains;
      data.isOffer = this.bm.isOffer;
      data.isUrgent = this.bm.isUrgent;
      data.keyword = this.bm.keyword;
      data.positionCondition = this.bm.positionCondition;
      data.scopeValue = this.bm.scopeValue;
      data.levelCondition = this.bm.levelCondition;
      // data.purchaseDetailsList=this.bm.purchaseDetailsList;
      data.payType = this.bm.payType;
      data.fatherClassId = this.bm.fatherClassId;
      data.classId = this.bm.classId;
      data.seniority = this.bm.seniority;
      data.accessory = this.bm.accessory;
      this.$dialog.confirm({
        mes: "此次需支付" + this.para.value + "商机点！",
        opts: () => {
          this.$ajax1(
            `${this.subUrl.bd}/purchase/releaseTender?${this.$qs.stringify(
              data
            )}`,
            this.bm.purchaseDetailsList,
            res => {
              this.$dialog.toast({ mes: "发布成功！" });
              this.back();
            },
            this
          );
        }
      });

      // store.guid = null;
      // store.name = null;
      // store.fguid = null;
    },
    keywordS() {
      this.bm.keyword = this.keyword.join(",");
      // console.log(this.bm.keyword)
    },
    update(e) {
      let file = e.target.files[0];
      let d = new Date();
      let type = file.name.split(".");
      let tokenParem = {
        putPolicy:
          '{"name":"$(fname)","size":"$(fsize)","w":"$(imageInfo.width)","h":"$(imageInfo.height)","hash":"$(etag)"}',
        key:
          "orderReview/" +
          d.getFullYear() +
          "/" +
          (d.getMonth() + 1) +
          "/" +
          d.getDate() +
          "/" +
          d.valueOf() +
          "." +
          type[type.length - 1],
        bucket: this.getHearLog.domain //七牛的地址，这个是你自己配置的（变量）
      };
      let param = new FormData(); //创建form对象
      param.append("chunk", "0"); //断点传输
      param.append("chunks", "1");
      param.append("file", file, file.name);
      // console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      //先从自己的服务端拿到token

      this.token = this.getHearLog.token;
      param.append("token", this.token);
      //  if(this.images.length>1){
      //    alert('不能超过1张');
      //    return;
      //  }
      this.uploading(param, config, file.name); //然后将参数上传七牛
      return;
    },
    uploading(param, config, pathName) {
      this.xhr.post("http://up-z2.qiniu.com", param, config).then(response => {
        this.getHearLog.name = response.data.key;
        if (this.imgName.length < 5) {
          this.imgName.push(this.getHearLog.name);
          this.imgUrl.push(this.getHearLog.domain + "/" + this.getHearLog.name);
        }
        // this.bm.accessory=this.imgName.join(',')
        console.log(this.bm.accessory);
        let localArr = this.images.map((val, index, arr) => {
          return arr[index].localSrc;
        });
        if (!~localArr.indexOf(pathName)) {
          this.images.push({
            src: this.showUrl + response.data.key,
            localSrc: pathName
          });
        } else {
          alert("已上传该图片");
        }
      });
    },
    getQiniuInfo() {
      this.xhr
        .post(`${this.subUrl.user}/qiniu/getInfo?token=` + this.$getkey())
        .then(res => {
          if (res.data.code == 1) {
            this.getHearLog = res.data.data;
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    addImg() {
      this.getQiniuInfo();
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
      var patrn = /^\d+(\.\d+)?$/;
      if (!patrn.test(this.childs.money)) {
        return this.$dialog.toast({ mes: "价格输入不正确" });
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
          this.pianList = res.data;
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
    if (typeof this.bm.money == "string") {
      this.bm.money = this.bm.money.replace(/[^\d|\.]+/g, "");
    }
  },
  mounted() {
    this.userId = this.userInfo.guid;
    // this.$getkey() = fn.getIng();
    this.getUploadToken();
    this.lookPhonePara();
    this.getPlace();
    this.$set(this.bm, "levelCondition", 0);
  },
  beforeUpdate() {
    // this.bm.className = store.name;
    // this.bm.classId = store.guid;
    // this.bm.fatherClassId = store.fguid;
  }
};
</script>
<style scoped>
@import url(../../../../assets/css/list.css);

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
  font-size: 0.26rem;
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
  background: #fff;
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
  color: #999999;
  opacity: 1;
}

.important-input-div input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  font-size: 0.24rem;
  color: #999999;
  opacity: 1;
}

.important-input-div input:-ms-input-placeholder {
  font-size: 0.24rem;
  color: #999999;
  opacity: 1;
}

.important-input-div input::-webkit-input-placeholder {
  font-size: 0.24rem;
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

.declares > ul {
  width: 100%;
  padding: 10px;
}

.declares > ul li {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  margin: 0.2rem 0;
}

.declares > ul li > p {
  width: 1.6rem;
  display: flex;
  justify-content: center;
  height: 0.7rem;
  align-items: center;
  font-size: 14px;
  color: #777;
}

.declares > ul li > span {
  flex: 1;
  height: 0.7rem;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.declares > ul li > span > input {
  width: 100%;
  height: 100%;
  border: none;
  margin-left: 0.1rem;
}

.declares > ol {
  width: 100%;
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
}

.declares > ol li > span {
  width: 1.5rem;
}

.declares > ol li:nth-child(1) {
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

.declares > ol li > a {
  width: 2rem;
  display: flex;
  flex-flow: row;
  align-items: center;
  color: #0093d2;
}

.declares > ol li > a > i {
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

.list_item {
  margin-bottom: 10px;
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
  font-size: 12px;
  width: 100%;
}

.alertText ul li:nth-child(4) {
  margin-top: 0.2rem;
  display: flex;
  padding-left: 100px;
}

.details {
  width: 100%;
  background: white;
}

.text {
  width: 100%;
  padding: 0.1rem 0.3rem;
  color: #999;
}

.images {
  display: flex;
  width: 100%;
  padding: 0.1rem 0.3rem;
}

.images > p {
  width: 1.2rem;
  height: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.1rem;
  position: relative;
}

.images > p > img {
  width: 100%;
  height: 100%;
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
  position: relative;
}

.images > ul > li > span {
  width: 0.3rem;
  height: 0.3rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
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
#new_progress {
  padding-left: 300px;
  padding-right: 40px;
  height: auto;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
