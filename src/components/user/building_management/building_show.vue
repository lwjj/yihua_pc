<template>
    <div id="inform_del">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/building_management/index' }">房屋管理</el-breadcrumb-item>
                <el-breadcrumb-item>房屋详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="del_top">
            <div>
                状态：
                <span class="idea">{{tableData.status}}</span>
            </div>
        </div>
        <div class="del"  v-if="tableData.userInfo">
            <div class="del_title">
                <h4>房屋信息</h4>
            </div>
            <ul class="delList clearfix">
                <li>房屋单元：<span>{{tableData.home}}</span></li>
                <li>建筑面积：<span>{{tableData.area}}（平方米）</span></li>
                <li>业主姓名：<span>{{tableData.userInfo.name}}</span></li>
                <li>联系电话：<span>{{tableData.userInfo.account}}</span></li>
            </ul>
        </div>        
        <div class="inform_table" v-if="lesseeLogList.length!==0">
            <h4 class="msg_title">租户信息</h4>
            
            <el-table :data="lesseeLogList" border>
                <el-table-column header-align="center" label="客户名称" prop="organName"></el-table-column>
                <el-table-column header-align="center" prop="startDate" label="入驻日期"></el-table-column>
                <el-table-column header-align="center" prop="endDate" label="退租日期"></el-table-column>
                <el-table-column header-align="center" prop="contacts" label="联系人"></el-table-column>
                <el-table-column header-align="center" prop="tel" label="联系电话"></el-table-column>
                <el-table-column header-align="center" prop="industry" label="从事行业"></el-table-column>
                <el-table-column header-align="center" label="是否续签">
                    <template slot-scope="scope">
                        <div v-text="scope.row.renew==0?'否':'是'"></div>
                    </template>
                </el-table-column>
            </el-table>
        </div>          
        <!-- <div class="inform_table" v-if="lesseeLogList.length==0" style="padding:30px 0;"><p>暂无租户信息</p></div> -->
        <div class="inform_table" v-if="meterReadList.length!=0">
            <h4 class="msg_title">抄表信息</h4>
            <h3 class="msg_right">
                <router-link :to="'/user/building_management/building_maintenance?unitId='+$route.query.guid">
                    <i>
                    设备维护明细说明
                    <u>&gt;&gt;</u>
                    </i>
                </router-link>
            </h3>
            <el-table :data="meterReadList" border>
                <el-table-column header-align="center" label="抄表日期" prop="meterRead"></el-table-column>
                <el-table-column header-align="center" prop="project" label="抄表项目"></el-table-column>
                <el-table-column header-align="center" prop="dosage" label="计量"></el-table-column>
                <el-table-column header-align="center" prop="meterReadUsername" label="抄表人"></el-table-column>
            </el-table>
        </div>
        <!-- <div class="inform_table" v-if="meterReadList.length==0" style="padding:30px 0;"><p>暂无抄表信息</p></div> -->
    </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      organInfo: {},
      tableData: [],
      lesseeLogList: [],
      lesseeLogListHeight: "",
      meterReadListHeight: "",
      meterReadList: []
    };
  },
  methods: {
    getDetails() {
      if (this.userInfo.organType == 6) {
        var data = {
          token: this.$getkey(),
          unitId: this.$route.query.guid
        };
        this.$ajax(
          `${this.subUrl.activity}/owner/detail`,
          data,
          res => {
            this.tableData = res.data;
            this.lesseeLogList = [];
            this.lesseeLogList = res.data.lesseeLogList;
            this.meterReadList = [];
            this.meterReadList = res.data.meterReadList;
            if (this.lesseeLogList.length > 3) {
              this.lesseeLogListHeight = 412 + "px";
            }
            if (this.meterReadList.length > 3) {
              this.meterReadListHeight = 288 + "px";
            }
            this.tableData.home =
              this.tableData.ridName + "" + this.tableData.unitName;
            if (this.tableData.status == 0) {
              this.tableData.status = "空置";
            } else if (this.tableData.status == 1) {
              this.tableData.status = "使用中";
            } else if (this.tableData.status == 2) {
              this.tableData.status = "装修";
            } else if (this.tableData.status == 3) {
              this.tableData.status = "欠费";
            } else if (this.tableData.status == 4) {
              this.tableData.status = "未收楼";
            } else if (this.tableData.status == 5) {
              this.tableData.status = "出租中";
            }
          },
          this
        );
      } else if (this.userInfo.organType == 7) {
        var data = {
          token: this.$getkey(),
          unitId: this.$route.query.guid
        };
        this.$ajax(
          `${this.subUrl.activity}/ownersCom/detail`,
          data,
          res => {
            this.tableData = res.data;
            this.lesseeLogList = [];
            this.lesseeLogList = res.data.lesseeLogList;
            this.meterReadList = [];
            this.meterReadList = res.data.meterReadList;
            this.tableData.home =
              this.tableData.ridName + "" + this.tableData.unitName;
            if (this.tableData.status == 0) {
              this.tableData.status = "空置";
            } else if (this.tableData.status == 1) {
              this.tableData.status = "使用中";
            } else if (this.tableData.status == 2) {
              this.tableData.status = "装修";
            } else if (this.tableData.status == 3) {
              this.tableData.status = "欠费";
            } else if (this.tableData.status == 4) {
              this.tableData.status = "未收楼";
            } else if (this.tableData.status == 5) {
              this.tableData.status = "出租中";
            }
          },
          this
        );
      }
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getDetails();
  }
};
</script>
<style lang="scss" scoped>
#inform_del {
  height: 100%;
  padding-left: 280px;
  padding-right: 20px;
  overflow: scroll;
  .text {
    i {
      padding: 20px 20px;
    }
  }
}
.del_top {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #fff;
  padding: 0 20px;
}
.del_title {
  // font-size: 16px;
  // font-weight: 700;
  margin-top: 20px;
  padding: 10px 40px;
  background: #fff;
  border-bottom: 1px solid #ccc;
  .idea {
    padding-left: 100px;
    font-weight: 400;
    font-size: 15px;
  }
}
.delList {
  background: #fff;
  padding: 20px 50px;
  li {
    width: 50%;
    padding: 5px 0;
    float: left;
  }
  span {
    padding-left: 20px;
  }
}
.inform_table {
  background: #fff;
  padding: 0;
  text-align: center;
}
.msg_title {
  float: left;
  padding: 10px 40px;
}
.msg_right {
  float: right;
  padding: 10px 40px;
  u {
    text-decoration: none;
  }
}
</style>
