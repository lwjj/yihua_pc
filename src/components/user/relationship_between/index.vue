<template>
    <div id="wealth">
        <div class="title">
            <div class="text">关系管理</div>
        </div>
        <div class="box"> 
            <div class="first1">
                <el-table :data="tableData1" border height="100%" style="width: 100%">
                    <el-table-column fixed prop="organName" show-overflow-tooltip label="管理处名称" min-width="15%"></el-table-column>
                    <el-table-column prop="buildingName" show-overflow-tooltip label="写字楼名称" min-width="15%"></el-table-column>
                    <el-table-column prop="address" show-overflow-tooltip label="管理处地址" min-width="15%"></el-table-column>
                    <el-table-column prop="area" label="建筑面积(平米)" :formatter="formatArea" width="120"></el-table-column>
                    <el-table-column prop="director" show-overflow-tooltip label="写字楼主任" min-width="10%"></el-table-column>
                    <el-table-column prop="name" show-overflow-tooltip label="管理处主任" min-width="15%"></el-table-column>
                    <el-table-column prop="account" label="手机号码" min-width="10%"></el-table-column>
                    <el-table-column prop="status" label="状态" min-width="8%"></el-table-column>
                    <el-table-column fixed="right" label="操作" min-width="5%">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" type="text" size="small">
                                {{isBind}}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
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
      tableData1: [],
      isBind: ""
    };
  },
  methods: {
    formatArea(a, b, c) {
      return c ? c : "无";
    },
    getMain() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/ownersCom/relation/info`,
        data,
        res => {
          if (res.data.managementInfo !== null) {
            this.tableData1.push(res.data.managementInfo);
            this.tableData1[0].director = res.data.ownersComInfo.name;
            this.tableData1[0].ownersOrganId = res.data.ownersComInfo.organId;
            console.log(this.tableData1);
            if (res.data.status == 1) {
              this.tableData1[0].status = "已绑定";
              this.isBind = "解绑";
            } else {
              this.tableData1[0].status = "未绑定";
              this.isBind = "绑定";
            }
          }
        },
        this
      );
    },
    select(val) {
      this.getMain(val);
    },
    handleClick(row) {
      if (this.isBind == "绑定") {
        var data = {
          token: this.$getkey(),
          organId: row.ownersOrganId
        };
        this.$ajax(
          `${this.subUrl.activity}/ownersCom/relation/bind`,
          data,
          res => {
            if (res.code == 1) {
              this.$message({
                message: "绑定成功",
                type: "success"
              });
              this.tableData1 = [];
              this.getMain();
            }
          },
          this
        );
      } else {
        var data = {
          token: this.$getkey(),
          organId: row.ownersOrganId
        };
        this.$ajax(
          `${this.subUrl.activity}/ownersCom/relation/unbind`,
          data,
          res => {
            if (res.code == 1) {
              this.$message({
                message: "解绑成功",
                type: "success"
              });
              this.tableData1 = [];
              this.getMain();
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
    this.getMain();
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
    background: #fff;
    .first1 {
      height: 100%;
      padding: 10px 0;
    }
  }
}
</style>
