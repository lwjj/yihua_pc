<template>
    <div id="wealth">
        <div class="title">
            <div class="text">设置</div>
        </div>
        <div class="box">
            <div class="first1">
                <router-link to="/user/setUp/myself">
                    <el-button :autofocus="true"><a>个人信息</a></el-button>
                </router-link>
                <router-link to="/user/setUp/myFootprint">
                    <el-button>我的足迹</el-button>
                </router-link>
                <router-link to="/user/setUp/myInvitation">
                    <el-button>我的邀请</el-button>
                </router-link>
                <router-link to="/user/setUp/myAbout">
                    <el-button>关于八爪</el-button>
                </router-link>
                <router-link to="/user/setUp/myPassword">
                    <el-button>密码设置</el-button>
                </router-link> 
                <router-link to="/user/setUp/assistant" v-if="(userInfo.postType==1||userInfo.postType==3)&&userInfo.postType!==2">
                    <el-button>我的助手</el-button>
                </router-link>
                <router-link to="/user/setUp/backInstitutions" v-if="organInfo!==null">
                    <el-button>退出机构</el-button>
                </router-link>    
            </div>
            <div class="routerChild">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      organInfo: {}
    };
  },
  methods: {},
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    console.log(this.userInfo);
  }
};
</script>
<style lang="scss" scoped>
#wealth {
  padding-left: 260px;
  padding-right: 10px;
  overflow: auto;
  .box {
    height: 100%;
    position: relative;
    background: #fff;
    .first1 {
      padding: 10px 0;
    }
  }
}
.routerChild {
  position: absolute;
  left: 0;
  right: 0;
  top: 60px;
  bottom: 0;
  
}
.router-link-active {
  .el-button {
    background: rgb(236, 245, 255);
    border-color: rgb(198, 226, 255);
    a {
      color: rgb(64, 158, 255);
    }
  }
}
</style>
