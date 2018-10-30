<template>
<div id='subTemplate'>
     <div class="title">
        <div class="text">工作台</div>
    </div>
    <div class="layout">
      <div class="serBox"> 
        <ul> 
          <li v-for="(item,index) in rootList" v-if="item.name!='服务设置' && item.name != '通知'" @click="turnTo(item.name)" :key="index">
              <a href="javascript:;"><div><img :src="item.icon" alt="">
                </div><p>{{item.name}}</p>
              </a>
            </li>
        </ul>
      </div>
    </div>
</div>
</template>
<script>
import mRoute from "./router";
export default {
  name: "",
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    return {
      rootList: []
    };
  },
  methods: {
    turnTo(url) {
      console.log(mRoute,"999999");
      console.log(url,"888888888");
      this.$router.push(mRoute[url]);
    },
    getUserRoot() {
      let pathObj = {
        外勤服务: "/manage/wuye_service",
        特约写字楼: "/manage/wuye_service",
        缴费: "/manage/wuye_service",
        报修: "/manage/wuye_service",
        投诉: "/manage/wuye_service",
        装修: "/manage/wuye_service",
        通知: "/manage/wuye_service",
        接待: "/manage/wuye_service",
        入驻: "/manage/wuye_service",
        退租: "/manage/wuye_service",
        租赁: "/manage/wuye_service",
        放行条: "/manage/wuye_service"
      };
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };

      this.$ajax(
        `${this.subUrl.user}/user/getPermissions`,
        data,
        res => {
          console.log(res, "root");
          for (let val of res.data.entService.subclass) {
            if (val.name === "工作台") {
              this.rootList = val.subclass;
            }
          }
          console.log(this.rootList);
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
#subTemplate {
  overflow: hidden;
}
.layout {
  box-sizing: border-box;

  background: #fff;
  margin: 10px 0px 0 10px;
}
.serBox {
  ul li {
    float: left;
    a {
      box-sizing: border-box;
      display: inline-block;
      margin: 20px;
      width: 150px;
      height: 150px;
      padding: 30px;
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