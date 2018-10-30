<template>
<div id='' class="whiteChoosePeople">
  <div class="chooseTitle clearfix">
    <el-button class="btn" type="primary"  size="small" @click="open2">确定</el-button>
  </div>
  <div class="centerBox" style="margin-top: 50px;">
  	<el-collapse v-model="activeNames" >
  <el-collapse-item v-for="(item,index) in organList" :key="index" :title="item.deptName" :name="index" >
    <el-checkbox-group v-model="checkList" class="collapse">
      <ul class="">
        <li v-for="(item2,index2) in item.empList" :key="index2">
            <el-checkbox class="chooseBox" :label="item2.userId+','+item2.userName" @change="checkSuccess">
              <span>{{item2.userName}}</span>
              <span>{{item2.post}}</span>
              <span>{{item2.account}}</span>
            </el-checkbox>
        </li>
      </ul>
    </el-checkbox-group>
  </el-collapse-item>
</el-collapse>
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: "",
      organInfo: "",
      organList: "",
      activeNames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      checkList: [],
      type: "",
      deptId: ""
    };
  },
  methods: {
    open2() {
        this.$confirm('确定指派所选人员完成此项工作', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submit()
          // this.$message({
          //   type: 'success',
          //   message: '指派成功!'
          // });
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消操作'
          // });          
        });
      },
    checkSuccess(val) {
      console.log(val);
      console.log(this.checkList);
    },
    // 提交
    submit() {

      this.$emit("checkMen", this.checkList);
    },
    // 获取机构部门人员
    getOrganMan() {
      //默认全部 1：查询员工， 2：查询经理
      // console.log(this.userInfo.postType,"postType")
//    if (this.userInfo.postType == 2) {
//      //主任
//      this.type = 2;
//    } else if (this.userInfo.postType == 3) {
//      // 经理
//      this.type = 1;
//      this.deptId = this.userInfo.deptId;
//    }
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid
//      deptId: this.deptId,
//      type: this.type
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
.whiteChoosePeople {
  height: 100%;
  background: #fff;
  .centerBox {
    height: calc(100% - 50px);
    overflow-y: auto;
  }
  .chooseTitle {
    height: 35px;
    position: fixed;
    z-index: 1000;
    background: #fff;
    .btn {
      float: left;
    }
  }
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