<template>
  
</template>
<script>
import { Loading } from "element-ui";
export default {
  data() {
    return {};
  },
  methods: {},
  mounted() {
    if (this.$route.query.token) {
      var popver = this.$loading({
        fullscreen: true,
        text: "登录中"
      });
      var para = this.$route.query;
      this.$getUserInfo(res => {
        popver.close();
        switch (Number(para.type)) {
          case 1:
            this.$router.push(
              `/message/propertyMessage/${para.guid}?type=${para.type}`
            );
            break;
          case 2:
            this.$router.push(
              `/message/electricityMessage/${para.guid}?type=${para.type}`
            );
            break;
          case 3:
            this.$router.push(
              `/message/circleMessage/${para.guid}?type=${para.type}`
            );
            break;
          case 4:
            this.$router.push(
              `/message/platformMessage/${para.guid}?type=${para.type}`
            );
            break;
          case 5:
            this.$router.push(
              `/message/pushMessage/${para.guid}?type=${para.type}`
            );
            break;
          default:
            this.$router.push("/");
            break;
        }
      }, this);
    } else {
      this.$router.replace("/");
    }
  }
};
</script>
