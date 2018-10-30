<template>
<div id='' class="whiteChoosePeople">
  <div class="chooseTitle clearfix">
    <el-button class="btn" type="primary" style="width:80px" size="small" @click="submit">确定</el-button>
  </div> 
  <div class="centerBox">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"><span>全选</span></el-checkbox>
    <div style="margin: 10px 0;"></div>
      <el-checkbox-group v-model="checkList" class="collapse" @change="handleCheckedCitiesChange">
          <ul class="">
          <li v-for="(item,index) in organList" :key="index">
              <el-checkbox class="chooseBox" :label="item.guid+','+item.deptName" @change="checkSuccess" >
                <span>{{item.deptName}}</span>
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
      checkAll: false,
      isIndeterminate: true,
      allList: [],
      userInfo: "",
      organInfo: "",
      organList: "",
      activeNames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      checkList: []
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
      //   console.log(val)
      console.log(this.checkList);
    },
    // 提交
    submit() {
      this.$emit("checkMen", this.checkList);
    },
    // 获取机构部门人员
    getOrganMan() {
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/admin/deptManage/organDepartmentInfo`,
        data,
        res => {
          console.log(res, "OrganMan");
          this.organList = res.data;
          res.data.forEach(ele => {
            this.allList.push(ele.guid + "," + ele.deptName);
          });
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
    this.getOrganMan();
  }
};
</script>
<style lang="scss" scoped>
.whiteChoosePeople {
  height: 100%;
  background: #fff;
  .centerBox{
    height: calc(100% - 50px);
    overflow-y: auto;
  }
}
#choose_people {
  margin-top: 20px;
  padding: 20px;
  background: #fff;
}
.chooseTitle {
  height: 35px;
  position: fixed;
  z-index: 1000;
  .btn {
    float: left;
  }
}
.chooseBox {
  span {
    display: inline-block;
    padding: 10px;
  }
}
</style>