<template>
<div id='subTemplate'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>值班表</div> -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/watch_bill' }">值班表</el-breadcrumb-item>
            <el-breadcrumb-item>编辑</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="layout" v-show="show">
          <!-- 筛选条件 -->
    <!-- <div class="filtrate"> -->
          <!-- tab切换 -->
      <!-- <el-menu :default-active="activeIndex" 
      class="el-menu-demo"
       mode="horizontal" 
       active-text-color="#1e82d2" 
     >
        <el-menu-item index="1">今天</el-menu-item>
        <el-menu-item index="2">明天</el-menu-item>
      </el-menu> -->
    <!-- </div> -->
    <div class="watchBill">
       <ul class="delList clearfix">
        <li><i>管理处总调度:</i><el-input readonly @focus="choosePeople()" class="iniputText"  v-model="dispatcherName"></el-input></li>  
        <!-- <li>联系电话: <el-input class="iniputText" v-model="dispatcherPhone"></el-input></li> -->
        <li><i>管理处当值总值班:</i><el-input readonly @focus="choosePeople0()" class="iniputText"  v-model="watchName"></el-input></li>  
      </ul>
    </div>
      <!-- 表单 -->
    <div class="watchDept" >
      <ul class="clearfix">
        <li><i></i>早班</li>
        <li>客户部:<el-input class="iniputText" readonly v-model="watchkeeper.mos[0].userName" @focus="choosePeople2()" placeholder="请选择"></el-input></li>
        <li>工程部:<el-input class="iniputText" readonly v-model="watchkeeper.mos[1].userName" @focus="choosePeople3()" placeholder="请选择"></el-input></li>
        <li>秩序部:<el-input class="iniputText" readonly v-model="watchkeeper.mos[2].userName" @focus="choosePeople1()" placeholder="请选择"></el-input></li>
      </ul>
      <ul class="clearfix">
        <li><i></i>中班</li>
        <li>客户部:<el-input class="iniputText" readonly v-model="watchkeeper.mis[0].userName" @focus="choosePeople5() " placeholder="请选择"></el-input></li>
        <li>工程部:<el-input class="iniputText" readonly v-model="watchkeeper.mis[1].userName" @focus="choosePeople6()" placeholder="请选择"></el-input></li>
        <li>秩序部:<el-input class="iniputText" readonly v-model="watchkeeper.mis[2].userName" @focus="choosePeople4()" placeholder="请选择"></el-input></li>
      </ul>
      <ul class="clearfix">
        <li><i></i>晚班</li>
        <li>客户部:<el-input class="iniputText" readonly v-model="watchkeeper.nis[0].userName" @focus="choosePeople8()" placeholder="请选择"></el-input></li>
        <li>工程部:<el-input class="iniputText" readonly v-model="watchkeeper.nis[1].userName" @focus="choosePeople9()" placeholder="请选择"></el-input></li>
        <li>秩序部:<el-input class="iniputText" readonly v-model="watchkeeper.nis[2].userName" @focus="choosePeople7()" placeholder="请选择"></el-input></li>
      </ul>
    </div>
    <div class="phone">
      <ul>
        <li>客户部电话:<span><el-input class="iniputText" :maxlength="11" v-model="prTel"></el-input></span></li>
        <li>工程部电话:<span><el-input class="iniputText" :maxlength="11" v-model="orTel"></el-input></span></li>
        <li>秩序部电话:<span><el-input class="iniputText" :maxlength="11" v-model="csTel"></el-input></span></li>
      </ul>
    </div>
    <el-button type="primary" class="floatR" size=""  @click="addList">确定</el-button>
</div>
  <chooseEmploy class="choose" v-show="showAllEmp" @checkMen="selectMen"></chooseEmploy>  
  <chooseEmploy class="choose" v-show="showAllEmp1" @checkMen="selectMen1"></chooseEmploy> 

  <chooseAEmploy class="choose" v-show="showMyEmp1" ref="chooseAEmploy1"  @checkMen="selectDeptMen1" @back="goback1"></chooseAEmploy>    
  <chooseAEmploy class="choose" v-show="showMyEmp2" ref="chooseAEmploy2"  @checkMen="selectDeptMen2" @back="goback2"></chooseAEmploy>    
  <chooseAEmploy class="choose" v-show="showMyEmp3" ref="chooseAEmploy3"  @checkMen="selectDeptMen3" @back="goback3"></chooseAEmploy>    
  <chooseAEmploy class="choose" v-show="showMyEmp4" ref="chooseAEmploy4"  @checkMen="selectDeptMen4" @back="goback4"></chooseAEmploy>    
  <chooseAEmploy class="choose" v-show="showMyEmp5" ref="chooseAEmploy5"  @checkMen="selectDeptMen5" @back="goback5"></chooseAEmploy>    
  <chooseAEmploy class="choose" v-show="showMyEmp6" ref="chooseAEmploy6"  @checkMen="selectDeptMen6" @back="goback6"></chooseAEmploy>    
  <chooseAEmploy class="choose" v-show="showMyEmp7" ref="chooseAEmploy7"  @checkMen="selectDeptMen7" @back="goback7"></chooseAEmploy>    
  <chooseAEmploy class="choose" v-show="showMyEmp8" ref="chooseAEmploy8"  @checkMen="selectDeptMen8" @back="goback8"></chooseAEmploy>    
  <chooseAEmploy class="choose" v-show="showMyEmp9" ref="chooseAEmploy9"  @checkMen="selectDeptMen9" @back="goback9"></chooseAEmploy>    
</div>
</template>
<script>
import chooseEmploy from "../../choose_people/choose_Aemploy";
import chooseAEmploy from "./choose_Aemploy";

export default {
  components: {
    chooseAEmploy,
    chooseEmploy
  },
  data() {
    return {
      regPhone: /^1[3578]\d{9}$/,
      // deptType: "1",
      showAllEmp: false,
      showAllEmp1: false,

      showMyEmp1: false,
      showMyEmp2: false,
      showMyEmp3: false,
      showMyEmp4: false,
      showMyEmp5: false,
      showMyEmp6: false,
      showMyEmp7: false,
      showMyEmp8: false,
      showMyEmp9: false,
      show: true,
      dateType: "1",
      activeIndex: "1",
      userInfo: {},
      organInfo: {},
      watchData: "",
      list: "",

    
      dispatcher: "",
      dispatcherName: "",
      watch: "",
      watchName: "",

      csTel: "",
      prTel: "",
      orTel: "",

      // 排序位置 1:客服部，2：工程部，3：秩序部
      watchkeeper: {
        mos: [
          { userName: "", userId: 0, sort: 1 },
          { userName: "", userId: 0, sort: 2 },
          { userName: "", userId: 0, sort: 3 }
        ],
        mis: [
          { userName: "", userId: 0, sort: 1 },
          { userName: "", userId: 0, sort: 2 },
          { userName: "", userId: 0, sort: 3 }
        ],
        nis: [
          { userName: "", userId: 0, sort: 1 },
          { userName: "", userId: 0, sort: 2 },
          { userName: "", userId: 0, sort: 3 }
        ]
      }
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    goback1(){
      this.show = true;
      this.showMyEmp1 = false;
    },
    goback2(){
      this.show = true;
      this.showMyEmp2 = false;
    },
    goback3(){
      this.show = true;
      this.showMyEmp3 = false;
    },
    goback4(){
      this.show = true;
      this.showMyEmp4 = false;
    },
    goback5(){
      this.show = true;
      this.showMyEmp5 = false;
    },
    goback6(){
      this.show = true;
      this.showMyEmp6 = false;
    },
    goback7(){
      this.show = true;
      this.showMyEmp7 = false;
    },
    goback8(){
      this.show = true;
      this.showMyEmp8 = false;
    },
    goback9(){
      this.show = true;
      this.showMyEmp9 = false;
    },
    turnTo(e) {
      this.$router.push(e);
    },
   
    // 管理处总调度
    choosePeople() {
      this.show = false;
      this.showAllEmp = true;
    },
    selectMen(radio) {
      this.show = true;
      this.showAllEmp = false;
      this.dispatcher = radio.split(",")[0];
      this.dispatcherName = radio.split(",")[1];
    },
    // 管理处当值总值班:
    choosePeople0() {
      this.show = false;
      this.showAllEmp1 = true;
    },
    selectMen1(radio) {
      this.show = true;
      this.showAllEmp1 = false;
      this.watch = radio.split(",")[0];
      this.watchName = radio.split(",")[1];
    },



   
    // 早班 z次序部
    choosePeople1() {
      // this.getChildMethod(3); //1:客服部 2：工程部 3：秩序部
       this.$refs.chooseAEmploy1.getOrganMan(3);
      this.show = false;
      this.showMyEmp1 = true;
    },
    selectDeptMen1(radio) {
      this.show = true;
      this.showMyEmp1 = false;
      this.watchkeeper.mos[2].userId = radio.split(",")[0];
      this.watchkeeper.mos[2].userName = radio.split(",")[1];
        console.log(this.watchkeeper.mos[2].userId,"this.watchkeeper.mos[2].userId ")
        console.log(this.watchkeeper.mos[1].userId,"this.watchkeeper.mos[1].userId ")
        console.log(this.watchkeeper.mos[0].userId,"this.watchkeeper.mos[0].userId ")
        
      
    },
      //  z客户部
      choosePeople2() {
       this.$refs.chooseAEmploy2.getOrganMan(1);
        this.show = false;
        this.showMyEmp2 = true;
      },
      selectDeptMen2(radio) {
        this.show = true;
        this.showMyEmp2 = false;
        this.watchkeeper.mos[0].userId = radio.split(",")[0];
        this.watchkeeper.mos[0].userName = radio.split(",")[1];
        console.log(this.watchkeeper.mos[2].userId,"this.watchkeeper.mos[2].userId ")
        console.log(this.watchkeeper.mos[1].userId,"this.watchkeeper.mos[1].userId ")
        console.log(this.watchkeeper.mos[0].userId,"this.watchkeeper.mos[0].userId ")
      },
      // z工程部
      choosePeople3() {
       this.$refs.chooseAEmploy3.getOrganMan(2);
        this.show = false;
        this.showMyEmp3 = true;
      },
      selectDeptMen3(radio) {
        this.show = true;
        this.showMyEmp3 = false;
        this.watchkeeper.mos[1].userId = radio.split(",")[0];
        this.watchkeeper.mos[1].userName = radio.split(",")[1];
         console.log(this.watchkeeper.mos[2].userId,"this.watchkeeper.mos[2].userId ")
        console.log(this.watchkeeper.mos[1].userId,"this.watchkeeper.mos[1].userId ")
        console.log(this.watchkeeper.mos[0].userId,"this.watchkeeper.mos[0].userId ")
      },
    
      // 中班 z次序部
      choosePeople4() {
        this.$refs.chooseAEmploy4.getOrganMan(3);
        this.show = false;
        this.showMyEmp4 = true;
      },
      selectDeptMen4(radio) {
        this.show = true;
        this.showMyEmp4 = false;
        this.watchkeeper.mis[2].userId = radio.split(",")[0];
        this.watchkeeper.mis[2].userName = radio.split(",")[1];
      },
      //  z客户部
      choosePeople5() {
        this.$refs.chooseAEmploy5.getOrganMan(1);
        this.show = false;
        this.showMyEmp5 = true;
      },
      selectDeptMen5(radio) {
        this.show = true;
        this.showMyEmp5 = false;
        this.watchkeeper.mis[0].userId = radio.split(",")[0];
        this.watchkeeper.mis[0].userName = radio.split(",")[1];
      },
      // z工程部
      choosePeople6() {
        this.$refs.chooseAEmploy6.getOrganMan(2);
        this.show = false;
        this.showMyEmp6 = true;
      },
      selectDeptMen6(radio) {
        this.show = true;
        this.showMyEmp6 = false;
        this.watchkeeper.mis[1].userId = radio.split(",")[0];
        this.watchkeeper.mis[1].userName = radio.split(",")[1];
      },
    
      // 晚班 z次序部
      choosePeople7() {
        this.$refs.chooseAEmploy7.getOrganMan(3);
        this.show = false;
        this.showMyEmp7 = true;
      },
      selectDeptMen7(radio) {
        this.show = true;
        this.showMyEmp7 = false;
        this.watchkeeper.nis[2].userId = radio.split(",")[0];
        this.watchkeeper.nis[2].userName = radio.split(",")[1];
      },
      //  z客户部
      choosePeople8() {
        this.$refs.chooseAEmploy8.getOrganMan(1);
        this.show = false;
        this.showMyEmp8 = true;
      },
      selectDeptMen8(radio) {
        this.show = true;
        this.showMyEmp8 = false;
        this.watchkeeper.nis[0].userId = radio.split(",")[0];
        this.watchkeeper.nis[0].userName = radio.split(",")[1];
      },
      // z工程部
      choosePeople9() {
        this.$refs.chooseAEmploy9.getOrganMan(2);
        this.show = false;
        this.showMyEmp9 = true;
      },
      selectDeptMen9(radio) {
        this.show = true;
        this.showMyEmp9 = false;
        this.watchkeeper.nis[1].userId = radio.split(",")[0];
        this.watchkeeper.nis[1].userName = radio.split(",")[1];
      },
    
    // 编辑
    addList() {
      if(this.dispatcherName==""){
        this.$message.error("请选择管理处总调度")
        return
      }else if(this.watchName==""){
        this.$message.error("请选择管理处当值总值班")
        return
      }else if(this.csTel==""){
        this.$message.error("请输入客服部电话")
        return
      }else if(this.prTel==""){
        this.$message.error("请输入工程部电话")
        return
      }else if(this.orTel==""){
        this.$message.error("请输入秩序部电话")
        return
      }else if(!this.regPhone.test(this.csTel)||!this.regPhone.test(this.prTel)||!this.regPhone.test(this.orTel)){
        this.$message.error("电话号码格式不对")
        return
      }
      console.log(this.watchkeeper,"oldwatchkeeper")
      
      for(let key in this.watchkeeper){
        for(let val of this.watchkeeper[key]){
          delete val.userName
        }
      }
      console.log(this.watchkeeper,"watchkeeper")
      let data = {
        token: this.$getkey(),
        dateType: this.$route.params.type, //今天 1:今天 2:明天 3:昨天 ,
        organId: this.organInfo.guid,
        dispatcher: this.dispatcher,
        watch: this.watch,
        csTel: this.csTel,
        prTel: this.prTel,
        orTel: this.orTel,
        watchkeeper:this.watchkeeper
      };
      this.$ajax1(
        `${this.subUrl.activity}/watchBill/add?`,
        data,
        res => {
          console.log(res, "addList");
          this.$message.success("保存成功");
          this.back()
        },
        this
      );
    },
      // 获取列表
    getList() {
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid,
        dateType: this.$route.params.type
      };
      this.$ajax(
        `${this.subUrl.activity}/watchBill/getWatchBill`,
        data,
        res => {
          console.log(res, "getList");
          // this.watchData = res.data;
          // this.list = res.data.list;
          let billdata = res.data
          // this.loading = true;
          this.dispatcherName=billdata.dispatcher.name;
          this.dispatcher=billdata.dispatcher.guid;

          this.watchName=billdata.watch.name;
          this.watch=billdata.watch.guid;

          this.csTel= billdata.deptList[0].tel,
          this.prTel= billdata.deptList[1].tel,
          this.orTel= billdata.deptList[2].tel,
          // userName
          this.watchkeeper.mos[0].userName=billdata.list[0][0].userInfo.name
          this.watchkeeper.mos[1].userName=billdata.list[0][1].userInfo.name
          this.watchkeeper.mos[2].userName=billdata.list[0][2].userInfo.name

          this.watchkeeper.mis[0].userName=billdata.list[1][0].userInfo.name
          this.watchkeeper.mis[1].userName=billdata.list[1][1].userInfo.name
          this.watchkeeper.mis[2].userName=billdata.list[1][2].userInfo.name

          this.watchkeeper.nis[0].userName=billdata.list[2][0].userInfo.name
          this.watchkeeper.nis[1].userName=billdata.list[2][1].userInfo.name
          this.watchkeeper.nis[2].userName=billdata.list[2][2].userInfo.name
          // userId
          this.watchkeeper.mos[0].userId=billdata.list[0][0].userId
          this.watchkeeper.mos[1].userId=billdata.list[0][1].userId
          this.watchkeeper.mos[2].userId=billdata.list[0][2].userId

          this.watchkeeper.mis[0].userId=billdata.list[1][0].userId
          this.watchkeeper.mis[1].userId=billdata.list[1][1].userId
          this.watchkeeper.mis[2].userId=billdata.list[1][2].userId

          this.watchkeeper.nis[0].userId=billdata.list[2][0].userId
          this.watchkeeper.nis[1].userId=billdata.list[2][1].userId
          this.watchkeeper.nis[2].userId=billdata.list[2][2].userId
        },
        this
      );
    },
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getList()
  }
};
</script>
<style lang="scss" scoped>
#subTemplate {
  .text {
    i {
      padding: 20px 20px;
    }
  }
}
.layout {
  padding-left: 10px;
}
// .filtrate {
//   width: 100%;
//   height: 60px;
//   background: #fff;
//   line-height: 60px;
//   padding-left: 20px;
//   .el-menu {
//     background: #fff;
//     li {
//       margin: 0 10%;
//     }
//     // font-size: 16px;
//   }
// }
//tab 切换
.el-menu-item {
  font-size: 16px;
  font-weight: 700;
}
.watchBill {
  overflow: hidden;
}
.delList {
  background: #fff;
  padding: 20px 100px;
  margin: 20px 0;
  li {
    width: 50%;
    padding: 5px 0;
    float: left;
  }
  span {
    padding-left: 20px;
  }
}
.watchDept {
  background: #fff;
  padding: 0 100px;
  ul {
    border-bottom: 1px dashed #888;
    padding: 30px 0;
    li {
      padding-left: 10px;
      float: left;
      width: 25%;
      display: inline-block;
      &:first-of-type {
        width: 80px;
        height: 36px;
        line-height: 36px;
        font-weight: 700;
      }
      span {
        padding-left: 5px;
      }
    }
  }
}
.phone {
  background: #fff;
  padding: 30px 100px;
  li {
    padding: 10px;
    span {
      padding-left: 20px;
    }
  }
}
.iniputText {
  width: 150px;
  padding-left: 10px;
}
</style>