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
      <router-link v-if="userInfo.organType*1==3" class="item" to="/user/we_business">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/personal/property-management.png" alt="">
          </div>
          <el-badge is-dot :hidden="show4" class="item">
            <div class="text">本楼业务</div>
          </el-badge>
        </div>
      </router-link>
      <router-link class="item" v-if="userInfo.organType <=4&&userInfo.organType!=2" to="/user/blackstone/blackstone_my">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/personal/blackstone.png" alt="">
          </div>
          <div class="text">百事通</div>
        </div>
      </router-link>
      <router-link v-if="userInfo.organType*1 <= 7 && userInfo.organType!=3 && userInfo.organType!=5" class="item" to="/user/we_business/supply/find">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/personal/enterprise-wealth.png" alt="">
          </div>
          <el-badge is-dot :hidden="show6" class="item">
             <div class="text">供求市场</div>
           </el-badge>
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
      <router-link v-if="userInfo.organWealth==1" class="item" to="/user/enterprise_wealth/enterprise_details/enterprise_ticketRecord">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/personal/property-management.png" alt="">
          </div>
          <div class="text">企业财富</div>
        </div>
      </router-link>
      <router-link to="/user/cardVolume/cardVolume_myCoupons">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/personal/my-card.png" alt="">
          </div>
          <div class="text">我的卡券</div>
        </div>
      </router-link>
      <router-link class="item" to="/user/we_business/bazhua/circle" v-if="userInfo.organType==1">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/personal/mycircle.png" alt=""/>
          </div>
          <div class="text">我的圈子</div>
        </div>
      </router-link>
      <router-link v-if="userInfo.organType*1<=3" class="item" to="/user/local_service">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/rent/my/message.png" alt="">
          </div>
          <div class="text">本地服务</div>
        </div>
      </router-link>

      <router-link v-if="userInfo.organType==2" class="item" to="/mechant/serviceList/building">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/estate/teyue.png" alt="">
          </div>
          <div class="text">特约写字楼</div>
        </div>
      </router-link>
      <router-link v-if="userInfo.organType==2" class="item" to="/mechant/serviceList/waiqing">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/estate/waiqin.png" alt="">
          </div>
          <div class="text">外勤服务</div>
        </div>
      </router-link>

      <!-- 物业公司物业管理 -->
      <router-link class="item" v-if="userInfo.organType == 4" to="/wuye/manage">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/rent/my/property.png" alt="">
            <div>物</div>
          </div>
          <div class="text">物业管理</div>
        </div>
      </router-link>
      <!-- 退出高级查询 -->
       <router-link class="item" v-if="showSearch" to="/wuye/exitSearch">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/rent/my/property.png" alt="">
            <div>物</div>
          </div>
          <div class="text">高级查询</div>
        </div>
      </router-link>

      <!-- 复制测试 -->
      <router-link class="item" v-if="showSearch1" to="/wuye/exitAssistant">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/rent/my/property.png" alt="">
            <div>物</div>
          </div>
          <div class="text">退出助手</div>
        </div>
      </router-link>

      <router-link to="/user/administrator" v-if="userInfo.isAdmin && userInfo.organType != 2">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/rent/my/manager.png" alt="">
          </div>
          <div class="text">管理员</div>
        </div>
      </router-link>
      <router-link to="/mechant/administrator" v-if="userInfo.isAdmin && userInfo.organType == 2">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/rent/my/manager.png" alt="">
          </div>
          <div class="text">管理员</div>
        </div>
      </router-link>
      <router-link to="/user/building_management/index" v-if="this.userInfo.organType==7||this.userInfo.organType==6">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/rent/my/property.png" alt="" >
          </div>
          <div class="text">房屋管理</div>
        </div>
      </router-link>
      <router-link to="/user/money_management" v-if="this.userInfo.organType==7">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/rent/my/operate.png" alt="">
          </div>
          <div class="text">财务管理</div>
        </div>
      </router-link>
      <router-link to="/user/relationship_between" v-if="this.userInfo.organType==7">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/rent/my/service_order.png" alt="">
          </div>
          <div class="text">关系管理</div>
        </div>
      </router-link>
      <router-link to="/user/setUp/myself">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/personal/set-up.png" alt="">
          </div>
          <div class="text font14">设置</div>
        </div>
      </router-link>
      <router-link to="/user/myAssistant" v-if="userInfo.postType==2 && (userInfo.organType == 1|| userInfo.organType == 3)">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/rent/my/enterprse.png" alt="">
          </div>
          <div class="text font14">我的助手</div>
        </div>
      </router-link>
    </div>

    <div class="mainContent">
      <!--  include='tenant' -->
      <keep-alive include="tenant">
        <router-view></router-view>
      </keep-alive>
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
    if (localStorage.getItem("tempObj") && this.userInfo.organType == 3) {
      this.showSearch = true;
    } else {
      this.showSearch = false;
    }

    if (localStorage.getItem("tempObj1") && this.userInfo.organType == 3) {
      this.showSearch1 = true;
    } else {
      this.showSearch1 = false;
      
    }
    return {
      rootList: [],
      building: true,
      gongqiu: true,
      userInfo: {},
      organInfo: {},
      show4: true,
      show6: true
    };
  },
  methods: {
    getmessage() {
      this.$getMessage(res => {
        var num = 0;
        num =
          res.data.houseBusMr.circleManageNum * 1 +
          res.data.houseBusMr.lesseePurchaseNum * 1;
        if (num > 0) {
          this.building = false;
        } else {
          this.building = true;
        }
        // 供求市场判定
      }, this);
    }
  },
  beforeCreate() {
    this.$store.commit("setActivemenu", 5);
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getmessage();
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
        margin: 15px 15px 15px 15px;
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
  overflow: auto;
  float: left;
}

// 路由激活
.router-link-active {
  .menu {
    background: #f2f2f7;
  }
}
</style>
