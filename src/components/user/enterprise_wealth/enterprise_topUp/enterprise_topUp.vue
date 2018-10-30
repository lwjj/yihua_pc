<template>
    <div class="main">
        <div class="box">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/enterprise_wealth/enterprise_details/enterprise_ticketRecord' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>充值</el-breadcrumb-item>
            </el-breadcrumb> 
          <div>
            <div class="info1">
                <div class="flex mt1"><div class="mr1" style="width:100px;text-align:right">当前商机点:</div>{{sjd}}</div> 
                <div class="flex mt1"><div class="mr1" style="width:100px;text-align:right">换算比例:</div>{{rate.bp}}商机点=1元</div> 
                <div class="flex mt1"><div class="mr1" style="width:100px;text-align:right">充值金额(元):</div><el-input class="flex1" :max="100000" type='number' @input.native="setkeyDown" :maxlength="10" v-model="input1" :min='1' placeholder="最低为1"></el-input></div> 
                <div class="flex mt1"><div class="mr1" style="width:100px;text-align:right">换算商机点:</div>{{input1*rate.bp}}商机点</div>  
                <div class="flex mt1"><div class="mr1" style="width:100px;text-align:right" >微信支付:</div><el-button @click="up(1)" type=''>立即充值</el-button></div> 
                <div class="flex mt1"><div  class="mr1" style="width:100px;text-align:right">支付宝支付:</div><el-button @click="up(2)" type=''>立即充值</el-button></div> 
                </div>
            </div> 
        </div>
        <wechatPay v-if="showCode" :chatData='chatData' @paySuccess='paySuccess'></wechatPay>
        
    </div>
</template>
<script>
import wechatPay from "@/components/user/personal_wealth/code";
console.log(wechatPay);
export default {
  components: {
    wechatPay
  },
  data() {
    return {
      userInfo: {},
      organInfo: {},
      form: [],
      input1: "",
      sjd: "",
      showCode: false,
      rate: {}
    };
  },
  methods: {
    getRate() {
      this.$ajax(
        `${this.subUrl.user}/asset/getBpRate`,
        { token: this.$getkey() },
        res => {
          this.rate = res.data;
        },
        this
      );
    },
    paySuccess(e) {
      this.showCode = false;
      this.getMain();
      if (e) {
        this.getMain();
      }
    },
    setkeyDown() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timerout = setTimeout(() => {
        this.input1 = Math.ceil(this.input1.substr(0, 6));
      }, 20);
    },
    getMain() {
      var data = {
        token: this.$getkey(),
        userId: this.organInfo.organAccount
      };
      this.$ajax(
        `${this.subUrl.user}/asset/getUserAsset`,
        data,
        res => {
          this.enterpriseAll = res.data;
          this.sjd =
            this.enterpriseAll.businessPoint +
            this.enterpriseAll.conBusinessPoint;
        },
        this
      );
    },
    up(e) {
      if (!this.input1) return this.$message.error("请输入金额");
      if (this.input1 < 1) return this.$message.error("最低充值1元");
      var data = {
        token: this.$getkey(),
        optUserId: this.userInfo.guid,
        userId: this.organInfo.organAccount,
        money: this.input1
      };
      // 微信支付
      if (e == 1) {
        data.payType = 6;
        this.$ajax(
          `${this.subUrl.user}/asset/pcWxPayBp`,
          data,
          res => {
            var obj = res.data;
            obj.title = "微信支付";
            this.chatData = obj;
            this.showCode = true;
          },
          this
        );
        // 支付宝支付
      } else if (e == 2) {
        data.payType = 7;
        this.$ajax(
          `${this.subUrl.user}/asset/pcAliPayBp`,
          data,
          res => {
            var div = document.createElement("div");
            div.innerHTML = res.data;
            document.body.appendChild(div);
            document.forms[0].submit();
          },
          this
        );
      }
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getMain();
    this.getRate();
  }
};
</script>
<style lang="scss" scoped>
.clear {
  clear: both;
}
.main {
  height: 100%;
  background: #fff;
  width: 97%;
  margin-left: 2%;
  margin-top: 10px;
  .box {
    padding-top: 10px;
    padding-left: 10px;
    .info1 {
      width: 30%;
      margin-left: 20%;
      margin-top: 10px;
    }
  }
}
</style>

