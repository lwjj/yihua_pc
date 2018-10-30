<template>
  <!-- 物业管理 -->
  <div id='manage'>
    <!-- 头部 -->
    <div class="all_header">
      <!-- 搜索栏 -->
      <!-- <el-autocomplete
        class="inline-input"
        placeholder="搜索内容"
      ></el-autocomplete> -->
    </div>
    <!-- 物业管理二级菜单 -->
    <div class="submenu" v-if="userInfo.organType == 3">
      <router-link :to="item.path?item.path:''" class="item" v-for="(item,index) in rootList" :key="index">  
        <div class="menu">
          <div class="sub_icon" :style="{background:getRandomColor()}">
              <img v-if="item.icon" :src="item.icon" alt="">
              <div v-else>{{item.name[0]}}</div>
          </div>
          <el-badge is-dot :hidden='item.isHide' class="item">
            <div class="text">{{item.name}}</div>
          </el-badge>
        </div>
      </router-link>
    </div>
    <!-- 其余的 -->
    <div class="submenu" v-if="userInfo.organType == 1">
      <router-link :to="item.path?item.path:''" class="item" v-for="(item,index) in rootList" :key="index">  
        <div class="menu">
          <div class="sub_icon">
            <img :src="item.icon" alt="">
          </div>
          <el-badge is-dot :hidden='item.isHide' class="item">
            <div class="text">{{item.name}}</div>
          </el-badge>
        </div>
      </router-link>
    </div> 
    <div class="mainContent">
      <router-view :rootList='rootList1'></router-view>
    </div>
  </div>
</template>
<script>
import pathObj from "./router";
export default {
  name: "",
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    return {
      rootList1: [],
      fuColor: ["#3eb7e6", "#62c88c", "#fab23e", "#fa697c", "#adb8c0"],
      rootList: [
        {
          guid: "383949242667892736",
          pid: "383948932188733440",
          organType: 1,
          name: "物业服务",
          functionUrl: "/",
          isHide: true,
          icon:
            "http://oysfye6yt.bkt.clouddn.com/%E7%89%A9%E4%B8%9A%E6%9C%8D%E5%8A%A1%E5%8D%95.png",
          sort: 1,
          isEnabled: 1,
          path: "/manage/wuye_service",
          depth: 2,
          checked: null,
          subclass: []
        }
      ]
    };
  },
  watch: {
    $route: function() {
      this.getUserRoot();
    },
    rootList: function(a) {}
  },
  methods: {
    getRandomColor() {
      this.index = this.index >= 0 ? ++this.index : 0;
      if (this.index >= 5) this.index = 0;
      return this.fuColor[this.index];
    },
    getUserRoot() {
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/user/getPermissions`,
        data,
        res => {
          this.rootList1 = res.data;
          this.rootList = [this.rootList[0]];
          if (res.data.propertyManagement) {
            var arr = res.data.propertyManagement.subclass;
            for (var val of arr) {
              val.path = pathObj[val.name];
              // val.isHide = true;
              if (val.name == "物业服务") {
                this.rootList1 = val.subclass;
              }
              val.isHide = true;
            }
            if (this.userInfo.organType == 3) {
              this.rootList = this.rootList.concat(arr);
            } else {
            }
          }
          console.log(this.$getkey(),this.userInfo.organType)
          this.$getMessage(res => {
            console.log('xxxxxxxx,执行成功')
            for (var v of this.rootList) {
              switch (v.name) {
                case "物业服务":
                  if (this.service) {
                    this.$set(this.rootList[0], "isHide", true);
                  } else {
                    this.$set(this.rootList[0], "isHide", false);
                  }
                  break;
                case "品质管理":
                  var num =
                    res.data.proManageMr.emergencyNum * 1 +
                    res.data.proManageMr.examineNum * 1 +
                    res.data.proManageMr.meetingNum * 1;
                  if (num > 0) {
                    this.$set(this.rootList[1], "isHide", false);
                  } else {
                    this.$set(this.rootList[1], "isHide", true);
                  }
                  break;
                case "工作管理":
                  var num =
                    res.data.proManageMr.workReportNum * 1 +
                    res.data.proManageMr.otherReportNum * 1 +
                    res.data.proManageMr.manageReportNum * 1 +
                    res.data.proManageMr.otherReportNum * 1 +
                    res.data.proManageMr.caaNum * 1 +
                    res.data.proManageMr.manageReportNum * 1;
                  if (num > 0) {
                    this.$set(this.rootList[2], "isHide", false);
                  } else {
                    this.$set(this.rootList[2], "isHide", true);
                  }
                  break;
                case "楼宇信息":
                  var num =
                    res.data.proManageMr.proRelationNum * 1 +
                    res.data.proManageMr.ownersRelationNum * 1 +
                    res.data.proManageMr.auditNum * 1;
                  if (num > 0) {
                    this.$set(this.rootList[3], "isHide", false);
                  } else {
                    this.$set(this.rootList[3], "isHide", true);
                  }
                  break;
                default:
                  break;
              }
            }
            for (var [index, i] of this.rootList.entries()) {
            }
            this.rootList = JSON.parse(JSON.stringify(this.rootList));
            if (this.userInfo.organType == 1) {
              if (this.rootList.length > 0) {
                this.$set(this.rootList[0], "isHide", this.service);
              }
            }
            console.log(this.rootList,'rootList----------------xxxxxxxxxxxx')
          }, this);
        },
        this
      );
    }
  },
  beforeCreate() { 
    this.$store.commit("setActivemenu", 3);
  },
  mounted() {
    this.index = 0;
  console.log('mounted----------------xxxxxxxxxxxx')

    this.getUserRoot();
  }
};
</script>
<style lang="scss" scoped>
#manage {
  height: 100%;
  background: #f2f2f7;
  // 第二级内容
  .submenu {
    float: left;
    overflow-x: hidden;
    width: 260px;
    height: 100%;
    position: absolute;
    background: #fff;
    border: 1px solid #f3f3f7;
    // padding-bottom: 200px;
    .menu {
      height: 65px;
      box-sizing: border-box;
      // border: 1px solid #e7e7e7;
      .sub_icon {
        width: 35px;
        height: 35px;
        margin: 15px;
        float: left;
        overflow: hidden;
        border-radius: 50%;
        background: #fff;
        text-align: center;
        line-height: 35px;
        font-size: 20px;
        color: #fff;
        font-weight: 600;
        img {
          width: 100%;
          height: 100%;
          display: inline-block;
          border-radius: 50%;
        }
      }
      .text {
        line-height: 65px;
      }
    }
  }
}

// 第三级内容
.mainContent {
  width: 100%;
  height: 100%;
  overflow: hidden;
  float: left;
}

// 路由激活
.router-link-active {
  .menu {
    // background: #f3f3f3;
    background: #f2f2f7;
  }
}
</style>
