<template>
    <div class="main">
        <div class="box">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/enterprise_wealth/enterprise_details/enterprise_ticketRecord' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>兑换</el-breadcrumb-item>
            </el-breadcrumb> 
             <div class="info">
                <div class="flex_list">
                    <div class="label">当前默认收款账号</div>
                    <div class="right"><el-button size="mini" type="text" @click="$router.push('/user/enterprise_wealth/enterprise_ticket/enterprise_account')">点击查看</el-button></div>
                </div>
                 <div class="flex_list">
                    <div class="label">可兑换的商机点：{{sjd}}</div>
                    <div class="right"><el-button size="mini" type="text" @click="all">全部兑换</el-button></div>
                </div>
             </div> 
             <div class="info1">

                <div class="flex_list">
                    <div class="label">兑换商机点</div>
                    <div class="right">

                      <input v-model="input1" type="number" name="" placeholder="最低为1" maxlength="12" @keyup="onkeyup1" style="width:255px;height:40px">

                    </div>
                </div>
                <div class="tip">{{rate.bp}}商机点=1元</div> 
                <div class="flex_list">
                    <div class="label">换算金额</div>
                    <div class="right">
                        <el-input v-model="input3" disabled>
                            <template slot="append">元</template>
                        </el-input>
                    </div>  
                </div>
                <div class="tip">提示:通常2个工作日即可，账户不同稍有差异，请关注短信通知</div>
                <div style="color:#999">提现起步金额:{{cwa}}</div>
                    <div class="flex_list">
                        <div class="label">兑换总额 ¥{{input3}}</div>
                        <div class="right"><el-button @click="exchange">立即兑换</el-button></div>
                    </div>
             </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      organInfo: {},
      input1: "",
      sjd: "",
      collection: "",
      input3: 0,
      rate: {},
      cwa:''
    };
  },
  updated() {
    this.input3 = parseFloat(this.input1 / this.rate.bp).toFixed(2);
  },
  methods: {
    onkeyup1(){
      this.input1 = this.input1.replace(/\D/g,'');
      if(this.input1>this.sjd) this.input1 = this.sjd;
    },
    getDetails() {
      var data = {
        token: this.$getkey(),
        userId: this.organInfo.organAccount
      };
      this.$ajax(
        `${this.subUrl.user}/asset/getUserAsset`,
        data,
        res => {
          this.sjd = res.data.conBusinessPoint;
          this.cwa = res.data.cwa;
        },
        this
      );
    },
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
    exchange() {
      if (this.collection.accountName == "") {
        this.$message({
          message: "收款账户为空请去设置",
          type: "errorr"
        });
        if (this.input1 < 0) {
          this.$message({
            message: "兑换金额最低为1",
            type: "errorr"
          });
        }
      } else {
        var data = {
          token: this.$getkey(),
          userId: this.organInfo.organAccount,
          businessPoint: this.input1
        };
        this.$ajax(
          `${this.subUrl.user}/asset/exchange`,
          data,
          res => {
            console.log(res.data);
            if (res.code == 1) {
              this.$message({
                message: "兑换成功",
                type: "success"
              });
              this.$router.push({
                name: "enterprise_success",
                params: { sjd: this.input1 }
              });
            }
          },
          this
        );
      }
    },
    all() {
      this.input1 = this.sjd;
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getDetails();
    console.log(this.organInfo);
    this.getRate();
  }
};
</script>
<style lang="scss" scoped>
.main {
  height: 100%;
  background: #fff;
  width: 97%;
  margin-left: 2%;
  margin-top: 10px;
  .box {
    padding-top: 10px;
    padding-left: 10px;
    .info {
      width: 30%;
      margin-left: 20%;
      margin-top: 40px;
    }
    .info1 {
      width: 30%;
      margin-left: 20%;
      margin-top: 10px;
    }
  }
}
.info span {
  line-height: 40px;
}
.flex_list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  .label {
    white-space: nowrap;
    margin-right: 5px;
  }
}
.tip {
  color: #999;
  margin-bottom: 10px;
}
</style>

