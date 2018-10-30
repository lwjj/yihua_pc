<template>
<div id='subTemplate'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>新建月报</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item @click.native='$router.go(-1)'>管理处月报</el-breadcrumb-item>
            <el-breadcrumb-item>新建部门明细</el-breadcrumb-item>
        </el-breadcrumb>
    </div> 
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
      show: false,
      showExecutor: false,
      showMingxi: true,
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
      // this.getDel();
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