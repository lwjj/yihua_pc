<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item class="cursor" @click.native="back">返回</el-breadcrumb-item>
        <el-breadcrumb-item>我的客户</el-breadcrumb-item>
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
        <el-select v-model="value2" placeholder="请选择" @change="handleChange1()">
          <el-option
          v-for="item in titleList"
          :key="item.guid"
          :label="item.name"
          :value="item.guid">
          </el-option>
        </el-select>
      </div>
      <div class="first2">
        <el-input v-model="input" placeholder="请输入搜索关键字"></el-input>
        <el-button plain @click.native="getList">查询</el-button>
      </div>
      <div class="clear"></div>
      <div class="first2_1">
        <span>供应商</span>
        <el-select v-model="value1" placeholder="请选择" @change="handleChange()">
          <el-option
          v-for="item in options1"
          :key="item.guid"
          :label="item.name"
          :value="item.guid">
          </el-option>
        </el-select>
      </div>
      <div class="clear"></div>
    </div>
    <div class="main">
        <el-table border height="calc(100% - 45px)" :data='tipList' @selection-change='setSelect'>
          <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="机构名称" width="200" prop="organName" show-overflow-tooltip></el-table-column>
            <el-table-column label="机构地址" width="200" prop="organAddress" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户名" width="200" prop="userName" show-overflow-tooltip></el-table-column>
            <el-table-column label="机构年份"  prop="years" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作"  prop="years" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button class="detail" type='primary' @click="toDetail(scope)" size="mini">详情</el-button>
              </template>
            </el-table-column>
        </el-table>
        <div class="elPaginaton" v-if="bm.rowCount*1>0">
          <el-button v-if="value2*1==0" type="danger" size="mini" @click="delItem(1)">加黑</el-button>
          <el-button v-if="value2*1==1" type="danger" size="mini" @click="delItem(0)">移除</el-button>
          <el-button v-if="value2*1==0" type="danger" size="mini" @click="delItem(2)">删除</el-button>
           <el-pagination
            background
            style="float:right;"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :page-size="12"
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
        pageSize: 5,
        rowCount: 0,
        startDate: "",
        endDate: ""
      },
      data: {},
      options1: [
        {
          guid: 0,
          name: "全部供应商"
        },
        {
          guid: 4,
          name: "金牌供应商"
        },
        {
          guid: 3,
          name: "高级供应商"
        },
        {
          guid: 2,
          name: "中级供应商"
        },
        {
          guid: 1,
          name: "基础供应商"
        }
      ],
      circleType,
      tipList: [],
      tipTopList: [],
      district: {},
      tipType: [],
      scope: 0,
      selectList: []
    };
  },
  methods: {
    setSelect(e) {
      this.selectList = e;
    },
    delItem(index) {
      if (this.selectList.length == 0) return this.$message.error("请选择客户");
      let txt = "删除客户";
      if (index == 0) {
        txt = "移除黑名单";
      } else if (index == 1) {
        txt = "加黑客户";
      }
      let arr = [];
      for (let v of this.selectList) {
        arr.push(v.guid);
      }
      console.log(this.selectList.push, this.selectList.join);
      var data = {
        token: this.$getkey(),
        guidList: arr.join(",")
      };
      data.type = index;
      this.$confirm("是否" + txt, "提示", { type: "warning" })
        .then(() => {
          this.$ajax(
            `${this.subUrl.bd}/purchase/delOrblackSupplier`,
            data,
            res => {
              this.$message.success(txt + "成功");
              this.selectList = [];
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
    toDetail({ row, index }) {
      row.titleText = "客户详情";
      localStorage.setItem(
        "libraryList",
        encodeURIComponent(JSON.stringify(row))
      );
      this.$router.push("/user/we_business/supply/supplier_details");
    },
    toUserDetail(id) {
      this.$router.push("/user/we_business/supply/userInfo?guid=" + id);
    },
    toGqDetail(index) {
      this.$router.push("/user/we_business/supply/supplier_details");
      this.tipList[index].titleText = "供应商详情";
      localStorage.setItem(
        "libraryList",
        encodeURIComponent(JSON.stringify(this.tipList[index]))
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
    getList() {
      var data = {
        token: this.$getkey(),
        pageNo: this.bm.pageNo,
        pageSize: this.bm.pageSize,
        type: this.state * 1 == 0 ? "" : this.state,
        state: this.value2,
        businessName: this.input
      };
      var url = this.subUrl.bd + "/opportunity/mySupplierList";
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
  background: #fff;
  padding: 10px;
  height: calc(100% - 110px);
  overflow-y: auto;
  .elPaginaton {
    padding-top: 10px;
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
  padding-left: 300px;
  padding-right: 40px;
}

.content {
  padding: 20px 30px;
  margin: 20px 0;
  background: #fff;
  margin-top: 0;
  padding: 0;
}

.select-btn {
  margin-left: 10px;
  margin-bottom: 10px;
  padding-top: 10px;
  cursor: pointer;
  text-align: center;
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
