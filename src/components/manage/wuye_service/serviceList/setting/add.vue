<template>
  <div class="newRightContent">
    <div class="bgwhite" style="padding:20px;height:100%;" v-if="!showHangye">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
          <el-breadcrumb-item  @click.native="$router.go(-1)">业务设置</el-breadcrumb-item>
          <el-breadcrumb-item>行业类型</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div style="padding:.2rem 0 .5rem;width:500px" class="inputBox">
        <div class="flex-row-nowrap h7" style="padding-right:.4rem;">
          <span class="pdlr foCo6" style="text-align:right;width:1.6rem;padding-right:.2rem;">业务类型</span>
          <input class="flex1 bgwhite border pdlr1" v-model="typeName" readonly @click="showHangye=true" placeholder="请选择行业类型" type="text" :disabled="ishuixian">
        </div>

        <div class="flex-row-nowrap h7" style="padding-right:.4rem;">
          <span class="pdlr foCo6" style="text-align:right;width:1.6rem;padding-right:.2rem;">上限数量</span>
          <input class="flex1 bgwhite border pdlr1" v-model="amount" @input="setNum" :placeholder=num type="number">
        </div>

        <div class="flex-row-nowrap h7 relative" style="padding-right:.4rem;">
          <span class="pdlr foCo6" style="text-align:right;width:1.6rem;padding-right:.2rem;">服务费</span>
          <input class="flex1 bgwhite border pdlr1" v-model="cost" style="padding-right:1.8rem;" type="number" placeholder="由客服设置">
          <!-- <el-select v-model="cost" class="flex1 bgwhite" style="height:100%;" placeholder="请选择">
          <el-option 
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option> 
        </el-select>-->
          <span class="shangjidian foCo3 font32">元/月</span>
        </div>
        <div class="flex-row-nowrap h7" style="padding-right:.4rem;">
          <div class="foCo6" style="text-align:right;padding:.5rem;">
            <yd-checkbox v-model="checkbox1" :color='mainColor'> 到期提示（提前一个星期）</yd-checkbox>
          </div>
          <!-- <div class="flex1 pdlr1">
           
          </div> -->
        </div>
        <div class="flex-row h8 jusCenter center" @click="confirm" :style="{background:mainColor,margin:'.8rem .6rem .5rem',color:'#fff',borderRadius:'.1rem'}">确定</div>
      </div>
    </div>
    <myHangye v-if="showHangye" @chooseSuccess='chooseSuccess'></myHangye>
  </div>


  




</template>
<script>
import Vue from "vue";
import { CheckBox, CheckBoxGroup } from "vue-ydui/dist/lib.rem/checkbox";
Vue.component(CheckBox.name, CheckBox);
Vue.component(CheckBoxGroup.name, CheckBoxGroup);
import myHangye from "./hangye";

export default {
  components: {
    myHangye
  },
  data() {
    let userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    let organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[userInfo.organType];
    return {
      showHangye: false,
      userInfo,
      num:'',
      organInfo,
      typeId: "",
      typeName: "",
      amount: "",
      cost: "",
      options: [
        { label: "1048", value: "1048" },
        { label: "2298", value: "2298" },
        { label: "3298", value: "3298" },
        { label: "5898", value: "5898" }
      ],
      checkbox1: false,
      //回显内容
      huixian: {},
      ishuixian:false,
    };
  },
  methods: {
    getNum() {
      this.setNum(this, "amount");
    },
    confirm() {
      if(this.ishuixian){
        this.typeId =this.huixian.type 
      }
      if (this.typeId == "") {
        return this.$message({ message: "请选择行业类型", type: "error" });
      } else if (this.amount == "") {
        return this.$message({
          message: "请输入正确的上限数量",
          type: "error"
        });
      } else if (this.cost == "") {
        return this.$message({ message: "请输入信息服务费", type: "error" });
      }
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        typeId: this.typeId,
        amount: this.amount,
        cost: this.cost,
        remind: this.checkbox1 ? 1 : 0
      };
      console.log(this.ishuixian,"9999999999999999999999")
      if(this.ishuixian){
        data.sobId = this.huixian.guid
        data.typeName = this.huixian.typeName
        this.$ajax(
        `${this.subUrl.activity}/sob/updateSob`,
        data,
        res => {
          this.$message({
            message: "编辑成功",
            type: "success",
            timeout: 1000
          });
          this.ishuixian = false;
          this.$router.go(-1);
        },
        this
      );
      }else{
        this.$ajax(
        `${this.subUrl.activity}/sob/addSob`,
        data,
        res => {
          this.$message({
            message: "添加成功",
            type: "success",
            timeout: 1000
          });
          this.$router.go(-1);
        },
        this
      );
      }
      
    },
    //获取上线数量
    getMaxNum(){
    	
    	let data = {
        token: this.$getkey()       
      };
    	this.$ajax(
        `${this.subUrl.activity}/sob/getTheMaximumNumber`,
        data,
        res => {
          console.log(res,'num')
          this.num="上限数不能超过"+res.data.value
        },
        this
      );
    },
    chooseSuccess(e) {
      this.showHangye = false;
      if (e) {
        this.typeId = e.require.guid;
        this.typeName = e.require.name;
        console.log(e);
      }
    }
  },

  mounted(){
  	  this.getMaxNum()
      var url = document.location.href;
      var urlList = url.split('/');
      console.log(urlList)
      var urlGuid = urlList[urlList.length-1].split('.')[0];
      if(urlGuid == "add"){
        urlGuid = ''
        this.ishuixian = false
        return
      } else {
        let data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          sobId: urlGuid
        }
        this.$ajax(
        `${this.subUrl.activity}/sob/sobSetDetail`,
        data,
        res => {
          console.log(res,'res')
          this.huixian = res.data
          this.ishuixian = true
          this.cost = res.data.cost
          this.amount = res.data.amount
          this.typeName = res.data.typeName
        },
        this
      );
      }
     
  }
};
</script>
<style scoped>
input {
  outline: none;
  border-width: 1px;
  color: #666;
}
.inputBox > div {
  margin-bottom: 0.2rem;
}
.shangjidian {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
}
</style>


