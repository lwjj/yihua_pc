<template>
<div class="newRightContent">
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/user/we_business' }">本楼业务</el-breadcrumb-item>
            <el-breadcrumb-item>楼圈管理</el-breadcrumb-item> 
        </el-breadcrumb>
         <div class="auditRight">
          <div>审核类型：{{bbsAuditType == 1?'事后审核':"事前审核"}}</div>
          <el-button type='primary' size="mini" @click="setAudit" v-if="!showBuild">设置</el-button>
        </div> 
    </div>
    <div class="layout">
        <div class="filtrate">
            <el-menu :default-active="activeIndex" 
                    class="el-menu-demo"
                    mode="horizontal" 
                    active-text-color="#1e82d2" 
                    @select="switchTab">
                    <el-menu-item index="1"><i class="el-icon-tickets"></i>帖子管理</el-menu-item>
                    <el-menu-item index="2"><i class="el-icon-circle-close"></i>黑名单</el-menu-item>
                </el-menu>
            <div class="block" v-show="showTie">
                <el-button type="primary" plain @click="pullBlack">加黑</el-button>
                <el-button type="danger" @click="closeTie">关闭帖子</el-button>
            </div>
            <div class="block" v-show="!showTie">
                <el-button type="danger" @click="removeBlack">移除</el-button>
            </div>
        </div>    
  <!-- 帖子管理表单 -->
  <div class="inform_table" v-show="showTie">
   <el-table
   border
    :data="tableData"
    :height="mHeight"
     @selection-change="handleSelectionChange"
    >
    <el-table-column
    align="center"
    type="selection"
    width="100"
      >
    </el-table-column>
    <el-table-column
      label="时间"
      width="180px"
      prop="createDate"
      >
      <!-- <template slot-scope="scope">
          <div>{{scope.row.organName}}</div>
      </template> -->
    </el-table-column>
    <el-table-column  
      label="企业"
      prop="organName"
      >
    </el-table-column>
    <el-table-column  
      label="标题"
      prop="title"
      >
    </el-table-column>
    <el-table-column  
      label="状态"
      align="center"
      prop="status"
      width="100px"
      :formatter="filterType"
      >
    </el-table-column>
    <el-table-column
        width="120"
        align="center"
      label="操作"
      >
      <template slot-scope="scope">
        <el-button type="primary" plain size="small" @click="turnTo('/user/we_business/building_manage/post_del/'+scope.row.guid)">详情</el-button>
      </template>
    </el-table-column>
  </el-table>
   <el-pagination
        v-if="rowCount"
        background
        style="float:right;margin-top:10px"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :page-size="12"
        :total="rowCount">
      </el-pagination>
 </div>


  <!-- 黑名单表单 -->
  <div class="inform_table" v-show="!showTie">
    <el-table
    border
      :data="tableData2"
      :height="mHeight"
      @selection-change="handleSelectionChange2"
      >
      <el-table-column
      align="center"
      type="selection"
      width="100"
        >
      </el-table-column>
      <el-table-column
        label="时间"
        prop="createDate"
        >
      </el-table-column>
      <el-table-column  
        label="机构名称"
        prop="organName"
        >
      </el-table-column>
      <el-table-column  
        label="客户名称"
        prop="blackUserIdName"
        >
      </el-table-column>
      <el-table-column  
        label="客户地址"
        prop="organAddr"
        >
      </el-table-column>
        <el-table-column
        label="操作"
        >
        <template slot-scope="scope">
          <el-button type="primary" plain size="small" @click="turnTo('/user/we_business/building_manage/post_del/'+scope.row.guid)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
          v-if="rowCount2"
          background
          style="float:right;margin-top:10px"
          @current-change="handleCurrentChange2"
          layout="prev, pager, next"
          :page-size="12"
          :total="rowCount2">
        </el-pagination>
  </div>  
  </div>
</div>
</template>
<script>
export default {
  data() {
    this.mHeight = tableHeight; // 定义的 window.tableHeight
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    return {
      showTie: true,
      bbsAuditType: "",
      activeIndex: "1",
      organInfo: {},
      userInfo: {},
      rowCount: "",
      rowCount2: "",
      tableData: [],
      tableData2: [],
      selectedOptions: [],
      bbsIdList: "",
      blackUserIds: ""
    };
  },
  computed: {
    rootList: function() {
      return this.$store.state.rootList;
    },
    showBuild() {
      var flag = false;
      console.log(this.rootList, this.rootList.weBusiness);
      if (!this.rootList || !this.rootList.weBusiness) {
        this.$getRoot(function() {}, this);
        return false;
      }
      for (let val of this.rootList.weBusiness.subclass) {
        if (val.alias === "circleManage") {
          if (val.subclass.length > 0) {
            flag = true;
          }
        }
      }
      return flag;
    }
  },
  methods: {
    // 获取审核状态
    getState() {
      this.$ajax(
        `${this.subUrl.user}/admin/accountManage/getBbsAuditType`,
        { token: this.$getkey() },
        res => {
          this.bbsAuditType = res.data.bbsAuditType;
        },
        this
      );
    },
    setAudit() {
      this.$confirm("请设置八爪圈审核类型", "提示", {
        type: "warning",
        confirmButtonText: "事后审核",
        cancelButtonText: "事前审核",
        distinguishCancelAndClose: true
      })
        .then(() => {
          this.$ajax(
            `${this.subUrl.user}/admin/accountManage/setBbsAuditType`,
            { token: this.$getkey(), bbsAuditType: 1 },
            res => {
              this.$message.success("设置成功");
              this.bbsAuditType = 1;
            },
            this
          );
        })
        .catch(res => {
          console.log(res);
          if (res == "cancel") {
            this.$ajax(
              `${this.subUrl.user}/admin/accountManage/setBbsAuditType`,
              { token: this.$getkey(), bbsAuditType: 2 },
              res => {
                this.$message.success("设置成功");
                this.bbsAuditType = 2;
              },
              this
            );
          }
        });
    },
    // back() {
    //   this.$router.go(-1);
    // },
    turnTo(e) {
      this.$router.push(e);
    },
    // 切换页面
    switchTab(index) {
      console.log(index, "index");
      if (index == 1) {
        this.showTie = true;
      } else if (index == 2) {
        this.showTie = false;
      }
    },
    // 过滤type   状态（1，正常,2，关闭(下架),3过期） ,
    filterType(row, column) {
      let date = row[column.property];
      if (date == 1) {
        return "正常";
      } else if (date == 2) {
        return "下架";
      } else if (date == 3) {
        return "过期";
      } else if (date == 4) {
        return "待审核";
      }
    },
    formatTime(row, column) {
      var date = row[column.property];
      return date.split(" ")[0];
    },

    // --------------帖子管理-----------------------
    // 选择帖子
    handleSelectionChange(val) {
      console.log(val, "tie");
      let arr = [];
      for (let ele of val) {
        arr.push(ele.guid);
      }
      this.bbsIdList = arr.join();
      console.log(this.bbsIdList, "bbsIdList");
    },
    // 下一页
    handleCurrentChange(pageNo) {
      this.getTieList(pageNo);
    },
    // 获取帖子列表
    getTieList(pageNo = 1) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        pageNo: pageNo,
        pageSize: "12"
      };
      this.$ajax(
        `${this.subUrl.sc}/bbs/manageBbs`,
        data,
        res => {
          console.log(res, "getTieList");
          this.tableData = res.data.list;
          this.rowCount = +res.data.rowCount;
        },
        this
      );
    },
    // 关闭帖子
    closeTie() {
      if (this.bbsIdList == "") {
        this.$message.error("请选择帖子");
        return;
      }
      var data = {
        token: this.$getkey(),
        bbsIdList: this.bbsIdList
      };
      this.$ajax(
        `${this.subUrl.sc}/bbs/closeBbsList`,
        data,
        res => {
          console.log(res, "closeTie");
          this.$message.success("关闭成功");
          this.bbsIdList = "";
          this.getTieList();
        },
        this
      );
    },
    // 加黑帖子
    pullBlack() {
      if (this.bbsIdList == "") {
        this.$message.error("请选择帖子");
        return;
      }
      this.$confirm(
        "加黑帖子即将发帖者加入黑名单，该用户不能继续发帖，确定加黑?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          //   center: true,
          type: "warning"
        }
      )
        .then(() => {
          let data = {
            token: this.$getkey(),
            userId: this.userInfo.guid,
            bbsIdList: this.bbsIdList
          };
          this.$ajax(
            `${this.subUrl.sc}/blackList/blackByManege`,
            data,
            res => {
              console.log(res, "pullBlack");
              this.$message.success("加黑成功");
              this.bbsIdList = "";
              this.getTieList(1);
              this.getBlack();
            },
            this
          );
        })
        .catch(() => {});
    },

    //-------------- 黑名单-----------------------
    // 选择黑名单帖子
    handleSelectionChange2(val) {
      console.log(val, "BLACK");
      let arr = [];
      for (let ele of val) {
        arr.push(ele.blackUserId);
      }
      this.blackUserIds = arr.join();
      console.log(this.blackUserIds, "blackUserIds");
    },
    // 下一页
    handleCurrentChange2(pageNo) {
      this.getBlack(pageNo);
    },
    // 获取黑名单列表
    getBlack(pageNo = 1) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        pageNo: pageNo,
        pageSize: "12"
      };
      this.$ajax(
        `${this.subUrl.sc}/blackList/listBlackList`,
        data,
        res => {
          console.log(res, "getBlack");
          this.tableData2 = res.data.list;
          this.rowCount2 = +res.data.rowCount;
        },
        this
      );
    },
    // 移除黑名单
    removeBlack() {
      if (this.blackUserIds == "") {
        this.$message.error("请选择用户");
        return;
      }
      var data = {
        token: this.$getkey(),
        blackUserIds: this.blackUserIds
      };
      this.$ajax(
        `${this.subUrl.sc}/blackList/removeBlackBatch`,
        data,
        res => {
          console.log(res, "removeBlack");
          this.$message.success("移除成功");
          this.blackUserIds = "";
          this.getBlack();
          this.getTieList(1);
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
    this.getTieList();
    this.getBlack();
    this.getState();
  }
};
</script>
<style lang="scss" scoped>
.auditRight {
  position: absolute;
  align-items: center;
  right: 290px;
  display: flex;
  white-space: nowrap;
  z-index: 3;
  top: 0;
  & > div {
    margin-right: 10px;
  }
}
#quality {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: auto;
  .text {
    i {
      padding: 20px 20px;
    }
  }
}

.filtrate {
  width: 100%;
  height: 60px;
  background: #fff;
  line-height: 60px;
  padding-left: 20px;
  .el-menu {
    float: left;
    .el-menu-item {
      padding: 0 30px;
    }
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

// emerType
.emerType {
  color: #888;
}
</style>