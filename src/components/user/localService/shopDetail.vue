<template>
  <div id="new_progress" style="overflow: auto;">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native="back">返回</el-breadcrumb-item>
        <el-breadcrumb-item>产品中心</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="contact" style="margin-top: 10px;padding: 0.2rem">

      <div style="display: flex;flex-wrap: wrap;max-width: 600px;margin-bottom: 20px">
        <div style="width: 120px;padding: 10px" v-if="details.length>0" v-for="item,index in details" :key="index">
          <img style="width: 100%;height: 100px" :src="item.img" alt="">
          <div style="text-align: center">{{item.title}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        userInfo: '',
        organInfo: '',
        details: '',
        shopInfo:'',
        casesList:[],
        productOrderDtoList:[],
        shopCard:'',
        organInfoDto4:''
      }
    },
    methods: {
      back(){
        this.$router.go(-1)
      },
      getDetail() {
        var data = {}
        data.token = this.$getkey();
        data.userId = this.$route.query.userId;
        data.pageNo=1;
        data.pageSize=100;

        this.$ajax(
          `${this.subUrl.bd}/opportunity/moreProduct`,
          data,
          res => {
            this.details = res.data;
          },
          this
        );
      }
    },
    mounted() {
      this.getDetail();
      this.userInfo = JSON.parse(decodeURIComponent(localStorage.getItem('userInfo')));
      this.organInfo = JSON.parse(decodeURIComponent(localStorage.getItem('organInfo')));
    }
  }
</script>
<style scoped>
  .right-btn {
    margin-left: 25px;
    border-radius: 5px;
    border: 1px solid rgb(35, 172, 56);
    width: 70px;
    text-align: center!important;
    line-height: 30px;
    cursor: pointer;
  }

  .content {
    padding: 20px 30px;
    margin: 20px 0;
    background: #fff;
  }

  #new_progress {
    padding-left: 300px;
    padding-right: 40px;
    height: 100%;
    overflow: scroll;
  }

  .contact {
    width: 100%;
    margin-bottom: .2rem;
    background: white;
  }

  .contact > div {
    display: flex;
    line-height: 30px
  }

  .contact > div > div {
    color: #999999;
    text-align: right;
  }
</style>
