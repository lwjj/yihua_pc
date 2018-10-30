<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a @click="goback">返回</a></el-breadcrumb-item>
        <el-breadcrumb-item>采购/招标收藏</el-breadcrumb-item>
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
    <el-col class="content">
      <el-col style="line-height: 36px;margin-bottom: 5px">
        <!--<el-col style="width: 60px">状态</el-col>-->
        <!--<el-col style="width: 150px">-->
          <!--<template>-->
            <!--<el-select v-model="value1" placeholder="请选择" @change="handleChange()">-->
              <!--<el-option-->
                <!--v-for="item in options1"-->
                <!--:key="item.guid"-->
                <!--:label="item.name"-->
                <!--:value="item.guid">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</template>-->
        <!--</el-col>-->
        <el-col style="width: 100px;text-align: right">起止时间</el-col>
        <el-col style="width: 150px;text-align: right">
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            range-separator="至"
            @change="dateChange"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
      </el-col>
      <el-col style="margin-bottom: 5px">
        <el-col :span="6">
          <el-input v-model="input" placeholder="请输入搜索关键字"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button plain @click.native="getList">查询</el-button>
        </el-col>
      </el-col>
      <el-col v-if="tipList.length>0" v-for="item,index in tipList" :key="index" class="tip-detail"
              style="" :span="24">
        <el-col>
          <!--<el-col :span="3">-->
            <!--<img style="width: 90px;height: 100px" src="../../../../assets/images/circle/left-pic.jpg" alt="">-->
          <!--</el-col>-->
          <!--<el-col :span="1">-->
            <!--&nbsp;-->
          <!--</el-col>-->
          <el-col :span="8" @click.native="toGqDetail(2,item.poId)"
                  style="cursor:pointer;border-right: 1px solid #f1f1f1">
            <el-col style="font-weight: 600">[采购]{{item.title}}</el-col>
            <el-col>{{item.address}}</el-col>
            <el-col>{{item.createTime}}</el-col>
          </el-col>
          <el-col :span=3>
            &nbsp;
          </el-col>
          <el-col :span="3">
            <el-col><img src="../../../../assets/images/circle/haveCollect.jpg" alt="">收藏日期</el-col>
            <el-col>{{item.releaseTime}}</el-col>
          </el-col>
          <el-col :span="3">
            &nbsp;
          </el-col>
          <el-col :span="6">
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
      <el-col v-if="tipList.length<=0" style="text-align: center">~没有数据了~</el-col>
      <el-col v-if="tipList.length>0">
        <el-col :span="6" style="cursor: pointer">全选
          <img @click="selectAll(1)" v-if="allSelect" style="width: 20px;height: 20px;margin-bottom: -4px"
               src="../../../../assets/images/circle/select_active.png" alt="">
          <img @click="selectAll(2)" v-if="!allSelect" style="width: 20px;height: 20px;margin-bottom: -4px"
               src="../../../../assets/images/circle/select.png" alt="">
        </el-col>
        <el-col :span="6">
          <el-button type="danger" @click="delItem()">删除</el-button>
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
    goback() {
      this.$router.go(-1);
    },
    delItem() {
      var list = [];
      for (var i = 0; i < this.tipList.length; i++) {
        if (this.tipList[i].select) {
          list.push(this.tipList[i].poId);
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
        guid: guid
      };
      this.$ajax(
        `${this.subUrl.bd}/market/cancelCollection`,
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
        type: 1,
        title: this.input,
        startDate: this.bm.startDate,
        endDate: this.bm.endDate
      };
      var url = this.subUrl.bd + "/market/collectionList";
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
.tip-detail {
  line-height: 40px;
  border: 2px dashed #ededed;
  padding: 10px;
  margin-bottom: 10px;
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
}

.select-btn {
  margin-left: 10px;
  margin-bottom: 10px;
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
</style>
