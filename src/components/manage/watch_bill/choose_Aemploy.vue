<template>
<div id='choose_people'>
  <div class="chooseTitle clearfix">
    <el-button class="btn" type="primary" size="small" @click="submit">确定</el-button>
    <el-button class="btn mr2" type="primary" size="small" plain @click="back">返回</el-button>
  </div>
  <el-collapse v-model="activeNames" >
  <el-collapse-item :name="1" >
    <el-radio-group v-model="radio">
        <ul class="">
        <li v-for="(item2,index2) in organList" :key="index2">
            <el-radio class="chooseBox" :label="item2.userId+','+item2.userName" @change="checkSuccess">
              <span>{{item2.userName}}</span>
              <span>{{item2.post}}</span>
              <span>{{item2.account}}</span>
            </el-radio>
        </li>
      </ul>
  </el-radio-group>
  </el-collapse-item>
</el-collapse>
</div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: "",
      organInfo: "",
      organList: "",
      activeNames: 1,
      radio: ""
    };
  },
//   watch:{
//      deptType(curVal,oldVal){
//       if(curVal){
//        ;
//        this.deptType=curVal;
//       console.log(this.deptType,"deptType1")
       
//        }
//      },
// },
  // props:["deptType"],
  methods: {
    checkSuccess(){
      console.log(this.radio)
    },
    back(){
      this.$emit("back")
    },
    // 提交
    submit() {
      this.$emit("checkMen",this.radio)
    },
    // 获取机构部门人员
    getOrganMan(val) {
      // console.log(this.deptType,"deptType2")
      let data = {
        token: this.$getkey(),
        organId: this.organInfo.guid,
        // deptType:this.deptType  
        deptType:val   //1:客服部 2：工程部 3：秩序部
      };
      console.log(data,"mandata")
      this.$ajax(
        `${this.subUrl.activity}/watchBill/getDeptMember`,
        data,
        res => {
          console.log(res, "Man");
          this.organList = res.data;
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
  
    // this.getOrganMan();
  }
};
</script>
<style lang="scss" scoped>
.chooseTitle {
  .btn {
    float: right;
  }
}
.chooseBox {
  span {
    display: inline-block;
    padding: 10px;
  }
}

</style>