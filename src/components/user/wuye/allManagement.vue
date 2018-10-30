<template>
    <div id="wealth">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{path: '/wuye/manage'}">物业管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: '/wuye/projectManager'}">管理处管理</el-breadcrumb-item>
                <el-breadcrumb-item>管理处</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="first1">
              <div>
                <el-input placeholder="请输入机构名或手机号" v-model="organName" @input.native="getCurrent"></el-input>
              </div>
                <el-table :data="tableData" style="width: 100%;max-height:calc(100% - 59px)">
                    <el-table-column fixed prop="createDate" label="创建时间"   min-width="16%"></el-table-column>
                    <el-table-column label="机构名称" show-overflow-tooltip prop="organName"  min-width="16%"></el-table-column>
                    <el-table-column prop="organAddress" show-overflow-tooltip  label="机构地址" min-width="36%"></el-table-column>    
                    <el-table-column fixed="right" label="操作" min-width="9%">>
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看详情</el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                class="mt1"
                  v-if="pageCount>0"
                    background
                    layout="prev, pager, next"
                    :total="pageCount"
                    :page-size="10"
                    style="text-align:right;"
                    @current-change=selectPageNo>
                </el-pagination>
            </div>
            <div  v-if="open==1" class="pop">
                <i @click="close"><u>X</u></i>
                <div class="popMain">
                    <h4>管理处信息</h4>
                    <div class="box1">
                        <div class="box1_right">
                            <p>管理处名称</p>
                            <p>写字楼名称</p>
                            <p>管理处地址</p>
                            <p>管理处主任</p>
                            <p>手机号码</p>
                        </div>
                        <div class="box1_left">
                            <p>{{managementInfo.organName}}</p>
                            <p>{{managementInfo.buildingName}}</p>
                            <p>{{managementInfo.address}}</p>
                            <p>{{managementInfo.name}}</p>
                            <p style="line-height:21px;">{{managementInfo.account}}</p>
                        </div>
                    </div>
                    <div class="clear"></div> 
                    <div class="clear"></div>
                    <div style="margin-top:50px;">
                        <el-button v-if="status=='未绑定'" @click="binding(1)">绑定</el-button>
                        <el-button v-if="status=='待确定'&&isConfirm==1">待确定</el-button>
                        <el-button v-if="status=='已绑定'" @click="binding(2)">申请解绑</el-button>
                    </div>
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
      tableData: [],
      open: 0,
      pageCount: 0,
      managementInfo: {},
      proCompanyInfo: {},
      status: "",
      isConfirm: "",
      bindelation: "",
      oaId: "",
      organName: "",
      newRow: "",
      relation: "",
      pageNo: ""
    };
  },
  methods: {
    getCurrent(e) {
      if (!this.timer) {
        this.timer = setTimeout(() => {
          this.getMain(1);
        }, 400);
      }
    },
    getMain(pageNo) {
      if (pageNo == undefined) {
        pageNo = 1;
      }
      var data = {
        token: this.$getkey(),
        pageNo: pageNo,
        pageSize: 10,
        condition: this.organName
      };
      this.$ajax(
        `${this.subUrl.activity}/proRelManage/queryManage`,
        data,
        res => {
          this.timer = null;
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
    selectPageNo(val) {
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
        oaId: row.guid
      };

      this.$ajax(
        `${this.subUrl.activity}/proRelManage/getManageDetail`,
        data,
        res => {
          console.log(res.data);
          this.managementInfo = {};
          this.managementInfo = res.data.managementInfo;
          if (this.proCompanyInfo !== {}) {
            this.proCompanyInfo = res.data.proCompanyInfo;
          }
          this.status =
            res.data.status == 0
              ? "未绑定"
              : res.data.status == 1 ? "已绑定" : "待确定";
          this.isConfirm = res.data.isConfirm;
        },
        this
      );
    },
    close() {
      this.open = 0;
    },
    binding(n) {
      var that = this;
      if (n == 1) {
        this.open = 0;
        this.$confirm("请选择绑定关系", "提示", {
          confirmButtonText: "直属关系",
          cancelButtonText: "托管关系",
          distinguishCancelAndClose:true,
          type: "warning",
          // center: true
        })
          .then((res) => {
            
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
          .catch( (res) => {
            console.log(res,'res')
            if(res=='close'){
              return
            }
            this.open = 0;
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
        this.open = 0;
        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          organId: this.organInfo.guid,
          oaId: this.oaId,
          operate: 2
        };
        this.$ajax(
          `${this.subUrl.activity}/proRelManage/updateBindRel`,
          data,
          res => {
            if (res.code == 1) {
              this.open = 0;
              this.$message({
                message: "申请解绑成功",
                type: "success"
              });
              this.getMain(this.pageNo);
            }
          },
          this
        );
      }
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
  }
};
</script>
<style lang="scss" scoped>
.clear {
  clear: both;
}
#wealth {
  overflow: auto;
  .box {
    height: 100%;
    background: #fff;
    position: relative;
    .first1 {
      padding-top: 10px;
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
      z-index: 9999;
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
            width: 25%;
            float: left;
            p {
              display: block;
              padding-bottom: 20px;
              height: 42px;
              line-height: 21px;
              text-align: right;
              margin: 10px 0;
            }
          }
          .box1_left {
            width: 72%;
            float: left;
            margin-left: 3%;
            p {
              display: block;
              height: 42px;
              line-height: 21px;
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
      z-index: 9995;
    }
  }
}
</style>
