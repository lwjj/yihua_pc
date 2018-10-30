<template>
    <div id="wealth">
        <div class="title">
            <div class="text">我的卡劵</div>
        </div>
        <div class="box">
            <div class="first1">
                <div>
                    <el-button @click="go(1)" :autofocus="isActive == 1">
                        <img src="../../../assets/images/rent/my/coupon.png" alt="">
                        <span>优惠券</span>
                    </el-button>
                </div>
                <div>
                    <el-button @click="go(2)" :autofocus="isActive == 2">
                        <img src="../../../assets/images/rent/my/mem.png" alt="">
                        <span>会员卡</span>
                    </el-button>
                </div>
                <div>
                    <el-button @click="go(3)" :autofocus="isActive == 3">
                        <img src="../../../assets/images/rent/my/call.png" alt="">
                        <span>名片</span>
                    </el-button> 
                </div>
            </div>
            <div class="clear"></div>
            <div class="first2">
                <router-view @receive='receive'></router-view>
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
      tableData: [],
      myCoupons: 0,
      myMembers: 0,
      myCard: 0,
      isActive: 1
    };
  },
  methods: {
    receive() {
      this.coupons();
    },
    coupons() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        type: 1
      };
      this.$ajax(
        `${this.subUrl.user}/userCoupon/listUserCoupon`,
        data,
        res => {
          this.myCoupons = res.data.rowCount;
          console.log(this.myCoupons);
        },
        this
      );
    },
    getActive(a) {
      if (a.path.indexOf("cardVolume_myCoupons") > -1) {
        this.isActive = 1;
      } else if (a.path.indexOf("cardVolume_myMembers") > -1) {
        this.isActive = 2;
      } else if (a.path.indexOf("cardVolume_myCard") > -1) {
        this.isActive = 3;
      }
    },
    members() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        type: 2
      };
      this.$ajax(
        `${this.subUrl.user}/userCoupon/listUserCoupon`,
        data,
        res => {
          this.myMembers = res.data.rowCount;
          console.log(this.myMembers);
        },
        this
      );
    },
    // 获取名片数量
    card() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        type: 3
      };
      this.$ajax(
        `${this.subUrl.user}/userCoupon/listUserCard`,
        data,
        res => {
          this.myCard = res.data.rowCount;
          console.log(this.myCard);
        },
        this
      );
    },
    go(n) {
      if (n == 1) {
        this.$router.push({ path: "/user/cardVolume/cardVolume_myCoupons" });
      } else if (n == 2) {
        this.$router.push({ path: "/user/cardVolume/cardVolume_myMembers" });
      } else if (n == 3) {
        this.$router.push({ path: "/user/cardVolume/cardVolume_myCard" });
      }
    }
  },
  watch: {
    $route: function(a) {
      this.getActive(a);
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    // this.coupons();
    // this.members();
    // this.card();
    this.getActive(this.$route);
  }
};
</script>
<style lang="scss" scoped>
.clear {
  clear: both;
}
#wealth {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: auto;
  .box {
    margin-top: 10px;
    margin-left: 1%;
    height: 100%;
    background: #fff;
    .first1 {
      overflow: hidden;
      padding: 10px 0;
      div {
        float: left;
        margin-right: 20px;
        .el-button {
          width: 200px;
          img {
            height: 40px;
            vertical-align: middle;
          }
        }
      }
    }
    .first2 {
      position: relative;
      height: calc(100% - 88px);
    }
  }
} 
</style>
