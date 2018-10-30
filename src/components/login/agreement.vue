<template>
  <div class="protocel">
    <div class="contentBox">
      <h1 style="text-align:center">
        <span>{{info.title}}</span>
        <i @click="close" style="font-size:30px;float:right" class="el-icon-close cursor"></i>
      </h1>
      <div class="content" v-html="info.content">
        
      </div>
    </div>
  </div>
</template>
<script>
export default {
  //  类型 1：操作手册 2：法律声明 3：关于我们 4：百事通 5：八爪圈 6：平台充值协议
  //  7：注册协议 8：产品/服务发布协议 9：安装协议 10：服务协议 11：发布采购/招标协议 12：隐私协议
  props: ["type"],
  data() {
    return {
      info: {}
    };
  },
  methods: {
    close() {
      this.$emit("closeXieyi");
    },
    getProtel() {
      this.type = this.type ? this.type : 1;
      this.$ajax(
        `${this.subUrl.user}/comm/getProtocol`,
        { type: this.type },
        res => {
          console.log(res);
          this.info = res.data;
        },
        this
      );
    }
  },
  mounted() {
    this.getProtel();
  }
};
</script>
<style lang="scss" scoped>
.protocel {
  position: fixed;
  transform: translate(0, 0, 0);
  background: rgba(0, 0, 0, 0.3);
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 20;
}
.contentBox {
  position: absolute;
  left: 10%;
  right: 10%;
  top: 10%;
  bottom: 10%;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  padding: 20px;

  box-sizing: border-box;
  .content {
    word-break: break-all;
    position: absolute;
    left: 0;
    right: 0;
    top: 50px;
    bottom: 0;
    padding: 20px;

    overflow: auto;
  }
  * {
    word-break: break-all;
  }
}
</style>

