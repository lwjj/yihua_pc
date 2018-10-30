<template>
  <div class="layout_my">
    <!--<yd-navbar class="header" v-title="'分类'" slot="navbar" title="分类" color="#fff" :bgcolor="mainColor" height=".88rem">-->
         <!--<span class="addClickArea spanLeft" @click="back" slot="left">-->
            <!--<span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>-->
        <!--</span>-->
    <!--</yd-navbar>-->
    <div class="buttonBox">
      <el-button size="mini" class="send" @click.native="confirm" color='#fff' type="primary">确定</el-button>
    </div>
    <yd-accordion style="height:calc(100% - 50px)">
      <yd-accordion-item v-for="(item,index) in list" :key="index" :title="item.name" open>
        <div class="box1">
          <ul>
            <li style="font-size:.26rem;" v-for="(todo,index) in item.subclass" :key="index"
                @click="checkBox(todo.guid,todo.name,item.guid)"
                :style="{background:piacked==todo.guid?mainColor:'',color:piacked==todo.guid?'white':''}">
              {{todo.name}}
            </li>
          </ul>
        </div>
      </yd-accordion-item>
    </yd-accordion>


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
// import Customer from "./my_customers.vue"
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
// import Vue from 'vue';
// import store from '@/store'
// import {Search} from 'vue-ydui/dist/lib.rem/search';
// import {Alert, Confirm, Loading, Notify, Toast} from 'vue-ydui/dist/lib.rem/dialog';
// import fn from '@/assets/js/product'
//
// Vue.component(Search.name, Search);
//
//
// Vue.prototype.$dialog = {
//   confirm: Confirm,
//   alert: Alert,
//   toast: Toast,
//   notify: Notify,
//   loading: Loading,
// };

export default {
  data() {
    return {
      mainColor: "",
      num: null,
      userInfo: "",
      organInfo: "",
      titleText: "",
      getkey: "",
      organId: "",
      interestList: [],
      // valueCenterList:[],
      addArr: [],
      addArr1: [],
      piacked: null,
      list: [],
      guid: "",
      fguid: "",
      name: ""
    };
  },
  computed: {},
  methods: {
    //行业分类
    getIndustryCategory() {
      let data = {};
      data.token = this.$getkey();
      data.organId = this.organId;
      this.$ajax(
        `${this.subUrl.user}/comm/getIndustryCategory2`,
        data,
        res => {
          this.list = res.data;
        },
        this
      );
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      this.$emit("bmData1");
      store.guid = null;
      store.name = null;
      store.fguid = null;
    },
    confirm() {
      if (!this.fguid) return this.$dialog.toast({ mes: "请选择服务分类" });
      this.$emit("bmData1", {
        guid: this.guid,
        fguid: this.fguid,
        name: this.name
      });
    },
    checkBox(guid, name, fguid) {
      this.piacked = guid;
      // store.guid = guid;
      // store.name = name;
      // store.fguid = fguid;
      this.guid = guid;
      this.name = name;
      this.fguid = fguid;
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.user = JSON.parse(decodeURIComponent(localStorage.getItem("user")));
    this.users = JSON.parse(decodeURIComponent(localStorage.getItem("users")));

    this.mainColor = localStorage.getItem("mainColor");
    this.userId = this.userInfo.guid;
    // this.$getkey() = fn.getIng();
    this.organId = this.organInfo.guid;
    this.getIndustryCategory();
  },
  beforeUpdate() {}
};
</script>
<style scoped>
.layout_my .header:after {
  display: none;
}

.layout_my {
  background: #fff;
  height: 100%;
}
.buttonBox {
  padding: 20px 10px;
  border-bottom: 1px solid #ddd;
}

.layout_my .blue_box {
  height: 0.88rem;
  background-size: 100% 100%;
  color: white;
}

.box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.2rem;
  background: #f3f3f3;
  padding: 0.2rem 0.3rem;
  border-bottom: 1px solid #d8d8d8;
}

.box span {
  width: 100%;
  height: 100%;
  background: white;
  border: 1px solid #d8d8d8;
  border-radius: 0.06rem;
  padding: 0.1rem 0.1rem;
}

.box span > input {
  width: 100%;
  height: 100%;
  border: none;
  color: #777;
}

.box1 {
  width: 100%;
  display: flex;
  padding: 0.1rem 0.28rem;
  cursor: pointer;
}

.box1 ul {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
}

.box1 ul li {
  border: 1px solid #e6e6e6;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.1rem;
  margin: 0.1rem 0.1rem;
  color: #666;
  padding: 0.1rem 0.2rem;
}

.box2 {
  width: 100%;
  display: flex;
  padding: 0.2rem 0.2rem;
}

.box2 span {
  width: 100%;
  border: 1px solid #d8d8d8;
  border-radius: 0.06rem;
  background: white;
}

.box2 span > textarea {
  width: 100%;
  height: 2rem;
  border: none;
}

.box3 {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  padding: 0.1rem 0.1rem;
}

.box3 label {
  width: 30%;
  height: 0.9rem;
  border: 1px solid #e1e1e1;
  border-radius: 0.9rem;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  margin: 0.1rem 0.1rem;
}

.box3 label > span {
  color: #333;
  letter-spacing: 0.07rem;
}

.box3 label > a {
  color: #aaaaaa;
}
</style>
