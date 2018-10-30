<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native="back">推送管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增推送</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <Customer v-show="!showshow" @bmData='bmData'></Customer>
    <div style="margin-top: 10px">
      <div v-show="showshow" class="edit">
        <div class="declares" style="margin-bottom:.2rem;">
          <ol>
            <li sytle="color:#666"><p>商家经营信息</p></li>
          </ol>
          <ul>
            <li>
              <p>商家LOGO</p>
              <div class="images">
                <el-upload
                  :action="uploadUrl"
                  list-type="picture-card"
                  :data='otherData'
                  :before-upload="beforeAvatarUpload"
                  :on-preview="handlePictureCardPreview"
                  :on-success="uploadSuccess"
                  :file-list='imgList'
                  :on-error="uploadError"
                  :limit='1'
                  :on-exceed='uploadMax'
                  :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" size="tiny">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </div>
            </li>
            <li><p>店铺名称</p><span><input :maxlength="35" v-model="pm.shopName" type="text"></span></li>
            <li><p>营销标语</p><span><input :maxlength="35" v-model="pm.slogan" type="text"></span></li>
            <li><p>店铺地址</p><span><input :maxlength="35" v-model="pm.shopAddress" type="text"></span></li>
            <li><p>服务电话</p><span><input :maxlength="35" v-model="pm.servicePhone" type="text"></span></li>
            <li><p>公众号</p><span><input :maxlength="35" v-model="pm.publicNum" type="text"></span></li>
          </ul>
        </div>
        <div class="declares" style="margin:.2rem 0">
          <ol>
            <li style="color:#333;">填写营销信息</li>
          </ol>
          <div class="textar">
            <div
            style="height:.8rem;display:flex;justify-content: left;border-bottom:1px solid #F3F3F2;align-items:center;">
            <p>类型</p>
             <el-radio-group v-model="pm.type">
                <el-radio :label="2">会员卡</el-radio>
                <el-radio :label="1">优惠劵</el-radio> 
              </el-radio-group>
            
            
          </div>
            <div>
              <p>标题</p>
                <el-input class="a" :maxlength="35" v-model="pm.expandTitle" placeholder="推广"></el-input>
            </div>
            <div>
              <p>规则介绍</p>
              <el-input v-model="pm.ruleIntroduction" placeholder="文本内容" :maxlength="300" type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </div>
          </div>
        </div>

        <div class="declares" style="margin:.2rem 0">
          <ol>
            <li style="color:#333;">设置有效时间</li>
          </ol>
          <div type="label" style="padding: 10px 20px">
            <span slot="left">长期有效</span>
            <el-switch
              v-model="toggle"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>

          </div>
          <div class="textar" v-if="!toggle">
            <div class="block" style="display: inline-block">
              <span class="demonstration">开始时间</span>
              <el-date-picker
                v-model="pm.startDate"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
              <span class="demonstration" style="padding-left: 20px">结束时间</span>
              <el-date-picker
                v-model="pm.endDate"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </div>
          </div>
          <div style="border-top:1px solid #F3F3F2;">
          </div>
          <div style="padding: 10px 20px">
            <span>使用时间</span>
            <el-select v-model="checkedNames" multiple placeholder="请选择">
              <el-option
                v-for="item in week"
                :key="item.label"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
            <el-checkbox style="padding: 0px 20px" v-model="toggle1">全天</el-checkbox>
            <div style="display: inline-block" v-if="!toggle1">
              <span>其他时间</span>
              <el-input v-model="other" style="width: 220px" type="text"></el-input>
            </div>
          </div>
        </div>

        <div class="declares" style="margin:.2rem 0">
          <ol>
            <li style="color:#333;">推送对象</li>
          </ol>
          <div style="height:.8rem;display:flex;justify-content: left;border-bottom:1px solid #F3F3F2;align-items:center; padding-left: 60px">
            <el-radio v-model="pm.userList" :label="2">管理层</el-radio>
            <el-radio v-model="pm.userList" :label="1">公司</el-radio>
          </div>
        </div>

        <div class="declares" style="margin:.2rem 0">
          <ol>
            <li style="color:#333;">推送范围</li>
          </ol>
          <div class="bottoms">
            <el-select v-model="typeListIndex" placeholder="请选择" @change="handleTypeListIndex">
              <el-option
                v-for="(item,index) in typeList"
                :key="index"
                :label="item.type"
                :value="item.id">
              </el-option>
            </el-select>
            <div v-if="typeListIndex==2" style="display: inline-block; padding-left: 20px">
              {{buildingName}}
            </div>
            <div v-if="typeListIndex==3" style="display: inline-block; padding-left: 20px">
              <el-select v-model="pm.organIdList" placeholder="请选择客户">
                <el-option
                  v-for="(item,index) in customerList"
                  :key="index"
                  :label="item.organName"
                  :value="item.organId">
                </el-option>
              </el-select>
            </div>
            <div v-if="typeListIndex==4" style="display: inline-block; padding-left: 20px">
              <el-input type="text" style="width: 220px" v-model="pm.phoneList" placeholder="点击输入公司或客户电话"></el-input>
            </div>
            <!--<ul v-for="(item,index) in typeList" :key="index">-->
              <!--<li @click="checks(index)">-->
                <!--<i v-if="item.clickImg">-->
                  <!--<img src="../../../../assets/images/rent/baishitong/select_active.png" alt=""></i>-->
                <!--<i v-else><img src="../../../../assets/images/rent/baishitong/select.png" alt=""></i>-->
              <!--</li>-->
              <!--<li><span class="font30">{{item.type}}</span></li>-->
              <!--<li>-->
                <!--<span v-if="index==0" style="color:#999;">{{buildingName}}</span>-->
                <!--<p v-if="index==1&&pm.organIdList==''" class="textHidden" style="color:#999;overflow: hidden"-->
                   <!--@click="toggleH">点击选择客户</p>-->
                <!--<p v-if="index==1&&pm.organIdList!=''" class="textHidden" style="color:#999;overflow: hidden"-->
                   <!--@click="toggleH">-->
                  <!--{{pm.organIdList}}</p>-->
                <!--<p v-if="index==2">-->
                  <!--<input type="text" v-model="pm.phoneList" placeholder="点击输入公司或客户电话">-->
                <!--</p>-->
              <!--</li>-->
            <!--</ul>-->
          </div>
        </div>

        <!-- <div class="declares" style="margin:.2rem 0">
            <ol>
                <li style="color:#333;">推送范围</li>
            </ol>
            <div class="bottoms">
              <ul v-for="(item,index) in typeList" :key="index">
                <li @click="checks(index)">
                  <i v-if="item.clickImg"><img src="../../../../assets/images/rent/baishitong/select_active.png" alt=""></i>
                  <i v-else><img src="../../../../assets/images/rent/baishitong/select.png" alt=""></i>
                </li>
                <li><span class="font30">{{item.type}}</span></li>
                <li>
                  <span v-if="index==0||index==1" style="color:#999;">{{item.name}}</span>
                  <p v-if="index==2&&pm.organIdList==''" class="textHidden" style="color:#999;" @click="toggleH">点击选择客户</p>
                  <p v-if="index==2&&pm.organIdList!=''" class="textHidden" style="color:#999;" @click="toggleH">{{pm.organIdList}}</p>
                  <p v-if="index==3">
                    <input type="text" v-model="pm.phoneList" placeholder="点击输入公司或客户电话">
                  </p>
                </li>
              </ul>
            </div>
        </div> -->

        <div class="to-select">
          <div class="buttonBox">
            <el-button size="large" class="send" @click.native="addPushInfo" :bgcolor="mainColor" color='#fff'
                       type="primary">
              立即推送
            </el-button >
          </div>
        </div>
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
import Customer from "./my_customers.vue";
// import fn from "@/assets/js/product";
// import qs from "qs";
// import InfiniteScroll from "vue-infinite-scroll";
// import Vue from "vue";
// import {CheckBox, CheckBoxGroup} from 'vue-ydui/dist/lib.rem/checkbox';
import { TextArea } from "vue-ydui/dist/lib.rem/textarea";
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
// Vue.prototype.$dialog = {
//   confirm: Confirm,
//   alert: Alert,
//   toast: Toast,
//   notify: Notify,
//   loading: Loading,
// };
// Vue.component(TextArea.name, TextArea);
// Vue.component(CheckBox.name, CheckBox);
// Vue.component(CheckBoxGroup.name, CheckBoxGroup);
export default {
  components: {
    Customer
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
    this.uploadUrl = "http://up-z2.qiniu.com";
    return {
      showshow: true,
      imgList: [],
      typeListIndex: 2,
      typeList: [
        // {id:1,type:'周边3KM片区',clickImg:false,name:'南山区'},
        { id: 2, type: "本楼大厦", clickImg: false },
        { id: 3, type: "我的客户", clickImg: false },
        { id: 4, type: "特定客人", clickImg: false }
      ],
      week: [
        {
          value: "1",
          label: "星期一"
        },
        {
          value: "2",
          label: "星期二"
        },
        {
          value: "3",
          label: "星期三"
        },
        {
          value: "4",
          label: "星期四"
        },
        {
          value: "5",
          label: "星期五"
        },
        {
          value: "6",
          label: "星期六"
        },
        {
          value: "7",
          label: "星期天"
        }
      ],
      customerList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      otherData: {},
      imgsAll: [],
      picked: false,
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
      regId: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
      regName: /^[a-zA-Z\u4e00-\u9fa5]+$/,
      regPhone: /^1[3578]\d{9}$/,
      getHearLog: {
        domain: "",
        token: "",
        name: ""
      },
      imgName: "",
      imgUrl: "",
      show1: true,
      images: [],
      datetime2: this.$today(),
      datetime1: this.$today(),
      radio1: "",
      clickId: "",
      checkedNames: [],
      other: "",
      pm: {
        token: "",
        type: 1,
        organIdList: "",
        phoneList: "",
        createDate: "",
        endDate: this.$today() + " 23:59",
        expandTitle: "",
        guid: "",
        logoUrl: "",
        organId: "",
        publicNum: "",
        ruleIntroduction: "",
        servicePhone: "",
        shopAddress: "",
        shopName: "",
        slogan: "",
        startDate: this.$today() + " 00:00",
        state: 0,
        usableTime: "",
        userId: 0,
        userList: 1,
        vipImage: ""
      },
      toggle: false,
      toggle1: false,
      toggle2: false,
      toggle3: false,
      buildingName: ""
    };
  },
  methods: {
    // 获取最后一次新增记录
    getLast() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.bd}/opportunity/newestPushInfo`,
        data,
        res => {
          // 在此次还原数据
          var d = res.data;
          if (d.logoUrl) {
            console.log(d.logoUrl, "11");
            if (d.logoUrl.indexOf("oysfye6yt") == -1) {
              d.logoUrl = this.getHearLog.domain + "/" + d.logoUrl;
            }
            console.log(d.logoUrl, "22");
            this.$set(this.pm, "type", d.type * 1);
            this.imgList.push({ name: "logo", url: d.logoUrl });
            this.pm.logoUrl = d.logoUrl;
            this.imgUrl = d.logoUrl;
          }
          this.pm.shopName = d.shopName;
          this.pm.slogan = d.slogan;
          this.pm.shopAddress = d.shopAddress;
          this.pm.publicNum = d.publicNum;
          this.pm.type = d.type;
          console.log(d, "xxx");
          this.pm.servicePhone = d.servicePhone;
          this.pm.expandTitle = d.expandTitle;
          this.pm.ruleIntroduction = d.ruleIntroduction;
          if (d.startDate) this.pm.startDate = d.startDate.substr(0, 16);
          if (d.endDate) this.pm.endDate = d.endDate.substr(0, 16);
        },
        this
      );
    },
    // 推送范围选择
    handleTypeListIndex(e) {
      this.pm.type = e;
      if (this.typeListIndex == 3) {
        this.getCustomerList();
        this.pm.phoneList = "";
      }
      if (this.typeListIndex == 4) {
        this.pm.organIdList = "";
      }
    },
    // 获取客户列表
    getCustomerList() {
      var data = {
        token: this.$getkey(),
        state: 0
      };
      var url = this.subUrl.bd + "/opportunity/mySupplierList";
      this.$ajax(url, data, res => {
        this.customerList = res.data.list;
      });
    },
    getUploadToken() {
      this.$ajax(
        `${this.subUrl.user}/qiniu/getInfo`,
        { token: this.$getkey() },
        res => {
          var obj = {
            chunk: 0,
            chunks: 1,
            token: res.data.token
          };
          this.getHearLog = res.data;
          // 有域名之后获取信息
          this.getLast();
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
      console.log(res, "xxxx");
      this.pm.logoUrl = this.getHearLog.domain + "/" + res.key;
      this.imgsAll[res.key] = res.key;
      // this.pm.logoUrl = res.key;
    },
    uploadError() {
      this.$message.error("上传失败");
    },
    uploadMax() {
      this.$message.error("最多上传1张图片");
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
      this.pm.logoUrl = "";
      delete this.imgsAll[file.response.key];
    },
    bmData(e) {
      this.showshow = !this.showshow;
      if (e) {
        console.log(e);
        this.pm.organIdList = e;
      }
    },
    toggleH() {
      this.showshow = !this.showshow;
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
      this.$dialog.loading.open("上传中");
      this.xhr.post("http://up-z2.qiniu.com", param, config).then(
        response => {
          console.log(response.data, "logotupian");
          this.getHearLog.name = response.data.key;
          this.imgName = this.getHearLog.name;
          this.imgUrl = this.getHearLog.domain + "/" + this.getHearLog.name;
          this.pm.logoUrl = this.getHearLog.domain + "/" + this.getHearLog.name;
          this.$dialog.loading.close();
          this.$dialog.toast({ mes: "上传成功", icon: "success" });
          let localArr = this.images.map((val, index, arr) => {
            return arr[index].localSrc;
          });
          //  console.log(this.imgName)
          if (!~localArr.indexOf(pathName)) {
            this.images.push({
              src: this.showUrl + response.data.key,
              localSrc: pathName
            });
          } else {
            alert("已上传该图片");
          }
        },
        () => {
          this.$dialog.loading.close();
          this.$dialog.toast({ mes: "上传失败" });
        }
      );
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
    confirm() {},
    nameBlur() {
      if (!this.regName.test(this.info.name)) {
        this.$dialog.toast({ mes: "请输入规范名字" });
        this.info.name = "";
      } else if (this.info.name == null) {
        this.$dialog.toast({ mes: "名字不能为空" });
      }
    },
    idBlur() {
      if (!this.regId.test(this.info.decorationId)) {
        this.$dialog.toast({ mes: "身份号码格式错误" });
        this.info.decorationId = "";
      } else if (this.info.decorationId == null) {
        this.$dialog.toast({ mes: "身份号码不能为空" });
      }
    },
    phoneBlur() {
      if (!this.regPhone.test(this.info.mobile)) {
        this.$dialog.toast({ mes: "手机号格式错误" });
        this.info.mobile = "";
      } else if (this.info.mobile == null) {
        this.$dialog.toast({ mes: "手机号码不能为空" });
      }
    },
    // 发布
    addPushInfo() {
      var a = [];
      if (!this.pm.logoUrl) {
        this.pm.logoUrl = a.join(",");
      }
      if (this.pm.logoUrl == "") {
        this.$dialog.toast({ mes: "须上传商家LOGO!" });
        return;
      }
      if (this.pm.shopName == "") {
        this.$dialog.toast({ mes: "需填写店铺名称!" });
        return;
      }
      if (this.pm.slogan == "") {
        this.$dialog.toast({ mes: "需填写营销标语!" });
        return;
      }
      if (this.pm.shopAddress == "") {
        this.$dialog.toast({ mes: "需填写店铺地址!" });
        return;
      }
      if (this.pm.servicePhone == "") {
        this.$dialog.toast({ mes: "需填写服务电话!" });
        return;
      }
      if (this.pm.expandTitle == "") {
        this.$dialog.toast({ mes: "需填写标题!" });
        return;
      }
      if (this.pm.ruleIntroduction == "") {
        this.$dialog.toast({ mes: "需填写规则介绍!" });
        return;
      }
      if (this.pm.type == 3) {
        return this.$dialog.toast({ mes: "请选择推送类型" });
      }
      let data = {};
      if (this.pm.logoUrl.indexOf("oysfye6yt") == -1) {
        this.pm.logoUrl = this.getHearLog.domain + "/" + this.pm.logoUrl;
      }
      data = {
        expandTitle: this.pm.expandTitle,
        logoUrl: this.pm.logoUrl,
        publicNum: this.pm.publicNum,
        ruleIntroduction: this.pm.ruleIntroduction,
        servicePhone: this.pm.servicePhone,
        shopAddress: this.pm.shopAddress,
        shopName: this.pm.shopName,
        slogan: this.pm.slogan,
        type: this.pm.type,
        userId: this.pm.userId,
        userList: this.pm.userList,
        usableTime: this.pm.usableTime
          ? this.pm.usableTime + "," + this.other
          : this.other
      };
      if (!this.toggle) {
        data.endDate = this.pm.endDate + ":00";
        data.startDate = this.pm.startDate + ":00";
      }
      // 为我的客户的时候，organIdList不能为空
      if (this.typeListIndex == 3 && !this.pm.organIdList) {
        return this.$message.error("请选择我的客户");
      }
      this.$ajax1(
        `${this.subUrl.bd}/opportunity/addPushInfo?token=` +
          this.$getkey() +
          "&type=" +
          this.typeListIndex +
          "&organIdList=" +
          this.pm.organIdList +
          "&phoneList=" +
          this.pm.phoneList,
        data,
        res => {
          this.$message.success("成功推送( " + res.data.num + " 张)！");
          this.$router.go(-1);
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
      this.$router.go(-1);
    },
    turnTo(url) {
      this.$router.push(url);
    }
  },
  mounted() {
    this.pm.userId = this.userInfo.guid;
    this.buildingName = this.userInfo.buildingName;
    this.getUploadToken();
    // this.$getkey() = fn.getIng();
    // this.pm.token = fn.getIng();
  },
  beforeUpdate() {
    this.pm.usableTime = this.checkedNames.join(",");
    if (this.toggle1 == true) {
      this.other = "全天";
    }
    if (this.pm.phoneList == "") {
      this.typeList[2].clickImg = false;
    } else {
      this.typeList[2].clickImg = true;
    }
    if (this.pm.organIdList == "") {
      this.typeList[1].clickImg = false;
    } else {
      this.typeList[1].clickImg = true;
    }
  }
};
</script>
<style scoped>
.demonstration {
  font-size: 14px;
}
span {
  font-size: 14px;
}
#new_progress {
  padding-left: 300px;
  padding-right: 40px;
  height: auto;
}

.groups {
  padding: 0.2rem 0.4rem;
  display: flex;
  justify-content: center;
}

.bottoms {
  width: 100%;
  padding: 10px 20px;
}

.bottoms > ul {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #ececec;
}

.bottoms > ul > li {
  height: 1rem;
}

.bottoms > ul > li:nth-child(1) {
  width: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottoms > ul > li:nth-child(1) > i {
  width: 0.4rem;
  height: 0.4rem;
}

.bottoms > ul > li:nth-child(1) > i > img {
  width: 100%;
  height: 100%;
}

.bottoms > ul > li:nth-child(2) {
  width: 2rem;
  display: flex;
  align-items: center;
}

.bottoms > ul > li:nth-child(3) {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.2rem 0.2rem;
}

.bottoms > ul > li:nth-child(3) > p {
  border: 1px solid #ececec;
  width: 3.6rem;
  height: 100%;
  display: flex;
  align-items: center;
}

.bottoms > ul > li:nth-child(3) > p > input {
  border: none;
  width: 100%;
  height: 100%;
}

.declares {
  width: 100%;
  background: white;
}

.declares > ul {
  width: 100%;
  padding: 0.1rem 0.4rem;
}

.declares > ul li {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  margin: 0.2rem 0;
}

.declares > ul li > p {
  width: 1.8rem;
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
  border-radius: 0.05rem;
  margin-right: 0.2rem;
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

.images {
  display: flex;
  width: 100%;
  padding: 0.1rem 0.3rem;
}
.el-tag {
  color: #909399;
}
.images > p {
  border: 2px dashed #b6ceec;
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
  font-size: 14px;
  text-align: right;
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

.to-select {
  width: 100%;
  margin-top: 1em;
  border-bottom: 1px solid #e6e6e6;
}

.to-select > div > span {
  transform: rotate(90deg);
}

.buttonBox {
  padding: 0 0.2rem 0.3rem;
}

.send {
  margin: 0;
}

.yd-scrollview .yd-cell-box {
  margin-bottom: 0;
}
</style>
