<template>
     <div id="wealth">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/administrator' }">管理员</el-breadcrumb-item>
                <el-breadcrumb-item>关于</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="main">
                <div class="first1">
                    <img :src="data.logo">
                    <h4>{{data.description}}</h4>
                    <p>微信号：{{data.wechat}}</p>
                    <p>客服电话：{{data.serviceTel}}</p>
                    <p>电子邮箱：{{data.email}}</p>
                    <p>官方版本：{{data.website}}</p>
                    <p>版本所有：{{data.releaseAll}}</p>
                </div>   
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
      data: {}
    };
  },
  methods: {
    getDetails() {
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/user/about`,
        data,
        res => {
          this.data = res.data;
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
    this.getDetails();
  }
};
</script>
<style lang="scss" scoped>
#wealth {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: scroll;
  .box {
    height: 100%;
    margin-top: 10px;
    width: 98%;
    margin-left: 1%;
    background: #fff;
    .main {
      width: 50%;
      margin-left: 20%;
      padding-top: 20px;
      .first1 {
        width: 100%;
        text-align: center;
        img {
          width: 300px;
        }
        p {
          padding: 15px 0;
        }
      }
    }
  }
}
.clear {
  clear: both;
}
</style>