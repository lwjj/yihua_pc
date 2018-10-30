<template>
    <div>
        <div class="title">
             <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/building_management/index' }">房屋管理</el-breadcrumb-item>
                <el-breadcrumb-item class="cursor" @click.native="back">返回</el-breadcrumb-item>
                <el-breadcrumb-item>{{this.details?'编辑设备维保':"添加设备维保"}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form ref="form" class="formAdd" :rules="rules" :model="form" label-width="100px">
            <el-form-item label="内容" prop='content' >
                <el-input type="textarea" :maxlength="300" placeholder="请输入内容" :rows="5" resize="none" v-model="form.content"></el-input>
            </el-form-item>
             <el-form-item label="标准化明细" prop='detailing'>
                <el-input type="textarea"  placeholder="请输入标准化明细" :maxlength="300" :rows="5"  resize="none" v-model="form.detailing"></el-input>
            </el-form-item>
            <el-form-item label="责任人" prop='name'>
                 <el-input v-model="form.name" placeholder="请输入责任人" :maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="截止时间" prop='endTime'>
                <el-date-picker  type="datetime" style="width:100%" :clearable="false" v-model="form.endTime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"></el-date-picker>
            </el-form-item> 
            <el-form-item label="任务进度" prop='progress'>
                 <el-input type="text" placeholder="请输入0-100之间的数字" v-model="form.progress"  :max='100' :min="0" :maxlength="3"></el-input>
            </el-form-item> 
            <el-form-item label="">
                 <el-button type="primary" @click="addDetail">{{details?"编辑":"添加"}}</el-button>
            </el-form-item> 
        </el-form>
    </div>
</template>
<script>
export default {
  props: ["details"],
  data() {
    return {
      rules: {
        name: { required: true, message: "请输入责任人", trigger: "blur" },
        content: { required: true, message: "请输入内容", trigger: "blur" },
        detailing: {
          required: true,
          message: "请输入标准化明细",
          trigger: "blur"
        },
        endTime: {},
        progress: {
          validator: function(rule, value, callback) {
            console.log(value, "xxx");
            if (!value) {
              callback(new Error("请输入任务进度"));
            } else if (!/^\d{1,3}$/.test(value)) {
              callback(new Error("请输入正确的任务进度"));
            } else if (value > 100 || value < 0) {
              callback(new Error("请输入0-100之间的数字"));
            } else {
              callback();
            }
          },
          trigger: "blur"
        }
      },
      form: {
        name: "",
        content: "",
        detailing: "",
        progress: "",
        endTime: this.$today(true)
      }
    };
  },
  methods: {
    back() {
      this.$emit("receiveAdd");
    },
    // 添加和编辑维保
    addDetail() {
      this.$refs.form.validate(flag => {
        if (flag) {
          let data = this.form;
          data.unitId = this.$route.query.unitId;
          data.token = this.$getkey();
          let url = "",
            txt = "";
          if (this.details) {
            url = "/buildingUnit/editMaintain";
            data.guid = this.details.guid;
            txt = "编辑";
          } else {
            url = "/buildingUnit/addMaintain";
            txt = "添加";
          }
          this.$ajax(
            `${this.subUrl.user}${url}`,
            data,
            res => {
              this.$message({
                message: txt + "成功",
                type: "success",
                onClose: () => {
                  this.$emit("receiveAdd", true);
                }
              });
            },
            this
          );
        }
      });
    }
  },
  mounted() {
    if (this.details) {
      this.form.name = this.details.name;
      this.form.content = this.details.content;
      this.form.detailing = this.details.detailing;
      this.form.endTime = this.details.endTime;
      this.form.progress = this.details.progress;
    }
  }
};
</script>
<style lang="scss" scoped>
.formAdd {
  background: #fff;
  padding: 20px 10px;
}
</style>
