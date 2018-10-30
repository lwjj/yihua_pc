<template>
  <div id="new_progress" style="overflow: scroll;">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native="back">供求市场</el-breadcrumb-item>
        <el-breadcrumb-item>发布产品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="height:100%">
      <Set class="setBox" v-show="!showshow" @bmData='bmData'></Set>
      <Class class="classLate" v-show="!showshow1" @bmData1='bmData1'></Class>
      <agreement v-if="showAgreement" :agreementType="agreementType" @back="mBack"></agreement>

      <div v-show="showshow1 && !showAgreement" class="edit" style="max-width: 100%">
        <yd-cell-group>
          <yd-cell-item arrow type="link" href="" @click.native="open1">
            <span class="font30" slot="left">选择产品/服务分类</span>
            <span class="yd_bu font28" slot="right">{{bm.className==null?'请选择':bm.className}}</span>
          </yd-cell-item>
        </yd-cell-group>
        <div class="declares">
          <ul>
            <li><p>标题</p><span><input v-model="bm.title" type="text"></span></li>
            <li><p style="border:none;height:.4rem;"></p><span style="border:none;height:.4rem;">
                建议标题:品牌+型号+具体参数+卖点特征+商品名称</span></li>
            <li><p style="border:none;height:.4rem;"></p><span style="border:none;height:.4rem;">
                示例:供应厂家直销夏季新款运动衫</span></li>
          </ul>
        </div>
        <div class="declares" style="margin:.2rem 0">
          <ol>
            <li><p>服务内容</p></li>
          </ol>
          <div class="textar">
            <el-input v-model="bm.serviceContent" placeholder="说明/附言" maxlength="100"></el-input>
          </div>
          <div>
            <div style="float:right;margin-right:20px;">{{bm.serviceContent.length}}/100</div>
            <div style="clear:both"></div>
          </div>
          <div class="important-input-div">
            <input type="text" @blur="pmLists" v-model="bm.productParameterList[0].parameterName" placeholder="参数名">
            <input @blur="pmLists" placeholder="参数值" v-model="bm.productParameterList[0].parameterValue" type="text">
          </div>
          <div class="important-input-div">
            <input @blur="pmLists" type="text" v-model="bm.productParameterList[1].parameterName" placeholder="参数名">
            <input @blur="pmLists" placeholder="参数值" v-model="bm.productParameterList[1].parameterValue" type="text">
          </div>
          <div class="important-input-div">
            <input @blur="pmLists" type="text" v-model="bm.productParameterList[2].parameterName" placeholder="参数名">
            <input @blur="pmLists" placeholder="参数值" v-model="bm.productParameterList[2].parameterValue" type="text">
          </div>
          <p>可添加更多产品参数，最多3条，参数名不能为纯数字。</p>
          <p>示例：颜色:红色</p>
        </div>

        <div class="declares" style="margin:.2rem 0">
          <ol>
            <li><p>产品图片</p></li>
          </ol>
          <div class="details">
            <div class="text" style="font-size:.26rem;">最多可上传4张，严禁图片有水印,联系方式等影响观看</div>
            <div class="images">
              <el-upload
                :action="uploadUrl"
                list-type="picture-card"
                :data='otherData'
                :file-list="fileList"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePictureCardPreview"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :limit='4'
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

        <div class="declares" style="margin:.2rem 0">
          <ol>
            <li><p>产品详情</p></li>
          </ol>
          <div class="textar">
            <el-input v-model="bm.explains" placeholder="说明/附言" maxlength="300" type="textarea"
            :autosize="{ minRows: 3}"></el-input>
          </div>
          <div>
            <div style="float:right;margin-right:20px;">{{bm.explains.length}}/300</div>
            <div style="clear:both"></div>
          </div>
          <div class="important-input-div">
            <input type="text" @blur="keywordS" v-model="keyword[0]" maxlength="10" placeholder="输入关键词">
            <input @blur="keywordS" placeholder="输入关键词" maxlength="10" v-model="keyword[1]" type="text">
            <input @blur="keywordS" placeholder="输入关键词" maxlength="10" v-model="keyword[2]" type="text">
          </div>
          <p>产品关键词将用于商机匹配</p>
        </div>

        <div class="declares">
          <ul>
            <li>
              <p style="width:1.6rem;font-size:.26rem;">产品售价</p>
              <span style="margin-right:.1rem;">
                <input onkeyup="value=value.replace(/[^\d\.]/g,'')" onblur="value=value.replace(/[^\d\.]/g,'')" maxlength="12" v-model="bm.price">
              </span>元
            </li>
            <li><p style="width:1.6rem;font-size:.26rem;">最小采购量</p>
              <span style="margin-right:.3rem;">
              <input v-model="bm.minNumber" type="number" oninput="value = this.value.slice(0,9)"
                     onkeyup="value = this.value.slice(0,9)" v-if="!minNumber">
              <input v-model="bm.minNumber" type="number" oninput="value = this.value.slice(0,9)"
                     onkeyup="value = this.value.slice(0,9)" disabled="disabled" v-else>
              </span>
              <el-checkbox v-model="minNumber" size="16">不限</el-checkbox>
            </li>
          </ul>
        </div>
        <!-- <yd-accordion accordion style="background:none;margin-top:.2rem;">
          <yd-accordion-item title="发布范围" style="margin-bottom:.2rem;background:#fff;" open>
            <div style="padding: .24rem;">
              <yd-radio-group v-model="bm.groupArea">
                <yd-radio class="choose_item" v-for="(item,index) in pianList" :key="index" :val="index"
                          :color='mainColor'>
                  <span class="scope">{{item.name}}</span>
                  <span>{{item.scopeName}}</span>
                </yd-radio>
              </yd-radio-group>
            </div>
          </yd-accordion-item>
        </yd-accordion> -->
        <div class="chooseList">
          <div class="labelName">发布范围</div>
          <el-select v-model="bm.groupArea">
            <el-option v-for="(item,index) in pianList" :key="index" :value='item.scope' :label='item.scopeName'></el-option>
          </el-select>
        </div>


        <yd-cell-group style="margin-top:.2rem;">
          <yd-cell-item type="label">
            <span slot="left">预约服务</span>
            <el-switch :color="mainColor" slot="right" v-model="isBespeak"></el-switch>
          </yd-cell-item>
          <yd-cell-item type="label">
            <span slot="left">团购服务</span>
            <el-switch :color="mainColor" slot="right" v-model="isGroup"></el-switch>
          </yd-cell-item>
          <yd-cell-item v-if="isGroup" arrow type="label">
            <span slot="left">团购设置</span>
            <span slot="right" @click="open">(团购服务打开才有设置,关闭没有这项)</span>
          </yd-cell-item>
        </yd-cell-group>
          <div class="buttonBox">
            <el-button size="large" class="send" @click.native="openConfrim"
                       :bgcolor="mainColor" color='#fff' type="primary">同意协议并发布
            </el-button>
        </div>
         <div class="bottomss bgwhite pdlr2" style="padding-bottom:20px;">
          <a class="agreement cursor foCo6" @click="showXieyi = true">平台产品发布协议</a>
          <!-- <a>客服:400-000-00000</a> -->
        </div>

      </div>
    </div>
    <xieyi class="xie" v-if="showXieyi" :type='8' @closeXieyi='closeXieyi'></xieyi>
  </div>
</template>
<script>
import Vue from "vue";
import {
  Confirm,
  Alert,
  Toast,
  Notify,
  Loading
} from "vue-ydui/dist/lib.rem/dialog";

import { CellGroup, CellItem } from "vue-ydui/dist/lib.rem/cell";
Vue.component(CellGroup.name, CellGroup);
Vue.component(CellItem.name, CellItem);
import "vue-ydui/dist/ydui.base.css";

import Set from "./group_set.vue";
import Class from "./classification.vue";
import agreement from "./agreement.vue";
import xieyi from "@/components/login/agreement.vue";
export default {
  components: {
    Set,
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
      showXieyi: false,
      showAgreement: false,
      agreementType: 11,
      showshow: true,
      showshow1: true,
      ssss: true,
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
      fileList: [],
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
      dialogImageUrl: "",
      dialogVisible: false,
      otherData: {},
      imgsAll: [],

      imgName: [],
      imgUrl: [],
      show1: true,
      images: [],
      datetime2: this.$today(),
      datetime1: this.$today(),
      bm: {
        className: "",
        token: "",
        title: "",
        serviceContent: "",
        fatherClassId: null,
        classId: null,
        productImg: "",
        keyword: "",
        price: null,
        company: "",
        minNumber: 0,
        isBespeak: 0,
        isGroup: 0,
        payType: 2,
        explains: "",
        groupNumber: 0,
        groupArea: -1,
        startTime: this.$today(),
        endTime: this.$today(),
        priceSectionDescribe: "",
        productParameterList: [
          {
            parameterName: "",
            parameterValue: ""
          },
          {
            parameterName: "",
            parameterValue: ""
          },
          {
            parameterName: "",
            parameterValue: ""
          }
        ]
      },
      isBespeak: false,
      isGroup: false,
      minNumber: false,
      pianList: [],
      para: {
        value: ""
      }
    };
  },
  watch: {
    isBespeak: "bespeak",
    isGroup: "group",
    minNumber: "mNumber"
  },
  methods: {
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
      // this.imgsAll[res.key] = res.key;
      this.fileList.push({
        name: res.hash,
        url: this.getHearLog.domain + "/" + res.key
      });
    },
    uploadError() {
      this.$message.error("上传失败");
    },
    uploadMax() {
      this.$message.error("最多上传4张图片");
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
      console.log(file, fileList);
      this.fileList = fileList;
      // delete this.imgsAll[file.response.key];
    },
    closeXieyi() {
      this.showXieyi = false;
    },
    back() {
      this.$router.go(-1);
    },
    mBack() {
      this.showAgreement = false;
    },
    delImg(index) {
      this.imgUrl.splice(index, 1);
    },
    lookPhonePara() {
      let data = {};
      data.token = this.$getkey();
      data.type = "releaseProduct";
      this.$ajax(
        `${this.subUrl.bd}/purchase/lookPhonePara`,
        data,
        res => {
          this.para = res.data.para;
          // console.log(this.para.value)
        },
        this
      );
    },
    openConfrim() {
      if (this.bm.classId == null || this.bm.fatherClassId == null) {
        this.$dialog.toast({
          mes: "请选择服务分类",
          timeout: 1500
        });
        return;
      }
      if (this.bm.title == "") {
        this.$dialog.toast({ mes: "请输入标题" });
        return;
      }
      if (!this.bm.serviceContent)
        return this.$dialog.toast({ mes: "服务内容不能为空" });
      if (!this.bm.price) return this.$dialog.toast({ mes: "请输入售价" });
      if (!this.bm.explains)
        return this.$dialog.toast({ mes: "请输入产品详情" });
      if (this.bm.groupArea == -1)
        return this.$dialog.toast({ mes: "请选择发布范围" });
      if (this.bm.isGroup == 1&&!this.bm.priceSectionDescribe)
        return this.$dialog.toast({ mes: "请填写团购设置" });  
      this.$confirm("此次需支付" + this.para.value + "商机点！", "提示", {
        type: "warning"
      }).then(res => {
        this.addProduct();
      });
    },
    bmData(e) {
      this.showshow = true;
      if (e) {
        // console.log(e);
        this.bm.groupNumbe = e.groupNumber;
        this.bm.startTime = e.startTime + ":00";
        this.bm.endTime = e.endTime + ":00";
        this.bm.priceSectionDescribe = e.priceSectionDescribe;
      }
    },
    bmData1(e) {
      console.log(e, "bmData1");
      this.showshow1 = true;
      if (e) {
        this.bm.className = e.name;
        this.bm.classId = e.guid;
        this.bm.fatherClassId = e.fguid;
      }
    },
    open() {
      this.showshow = false;
    },
    open1() {
      this.showshow1 = false;
    },
    //发布产品
    addProduct() {
      var a = [];
      for (var key of this.fileList) {
        a.push(key.url);
      }
      this.bm.productImg = a.join(",");
      let data = {};
      data.token = this.$getkey();
      data.title = this.bm.title;
      data.serviceContent = this.bm.serviceContent;
      data.fatherClassId = this.bm.fatherClassId;
      data.classId = this.bm.classId;
      data.productImg = this.bm.productImg;
      data.keyword = this.bm.keyword;
      data.price = this.bm.price;
      data.minNumber = this.bm.minNumber;
      data.company = "元";
      data.isBespeak = this.bm.isBespeak;
      data.isGroup = this.bm.isGroup;
      data.payType = this.bm.payType;
      data.explains = this.bm.explains;
      data.groupArea = this.bm.groupArea;
      if (this.bm.isGroup == 1) {
        data.groupNumber = this.bm.groupNumber;
        data.startTime = this.bm.startTime;
        data.endTime = this.bm.endTime;
        data.priceSectionDescribe = this.bm.priceSectionDescribe;
      }
      // data.purchaseDetailsList=this.bm.purchaseDetailsList;
      this.$ajax1(
        `${this.subUrl.bd}/product/addProduct?${this.$qs.stringify(data)}`,
        this.bm.productParameterList,
        res => {
          this.$dialog.toast({ mes: "发布成功！" });
          this.back();
        },
        this
      );
    },
    pmLists() {
      // console.log(this.pmList)
    },
    keywordS() {
      this.bm.keyword = this.keyword.join(",");
      // console.log(this.bm.keyword)
    },
    mNumber() {
      this.bm.minNumber = 0;
    },
    bespeak() {
      if (this.isBespeak) {
        this.bm.isBespeak = 1;
      } else {
        this.bm.isBespeak = 0;
      }
    },
    group() {
      if (this.isGroup) {
        this.bm.isGroup = 1;
      } else {
        this.bm.isGroup = 0;
      }
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
      this.addImg();
      console.log(this.getHearLog.domain, "图片地址：：：");
      this.xhr.post("http://up-z2.qiniu.com", param, config).then(response => {
        //  console.log(response.data);
        this.getHearLog.name = response.data.key;
        if (this.imgName.length < 4) {
          this.imgName.push(this.getHearLog.name);
          this.imgUrl.push(this.getHearLog.domain + "/" + this.getHearLog.name);
        }
        // this.bm.productImg=this.imgUrl.join(',')
        // console.log(this.bm.productImg)
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
      });
    },
    getQiniuInfo() {
      this.xhr
        .post(`${this.subUrl.user}/qiniu/getInfo?token=` + this.$getkey())
        .then(res => {
          if (res.data.code == 1) {
            // console.log(res)
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
          this.bm.groupArea = res.data.length - 1;
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
      // store.guid = null;
      // store.name = null;
      // store.fguid = null;
    }
  },
  mounted() {
    this.userId = this.userInfo.guid;
    this.getUploadToken();
    this.getQiniuInfo();
    // this.$getkey() = fn.getIng();
    this.getPlace();
    this.lookPhonePara();
    // console.log(this.$route.params)
  },
  beforeUpdate() {
    // this.bm.className = store.name;
    // this.bm.classId = store.guid;
    // this.bm.fatherClassId = store.fguid;
  }
};
</script>
<style scoped lang='scss'>
.edit {
  // background: #fff;
}
.setBox {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.5);
}
.classLate {
  background: #fff;
  height: 100%;
}
.chooseList {
  display: flex;
  align-items: center;
  background: #fff;
  padding-bottom: 10px;
  .labelName {
    width: 110px;
    padding-right: 10px;
    box-sizing: border-box;
    text-align: right;
  }
}
#new_progress {
  overflow: auto;
}

.bottomss {
  display: flex;
  justify-content: space-between;
}

.bottomss > a {
  color: #999;
}

.send {
  margin: 0;
}

.buttonBox {
  padding: 10px 0.2rem 0.2rem;
  background: #fff;
}

.declares > p {
  padding: 0.1rem 0.3rem;
  font-size: 0.24rem;
  color: #666;
  background: #fff;
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

.important-input-div {
  width: 100%;
  background: #ffffff;
  display: flex;
  flex-wrap: wrap;
  padding: 0.1rem 0.3rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.important-input-div input {
  width: 1.45rem;
  font-size: 0.26rem;
  color: #999999;
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
  width: 1rem;
  display: flex;
  justify-content: center;
  height: 0.7rem;
  align-items: center;
  font-size: 0.3rem;
  color: #777;
}

.declares > ul li > span {
  flex: 1;
  height: 0.7rem;
  border: 1px solid #d9d9d9;
  border-radius: 0.05rem;
  line-height: 0.4rem;
  font-size: 0.24rem;
  color: #999;
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
  color: #333;
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
  /*border: 2px dashed #b6ceec;*/
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
  font-size: 0.3rem;
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
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
