<template>
<!-- 新建任务 -->
<div id='build_task'>
    <div class="title">
        <div class="text"><i @click="back" class="el-icon-arrow-left"></i>进度详情</div>
    </div>
<div class="container" >
  
<!-- <el-form label-width="100px" class="demo-ruleForm">
  <el-form-item label="更新进度" prop="progress" >
     <el-input-number style="" controls-position="right" v-model="progress" :min="0" :max="100"  label=""></el-input-number>
  </el-form-item> -->
<!-- 任务详情 -->
  <!-- <el-form-item label="备注" prop="remark" >
    <el-input type="textarea"  :autosize="{minRows: 6}" v-model="remark" placeholder="非必填项"></el-input>
  </el-form-item> -->
<!-- 照片 -->
<!-- <el-form-item label="上传附件">
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
 </el-form-item> -->
<!-- </el-form> -->
  <!-- 表单 -->
      <div class="inform_table">
        <el-table
           border
           empty-text="暂无数据"
          :data="tableData"
          >
          <el-table-column
          header-align="center"
            label="任务进度(%)"
            prop="progress"
            >
          </el-table-column>
          <el-table-column
          header-align="center"
            label="更新时间"
            prop="updataTime"
            >
          </el-table-column>
          <el-table-column
          header-align="center"
            label="备注"
            prop="remark"
            >
          </el-table-column>
          <el-table-column
          header-align="center"
            label="图片"
            prop="commAccessoryList"
            >
            <template slot-scope="scope">
              <div>
                <img :src="item.path" width="100" height="100" v-for="(item,index) in scope.row.commAccessoryList" :key="index" alt="">
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
</div>
</div>

</template> 
<script>
export default {
  data() {
    return {
      tableData: []
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
    getDel() {
      var data = {
        token: this.$getkey(),
        progressId: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.activity}/taskBill/taskProgress/progressLog`,
        data,
        res => {
          console.log(res, "getDel");
          this.tableData = res.data;
        },
        this
      );
    }
  },
  mounted() {
    this.getDel();
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
.inform_table {
  text-align: center;
}
</style>