<template>
<!-- 新建任务 -->
<div id='subTemplate'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>填写突发事件</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/emergency' }">突发事件</el-breadcrumb-item>
            <el-breadcrumb-item>填写突发事件</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
<div class="container" v-show="show">
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="事件类型" prop="EmerType">
        <el-select v-model="ruleForm.EmerType" placeholder="请选择事件类型" @change="selectEmerType">
            <el-option
            v-for="item in EmerTypeList"
            :key="item.value"
            :label="item.dictDataName"
            :value="item.guid">
            </el-option>
        </el-select>
    </el-form-item>
  <el-form-item label="发生地点" prop="occurPlace">
        <el-input maxlength="30" v-model="ruleForm.occurPlace" placeholder="请输入发生地点"></el-input>
  </el-form-item>
    <el-form-item label="发生时间" prop="occurDate">
        <el-date-picker
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="ruleForm.occurDate"
            type="datetime"
            placeholder="选择日期时间">
        </el-date-picker>
    </el-form-item>
    <el-form-item label="发现人" prop="finder">
        <el-input maxlength="30" v-model="ruleForm.finder" placeholder="请输入发现人"></el-input>
  </el-form-item>
<el-form-item label="事件详情" prop="eventDetail" >
    <el-input maxlength="200" type="textarea"  :autosize=" {minRows: 3}" v-model="ruleForm.eventDetail"></el-input>
  </el-form-item>
<el-form-item label="损失情况" prop="lossSituation" >
    <el-input maxlength="200" type="textarea"  :autosize=" {minRows: 3}" v-model="ruleForm.lossSituation"></el-input>
  </el-form-item>
<el-form-item label="处理情况" prop="dealWith" >
    <el-input maxlength="200" type="textarea"  :autosize=" {minRows: 3}" v-model="ruleForm.dealWith"></el-input>
  </el-form-item>

<!-- 照片 -->
<el-form-item label="上传附件">
  <div class="avatar-uploader">
        <el-upload
      :action="uploadUrl"
      list-type="picture-card"
      :data='otherData'
      :before-upload="beforeAvatarUpload"
      :on-preview="handlePictureCardPreview"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :limit='4'
      :on-exceed='uploadMax'
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
 </el-form-item>
<!-- 执行人 -->
<div class="report">
        <el-form-item label="收件人" prop="receiver">
          <el-input readonly v-model="ruleForm.receiver" @focus="choosePeople" placeholder="选填（默认为直属领导）"></el-input>
      </el-form-item>
    </div> 
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">立即发布</el-button>
  </el-form-item>
</el-form>
</div>
 <!-- 选人 -->
    <chooseAEmploy class="choose" v-show="showRecv" @checkMen="checkVerifyMen"></chooseAEmploy>  
      
</div>

</template> 
<script>
// 导入选人组件
import choosemyEmp from "../../choose_people/choose_myEmp";
import chooseAEmploy from "../../choose_people/choose_Aemploy";

export default {
  components: {
    choosemyEmp,
    chooseAEmploy
  },
  name: "",
  data() {
    this.uploadUrl = "http://up-z2.qiniu.com";
    return {
      userInfo: "",
      organInfo: "",
      otherData:{},
      showRecv: false,
      show: true,
      dialogImageUrl: "",
      dialogVisible: false,
      emerId: "",
      recvId: "",
      EmerTypeList: [],
      imgsAll:[],
      ruleForm: {
        EmerType: "",
        occurPlace: "",
        occurDate: "",
        finder: "",
        eventDetail: "",
        lossSituation: "",
        dealWith: "",
        receiver: "",
        imageNames:""
      },
      rules: {
        EmerType: [
          { required: true, message: "请选择事件类型", trigger: "change" }
        ],
        occurPlace: [
          { required: true, message: "请输入发生地点", trigger: "blur" }
          //{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        occurDate: [
          { required: true, message: "请选择发生时间", trigger: "blur" }
        ],
        finder: [{ required: true, message: "请输入发现人", trigger: "blur" }],
        eventDetail: [
          { required: true, message: "请输入事件详情", trigger: "blur" }
        ],
        lossSituation: [
          { required: true, message: "请输入损失情况", trigger: "blur" }
        ],
        dealWith: [
          { required: true, message: "请输入处理情况", trigger: "blur" }
        ],
        receiver: [
          { message: "请选择收件人", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    //图片上传
    getUploadToken() {
      this.$ajax(
        `${this.subUrl.user}/qiniu/getInfo`,
        { token: this.$getkey() },
        res => {
          console.log(res.data, "token");
          var obj = {
            chunk: 0,
            chunks: 1,
            token: res.data.token
          };
          this.otherData = obj;
          // obj.token;
        },
        this
      );
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadSuccess(res) {
        this.imgsAll[res.key] = res.key;
    },
    uploadError() {
      this.$message.error("上传失败");
    },
    uploadMax() {
      this.$message.error("最多上传4张图片");
    },
    beforeAvatarUpload(file) {
        const isImage = file.type.indexOf("image");
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (isImage==-1) {
            this.$message.error('上传图片格式有误!');
            return false
        }
        if (!isLt2M) {
             this.$message.error('上传头像图片大小不能超过 2MB!');
             return false
        }
        return isImage && isLt2M;
    },
    handleRemove(file, fileList) {
      delete this.imgsAll[file.response.key];
    },
    // 选择类型
    selectEmerType(e) {
      this.emerId = e;
    },
    //获取突发事件类型
    getEmerType() {
      this.$ajax(
        `${this.subUrl.user}/comm/queryEmergencyCategory`,
        "",
        res => {
          console.log(res, "emertype");
          // var obj ={dictDataName:"所有类型",guid:""}
          // res.data.TFC.unshift(obj)
          this.EmerTypeList = res.data.TFC;
        },
        this
      );
    },
    // 选接收人
    checkVerifyMen(radio) {
      console.log(radio);
      this.show = true;
      this.showRecv = false;
      this.ruleForm.receiver = radio.split(",")[1];
      this.recvId = radio.split(",")[0];
    },
    choosePeople() {
      this.show = false;
      this.showRecv = true;
    },
    // 提交发布
    submitForm(formName) {
      var a=[]
    for(var key in this.imgsAll){
      this.imgsAll[key]
      a.push(this.imgsAll[key])
    }
    this.ruleForm.imageNames=a.join(",")
    console.log(this.ruleForm.imageNames)
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            organId: this.organInfo.guid,
            deptId: this.userInfo.deptId,
            type: this.emerId,
            occurPlace: this.ruleForm.occurPlace,
            occurDate: this.ruleForm.occurDate,
            finder: this.ruleForm.finder,
            eventDetail: this.ruleForm.eventDetail,
            lossSituation: this.ruleForm.lossSituation,
            dealWith: this.ruleForm.dealWith,
            receivers: this.recvId,
            imageNames:this.ruleForm.imageNames
          };
          console.log(data,"subData");
          this.$ajax(
            `${this.subUrl.activity}/emergencyBill/submitedForApply`,
            data,
            res => {
              console.log(res, "submit");
              this.$message.success("发布成功");
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
    this.getEmerType();
    this.getUploadToken();
  }
};
</script>
<style lang="scss" scoped>
#subTemplate {
  overflow: scroll;
  .text {
    i {
      padding: 20px 20px;
    }
  }
}
.container {
  margin-left:10px; 
  margin-top: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  background: #fff;
}
// 表格居中
.el-form {
  margin: 0 auto !important;
  padding: 0 100px;
}
.delCon {
  padding: 5px 50px;
  background: #fff;
  p {
    padding: 5px 5px 50px 5px;
    border: 1px solid #ccc;
  }
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>