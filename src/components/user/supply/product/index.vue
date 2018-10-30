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
      <el-col :span="24" style="display: flex;margin-top: 10px">
        <el-col :span="6" style="padding: 0 10px;" v-for="(item,index) in titleList" :key="index">
          <div class="sure-btn" @mouseover="setClass(1)" @mouseout="setClass(0)" :class="isClass?'sure-btn'+userInfo.organType:''" @click="selectItem(item.guid)" style="background: #fff">
            {{item.name}}
          </div>
        </el-col>
      </el-col>
      <div class="clear"></div>
    </div>
    <div class="select-div">
        <div class="first1">
          <span style="margin-right:36px;">状态</span>
            <el-select class="w25" v-model="value1" placeholder="请选择" @change="handleChange()">
              <el-option
              v-for="item in options1"
              :key="item.guid"
              :label="item.name"
              :value="item.guid">
              </el-option>
            </el-select>
        </div>
        <div class="first1" style="margin-left:120px;">
          <span style="margin-right:20px;">起止时间</span>
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
        <div class="first2">
          <span>关键字</span>
          <el-input class="mr1" v-model="input" placeholder="请输入搜索关键字"></el-input>
          <el-button plain @click.native="getList">查询</el-button>
        </div>  
        <div class="first3">
          <el-button plain @click.native="realease">发布产品</el-button>
        </div>
        <div class="clear"></div>
    </div>
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
            width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.state == 1">招标</span>
              <span v-if="scope.row.state == 2">采购</span>
              <span v-if="scope.row.state == 3">产品服务</span>
            </template>
          </el-table-column>

          <el-table-column
            label="发布日期"
            prop="createTime"
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
              <el-button @click="delItem(0)" v-if='value1!=0' size="mini" type="danger">删除</el-button>
              <el-button @click="delItem(2)" size="mini" v-if="value1 == 3" type="warning">下架</el-button>
              <el-button @click="delItem(3)" size="mini" v-if="value1 == 2 || value1 == 0" type="primary">上架</el-button>
            </div>
        </div> 
        <el-pagination
          v-if="bm.rowCount>0"
          background
          style="float:right;"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="12"
          :total="bm.rowCount*1">
        </el-pagination> 
      </div> 

    <!-- <el-row class="content" style="display:none">
      <el-col v-if="tipList.length>0" v-for="(item,index) in tipList" :key="index" class="tip-detail"
              style="" :span="24">
        <el-col> 
          <el-col :span="8" @click.native="toGqDetail(3,item.guid)"
                  style="cursor:pointer;line-height: 25px;border-right: 1px solid #f1f1f1">
            <el-col style="font-weight: 600">[产品服务]{{item.title}}</el-col>
            <el-col>{{item.createTime}}</el-col>
          </el-col>
          <el-col :span=3>
            &nbsp;
          </el-col>
          <el-col :span=6>
            <el-col>&nbsp;</el-col>
            <el-col style="cursor: pointer">
              <img @click="collectIt(index)" v-if="item.select" style="width: 20px;height: 20px"
                  src="../../../../assets/images/circle/select_active.png" alt="">
              <img @click="collectIt(index)" v-if="!item.select" style="width: 20px;height: 20px"
                  src="../../../../assets/images/circle/select.png" alt="">
            </el-col>
            <el-col></el-col>
            <el-col></el-col>
          </el-col>
        </el-col>
      </el-col>
      <el-col v-if="tipList.length<=0" style="text-align: center;padding-bottom:20px;">~没有数据了~</el-col>
      <el-col v-if="tipList.length>0" style="padding:0 10px;">
        <el-col :span="6" style="cursor: pointer">全选
          <img @click="selectAll(1)" v-if="allSelect" style="width: 20px;height: 20px;margin-bottom: -4px"
              src="../../../../assets/images/circle/select_active.png" alt="">
          <img @click="selectAll(2)" v-if="!allSelect" style="width: 20px;height: 20px;margin-bottom: -4px"
              src="../../../../assets/images/circle/select.png" alt="">
        </el-col>
        <el-col :span="6">
          <el-button @click="delItem(0)" v-if='value1!=0' size="mini" type="danger">删除</el-button>
          <el-button @click="delItem(2)" size="mini" v-if="value1 == 3" type="warning">下架</el-button>
          <el-button @click="delItem(3)" size="mini" v-if="value1 == 2 || value1 == 0" type="primary">上架</el-button>
        </el-col>
      </el-col>
      <el-col v-if="tipList.length>0">
        <el-pagination
          v-if="bm.rowCount>0"
          background
          style="float:right;"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="5"
          :total="bm.rowCount*1">
        </el-pagination> 
      </el-col>
    </el-row> -->
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
      allSelect: false,
      bannerList: [],
      input: "",
      guid: 1,
      tempList: [],
      titleList: [
        {
          guid: 1,
          name: "我的商机"
        },
        {
          guid: 2,
          name: "我的客户"
        },
        {
          guid: 3,
          name: "我的名片"
        },
        {
          guid: 4,
          name: "推送管理"
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
        pageSize: 12,
        rowCount: 0,
        startDate: "",
        endDate: ""
      },
      data: {},
      // 态（0,：已删除，1：已上线，2：已下线，3：审核中，4：未通过） ,
      options1: [
        // {
        //   name: "已上线",
        //   guid: 1
        // },
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
        },
        {
          name: "已删除",
          guid: 0
        }
      ],
      circleType,
      tipList: [],
      tipTopList: [],
      district: {},
      tipType: [],
      scope: 0,
      isClass: false
    };
  },
  methods: {
    setClass(e) {
      this.isClass = e ? true : false;
    },
    selectChange(e) {
      this.tempList = e;
    },
    realease() {
      this.$router.push("/user/we_business/supply/release_products");
    },
    delItem(e) {
      if (this.tempList.length == 0) return this.$message.error("请选择产品");
      var list = [];
      for (var i = 0; i < this.tempList.length; i++) {
        list.push(this.tempList[i].guid);
      }
      var data = {
        state: e,
        token: this.$getkey(),
        guid: list.join(",")
      };
      this.$ajax(
        `${this.subUrl.bd}/product/delProduct`,
        data,
        res => {
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
          url = "/user/we_business/supply/my_business";
          break;
        case 2:
          url = "/user/we_business/supply/my_customer";
          break;
        case 3:
          url =
            "/user/we_business/supply/bussnessCard?userId=" +
            this.userInfo.guid +
            "&oName=" +
            this.organInfo.organName;
          break;
        case 4:
          url = "/user/we_business/supply/push_management";
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
        "/user/we_business/supply/proService?type=" + type + "&guid=" + id
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
        state: this.state
      };
      if (this.bm.startDate) {
        data.startTime = this.bm.startDate;
      }
      if (this.bm.endDate) {
        data.endTime = this.bm.endDate;
      }
      if (this.input) {
        data.keyword = this.input;
      }
      var url = this.subUrl.bd + "/product/productList";
      this.$ajax(
        url,
        data,
        res => {
          this.tipList = [];
          this.bm.rowCount = res.data.rowCount * 1;
          this.tipList = res.data.list;
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
    this.getList();
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    // this.circleType
  }
};
</script>
<style lang="scss" scoped>
.clear {
  clear: both;
}
.tip-detail {
  line-height: 40px;
  border: 1px dashed #ddd;
  box-sizing: border-box;
  margin-bottom: 10px;
  padding: 10px;
}
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

.layout {
  height: 100%;
  position: relative;
}
.content {
  padding: 20px 30px;
  margin: 20px 0;
  background: #fff;
  overflow: hidden;
  margin-top: 0;
  padding: 0 10px;
}

.select-btn {
  // margin-left: 10px;
  // margin-bottom: 10px;
  background: #fff;
  padding: 10px;
  cursor: pointer;
  text-align: center;
}

.sure-btn {
  line-height: 40px;
  border: 1px solid #ddd;
}

.sure-btn:hover {
  color: #fff;
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

// "",
// "#23ac38",
// "#fab23e",
// "#1e82d2",
// "#1e82d2",
// "#1e82d2",
// "#1e82d2",
// "#1e82d2",
.select-div {
  background: #fff;
  padding-top: 10px;
  .first1 {
    float: left;
    margin-left: 20px;
    span {
      margin-right: 10px;
    }
  }
  .first2 {
    float: left;
    margin-left: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
    span {
      margin-right: 20px;
    }
    .el-input {
      width: 250px;
    }
  }
  .first3 {
    float: left;
    margin-left: 100px;
    margin-top: 10px;
  }
  .first4 {
    float: left;
    margin-left: 10px;
    margin-top: 10px;
  }
}
</style>
