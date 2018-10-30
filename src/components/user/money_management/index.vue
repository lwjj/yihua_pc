<template>
    <div id="wealth">
        <div class="title">
            <div class="text">财务管理</div>
        </div>
        <div class="box">
            <div class="first1">
                <el-date-picker
                    v-model="value1"
                    type="datetimerange"
                    @change="changeDate"
                    style="width:350px;"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd" 
                    :picker-options="pickerOptions2"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="left">
                </el-date-picker>
                <el-select v-model="value2" @change="changeStatus" :clearable="true" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <!-- <el-button @click="goSelect">搜索</el-button> -->
            </div>
            <div class="first1">
              <div class="tableContent">
                 <el-table :data="tableData" border height="100%" style="width: 100%">
                    <el-table-column fixed prop="allTime" label="日期" width="320"></el-table-column>
                    <el-table-column prop="title" label="标题" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="organName" label="机构名称" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="status" label="状态" min-width="10%"></el-table-column>
                    <el-table-column fixed="right" label="操作" min-width="10%">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" type="text" size="small">
                                详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
              </div>
              <div class="paginationRight">
                <el-pagination background layout="prev, pager, next" :total=pageCount @current-change="select" v-show="pageCount>0" :current-page.sync="ye"></el-pagination>
              </div> 
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
      tableData: [],
      pageCount: 0,
      createTime: "",
      endTime: "",
      status: "",
      ye: 1,
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value1: "",
      options: [
        {
          value: "0",
          label: "不同意"
        },
        {
          value: "1",
          label: "同意"
        },
        {
          value: "2",
          label: "待审批"
        },
        {
          value: "3",
          label: "草稿"
        }
      ],
      value2: "",
      newValue2: ""
    };
  },
  methods: {
    changeStatus(e) {
      console.log(22222);
      this.getMain(1);
    },
    changeDate(e) {
      this.getMain(1);
    },
    getMain(pageNo) {
      this.pageNo = pageNo;
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        pageNo: pageNo
      };
      if (this.value2 !== "") {
        data.status = this.value2;
      }
      if (this.value1) {
        data.startDate = this.value1[0] + " 00:00:00";
        data.endDate = this.value1[1] + " 23:59:59";
      }
      this.$ajax(
        `${this.subUrl.activity}/ownersCom/ocReport/getList`,
        data,
        res => {
          this.tableData = res.data.list;
          this.pageCount = Number(res.data.pageCount) * 10;
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].allTime =
              this.tableData[i].createTime + " 至 " + this.tableData[i].endTime;
            this.tableData[i].organName = this.tableData[i].info.organName;
            if (this.tableData[i].status == 0) {
              this.tableData[i].status = "不同意";
            } else if (this.tableData[i].status == 1) {
              this.tableData[i].status = "同意";
            } else if (this.tableData[i].status == 2) {
              this.tableData[i].status = "待审批";
            } else if (this.tableData[i].status == 3) {
              this.tableData[i].status = "草稿";
            }
          }
        },
        this
      );
    },
    select(val) {
      this.getMain(val);
    },
    goSelect() {
      if (this.value2 == "选项1") {
        this.newValue2 = 0;
      } else if (this.value2 == "选项2") {
        this.newValue2 = 1;
      } else if (this.value2 == "选项3") {
        this.newValue2 = 2;
      } else if (this.value2 == "选项4") {
        this.newValue2 = 3;
      }
      if (this.value1 !== "") {
        var a1 = this.value1[0].getFullYear();
        var a2 = this.value1[0].getMonth() + 1;
        if (a2.toString.length == 1) {
          a2 = "0" + a2;
        }
        var a3 = this.value1[0].getDate();
        var a4 = this.value1[0].getHours();
        if (a4 < 10) {
          a4 = "0" + a4;
        }
        var a5 = this.value1[0].getMinutes();
        if (a5 < 10) {
          a5 = "0" + a5;
        }
        var a6 = this.value1[0].getSeconds();
        if (a6 < 10) {
          a6 = "0" + a6;
        }
        this.createTime =
          a1 + "-" + a2 + "-" + a3 + " " + a4 + ":" + a5 + ":" + a6;
        console.log(this.createTime);
        var b1 = this.value1[1].getFullYear();
        var b2 = this.value1[1].getMonth() + 1;
        if (b2.toString.length == 1) {
          b2 = "0" + b2;
        }
        var b3 = this.value1[1].getDate();
        var b4 = this.value1[1].getHours();
        if (b4 < 10) {
          b4 = "0" + b4;
        }
        var b5 = this.value1[1].getMinutes();
        if (b5 < 10) {
          b5 = "0" + b5;
        }
        var b6 = this.value1[1].getSeconds();
        if (b6 < 10) {
          b6 = "0" + b6;
        }
        this.endTime =
          b1 + "-" + b2 + "-" + b3 + " " + b4 + ":" + b5 + ":" + b6;
        console.log(this.endTime);
      }
      //this.getMain(1)
    },
    handleClick(row) {
      this.$router.push(
        "/user/money_management/money_managementDetails/" + row.guid
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
    this.getMain(1);
  }
};
</script>
<style lang="scss" scoped>
#wealth {
  height: 100%;
  padding-left: 260px;
  overflow: auto;
  .box {
    padding: 10px;
    height: 100%;
    position: relative;
    background: #fff;
    .tableContent {
      position: absolute;
      left: 10px;
      right: 10px;
      top: 60px;
      bottom: 50px;
    }
    .first1 {
      background: #fff;
      padding-bottom: 10px;
    }
  }
}
</style>
