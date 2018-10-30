<template>
  <div class="newRightContent" style="overflow:auto">
   <div class="bgwhite border">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{path: '/wuye/manage'}">物业管理</el-breadcrumb-item>
                    <el-breadcrumb-item @click.native="$router.go(-1)">物业通知</el-breadcrumb-item>
                    <el-breadcrumb-item>详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="yd-layout" style="width:750px;" v-if="info.guid">
                 <!-- 状态 0：不通过 1：通过 2：审核中 3:无申请记录  -->
                <div class="info" v-if="info.status">
                    <div class="company">
                      <!-- 1:未阅，2：已阅，3：已转发 , -->
                        <!-- <span v-if="info.status == 0">不通过</span> -->
                        <span v-if="info.status == 1">未阅</span>
                        <span v-if="info.status == 2">已阅</span>
                        <span v-if="info.status == 3">已转发</span>
                    </div>
                </div>
                <div class="info">
                    <div class="company font600">{{info.title}}</div>
                    <div class="list_item">
                        <div class="label">公司名</div>
                        <div class="flex1">{{info.organName}}</div>
                    </div>
                    <div class="list_item">
                        <div class="label">通知对象</div>
                        <div class="flex1">{{info.noticeObj?info.noticeObjName:"所有管理处"}}</div>
                    </div>
                    <div class="list_item">
                        <div class="label">通知内容</div>
                        <div class="flex1">{{info.noticeContent}}</div>
                    </div>
                    <div class="list_item">
                        <div class="label">关键词</div>
                        <div class="flex1">{{info.keyword}}</div>
                    </div>
                        <div class="list_item">
                        <div class="label">发布人</div>
                        <div class="flex1">{{info.userName}}</div>
                    </div>
                    <div class="list_item">
                        <div class="label">创建时间</div>
                        <div class="flex1">{{info.createDate}}</div>
                    </div>
                    <div style="padding: 0 30px;">
                      <span style="width:128px;height:128px;display:inline-block;margin-right:5px;" v-for="(item,index) in info.commAccessoryList" :key="index">
                        <img style="width:100%;height:100%;" :src=item.path alt="">
                      </span>
                    </div>
                </div> 
            </div>
   </div>
  </div>
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
    return {
      info: {}
    };
  },
  methods: {
    getDetail() {
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        organType: this.userInfo.organType,
        propertyNoticeId: this.$route.query.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/propertyNotice/getNoticeDetail`,
        data,
        res => {
          console.log(res);
          this.info = res.data;
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
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          let data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            organId: this.organInfo.guid,
            manageOrganId: this.info.managementInfo.organId,
            submitRemark: value
          };
          console.log(data);
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
        () => {}
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
    height: 40px;
    padding: 0 30px;
    align-items: center;
    .label {
      margin-right: 14px;
      width:64px;
    }
  }
}
</style>

