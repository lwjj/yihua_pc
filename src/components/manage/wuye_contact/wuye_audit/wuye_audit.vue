<template>
<div id='inform'>
    <div class="layout">
          <!-- 筛选条件 -->
    <div class="filtrate">
    <div class="block">
        <el-date-picker
        style="width:250px"
        v-model="dateValue"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="filterDate" >
      </el-date-picker>
      <el-select style="width:150px" v-model="status"  placeholder="全部状态" @change="filterStatus" >
        <el-option
          v-for="item in stateList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <!-- <el-button class="build_btn" @click="turnTo('/manage/wuye_contact/rela_manage/build_rela')"><i class="el-icon-plus"></i>&nbsp;新建</el-button> -->
      </div>
  </div>
  <!-- 表单 -->
<div class="inform_table">
   <el-table
    :data="tableData"
    border
    :height="mHeight"             
    >
    <el-table-column
    header-align="center"
      prop="createDate"
      label="日期"
      :formatter="formatTime"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
    prop="title"
      label="标题"
      >
      <!-- <template slot-scope="scope"> 
        <div>{{scope.row.noticeContent}}</div>
        <div style="color:#888;">【关键词】{{scope.row.keyword}}</div>
      </template> -->
    </el-table-column>
    <el-table-column
    header-align="center"
    prop="guid"
      label="编号"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="status"
      label="状态"
      :formatter="formatStatus"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      label="操作"
      >
      <template slot-scope="scope"> 
        <el-button type="primary" plain size="small" @click="turnTo('/manage/wuye_contact/wuye_audit/audit_del/'+scope.row.guid)">详情</el-button>
        <!-- <el-button type="danger" plain size="small">删除</el-button> -->
      </template>
    </el-table-column>
  </el-table>
 </div>
<el-pagination
  v-if="rowCount"
  class="page"
  background
    style="text-align:right;"
   @current-change="handleCurrentChange"
  layout="prev, pager, next"
  :page-size="12"
  :total="rowCount">
</el-pagination>

</div>
</div>
</template>
<script>
export default {
  data() {
    this.mHeight = tableHeight-61; // 定义的 window.tableHeight

    return {
      status: "",
      statusId: "",
      rowCount: "",
      userInfo: {},
      organInfo: {},
      dateValue: "",
      tableData: [],
      // 固定数据  状态(0：草稿，1：已下发，2：已回复，3：关闭,4：未读，5：待回复)
      stateList: [
        {
          value: "",
          label: "全部状态"
        },
        {
          value: "4",
          label: "未阅"
        },
        {
          value: "5",
          label: "待回复"
        },
        {
          value: "2",
          label: "已回复"
        }
      ]
    };
  },
  methods: {
    turnTo(e) {
      this.$router.push(e);
    },
    // 筛选状态
    filterStatus(e) {
      this.statusId = e;
      this.getInform();
    },
    // 筛选日期
    filterDate() {
      this.getInform();
    },
    // 下一页
    handleCurrentChange(pageNo) {
      this.getInform(pageNo);
    },

    // 获取
    getInform(pageNo) {
      let date1, date2;
      if (this.dateValue) {
        date1 = this.dateValue[0] + " 00:00:00";
        date2 = this.dateValue[1] + " 00:00:00";
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        organType: this.organInfo.organType,
        status: this.statusId,
        startDate: date1,
        endDate: date2,
        pageSize: "12",
        pageNo: pageNo
      };
      this.$ajax(
        `${this.subUrl.activity}/propertyExamine/listProExamine`,
        data,
        res => {
          console.log(res, "getInform");
          this.tableData = res.data.list;
          this.rowCount = +res.data.rowCount;
        },
        this
      );
    },
    // 过滤状态0：草稿，1：已下发，2：已回复，3：关闭,4：未读，5：待回复
    formatStatus(val) {
      if (val.status == 1) {
        return "已下发";
      } else if (val.status == 2) {
        return "已回复";
      } else if (val.status == 3) {
        return "关闭";
      } else if (val.status == 4) {
        return "未阅";
      } else if (val.status == 5) {
        return "待回复";
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
    this.getInform();
  }
};
</script>
<style lang="scss" scoped>
#inform {
  height: 100%;
}
.layout {
  position: relative;
}
.filtrate {
  width: 100%;
  height: 60px;
  background: #fff;
  line-height: 60px;
  padding-left: 20px;
  border-top: 1px solid #ccc;

  .tips {
    position: absolute;
    left: 50px;
  }
}
.block {
  float: right;
  margin-right: 10px;
  display: inline-block;
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
</style>