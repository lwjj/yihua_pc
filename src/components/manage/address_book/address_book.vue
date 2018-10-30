<template>
<div id='choose_people'>
  <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/work'}">工作管理</el-breadcrumb-item>
            <el-breadcrumb-item>通讯录</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <el-collapse v-model="activeNames" accordion>
        <el-collapse-item v-for="(item,index) in organList" :key="index" :title="item.deptName" :name="index" >
            <div class="collapse">
                <ul>
                    <li v-for="(item2,index2) in item.empList" :key="index2">         
                        <span>{{item2.userName}}</span>
                        <span>{{item2.account}}</span>
                    </li>
                </ul>
            </div>
        </el-collapse-item>
    </el-collapse>
</div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: "",
      organInfo: "",
      organList: "",
      activeNames: [0],
      checkList: []
    };
  },
  methods: {
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
  margin-left: 260px;
}
.chooseBox {
  span {
    display: inline-block;
    padding: 10px;
  }
}
.collapse ul li {
  padding: 10px;
  display: flex;
  align-items: center;
  span {
    font-size: 12px;
  }
  span:nth-child(1) {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 120px;
  }
  &:hover {
    background: #f1f1f1;
  }
}
</style>