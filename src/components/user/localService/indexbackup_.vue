<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>本地服务</el-breadcrumb-item>
        <!--<el-breadcrumb-item></el-breadcrumb-item>-->
      </el-breadcrumb>
    </div>
    <el-carousel :interval="5000" arrow="always" height="300">
      <el-carousel-item  v-for="(item,$index) in bannerList" :key="$index">
         <img :src="item.banner" width="100%"  alt="">
      </el-carousel-item>
    </el-carousel> 
    <div style="background:#fff;margin-top:10px;padding:10px;">
      <div class="first1">
          <div>
            <span>选择地区:</span>
            <el-select v-model="value1" :clearable="true" placeholder="请选择" @change="handleChange(2,value1)">
              <el-option
              v-for="item in options1"
              :key="item.guid"
              :label="item.dictDataName"
              :value="item.guid">
              </el-option>
            </el-select>
          </div>
          <div v-if="showDis1">
            <el-select v-model="value2" placeholder="请选择" :clearable="true" @change="handleChange(3,value2)">
              <el-option
              v-for="item in options2"
              :key="item.guid"
              :label="item.dictDataName"
              :value="item.guid">
              </el-option>
            </el-select>
          </div>
          <div v-if="showDis2">
            <el-select v-model="value3" placeholder="请选择" @change="handleChange(4,value3)">
              <el-option
              v-for="item in options3"
              :key="item.guid"
              :label="item.dictDataName"
              :value="item.guid">
              </el-option>
            </el-select>
          </div>
          <div v-if="showDis3">
            <el-select v-model="value4" placeholder="请选择">
              <el-option
              v-for="item in options4"
              :key="item.guid"
              :label="item.dictDataName"
              :value="item.guid">
              </el-option>
            </el-select>
          </div>
          <div v-if="showDis4">
            <el-select v-model="value5" placeholder="请选择">
              <el-option
              v-for="item in options5"
              :key="item.guid"
              :label="item.dictDataName"
              :value="item.guid">
              </el-option>
            </el-select>
          </div>
      </div>
      <div class="first2">
        <div class="flex">
          <span style="margin-left:10px;">选择分类:</span>
          <span v-if="guid==1">
            <el-select v-model="value6" placeholder="请选择" @change="handleChange1(value6)">
              <el-option
              v-for="item in tipType"
              :key="item.dictDataName"
              :label="item.dictDataName"
              :value="item.childDictData">
              </el-option>
            </el-select>
          </span>
        </div>
        <div v-if="showDis5&&guid==1">
          <el-select v-model="value7" placeholder="请选择" @change="handleChange2()">
            <el-option
            v-for="item in options6"
            :key="item.dictDataName"
            :label="item.dictDataName"
            :value="item.guid">
            </el-option>
          </el-select>
        </div>
        <div v-if="guid==2">
          <div class="block">
            <el-cascader
            :clearable="true"
            expand-trigger="click"
            :change-on-select="true"
            :options="tipType"
            v-model="selectedOptions2"
            @change="handleChange01">
            </el-cascader>
          </div>
        </div>
        <div>
          <el-select v-model="value8" :clearable="true" placeholder="请选择" @change="handleChange2()">
            <el-option
            v-for="item in options7"
            :key="item.value"
            :label="item.name"
            :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <!-- 筛选微信 --> 
      <div>
          <span  style="padding:0 10px;">类别</span>
          <el-select v-model="value9" placeholder="请选择" @change="chooseProduct">
            <el-option
            v-for="(item,index) in options8"
            :key="index"
            :label="item.name"
            :value="item.value">
            </el-option>
          </el-select>
      </div>
      <div class="clear"></div>
    </div>
    <!-- 列表 -->
    <div class="businessList">
      <div v-if="tipList.length >0" class="tip-detail" @click="toGqDetail(item.type,item.guid)" v-for="(item,index) in tipList" :key="index">
        <div class="supplyImg">
          <img :src="item.img?item.img:require('../../../assets/images/circle/left-pic.jpg')" width="100%" alt="">
        </div>
        <div class="rightContent">
          <div class="rightTitle1"><span>【<span v-if="item.type ==1">招标</span><span v-if="item.type ==2">采购</span><span v-if="item.type ==3">产品服务</span>】{{item.title}}</span></div>
          <div class="rightTitle2">{{item.organName}}</div>
          <div class="rightTitle3"><span style="color:rgb(255, 180, 84)">【{{Math.ceil(item.day/365)}}年】</span>地址：{{item.address}}</div>
        </div>
        <div class="collectIcon">
              <img @click.stop="collectIt(0,item.guid)" class="cursor" title="添加收藏" v-if="item.isCollection*1==0" style="width: 20px;height: 20px" src="../../../assets/images/circle/toCollect.jpg" alt="">
              <img @click.stop="collectIt(1,item.guid)" class="cursor" title="取消收藏" v-if="item.isCollection*1==1" style="width: 20px;height: 20px" src="../../../assets/images/circle/haveCollect.jpg" alt="">
        </div>

      </div>
      <div class="noMoreDate" v-if="tipList.length == 0">没有更多数据</div>
        <el-pagination
            class="bgwhite"
            style="text-align:right"
            v-if="pageCount>0"
            background
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :page-count="pageCount"
            >
          </el-pagination>
        </div>
    </div>
     
</template>
<script>
// import Swiper from "swiper";
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
      bannerList: [],
      guid: 1,
      titleList: [
        {
          guid: 1,
          name: "八爪圈"
        },
        {
          guid: 2,
          name: "供求市场"
        }
      ],
      pageCount: 1,
      selectedOptions2: [],
      selectedOptions1: "",
      value9: "",
      options8: [
        {
          name: "全部",
          value: ""
        },
        {
          name: "采购",
          value: "1"
        },
        {
          name: "招标",
          value: "2"
        },
        {
          name: "产品/服务",
          value: "3"
        }
      ],
      userInfo,
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
        pageSize: 10,
        rowCount: 0
      },
      data: {},
      options1: [],
      options2: [],
      options3: [],
      options4: [],
      options5: [],
      options6: [],
      options7: [
        {
          name: "综合排序",
          value: 1
        },
        {
          name: "最新排序",
          value: 2
        },
        {
          name: "人气排序",
          value: 3
        }
      ],
      swiperObj: "",
      circleType,
      tipList: [],
      tipTopList: [],
      district: {},
      tipType: [],
      scope: 0
    };
  },
  methods: {
    chooseProduct(e) {
      this.type = e;
      this.bm.pageNo = 1;
      this.tipList = [];
      this.getList();
    },
    collectIt(type, guid) {
      var url =
        type * 1 == 0 ? "/market/collection" : "/market/cancelCollection";
      var data = {
        token: this.$getkey(),
        guid: guid
      };
      if (type * 1 == 0) {
        data.type = 2;
      }
      this.$ajax(
        `${this.subUrl.bd}` + url,
        data,
        res => {
          this.$message.success(type * 1 == 0 ? "已收藏" : "已取消收藏");
          this.getList();
        },
        this
      );
    },
    selectItem(guid) {
      this.selectedOptions2 = [];
      this.guid = guid;
      this.scope = 0;
      this.value1 = "";
      this.showDis1 = "";
      this.value8 = "";
      this.value6 = "";
      this.value7 = "";
      this.selectedOptions1 = "";
      this.getbbsType();
      this.getList();
    },
    toDetail(id, guid) {
      this.$router.push(
        "/user/local_service/tipDetail?userId=" + id + "&bbsId=" + guid
      );
    },
    toUserDetail(id) {
      this.$router.push("/user/local_service/userInfo?guid=" + id);
    },
    toGqDetail(type, id) {
      if (type * 1 == 3) {
        this.$router.push(
          "/user/local_service/proService?type=" + type + "&guid=" + id
        );
        return;
      } else {
        this.$router.push(
          "/user/local_service/gjDetail?type=" + type + "&guid=" + id
        );
      }
    },
    handleChange(type, guid) {
      this.scope = type - 1;
      this.data.scopeValue = guid;
      this.handleChange2();
      if ((type == 2 || type == 3) && !guid) {
        if (type == 2) {
          this.value2 = "";
          this.options2 = [];
        }
        return;
      }
      this.getDistrict(type, guid);
    },
    handleChange1() {
      this.options6 = this.value6;
      this.showDis5 = this.value6 != "" ? true : false;
      this.value7 = "";
    },
    handleChange2() {
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
    getDistrict(type, index) {
      var data = {
        id: index
      };
      this.$ajax(
        `${this.subUrl.user}/comm/getDistrictList`,
        data,
        res => {
          if (res.data.length > 0) {
            switch (type) {
              case 1:
                this.options1 = res.data;
                break;
              case 2:
                this.options2 = res.data;
                this.showDis1 = true;
                break;
              case 3:
                this.options3 = res.data;
                this.showDis2 = true;
                break;
              case 4:
                this.options4 = res.data;
                this.showDis3 = true;
                break;
              case 5:
                this.options5 = res.data;
                this.showDis4 = true;
                break;
            }
          } else {
            this.getList();
          }
        },
        this
      );
    },
    getBanner() {
      this.$ajax(
        `${this.subUrl.bd}/market/marketIndexBanner`,
        {},
        res => {
          this.bannerList = res.data;
        },
        this
      );
    },
    handleChange01(value) {
      console.log(value);
      this.selectedOptions1 = value[1];
      this.getList();
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
        circleType: this.circleType
      };
      if (this.value8 != 0 && this.guid == 1) {
        data.sortType = this.value8;
      }
      if (this.value8 != 0 && this.guid == 2) {
        data.sortRule = this.value8;
      }
      if (this.scope != 0) {
        data.scope = this.scope + 2;
        data.scopeValue = this.data.scopeValue;
      }
      if (this.guid * 1 == 2 && this.selectedOptions1 != "") {
        data.classType = 2;
        data.classId = this.selectedOptions1;
      }
      if (this.scope != 0) {
        data.positionCondition = this.scope + 2;
        data.scopeValue = this.data.scopeValue;
      }
      if (this.value6 != "") {
        data.bbsType =
          this.value7 && this.value7 != "" ? this.value7 : this.value6;
      }
      if (this.type) data.type = this.type;
      // 设置发布的行业类型
      if (this.selectedOptions2.length == 0) {
        delete data.classType;
        delete data.classId;
      } else if (this.selectedOptions2.length == 1) {
        data.classType = 1;
        data.classId = this.selectedOptions2[0];
      } else {
        data.classType = 2;
        data.classId = this.selectedOptions2[1];
      }
      // 此时是删除代码 删除选中的省市 片区

      if (!this.value2 && this.value1) {
        data.positionCondition = 3;
        data.scope = 3;
        data.scopeValue = this.value1;
      } else if (!this.value2 && !this.value1) {
        delete data.positionCondition;
        delete data.scope;
        delete data.scopeValue;
      }
      var url =
        this.guid == 1
          ? this.subUrl.sc + "/bbs/queryBycircleType"
          : this.subUrl.bd + "/market/marketIndex";
      if (!this.value1) {
        delete data.positionCondition;
        delete data.scope;
        delete data.scopeValue;
      }
      this.$ajax(
        url,
        data,
        res => {
          this.tipList = [];
          this.pageCount = res.data.pageCount * 1;
          this.bm.rowCount =
            this.guid == 1 ? res.data.pagination.rowCount : res.data.rowCount;
          this.tipTopList = this.guid == 1 ? res.data.bbsTop : "";
          this.tipList =
            this.guid == 1 ? res.data.pagination.list : res.data.list;
        },
        this
      );
    }
  },
  mounted() {
    // 任务统计
    // setTimeout(function() {
    //   this.swiperObj = new Swiper("#swiper", {
    //     loop: true,
    //     pagination: ".swiper-pagination",
    //     autoplay: 2000,
    //     paginationClickable: true
    //   });
    // }, 100);
    this.getBanner();
    this.selectItem(2);
    this.getbbsType();
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getDistrict(1, 33);
    // this.circleType
  }
};
</script>
<style lang="scss" scoped>
.businessList {
  background: #fff;
  padding: 0 10px;
  .tip-detail {
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
.tip-detail {
  border: 1px dashed #ddd;
  // padding: 10px;
  // margin-bottom: 10px;
}

#new_progress {
  padding-left: 300px;
  padding-right: 40px;
  height: 100%;
  overflow: scroll;
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
.first1 {
  div {
    float: left;
  }
  span {
    // display: inline-block;
    float: left;
    margin-right: 10px;
    line-height: 40px;
  }
}
.first2 {
  div {
    float: left;
  }
  span {
    // display: inline-block;
    float: left;
    margin-right: 10px;
    line-height: 40px;
  }
}
</style>
