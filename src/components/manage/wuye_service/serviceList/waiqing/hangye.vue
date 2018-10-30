<template>
   <div style="overflow:auto" class="yd-layout">
     <!-- <yd-navbar slot="navbar"  height=".88rem" v-show="!userAgent.isWX" v-title="'所属行业'" title="所属行业" :bgcolor="mainColor" color="#fff">
       <div slot="left" class="addClickArea" @click="cancel()" >
         <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
       </div>
       <span slot="right" class="addRightClickArea" @click="chooseSuccess()" style="color: #fff;">确定</span>
     </yd-navbar> -->
     <div class="title">
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-if="userInfo.organType == 3" :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
            <el-breadcrumb-item @click.native="$router.go(-1)">服务订单</el-breadcrumb-item>
            <el-breadcrumb-item @click.native="cancel()">返回</el-breadcrumb-item>
        </el-breadcrumb>
     </div>
     <div class="content">
       <!-- <div class="tips"><b>可选</b>（从以下类目选择一项）</div> -->
       <div class="choose_free" v-for="(item,key) in options_free"  :key="key">
         <div class="list">
           <div class="item" @click="showFree(key)">
             <span class="icon" :class="{green:key%4==0,red:key%4==1,blue:key%4==2,yellow:key%4==3}"></span>
             <div class="item-title">{{item.name}}</div>
             <div class="arrow">
               <img v-show="!item.show" src="../../../../../assets/images/register/right.png">
               <img v-show="item.show" src="../../../../../assets/images/register/bottom.png">
             </div>
           </div>
           <div class="subContent" v-show="item.show">
             <yd-button class="buttonChoose" v-for="(item1,key1) in item.subclass" :key="key1"
                        :type="item1.show?'primary':'hollow'" @click.native="choose_free(key,key1)">{{item1.name}}
             </yd-button>
           </div>
         </div>
       </div>
       <!-- <div class="tips"><b>必选</b>（从以下类目选择一项）</div> -->
       <div class="choose_require" v-for="(item,key) in options_require"  :key="key">
         <div class="list">
           <div class="item" @click="showRequire(key)">
             <span class="icon" :class="{green:key%4==0,red:key%4==1,blue:key%4==2,yellow:key%4==3}"></span>
             <div class="item-title">{{item.name}}</div>
             <div class="arrow">
               <img v-show="!item.show" src="../../../../../assets/images/register/right.png">
               <img v-show="item.show" src="../../../../../assets/images/register/bottom.png">
             </div>
           </div>
           <div class="subContent" v-show="item.show">
             <yd-button class="buttonChoose" shape="circle" v-for="(item1,key4) in item.subclass"
                        :key="key4"
                        :type="item1.show?'primary':'hollow'" :bgcolor='item1.show?mainColor:""' :color='item1.show?"#fff":""' @click.native="choose_require(key,key4)">{{item1.name}}
             </yd-button>
           </div>
         </div>
       </div>
     </div>
    <div class="pdlr2 pt2">
       <el-button type="primary" @click="chooseSuccess()">确定</el-button>
     </div>
   </div>

</template>
<script>
// import Vue from 'vue';
import Vue from "vue";
import { Button, ButtonGroup } from "vue-ydui/dist/lib.rem/button";
/* 使用px：import {Button, ButtonGroup} from 'vue-ydui/dist/lib.px/button'; */

Vue.component(Button.name, Button);
Vue.component(ButtonGroup.name, ButtonGroup);
export default {
  // props:["url"],
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    return {
      options_free: [],
      options_require: [],
      freeIndex: -1,
      requireIndex: -1
    };
  },
  methods: {
    chooseSuccess() {
      console.log(this.freeObj, this.requireObj);
      if (this.requireObj) {
        let obj = {};
        if (
          this.options_require[this.requireObj.a].subclass[this.requireObj.b]
            .show
        ) {
          if (
            this.freeObj &&
            this.options_free[this.freeObj.a].subclass[this.freeObj.b].show
          ) {
            obj.free =
              this.freeObj &&
              this.options_free[this.freeObj.a].subclass[this.freeObj.b];
          }
          obj.require = this.options_require[this.requireObj.a].subclass[
            this.requireObj.b
          ];
          console.log(obj);
          this.$emit("chooseSuccess", obj);
        } else {
          this.$message({ message: "请选择必选行业", type: "error" });
        }
      } else {
        this.$message({ message: "请选择必选行业", type: "error" });
      }
    },
    getHangye() {
      this.xhr
        .post(`${this.subUrl.user}/comm/getIndustryCategory`)
        .then(res => {
          if (res.data.code == 1) {
            console.log(res.data);
            this.options_free = [];
            this.options_require = res.data.data.pmc; //.concat(res.data.data.icc).concat(res.data.data.pm);
          }
        });
    },
    cancel() {
      this.$emit("chooseSuccess");
      return false;
    },
    showFree(e) {
      if (this.options_free[e].show) {
        this.$set(this.options_free[e], "show", false);
      } else {
        this.$set(this.options_free[e], "show", true);
      }
    },
    showRequire(e) {
      if (this.options_require[e].show) {
        this.$set(this.options_require[e], "show", false);
      } else {
        this.$set(this.options_require[e], "show", true);
      }
    },
    choose_free(a, b) {
      if (this.options_free[a].subclass[b].show) {
        if (!this.freeObj) {
          this.freeObj = {};
        } else {
          this.$set(
            this.options_free[this.freeObj.a].subclass[this.freeObj.b],
            "show",
            false
          );
        }
        this.$set(this.options_free[a].subclass[b], "show", false);
        this.freeObj = { a, b };
      } else {
        if (!this.freeObj) {
          this.freeObj = {};
        } else {
          this.$set(
            this.options_free[this.freeObj.a].subclass[this.freeObj.b],
            "show",
            false
          );
        }
        this.$set(this.options_free[a].subclass[b], "show", true);
        this.freeObj = { a, b };
      }
    },
    choose_require(a, b) {
      if (this.options_require[a].subclass[b].show) {
        if (!this.requireObj) {
          this.requireObj = {};
        } else {
          this.$set(
            this.options_require[this.requireObj.a].subclass[this.requireObj.b],
            "show",
            false
          );
        }
        this.$set(this.options_require[a].subclass[b], "show", false);
        this.requireObj = { a, b };
      } else {
        if (!this.requireObj) {
          this.requireObj = {};
        } else {
          this.$set(
            this.options_require[this.requireObj.a].subclass[this.requireObj.b],
            "show",
            false
          );
        }
        this.$set(this.options_require[a].subclass[b], "show", true);
        this.requireObj = { a, b };
      }
    }
  },
  mounted() {
    this.getHangye();
    console.log(11);
  }
};
</script>
<style scoped>
.item {
  display: flex;
  align-items: center;
  height: 0.8rem;
  padding: 0 0.2rem;
  background: #fff;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  margin-top: -1px;
}
.arrow img:nth-child(1) {
  width: 0.12rem;
}
.arrow img:nth-child(2) {
  height: 0.12rem;
}
.item-title {
  flex: 1;
}
.subContent {
  padding: 0.2rem 0.2rem 0;
}
.buttonChoose {
  height: 0.58rem;
  margin: 0 0.2rem 0.2rem 0;
  border-radius: 0.18rem;
}
.tips {
  font-size: 0.24rem;
  color: #777;
  padding: 0 0.24rem;
  height: 0.6rem;
  line-height: 0.6rem;
}
.tips b {
  font-size: 0.28rem;
  font-weight: 400;
}
.icon {
  display: inline-block;
  width: 0.2rem;
  height: 0.2rem;
  border-radius: 0.1rem;
  margin-right: 0.1rem;
}
.green {
  background: #52d4e4;
}
.blue {
  background: #3eb7e6;
}
.red {
  background: #fa697c;
}
.yellow {
  background: yellow;
}
</style>
