<template>
    <div id='quality'>
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/blackstone/blackstone_my' }">百事通</el-breadcrumb-item>
                <el-breadcrumb-item>我的财富</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="layout">
          <div class="wealth_top">
            <div>
                <b class="b_1">总财富</b>
                <b class="b_2">{{wealth}}</b><span style="line-height:40px;margin-left:5px;">商机点</span>
                <el-button style="float:right;margin-left:10px;margin-right:20px;" @click="$router.push('/user/personal_wealth/personal_ticket/personal_ticket/:sjd')">兑换</el-button>
                <el-button style="float:right;" @click="$router.push('/user/personal_wealth/personal_topUp/personal_topUp')">充值</el-button>
                <div class="clear"></div>
            </div>
        </div>
        <div class="wealth_body">
            <router-link to="/user/blackstone/blackstone_wealth/wealth_upload"><el-button :autofocus="true"><a>我的上传（{{deptType.uploadNum}}）</a></el-button></router-link>
            <el-button @click="goOn('/user/blackstone/blackstone_wealth/wealth_download')">我的下载<a>（{{deptType.downloadNum}}</a>）</el-button>
            <el-button @click="goOn('/user/blackstone/blackstone_wealth/wealth_punish')">文档扣罚<a>（{{deptType.fineNum}}</a>）</el-button>
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
      organInfo: {},
      deptType: [],
      userType: [],
      detailType: [],
      wealth: 0,
      tableData: []
    };
  },
  methods: {
    goOn(router) {
      this.$router.push({ path: router });
    },
    getCount() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.bd}/knowAll/count`,
        data,
        res => {
          this.deptType = res.data;
        },
        this
      );
    },
    getWealth() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/asset/getUserAsset`,
        data,
        res => {
          this.userType = res.data;
          console.log(this.userType);
          this.wealth =
            Number(this.userType.businessPoint) +
            Number(this.userType.conBusinessPoint);
        },
        this
      );
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getCount();
    this.getWealth();
    /*this.getDetail();*/
  }
};
</script>
<style lang="scss" scoped>
.clear {
  clear: both;
}
#quality {
  height: 100%;
  padding-left: 260px;
  .text {
    i {
      padding: 20px 20px;
    }
  }
}
.layout {
  position: relative;
  height: calc(100% - 70px)
}
.wealth_top {
  background: #fff;
  padding: 5px 0;
  .b_1 {
    font-size: 17px;
    display: block;
    float: left;
    line-height: 40px;
    margin-left: 20px;
  }
  .b_2 {
    font-size: 20px;
    float: left;
    line-height: 40px;
    margin-left: 40px;
  }
}
.wealth_body {
  padding-top: 10px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0px;
  background: #fff;
  .el-button {
    width: 125px;
    height: 40px;
    margin-left: 10px;
    margin-bottom: 10px;
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
