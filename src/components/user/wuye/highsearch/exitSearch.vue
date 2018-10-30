<template>
  <div class="newRightContent">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>退出高级查询</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
      <div class="bgwhite border">
          <div style="padding:20px">
              <el-button type="primary" @click="exitSearch">退出高级查询</el-button>
        </div> 
      </div>
  </div>
</template>
<script>
import fn from "@/assets/js/product.js";
export default {
  data() {
    this.tempObj = JSON.parse(
      decodeURIComponent(localStorage.getItem("tempObj"))
    );
    return {};
  },
  methods: {
    exitSearch() {
      this.$confirm("是否退出高级查询", "提示", { type: "warning" }).then(
        () => {
          console.log(this.tempObj);
          localStorage.setItem(
            "userInfo",
            encodeURIComponent(JSON.stringify(this.tempObj.userInfo))
          );
          localStorage.setItem(
            "organInfo",
            encodeURIComponent(JSON.stringify(this.tempObj.organInfo))
          );
          fn.setIng(this.tempObj.tempToken);
          var a = this.tempObj.userInfo.organType;
          var b = this.tempObj.userInfo.admin ? 1 : 0;
          localStorage.setItem("organType", a);
          localStorage.setItem("isManger", b);
          localStorage.setItem("user_Id", this.tempObj.userInfo.guid);
          localStorage.setItem("organ_Id", this.tempObj.organInfo.guid);
          localStorage.setItem(
            "mainColor",
            this.$color[this.tempObj.userInfo.organType]
          );
          localStorage.removeItem('tempObj')
          this.$router.push("/wuye/search");
          localStorage.setItem("reload", true);
          //   location.reload(true);
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

