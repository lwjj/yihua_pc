<template>
<!-- -->
<div id='build_task'>
    <div class="title">
        <div class="text"><i @click="back" class="el-icon-arrow-left"></i>新建管理处月报</div>
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/manage_report' }">管理处月报</el-breadcrumb-item>
            <el-breadcrumb-item>新建管理处月报</el-breadcrumb-item>
        </el-breadcrumb> -->
    </div>
  <div class="container" v-show="show">
    <!-- 输入表单 -->
       <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="190px" class="demo-ruleForm clearfix">
           <el-form-item label="管理处：" prop="organName" class="input_out">
                <!-- <el-input readonly class="input_text" v-model="ruleForm.organName" placeholder="请输入管理处名称"></el-input> -->
                <div v-text="ruleForm.organName"></div>
            </el-form-item>
             <el-form-item label="月份：" prop="month" class="input_out">
                <!-- <el-date-picker
                readonly
                class="input_text"
                format="yyyy年MM月"
                value-format="yyyy-MM-dd"
                v-model="ruleForm.month"
                type="month"
                placeholder="请选择月份">
                </el-date-picker> -->
                <div v-text="ruleForm.month+'月'"></div>
            </el-form-item>
          
               <el-form-item label="地址：" prop="place" class="input_out">
                <!-- <el-input readonly class="input_text" v-model="ruleForm.place" placeholder="请输入地址"></el-input> -->
                <div v-text="ruleForm.place"></div>
            </el-form-item>
             <el-form-item label="汇报周期：" prop="daterange" class="input_out">
                 <el-date-picker
                    class="input_text"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    v-model="ruleForm.daterange"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
             <el-form-item label="项目名称：" prop="title" class="input_out">
                <el-input class="input_text" v-model="ruleForm.title" placeholder="请输入项目名称"></el-input>
            </el-form-item>
            <el-form-item label="汇报公司：" prop="reportOrganName" class="input_out">
              <el-select class="input_text" v-model="ruleForm.reportOrganName" placeholder="请选择汇报公司" @change="selectCompany">
                <el-option
                  v-for="item in companyList"
                  :key="item.value"
                  :label="item.organName"
                  :value="item.organId+','+item.relation">
                </el-option>
              </el-select>
            </el-form-item>
            
             <el-form-item label="建筑面积(平米)：" prop="area" class="input_out">
                <el-input class="input_text" v-model="ruleForm.area" type="number" placeholder="请输入建筑面积"></el-input>
            </el-form-item>
             <el-form-item label="管理关系：" prop="relation" class="input_out">
                <el-input readonly class="input_text" v-model="ruleForm.relation" placeholder="请输入管理关系"></el-input>
            </el-form-item>
            
             <el-form-item label="已出租面积(平米)：" prop="sellArea" class="input_out">
                <el-input class="input_text" v-model="ruleForm.sellArea" type="number" placeholder="请输入已出租面积"></el-input>
            </el-form-item>
             <el-form-item label="入住率(%)：" prop="occupancy" class="input_out">
                <el-input class="input_text" v-model="ruleForm.occupancy" type="number" placeholder="请输入入住率"></el-input>
            </el-form-item>
             <el-form-item label="办公收费标准(元/平米)：" prop="officeFee" class="input_out">
                <el-input class="input_text" v-model="ruleForm.officeFee" type="number" placeholder="请输入办公收费标准"></el-input>
            </el-form-item>
             <el-form-item label="商业收费标准(元/平米)：" prop="businessFee" class="input_out">
                <el-input class="input_text" v-model="ruleForm.businessFee" type="number" placeholder="请输入商业收费标准"></el-input>
            </el-form-item>
             <el-form-item label="当月应收管理费：" prop="expectFee" class="input_out">
                <el-input class="input_text" v-model="ruleForm.expectFee" type="number" placeholder="请输入当月应收管理费"></el-input>
            </el-form-item>
             <el-form-item label="当月实收管理费：" prop="actualFee" class="input_out">
                <el-input class="input_text" v-model="ruleForm.actualFee" type="number" placeholder="请输入当月实收管理费"></el-input>
            </el-form-item>
             <el-form-item label="当月收缴率(%)：" prop="monChargeRate" class="input_out">
                <el-input class="input_text" v-model="ruleForm.monChargeRate" type="number" placeholder="请输入当月收缴率"></el-input>
            </el-form-item>
             <el-form-item label="当月员工数：" prop="employeNum" class="input_out">
                <el-input class="input_text" v-model="ruleForm.employeNum" type="number" placeholder="请输入当月员工数"></el-input>
            </el-form-item>
       </el-form>

<!-- 重大事项 -->
    <div class="important">
    <h4>重大事项</h4>
    <!-- 表格 -->
    <div class="inform_table" v-for="(item,index) in tableDataList" :key="index">
      <div class="mTitle" style="text-align:left;line-height:40px;color:#000;font-size:18px;">({{index+1}})、{{item.deptName}}</div>
      <el-table
        ref="multipleTable"
        :data="item.tableList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange($event,index)">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column 
         width="160"
         label='标题'
         property='title'
        >
        </el-table-column>
        <el-table-column 
        label="表格"
        header-align='center'
        >
        <template slot-scope="scope">
         <div class="mtable">
            <div class="list" v-for="(item1,index) in scope.row.tableRows" :key="index">
              <div class="list_item" v-for="(item2,index2) in item1.tableDatas" :title="item2.value" :key="index2">
                {{item2.value}}
              </div>
            </div>
         </div>
          <!-- <el-table :data='scope.row.tableRows' ref="multipleTable1">
              <el-table-column header-align='center' v-for="(item1,index) in scope.row.tableRows[0].tableDatas" :label="item1.value" >
                <template slot-scope="scope1">
                  <div v-for="(item2,index2) in scope1.row.tableDatas" v-if="scope1.$index == (index2+1)" :key="index2">
                    {{item2.value}}--{{index2}} -- {{scope1.$index}}
                  </div>
                </template>
              </el-table-column>
          </el-table> -->
        </template>
        </el-table-column>
       
      </el-table>
    </div>
</div>

<!-- 提交 -->
<div class="btnBox">
  <!-- <el-button type="primary"  @click="add" class="subBtn">添加</el-button> -->
  <el-button type="primary"  @click="save('ruleForm')" class="subBtn">存草稿</el-button>
  <el-button type="primary"  @click="submitTable('ruleForm')" class="subBtn">上报</el-button>
</div>
</div>

<div class="chooseIndex">


</div>
<div class="tableBox" v-if="showMingxi">
    <div class="top_header">
        <h4 class="floatL"><i @click="mingxiBack" class="el-icon-d-arrow-left"></i>明细说明</h4>
        <!-- <el-button class="floatR" style="margin:10px 50px" type="primary" @click="buildTable">新建表格</el-button> -->
    </div>
      <!-- 明细 -->
  <div v-for="(item,index) in mingxi" :key="index" >
    <!-- 新建的表 -->
    <div class="newCreateTable" >
      <div class="newtitle">
        <h4 v-text="item.title" class="floatL"></h4>
      </div>
        <el-table 
        border
        :data="MingxiDataList[index]" 
        style="width: 100%">  
          <el-table-column 
            header-align="center"
            v-for="(item1,index1) in item.tableRows[0].tableDatas"
            :key="index1"
            :label="item1.value"
            >
            <template slot-scope="scope">
                <!-- <el-input type="textarea"  :autosize="{minRows: 1}" v-model="scope.row[keyArr[index+1]]"></el-input> -->
                <div v-text="scope.row[keyArr[index1]]" ></div>
            </template>
          </el-table-column>
        </el-table>  
    </div>
  </div>
</div>
    <!-- 明细 -->
    <!-- <mingxi v-if="showMingxi"></mingxi> -->
</div>
</template> 
<script>
// import mingxi from "./build_mingxi";
export default {
  // components: {
  //   mingxi
  // },
  data() {
    return {
      message: "上报成功",
      handle: 0,
      allTables: [],
      mingxi: [],
      show: true,
      showMingxi: false,
      index: "",
      userInfo: "",
      organInfo: "",
      companyList: [],
      tableDataList: [],
      tableDataListCopy: [],
      MingxiDataList: [],
      relationId: "",
      reportOrganId: "",
      defaultData: {},
      ruleForm: {
        organName: "",
        title: "",
        daterange: [],
        reportOrganName: "",
        month: "",
        place: "",
        relation: "",
        area: "",
        sellArea: "",
        occupancy: "",
        officeFee: "",
        businessFee: "",
        expectFee: "",
        actualFee: "",
        monChargeRate: "",
        employeNum: ""
      },
      rules: {
        title: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        daterange: [
          { required: true, message: "请选择汇报周期：", trigger: "blur" }
        ],

        reportOrganName: [
          { required: true, message: "请选择汇报公司", trigger: "blur" }
        ],
        area: [{ required: true, message: "请输入建筑面积", trigger: "blur" }],
        sellArea: [
          { required: true, message: "请输入已出租面积", trigger: "blur" }
        ],
        occupancy: [
          { required: true, message: "请输入入住率", trigger: "blur" }
        ],
        officeFee: [
          { required: true, message: "请输入办公收费标准", trigger: "blur" }
        ],
        businessFee: [
          { required: true, message: "请输入商业收费标准", trigger: "blur" }
        ],
        expectFee: [
          { required: true, message: "请输入当月应收管理费", trigger: "blur" }
        ],
        actualFee: [
          { required: true, message: "请输入当月实收管理费", trigger: "blur" }
        ],
        monChargeRate: [
          { required: true, message: "请输入当月收缴率", trigger: "blur" }
        ],
        employeNum: [
          { required: true, message: "请输入当月员工数", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleSelectionChange(e, index) {
      console.log(e, index);
      this.$set(this.tableDataListCopy, index, e);
      console.log(this.tableDataListCopy);
    },
    back() {
      this.$router.go(-1);
    },
    turnTo(e) {
      this.$router.push(e);
    },
    selectType(e) {
      this.typeId = e;
    },
    mingxiBack() {
      this.show = true;
      this.showMingxi = false;
    },
    // 选择汇报公司   1：直属关系（包含财务管理），2：托管关系）
    selectCompany(e) {
      console.log(e);
      this.reportOrganId = e.split(",")[0];
      this.relationId = e.split(",")[1];
      if (this.relationId == 1) {
        this.ruleForm.relation = "直属关系（包含财务管理）";
      } else if (this.relationId == 2) {
        this.ruleForm.relation = "托管关系（不包含财务管理）";
      }
      console.log(e);
    },
    // 获取汇报公司
    getCompany() {
      //
      let data = {
        token: this.$getkey(),
        organId: this.organInfo.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/manageMonRep/queryBindOrgan`,
        data,
        res => {
          console.log(res, "getCompany");
          this.companyList = res.data;
        },
        this
      );
    },
    // 转化明细数据
    transformMingxi(tables) {
      this.MingxiDataList = [];
      console.log(tables, "tables");
      this.show = false;
      this.showMingxi = true;
      this.mingxi = JSON.parse(JSON.stringify(tables));
      let newTables = JSON.parse(JSON.stringify(tables));
      newTables.forEach((ele, i) => {
        ele.tableRows.shift();
        let tableData = [];
        ele.tableRows.forEach((ele2, j) => {
          let obj = {};
          ele2.tableDatas.forEach((ele3, k) => {
            obj["header" + k] = ele3.value;
          });
          tableData.push(obj);
        });
        this.MingxiDataList.push(tableData);
      });
      console.log(this.MingxiDataList, "this.MingxiDataList");
    },
    // 删除
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    //存草稿
    save(formName) {
      this.message = "已存为草稿";
      this.handle = 2;
      this.submitTable(formName);
    },
    // 提交保存
    submitTable(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let flag = false;
          for (let [i, val] of this.tableDataListCopy.entries()) {
            this.$set(this.tableDataList[i], "tableList", val);
            console.log(val);
            if (val.length != 0) {
              flag = true;
            }
          }
          if (!flag)
            return this.$message({ message: "请选择部门明细", type: "error" });
          var data = {
            buildingArea: this.ruleForm.area,
            busiFeeStand: this.ruleForm.businessFee,
            checkInRate: this.ruleForm.occupancy,
            createDate: this.defaultData.createDate,
            handle: this.handle,
            manageRelType: this.relationId,
            monAcctCharge: this.ruleForm.actualFee,
            monChargeRate: this.ruleForm.monChargeRate,
            monEmpNum: this.ruleForm.employeNum,
            monShouldCharge: this.ruleForm.expectFee,
            month: this.ruleForm.month,
            officeFeeStand: this.ruleForm.officeFee,
            organAddr: this.ruleForm.place,
            organId: this.organInfo.guid,
            projectName: this.ruleForm.title,
            rentArea: this.ruleForm.sellArea,
            repStartDate: this.ruleForm.daterange[0],
            repEndDate: this.ruleForm.daterange[1],
            reportOrganId: this.reportOrganId,
            tables: this.allTables,
            monthRepDtoList: this.tableDataList,
            token: this.$getkey(),
            userId: this.userInfo.guid
          };
          if (this.$route.params.id != "0") {
            data.guid = this.$route.params.id;
          } else {
            data.guid = this.defaultData.guid;
          }

          this.$ajax1(
            `${this.subUrl.activity}/manageMonRep/saveMonthRep?`,
            data,
            res => {
              console.log(res, "submitTable");
              this.$message.success(this.message);
              this.back();
            },
            this
          );
        } else {
          this.$message.error("请填写完整信息");
          return false;
        }
      });
    },
    // 获取草稿
    getScraft() {
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        monthRepId: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.activity}/manageMonRep/getMonthRepDetail`,
        data,
        res => {
          console.log(res, "getScraft");
          let scraft = res.data;

          this.ruleForm.title = scraft.projectName;
          this.ruleForm.daterange = [scraft.repStartDate, scraft.repEndDate];
          this.ruleForm.reportOrganName = scraft.reportOrganName;
          this.reportOrganId = scraft.reportOrganName;
          // this.ruleForm.relation= scraft.manageRelType;
          if ((scraft.manageRelType = 1)) {
            this.ruleForm.relation = "直属关系（包含财务管理）";
          } else if ((scraft.manageRelType = 2)) {
            this.ruleForm.relation = "托管关系（不包含财务管理）";
          }
          this.relationId = scraft.manageRelType;
          this.ruleForm.area = scraft.buildingArea;
          this.ruleForm.sellArea = scraft.rentArea;
          this.ruleForm.occupancy = scraft.checkInRate;
          this.ruleForm.officeFee = scraft.officeFeeStand;
          this.ruleForm.businessFee = scraft.busiFeeStand;
          this.ruleForm.expectFee = scraft.monShouldCharge;
          this.ruleForm.actualFee = scraft.monAcctCharge;
          this.ruleForm.monChargeRate = scraft.monChargeRate;
          this.ruleForm.employeNum = scraft.monEmpNum;
        },
        this
      );
    },
    // 获取月报信息
    getMonRep() {
      let data = {
        token: this.$getkey(),
        organId: this.organInfo.guid,
        userId: this.userInfo.guid
        // month: "2018-01"
      };
      this.$ajax(
        `${this.subUrl.activity}/manageMonRep/newManageMonRep`,
        data,
        res => {
          console.log(res, "getMonRep");
          this.tableDataList = res.data.monthRepDtoList;
          this.defaultData = res.data;
          this.ruleForm.month = this.defaultData.month;
          this.ruleForm.organName = this.defaultData.organName;
          this.ruleForm.place = this.defaultData.organAddr;
          this.ruleForm.daterange = [
            this.defaultData.repStartDate,
            this.defaultData.repEndDate
          ];
          for (let i = 0; i < this.tableDataList.length; i++) {
            this.tableDataListCopy.push([]);
          }
          // res.data.workReports.forEach((ele, i) => {
          //   ele.tables.forEach((ele2, j) => {
          //     this.allTables.push(ele2);
          //   });
          // });
          // console.log(this.tableDataList, "tableDataList");
        },
        this
      );
    },

    //el-table时间格式化
    formatTime(row, column) {
      var date = row[column.property];
      if (date) {
        return date.split(" ")[0];
      }
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getMonRep();
    this.getCompany();
    if (this.$route.params.id != 0) {
      this.getScraft();
    }
  }
};
</script>
<style lang="scss" scoped>
.mtable {
  border: 1px solid #ddd;
  .list {
    display: flex;
    align-items: center;
    height: 50px;
    border-bottom: 1px solid #ddd;
    border-left: 1px solid #ddd;
    .list_item {
      flex: 1;
      max-width: 25%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }
  }
  .list:nth-child(odd) {
    background: #e4e4e4;
  }
}

#build_task {
  height: 100%;
  padding-left: 280px;
  padding-right: 20px;
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
.input_out {
  box-sizing: border-box;
  width: 50%;
  float: left;
}
.input_text {
  width: 100%;
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
  padding: 20px;
  background: #fff;
  text-align: center;
  .el-table {
    font-size: 15px;
  }
}
.table_header {
  height: 40px;
  .left {
    float: left;
  }
  .right {
    float: right;
  }
}
.top_header {
  width: 100%;
  position: fixed;
  // top: 80px;
  top: 12px;
  z-index: 99;
  height: 50px;
  background: #fff;
  h4 {
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    i {
      padding: 20px;
    }
  }
}
.tableBox {
  // padding-top: 50px;
}
.newCreateTable {
  background: #fff;
  margin: 20px 0;
  text-align: center;
  .newtitle {
    h4 {
      padding: 5px 20px;
    }
  }
}
</style>