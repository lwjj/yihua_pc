<template>
  <yd-layout>
      <yd-navbar :title="mTitle" v-title='mTitle' slot="navbar" color='#fff' height='.88rem' :bgcolor='mainColor'>
        <yd-navbar-back-icon slot="left" class="addClickArea" @click.native='back' color='#fff'></yd-navbar-back-icon>
      </yd-navbar>
      <div id="agreement" v-html="content"></div>
  </yd-layout>
</template>
<script>
export default {
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    if(this.userInfo && this.userInfo.organType){
      this.mainColor = this.$color[this.userInfo.organType];
    }else{
      this.mainColor = this.$color[3];
    }
    return {
      mTitle: "",
      content: ""
    };
  },
  props:['agreementType'],
  methods: {
    back() {
      //   this.$router.go(-1);
      this.$emit("back");
    },
    getAgreeMent() {
      var data = {
        type: this.$route.query.type
      };
      console.log(this.agreementType);
      if(this.agreementType) data.type = this.agreementType;
      this.$ajax(
        `${this.subUrl.user}/comm/getProtocol`,
        data,
        res => {
          this.mTitle = res.data.title;
          var txt = res.data.content;
          txt = txt.replace(/\n/g, "<br>");
          this.content = txt;
        },
        this
      );
    }
  },
  mounted() {
    this.getAgreeMent();
    if(this.agreementType == 7 || this.agreementType == 12){
      this.mainColor = this.$color[3];
    }
  }
};
</script>
<style scoped>
.content .registerId {
  color: #0096ff;
}

.confirmButton {
  width: 3rem;
  height: 0.7rem;
  text-align: center;
  color: #fff;
  line-height: 0.7rem;
  margin: 0.9rem auto 0;
}

</style>

