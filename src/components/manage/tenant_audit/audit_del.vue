<template>
<!-- 新建任务 -->
<div id='build_inform'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>租户详情</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/tenant_audit' }">租户审核</el-breadcrumb-item>
            <el-breadcrumb-item>租户详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
<div class="container">
<el-form label-width="100px" class="demo-ruleForm">
  <el-form-item label="租户名称:" prop="title">
    <p class="inputText">{{tableData.organName}}</p>
  </el-form-item>
   <el-form-item label="楼宇名称:">
          <p class="inputText">{{tableData.buildingName}}</p>
  </el-form-item>
  <el-form-item label="所属行业:" >
    <p class="inputText">{{tableData.industry}}</p>
  </el-form-item>
  <el-form-item label="用户名:">
    <p class="inputText">{{tableData.name}}</p>
  </el-form-item>
  <el-form-item label="手机账号:">
    <p class="inputText">{{tableData.account}}</p>
  </el-form-item>
  <!-- <el-form-item label="管理员密码:">
    <p class="inputText">{{tableData.organName}}</p>
  </el-form-item> -->
</el-form>
   <div class="submitMenu" v-if="Data.authenStatus==0">
    <el-button type="danger" size='mini' @click="toAudit(0)">驳回</el-button>
    <el-button type="primary" size="mini" @click="toAudit(1)">通过</el-button>
  </div>
   <div class="submitMenu" v-if="Data.authenStatus==1 && Data.isHandle == 0">
     <el-button type="primary" @click="$router.push('/estate/serviceList/wuye/settled/add')" size='mini'>办理入驻</el-button>
   </div>
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
      Data: {},
      tableData: {}
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
    // 审核
    toAudit(val) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        id: this.$route.params.id,
        type: val
      };
      console.log(data, "del");
      this.$ajax(
        `${this.subUrl.user}/tenantAudit/Audit`,
        data,
        res => {
          if (val == 1) {
            this.$confirm("通过成功,是否为该租户办理入驻", { type: "warning" })
              .then(() => {
                this.$router.push("/estate/serviceList/wuye/settled/add");
              })
              .catch(() => {
                this.back();
              });
          } else {
            this.$message.error("驳回成功");
            this.back();
          }
        },
        this
      );
    },
    // 查看详情
    getDel() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        id: this.$route.params.id
      };
      console.log(data, "del");
      this.$ajax(
        `${this.subUrl.user}/tenantAudit/detail`,
        data,
        res => {
          console.log(res, "getDel");
          this.Data = res.data;
          this.tableData = res.data.userInfo;
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
    this.getDel();
  }
};
</script>
<style lang="scss" scoped>
.submitMenu {
  padding: 0 20px;
}
.el-form-item {
  margin-bottom: 0;
}
.inputText {
  line-height: 40px;
}
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
.inform_object {
  margin-bottom: 10px;
}

.container {
  padding: 20px 0px;
  margin-top: 20px;
  background: #fff;
}

// 表格居中
.el-form {
  // margin: 0 auto !important;
  width: 500px;
  font-size: 16px;
}
.submitBtn {
  text-align: center;
  padding-left: 30px;
  button {
    margin: 0 30px;
  }
}
</style>