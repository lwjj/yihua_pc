<template>
<!-- 新建任务 -->
<div id='build_inform'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>绑定物业公司</div> -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/wuye_contact/rela_manage/rela_manage' }">物业关系</el-breadcrumb-item>
            <el-breadcrumb-item>绑定物业公司</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
<div class="container" v-show="show">
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="物业公司" prop="companyName">
    <!--<el-input v-model="ruleForm.companyName" placeholder="请输入物业公司"></el-input>-->
     <el-select style='width: 100%;' v-model="ruleForm.companyName" filterable allow-create placeholder="请选择物业公司" @change="filterData">
        <el-option
            v-for="item in companyList"
            :key="item.guid"
            :label="item.organName"
            :value="item.organName">
        </el-option>
    </el-select>  
  </el-form-item>
  <!-- <el-form-item label="所属片区" prop="district">
    <el-input v-model="ruleForm.district" placeholder="请选择所属片区"></el-input>
  </el-form-item> -->
    <!-- 片区 -->
        <el-form-item label="片区" prop="district">
          <div class="flex-row-nowrap">
            <el-select class="flex1 mr1" v-model="ruleForm.province" placeholder="选择省/直辖市" @change="getCity">
              <el-option  v-for="(item,index) in provinceList" :key="index" :label="item.dictDataName"
                          :value="item.guid"></el-option>
            </el-select>
            <el-select class="flex1" v-model="ruleForm.city" placeholder="选择市" @change="getXian">
              <el-option v-for="(item,index) in cityList" :key="index" :label="item.dictDataName"
                         :value="item.guid"></el-option>
            </el-select>
          </div>
          <div class="flex-row-nowrap mt1">
            <el-select class="flex1 mr1" v-model="ruleForm.xian" placeholder="选择区/县" @change="getDistrict">
              <el-option v-for="(item,index) in xianList" :key="index" :label="item.dictDataName"
                         :value="item.guid"></el-option>
            </el-select>
            <el-select class="flex1"  v-model="ruleForm.district" placeholder="选择片区" @change="getDictid">
              <el-option v-for="(item,index) in districtList" :key="index" :label="item.dictDataName"
                         :value="item.guid"></el-option>
            </el-select>
          </div>
          <!-- <el-cascader :options="districtList" :show-all-levels="false" v-model="ruleForm.district" placeholder="请选择片区"></el-cascader> -->
        </el-form-item>
             <el-form-item label="所在位置" prop="address">
                <el-input v-model="ruleForm.address" readonly @focus="chooseLocation()" placeholder="请选择所在位置"></el-input>
            </el-form-item>
            <el-form-item label="详细地址" prop="detailAddr">
                <el-input v-model="ruleForm.detailAddr" placeholder="请输入详细地址"></el-input>
            </el-form-item>
            <el-form-item label="管理关系" prop="relation">
                <!-- <el-input v-model="ruleForm.relation" placeholder="请选择管理关系"></el-input> -->
                <el-select v-model="ruleForm.relation" placeholder="请选择管理关系" @change="filterStatus">
                  <el-option
                    v-for="item in stateList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>  
            </el-form-item>
            <el-form-item label="联系人" prop="contact">
                <el-input  v-model="ruleForm.contact"  placeholder="请输入联系人"></el-input>              
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
                <el-input  v-model="ruleForm.mobile"  placeholder="请输入手机号码" :maxlength="11"></el-input>               
            </el-form-item>
            <el-form-item class="submitBtn">
                <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                <p>若公司没有注册本平台立即邀请加入</p>
            </el-form-item>
        </el-form>
    </div>
        <map1 style="margin-top:20px;" v-if="mapShow" @chooseSuccess="chooseSuccess"></map1>
    </div>

</template> 
<script>
import map1 from "../../../login/map";
export default {
  components: {
    map1
  },
  data() {
    return {
      mapShow: false,
      show: true,
      userInfo: "",
      organInfo: "",
      provinceList: [],
      cityList: [],
      xianList: [],
      districtList: [],
      companyList:[],
      flag:2,
      provinceId: "",
      cityId: "",
      xianId: "",
      districtId: "",
      relationId: "",
      ruleForm: {
        province: "",
        city: "",
        xian: "",
        district: "",
        address: "",
        companyName: "",
        lng: "",
        lat: "",
        detailAddr: "",
        relation: "",
        contact: "",
        mobile: ""
      },
      stateList: [
        {
          value: "1",
          label: "直属关系(包含财务管理)"
        },
        {
          value: "2",
          label: "托管关系(不包含财务管理)"
        }
      ],
      rules: {
        companyName: [
          { required: true, message: "请输入物业公司", trigger: "blur" }
        ],
        district: [
          { required: true, message: "请选择所属片区", trigger: "change" }
        ],
        address: [
          { required: true, message: "请选择所在位置", trigger: "change" }
        ],
        detailAddr: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        relation: [
          { required: true, message: "请选择管理关系", trigger: "change" }
        ],
        contact: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        mobile: [
          { required: true, message: "请输入正确的手机号码", trigger: "blur",min:11,max: 11 },
          //  { type: 'number', message: '手机号码必须为数字值'}
        ]
      }
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    //选择地址
    chooseLocation() {
      this.mapShow = true;
      this.show = false;
    },
    // 筛选状态
    filterStatus(e) {
      this.relationId = e;
    },
    //筛选出相关的物业公司联系人和电话号码
    filterData(){
    	var flag=''
    	this.companyList.forEach((item)=>{
    		
    		if(item.organName==this.ruleForm.companyName){
    			console.log(item,'item')
    		    this.ruleForm.contact=item.name;
    		    this.ruleForm.mobile=item.account;
    		    flag=1;
    		    return false;
    		}else{
    			
    		}
    		
    	})
    	if(flag!=1){
    		this.ruleForm.contact='';
    		this.ruleForm.mobile='';
    	}
    	
    },
    //map子组件选择成功
    chooseSuccess(e) {
      this.mapShow = false;
      this.show = true;
      console.log(e, "地图信息");
      this.ruleForm.address = e.address;
      this.ruleForm.lng = e.location.lng;
      this.ruleForm.lat = e.location.lat;
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
    //获取物业公司
     getWuyeCompang() {
      let data={
      	organType:4
      };
      this.$ajax(
        `${this.subUrl.user}/admin/organizationType/getOrganInfo`,
        data,
        res => {
          console.log(res.data, "777777");        
            this.companyList = res.data;
      
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
      this.ruleForm.city = "";
    },
    clearXian() {
      this.xianList = "";
      this.ruleForm.xian = "";
    },
    cleardistrict() {
      this.districtList = "";
      this.ruleForm.district = "";
    },

    // 提交发布
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            this.ruleForm.dept == "" &&
            this.ruleForm.employ == "" &&
            this.ruleForm.customer == ""
          ) {
            this.$message.error("必须选择一个通知对象");
            return;
          }
          var data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            organId: this.organInfo.guid,
            companyName: this.ruleForm.companyName,
            district: [
              this.provinceId,
              this.cityId,
              this.xianId,
              this.districtId
            ].join(),
            lng: this.ruleForm.lng,
            lat: this.ruleForm.lat,
            detailAddr: this.ruleForm.detailAddr,
            relation: this.relationId,
            contact: this.ruleForm.contact,
            mobile: this.ruleForm.mobile
          };
          console.log(data, "bindData");
          this.$ajax(
            `${this.subUrl.activity}/proRelManage/bindProCompany`,
            data,
            res => {
              console.log(res, "bindProCompany");
              this.$message.success("操作成功");
              this.back();
            },
            this
          );
        } else {
          this.$message.error("请填写完整信息");
          return false;
        }
      });
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getProvince();
    this.getWuyeCompang();
  }
};
</script>
<style lang="scss" scoped>
#build_inform {
  height: 100%;
  padding-left: 300px;
  padding-right: 40px;
  overflow: scroll;
  .text {
    i {
      padding: 20px 20px;
    }
  }
}
.inform_object {
  margin-bottom: 10px;
}
.delList {
  background: #fff;
  padding: 20px 30px;
  font-size: 14px;
  li {
    width: 100%;
    padding: 5px 0;
    float: left;
    &:last-child {
      height: 50px;
      line-height: 50px;
      float: left;
    }
  }
  span {
    padding-left: 20px;
  }
}
.container {
  padding: 20px 0;
  margin-top: 20px;
  background: #fff;
}
// 表格居中
.el-form {
  margin: 0 auto !important;
  padding: 0 100px;
}
.submitBtn {
  text-align: center;
  button {
    width: 250px;
  }
  p{
    color: #888;
  }
}
</style>