<template>
<!-- 新建任务 -->
<div id='build_task'>
    <div class="title">
        <div class="text"><i @click="back" class="el-icon-arrow-left"></i>新建任务</div>
    </div>
<div v-show="show" class="container" >
  
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="标题" :maxlength='50' prop="title" >
    <el-input v-model="ruleForm.title" placeholder="请输入标题"></el-input>
  </el-form-item>
  <el-form-item label="类型" prop="typeId" >
   <el-select v-model="ruleForm.typeId" placeholder="请选择类型" @change="selectType">
    <el-option
      v-for="(item,index) in taskType"
      :key="index"
      :label="item.dictDataName"
      :value="item.guid">
    </el-option>
  </el-select>
  </el-form-item>
  <!-- 日期时间 -->
  <el-form-item label="启动时间" prop="startDate" >
    <el-date-picker
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      v-model="ruleForm.startDate"
      type="datetime"
      placeholder="选择日期时间">
    </el-date-picker>
  </el-form-item>
  <el-form-item label="完成时间" prop="completeDate" >
    <el-date-picker
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      v-model="ruleForm.completeDate"
      type="datetime"
      placeholder="选择日期时间">
    </el-date-picker>
  </el-form-item>
  
<!-- 任务详情 -->
  <el-form-item label="任务详情" prop="desc" >
    <el-input type="textarea" :maxlength='300'  :autosize="{minRows: 6}" v-model="ruleForm.desc"></el-input>
  </el-form-item>
<!-- 照片 -->
<el-form-item label="上传附件">
  <div class="upload_photo">
       <el-upload
      :action="uploadUrl"
      accepts='images/jpeg,images/png'
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
<div class="execute">
     <el-form-item label="执行人" prop="carry_people" >
        <el-input readonly v-model="ruleForm.carry_people" @focus="choosePeople1" placeholder="请选择执行人"></el-input>
    </el-form-item>
     <el-form-item label="验证人" prop="verify_people" >
        <el-input readonly v-model="ruleForm.verify_people" @focus="choosePeople2" placeholder="请选择验证人(选填默认为自己)"></el-input>
    </el-form-item>
</div> 
  <el-form-item class="submitBtn">
    <el-button type="primary" @click="saveDraft('ruleForm')">存草稿</el-button>
    <el-button type="primary" @click="submitForm('ruleForm')">确定发布</el-button>
  </el-form-item>
</el-form>
</div>
      <!-- 选人 -->
      <choosemyEmp class="choose" v-show="showCarry" @checkMen="checkCarryMen"></choosemyEmp>  
    <chooseAEmploy class="choose" v-show="showVerify" @checkMen="checkVerifyMen"></chooseAEmploy>  
</div>

</template> 
<script>
// 导入选人组件
// import chooseEmploy from "../../choose_people/choose_employ";
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
      otherData: {},
      organInfo: "",
      message: "创建成功",
      showCarry: false,
      showVerify: false,
      uploadHash: {},
      show: true,
      taskType: [],
      carryId: "",
      verifyId: "",
      status: "3", // 默认提交状态
      dialogImageUrl: "",
      dialogVisible: false,
      ruleForm: {
        title: "",
        typeId: "",
        startDate: "",
        completeDate: "",
        desc: "",
        carry_people: [],
        verify_people: ""
      },
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" }
          //{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        typeId: [{ required: true, message: "请选择类型", trigger: "change" }],
        startDate: [
          { required: true, message: "请选择启动时间", trigger: "change" }
        ],
        completeDate: [
          { required: true, message: "请选择完成时间", trigger: "change" }
        ],
        carry_people: [
          { required: true, message: "请选择执行人", trigger: "change" }
        ],
        verify_people: [{ message: "请选择验证人", trigger: "change" }],
        desc: [{ required: true, message: "请填写任务详情", trigger: "blur" }]
      }
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    handleRemove(file, fileList) {
      delete this.uploadHash[file.response.key];
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
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //
    choosePeople1() {
      this.show = false;
      this.showCarry = true;
    },
    choosePeople2() {
      this.show = false;
      this.showVerify = true;
    },
    // 选执行人
    checkCarryMen(checkList) {
      console.log(checkList);
      this.show = true;
      this.showCarry = false;
      let arr = [];
      this.ruleForm.carry_people = [];
      checkList.forEach(ele => {
        this.ruleForm.carry_people.push(ele.split(",")[1]);
        arr.push(ele.split(",")[0]);
      }, this);
      this.carryId = arr.join(",");
    },
    // 选验证人
    checkVerifyMen(radio) {
      console.log(radio);
      this.show = true;
      this.showVerify = false;
      this.ruleForm.verify_people = radio.split(",")[1];
      this.verifyId = radio.split(",")[0];
    },
    //选择任务类型
    selectType(e) {
      this.ruleForm.typeId = e;
    },
    // 获取任务类型
    getTaskType() {
      this.$ajax(
        `${this.subUrl.user}/comm/getTaskType`,
        "",
        res => {
          console.log(res.data, "taskType");
          this.taskType = res.data;
        },
        this
      );
    },
    //存草稿
    saveDraft(formName) {
      this.status = "2";
      this.message = "已存为草稿";
      this.submitForm(formName);
    },
    uploadSuccess(res) {
      this.uploadHash[res.key] = res.key;
    },
    uploadMax() {
      this.$message.error("最多上传4张图片");
    },
    uploadError() {
      this.$message.error("上传失败");
    },
    // 提交发布
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //alert("submit!");
          if (this.$route.params.id == 0) {
            //正常的提交
            var data = {
              token: this.$getkey(),
              userId: this.userInfo.guid,
              taskName: this.ruleForm.title,
              typeId: this.ruleForm.typeId,
              startDate: this.ruleForm.startDate,
              completionDate: this.ruleForm.completeDate,
              taskDetail: this.ruleForm.desc,
              identifier: this.verifyId ? this.verifyId : this.userInfo.guid,
              status: this.status,
              executorIdList: this.carryId,
              accessorys: ""
            };
            var arr = [];
            for (var i in this.uploadHash) {
              arr.push(i);
            }
            data.accessorys = arr.join(",");
            this.$ajax(
              `${this.subUrl.activity}/taskBill/allocationTask/newTask`,
              data,
              res => {
                console.log(res, "submit");
                this.$message.success(this.message);
                this.back();
              },
              this
            );
          } else {
            //草稿的提交
            var data = {
              token: this.$getkey(),
              userId: this.userInfo.guid,
              taskId: this.$route.params.id,
              taskName: this.ruleForm.title,
              typeId: this.ruleForm.typeId,
              startDate: this.ruleForm.startDate,
              completionDate: this.ruleForm.completeDate,
              taskDetail: this.ruleForm.desc,
              identifier: this.verifyId ? this.verifyId : this.userInfo.guid,
              status: this.status,
              executorIdList: this.carryId,
              accessorys: ""
            };
            var arr = [];
            for (var i in this.uploadHash) {
              arr.push(i);
            }
            data.accessorys = arr.join(",");
            this.$ajax(
              `${this.subUrl.activity}/taskBill/allocationTask/draft`,
              data,
              res => {
                console.log(res, "submit");
                this.$message.success(this.message);
                this.back();
              },
              this
            );
          }
        } else {
          this.$message.error("请填写完整信息");
          return false;
        }
      });
    },
    //查看草稿
    getTaskDel() {
      var data = {
        token: this.$getkey(),
        userId: localStorage.getItem("user_Id"),
        taskId: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.activity}/taskBill/taskProgress/taskBillDetail`,
        data,
        res => {
          console.log(res, "res");
          let taskDel = res.data.taskBill;
          console.log(this.taskDel, "taskDel");
          let carryArr = [];
          let carryIdArr = [];
          taskDel.executorInfo.forEach(ele => {
            carryArr.push(ele.name);
            carryIdArr.push(ele.userId);
          }, this);
          this.ruleForm = {
            title: taskDel.taskName,
            typeId: taskDel.taskType,
            startDate: taskDel.startDate,
            completeDate: taskDel.completionDate,
            desc: taskDel.taskDetail,
            carry_people: carryArr,
            verify_people: taskDel.identifierInfo.name
          };
          this.carryId = carryIdArr.join(",");
          this.verifyId = taskDel.identifierInfo.userId;
        },
        this
      );
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
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    console.log(this.userInfo);
    console.log(this.organInfo);
    this.getTaskType();
    if (this.$route.params.id != 0) {
      this.getTaskDel();
    }
    this.getUploadToken();
  }
};
</script>
<style lang="scss" scoped>
#build_task {
  height: 100%;
  padding-left: 300px;
  padding-right: 40px;
  background: #f2f2f2;
  overflow: scroll;
  .text {
    i {
      padding: 20px 20px;
    }
  }
}
.container {
  padding: 20px 0;
  // position: absolute;
  // left: 30%;
  background: #fff;
  margin-top: 20px;
}
.el-form {
  padding: 10px;
}
.choose {
  margin: 20px 0;
}
.submitBtn {
  text-align: center;
  button {
    margin: 0 50px;
  }
}
</style>