<template>
  <!-- 物业管理 -->
  <div id='manage'>
    <!-- 头部 -->
    <div class="all_header">
      <!-- 搜索栏 -->
      <el-autocomplete
        class="inline-input"
        placeholder="搜索内容"
      ></el-autocomplete>
    </div>  
    <!-- 其余的 -->
    <div class="submenu" v-if="userInfo.organType == 1">
      <router-link :to="item.path?item.path:''" class="item" v-for="(item,index) in rootList" :key="index">  
        <div class="menu">
          <div class="sub_icon" :style="{background:getRandomColor()}">
            <img v-if="item.icon" :src="item.icon" alt="">
            <div v-else>{{item.name[1]}}</div>
          </div>
          <div class="text">{{item.name}}</div>
        </div>
      </router-link>
    </div> 
    <div class="mainContent">
      <router-view :rootList='rootList'></router-view>
    </div>
  </div>
</template>
<script>
import pathObj from "./router.js";
export default {
  name: "",
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    return {
      rootList: [],
      fuColor: ["#3eb7e6", "#62c88c", "#fab23e", "#fa697c", "#adb8c0"]
    };
  },
  methods: {
    getRandomColor() {
      return this.fuColor[parseInt(Math.random() * 5)];
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
          console.log(res, "root");
          if (res.data.entService) {
            var arr = res.data.entService.subclass;
            for (var val of arr) {
              val.path = pathObj[val.name];
            }
            console.log(arr);
            this.rootList = arr;
            console.log(this.rootList);
          }
        },
        this
      );
    }
  },

  mounted() {
    this.getUserRoot();
    this.$store.commit("setActivemenu", 4);
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
