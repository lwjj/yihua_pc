<template>
<div id='subTemplate'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>新建月报</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/work_report' }">工作例报</el-breadcrumb-item>
            <el-breadcrumb-item>新建月报</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
<div class="container" v-show="show">
       <!-- <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"> -->
       <el-form label-width="50px" class="demo-ruleForm">
     <el-form-item label="标题" prop="title">
        <el-input  style="width:100%" :maxlength="50" v-model="title" placeholder="请输入标题"></el-input>
    </el-form-item>
     <el-form-item label="月份" prop="dateTime">
         <el-date-picker
            format="yyyy-MM"
            value-format="yyyy-MM"
            v-model="dateTime"
            type="month"
            placeholder="选择月"
            @change="getcontent">
        </el-date-picker>
    </el-form-item>
    <!-- 表单 -->
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
        <el-input type="textarea" :maxlength="600" :autosize=" {minRows: 1}" v-model="scope.row.workContent"></el-input>
      </template>
    </el-table-column>
    <el-table-column
    header-align="center"
      label="工作措施"
      >
       <template slot-scope="scope">
        <el-input type="textarea" :maxlength="300" :autosize=" {minRows: 1}" v-model="scope.row.workMeasure"></el-input>
      </template>
    </el-table-column>
     <el-table-column
    header-align="center"
      label="开始时间"
      >
       <template slot-scope="scope">
        <el-date-picker
            style="width:150px"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="scope.row.startTime"
            type="datetime"
            placeholder="选择时间">
        </el-date-picker>
      </template>
    </el-table-column>
     <el-table-column
    header-align="center"
      label="截至时间"
      >
       <template slot-scope="scope">
        <el-date-picker
            style="width:150px"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="scope.row.endTime"
            type="datetime"
            placeholder="选择时间">
        </el-date-picker>
      </template>
    </el-table-column>
    <el-table-column
    header-align="center"
      label="责任人"
      >
       <template slot-scope="scope">
           <el-input class="inform_object" readonly v-model="scope.row.executorName" @focus="choosePeople(scope.$index)" placeholder="请选择执行人"></el-input>
      </template>
    </el-table-column>
    <el-table-column
    header-align="center"
      label="进度结论(%)"
      >
       <template slot-scope="scope">
        <el-input-number style="width:100px" controls-position="right" v-model="scope.row.progress" :min="0" :max="100" label=""></el-input-number>
      </template>
    </el-table-column>
    <el-table-column
    header-align="center"
      label="操作"
      >
      <template slot-scope="scope">
        <el-button type="danger" plain size="small"  @click.native.prevent="deleteRow(scope.$index, tableData)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="mingxi">
    <el-button  @click.native="$router.push('/task/summary/summary_detail')" size="small">明细说明</el-button>
    <el-button type="primary" size="small"  @click="add" class="floatR">添加</el-button>
  </div>
  <div class="summary">
        <div class="sum_title">本月总结</div>
        <el-input type="textarea" :autosize=" {minRows: 4}" v-model="summarize"></el-input>
  </div>
 </div>
</el-form>  
<div class="btnBox">
      <el-button type="primary"  @click="saveDraft" class="subBtn">存为草稿</el-button>
  <el-button type="primary"  @click="submitTable" class="subBtn">提交</el-button>
</div>

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
    return {
      tables: [], // 明细
      wrId: "0", // 正常提交
      message: "提交成功",
      handle: "0",
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
    //获取工作内容
    getcontent() {
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        type: 3 //汇报类型，1日报；2周报；3月报
      };
      if(this.dateTime !=""){
        data.month = this.dateTime
      }
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
        this.$message.error("请选择日期");
        return;
      }
      if (this.summarize == "") {
        this.$message.error("请输入下月计划");
        return;
      }
      this.tableData.forEach(ele => {
        // if (
        //   ele.workContent == "" ||
        //   ele.workMeasure == "" ||
        //   ele.startTime == "" ||
        //   ele.endTime == "" ||
        //   ele.executor == ""
        // ) {
        //   this.$message.error("请正确完整表格信息");
        //   flag = false;
        //   return;
        // }
      });
      if (flag) {
        // this.tableData.forEach(ele => {
        //   delete ele.executorName;
        // });
        console.log(this.tableData, "newTabledata");
        let addWorkReport = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          title: this.title,
          custoMmonth: this.dateTime,
          type: 3, //汇报类型，1日报；2周报；3月报
          // startTime: this.$getToday() + " 00:00:00",
          wrId: this.wrId, //添加时为0，编辑时为当前的汇报单id ,
          summarize: this.summarize,
          reportDetailList: this.tableData,
          accessorys: [],
          handle: this.handle, //0：提交 2：草稿
          tables: this.tables // 明细
        };
        console.log(addWorkReport, "addWorkReport");
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
          this.dateTime = workReport.custoMmonth;
          this.tableData = res.data.reportDetailList;
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