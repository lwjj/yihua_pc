<template>
<div class="newRightContent">
  <div v-show="showDetail" class="main">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
            <el-breadcrumb-item>业务设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="">
         <div style="padding:0 0 .5rem;margin-top:-1px" class="border bgwhite">
        <div class="topHeader bgwhite pdlr2 flex-row center flex-end">
          <el-button class="mt1 mb1" icon="el-icon-plus" @click="$router.push('/estate/serviceList/setting/add')" >新增</el-button>
        </div>
        <div v-for="(item1,index1) in list" :key="index1" v-if="item1.subclass.length>0" style="margin-bottom:.2rem;">
          <div class="foCo9 flex h9 bgwhite bt bb" @click="setClose(index1)" style="padding:0 .24rem;">
            <span>{{item1.typeName}}</span>
            <yd-icon name='xia'  v-if="!item1.selected"  custom size='.4rem' color='#999'></yd-icon>
            <yd-icon name='shang' v-else custom size='.4rem' color='#999'></yd-icon>
          </div>
          <div class="list" v-show="!item1.selected" @click="checkDetail(item)" v-for="(item,index) in item1.subclass" :key="index">
            <div class="list_item flex-row-nowrap bgwhite">
              <div class="flex jusB" style="flex:1">
                  <!-- 左1 -->
                <div class="icon mr3" :style="`background:${item.bgColor}`">
                  <div style="text-align:center;float:none;margin-right:10%">
                    {{item.typeName[0]}}
                  </div>  
                </div>
                <!-- 左2 -->
                <div class="flex1">
                  <div class="font32 mr2 foCo0">{{item.typeName}}</div>
                  <div class="font24 foCo9">
                    <span>总额/签约:{{item.amount}}/{{item.num?item.num:0}}</span>
                    <span></span>
                  </div>
                </div>
              </div>
              <div class="flex ml2" >
                <!-- 左3 -->
                <div style="margin-right:.6rem;" class="nowrap">
                  <div class="font36 nowrap" style="color:#f2725e">{{item.cost}}元/月</div>
                  <div class="font24 foCo9"></div>
                </div>
                <!-- 左4 -->
                <div style="width:60px;text-align:left">
                  <!--  0未开发；1未满；2已满 , -->
                  <span class="state state2" v-if="item.status == 0">未开发</span>
                  <span class="state state1" v-if="item.status == 1">未满</span>
                  <span class="state state0" v-if="item.status == 2">已满</span>
                </div>
                <!-- 左5 -->
                <el-button class="mt1 mb1" @click="$router.push('/estate/serviceList/setting/add/'+item.guid)" >编辑</el-button>
                </div>
            </div>

            
				  </div>
        </div>
        <div class="flex-row bgwhite center jusCenter foCo9 h8" v-if="list.length == 0">暂无数据</div>
       </div>
      </div>
  </div>
  <Detail v-if="!showDetail" :accessObj = "accessObj" @mClose="mClose"></Detail>
  </div>
</template>
<script>
import Detail from "./detail";
export default {
  components: {
    Detail
  },
  data() {
    let userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    let organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[userInfo.organType];
    return {
      userInfo,
      organInfo,
      list: [],
      showDetail: true,
      accessObj: {}
    };
  },
  methods: {
    // 查看详情
    mClose() {
      this.showDetail = true;
    },
    checkDetail(e) {
      this.accessObj = e;
      this.showDetail = false;
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
    getList() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/sob/getSetSobList`,
        data,
        res => {
          for (var val of res.data) {
            for (var val1 of val.subclass) {
              val1.bgColor = this.randomColor();
            }
          }
          this.list = res.data;
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
.main {
  height: 100%;
  overflow: auto;
  background: #fff;
}
.newRightContent {
  overflow: auto;
}
.list {
  background: #fff;
  border-bottom: 1px solid #ddd;
}
.list_item {
  margin-left: 0.45rem;
  padding: 0.2rem 0.3rem 0.2rem 0;
  border-bottom: 1px solid #ddd;
}
.list_item:last-child {
  margin-bottom: -1px;
}
.list_item .icon {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  text-align: center;
  line-height: 0.8rem;
  font-size: 0.4rem;
  color: #fff;
}
</style>


