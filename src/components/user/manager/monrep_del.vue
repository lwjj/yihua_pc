<template>
<!-- -->
<div class="totalContent" >
    <div id='build_task'  v-show="!showDetail && !showPlan">
    <div class="title">
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item @click.native="$router.replace('/wuye/manage')">物业管理</el-breadcrumb-item>
            <el-breadcrumb-item @click.native="$router.go(-1)">项目月报</el-breadcrumb-item>
            <el-breadcrumb-item>项目月报详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container"  v-show="show">
    <!-- 输入表单 -->
       <el-form label-width="190px" class="demo-ruleForm clearfix">
            <el-form-item label="项目名称：" class="input_out">
                <div v-text="delData.projectName"></div>
            </el-form-item>
             <el-form-item label="汇报周期：" class="input_out">
                 <div v-text="delData.repStartDate+' 至 '+delData.repEndDate"></div>
            </el-form-item>
            <el-form-item label="月份：" class="input_out">
                <div v-text="delData.month+'月'"></div>
            </el-form-item>
             <el-form-item label="地址：" class="input_out">
                <div v-text="delData.organAddr"></div>
            </el-form-item>
             <el-form-item label="管理关系：" class="input_out">
                  <div v-text="delData.manageRelType==1?'直属关系（包含财务管理）':'托管关系（不包含财务管理）'"></div>
                  <!-- <div v-if="delData.manageRelType==1">直属关系（包含财务管理）</div>
                  <div v-if="delData.manageRelType==2">托管关系（不包含财务管理）</div> -->
            </el-form-item>
             <el-form-item label="建筑面积(平米)：" class="input_out">
                  <div v-text="delData.buildingArea"></div>
            </el-form-item>
             <el-form-item label="已出租面积(平米)：" class="input_out">
                  <div v-text="delData.rentArea"></div>
            </el-form-item>
             <el-form-item label="入住率(%)：" class="input_out">
                  <div v-text="delData.checkInRate"></div>
            </el-form-item>
             <el-form-item label="办公收费标准(元/平米)：" class="input_out">
              <div v-text="delData.officeFeeStand"></div>
            </el-form-item>
             <el-form-item label="商业收费标准(元/平米)：" class="input_out">
              <div v-text="delData.busiFeeStand"></div>
            </el-form-item>
             <el-form-item label="当月应收管理费：" class="input_out">
                  <div v-text="delData.monShouldCharge"></div>
            </el-form-item>
             <el-form-item label="当月实收管理费：" class="input_out">
                  <div v-text="delData.monAcctCharge"></div>
            </el-form-item>
             <el-form-item label="当月收缴率：" class="input_out">
                  <div v-text="delData.monChargeRate"></div>
            </el-form-item>
             <el-form-item label="当月员工数：" class="input_out">
                  <div v-text="delData.monEmpNum"></div>
            </el-form-item>
       </el-form>

<!-- 重大事项 -->
  <div class="important">
      <h4>月报明细</h4>
      <!-- 表格 --> 
    <div class="inform_table" v-for="(item,index) in tableDataList" :key="index">
      <div class="table_header">
          <div class="left"> {{index+1}})&nbsp;{{item.deptName}}</div>  
          <div class="right">
              <el-button size="small" @click="transformMingxi(item.tableList)">明细管理</el-button>
              <el-button size="small" @click="transformMingxi1(item.taskListDto)">下月计划</el-button>
          </div>
      </div>
    <el-table
      :data="item.reportDetailList"
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
        prop="workContent"
        >
      </el-table-column>
      <el-table-column
      header-align="center"
        label="工作措施"
        prop="workMeasure"
        >
      </el-table-column>
      <el-table-column
      header-align="center"
        label="开始时间"
        prop="startTime"
        :formatter="formatTime"
        >
      </el-table-column>
      <el-table-column
      header-align="center"
        label="截至时间"
        prop="endTime"
        :formatter="formatTime"
        >
      </el-table-column>
      <el-table-column
      header-align="center"
        label="责任人"
        prop="executorName"
        >
      </el-table-column>
      <el-table-column
      header-align="center"
        label="进度结论(%)"
        prop="progress"
        >
      </el-table-column>
    </el-table>
  </div>
  </div>
</div>
<div class="tableBox" v-if="showMingxi">
    <div class="top_header">
        <h4 class="floatL"><i @click="mingxiBack" class="el-icon-d-arrow-left"></i>明细说明</h4>
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
                <div v-text="scope.row[keyArr[index1]]"></div>
            </template>
          </el-table-column>
        </el-table>  
    </div>
  </div>
</div>
</div>
  <detail v-if="showDetail" :detailData='detailData' @back='mback'></detail>
  <nextPlan v-if="showPlan" :detailData='detailData' @mback='mback'></nextPlan> 
</div>

</template> 
<script>
import detail from "./emptyDetail";
import nextPlan from "./next_plan";
export default {
  components: {
    detail,
    nextPlan
  },
  data() {
    return {
      delData: [],
      showPlan: false,
      mingxi: [],
      show: true,
      showMingxi: false,
      index: "",
      userInfo: "",
      organInfo: "",
      tableDataList: [],
      MingxiDataList: [],
      relationId: "",
      reportOrganId: "",
      showDetail: false,
      keyArr: [
        "header0",
        "header1",
        "header2",
        "header3",
        "header4",
        "header5",
        "header6",
        "header7",
        "header8",
        "header9",
        "header10"
      ]
    };
  },
  methods: {
    mback() {
      console.log(11);
      this.showDetail = false;
      this.showPlan = false;
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
    // 转化明细数据
    transformMingxi(tables) {
      console.log(tables);
      this.detailData = tables;
      this.showDetail = true;
      console.log(tables, "tables");
      // this.show = false;
      // this.showMingxi = true;
    },
    transformMingxi1(taskListDto) {
      console.log(taskListDto);
      this.detailData = taskListDto;
      this.showPlan = true;
    },
    // 获取月报信息
    getMonRep() {
      let data = {
        token: this.$getkey(),
        organId: this.organInfo.guid,
        month: "2018-01"
      };
      this.$ajax(
        `${this.subUrl.activity}/manageMonRep/newManageMonRep`,
        data,
        res => {
          console.log(res, "getMonRep");
          this.tableDataList = res.data.monthRepDtoList;
        },
        this
      );
    },
    // 获取月报详情
    getMonRepDel() {
      let data = {
        token: this.$getkey(),
        // userId: this.userInfo.guid,
        monthRepId: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.activity}/manageMonRep/getMonthRepDetail`,
        data,
        res => {
          console.log(res, "getMonRepDel");
          this.delData = res.data;
          this.tableDataList = res.data.monthRepDtoList;
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
    // this.getMonRep();
    this.getMonRepDel();
  }
};
</script>
<style lang="scss" scoped>
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
.totalContent {
  overflow: scroll;
  height: 100%;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
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
  top: 80px;
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
  padding-top: 50px;
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