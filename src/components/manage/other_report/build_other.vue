<template>
<!-- 新建任务 -->
<div id='build_inform'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>新建汇报</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/other_report' }">汇报</el-breadcrumb-item>
            <el-breadcrumb-item>新建汇报</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
<div class="container" v-show="show">
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="汇报标题" prop="title">
    <el-input v-model="ruleForm.title" placeholder="请输入标题" :maxlength="20"></el-input>
  </el-form-item>
   <el-form-item label="事件类型" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择事件类型" @change="selectType">
            <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.dictDataName"
            :value="item.guid">
            </el-option>
        </el-select>
    </el-form-item>
  <el-form-item label="关键词" prop="keyword">
    <el-input v-model="ruleForm.keyword" placeholder="请输入关键词(可填，多个关键词以“，”隔开)" :maxlength="30" ></el-input>
    <!-- <el-input style="width:200px" v-model="keyword2" placeholder="请输入关键词(可填)"></el-input> -->
  </el-form-item>
   <el-form-item label="收件人" prop="receiver">
          <el-input readonly v-model="ruleForm.receiver" @focus="choosePeople" placeholder="请选择收件人"></el-input>
  </el-form-item>
<!-- 任务详情 -->
  <el-form-item label="详情" prop="desc" >
    <el-input type="textarea"  :autosize=" {minRows: 6}" resize="none" v-model="ruleForm.desc" :maxlength="600"></el-input>
  </el-form-item>
<!-- 照片 -->
<el-form-item label="上传附件">
    <div class="library_input3">
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
<!-- <div class="report">
        <el-form-item label="汇报人" prop="rept_people">
          <el-input readonly v-model="ruleForm.rept_people" @focus="choosePeople4" placeholder="请选择汇报人(默认为直属领导)"></el-input>
      </el-form-item>
    </div>  -->
   <el-form-item class="submitBtn">
    <el-button type="primary" @click="submitForm('ruleForm')">立即发布</el-button>
  </el-form-item>
</el-form>
</div>
       <chooseEmploy class="choose" v-show="showRecv" @checkMen="checkEmploy"></chooseEmploy>
</div>

</template>
<script>
// 导入选人组件
import chooseEmploy from "../../choose_people/choose_employ";
import fn from "@/assets/js/common";
import Vue from "vue";
import qs from "qs";
export default {
  components: {
    chooseEmploy
  },
  name: "",
  data() {
    this.uploadUrl = "http://up-z2.qiniu.com";
    return {
      getkey: "",
      userInfo: "",
      organInfo: "",
      show: true,
      showRecv: false,
      dialogImageUrl: "",
      dialogVisible: false,
      receiverId: "",
      typeId: "",
      typeList: [],
      ruleForm: {
        type: "",
        receiver: [],
        title: "",
        keyword: "",
        desc: "",
        img: ""
      },
      otherData: {},
      imgsAll: [],
      dialogImageUrl: "",
      dialogVisible: false,
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        // keyword: [{ required: true, message: "请输入关键词", trigger: "blur" }],
        receiver: [
          { required: true, message: "请选择收件人", trigger: "change" }
        ],
        type: [{ required: true, message: "请选择类型", trigger: "blur" }],
        desc: [{ required: true, message: "请填写任务详情", trigger: "blur" }]
      }
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    choosePeople() {
      this.show = false;
      this.showRecv = true;
    },
    // 选人
    checkEmploy(checkList) {
      console.log(checkList);
      this.show = true;
      this.showRecv = false;
      let arr = [];
      this.ruleForm.receiver = [];
      checkList.forEach(ele => {
        this.ruleForm.receiver.push(ele.split(",")[1]);
        arr.push(ele.split(",")[0]);
      }, this);
      this.receiverId = arr.join(",");
    },
    // 选择类型
    selectType(e) {
      this.typeId = e;
    },
    // 获取类型
    getType() {
      var data = {};
      this.$ajax(
        `${this.subUrl.activity}/otherReportBill/getReportCategory`,
        data,
        res => {
          console.log(res, "type");
          this.typeList = res.data.HBC;
        },
        this
      );
    },
    // 提交发布
    submitForm(formName) {
      var a = [];
      for (var key in this.imgsAll) {
        this.imgsAll[key];
        a.push(this.imgsAll[key]);
      }
      this.ruleForm.img = a.join(",");
      console.log(this.ruleForm.img);
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            organId: this.organInfo.guid,
            deptId: this.userInfo.deptId,
            reportTitle: this.ruleForm.title,
            keyword: this.ruleForm.keyword,
            reportType: this.typeId,
            reportContent: this.ruleForm.desc,
            receivers: this.receiverId,
            postType: this.userInfo.postType,
            imageNames: this.ruleForm.img
          };
          if (!data.deptId) {
            return this.$message.error("暂未加入部门");
          }
          this.$ajax(
            `${this.subUrl.activity}/otherReportBill/submitForApprove`,
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
    },
    //上传图片
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

      if (isImage == -1) {
        this.$message.error("上传图片格式有误!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
      }
      return isImage && isLt2M;
    },
    handleRemove(file, fileList) {
      delete this.imgsAll[file.response.key];
    }
  },
  updated() {
    console.log(this.ruleForm.img);
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getkey = fn.getIng();
    //console.log(this.userInfo);
    //console.log(this.organInfo);
    this.getType();
    this.getUploadToken();
    if (this.$route.params.id !== 0) {
      // this.getTaskDel();
    }
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
  // position: absolute;
  // left: 30%;
}
// 表格居中
.el-form {
  margin: 0 auto !important;
  padding: 20px 100px;
}
// .submitBtn {

// }
// .el-form-item__label{
//     font-size: 16px!important;
// }
.library_input3 {
  margin-top: 10px;
}
</style>
