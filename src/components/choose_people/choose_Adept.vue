<template>
<div id='' class="whiteChoosePeople">
  <div class="chooseTitle clearfix">
    <el-button class="btn" type="primary" style="width:80px" size="small" @click="submit">确定</el-button>
  </div>
<!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"><span>全选</span></el-checkbox> -->
<!-- <div style="margin: 10px 0;"></div> -->
    <el-radio-group v-model="radio" class="collapse" >
        <ul class="">
        <li v-for="(item,index) in organList" :key="index">
            <el-radio class="chooseBox" :label="item.guid+','+item.deptName" @change="checkSuccess" >
              <span>{{item.deptName}}</span>
            </el-radio>
        </li>
      </ul>
    </el-radio-group>
      
</div>
</template>
<script>
export default {
  data() {
    return {
      checkAll: false,
      isIndeterminate: true,
      userInfo: "",
      organInfo: "",
      organList: "",
      radio: ""
    };
  },
  methods: {
    checkSuccess(val) {
      console.log(this.radio);
    },
    // 提交
    submit() {
      this.$emit("checkMen", this.radio);
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
#choose_people {
  margin-top: 20px;
  padding: 20px;
  background: #fff;
}
#choose_people {
  margin: 0 !important;
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