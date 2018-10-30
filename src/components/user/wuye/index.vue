<template>
<div class="newRightContent">
    <div class="title">
        <div class="text">物业管理</div>
    </div>
    <div class="serBox bgwhite">
        <ul> 
          <li v-for="(item,index) in rootList"  @click="turnTo(item.path)" :key="index">
              <a href="javascript:;"><div><img :src="item.icon" alt="">
                </div><p>{{item.name}}</p>
              </a>
            </li>
        </ul>
      </div>
    </div>
</template>
<script>
// import mRoute from "./router";

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
    //
    return {
      rootList: [
        {
          icon: require("../../../assets/images/rent/ent/icon_01.png"),
          name: "项目月报",
          path: "/wuye/month"
        },
        {
          icon: require("../../../assets/images/rent/my/newMessage.png"),
          name: "物业通知",
          path: "/wuye/message"
        },
        {
          icon: require("../../../assets/images/rent/ent/icon00.png"),
          name: "物业稽查",
          path: "/user/property_inspection"
        },
        {
          icon: require("../../../assets/images/rent/my/l3.png"),
          name: "管理处管理",
          path: "/wuye/projectManager"
        },
        {
          icon: require("../../../assets/images/rent/ent/icon_05.png"),
          name: "高级查询",
          path: "/wuye/search"
        }
      ]
    };
  },
  methods: {
    turnTo(url) {
      this.$router.push(url);
    },
    getUserRoot() {
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };

      this.$ajax(
        `${this.subUrl.user}/user/getPermissions`,
        data,
        res => {
          console.log(res, "root");
          if (this.userInfo.organType == 3) {
            for (let val of res.data.propertyManagement.subclass) {
              if (val.name === "工作管理") {
                this.rootList = val.subclass;
              }
            }
          } else if (this.userInfo.organType == 1) {
            var arr = res.data.propertyService.subclass;
            this.rootList = arr;
          }
          console.log(this.rootList);
        },
        this
      );
    }
  },
  mounted() {
    // this.getUserRoot();
  }
};
</script>
<style lang="scss" scoped>
#subTemplate {
  overflow: hidden;
  padding-right: 0;
}
.layout {
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #ddd;
}
.serBox {
  overflow: hidden;
  height: 100%;
  ul li {
    float: left;
    width: 150px;
    height: 150px;
    a {
      box-sizing: border-box;
      display: inline-block;
      margin: 20px;
      width: 150px;
      height: 150px;
      padding: 30px;
      text-align: center;
      img {
        width: 100%;
      }
      p {
        padding: 5px 0px;
      }
    }
  }
}
</style>
