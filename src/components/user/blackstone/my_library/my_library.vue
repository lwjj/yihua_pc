<template>
    <div id="library">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{path:'/user/blackstone/blackstone_my'}">百事通</el-breadcrumb-item>
                <el-breadcrumb-item>我的文库</el-breadcrumb-item>  
            </el-breadcrumb>
        </div>
        <div class="library_top">
            <div>
                <router-link to="/user/blackstone/my_library/library_collection"><el-button :autofocus='isActive==1' :focus='true'><a>我的收藏（{{countNum.collectNum}}）</a></el-button></router-link>
                <el-button @click="goOn('/user/blackstone/my_library/library_download')" :autofocus='isActive==2' >我的下载（<a>{{countNum.downloadNum}}</a>）</el-button>
                <el-button @click="goOn('/user/blackstone/my_library/library_upload')" :autofocus='isActive==3'>我的上传（<a>{{countNum.uploadNum}}</a>）</el-button>
                <el-button style="float:right;margin-right:10px;" @click="goOn('/user/blackstone/my_library/library_uploadLibrary')">上传文库</el-button>
            </div>
            <router-view @refresh='getNum'></router-view>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      organInfo: {},
      rowCount1: 0,
      rowCount2: 0,
      rowCount3: 0,
      value2: "",
      isActive: "",
      countNum: {}
    };
  },
  watch: {
    $route: function(a) {
      this.setActive(a);
      this.getNum();
    }
  },
  methods: {
    setActive(a) {
      if (a.path.indexOf("library_collection") > -1) {
        this.isActive = 1;
      } else if (a.path.indexOf("library_download") > -1) {
        this.isActive = 2;
      } else if (a.path.indexOf("library_upload") > -1) {
        this.isActive = 3;
      }
    },
    getNum() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.bd}/knowAll/count`,
        data,
        res => {
          console.log(res, "xxx");
          this.countNum = res.data;
        },
        this
      );
    },

    goOn(router) {
      this.$router.push({ path: router });
    }
  },

  beforeMount() {
    this.setActive(this.$route);
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getNum();
  }
};
</script>
<style lang="scss" scoped>
#library {
  height: 100%;
  padding-left: 260px;
}
.library_top {
  background: #fff;
  height: calc(100% - 70px);
  padding-top: 10px;
  .el-button {
    width: 125px;
    height: 40px;
    margin-left: 10px;
  }
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

