<template>
<div id='inform'>
    <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/pinzhi'}">品质管理</el-breadcrumb-item>
            <el-breadcrumb-item>通知</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="layout" style="padding:10px 10px 0 10px;margin-bottom:50px;height:100%;position:relative;">
          <!-- 筛选条件 -->
    <div class="filtrate">
       <div class="block">
      <!-- <span class="demonstration">筛选条件</span> -->
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
   <el-select style="width:150px" v-model="status"  placeholder="请选择状态" @change="filterStatus" >
    <el-option
      v-for="item in stateList"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <el-select style="width:150px" v-model="status1"  placeholder="请选择通知类型" @change="filterStatus" >
    <el-option
      v-for="item in noitceList"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <el-button @click="print">打印表格</el-button>
  <el-button  style="margin-left:0" @click="turnTo('/manage/inform/build_inform')"><i class="el-icon-plus"></i>&nbsp;新建</el-button>
  </div>
  </div>
  <!-- 表单 -->
<div class="inform_table">
   <el-table
    :data="tableData"
    style="width: 100%"
    border
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
      prop="deptName"
      label="签发部门"
      min-width='12%'
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="noticeTitle"
      label="通知标题"
      show-overflow-tooltip
      min-width='52%'
      >
    </el-table-column>
    <el-table-column
    align="center"
      prop="status"
      label="状态"
      :formatter="formatStatus"
      min-width='12%'
      >
    </el-table-column>
    <el-table-column
    align="center"
      label="操作"
      min-width='12%'
      >
      <template slot-scope="scope">
        <el-button  plain size="small" @click="turnTo('/manage/inform/inform_del/'+scope.row.guid)">详情</el-button>
        <!-- <el-button type="danger" plain size="small">删除</el-button> -->
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
    :style="{height:tableData.length*49+48+'px'}"
    border
    >
      <el-table-column
      align="center"
        prop="createDate"
        label="日期"
        :formatter="formatTime"
        width='250px'
        >
      </el-table-column>
      <el-table-column
      align="center"
        prop="deptName"
        label="签发部门"
        width='250px'
        >
      </el-table-column>
      <el-table-column
      align="center"
        prop="noticeTitle"
        label="通知标题"
        show-overflow-tooltip
        width='614px'
        >
      </el-table-column>
      <el-table-column
      align="center"
        prop="status"
        label="状态"
        :formatter="formatStatus"
        width='250px'
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
      userInfo: {},
      organInfo: {},
      dateValue: "",
      tableData: [],
      status: "",
      status1:0,
      statusId: "",
      noitceList:[{value:0,label:"我的发布"},{value:1,label:"我的接收"}],
      // 固定数据  0,待提交（草稿）；1,待审批；2同意；3，不同意
      stateList: [
        {
          value: "",
          label: "所有状态"
        },
        // {
        //   value: "0",
        //   label: "草稿"
        // },
        {
          value: "1",
          label: "待审批"
        },
        {
          value: "2",
          label: "同意"
        },
        {
          value: "3",
          label: "不同意"
        }
      ]
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
      this.getInform();
    },
    // 筛选状态
    filterStatus(e) {
    	console.log(e,1111)
      
      this.statusId = e;
      this.getInform();
    },

    handleCurrentChange(pageNo) {
      this.getInform(pageNo);
    },
    // 获取通知
    getInform(pageNo) {
      var date1, date2;
      if (this.dateValue) {
        date1 = this.dateValue[0] + " 00:00:00";
        date2 = this.dateValue[1] + " 00:00:00";
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        noticeType:this.status1,
        postType: this.userInfo.postType,
        startDate: date1,
        endDate: date2,
        status: this.status,
        pageSize: "18",
        // keywordOrNo:
        pageNo:pageNo
      };
      console.log(data, "informdata");
      this.$ajax(
        `${this.subUrl.activity}/noticeBill/listNoticeBill`,
        data,
        res => {
          console.log(res, "dept");
          this.tableData = res.data.list;
          this.rowCount = +res.data.rowCount;
        },
        this
      );
    },
    // 过滤状态  0,待提交（草稿）；1,待审批；2同意；3，不同意
    formatStatus(val) {
      //console.log(val)
      if (val.status == 0) {
        return "草稿";
      } else if (val.status == 1) {
        return "待审批";
      } else if (val.status == 2) {
        return "同意";
      } else if (val.status == 3) {
        return "不同意";
      }
    },
    //时间格式化
    formatTime(row, column) {
      var date = row[column.property];
      return date.split(" ")[0];
    }
    
  },
  beforeRouteLeave(to,from,next){
    	console.log('leave...')
    	if(to.name==='inform_del'){
    		from.meta.keepAlive=true;
    	}else{
    		from.meta.keepAlive=false;
    	}
    	next();
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
  padding-left: 260px;
  padding-right: 10px;
  // overflow: scroll;
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
</style>