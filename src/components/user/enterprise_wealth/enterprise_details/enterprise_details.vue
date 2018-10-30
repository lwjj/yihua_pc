<template>
    <div class="bottom">
        <el-row :gutter="20">
            <el-col :span="4">
                <router-link to="/user/enterprise_wealth/enterprise_details/enterprise_ticketRecord">
                    <el-button :autofocus="true"><a>兑换记录</a></el-button>
                </router-link>
            </el-col>
            <el-col :span="4" >
                <router-link to="/user/enterprise_wealth/enterprise_details/enterprise_prepaidPhoneRecords">
                    <el-button>充值记录</el-button>
                </router-link>    
            </el-col>
            <el-col :span="4" >
                <router-link to="/user/enterprise_wealth/enterprise_details/enterprise_incomeDetails">    
                    <el-button>收入明细</el-button>
                </router-link>
            </el-col>
            <el-col :span="4">   
                <router-link to="/user/enterprise_wealth/enterprise_details/enterprise_statement">    
                    <el-button>消费明细</el-button>
                </router-link>    
            </el-col>
        </el-row>
        <router-view></router-view>            
    </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.tR_box {
  height: calc(100% - 100px);
  margin: 0 !important;
  width: 100% !important;
  padding: 10px;
}
.bottom {
  position: absolute;
  left: 10px;
  right: 0;
  top: 111px;
  height: auto !important;
  overflow: auto;
  .el-col {
    min-width: 100px;
  }
  bottom: 0;
  margin: 0 !important;
  div {
    margin-left: 10px;
    margin-top: 10px;
    float: left;
  }
}
.router-link-active {
  .el-button {
    background: rgb(236, 245, 255);
    border-color: rgb(198, 226, 255);
    a {
      color: rgb(64, 158, 255);
    }
  }
}
</style>

