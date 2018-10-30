<template>
<div id='' class="whiteChoosePeople">
  <div class="chooseTitle clearfix">
    <el-button class="btn" type="primary" style="width:80px" size="small" @click="submit">确定</el-button>
  </div>
  <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"><span>{{buildingName}}</span></el-checkbox>
  <el-collapse v-model="activeNames">
  <el-collapse-item v-for="(item1,index1) in customerList" :key="index1" :title="item1.ridName" :name="index1" >
    <el-checkbox-group v-model="checkList" class="collapse" @change="handleCheckedCitiesChange">
      <ul class="">
        <li v-for="(item2,index2) in item1.buildingUnitList" :key="index2">
            <el-checkbox class="chooseBox" :label="item2.guid+','+item2.unitName" @change="checkSuccess">
              <span>{{item2.unitName}}</span>
              <span>{{item2.organName}}</span>
              <!-- <span>{{item2.account}}</span> -->
            </el-checkbox>
        </li>
      </ul>
    </el-checkbox-group>
  </el-collapse-item>
</el-collapse>
</div>
</template>
<script>
export default {
  data() {
    return {
      checkAll: false,
      isIndeterminate: true,
      buildingName: "",
      userInfo: "",
      organInfo: "",
      allCustomer: [],
      customerList: [],
      activeNames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      checkList: []
    };
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkList = val ? this.allCustomer : [];
      this.isIndeterminate = false;
      console.log(this.checkList);
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.allCustomer.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.allCustomer.length;
      console.log(this.checkList);
    },
    checkSuccess(val) {
      console.log(val);
      console.log(this.checkList);
    },
    // 提交
    submit() {
      this.$emit("checkMen", this.checkList);
    },
    // 获取客户
    getCustomer() {
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/noticeBill/getCustomerInfo`,
        data,
        res => {
          console.log(res, "customer");
          this.buildingName = res.data.buildingName;
          this.customerList = res.data.organBuildingRid;
          console.log(this.customerList);
          res.data.organBuildingRid.forEach(ele => {
              console.log(ele)
            ele.buildingUnitList.forEach(ele2 => {
              this.allCustomer.push(ele2.guid + "," + ele2.unitName);
            });
          });
          console.log(this.allCustomer,"allCustomer")
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
    this.getCustomer();
  }
};
</script>
<style lang="scss" scoped>
.chooseTitle {
  .btn {
    float: right;
  }
}

#choose_people {
  margin: 0!important;
}
.chooseBox {
  span {
    display: inline-block;
    padding: 10px;
  }
}
</style>