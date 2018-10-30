<template>
  <div class="newRightContent">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>供求市场</el-breadcrumb-item>
      </el-breadcrumb>
    </div> 
    <div class="layout">
      <el-carousel :interval="5000" arrow="always" height="300">
        <el-carousel-item  v-for="(item,$index) in bannerList" :key="$index">
          <img :src="item.banner" width="100%"  alt="">
        </el-carousel-item>
      </el-carousel> 
      <div style="background:#fff;margin-top:10px;padding:10px;">
          <div class="first1">
          <div><span>选择地区：</span></div>
          <div> 
            <el-select v-model="value1" :clearable="true" placeholder="请选择区县" @change="handleChange(2,value1)">
              <el-option
              v-for="item in options1"
              :key="item.guid"
              :label="item.dictDataName"
              :value="item.guid">
              </el-option>
            </el-select>
          </div>
          <div v-if="showDis1">
            <el-select v-model="value2" :clearable="true" placeholder="请选择片区" @change="handleChange(3,value2)">
              <el-option
              v-for="item in options2"
              :key="item.guid"
              :label="item.dictDataName"
              :value="item.guid">
              </el-option>
            </el-select>
          </div> 
      </div>
      <div class="first2">
          <div><span style="margin:0">选择分类：</span></div> 
          <div v-if="guid==2">
            <div class="block">
              <el-cascader
                :clearable="true"
                :change-on-select="true"
                expand-trigger="click"
                :options="tipType"
                v-model="selectedOptions2"
                @change="handleChange01">
              </el-cascader>
            </div>
          </div>
          <div>
            <span>排序：</span>
            <el-select v-model="value8" :clearable="true" placeholder="请选择排序" @change="handleChange2()">
              <el-option
              v-for="item in options7"
              :key="item.value"
              :label="item.name"
              :value="item.value">
              </el-option>
            </el-select>
          </div>
          <!-- 筛选微信 -->
          <div>
              <span style="padding:0 10px;">类别：</span>
              <el-select v-model="value9" placeholder="请选择类别" @change="chooseProduct">
                <el-option
                v-for="(item,index) in options8"
                :key="index"
                :label="item.name"
                :value="item.value">
                </el-option>
              </el-select>
          </div>
        </div>  
      </div>
       <!-- 列表 -->
      <div class="businessList">
        <el-table
          :data="tipList"
          height="100%"
          style="width: 100%"
          >
          <el-table-column
            fixed
            prop="typeName"
            width="100"
            label="类型"
          >
          </el-table-column>
          <el-table-column
            fixed
            prop="title"
            show-overflow-tooltip 
            label="标题"
          >
          </el-table-column>
          <el-table-column
            prop="organName"
            show-overflow-tooltip
            label="公司名称"
          >
          </el-table-column>
          <el-table-column
            prop="address"
            show-overflow-tooltip
            label="地址"
          >
          </el-table-column> 
          <el-table-column
            fixed="right"
            label="操作"
          >
            <template slot-scope="scope">
              <!--@click="toGqDetail(scope.type,scope.guid)"-->
              <el-button
                @click="toGqDetail(scope.row)"
                type="text"
                size="small">
                详情
              </el-button>
              <!--@click.stop="collectIt(0,scope.guid,scope.type)"-->
              <el-button
                v-if="scope.row.isCollection==0"
                @click.stop="collectIt(scope.row)"
                type="text"
                size="small">
                收藏
              </el-button>
              <el-button
                v-if="scope.row.isCollection==1"
                @click.stop="collectIt(scope.row)"
                type="text"
                size="small">
                取消收藏
              </el-button>
            </template>
          </el-table-column>
        </el-table> 
      </div>
      <div class="paginationRight" v-if="pageCount>0">
        <el-pagination
          style="text-align:right"
          class="bgwhite" 
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-count="pageCount"
          >
        </el-pagination>
      </div>
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
      userInfo,
      value1: "",
      value2: "",
      value3: "",
      value4: "",
      value5: "",
      value6: "",
      value7: "",
      value8: "",
      scopeValue: "",
      positionCondition: "",
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
      scope: 0,
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
      type: ""
    };
  },
  methods: {
    chooseProduct(e) {
      this.type = e;
      this.bm.pageNo = 1;
      this.tipList = [];
      this.getList();
    },
    // collectIt(type, guid, collectType) {
    collectIt(row) {
      if (row.isCollection == 0) {
        var type = 0;
      } else {
        var type = 1;
      }

      var guid = row.guid;
      var collectType = row.type;
      var url =
        type * 1 == 0 ? "/market/collection" : "/market/cancelCollection";
      var data = {
        token: this.$getkey(),
        guid: guid,
        type: collectType
      };
      // if (type * 1 == 0) {
      //   data.type = 2;
      // }
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
    // toGqDetail(type, id) {
    toGqDetail(row) {
      if (row.type * 1 == 3) {
        this.$router.push(
          "/user/local_service/proService?type=" +
            row.type +
            "&guid=" +
            row.guid
        );
      } else {
        this.$router.push(
          "/user/local_service/gjDetail?type=" + row.type + "&guid=" + row.guid
        );
      }
    },
    handleChange(type, guid) {
      console.log(type, guid);
      this.positionCondition = type + 1;
      this.data.scopeValue = guid;
      this.scopeValue = guid;
      // 当清空数据时显示上一个数据
      if (!guid) {
        switch (Number(type)) {
          case 2:
            this.value2 = "";
            this.showDis1 = false;
            //还原本市筛选
            this.positionCondition = "2";
            this.scopeValue = this.organInfo.city;
            break;
          case 3:
            this.value2 = "";
            this.positionCondition = 3;
            this.scopeValue = this.value1;
            break;
          case 4:
            this.value4 = "";
            this.showDis3 = false;
            this.positionCondition = 2;
            this.scopeValue = this.value2;
            break;
          case 5:
            this.positionCondition = 3;
            this.scopeValue = this.value3;
            break;
          default:
            console.log(type);
            break;
        }
      }
      this.handleChange2();
      if (type != 3) {
        if (type == 2 && !guid) return;
        this.getDistrict(type, guid);
      }
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
        `${this.subUrl.user}/comm/getBanner`,
        { type: 8 },
        res => {
          this.bannerList = res.data;
        },
        this
      );
    },
    handleChange01(value) {
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
        pageSize: this.bm.pageSize
      };
      if (this.value8 != 0 && this.guid == 1) {
        data.sortType = this.value8;
      }
      if (this.value8 != 0 && this.guid == 2) {
        data.sortRule = this.value8;
      }
      if (this.positionCondition)
        data.positionCondition = this.positionCondition;
      if (this.scopeValue) data.scopeValue = this.scopeValue;
      data.scopeValue = this.scopeValue;
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
      var url =
        this.guid == 1
          ? this.subUrl.sc + "/bbs/queryBycircleType"
          : this.subUrl.bd + "/market/marketIndex";
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
          this.tipList.forEach(item => {
            if (item.type == 1) {
              item.typeName = "招标";
            } else if (item.type == 2) {
              item.typeName = "采购";
            } else {
              item.typeName = "产品服务";
            }
          });
        },
        this
      );
    }
  },
  mounted() {
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.positionCondition = 2;
    this.scopeValue = this.organInfo.city;
    this.getBanner();
    this.selectItem(2);
    this.getbbsType();
    this.getDistrict(1, this.organInfo.city);
  }
};
</script>
<style lang="scss" scoped>
.layout {
  position: relative;
  height: 100%;
}
.businessList {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 50px;
  top: 425px;
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
  overflow: auto;
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
  display: flex;
  flex-flow: row nowrap;
  white-space: nowrap;
  align-items: center;
  justify-content: flex-start;
  .el-select {
    margin-right: 20px;
  }
  div {
    margin-right: 10px;
  }
  span {
    line-height: 40px;
    float: none;
  }
}
.first2 {
  display: flex;
  flex-flow: row nowrap;
  white-space: nowrap;
  align-items: center;
  margin-top: 10px;
  justify-content: flex-start;
  overflow: hidden;
  span {
    line-height: 40px;
    float: none;
  }
  div {
    margin-right: 10px;
  }
}
</style>
