<template>
  <div style="height:100%"> 
    <div class="bottom-btn">
      <div style="flex: 1" @click="select(1)" v-bind:class="type==1?'active':''">发现</div>
      <div style="flex: 1" v-if="userInfo.organType*1<6" @click="select(2)" v-bind:class="type==2?'active':''">我的采购</div>
      <div style="flex: 1" @click="select(3)" v-bind:class="type==3?'active':''">我的产品</div>
    </div>
    <div style="padding-top: 50px;" class="routerBox" >
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Swiper from "swiper";
export default {
  data() {
    return {
      userInfo: "",
      type: 1
    };
  },
  methods: {
    select(i) {
      this.type = i;
      switch (this.type) {
        case 1:
          this.$router.push("/user/we_business/supply/find");
          break;
        case 2:
          this.$router.push("/user/we_business/supply/purchase");
          break;
        case 3:
          this.$router.push("/user/we_business/supply/product");
          break;
      }
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    switch (this.$route.path) {
      case "/user/we_business/supply/purchase":
        this.type = 2;
        break;
      case "/user/we_business/supply/find":
        this.type = 1;
        break;
      case "/user/we_business/supply/product":
        this.type = 3;
        break;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "supply.css";
.routerBox {
  height: calc(100% - 1px);
}
.bottom-btn {
  position: fixed;
  display: flex;
  left: 280px;
  line-height: 50px;
  right: 0;
  background: #fff;
  top: 75px;
  border-bottom: 1px solid #ddd;
  z-index: 999;
}
.bottom-btn > div {
  flex: 1;
  z-index: 99;
  text-align: center;
  font-size: 14px;
  border-top: 1px solid #ddd;
  font-weight: 600;
  cursor: pointer;
}
.active {
  border-bottom: 2px solid rgb(30, 130, 210);
  color: rgb(30, 130, 210);
}
</style>
