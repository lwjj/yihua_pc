<template>
<!-- 添加年计划-->
<div id='subTemplate'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>添加年计划</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/task/year_sched' }">年度计划</el-breadcrumb-item>
            <el-breadcrumb-item>{{$route.query.guid?'编辑':'添加'}}年计划({{$route.query.name}})</el-breadcrumb-item>
        </el-breadcrumb>

    </div>
<div class="container" >
  <div v-if='$route.query.guid' class="topButton">
    <el-button type="primary" @click="edit" class="subBtn">编辑</el-button>
  </div>
 <div class='topButton' v-else>
    <el-button type="primary" @click="submitTable" class="subBtn">保存</el-button>
    <el-button type="primary" @click="addOne" class="subBtn">添加</el-button>
 </div>

   <!-- 表单 -->
   <el-form label-width="100px" class="demo-ruleForm">
<div class="inform_table">
   <el-table
    :data="tableData"
    border
    >
     <el-table-column
      type="index"
       header-align="center"
       label="序号"
      width="80px">
    </el-table-column>
    <el-table-column
    header-align="center"
      label="工作内容"
      >
       <template slot-scope="scope">
        <el-input type="textarea"  :autosize=" {minRows: 1}" v-model="scope.row.content"></el-input>
      </template>
    </el-table-column>
     <el-table-column
    header-align="center"
      label="时间安排(月份)"
      >
       <template slot-scope="scope">
        <el-date-picker
            format="M月"
            value-format="M"
            v-model="scope.row.month"
            type="month"
            placeholder="选择月">
        </el-date-picker>
      </template>
    </el-table-column>
    <!-- <el-table-column
    header-align="center"
      label="责任人"
      >
       <template slot-scope="scope">
           <el-input class="inform_object" readonly v-model="scope.row.executorName" @focus="choosePeople(scope.$index)" placeholder="请选择执行人"></el-input>
      </template>
    </el-table-column> -->
    <el-table-column header-align="center"  label="频次" >
       <template slot-scope="scope">
        <el-input-number style="" controls-position="right" v-model="scope.row.time" :min="0"  label=""></el-input-number>
      </template>
    </el-table-column>
    <el-table-column
     v-if="!$route.query.guid"
    header-align="center"
      label="操作"
      width="140px"
      >
      <template slot-scope="scope">
        <el-button type="danger" plain size="small"  @click.native.prevent="deleteRow(scope.$index, tableData)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
 </div>
</el-form>  
</div>
</div>
</template> 
<script>
import Vue from "vue";
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
    edit() {
      let data = this.tableData[0];
      if (!data.content) return this.$message.error("请输入内容");
      if (!data.month) return this.$message.error("请选择月份");
      if (!data.time) return this.$message.error("请输入频次");
      data.token = this.$getkey();
      this.$confirm("是否保存编辑", "提示", { type: "warning" })
        .then(() => {
          this.$ajax(
            `${this.subUrl.activity}/yearlyPlan/editPlan`,
            data,
            res => {
              this.$message.success("编辑成功");
              this.back();
            },
            this
          );
        })
        .catch(() => {});
    },
    // 点击添加一条计划
    addOne() {
      let data = {
        content: "",
        month: "",
        time: 0
        // userName: ""
      };
      this.tableData.push(data);
    },
    // 获取年计划
    getYearPlan() {
      var data = {
        token: this.$getkey(),
        year: this.yearValue,
        deptId: this.$route.params.deptId
      };
      this.$ajax(
        `${this.subUrl.activity}/yearlyPlan/getPlan`,
        data,
        res => {
          if (res.data) {
            for (let v of res.data.monthlyPlanList) {
              this.tableData.push({
                content: v.content,
                month: v.month + "",
                time: v.time
              });
            }
          } else {
            this.tableData = [];
          }
        },
        this
      );
    },
    // 删除
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    // 提交保存
    submitTable() {
      // 判断填写是否完整
      var flag = false;
      if (this.tableData.length == 0) {
        this.$message.error("请填写完整信息");
        return;
      }
      this.tableData.forEach(ele => {
        if (ele.content == "" || ele.month == "") {
          return (flag = true);
        }
      });
      if (flag) {
        this.$message.error("请填写完整信息");
        return;
      }
      var data = {
        token: this.$getkey(),
        year: this.$route.params.yearValue,
        deptId: this.$route.params.deptId
        // plan:JSON.stringify()
      };
      console.log(data, "addPlandata");
      this.$ajax1(
        `${this.subUrl.activity}/yearlyPlan/addPlan?${this.$qs.stringify(
          data
        )}`,
        this.tableData,
        res => {
          console.log(res, "yearPlan");
          this.$message.success("添加成功");
          this.back();
        },
        this
      );
    }
  },
  mounted() {
    console.log(this.$route.params);
    this.yearValue = this.$route.params.yearValue - 1;
    if (!this.$route.query.guid) {
      this.getYearPlan();
    } else {
      let obj = this.$route.query;
      this.tableData.push({
        content: obj.content,
        time: obj.time,
        month: obj.month + "",
        guid: obj.guid
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#subTemplate {
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
  border: 0;
  height: 100%;
  position: relative;
  padding-top: 50px;
  .topButton {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .demo-ruleForm {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
  }
}
.cell-edit-color {
  color: #2db7f5;
  font-weight: bold;
}
.subBtn {
  float: right;
  margin: 0 20px 10px 0;
}
// 表格
.inform_table {
  text-align: center;
}
</style>