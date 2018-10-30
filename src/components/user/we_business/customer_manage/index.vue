<template>
<div id='quality'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/user/we_business' }">本楼业务</el-breadcrumb-item>
            <el-breadcrumb-item>租户管理</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="layout">
        <div class="filtrate">
            <div class="block">
             <el-cascader 
                placeholder="选择单元"
                change-on-select
                :options="ridList"
                :props="propsRid"
                v-model="selectedOptions1"
                @change="selectRid">
            </el-cascader>
             <el-cascader 
                placeholder="业务类型"
                :show-all-levels="false"
                :options="industryList"
                :props="propsInd"
                v-model="selectedOptions2"
                @change="selectIndustry">
            </el-cascader>
            <el-select style="width:150px" v-model="status"  placeholder="全部状态" @change="filterStatus" >
                <el-option
                v-for="item in stateList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            </div>
        </div>    
  <!-- 表单 -->
<div class="inform_table">
   <el-table
    border
    :data="tableData"
    :height="mHeight"
    >
    <el-table-column
    header-align="center"
    label="单元"
      >
       <template slot-scope="scope">
      <div>{{scope.row.ridName}}{{scope.row.unitName}}</div>
    </template>
    </el-table-column>
    <el-table-column
    header-align="center"
    prop="areas"
      label="面积（平米）"
      >
      <!-- <template slot-scope="scope">
          <div></div>
      </template> -->
    </el-table-column>
    <el-table-column
      align="left"
      label="客户名称"
      >
        <template slot-scope="scope">
          <div>{{scope.row.organName}}</div>
          <div style="color:#888;">{{scope.row.industry}}</div>
      </template>
    </el-table-column>
    <el-table-column
    header-align="center"
      label="联系信息"
      >
       <template slot-scope="scope">
          <div>{{scope.row.ownerInfo.name}}</div>
          <div>{{scope.row.ownerInfo.account}}</div>
      </template>
    </el-table-column>
    <el-table-column
    header-align="center"
    prop="status"
    label="状态"
    :formatter="filterType"
      >
    </el-table-column>
  </el-table>

 </div>
   <el-pagination
        v-if="rowCount"
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
    this.mHeight = tableHeight; // 定义的 window.tableHeight

    return {
      rowCount: "",
      userInfo: {},
      organInfo: {},
      tableData: [],
      status: "",
      statusId: "",
      rid: "",
      ridId: "",
      ridList: [],
      unit: "",
      unitId: "",
      unitList: [],
      classId: "",
      industryList: [],
      selectedOptions1: [],
      selectedOptions2: [],
      propsRid: {
        label: "label",
        value: "guid",
        children: "buildingUnitList"
      },
      propsInd: {
        label: "name",
        value: "guid",
        children: "children"
      },
      // 固定数据   0:空置; 1:使用中; 2:装修; 3:欠费; 4:未收楼; 5:出租中 ,
      stateList: [
        {
          value: "",
          label: "全部状态"
        },
        {
          value: "1",
          label: "使用中"
        },
        {
          value: "2",
          label: "装修"
        },
        {
          value: "3",
          label: "欠费"
        }
      ]
    };
  },
  methods: {
    handleCurrentChange(pageNo) {
      this.getList(pageNo);
    },
    turnTo(e) {
      this.$router.push(e);
    },
    // 筛选状态
    filterStatus(e) {
      this.statusId = e;
      this.getList();
    },
    // 过滤type   0:空置; 1:使用中; 2:装修; 3:欠费; 4:未收楼; 5:出租中 ,
    filterType(e) {
      if (e.status == 0) {
        return "空置";
      } else if (e.status == 1) {
        return "使用中";
      } else if (e.status == 2) {
        return "装修";
      } else if (e.status == 3) {
        return "欠费";
      } else if (e.status == 4) {
        return "未收楼";
      } else if (e.status == 5) {
        return "出租中";
      }
    },
    // 选择 业务类型
    selectIndustry(value) {
      console.log(value);
      this.classId = value[1];
      this.getList();
    },
    // 获取行业 业务类型
    getIndustry() {
      var data = {
        token: this.$getkey()
      };
      this.$ajax(
        `${this.subUrl.user}/comm/getIndustryCategory`,
        data,
        res => {
          console.log(res, "getIndustry");
          let obj = {
            name: "全部",
            guid: "",
            children: [{ name: "全部", guid: "" }]
          };
          let newArr = res.data.pmc.concat(res.data.icc);
          for (let val of newArr) {
            val.children = val.subclass;
          }
          console.log(newArr, "newArr");
          newArr.unshift(obj);
          this.industryList = newArr;
        },
        this
      );
    },
    // 选择单元
    selectRid(value) {
      console.log(value);
      this.ridId = value[0];
      this.unitId = value[1];
      this.getList();
    },
    // 获取栋 单元
    getRid() {
      var data = {
        token: this.$getkey()
      };
      this.$ajax(
        `${this.subUrl.user}/buildingUnit/getUnitList`,
        data,
        res => {
          console.log(res, "getRid");
          let obj = {
            ridName: "全部",
            guid: "",
            buildingUnitList: [{ unitName: "全部", guid: "" }]
          };
          res.data.unshift(obj);
          for (let val of res.data) {
            val.label = val.ridName;
            for (let val2 of val.buildingUnitList) {
              val2.label = val2.unitName;
            }
          }
          this.ridList = res.data;
        },
        this
      );
    },
    // 获取列表
    getList(pageNo = 1) {
      var data = {
        token: this.$getkey(),
        status: this.statusId,
        ridId: this.ridId,
        unitId: this.unitId,
        typeId: this.classId,
        pageNo: pageNo,
        pageSize: "12"
      };
      this.$ajax(
        `${this.subUrl.user}/buildingUnit/getCustomerList`,
        data,
        res => {
          console.log(res, "getList");
          this.tableData = res.data.list;
          this.rowCount = +res.data.rowCount;
        },
        this
      );
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getList();
    this.getRid();
    this.getIndustry();
  }
};
</script>
<style lang="scss" scoped>
#quality {
  overflow: auto;
  .text {
    i {
      padding: 20px 20px;
    }
  }
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