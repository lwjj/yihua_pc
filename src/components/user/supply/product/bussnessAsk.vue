<template>
  <div id="new_progress">
    <div class="title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native="back">返回</el-breadcrumb-item>
        <el-breadcrumb-item>商家报价</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main bgwhite">
      <div class="select-div">
        <div class="first1">
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
        <div class="first2">
          <span>关键字</span>
          <el-input v-model="input" @input.native="getCurrentList" placeholder="请输入搜索关键字"></el-input>
          <el-button plain @click.native="getList">查询</el-button>
        </div>
        <div class="clear"></div>
    </div>
    <el-col class="content">
      <el-col v-if="tipList.length>0" v-for="(item,index) in tipList" :key="index" class="tip-detail"
              style="" :span="24">
        <el-col>
          <!--<el-col :span="3">-->
            <!--<img style="width: 90px;height: 100px" src="../../../../assets/images/circle/left-pic.jpg" alt="">-->
          <!--</el-col>-->
          <el-col :span="1">
            &nbsp;
          </el-col>
          <el-col :span="8" @click.native="toGqDetail(item.type,item.guid)"
                  style="cursor:pointer;line-height: 25px;border-right: 1px solid #f1f1f1">
            <el-col v-if="item.type*1==1" style="font-weight: 600">[招标]{{item.title}}</el-col>
            <el-col v-if="item.type*1==2" style="font-weight: 600">[采购]{{item.title}}</el-col>
            <el-col v-if="item.type*1==3" style="font-weight: 600">[产品服务]{{item.title}}</el-col>
            <el-col v-if="item.type*1==1">{{item.type2}}</el-col>
            <el-col v-if="item.type*1==2">{{item.type1}}</el-col>
          </el-col>
          <el-col :span=3>
            &nbsp;
          </el-col>
          <el-col :span=6>
            <el-col>{{item.state}}</el-col>
            <el-col>{{item.startTime}}</el-col>
            <!--<el-col>&nbsp;</el-col>-->
            <!--<el-col style="cursor: pointer">-->
              <!--<img @click="collectIt(index)" v-if="item.select" style="width: 20px;height: 20px"-->
                   <!--src="../../../../assets/images/circle/select_active.png" alt="">-->
              <!--<img @click="collectIt(index)" v-if="!item.select" style="width: 20px;height: 20px"-->
                   <!--src="../../../../assets/images/circle/select.png" alt="">-->
            <!--</el-col>-->
            <!--<el-col></el-col>-->
            <!--<el-col></el-col>-->
          </el-col>
        </el-col>
      </el-col>
      <el-col v-if="tipList.length<=0" style="text-align: center;padding-bottom:20px;">~没有数据了~</el-col>
      
      <el-col v-if="tipList.length>0">
        <el-pagination
          v-if="bm.rowCount>0"
          background
          class="right"
          style="padding-bottom:10px"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="5"
          :total="bm.rowCount*1">
        </el-pagination> 
      </el-col>
    </el-col>
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
          name: "已上线",
          guid: 1
        },
        {
          name: "已下线",
          guid: 2
        },
        {
          name: "审核中",
          guid: 3
        },
        {
          name: "未通过",
          guid: 4
        },
        {
          name: "已删除",
          guid: 5
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
        state: 0,
        token: this.$getkey(),
        guid: guid
      };
      this.$ajax(
        `${this.subUrl.bd}/product/delProduct`,
        data,
        res => {
          this.$message.success("操作成功");
        },
        this
      );
    },
    getCurrentList() {
      if (!this.input) {
        this.getList();
      }
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
      this.$router.push(
        `/user/we_business/supply/bussnessList?guid=${id}&type=${type}`
      );
      // if (type * 1 == 3) {
      //   this.$router.push(
      //     "/user/we_business/supply/proService?type=" + type + "&guid=" + id
      //   );
      //   return;
      // } else {
      //   this.$router.push(
      //     "/user/we_business/supply/gjDetail?type=" + type + "&guid=" + id
      //   );
      // }
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
        startDate: this.bm.startDate,
        endDate: this.bm.endDate,
        title: this.input
      };
      var url = this.subUrl.bd + "/purchase/registerListFather";
      this.$ajax(
        url,
        data,
        res => {
          res.data.list.forEach(element => {
            element.startTime = element.startTime.split(" ")[0];
            if (element.type == 1) {
              element.type2 = "招标";
              element.type1 = "投标";
            } else if (element.type == 2) {
              element.type2 = "采购";
              element.type1 = "报价";
            }
            if (element.state == 0) {
              element.state = "已删除";
            } else if (element.state == 1) {
              element.state = "已上线";
            } else if (element.state == 2) {
              element.state = "已下线";
            } else if (element.state == 3) {
              element.state = "已上线";
            } else if (element.state == 4) {
              element.state = "未通过";
            }
          });
          var list = res.data.list;
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
  overflow: auto;
  height: 100%;
  overflow-x: hidden;
  .content {
    height: calc(100% - 60px);
  }
}
.clear {
  clear: both;
}
.tip-detail {
  line-height: 40px;
  border: 1px dashed #ddd;
  padding: 10px;
  margin-bottom: 10px;
  margin: 0 10px 10px;
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
    span {
      margin-right: 10px;
    }
  }
  .first2 {
    float: left;
    margin-left: 20px;
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
