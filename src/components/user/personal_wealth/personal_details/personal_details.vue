<template>
    <div class="bottom">
        <div>
            <router-link to="/user/personal_wealth/personal_details/personal_ticketRecord">
                <el-button :autofocus="true"><a>兑换记录</a></el-button>
            </router-link>
        </div>
        <div>
            <router-link to="/user/personal_wealth/personal_details/personal_prepaidPhoneRecords">
                <el-button>充值记录</el-button>
            </router-link>    
        </div>
        <div>
            <router-link to="/user/personal_wealth/personal_details/personal_integralSubsidiary">    
                <el-button>积分明细</el-button>
            </router-link>
        </div>
        <div>
            <router-link to="/user/personal_wealth/personal_details/personal_InviteBusinessmen">    
                <el-button>邀请商家</el-button>
            </router-link>
        </div>
        <div>
            <router-link to="/user/personal_wealth/personal_details/personal_blackstone">    
                <el-button>百事通</el-button>
            </router-link>
        </div>
        <div>
            <router-link to="/user/personal_wealth/personal_details/personal_seeBusiness">    
                <el-button>查看商机</el-button>
            </router-link>
        </div>
        <div>   
            <router-link to="/user/personal_wealth/personal_details/personal_otherConsumer">    
                <el-button>其他消费</el-button>
            </router-link>    
        </div>
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
  padding: 10px;
}
.bottom {
  position: absolute;
  left: 10px;
  right: 0;
  top: 130px;
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

