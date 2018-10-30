<template>
  <div id="app">
    <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>

export default {
  name: "app",
  mounted() {
    console.log(this.$preview, "预览图片");
  },
  watch: {
    $route: function(a) {
      if (!localStorage.getItem("userInfo")) {
        if (
          location.href.indexOf("login") > -1 ||
          location.href.indexOf("newList") > -1 ||
          location.href.indexOf("account") > -1
        ) {
        } else {
          this.$router.push("/");
        }
      } else {
        if (a.path == "/account/login") {
          var userInfo = JSON.parse(
            decodeURIComponent(localStorage.getItem("userInfo"))
          );
          var url;
          switch (userInfo.organType * 1) {
            case 1:
              url = "/manage/wuye_service";
              break;
            case 2:
              url = "/user/we_business/supply/find";
              break;
            case 3:
              url = "/manage/wuye_service";
              break;
            case 4:
              url = "/wuye/manage";
              break;
            case 5:
              url =
                "/user/personal_wealth/personal_details/personal_ticketRecord";
              break;
            case 6:
              url =
                "/user/personal_wealth/personal_details/personal_ticketRecord";
              break;
            case 7:
              url =
                "/user/personal_wealth/personal_details/personal_ticketRecord";
              break;
          }
          this.$router.push(url);
        }
      }
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  height: 100vh;
}
</style>
