<template>
<div id='build_inform'>
    <div class="title">
        <div class="text"><i @click="back" class="el-icon-arrow-left"></i>发布通知</div>
    </div>
    <div class="del">
      <ul class="delList clearfix">
        <li>起草日期:<span>2018-1-1</span></li>
        <li>签发部门:<span>工程部</span></li>
        
      </ul>
      <div class="info">
          <div>
              通知标题:
              <el-input
               class="info_title"
                style="width:300px"
                placeholder="请输入内容"
                v-model="info_title"
                clearable>
                </el-input>
          </div>  
          <div class="keyWord">
              关键词:
        </div>        
        
      </div>
      <div class="report">
            <el-form-item label="汇报人" prop="carry_people">
          <el-input readonly v-model="ruleForm.carry_people" @focus="choosePeople" placeholder="请选择汇报人"></el-input>
      </el-form-item>
      </div>
      <div class="lead_idea">
          <el-button type="danger">不同意</el-button>
          <el-button class="subBtn" type="success">同意并发布</el-button>
      </div>



      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="标题" prop="name">
    <el-input v-model="ruleForm.name" placeholder="请输入标题"></el-input>
  </el-form-item>
  <el-form-item label="类型" prop="type">
    <el-select v-model="ruleForm.type" placeholder="请选择活动区域">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
    <el-select v-model="ruleForm.type" placeholder="请选择活动区域">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
    <el-select v-model="ruleForm.type" placeholder="请选择活动区域">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-form-item>

<!-- 任务详情 -->
  <el-form-item label="任务详情" prop="desc">
    <el-input type="textarea"  :autosize=" {minRows: 6}" v-model="ruleForm.desc"></el-input>
  </el-form-item>
<!-- 照片 -->
<div class="upload_photo">
    <el-upload
  action="https://jsonplaceholder.typicode.com/posts/"
  list-type="picture-card"
  :on-preview="handlePictureCardPreview"
  :on-remove="handleRemove">
  <i class="el-icon-plus"></i>
</el-upload>
<el-dialog :visible.sync="dialogVisible" size="tiny">
  <img width="100%" :src="dialogImageUrl" alt="">
</el-dialog>
</div>
<!-- 执行人 -->
<div class="execute">
     <el-form-item label="执行人" prop="carry_people">
        <el-input readonly v-model="ruleForm.carry_people" @focus="choosePeople" placeholder="请选择执行人"></el-input>
    </el-form-item>
     <el-form-item label="验证人" prop="verify_people">
        <el-input readonly v-model="ruleForm.verify_people" @focus="choosePeople" placeholder="请选择验证人"></el-input>
    </el-form-item>
    </div> 
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
  </el-form-item>
</el-form>
    </div>
</div>

</template>
<script>
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      dateTime: [
        new Date(2000, 10, 10, 10, 10),
        new Date(2000, 10, 11, 10, 10)
      ],
      ruleForm: {
        name: "",
        type: "",
        desc: "",
        carry_people: "",
        verify_people: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
          //{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        type: [{ required: true, message: "请选择活动区域", trigger: "change" }],
        desc: [{ required: true, message: "请填写任务详情", trigger: "blur" }]
      }
    };
  },
  methods: {
    //请求详情页面
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
          this.taskDel = res.data;
          console.log(this.taskDel, "taskDel");
        },
        this
      );
    },

    back() {
      this.$router.go(-1);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  },
  mounted() {
    // this.getTaskDel();
  }
};
</script>
<style lang="scss" scoped>
#build_inform {
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
.del {
  padding-bottom: 200px;
}

.delList {
  background: #fff;
  padding: 20px 50px;
  margin-top: 20px;
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
.info {
  padding: 20px 50px;
  background: #fff;
  margin: 20px 0;
  p {
    padding: 5px 5px 100px 5px;
    border: 1px solid #ccc;
  }
}
.lead_idea {
  padding: 20px 50px;
  background: #fff;
  margin: 20px 0;
  text-align: center;
  .subBtn {
    margin-left: 100px;
  }
}
.tips {
  float: left;
  padding: 0 !important;
  padding-right: 20px !important;
}
.selectList {
  float: left;
}
.info_title {
  padding-left: 10px;
}
.keyWord {
  height: 50px;
  line-height: 50px;
}
</style>