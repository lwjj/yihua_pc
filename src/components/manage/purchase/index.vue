<template>
<div id='subTemplate'>
    <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/work'}">工作管理</el-breadcrumb-item>
            <el-breadcrumb-item>采购销售</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="layout" style="padding:10px 10px 0 10px;margin-bottom:50px;height:100%;position:relative;">
          <!-- 筛选条件 -->
    <div class="filtrate">
       <div class="block">
      <!-- <span class="demonstration">筛选条件</span> -->
      <el-date-picker
        style="width:300px"
        v-model="dateValue"
        type="daterange"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期" 
         @change="filterDate" 
        >
      </el-date-picker>
   <el-select style="width:120px" v-model="type" placeholder="请选择类型" @change="filterType">
    <el-option
      v-for="item in typeList"
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
  <!-- 经理才有新建 -->
  <el-button @click="print">打印表格</el-button>
  <el-button style="margin-left:0;" v-if="userInfo.postType==3" @click="turnTo('/manage/purchase/build_pur')"><i class="el-icon-plus"></i>&nbsp;新建</el-button>
  </div>
  </div>
  <!-- 表单 -->
<div class="inform_table">
  
   <el-table
   border
    :data="tableData"
    style="width: 100%"
     :height="mHeight"
    >
    <el-table-column
    header-align="center"
      prop="guid"
      label="编号"
        min-width="18%"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="createTime"
      label="日期"
       :formatter="formatTime"
         min-width="12%"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="userInfo.deptName"
      label="部门"
        min-width="12%"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      label="通知"
    show-overflow-tooltip 
      min-width="40%"
      >
       <template slot-scope="scope">
         <span class="purType" v-if="scope.row.type==1">【采购】</span>
         <span class="purType" v-if="scope.row.type==2">【供应】</span>
         <span>{{scope.row.detail}}</span>
      </template>
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="status"
      label="状态"
       :formatter="formatStatus"
         min-width="9%"
      >
    </el-table-column>
    <el-table-column
        header-align="center"
        label="操作"
        min-width="20%"
        fixed="right"
      >
      <template slot-scope="scope">
        <el-button  plain size="small" @click="turnTo('/manage/purchase/pur_del/'+scope.row.guid)">详情</el-button>
        <el-button type="danger" v-if="scope.row.status == 3" plain size="small" @click="deleteItem(scope)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
 </div>

 <el-pagination  
      v-if="rowCount"
      background
    style="position:absolute;right:20px;bottom:10px;padding:2px 5px;"
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :page-size="12"
      :total="rowCount">
  </el-pagination>
<div id="printcode" v-show="print1">
  
   <el-table
   border
    :data="tableData"
    :style="{height:tableData.length*49+48+'px'}"
    >
    <el-table-column
    align="center"
      prop="guid"
      label="编号"
      width="180px"
      >
    </el-table-column>
    <el-table-column
    align="center"
      prop="createTime"
      label="日期"
       :formatter="formatTime"
      width="180px"
      >
    </el-table-column>
    <el-table-column
    align="center"
      prop="userInfo.deptName"
      label="部门"
      width="180px"
      >
    </el-table-column>
    <el-table-column
    align="center"
      label="通知"
    show-overflow-tooltip 
     width="643px"
      >
       <template slot-scope="scope">
         <span class="purType" v-if="scope.row.type==1">【采购】</span>
         <span class="purType" v-if="scope.row.type==2">【供应】</span>
         <span>{{scope.row.detail}}</span>
      </template>
    </el-table-column>
    <el-table-column
    align="center"
      prop="status"
      label="状态"
      :formatter="formatStatus"
      width="180px"
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
    this.mHeight = tableHeight; // 定义的 window.tableHeight
    return {
      rowCount: "",
      print1: false,
      activeIndex: "1",
      userInfo: {},
      organInfo: {},
      dateValue: "",
      tableData: [],
      type: "",
      typeId: "",
      aaTypeId: "1",
      status: "",
      statusId: "",

      typeList: [
        {
          value: "",
          label: "所有状态"
        },
        {
          value: "1",
          label: "采购"
        },
        {
          value: "2",
          label: "供应"
        }
      ],

      // 固定数据  状态 0:关闭, 1:完成, 2:草稿 3:待审批 4:同意 5:不同意
      stateList: [
        {
          value: "",
          label: "所有状态"
        },
        {
          value: "0",
          label: "关闭"
        },
        {
          value: "1",
          label: "完成"
        },
        {
          value: "2",
          label: "草稿"
        },
        {
          value: "3",
          label: "待审批"
        },
        {
          value: "4",
          label: "同意"
        },
        {
          value: "5",
          label: "不同意"
        }
      ]
    };
  },
  methods: {
    deleteItem({ row, index }) {
      this.$confirm("是否删除当前采购销售", "提示", { type: "warning" })
        .then(() => {
          let data = {
            token: this.$getkey(),
            pasaId: row.guid
          };
          this.$ajax(
            `${this.subUrl.activity}/pasa/del`,
            data,
            res => {
              this.$message.success("删除成功");
              this.getList();
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
      this.$router.push(e);
    },
    // 筛选日期
    filterDate() {
      this.getList();
    },
    // 筛选状态 状态 0:关闭, 1:完成, 2:草稿 3:待审批 4:同意 5:不同意
    filterStatus(e) {
      this.statusId = e;
      this.getList();
    },
    // 筛选类型  申请类型 1采购，2供应
    filterType(e) {
      this.typeId = e;
      this.getList();
    },
    handleCurrentChange(pageNo) {
      this.getList(pageNo);
    },

    // 获取事件
    getList(pageNo) {
      var date1, date2;
      if (this.dateValue) {
        date1 = this.dateValue[0] + " 00:00:00";
        date2 = this.dateValue[1] + " 00:00:00";
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        aaType: this.aaTypeId,
        startDate: date1,
        endDate: date2,
        type: this.typeId,
        status: this.statusId,
        deptId: "",
        keyword: "",
        pageNo: pageNo,
        pageSize: "18"
      };
      console.log(data, "data");
      this.$ajax(
        `${this.subUrl.activity}/pasa/pasaList`,
        data,
        res => {
          console.log(res, "getList");
          this.tableData = res.data.list;
          this.rowCount = +res.data.rowCount;
        },
        this
      );
    },
    // 过滤状态   状态 0:关闭, 1:完成, 2:草稿 3:待审批 4:同意 5:不同意 ,
    formatStatus(val) {
      //console.log(val)
      if (val.status == 0) {
        return "关闭";
      } else if (val.status == 1) {
        return "完成";
      } else if (val.status == 2) {
        return "草稿";
      } else if (val.status == 3) {
        return "待审批";
      } else if (val.status == 4) {
        return "同意";
      } else if (val.status == 5) {
        return "不同意";
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
    console.log(this.userInfo);
    console.log(this.organInfo);
    //类型 1：汇报，2：审批
    if (this.userInfo.postType == 2) {
      this.aaTypeId = 2;
    } else if (this.userInfo.postType == 3) {
      this.aaTypeId = 1;
    }
    //    this.getListType()
    this.getList();
  }
};
</script>
<style lang="scss" scoped>
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
// 表格
.inform_table {
  text-align: center;
}
</style>