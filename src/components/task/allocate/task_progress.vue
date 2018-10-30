<template>
<!-- 新建任务 -->
<div id='build_task'>
    <div class="title">
        <div class="text"><i @click="back" class="el-icon-arrow-left"></i>我的进度</div>
    </div>
<div class="container" >
  
<el-form label-width="100px" class="demo-ruleForm">
  <el-form-item label="更新进度" prop="progress" >
     <el-input-number style="" controls-position="right" v-model="progress" :min="0" :max="100"  label=""></el-input-number>
  </el-form-item>
<!-- 任务详情 -->
  <el-form-item label="备注" prop="remark" >
    <el-input type="textarea"  :autosize="{minRows: 6}" v-model="remark" placeholder="非必填项"></el-input>
  </el-form-item>
<!-- 照片 -->
<el-form-item label="上传附件">
  <div class="upload_photo">
       <el-upload
          :action="uploadUrl"
          list-type="picture-card"
          :data='otherData'
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
  <el-form-item class="submitBtn">
    <el-button type="primary" @click="updateTask(1)">更新进度</el-button>
    <el-button type="success" @click="updateTask(2)">完成任务</el-button>
  </el-form-item>
</el-form>
</div>
</div>

</template> 
<script>
export default {
  data() {
    this.uploadUrl = "http://up-z2.qiniu.com";
    return {
      progress: 0,
      otherData: {},
      uploadHash: {},
      remark: "",
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    uploadSuccess(res) {
      console.log(res, "上传的结果");
      this.uploadHash[res.key] = res.key;
    },
    uploadMax() {
      this.$message.error("最多上传4张图片");
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
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    updateTask(val) {
      var data = {
        token: this.$getkey(),
        userId: localStorage.getItem("user_Id"),
        taskId: this.$route.params.id,
        progress: this.progress,
        remark: this.remark,
        type: val,
        accessorys: ""
      };
      var arr = [];
      for (var i in this.uploadHash) {
        arr.push(i);
      }
      data.accessorys = arr.join(",");
      this.$ajax(
        `${this.subUrl.activity}/taskBill/taskProgress/updateProgress`,
        data,
        res => {
          console.log(res, "update");
          this.$message.success("操作成功");
          this.back();
        },
        this
      );
    }
  },
  mounted() {
    this.getUploadToken();
  }
};
</script>
<style lang="scss" scoped>
#build_task {
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
.container {
  padding: 20px 0;
  background: #fff;
  margin-top: 20px;
}
.el-form {
  width: 80%;
  margin: 0 auto;
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