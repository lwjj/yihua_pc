<template>
<div id='inform_del' v-if="loading">
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>物业关系详情</div> -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/user/we_business' }">本楼业务</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/user/we_business/building_unit/building_unit' }">楼宇管理</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
        <div class="del_top">
          <div>状态：
             <!-- 状态  0:空置; 1:使用中; 2:装修; 3:欠费; 4:未收楼; 5:出租中 , -->
              <span class="idea" v-if="del.status==0">空置</span>
              <span class="idea" v-if="del.status==1">使用中</span>
              <span class="idea" v-if="del.status==2">装修</span>
              <span class="idea" v-if="del.status==3">欠费</span>
              <span class="idea" v-if="del.status==4">未收楼</span>
              <span class="idea" v-if="del.status==5">出租中</span>
            </div>
        </div>
    <div class="del">
        <div class="del_title">
            <h4>房屋信息</h4>
        </div>
      <ul class="delList clearfix">
        <li>房屋单元：<span>{{del.ridName}}{{del.unitName}}</span></li>
        <li>建筑面积：<span>{{del.area}}（平方米）</span></li>
        <li>业主姓名：<span>{{del.userInfo.name}}</span></li>
        <li>联系电话：<span>{{del.userInfo.account}}</span></li>
      </ul>
    </div>
   
     <!-- 租户信息表单 -->
<div class="inform_table" v-if="del.lesseeLogList.length!=0">
    <h4 class="msg_title">租户信息</h4>
   <el-table
    :data="del.lesseeLogList"
    border
    >
    <el-table-column
    header-align="center"
    label="客户名称"
    prop="organName"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="startDate"
      label="入驻日期"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="endDate"
      label="退租日期"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="contacts"
      label="联系人"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="tel"
      label="联系电话"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="industry"
      label="从事行业"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
    label="是否续签"
      >
      <template slot-scope="scope">
          <div v-text="scope.row.renew==0?'否':'是'"></div>
      </template>
    </el-table-column>
  </el-table>
 </div>

     <!-- 抄表信息表单 -->
<div class="inform_table" v-if="del.meterReadList.length!=0">
    <h4 class="msg_title">抄表信息</h4>
   <el-table
    :data="del.meterReadList"
    border
    >
    <el-table-column
    header-align="center"
    label="抄表日期"
    prop="meterRead"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="project"
      label="抄表项目"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="dosage"
      label="计量"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="meterReadUsername"
      label="抄表人"
      >
    </el-table-column>
  </el-table>
</div>


</div>
</template>
<script>
export default {
  data() {
      return {
      loading:false,
      del:{},
    };
  },
  methods: {
    //    back() {
    //   this.$router.go(-1);
    // },
    //请求详情页面
    getDel() {
      var data = {
        token: this.$getkey(),
        unitId: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.user}/buildingUnit/detail`,
        data,
        res => {
          console.log(res, "getDel");
          this.del = res.data;
          this.loading = true;
        },
        this
      );
    }
   
  },
  mounted() {
    this.getDel();
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
.del_top{
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #fff;
  padding:0 20px;
}
.del_title {
  // font-size: 16px;
  // font-weight: 700;
  margin-top: 20px;
  padding: 10px 40px;
  background: #fff;
  border-bottom: 1px solid #ccc;
  .idea {
    padding-left: 100px;
    font-weight: 400;
    font-size: 15px;
  }
}
.delList {
  background: #fff;
  padding: 20px 50px;
  li {
    width: 50%;
    padding: 5px 0;
    float: left;
  }
  span {
    padding-left: 20px;
  }
}
.inform_table{
    background: #fff;
    padding: 0;
    text-align: center;
}
.msg_title{
    text-align: left;
    padding: 10px 40px;
}
</style>