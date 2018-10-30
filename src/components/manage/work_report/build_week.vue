<template>
<div id='build_task'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>新建周报</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/work_report' }">工作例报</el-breadcrumb-item>
            <el-breadcrumb-item>新建周报</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
<div class="container" v-show="show">
       <!-- <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"> -->
       <el-form label-width="100px" class="demo-ruleForm">
    <!-- 表单 -->
     <el-form-item label="标题" prop="title">
        <el-input  style="width:100%" :maxlength="50" v-model="title" placeholder="请输入标题"></el-input>
    </el-form-item>
     <el-form-item label="日期" prop="dateTime"> 
        <el-date-picker
         @change="getEndDate"
          v-model="dateTime"
          type="week"
          format="yyyy 第 WW 周"
          placeholder="选择周">
        </el-date-picker>
    </el-form-item>
    <el-form-item label="起止时间" v-if="startTime">
      <div class="flex">
        <el-input v-if="startTime" class="mr1" v-model="startTime"></el-input>
        <el-input v-if="endDate" v-model="endDate"></el-input>
      </div>
      
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
        <el-input type="textarea"  :maxlength="600" :autosize=" {minRows: 1}" v-model="scope.row.workContent"></el-input>
      </template>
    </el-table-column>
    <el-table-column
    header-align="center"
      label="工作措施"
      >
       <template slot-scope="scope">
        <el-input type="textarea" placeholder="选填" :maxlength="300"  :autosize=" {minRows: 1}" v-model="scope.row.workMeasure"></el-input>
      </template>
    </el-table-column>
     <!-- <el-table-column
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
    </el-table-column> -->
    <el-table-column
    header-align="center"
      label="负责人"
      >
       <template slot-scope="scope">
           <el-input class="inform_object" readonly v-model="scope.row.executorName" @focus="choosePeople(scope.$index)" placeholder="请选择负责人"></el-input>
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
  <el-button type="primary"  @click="add" size="small" class="mt1 floatL clearfix">添加</el-button>
 </div>
 <br>
  <div class="summary mt2">
        <div class="sum_title">本周总结</div>
        <el-input type="textarea" :autosize=" {minRows: 4}" v-model="summarize"></el-input>
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
      startTime: "",
      endDate: "",
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
      title: "",
      tableData: [
        // {
        //   executorName: "",
        //   startTime: "",
        //   endTime: "",
        //   workContent: "",
        //   workMeasure: "",
        //   executor: "",
        //   progress: "0"
        // }
      ],
      rules: {}
      // taskList:[]
    };
  },

  methods: {
    getEndDate(e) {
      this.startTime = new Date(e.getTime()).format("yyyy-MM-dd hh:mm:ss");
      this.endDate = new Date(e.getTime() + (3600 * 24 * 7 - 1) * 1000).format(
        "yyyy-MM-dd hh:mm:ss"
      );
      // console.log(this.startTime, this.endDate);
      // this.endDate = this.$getToday(
      //   new Date(e).getTime() + 3600 * 24 * 7 * 1000
      // );
      // this.endDate = this.endDate.substr(0, 10) + " 23:59:59";
      // console.log();
      // this.getTask()
      this.getcontent()
    },
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
    // 获取工作内容
    getcontent() {
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        type: 2 ,//汇报类型，1日报；2周报；3月报
        date: this.startTime
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
    save() {
      this.handle = 2;
      this.message = "已存为草稿";
      this.submitTable();
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
        this.$message.error("请输入本周总结");
        return;
      }
      this.tableData.forEach(ele => {
        if (
          ele.workContent == "" ||
          // ele.workMeasure == "" ||
          // ele.startTime == "" ||
          // ele.endTime == "" ||
          ele.executor == ""
        ) {
          this.$message.error("请正确完整表格信息");
          flag = false;
          return;
        }
      });
      if (flag) {
        let date1, date2;
        date1 = this.dateTime[0] + " 00:00:00";
        date2 = this.dateTime[1] + " 00:00:00";
        // this.tableData.forEach(ele => {
        //   delete ele.executorName;
        // });
        // this.tableDate.concat(this.taskList)
        console.log(this.tableData, "newTabledata");
        let addWorkReport = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          title: this.title,
          startTime: this.startTime,
          type: 2, //汇报类型，1日报；2周报；3月报
          endTime: this.endDate,
          wrId: this.wrId, //添加时为0，编辑时为当前的汇报单id ,
          summarize: this.summarize,
          reportDetailList: this.tableData,
          accessorys: [],
          handle: this.handle //0：提交 2：草稿
        };
        console.log(addWorkReport);
        this.$ajax1(
          `${
            this.subUrl.activity
          }/workbench/workReport/myReport/addWorkReport?`,
          addWorkReport,
          res => {
            console.log(res, "day");
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
          console.log(res, "saveRes");
          let workReport = res.data.workReport;
          this.title = workReport.title;
          this.summarize = workReport.summarize;
          this.dateTime = [workReport.startTime, workReport.endTime];
          this.tableData = res.data.reportDetailList;
          this.imgBox = res.data.commAccessoryList;
        },
        this
      );
    },
    //获取列表
    // getTask(taskBillType = 0) {
    //   var date1, date2;
    //   if (this.startTime) {
    //     date1 = this.startTime;
    //     date2 = this.endDate;
    //   }
    //   var data = {
    //     token: this.$getkey(),
    //     userId: localStorage.getItem("user_Id"),
    //     type: taskBillType,
    //     startDate: date1,
    //     endDate: date2,
    //     pageNo: this.pageNo
    //   };
    //   this.$ajax(
    //     `${this.subUrl.activity}/taskBill/taskProgress/getTaskList`,
    //     data,
    //     res => {
    //       // this.pageCount = res.data.pageCount * 1;
    //   //      tableData: [
    //   //   {
    //   //     executorName: "",
    //   //     startTime: "",
    //   //     endTime: "",
    //   //     workContent: "",
    //   //     workMeasure: "",
    //   //     executor: "",
    //   //     progress: "0"
    //   //   }
    //   // ]
    //       for(const i of res.data.list){
    //         console.log(i,"iiiiiiiiiiiiiiiiiiiiiiiiiii")
    //       }
    //       this.taskList.executorName = res.data.list[i].taskDetail
    //       this.taskList = res.data.list;
    //       console.log(this.taskList,"taskListtaskListtaskListtaskList")
    //     },
    //     this
    //   );
    // },
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