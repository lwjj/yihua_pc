<template>
  <div id='manage'>
    <div class="all_header">
      <!-- <el-autocomplete
        class="inline-input"
        placeholder="输入搜索的关键字"></el-autocomplete> -->
    </div>
    <div class="submenu">
      <router-link class="item" to="/message/newList">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/personal/message.png" alt="">
          </div>
          <el-badge :value="newMessageNum" :hidden="newMessageNum == 0" :max="9" class="item">
            <div class="text">最新消息</div>
          </el-badge>
        </div>
      </router-link>
      <router-link class="item" to="/message/propertyMessage/1">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/rent/my/l1.png" alt="">
          </div>
          <el-badge :value="propertyNewsNum" :hidden="propertyNewsNum == 0" :max="9" class="item">
            <div class="text">物业消息</div>
          </el-badge>
        </div>
      </router-link>
      <router-link class="item" to="/message/electricityMessage/2">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/rent/my/l2.png" alt="">
          </div>
          <el-badge :value="ebNewsNum" :hidden="ebNewsNum == 0" :max="9" class="item">
            <div class="text">电商消息</div>
          </el-badge>
        </div>
      </router-link>
      <router-link to="/message/circleMessage/3">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/rent/my/l3.png" alt="">
          </div>
          <el-badge :value="circleNewsNum" :hidden="circleNewsNum == 0" :max="9" class="item"> 
           <div class="text">圈子消息</div>
          </el-badge> 
        </div>
      </router-link>
      <router-link to="/message/platformMessage/4">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/rent/my/l4.png" alt="">
          </div>
          <el-badge :value="terraceNewsNum" :hidden="terraceNewsNum == 0" :max="9" class="item"> 
            <div class="text">平台消息</div>
          </el-badge> 
         </div>
      </router-link>
      <router-link to="/message/pushMessage/5">
        <div class="menu">
          <div class="sub_icon">
            <img src="../../assets/images/rent/my/l5.png" alt="">
          </div>
          <el-badge :value="pushNewsNum" :hidden="pushNewsNum == 0"  :max="9" class="item"> 
            <div class="text">推送消息</div>
          </el-badge>  
          </div>
      </router-link>
      <router-link to="/message/setUpMessage">
        <div class="menu" style="border-top:1px solid #ddd;">
          <div class="sub_icon">
            <img src="../../assets/images/rent/my/setting.png" alt="">
          </div>
          <div class="text">设置</div>        </div>
      </router-link>
    </div>
    <div class="mainContent">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    return {
      rootList: [],
      propertyNewsNum: 0,
      ebNewsNum: 0,
      circleNewsNum: 0,
      terraceNewsNum: 0,
      pushNewsNum: 0
    };
  },
  methods: {
    getMessage() {
      this.$getMessage(res => {
        this.$store.commit("setAllmessage", res.data);
        this.propertyNewsNum = res.data.messageMr.propertyNewsNum * 1;
        this.ebNewsNum = res.data.messageMr.ebNewsNum * 1;
        this.circleNewsNum = res.data.messageMr.circleNewsNum * 1;
        this.terraceNewsNum = res.data.messageMr.terraceNewsNum * 1;
        this.pushNewsNum = res.data.messageMr.pushNewsNum * 1;
      }, this);
    },
    getNewMessage() {
      var data = {
        token: this.$route.query.token
          ? this.$route.query.token
          : this.$getkey()
      };
      this.$ajax(
        `${this.subUrl.user}/commMessage/getUserMessageList`,
        data,
        res => {
          this.$store.commit("setMessageNum", res.data.length);
        },
        this
      );
    }
  },
  computed: {
    newMessageNum() {
      return this.$store.state.newMessageNum;
    }
  },
  watch: {
    $route: function() {
      this.getMessage();
    }
  },
  beforeCreate() {
    this.$store.commit("setActivemenu", 6);
  },
  created() {
    this.getMessage();
    this.getNewMessage();
  }
};
</script>
<style lang="scss" scoped>
#manage {
  height: 100%;
  background: #f2f2f7;
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
      // background: #fff;
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

.mainContent {
  width: 100%;
  height: 100%;
  overflow: hidden;
  float: left;
}

.router-link-active {
  .menu {
    background: #f2f2f7;
  }
}
</style>