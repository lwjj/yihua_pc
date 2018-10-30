<template>
    <div id="wealth">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{path: '/wuye/manage'}">物业管理</el-breadcrumb-item>
                <el-breadcrumb-item>管理处管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="first1">
                <div class="first1_select">
                     <el-select v-model="value1" placeholder="请选择">
                        <el-option
                        v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-cascader v-model="selectedOptions4" @active-item-change="handleItemChange" :options="citys" :props="selectedOptions3"></el-cascader>
                    <el-button @click="getMain">搜索</el-button>
                    <el-button style="float:right;" @click="goSee">查看所有管理处</el-button>
                </div>
                <el-table :data="tableData" style="width: 100%;height:calc(100% - 104px)">
                    <el-table-column fixed prop="createDate" label="创建时间"   min-width="14%"></el-table-column>
                    <el-table-column prop="cityName" label="城市名称" min-width="13%"></el-table-column>
                    <el-table-column prop="organName" label="机构名称" min-width="16%"></el-table-column>
                    <el-table-column prop="organAddress" label="机构地址" min-width="26%"></el-table-column>
                    <el-table-column prop="relation" label="关系" min-width="15%"></el-table-column>
                    <el-table-column prop="authenStatus" label="状态" min-width="8%"></el-table-column>
                    <el-table-column fixed="right" label="操作" min-width="8%">>
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看详情</el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="pageCount"
                    :page-size="10"
                    style="text-align:right;margin-top:10px;"
                     @current-change="handleCurrentChange"
                    >
                </el-pagination>
            </div>
            <div  v-if="open==1" class="pop">
                <i @click="close"><u>X</u></i>
                <div class="popMain">
                    <h4>管理处信息</h4>
                    <div class="box1">
                        <div class="box1_right">
                            <p>管理处名称:{{managementInfo.organName}}</p>
                            <p>写字楼名称:{{managementInfo.buildingName}}</p>
                            <p>管理处地址:{{managementInfo.address}}</p>
                            <p>建筑面积:{{managementInfo.area?managementInfo.area + "平":"无"}}</p>
                            <p>管理处主任:{{managementInfo.name}}</p>
                            <p>手机号码:{{managementInfo.account}}</p>
                        </div>
                        <!-- <div class="box1_left">
                            <p>{{managementInfo.organName}}</p>
                            <p>{{managementInfo.buildingName}}</p>
                            <p>{{managementInfo.address}}</p>
                            <p style="line-height:21px;">{{managementInfo.area}}</p>
                            <p>{{managementInfo.name}}</p>
                            <p style="line-height:21px;">{{managementInfo.account}}</p>
                        </div> -->
                    </div>
                    <div class="clear"></div>
                    <h4>总经理（主任）</h4>
                    <div class="box1">
                        <div class="box1_right">
                            <p>姓名:{{proCompanyInfo.name}}</p>
                            <p>手机号:{{proCompanyInfo.account}}</p>
                        </div>
                        <div class="box1_left">
                            <p style="line-height:21px;"></p>
                            <p style="line-height:21px;"></p>
                        </div>
                    </div>
                    <h4>状态</h4>
                    <div class="box1">
                        <div class="box1_right">
                            <p>{{status}}</p>
                        </div>
                    </div>
                    <div class="clear"></div>
                    <el-button v-if="status=='未绑定'" @click="binding(1)">绑定</el-button>
                    <el-button v-if="status=='待确定'&&isConfirm==1" @click="bindRel">确认绑定</el-button>
                    <el-button v-if="status=='已绑定'" @click="binding(2)">申请解绑</el-button>
                </div>
            </div>
            <div class="bg"  v-show="open==1"></div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      organInfo: {},
      citys: [],
      tableData: [],
      pageCount: 0,
      relation: "",
      options1: [
        {
          value: 0,
          label: "查看全部"
        },
        {
          value: 1,
          label: "直属关系（包含财务管理）"
        },
        {
          value: 2,
          label: "托管关系"
        }
      ],
      value1: "",
      options2: [],
      value2: "",
      selectedOptions3: {
        label: "label",
        value: "value",
        children: "cities"
      },
      selectedOptions4: [],
      newCitys: [],
      num: 0,
      open: 0,
      managementInfo: {},
      proCompanyInfo: {},
      status: "",
      isConfirm: "",
      bindelation: "",
      oaId: "",
      newRow: {},
      pageNo: ""
    };
  },
  methods: {
    getMain(pageNo) {
      if (pageNo == undefined) {
        pageNo = 1;
      }
      if (this.selectedOptions4.length > 0) {
        var province = this.selectedOptions4[0];
        var city = this.selectedOptions4[1];
      }
      if (this.value1 == 0) {
        this.value1 = "";
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        organType: this.organInfo.organType,
        pageNo: pageNo,
        pageSize: 10,
        relation: this.value1,
        province: province,
        city: city
      };
      this.$ajax(
        `${this.subUrl.activity}/proRelManage/listManagePropertyRel`,
        data,
        res => {
          this.tableData = [];
          this.tableData = res.data.list;
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].authenStatus =
              this.tableData[i].authenStatus == 0
                ? "待认证"
                : this.tableData[i].authenStatus == 1 ? "已认证" : "已解除";
            this.tableData[i].relation =
              this.tableData[i].relation == 1
                ? "直属关系（包含财务管理）"
                : "托管关系";
          }
          this.pageCount = res.data.pageCount * 10;
        },
        this
      );
    },
    handleCurrentChange(val) {
      this.getMain(val);
      this.pageNo = val;
    },
    handleClick(row) {
      this.newRow = {};
      this.newRow = row;
      this.bindelation = row.relation == "直属关系（包含财务管理）" ? 1 : 2;
      this.oaId = row.guid;
      this.open = 1;
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        oaId: row.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/proRelManage/getProManageDetail`,
        data,
        res => {
          this.managementInfo = {};
          this.managementInfo = res.data.managementInfo;
          this.proCompanyInfo = res.data.proCompanyInfo;
          this.status =
            res.data.status == 0
              ? "未绑定"
              : res.data.status == 1 ? "已绑定" : "待确定";
          this.isConfirm = res.data.isConfirm;
          console.log(this.isConfirm);
          if (res.data.proCompanyInfo !== null) {
            this.relation = res.data.relation;
          }
        },
        this
      );
    },
    handleItemChange(val) {
      for (var b = 0; b < this.citys.length; b++) {
        if (this.citys[b].value == val[0]) {
          this.num = b;
        }
      }
      var data = {
        id: val[0]
      };
      this.$ajax(
        `${this.subUrl.user}/comm/getDistrictList`,
        data,
        res => {
          if (res.data.length > 0) {
            this.citys[this.num].cities = [];
            for (var i = 0; i < res.data.length; i++) {
              var a = {};
              a.label = res.data[i].dictDataName;
              a.value = res.data[i].guid;
              this.citys[this.num].cities.push(a);
            }
          }
        },
        this
      );
    },
    cityName() {
      var data = {
        id: 0
      };
      this.$ajax(
        `${this.subUrl.user}/comm/getDistrictList`,
        data,
        res => {
          for (var i = 0; i < res.data.length; i++) {
            var a = {};
            a.label = res.data[i].dictDataName;
            a.value = res.data[i].guid;
            a.cities = [];
            this.citys.push(a);
          }
        },
        this
      );
    },
    close() {
      this.open = 0;
    },
    binding(n) {
      if (n == 1) {
        this.open = 0;
        this.$confirm("请选择绑定关系", "提示", {
          confirmButtonText: "直属关系（包含财务管理）",
          cancelButtonText: "托管关系（不含财务管理）",
          type: "warning",
          center: true
        })
          .then(() => {
            var data = {
              token: this.$getkey(),
              userId: this.userInfo.guid,
              oaId: this.oaId,
              relation: 1
            };
            this.$ajax(
              `${this.subUrl.activity}/proRelManage/bindProManageRel`,
              data,
              res => {
                if (res.code == 1) {
                  this.open = 0;
                  this.$message({
                    message: "已申请绑定",
                    type: "success"
                  });
                  this.getMain(this.pageNo);
                }
              },
              this
            );
          })
          .catch(() => {
            var data = {
              token: this.$getkey(),
              userId: this.userInfo.guid,
              oaId: this.oaId,
              relation: 2
            };
            this.$ajax(
              `${this.subUrl.activity}/proRelManage/bindProManageRel`,
              data,
              res => {
                if (res.code == 1) {
                  this.open = 0;
                  this.$message({
                    message: "已申请绑定",
                    type: "success"
                  });
                  this.getMain(this.pageNo);
                }
              },
              this
            );
          });
      } else {
        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          organId: this.organInfo.guid,
          oaId: this.oaId,
          operate: 2
        };
        this.$confirm("是否解绑管理处").then(() => {
          this.$ajax(
            `${this.subUrl.activity}/proRelManage/updateBindRel`,
            data,
            res => {
              if (res.code == 1) {
                this.open = 0;
                this.$message({
                  message: "已解除绑定",
                  type: "success"
                });
                this.getMain(this.pageNo);
              }
            },
            this
          );
        });
      }
    },
    goSee() {
      this.$router.push({ path: "/wuye/allManagement" });
    },
    bindRel() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        oaId: this.oaId,
        operate: 1
      };
      this.$ajax(
        `${this.subUrl.activity}/proRelManage/updateBindRel`,
        data,
        res => {
          if (res.code == 1) {
            this.$message({
              message: "确认成功",
              type: "success"
            });
            this.handleClick(this.newRow);
          }
        },
        this
      );
    }
  },
  updated() {},
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getMain();
    this.cityName();
  }
};
</script>
<style lang="scss" scoped>
.clear {
  clear: both;
}
#wealth {
  height: 100%;
  overflow: auto;
  .box {
    margin-top: 10px;
    height: 100%;
    background: #fff;
    position: relative;
    .first1 {
      padding-top: 10px;
      box-sizing: border-box;
      height: 100%;
      .first1_select {
        margin-bottom: 10px;
      }
    }
    .pop {
      position: absolute;
      width: 500px;
      height: 500px;
      background: #fff;
      border: 1px solid #ddd;
      margin: 0 auto;
      left: 0;
      right: 0;
      top: 100px;
      z-index: 502;
      .popMain {
        text-align: center;
        h4 {
          padding-left: 10%;
          padding: 10px;
          border-bottom: 1px solid #ddd;
          text-align: left;
        }
        .box1 {
          width: 100%;
          .box1_right {
            // width: 25%;
            // float: left;
            padding: 0 20px;
            p {
              text-align: left;
              margin: 10px 0;
            }
          }
          .box1_left {
            width: 72%;
            float: left;
            margin-left: 3%;
            p {
              text-align: left;
              margin: 10px 0;
            }
          }
        }
        .el-button {
          text-align: center;
          width: 50%;
          margin-top: 20px;
        }
      }
      i {
        position: absolute;
        right: 0;
        top: 0;
        width: 30px;
        height: 30px;
        border-left: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        cursor: pointer;
        u {
          text-decoration: none;
          position: absolute;
          margin: auto auto;
          width: 12px;
          height: 17px;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
        }
      }
    }
    .bg {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(128, 128, 128, 0.5);
      top: 0;
      left: 0;
      z-index: 500;
    }
  }
}
</style>
