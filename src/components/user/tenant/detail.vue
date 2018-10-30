<template>
  <div id='inform_del'>
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>物业关系详情</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/user/we_business' }">本楼业务</el-breadcrumb-item>
        <el-breadcrumb-item class="cursor" @click.native="back">租户采购</el-breadcrumb-item>
        <el-breadcrumb-item>帖子详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="layout" v-show="!showShop">
      <div class="del">
        <div class="del_title">
          <!-- 状态（1，正常,2，关闭(下架),3过期） , -->
          <span v-if="del.status==1">状态：正常</span>
          <span v-if="del.status==2">状态：下架</span>
          <span v-if="del.status==3">状态：过期</span>
        </div>
        <ul class="delList clearfix">
          <li><i>联系人：</i><span>{{del.nickname}}</span></li>
          <li><i>电话：</i><span>{{del.phone}}</span></li>
          <li><i>企业名称：</i><span>{{del.organName}}</span></li>
        </ul>
      </div>
      <div class="del">
        <div class="del_title">
          <span>标题：<strong>{{del.title}}</strong></span>
          <!-- <el-tag color="#409EFF" class="floatR" v-text="del.state==1?'已认证':'未认证'"></el-tag> -->
        </div>
        <ul class="delList clearfix">
          <li><i>类型：</i><span>{{del.typeName}}</span></li>
          <li><i>截至日期：</i><span v-if="del.deadline != '9999-12-31 00:00:00'">{{del.deadline | date}}</span><span v-if="del.deadline == '9999-12-31 00:00:00'">永久</span></li>
          <li><i>买家地址：</i><span>{{del.userAddr}}</span></li>
          <li style="width:100%;margin-top:20px;"><i style="text-align:left;">详情</i><p style="border:1px solid #ccc;padding:5px 5px 50px 5px;margin-top:10px;">{{del.content}}</p></li>
        </ul>
      </div>
      <div class="recommend">
        <el-button type="danger" plain @click="refuse">拒绝</el-button>
        <el-button type="primary" @click="recommend">通过并推荐</el-button>
      </div>
    </div>
    <!-- 选择商家 -->
    <selectShop v-show="showShop" @selectSuccess="selectSuccess" @back="goback"></selectShop>
  </div>

</template>
<script>
  import selectShop from "./select_shop";
  export default {
    components: {
      selectShop
    },
    data() {
      return {
        showShop: false,
        userInfo: "",
        organInfo: "",
        del: {},
        accessoryList: [],
        checkList: []
      };
    },
    methods: {
      goback() {
        this.showShop = false;
      },
      back() {
        this.$router.go(-1);
      },
      selectSuccess(checkList) {
        this.checkList = checkList;
        this.yes();
        this.showShop = false;
      },
      // 推荐
      recommend() {
        this.showShop = true;
      },
      // 拒绝
      refuse() {
        this.$confirm("是否下架该帖子?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let data = {
              token: this.$getkey(),
              userId: this.userInfo.guid,
              bbsId: this.$route.query.guid
            };
            this.$ajax(
              `${this.subUrl.bd}/buildingBuy/manageAudit`,
              data,
              res => {
                console.log(res, "refuse");
                this.$message.success("操作成功");
                this.back();
              },
              this
            );
          })
          .catch(() => {});
      },
      // 通过 推荐
      yes() {
        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          bbsId: this.$route.query.guid,
          bsUserIds: this.checkList.join()
        };
        this.$ajax(
          `${this.subUrl.bd}/buildingBuy/recommend `,
          data,
          res => {
            console.log(res, "yes");
            this.$message.success("推荐成功");
            this.back()
          },
          this
        );
      },
      //请求详情页面
      getDel() {
        var data = {
          token: this.$getkey(),
          bbsId: this.$route.query.guid
        };
        this.$ajax(
          `${this.subUrl.bd}/buildingBuy/getDetail`,
          data,
          res => {
            console.log(res, "getDel");
            this.del = res.data.bbs;
          },
          this
        );
      }
    },
    mounted() {
      this.userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      this.organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      console.log(this.userInfo);
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
    .tag {
      float: right;
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
    i {
      width: 100px;
      text-align: right;
      display: inline-block;
    }
  }

  .recommend {
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
