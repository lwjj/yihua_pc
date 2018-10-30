<template>
    <el-container class="account">
        <el-header height='80px'>
            <div class="app-header">
              <img src="../../assets/images/register/logo2.png" alt="">
              <!-- <span style="font-size:40px;color:#fff;font-family:'KaiTi'">云楼数据</span> -->
            </div>
        </el-header>
        <el-main>
            <div class="loginBox clearfix">
                <router-view>

                </router-view>
            </div>
        </el-main>
    </el-container>
</template>
<script>
</script>
<style lang="scss" scoped rel="stylesheet/scss">
.account {

}
.loginBox {
  width: 100%;
  
  height: 100%;
}
.el-main {
  background: #f1f1f1;
  padding: 0;
}
.el-container {
  height: 100%;
}

.el-container .el-header {
  height: 80px;
  background: #1e82d2 ;
  padding: 0;
}

.app-header {
  height: 80px;
  width: 80%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .app_logo {
    width: 180px;
    height: 45px;
  }
  .contact {
    line-height: 80px;
    color: #fff;
  }
}

.el-header,
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}
</style>
