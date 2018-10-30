<template>
<div class="newRightContent" style="overflow:auto">
  <div class="bgwhite border">
    <div class="yd-layout" style="width:750px">
    <!-- <yd-navbar :title="title" slot='navbar' :bgcolor='mainColor' height='.88rem' color='#fff'>
      <span slot="left" @click='$router.go(-1)'>
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </span>
    </yd-navbar> -->
    <div class="title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
          <el-breadcrumb-item @click.native='$router.go(-1)'>缴费</el-breadcrumb-item>
          <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div v-show='father'>
      <div class="chooseTimer">
        <div class="item">
          <div class="label">客户名称：</div>
          <el-select class="mr2" 
            @change="getUnit"
                disabled
            
           v-model="value" placeholder="请选择栋">
              <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.text"
                :value="index">
              </el-option>
            </el-select>
            <el-select v-model="value1" 
            @change="setUnit"
            disabled
            placeholder="请选择栋">
              <el-option
                v-for="(item,index) in options1"  
                :key="item.guid"
                :label="item.text"
                :value="index">
              </el-option>
            </el-select>
          <!-- <div class="input_content icon" @click="chooseDong">
            
            <input type="text" placeholder="栋" readonly v-model="dong.text">
          </div> -->
          <!-- <div class="input_content icon" @click="chooseUnit">
            <input type="text" placeholder="单元号" readonly v-model="unit.text">
          </div> -->
        </div>
        <!-- 选择时间 -->
        <div class="item">
          <div class="label">费用时间：</div> 
          <el-date-picker class="mr2"
            v-model="submitData.startTime"
            type="date"
            :clearable='false'
            
            value-format="yyyy-MM-dd" 
            placeholder="选择开始日期">
          </el-date-picker>
          <el-date-picker
            v-model="submitData.endTime"
            type="date"
            :clearable='false'
            value-format="yyyy-MM-dd"
            placeholder="选择结束日期">
          </el-date-picker>
          <!-- <div class="input_content">
            <yd-icon name='rili' style="margin-top:.05rem;margin-left:.2rem" custom color='#999' size='.45rem'></yd-icon>
            <yd-datetime type="date" style="flex:1;width:auto;text-align:left" v-model="submitData.startTime"></yd-datetime>
          </div>
          <div class="input_content">
            <yd-icon name='rili' style="margin-top:.05rem;margin-left:.2rem" color='#999' custom size='.45rem'></yd-icon>
            <yd-datetime type="date" style="flex:1;width:auto;text-align:left" v-model="submitData.endTime"></yd-datetime>
          </div> -->
        </div>
      </div>
        <!-- {{JSON.stringify($route.params.id)}} -->
      <!-- 项目单 -->
      <div class="tableBox">
        <div class="table" :style="$route.params.id == 1?`width:12.6rem;`:`width:7.5rem`">
          <!-- 标题 -->
          <div class="table_title" v-show='submitData.payProject.length > 0'>
            <span>项目名称</span>
            <span v-if="$route.params.id == 1">用量计量</span>
            <span>计费单价</span>
            <span  v-if="$route.params.id == 1">本月费用</span>
            <span  v-if="$route.params.id == 1">往月欠缴</span>
            <span  v-if="$route.params.id == 1">滞纳金</span>
            <span >应交合计</span>
            <span>备注</span>
          </div>
          <div class="table_content">
            <div class="colomn" v-for='(item,index) in submitData.payProject' :key="index">
              <span>{{item.projectName}}</span>
              <span  v-if="$route.params.id == 1">{{item.consumption}}</span>
              <span>{{item.chargeStandard}}</span>
              <span  v-if="$route.params.id == 1">{{item.thisMonthMoney}}</span>
              <span  v-if="$route.params.id == 1">{{item.lastMonthMoney}}</span>
              <span  v-if="$route.params.id == 1">{{item.lateFee}}</span>
              <span>{{item.totalMoney}}</span>
              <span>{{item.remarks}}</span>
            </div>
          </div>
        </div>
        <div class="flex-row flex-start pd3" @click='showEdit' :style="{color:mainColor}">
          <div class="icon mr1" :style="{background:mainColor}">+</div>
          <span>新增</span>
        </div>
      </div>
      <!-- 备注 -->
      <div class="remarks mt2">
        <div class="pd3 flex-row">备注</div>
        <yd-textarea slot="right" class="pd3 border bgwhite" style="line-height:.5rem;padding:.2rem 0.2rem .5rem;" placeholder="请输入备注" v-model='submitData.explain'
          maxlength="300"></yd-textarea>
      </div>
      <!-- 添加图片 -->
      <div style="width: 100%;background:#fff ">
        <div class="show-send-pic">
          <div class="logo-img-div">
            <img src="../../../../../assets/images/rent/estate/photo.png" alt="" class="fileImg add-logo-img">
            <input class="file hid-input"   type="file" accept="image/jpg,image/png,image/jpeg" @change="update">
          </div>
          <div class="logo-img-div" v-for="(item,index ) in uploadPreviewList" v-bind:key="index">
            <img :src="item" alt="" class="fileImg">
            <a @click="delThisPic(index)">
              <yd-icon name="delete" custom color='#000' size='.6rem'></yd-icon>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="bgwhite jiaofei" v-show='!father && $route.params.id == 1'>
      <div class="flex-row h7">
        <span class="label">项目名称</span>
        <input class="myInput flex1" maxlength="50" v-model="obj.projectName" type="text">
      </div>
      <div class="flex-row h7">
        <span class="label">计费用量</span>
        <input class="myInput flex1" type='number' oninput='value = this.value.slice(0,9)' v-model="obj.consumption">
      </div>
      <div class="flex-row h7">
        <span class="label">计费单价</span>
        <input class="myInput flex1" type='number'  oninput='value = this.value.slice(0,9)' v-model="obj.chargeStandard">
      </div>
      <div class="flex-row h7">
        <span class="label">本月费用</span>
        <input class="myInput flex1" type='number' oninput='value = this.value.slice(0,9)' v-model="obj.thisMonthMoney">
      </div>
      <div class="flex-row h7">
        <span class="label">往月欠交</span>
        <input class="myInput flex1" type='number' oninput='value = this.value.slice(0,9)' v-model="obj.lastMonthMoney">
      </div>
      <div class="flex-row h7">
        <span class="label">滞纳金</span>
        <input class="myInput flex1" type='number' oninput='value = this.value.slice(0,9)' v-model="obj.lateFee">
      </div>
      <div class="flex-row h7">
        <span class="label">应交合计</span>
        <input class="myInput flex1" v-model="obj.totalMoney" oninput='value = this.value.slice(0,9)' type="number">
      </div>
      <div class="flex-row h7">
        <span class="label">备注</span>
        <input class="myInput flex1" v-model="obj.remarks" maxlength="50" type="text">
      </div>
      <div class="flex-row flex-start h7" size='large'>
        <!-- <yd-button>保存</yd-button> -->
        <div class="label"></div>
        <yd-button class="h7 mr3" type="hollow" @click.native='cancel'>取消</yd-button>
        <yd-button class="h7" type="hollow" @click.native='savePay'>保存</yd-button>
      </div>
    </div>
    <div class="bgwhite jiaofei" v-show='!father && $route.params.id == 2'>
      <div class="flex-row h7">
        <span class="label">项目名称</span>
        <input class="myInput flex1" v-model="obj.projectName" maxlength="50" type="text">
      </div>
      <div class="flex-row h7">
        <span class="label">计费标准</span>
        <input class="myInput flex1" type='number' oninput='value = this.value.slice(0,9)' v-model="obj.chargeStandard">
      </div>
      <div class="flex-row h7">
        <span class="label">小计</span>
        <input class="myInput flex1" v-model="obj.totalMoney" oninput='value = this.value.slice(0,9)' type="number">
      </div>
      <div class="flex-row h7">
        <span class="label">备注</span>
        <input class="myInput flex1" v-model="obj.remarks" maxlength="50" type="text">
      </div>
      <div class="flex-row flex-start h7" size='large'>
        <!-- <yd-button>保存</yd-button> -->
        <div class="label"></div>
        <yd-button class="h7 mr3" type="hollow" @click.native='cancel'>取消</yd-button>
        <yd-button class="h7" type="hollow" @click.native='savePay'>保存</yd-button>
      </div>
    </div>
      <el-button type='primary' class="button mt2 ml2 mb2" @click.native='submit'>提交</el-button>
  </div>
  </div>
</div>
  
</template>
<script>
import VuePickers from "vue-pickers";
import qs from "qs";
import Vue from "vue";
import { Loading } from "element-ui";
import { TextArea } from "vue-ydui/dist/lib.rem/textarea";
/* 使用px：import {TextArea} from 'vue-ydui/dist/lib.px/textarea'; */

Vue.component(TextArea.name, TextArea);
import { Button, ButtonGroup } from "vue-ydui/dist/lib.rem/button";
/* 使用px：import {Button, ButtonGroup} from 'vue-ydui/dist/lib.px/button'; */

Vue.component(Button.name, Button);
Vue.component(ButtonGroup.name, ButtonGroup);
export default {
  data() {
    console.log(this.$route.params);
    if (this.$route.params.id == 1) {
      this.title = "物业管理费";
    } else {
      this.title = "专项管理费";
    }
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    console.log(this.userInfo, "userInfo");
    this.mainColor = this.$color[this.userInfo.organType];
    console.log(this.mainColor);
    this.value = this.userInfo.ridName;
    this.value1 = this.userInfo.unitName;
    console.log(this.userInfo, this.value1, this.value2);
    return {
      father: true,

      list: [],
      remarks: "",
      submitData: {
        acceptOrgId: this.organInfo.guid,
        buildingId: this.userInfo.buildingId,
        buildingRidId: this.userInfo.ridId,
        roomNumber: this.userInfo.unitId,
        startTime: this.$addDay(this.$today(), -30),
        endTime: this.$today(),
        type: this.$route.params.id,
        explain: "",
        payProject: [],
        accessorys: []
      },
      uploadFileList: [],
      uploadPreviewList: [],
      selectList: [],
      imageKeyList: [],
      imageUrlList: [],
      imgIndex: 0,
      getData: "",
      options: [],
      options1: [],
      pickData1: {
        columns: 1,
        isChange: false,
        pData1: []
      },
      pickData2: {
        columns: 1,
        isChange: false,
        pData1: []
      },

      obj: {
        chargeStandard: "",
        chargeUnit: "",
        consumption: "",
        projectName: "",
        thisMonthMoney: "",
        lastMonthMoney: "",
        lateFee: "",
        remarks: "",
        totalMoney: ""
      },
      show1: false,
      show2: false,
      dong: {},
      unit: {}
    };
  },
  components: {
    VuePickers
  },
  methods: {
    setUnit(index) {
      console.log(this.options1[index]);
      let obj = this.options1[index];
      this.submitData.roomNumber = obj.guid;
      this.submitData.acceptOrgId = obj.organId;
    },
    resetRequest(a) {
      this.isRequset = true;
      // 防止网络中断后不可发起请求
      setTimeout(() => {
        this.isRequset = false;
      }, 3000);
      if (a) {
        this.isRequset = false;
      }
    },
    // 重置图片
    resetImg() {
      this.uploadFileList = [];
      this.uploadPreviewList = [];
      this.selectList = [];
      this.imageKeyList = [];
      this.imageUrlList = [];
    },
    submit() {
      // 防止重复点击；
      if (this.isRequset) {
        return;
      }
      this.resetRequest();
      console.log(this.submitData);
      this.imgIndex = 0;
      var data = JSON.parse(JSON.stringify(this.submitData));
      data.startTime = data.startTime + " 00:00:00";
      data.endTime = data.endTime + " 23:59:59";
      data.token = this.$getkey();
      // if (data.buildingRidId == "") {
      //   return this.$message({ message: "请选择栋", type: "error" });
      // } else
      // if (this.submitData.roomNumber == "") {
      //   return this.$message({ message: "请选择单元id", type: "error" });
      // } else
      if (data.payProject.length == 0) {
        return this.$message({
          message: "请填写至少新增一个项目",
          type: "error"
        });
      } else if (data.explain == "") {
        return this.$message({ message: "请输入项目说明", type: "error" });
      } else {
        // this.$dialog.loading.open("提交中");
        this.loading = Loading.service({
          lock: true,
          text: "提交中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        setTimeout(() => {
          this.loading.close();
        }, 10000);
        console.log("图片", this.uploadFileList);
        if (this.uploadFileList.length == 0) {
          this.generate(data);
        } else {
          this.uploadImg(length, res => {
            console.log(this.imageKeyList);
            data.accessorys = this.imageKeyList;
            this.resetImg();
            // 此时设置可以点击
            this.resetRequest(1);
            console.log(data);
            // 请求生成缴费单
            this.generate(data);
          });
        }
      }
      console.log(data);
    },
    // 保存
    generate(data, cb) {
      this.$ajax1(
        `${this.subUrl.activity}/pay/addPay`,
        data,
        res => {
          this.loading.close();
          this.$message({
            message: "生成缴费单成功",
            timeout: 1500,
            type: "success"
          });
          this.$router.go(-1);
          cb && cb(res);
        },
        this
      );
    },

    savePay() {
      var obj = this.obj;
      this.obj.chargeUnit = this.obj.chargeStandard;
      if (this.$route.params.id == 1) {
        if (obj.projectName == "") {
          return this.$message({ message: "请输入项目名称", type: "error" });
        } else if (obj.consumption == "") {
          return this.$message({ message: "请输入计费用量", type: "error" });
        } else if (obj.chargeStandard == "") {
          return this.$message({ message: "请输入计费单价", type: "error" });
        } else if (obj.thisMonthMoney == "") {
          return this.$message({ message: "请输入本月费用", type: "error" });
        } else if (obj.lastMonthMoney == "") {
          return this.$message({ message: "请输入往月欠交", type: "error" });
        } else if (obj.lastMonthMoney == "") {
          return this.$message({ message: "请输入滞纳金", type: "error" });
        } else if (obj.totalMoney == "") {
          return this.$message({ message: "请输入应交合计", type: "error" });
        }
      } else {
        console.log(obj);
        if (obj.projectName == "") {
          return this.$message({ message: "请输入项目名称", type: "error" });
        } else if (obj.chargeStandard == "") {
          return this.$message({ message: "请输入计费标准", type: "error" });
        } else if (obj.totalMoney == "") {
          return this.$message({ message: "请输入计费小计", type: "error" });
        }
      }
      obj.chargeStandard = obj.chargeStandard * 1;
      obj.chargeUnit = obj.chargeUnit * 1;
      obj.consumption = obj.consumption * 1;
      obj.thisMonthMoney = obj.thisMonthMoney * 1;
      obj.lastMonthMoney = obj.lastMonthMoney * 1;
      obj.lateFee = obj.lateFee * 1;
      obj.totalMoney = obj.totalMoney * 1;
      this.submitData.payProject.push(obj);
      this.obj = {
        chargeStandard: "",
        chargeUnit: "",
        consumption: "",
        projectName: "",
        thisMonthMoney: "",
        lastMonthMoney: "",
        lateFee: "",
        remarks: "",
        totalMoney: ""
      };
      this.father = true;
      console.log(this.submitData);
    },
    //取消
    cancel() {
      this.father = true;
    },

    getDong(id) {
      this.xhr
        .post(
          `${this.subUrl.common}/comm/getBuildingRid`,
          qs.stringify({
            buildingId: id
          })
        )
        .then(res => {
          if (res.data.code == 1) {
            let len = res.data.data.length;
            let arr = [];
            for (var i = 0; i < len; i++) {
              var obj = res.data.data[i];
              obj.value = res.data.data[i].guid;
              obj.text = res.data.data[i].ridName;
              arr.push(obj);
            }
            this.pickData1.pData1 = arr;
            this.options = arr;
          } else {
            this.$dialog.alert({
              message: res.data.msg
            });
            this.pickData2.pData1 = [];
            this.pickData3.pData1 = [];
          }
        });
    },
    getUnit(id) {
      let obj = this.options[id];
      id = obj.guid;
      this.submitData.buildingRidId = obj.guid;
      this.xhr
        .post(
          `${this.subUrl.common}/comm/getEnterUnit`,
          qs.stringify({
            ridId: id
          })
        )
        .then(res => {
          if (res.data.code == 1) {
            let len = res.data.data.length;
            let arr = [];
            for (var i = 0; i < len; i++) {
              var obj = res.data.data[i];
              console.log();
              obj.value = res.data.data[i].ridId;
              obj.text = res.data.data[i].unitName;
              arr.push(obj);
            }
            this.pickData2.pData1 = arr;
            this.options1 = arr;
            console.log(this.options1);
          } else {
            this.$dialog.alert({
              message: res.data.msg
            });
          }
        });
    },

    close: function() {
      this.show1 = false;
      this.show2 = false;
    },
    showEdit() {
      this.father = false;
    },
    chooseDong() {
      if (this.pickData1.pData1.length == 0) {
        return this.$message({ message: "数据为空", type: "error" });
      } else {
        this.show1 = true;
      }
    },
    chooseUnit() {
      if (this.pickData2.pData1.length == 0) {
        return this.$message({ message: "数据为空", type: "error" });
      } else {
        this.show2 = true;
      }
    },
    confirmFn(e) {
      this.dong = e.select1;
      console.log(JSON.stringify(e.select1));
      this.show1 = false;
      this.submitData.buildingRidId = e.select1.guid;
      this.getUnit(this.dong.guid);
    },
    confirmFn1(e) {
      JSON.stringify(e.select1);
      this.unit = e.select1;
      console.log(e.select1);
      this.submitData.roomNumber = e.select1.guid;
      this.submitData.acceptOrgId = e.select1.organId;
      this.show2 = false;
    },
    // 删除帖子
    delThisPic(index) {
      this.uploadPreviewList.splice(index, 1);
      this.uploadFileList.splice(index, 1);
    },
    // 生成预览图片
    setImgPreview() {
      this.uploadPreviewList = [];
      for (var i = 0; i < this.uploadFileList.length; i++) {
        this.uploadPreviewList.push(this.$getImgUrl(this.uploadFileList[i]));
      }
      console.log(this.uploadPreviewList);
    },
    update(e) {
      console.log(this.uploadFileList);
      this.imageUrl = this.getData.imageUrl;
      for (var i = 0; i < e.target.files.length; i++) {
        let file = e.target.files[i];
        this.uploadFileList.push(file);
      }
      this.setImgPreview();
      return;
      //先从自己的服务端拿到token
    },
    uploadImg(length, cb) {
      console.log(length);
      let d = new Date();
      this.token = this.getLogoMsg.token;
      this.imageUrl = this.getLogoMsg.domain;
      let tokenParem = {
        putPolicy:
          '{"name":"$(fname)","size":"$(fsize)","w":"$(imageInfo.width)","h":"$(imageInfo.height)","hash":"$(etag)"}',
        key:
          "orderReview/" +
          d.getFullYear() +
          "/" +
          (d.getMonth() + 1) +
          "/" +
          d.getDate() +
          "/" +
          d.valueOf() +
          ".png",
        bucket: this.imageUrl //七牛的地址，这个是你自己配置的（变量）
      };
      let param = new FormData(); //创建form对象
      param.append("chunk", "0"); //断点传输
      param.append("chunks", "1");
      console.log(this.imgIndex);
      var file = this.uploadFileList[this.imgIndex];
      console.log(this.uploadFileList);
      console.log(file, this.imgIndex);
      param.append(`file`, file, file.name);
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      param.append("token", this.token);
      this.uploading(param, config, file.name, res => {
        this.imgIndex = parseInt(this.imgIndex) + 1;
        if (this.imgIndex < this.imgLength) {
          this.uploadImg(length, function() {
            cb && cb();
          });
        } else {
          cb && cb();
        }
      }); //然后将参数上传七牛
    },
    getQiniuMsg() {
      var data = {
        organId: this.organInfo.guid,
        token: this.$getkey(),
        pageNo: 1,
        pageSeze: 15
      };
      this.xhr
        .post(`${this.subUrl.user}/qiniu/getInfo?token=` + data.token)
        .then(res => {
          if (res.data.code == 1) {
            console.log(res.data.getLogoMsg);
            this.getLogoMsg = res.data.data;
          } else if (res.data.code == "-902") {
            // fn.re_login(this);
          } else {
            this.$message({ message: res.data.msg });
          }
        });
    },
    uploading(param, config, pathName, cb) {
      this.xhr.post("http://up-z2.qiniu.com", param, config).then(response => {
        this.organLogo = response.data.key;
        this.imageKeyList.push(this.organLogo);
        this.imageUrlList.push(this.imageUrl + "/" + response.data.key);
        this.showLogo = true;
        cb && cb(response.data);
      });
    }
  },
  mounted() {
    this.getDong(this.userInfo.buildingId);
    this.getQiniuMsg();
  }
};
import "@/assets/css/wuye.css";
</script>
<style scoped>
.icon {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  text-align: center;
  line-height: 0.4rem;
  color: #fff;
}

.buttons {
  display: flex;
  height: 0.8rem;
  justify-content: space-between;
  border-top: 1px solid #ddd;
}

.show-send-pic {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  padding-bottom: 2em;
  padding: 0 0.2rem;
}

.logo-img-div {
  width: 23%;
  margin: 1%;
  /* border: 1px solid #e6e6e6; */
  min-height: 6em;
  padding: 0.5em;
  margin-top: 0.5em;
  border-radius: 6px;
  position: relative;
  background: #fff;
  display: inline-block;
}

.logo-img-div img {
  width: 100%;
  height: 100%;
  margin: 0;
}

.logo-img-div a {
  display: block;
  position: absolute;
  right: -0.1rem;
  top: -0.1rem;
}

.hid-input {
  opacity: 0;
  position: absolute;
  width: 5em;
  height: 5em;
}

.add-logo-img {
  width: 1.5rem !important;
  height: 1.5rem !important;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.buttons .button {
  flex: 1;
  border: none;
}

.tableBox {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
  margin-top: 0.4rem;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  background: #fff;
  min-height: 3rem;
}

.table {
  width: 12.6rem;
  text-align: center;
}

.table_title {
  height: 0.8rem;
  display: flex;
  align-items: center;
}

.colomn {
  height: 0.6rem;
  display: flex;
  align-items: center;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  margin-top: -1px;
}

.table_title span {
  display: block;
  width: 1.8rem;
}

.table_content span {
  display: block;
  width: 1.8rem;
  max-width: 1.8rem;
  text-overflow: ellipsis;
  overflow: hidden;
}

.chooseTimer {
  background: #fff;
  border-bottom: 1px solid #ddd;
}

.item {
  display: flex;
  height: 1rem;
  flex-flow: row nowrap;
  overflow: hidden;
  align-items: center;
  border-top: 1px solid #ddd;
  margin-top: -1px;
  padding: 0 0.24rem;
}

.item .input_content {
  height: 0.64rem;
  flex: 1;
  box-sizing: border-box;
  border: 1px solid #ddd;
  margin-right: 0.16rem;
  border-radius: 0.15rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
}

.item .input_content input {
  height: 100%;
  width: 100%;
  border: none;
  text-align: center;
  outline: none;
  color: #666;
  padding: 0 0.2rem;
}

.item .input_content.code {
  margin-right: 0.1rem;
}

.item .input_content.icon {
  background: url("../../../../../assets/images/register/right.png") no-repeat
    calc(100% - 0.2rem) center;
  background-size: 0.12rem;
  padding-right: 0.2rem;
}
</style>