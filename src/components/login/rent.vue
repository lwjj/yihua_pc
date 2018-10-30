<template>
<div class="register_form">
     <div v-if="!show_job">
    <el-form ref="form" class="form" :model="registerData" label-width="80px">
      <el-form-item label="" label-width="0" prop="rentName">
        <div class="font600 center" style="font-size: 18px">租户注册</div>
      </el-form-item>
      <el-form-item label="租户名称" prop="rentName">
        <el-input v-model="registerData.rentName" placeholder="请输入租户名" :maxlength="20"></el-input>
    </el-form-item>
    <!-- 选择楼宇 -->
    <el-form-item label="楼宇名称" prop="louyuName">
      <div class="flex-row-nowrap">
        <el-select style="width:200px;flex:1" class="mr1" v-model="registerData.louyuName" placeholder="请选择楼宇" @change="getDong">
          <el-option v-for="(item,index) in louyuList"  :key="index" :label="item.buildingName" :value="item.guid"></el-option>
        </el-select>
        <el-select style="" v-model="registerData.dong" placeholder="栋" @change="getUnit">
          <el-option v-for="(item,index) in dongList"  :key="index" :label="item.ridName" :value="item.guid"></el-option>
        </el-select>
      </div>
    <el-select style="margin-top:20px" v-model="registerData.unit" placeholder="单元号" @change="getUnitId">
      <div class="flex">
        <el-option class="flex1" v-for="(item,index) in unitList"  :key="index" :label="item.unitName" :value="item.guid"></el-option>
      </div>
    </el-select>
    </el-form-item>
   <el-form-item label="所属行业" prop="hangyeName">
        <el-input readonly v-model="registerData.hangyeName" @focus="chooseJob()" placeholder="请选择所属行业"></el-input>
    </el-form-item>
      <!--用户信息-->
    <el-form-item label="用户名" prop="userName">
        <el-input v-model="registerData.userName" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item label="手机" prop="phone">
        <el-input v-model="registerData.phone" placeholder="请输入手机号" :maxlength="11"></el-input>
    </el-form-item>
    <el-form-item label="验证码" prop="code">
        <div class="flex-row-nowrap">
          <el-input style="flex:1" class="get-code mr1" v-model="registerData.code" placeholder="验证码" ></el-input>
          <el-button :disabled="disabled" type="primary" @click.native="sendCode1">{{btnValue}}</el-button>
        </div>
    </el-form-item>
    <el-form-item label="设置密码" prop="password">
      <div class="flex-row-nowrap">
        <el-input class="setcode_input flex1" :type="inputType?'password':'text'"
                  v-model="registerData.password" placeholder="6-12数字+字母组合" :maxlength="12"></el-input>
        <div class="eyes get-code" @click.stop.prevent="openEyes()">
          <img v-if="inputType" src="../../assets/images/register/closeeye.png" alt="">
          <img v-if="!inputType" src="../../assets/images/register/openeye.png" alt="">
        </div>
      </div>

    </el-form-item>
     <el-form-item>
     <div class="cursor" @click="showXieyi=true">查看<span class="checkXieyi">注册协议</span></div> 
     </el-form-item>
    <el-form-item>
      <div>
        <el-button type="primary" @click="register">同意协议并注册</el-button>
        <el-button type="" @click="$router.go(-1)">返回</el-button>
      </div>
    </el-form-item>
    </el-form>
   </div>
    <job v-if="show_job" @chooseSuccess="chooseSuccess1"></job>
    <xieyi class="xie" v-if="showXieyi" :type='7' @closeXieyi='closeXieyi'></xieyi> 

</div>

</template>

<script>
import Vue from "vue";
import qs from "qs";
import job from "./hangye.vue";
import xieyi from "./agreement";

export default {
  components: {
    job,
    xieyi
  },
  data() {
    return {
      url: "/register/rent",
      regPass: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
      regPhone: /^1[3578]\d{9}$/,
      btnValue: "获取验证码",
      showXieyi: false,
      disabled: false,
      show_job: false,
      inputType: "false",
      registerData: {
        rentName: "",
        louyuName: "",
        dong: "",
        unit: "",
        hangyeName: "",
        userName: "",
        phone: "",
        code: "",
        password: "",
        buildingId: "",
        ridgepoleId: "",
        unitId: ""
      },
      louyuList: [],
      dongList: [],
      unitList: []
    };
  },
  methods: {
    closeXieyi() {
      this.showXieyi = false;
    },
    // 选择楼宇
    getLouyu() {
      this.$ajax(
        `${this.subUrl.user}/comm/officeBuildingList`,
        "",
        res => {
          console.log(res);
          this.louyuList = res.data;
        },
        this
      );
    },
    //获取栋
    getDong(e) {
      this.clearDong();
      this.clearUnit();
      let id = e;
      this.registerData.buildingId = e;
      console.log(e);
      this.$ajax(
        `${this.subUrl.common}/comm/getBuildingRid?buildingId=${id}`,
        "",
        res => {
          // if (res.code == 1) {
          console.log(res);
          this.dongList = res.data;
          // } else {
          //   this.$message(res.msg);
          //   this.unitId = res.data.guid;
          //  }
        },
        this
      );
    },
    //获取单元
    getUnit(e) {
      this.clearUnit();
      let id = e;
      this.registerData.ridgepoleId = e;
      console.log(e);
      this.$ajax(
        `${this.subUrl.common}/comm/getBuildingUnit?ridId=${id}`,
        "",
        res => {
          // if (res.code == 1) {
          console.log(res);
          this.unitList = res.data;
          // } else {
          // this.$message(res.msg);
          // }
        },
        this
      );
    },
    getUnitId(e) {
      this.registerData.unitId = e;
      console.log(e);
    },
    clearDong() {
      this.registerData.dong = "";
      this.dongList = "";
    },
    clearUnit() {
      this.registerData.unit = "";
      this.unitList = "";
    },
    /*选择行业*/
    chooseJob() {
      this.show_job = true;
    },
    //选择行业类型
    chooseSuccess1(e) {
      this.rentShow1 = false;
      this.show_job = false;
      console.log(e, "行业类型");
      this.requireObj = e;
      if (e.free) {
        this.registerData.hangyeName = e.require.name + " " + e.free.name;
        this.registerData.hangye = [e.require.guid, e.free.guid];
      } else {
        this.registerData.hangyeName = e.require.name;
        this.registerData.hangye = [e.require.guid];
      }
    },
    //获取验证码
    sendCode1() {
      var that = this;
      if (
        this.registerData.phone == "" ||
        typeof this.registerData.phone == "undefined"
      ) {
        this.$message.error("手机号不能为空");
        return;
      } else if (!this.regPhone.test(this.registerData.phone)) {
        this.$message.error("手机号格式错误");
        return;
      }
      //倒计时
      this.disabled = true;
      var num = 60;
      this.btnValue = num + "秒后重新获取";
      var timer = setInterval(function() {
        num--;
        that.btnValue = num + "秒后重新获取";
        if (num === 0) {
          that.btnValue = "获取验证码";
          that.disabled = false;
          clearInterval(timer);
        }
      }, 1000);
      // 发送请求
      var data = {
        mobile: that.registerData.phone
      };
      this.$ajax(
        `${this.subUrl.user}/user/getVerificationCode`,
        data,
        res => {
          // if (res.code == 1) {
          console.log(res.data);
          that.$message({
            message: "已发送",
            type: "success",
            duration: 1500
          });
          // } else {
          //   that.$message(res.data.msg);
          // }
        },
        this
      );
    },
    // 显示密码
    openEyes() {
      if (this.inputType) {
        this.inputType = false;
      } else {
        this.inputType = true;
      }
    },
    //检查是否注册过
    verify(phone, data) {
      console.log(data);
      this.$ajax(
        `${this.subUrl.user}/user/register`,
        data,
        res1 => {
          // if (res1.code == 1) {
          this.$message({
            message: "注册成功",
            type: "success",
            duration: 1500
          });
          location.href = "#/account/login";
          //  }
          // else {
          //   this.$message({
          //     mes: res1.msg
          //   });
          // }
        },
        this
      );
    },
    //注册
    register() {
      var that = this;
      if (this.registerData.rentName == "") {
        return this.$message.error("请输入租户名");
      } else if (this.registerData.louyuName == "") {
        return this.$message.error("请选择楼宇名");
      } else if (this.registerData.dong == "") {
        return this.$message.error("请输入多少栋");
      } else if (this.registerData.hangyeName == "") {
        return this.$message.error("请选择行业");
      } else if (this.registerData.userName == "") {
        return this.$message.error("请输入用户名");
      } else if (this.registerData.phone == "") {
        return this.$message.error("手机号");
      } else if (!this.regPhone.test(this.registerData.phone)) {
        return this.$message.error("请输入正确的手机号");
      } else if (this.registerData.password == "") {
        return this.$message.error("请输入密码");
      } else if (!this.regPass.test(this.registerData.password)) {
        return this.$message.error("密码格式不正确");
      }
      var data = {
        type: 1,
        organName: this.registerData.rentName,
        buildingName: this.registerData.louyuName,
        buildingId: this.registerData.buildingId,
        ridgepoleId: this.registerData.ridgepoleId,
        unitId: this.registerData.unitId,
        industryType: this.registerData.hangye.join(","),
        userName: this.registerData.userName,
        mobile: this.registerData.phone,
        verificationCode: this.registerData.code,
        password: this.registerData.password
      };
      console.log(data);
      // 是否注册为管理员
      this.$confirm("是否注册为管理员？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "注册管理员成功!"
          });
          //this.registerData.isManager = true;
          data.isAdmin = 1;
          this.verify(this.registerData.phone, data);
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "取消管理员注册"
          // });
          data.isAdmin = 0;
          this.verify(this.registerData.phone, data);
        });
    }
  },
  mounted() {
    this.getLouyu();
    console.log(this.$route.params);
    /*设置用户类型,辨别主颜色------------------*/
    localStorage.setItem("userType", this.$route.params.type);
  }
};
</script>
<style scoped>
.form {
  width: 600px;
  margin: 50px auto;
  background: #fff;
  padding: 30px 50px 30px 20px;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
}
.title_type {
  text-align: center;
}
.setcode_input {
  width: 450px;
  float: left;
}
.eyes {
  float: left;
  margin-left: 10px;
}
.eyes img {
  width: 30px;
}
</style>
