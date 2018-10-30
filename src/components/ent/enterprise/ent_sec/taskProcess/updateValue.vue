<template>
    <div class="newRightContent">
         <div class="title">
             <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item @click.native="$router.push('/entprise/workstation')">工作台</el-breadcrumb-item>
                <el-breadcrumb-item class="cursor" @click.native='$router.go(-1)'>任务进度</el-breadcrumb-item>
                <el-breadcrumb-item class="cursor" @click.native='back'>进度列表</el-breadcrumb-item>
                <el-breadcrumb-item>进度详情</el-breadcrumb-item>
            </el-breadcrumb>
         </div>
         <div class="main">
             <div class="listItem">
                 进度：{{tempData.progress}}
             </div>
             <div class="listItem">
                 更新时间：{{tempData.updataTime}}
             </div>
             <div>
                 <div class="foCo9">上传成果</div>
                <vue-preview class='imgPath' :slides="sliders" v-if='sliders'  @close="''"></vue-preview>
             </div>
         </div>
    </div>
</template>
<script>
export default {
  props: ["tempData"],
  data() {
    return {
      sliders: null
    };
  },
  methods: {
    back() {
      this.$emit("detailBack");
    }
  },
  mounted() {
    this.$setImg(this.tempData.commAccessoryList, this);
  }
};
</script>
<style lang="scss" scoped>
.main {
  background: #fff;
  padding: 10px;
  height: 100%;
  .listItem{
      line-height: 2;
  }
}
</style>


