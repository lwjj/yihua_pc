<template>
    <div class="newRightContent">
    <div class="title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native="back">返回</el-breadcrumb-item>
        <el-breadcrumb-item>推送详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
      <div class="push_detail">
          <div class="topTitle">商家经营信息</div>
          <div class="push_list">
              <div class="label">商家logo</div>
              <div class="label-content">
                  <div class="img-wrapper">
                      <img :src="detail.logoUrl" alt="">
                  </div>
              </div>
          </div>
          <div class="push_list">
              <div class="label">店铺名称</div>
              <div class="label-content">{{detail.shopName}}</div>
          </div>
          <div class="push_list">
              <div class="label">营销标语</div>
              <div class="label-content">{{detail.slogan }}</div>
          </div>
          <div class="push_list">
              <div class="label">店铺地址</div>
              <div class="label-content">{{detail.shopAddress }}</div>
          </div>
          <div class="push_list">
              <div class="label">服务电话</div>
              <div class="label-content">{{detail.servicePhone }}</div>
          </div>
          <div class="push_list">
              <div class="label">公众号</div>
              <div class="label-content">{{detail.publicNum }}</div>
          </div> 
            <!-- 营销信息 -->
          <div class="push_list">
              <div class="label">状态</div>
              <div class="label-content">
                  <span v-if="detail.state == 1">正常</span>
                  <span v-else-if="detail.state == 2">失效</span>
                  <span v-else>删除</span>
              </div>
          </div>
          <div class="push_list">
              <div class="label">类型</div>
              <div class="label-content">
                  <span v-if="detail.type == 1">优惠券</span>
                  <span v-else-if="detail.type == 2">会员卡</span>
                  <span v-else>名片</span>
              </div>
          </div>
          <div class="push_list">
              <div class="label">标题</div>
              <div class="label-content">{{detail.expandTitle}}</div>
          </div>
          <div class="push_list">
              <div class="label">规则介绍</div>
              <div class="label-content">{{detail.ruleIntroduction}}</div>
          </div>
           <div class="push_list">
              <div class="label">使用时间</div>
              <div class="label-content">{{detail.usableTime}}</div>
          </div>
           <div class="push_list">
              <div class="label">起止时间</div>
              <div class="label-content">
                  <span v-if="detail.startDate">{{detail.startDate.substr(0,10)}}~{{detail.endDate.substr(0,10)}}</span>
                  <span v-else>长期有效</span>
              </div>
          </div>
           <div class="push_list">
              <div class="label">推送对象</div>
              <div class="label-content">{{detail.userList == 1?'公司':"管理层"}}</div>
          </div>
           <div class="push_list" v-if="detail.vipImage">
              <div class="label">会员卡背景</div>
              <div class="img-wrapper">
                 <img :src="detail.vipImage" alt="">
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
    this.mainColor = this.$color[this.userInfo.organType];
    let endTime = this.$today();
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    return {
      detail: {}
    };
  },
  methods: {
    //   获取推送详情
    getPushDetail() {
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        guid: this.$route.query.guid
      };
      this.$ajax(
        `${this.subUrl.bd}/opportunity/pushInfo`,
        data,
        res => {
          this.detail = res.data;
        },
        this
      );
    }
  },
  mounted() {
    this.getPushDetail();
  }
};
</script>
<style lang="scss" scoped>
.topTitle {
  line-height: 0.64rem;
  border-bottom: 1px solid #ddd;
  color: #666;
  padding-left: 0.4rem;
}
.push_detail {
  background: #fff;
  font-size: 14px;
  .push_list {
    display: flex;
    font-size: 14px;

    align-items: center;
    justify-content: flex-start;
    padding: 0.1rem 0;
    .label {
      width: 1.6rem;
      font-size: 14px; 
      padding-right: 0.14rem;
      text-align: right;
      color: #666;
    }
    .label-content {
      color: #999;
      font-size: 14px;

      flex: 1;
      .img-wrapper {
        width: 0.8rem;
        height: 0.8rem;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>


