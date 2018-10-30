<template>
<!-- 新建任务 -->
<div id='build_inform'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>新增管理员</div> -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/tenant_audit' }">租户审核</el-breadcrumb-item>
            <el-breadcrumb-item>新增管理员</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
<div class="container">
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="客户名称" prop="title">
    <el-input class="inputText" v-model="ruleForm.title" placeholder="请输入客户名称(非必填)"></el-input>
  </el-form-item>
  <el-form-item label="所在行业" prop="hangye">
    <el-input class="inputText" v-model="ruleForm.industry" placeholder="请输入所在行业(非必填)"></el-input>
    <!-- <el-input style="width:200px" v-model="keyword2" placeholder="请输入关键词(可填)"></el-input> -->
  </el-form-item>
   <el-form-item label="写字楼位置" prop="address">
          <el-input class="inputText" readonly v-model="ruleForm.address" placeholder="请输入写字楼位置(非必填)"></el-input>
  </el-form-item>
  <el-form-item label="管理员账号" prop="account">
    <el-input class="inputText" v-model="ruleForm.account" placeholder="请输入管理员账号"></el-input>
  </el-form-item>
  <!-- <el-form-item label="管理员密码" prop="password">
    <el-input class="inputText" v-model="ruleForm.password" placeholder="请输入管理员密码"></el-input>
  </el-form-item> -->
   <el-form-item class="submitBtn">
    <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
  </el-form-item>
</el-form>
</div>
</div>

</template> 
<script>
// 导入选人组件
export default {
  data() {
    return {
      userInfo: "",
      organInfo: "",
      ruleForm: {
        type:"",
        receiver: [],
        title: "",
        keyword: "",
        desc: "",
      },
      rules: {
        account: [{ required: true, message: "请输入管理员账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入管理员密码", trigger: "blur" }],
      }
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            token: this.$getkey(),
            userId: this.ruleForm.account,
          };
          console.log(data, "subData");
          this.$ajax(
            `${this.subUrl.user}/tenantAudit/addTenement`,
            data,
            res => {
              console.log(res, "submit");
              this.$message.success("添加成功");
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
    console.log(this.userInfo);
    console.log(this.organInfo);
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
  padding: 20px 0px;
  margin-top: 20px;
  background: #fff;
}
// 表格居中
.el-form {
  margin: 0 auto !important;
  padding: 20px 100px;
}
// .inputText{
//     widows: 300px!important;
// }
// </style>