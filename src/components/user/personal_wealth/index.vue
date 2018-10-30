<template>
    <div id="wealth">
        <div class="title">
            <div class="text">我的资产</div>
        </div>
        <div class="layout">
            <el-row class="header center" type="flex">
                <el-col :span="12" class="header_1">
                    <el-row class="lineCenter">
                        <el-col :span="5">
                            <p style="font-weight: bold">资产总计</p>
                        </el-col>
                        <el-col :span="12">
                          <p><span class="form_label">积分总计：</span><span class="form_label1">{{integralAll}}</span></p>
                          <p><span class="form_label">可兑积分：</span><span class="form_label1">{{enterpriseAll.conIntegral}}</span></p>
                          <p><span class="form_label">商机点总计：</span><span class="form_label1">{{businessAll}}</span></p>
                          <p><span class="form_label">可兑商机点：</span><span class="form_label1">{{enterpriseAll.conBusinessPoint}}</span></p>
                        </el-col>
                        <el-col :span="4" class="button">
                            <div>
                                <el-button size="mini" type="primary" @click="$router.push('/user/personal_wealth/personal_topUp/personal_topUp')">充值</el-button>
                            </div>
                            <div>
                                <el-button size="mini" type="primary"  style="margin:10px 0 0 0 " @click="$router.push('/user/personal_wealth/personal_ticket/personal_ticket/:sjd')">兑换</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="7" class="header_1">
                    <el-row class="lineCenter">
                        <el-col :span="7">
                            <p style="font-weight: bold">资产明细</p>
                        </el-col>
                        <el-col :span="17">
                          <p><span class="form_label">所挣商机点：</span><span class="form_label1"><span v-if="enterpriseAll.incomeBusinessPoint!==0">+</span>
                                {{enterpriseAll.incomeBusinessPoint}}</span></p>
                          <p><span class="form_label">购买商机点：</span><span class="form_label1">
                            <span v-if="enterpriseAll.buyBusinessPoint!==0">+</span>
                                {{enterpriseAll.buyBusinessPoint}}
                          </span></p>
                          <p><span class="form_label">消费商机点：</span><span class="form_label1">
                            <span v-if="enterpriseAll.consumeBusinessPoint!==0">-</span>
                                {{enterpriseAll.consumeBusinessPoint}}
                          </span></p>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="7" class="header_2">
                    <div>
                        <el-button size="mini" type="primary" @click="$router.push('/user/personal_wealth/personal_membersBuy/personal_membersBuy/:type')">会员购买</el-button>
                    </div>
                    <div>
                        <el-button size="mini" type="primary"  style="margin:10px 0 0 0 " @click="$router.push('/user/personal_wealth/personal_BusinessModule/personal_BusinessModule/:guid/:name/:title/:sjd')">业务模块</el-button>
                    </div>
                </el-col>
            </el-row>
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      organInfo: {},
      enterpriseAll: {
        businessPoint: "",
        conBusinessPoint: "",
        incomeBusinessPoint: "",
        buyBusinessPoint: "",
        consumeBusinessPoint: "",
        integral: "",
        conIntegral: ""
      },
      businessAll: 0,
      integralAll: 0
    };
  },
  methods: {
    getDetails() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/asset/getUserAsset`,
        data,
        res => {
          this.enterpriseAll = res.data;
          this.businessAll =
            this.enterpriseAll.businessPoint +
            this.enterpriseAll.conBusinessPoint;
          this.integralAll =
            this.enterpriseAll.integral + this.enterpriseAll.conIntegral;
        },
        this
      );
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
  }
};
</script>
<style lang="scss" scoped>
#wealth {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
}
.lineCenter a,
.lineCenter p {
  line-height: 24px;
  display: block;
  height: 24px;
}
.layout {
  height: 100%;
  position: relative;
  overflow: auto;
}
.header {
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 15px;
  border-bottom: #999999 1px dashed;
  p {
    font-weight: normal;
  }
  .form_label {
    width: 100px;
    float: left;
    text-align: right;
  }
  .form_label1 {
    width: 80px;
    float: left;
    text-align: left;
  }
  a {
    display: block;
  }
  .header_a2 {
    margin-top: 10px;
  }
  .header_a3 {
    margin-top: 6px;
  }
  .header_1 {
    background: #fff;
    padding: 12px 0;
    height: 100px;
    border-right: 1px solid #f2f2f2;
    margin-right: 13px;
    .button p {
      border: 1px solid #ddd;
      width: 65px;
      padding: 5px 0;
      margin-bottom: 5px;
      margin-left: 20px;
    }
  }
  .header_2 {
    p {
      background: #fff;

      padding: 12px 0;
    }
  }
}
.bottom {
  margin-top: 10px;
  height: auto;
  margin-left: 2%;
  margin-right: 1.5%;
  background: #fff;
  .el-row {
    .el-col {
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
