<template>
  <div class="layout_my newRightContent">
    <div class="title">
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-if="userInfo.organType == 3" :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
            <el-breadcrumb-item>外勤服务</el-breadcrumb-item>
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
        <!-- 管理处有新建，租户和商家没有 -->
        <el-button-group v-if="userInfo.organType == 3">
          <el-button type="primary" icon='el-icon-plus
          ' @click="$router.push('/mechant/serviceList/waiqing/add')">新建</el-button> 
          <el-button class="ml2" v-if="userInfo.organType == 3" type="primary" @click="$router.push('/estate/serviceList/waiqing/setting')">设置</el-button>
        </el-button-group>
      </div>
      <el-table
        :data="contentList"
        height="250"
        border
        style="width: 100%">
        
        <el-table-column
          prop="guid"
          label="单号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          show-overflow-tooltip	
          width='300'
           > 
        </el-table-column>
         <el-table-column
          prop="createDate"
          label="创建时间"
          show-overflow-tooltip	
          width='200'
           > 
        </el-table-column>
        <el-table-column
          label="地点"
          width='180' 
           >
           <template slot-scope="scope">
            {{scope.row.customerInfo.ridName}}{{scope.row.customerInfo.unitName}}
           </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width='180' 
           >
            <template slot-scope="scope">
            <span class="pdlr1 state state1" v-if="scope.row.status == 0">已完成</span>
              <span class="pdlr1 state stateClose" v-if="scope.row.status == 1">已关闭</span>
              <span class="pdlr1 state state2" v-if="scope.row.status == 2">草稿</span>
              <span class="pdlr1 state state2" v-if="scope.row.status == 3">客服分配</span>
              <span class="pdlr1 state state2" v-if="scope.row.status == 4">经理分配</span>
              <span class="pdlr1 state state2" v-if="scope.row.status == 5">派单</span>
              <span class="pdlr1 state state2" v-if="scope.row.status == 6">抢单 </span>
              <span class="pdlr1 state state2" v-if="scope.row.status == 7">分单 </span>
              <span class="pdlr1 state state2" v-if="scope.row.status == 8">处理中 </span>
              <span class="pdlr1 state state2" v-if="scope.row.status == 9">用户评价 </span>
              <span class="pdlr1 state stateClose" v-if="scope.row.status == 10">客服评价</span>
           </template>
        </el-table-column>

        <el-table-column
          label="详情"
           > 
           <template slot-scope="scope">
             <el-button type="primary" @click="turnTo('/mechant/serviceList/waiqing/detail?guid=' + scope.row.guid)">详情</el-button>
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
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";

export default {
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    return {
      currentIndex: -1,
      currentIndex1: -1,
      currentIndex2: 0,
      isFilter: false,
      mainColor: "",
      startTime: this.$addDay(this.$today(), -180),
      endTime: this.$today(),
      // 0关闭 1完成 2经理审批 3客服发布 4客户处理 5复查 6客服关闭 ,
      options2: [
        { name: "全部", value: -1 },
        { name: "已派单", value: 5 },
        { name: "完成单", value: 0 }
      ],
      //  0：完成，1:关闭 2:草稿，3:客服分配，4:经理分配，5:派单，6:抢单，7:分单，8:处理，9:用户评价，10:客服评价关闭， ,
      options: [
        {
          name: "全部",
          value: -1
        },
        {
          name: "已完成",
          value: 0
        },
        {
          name: "已关闭",
          value: 1
        },
        // {
        //   name: "草稿",
        //   value: 2
        // },
        {
          name: "客服分配",
          value: 3
        },
        {
          name: "经理分配",
          value: 4
        },
        {
          name: "派单",
          value: 5
        },
        {
          name: "抢单",
          value: 6
        },
        {
          name: "分单",
          value: 7
        },
        {
          name: "处理中",
          value: 8
        },
        {
          name: "用户评价",
          value: 9
        },
        {
          name: "客服关闭评价",
          value: 10
        }
      ],
      value4: "",
      value1: "",
      contentList: [],
      pageNo: 1,
      pageCount: 1
    };
  },

  methods: {
    changeData(e) {
      this.pageNo = e;
      this.getMyInvitation();
    },
    changeData1(e) {
      this.pageNo = 1;
      this.getMyInvitation();
    },
    changeData2(e) {
      console.log(e, this.value1);
      this.pageNo = 1;
      this.getMyInvitation();
    },
    chooseOrder(index) {
      this.currentIndex2 = index;
      if (index == 0) {
        this.currentIndex1 = -1;
      } else if (index == 1) {
        this.currentIndex1 = 5;
      } else if (index == 2) {
        this.currentIndex1 = 8;
      } else {
        this.currentIndex1 = 0;
      }
      this.pageNo = 1;
      this.contentList = [];
      this.getMyInvitation();
    },
    // 检查是否含有物业
    checkPro(cb) {
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/serviceOrder/checkPro`,
        data,
        res => {
          cb && cb(res.data);
          console.log(res, "参数");
          // if (res.data == 0) {
          //   this.$router.push("");
          // } else if (res.data == 1) {
          // }
        },
        this
      );
    },
    loadList() {
      this.getMyInvitation();
    },
    confirm() {
      this.pageNo = 1;
      this.contentList = [];
      this.getMyInvitation();
      this.currentIndex = -1;
      this.isFilter = false;
    },
    chooseIndex(e) {
      this.currentIndex = e;
      this.isFilter = true;
    },
    cancelIndex() {
      this.currentIndex = -1;
      this.isFilter = false;
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      this.$back(this);
    },
    // 获取邀请信息列表
    getMyInvitation() {
      var data = {
        userId: this.userId,
        token: this.$getkey(),
        pageNo: this.pageNo
      };
      if (this.value1) {
        data.startDate = this.value1[0] + " 00:00:00";
        data.endDate = this.value1[1] + " 23:59:59";
      }
      if (this.value4 > -1) data.status = this.value4;

      this.xhr
        .post(
          `${this.subUrl.activity}/serviceOrder/getOrderList`,
          qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
            this.contentList = res.data.data.list;
            this.pageCount =
              res.data.data.pageCount * 1 ? res.data.data.pageCount * 1 : 0;
            this.pageNo++;
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$message({ message: res.data.msg, type: "error" });
          }
        });
    }
  },
  mounted() {
    if (this.$route.query.token) {
      this.$getUserInfo(res => {
        this.userId = this.userInfo.guid;
        this.getkey = fn.getIng();
        this.checkPro(res => {
          console.log(res, "这个是参数");
          if (res == 1) {
            this.getMyInvitation();
          } else {
            console.log(res);
            this.$router.push("/mechant/setIndustury");
          }
        });
      }, this);
    } else {
      this.userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      this.organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      this.mainColor = this.$color[this.userInfo.organType];
      this.userId = this.userInfo.guid;
      this.getkey = fn.getIng();
      this.checkPro(res => {
        console.log(res);
        if (res == 1) {
          this.getMyInvitation();
        } else {
          this.$router.push("/mechant/setIndustury");
        }
      });
    }
  }
};
</script>
<style scoped>
/* 状态筛选 */
.myButton {
  width: 1.56rem;
  border: 1px solid #fff;
}

.timeFilter {
  padding: 0 0.8rem;
}

/*  */
.statusFilte {
  padding: 0.24rem 0.42rem;
  padding-bottom: 0;
}

.myButton {
  margin-right: 0.2rem;
  margin-bottom: 0.2rem;
}

.filter {
  top: 0;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;
  box-sizing: border-box;
  /* padding: 0 0 0.5rem; */
  transform: translate(0, 0);
  background: #f6f6f6;
}

.layout_my .header:after {
  display: none;
}

.layout_my {
  background: #f7f7f9;
}

.layout_my .blue_box {
  height: 0.88rem;
  background: #0093d2;
  background-size: 100% 100%;
}

.headTab {
  width: 100%;
  height: 0.9rem;
  background: white;
}

.headTab .flex1 {
  border-bottom: 2px solid #fff;
}

.headTab .flex1.active {
  color: rgb(30, 130, 210);
  border-color: rgb(30, 130, 210);
}

.headTab ul {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row;
}

.headTab ul li {
  width: 25%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.32rem;
}

.contentList {
  width: 100%;
}

.contents {
  width: 100%;
  margin-top: 0.2rem;
  background: white;
  padding: 0.1rem 0.2rem;
  position: relative;
}

.contents > ul {
  width: 100%;
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px dashed #bfbfbf;
  height: 0.7rem;
}

.contents > ul > li {
  display: flex;
}

.contents > ul > li:nth-child(1) > span {
  border-radius: 0.04rem;
  font-size: 0.24rem;
}

.contents > ul > li > i {
  width: 0.3rem;
  height: 0.3rem;
  margin-left: 0.1rem;
}

.contents > ul > li > i > img {
  width: 100%;
  height: 100%;
}

.contents > div {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
}

.contents > div > i {
  width: 0.6rem;
  height: 0.6rem;
  margin: 0.1rem 0.25rem;
}

.contents > div > i > img {
  width: 100%;
  height: 100%;
}

.contents > ol {
  display: flex;
  flex-flow: column;
  padding: 0.1rem 0.2rem;
}

.contents > ol > li {
  margin: 0.1rem 0;
}
</style>
