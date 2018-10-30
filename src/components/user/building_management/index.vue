<template>
    <div id="wealth">
        <div class="title">
            <div class="text">房屋管理</div>
        </div>
        <div class="box">
            <div class="first1">
                <div v-if="userInfo.organType >= 6">
                    <el-select v-model="value1" v-if="userInfo.organType == 6" @change="changeLouyu" :clearable='true' placeholder="选择楼宇">
                        <el-option v-for="item in options1" :key="item.guid" :label="item.buildingName" :value="item.guid">
                        </el-option>
                    </el-select>
                    <el-cascader  expand-trigger="click" :clearable="true" :change-on-select='true' :props="propsOptions" :options="options"  v-model="selectedOptions" @change="chooseUnit" placeholder="选择单元">
                    </el-cascader>
                    <el-select v-model="value2" placeholder="状态" :clearable="true" @change="filter">
                        <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <el-table border :data="tableData" height="calc(100% - 50px)" style="width: 100%;margin-top:10px;">
                    <el-table-column fixed prop="ownerInfo.name" label="姓名" min-width="10%"></el-table-column>
                    <el-table-column prop="ownerInfo.account" label="电话" min-width="15%"></el-table-column>
                    <el-table-column prop="buildingName" label="楼盘" min-width="20%"></el-table-column>
                    <el-table-column prop="home" label="单元" min-width="20%"></el-table-column>
                    <el-table-column prop="areas" label="面积" min-width="10%"></el-table-column>
                    <el-table-column prop="status" label="状态" min-width="10%"></el-table-column>
                    <el-table-column fixed="right" label="操作" min-width="10%">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" type="text" size="small">
                                详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination v-if="pageCount>0" class="right mt1" background layout="prev,pager,next" :total="pageCount" @current-change="handleCurrentChange" ></el-pagination>    
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      organInfo: {},
      value1: [],
      options1: [],
      options: [],
      selectedOptions: [],
      value2: [],
      propsOptions: {
        children: "buildingUnitList",
        label: "name",
        value: "guid"
      },
      options2: [
        {
          value: 0,
          label: "空置"
        },
        {
          value: 1,
          label: "使用中"
        },
        {
          value: 2,
          label: "装修"
        },
        {
          value: 4,
          label: "未收楼"
        },
        {
          value: 5,
          label: "出租中"
        },
        {
          value: 3,
          label: "欠费"
        }
      ],
      tableData: [],
      dataList: [],
      pageCount: ""
    };
  },
  methods: {
    changeLouyu(e) {
      if (e) {
        this.getUnitList(e);
      } else {
        this.options = [];
      }

      this.getDetails(1);
    },
    filter(e) {
      this.getDetails(1);
    },
    chooseUnit(e) {
      console.log(e);
      this.getDetails(1);
    },
    getUnitList(buildingId) {
      var url =
        this.userInfo.organType == 6
          ? "/owner/getUnitList"
          : "/ownersCom/getUnitList";
      var data = {
        token: this.$getkey()
      };
      if (this.userInfo.organType == 6 && buildingId) {
        data.buildingId = buildingId;
      }
      this.$ajax(
        `${this.subUrl.activity}${url}`,
        data,
        res => {
          for (var i of res.data) {
            i.name = i.ridName ? i.ridName : "无";
            for (var j of i.buildingUnitList) {
              j.name = j.unitName ? j.unitName : "无";
            }
          }
          this.options = res.data;
          console.log(this.options, "res,xxx");
        },
        this
      );
    },
    getDetails(pageNo) {
      var url =
        this.userInfo.organType == 6
          ? "/owner/getBmList"
          : "/ownersCom/getBmList";
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        pageNo: pageNo
      };
      if (this.value1) data.queryBuildingId = this.value1;
      if (this.value2 !== "") data.status = this.value2;
      if (this.selectedOptions.length > 1) {
        data.ridId = this.selectedOptions[0];
        data.unitId = this.selectedOptions[1];
      } else if (this.selectedOptions.length > 0) {
        data.ridId = this.selectedOptions[0];
      }
      this.$ajax(
        `${this.subUrl.activity}${url}`,
        data,
        res => {
          this.tableData = res.data.list;
          this.pageCount = Number(res.data.pageCount) * 10;
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].home =
              this.tableData[i].ridName + "" + this.tableData[i].unitName;
            if (this.tableData[i].status == 0) {
              this.tableData[i].status = "空置";
            } else if (this.tableData[i].status == 1) {
              this.tableData[i].status = "使用中";
            } else if (this.tableData[i].status == 2) {
              this.tableData[i].status = "装修";
            } else if (this.tableData[i].status == 3) {
              this.tableData[i].status = "欠费";
            } else if (this.tableData[i].status == 4) {
              this.tableData[i].status = "未收楼";
            } else if (this.tableData[i].status == 5) {
              this.tableData[i].status = "出租中";
            }
          }
        },
        this
      );
    },
    // 获取楼宇列表
    getList() {
      var data = {
        token: this.$getkey()
      };
      console.log(this.userInfo.organType);
      var url =
        this.userInfo.organType == 6
          ? "/owner/getBuildingList"
          : "/ownersCom/getBuildingList";
      this.$ajax(
        `${this.subUrl.activity}${url}`,
        data,
        res => {
          this.options1 = res.data;
        },
        this
      );
    },
    // 获取栋列表
    handleCurrentChange(pageNo) {
      this.getDetails(pageNo);
    },
    handleClick(scope) {
      this.$router.push({ name: "building_show", query: { guid: scope.guid } });
    },
    handleChange() {}
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getDetails(1);
    this.getList();
    // 业委会不需要楼宇筛选
    if (this.userInfo.organType == "7") {
      this.getUnitList();
    }
  }
};
</script>
<style lang="scss" scoped>
#wealth {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: auto;
  .box {
    height: 100%;
    position: relative;
    background: #fff;
    .first1 {
      padding: 10px 0;
      height: calc(100% - 50px);
      width: 100%;
    }
  }
}
</style>
