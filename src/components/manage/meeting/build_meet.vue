<template>
<!-- -->
<div id='build_task'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>新建会议纪要</div> -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/meeting' }">会议纪要</el-breadcrumb-item>
            <el-breadcrumb-item>新建会议纪要</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
<div class="container" v-show="show">
       <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
           <el-form-item label="会议议题" prop="title">
                <el-input  style="width:100%" :maxlength="50" v-model="ruleForm.title" placeholder="请输入会议议题"></el-input>
            </el-form-item>
             <el-form-item label="会议时间" prop="time">
                <el-date-picker
                style="width:100%"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                v-model="ruleForm.time"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
             <el-form-item label="会议地点" prop="place">
                <el-input v-model="ruleForm.place" :maxlength="50" placeholder="请输入会议地点"></el-input>
            </el-form-item>
             <el-form-item label="范围" prop="dept">
                <el-input class="inform_object" readonly v-model="ruleForm.dept" @focus="chooseDept" placeholder="请选择部门"></el-input>
            </el-form-item>
            <el-form-item label="记录人" prop="recorder">
                 <el-input class="inform_object" readonly v-model="ruleForm.recorder" @focus="choosePeople1" placeholder="请选择记录人"></el-input>
            </el-form-item>
            <el-form-item label="参与人员" prop="participant">
                 <el-input class="inform_object" readonly v-model="ruleForm.participant" @focus="choosePeople2" placeholder="请选择记录人"></el-input>
            </el-form-item>
       <!-- </el-form> -->
    <!-- 表单 -->
    <!-- <div class="table">
      <div class="header_bar">
        <div class="header_title">生成任务单</div>
        <div class="header_title">发言人</div>
        <div class="header_title">内容</div>
        <div class="header_title">执行人</div>
        <div class="header_title">截止日期</div>
      </div>
    </div> -->
<div class="inform_table">
   <el-table
    border
    :data="tableData"
    >
    <el-table-column
      label="生成任务单"
      header-align="center"
      width="120"> 
      <template slot-scope="scope">
        <el-checkbox v-model="scope.row.selected"></el-checkbox>
      </template>
    </el-table-column>
     <!-- <el-table-column
       
       label=""
      width="160px">
    </el-table-column> -->
    <el-table-column
      label="发言人"
      >
       <template slot-scope="scope">
           <el-input class="inform_object" readonly v-model="scope.row.spokesmanName" @focus="choosePeople3(scope.$index)" placeholder="请选择发言人"></el-input>
      </template>
    </el-table-column>
    <el-table-column
    
      label="内容"
      >
       <template slot-scope="scope">
        <el-input type="textarea" placeholder="最大800字"  :maxlength="800" :autosize=" {minRows: 1}" v-model="scope.row.content"></el-input>
      </template>
    </el-table-column>
     <el-table-column
      label="执行人"
      >
        <template slot-scope="scope">
            <el-input class="inform_object" v-if="scope.row.selected" readonly v-model="scope.row.executorName" @focus="choosePeople4(scope.$index)" placeholder="请选择执行人"></el-input>
      </template>
    </el-table-column>
    <el-table-column
      label="截至日期"
      >
       <template slot-scope="scope">
        <el-date-picker
          v-if="scope.row.selected"
            style="width:150px"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="scope.row.deadline"
            type="datetime"
            placeholder="选择时间">
        </el-date-picker>
      </template>
    </el-table-column>
<!--     <el-table-column
    
      label="完成情况(%)"
      >
       <template slot-scope="scope">

        <el-input-number  v-if="scope.row.selected" controls-position="right" :maxlength="3" v-model="scope.row.completion" :min="0" :max="100" label=""></el-input-number>
      </template>
    </el-table-column> -->
      <el-table-column
    
      label="验证人"
      >
       <template slot-scope="scope">
           <el-input class="inform_object" v-if="scope.row.selected" readonly v-model="scope.row.verifierName" @focus="choosePeople5(scope.$index)" placeholder="请选择检查人"></el-input>
      </template>
    </el-table-column>
    <el-table-column
    
      label="操作"
      >
      <template slot-scope="scope">
        <el-button type="danger" plain size="small"  @click.native.prevent="deleteRow(scope.$index, tableData)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
   <div class="">
    <font color='#f00'>*勾选即表示自动生成任务单</font>
  </div>
  <el-button type="primary"  @click="add" class="mt1 fr" size="mini">添加</el-button>
  
 
 </div>
</el-form>  
<div class="btnBox">
  <el-button type="primary"  @click="submitTable('ruleForm')" class="subBtn">提交</el-button>
</div>

</div>
<chooseAEmploy class="choose" v-show="showRecorder" @checkMen="selectRecod"></chooseAEmploy>  
<chooseEmploy class="choose" v-show="showPartic" @checkMen="selectPartic"></chooseEmploy>  
<chooseDept class="choose" v-show="showDept" @checkMen="selectDept"></chooseDept>  

<chooseAEmploy class="choose" v-show="showSpeak" @checkMen="selectSpeak"></chooseAEmploy>  
<chooseEmploy class="choose" v-show="showExecutor" @checkMen="selectExecutor"></chooseEmploy>  
<chooseAEmploy class="choose" v-show="showVerifier" @checkMen="selectVerifier"></chooseAEmploy>  

</div>
</template> 
<script>
import chooseAEmploy from "../../choose_people/choose_Aemploy";
import chooseEmploy from "../../choose_people/choose_employ";
import chooseDept from "../../choose_people/choose_dept";

export default {
  components: {
    chooseDept,
    chooseAEmploy,
    chooseEmploy
  },
  data() {
    return {
      index: "",
      istask: true,
      userInfo: "",
      organInfo: "",
      show: true,
      showRecorder: false,
      showPartic: false,
      showDept: false,
      showSpeak: false,
      showExecutor: false,
      showVerifier: false,

      // executorId: [],
      // verifyId: "",
      // spokesmanName: "",
      // executorName: [],
      // verifierName: "",

      recorderId: "",
      particId: "",
      deptId: "",
      ruleForm: {
        title: "",
        time: "",
        place: "",
        dept: "",
        recorder: "",
        participant: "",
        dept: ""
      },
      tableData: [
        {
          completion: "",
          content: "",
          deadline: "",
          executor: "",
          executorName: "",
          spokesman: "",
          spokesmanName: "",
          verifier: "",
          verifierName: "",
          type: 1
        }
      ],
      rules: {
        title: [{ required: true, message: "请输入会议议题", trigger: "blur" }],
        time: [{ required: true, message: "请选择时间", trigger: "change" }],
        place: [{ required: true, message: "请填写会议地点", trigger: "blur" }],
        dept: [{ required: true, message: "请选择部门", trigger: "change" }],
        recorder: [
          { required: true, message: "请选择记录人", trigger: "change" }
        ],
        participant: [
          { required: true, message: "请选择参与人员", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    chooseItem(e, b, c) {
      console.log(e, b, c);
    },
    back() {
      this.$router.go(-1);
    },
    selectType(e) {
      this.typeId = e;
    },
    chooseDept() {
      this.show = false;
      this.showDept = true;
    },
    choosePeople1() {
      this.show = false;
      this.showRecorder = true;
    },
    choosePeople2() {
      this.show = false;
      this.showPartic = true;
    },
    choosePeople3(index) {
      this.show = false;
      this.showSpeak = true;
      this.index = index;
    },
    choosePeople4(index) {
      this.show = false;
      this.showExecutor = true;
      this.index = index;
    },
    choosePeople5(index) {
      this.show = false;
      this.showVerifier = true;
      this.index = index;
    },
    // 选记录人
    selectRecod(radio) {
      this.show = true;
      this.showRecorder = false;
      this.ruleForm.recorder = radio.split(",")[1];
      this.recorderId = radio.split(",")[0];
    },
    //选参与人
    selectPartic(checkList) {
      this.show = true;
      this.showPartic = false;
      let arr = [];
      let txtArr = [];
      this.ruleForm.participant = ""; // 清空
      checkList.forEach(ele => {
        txtArr.push(ele.split(",")[1]);
        arr.push(ele.split(",")[0]);
      }, this);
      this.ruleForm.participant = txtArr.join(",");
      this.particId = arr.join(",");
    },
    //选范围 部门
    selectDept(checkList) {
      this.show = true;
      this.showDept = false;
      let arr = [];
      this.ruleForm.dept = "";
      let txtArr = [];
      checkList.forEach(ele => {
        txtArr.push(ele.split(",")[1]);
        arr.push(ele.split(",")[0]);
      }, this);
      this.deptId = arr.join(",");
      this.ruleForm.dept = txtArr.join(",");
    },
    //---------------------
    // 选发言人
    selectSpeak(radio) {
      this.show = true;
      this.showSpeak = false;
      this.tableData[this.index].spokesmanName = radio.split(",")[1];
      this.tableData[this.index].spokesman = radio.split(",")[0];
    },
    //选执行人
    selectExecutor(checkList) {
      this.show = true;
      this.showExecutor = false;
      let arr = [];
      let arr2 = [];
      // 清空
      this.tableData[this.index].executorName = "";
      this.tableData[this.index].executor = "";
      checkList.forEach(ele => {
        arr2.push(ele.split(",")[1]);
        arr.push(ele.split(",")[0]);
      }, this);
      this.tableData[this.index].executorName = arr2.join(",");
      this.tableData[this.index].executor = arr.join(",");
    },
    //选验证人
    selectVerifier(radio) {
      this.show = true;
      this.showVerifier = false;
      this.tableData[this.index].verifierName = radio.split(",")[1];
      this.tableData[this.index].verifier = radio.split(",")[0];
    },
    //添加
    add() {
      let obj = {
        completion: "",
        content: "",
        deadline: "",
        executor: "",
        executorName: "",
        spokesman: "",
        spokesmanName: "",
        verifier: "",
        verifierName: "",
        type: 1
      };
      this.tableData.push(obj);
      console.log(this.tableData);
    },
    // 删除
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    // 提交保存
    submitTable(formName) {
      var that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let flag = true;
          console.log(this.tableData, "tableData");
          this.tableData.forEach(ele => {
            console.log(ele, ele.selected);
            if (ele.selected) {
              if (
                ele.spokesman == "" ||
                ele.executor == "" ||
                ele.verifier == "" ||
                ele.content == "" ||
                // ele.completion === "" ||
                ele.deadline == "" ||
                ele.problem == ""
              ) {
                that.$message.error("请输入完整信息");
                flag = false;
                return true;
              }

              ele.type = 1;
            } else {
              if (ele.spokesman == "" || ele.content == "") {
                return that.$message.error("请输入完整信息");
              }
              ele.type = 2;
            }
            delete ele.selected;
            delete ele.executorName;
            console.log(JSON.stringify(ele));
          });
          if (flag) {
            var msBillJson = {
              msBillRowList: this.tableData,
              meetingAddress: this.ruleForm.place,
              meetingDate: this.ruleForm.time + " 00:00:00",
              meetingTopic: this.ruleForm.title,
              organId: this.organInfo.guid,
              participantList: this.particId,
              recorder: this.recorderId,
              scope: this.deptId,
              token: this.$getkey(),
              userId: this.userInfo.guid
            };
            this.$ajax1(
              `${this.subUrl.activity}/meetingSummary/saveMeetSummyBill?`,
              msBillJson,
              res => {
                console.log(res, "meet");
                this.$message.success("新建成功");
                this.back();
              },
              this
            );
          }
        } else {
          this.$message.error("请填写完整信息");
          return false;
        }
      });
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
  // text-align: center;
  .el-table {
    font-size: 15px;
  }
  .istask {
    text-align: left;
    margin-top: 30px;
  }
}
// 表格居中
.el-form {
  margin: 0 auto !important;
  padding: 20px 50px;
}
</style>