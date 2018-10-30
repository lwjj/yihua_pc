<template>
<div class="newRightContent">
     <div class="title">
        <div class="text">物业服务单</div>
    </div>
    <div class="layout">
      <div class="serBox">
        <ul>
          <div v-for="(item,index) in rootList" :key="index" v-if="item.name=='服务设置'" >
            <li :key="index1" v-for="(item1,index1)  in item.subclass" @click="turnTo(item1.name)">
              <a href="javascript:;">
                <div>
                  <el-badge :value="item.num*1" :hidden='item.num == 0' :max="9" class="item">
                   <img :src="item1.icon" alt="">
                  </el-badge>
                </div>
                <p>{{item1.name}}</p>
              </a>
            </li>
          </div>
          
        </ul>
        <ul> 
          <li v-for="(item,index) in rootList" v-if="item.name!='服务设置' " @click="turnTo(item.name)" :key="index">
              <a href="javascript:;"><div>
                  <el-badge :value="item.num*1" :hidden='item.num == 0' :max="9" class="item">
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
      switch (url) {
        case "缴费单":
          if (this.userInfo.organType == 3) {
            this.$router.push("/estate/serviceList/wuye/payment");
          } else {
            this.$router.push("/estate/serviceList/payment");
          }
          break;
        case "通知":
          if (this.userInfo.organType == 3) {
            this.$router.push("/manage/inform");
          } else {
            this.$router.push("/manage/inform");
          }
          break;
        case "装修":
          this.$router.push("/estate/serviceList/wuye/renovation");

          break;
        case "整改":
          this.$router.push("/estate/serviceList/wuye/rectification");
          break;
        case "接待":
          this.$router.push("/estate/serviceList/wuye/reception");
          // if (this.userInfo.organType == 3) {
          //   this.$router.push("/estate/serviceList/wuye/reception");
          // } else {
          //   this.$router.push("/estate/serviceList/reception");
          // }
          break;
        case "报修":
          if (this.userInfo.organType == 3) {
            this.$router.push("/estate/wuye/repair");
          } else {
            this.$router.push("/estate/repair");
          }
          break;
        case "投诉":
          this.$router.push("/estate/serviceList/wuye/complain");
          // if (this.userInfo.organType == 3) {
          //   this.$router.push("/estate/serviceList/wuye/complain");
          // } else {
          //   this.$router.push("/estate/serviceList/complain");
          // }
          break;
        case "入驻":
          this.$router.push("/estate/serviceList/wuye/settled");
          // if (this.userInfo.organType == 3) {
          //   this.$router.push("/estate/serviceList/wuye/settled");
          // } else {
          //   this.$router.push("/estate/serviceList/settled");
          // }
          break;
        case "退租":
          this.$router.push("/estate/serviceList/wuye/exit_rent");
          // if (this.userInfo.organType == 3) {
          //   this.$router.push("/estate/serviceList/wuye/exit_rent");
          // } else {
          //   this.$router.push("/estate/serviceList/exit_rent");
          // }
          break;
        case "放行条":
          this.$router.push("/estate/serviceList/wuye/release_pass");
          // if (this.userInfo.organType == 3) {
          //   this.$router.push("/estate/serviceList/wuye/release_pass");
          // } else {
          //   this.$router.push("/estate/serviceList/release_pass");
          // }
          break;
        case "租赁":
          this.$router.push("/estate/serviceList/wuye/lease");
          // if (this.userInfo.organType == 3) {
          //   this.$router.push("/estate/serviceList/wuye/lease");
          // } else {
          //   this.$router.push("/estate/serviceList/lease");
          // }
          break;
        case "服务设置":
          if (this.userInfo.organType == 3) {
            this.$router.push("/estate/serviceList/waiqing/setting");
          }
          break;
        case "外勤服务":
          this.$router.push("/estate/serviceList/waiqing");
          break;
        case "业务设置":
          this.$router.push("/estate/serviceList/setting");
          break;
        case "特约写字楼":
          this.$router.push("/estate/serviceList/building");
          break;
      }
    },
    getUserRoot() {
      var that = this;
      console.log(that.$getkey(), "sadkfjas;ldfasdfjaskdl;fjas;d");
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/user/getPermissions`,
        data,
        res => {
          console.log(that.$getkey(), "sadkfjas;ldfasdfjaskdl;fjas;d");
          this.rootList = res.data.propertyService.subclass;
          if(this.userInfo.organType==3){
          	this.rootList.splice(5,1);
          }
          that.$getMessage(res1 => {
            var arr = res.data.propertyService.subclass;
            console.log(arr);
            for (var [i, v] of arr.entries()) {
              switch (v.name) {
                case "服务设置":
                  for (var [x, j] of v.subclass.entries()) {
                    switch (j.name) {
                      case "外勤服务":
                        this.$set(
                          arr[i].subclass[x],
                          "num",
                          res1.data.proServiceMr.fieldServiceNum * 1
                        );
                        break;
                    }
                  }
                  break;
                case "缴费单":
                  this.$set(
                    arr[i],
                    "num",
                    res1.data.proServiceMr.payFeeNum * 1
                  );
                  break;
                case "报修":
                  this.$set(
                    arr[i],
                    "num",
                    res1.data.proServiceMr.repairsNum * 1
                  );
                  break;
                case "投诉":
                  this.$set(
                    arr[i],
                    "num",
                    res1.data.proServiceMr.complaintNum * 1
                  );
                  break;
                case "接待":
                  this.$set(
                    arr[i],
                    "num",
                    res1.data.proServiceMr.receptionNum * 1
                  );
                  break;
                case "装修":
                  this.$set(
                    arr[i],
                    "num",
                    res1.data.proServiceMr.decorationNum * 1
                  );
                  break;
                case "整改":
                  this.$set(
                    arr[i],
                    "num",
                    res1.data.proServiceMr.rectificationNum * 1
                  );
                  break;
                case "租赁":
                  this.$set(arr[i], "num", res1.data.proServiceMr.leaseNum * 1);
                  break;
                case "入驻":
                  this.$set(
                    arr[i],
                    "num",
                    res1.data.proServiceMr.settledNum * 1
                  );
                  break;
                case "退租":
                  this.$set(
                    arr[i],
                    "num",
                    res1.data.proServiceMr.surrenderNum * 1
                  );
                  break;
                default:
                  break;
              }
            }
            this.rootList = arr;
            console.log(this.rootList, "租户第一次登陆");
          }, that);
        },
        this
      );
    }
  },
  watch: {
    $route: function() {
      this.getUserRoot();
    }
  },
  mounted() {
    this.getUserRoot();
    if (localStorage.getItem("reload")) {
      localStorage.removeItem("reload");
      location.reload(true);
    }
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