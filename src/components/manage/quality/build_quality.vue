<template>
<!--填写品质稽查 -->
<div id='build_task'>
    <div class="title">
        <div class="text"><i @click="back" class="el-icon-arrow-left"></i>填写品质稽查</div>
    </div>
    <div class="container" v-show="show">
       <el-form :model="ruleForm" :rules="rules" ref="ruleForm" status-icon label-width="100px" class="demo-ruleForm">
           <el-form-item label="稽查标题" prop="title">
                <el-input style="width:100%" :maxlength="50" v-model="ruleForm.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="稽查类型" prop="qualiType">
            <el-select  style="width:100%" v-model="ruleForm.qualiType" placeholder="请选择类型" @change="selectType">
                <el-option
                v-for="item in qualiTypeList"
                :key="item.value"
                :label="item.dictDataName"
                :value="item.dictDataValue">
                </el-option>
            </el-select>
             </el-form-item>
            <el-form-item label="稽查时间" prop="time">
                <el-date-picker
                style="width:100%"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                v-model="ruleForm.time"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="制表人" prop="tabPeople">
              <!-- @focus="choosePeople1" -->
              <el-input class="inform_object" readonly v-model="ruleForm.tabPeople"   placeholder="请选择制表人"></el-input>
            </el-form-item>
       <!-- </el-form> -->
    <!-- 表单 -->
<div class="inform_table">
   <el-table
   border
    :data="tableData"
    >
    <el-table-column
      type="index"
       header-align="center"
       label="序号"
      width="80px">
    </el-table-column>
    <el-table-column
    header-align="center"
      label="检查人"
      >
       <template slot-scope="scope">
           <el-input class="inform_object" readonly v-model="scope.row.checkerName" @focus="choosePeople2(scope.$index)" placeholder="请选择检查人"></el-input>
      </template>
    </el-table-column>
    <el-table-column
    header-align="center"
      label="被检部门"
      >
        <template slot-scope="scope">
            <el-input class="inform_object" readonly v-model="scope.row.deptName" @focus="choosePeople3(scope.$index)" placeholder="请选择部门"></el-input>
      </template>
    </el-table-column>
    <el-table-column
    header-align="center"
      label="存在问题"
      >
       <template slot-scope="scope">
        <el-input type="textarea"   :maxlength="300" :autosize=" {minRows: 1}" v-model="scope.row.problem"></el-input>
      </template>
    </el-table-column>
    <el-table-column
    header-align="center"
      label="整改期限"
      >
       <template slot-scope="scope">
        <el-date-picker
            style="width:150px"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="scope.row.deadline"
            type="datetime"
            placeholder="选择时间">
        </el-date-picker>
      </template>
    </el-table-column>
    <el-table-column
    header-align="center"
      label="措施"
      >
       <template slot-scope="scope">
        <el-input type="textarea" :maxlength="300" :autosize=" {minRows: 1}" v-model="scope.row.measure"></el-input>
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
 </div>
</el-form>  
<div class="btnBox">
  <el-button type="primary"  @click="add" class="subBtn">添加</el-button>
  <el-button type="primary"  @click="submitTable('ruleForm')" class="subBtn">提交</el-button>
</div>

</div>
<chooseAEmploy class="choose" v-show="showTabPeople" @checkMen="checkTabPeople"></chooseAEmploy>  
<chooseAEmploy class="choose" v-show="showChecker" @checkMen="checkChecker"></chooseAEmploy>  
<chooseADept class="choose" v-show="showDept" @checkMen="checkDept"></chooseADept>  

</div>
</template> 
<script>
import chooseAEmploy from "../../choose_people/choose_Aemploy";
import chooseADept from "../../choose_people/choose_Adept";

export default {
  components: {
    chooseAEmploy,
    chooseADept
  },
  data() {
    return {
      index: "",
      userInfo: "",
      organInfo: "",
      show: true,
      showTabPeople: false,
      showChecker: false,
      showDept: false,
      qualiTypeList: [],
      typeId: "",
      userId: "",
      // checkerId: "",
      // deptId: "",
      ruleForm: {
        title: "",
        time: "",
        tabPeople: "",
        qualiType: ""
      },
      tableData: [
        {
          checkerName: "",
          deptName: "",
          checker: "",
          deptId: "",
          deadline: "",
          measure: "",
          problem: "",
          imageNames: []
        }
      ],
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "change" }],
        time: [{ required: true, message: "请选择时间", trigger: "change" }],
        qualiType: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
          //{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        qualiType: [
          { required: true, message: "请填写任务详情", trigger: "blur" }
        ],
        tabPeople: [
          { required: true, message: "请选择制表人", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    selectType(e) {
      this.typeId = e;
    },
    choosePeople1() {
      this.show = false;
      this.showTabPeople = true;
    },
    choosePeople2(index) {
      this.show = false;
      this.showChecker = true;
      this.index = index;
      console.log(index);
    },
    choosePeople3(index) {
      this.show = false;
      this.showDept = true;
      this.index = index;
      console.log(index);
    },
    // 选制表人
    checkTabPeople(radio) {
      console.log(radio);
      this.show = true;
      this.showTabPeople = false;
      this.ruleForm.tabPeople = radio.split(",")[1];
      this.userId = radio.split(",")[0];
    },
    // 选检查人
    checkChecker(radio) {
      console.log(radio);
      this.show = true;
      this.showChecker = false;
      this.tableData[this.index].checkerName = radio.split(",")[1];
      this.tableData[this.index].checker = radio.split(",")[0];
    },
    // 选部门
    checkDept(radio) {
      console.log(radio);
      this.show = true;
      this.showDept = false;
      // this.tableData[this.index].deptName = [];
      this.tableData[this.index].deptName = radio.split(",")[1];
      this.tableData[this.index].deptId = radio.split(",")[0];
    },
    //获取品质稽查类型
    getQualiType() {
      this.$ajax(
        `${this.subUrl.user}/comm/queryExamineCategory`,
        "",
        res => {
          console.log(res, "qualitype");
          this.qualiTypeList = res.data.JCC;
        },
        this
      );
    },
    //添加
    add() {
      let obj = {
        checkerName: "",
        deptName: "",
        checker: "",
        deptId: "",
        deadline: "",
        measure: "",
        problem: "",
        imageNames: []
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.tableData.forEach(ele => {
          //   delete ele.checkerName
          //   delete ele.deptName
          // });
          this.tableData.forEach(ele => {
            if (
              ele.checker == "" ||
              ele.deptId == "" ||
              ele.deadline == "" ||
              ele.measure == "" ||
              ele.problem == ""
            ) {
              this.$message.error("请输入完整信息");
              // flag = false;
              return;
            }
          });
          var examineBillJson = {
            examineBillRowList: this.tableData,
            examineDate: this.ruleForm.time + " 00:00:00",
            organId: this.organInfo.guid,
            title: this.ruleForm.title,
            token: this.$getkey(),
            type: this.typeId,
            userId: this.userInfo.guid
          };
          console.log(examineBillJson);
          this.$ajax1(
            `${this.subUrl.activity}/examine/saveExamine?`,
            examineBillJson,
            res => {
              console.log(res, "quil");
              this.$message.success("添加成功");
              this.back();
            },
            this
          );
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
    this.getQualiType();
    this.$set(this.ruleForm, "tabPeople", this.userInfo.name);
  }
};
</script>
<style lang="scss" scoped>
#build_task {
  height: 100%;
  padding-left: 300px;
  padding-right: 40px;
  background: #f2f2f2;
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
// 表格居中
.el-form {
  margin: 0 auto !important;
  padding: 20px 50px;
}
// 表格
.inform_table {
  padding-left: 20px;
  text-align: center;
  .el-table {
    font-size: 15px;
  }
}
</style>