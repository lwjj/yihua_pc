<template>
    <div>
        <div class="title">
             <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/building_management/index' }">房屋管理</el-breadcrumb-item>
                <el-breadcrumb-item class="cursor" @click.native="back">返回</el-breadcrumb-item>
                <el-breadcrumb-item>维保详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="list">
            <div class="listItem" v-if="details.content"><b>内容：</b>{{details.content}}</div>
            <div class="listItem" v-if="details.detailing"><b>标准化明细：</b>{{details.detailing}}</div>
            <div class="listItem" v-if="details.name"><b>责任人：</b>{{details.name}}</div>
            <div class="listItem" v-if="details.endTime"><b>截止时间：</b>{{details.endTime}}</div>
            <div class="listItem" v-if="details.progress"><b>任务进度：</b>{{details.progress}}%</div>
            <div class="listItem" v-if="details.createTime"><b>创建时间：</b>{{details.createTime}}</div>
        </div>
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
      this.$emit("receiveDetail");
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
.list {
  background: #fff;
  padding: 20px 10px;
  .listItem {
    line-height: 2;
    font-size: 14px;
    margin-bottom: 20px;
    color: #999;
    b {
      padding-right: 10px;
      color: #666;
    }
  }
}
</style>
