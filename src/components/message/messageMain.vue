<template>
    <div id="wealth">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-if="num==1" :to="{ path:'/message/propertyMessage/:guid'}">物业消息</el-breadcrumb-item>
                <el-breadcrumb-item v-if="num==2" :to="{ path:'/message/electricityMessage/:guid'}">电商消息</el-breadcrumb-item>
                <el-breadcrumb-item v-if="num==3" :to="{ path:'/message/circleMessage/:guid'}">圈子消息</el-breadcrumb-item>
                <el-breadcrumb-item v-if="num==4" :to="{ path:'/message/platformMessage/:guid'}">平台消息</el-breadcrumb-item>
                <el-breadcrumb-item v-if="num==5" :to="{ path:'/message/pushMessage/:guid'}">推送消息</el-breadcrumb-item>
                <el-breadcrumb-item v-if="num==6" :to="{ path:'/message/newList'}">最新消息</el-breadcrumb-item>
                <el-breadcrumb-item>信息详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="first1">
                <div class="first_left1">
                    <img :src="data.organLogo" alt="">
                </div>
                <div  class="first_left2">
                    <p>日期：{{data.messageDate}}</p>
                    <p>{{data.organName}}</p>
                </div>
                <div class="clear"></div>
                <div class="first_left3">
                    <p><b>消息标题：{{data.title}}</b></p>
                    <div class="mesContent" v-html="data.content"></div>
                </div>
                <div v-if="data.businessLink">
                    <el-button @click="goSee">查看业务链接</el-button>
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
      num: "",
      data: []
    };
  },
  methods: {
    goSee() {
      if (this.data.businessLink) {
        location.href = this.data.businessLink;
      } else {
        this.$message.error("暂无业务链接");
      }
    },
    getMain() {
      if (this.$route.params.id !== undefined) {
        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          commMessageId: this.$route.params.id
        };
        this.$ajax(
          `${this.subUrl.user}/commMessage/getCommMessage`,
          data,
          res => {
            let tempDate = res.data.content ? res.data.content : "";
            tempDate = tempDate.replace(/\r\n/g, "<br/>");
            res.data.content = tempDate;
            this.data = res.data;
            console.log(this.data);
          },
          this
        );
      } else {
        this.$message({
          message: "请选择要查看的详情",
          type: "warning"
        });
        this.$router.go(-1);
      }
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getMain();
    this.num = this.$route.params.num;
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
    height: 100%;
    background: #fff;
    .first1 {
      padding-top: 30px;
      width: 500px;
      .first_left1 {
        border: 1px solid #ddd;
        width: 100px;
        height: 100px;
        float: left;
        img {
          width: 98%;
          height: 98%;
          margin-left: 1%;
          margin-top: 1%;
        }
      }
      .first_left2 {
        float: left;
        margin-left: 20px;
        margin-top: 20px;
        p {
          margin-bottom: 20px;
        }
      }
      .first_left3 {
        overflow-y: auto;
        overflow-x: hidden;
        margin-top: 10px;
        .mesContent {
          color: #666;
        }
      }
      div {
        .el-button {
          width: 500px;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
