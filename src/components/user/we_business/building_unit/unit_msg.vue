<template>
<div id='inform_del' >
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>物业关系详情</div> -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/user/we_business' }">本楼业务</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/user/we_business/building_unit/building_unit' }">楼宇管理</el-breadcrumb-item>
            <el-breadcrumb-item>房屋信息</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
      
   <div class="layout" v-if="loading">
        
        <el-tabs class="tabtransform" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(item,index) in ridList" :key="index" :label="item.ridName" :name="String(index)">
            <el-button type="primary" class="floatR" size="" @click="openUnit(item.guid)">添加单元</el-button>
            <el-button type="primary" class="floatR mr2" size="" @click="openAddRid">添加栋</el-button>
            <el-button type="primary" class="floatR mr2" size="" @click="openEditRid(item)">编辑此栋</el-button>
                  <!-- 租户信息表单 --> 
              <div class="inform_table">
                <el-table
                  :data="item.buildingUnitList"
                  border
                  height="700"
                  width="100%"
                  @selection-change="handleSelectionChange"
                  >
                   <el-table-column
                  align="center"
                  type="selection"
                  width="100"
                    >
                  </el-table-column>
                  <el-table-column
                  header-align="center"
                    prop="unitName"
                    label="房间号"
                    >
                  </el-table-column>
                  <el-table-column
                  header-align="center"
                    prop="ownerInfo.name"
                    label="业主姓名"
                    >
                  </el-table-column>
                  <el-table-column
                  header-align="center"
                    prop="ownerInfo.account"
                    label="联系电话"
                    >
                  </el-table-column>
                  <el-table-column
                  header-align="center"
                  label="操作"
                    >
                    <template slot-scope="scope">
                          <el-button type="primary" plain size="small" @click="editUnit(item.buildingUnitList[scope.$index])">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            <el-button type="danger" style="" size="" @click="deleteUnit">删除</el-button>
            <el-button type="danger" class="mr2" size="" @click="deleteRid">删除此栋</el-button>
          </el-tab-pane>
        </el-tabs>
</div>
      <!-- 添加栋 编辑栋 -->
            <el-dialog title="新增栋名称" :visible.sync="dialogFormVisible" width="450px" top="15vh">
        <el-form>
          <el-form-item label="">
            <el-input v-model="ridName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRid">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加 编辑 单元 -->
           <el-dialog :title="subtitle+'单元 '+'（ '+ridTitle+' ）'" :visible.sync="dialogFormVisible2" width="500px" top="15vh">
        <el-form label-width="80px">
          <el-form-item label="单元名称">
            <el-input v-model="unitName"></el-input>
          </el-form-item>
          <el-form-item label="建筑面积">
            <el-input v-model="areas"></el-input>
          </el-form-item>
          <el-form-item label="业主姓名">
            <el-input v-model="ownName"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="phone" :maxlength="11"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="addUnit">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑 -->

</div>
</template>
<script>
export default {
  data() {
    return {
      regPhone: /^1[3578]\d{9}$/,
      loading: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      activeName: "0",
      del: {},
      ridList: [],
      ridName: "",
      rigID: "",
      unitName: "",
      unitId: "",
      areas: "",
      ownName: "",
      phone: "",
      ridTitle: "",
      subtitle: "",
      isAdd: "",
      isAddRid: "",
      unitIds: ""
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      this.ridTitle = tab.label;
      this.rigID = this.ridList[tab.index].guid;
    },
    // 复选框
    handleSelectionChange(val) {
      console.log(val, "val");
      let arr = [];
      for (let ele of val) {
        arr.push(ele.guid);
      }
      this.unitIds = arr.join();
      console.log(this.unitIds, "unitIds");
    },
    // 删除单元
    deleteUnit() {
      if (this.unitIds == "") {
        this.$message.error("请选择单元");
        return;
      }
      this.$confirm("是否删除所选单元?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        // center: true,
        type: "warning"
      })
        .then(() => {
          // 请求
          let data = {
            token: this.$getkey(),
            unitIds: this.unitIds
          };
          this.$ajax(
            `${this.subUrl.user}/buildingUnit/batchDelUnit`,
            data,
            res => {
              console.log(res, "deleteUnit");
              this.$message.success("删除成功");
              this.getRid();
            },
            this
          );
        })
        .catch(() => {});
    },
    // 编辑栋界面
    openEditRid(item) {
      this.dialogFormVisible = true;
      this.ridName = item.ridName;
      this.isAddRid = 0;
    },
    // 添加栋界面
    openAddRid() {
      this.dialogFormVisible = true;
      this.isAddRid = 1;
    },
    // 删除栋
    deleteRid() {
      this.$confirm("是否删除栋?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        // center: true,
        type: "warning"
      })
        .then(() => {
          let data = {
            token: this.$getkey(),
            ridId: this.rigID
          };
          this.$ajax(
            `${this.subUrl.user}/buildingUnit/delRid`,
            data,
            res => {
              console.log(res, "deleteRid");
              this.getRid();
              this.$message({
                type: "success",
                message: "删除成功"
              });
            },
            this
          );
        })
        .catch(() => {});
    },
    // 添加栋 编辑栋
    addRid() {
      if (this.ridName == "") {
        this.$message.error("请输入新增栋名称");
        return;
      }
      if (this.isAddRid == 1) {
        let data = {
          token: this.$getkey(),
          rigName: this.ridName
        };
        this.$ajax(
          `${this.subUrl.user}/buildingUnit/addRid`,
          data,
          res => {
            console.log(res, "addRid");
            this.dialogFormVisible = false;
            this.getRid();
            this.$message({
              type: "success",
              message: "添加成功"
            });
          },
          this
        );
      } else if (this.isAddRid == 0) {
        let data = {
          token: this.$getkey(),
          rigId: this.rigID,
          rigName: this.ridName
        };
        this.$ajax(
          `${this.subUrl.user}/buildingUnit/editRid`,
          data,
          res => {
            console.log(res, "editRid");
            this.dialogFormVisible = false;
            this.getRid();
            this.$message({
              type: "success",
              message: "修改成功"
            });
          },
          this
        );
      }
    },
    //添加单元界面
    openUnit(guid) {
      this.unitName = "";
      this.areas = "";
      this.ownName = "";
      this.phone = "";
      this.isAdd = 1;
      console.log(guid, "guid");
      this.subtitle = "新增";
      this.dialogFormVisible2 = true;
      this.rigID = guid;
    },
    // 编辑单元界面
    editUnit(item) {
      this.isAdd = 0;
      console.log(item, "单元信息");
      this.subtitle = "编辑";
      this.unitName = item.unitName;
      this.areas = item.areas;
      this.ownName = item.ownerInfo.name;
      this.phone = item.ownerInfo.account;
      this.unitId = item.guid;
      this.rigID = item.ridId;
      this.dialogFormVisible2 = true;
    },
    // 添加单元 编辑单元
    addUnit() {
      if (this.unitName == "") {
        this.$message.error("请输入单元名称");
        return;
      } else if (this.areas == "") {
        this.$message.error("请输入建筑面积");
        return;
      } else if (this.ownName == "") {
        this.$message.error("请输入业主姓名");
        return;
      } else if (this.phone == "") {
        this.$message.error("请输入手机号码");
        return;
      } else if (!this.regPhone.test(this.phone)) {
        this.$message.error("手机号格式错误");
        return;
      }
      // 添加
      if (this.isAdd == 1) {
        console.log(11111);
        let data = {
          token: this.$getkey(),
          unitName: this.unitName,
          rigID: this.rigID,
          phone: this.phone,
          userName: this.ownName,
          areas: this.areas
        };
        this.$ajax(
          `${this.subUrl.user}/buildingUnit/addUnit`,
          data,
          res => {
            console.log(res, "addUnit");
            this.dialogFormVisible2 = false;
            this.getRid();
            this.$message({
              type: "success",
              message: "添加成功"
            });
          },
          this
        );
      } else if (this.isAdd == 0) {
        // 编辑
        console.log(222);

        let data2 = {
          token: this.$getkey(),
          unitName: this.unitName,
          unitId: this.unitId,
          rigID: this.rigID,
          phone: this.phone,
          userName: this.ownName,
          areas: this.areas
        };
        this.$ajax(
          `${this.subUrl.user}/buildingUnit/editUnit`,
          data2,
          res => {
            console.log(res, "addUnit");
            this.dialogFormVisible2 = false;
            this.getRid();
            this.$message.success("修改成功");
          },
          this
        );
      }
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
          this.ridList = res.data;
          this.ridTitle = res.data[0].ridName;
          this.rigID = res.data[0].guid;
          this.loading = true;
        },
        this
      );
    }
  },
  mounted() {
    this.getRid();
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

.inform_table {
  background: #fff;
  text-align: center;
  padding: 0;
  margin: 0;
}
.msg_title {
  text-align: left;
  padding: 10px 40px;
}
.tabtransform {
  background: #fff;
  padding: 20px 20px 0 40px;
}
</style>