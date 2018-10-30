<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native="back">返回</el-breadcrumb-item>
        <el-breadcrumb-item>{{$route.query.userId == userInfo.guid?'我的名片':'商家名片'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="contact" style="margin-top: 10px;padding: 0.2rem">
      <div style="border-bottom: 1px solid #ededed;">
        <div>名称：</div>
        <span style="color:#999999">{{name}}</span>
        <div style="margin-bottom:5px;" class="right-btn" @click="enterShop($route.query.userId)">进入店铺</div>
        <div style="margin-bottom:5px;" v-if="$route.query.userId == userInfo.guid" class="right-btn" @click="enterCard()">名片管理</div>
      </div>
      <div>
        <div>联系人：</div>
        {{details.name}}
      </div>
      <div>
        <div>手机号码：</div>
        {{details.phone}}
      </div>
      <div>
        <div>联系QQ：</div>
        {{details.qq}}
      </div>
      <div>
        <div>联系邮箱：</div>
        {{details.email}}
      </div>
      <div>
        <div>固定电话：</div>
        {{details.telePhone}}
      </div>
      <div>
        <div>详情地址：</div>
        {{details.address}}
      </div>
      <div>
        <div>所在大厦：</div>
        {{details.building}}
      </div>
      <div style="border-bottom: 1px solid #ededed;margin-top: 10px">
        <div>企业介绍：</div>
      </div>
      <div style="margin-top: 0.1rem">
        <div style="line-height: 80px">logo：</div>
        <img style="width: 80px;height: 80px" :src="details.logo" alt="">
      </div>
      <div>
        <div>成立时间：</div>
        {{details.foundinTime?details.foundinTime.split(' ')[0]:''}}
      </div>
      <div>
        <div>注册资本：</div>
        {{details.capital}}
      </div>
      <div>
        <div>所属行业：</div>
        {{details.industry}}
      </div>
      <div>
        <div>法人代表：</div>
        {{details.representative}}
      </div>
      <div>
        <div>经营模式：</div>
        {{details.pattern}}
      </div>
      <div>
        <div>员工人数：</div>
        {{details.peopleNum}}
      </div>
      <div>
        <div>年营业额：</div>
        {{details.turnover}}
      </div>
      <div>
        <div>企业官网：</div>
        {{details.website}}
      </div>
      <div>
        <div>微信号：</div>
        {{details.weChat}}
      </div>
      <div style="border-bottom: 1px solid #ededed;margin-top: 10px">
        <div>资质证照：</div>
      </div>
      <div style="display: flex;flex-wrap: wrap;max-width: 600px;margin-bottom: 20px">
        <div style="width: 120px;padding: 10px" v-for="item,index in details.accessoryList" :key="index">
          <img style="width: 100%;height: 100px" :src="item.path" alt="">
        </div>
      </div>
      <div style="border-bottom: 1px solid #ededed;margin-top: 10px">
        <div>商家介绍：</div>
      </div>
      <div style="padding:10px 10px 20px 10px">{{details.describes}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        userInfo: '',
        organInfo: '',
        details: '',
        name:""
      }
    },
    methods: {
      enterShop(id){
        this.$router.push('/user/we_business/supply/myShop?userId='+id)
      },
      enterCard(){
        this.$router.push('/user/we_business/supply/card_manage')
      },
      getDetail() {
        var data = {}
        data.token = this.$getkey();
        data.userId = this.$route.query.userId;

        this.$ajax(
          `${this.subUrl.bd}/opportunity/getShopCard`,
          data,
          res => {
            this.details = res.data
          },
          this
        );
      }
    },
    mounted() {
      this.getDetail();
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
      if(this.$route.query.oName!=="null"){
        this.name=this.$route.query.oName
      }else{
        this.name="暂无"
      }
    }
  }
</script>
<style scoped>
  .right-btn {
    margin-left: 25px;
    border-radius: 5px;
    border: 1px solid rgb(35, 172, 56);
    width: 70px;
    text-align: center!important;
    line-height: 30px;
    cursor: pointer;
  }

  .content {
    padding: 20px 30px;
    margin: 20px 0;
    background: #fff;
  }

  #new_progress {
    padding-left: 300px;
    padding-right: 40px;
     height: auto;
  }

  .contact {
    width: 100%;
    margin-bottom: .2rem;
    background: white;
  }

  .contact > div {
    display: flex;
    line-height: 30px
  }

  .contact > div > div {
    color: #999999;
    text-align: right;
  }
</style>
