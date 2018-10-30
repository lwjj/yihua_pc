<template> 
   <div class="layout_my newRightContent">
    <div class="title">
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/entprise/workstation'}">工作台</el-breadcrumb-item>
            <el-breadcrumb-item>任务进度</el-breadcrumb-item>
        </el-breadcrumb>
    </div> 
    <div class="tableBox">
      <div class="tableTop"> 
        <div>
          <span>状态：</span>
          <el-select @change='changeData1' v-model="value4" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :change-on-select='false'
              :label="item.name"
              :value="item.value">
            </el-option>
            
        </el-select>
        </div>  
        <div v-if="userInfo.postType == 2">
          <span>部门:</span>
          <el-select @change='changeData1' v-model="value5" clearable placeholder="请选择">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :change-on-select='false'
              :label="item.deptName"
              :value="item.guid">
            </el-option>
        </el-select>
        </div>  
        <!-- <div v-if="userInfo.postType == 3"> 
          <el-button-group>
            <el-button @click="getList(1)" :type="buttomType==1?'primary':'default'">汇报</el-button>
            <el-button @click="getList(2)" :type="buttomType==1?'default':'primary'">审批</el-button>
          </el-button-group>
        </div> -->
        <div>
           <span>任务:</span>
          <el-select @change='changeData3' v-model="value3" clearable placeholder="请选择">
            <el-option
              v-for="item in options3"
              :key="item.value"
              :change-on-select='false'
              :label="item.name"
              :value="item.value">
            </el-option>
        </el-select>
        </div>
        <div>
          时间选择:
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            @change="changeData2"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <el-button-group>
          <el-button type="primary" icon='el-icon-plus el-icon--right
          ' @click="$router.push('/taskProcess/add')" >新建</el-button> 
        </el-button-group>

        <!-- <el-dropdown>
            <el-button type="primary">
              新建<i class="el-icon-plus el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>新建日报</el-dropdown-item>
              <el-dropdown-item>新建周报</el-dropdown-item>
              <el-dropdown-item>新建月报</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
      </div>
      <el-table
        :data="orderList"
        height="250"
        border
        style="width: 100%">
        
        <el-table-column
          prop="guid"
          label="单号"
          width="180">
        </el-table-column>
         <el-table-column
          label="标题"
          width='120'
          show-overflow-tooltip	
          
          prop='taskName' >
          </el-table-column> 
        <el-table-column
          prop="taskDetail"
          :formatter="setType1"
          label="详情"
          show-overflow-tooltip	
          width='200'
           > 
        </el-table-column> 
         <el-table-column
          prop="createDate"
          label="创建时间"
          show-overflow-tooltip	
          width='180'
           > 
        </el-table-column>
        <el-table-column
          prop="userName"
          label="创建人"
          show-overflow-tooltip	
          width='120'
           > 
        </el-table-column> 
        <el-table-column
          prop="userName"
          label="完成进度"
          show-overflow-tooltip	
          width='200'
           > 
           <template slot-scope="scope">
             <div>
                <el-progress :percentage="scope.row.progress"></el-progress>
             </div>
           </template>
        </el-table-column> 
          <el-table-column
          label="任务类型"
          prop="typeName"
          width='120'
          show-overflow-tooltip	 
           >
          </el-table-column>
        <el-table-column
          label="状态"
          width='180' 
           >
           <!--  0关闭，1完成，2草稿，3未启动，4进行中，5验收， 6超时未完成，7超时完成 , -->
            <template slot-scope="scope"> 
              <span v-if="scope.row.status == 0" class="pdlr1 state state2">关闭</span>
              <span v-if="scope.row.status == 1" class="pdlr1 state state2">完成</span>
              <span v-if="scope.row.status == 2" class="pdlr1 state state2">草稿</span>
              <span v-if="scope.row.status == 3" class="pdlr1 state state2">未启动</span>
              <span v-if="scope.row.status == 4" class="pdlr1 state state1">进行中</span>
              <span v-if="scope.row.status == 5" class="pdlr1 state stateClose">验收</span>
              <span v-if="scope.row.status == 6" class="pdlr1 state stateClose">超时未完成</span>
              <span v-if="scope.row.status == 5" class="pdlr1 state stateClose">超时完成</span>
           </template>
        </el-table-column> 
        <el-table-column
          label="详情"
           > 
           <template slot-scope="scope">
             <el-button type="primary" @click="turnTo('/taskProcess/detail/' + scope.row.guid + '?type=' + scope.row.type,scope.row)">详情</el-button>
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
export default {
  props: ["rootList"],
  data() {
    return {
      keyword: "",
      value4: "",
      value5: "",
      value3: 0,
      value1: "",
      slots: [
        {
          flex: 1,
          values: [],
          className: "slot2"
        }
      ],
      busy: false,
      showAddbutton: false,
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
      // 0关闭，1完成，2草稿，3未启动，4进行中，5验收， 6超时未完成，7超时完成 ,
      options: [
        { value: 0, name: "关闭" },
        { value: 1, name: "完成" },
        { value: 2, name: "草稿" },
        { value: 3, name: "未启动" },
        { value: 4, name: "进行中" },
        { value: 5, name: "验收" },
        { value: 6, name: "超时未完成" },
        { value: 7, name: "超时完成" }
      ],
      options2: [],
      options3: [
      	{
          name: "全部",
          value: 0
        },
        {
          name: "新任务",
          value: 1
        },
        {
          name: "我分配的任务",
          value: 2
        }
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
      pageCount: 2,
      buttomType: 1
    };
  },
  directives: {
    run(el, binding) {
      console.log();
    }
  },
  methods: {
    setType(a, b, c) {
      return c == 1 ? "采购" : "供应";
    },
    setType1(a, b, c) {
      return c ? c : "无";
    },
    turnTo(url, e) {
      if (e.status == 2) {
        this.$router.push(
          `/taskProcess/add?type=${e.type}&handle=2&guid=${e.guid}`
        );
      } else {
        //跳转到详情
        // if (this.userInfo.postType == 2) {
        //   url = url + `&isApply=1`;
        // } else if (this.userInfo.postType == 3) {
        //   console.log(JSON.stringify(this.currentReport));
        //   if (this.currentReport.name == "审批") {
        //     url = url + `&isApply=1`;
        //   }
        // }
        this.$router.push(url);
      }
    },
    back() {
      this.$router.go(-1);
    },
    changeData(e) {
      this.pageNo = e;
      this.getQuestionInfo();
    },
    changeData3(e) {
      this.pageNo = 1;
      this.getQuestionInfo();
    },
    getDepartMent() {
      let data = {
        userId: this.userInfo.guid,
        token: this.$getkey(),
        organId: this.organInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/admin/deptManage/organDepartmentInfo`,
        data,
        res => {
          this.options2 = res.data;
        },
        this
      );
    },
    changeData1(e) {
      this.pageNo = 1;
      this.getQuestionInfo();
    },
    changeData2(e) {
      this.pageNo = 1;
      this.getQuestionInfo();
    },
    searchFn() {
      this.page = 1;
      this.getQuestionInfo();
    },
    selectStatus(status, index) {
      if (index > 0) {
        this.nowStatus = status.value;
        this.data.status = status.value;
      } else {
        this.nowStatus = status.value;
        this.data.status = "";
      }
    },
    getList(e) {
      if (e == 1) {
        this.buttomType = 1;
      } else {
        this.buttomType = 0;
      }
      this.pageNo = 1;
      this.getQuestionInfo(e);
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
    getQuestionInfo(mType) {
      var data = {
        organId: this.organInfo.guid,
        token: this.getkey,
        pageNo: this.pageNo,
        userId: this.userId,
        type:this.value3
      };
      if (this.value1) {
        data.startDate = this.value1[0] + " 00:00:00";
        data.endDate = this.value1[1] + " 23:59:59";
      }

      if (this.value4 * 1 > -1) {
        data.status = this.value4;
      } else {
        delete data.status;
      }
      if (this.value5) data.deptId = this.value5;
//    if (this.value3) {
//      data.type = this.value3;
//    } else {
//      data.type = 0;
//    }
//    if (this.userInfo.postType == 3) {
//      if (this.buttomType == 1) {
//        data.type = 1;
//      } else {
//        data.type = 2;
//      }
//    }

      this.xhr
        .post(
          `${this.subUrl.activity}/taskBill/taskProgress/getTaskList`,
          this.$qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
            this.pageCount = res.data.data.pageCount * 1;
            this.orderList = res.data.data.list;
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
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
        pageSize: 15,
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
    submit() {}
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
    if (this.userInfo.postType == 2) {
      this.getDepartMent();
    }
    // rootList从router-view传过来的父级属性
    for (var val of this.rootList) {
      if (val.name == "工作台") {
        for (var val1 of val.subclass) {
          if (val1.name == "任务进度") {
            for (var val2 of val1.subclass) {
              if (val2.name == "我分配的任务") {
                this.showAddbutton = true;
                break;
              }
            }
            break;
          }
        }
        break;
      }
    }

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
