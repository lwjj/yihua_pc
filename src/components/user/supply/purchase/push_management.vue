<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native="back">返回</el-breadcrumb-item>
        <el-breadcrumb-item>推送管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--<div class="select-btn">-->
      <!--<el-col :span="18" style="display: flex;margin-top: 10px">-->
        <!--<el-col :span="6" style="padding: 0 10px;" v-for="item,index in titleList" :key="index">-->
          <!--<div class="sure-btn" @click="selectItem(item.guid)" style="background: #fff">-->
            <!--{{item.name}}-->
          <!--</div>-->
        <!--</el-col>-->
      <!--</el-col>-->
    <!--</div>-->
      <div class="select-div">
        <div class="first1">
          <span>状态</span>
          <el-select v-model="value1" placeholder="请选择" @change="handleChange()">
            <el-option
            v-for="item in options1"
            :key="item.guid"
            :label="item.name"
            :value="item.guid">
            </el-option>
          </el-select>
        </div>
        <div class="first2">
          <el-input v-model="input" @input.native="getCurrent" @keyup.enter.native='getList' placeholder="请输入搜索关键字"></el-input>
          <el-button plain @click.native="getList">查询</el-button>

        </div>
        <div class="clear"></div>
        <div class="first1">
          <span>日期</span>
          <el-date-picker style="width: 280px"
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          @change="dateChange"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="first4">
          <el-button plain @click.native="addPush">新增推送</el-button>
        </div>
        <div class="clear"></div>
    </div>
    <div class="main bgwhite">
      <div class="tableContent pdlr2">
        <el-table :data=tipList height="calc(100% - 50px)" border @selection-change="handleSelectionChange">
           <el-table-column type="selection"  width="55"></el-table-column>
          <el-table-column label="标题" prop='expandTitle' show-overflow-tooltip></el-table-column>
          <el-table-column label="类型" prop='type' show-overflow-tooltip width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.type == 1">优惠券</span>
                <span v-else-if="scope.row.type == 2">优惠券</span>
                <span v-else>名片</span>
            </template>
          </el-table-column>
           <el-table-column label="状态" prop='type' show-overflow-tooltip width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.state  == 1">正常</span>
                <span v-else-if="scope.row.state == 2">失效</span>
                <span v-else>删除</span>
            </template>
          </el-table-column>
          <el-table-column width="170" label="时间" prop='createDate' show-overflow-tooltip></el-table-column>
          <el-table-column label="时间" prop='createDate' show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button @click='toDetail(scope.row)' type="primary" size="small">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 底层分页 -->
        <el-row>
          <el-col :span="12">
            <el-button type="danger" class="mt1 mb1" size="mini" @click="delItem">删除</el-button>
          </el-col>
          <el-col :span="12">
            <el-pagination
              v-if="bm.rowCount>0"
              background
              class="mt1 mb1"
              style="text-align:right;width:100%"
              @current-change="handleCurrentChange"
              layout="prev, pager, next"
              :page-size="bm.pageSize"
              :total="bm.rowCount*1">
            </el-pagination> 
          </el-col>
        </el-row>
        <!-- state (integer, optional): 状态 1：正常，2：失效，3：删除 , -->
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
      allSelect: false,
      bannerList: [],
      input: "",
      guid: 1,
      titleList: [
        {
          guid: 0,
          name: "正常"
        },
        {
          guid: 1,
          name: "黑名单"
        }
      ],
      dateValue: [],
      selectedOptions2: [],
      selectedOptions1: "",
      userInfo,
      state1: 0,
      state: 0,
      value1: "",
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
      options1: [
        {
          guid: 1,
          name: "正常"
        },
        {
          guid: 2,
          name: "失效"
        }
        // {
        //   guid: 3,
        //   name: '高级供应商'
        // },
        // {
        //   guid: 2,
        //   name: '中级供应商'
        // },
        // {
        //   guid: 1,
        //   name: '基础供应商'
        // }
      ],
      circleType,
      tipList: [],
      tempList: [],
      tipTopList: [],
      district: {},
      tipType: [],
      scope: 0
    };
  },
  methods: {
    handleSelectionChange(e) {
      this.tempList = [];
      console.log(e);
      for (var i = 0; i < e.length; i++) {
        this.tempList.push(e[i]);
      }
    },
    addPush() {
      this.$router.push("/user/we_business/supply/push_information");
    },
    delItem() {
      if (this.tempList.length == 0) return this.$message.error("请选择推送");
      this.$confirm("是否删除推送", "提示", { type: "warning" })
        .then(() => {
          var list = [];
          for (var i = 0; i < this.tempList.length; i++) {
            list.push(this.tempList[i].guid);
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
            token: this.$getkey(),
            guidList: guid
          };
          this.$ajax(
            `${this.subUrl.bd}/opportunity/delPush`,
            data,
            res => {
              this.$message.success("删除成功");
              this.getList();
            },
            this
          );
        })
        .catch(() => {});
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
      this.guid = guid;
    },
    // toDetail(id, guid) {
    //   this.$router.push(
    //     "/user/we_business/supply/tipDetail?userId=" + id + "&bbsId=" + guid
    //   );
    // },
    toDetail(e) {
      this.$router.push("/user/we_business/supply/push_detail?guid=" + e.guid);
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
      this.state = this.value2;
      this.getList();
    },
    handleChange1() {
      this.state1 = this.value1;
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
    // 搜索框无内容时进行刷新
    getCurrent() {
      if (!this.input) {
        this.bm.pageNo = 1;
        this.getList();
      }
    },
    getList() {
      var data = {
        token: this.$getkey(),
        pageNo: this.bm.pageNo,
        pageSize: this.bm.pageSize
        // type: this.state * 1 == 0 ? "" : this.state,
        // state: this.value1
      };
      if (this.bm.startDate) {
        data.startDate = this.bm.startDate;
        data.endDate = this.bm.endDate;
      }
      if (this.input) data.keyword = this.input;
      if (this.value1) data.state = this.value1;
      var url = this.subUrl.bd + "/opportunity/pushInfoList";
      this.$ajax(
        url,
        data,
        res => {
          this.tipList = [];
          this.bm.rowCount = res.data.rowCount;
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
    this.selectItem(1);
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
.main {
  height: calc(100% - 115px);
  background: white;
  .tableContent {
    height: 100%;
  }
}
.clear {
  clear: both;
}
.tip-detail {
  line-height: 40px;
  border: 2px dashed #ededed;
  padding: 10px;
  margin-bottom: 10px;
}

#new_progress {
}

.content {
  margin: 20px 0;
  background: #fff;
  margin-top: 0;
  padding: 20px 30px;
}

.select-btn {
  margin-left: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  text-align: center;
  padding: 10px;
}

.sure-btn {
  line-height: 40px;
  border: 1px solid #e6e6e6;
}

.sure-btn:hover {
  background: #5881ff !important;
  color: #fff;
}
.select-div {
  background: #fff;
  padding-top: 10px;
  .first1 {
    float: left;
    margin-left: 20px;
    margin-bottom: 10px;
    .el-select {
      width: 280px;
    }
    span {
      margin-right: 27px;
    }
  }
  .first2 {
    float: left;
    margin-left: 20px;
    margin-bottom: 10px;
    span {
      margin-right: 10px;
    }
    .el-input {
      width: 250px;
    }
  }
  .first2_1 {
    float: left;
    margin-left: 20px;
    margin-bottom: 10px;
    span {
      margin-right: 10px;
    }
    .el-input {
      width: 250px;
    }
  }
  .first3 {
    float: left;
    margin-left: 10px;
    margin-top: 10px;
  }
  .first4 {
    float: left;
    margin-left: 20px;
  }
}
</style>
