<template>
<div id='work_report'>
    <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/work'}">工作管理</el-breadcrumb-item>
            <el-breadcrumb-item>工作例报</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="layout" style="padding:10px 10px 0 10px;margin-bottom:50px;height:100%;position:relative;">
          <!-- 筛选条件 -->
    <div class="filtrate">
      <!-- menu切换 -->
      <el-menu :default-active="activeIndex" 
      class="el-menu-demo"
       mode="horizontal" 
       active-text-color="#1e82d2" 
       @select="filterwrType">
        <el-menu-item index="1" v-if='userInfo.postType >=3'>向上汇报</el-menu-item>
        <el-menu-item index="2" v-if='userInfo.postType <=3'>审批下属</el-menu-item>
      </el-menu>
       <div class="block">
      <!-- <span class="demonstration">筛选条件</span> -->
      <el-date-picker
        style="width:300px"
        v-model="dateValue"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期" 
         @change="filterDate" 
        >
      </el-date-picker>
   <el-select style="width:120px" v-model="workType" placeholder="请选择类型" @change="filterworkType">
    <el-option
      v-for="item in workTypeList"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
   <el-select style="width:120px" v-model="status" placeholder="请选择状态" @change="filterStatus">
    <el-option
      v-for="item in stateList"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <!-- <el-button class="build_btn" @click="turnTo('/manage/work_report/build_work')"><i class="el-icon-plus"></i>&nbsp;新建</el-button> -->
  <el-button @click="print">打印表格</el-button>
  <el-dropdown v-if="userInfo.postType >= 3" trigger="click" @command="handleCommand">
  <el-button><i class="el-icon-plus"></i>&nbsp;新建</el-button>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item  command="/manage/work_report/build_day/0">新建日报</el-dropdown-item>
    <el-dropdown-item  command="/manage/work_report/build_week/0">新建周报</el-dropdown-item>
    <el-dropdown-item  command="/manage/work_report/build_month/0">新建月报</el-dropdown-item>
    <el-dropdown-item  command="/manage/work_report/build_year/0">新建年报</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
  </div>
  </div>
  <!-- 表单 -->
<div class="inform_table">
   <el-table
   border
   style="width: 100%"
    :data="tableData"
    :height="mHeight"
    >
    <el-table-column
    header-align="center"
      prop="reportTime"
      label="日期"
      :formatter="formatTime"
        min-width="15%"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="title"
      label="标题"
       show-overflow-tooltip 
         min-width="35%"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="userName"
      label="汇报人"
       show-overflow-tooltip 
         min-width="20%"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
     prop="type"
      label="类型"
      :formatter="formatType"
        min-width="10%"
      >
       <!-- <template slot-scope="scope">
         <div>{{scope.row.occurDate}}</div>
         <span class="workType">类型:【{{scope.row.typeName}}】</span>
      </template> -->
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="status"
      label="状态"
       :formatter="formatStatus"
         min-width="10%"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      label="操作"
       min-width="20%"
       fixed="right"
      >
      <template slot-scope="scope">
        <el-button v-show="scope.row.status==0||scope.row.status==1" plain size="small" @click="turnTo('/manage/work_report/report_del/'+scope.row.guid)">详情</el-button>
        <el-button v-show="wrTypeId == 1 && scope.row.status == 0" type="danger" plain size="small" @click="deleteItem(scope)">删除</el-button>
        <el-button  v-show="scope.row.status==2&&scope.row.type==1"  plain size="small" @click="turnTo('/manage/work_report/build_day/'+scope.row.guid)">编辑</el-button>
        <el-button  v-show="scope.row.status==2&&scope.row.type==2"  plain size="small" @click="turnTo('/manage/work_report/build_week/'+scope.row.guid)">编辑</el-button>
        <el-button  v-show="scope.row.status==2&&scope.row.type==3"  plain size="small" @click="turnTo('/manage/work_report/build_month/'+scope.row.guid)">编辑</el-button>
        <el-button  v-show="scope.row.status==2&&scope.row.type==4"  plain size="small" @click="turnTo('/manage/work_report/build_year/'+scope.row.guid)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
 </div>
  <el-pagination
  v-if="rowCount"
  class="page"
  background
  style="position:absolute;right:20px;bottom:10px;padding:2px 5px;"
   @current-change="handleCurrentChange"
  layout="prev, pager, next"
  :page-size="18"
  :total="rowCount">
</el-pagination>
<div id="printcode" v-show="print1">
   <el-table
   border
    :style="{height:tableData.length*49+48+'px'}"
    :data="tableData"
    >
    <el-table-column
    align="center"
      prop="reportTime"
      label="日期"
      :formatter="formatTime"
        width="160px"
      >
    </el-table-column>
    <el-table-column
    align="center"
      prop="title"
      label="标题"
       show-overflow-tooltip 
       width="640px"
      >
    </el-table-column>
    <el-table-column
    align="center"
      prop="userName"
      label="汇报人"
       show-overflow-tooltip 
         width="244px"
      >
    </el-table-column>
    <el-table-column
    align="center"
     prop="type"
      label="类型"
      :formatter="formatType"
      width="160px"
      >
       <!-- <template slot-scope="scope">
         <div>{{scope.row.occurDate}}</div>
         <span class="workType">类型:【{{scope.row.typeName}}】</span>
      </template> -->
    </el-table-column>
    <el-table-column
    align="center"
      prop="status"
      label="状态"
       :formatter="formatStatus"
       width="160px"
      >
    </el-table-column>
  </el-table>
</div>

</div>
</div>
</template>
<script>
export default {
  data() {
    // this.mHeight = Number(this.$getClientHeight()) - 200;
    this.mHeight = tableHeight; // 定义的 window.tableHeight
    return {
      print1: false,
      rowCount: "",
      activeIndex: "1",
      userInfo: {},
      organInfo: {},
      dateValue: "",
      tableData: [],
      workTypeList: [
        {
          value: "",
          label: "所有类型"
        },
        {
          value: "1",
          label: "日报"
        },
        {
          value: "2",
          label: "周报"
        },
        {
          value: "3",
          label: "月报"
        },
        {
          value: "4",
          label: "年报"
        }
      ],
      workType: "",
      workId: "",
      wrTypeId: "1",
      status: "",
      statusId: "",
      // 固定数据  0：未阅 1：已阅 2：草稿
      stateList: [
        {
          value: "",
          label: "所有状态"
        },
        {
          value: "0",
          label: "未阅"
        },
        {
          value: "1",
          label: "已阅"
        },
        {
          value: "2",
          label: "草稿"
        }
      ]
    };
  },
  methods: {
    deleteItem({ row, index }) {
      let txt = "";
      console.log(row.type);
      switch (row.type) {
        case 1:
          txt = "日报";
          break;
        case 2:
          txt = "周报";
          break;
        case 3:
          txt = "月报";
          break;
        case 4:
          txt = "年报";
          break;
      }
      this.$confirm("是否删除当前" + txt, "提示", { type: "warning" })
        .then(() => {
          let data = {
            token: this.$getkey(),
            reportId: row.guid
          };
          this.$ajax(
            `${this.subUrl.activity}/workbench/workReport/myReport/delReport`,
            data,
            res => {
              this.$message.success("删除成功");
              this.getwork();
            },
            this
          );
        })
        .catch(() => {});
    },
    //打印
    print() {
      this.$getPrint();
    },
    turnTo(e) {
      if (this.wrTypeId == 2) {
        e += "?type=1";
      }
      this.$router.push(e);
    },
    handleCommand(command) {
      this.turnTo(command);
    },
    // 筛选日期
    filterDate() {
      this.getwork();
    },
    // 筛选状态
    filterStatus(e) {
      this.statusId = e;
      this.getwork();
    },
    // 筛选类型
    filterworkType(e) {
      this.workId = e;
      this.getwork();
    },
    //汇报类型
    filterwrType(e) {
      if (e == 1) {
        this.wrTypeId = "1";
      } else {
        this.wrTypeId = "2";
      }
      this.getwork();
    },
    // 下一页
    handleCurrentChange(pageNo) {
      this.getwork(pageNo);
    },
    //获取工作例报
    getwork(pageNo) {
      var date1, date2;
      if (this.dateValue) {
        date1 = this.dateValue[0] + " 00:00:00";
        date2 = this.dateValue[1] + " 00:00:00";
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        wrType: this.wrTypeId,
        deptId: "",
        startDate: date1,
        endDate: date2,
        status: this.statusId,
        type: this.workId,
        pageSize: "18",
        pageNo: pageNo
      };
      console.log(data, "workdata");
      this.$ajax(
        `${this.subUrl.activity}/workbench/workReport/myReport/getWorkReport`,
        data,
        res => {
          console.log(res, "work");
          this.tableData = res.data.list;
          this.rowCount = +res.data.rowCount;
        },
        this
      );
    },
    // 过滤状态
    formatStatus(val) {
      //console.log(val)
      if (val.status == 0) {
        return "未阅";
      } else if (val.status == 1) {
        return "已阅";
      } else if (val.status == 2) {
        return "草稿";
      }
    },
    // 过滤类型
    formatType(val) {
      //console.log(val)
      if (val.type == 1) {
        return "日报";
      } else if (val.type == 2) {
        return "周报";
      } else if (val.type == 3) {
        return "月报";
      } else if (val.type == 4) {
        return "年报";
      }
    },
    //时间格式化
    formatTime(row, column) {
      var date = row[column.property];
      return date.split(" ")[0];
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    if (this.userInfo.postType == 2) {
      this.wrTypeId = 2;
    }
    console.log(this.userInfo);
    console.log(this.organInfo);
    //this.getworkType()
    this.getwork();
  }
};
</script>
<style lang="scss" scoped>
#work_report {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: scroll;
}
.layout {
  // position: relative;
  // padding-top: 20px;
  padding-bottom: 200px;
}
.filtrate {
  width: 100%;
  height: 60px;
  background: #fff;
  line-height: 60px;
  padding-left: 20px;
  .el-menu {
    background: #fff;
    float: left;
  }
}
//tab 切换
.el-menu-item {
  font-size: 16px;
  font-weight: 700;
}
.block {
  float: right;
  margin-right: 10px;
  display: block;
  .el-range-editor.el-input__inner {
    padding: 0 10px;
  }
}
.build_btn {
  float: right;
  margin: 12px 30px;
}
// 表格
.inform_table {
  text-align: center;
}
// workType
.workType {
  color: #888;
}
// 编辑按钮
.el-button + .el-button {
  margin-left: 0px;
}
.page {
  text-align: right;
}
</style>