<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native="back">返回</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <yd-layout class="edit" style="background: #fff;margin-bottom: 100px;max-width: 100%;margin-top: 10px;">
      <!--<yd-navbar height=".88rem" slot='navbar' v-show="!userAgent.isWX" v-title="'客户预约'" :title="titleN" :bgcolor="mainColor" color="#fff">-->
      <!--<span class="addClickArea" slot="left" @click="back" style="color: #fff;">-->
      <!--<yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>-->
      <!--</span>-->
      <!--</yd-navbar>-->

      <div class="texts" style="border-bottom:1px solid #e4e4e4;margin-bottom:.2rem;">
        <span>{{title}}</span>
        <p><span :style="{border:'1px solid '+mainColor,color:mainColor}">{{status}}</span></p>
      </div>
      <div class="flex jusB pdlr2 mb2">
         <el-date-picker
          v-model="value1"
          type="daterange"
          @change='changePage1'
          range-separator="至"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>

         <el-select v-model="value2" clearable @change="changePage2" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
      </div>
         <div class="centerBox bgwhite" style="height:100%">
            <div class="tableList">
                <el-table
                    :data="libraryList"
                    height="100%"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="createTime"
                    label="时间"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="organInfoDto3.organName"
                    label="机构名"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="organInfoDto3.userName"
                    label="用户名">
                    </el-table-column>
                     <el-table-column 
                     prop="state"
                    label="状态"> 
                    </el-table-column>
                    <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                      <el-button type="primary" @click="turnTo(scope.$index,'/supply/product/my_details1/'+type+'/'+scope.row.guid+'?title='+title+'&status='+status+'&productId='+scope.row.productId)" size="mini">详情</el-button>
                    </template>
                        
                    </el-table-column>
                </el-table>
                <el-pagination
                    v-if="pageCount>0"
                    background
                    :page-count="pageCount"
                    layout="prev, pager, next"
                    @current-change='changePage'>
                </el-pagination>
            </div>
        </div> 
    </yd-layout>
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
// Vue.component(Switch.name, Switch);

// Vue.component(CellGroup.name, CellGroup);
Vue.component(CellItem.name, CellItem);
// Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);
Vue.component(Icons.name, Icons);
Vue.component(Layout.name, Layout);

Vue.component(DateTime.name, DateTime);
export default {
  data() {
    let userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    let mainColor = this.$color[userInfo.organType];
    let endTime = this.$today();
    var organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    return {
      list: [
        "客户预约",
        "客户询价",
        "客户邀联",
        "客户团购",
        "客户邀标",
        "报价/投标"
      ],
      list4: [],
      organInfo,
      mainColor,
      userInfo,
      screen: {
        startTime: this.$today(),
        entTime: this.$today()
      },
      show1: false,
      show2: false,
      libraryList: [],
      libraryList1: [],
      checkAllImg: false,
      pageCount: 1,
      pageNo: 1,
      parameter: {
        token: "",
        productId: null,
        state: null,
        pageNo: 1,
        pageSize: 10,
        pageCount: 0,
        businessName: "",
        startTime: "",
        endTime: ""
      },
      value: "",
      title: "",
      status: "",
      titleN: "",
      options: [],
      value1: [],
      value2: "",
      type: null
    };
  },
  methods: {
    changePage() {},
    changePage1(e) {
      if (e && e.length > 0) {
        this.parameter.startTime = e[0];
        this.parameter.endTime = e[1];
      } else {
        this.parameter.startTime = "";
        this.parameter.endTime = "";
      }
      this.parameter.pageNo = 1;
      this.bespeakList();
    },
    changePage2() {
      this.parameter.pageNo = 1;
      this.bespeakList();
    },
    confirm() {
      this.parameter.startTime = this.screen.startTime;
      this.parameter.endTime = this.screen.entTime;
      this.parameter.pageNo = 1;
      this.libraryList = [];
      if (this.$route.query.type == 1) {
        this.bespeakList();
      } else if (this.$route.query.type == 2) {
        this.productInquiryList();
      } else if (this.$route.query.type == 3) {
        this.productContactList();
      } else if (this.$route.query.type == 4) {
        this.productGroupList();
      }
      this.parameter.endTime = "";
      this.parameter.startTime = "";
      this.show1 = !this.show1;
    },
    selectS(state) {
      this.parameter.state = state;
      this.parameter.pageNo = 1;
      this.libraryList = [];
      if (this.$route.query.type == 1) {
        this.bespeakList();
      } else if (this.$route.query.type == 2) {
        this.productInquiryList();
      } else if (this.$route.query.type == 3) {
        this.productContactList();
      } else if (this.$route.query.type == 4) {
        this.productGroupList();
      }
      this.parameter.state = null;
      this.show2 = !this.show2;
    },
    turnTo(index, url) {
      this.$router.push(url);
      localStorage.setItem(
        "details",
        encodeURIComponent(JSON.stringify(this.libraryList[index]))
      );
    },
    submitHandler(value) {
      this.$dialog.toast({ mes: `产品关键字：${value}` });
      this.parameter.pageNo = 1;
      this.parameter.businessName = value;
      this.libraryList = [];
      if (this.$route.query.type == 1) {
        this.bespeakList();
      } else if (this.$route.query.type == 2) {
        this.productInquiryList();
      } else if (this.$route.query.type == 3) {
        this.productContactList();
      } else if (this.$route.query.type == 4) {
        this.productGroupList();
      }
      this.parameter.businessName = "";
    },
    scrollHandler() {
      if (store.loading || this.parameter.pageNo > this.parameter.pageCount) {
        return;
      }

      let listDom = this.$refs.listDom;
      if (
        listDom.scrollHeight - listDom.scrollTop - listDom.clientHeight <
        100
      ) {
        if (this.$route.query.type == 1) {
          this.bespeakList();
        } else if (this.$route.query.type == 2) {
          this.productInquiryList();
        } else if (this.$route.query.type == 3) {
          this.productContactList();
        } else if (this.$route.query.type == 4) {
          this.productGroupList();
        }
      }
    },
    //预约
    bespeakList() {
      let data = {};
      if (this.parameter.startTime != "")
        data.startTime = this.parameter.startTime + " 00:00:00";
      if (this.parameter.endTime != "")
        data.endTime = this.parameter.endTime + " 23:59:59";
      if (this.parameter.state != null) data.state = this.parameter.state;
      data.token = this.$getkey();
      data.productId = this.$route.query.guid;
      if (this.parameter.businessName != "") {
        data.businessName = this.parameter.businessName;
      }
      if (typeof this.value2 == "number") {
        data.state = this.value2;
      }
      data.pageNo = this.parameter.pageNo;
      data.pageSize = this.parameter.pageSize;
      this.xhr
        .post(
          `${this.subUrl.bd}/opportunity/bespeakList`,
          this.$qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
            if (res.data.data.list != null) {
              res.data.data.list.forEach(element => {
                element.createTime = element.createTime.split(" ")[0];
                element.clickImg = false;
                if (element.state == 0) {
                  element.state = "未联";
                } else if (element.state == 1) {
                  element.state = "已联";
                } else if (element.state == 2) {
                  element.state = "已取消";
                }
                if (element.type == 1) {
                  element.type1 = "招标";
                } else if (element.type == 2) {
                  element.type1 = "采购";
                }
              });
            }
            this.parameter.pageCount = res.data.data.pageCount;
            if (this.parameter.pageNo >= 2) {
              this.libraryList = this.libraryList.concat(res.data.data.list);
            } else {
              this.libraryList = res.data.data.list;
            }
          } else if (res.data.code == "-902") {
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    //邀联
    productContactList() {
      let data = {};
      if (this.parameter.startTime != "")
        data.startTime = this.parameter.startTime + " 00:00:00";
      if (this.parameter.endTime != "")
        data.endTime = this.parameter.endTime + " 23:59:59";
      if (this.parameter.state != null) data.state = this.parameter.state;
      data.token = this.$getkey();
      data.productId = this.$route.query.guid;
      if (this.parameter.businessName != "") {
        data.businessName = this.parameter.businessName;
      }
      data.pageNo = this.parameter.pageNo;
      data.pageSize = this.parameter.pageSize;
      this.$ajax(
        `${this.subUrl.bd}/opportunity/productContactList`,
        data,
        res => {
          if (res.data.code == 1) {
            console.log(res.data.list);
            if (res.data.list != null) {
              res.data.list.forEach(element => {
                element.name = element.businessName;
                element.createTime = element.createTime.split(" ")[0];
                //  element.releaseTime=element.releaseTime.split(' ')[0]
                element.clickImg = false;
                if (element.state == 0) {
                  element.state = "未联";
                } else if (element.state == 1) {
                  element.state = "已联";
                } else if (element.state == 2) {
                  element.state = "已取消";
                }
                if (element.type == 1) {
                  element.type1 = "招标";
                } else if (element.type == 2) {
                  element.type1 = "采购";
                }
              });
            }
            this.parameter.pageCount = res.data.pageCount;

            if (this.parameter.pageNo >= 2) {
              this.libraryList = this.libraryList.concat(res.data.list);
            } else {
              this.libraryList = res.data.list;
            }

            this.parameter.pageNo++;
            console.log(this.parameter.pageCount);
          } else if (res.data.code == "-902") {
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        }
      );
    },
    productInquiryList() {
      let data = {};
      if (this.parameter.startTime != "")
        data.startTime = this.parameter.startTime + " 00:00:00";
      if (this.parameter.endTime != "")
        data.endTime = this.parameter.endTime + " 23:59:59";
      if (this.parameter.state != null) data.state = this.parameter.state;
      data.token = this.$getkey();
      data.productId = this.$route.query.guid;
      if (this.parameter.businessName != "") {
        data.businessName = this.parameter.businessName;
      }
      data.pageNo = this.parameter.pageNo;
      data.pageSize = this.parameter.pageSize;
      this.$ajax(
        `${this.subUrl.bd}/opportunity/productInquiryList`,
        data,
        res => {
          if (res.data.code == 1) {
            console.log(res.data.list);
            if (res.data.list != null) {
              res.data.list.forEach(element => {
                element.name = element.businessName;
                element.createTime = element.messageTime.split(" ")[0];
                //  element.releaseTime=element.releaseTime.split(' ')[0]
                element.clickImg = false;
                if (element.state == 0) {
                  element.state = "未报";
                } else if (element.state == 1) {
                  element.state = "已报";
                } else if (element.state == 2) {
                  element.state = "已删除";
                }
                if (element.type == 1) {
                  element.type1 = "招标";
                } else if (element.type == 2) {
                  element.type1 = "采购";
                }
              });
            }
            this.parameter.pageCount = res.data.pageCount;

            if (this.parameter.pageNo >= 2) {
              this.libraryList = this.libraryList.concat(res.data.list);
            } else {
              this.libraryList = res.data.list;
            }

            this.parameter.pageNo++;
            console.log(this.parameter.pageCount);
          } else if (res.data.code == "-902") {
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        }
      );
    },
    //团购列表
    productGroupList() {
      let data = {};
      if (this.parameter.startTime != "")
        data.startTime = this.parameter.startTime + " 00:00:00";
      if (this.parameter.endTime != "")
        data.endTime = this.parameter.endTime + " 23:59:59";
      if (this.parameter.state != null) data.state = this.parameter.state;
      data.token = this.$getkey();
      data.productId = this.$route.query.guid;
      if (this.parameter.businessName != "") {
        data.businessName = this.parameter.businessName;
      }
      data.pageNo = this.parameter.pageNo;
      data.pageSize = this.parameter.pageSize;
      this.$ajax(
        `${this.subUrl.bd}/opportunity/productGroupList`,
        data,
        res => {
          if (res.code == 1) {
            console.log(res.data.list);
            if (res.data.list != null) {
              res.data.list.forEach(element => {
                element.createTime = element.createTime.split(" ")[0];
                element.clickImg = false;
                if (element.state == 0) {
                  element.state = "未联";
                } else if (element.state == 1) {
                  element.state = "已联";
                } else if (element.state == 2) {
                  element.state = "已取消";
                }
              });
            }
            this.parameter.pageCount = res.data.pageCount;

            if (this.parameter.pageNo >= 2) {
              this.libraryList = this.libraryList.concat(res.data.list);
            } else {
              this.libraryList = res.data.list;
            }
            this.libraryList = res.data.list;
            this.parameter.pageNo++;
            console.log(this.parameter.pageCount);
          } else if (res.code == "-902") {
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        }
      );
    },
    back() {
      this.$router.go(-1);
    },

    toggle() {
      this.show1 = !this.show1;
      this.show2 = false;
    },
    toggle1() {
      this.show2 = !this.show2;
      this.show1 = false;
    },
    leftTab() {
      this.list4 = [this.list[0], this.list[1], this.list[2], this.list[3]];
    },
    rightTab() {
      this.list4 = [this.list[2], this.list[3], this.list[4], this.list[5]];
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = localStorage.getItem("mainColor");
    this.list4 = [this.list[0], this.list[1], this.list[2], this.list[3]];
    this.parameter.userId = this.userInfo.guid;
    // this.$getkey() = fn.getIng();
    this.status = this.$route.query.status;
    this.title = this.$route.query.title;

    console.log(this.$route);
    if (this.$route.query.type == 1) {
      this.bespeakList();
      this.titleN = "客户预约";
      this.type = 1;
    } else if (this.$route.query.type == 2) {
      this.productInquiryList();
      this.titleN = "客户询价";
      this.type = 3;
    } else if (this.$route.query.type == 3) {
      this.productContactList();
      this.titleN = "客户邀联";
      this.type = 4;
    } else if (this.$route.query.type == 4) {
      this.titleN = "客户团购";
      this.type = 2;
      this.productGroupList();
    }
    if (this.type == 3) {
      this.options = [
        { name: "未报", value: 0 },
        { name: "已报", value: 1 },
        { name: "已取消", value: 2 }
      ];
    } else {
      this.options = [
        { name: "未联", value: 0 },
        { name: "已联", value: 1 },
        { name: "已取消", value: 2 }
      ];
    }
  }
};
</script>
<style scoped>
.tableList {
  padding: 0 20px;
}
#new_progress {
  padding-left: 300px;
  padding-right: 40px;
  height: auto;
}

.texts {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 0.3rem;
  background: white;
}

.texts > span {
  flex: 1;
  font-size: 0.32rem;
  font-weight: 600;
  height: 1rem;
  display: flex;
  align-items: center;
}

.texts > p {
  width: 1.8rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.texts > p > span {
  padding: 0.01rem 0.03rem;
  font-size: 0.24rem;
  border-radius: 0.05rem;
}

.tab {
  width: 100%;
  background: white;
}

.tab > ul {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tab > ul > li:first-child {
  width: 0.5rem;
}

.tab > ul > li:nth-child(2) {
  flex: 1;
}

.tab > ul > li:last-child {
  width: 0.5rem;
}

.tab > ul > li {
  display: flex;
  justify-content: center;
  align-items: center;
}

.tab > ul > li > span {
  font-size: 0.4rem;
}

.texts .search {
  width: 100%;
  background: #f7f7f9;
  position: relative;
}

.search > ul {
  width: 100%;
  display: flex;
  align-items: center;
}

.search > ul li:nth-child(3) {
  flex: 1;
}

.search > ul li:nth-child(1) {
  width: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search > ul li:nth-child(2) {
  width: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.screen1 {
  width: 100%;
  position: absolute;
  height: calc(100vh - 3.1rem);
  background: rgba(0, 0, 0, 0.1);
  z-index: 999;
  left: 0;
  border-top: 1px solid #d9d9d9;
}

.screen1 ul {
  background: #f6f6f6;
}

.screen1 ul li {
  height: 0.8rem;
  border-bottom: 1px solid #d9d9d9;
  padding: 0 0.4rem;
  display: flex;
  align-items: center;
  font-size: 0.32rem;
}

.screen {
  width: 100%;
  position: absolute;
  height: calc(100vh - 3.1rem);
  background: rgba(0, 0, 0, 0.1);
  z-index: 999;
  left: 0;
}

.screen ul {
  background: #f6f6f6;
}

.screen ul li {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
}

.screen ul li:nth-child(1) {
  width: 100%;
  padding: 0.1rem 0.3rem;
}

.screen ul li:nth-child(2) {
  width: 100%;
  padding: 0.1rem 0.3rem;
  justify-content: center;
}

.screen ul li:nth-child(2) > span {
  background: white;
  width: 3rem;
  height: 0.7rem;
  border: 1px solid #e9e9e9;
  display: flex;
  align-items: center;
}

.screen ul li:nth-child(2) > i {
  margin: 0 0.3rem;
}

.screen ul li:nth-child(2) > span > input {
  width: 3rem;
  height: 0.7rem;
  border: none;
}

.screen ul li:nth-child(3) {
  width: 100%;
  height: 0.95rem;
  background: white;
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  align-items: center;
}

.screen ul li:nth-child(3) button {
  width: 50%;
  height: 0.95rem;
  border: none;
  border-top: 1px solid #e4e4e4;
  font-size: 0.3rem;
  font-weight: 600;
  color: #a2a2a2;
}

.screen ul li:nth-child(3) button.bb {
  border-left: 1px solid #e4e4e4;
}

.lists {
  width: 100%;
  /*overflow-y: scroll;*/
  height: calc(100vh - 3.2rem);
}

.libList {
  width: 100%;
  display: flex;
  background: white;
  border-bottom: 1px solid #d9d9d9;
}

.libList li {
  display: flex;
  height: 1.8rem;
}

.libList li:nth-child(1) {
  flex: 1;
  flex-flow: column;
  padding: 0.1rem 0.3rem;
  justify-content: center;
}

.libList li:nth-child(1) > p {
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
}

.libList li:nth-child(1) > span {
  display: flex;
  align-items: center;
  margin-bottom: 0.1rem;
}

.libList li:nth-child(1) > span > i {
  display: flex;
  width: 0.35rem;
  height: 0.35rem;
  margin-right: 0.1rem;
}

.libList li:nth-child(1) > span > i > img {
  width: 100%;
  height: 100%;
}

.libList li:nth-child(2) {
  width: 3rem;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.libList li:nth-child(2) > p {
  margin-bottom: 0.1rem;
}

.libList li:nth-child(2) > p > span {
  padding: 0.02rem 0.02rem;
  font-size: 0.24rem;
  border-radius: 0.05rem;
}

.libList li:nth-child(2) > span {
  display: flex;
}

.libList li:nth-child(2) > span > i {
  width: 0.35rem;
  height: 0.35rem;
  margin-right: 0.1rem;
}

.libList li:nth-child(2) > span > i > img {
  width: 100%;
  height: 100%;
}
</style>
