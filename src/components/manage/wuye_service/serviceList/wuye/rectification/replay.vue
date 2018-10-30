<template>
  <yd-layout class="yd-layout" style="width:750px;">
       
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
            <el-breadcrumb-item  @click.native='$back'>返回</el-breadcrumb-item>
            <el-breadcrumb-item>编辑内容</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
          <div class="flex-row h8 pdlr2 bgwhite" v-for="(item,index) in list" :key="index">
            <img class="chooseIcon" @click="chooseIndex(index,false)" v-if="item.selected"  src="../../../../../../assets/images/rent/estate/selected_active.png" alt="">
            <img class="chooseIcon" @click="chooseIndex(index,true)" v-else  src="../../../../../../assets/images/rent/estate/selected.png" alt="">
            <div class="flex1">{{item.content}}</div>
          </div>
          <!-- <div class="flex-row h8 bgwhite pdlr2">
              <yd-button type='hollow' @click.native='use'>使用</yd-button>
          </div> -->
          <div style="padding:20px;">
            <yd-textarea v-if='currentIndex == list.length-1' placeholder='回复内容' maxlength='300' v-model="myCommet" class="border pdlr2 bgwhite" style=" padding:.2rem .1rem .2rem" >

          </yd-textarea>
          </div>
          <div class="flex-row h8 pdlr2">
              <el-button type='hollow' @click.native="confirm">确定</el-button>
          </div>
      </div>
  </yd-layout>
</template>
<script>
import Vue from "vue";

import { TextArea } from "vue-ydui/dist/lib.rem/textarea";
/* 使用px：import {TextArea} from 'vue-ydui/dist/lib.px/textarea'; */

Vue.component(TextArea.name, TextArea);
export default {
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    return {
      list: [],
      myCommet: "",
      currentIndex: -1
    };
  },
  methods: {
    chooseIndex(index, flag) {
      console.log(index, flag);
      for (var i in this.list) {
        if (i == index) {
          this.currentIndex = index;
          this.$set(this.list[i], "selected", true);
        } else {
          this.$set(this.list[i], "selected", false);
        }
      }
    },
    use() {
      console.log(this.list[this.currentIndex].content);
      this.myCommet = this.myCommet + this.list[this.currentIndex].content;
    },
    back() {
      this.$emit("operate");
    },
    confirm() {
      if (this.currentIndex == 3) {
        if (this.myCommet == "") {
          return this.$dialog.toast({ mes: "请输入评语!" });
        } else {
          this.$emit("operate", this.myCommet);
        }
      } else if (
        this.currentIndex > -1 &&
        this.currentIndex < this.list.length - 1
      ) {
        this.$emit("operate", this.list[this.currentIndex].content);
      }
    },
    getMessage() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/user/getFr`,
        data,
        res => {
          this.list = res.data;
          this.list.push({
            content: "其它"
          });
        },
        this
      );
    }
  },
  mounted() {
    this.getMessage();
  }
};
</script>

