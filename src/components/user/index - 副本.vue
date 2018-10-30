<template>
  <!-- 个人中心 -->
  <div id='manage'>
    <!-- 头部 -->
    <div class="all_header">
      <!-- 搜索栏 -->
      <el-autocomplete
        class="inline-input"
        placeholder="搜索内容"
      ></el-autocomplete>
    </div>
    <!-- 物业管理二级菜单 -->
    <div class="submenu">
      <router-link class="item" to="/user/we_business">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/personal/property-management.png" alt="">
          </div>
          <div class="text">本楼业务</div>
        </div>
      </router-link>
      <router-link class="item" to="/user/blackstone/blackstone_my">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/personal/blackstone.png" alt="">
          </div>
          <div class="text">百事通</div>
        </div>
      </router-link>
      <router-link class="item" to="/user/enterprise_wealth/enterprise_details/enterprise_ticketRecord">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/personal/enterprise-wealth.png" alt="">
          </div>
          <div class="text">企业财富</div>
        </div>
      </router-link>
      <router-link class="item" to="/user/personal_wealth/personal_details/personal_ticketRecord">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/personal/my-assets.png" alt="">
          </div>
          <div class="text">我的资产</div>
        </div>
      </router-link>

      <!-- <router-link to="">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/personal/my-card.png" alt="">
          </div>
          <div class="text">我的卡卷</div>
        </div>
      </router-link> -->
      <router-link class="item" to="/user/we_business/bazhua/circle" v-if="userInfo.organType*1==1">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/personal/my-card.png" alt="">
          </div>
          <div class="text">我的圈子</div>
        </div>
      </router-link>
      <router-link class="item" to="/user/we_business/local_service">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/personal/my-card.png" alt="">
          </div>
          <div class="text">本地服务</div>
        </div>
      </router-link> 
      <!-- 物业公司物业管理 -->
      <router-link class="item" to="/wuye/manage">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/rent/my/property.png" alt="">
            <div>物</div>
          </div>
          <div class="text">物业管理</div>
        </div>
      </router-link> 

      <router-link to="/user/administrator" v-if="userInfo.isAdmin">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/personal/my-card.png" alt="">
          </div>
          <div class="text">管理员</div>
        </div>
      </router-link>
      <!-- <router-link to="">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/personal/set-up.png" alt="">
          </div>
          <div class="text font14">设置</div>
        </div>
      </router-link> -->
    </div>

    <div class="mainContent">
      <router-view></router-view>
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
  mounted() {
    // this.getUserRoot();
  }
};
</script>
<style lang="scss" scoped>
#manage {
  height: 100%;
  background: #f2f2f7;
  // 第二级内容
  .submenu {
    overflow-x: hidden;
    width: 260px;
    height: 100%;
    position: absolute;
    background: #fff;
    border: 1px solid #f3f3f7;
    padding-bottom: 200px;
    .setUp_d {
      border-top: 3px solid #f3f3f7;
      width: 90%;
      margin-left: 5%;
    }
    .menu {
      height: 65px;
      box-sizing: border-box;
      // border: 1px solid #e7e7e7;
      .sub_icon {
        width: 35px;
        height: 35px;
        margin: 15px 15px 15px 40px;
        float: left;
        overflow: hidden;
        border-radius: 50%;
        background: #fff;
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
  overflow: scroll;
  float: left;
}

// 路由激活
.router-link-active {
  .menu {
    background: #f2f2f7;
  }
}
</style>
