<template>
  <div class="content">
      <div class="registerChoose clearfix" @click="toRegister('rent')">
          <img src="../../assets/images/register/zuhu.png">
          <span class="text">租户注册</span>
      </div>
        <div class="registerChoose clearfix" @click="toRegister('business')">
          <img src="../../assets/images/register/business.png">
          <span class="text">商家注册</span>
      </div>
       <div class="registerChoose clearfix" @click="toRegister('manage')">
          <img src="../../assets/images/register/manage.png">
          <span class="text">管理处注册</span>
      </div>
      <div class="registerChoose clearfix" @click="toRegister('company')">
          <img src="../../assets/images/register/wuye.png">
          <span class="text">物业公司注册</span>
      </div>
      <div class="registerChoose clearfix" @click="toRegister('personal')">
          <img src="../../assets/images/register/personal.png">
          <span class="text">个人注册</span>
      </div>
      <div style="padding: 0 10px;">
        <el-button @click="$router.go(-1)">返回</el-button>
      </div>

  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    toRegister(e) {
      this.$router.push(`/account/${e}`);
    }
  }
};


</script>
<style scoped lang="scss">
.content{
  width: 500px;
  margin: 50px auto 0!important;
  border: none;
}
  .registerChoose{
    /*height: 100px;*/
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 3px 3px 10px #999;
    margin:5px 5px 20px;
    padding: 10px 0;
    background: #fff;
    position: relative;
    img{
      height: 100px;
      padding: 10px 30px;
      float: left;
    }
    .text{
      position: absolute;
      top:40%;
      margin-left: 80px;
    }
  }
</style>


