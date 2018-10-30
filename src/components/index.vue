<template>
  <!-- 一级菜单 -->
  <div id="index">
    <!-- 左边主导航 -->
    <div class="mainNav" :style="{background:mainColor}">
      <div class="avatar">
        <el-dropdown>
          <img style="width:45px;height:45px" :src="userInfo.headPortrait?userInfo.headPortrait:user_icon" alt="">
          <!--<el-button type="primary">-->
            <!--更多菜单<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
          <!--</el-button>-->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout">退出账号</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- <el-tooltip content="企信" v-if="userInfo.organType!=2" placement="right-start" effect="dark" :open-delay=500>
        <router-link to="/qixing">
          <div
            :class="[{mainMenu1:userInfo.organType == 1,mainMenu2:userInfo.organType == 2,mainMenu3:(userInfo.organType != 1 && userInfo.organType != 2)},'mainMenu']">
      </el-tooltip> -->
      <el-tooltip content="八爪圈" v-if="userInfo.organType <=5 && userInfo.organType!=2" placement="right-start" effect="dark" :open-delay=500>
        <router-link to="/bazhua/circle" :class="activeMenu == 1?'router-link-exact-active router-link-active':''">
          <div
            :class="[{mainMenu1:userInfo.organType == 1,mainMenu2:userInfo.organType == 2,mainMenu3:(userInfo.organType != 1 && userInfo.organType != 2)},'mainMenu']">
            <img src="../assets/images/index/main_menu2.png" alt="">
            <!-- <div class="text">八爪圈</div> -->
          </div>
        </router-link>
      </el-tooltip>
      <el-tooltip content="任务单" placement="right-start" v-if="userInfo.organType == 3" effect="dark" :open-delay=500>
        <router-link to="/task/new_progress" :class="activeMenu == 2?'router-link-exact-active router-link-active':''">
          <div
            :class="[{mainMenu1:userInfo.organType == 1,mainMenu2:userInfo.organType == 2,mainMenu3:(userInfo.organType != 1 && userInfo.organType != 2)},'mainMenu']">
            <el-badge is-dot :hidden='show1' class="item">
                <img src="../assets/images/index/main_menu3.png" alt="">
            </el-badge>
          </div>
        </router-link>
      </el-tooltip>
      <el-tooltip content="物业管理" placement="right-start" v-if="userInfo.organType == 1 || userInfo.organType ==3" effect="dark" :open-delay=500>
        <router-link :class="activeMenu == 3?'router-link-exact-active router-link-active':''" :to="userInfo.organType==3?'/manage/wuye_service':'/manage/wuye_service'">
          <div
            :class="[{mainMenu1:userInfo.organType == 1,mainMenu2:userInfo.organType == 2,mainMenu3:(userInfo.organType != 1 && userInfo.organType != 2)},'mainMenu']">
            <el-badge is-dot :hidden='show2' class="item">
              <img src="../assets/images/index/main_menu4.png" alt="">
            </el-badge>
          </div>
        </router-link>
      </el-tooltip>

      <el-tooltip content="楼宇服务" v-if="userInfo.organType ==1" placement="right-start" effect="dark" :open-delay=500>
        <router-link to="/entprise/workstation" :class="activeMenu == 4?'router-link-exact-active router-link-active':''">
          <div
            :class="[{mainMenu1:userInfo.organType == 1,mainMenu2:userInfo.organType == 2,mainMenu3:(userInfo.organType != 1 && userInfo.organType != 2)},'mainMenu']">
           <el-badge is-dot :hidden='show3' class="item">
            <img src="../assets/images/index/main_menu6.png" alt="">
            <!-- <div class="text">物业管理</div> -->
            </el-badge>
          </div>
        </router-link>
      </el-tooltip>
      <el-tooltip content="个人中心" placement="right-start" effect="dark" :open-delay=500>
        <router-link :class="activeMenu == 5?'router-link-exact-active router-link-active':''" to="/user/personal_wealth/personal_details/personal_ticketRecord">
            <div
                :class="[{mainMenu1:userInfo.organType == 1,mainMenu2:userInfo.organType == 2,mainMenu3:(userInfo.organType != 1 && userInfo.organType != 2)},'mainMenu']">
                <el-badge is-dot :hidden='show4' class="item">
                  <img src="../assets/images/index/main_menu5.png" alt="">
                </el-badge>
              </div>
        </router-link>
      </el-tooltip>
      <el-tooltip :content="'消息中心'" placement="right-start" effect="dark" :open-delay=500>
        <router-link :class="activeMenu == 6?'router-link-exact-active router-link-active':''" to="/message/propertyMessage/1">
          <div
            :class="[{mainMenu1:userInfo.organType == 1,mainMenu2:userInfo.organType == 2,mainMenu3:(userInfo.organType != 1 && userInfo.organType != 2)},'mainMenu']">
            <el-badge is-dot :hidden='show5' class="item">
             <img src="../assets/images/index/main_menu7.png" alt="">
            </el-badge>
          </div>
        </router-link>  
      </el-tooltip>
    </div> 
    <!-- 右边区域 -->
    <div class="left_content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import fn from "@/assets/js/common.js";
export default {
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.userInfo = this.userInfo ? this.userInfo : {};
    this.mainColor = this.$color[this.userInfo.organType];
    if (this.userInfo.organType == 4) {
      this.personalCenterPath = "/wuye/manage";
    } else if (this.userInfo.organType == 3) {
      this.personalCenterPath = "/user/we_business";
    } else {
      this.personalCenterPath =
        "/user/personal_wealth/personal_details/personal_ticketRecord";
    }
    return {
      organInfo: {},
      user_icon: "http://120.76.223.83:8090/yp/img/default.png",
      user_name: "",
      show1: true,
      show2: true,
      show3: true,
      show4: true,
      show5: true
    };
  },
  computed: {
    activeMenu() {
      return this.$store.state.activeMenu;
    }
  },
  created() {
    if (this.$route.query.token) {
      this.loading = this.$loading({ fullscreen: true });
    }
  },
  methods: {
    logout() {
      this.$ajax(
        "/user/comm/getIndustryCategory",
        {},
        res => {
          this.$cookies.remove("userName");
          this.$cookies.remove("password");
          this.$cookies.remove("isRemenber");
          localStorage.clear();

            window.location.reload(true);
          //新添加的页面刷新
         
          
          this.$router.push("/");
          this.$message.error("注销登录成功");
        },
        this
      );
    }
  },
  mounted() {
    if (this.$route.query.token) {
      this.$ajax(
        `${this.subUrl.user}/user/getUserInfo`,
        { token: this.$route.query.token, userId: this.$route.query.token },
        res => {
          res.data.userInfo = res.data.userInfo ? res.data.userInfo : {};
          res.data.organInfo = res.data.organInfo ? res.data.organInfo : {};
          localStorage.setItem(
            "userInfo",
            encodeURIComponent(JSON.stringify(res.data.userInfo))
          );
          localStorage.setItem(
            "organInfo",
            encodeURIComponent(JSON.stringify(res.data.organInfo))
          );
          localStorage.setItem(
            "mainColor",
            this.$color[res.data.userInfo.organType]
          );
          this.userInfo = res.data.userInfo;
          this.organInfo = res.data.organInfo;
          this.mainColor = this.$color[res.data.userInfo.organType];
          this.loading.close();
          localStorage.setItem("to", encodeURIComponent(res.data.token));
          fn.setIng(this.$route.query.token);
          var a = res.data.userInfo.organType;
          var b = res.data.userInfo.admin ? 1 : 0;
          localStorage.setItem("organType", a);
          localStorage.setItem("isManger", b);
          localStorage.setItem("user_Id", res.data.userInfo.guid);
          localStorage.setItem("organ_Id", res.data.organInfo.guid);
          this.$getMessage(res => {}, this);
          this.$getTaskNum(res => {
            if (res.data.newTasksNum > 0) {
              this.show1 = false;
            }
          }, this);
        },
        this
      );
    } else {
      this.userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      this.$getMessage(res => {}, this);
      console.log(this);
      this.$getTaskNum(res => {
        if (res.data.newTasksNum > 0) {
          this.show1 = false;
        }
      }, this);
    }
  }
};
</script>

<style lang='scss' ref="">
#index {
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 75px;
  box-sizing: border-box;
}

// 主导航
.mainNav {
  width: 70px;
  height: 100%;
  /*background: #1e82d2;*/
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
}

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #fff;
  margin: 30px auto;
  margin-bottom: 45px;
  overflow: hidden;
  border: 2px solid #ddd;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.mainMenu {
  width: 70px;
  padding: 10px;
  margin: 5px 0;
  text-align: center;

  img {
    width: 30px;
  }
}

/*"#23ac38",*/
/*"#fab23e",*/
/*"#1e82d2",*/
.mainMenu1:hover {
  background: #23bc38;
}

.mainMenu2:hover {
  background: #ffc53e;
}

.mainMenu3:hover {
  background: #2e92d8;
}

// 路由激活样式
.router-link-active {
  .mainMenu1 {
    background: #23bc38;
  }
  .mainMenu2 {
    background: #ffc53e;
  }
  .mainMenu3 {
    background: #2e92d8;
  }
}

// 头部
.all_header {
  margin-left: 70px;
  width: 200px;
  height: 75px;
  border-bottom: 1px solid #e7e7e7;
  position: absolute;
  top: 0;
  left: 0;
}

.inline-input {
  width: 190px;
  height: 36px;
  margin: 20px 10px;
  float: left;
}

// 三级标题
.title {
  position: absolute;
  width: 100%;
  height: 75px;
  line-height: 75px;
  left: 280px;
  top: 0px;
  padding-left: 40px;
  border-bottom: 1px solid #e7e7e7;
  .text {
    font-size: 16px;
    font-weight: 700;
  }
}

// 右边部分
.left_content {
  height: 100%;
  margin-left: 70px;
}
</style>

