<template>
<div id='inform_del'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>通知详情</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item @click.native='$router.go(-1)'>返回</el-breadcrumb-item>
            <el-breadcrumb-item>通知详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="del" v-show="show">
        <div class="del_title" v-if="informDel.noticeBill">
            <h4>{{informDel.noticeBill.noticeTitle}}</h4>
        </div>
      <ul class="delList clearfix" v-if="informDel.noticeBill">
        <!--  状态(0,待提交（草稿）1,待审批；2同意；3，不同意) , -->
        <li>
          <a>状态：</a>
          <span v-if="informDel.noticeBill.status == 0">草稿</span>
          <span v-if="informDel.noticeBill.status == 1">待审批</span>
          <span v-if="informDel.noticeBill.status == 2">同意</span>
          <span v-if="informDel.noticeBill.status == 3">不同意</span>
        </li>
        <li><a>关键词：</a><span>{{informDel.noticeBill.keyword}}</span></li>
        <li><a>发布时间：</a><span>{{informDel.noticeBill.createDate}}</span></li>
        <li><a>签发部门：</a><span>{{informDel.noticeBill.deptName}}</span></li>
        <li><a>单号：</a><span>{{informDel.noticeBill.guid}}</span></li>
        <li v-if="informDel.noticeBill.noticeDeptName"><a>通知部门：</a><span>{{informDel.noticeBill.noticeDeptName}}</span></li>
        <li  v-if="informDel.noticeBill.noticeCusName"><a>通知客户：</a><span>{{informDel.noticeBill.noticeCusName}}</span></li>
        <li ><a>通知员工：</a><span>{{informDel.noticeBill.noticeEmpName }}</span></li> 
      </ul>
      <div class="info" v-if="informDel.noticeBill">
        <p>{{informDel.noticeBill.noticeContent}}</p>
        <vue-preview class='imgPath' :slides="sliders" v-if='sliders'  @close="''"></vue-preview>
      </div>
      <div class="zhengwen" style="padding:0 50px" v-if="informDel.noticeBill&&informDel.noticeBill.directorComment">
        审批意见：{{informDel.noticeBill.directorComment }}
      </div>
       <div class="bgwhite" style="padding: 0px 50px 20px" v-if='informDel.tasks'>
          <el-input placeholder="请输入审批意见" type="textarea" class="mb2" resize="none" :rows="4" :maxlength="300" v-model="suggest"></el-input>
          <el-button type="primary" class="mt1" @click="send(1)">同意</el-button>
          <el-button type="danger" class="mt1" @click="send(0)">拒绝</el-button>
      </div>
    </div>
</div>


</template>
<script>
import sendMen from "../../choose_people/choose_employ";
export default {
  components: {
    sendMen
  },
  data() {
    return {
      suggest: "",
      sliders: [],
      isFirst: false,
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
    send(e) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        noticeBillId: this.informDel.noticeBill.guid,
        opinion: e ? "同意" : "拒绝",
        organId: this.userInfo.guid,
        commen: this.suggest
      };
      this.$ajax(
        `${this.subUrl.activity}/noticeBill/manageApprove`,
        data,
        res => {
          this.$message.success("审批成功");
          this.getInfoDel();
        },
        this
      );
    },
    sendMen(checkList) {
      this.show = true;
      this.sendShow = false;
      let arr = [];
      checkList.forEach(ele => {
        arr.push(ele.split(",")[0]);
      }, this);
      this.userIdListId = arr.join(",");

      var data = {
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
          this.$message.success("转发成功");
        },
        this
      );
    },
    //请求详情页面
    getInfoDel() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        noticeBillId: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.activity}/noticeBill/getNoticeBillDetail`,
        data,
        res => {
          this.informDel = res.data;
          this.$setImg(res.data.accessoryFiles, this);
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
  a {
    display: inline-block;
    width: 80px;
    text-align: right;
  }
  span {
    padding-left: 20px;
  }
}
.info {
  padding: 20px 50px;
  background: #fff;
  margin: 20px 0 0;
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
      width: 150;
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