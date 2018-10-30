<template>
    <div class="main">
        <div class="box">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/personal_wealth/personal_details/personal_ticketRecord' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>兑换</el-breadcrumb-item>
            </el-breadcrumb>

            <div class="info">
                <div class="flex_list">
                    <div class="label">当前默认收款账号</div>
                    <div class="right"><el-button size="mini" type="text" @click="$router.push('/user/personal_wealth/personal_ticket/personal_account')">点击查看</el-button></div>
                </div>
                <div class="flex_list">
                    <div class="label">可兑换的商机点：{{sjd}}</div>
                    <div class="right"><el-button size="mini" type="text" @click="all(1)">全部兑换</el-button></div>
                </div>
                 <div class="flex_list">
                    <div class="label">可兑换的积分：{{integral}}</div>
                    <div class="right"><el-button size="mini" type="text" @click="all(2)">全部兑换</el-button></div>
                </div>  
            </div>
            
            <!-- 兑换积分 -->
            <div class="info1">
                 <div class="flex_list">
                    <div class="label">兑换商机点</div>
                    <div class="right">
                      <!-- <el-input  v-model="input1" type="number" name="" placeholder="最低为1" maxlength="12" @keyup="onkeyup" @change="isMax"></el-input> -->
                      <input v-model="input1" type="number" name="" placeholder="最低为1" maxlength="12" @keyup="onkeyup1" style="width:240px;height:40px">

                    </div>
                </div>
                <div class="tip">{{rate.bp}}商机点=1元</div>

                 <div class="flex_list">
                    <div class="label">兑换积分</div>
                    <div class="right">
                      <!-- <el-input v-model="input2" :min="1" placeholder="最低为1" maxlength="12" :max="integral" @change="isMax"></el-input> -->
                      <input v-model="input2" type="number" name="" placeholder="最低为1" maxlength="12" @keyup="onkeyup2" style="width:240px;height:40px" />
                    </div>
                </div>
                <div class="tip">{{rate.integral}}积分=1元</div>
                <div class="flex_list">
                    <div class="label">换算金额</div>
                    <div class="right">
                        <el-input v-model="input3" disabled>
                            <template slot="append">元</template>
                        </el-input>
                    </div>
                </div>
                <div class="tip">提示:通常2个工作日即可，账户不同稍有差异，请关注短信通知</div>
                <div class="tip">提现起步金额：{{qibujin}}元</div>
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
      input2: "",
      input3: 0,
      sjd: "",
      integral: "",
      collection: "",
      rate: {},
      qibujin: ""
    };
  },
  methods: {
    onkeyup1(){
      this.input1 = this.input1.replace(/\D/g,'');
      if(this.input1>this.sjd) this.input1 = this.sjd;
    },
    onkeyup2(){
      this.input2 = this.input2.replace(/\D/g,'');
      if(this.input2>this.integral) this.input2 = this.integral;
        
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
    getDetails() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/asset/getUserAsset`,
        data,
        res => {
          this.sjd = res.data.conBusinessPoint;
          //可兑换积分
          this.integral = res.data.conIntegral;
          this.qibujin = res.data.cwa
          console.log(res.data,"ras.aaaaaaaaaaaaaaaaaaaaaa")
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
          userId: this.userInfo.guid,
          businessPoint: this.input1,
          integral: this.input2
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
                name: "personal_success",
                params: { sjd: this.input3 }
              });
            }
          },
          this
        );
      }
    },
    all(n) {
      if (n == 1) {
        this.input1 = this.sjd;
      }
      if (n == 2) {
        this.input2 = this.integral;
      }
    }
  },
  updated() {
    this.input3 = parseFloat(
      this.input1 / this.rate.bp + this.input2 / this.rate.integral
    ).toFixed(2);
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

