<template>
<div class="main bgwhite">
  <div class="chooseTitle clearfix">
    <el-button class="btn" type="primary" style="width:80px" size="small" @click="submit">确定</el-button>
    <el-button class="btn mr2" type="primary" plain style="width:80px" size="small" @click="back">返回</el-button>
  </div>
  <div class="contentBox">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"><span>全选</span></el-checkbox>
    <div style="margin: 10px 0;"></div>
      <el-checkbox-group v-model="checkList" class="collapse" @change="handleCheckedCitiesChange">
          <ul class="">
          <li v-for="(item,index) in tableData" :key="index">
              <el-checkbox class="chooseBox" :label="item.guid" @change="checkSuccess" >
                <span>{{item.organName}}</span>
                <span>{{item.organAddress}}</span>
                <span>{{item.phone}}</span>
              </el-checkbox>
          </li>
        </ul>
      </el-checkbox-group>
  </div>
  
      
</div>
</template>
<script>
export default {
  data() {
    return {
      rowCount: "",
      checkAll: false,
      isIndeterminate: true,
      allList: [],
      userInfo: "",
      organInfo: "",
      organList: "",
      checkList: [],
      tableData: []
    };
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkList = val ? this.allList : [];
      this.isIndeterminate = false;
      console.log(this.checkList);
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.allList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.allList.length;
      console.log(this.checkList);
    },
    checkSuccess(val) {
      console.log(this.checkList);
    },
    back() {
      this.$emit("back");
    },
    // 提交
    submit() {
//    if (this.checkList.length == 0) {
//      this.$message.error("请选择商家");
//      return;
//    }
      this.$emit("selectSuccess", this.checkList);
    },

    // 获取列表
    getList(pageNo = 1) {
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid,
        type: "",
        classId: "",
        pageNo: pageNo,
        pageSize: "10000000"
      };
      this.$ajax(
        `${this.subUrl.bd}/buildingBuy/manageSupplierList`,
        data,
        res => {
          console.log(res, "getList");
          res.data.list.forEach(ele => {
            this.allList.push(ele.guid);
          });
          this.tableData = res.data.list;
          this.rowCount = +res.data.rowCount;
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
    this.getList();
  }
};
</script>
<style lang="scss" scoped>
.contentBox {
  height: calc(100% - 50px);
  overflow-y: auto;
}
.main {
  padding: 10px;
  height: 100%;
}
.chooseTitle {
  .btn {
    float: right;
  }
}
.chooseBox {
  span {
    display: inline-block;
    padding: 10px;
  }
}
</style>