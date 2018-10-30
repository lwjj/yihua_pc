<template>
  <div class="register_form">
    <div v-show="!rentShow && !show_job">
      <el-form ref="form" class="form" :model="registerData" label-width="80px">
        <el-form-item label="" label-width="0">
          <div class="font600 center" style="font-size: 18px">管理处注册</div>
        </el-form-item>
        <el-form-item label="管理处" prop="manageName">
          <el-input placeholder="请输入管理处名称" v-model="registerData.manageName" :maxlength="20"></el-input>
        </el-form-item>
        <!-- 选择楼宇 -->
        <el-form-item label="楼宇名称" prop="louyuName">
          <el-input placeholder="请输入楼宇名称" v-model="registerData.louyuName"></el-input>
        </el-form-item>
        <el-form-item label="所在位置" prop="address">
          <el-input v-model="registerData.address" readonly @focus="chooseLocation()" placeholder="请选择位置"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="det_address">
          <el-input placeholder="街道" v-model="registerData.det_address"></el-input>
        </el-form-item>
        <!-- 片区 -->
        <el-form-item label="片区" prop="district">
          <div class="flex-row-nowrap">
            <el-select class="flex1 mr1" v-model="registerData.province" placeholder="选择省/直辖市" @change="getCity">
              <el-option  v-for="(item,index) in provinceList" :key="index" :label="item.dictDataName"
                          :value="item.guid"></el-option>
            </el-select>
            <el-select class="flex1 "  v-model="registerData.city" placeholder="选择市" @change="getXian">
              <el-option v-for="(item,index) in cityList" :key="index" :label="item.dictDataName"
                         :value="item.guid"></el-option>
            </el-select>
          </div>
          <div class="flex-row-nowrap mt1">
            <el-select class="flex1 mr1" v-model="registerData.xian" placeholder="选择区/县" @change="getDistrict">
              <el-option v-for="(item,index) in xianList" :key="index" :label="item.dictDataName"
                         :value="item.guid"></el-option>
            </el-select>
            <el-select class="flex1"  v-model="registerData.district" placeholder="选择片区" @change="getDictid">
              <el-option v-for="(item,index) in districtList" :key="index" :label="item.dictDataName"
                         :value="item.guid"></el-option>
            </el-select>
          </div>
          <!-- <el-cascader :options="districtList" :show-all-levels="false" v-model="registerData.district" placeholder="请选择片区"></el-cascader> -->
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
            <el-input :maxlength="6" class="flex1 get-code mr1" v-model="registerData.code" placeholder="验证码"></el-input>
            <el-button :disabled="disabled" type="primary" @click.native="sendCode1">{{btnValue}}</el-button>
          </div>
        </el-form-item>
        <el-form-item label="设置密码" prop="password">
          <div class="flex-row-nowrap">
            <el-input class="setcode_input" :type="inputType?'password':'text'"
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
          <div class="flex-row-nowrap">
            <el-button style="width:500px" type="primary" @click="register">同意协议并注册</el-button>
            <el-button style="width:500px" type="" @click="$router.go(-1)">返回</el-button>
          </div>
        </el-form-item>
      </el-form>    
    </div>
    <choose v-if="rentShow" @chooseSuccess="chooseSuccess"></choose>
    <job v-if="show_job" @chooseSuccess="chooseSuccess1"></job>
    <xieyi class="xie" v-if="showXieyi" :type='7' @closeXieyi='closeXieyi'></xieyi> 
    

  </div>

</template>

<script>
import Vue from "vue";
import qs from "qs";
import choose from "./map.vue";
import job from "./hangye.vue";
import xieyi from "./agreement";
export default {
  components: {
    choose,
    job,
    xieyi
  },
  data() {
    return {
      url: "/register/rent",
      regPass: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
      regPhone: /^1[3578]\d{9}$/,
      btnValue: "获取验证码",
      disabled: false,
      showXieyi: false,
      rentShow: false,
      show_job: false,
      inputType: "false",
      registerData: {
        manageName: "",
        address: "",
        det_address: "",
        userName: "",
        phone: "",
        code: "",
        password: "",
        louyuName: "",
        hangyeName: "",
        buildingId: "",
        ridgepoleId: "",
        unitId: "",
        province: "",
        city: "",
        xian: "",
        district: ""
      },
      provinceList: [],
      cityList: [],
      xianList: [],
      districtList: [],
      provinceId: "",
      cityId: "",
      xianId: "",
      districtId: ""
      // louyuList: [],
      // dongList: [],
      // unitList: []
    };
  },
  methods: {
    closeXieyi() {
      this.showXieyi = false;
    },
    // // 选择楼宇
    // getLouyu() {
    //   this.$ajax(
    //     `${this.subUrl.user}/comm/officeBuildingList`,
    //     "",
    //     res => {
    //       console.log(res);
    //       if (res.code == 1) {
    //         this.louyuList = res.data;
    //       }
    //     },
    //     this
    //   );
    // },
    // //获取栋
    // getDong(e) {
    //   this.clearDong();
    //   this.clearUnit();
    //   let id = e;
    //   this.registerData.buildingId = e;
    //   console.log(e);
    //   this.$ajax(
    //     `${this.subUrl.common}/comm/getBuildingRid?buildingId=${id}`,
    //     "",
    //     res => {
    //       if (res.code == 1) {
    //         console.log(res);
    //         this.dongList = res.data;
    //       } else {
    //         this.$message(res.msg);
    //         this.unitId = res.data.guid;
    //       }
    //     },
    //     this
    //   );
    // },
    // //获取单元
    // getUnit(e) {
    //   this.clearUnit();
    //   let id = e;
    //   this.registerData.ridgepoleId = e;
    //   console.log(e);
    //   this.$ajax(
    //     `${this.subUrl.common}/comm/getBuildingUnit?ridId=${id}`,
    //     "",
    //     res => {
    //       if (res.code == 1) {
    //         console.log(res);
    //         this.unitList = res.data;
    //       } else {
    //         this.$message(res.msg);
    //       }
    //     },
    //     this
    //   );
    // },
    // getUnitId(e) {
    //   this.registerData.unitId = e;
    //   console.log(e);
    // },
    // clearDong() {
    //   console.log("clear");
    //   this.registerData.dong = "";
    //   this.dongList = "";
    // },
    // clearUnit() {
    //   this.registerData.unit = "";
    //   this.unitList = "";
    // },
    //选择地址
    chooseLocation() {
      this.rentShow = true;
    },
    //map子组件选择成功
    chooseSuccess(e) {
      this.rentShow = false;
      this.requireObj = e;
      console.log(e, "地图信息");
      this.registerData.address = e.address;
      this.registerData.location = e.location;
    },

    // 获取省
    getProvince() {
      this.$ajax(
        `${this.subUrl.user}/comm/getDistrictList?id=0`,
        "",
        res => {
          console.log(res.data, "province");
          if (res.code == 1) {
            this.provinceList = res.data;
          }
        },
        this
      );
    },
    getCity(e) {
      this.clearCity();
      this.clearXian();
      this.cleardistrict();
      let id = e;
      this.provinceId = e;
      this.$ajax(
        `${this.subUrl.user}/comm/getDistrictList?id=${id}`,
        "",
        res => {
          if (res.code == 1) {
            this.cityList = res.data;
          }
        },
        this
      );
    },
    getXian(e) {
      this.clearXian();
      this.cleardistrict();
      let id = e;
      this.cityId = e;
      this.$ajax(
        `${this.subUrl.user}/comm/getDistrictList?id=${id}`,
        "",
        res => {
          if (res.code == 1) {
            this.xianList = res.data;
          }
        },
        this
      );
    },
    //获取片区
    getDistrict(e) {
      this.cleardistrict();
      let id = e;
      this.xianId = e;
      this.$ajax(
        `${this.subUrl.user}/comm/getDistrictList?id=${id}`,
        "",
        res => {
          if (res.code == 1) {
            this.districtList = res.data;
          }
        },
        this
      );
    },
    //获取片区id
    getDictid(e) {
      console.log(e);
      this.districtId = e;
    },
    clearCity() {
      this.cityList = "";
      this.registerData.city = "";
    },
    clearXian() {
      this.xianList = "";
      this.registerData.xian = "";
    },
    cleardistrict() {
      this.districtList = "";
      this.registerData.district = "";
    },

    //选择行业
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
          if (res.code == 1) {
            console.log(res.data);
            that.$message({
              message: "已发送",
              type: "success",
              duration: 1500
            });
          } else {
            that.$message(res.data.msg);
          }
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
          if (res1.code == 1) {
            this.$message({
              message: "注册成功",
              type: "success",
              duration: 1500
            });
            location.href = "#/account/login";
          }
        },
        this
      );
    },
    //注册
    register() {
      if (this.registerData.manageName == "") {
        return this.$message.error("请输入管理处名称");
      } else if (this.registerData.louyuName == "") {
        return this.$message.error("请输入楼宇名");
      } else if (this.registerData.address == "") {
        return this.$message.error("请选择位置");
      } else if (this.registerData.det_address == "") {
        return this.$message.error("请输入详细地址");
      } else if (this.registerData.district == "") {
        return this.$message.error("请选择片区");
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
        type: 3,
        organName: this.registerData.manageName,
        address: this.registerData.address + this.registerData.det_address,
        lng: this.registerData.location.lng,
        lat: this.registerData.location.lat,
        district: [
          this.provinceId,
          this.cityId,
          this.xianId,
          this.districtId
        ].join(),
        buildingName: this.registerData.louyuName,
        // ridgepoleId: this.registerData.ridgepoleId,
        // unitId: this.registerData.unitId,
        industryType: this.registerData.hangye.join(),
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
    // 获取省
    this.getProvince();
    // this.getLouyu();
    console.log(this.$route.params);
    /*设置用户类型,辨别主颜色*/
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
