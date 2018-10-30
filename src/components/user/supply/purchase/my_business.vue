<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native="back">返回</el-breadcrumb-item>
        <el-breadcrumb-item>供求市场</el-breadcrumb-item>
        <!--<el-breadcrumb-item></el-breadcrumb-item>-->
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
        <span>类型</span>
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
        <span>起止时间</span>
        <el-date-picker
        style="width: 300px"
        v-model="dateValue"
        type="daterange"
        range-separator="至"
        @change="dateChange"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="clear"></div>
      <!-- <div class="first3">
        <span>供应商</span>
        <el-select v-model="value1" placeholder="请选择" @change="handleChange()">
          <el-option
          v-for="item in options1"
          :key="item.guid"
          :label="item.name"
          :value="item.guid">
          </el-option>
        </el-select>
      </div> -->
      <div class="first4">
        <el-input v-model="input" placeholder="请输入搜索关键字" style="width:300px;"></el-input>
        <el-button plain @click.native="getList">查询</el-button>
      </div>  
      <div class="first4" style="margin-left:40px;">
        <el-button plain @click.native="toCollection">产品收藏</el-button>
      </div>
      <div class="clear"></div>
    </div>
    <el-col class="content">
      <el-col v-if="tipList.length>0" v-for="(item,index) in tipList" :key="index" class="tip-detail"
              style="" :span="24">
        <el-col>
          <el-col :span="8" @click.native="value2>4?toGqDetail(item.type,item.poId):toGqDetail1(value2,item.guid,item.title,item.state)"
                  style="cursor:pointer;line-height: 25px;border-right: 1px solid #f1f1f1">
            <el-col v-if="value2<5">{{item.title}}</el-col>
            <el-col v-if="value2<5">{{item.createTime}}</el-col>
            <el-col v-if="value2==5" style="font-weight: 600">{{item.organName}}</el-col>
            <el-col v-if="item.type*1==1&&value2==6" style="font-weight: 600">[招标]{{item.title}}</el-col>
            <el-col v-if="item.type*1==2&&value2==6" style="font-weight: 600">[采购]{{item.title}}</el-col>
            <el-col v-if="item.type*1==3&&value2==6" style="font-weight: 600">[产品服务]{{item.title}}</el-col>
            <el-col v-if="value2==5">{{item.organAddress}}</el-col>
            <el-col v-if="value2==5">{{item.createTime}}</el-col>
            <el-col v-if="value2==6&&item.organInfoDto3">{{item.organInfoDto3.organName}}</el-col>
            <el-col v-if="value2==6">{{item.offerTime}}</el-col>
          </el-col>
          <el-col :span=3>
            &nbsp;
          </el-col>
          <el-col :span=3>
           <span v-if="item.state*1!=2" style="border: 1px solid rgb(35, 172, 56);    color: rgb(35, 172, 56);">正常</span>
            <span v-if="item.state*1==2" style="border: 1px solid rgb(35, 172, 56);    color: rgb(35, 172, 56);">失效123</span>
          </el-col>
          <el-col :span=3>
            &nbsp;
          </el-col>
          <el-col :span=6>
            <el-col>&nbsp;</el-col>
            <!--<el-col style="cursor: pointer">-->
              <!--<img @click="collectIt(index)" v-if="item.select" style="width: 20px;height: 20px"-->
                   <!--src="../../../../assets/images/circle/select_active.png" alt="">-->
              <!--<img @click="collectIt(index)" v-if="!item.select" style="width: 20px;height: 20px"-->
                   <!--src="../../../../assets/images/circle/select.png" alt="">-->
            <!--</el-col>-->
            <el-col></el-col>
            <el-col></el-col>
          </el-col>
        </el-col>
      </el-col>
      <el-col v-if="tipList.length<=0" style="text-align: center;padding-bottom:20px;">没有更多数据了!</el-col>
      <el-col v-if="tipList.length>0&&value2>4">
        <el-col :span="6" style="cursor: pointer">全选
          <img @click="selectAll(1)" v-if="allSelect" style="width: 20px;height: 20px;margin-bottom: -4px"
               src="../../../../assets/images/circle/select_active.png" alt="">
          <img @click="selectAll(2)" v-if="!allSelect" style="width: 20px;height: 20px;margin-bottom: -4px"
               src="../../../../assets/images/circle/select.png" alt="">
        </el-col>
        <el-col :span="6">
          <el-button @click="delItem()">删除</el-button>
        </el-col>
      </el-col>
      <el-col v-if="tipList.length>0">
        <el-pagination
          v-if="bm.rowCount"
          background
          style="float:right;"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="5"
          :total="bm.rowCount*1">
        </el-pagination>
        <!--<el-col class="flexRow flexAlignC flexJustE" :span="16">-->
        <!--<el-pagination background :page-size="bm.pageSize" @current-change="handleCurrentChange"-->
        <!--layout="prev, pager, next" :total="bm.rowCount"></el-pagination>-->
        <!---->
        <!--</el-col>-->
      </el-col>
    </el-col>
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
          guid: 1,
          name: "客户预约"
        },
        {
          guid: 2,
          name: "客户询价"
        },
        {
          guid: 3,
          name: "客户邀联"
        },
        {
          guid: 4,
          name: "客户团购"
        },
        {
          guid: 5,
          name: "客户邀标"
        },
        {
          guid: 6,
          name: "报价投标"
        }
      ],
      dateValue: [],
      selectedOptions2: [],
      selectedOptions1: "",
      userInfo,
      state1: 0,
      state: 1,
      value1: "",
      value2: 1,
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
      scope: 0
    };
  },
  methods: {
    toCollection() {
      this.$router.push("/user/we_business/supply/product_collection");
    },
    delItem() {
      var list = [];
      for (var i = 0; i < this.tipList.length; i++) {
        if (this.tipList[i].select) {
          list.push(this.tipList[i].guid);
        }
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
      var url =
        this.value2 * 1 == 6
          ? "/opportunity/delRegister"
          : "/opportunity/delInvitedMark";
      if (this.value2 * 1 < 5) {
        data = {
          token: this.$getkey(),
          guidList: guid
        };
      }
      this.$ajax(
        `${this.subUrl.bd}` + url,
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
      this.guid = guid;
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
      if (this.value2 * 1 < 5) {
        this.$router.push("/user/we_business/supply/level_list?guid=" + id);
      }
      if (type * 1 == 3) {
        this.$router.push(
          "/user/we_business/supply/proService?type=" + type + "&guid=" + id
        );
        return;
      } else {
        this.$router.push(
          "/user/we_business/supply/gjDetail?type=" + type + "&guid=" + id
        );
      }
    },
    toGqDetail1(type, id, title, status) {
      this.$router.push(
        "/user/we_business/supply/level_list?type=" +
          type +
          "&guid=" +
          id +
          "&title=" +
          title +
          "&status=" +
          (status == 2 ? "失效" : "正常")
      );
    },
    handleChange() {
      this.state = this.value2;
      this.getList();
    },
    handleChange1() {
      this.state1 = this.value2;
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
        startTime: this.bm.startDate,
        endTime: this.bm.endDate,
        type: this.value2,
        state: this.state1,
        businessName: this.input
      };
      var url = this.subUrl.bd + "/opportunity/opportunityList";
      if (this.value2 * 1 == 5) {
        url = this.subUrl.bd + "/opportunity/invitedMarkList";
        data = {
          title: this.input,
          token: this.$getkey(),
          pageNo: this.bm.pageNo,
          pageSize: this.bm.pageSize,
          startDate: this.bm.startDate,
          endDate: this.bm.endDate
        };
      } else if (this.value2 * 1 == 6) {
        url = this.subUrl.bd + "/opportunity/myRegisterList";
        data = {
          title: this.input,
          token: this.$getkey(),
          pageNo: this.bm.pageNo,
          pageSize: this.bm.pageSize,
          startDate: this.bm.startDate,
          endDate: this.bm.endDate
        };
      }
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
.clear {
  clear: both;
}
.tip-detail {
  line-height: 40px;
  border: 1px dashed #ddd;
  padding: 10px;
  margin-bottom: 10px;
}

#new_progress {
  padding-left: 300px;
  padding-right: 40px;
  height: auto;
}

.content {
  margin: 20px 0;
  background: #fff;
  margin-top: 0;
  padding: 10px 20px;

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
    span {
      margin-right: 35px;
    }
  }
  .first2 {
    float: left;
    margin-left: 20px;
    margin-bottom: 10px;
    span {
      margin-right: 20px;
    }
  }
  .first3 {
    float: left;
    margin-left: 20px;
    margin-top: 10px;
    span {
      margin-right: 20px;
    }
  }
  .first4 {
    float: left;
    margin-left: 20px;
    margin-top: 10px;
    margin-bottom: 20px;
    .el-input {
      width: 250px;
    }
  }
}
</style>
