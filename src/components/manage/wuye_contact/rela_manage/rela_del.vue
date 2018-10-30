<template>
<div id='inform_del'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>物业关系详情</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/wuye_contact/rela_manage/rela_manage' }">关系管理</el-breadcrumb-item>
            <el-breadcrumb-item>管理详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
        <div class="del_top">
          <div>状态：
             <!-- 状态 0：未绑定 1：已绑定 2：待确认 -->
              <span class="idea" v-if="del.status==0">未绑定</span>
              <span class="idea" v-if="del.status==1">已绑定</span>
              <span class="idea" v-if="del.status==2">待确认</span>
            </div>
        </div>
    <div class="del">
        <div class="del_title">
            <span>物业公司信息</span>
        </div>
      <ul class="delList clearfix">
        <li>物业公司：<span>{{proCompanyInfo.organName}}</span></li>
        <li>公司地址：<span>{{proCompanyInfo.detailAddr}}</span></li>
        <li>联系人：<span>{{proCompanyInfo.name}}</span></li>
        <li>手机号码：<span>{{proCompanyInfo.account}}</span></li>
      </ul>
    </div>
    <div class="del">
        <div class="del_title">
            <span>管理处信息</span>
        </div>
      <ul class="delList clearfix">
        <li>管理处名称：<span>{{managementInfo.organName}}</span></li>
        <li>写字楼信息：<span>{{managementInfo.buildingName}}</span></li>
        <li>管理处地址：<span>{{managementInfo.address}}</span></li>
         <!-- 写字楼性质 1:商务综合楼 2:纯写字楼 , -->
        <li>写字楼性质：<span v-text="managementInfo.type==1?'商务综合楼':'纯写字楼'"></span></li>  
        <li>管理处主任：<span>{{managementInfo.name}}</span></li>
        <li>手机号码：<span>{{managementInfo.account}}</span></li>
      </ul>
    </div>
     <div class="bandBtn" v-if="this.del.status==0">
            <el-button type="primary" @click="band(1)">绑定</el-button>
      </div>
     <div class="bandBtn" v-if="this.del.status==1" style="margin-top: 50px;">
            <el-button  type="info" @click="band(2)">解绑</el-button>
      </div>
     <div class="bandBtn" v-if="this.del.status==2&&this.del.isConfirm==1">
            <el-button type="primary" @click="band(1)">确认</el-button>
      </div>
      <div class="bandBtn" v-if='re_status==3'>
            <el-button type="primary" @click='reBand' >重新绑定</el-button>
      </div>
</div>

</template>
<script>
export default {
  data() {
    return {
      userInfo: "",
      organInfo: "",
      del: {},
      re_status:'',
      managementInfo: {},
      proCompanyInfo: {}
    };
  },
  methods: {
    //请求详情页面
    getDel() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        oaId: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.activity}/proRelManage/getProManageDetail`,
        data,
        res => {
          console.log(res, "ManageDetail");
          this.del = res.data;
          this.proCompanyInfo = res.data.proCompanyInfo;
          this.managementInfo = res.data.managementInfo;
          this.re_status=res.data.status;
        },
        this
      );
    },
    //绑定
    band(operate) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        oaId: this.$route.params.id,
        operate: operate
      };
      this.$ajax(
        `${this.subUrl.activity}/proRelManage/updateBindRel`,
        data,
        res => {
          console.log(res, "band");
          this.$message.success("操作成功");
          this.back();
        },
        this
      );
    },
    reBand(){
    	var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        oaId:this.$route.params.id,
        companyName:this.proCompanyInfo.organName,
        relation:this.proCompanyInfo.relation,
        contact:this.proCompanyInfo.name,
        mobile:this.proCompanyInfo.account
      };
      this.$ajax(
        `${this.subUrl.activity}/proRelManage/ReApplyForBinding`,
        data,
        res => {
          console.log(res, "band");
          this.$message.success("操作成功");
          this.back();
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
    this.getDel();
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
.del_top {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #fff;
  padding: 0 20px;
}
.del_title {
  // font-size: 16px;
  // font-weight: 700;
  margin-top: 20px;
  padding: 10px 40px;
  background: #fff;
  border-bottom: 1px solid #ccc;
  .idea {
    padding-left: 100px;
    font-weight: 400;
    font-size: 15px;
  }
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
.bandBtn {
  // background: #fff;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 20px 0;
  button {
    width: 150px;
  }
}
</style>