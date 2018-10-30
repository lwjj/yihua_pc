<template>
<div id='inform'>
    <div class="layout">
          <!-- 筛选条件 -->
    <div class="filtrate">
    <div class="block">
      <el-select style="width:150px" v-model="province" placeholder="选择省/直辖市" @change="getCity">  
        <el-option v-for="(item,index) in provinceList"  :key="index" :label="item.dictDataName" :value="item.guid" ></el-option>
      </el-select>
      <el-select style="width:150px" v-model="city" placeholder="选择市" @change="filterCity">
        <el-option v-for="(item,index) in cityList"  :key="index" :label="item.dictDataName" :value="item.pId+','+item.guid" ></el-option>
      </el-select>
      <el-select style="width:150px" v-model="relation"  placeholder="隶属关系" @change="filterStatus" >
        <el-option
          v-for="item in stateList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="turnTo('/manage/wuye_contact/rela_manage/build_rela')"><i class="el-icon-plus"></i>&nbsp;新建</el-button>
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
      prop="createDate"
      label="日期"
      :formatter="formatTime"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="relation"
      label="关系"
      :formatter="formatRela"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      label="物业公司名称"
      >
       <template slot-scope="scope"> 
        <div>{{scope.row.organName}}</div>
        <div style="color:#888;">地址：{{scope.row.organAddress}}</div>
      </template>
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="authenStatus"
      label="状态"
      :formatter="formatStatus"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      label="操作"
      >
      <template slot-scope="scope"> 
        <el-button type="primary" plain size="small" @click="turnTo('/manage/wuye_contact/rela_manage/rela_del/'+scope.row.guid)">详情</el-button>
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
      provinceList: "",
      cityList: "",
      province: "",
      city: "",
      provinceId: "",
      cityId: "",
      relation: "",
      relationId: "",
      rowCount: "",
      userInfo: {},
      organInfo: {},
      dateValue: "",
      tableData: [],
      // 固定数据  （1：直属关系（包含财务管理），2：托管关系）
      stateList: [
        {
          value: "",
          label: "全部关系"
        },
        {
          value: "1",
          label: "直属关系"
        },
        {
          value: "2",
          label: "托管关系"
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
      this.relationId = e;
      this.getRelManage();
    },
    // 下一页
    handleCurrentChange(pageNo) {
      this.getRelManage(pageNo);
    },
    //筛选城市
    filterCity(e) {
      console.log(e, "ididid");
      this.provinceId = e.split(",")[0];
      this.cityId = e.split(",")[1];
      this.getRelManage();
    },
    // 获取省
    getProvince() {
      this.$ajax(
        `${this.subUrl.user}/comm/getDistrictList?id=0`,
        "",
        res => {
          console.log(res.data, "province");
          this.provinceList = res.data;
          var obj = { dictDataName: "全国", guid: "" };
          this.provinceList.unshift(obj);
        },
        this
      );
    },
    // 市
    getCity(e) {
      this.provinceId = e;
      this.clearCity();
      this.getRelManage();
      // this.cityId = "";
      if (e == "") {
        return;
      }
      this.provinceId = e;
      this.$ajax(
        `${this.subUrl.user}/comm/getDistrictList?id=${e}`,
        "",
        res => {
          console.log(res.data, "cityList");
          this.cityList = res.data;
        },
        this
      );
    },
    clearCity() {
      this.cityList = "";
      this.city = "";
      this.cityId = "";
    },
    // 获取
    getRelManage(pageNo) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        organType: this.organInfo.organType,
        relation: this.relationId,
        province: this.provinceId,
        city: this.cityId,
        pageSize: "12",
        pageNo: pageNo
      };
      this.$ajax(
        `${this.subUrl.activity}/proRelManage/listManagePropertyRel`,
        data,
        res => {
          console.log(res, "RelManage");
          this.tableData = res.data.list;
          this.rowCount = +res.data.rowCount;
        },
        this
      );
    },
    // 过滤状态  认证状态 0：待认证,1：已认证,2：已解除 
    formatStatus(val) {
      //console.log(val)
      if (val.authenStatus == 0) {
        return "待确认";
      } else if (val.authenStatus == 1) {
        return "已绑定";
      } else if (val.authenStatus == 2) {
        return "已解除";
      } 
    },
    // 关系
    formatRela(val) {
      //console.log(val)
      if (val.relation == 1) {
        return "直属";
      } else if (val.relation == 2) {
        return "托管";
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
    this.getRelManage();
    this.getProvince();
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
// 表格
.inform_table {
  text-align: center;
}
</style>