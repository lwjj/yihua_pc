<template>
<div id='quality'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/user/we_business' }">本楼业务</el-breadcrumb-item>
            <el-breadcrumb-item>楼宇管理</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="layout">
        <div class="filtrate">
            <div class="block">
             <el-cascader 
                placeholder="选择单元"
                change-on-select
                :options="ridList"
                :props="props"
                v-model="selectedOptions"
                @change="selectRid">
            </el-cascader>
            <el-select style="width:150px" v-model="status"  placeholder="全部状态" @change="filterStatus" >
                <el-option
                v-for="item in stateList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" @click="turnTo('/user/we_business/building_unit/unit_msg')">房屋信息</el-button>
            </div>
        </div>    
  <!-- 表单 -->
<div class="inform_table">
   <el-table
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
      label="面积（平）"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="ownerInfo.name"
      label="业主"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="ownerInfo.account"
      label="手机号码"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
    prop="status"
    label="状态"
    :formatter="filterType"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      label="操作"
      >
      <template slot-scope="scope">
        <el-button type="primary" plain size="small" @click="turnTo('/user/we_business/building_unit/unit_del/'+scope.row.guid)">详情</el-button>
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
        page-size="12"
        :total="rowCount">
      </el-pagination>


</div>
</div>
</template>
<script>
export default {
  data() {
               this.mHeight =tableHeight  // 定义的 window.tableHeight

    return {
      rowCount: "",
      userInfo: {},
      organInfo: {},
      tableData: [],
      status: "",
      statusId: "",
      rid: "",
      ridList: [],
      selectedOptions: [],
      unit: "",
      unitList: [],
      ridId: "",
      unitId: "",
      props: {
        label: "label",
        value: "guid",
        children: "buildingUnitList"
      },
      // 固定数据   0:空置; 1:使用中; 2:装修; 3:欠费; 4:未收楼; 5:出租中 ,
      stateList: [
        {
          value: "",
          label: "所有状态"
        },
        {
          value: "0",
          label: "空置"
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
        },
        {
          value: "4",
          label: "未收楼"
        },
        {
          value: "5",
          label: "出租中"
        }
      ]
    };
  },
  methods: {
    // back() {
    //   this.$router.go(-1);
    // },
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
            buildingUnitList: [
              //   {unitName:"全部",guid:""}
            ]
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
    getList(pageNo=1) {
      var data = {
        token: this.$getkey(),
        status: this.statusId,
        ridId: this.ridId,
        unitId: this.unitId,
        pageNo: pageNo,
        pageSize: "12"
      };
      this.$ajax(
        `${this.subUrl.user}/buildingUnit/getbuildingUnitList`,
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
    this.getRid();
  }
};
</script>
<style lang="scss" scoped>
#quality {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: scroll;
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
  padding-left: 20px;
  text-align: center;
  .el-table {
    font-size: 15px;
  }
}
// emerType
.emerType {
  color: #888;
}
</style>