<template>
    <div class="mask">
        <div class="chatBox">
            <div class="chatTitle"><span>{{chatData.title}}</span><i @click='back' class="el-icon-close"></i></div>
            <img :src="`${baseUrl}/user/comm/getQRcode?data=${chatData.codeUrl}`" class="chatCode" width="215" height="215" alt="支付">
        </div>
    </div>
</template>
<script>
export default {
  props: ["chatData"],
  data() {
    return {};
  },
  methods: {
    back() {
      this.endTime();
      this.$emit("paySuccess");
    },
    paySuccess() {
      this.$emit("paySuccess", { paymoney: "success" });
    },
    startTime() {
      if (!this.timer) {
        this.timer = setInterval(() => {
          this.getState();
        }, 2000);
      }
    },
    getState() {
      this.xhr
        .post(
          `${this.subUrl.user}/asset/getOrderState`,
          this.$qs.stringify({
            token: this.$getkey(),
            orderId: this.chatData.orderId
          })
        )
        .then(res => {
          if (res.data.code == 1 && res.data.data == 1) {
            this.$message.success("支付成功");
            this.back();
          }
        });
    },
    endTime() {
      console.log(11);
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  beforeDestroy() {
    this.endTime();
  },
  watch: {
    chatData: function() {
      this.startTime();
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.startTime();
  }
};
</script>
<style>
.chatTitle {
  line-height: 50px;
  height: 50px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
}
.chatTitle i {
  float: right;
  font-size: 30px;
  cursor: pointer;
}
.chatBox {
  background: #fff !important;
  border-radius: 10rpx;
  padding: 20px;
}
.chatBox .chatCode {
  display: block;
  margin: 0 auto;
}
</style>
