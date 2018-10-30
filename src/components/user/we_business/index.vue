<template>
<div id='wuye_service'>
     <div class="title">
        <div class="text">本楼业务</div>
    </div>
    <div class="layout">
      <div class="servBox clearfix">
        <ul>
          <li v-for="(item,index) in rootList" v-if="(userInfo.organType==3&&item.name=='物业供求')||item.name!='物业供求'" :key="index">
              <router-link :to="item.path?item.path:''">
                  <div><img :src="item.icon" alt=""></div>
                  <p>{{item.name}}</p>
            </router-link>
          </li>
        </ul>
      </div>
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
    getUserRoot() {
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/user/getPermissions`,
        data,
        res => {
          this.$store.commit("setRootList", res.data);
          if (res.data.propertyManagement) {
            // console.log(res,"router")
            var arr = res.data.weBusiness.subclass;
            for (var val of arr) {
              val.path = pathObj[val.name];
            }
            this.rootList = arr;
          }
        },
        this
      );
    }
  },
  mounted() {
    this.getUserRoot();
  }
};
</script>
<style lang="scss" scoped>
#wuye_service {
  height: 100%;
  padding-left: 260px;
  // padding-right: 10px;
  //   overflow: hidden;
}
.layout {
  height: 100%;
  box-sizing: border-box;
  background: #fff;
  margin: 10px;
}
.servBox {
  ul li {
    float: left;
    width: 110px;
    margin: 20px;
    a {
      box-sizing: border-box;
      display: inline-block;
      margin: 20px;
      // padding: 30px;
      text-align: center;
      img {
        width: 50px;
      }
      p {
        padding: 5px 0px;
      }
    }
  }
}
</style>
