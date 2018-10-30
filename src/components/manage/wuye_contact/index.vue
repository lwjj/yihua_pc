<template>
<div id='quality'>
    <div class="title">
        <div class="text">物业往来</div>
    </div>
    <div class="layout">
          
    <div class="header">
        <!-- <div>状态: <span>绑定公司</span> </div> -->
       <!-- tab切换 -->
      <el-menu :default-active="activeIndex" 
      class="el-menu-demo"
       mode="horizontal" 
       text-color="#777"
       router
       active-text-color="#1e82d2" 
       @select="handleSelect">
          <el-menu-item index="/manage/wuye_contact/project_rep/project_rep">项目月报</el-menu-item>
          <el-menu-item index="/manage/wuye_contact/wuye_audit/wuye_audit">物业稽查</el-menu-item>
          <el-menu-item index="/manage/wuye_contact/wuye_inform/wuye_inform">物业通知</el-menu-item>
          <el-menu-item index="/manage/wuye_contact/rela_manage/rela_manage">关系管理</el-menu-item>
      </el-menu>
    </div>
    <router-view> </router-view>
</div>
</div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex:this.$route.path,
      userInfo: {},
      organInfo: {},
      dateValue: "",
      tableData: [],
    };
  },
    methods: {
      turnTo(e) {
        this.$router.push(e);
      },
    handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      //获取品质稽查类型
      getQualiType(){
         this.$ajax(
          `${this.subUrl.user}/comm/queryExamineCategory`,
          "",
          res => {
            console.log(res, "qualitype");
            var obj ={dictDataName:"所有类型",dictDataValue:""}
            res.data.JCC.unshift(obj)
            this.qualiTypeList = res.data.JCC;
          },
          this
        );
      },
      // 获取品质稽查列表
      getQuality() {
        var date1, date2;
        if (this.dateValue) {
          date1 = this.dateValue[0] + " 00:00:00";
          date2 = this.dateValue[1] + " 00:00:00";
        }
        var data = {
          token: this.$getkey(),
          organId: this.organInfo.guid,
          startDate: date1,
          endDate: date2,
          type: this.qualityId,
        };
        console.log(data, "qualitydata");
        this.$ajax(
          `${this.subUrl.activity}/examine/listExamineBill`,
          data,
          res => {
            console.log(res, "quali");
            this.tableData = res.data.list;
          },
          this
        );
      },
      // 过滤稽核类型(1，交叉检查；2，联合检查)
      formatType(val) {
       // console.log(val)
        if (val.type == 1) {
          return "交叉检查";
        } else if (val.type == 2) {
          return "联合检查";
        }
      },
      //时间格式化
      formatTime(row, column) {
        var date = row[column.property];
        return date.split(" ")[0];
      }
    },
    mounted() {
      // this.userInfo = JSON.parse(
      //   decodeURIComponent(localStorage.getItem("userInfo"))
      // );
      // this.organInfo = JSON.parse(
      //   decodeURIComponent(localStorage.getItem("organInfo"))
      // );
      // console.log(this.userInfo);
      // console.log(this.organInfo);
      //  this.getQualiType()
      // this.getQuality();
    }
  
};
</script>
<style lang="scss" scoped>
#quality {
  // height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: scroll;
}
.header {
  width: 100%;
  height: 60px;
  background: #fff;
  line-height: 60px;  
  text-align: center;
}
.el-menu-demo{
  li{
    margin: 0 40px;
  }
}
.wuyeMenu {
  width: 100%;
  // height: 60px;
  // line-height: 60px;
  padding: 20px 100px;
  background: #fff;
  margin-top: 20px;
  ul li {
    float: left;
    width: 25%;
    a{
      display: inline-block;
    }
    .imgBox{
      width: 50px;
      height: 50px;
      img{
        height: 100%;
      }
    }
    .text{
      color: #888;
      padding: 5px 0;
    }
  }
}
.inform_table {
  padding-left: 20px;
  text-align: center;
  .el-table {
    font-size: 15px;
  }
}
// emerType
.emerType{
  color: #888;
}
</style>