<template>
  <div class="newRightContent">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>供求市场</el-breadcrumb-item>
        <!--<el-breadcrumb-item></el-breadcrumb-item>-->
      </el-breadcrumb>
    </div>
    <div class="layout">
      <div class="select-btn">
      <el-col :span="24" style="display: flex">
        <el-col :span="6" style="padding: 0 5px;width:200px;" v-for="(item,index) in titleList" :key="index">
          <div class="sure-btn"  @mouseover="setClass(1)" @mouseout="setClass(0)" :class="isClass?'sure-btn'+userInfo.organType:''" @click="selectItem(item.guid)" style="background: #fff">
            {{item.name}}
          </div>
        </el-col>
      </el-col>
      <div class="clear"></div>
    </div>
    <div class="select-div">
        <div class="first1">
          <span>状态</span>
            <el-select v-model="value1" :clearable="false" class="flex1" @change="chooseItem" placeholder="请选择">
              <el-option
              v-for="item in options1"
              :key="item.guid"
              :label="item.name"
              :value="item.guid">
              </el-option>
            </el-select>
        </div>
        <div class="first1">
          <span>起止时间</span>
          <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          @change="dateChange"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="clear"></div>
        <div class="first2 first1">
          <span>关键字</span>
          <el-input v-model="input" style="flex:1;margin-right:10px;" placeholder="请输入搜索关键字"></el-input>
          <el-button  @click.native="getList">查询</el-button>
        </div>
        <div class="first3">
          <el-button  @click.native="toPurchase" class="el-icon-plus">发布采购</el-button>
        </div>
        <div class="first4">
          <el-button  @click.native="toTender" class="el-icon-plus">发布招标</el-button>
        </div>
        <div class="clear"></div>
    </div>
      <!-- 表格 -->
      <div class="tableContent pdlr2 bgwhite">
        <el-table
          border
          height="100%"
          ref="multipleTable"
          :data="tipList"
          tooltip-effect="dark"
          style="width:100%"
          @selection-change="selectChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="类型"
            width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 1">招标</span>
              <span v-if="scope.row.type == 2">采购</span>
              <span v-if="scope.row.type == 3">产品服务</span>
            </template>
          </el-table-column>

          <el-table-column
            label="发布日期"
            prop="startTime"
            width="170">
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题" 
            show-overflow-tooltip >
          </el-table-column>
          <el-table-column
            width="120"
            label="操作">
            <template slot-scope="scope">
              <el-button @click="toGqDetail(scope.row.type,scope.row.guid)" size="mini">详情</el-button>
            </template>
          </el-table-column>
        </el-table> 
      </div>
      <div class="paginationRight pdlr2" style="justify-content:space-between;">
        <div v-if="tipList.length>0"> 
            <div>
              <el-button v-if="value1==2 || value1 == 0" size="mini" @click="delItem(3)" type="primary">上架</el-button>
              <el-button v-if="value1==3" @click="delItem(2)"  size="mini" type="warning">下架</el-button>
              <el-button @click="delItem(0)"  size="mini" type="danger">删除</el-button>
            </div>
        </div> 
        <el-pagination
          v-if="bm.rowCount>0"
          background
          style="float:right;"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="5"
          :total="bm.rowCount*1">
        </el-pagination> 
      </div> 
    </div>
  </div>
</template>
<script>
export default {
  data() {
    let TypeListCircle;
    var userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    var userType = userInfo.organType;
    if (userType == 1) {
      TypeListCircle = 1;
    } else if (userType == 5) {
      TypeListCircle = 2;
    } else {
      TypeListCircle = 3;
    }
    var circleType = TypeListCircle;
    return {
      pageCount: 1,
      isClass: 0,
      allSelect: false,
      tempList: [],
      bannerList: [],
      input: "",
      guid: 1,
      titleList: [
        {
          guid: 1,
          name: "商家报价"
        },
        {
          guid: 2,
          name: "我的询盘"
        },
        {
          guid: 3,
          name: "我的供应商"
        }
      ],
      dateValue: [],
      selectedOptions2: [],
      selectedOptions1: "",
      userInfo,
      state: 3,
      value1: 3,
      value2: "",
      value3: "",
      value4: "",
      value5: "",
      value6: "",
      value7: "",
      value8: "",
      showDis1: false,
      showDis2: false,
      showDis3: false,
      showDis4: false,
      showDis5: false,
      bm: {
        pageNo: 1,
        pageSize: 5,
        rowCount: 0,
        startDate: "",
        endDate: ""
      },
      data: {},
      options1: [
        {
          name: "已删除",
          guid: 0
        },
        {
          name: "已下线",
          guid: 2
        },
        {
          name: "已上线",
          guid: 3
        },
        {
          name: "未通过",
          guid: 4
        }
      ],
      circleType,
      tipList: [],
      tipTopList: [],
      district: {},
      tipType: [],
      scope: 0
    };
  },
  methods: {
    selectChange(e) {
      this.tempList = e;
    },
    setClass(e) {
      this.isClass = e ? true : false;
    },
    chooseItem(index) {
      this.getList();
    },
    toPurchase() {
      this.$router.push("/user/we_business/supply/release_purchase");
    },
    toTender() {
      this.$router.push("/user/we_business/supply/tender_invitation");
    },
    delItem(e) {
      if (this.tempList.length == 0)
        return this.$message.error("请选择采购招标单");
      var list = [];
      var list1 = [];
      for (var i = 0; i < this.tempList.length; i++) {
        list.push(this.tipList[i].guid);
        list1.push(this.tipList[i].type);
      }
      var guid = "";
      var guidList = JSON.stringify(list)
        .split('["')[1]
        .split('"]')[0]
        .split('"');
      for (var i = 0; i < guidList.length; i++) {
        guid = guid + guidList[i];
      }
      var data = {
        state: e,
        token: this.$getkey(),
        poIdList: guid,
        typeList: list1.join(",")
      };
      this.$ajax(
        `${this.subUrl.bd}/purchase/upAndDownOrder`,
        data,
        res => {
          this.allSelect = false;
          this.$message.success("操作成功");
          this.getList();
        },
        this
      );
    },
    selectAll(index) {
      if (index == 2) {
        this.allSelect = true;
        for (var i = 0; i < this.tipList.length; i++) {
          this.tipList[i].select = true;
        }
        var list = this.tipList;
        this.tipList = [];
        this.tipList = list;
      } else {
        this.allSelect = false;
        for (var i = 0; i < this.tipList.length; i++) {
          this.tipList[i].select = false;
        }
        var list = this.tipList;
        this.tipList = [];
        this.tipList = list;
      }
    },
    dateChange() {
      console.log(this.dateValue);
      if (this.dateValue != null) {
        this.bm.startDate =
          this.dateValue[0].format("yyyy-MM-dd") + " 00:00:00";
        this.bm.endDate = this.dateValue[1].format("yyyy-MM-dd") + " 23:59:59";
      } else {
        this.bm.startDate = "";
        this.bm.endDate = "";
      }
      this.getList();
    },
    collectIt(index) {
      this.tipList[index].select = !this.tipList[index].select;
      this.allSelect = true;
      if (this.tipList[index].select) {
        for (var i = 0; i < this.tipList.length; i++) {
          if (!this.tipList[i].select) {
            this.allSelect = false;
            return;
          }
        }
      } else {
        this.allSelect = false;
      }
      var list = this.tipList;
      this.tipList = [];
      this.tipList = list;
    },
    selectItem(guid) {
      var url = "";
      switch (guid) {
        case 1:
          url = "/user/we_business/supply/bussnessAsk";
          break;
        case 2:
          url = "/user/we_business/supply/inquiry";
          break;
        case 3:
          url = "/user/we_business/supply/supplier";
          break;
      }
      this.$router.push(url);
    },
    toDetail(id, guid) {
      this.$router.push(
        "/user/we_business/supply/tipDetail?userId=" + id + "&bbsId=" + guid
      );
    },
    toUserDetail(id) {
      this.$router.push("/user/we_business/supply/userInfo?guid=" + id);
    },
    toGqDetail(type, id) {
      this.$router.push(
        "/user/we_business/supply/gjDetail?type=" + type + "&guid=" + id
      );
    },
    handleChange() {
      this.state = this.value1;
      this.getList();
    },
    getbbsType() {
      this.tipType = [];
      var data = {
        token: this.$getkey(),
        circleType: this.circleType
      };
      var url =
        this.guid == 1
          ? this.subUrl.sc + "/bbs/getBBsType"
          : this.subUrl.user + "/comm/getIndustryCategory";
      this.$ajax(
        url,
        data,
        res => {
          if (this.guid == 1) {
            this.tipType = res.data;
          } else {
            this.tipType = [...res.data.icc, ...res.data.pm];
            console.log();
            this.tipType = JSON.parse(
              JSON.stringify(this.tipType)
                .replace(/name/g, "label")
                .replace(/subclass/g, "children")
                .replace(/value/g, "value1")
                .replace(/guid/g, "value")
            );
            console.log(this.tipType);
            for (var i = 0; i < this.tipType.length; i++) {
              for (var j = 0; j < this.tipType[i].children.length; j++) {
                this.tipType[i].children[j] = JSON.parse(
                  JSON.stringify(this.tipType[i].children[j]).replace(
                    /children/g,
                    "child"
                  )
                );
              }
            }
            console.log(this.tipType);
          }
        },
        this
      );
    },
    handleCurrentChange(val) {
      this.bm.pageNo = val;
      this.getList();
    },

    getList() {
      var data = {
        token: this.$getkey(),
        pageNo: this.bm.pageNo,
        pageSize: this.bm.pageSize,
        state: this.state,
        startDate: this.bm.startDate,
        endDate: this.bm.endDate,
        title: this.input
      };
      data.state = this.value1;
      if (this.state == "" && this.state != 0) {
        this.value1 = 3;
        data.state = 3;
      }
      var url = this.subUrl.bd + "/purchase/orderList";
      this.$ajax(
        url,
        data,
        res => {
          this.tipList = [];
          this.bm.rowCount = res.data.rowCount;
          this.tipList = res.data.list;
          this.pageCount = res.data.pageCount * 1;
          for (var i = 0; i < this.tipList.length; i++) {
            this.tipList[i].select = false;
          }
        },
        this
      );
    }
  },
  mounted() {
    // 任务统计
    // this.selectItem(1);
    this.getbbsType();
    this.state = 3;
    this.getList();
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    // this.circleType
  }
};
</script>
<style lang="scss" scoped>
.layout {
  position: relative;
  height: 100%;
  .tableContent {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 50px;
    top: 180px;
  }
}
.businessList {
  background: #fff;
  padding: 0 10px;
  .tip-detail1 {
    display: flex;
    background: #fff;
    margin-bottom: 10px;
    line-height: 2;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    .supplyImg {
      width: 67px;
      height: 69px;
      margin-right: 10px;
      overflow: hidden;
    }
    .rightContent {
      flex: 1;
      div {
        line-height: 1.5;
      }
      .rightTitle1 {
        font-weight: 600;
        font-size: 14px;
      }
      .rightTitle2 {
        font-size: 12px;
        padding-left: 8px;
      }
      .rightTitle3 {
        font-size: 14px;
        display: flex;
        align-items: center;
        span {
          font-size: 14px;
        }
      }
    }
    .collectIcon {
      width: 50px;
    }
  }
}
.clear {
  clear: both;
}
.tip-detail1 {
  border-bottom: 1px solid #ddd;
  padding: 10px;
  margin: 0 10px 10px;
  padding: 10px;
}

#new_progress {
  padding-left: 300px;
  padding-right: 40px;
  height: auto;
}

.content {
  padding: 20px 30px;
  margin: 20px 0;
  background: #fff;
  margin-top: 0;
  padding: 0;
}

.select-btn {
  padding: 10px 10px 10px 0;
  background: #fff;
  cursor: pointer;
  text-align: center;
}
.sure-btn {
  line-height: 40px;
  border: 1px solid #ddd;
}
.sure-btn:hover {
  color: #fff;
  border-radius: 5px;
}
.sure-btn1:hover {
  background: #23ac38 !important;
}
.sure-btn2:hover {
  background: #fab23e !important;
}
.sure-btn3:hover {
  background: #1e82d2 !important;
}
.sure-btn:hover {
  color: #fff;
  background: #409eff !important;
}

.select-div {
  background: #fff;
  padding-top: 10px;
  .first1 {
    float: left;
    width: 320px;
    span {
      width: 50px;
      text-align: right;
      white-space: nowrap;
    }
    display: flex;
    align-items: center;
    margin-left: 20px;
    span {
      margin-right: 10px;
    }
  }
  .first2 {
    float: left;
    display: flex;
    align-items: center;
    margin-left: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .first3 {
    float: left;
    display: flex;
    align-items: center;
    margin-left: 20px;
    margin-top: 10px;
  }
  .first4 {
    float: left;
    display: flex;
    align-items: center;
    margin-left: 10px;
    margin-top: 10px;
  }
}
</style>
