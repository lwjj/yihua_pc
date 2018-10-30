<template>
<!-- 新建任务 -->
<div id='subTemplate'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>发布通知</div> -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/inform' }">通知</el-breadcrumb-item>
            <el-breadcrumb-item>发布通知</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
<div class="container" v-show="show">

    <!-- 选人 -->
    <!-- <choosePeople></choosePeople> -->
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
<!-- <ul class="delList clearfix">
        <li>起草日期:<span>2018-1-1</span></li>
        <li>签发部门:<span>工程部</span></li>
      </ul> -->
  <el-form-item label="通知对象">
        <el-input v-if='userInfo.organType!=1' class="inform_object" readonly v-model="ruleForm.dept" @focus="choosePeople1" placeholder="请选择部门(可选)"></el-input>
        <el-input class="inform_object" readonly v-model="ruleForm.employ" @focus="choosePeople2" placeholder="请选择员工(可选)"></el-input>
        <el-input v-if='userInfo.organType!=1' class="inform_object" readonly v-model="ruleForm.customer" @focus="choosePeople3" placeholder="请选择客户(可选)"></el-input>
  </el-form-item>

  <el-form-item label="通知标题" prop="title">
    <el-input v-model="ruleForm.title" :maxlength="50" placeholder="请输入标题"></el-input>
  </el-form-item>
  <el-form-item label="关键词" prop="keyword">
    <el-input v-model="ruleForm.keyword" :maxlength="10" placeholder="请输入关键词(可填，多个关键词以“，”隔开)"></el-input>
    <!-- <el-input style="width:200px" v-model="keyword2" placeholder="请输入关键词(可填)"></el-input> -->
  </el-form-item>
<!-- 任务详情 -->
  <el-form-item label="任务详情" prop="desc" >
    <el-input type="textarea"  :maxlength="300" :autosize=" {minRows: 6}" v-model="ruleForm.desc"></el-input>
  </el-form-item>

   <el-form-item label="上传附件">
        <div class="upload_photo">
            <el-upload
            :action="uploadUrl"
            accept='image/jpeg,image/png'
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
<!-- 照片 -->

  <!-- 执行人 -->
  <!-- <div class="report">
          <el-form-item label="汇报人" prop="rept_people">
            <el-input readonly v-model="ruleForm.rept_people" @focus="choosePeople4" placeholder="请选择汇报人(默认为直属领导)"></el-input>
        </el-form-item>
      </div>  -->
   <el-form-item class="">
    <!-- <el-button type="primary" @click="saveDraft('ruleForm')">存草稿</el-button> -->
    <el-button type="primary" @click="submitForm('ruleForm')">立即发布</el-button>
  </el-form-item>
</el-form>
</div>
       <chooseDept class="choose" v-show="showDept" @checkMen="checkDept"></chooseDept>  
       <chooseEmploy class="choose" v-show="showEmploy" @checkMen="checkEmploy"></chooseEmploy>  
       <chooseCustomer class="choose" v-show="showCustomer" @checkMen="checkCustomer"></chooseCustomer>  
</div>

</template> 
<script>
// 导入选人组件
import chooseDept from "../../choose_people/choose_dept";
import chooseEmploy from "../../choose_people/choose_employ";
import chooseCustomer from "../../choose_people/choose_customer";
import fn from "@/assets/js/common";
import Vue from "vue";
import qs from "qs";
export default {
  components: {
    chooseDept,
    chooseEmploy,
    chooseCustomer
  },
  data() {
    this.uploadUrl = "http://up-z2.qiniu.com";
    return {
      otherData: {},
      dialogImageUrl: "",
      uploadHash: {},
      userInfo: "",
      organInfo: "",
      message: "发布成功",
      show: true,
      showDept: false,
      showEmploy: false,
      showCustomer: false,
      showRept: false,
      dialogImageUrl: "",
      dialogVisible: false,
      dateTime: [
        new Date(2000, 10, 10, 10, 10),
        new Date(2000, 10, 11, 10, 10)
      ],
      deptId: "",
      employId: "",
      customerId: "",
      // keyword1: "",
      // keyword2: "",
      ruleForm: {
        dept: "",
        employ: "",
        customer: "",
        title: "",
        keyword: "",
        desc: "",
        rept_people: "",
        accessorys: ""
      },
      token: "",
      getHearLog: {
        domain: "",
        token: "",
        name: "",
        pid: null
      },
      images: [],
      imageName: [],
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
          //{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        // object: [{ required: true, message: "请选择对象", trigger: "blur" }],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        keyword: [{ message: "请输入关键词", trigger: "blur" }],
        rept_people: [
          { required: true, message: "请选择汇报人", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写任务详情", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 上传函数控制
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
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadSuccess(res) {
      this.uploadHash[res.key] = res.key;
    },
    uploadMax() {
      this.$message.error("最多上传4张图片");
    },
    handleRemove(file, fileList) {
      delete this.uploadHash[file.response.key];
    },
    uploadError() {
      this.$message.error("上传失败");
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
    // 上传函数结束
    back() {
      this.$router.go(-1);
    },
    update(e) {
      let file = e.target.files[0]; //详细信息
      let d = new Date();
      let type = file.name.split("."); //点切割
      console.log(type);

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
          "." +
          type[type.length - 1],
        bucket: this.getHearLog.domain //七牛的地址，这个是你自己配置的（变量）
      };
      let param = new FormData(); //创建form对象
      param.append("chunk", "0"); //断点传输
      param.append("chunks", "1");
      param.append("file", file, file.name);
      console.log(param.get("file")); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      //先从自己的服务端拿到token
      this.token = this.getHearLog.token;
      //console.log(this.getHearLog.token)
      param.append("token", this.token);
      //console.log(param.get('token'))
      this.uploading(param, config, file.name); //然后将参数上传七牛
      return;
    },
    addImg(pid) {
      this.getQiniuInfo(pid);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //
    choosePeople1() {
      this.show = false;
      this.showDept = true;
    },
    choosePeople2() {
      this.show = false;
      this.showEmploy = true;
    },
    choosePeople3() {
      this.show = false;
      this.showCustomer = true;
    },
    choosePeople4() {
      this.show = false;
      this.showRept = true;
    },
    // 选部门
    checkDept(checkList) {
      console.log(checkList);
      this.show = true;
      this.showDept = false;
      let arr = [];
      this.ruleForm.dept = [];
      checkList.forEach(ele => {
        this.ruleForm.dept.push(ele.split(",")[1]);
        arr.push(ele.split(",")[0]);
      }, this);
      this.deptId = arr.join(",");
    },
    // 选员工
    checkEmploy(checkList) {
      console.log(checkList);
      this.show = true;
      this.showEmploy = false;
      let arr = [];
      this.ruleForm.employ = [];
      checkList.forEach(ele => {
        this.ruleForm.employ.push(ele.split(",")[1]);
        arr.push(ele.split(",")[0]);
      }, this);
      this.employId = arr.join(",");
    },
    // 选顾客
    checkCustomer(checkList) {
      console.log(checkList);
      this.show = true;
      this.showCustomer = false;
      let arr = [];
      this.ruleForm.customer = [];
      checkList.forEach(ele => {
        this.ruleForm.customer.push(ele.split(",")[1]);
        arr.push(ele.split(",")[0]);
      }, this);
      this.customerId = arr.join(",");
    },
    //存草稿
    saveDraft(formName) {
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
            deptId: this.userInfo.deptId,
            noticeTitle: this.ruleForm.title,
            keyword: this.ruleForm.keyword,
            content: this.ruleForm.desc,
            deptIdList: this.deptId,
            userIdList: this.employId,
            unitIdList: this.customerId,
            // postType: this.userInfo.postType,
            accessoryList: this.ruleForm.accessorys
          };
          var arr = [];
          console.log(this.uploadHash, "xxxx");
          for (var i in this.uploadHash) {
            arr.push(i);
          }

          // addWorkReport.accessorys = arr.join(",");
          data.accessorys = arr.join(",");
          console.log(data, "savData");
          this.$ajax(
            `${this.subUrl.activity}/noticeBill/saveNoticeBill`,
            data,
            res => {
              console.log(res, "saveNoticeBill");
              this.$message.success("保存成功");
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
            deptId: this.userInfo.deptId,
            noticeTitle: this.ruleForm.title,
            keyword: this.ruleForm.keyword,
            content: this.ruleForm.desc,
            deptIdList: this.deptId,
            userIdList: this.employId,
            unitIdList: this.customerId,
            postType: this.userInfo.postType,
            accessoryList: this.ruleForm.accessorys
          };
          var arr = [];
          for (var i in this.uploadHash) {
            arr.push(i);
          }
          data.accessoryList = arr.join(",");
          // addWorkReport.accessorys = arr.join(",");

          data.accessorys = arr.join(",");
          console.log(data, "subData");
          this.$ajax(
            `${this.subUrl.activity}/noticeBill/submitNoticeBill`,
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
  updated() {
    console.log(this.ruleForm.accessorys);
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    console.log(this.userInfo.organType)
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getkey = fn.getIng();
    this.getUploadToken();
    if (this.$route.params.id != 0) {
      // this.getTaskDel();
    }
  }
};
</script>
<style lang="scss" scoped>
#subTemplate {
  height: 100%;
  padding-left: 210px;
  padding-right: 20px;
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
  padding: 20px 50px;
  margin-top: 20px;
  background: #fff;
  // position: absolute;
  // left: 30%;
}
// 表格居中
.el-form {
  // padding: 0 100px;
}
.submitBtn {
  text-align: center;
  button {
    margin: 0 50px;
  }
}
.library_input3 {
  margin-top: 10px;
  .el-row {
    padding-left: 20px;
    .el-col {
      border: 1px solid #ddd;
      height: 100px;
      margin-bottom: 10px;
      position: relative;
      i {
        margin-top: 40px;
        margin-left: 45%;
      }
      input {
        position: absolute;
        top: 35%;
        left: 20%;
        width: 0;
        height: 0;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
// .el-form-item__label{
//     font-size: 16px!important;
// }
</style>