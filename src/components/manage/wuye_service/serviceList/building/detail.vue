<template>
  <div class="newRightContent">
    <div class="bgwhite" v-show="showDetail">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-if="userInfo.organType == 3" :to="{path: '/manage/wuye_service' }">物业服务单</el-breadcrumb-item>
            <el-breadcrumb-item class="cursor" @click.native="$back()">特约写字楼</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div> 
        <div class="list noborder" v-if="!sobObj.isRent">
            <div class="list_item flex-row-nowrap bgwhite">
                <div class="flex">
                        <!-- 左1 -->
                    <div class="icon mr3" :style="`background:#ddd`">
                      <img width="100%" height="100%" :src="params.logo" alt="">
                    </div>
                    <!-- 左2 -->
                    <div>
                        <div class="font32 foCo0">{{params.buildingName}}</div>
                        <div class="font24 foCo9">
                            <span>面积：</span>
                            <span>{{info.buildingArea?info.buildingArea + "平方米":"暂无信息"}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="h7 flex pdlr2 qiyong" v-if="buyList[0] && buyList[0].subclass && buyList[0].subclass.length > 0">已启用功能</div>
        <div v-for="(item1,index1) in buyList" :key="index1" v-if="buyList[0] && buyList[0].subclass && buyList[0].subclass.length > 0" style="margin-bottom:.2rem;">
            <div class=" foCo9 flex h9 bgwhite bt bb" @click="setClose1(index1)" style="padding:0 .24rem;">
              <el-button size="small" type="primary">{{item1.typeName}}</el-button>
              <yd-icon name='xia'  v-if="!item1.selected"  custom size='.4rem' color='#999'></yd-icon>
              <yd-icon name='shang' v-else custom size='.4rem' color='#999'></yd-icon>
            </div>
            <div class="list" v-show="!item1.selected" v-for="(item,index) in item1.subclass" :key="index">
              <div class="list_item flex-row-nowrap bgwhite">
                <div class="flex">
                    <!-- 左1 -->
                  <div class="icon mr3" :style="`background:${item.bgColor}`">
                      {{item.typeName?item.typeName[0]:"无"}}
                  </div>
                  <!-- 左2 -->
                  <div>
                    <div class="font32 foCo0">{{item.typeName?item.typeName:"无服务"}}</div>
                  </div>
                </div>
                  <!-- 左4 -->
                  <div class="flex ml2">
                    <div class="flex flex-end"><div class="state" >有效期:{{item.startTime.substr(0,7).replace(/-/g,'/')}}-{{item.endTime.substr(0,7).replace(/-/g,'/')}}</div></div>
                    <div class="mt2 foCo9" ></div>
                  </div>
                </div>
            </div>
          </div>
        
        <div style="padding:.2rem 0 .5rem;">
        <div class="h7 flex pdlr2 qiyong">合作业务类型</div>
          <div v-for="(item1,index1) in list"  :key="index1" v-if="list.length > 0 &&item1.subclass.length>0" style="margin-bottom:.2rem;">
            <div class=" foCo9 flex h9 bgwhite bt bb" @click="setClose(index1)" style="padding:0 .24rem;">
              <span>{{item1.typeName}}</span>
              <yd-icon name='xia'  v-if="!item1.selected"  custom size='.4rem' color='#999'></yd-icon>
              <yd-icon name='shang' v-else custom size='.4rem' color='#999'></yd-icon>
            </div>
            <div class="list" v-show="!item1.selected" v-if="item1 && item1.subclass" v-for="(item,index) in item1.subclass" :key="index">
              <div class="list_item flex-row-nowrap bgwhite">
                <div class="flex">
                    <!-- 左1 -->
                  <div class="icon mr3" v-if="item.typeName" :style="`background:${item.bgColor}`">
                      {{item.typeName[0]}}
                  </div>
                  <!-- 左2 -->
                  <div>
                    <div class="font32 foCo0">{{item.typeName}}</div>
                  </div>
                </div>
                  <!-- 左4 -->
                  <div class="flex ml2" style="align-items:center">
                    <el-button class="state state2" @click="checkDetail(item,index)" 
                    :style="{borderColor:mainColor,color:mainColor,padding:'.1rem .2rem'}">开通</el-button>
                  </div>
                </div>
            </div>
          </div>
          <div class="flex-row bgwhite center jusCenter foCo9 h8" v-if="list.length == 0">暂无数据</div>
      </div>
    </div>
   <Detail v-if="!showDetail" :sobObj='sobObj' @mClose="mClose"></Detail>
  </div>

</template>
<script>
import Detail from "./detail_value";
var params = {};
export default {
  components: {
    Detail
  },
  data() {
    params = this.$route.query;
    let userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    let organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[userInfo.organType];
    return {
      showPay: true,
      guid: "",
      userInfo,
      organInfo,
      list: [],
      buyList: [],
      params,
      info: {},
      showDetail: true,
      accessObj: {},
      sobObj: {}
    };
  },
  methods: {
    mClose(e) {
      // 数据存不存在都需要将子组件隐藏
      this.showDetail = true;
      // 如果数据存在则执行操作
      if (e) {
        this.getList();
      }
    },
    randomColor: function() {
      var i = Math.round(Math.random() * 4);
      var colorArr = ["#3eb7e6", "#62c88c", "#fab23e", "#fa697c", "#adb8c0"];
      return colorArr[i];
    },

    setClose(e) {
      for (let [i, val] of this.list.entries()) {
        if (i == e) {
          if (val.selected) {
            this.$set(this.list[i], "selected", false);
          } else {
            this.$set(this.list[i], "selected", true);
          }
        }
      }
    },
    setClose1(e) {
      for (let [i, val] of this.buyList.entries()) {
        if (i == e) {
          if (val.selected) {
            this.$set(this.buyList[i], "selected", false);
          } else {
            this.$set(this.buyList[i], "selected", true);
          }
        }
      }
      this.buyList = JSON.parse(JSON.stringify(this.buyList));
    },
    checkDetail(e, index) {
      this.sobObj = e;
      this.showDetail = false;
    },
    getList() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        buildingId: params.buildingId
      };
      this.$ajax(
        `${this.subUrl.activity}/sob/buildingSobList`,
        data,
        res => {
          for (var val of res.data.sobInfoList) {
            for (var val1 of val.subclass) {
              val1.bgColor = this.randomColor();
            }
          }
          this.info = res.data.building;
          this.list = res.data.sobInfoList;
          for (var val of res.data.sobDetails) {
            val.bgColor = this.randomColor();
          }
          this.buyList[0] = {
            typeName: "展开/隐藏"
          };
          res.data.sobDetails = res.data.sobDetails ? res.data.sobDetails : [];
          this.buyList[0].subclass = res.data.sobDetails;
        },
        this
      );
    }
  },
  mounted() {
    this.getList();
  }
};
</script>
<style scoped>
.newRightContent {
  overflow: auto;
}
.list {
  background: #fff;
  border-bottom: 1px solid #ddd;
  /* border-top: 1px solid #ddd; */
  /* margin-top: 20px; */
}
.list.noborder {
  border-top: 0;
}
.list_item {
  margin-left: 0.45rem;
  padding: 0.2rem 0.3rem 0.2rem 0;
  border-bottom: 1px solid #ddd;
  height: 100px;
}
.flex_item .flex {
  align-items: center;
}
.qiyong {
  line-height: 50px;
  padding: 0 20px;
}
.list_item .flex > div {
  display: flex;
  justify-content: center;
  flex-flow: column wrap;
}
.list_item:last-child {
  margin-bottom: -1px;
}
.list_item .icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  text-align: center;
  line-height: 0.8rem;
  font-size: 0.4rem;
  color: #fff;
  margin-right: 20px;
}
</style>


