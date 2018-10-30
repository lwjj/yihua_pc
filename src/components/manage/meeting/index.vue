<template>
<div id='subTemplate'>
    <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/pinzhi'}">品质管理</el-breadcrumb-item>
            <el-breadcrumb-item>会议纪要</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="layout" style="padding:10px 10px 0 10px;margin-bottom:50px;height:100%;position:relative;">
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
         @change="filterDate" 
        >
      </el-date-picker>

  <!-- <el-input placeholder="搜索会议主题" v-model="meetingTopic" class="input-with-select" style="width:200px">
    <el-button @click="filterMeet" slot="append" icon="el-icon-search"></el-button>
  </el-input> -->
    <el-input
    style="width:150px"
    placeholder="搜索会议主题"
    suffix-icon="el-icon-search"
    v-model="meetingTopic"
    @keyup.native="filterMeet">
  </el-input>
  <el-button @click="print">打印表格</el-button>
  <el-button  style="margin-left:0" v-if="showBuild" @click="turnTo('/manage/meeting/build_meet')"><i class="el-icon-plus"></i>&nbsp;新建</el-button>
  </div>
  </div>
  <!-- 表单 -->
<div class="inform_table">
   <el-table
    :data="tableData"
    border 
    style="width: 100%"
     :height="mHeight"
    >
    <el-table-column
      align="center"
      prop="createDate"
      label="日期"
      :formatter="formatTime"
      min-width='12%'
      >
    </el-table-column>
    <el-table-column
      align="center"
      prop="recorderName"
      label="记录人"
      min-width='18%'
      >
    </el-table-column>
    <el-table-column
      prop="scopeName"
      label="范围"
      show-overflow-tooltip
      min-width='32%'
      >
    </el-table-column>
    <el-table-column
      prop="meetingTopic"
      label="会议议题"
      min-width='28%'
      show-overflow-tooltip
      >
    </el-table-column>
    <el-table-column
      align="center"
      label="操作"
      min-width='10%'
      >
      <template slot-scope="scope"> 
        <el-button plain size="small" @click="turnTo('/manage/meeting/meet_del/'+scope.row.guid)">详情</el-button>
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
    :data="tableData"
    border 
    :style="{height:tableData.length*49+48+'px'}"
    >
      <el-table-column
        align="center"
        prop="createDate"
        label="日期"
        :formatter="formatTime"
        width='220px'
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="recorderName"
        label="记录人"
        width='220px'
        >
      </el-table-column>
      <el-table-column
      align="center"
        prop="scopeName"
        label="范围"
        show-overflow-tooltip
        width='414px'
        >
      </el-table-column>
      <el-table-column
      align="center"
        prop="meetingTopic"
        label="会议议题"
        width='510px'
        show-overflow-tooltip
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
    this.mHeight = Number(this.$getClientHeight()) - 200;

    return {
      print1:false,
      rowCount: "",
      showBuild: false,
      meetingTopic: "",
      userInfo: {},
      organInfo: {},
      dateValue: "",
      tableData: []
    };
  },
  methods: {
    //打印
    print(){
      this.$getPrint();
    },
    turnTo(e) {
      this.$router.push(e);
    },
    // 筛选日期
    filterDate() {
      this.getMeet();
    },
    // 筛选类型
    filterMeet() {
      this.getMeet();
    },

    handleCurrentChange(pageNo) {
      this.getMeet(pageNo);
    },
    //获取列表
    getMeet(pageNo) {
      var date1, date2;
      if (this.dateValue) {
        date1 = this.dateValue[0] + " 00:00:00";
        date2 = this.dateValue[1] + " 00:00:00";
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        startDate: date1,
        endDate: date2,
        meetingTopic: this.meetingTopic,
        pageNo: pageNo,
        pageSize: "18"
      };
      console.log(data, "meetdata");
      this.$ajax(
        `${this.subUrl.activity}/meetingSummary/listMeetSummyBill`,
        data,
        res => {
          console.log(res, "meet");
          this.tableData = res.data.list;
          this.rowCount = +res.data.rowCount;
          console.log(this.rowCount, "rowcount");
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
    this.getMeet();
    this.$getRoot(res => {
      this.rootList = res;
      console.log(res, "Nihao");
      for (var a of this.rootList.propertyManagement.subclass) {
        if (a.name == "品质管理") {
          for (var b of a.subclass) {
            if (b.name == "会议纪要") {
              if (b.subclass.length > 0) {
                this.showBuild = true;
              }
            }
          }
        }
      }
    }, this);
  }
};
</script>
<style lang="scss" scoped>
#subTemplate {
  overflow: hidden;
}
.layout {
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
.block {
  float: right;
  margin-right: 10px;
  display: block;
  .el-range-editor.el-input__inner {
    padding: 0 10px;
  }
}
// 表格
.workType {
  color: #888;
}
</style>