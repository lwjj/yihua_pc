<template>
<!-- 新建任务 -->
<div id='build_emer'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>填写申请</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/purchase' }">采购销售</el-breadcrumb-item>
            <el-breadcrumb-item>填写申请</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
<div class="container" >
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="width:800px">
    <el-form-item label="申请类型" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择申请类型" @change="selectType">
            <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
    </el-form-item>
  <el-form-item label="申请标题" prop="title">
        <el-input :maxlength="25" v-model="ruleForm.title" placeholder="请输入申请标题"></el-input>
  </el-form-item>
    <el-form-item label="启动时间" prop="startDate">
        <el-date-picker
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="ruleForm.startDate"
            type="datetime"
            placeholder="选择日期时间">
        </el-date-picker>
    </el-form-item>
    <el-form-item label="完成时间" prop="completionDate">
        <el-date-picker
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="ruleForm.completionDate"
            type="datetime"
            placeholder="选择日期时间">
        </el-date-picker>
    </el-form-item>
<el-form-item :maxlength="100" label="详情描述" prop="detail" >
    <el-input type="textarea" placeholder="请输入详情" :autosize=" {minRows: 3}" v-model="ruleForm.detail"></el-input>
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
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
  </el-form-item>
</el-form>
</div>
</div>

</template> 
<script>
// 导入选人组件
export default {
  data() {
    this.uploadUrl = "http://up-z2.qiniu.com";
    return {
      userInfo: "",
      organInfo: "",
      otherData:{},
      dialogImageUrl: "",
      dialogVisible: false,
      imgsAll:[],
      typeId: "",
      typeList: [
        {
          value: "1",
          label: "采购"
        },
        {
          value: "2",
          label: "供应"
        }
      ],
      ruleForm: {
        type: "",
        title: "",
        startDate: "",
        completionDate: "",
        detail: "",
        imageNames:""
      },
      rules: {
        type: [
          { required: true, message: "请选择申请类型", trigger: "change" }
        ],
        title: [
          { required: true, message: "请输入申请标题", trigger: "blur" }
        ],
        startDate: [
          { required: true, message: "请选择启动时间", trigger: "blur" }
        ],
        completionDate: [
          { required: true, message: "请选择完成时间", trigger: "blur" }
        ],
        detail: [
          { required: true, message: "请输入事件详情", trigger: "blur" }
        ],
      }
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 选择类型
    selectType(e) {
      this.typeId = e;
    },
    // 提交发布
    submitForm(formName) {
        var a=[]
      for(var key in this.imgsAll){
        this.imgsAll[key]
        a.push(this.imgsAll[key])
      }
      this.ruleForm.imageNames=a.join(",")
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            organId: this.organInfo.guid,
            deptId: this.userInfo.deptId,
            type: this.typeId,
            title: this.ruleForm.title,
            startDate: this.ruleForm.startDate,
            completionDate: this.ruleForm.completionDate,
            detail: this.ruleForm.detail,
            reportId:"0",
            accessory:this.ruleForm.imageNames,
            status:"3"   //2：草稿 3：提交
          };
          console.log(data, "subData");
          this.$ajax(
            `${this.subUrl.activity}/pasa/myReport/addWorkReport`,
            data,
            res => {
              console.log(res, "submit");
              this.$message.success("申请成功");
              this.back();
            },
            this
          );
        } else {
          this.$message.error("请填写完整信息");
          return false;
        }
      });
    },
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
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getUploadToken()
  }
};
</script>
<style lang="scss" scoped>
#build_emer {
  height: 100%;
  padding-left: 280px;
  padding-right: 20px;
  overflow: scroll;
  .text {
    i {
      padding: 20px 20px;
    }
  }
}
.container {
  margin-top: 20px;
  padding-top: 20px;
  padding-bottom: 40px;
  background: #fff;
}
// 表格居中
.delCon {
  padding: 5px 50px;
  background: #fff;
  p {
    padding: 5px 5px 50px 5px;
    border: 1px solid #ccc;
  }
}
// .upload_photo {
//   padding: 0 0 20px 100px;
// }
// .el-form-item__label{
//     font-size: 16px!important;
// }
</style>