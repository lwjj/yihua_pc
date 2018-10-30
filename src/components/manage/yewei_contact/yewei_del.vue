<template>
<div id='inform_del'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>物业关系详情</div> -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/yewei_contact' }">业主往来</el-breadcrumb-item>
            <el-breadcrumb-item>机构详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
        <div class="del_top">
          <div>状态：
             <!-- 状态  0：未绑定 1：已绑定 2：待确认 -->
              <span class="idea" v-if="bindStatus==0">未绑定</span>
              <span class="idea" v-if="bindStatus==1">已绑定</span>
              <span class="idea" v-if="bindStatus==2">待确认</span>
            </div>
        </div>
    <div class="del">
        <div class="del_title">
            <span>业委会信息</span>
        </div>
      <ul class="delList clearfix">
        <li>业委会<span>{{ownersComInfo.organName}}</span></li>
        <li>联系人：<span>{{ownersComInfo.name}}</span></li>
        <li>手机号码：<span>{{ownersComInfo.account}}</span></li>
        <li>联系地址：<span>{{ownersComInfo.address}}</span></li>
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
        <li>建筑面积：<span>{{managementInfo.area}}（平方米）</span></li>
         <!-- 写字楼性质 1:商务综合楼 2:纯写字楼 , -->
        <li>写字楼性质：<span v-text="managementInfo.type==1?'商务综合楼':'纯写字楼'"></span></li>  
        <li>管理处主任：<span>{{managementInfo.name}}</span></li>
        <li>手机号码：<span>{{managementInfo.account}}</span></li>
      </ul>
    </div>
     <!-- <div class="unBandBtn" v-if="bindStatus==0">
            <el-button type="primary" @click="unBand(1)">绑定</el-button>
      </div> -->
     <div class="unBandBtn" v-if="bindStatus==1">
            <el-button  type="primary" @click="openBox">解绑</el-button>
      </div>
     <!-- <div class="unBandBtn" v-if="bindStatus==2&&this.del.isConfirm==1">
            <el-button type="primary" @click="unBand(1)">确认</el-button>
      </div> -->
</div>

</template>
<script>
export default {
  data() {
    return {
      userInfo: "",
      organInfo: "",
      del:{},
      managementInfo: {},
      ownersComInfo: {},
      bindStatus:""
    };
  },
  methods: {
     // 业委会设置     0：未绑定 1：已绑定 2：待确认
    setYewei(){ 
       let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
      };
      this.$ajax(
        `${this.subUrl.activity}/ownersCom/relation/info`,
        data,
        res => {
          console.log(res, "setYewei");
          this.bindStatus = res.data.status;
          this.ownersComInfo = res.data.ownersComInfo;
          this.managementInfo = res.data.managementInfo;
        },
        this
      );
    },
    // 弹窗
    openBox() {
        this.$confirm('是否确定和当前业委会解绑?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center:true
        }).then(() => {
            this.unBand();
          this.$message({
            type: 'success',
            message: '解绑成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消解绑'
          });          
        });
      },
    //解绑
    unBand() {
      var data = {
        token: this.$getkey(),
        organId: this.ownersComInfo.organId,
      };
      this.$ajax(
        `${this.subUrl.activity}/ownersCom/relation/delOc`,
        data,
        res => {
          console.log(res, "unBand");
        //   this.$message.success("解绑成功");
          this.back();
        },
        this
      );
    },
    back() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.setYewei();
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
.del_top{
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #fff;
  padding:0 20px;
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
.unBandBtn{
//   background: #fff;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 20px 0;
  button{
      width: 150px;
  }
}
</style>