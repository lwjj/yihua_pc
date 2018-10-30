<template>
<div id='inform_del'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>通知详情</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/wuye_contact/rela_manage/rela_manage' }">物业通知</el-breadcrumb-item>
            <el-breadcrumb-item>通知详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="del" v-show="show">
        <div class="del_title">
            <h4>{{informDel.title}}</h4>
        </div>
      <ul class="delList clearfix">
        <li>关键词：<span>{{informDel.keyword}}</span></li>
        <li>发布时间：<span>{{informDel.createDate}}</span></li>
        <li>物业公司：<span>{{informDel.organName}}</span></li>
        <li>单号：<span>{{informDel.guid}}</span></li>
      </ul>
      <div class="info">
        <p>{{informDel.noticeContent}}</p>
        <ul class="photo clearfix" >
            <li v-for="(item,index) in informDel.commAccessoryList" :key="index">
                <img :src="item.path" alt="">
            </li>
        </ul>
      </div>
      <div class="btn">
          <el-button type="primary" @click="send">转发</el-button>
      </div>
    </div>
    <sendMen v-show="sendShow" @checkMen="sendMen"></sendMen>
</div>


</template>
<script>
import sendMen from "../../../choose_people/choose_employ";
export default {
  components: {
    sendMen
  },
  data() {
    return {
      show: true,
      sendShow: false,
      userInfo: "",
      organInfo: "",
      informDel: {},
      userIdListId: ""
    };
  },
  methods: {
    // 转发
    send() {
      this.show = false;
      this.sendShow = true;
    },
    sendMen(checkList) {
      this.show = true;
      this.sendShow = false;
      let arr = [];
      checkList.forEach(ele => {
        arr.push(ele.split(",")[0]);
      }, this);
      this.userIdListId = arr.join(",");

      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        propertyNoticeId: this.$route.params.id,
        userIdList: this.userIdListId
      };
      this.$ajax(
        `${this.subUrl.activity}/propertyNotice/forwardByManage`,
        data,
        res => {
          console.log(res, "forwardByManage");
          this.$message.success("转发成功");
        },
        this
      );
    },
    //请求详情页面
    getInfoDel() {
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        organType: this.organInfo.organType,
        propertyNoticeId: this.$route.params.id
      };
      console.log(data, "infodel");
      this.$ajax(
        `${this.subUrl.activity}/propertyNotice/getNoticeDetail`,
        data,
        res => {
          console.log(res, "res");
          this.informDel = res.data;
        },
        this
      );
    },
    back() {
      this.$router.go(-1);
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getInfoDel();
  }
};
</script>
<style lang="scss" scoped>
#inform_del {
  height: 100%;
  padding-left: 280px;
  padding-right: 20px;
  overflow: scroll;
  .text {
    i {
      padding: 20px 20px;
    }
  }
}
.del {
  padding-bottom: 200px;
}
.del_title {
  margin-top: 20px;
  padding: 10px 40px;
  background: #fff;
  border-bottom: 1px solid #ccc;
}
.delList {
  background: #fff;
  padding: 20px 50px;
  li {
    width: 50%;
    padding: 5px 0;
    float: left;
  }
  span {
    padding-left: 20px;
  }
}
.info {
  padding: 20px 50px;
  background: #fff;
  margin: 20px 0;
  p {
    padding: 5px 5px 100px 5px;
    border: 1px solid #ccc;
  }
}
.photo {
  li {
    float: left;
    margin: 10px 10px;
    border: 1px solid #ccc;
    img {
      width: 150px;
      height: 150px;
      display: block;
    }
  }
}
.btn {
  text-align: center;
  // button{
  //     width: 200px;
  // }
}
</style>
