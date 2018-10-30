<template>
    <div class="main">
        <div class="box">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/personal_wealth/personal_details/personal_ticketRecord' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/user/personal_wealth/personal_membersBuy/personal_membersBuy/:type' }">会员购买</el-breadcrumb-item>
                <el-breadcrumb-item v-if="this.type==1">中级会员</el-breadcrumb-item>
                <el-breadcrumb-item v-if="this.type==2">高级会员</el-breadcrumb-item>
                <el-breadcrumb-item v-if="this.type==3">黄金会员</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="type">
                <div class="first1">
                    <img :src="table.image">
                    <h3>{{table.name}}</h3>
                </div>
                <div class="first2">
                    <span>开通周期：</span>
                    <i>12个月</i>
                </div>
                <div class="first3">
                    <span>赠送商机点：</span>
                    <span>{{table.businessPoint}}</span>
                </div>
                <div class="first3">
                    <span>价格：</span>
                    <span>{{table.price}} 元</span>
                </div>
                <div class="first4">
                    <span>发布产品数：</span>
                    <span>{{table.product}} 次</span>
                </div>
                <div class="first5">
                    <span>推送次数：</span>
                    <span>{{table.push}} 次</span>
                </div>
                <div class="first6">
                    <span>发布采购次数：</span>
                    <span>{{table.purchase}} 次</span>
                </div>
                <div class="first7">
                    <span><b>微信支付</b></span>
                    <el-button @click="openVip(1)">立即开通</el-button>
                </div>
                <div class="first7">
                    <span><b>支付宝支付</b></span>
                    <el-button @click="openVip(2)">立即开通</el-button>
                </div>
                <div class="first8">
                    <span>会员服务条款</span>
                    <span>|</span>
                    <span>会员特权说明</span>
                </div>
            </div>
        </div>
        <wechatPay v-if="showCode" :chatData='chatData' @paySuccess='paySuccess'></wechatPay>
        
    </div>
</template>
<script>
import wechatPay from "@/components/user/personal_wealth/code";
export default {
  components: {
    wechatPay
  },
  data() {
    return {
      userInfo: {},
      organInfo: {},
      table: [],
      type: "",
      showCode: false
    };
  },
  methods: {
    paySuccess(e) {
      this.showCode = false;
      this.getMain();
      if (e) {
        this.getMain();
      }
    },
    getMain() {
      var data = {
        token: this.$getkey()
      };
      this.$ajax(
        `${this.subUrl.user}/asset/getVipDetailList`,
        data,
        res => {
          if (this.type == 1) {
            this.table = res.data[0];
          } else if (this.type == 2) {
            this.table = res.data[1];
          } else if (this.type == 3) {
            this.table = res.data[2];
          } else {
            this.table = res.data[0];
          }
        },
        this
      );
    },
    openVip(e) {
      //   if (!this.input1) return this.$message.error("请输入金额");
      var data = {
        token: this.$getkey(),
        optUserId: this.userInfo.guid,
        userId: this.userInfo.guid,
        vipId: this.table.guid,
        nums: 12
      };
      // 微信支付
      if (e == 1) {
        data.payType = 6;
        this.$ajax(
          `${this.subUrl.user}/asset/pcWxPayVip`,
          data,
          res => {
            var obj = res.data;
            obj.title = "微信支付";
            this.chatData = obj;
            this.showCode = true;
          },
          this
        );
        // 支付宝支付购买会员
      } else if (e == 2) {
        data.payType = 7;
        this.$ajax(
          `${this.subUrl.user}/asset/pcAliPayVip`,
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
    this.type = this.$route.params.type;
    this.getMain();
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
    .type {
      width: 30%;
      margin-left: 25%;

      .first1 {
        margin-left: 20%;
        width: 100%;
        img {
          width: 20%;
          vertical-align: middle;
        }
        h3 {
          display: inline-block;
          margin-left: 10px;
        }
      }
      .first2 {
        margin-top: 15px;
        i {
          display: inline-block;
          border: 1px solid #ddd;
          padding: 5px 80px;
          border-radius: 5px;
        }
      }
      .first3 {
        margin-top: 15px;
      }
      .first4 {
        margin-top: 15px;
      }
      .first5 {
        margin-top: 15px;
      }
      .first6 {
        margin-top: 15px;
      }
      .first7 {
        margin-top: 15px;
        margin-left: 20%;
      }
      .first8 {
        margin-top: 15px;
        margin-left: 15%;
      }
    }
  }
}
</style>

