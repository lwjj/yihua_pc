<template>
  <div id='subTemplate'>
    <div class="title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/pinzhi'}">品质管理</el-breadcrumb-item>
            <el-breadcrumb-item>品质稽查</el-breadcrumb-item>
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
          <el-select style="width:150px" v-model="EmerType" placeholder="请选择类型" @change="filterQuliType">
            <el-option
              v-for="item in qualiTypeList"
              :key="item.value"
              :label="item.dictDataName"
              :value="item.dictDataValue">
            </el-option>
          </el-select>
          <!-- <el-select style="width:150px" v-model="status" placeholder="请选择状态" @change="filterStatus">
           <el-option
             v-for="item in stateList"
             :key="item.value"
             :label="item.label"
             :value="item.value">
           </el-option>
         </el-select> -->
          <el-button @click="print">打印表格</el-button>
          <el-button v-if='showBuild' style="margin-left:0" @click="turnTo('/manage/quality/build_quality')"><i class="el-icon-plus"></i>&nbsp;新建</el-button>
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
            header-align="center"
            prop="createDate"
            label="日期"
            :formatter="formatTime"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            prop="examineDate"
            label="稽查日期"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            prop="type"
            label="类型"
            :formatter="formatType"
          >
            <!-- <template slot-scope="scope">
              <div>{{scope.row.type}}</div>
              <span class="emerType">类型:【{{scope.row.typeName}}】</span>
           </template> -->
          </el-table-column>
          <el-table-column
            header-align="center"
            prop="userName"
            label="制表人"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button plain size="small"
                         @click="turnTo('/manage/quality/quality_del/'+scope.row.guid)">详情
              </el-button>
              <!-- <el-button type="danger" plain size="small">编辑</el-button> -->
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
            :total="rowCount"
            :page-size="18">
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
            width='341px'
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="examineDate"
            label="稽查日期"
            width='341px'
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="type"
            label="类型"
            :formatter="formatType"
            width='341px'
          >
            <!-- <template slot-scope="scope">
              <div>{{scope.row.type}}</div>
              <span class="emerType">类型:【{{scope.row.typeName}}】</span>
           </template> -->
          </el-table-column>
          <el-table-column
            align="center"
            prop="userName"
            label="制表人"
            width='341px'
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
      rowCount:"",
	    showBuild:false,
      activeIndex: "1",
      userInfo: {},
      organInfo: {},
      dateValue: "",
      tableData: [],
      qualiTypeList: [],
      EmerType: "",
      qualityId: ""
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
      this.getQuality(pageNo);
    },
    // 筛选日期
    filterDate() {
      this.getQuality();
    },
    // 筛选类型
    filterQuliType(e) {
      this.qualityId = e;
      this.getQuality();
    },
    //汇报类型
    filteraaType(e) {
      if (e == 1) {
        this.aaTypeId = "1";
      } else {
        this.aaTypeId = "2";
      }
      this.getQualiType();
    },
    //获取品质稽查类型
    getQualiType() {
      this.$ajax(
        `${this.subUrl.user}/comm/queryExamineCategory`,
        "",
        res => {
          console.log(res, "qualitype");
          var obj = { dictDataName: "所有类型", dictDataValue: "" };
          res.data.JCC.unshift(obj);
          this.qualiTypeList = res.data.JCC;
        },
        this
      );
    },
    // 获取品质稽查列表
    getQuality(pageNo) {
      var date1, date2;
      if (this.dateValue) {
        date1 = this.dateValue[0] + " 00:00:00";
        date2 = this.dateValue[1] + " 00:00:00";
      }
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid,
        startDate: date1,
        endDate: date2,
        type: this.qualityId,
        pageSize:"18",
        pageNo:pageNo,
      };
      console.log(data, "qualitydata");
      this.$ajax(
        `${this.subUrl.activity}/examine/listExamineBill`,
        data,
        res => {
          console.log(res, "quali");
          this.tableData = res.data.list;
          this.rowCount = +res.data.rowCount;
        },
        this
      );
    },
    // 过滤稽核类型(1，交叉检查；2，联合检查)
    formatType(val) {
      // console.log(val)
      if (val.type == 1) {
        return "交叉检查";
      } else if (val.type == 2) {
        return "联合检查";
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
    this.getQualiType();
    this.getQuality();
	 this.$getRoot(res => {
      this.rootList = res;
      console.log(res, "Nihao");
      for (var a of this.rootList.propertyManagement.subclass) {
        if (a.name == "品质管理") {
          for (var b of a.subclass) {
            if (b.name == "品质稽查") {
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
// .tableContent {
//   position: absolute;
//   left: 20px;
//   right: 0;
//   top: 80px;
//   bottom: 0;
// }

#subTemplate {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
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
