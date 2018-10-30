<template>
<div id='quality'>
    <div class="title">
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/building'}">楼宇信息</el-breadcrumb-item>
            <el-breadcrumb-item>租户审核</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="layout">
          <!-- 筛选条件 -->
    <div class="filtrate">
       <span class="thisTit">管理员列表</span>
       <div class="block">
        <el-select style="width:150px" v-model="status" placeholder="请选择状态" @change="filterStatus">
            <el-option
            v-for="item in stateList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <el-button @click="print">打印表格</el-button>
        <!-- bug去除新建功能 -->
            <!-- <el-button style="margin-left:0;" class="build_btn" @click="turnTo('/manage/tenant_audit/build_audit')"><i class="el-icon-plus"></i>&nbsp;新建</el-button> -->
        </div>
    </div>
  <!-- 表单 -->
<div class="inform_table">
   <el-table
    :data="tableData"
    :height="mHeight"
    border
    >
    <el-table-column
      header-align="center"
      label="位置"
      min-width="45%"
      >
       <template slot-scope="scope">
      <div v-if="scope.row.userInfo">{{scope.row.userInfo.buildingName}}{{scope.row.userInfo.ridName}}{{scope.row.userInfo.unitName}}</div>
      <div v-else>无</div>    
    </template>
    </el-table-column>
    <el-table-column
      header-align="center"
      label="管理员账号"
      min-width="25%"
      >
      <template slot-scope="scope">
        <div v-if="scope.row.userInfo">{{scope.row.userInfo.account}}</div>
        <div v-else>无</div>
      </template>
    </el-table-column>
    <el-table-column
    header-align="center"
    prop="authenStatus"
    label="状态"
    :formatter="filterType"
    min-width="15%"
      >
       <!-- <template slot-scope="scope">
         <div>{{scope.row.type}}</div>
         <span class="emerType">类型:【{{scope.row.typeName}}】</span>
      </template> -->
    </el-table-column>
    <el-table-column
    header-align="center"
      label="操作"
      min-width="15%"
      >
      <template slot-scope="scope">
        <el-button v-if="scope.row.authenStatus==1||scope.row.authenStatus==2"  plain size="small" @click="turnTo('/manage/tenant_audit/audit_del/'+scope.row.guid)">详情</el-button>
        <el-button v-if="scope.row.authenStatus==0" type="primary" size="small" @click="turnTo('/manage/tenant_audit/audit_del/'+scope.row.guid)">审核</el-button>
        <!-- <el-button type="danger" plain size="small">编辑</el-button> -->
      </template>
    </el-table-column>
  </el-table>
 </div>

 <el-pagination  
    v-if="rowCount"
    background
    style="float:right;"
    @current-change="handleCurrentChange"
    layout="prev, pager, next"
    :page-size="12"
    :total="rowCount">
</el-pagination>
  <div  id="printcode" v-show="print1">
    <el-table
    :data="tableData"
    :style="{height:tableData.length*49+48+'px'}"
    border
    >
      <el-table-column
        align="center"
        label="位置"
        width="763px"
        >
        <template slot-scope="scope">
        <div v-if="scope.row.userInfo">{{scope.row.userInfo.buildingName}}{{scope.row.userInfo.ridName}}{{scope.row.userInfo.unitName}}</div>
        <div v-else>无</div>    
      </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="管理员账号"
        width="400px"
        >
        <template slot-scope="scope">
          <div v-if="scope.row.userInfo">{{scope.row.userInfo.account}}</div>
          <div v-else>无</div>
        </template>
      </el-table-column>
      <el-table-column
      align="center"
      prop="authenStatus"
      label="状态"
      :formatter="filterType"
      width="200px"
        >
        <!-- <template slot-scope="scope">
          <div>{{scope.row.type}}</div>
          <span class="emerType">类型:【{{scope.row.typeName}}】</span>
        </template> -->
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
      userInfo: {},
      organInfo: {},
      tableData: [],
      status: "",
      statusId: "",
      // 固定数据   0：待审核 1：已通过 2：驳回
      stateList: [
        {
          value: "",
          label: "所有状态"
        },
        {
          value: "0",
          label: "待审核"
        },
        {
          value: "1",
          label: "已通过"
        },
        {
          value: "2",
          label: "驳回"
        }
      ]
    };
  },
  methods: {
    //打印
    print() {
      this.$getPrint();
    },
    turnTo(e) {
      this.$router.push(e);
    },
    // 筛选状态
    filterStatus(e) {
      this.statusId = e;
      console.log(e, "statusId");
      this.getList();
    },
    // 筛选type
    filterType(e) {
      if (e.authenStatus == 0) {
        return "待审核";
      } else if (e.authenStatus == 1) {
        return "已通过";
      } else if (e.authenStatus == 2) {
        return "驳回";
      }
    },
    handleCurrentChange(pageNo) {
      this.getList(pageNo);
    },

    // 获取列表
    getList(pageNo) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        stasus: this.statusId,
        // keyword:"",
        pageNo: pageNo,
        pageSize: "18"
      };
      console.log(data, "data");
      this.$ajax(
        `${this.subUrl.user}/tenantAudit/getTenantAudit`,
        data,
        res => {
          console.log(res, "getList");

          this.tableData = res.data.list;
          this.rowCount = +res.data.rowCount;
        },
        this
      );
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
    this.getList();
  }
};
</script>
<style lang="scss" scoped>
#quality {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: scroll;
}
.layout {
  position: relative;
  // padding-top: 20px;
  padding-bottom: 200px;
}
.filtrate {
  width: 100%;
  height: 60px;
  background: #fff;
  line-height: 60px;
  padding-left: 20px;
  .thisTit {
    padding-left: 50px;
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
.inform_table {
  text-align: center;
}
// emerType
.emerType {
  color: #888;
}
</style>