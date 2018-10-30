<template>
<div class="newRightContent">
     <div class="title">
        <div class="text">工作管理</div>
    </div>
    <div class="layout">
      <div class="serBox">
        <ul> 
          <li v-for="(item,index) in rootList"  @click="turnTo(item.alias)" :key="index">
              <a href="javascript:;"><div>
                <el-badge :value="item.num" :hidden="item.num == 0" :max="9" class="item">
                    <img :src="item.icon" alt="">
                  </el-badge>
                </div><p>{{item.name}}</p>
              </a>
            </li>
        </ul>
      </div>
    </div>
</div>
</template>
<script>
import mRoute from "./router";
export default {
  name: "",
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    return {
      rootList: []
    };
  },
  methods: {
    turnTo(url) {
      console.log(mRoute);
      this.$router.push(mRoute[url]);
    },
    getUserRoot() {
      let pathObj = {
        外勤服务: "/manage/wuye_service",
        特约写字楼: "/manage/wuye_service",
        缴费: "/manage/wuye_service",
        报修: "/manage/wuye_service",
        投诉: "/manage/wuye_service",
        装修: "/manage/wuye_service",
        通知: "/manage/wuye_service",
        接待: "/manage/wuye_service",
        入驻: "/manage/wuye_service",
        退租: "/manage/wuye_service",
        租赁: "/manage/wuye_service",
        放行条: "/manage/wuye_service"
      };
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };

      this.$ajax(
        `${this.subUrl.user}/user/getPermissions`,
        data,
        res => {
          this.$getMessage(res1 => {
            if (this.userInfo.organType == 3) {
              for (let val of res.data.propertyManagement.subclass) {
                if (val.alias === "workManage") {
                  for (var v of val.subclass) {
                    switch (v.alias) {
                      case "otherReport":
                        v.num = res1.data.proManageMr.otherReportNum * 1;
                        break;
                      case "workReport":
                        v.num = res1.data.proManageMr.workReportNum * 1;
                        break;
                      case "manageReport":
                        v.num = res1.data.proManageMr.manageReportNum * 1;
                        break;
                      case "caa":
                        v.num = res1.data.proManageMr.caaNum * 1;
                        break;
                      default:
                        console.info("品质管理");
                    }
                  }
                  this.rootList = val.subclass;
                }
              }
            }
          }, this);
        },
        this
      );
    }
  },
  mounted() {
    this.getUserRoot();
  }
};
</script>
<style lang="scss" scoped>
#subTemplate {
  overflow: hidden;
}
.layout {
  box-sizing: border-box;
  background: #fff;
  height: 100%;
}
.serBox {
  ul li {
    float: left;
    a {
      box-sizing: border-box;
      display: inline-block;
      margin: 20px;
      width: 150px;
      height: 150px;
      padding: 30px;
      text-align: center;
      img {
        width: 50px;
      }
      p {
        padding: 5px 0px;
      }
    }
  }
}
</style>