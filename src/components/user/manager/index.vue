<template>
<div>
  <div v-if="!showDetail" id='work_report'>
    <div class="title">
      <div class="text">管理处月报</div>
    </div>

    <!--从这里开始区分 明细列表和管理处月报报表-->
    <el-tabs v-model="activeName"  @tab-click="handleClick">
      <el-tab-pane label="部门明细列表" name="1" v-if="userInfo.postType == 3">
        <!--明细列表筛选-->
        <div class="filtrate">
          <div class="block">
            <el-date-picker
              style="margin-right: 10px;"
              v-model="value3"
              type="month"
              format="yyyy年MM月"
              value-format="yyyy-MM"
              placeholder="选择月份"
              @change="filterDate1"
            >
            </el-date-picker>

            <!--<el-select style="width:200px;margin-right: 10px;" v-model="status" placeholder="请选择状态" @change="filterStatus">
              <el-option
                v-for="item in stateList"
                :key="item.value"
                :label="item.label"
                value-format="yyyy-MM-dd HH:mm:ss"
                :value="item.value">
              </el-option>
            </el-select>-->
            <el-button v-if="userInfo.postType == 3" @click="turnTo('/manage/manage_report/mymonth')"><i class="el-icon-plus"></i>&nbsp;新建
            </el-button>
          </div>
        </div>
         <div class="inform_table">
            <el-table
              border
              :data="tableData1"
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
                prop="repMonth"
                label="月份"
                :formatter="formatMonth1"
              >
              </el-table-column>

              <!-- <el-table-column
                header-align="center"
                prop="title"
                label="标题"
              >
              </el-table-column>
              <el-table-column
                header-align="center"
                prop="type"
                label="类型"
                :formatter="formatStatus1"
              >
              </el-table-column> -->
              <el-table-column
                header-align="center"
                label="操作"
              >
               <template slot-scope="scope">
                 <el-button type="primary" plain size="small" @click="checkDetail(scope.row)">详情</el-button>
               </template>
              </el-table-column>

          </el-table>
          </div>
          <el-pagination
              v-if="rowCount1"
              class="page"
              background
              @current-change="handleCurrentChange1"
              layout="prev, pager, next"
              :page-size="12"
              :total="rowCount1">
            </el-pagination>

         
      </el-tab-pane>
      <el-tab-pane label="管理处月报" name="2">
        <div class="layout">
          <!-- 筛选条件 -->
          <div class="filtrate">
            <div class="block">
              <el-date-picker
                v-model="value4"
                type="datetimerange"
                :picker-options="pickerOptions2"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"

                @change="filterDate"
                align="right">
              </el-date-picker>
              <el-select style="width:200px;margin-right: 10px;" v-model="status" placeholder="请选择状态" @change="filterStatus">
                <el-option
                  v-for="item in stateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-button  v-if="userInfo.postType == 2" @click="turnTo('/manage/manage_report/build_monreport/0')"><i class="el-icon-plus"></i>&nbsp;新建
              </el-button>
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
                prop="createDate"
                label="日期"
                :formatter="formatTime"
              >
              </el-table-column>


              <el-table-column
                header-align="center"
                label="年月"
                prop="month"
                :formatter="formatMonth"
              >
                <!-- <template slot-scope="scope">
                  <span v-html="scope.row.createDate"></span>
                </template> -->
              </el-table-column>
              <el-table-column
                header-align="center"
                label="物业公司名称"
              >
                <template slot-scope="scope">
                  <div>{{scope.row.reportOrganName?scope.row.reportOrganName:"无"}}</div>
                </template>
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
                  <el-button v-if="scope.row.status==1" type="primary" plain size="small"
                             @click="turnTo('/manage/manage_report/monrep_del/'+scope.row.guid)">详情
                  </el-button>
                  <el-button v-if="scope.row.status==0" type="primary" plain size="small"
                             @click="turnTo('/manage/manage_report/build_monreport/'+scope.row.guid)">编辑
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            v-if="rowCount"
            class="page"
            background
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :page-size="12"
            :total="rowCount">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
  <detail v-if="showDetail" :detailData='detailData' @back='back'></detail>
</div>
  
</template>
<script>
import { relogin } from "@/assets/js/common";
import detail from "./emptyDetail";
export default {
  components: {
    detail
  },
  data() {
    // this.mHeight = Number(this.$getClientHeight()) - 200;
    this.mHeight = tableHeight - 60; // 定义的 window.tableHeight

    return {
      rowCount: "",
      rowCount1: "",
      userInfo: {},
      organInfo: {},
      dateValue: "",
      tableData: [],
      activeName: "2",
      status: "",
      statusId: "",
      tableData1: [],
      detailData: {},
      showDetail: false,
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
      value4: "",
      value3: "",
      // 固定数据
      stateList: [
        {
          value: "",
          label: "全部类型"
        },
        {
          value: "0",
          label: "未上报"
        },
        {
          value: "1",
          label: "已上报"
        }
      ]
    };
  },
  methods: {
    checkDetail(detail) {
      console.log(detail, "111");
      this.$ajax(
        `${this.subUrl.activity}/manageMonRep/queryMonthRepDeptDetail`,
        {
          token: this.$getkey(),
          monthRepDeptRowId: detail.guid
        },
        res => {
          this.showDetail = true;
          this.detailData = res.data;
        },
        this
      );
    },
    back() {
      this.showDetail = false;
    },
    turnTo(e) {
      this.$router.push(e);
    },
    handleCommand(command) {
      this.turnTo(command);
    },
    // 筛选日期
    filterDate(e) {
      this.getRep();
    },
    filterDate1(e) {
      this.getManageList();
    },
    // 筛选状态
    filterStatus(e) {
      this.statusId = e;
      this.getRep();
    },
    handleClick(e) {
      this.getRep();
    },
    // 下一页
    handleCurrentChange(pageNo) {
      this.getRep(pageNo);
    },
    handleCurrentChange1(pageNo) {
      this.getManageList(pageNo);
    },
    //获取
    getRep(pageNo = 1) {
      let date1, date2;
      if (this.value4) {
        date1 = this.value4[0];
        date2 = this.value4[1];
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        startDate: date1,
        endDate: date2,
        status: this.statusId,
        pageSize: "12",
        pageNo: pageNo
      };
      this.$ajax(
        `${this.subUrl.activity}/manageMonRep/queryMonthRep`,
        data,
        res => {
          this.tableData = res.data.list;
          this.rowCount = +res.data.rowCount;
        },
        this
      );
    },
    getManageList(pageNo) {
      let date1, date2;

      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        // startDate: date1,
        // endDate: date2,
        pageNo: pageNo,
        pageSize: 12,
        deptId: this.userInfo.deptId,
        organId: this.organInfo.guid
      };
      if (this.value3) {
        data.repMonth = this.value3;
      }
      this.xhr
        .post(
          `${this.subUrl.activity}/manageMonRep/listDeptMonthRep`,
          this.$qs.stringify(data)
        )

        .then(res => {
          if (res.data.code == 1) {
            console.log(res.data.data.list);
            this.tableData1 = res.data.data.list;
            this.rowCount1 = res.data.data.rowCount * 1;
          } else if (res.data.code == -902) {
            relogin(this);
          } else {
            this.$message({ message: res.data.msg });
          }
        });
      // this.$ajax(`${this.subUrl.activity}/manageMonRep/listDeptMonthRep?${this.$qs.stringify(data)}`,data,res=>{
      //   console.log(res,'获取成功的机会')
      // },this)
    },
    // 过滤状态
    formatStatus(val) {
      if (val.status == 0) {
        return "未上报";
      } else if (val.status == 1) {
        return "已上报";
      }
    },
    formatStatus1(val) {
      if (val.type == 1) {
        return "部门明细";
      } else if (val.type == 2) {
        return "下月计划";
      }
    },

    //el-table时间格式化
    formatTime(row, column) {
      if (row[column.property]) {
        var date = row[column.property];
        return date.split(" ")[0];
      } else {
        return "无";
      }
    },
    //月份格式化
    formatMonth(row, column) {
      var date = row[column.property];
      return date + "月";
    },
    formatMonth1(row, column) {
      var data = row[column.property];
      return data.substr(0, 7).replace("-", "年") + "月";
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getManageList(1);
    this.getRep();
    if (this.userInfo.postType == 2) {
      this.activeName = "2";
    } else {
      this.activeName = "1";
    }
  }
};
</script>
<style lang="scss" scoped>
#work_report {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: scroll;
}

.layout {
  // position: relative;
  // padding-top: 20px;
  padding-bottom: 200px;
}

.filtrate {
  width: 100%;
  height: 60px;
  background: #fff;
  /*line-height: 60px;*/
  padding-left: 20px;
  .el-menu {
    background: #fff;
    /*float: left;*/
    // font-size: 16px;
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

// 表格
.inform_table {
  text-align: center;
}

// workType
.workType {
  color: #888;
}

// 编辑按钮
.el-button + .el-button {
  margin-left: 0px;
}

.page {
  text-align: right;
}
</style>
