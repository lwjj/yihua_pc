<template>
    <div class="main">
        <div class="box">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/enterprise_wealth/enterprise_details/enterprise_ticketRecord' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/user/enterprise_wealth/enterprise_BusinessModule/enterprise_BusinessModule/:guid/:name/:title/:sjd' }">业务办理</el-breadcrumb-item>
                <el-breadcrumb-item>业务开通</el-breadcrumb-item>
            </el-breadcrumb>
           <div class="info">
                <div class="first1">
                    <!-- <i>{{title}}</i> -->
                    <span>{{name}}</span>
                </div>
                <div class="first2">
                    <span>开通周期</span>
                    <!-- <el-button @click="getm(1)">6个月</el-button> -->
                    <el-button size="mini" autofocus @click="getm(2)">12个月</el-button>
                </div>
                <div class="first4">
                    <span>商机点</span>
                    <span style="width:70px">{{sjd}}点/月</span> 
                    <!-- <el-button size="mini" type="primary" @click="buyModule">立即开通</el-button> -->
                    <el-button type="primary" @click="open2">立即开通</el-button>
                </div>
                <!-- <div class="first5">
                    <span>会员服务条款 | 会员特权说明</span>
                </div> -->
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
      guid: "",
      title: "",
      name: "",
      sjd: "",
      num: 0
    };
  },
  methods: {
    open2() {
        this.$confirm(`确定消费${this.sjd*12}商机点开通此模块？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.buyModule()
          this.$message({
            type: 'success',
            message: '开通成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      },
    getm(num) {
      if (num == 1) {
        this.num = 6;
      } else {
        this.num = 12;
      }
    },
    buyModule() {
      if (this.num == 2) {
        this.$message({
          message: "请选择月份",
          type: "error"
        });
      } else {
        var data = {
          token: this.$getkey(),
          userId: this.organInfo.organAccount,
          busId: this.guid,
          num: this.num,
          payType: 4
        };
        this.$ajax(
          `${this.subUrl.user}/asset/payBusiness`,
          data,
          res => {
            this.$message({
              message: "开通成功",
              type: "success"
            });
            this.$router.push({
              path:
                "/user/enterprise_wealth/enterprise_BusinessModule/enterprise_BusinessModule/:guid/:name/:title/:sjd"
            });
          },
          this
        );
      }
    }
  },
  updated() {},
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    console.log(this.organInfo);
    this.guid = this.$route.params.guid;
    this.name = this.$route.params.name;
    this.title = this.$route.params.title;
    this.sjd = this.$route.params.sjd;
    if (this.guid == undefined) {
      this.$router.push({ name: "enterprise_BusinessModule" });
      this.$message({
        message: "请选择要开通的业务",
        type: "warning"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  background: #fff;
  margin-top: 10px;
  .box {
    padding-top: 10px;
    padding-left: 10px;
    .info {
      & > div {
        & > span {
          width: 60px;
          text-align: right;
          display: inline-block;
        }
      }
      .first1 {
        text-align: left;
        span {
          width: auto;
        }
        i {
          display: inline-block;
          width: 60px;
          height: 60px;
          line-height: 60px;
          background: #ddd;
          border-radius: 50%;
          font-size: 16px;
          font-weight: bold;
        }
        span {
          margin-left: 10px;
          font-size: 16px;
        }
      }
      .first2 {
        margin-top: 20px;
        span {
          margin-right: 10px;
        }
      }
      .first3 {
        margin-top: 20px;
        span {
          margin-right: 10px;
        }
      }
      .first4 {
        text-align: left;
        margin-top: 20px;
      }
      .first5 {
        text-align: left;
        margin-top: 20px;
      }
    }
  }
}
</style>
