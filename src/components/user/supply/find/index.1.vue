<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>供求市场</el-breadcrumb-item>
        <!--<el-breadcrumb-item></el-breadcrumb-item>-->
      </el-breadcrumb>
    </div>
    <!--<el-carousel :interval="5000" arrow="always" height="300">-->
      <!--<el-carousel-item  v-for="(item,$index) in bannerList" :key="$index">-->
         <!--<img :src="item.banner" width="100%"  alt="">-->
      <!--</el-carousel-item>-->
    <!--</el-carousel>-->
    <!-- <div class="swiper-container" id="swiper" style="margin-top: 0.2rem;width:100%">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item,$index) in bannerList">
          <a>
            <figure class="wp-avatar banner">
              <img v-cloak style="width:100%;height:100%;position:relative;" :src="item.banner"/>
            </figure>
          </a>
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div> -->
    <div style="background:#fff;margin-top:10px;padding:10px 30px;">
      <div class="first1">
          <div>
            <span>选择地区:</span>
            <el-select v-model="value1" placeholder="请选择" @change="handleChange(2,value1)">
              <el-option
              v-for="item in options1"
              :key="item.guid"
              :label="item.dictDataName"
              :value="item.guid">
              </el-option>
            </el-select>
          </div>
          <div v-if="showDis1">
            <el-select v-model="value2" placeholder="请选择" @change="handleChange(3,value2)">
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
        <div>
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
            expand-trigger="hover"
            :options="tipType"
            v-model="selectedOptions2"
            @change="handleChange01">
            </el-cascader>
          </div>
        </div>
        <div>
          <el-select v-model="value8" placeholder="请选择" @change="handleChange2()">
            <el-option
            v-for="item in options7"
            :key="item.value"
            :label="item.name"
            :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="clear"></div>
    </div>
    <el-col class="content" style="padding-top:0;margin-top:0;">
      <el-col v-for="item in tipList" :key="item.guid" class="tip-detail"
              style="" :span="24">
        <el-col v-if="guid==1">
          <el-col :span="24" style="line-height: 30px;cursor: pointer" @click.native="toDetail(item.userId,item.guid)">
            <el-col :span="4">【{{item.typeName}}】</el-col>
            <el-col :span="8">{{item.title}}</el-col>
            <el-col :span="6">{{item.createDate}}</el-col>
          </el-col>
          <el-col style="line-height: 30px;background: #f5f5f5;margin: 10px 0;padding: 0 5px">{{item.content}}</el-col>
          <el-col :span="24" style="line-height: 30px">
            <el-col :span="3" @click.native="toUserDetail(item.userId)"><img
              style="width: 30%;border-radius: 50%;cursor: pointer;" :src="item.headPortrait" alt=""></el-col>
            <el-col :span="6">{{item.nickname}}</el-col>
            <el-col :span="15" style="text-align: right">评论：{{item.commentNum}}&nbsp;&nbsp;&nbsp;浏览：{{item.viewNum}}
            </el-col>
          </el-col>
        </el-col>
        <el-col v-if="guid==2">
          <el-col :span="3" style="text-align:center;">
            <img style="width: 90px;height: 100px" src="../../../../assets/images/circle/left-pic.jpg" alt="">
          </el-col>
          <el-col :span="1">
           &nbsp;
          </el-col>
          <el-col :span="8" @click.native="toGqDetail(item.type,item.guid)" style="cursor:pointer;line-height: 25px;border-right: 1px solid #f1f1f1">
            <el-col v-if="item.type*1==1" style="font-weight: 600">[招标]{{item.title}}</el-col>
            <el-col v-if="item.type*1==2" style="font-weight: 600">[采购]{{item.title}}</el-col>
            <el-col v-if="item.type*1==3" style="font-weight: 600">[产品服务]{{item.title}}</el-col>
            <el-col>{{item.organName}}</el-col>
            <el-col><span style="color: rgb(255, 180, 84);background: rgb(255, 231, 200);">{{item.day/365}}年</span></el-col>
            <el-col>{{item.address}}</el-col>
          </el-col>
          <el-col :span=3>
            &nbsp;
          </el-col>
          <el-col :span=6>
            <el-col>&nbsp;</el-col>
            <el-col style="cursor: pointer;text-align:right;margin-left:40px;">
              <img @click="collectIt(0,item.type,item.guid)" v-if="item.isCollection*1==0" style="width: 20px;height: 20px" src="../../../../assets/images/circle/toCollect.jpg" alt="">
              <img @click="collectIt(1,item.type,item.guid)" v-if="item.isCollection*1==1" style="width: 20px;height: 20px" src="../../../../assets/images/circle/haveCollect.jpg" alt="">
            </el-col>
            <el-col></el-col>
            <el-col></el-col>
          </el-col>
        </el-col>
      </el-col>
      <el-col>
        <el-pagination
          v-if="bm.rowCount"
          background
          style="float:right;"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="5"
          :total="bm.rowCount*1">
        </el-pagination>
        <div style="clear:both"></div>
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
import Swiper from "swiper";
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
      selectedOptions2: [],
      selectedOptions1: "",
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
        pageSize: 5,
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
          value: 0
        },
        {
          name: "最新排序",
          value: 1
        },
        {
          name: "人气排序",
          value: 2
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
    asdqwe() {
      document.execCommand("print");
    },
    collectIt(type, type1, guid) {
      var url =
        type * 1 == 0 ? "/market/collection" : "/market/cancelCollection";
      var data = {
        token: this.$getkey(),
        guid: guid
      };
      if (type * 1 == 0) {
        data.type = type1;
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
        "/user/we_business/supply/tipDetail?userId=" + id + "&bbsId=" + guid
      );
    },
    toUserDetail(id) {
      this.$router.push("/user/we_business/supply/userInfo?guid=" + id);
    },
    toGqDetail(type, id) {
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
    handleChange(type, guid) {
      this.scope = type - 1;
      this.data.scopeValue = guid;
      this.handleChange2();
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
      var url =
        this.guid == 1
          ? this.subUrl.sc + "/bbs/queryBycircleType"
          : this.subUrl.bd + "/market/marketIndex";
      this.$ajax(
        url,
        data,
        res => {
          this.tipList = [];
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
    setTimeout(function() {
      this.swiperObj = new Swiper("#swiper", {
        loop: true,
        pagination: ".swiper-pagination",
        autoplay: 2000,
        paginationClickable: true
      });
    }, 100);
    this.getBanner();
    this.selectItem(2);
    this.getbbsType();
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getDistrict(1, 33);
    // this.circleType
    console.log(1);
  }
};
</script>
<style lang="scss" scoped>
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
  height: auto;
}

.content {
  padding: 20px 30px;
  margin: 20px 0;
  background: #fff;
  height: 850px;
  padding-bottom: 20px;
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

