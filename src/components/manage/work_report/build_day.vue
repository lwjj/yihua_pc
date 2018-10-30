<template>
<!--填写品质稽查 -->
<div id='build_task'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>新建日报</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/work_report' }">工作例报</el-breadcrumb-item>
            <el-breadcrumb-item>新建日报</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container" v-show="show">
       <!-- <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"> -->
        
       <el-form label-width="100px" class="demo-ruleForm">
         <el-form-item label="选择日期">
            <el-date-picker
            v-model="value1"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
         </el-form-item>
      <!-- 表单 -->
     <el-form-item label="标题" prop="title">
        <el-input  style="width:100%" :maxlength="50" v-model="title" placeholder="请输入标题"></el-input>
    </el-form-item>
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
          <el-input type="textarea"  :maxlength="600"  :autosize=" {minRows: 1}" v-model="scope.row.workContent"></el-input>
        </template>
      </el-table-column>
      <el-table-column
      header-align="center"
        label="措施"
        >
        <template slot-scope="scope">
          <el-input type="textarea" :autosize=" {minRows: 1}" :maxlength="300" v-model="scope.row.workMeasure"></el-input>
        </template>
      </el-table-column>
      <!-- <el-table-column
        header-align="center"
        label="执行人"
        >
        <template slot-scope="scope">
            <el-input class="inform_object" readonly v-model="scope.row.executorName" @focus="choosePeople(scope.$index)" placeholder="请选择执行人"></el-input>
        </template>
      </el-table-column>
      <el-table-column
      header-align="center"
        label="完成情况(%)"
        >
        <template slot-scope="scope">
          <el-input-number style="width:100px" controls-position="right" v-model="scope.row.progress" :min="0" :max="100" label=""></el-input-number>
        </template>
      </el-table-column> -->
      <el-table-column
      header-align="center"
        label="操作"
        >
        <template slot-scope="scope">
          <el-button type="danger" plain size="small"  @click.native.prevent="deleteRow(scope.$index, tableData)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  <el-button type="primary"  @click="add" size="small" class="floatR mt1">添加</el-button>
 </div>
  <div class="summary">
        <div class="sum_title">今日总结</div>
        <el-input type="textarea" :autosize=" {minRows: 4}" placeholder="选填"  :maxlength="300" v-model="summarize"></el-input>
  </div>
</el-form>  
<div class="btnBox">
  <el-button type="primary"  @click="save" class="subBtn">存为草稿</el-button>
  <el-button type="primary"  @click="submitTable" class="subBtn">提交</el-button>
</div>

</div>
<chooseAEmploy class="choose" v-show="showExecutor" @checkMen="checkExecutor"></chooseAEmploy>  

</div>
</template> 
<script>
import chooseAEmploy from "../../choose_people/choose_Aemploy";
export default {
  components: {
    chooseAEmploy
  },
  data() {
    return {
      wrId: "0", // 正常提交
      message: "提交成功",
      handle: "0",
      index: "",
      userInfo: "",
      organInfo: "",
      show: true,
      showExecutor: false,
      dept: "",
      dateTime: "",
      summarize: "",
      value1: this.$getToday(),
      title: "",
      tableData: [
        // {
        //   executorName: "",
        //   workContent: "",
        //   workMeasure: "",
        //   executor: "",
        //   progress: "0"
        // }
      ],
      rules: {}
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
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
      let examData = {
        executorName: "",
        workContent: "",
        workMeasure: "",
        executor: "",
        progress: "0"
      };
      this.tableData.push(examData);
      console.log(this.tableData);
    },
    // 删除
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    //存为草稿
    save() {
      this.handle = 2;
      this.message = "已存为草稿";
      this.submitTable();
    },
    //获取工作内容
    getcontent() {
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        type: 1 //汇报类型，1日报；2周报；3月报
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
      // if (this.summarize == "") {
      //   this.$message.error("请输入今日总结");
      //   return;
      // }
      // this.tableData.forEach(ele => {
      //   if (ele.executor == "") {
      //     this.$message.error("请选择执行人");
      //     flag = false;
      //     return;
      //   }
      // });
      if (flag) {
        // this.tableData.forEach(ele => {
        //   delete ele.executorName;
        // });
        console.log(this.tableData, "newTabledata");
        var addWorkReport = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          title: this.title,
          type: 1,
          startTime: this.value1 + " 00:00:00",
          endTime: this.value1 + " 23:59:59",
          wrId: this.wrId,
          summarize: this.summarize?this.summarize:'',
          reportDetailList: this.tableData,
          accessorys: [],
          handle: this.handle
        };
        console.log(addWorkReport);
        this.$ajax1(
          `${
            this.subUrl.activity
          }/workbench/workReport/myReport/addWorkReport?`,
          addWorkReport,
          res => {
            console.log(res, "day");
            this.$message.success(this.message);
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
          console.log(res, "saveRes");
          let workReport = res.data.workReport;
          this.title = workReport.title;
          this.summarize = workReport.summarize;
          this.tableData = res.data.reportDetailList;
          this.imgBox = res.data.commAccessoryList;
          // console.log(this.Del, "Del");
          // li时间格式化
          //   this.reportTime = this.Del.reportTime.split(" ")[0];
          //   if (this.Del.startTime && this.Del.endTime) {
          //     this.startTime = this.Del.startTime.split(" ")[0];
          //     this.endTime = this.Del.endTime.split(" ")[0];
          //   }
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
    console.log(this.userInfo);
    console.log(this.organInfo);

    if (this.$route.params.id != 0) {
      this.getDel();
    } else {
      this.getcontent();
    }
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
.demo-ruleForm {
  background: #fff;
  padding: 10px 10px;
  margin-bottom: 20px;
}

.container {
  padding: 20px 0;
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
  padding-left: 20px;
  text-align: center;
  .el-table {
    font-size: 15px;
  }
}
.summary {
  .sum_title {
    text-align: left;
    padding: 10px;
  }
}
</style>