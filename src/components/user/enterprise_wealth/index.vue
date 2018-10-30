<template>
    <div id="wealth">
        <div class="title">
            <div class="text">企业财富</div>
        </div>
        <div class="layout">
            <el-row class="header center" type="flex">
                <el-col :span="10" class="header_1">
                    <el-row>                 
                        <el-col :span="6">
                            <img src="" alt="">
                            <p>资产总计</p>
                        </el-col>
                        <el-col :span="6" class=
                        "header_a1">
                            <a>商机点总计</a>
                            <a>可兑商机点</a>
                        </el-col>
                        <el-col :span="6" class=
                        "header_a2">
                            <p>{{businessAll}}</p>
                            <p>{{enterpriseAll.conBusinessPoint}}</p>
                        </el-col>
                        <el-col :span="6" class="button">
                            <div>
                                <el-button size="mini" type="primary" @click="$router.push('/user/enterprise_wealth/enterprise_topUp/enterprise_topUp')">充值</el-button>
                            </div>
                            <div class="mt1">
                                <el-button size="mini" type="primary" @click="$router.push('/user/enterprise_wealth/enterprise_ticket/enterprise_ticket/:sjd')">兑换</el-button>
                            </div>
                            <!-- <router-link to="/user/enterprise_wealth/enterprise_topUp/enterprise_topUp"><p>充值</p></router-link>
                            <router-link to="/user/enterprise_wealth/enterprise_ticket/enterprise_ticket/:sjd"><p>兑换</p></router-link> -->
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="10" class="header_1">
                    <el-row>
                        <el-col :span="8">
                            <img src="" alt="">
                            <a>资产明细</a>
                        </el-col>
                        <el-col :span="8">
                            <p>所挣商机点</p>
                            <p>购买商机点</p>
                            <p>消费商机点</p>
                        </el-col>
                        <el-col :span="8" class="header_a3">
                            <p>
                                <span v-if="enterpriseAll.incomeBusinessPoint!==0">+</span>
                                {{enterpriseAll.incomeBusinessPoint}}
                            </p>
                            <p>
                                <span v-if="enterpriseAll.buyBusinessPoint!==0">+</span>
                                {{enterpriseAll.buyBusinessPoint}}
                            </p>
                            <p>
                                <span v-if="enterpriseAll.consumeBusinessPoint!==0">-</span>
                                {{enterpriseAll.consumeBusinessPoint}}
                            </p>
                        </el-col> 
                    </el-row> 
                </el-col>
                <el-col :span="3" class="header_2">
                    <div>
                        <el-button size="mini" type="primary" @click="$router.push('/user/enterprise_wealth/enterprise_membersBuy/enterprise_membersBuy/:type')">会员购买</el-button>
                    </div>
                    <div class="mt1">
                        <el-button size="mini" type="primary" @click="$router.push('/user/enterprise_wealth/enterprise_BusinessModule/enterprise_BusinessModule/:guid/:name/:title/:sjd')">业务模块</el-button>
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
      businessAll: 0
    };
  },
  methods: {
    getDetails() {
      var data = {
        token: this.$getkey(),
        userId: this.organInfo.organAccount
      };
      this.$ajax(
        `${this.subUrl.user}/asset/getUserAsset`,
        data,
        res => {
          this.enterpriseAll = res.data;
          this.businessAll =
            this.enterpriseAll.businessPoint +
            this.enterpriseAll.conBusinessPoint;
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
.layout {
  overflow: auto;
  position: relative;
  .header {
    border-bottom: 1px dashed #ddd;
  }
  height: 100%;
}
.lineCenter a,
.lineCenter p {
  line-height: 24px;
  display: block;
  height: 24px;
}
#wealth {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
}
.header {
  padding-left: 10px;
  padding-top: 10px;
  p {
    font-weight: bold;
  }
  a {
    display: block;
  }
  .header_a1 {
    margin-top: 15px;
  }
  .header_a2 {
    margin-top: 20px;
  }
  .header_a3 {
    margin-top: 6px;
  }
  .header_1 {
    background: #fff;
    padding: 12px 0;
    height: 100px;
    margin-right: 13px;
    .button p {
      border: 1px solid #ddd;
      width: 65px;
      padding: 5px 0;
      margin-bottom: 5px;
      margin-left: 60px;
    }
  }
  .header_2 {
    p {
      background: #fff;
      margin-bottom: 10px;
      padding: 12px 0;
    }
  }
}
.bottom {
  margin-top: 10px;
  height: 100%;
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
