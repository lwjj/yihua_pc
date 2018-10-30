<template>
  <div id='emergency'>
    <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{path: '/manage/pinzhi'}">品质管理</el-breadcrumb-item>
          <el-breadcrumb-item>突发事件</el-breadcrumb-item>
        </el-breadcrumb>
    </div> 
    <div class="layout" style="padding:10px 10px 0 10px;margin-bottom:50px;height:100%;position:relative;">
      <!-- 筛选条件 -->
      <div class="filtrate">
        <!-- tab切换 -->
        <el-menu :default-active="activeIndex" 
        class="el-menu-demo"
        mode="horizontal" 
        active-text-color="#1e82d2" 
        @select="filteraaType">
          <el-menu-item index="1" v-if="userInfo.postType >=3">向上汇报</el-menu-item>
          <el-menu-item index="2" v-if="userInfo.postType <=3">审批下属</el-menu-item>
        </el-menu>
        <div class="block">
          <el-date-picker
            style="width:250px"
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
          <el-select style="width:150px" v-model="EmerType" placeholder="请选择类型" @change="filterEmerType">
            <el-option
              v-for="item in EmerTypeList"
              :key="item.value"
              :label="item.dictDataName"
              :value="item.guid">
            </el-option>
          </el-select>
          <el-select style="width:150px" v-model="status" placeholder="请选择状态" @change="filterStatus">
            <el-option
              v-for="item in stateList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button class="build_btn"  @click="print">打印表格</el-button>
          <el-button style="margin-left:0;" @click="turnTo('/manage/emergency/build_emer')"><i class="el-icon-plus"></i>&nbsp;新建</el-button>
          <div class="clear:both"></div>
        </div>
        
      </div>
      <!-- 表单 -->
        <el-table border :data="tableData" :height="mHeight">
          <el-table-column prop="createDate" label="日期" :formatter="formatTime" min-width="12%" align="center"></el-table-column>
          <el-table-column prop="userName" align="center"  label="汇报人" min-width="14%" show-overflow-tooltip ></el-table-column>
          <el-table-column prop="occurDate" align="center"  label="汇报日期" min-width="17%" ></el-table-column>
          <el-table-column prop="typeName"  align="center" label="类型" min-width="9%" ></el-table-column>
          <el-table-column label="摘要" prop="eventDetail" show-overflow-tooltip min-width="30%" ></el-table-column>
          <el-table-column prop="status" label="状态" align="center"  min-width="9%" :formatter="formatStatus"></el-table-column>
          <el-table-column label="操作" align="center" min-width="9%" >
            <template slot-scope="scope">
              <el-button  plain size="small" @click="turnTo('/manage/emergency/emer_del/'+scope.row.guid)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      <el-pagination  
        v-if="rowCount"
        background
        style="position:absolute;right:20px;bottom:10px;padding:2px 5px;"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :page-size="18"
        :total="rowCount">
      </el-pagination>
      <div id="printcode" v-show="print1">
        <el-table border :data="tableData" :style="{height:tableData.length*49+48+'px'}">
          <el-table-column prop="createDate" label="日期" :formatter="formatTime"  width="150px" align="center"></el-table-column>
          <el-table-column prop="userName" align="center"  label="汇报人"  width="200px" show-overflow-tooltip ></el-table-column>
          <el-table-column prop="occurDate" align="center"  label="汇报日期"  width="180px" ></el-table-column>
          <el-table-column prop="typeName"  align="center" label="类型"  width="150px" ></el-table-column>
          <el-table-column label="摘要" prop="eventDetail" show-overflow-tooltip  width="534px"  align="center" ></el-table-column>
          <el-table-column prop="status" label="状态" align="center"   width="150px" :formatter="formatStatus"></el-table-column>
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
      activeIndex: "1",
      userInfo: {},
      organInfo: {},
      dateValue: "",
      tableData: [],
      EmerTypeList: [],
      EmerType: "",
      emerId: "",
      aaTypeId: "1",
      status: "",
      statusId: "",
      // 固定数据  1,待审批；2同意；3，不同意
      stateList: [
        {
          value: "",
          label: "所有状态"
        },
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
    handleCurrentChange(pageNo) {
      this.getEmer(pageNo);
    },
    // 筛选日期
    filterDate() {
      this.getEmer();
    },
    // 筛选状态
    filterStatus(e) {
      this.statusId = e;
      this.getEmer();
    },
    // 筛选类型
    filterEmerType(e) {
      this.emerId = e;
      this.getEmer();
    },
    //汇报类型
    filteraaType(e) {
      if (e == 1) {
        this.aaTypeId = "1";
      } else {
        this.aaTypeId = "2";
      }
      this.getEmer();
    },
    //获取突发事件类型
    getEmerType() {
      this.$ajax(
        `${this.subUrl.user}/comm/queryEmergencyCategory`,
        "",
        res => {
          console.log(res, "emertype");
          var obj = { dictDataName: "所有类型", guid: "" };
          res.data.TFC.unshift(obj);
          this.EmerTypeList = res.data.TFC;
        },
        this
      );
    },
    // 获取突发事件
    getEmer(pageNo) {
      var date1, date2;
      if (this.dateValue) {
        date1 = this.dateValue[0] + " 00:00:00";
        date2 = this.dateValue[1] + " 00:00:00";
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        postType: this.userInfo.postType,
        startDate: date1,
        endDate: date2,
        type: this.emerId,
        status: this.statusId,
        aaType: this.aaTypeId,
        pageSize: "18",
        pageNo: pageNo
      };
      console.log(data, "emerdata");
      this.$ajax(
        `${this.subUrl.activity}/emergencyBill/listEmergencyBill`,
        data,
        res => {
          console.log(res, "emer");
          this.tableData = res.data.list;
          this.rowCount = +res.data.rowCount;
        },
        this
      );
    },
    // 过滤状态  1,待审批，2,同意，3，不同意)
    formatStatus(val) {
      //console.log(val)
      if (val.status == 1) {
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
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    //console.log(this.userInfo);
    //console.log(this.organInfo);
    this.getEmerType();
    this.getEmer();
  }
};
</script>
<style lang="scss" scoped>
#emergency {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: hidden;
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
    // font-size: 16px;
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

// emerType
.emerType {
  color: #888;
}
</style>