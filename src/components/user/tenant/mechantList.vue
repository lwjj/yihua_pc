<template>
<div id='' class="whiteChoosePeople">
  <div class="title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native='$router.go(-1)'>返回</el-breadcrumb-item>
        <el-breadcrumb-item>选择商家</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  <div class="chooseTitle clearfix">
    <el-button class="btn" type="primary" style="width:80px" size="small" @click="submit(1)">确定</el-button>
    <el-button class="btn mr2" type="primary" plain style="width:80px" size="small" @click="submit(0)">返回</el-button>
  </div>
<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"><span>全选</span></el-checkbox>
<div style="margin: 10px 0;"></div>
    <el-checkbox-group v-model="checkList" class="collapse" @change="handleCheckedCitiesChange">
        <ul class="">
        <li v-for="(item,index) in organList" :key="index">
            <el-checkbox class="chooseBox" :label="item.optUserId"  @change="checkSuccess" >
              <span>{{item.organName}}</span>
            </el-checkbox>
        </li>
      </ul>
    </el-checkbox-group>
    <!--<el-pagination
        background
        v-if="pageCount>0"
        @current-change='changePage'
        layout="prev, pager, next"
        :page-count="pageCount">
    </el-pagination>-->
    <!--<div class="">
        <el-button class="btn" type="primary" style="width:80px" size="small" @click="submit(1)">确定</el-button>
        <el-button class="btn" type="danger" style="width:80px" size="small" @click="submit(0)">取消</el-button>
  </div> -->
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
      pageCount: 1,
      activeNames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      checkList: []
    };
  },
  methods: {
    changePage(e) {
      this.pageNo = e;
      this.organList = [];
      this.allList = [];
      this.checkAll = false;
      this.checkList = [];
      this.getOrganMan();
    },
    handleCheckAllChange(val) {
      this.checkList = val ? this.allList : [];
      this.isIndeterminate = false;
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
    submit(e) {
      if (e) {
        if (this.checkList.length == 0) {
          return this.$message.error("请选择供应商");
        }
        this.$emit("checkMen", this.checkList);
      } else {
        this.$emit("checkMen");
      }
    },
    // 管理处供应商
    getOrganMan() {
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid,
        pageNo: this.pageNo
      };
      this.$ajax(
        `${this.subUrl.bd}/buildingBuy/manageSupplierList`,
        data,
        res => {
          console.log(res, "OrganMan");
          this.organList = res.data.list;
          this.pageCount = res.data.pageCount * 1;
          res.data.list.forEach(ele => {
            this.allList.push(ele.guid);
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
#choose_people {
  margin-top: 20px;
  padding: 20px;
  background: #fff;
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