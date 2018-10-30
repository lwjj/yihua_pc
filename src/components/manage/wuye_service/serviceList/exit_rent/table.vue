<template>
  <yd-layout class="yd-layout" style="width:750px;">
    
    <div class="title">
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
            <el-breadcrumb-item  @click.native='back'>返回</el-breadcrumb-item>
            <el-breadcrumb-item>新建抄表记录</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    <div> 
      <div class="bgwhite foCo6" style="padding: .5rem .3rem;" @click.stop="''">
        <div class="flex-row-nowarp h9">
          <div class="label" style="width:1.6rem">项目名称</div>
          <input type="text" class="flex1 border" maxlength="30" v-model="table.project" style="height:.68rem;"
                 placeholder="请输入">
        </div>
        <div class="flex-row-nowarp h9">
          <div class="label" style="width:1.6rem">上期读数</div>
          <input type="number" class="flex1 border" oninput="value = this.value.slice(0,9)" onkeyup="value=this.value.slice(0,9)" v-model="table.ppReading" style="height:.68rem;"
                 placeholder="请输入">
        </div>
        <div class="flex-row-nowarp h9">
          <div class="label" style="width:1.6rem">本期读数</div>
          <input type="number" class="flex1 border" oninput="value = this.value.slice(0,9)" onkeyup="value=this.value.slice(0,9)" v-model="table.reading" style="height:.68rem;"
                 placeholder="请输入">
        </div>

        <div class="flex-row-nowarp h9">
          <div class="label" style="width:1.6rem">实际用量</div>
          <input type="number" class="flex1 border"  oninput="value = this.value.slice(0,9)" onkeyup="value=this.value.slice(0,9)" v-model="table.dosage" style="height:.68rem;"
                 placeholder="请输入">
        </div>
        <!--<div class="flex-row-nowarp h9">-->
          <!--<div class="label" style="width:1.6rem">抄表人</div>-->
          <!--<input type="text" class="flex1 border" maxlength="30" v-model="table.meterReadUsername" style="height:.68rem;"-->
                 <!--placeholder="请输入">-->
        <!--</div>-->
        <!--<div class="flex-row-nowarp h9">-->
          <!--<div class="label" style="width:1.6rem">抄表日期</div>-->
          <!--&lt;!&ndash;<input type="text" class="flex1 border" maxlength="30" v-model="table.reading"&ndash;&gt;-->
          <!--&lt;!&ndash;placeholder="请输入">&ndash;&gt;-->
          <!--<yd-datetime type="date" class="flex1 border" v-model="table.meterRead" style="height:.68rem;"-->
                       <!--slot="right"></yd-datetime>-->
        <!--</div>-->
        <!-- <div class="flex h9 jusCenter mt2 radius" style="" @click="csConfirm" :style="{color:'#fff',background:mainColor}">
          确定
        </div> -->
        <div class="flex-row-nowarp flex-start h9">
          <div class="label" style="width:1.6rem"></div>
           <el-button type="primary" @click="csConfirm">确定</el-button>
        </div>
        
      </div>
    </div>
  </yd-layout>
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
    this.mainColor = this.$color[this.userInfo.organType];
    return {
      table: {
        project: "",
        ppReading: "",
        reading: "",
        dosage: "",
        meterReadUsername: "",
        meterRead: this.$today()
      }
    };
  },
  methods: {
    csConfirm() {
      if (!this.table.project) {
        return this.$dialog.toast({ mes: "请输入项目名", timeout: 600 });
      } else if (!this.table.ppReading) {
        return this.$dialog.toast({ mes: "请输入上期读数", timeout: 600 });
      } else if (!this.table.reading) {
        return this.$dialog.toast({ mes: "请输入本期读数", timeout: 600 });
      } else if (!this.table.dosage) {
        return this.$dialog.toast({ mes: "请输入用量", timeout: 600 });
      } else {
        // else if (!this.table.meterReadUsername) {
        //   return this.$dialog.toast({mes: "请输入抄表人", timeout: 600})
        // }
        // console.log(this.userInfo)
        this.table.meterReadUsername = this.userInfo.name;
        this.table.meterRead = this.$today(true);
        // console.log(JSON.stringify(this.table));
        // return ;
        this.$emit("setTable", this.table);
      }
    },
    back() {
      this.$emit("setTable");
    }
  }
};
</script>
<style scoped>
.flex-row-nowarp .flex1 {
  padding: 0 0.1rem;
}
</style>
