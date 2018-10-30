<template>
  <div class="newRightContent" style="overflow:auto">
   <div class="bgwhite border">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{path: '/wuye/manage'}">物业管理</el-breadcrumb-item>
                    <el-breadcrumb-item @click.native="$router.go(-1)">高级查询</el-breadcrumb-item>
                    <el-breadcrumb-item>详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="yd-layout" style="width:750px;" v-if="info.proCompanyInfo">
                 <!-- 状态 0：不通过 1：通过 2：审核中 3:无申请记录  -->
                <div class="info">
                    <div class="company">
                        <span v-if="info.status == 0">不通过</span>
                        <span v-if="info.status == 1">通过</span>
                        <span v-if="info.status == 2">审核中</span>
                        <span v-if="info.status == 3">未申请</span>
                    </div>
                </div>
                <div class="info">
                    <div class="company">物业公司信息</div>
                    <div class="list_item">
                        <div class="label">物业公司</div>
                        <div class="flex1">{{info.proCompanyInfo.organName}}</div>
                    </div>
                    <div class="list_item">
                        <div class="label">法人名称</div>
                        <div class="flex1">{{info.proCompanyInfo.name}}</div>
                    </div>
                    <div class="list_item">
                        <div class="label">公司地址</div>
                        <div class="flex1">{{info.proCompanyInfo.detailAddr}}</div>
                    </div>
                        <div class="list_item">
                        <div class="label">管理关系</div>
                        <div class="flex1">{{info.proCompanyInfo.proCompanyInfo==1?"直属关系":"托管关系"}}</div>
                    </div>
                    <div class="list_item">
                        <div class="label">手机号</div>
                        <div class="flex1">{{info.proCompanyInfo.account}}</div>
                    </div>

                </div>
                <div class="info">
                     <div class="company">管理处信息</div>
                    <div class="list_item">
                        <div class="label">管理处名称</div>
                        <div class="flex1">{{info.managementInfo.organName}}</div>
                    </div>
                    <div class="list_item">
                        <div class="label">写字楼名称</div>
                        <div class="flex1">{{info.managementInfo.name}}</div>
                    </div>
                    <div class="list_item">
                        <div class="label">建筑面积</div>
                        <div class="flex1">{{info.managementInfo.area}}平米</div>
                    </div> 
                     <div class="list_item">
                        <div class="label">写字楼性质</div>
                        <div class="flex1">{{info.managementInfo.type==1?"商务综合楼":"纯写字楼"}}</div>
                    </div> 
                    <div class="list_item">
                        <div class="label">管理处主任</div>
                        <div class="flex1">{{info.managementInfo.name}}</div>
                    </div> 
                    <div class="list_item">
                        <div class="label">手机号</div>
                        <div class="flex1">{{info.managementInfo.account}}</div>
                    </div>
                </div> 
                <div class="info">
                  <div class="list_item" style="height:auto;padding:5px 0;margin-left:30px">
                    <div class="label">提交备注</div>
                    <div class="flex1" style="word-break: break-all; word-wrap:break-word;padding-right:10px">{{info.submitRemark}}</div>
                  </div>
                   <div class="list_item" style="height:auto;padding:5px 0;margin-left:30px">
                    <div class="label">审核备注</div>
                    <div class="flex1" style="word-break: break-all; word-wrap:break-word;padding-right:10px">{{info.auditRemark}}</div>
                  </div>
                </div>
                <div class="info" v-if="info.status!=2">
                    <div style="padding:30px">
                        <el-button type="primary" v-if="info.status == 3" @click="apply()">申请</el-button>
                        <el-button type="primary" v-if="info.status == 0" @click="apply()">重新申请</el-button>
                        <el-button type="primary" @click="enterSearch" v-if="info.status == 1">进入高级查询</el-button>
                        <span v-if="info.status == 1" style="padding-left:20px">剩余时间：{{surplusTime}}</span>
                    </div>
                </div>
            </div>
   </div>
  </div>
</template>
<script>
import fn from "@/assets/js/product.js";
export default {
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    return {
      info: {},
      //剩余时间
      surplusTime:''
    };
  },
  methods: {
    countTime(){
      var date = new Date();
      var now = date.getTime();
      //设置截止时间
      var endDate = new Date(this.info.twentyFourHoursLater);
      var end = endDate.getTime();
      //时间差
      var leftTime = end - now;
      //定义变量 d,h,m,s保存倒计时的时间
      let d=''
      let h=''
      let m=''
      let s=''
      if (leftTime >= 0) {
          d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
          h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
          m = Math.floor(leftTime / 1000 / 60 % 60);
          s = Math.floor(leftTime / 1000 % 60);
      }
      if(h<10){
        h = "0"+h
      }
      if(m<10){
        m = "0"+m
      }
      if(s<10){
        s = "0"+s
      }
      this.surplusTime = h + ":" + m + ":"+ s 
      //递归每秒调用countTime方法，显示动态时间效果
      setTimeout(this.countTime, 1000);
    },
    getDetail() {
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        oaId: this.$route.query.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/advancedQuery/getInfo`,
        data,
        res => {

          this.info = res.data;

          this.countTime()
        },
        this
      );
      
    },
    apply() {
      var txt = "";
      if (this.info.status == 3) {
        txt = "是否申请绑定管理处高级查询";
      } else if (this.info.status == 0) {
        txt = "是否重新申请绑定管理处高级查询";
      }
      this.$prompt("请输入备注", "是否申请绑定管理处高级查询", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern:/^[\u4e00-\u9fa5_a-zA-Z0-9_\S_\s]{1,300}$/,
        inputErrorMessage: '请输入内容，不超过300字',
        inputType:'textarea'
      })
        .then(({ value }) => {
          let data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            organId: this.organInfo.guid,
            manageOrganId: this.info.managementInfo.organId,
            submitRemark: value
          };

          this.$ajax(
            `${this.subUrl.activity}/advancedQuery/submit`,
            data,
            res => {
              this.getDetail();
              this.$message.success("申请成功");
              this.$router.go(-1);
            },
            this
          );
        })
        .catch(() => {});
    },
    enterSearch() {
      this.$confirm("是否进入查询模式", "提示", { type: "warning" }).then(
        () => {
          let data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            manageOrganId: this.info.managementInfo.organId
          };
          this.$ajax(
            `${this.subUrl.activity}/advancedQuery/queryMode`,
            data,
            res => {
              var obj = res.data;
              obj.userInfo = this.userInfo;
              obj.organInfo = this.organInfo;
              obj.tempToken = this.$getkey();
              localStorage.setItem(
                "tempObj",
                encodeURIComponent(JSON.stringify(obj))
              );
              this.$ajax(
                `${this.subUrl.user}/user/getUserInfo`,
                { userId: obj.userId, token: obj.token },
                res => {

                  localStorage.setItem(
                    "userInfo",
                    encodeURIComponent(JSON.stringify(res.data.userInfo))
                  );
                  localStorage.setItem(
                    "organInfo",
                    encodeURIComponent(JSON.stringify(res.data.organInfo))
                  );
                  fn.setIng(obj.token);
                  var a = res.data.userInfo.organType;
                  var b = res.data.userInfo.admin ? 1 : 0;
                  localStorage.setItem("organType", a);
                  localStorage.setItem("isManger", b);
                  localStorage.setItem("user_Id", res.data.userInfo.guid);
                  localStorage.setItem("organ_Id", res.data.organInfo.guid);
                  localStorage.setItem(
                    "mainColor",
                    this.$color[res.data.userInfo.organType]
                  );
                  this.$router.replace("/manage/wuye_service");
                  localStorage.setItem("reload", true);
                },
                this
              );
            },
            this
          );
        }
      );
    }
  },
  mounted() {
    this.getDetail();
  }
};
</script>
<style scoped lang='scss'>
.info {
  margin-bottom: 15px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  .company {
    border-bottom: 1px solid #ddd;
    line-height: 40px;
    padding: 0 30px;
  }
  &:first-child {
    border-top: 0;
    border-bottom: 0;
  }
  .list_item {
    display: flex;
    height: 28px;
    padding: 0 30px;
    align-items: center;
    .label {
      margin-right: 14px;
    }
  }
}
</style>

