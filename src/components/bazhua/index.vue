
<template>
  <!-- 个人中心 -->
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
    <div class="submenu">
      <router-link :to="'/bazhua/userInfo?guid='+userInfo.guid">
        <div class="menu new_progress">
          <div class="sub_icon ">
            <img :src="userInfo.headPortrait" alt="">
          </div>
          <div class="text">{{userInfo.nickname}}</div>
        </div>
      </router-link>
      <router-link to="/bazhua/addTip">
        <div class="menu new_progress">
          <div class="sub_icon ">
            <img src="../../assets/images/circle/icon_01.png" alt="">
          </div>
          <div class="text">发布帖子</div>
        </div>
      </router-link>
      <router-link to="/bazhua/circle">
        <div class="menu new_progress">
          <div class="sub_icon ">
            <img src="../../assets/images/circle/icon_01.png" alt="">
          </div>
          <div class="text">八爪圈</div>
        </div>
      </router-link>
      <router-link to="/bazhua/myTip">
        <div class="menu new_progress">
          <div class="sub_icon ">
            <img src="../../assets/images/circle/icon_02.png" alt="">
          </div>
          <div class="text">我的帖子</div>
        </div>
      </router-link>
      <router-link to="/bazhua/myAdd">
        <div class="menu new_progress">
          <div class="sub_icon ">
            <img src="../../assets/images/circle/icon_03.png" alt="">
          </div>
          <div class="text">我的报名</div>
        </div>
      </router-link>
      <router-link to="/bazhua/myComment">
        <div class="menu new_progress">
          <div class="sub_icon ">
            <img src="../../assets/images/circle/icon_04.png" alt="">
          </div>
          <div class="text">我的评论</div>
        </div>
      </router-link>
      <router-link to="/bazhua/myGet">
        <div class="menu new_progress">
          <div class="sub_icon ">
            <img src="../../assets/images/circle/icon_05.png" alt="">
          </div>
          <div class="text">给我回复</div>
        </div>
      </router-link>
      <router-link to="/bazhua/myFriend">
        <div class="menu new_progress">
          <div class="sub_icon ">
            <img src="../../assets/images/circle/icon_06.png" alt="">
          </div>
          <div class="text">圈子好友</div>
        </div>
      </router-link>
      <!-- <router-link :to="item.path?item.path:''" class="item" v-for="(item,index) in rootList" :key="index">
        <div class="menu">
          <div class="sub_icon">
            <img :src="item.icon" alt="">
          </div>
          <div class="text">{{item.name}}</div>
        </div>
      </router-link> -->
    </div>
    <div class="main Content">
        <router-view></router-view>
    </div>
  </div>
</template>
<script>
// import pathObj from './router'
export default {
  name: "",
  data() {
    return {
      userInfo: "",
      rootList: []
    };
  },
  methods: {
    // getUserRoot(){
    //   let  data = {
    //     token:this.$getkey(),
    //     userId:this.userInfo.guid,
    //   }
    //   this.$ajax(`${this.subUrl.user}/user/getPermissions`,data,res=>{
    //     if(res.data.propertyManagement){
    //       console.log(res,"router")
    //       var arr = res.data.weBusiness.subclass;
    //       for(var val of arr){
    //         val.path = pathObj[val.name];
    //       }
    //       console.log(arr)
    //       this.rootList = arr;
    //     }
    //   },this)
    // },
  },
  computed: {
    activeMenu() {
      return this.$store.state.activeMenu;
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.$store.commit("setActivemenu", 1);
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
    padding-bottom: 200px;
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
        // border-radius: 50%;
        // background: #fff;
        img {
          width: 85%;
          display: inline-block;
          // border-radius: 50%;
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
    background: #f2f2f7;
  }
}
</style>
