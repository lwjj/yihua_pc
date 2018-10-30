<template>
<div id='' class="whiteChoosePeople">
  <div class="chooseTitle clearfix">
    <el-button class="btn" type="primary" size="small" @click="submit">确定</el-button>
  </div>
  <div class="centerBox" style="margin-top: 50px;">
    <el-collapse v-model="activeNames" style='overflow: hidden;'>
      <el-collapse-item v-for="(item,index) in organList" :key="index" :title="item.deptName" :name="index" >
        <!-- <el-checkbox-group v-model="checkList" class="collapse">
          <ul class="">
            <li v-for="(item2,index2) in item.empList" :key="index2">
                <el-checkbox class="chooseBox" :label="item2.userId+','+item2.userName" @change="checkSuccess">
                  <span>{{item2.userName}}</span>
                  <span>{{item2.post}}</span>
                  <span>{{item2.account}}</span>
                </el-checkbox>
            </li>
          </ul>
        </el-checkbox-group> -->
        <el-radio-group v-model="radio">
            <ul class="">
            <li v-for="(item2,index2) in item.empList" :key="index2">
                <el-radio class="chooseBox" :label="item2.userId+','+item2.userName" @change="checkSuccess">
                  <span>{{item2.userName}}</span>
                  <span>{{item2.post}}</span>
                  <span>{{item2.account}}</span>
                </el-radio>
            </li>
          </ul>
      </el-radio-group>
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
      radio: ""
    };
  },
  methods: {
    checkSuccess() {
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

#choose_Aemploy {
  margin: 0 !important;
}
.chooseBox {
  span {
    display: inline-block;
    padding: 10px;
  }
}
</style>