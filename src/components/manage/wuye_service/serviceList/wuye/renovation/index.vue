<template> 
   <div class="layout_my newRightContent">
    <div class="title">
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
            <el-breadcrumb-item>装修</el-breadcrumb-item>
        </el-breadcrumb>
    </div> 
    <div class="tableBox" style="padding-top:10px;">
      <div> 
        <div style="float:left;margin-bottom:10px;">
          <span>状态：</span>
          <el-select @change='changeData1' style="width:120px;" v-model="value4" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :change-on-select='false'
              :label="item.name"
              :value="item.value">
            </el-option>
            
        </el-select>
        </div>  
        <div style="float:left;margin-left:20px;">
          时间选择:
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            @change="changeData2"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:300px;">
          </el-date-picker>
        </div>
        <el-button-group v-if="showBuild" style="float:right;margin-right:10px;">
          <el-button  icon='el-icon-plus
          ' @click="turnTo('/estate/serviceList/wuye/renovation/declares')" >新建</el-button> 
          <!-- <el-button class="ml2" type="primary" @click="$router.push('/estate/serviceList/waiqing/setting')">设置</el-button> -->
        </el-button-group>
        <div style="float:right;margin-right:20px;">
          <el-button @click="print">打印表格</el-button>
        </div>
        <div class="clear:both"></div>
      </div>
      <el-table :data="orderList" height="250" border style="width: 100%"> 
        <el-table-column prop="guid" label="单号" min-width="11%" show-overflow-tooltip  align="center"></el-table-column>
        <el-table-column prop="description" label="描述" show-overflow-tooltip min-width='14%'> </el-table-column>
        <el-table-column prop="createDate" label="创建时间" show-overflow-tooltip	min-width="12%" align="center"> </el-table-column>
        <el-table-column prop="startDate" label="开始时间" show-overflow-tooltip min-width="12%" align="center"> </el-table-column>
        <el-table-column prop="endDate" label="结束时间" show-overflow-tooltip min-width="12%" align="center"> </el-table-column> 
        <el-table-column label="申请人" align="center"  min-width='9%' show-overflow-tooltip prop='tenementName'></el-table-column>
        <el-table-column label="地点"  align="center"  min-width='11%' show-overflow-tooltip >
          <template slot-scope="scope">
            {{scope.row.ridName}}{{scope.row.unitName}}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center"  min-width='12%' show-overflow-tooltip >
          <template slot-scope="scope"> 
            <span v-if="scope.row.status == 1" class="pdlr1 state state2">申请中</span>
            <span v-if="scope.row.status == 2" class="pdlr1 state state2">待审批</span>
            <span v-if="scope.row.status == 3" class="pdlr1 state state2">装修中</span>
            <span v-if="scope.row.status == 4" class="pdlr1 state state2">执行人确认</span>
            <span v-if="scope.row.status == 5" class="pdlr1 state state1">完成</span>
            <span v-if="scope.row.status == 6" class="pdlr1 state stateClose">关闭</span>
            <span v-if="scope.row.status == 7" class="pdlr1 state state2">不同意</span>
          </template>
        </el-table-column> 
        <el-table-column label="详情"  align="center"  min-width='7%'> 
          <template slot-scope="scope">
            <el-button  plain size="small" @click="turnTo('/estate/serviceList/wuye/renovation/details?guid='+scope.row.guid)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
       class="tableBottom"
        background
        @current-change='changeData'
        layout="prev, pager, next"
        :page-count="pageCount"
        >
      </el-pagination>
      <div id="printcode" v-show="print1">
        <el-table :data="orderList" border :style="{height:orderList.length*49+48+'px'}"> 
          <el-table-column prop="guid" label="单号" width="180px" show-overflow-tooltip  align="center"></el-table-column>
          <el-table-column align="center" prop="description" label="描述" show-overflow-tooltip width="283px"> </el-table-column>
          <el-table-column prop="createDate" label="创建时间" show-overflow-tooltip	width="180px" align="center"> </el-table-column>
          <el-table-column prop="startDate" label="开始时间" show-overflow-tooltip width="180px" align="center"> </el-table-column>
          <el-table-column prop="endDate" label="结束时间" show-overflow-tooltip width="180px" align="center"> </el-table-column> 
          <el-table-column label="申请人" align="center"  width="120px" show-overflow-tooltip prop='tenementName'></el-table-column>
          <el-table-column label="地点"  align="center"  width="120px" show-overflow-tooltip >
            <template slot-scope="scope">
              {{scope.row.ridName}}{{scope.row.unitName}}
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center"  width="120px" show-overflow-tooltip >
            <template slot-scope="scope"> 
              <span v-if="scope.row.status == 1" class="pdlr1 state state2">申请中</span>
              <span v-if="scope.row.status == 2" class="pdlr1 state state2">待审批</span>
              <span v-if="scope.row.status == 3" class="pdlr1 state state2">装修中</span>
              <span v-if="scope.row.status == 4" class="pdlr1 state state2">执行人确认</span>
              <span v-if="scope.row.status == 5" class="pdlr1 state state1">完成</span>
              <span v-if="scope.row.status == 6" class="pdlr1 state stateClose">关闭</span>
              <span v-if="scope.row.status == 7" class="pdlr1 state state2">不同意</span>
            </template>
          </el-table-column> 
        </el-table>
      </div>
    </div> 
  </div>
   
</template>
<script>
import fn from "@/assets/js/product";
import qs from "qs";
// import InfiniteScroll from "vue-infinite-scroll";
import choose from "@/components/login/hangye.vue";

import {
  Confirm,
  Alert,
  Toast,
  Notify,
  Loading
} from "vue-ydui/dist/lib.rem/dialog";
// import { Picker } from "mint-ui";
// import District from "ydui-district/dist/jd_province_city_area_id";
// import Vue from "vue";
// import { ProgressBar } from "vue-ydui/dist/lib.rem/progressbar";
// import { CellGroup, CellItem } from "vue-ydui/dist/lib.rem/cell";
// import { Switch } from "vue-ydui/dist/lib.rem/switch";

// import { Actionsheet } from "mint-ui";
// import { CitySelect } from "vue-ydui/dist/lib.rem/cityselect";

// Vue.component(CitySelect.name, CitySelect);
// Vue.component(Picker.name, Picker);
export default {
  data() {
    return {
      print1: false,
      name: "mt-picker",
      keyword: "",
      showBuild: false,
      value4: "",
      value1: "",
      slots: [
        {
          flex: 1,
          values: [],
          className: "slot2"
        }
      ],
      busy: false,
      thisType: "",
      show1: false,
      componentName: "picker",
      organInfo: "",
      datetime0: "",
      hasMessage: {
        count: 99,
        new: true
      },
      nowStatus: "",
      // qsStatus: ["上报中", "装修中", "已分单", "已接单", "已完成", "已关闭"],

      options: [
        {value: "", name: "全部" },
        { value: 1, name: "申请中" },
        { value: 2, name: "待审批" },
        { value: 3, name: "装修中" },
        { value: 4, name: "执行人确认" },
        { value: 5, name: "完成" },
        { value: 6, name: "关闭" },
        { value: 7, name: "不同意" }
      ],
      pageCount: 1,
      pageNo: 1,
      result: [],
      url: this.fromRoute ? this.fromRoute : "",
      userInfo: "",
      mainColor: "",
      showTypes: false,
      statusType: 1,
      data: {
        startDate: this.$addDay(this.$today(), -180),
        endDate: this.$today()
      },
      page: 1,
      orderList: [],
      thisContent: "",
      showSearch: false,
      pageCount: 2
    };
  },
  directives: {
    run(el, binding) {
      console.log();
    }
  },
  methods: {
    //打印
    print() {
      this.$getPrint();
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      this.$router.go(-1);
    },
    changeData(e) {
      this.pageNo = e;
      this.getQuestionInfo();
    },
    changeData1(e) {
      this.pageNo = 1;
      this.getQuestionInfo();
    },
    changeData2(e) {
      console.log(e, this.value1);
      this.pageNo = 1;
      this.getQuestionInfo();
    },
    searchFn() {
      this.page = 1;
      this.getQuestionInfo();
    },
    selectStatus(status, index) {
      console.log(status);
      if (index > 0) {
        this.nowStatus = status.value;
        this.data.status = status.value;
      } else {
        this.nowStatus = status.value;
        this.data.status = "";
      }
    },
    //设置选定的文本为粗体/正常
    loadList() {
      this.page++;
      this.getQuestionInfo();
    },
    clickShowSearch() {
      this.showSearch = this.showSearch ? false : true;
    },
    showSelectType() {
      this.show1 = this.show1 ? false : true;
    },
    searchType(guid) {
      this.data.typeId = guid;
      this.getSerch;
    },
    searchStatus(status) {
      this.data.status = status;
    },
    cancel1() {
      this.show1 = false;
      this.thisType = "";
    },
    finished() {
      this.show1 = false;
      for (var i = 0; i < this.qsTypes.length; i++) {
        if (this.qsTypes[i].dictDataName == this.thisType) {
          this.data.typeId = this.qsTypes[i].guid;
        }
      }
    },
    selectShow(num) {
      if (!this.showTypes) {
        this.showTypes = true;
        this.statusType = num;
      } else {
        if (this.statusType == num) {
          this.showTypes = false;
        } else {
          this.statusType = num;
        }
      }
    },
    onValuesChange(picker, values) {
      this.thisType = values[0];
      var data = this.data;
      this.data = {};
      this.data = data;
    },
    cancel() {
      this.showTypes = false;
    },
    itemClickHandler() {},
    getQuestionInfo(cb) {
      var data = {
        organId: this.organInfo.guid,
        token: this.getkey,
        pageNo: this.pageNo,
        userId: this.userId,
        organType: this.userInfo.organType,
        pageSize: 18
      };
      if (this.value1) {
        data.startDate = this.value1[0] + " 00:00:00";
        data.endDate = this.value1[1] + " 23:59:59";
      }
      if (this.value4 > -1) data.status = this.value4;
      this.xhr
        .post(
          `${this.subUrl.activity}/decoration/listDecoration`,
          this.$qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
            this.pageCount = res.data.data.pageCount * 1;
            this.orderList = res.data.data.list;
            cb && cb();
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    getSearch() {
      this.showSearch = false;
      this.data.userId = this.userId;
      this.data.token = this.getkey;
      this.data.pageNo = 1;
      this.data.pageSize = 18;
      this.orderList = [];
      if (this.data.startDate == "请选择") {
        this.data.startDate = "";
      } else {
        this.data.startDate = this.data.startDate + " 00:00:00";
      }
      if (this.data.endDate == "请选择") {
        this.data.endDate = "";
      } else {
        this.data.endDate = this.data.endDate + " 00:00:00";
      }
      var data = {
        organId: this.organInfo.guid,
        token: this.getkey,
        pageNo: 1,
        pageSeze: 15
      };
      this.xhr
        .post(
          `${this.subUrl.activity}/decoration/listDecoration?` +
            qs.stringify(this.data)
        )
        .then(res => {
          if (res.data.code == 1) {
            this.pageCount = res.data.data.pageCount;
            if (res.data.data.list.length > 0) {
              this.orderList.push(...res.data.data.list);
              for (var i = 0; i < this.orderList.length; i++) {
                for (var j = 0; j < this.qsTypes.length; j++) {
                  if (
                    this.orderList[i].maintainId * 1 ==
                    this.qsTypes[j].guid * 1
                  ) {
                    this.orderList[i].typeName = this.qsTypes[j].dictDataName;
                    this.orderList[i].select = false;
                  }
                }
              }
            }
            //            cb && cb();
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            //            this.$dialog.toast({mes: res.data.msg});
          }
        });
    },
    clearLoacl() {
      this.alertS = true;
    },
    quit() {
      this.alertS = false;
    },
    getTypeList(type) {
      var data = {
        userId: this.userId,
        token: this.getkey,
        pageNo: 1,
        pageSize: 18,
        typeId: type
      };
      this.xhr
        .post(
          `${this.subUrl.activity}/repairs/getRepairsList`,
          qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$message({ message: res.data.msg, type: "error" });
          }
        });
    },
    getUserInfo() {
      var data = { userId: this.userId, token: this.getkey };

      this.xhr
        .post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data))
        .then(res => {
          if (res.data.code == 1) {
            this.userInfo = res.data.data.userInfo;
            this.organInfo = res.data.data.organInfo;
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    getType() {
      var data = {
        userId: this.userId,
        token: this.getkey,
        pageNo: 1,
        pageSeze: 15
      };
      this.xhr.post(`${this.subUrl.user}/comm/getMt`).then(res => {
        if (res.data.code == 1) {
          this.qsTypes = res.data.data;
          this.slots[0].values = [];
          for (var i = 0; i < this.qsTypes.length; i++) {
            this.slots[0].values.push(this.qsTypes[i].dictDataName);
          }
        } else if (res.data.code == "-902") {
          //-902
          /*重新登录*/
          fn.re_login(this);
        } else {
          this.$dialog.toast({ mes: res.data.msg });
        }
      });
    },
    submit() {
      console.log(this.value1);
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    this.userId = this.userInfo.guid;
    this.getkey = fn.getIng();
    this.userId = this.userInfo.guid;
    var that = this;
    that.getQuestionInfo();
    this.$getRoot(res => {
      this.rootList = res;
      for (var a of this.rootList.propertyService.subclass) {
        if (a.name == "装修") {
          console.log("文字没错");
          if (a.subclass.length > 0) {
            this.showBuild = true;
          }
        }
      }
    }, this);
    // this.getType();
  }
};
</script>
<style scoped>
.search {
  width: 100%;
  height: 0.85rem;
  background: white;
  display: flex;
  flex-flow: row;
  padding: 0.15rem 0.3rem;
}
body .chooseBtn div {
  flex: 1;
  margin: 0;
}

/* .status-type01 {
  font-size: .24rem;
  border: 1px solid #5881ff;
  line-height: 1.2em;
  color: #5881ff;
  padding: .03rem .05rem;

}

.status-type02 {
  font-size: .24rem;
  padding: .03rem .05rem;
  border: 1px solid orange;
  line-height: 1.2em;
  color: orange;
}
.status-type03 {
  font-size: .24rem;
  padding: .03rem .05rem;
  border: 1px solid #999999;
  line-height: 1.2em;
  color: #999999;
} */

.div-flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.select-bottom-btn {
  background: #fff;
  border: 1px solid #cccccc;
  border-left: none;
  line-height: 3em;
}
.search > div:nth-child(1) {
  flex: 1;
  background: #ebebed;
  border-radius: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search > div:nth-child(1) > i {
  width: 0.35rem;
  height: 0.35rem;
  margin-right: 0.1rem;
}

.search > div:nth-child(1) > i > img {
  width: 100%;
  height: 100%;
}

.search > div:nth-child(1) > span {
  width: 2.4rem;
}

.search > div:nth-child(1) > span > input {
  width: 100%;
  font-size: 0.24rem;
  color: #a2a1a6;
  border: none;
}

.search > div:nth-child(2) {
  width: 1.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.repair-list {
  width: 100%;
  background: #ffffff;
  padding: 0.2em 1em;
  margin-top: 1em;
}

.repair-list div {
  width: 100%;
  /* line-height: 2em; */
  color: #999999;
  /* margin-top: 0.6em; */
  margin-top: 0.1rem;
  height: 56px;
}

.repair-list .first-div {
  border-bottom: 1px dashed #999999;
  color: #6b6b6b;
  height: 30px;
}

.repair-list div > img {
  margin-right: 0.2rem;
}

.bold-span {
  font-size: 16px;
  color: black;
  max-width: 7rem;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.birthplace {
  width: 100vw;
  height: 50%;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
}

.birthplace ul {
  width: 100%;
  /* height: 4.5rem; */
  background: white;
  position: absolute;
  bottom: 0;
  left: 0;
}

.birthplace ul li:nth-child(1) {
  width: 100%;
  height: 0.9rem;
  background: #f0f0f0;
  display: flex;
  flex-flow: row;
}

.div-flex div {
  height: 3em;
  margin-right: 0.2rem;
}
.status-item {
  width: 2rem;
  display: block;
  border: 1px solid #cccccc;
  color: #999999;
  text-align: center;
  border-radius: 2px;
  background: #ffffff;
}
.birthplace ul li:nth-child(1) > a {
  display: flex;
  justify-content: center;
  align-items: center;
}

.birthplace ul li:nth-child(1) > a:nth-child(1) {
  width: 18%;
  height: 100%;
}

.birthplace ul li:nth-child(1) > a:nth-child(2) {
  flex: 1;
  height: 100%;
}

.birthplace ul li:nth-child(1) > a:nth-child(3) {
  width: 18%;
  height: 100%;
}

.birthplace ul li:nth-child(2) {
  width: 100%;
  background: #e4eae8;
}

.black-bg {
  position: fixed;
  background: black;
  opacity: 0.3;
  width: 100%;
  top: 6.3em;
  height: 100%;
}
.repair-search {
  position: fixed;
  background: #f6f6f6;
  width: 100%;
  top: 6.3em;
  z-index: 99;
}
.repair-search-div {
  padding: 0 1em;
  line-height: 2.3em;
  position: relative;
}
.repair-btn {
  background: #fff;
  line-height: 3em;
  padding: 0 0.5em;
  margin: 0 0.3em;
}
.absolute-time {
  position: absolute;
  width: 40%;
  background: #fff;
  line-height: 3em;
  padding-left: 0.8em;
  height: 3em;
}
.absolute-time-left {
  left: 4%;
}
.absolute-time-right {
  right: 4%;
}
.absolute-time-center {
  position: absolute;
  width: 1.8em;
  top: 60%;
  left: 50%;
  margin-left: -0.9em;
  background: #999999;
  height: 2px;
}
.status-active {
  border: 1px solid #5881ff !important;
  color: #5881ff;
}
.select-bottom-btn-right {
  border-right: none;
  color: #5881ff;
}
.birthplace ul li:nth-child(1) > a:nth-child(1) {
  width: 18%;
  height: 100%;
}

.birthplace ul li:nth-child(1) > a:nth-child(2) {
  flex: 1;
  height: 100%;
}

.birthplace ul li:nth-child(1) > a:nth-child(3) {
  width: 18%;
  height: 100%;
}

.birthplace ul li:nth-child(2) {
  width: 100%;
  background: #e4eae8;
}

.black-bg {
  position: fixed;
  background: black;
  opacity: 0.3;
  width: 100%;
  top: 6.3em;
  height: 100%;
}

.repair-search {
  position: fixed;
  background: #f6f6f6;
  width: 100%;
  top: 6.3em;
  z-index: 99;
}

.repair-search-div {
  padding: 0 1em;
  line-height: 2.3em;
  position: relative;
}

.repair-btn {
  background: #fff;
  line-height: 3em;
  padding: 0 0.5em;
  margin: 0 0.3em;
}

.absolute-time {
  position: absolute;
  width: 40%;
  background: #fff;
  line-height: 3em;
  padding-left: 0.8em;
  height: 3em;
}

.absolute-time-left {
  left: 4%;
}

.absolute-time-right {
  right: 4%;
}

.absolute-time-center {
  position: absolute;
  width: 1.8em;
  top: 60%;
  left: 50%;
  margin-left: -0.9em;
  background: #999999;
  height: 2px;
}

.status-active {
  border: 1px solid #5881ff !important;
  color: #5881ff;
}

.select-bottom-btn-right {
  border-right: none;
  color: #5881ff;
}
</style>
