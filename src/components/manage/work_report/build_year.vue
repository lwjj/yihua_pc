<template>
<div id='subTemplate'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>新建月报</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/work_report' }">工作例报</el-breadcrumb-item>
            <el-breadcrumb-item>{{$route.params.type?"编辑年报":"新建年报"}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container" v-show="show">
       <!-- <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"> -->
       <el-form label-width="120px" class="demo-ruleForm">
     <el-form-item label="标题" prop="title">
        <el-input  style="width:100%" :maxlength="50" v-model="title" placeholder="请输入标题"></el-input>
    </el-form-item>
     <el-form-item label="年份" prop="dateTime">
        <el-date-picker 
          v-model="dateTime"
          type="year"
          format="yyyy年"
          value-format="yyyy"
          placeholder="选择年">
        </el-date-picker>
         <!-- <el-date-picker
            format="yyyy-MM"
            value-format="yyyy-MM"
            v-model="dateTime"
            type="month"
            placeholder="选择月">
        </el-date-picker> -->
    </el-form-item>
    <!-- 表单 -->
    
    <el-form-item label="工作总结">
            <el-input type="textarea" :autosize=" {minRows: 4}" resize="none" :maxlength="300" v-model="summarize"></el-input>
    </el-form-item>
    <el-form-item label="工作建议">
        <el-input type="textarea" :autosize=" {minRows: 4}" resize="none" :maxlength="300" v-model="suggest"></el-input>
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
    <el-form-item label="">
          <el-button type="primary"  @click="saveDraft" >存为草稿</el-button>
          <el-button type="primary"  @click="submitTable">提交</el-button>
    </el-form-item>
  </el-form>  
</div>
<chooseAEmploy class="choose" v-show="showExecutor" @checkMen="checkExecutor"></chooseAEmploy>  
 <!-- 明细 -->
 <mingxi v-show="showMingxi" @getMingxi="getMingxi" @mingxiBack="mingxiBack"></mingxi>
</div>
</template> 
<script>
import chooseAEmploy from "../../choose_people/choose_Aemploy";
import mingxi from "./build_mingxi";
export default {
  components: {
    chooseAEmploy,
    mingxi
  },
  data() {
    this.uploadUrl = "http://up-z2.qiniu.com";
    return {
      otherData: {},
      dialogImageUrl: "",
      uploadHash: {},
      dialogVisible: false,
      tables: [], // 明细
      wrId: "0", // 正常提交
      message: "提交成功",
      handle: "0",
      suggest: "",
      index: "",
      userInfo: "",
      organInfo: "",
      show: true,
      showExecutor: false,
      showMingxi: false,
      dept: "",
      dateTime: "",
      summarize: "",
      detail: "",
      title: "",
      tableData: [],
      // tableData: [
      //   {
      //     executorName: "",
      //     endTime: "",
      //     workContent: "",
      //     workMeasure: "",
      //     executor: "",
      //     progress: "0"
      //   }
      // ],
      rules: {}
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
      // var formData = new FormData();
      // formData.append('file',file);
      // formData.append('chuck',1)
      // formData.append('chucks',0)
      // formData.append('token',xxx)
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
    mingxiBack() {
      this.show = true;
      this.showMingxi = false;
    },
    choosePeople(index) {
      this.show = false;
      this.showExecutor = true;
      this.index = index;
      console.log(index, "index");
    },
    // 选执行人
    checkExecutor(radio) {
      console.log(radio);
      this.show = true;
      this.showExecutor = false;
      this.tableData[this.index].executorName = radio.split(",")[1];
      this.tableData[this.index].executor = radio.split(",")[0];
    },
    //添加
    add() {
      let obj = {
        executorName: "",
        startTime: "",
        endTime: "",
        workContent: "",
        workMeasure: "",
        executor: "",
        progress: "0"
      };
      this.tableData.push(obj);
      console.log(this.tableData);
    },
    // 删除
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    //存为草稿
    saveDraft() {
      this.handle = 2;
      this.message = "已存为草稿";
      this.submitTable();
    },
    //  明细数据
    getMingxi(tables) {
      console.log(tables, "tables");
      this.tables = tables;
      this.showMingxi = false;
      this.show = true;
    },
    //获取工作内容  年报不获取工作内容

    getcontent() {
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        type: 3 //汇报类型，1日报；2周报；3月报
      };
      this.$ajax(
        `${this.subUrl.activity}/workbench/workReport/myReport/getWorkContent`,
        data,
        res => {
          console.log(res, "content");
          this.tableData = res.data.list;
        },
        this
      );
    },
    // 提交保存
    submitTable() {
      if (this.$route.params.id != 0) {
        //草稿提交
        this.wrId = this.$route.params.id;
      }
      let flag = true;
      if (this.title == "") {
        this.$message.error("请输入标题");
        return;
      }
      if (this.dateTime == "") {
        this.$message.error("请选择年份");
        return;
      }

      if (flag) {
        let addWorkReport = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          title: this.title,
          custoMmonth: this.dateTime + "-12",
          suggest: this.suggest,
          type: 4, //汇报类型，1日报；2周报；3月报,年报
          startTime: this.dateTime + "-01-01 00:00:00",
          endTime: this.dateTime + "-12-31 23:59:59",
          wrId: this.wrId, //添加时为0，编辑时为当前的汇报单id ,
          summarize: this.summarize,
          reportDetailList: [],
          accessorys: [],
          handle: this.handle, //0：提交 2：草稿
          tables: []
        };
        var arr = [];
        for (var i in this.uploadHash) {
          arr.push(i);
        }
        // addWorkReport.accessorys = arr.join(",");
        addWorkReport.accessorys = arr;
        this.$ajax1(
          `${
            this.subUrl.activity
          }/workbench/workReport/myReport/addWorkReport?`,
          addWorkReport,
          res => {
            console.log(res, "month");
            this.$message.success("提交成功");
            this.back();
          },
          this
        );
      }
    },
    //获取草稿
    getDel() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        reportId: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.activity}/workbench/workReport/myReport/detail`,
        data,
        res => {
          console.log(res, "saveDraftRes");
          let workReport = res.data.workReport;
          this.title = workReport.title;
          this.summarize = workReport.summarize;
          this.suggest = workReport.suggest;
          this.dateTime = workReport.custoMmonth.substr(0, 4);
          this.imgBox = res.data.commAccessoryList;
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
    this.getUploadToken();
    console.log(this.userInfo);
    console.log(this.organInfo);

    if (this.$route.params.id != 0) {
      this.getDel();
    } else {
      // this.getcontent();
    }
  }
};
</script>
<style lang="scss" scoped>
#subTemplate {
  height: 100%;
  overflow: scroll;
  .text {
    i {
      padding: 20px 20px;
    }
  }
}
.demo-ruleForm {
  background: #fff;
  padding: 20px 20px;
  margin-bottom: 20px;
}

.container {
  padding: 20px 20px;
}
.bill {
  height: 400px;
}
.cell-edit-color {
  color: #2db7f5;
  font-weight: bold;
}
.btnBox {
  background: #fff;
  text-align: center;
  margin-top: 20px;
  padding: 10px;
}
.subBtn {
  margin: 0 50px;
}
// 表格
.inform_table {
  text-align: center;
  .el-table {
    font-size: 15px;
  }
}
.mingxi {
  text-align: left;
  padding: 10px;
}
.summary {
  .sum_title {
    text-align: left;
    padding: 10px;
  }
}
</style>