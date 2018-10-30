<template>
<!-- 新建任务 -->
<div id='build_inform'>
    <div class="title">
        <div class="text"><i @click="back" class="el-icon-arrow-left"></i>业委会设置</div>
    </div>
<div class="container">
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <div class="info_title">业委会信息</div>
  <el-form-item label="业委会名称" prop="organName">
    <el-input v-model="ruleForm.organName" placeholder="请输入业委会名称" :maxlength="30"></el-input>
  </el-form-item>
    <el-form-item label="联系地址" prop="address">
        <el-input v-model="ruleForm.address" placeholder="请输入联系地址" :maxlength="45"></el-input>
    </el-form-item>
    <el-form-item label="负责人" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入负责人" :maxlength="20"></el-input>
    </el-form-item>
    <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="ruleForm.mobile" placeholder="请输入手机号码" :maxlength="11"></el-input>
    </el-form-item>
    <el-form-item class="submitBtn">
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <p>若业委会没有注册本平台立即邀请加入</p>
    </el-form-item>
 </el-form>
    </div>
    </div>

</template> 
<script>
export default {
  data() {
    return {
      userInfo: "",
      organInfo: "",
      ruleForm: {
        organName: "",
        address: "",
        name: "",
        mobile: ""
      },
      rules: {
        organName: [
          { required: true, message: "请输入业委会名称", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入联系地址", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入负责人", trigger: "blur" }],
        mobile: [
          {
            required: true,
            message: "请输入正确的手机号码",
            trigger: "blur",
            min: 11,
            max: 11
          }
        ]
      }
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 提交发布
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            organName: this.ruleForm.organName,
            address: this.ruleForm.address,
            name: this.ruleForm.name,
            mobile: this.ruleForm.mobile
          };
          this.$ajax(
            `${this.subUrl.activity}/ownersCom/relation/edit`,
            data,
            res => {
              console.log(res);
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
  }
};
</script>
<style lang="scss" scoped>
#build_inform {
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
.info_title {
  margin-bottom: 30px;
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
  p {
    color: #888;
  }
}
</style>