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
          <li style="border-bottom:1px solid #ddd;line-height:30px;" v-if="detail.tenderOrderInfo.state1"><span>状态</span><p>{{detail.tenderOrderInfo.state1}}</p></li>
          <li><span>联系人</span><p>{{organInfo1.userName}}</p></li>
          <li><span>电话</span><p>{{organInfo1.phone}}<span
          style="color:#999;font-size:.24rem;margin-left:30px">已被查看{{detail.tenderOrderInfo.lookNumber}}次</span></p></li>
          <li style="border-bottom:1px solid #ddd;line-height:30px;"><span>地区</span><p>{{organInfo1.organAddress}}</p></li>
          <li><span>费用名称</span><p>{{detail.tenderOrderInfo.explains}}</p></li>
          <li><span>招标金额</span><p>{{detail.tenderOrderInfo.money==0?'面议':detail.tenderOrderInfo.money}}</p></li>
          <li><span>发布日期</span><p>{{detail.tenderOrderInfo.startTime}}</p></li>
          <li><span>截至日期</span><p>{{detail.tenderOrderInfo.endTime}}</p></li>
          <li><span>买家地址</span><p>{{detail.tenderOrderInfo.address}}</p></li>
          <li><span>交货日期</span><p>{{detail.tenderOrderInfo.deliveryTime}}</p></li>
          <li style="border-bottom:1px solid #ddd;line-height:30px;"><span>交货地址</span><p>{{detail.tenderOrderInfo.deliveryAddress}}</p></li>
          <li style="color:#666;padding-right:800px">
            <p style="padding-left:18px">产品/服务</p>
            <span style="margin:0 100px;text-align: center;">数量</span>
            <span style="text-align: center">金额(元)</span>
          </li>
          <li v-for="(item,index) in list" :key="index" style="padding-right:800px;padding-left:18px"><p>
          {{item.productService}}</p>
          <span style="margin:0 100px;text-align: center;">{{item.number}}</span>
          <span style="text-align: center">{{item.money}}</span>
          </li>
          <li style="border-top:1px solid #ddd;line-height:30px;">
            <div style="width:500px;border:1px solid #ddd;padding:0 11.2px;margin-left:18px">
              {{detail.tenderOrderInfo.explains}}
            </div>
          </li>
          <li>
            <div v-show="keyword[0]" type="text" maxlength="10" v-model="keyword[0]" placeholder="" style="padding:0 10px;border:1px solid #ddd;margin-left:18px">{{keyword[0]}}</div>
            <div v-show="keyword[1]" placeholder="" maxlength="10" v-model="keyword[1]" type="text" disabled="disabled" style="padding:0 10px;border:1px solid #ddd">{{keyword[1]}}</div>
            <div v-show="keyword[2]" placeholder="" maxlength="10" v-model="keyword[2]" type="text" disabled="disabled" style="padding:0 10px;border:1px solid #ddd">{{keyword[2]}}</div>
          </li>
          <li class="images" v-if="imgList.length>0">
            <div :num="imgList.length" style="margin-left:18px">
                <vue-preview class='imgPath' :slides="sliders" v-if='sliders'  @close="''"></vue-preview>
            </div>
          </li>
          <li>
            <el-collapse style="width:100%;margin:.2rem 0;margin-left:18px">
              <el-collapse-item title="投标要求" name="1">
                <div style="padding: .24rem;">
                    <span class="scope" style="color:#999;">{{detail.tenderOrderInfo.isOffer}}</span>
                </div>
              </el-collapse-item>
              <el-collapse-item title="范围" name="2">
                <div style="padding: .24rem;">
                    <span class="scope" style="color:#999;">{{detail.tenderOrderInfo.scopeValueStr}}</span>
                </div>
              </el-collapse-item>
              <el-collapse-item title="供应商要求" name="3">
                <div style="padding: .24rem;">
                    <span class="scope" style="color:#999;">{{detail.tenderOrderInfo.levelCondition}}</span>
                </div>
              </el-collapse-item>
            </el-collapse>
          </li>
          <li>
            <div class="declares">
              <ol style="margin-left:10px">
                <li style="color:#333;">商家资质要求</li>
              </ol>
              <div class="textar" style="width:500px;height:32px;border:1px solid #ddd;margin-left:18px">
                <div>
                  {{detail.tenderOrderInfo.seniority==null?'暂无':detail.tenderOrderInfo.seniority}}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div style="width:100%;background-color: #fff;padding:10px 30px">

      <el-button type="primary" @click="dialogFormVisible = true">邀标</el-button>

      <el-dialog title="我的供应商" :visible.sync="dialogFormVisible">
        <el-table
          border
          ref="multipleTable"
          :data = "SupplierList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="organName"
              label="公司名称"
              width="260">
              
            </el-table-column>
            <el-table-column
              prop="organAddress"
              label="公司地址"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
  <div style="margin-top: 20px">
    <el-button @click="toggleSelection()">取消选择</el-button>
  </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addInvitedMark">确 定</el-button>
        </div>
      </el-dialog>
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
      dialogFormVisible:false,
      multipleSelection:[],
      //已选择的邀标供应商
      showshow:true,
      sliders:null,
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
      detail: {
        tenderOrderInfo: {

        }
      },
      SupplierList:[],
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
      },
    };
  },
  methods: {
    //表格选择
     handleSelectionChange(val) {
      console.log(val)
        this.userList = [];
        this.organList = [];
        if(val && val.length > 0){
          for(var v of val){
            this.userList.push(v.optUserId)
            this.organList.push(v.organId)
          }
        }
        this.multipleSelection = val;
      },
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
    getDetail(type) {
      var data = {};
      data.token = this.$getkey();
      data.guid = this.$route.query.guid;
      data.type = this.bm.type1;
      var url = "/purchase/aboutInfo";
      if (type == 5) {
        url = "/purchase/tenderInfo";
        data.type=5
      }
      this.$ajax(
        `${this.subUrl.bd}/` + url,
        data,
        res => {
          if (type == 5) {
            if (res.data.tenderOrderInfo.state == 0) {
              res.data.tenderOrderInfo.state1 = "已删除";
            } else if (res.data.tenderOrderInfo.state == 1) {
              res.data.tenderOrderInfo.state1 = "已上线";
            } else if (res.data.tenderOrderInfo.state == 2) {
              res.data.tenderOrderInfo.state1 = "已下线";
            } else if (res.data.tenderOrderInfo.state == 3) {
              res.data.tenderOrderInfo.state1 = "已上线";
            } else if (res.data.tenderOrderInfo.state == 4) {
              res.data.tenderOrderInfo.state1 = "未通过";
            }
          if (res.data.tenderOrderInfo.keyword != "") {
            this.keyword = res.data.tenderOrderInfo.keyword.split(",");
          }
            this.detail = res.data;
            console.log(this.detail.tenderOrderInfo.state1,316497)
            this.organInfo1 = res.data.tenderOrderInfo.organInfoDto3;
            this.list = res.data.tenderOrderInfo.purchaseDetailsList;
            this.imgList = res.data.tenderOrderInfo.accessoryList;
          if (res.data.tenderOrderInfo.accessoryList) {
            var aaaa = this.$setImg(res.data.tenderOrderInfo.accessoryList, this);
          }
            return;
          }
        },
        this
      );
    },
    isshow(){
      this.showshow = true
    },
    //获取供应商列表
      mySupplierList() {
      let data = {};
      data.state = 0;
      data.token = this.$getkey();
      var url = "/purchase/mySupplierList";
      this.$ajax(
        `${this.subUrl.bd}/` + url,
        data,
        res => {
            this.SupplierList = res.data.list;
            return;
        },
        this 
        );
    },

    addInvitedMark(){
      if(this.multipleSelection.length == 0) return this.$message.error('请选择供应商')
      this.dialogFormVisible = false;
      let data = {};
      data.token = this.$getkey();

      data.supplierId = this.userList.join(',');
      data.supplierOrganId = this.organList.join(',');
      data.guid = this.$route.query.guid
      var url = "/purchase/addInvitedMark";
      this.$ajax(
        `${this.subUrl.bd}/` + url,
        data,
        res => {
             if (res.code == 1) {
           return this.$message.success('邀标成功');
          } else if (res.code == "-902") {
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.msg });
          }
        },
        this 
        );
    }

  },
  mounted() {
    this.bm.guid = this.$route.query.guid;
    if (this.$route.query.type == 5) {
      this.title = "我的邀标";
      this.bm.type = 5;
      this.bm.type1 = 2;
    }
    this.status = this.$route.query.status;
    this.titleT = this.$route.query.title;
    this.getDetail(this.$route.query.type);
    if (this.$route.query) {
      this.price = this.$route.query.b;
      this.postscript = this.$route.query.a;
      this.time = this.$route.query.c;
    }
    this.mySupplierList()
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
