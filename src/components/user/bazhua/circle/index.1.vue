<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/user/we_business/bazhua/circle' }">我的圈子</el-breadcrumb-item>
        <!--<el-breadcrumb-item></el-breadcrumb-item>-->
      </el-breadcrumb>
    </div>
    <div style="height:100%;overflow:auto">
    <el-col class="content">
      <el-col class="titleSet" v-for="(item,index) in tipTopList" :key="index" @click.native="toDetail(item.userId,item.guid)"
              style="line-height: 40px;border-bottom: 1px dashed #ededed;cursor: pointer" :span="24">
        <el-col :span="4">【{{item.typeName}}】</el-col>
        <el-col :span="8">{{item.title}}</el-col>
        <el-col :span="6"><span>置顶</span></el-col>
      </el-col>
      <el-col class="titleSet"  :span="24" style="margin-top: 10px">
        <el-col :span="18">
          <el-col :span="4">选择地区:</el-col>
          <el-col :span="4" style="padding: 0 10px;">
            <template>
              <el-select v-model="value1" placeholder="请选择" :clearable="true" @change="handleChange(2,value1)">
                <el-option
                  v-for="item in options1"
                  :key="item.guid"
                  :label="item.dictDataName"
                  :value="item.guid">
                </el-option>
              </el-select>
            </template>
          </el-col>
          <el-col :span="4" style="padding: 0 10px;" :clearable="true" v-if="showDis1">
            <template>
              <el-select v-model="value2" :clearable="true"  placeholder="请选择" @change="handleChange(3,value2)">
                <el-option
                  v-for="item in options2"
                  :key="item.guid"
                  :label="item.dictDataName"
                  :value="item.guid">
                </el-option>
              </el-select>
            </template>
          </el-col>
          <el-col :span="4" style="padding: 0 10px;" v-if="showDis2">
            <template>
              <el-select  v-model="value3" :clearable="true" placeholder="请选择" @change="handleChange(4,value3)">
                <el-option
                  v-for="item in options3"
                  :key="item.guid"
                  :label="item.dictDataName"
                  :value="item.guid">
                </el-option>
              </el-select>
            </template>
          </el-col>
          <el-col :span="4" style="padding: 0 10px;" v-if="showDis3">
            <template>
              <el-select v-model="value4" :clearable="true"  placeholder="请选择" @change="handleChange(5,value4)">
                <el-option
                  v-for="item in options4"
                  :key="item.guid"
                  :label="item.dictDataName"
                  :value="item.guid">
                </el-option>
              </el-select>
            </template>
          </el-col>
          <el-col :span="4" :clearable="true" style="padding: 0 10px;" v-if="showDis4">
            <template>
              <el-select v-model="value5"  placeholder="请选择">
                <el-option
                  v-for="item in options5"
                  :key="item.guid"
                  :label="item.dictDataName"
                  :value="item.guid">
                </el-option>
              </el-select>
            </template>
          </el-col>
        </el-col>
      </el-col>
      <el-col class="titleSet" :span="24" style="margin: 10px 0">
        <el-col :span="18">
          <el-col :span="4">选择分类:</el-col>
          <el-col :span="8" style="padding: 0 10px;">
            <template>
              <!-- <el-select v-model="value6" placeholder="请选择" @change="handleChange1(value6)" >
                <el-option
                  v-for="item in tipType"
                  :key="item.dictDataName"
                  :label="item.dictDataName"
                  :value="item.childDictData">
                </el-option>
              </el-select> -->
              <!-- 级联筛选 -->
              <el-cascader
                @change="changeList"
                :clearable="true"
                v-model="value6" 
                :options="tipType"
                :props='props'
                change-on-select
              >
              </el-cascader>

            </template>
          </el-col>
          <el-col :span="4" v-if="showDis5" style="padding: 0 10px;">
            <template>
              <el-select  v-model="value7" placeholder="请选择" @change="handleChange2()">
                <el-option
                  v-for="item in options6"
                  :key="item.dictDataName"
                  :label="item.dictDataName"
                  :value="item.guid">
                </el-option>
              </el-select>
            </template>
          </el-col>
        </el-col>
        <el-col :span="24" style="margin: 10px 0">
          <el-col :span="18">
            <el-col :span="4">综合排序:</el-col>
            <el-col :span="4" style="padding: 0 10px;">
              <template>
                <el-select v-model="value8" placeholder="请选择" @change="handleChange2()">
                  <el-option
                    v-for="item in options7"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-col>
          </el-col>
        </el-col>
        <!-- 物业公司  主任才有-->
        <el-col :span="24" v-if="userInfo.organType == 3 && userInfo.postType == 2" style="margin: 10px 0">
          <el-col :span="18">
            <el-col :span="4">物业公司:</el-col>
            <el-col :span="4" style="padding: 0 10px;">
              <template>
                <el-select v-model="value9" placeholder="请选择" @change="handleChange3()">
                  <el-option
                    v-for="item in companyList"
                    :key="item.guid"
                    :label="item.organName"
                    :value="item.organId">
                  </el-option>
                </el-select>
              </template>
            </el-col>
          </el-col>
        </el-col>
      </el-col>
      <el-col  v-for="item in tipList" :key="item.guid" class="tip-detail titleSet"
              style="" :span="24">
        <el-col :span="24" style="line-height: 30px;cursor: pointer" @click.native="toDetail(item.userId,item.guid)">
          <!-- <el-col :span="4">【{{item.typeName}}】</el-col> -->
          <el-col :span="18"><span class="font600" style="font-size:14px;">【{{item.typeName}}】{{item.title}}</span></el-col>
          <el-col :span="6"><span style="text-align:right;display:block;color:#999" class="foCo9">{{item.createDate}}</span></el-col>
        </el-col>
        <el-col style="line-height: 30px;background: #f5f5f5;margin: 10px 0;padding: 0 5px">{{item.content.length > 200?item.content.substr(0,200)+'...':item.content}}</el-col>
        <el-col :span="24" style="line-height: 30px">
          <el-col :span="3" @click.native="toUserDetail(item.userId)">
            <div class="flex" style="justify-content:flex-start">
              <img class="mr1" style="width: 30px;height:30px;border-radius: 50%;cursor: pointer" :src="item.headPortrait" alt="">
            {{item.nickname}}
            </div>
            </el-col>
          <!-- <el-col :span="6">{{item.nickname}}</el-col> -->
          <el-col :span="21" style="text-align: right">
            <div class="flex" style="justify-content:flex-end">
            <span>评论：{{item.commentNum}}&nbsp;&nbsp;&nbsp;浏览：{{item.viewNum}}</span>
            </div>
          </el-col>
        </el-col>
      </el-col>
      <el-col class="" >
        <el-pagination
          v-if="bm.rowCount.length > 0"
          background
          style="float:right;"
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
    circleType = 2;
    return {
      companyList: [],
      props: {
        label: "dictDataName",
        value: "index",
        children: "childDictData"
      },
      userInfo,
      value1: "",
      value2: "",
      value3: "",
      value4: "",
      value5: "",
      value6: [],
      value7: "",
      value8: "",
      value9: "",
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
          name: "全部",
          value: 0
        },
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

      circleType,
      tipList: [],
      tipTopList: [],
      district: {},
      tipType: [],
      scope: 0
    };
  },
  methods: {
    toDetail(id, guid) {
      this.$router.push(
        "/user/we_business/bazhua/tipDetail?userId=" + id + "&bbsId=" + guid
      );
    },
    getCompany() {
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/manageMonRep/queryBindOrgan`,
        data,
        res => {
          res.data.unshift({
            organName: "所有物业公司",
            organId: "0"
          });
          this.companyList = res.data;
        }
      );
    },
    toUserDetail(id) {
      this.$router.push("/bazhua/userInfo1?guid=" + id);
    },
    handleChange(type, guid) {
      this.value9 = "";
      this.scope = type - 1;
      switch (type) {
        case 1:
          this.value2 = "";
          this.value3 = "";
          this.value4 = "";
          this.options2 = [];
          this.options3 = [];
          this.options4 = [];
          break;
        case 2:
          this.value3 = "";
          this.value4 = "";
          this.value5 = "";
          this.options3 = [];
          this.options4 = [];
          this.options5 = [];
          break;
        case 3:
          this.value4 = "";
          this.value5 = "";
          this.options4 = [];
          this.options5 = [];
          break;
        case 4:
          this.value4 = "";
          this.value5 = "";
          this.options4 = [];
          this.options5 = [];
          break;
        default:
      }
      this.data.scopeValue = guid;
      this.handleChange2();
      console.log(type, guid);
      if (guid) {
        this.getDistrict(type, guid);
      }
    },
    changeList() {
      this.getList();
    },
    // 筛选分了
    handleChange1() {
      this.options6 = this.value6;
      this.showDis5 = this.value6 != "" ? true : false;
      this.value7 = "";
    },
    handleChange2() {
      this.getList();
    },
    handleChange3() {
      this.value1 = "";
      this.value2 = "";
      this.value3 = "";
      this.value4 = "";
      this.data.scope = 6;
      this.data.scopeValue = this.value9;
      this.getList();
    },
    getbbsType() {
      var data = {
        token: this.$getkey(),
        circleType: this.circleType
      };
      this.$ajax(
        `${this.subUrl.sc}/bbs/getBBsType`,
        data,
        res => {
          for (var [index, i] of res.data.entries()) {
            i.index = index;
            for (var [index1, j] of i.childDictData.entries()) {
              j.childDictData = null;
              j.index = index1;
            }
          }
          this.tipType = res.data;
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
            console.log(type);
            switch (type) {
              case 1:
                this.options1 = res.data;
                break;
              case 2:
                console.log(this.options2, res.data, "市区");
                this.options2 = [];
                this.options2 = res.data;
                this.showDis1 = true;
                this.showDis2 = false;
                this.showDis3 = false;
                this.showDis4 = false;
                break;
              case 3:
                this.options3 = [];
                this.options3 = res.data;
                this.showDis2 = true;
                this.showDis3 = false;
                this.showDis4 = false;
                break;
              case 4:
                this.options4 = [];
                this.options4 = res.data;
                this.showDis3 = true;
                this.showDis4 = false;
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
      if (this.value8 != 0) {
        data.sortType = this.value8;
      }
      if (this.scope != 0) {
        data.scope = this.scope;
        data.scopeValue = this.data.scopeValue;
      }
      console.log(this.value6, "参数");
      if (this.value6.length > 1) {
        data.bbsType = this.tipType[this.value6[0]].childDictData[
          this.value6[1]
        ].guid;
      } else if (this.value6.length == 1) {
        data.typePid = this.tipType[this.value6[0]].guid;
      }
      if (this.value1) {
        data.scope = 1;
        data.scopeValue = this.value1;
      } else {
        delete data.scope;
        delete data.scopeValue;
      }
      if (this.value2) {
        data.scope = 2;
        data.scopeValue = this.value2;
      }
      if (this.value3) {
        data.scope = 3;
        data.scopeValue = this.value3;
      }
      if (this.value4) {
        data.scope = 4;
        data.scopeValue = this.value4;
      }

      if (this.value9 != "") {
        data.scope = "6";
        data.scopeValue = this.data.scopeValue;
      }
      if (data.scopeValue == 0) {
        delete data.scopeValue;
      }
      this.$ajax(
        `${this.subUrl.sc}/bbs/queryBycircleType`,
        data,
        res => {
          this.bm.rowCount = res.data.pagination.rowCount;
          this.tipTopList = res.data.bbsTop;
          this.tipList = res.data.pagination.list;
        },
        this
      );
    }
  },
  watch: {
    $route: function() {
      this.getList();
    }
  },
  mounted() {
    // 任务统计
    this.getbbsType();
    // 获取任务类型
    this.getList();
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getDistrict(1, 0);
    if (this.userInfo.organType == 3 && this.userInfo.postType == 2) {
      this.getCompany();
    }
  }
};
</script>
<style lang="scss" scoped>
.tip-detail {
  line-height: 40px;
  border: 1px dashed #ededed;
  padding: 10px;
  margin-bottom: 10px;
}
.titleSet {
  line-height: 40px;
}

.content {
  padding: 20px 30px;
  margin: 20px 0;
  background: #fff;
  overflow: auto;
}
</style>
