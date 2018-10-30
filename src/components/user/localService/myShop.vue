<template>
  <div id="new_progress" style="overflow: auto;">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native="back">返回</el-breadcrumb-item>
        <el-breadcrumb-item>店铺详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="contact" style="margin-top: 10px;padding: 0.2rem">
      <div style="border-bottom: 1px solid #ededed;line-height: 50px">
        <div style="width: 100px;height: 100px;padding: 5px">
          <img style="width: 100%;height: 100%" :src="organInfoDto4.logo" alt="">
        </div>
        <div>
          <div>{{organInfoDto4.organName}}店铺</div>
          <div style="background: rgb(255, 231, 200);color: rgb(255, 176, 74);text-align: center">{{organInfoDto4.years}}年</div>
        </div>
      </div>
      <div style="border-bottom: 1px solid #ededed;margin-top: 10px">
        <div>商家介绍：</div>
      </div>
      <div style="border-bottom: 1px dashed #ededed;margin-top: 10px">
        {{shopCard.describes}}
      </div>
      <div style="border-bottom: 1px solid #ededed;margin-top: 10px">
        <div>资质证照：</div>
      </div>
      <div style="display: flex;flex-wrap: wrap;max-width: 600px;margin-bottom: 20px">
        <div style="width: 120px;padding: 10px" v-for="item,index in shopCard.accessoryList" :key="index">
          <img style="width: 100%;height: 100px" :src="item.path" alt="">
        </div>
      </div>
      <div style="border-bottom: 1px solid #ededed;margin-top: 10px">
        <div style="min-width: 600px;text-align: left">产品中心：<div style="float: right;cursor: pointer;color: #777" @click="toDetail()">更多></div></div>
      </div>
      <div style="display: flex;flex-wrap: wrap;max-width: 600px;margin-bottom: 20px">
        <div style="width: 120px;padding: 10px" v-for="item,index in productOrderDtoList" :key="index">
          <img style="width: 100%;height: 100px" :src="item.img" alt="">
          <div style="text-align: center">{{item.title}}</div>
        </div>
      </div>
      <div style="border-bottom: 1px solid #ededed;margin-top: 10px">
        <div>案例介绍：</div>
      </div>
      <div style="display: flex;flex-wrap: wrap;max-width: 800px;margin-bottom: 20px">
        <div style="width: 300px;padding: 10px" v-for="item,index in casesList" :key="index">
          <div>标题：{{item.title}}
            <span v-if="item.state*1==1" style="border-radius: 5px;border: 1px solid rgb(35, 172, 56);color: rgb(35, 172, 56);padding: 0.1rem">正常</span>
            <span v-else style="border: 1px solid rgb(35, 172, 56);color: rgb(35, 172, 56);padding: 0.1rem">失效</span>
            <!--<span style="border: 1px solid rgb(35, 172, 56);color: rgb(35, 172, 56);padding: 0.1rem"></span>-->
          </div>
          <div style="color: #999999">案例介绍：{{item.contents}}</div>
          <div style="color: #999999">时间{{item.createTime.split(' ')[0]}}</div>
        </div>
      </div>
      <div style="border-bottom: 1px solid #ededed;margin-top: 10px">
        <div>联系我们：</div>
      </div>
      <div>
        <div>联系人：</div>
        {{shopCard.name}}
      </div>
      <div>
        <div>手机号码：</div>
        {{shopCard.phone}}
      </div>
      <div>
        <div>联系QQ：</div>
        {{shopCard.qq}}
      </div>
      <div>
        <div>联系邮箱：</div>
        {{shopCard.email}}
      </div>
      <div>
        <div>固定电话：</div>
        {{shopCard.telePhone}}
      </div>
      <div>
        <div>详细地址：</div>
        {{shopCard.address}}
      </div>
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
        shopInfo:'',
        casesList:[],
        productOrderDtoList:[],
        shopCard:'',
        organInfoDto4:''
      }
    },
    methods: {
      back(){
        this.$router.go(-1)
      },
      toDetail(){
        this.$router.push('/user/local_service/shopDetail?userId='+this.$route.query.userId)
      },
      getDetail() {
        var data = {}
        data.token = this.$getkey();
        data.userId = this.$route.query.userId;

        this.$ajax(
          `${this.subUrl.bd}/opportunity/myShop`,
          data,
          res => {
            this.organInfoDto4 = res.data.organInfoDto4;
            this.casesList=res.data.casesList;
            this.productOrderDtoList=res.data.productOrderDtoList;
            this.shopCard=res.data.shopCard
          },
          this
        );
      }
    },
    mounted() {
      this.getDetail();
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
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
    height: 100%;
    overflow: scroll;
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
