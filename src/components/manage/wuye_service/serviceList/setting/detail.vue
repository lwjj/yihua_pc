<template>
  <div class="main">
    <div class="title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
          <el-breadcrumb-item @click.native='back'>业务设置</el-breadcrumb-item>
          <el-breadcrumb-item>{{accessObj.typeName}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="select">
       <div class="filterTop">
          <el-checkbox v-model="checkbox1">到期提示（提前一个星期）</el-checkbox>
        </div>
        <div class='tableData'>
          <el-table :data="tableData" border height="100%">
            <el-table-column label="机构名" width="200px" show-overflow-tooltip prop="organInfo.organName"></el-table-column>
            <el-table-column label="购买时间" show-overflow-tooltip prop="createTime" width="170"></el-table-column>
            <el-table-column label="时长(月)" show-overflow-tooltip prop="num" width="120"></el-table-column>
            <el-table-column label="状态" width="120">
              <template slot-scope='scope'>
                <!-- 状态 0:拒绝 1：同意 2：待审核 -->
                <span v-if="scope.row.status == 2">待审核</span>
                <span v-else-if="scope.row.status == 1">同意</span>
                <span v-else>拒绝</span>
              </template>
            </el-table-column>
             <el-table-column label="操作" min-width="120">
              <template slot-scope='scope'>
                <!-- 状态 0:拒绝 1：同意 2：待审核 -->
                <el-button :disabled="scope.row.status!=2" @click="setStatus(scope.row,scope.$index)" type="primary" size="mini">审核</el-button>
              </template>
            </el-table-column>
            
          </el-table>
        </div>
        <div class="paginationRight" v-if="pageCount > 0">
          <el-pagination
            background
            @current-change='changeList'
            layout="prev, pager, next"
            :page-count="pageCount">
          </el-pagination>
        </div>
        </div>
   
    <!-- <yd-layout v-if="!showHangye" class="bgwhite">
      <div style="padding:.2rem 0 .5rem;" class="inputBox">
        <div class="flex-row-nowrap h7" style="padding-right:.4rem;">
          <span class="pdlr foCo6" style="text-align:right;width:2rem;padding-right:.2rem;">业务类型</span>
          <input class="flex1 pdlr1" v-model="accessObj.typeName" readonly  placeholder="请选择行业类型" type="text">
        </div>

        <div class="flex-row-nowrap h7" style="padding-right:.4rem;">
          <span class="pdlr foCo6" style="text-align:right;width:2rem;padding-right:.2rem;">上限数量</span>
          <input class="flex1 pdlr1" v-model="accessObj.amount" maxlength="1" readonly placeholder="默认为0未开放 最多5家" type="number">
        </div>

        <div class="flex-row-nowrap h7 relative" style="padding-right:.4rem;">
          <span class="pdlr foCo6" style="text-align:right;width:2rem;padding-right:.2rem;">服务费</span>
          <input class="flex1 pdlr1" readonly v-model="accessObj.cost" style="padding-right:1.8rem;" type="number" placeholder="由客服设置">
          <span class="shangjidian foCo3 font32">元/月</span>
        </div>
        <div class="flex-row-nowrap h7" style="padding-right:.4rem;">
          <span class="pdlr foCo6" style="text-align:right;width:2rem;padding-right:.2rem;">已签订商家</span>
          <input class="flex1 pdlr1" v-model="accessObj.num" maxlength="1" readonly placeholder="0" type="number">
        </div>
        <div class="flex-row-nowrap h7" style="padding-right:.4rem;">
          <div class="foCo6" style="text-align:right;padding:.5rem;">
            <yd-checkbox v-if="accessObj.remind == 0" v-model="checkbox1"  :color='mainColor'>到期提示（提前一个星期）</yd-checkbox>
            <yd-checkbox v-if="accessObj.remind == 1" v-model="checkbox2" :color='mainColor'>到期提示（提前一个星期）</yd-checkbox>
          </div> 
        </div>
      </div>
    </yd-layout> -->
    <!-- <myHangye v-if="showHangye" @chooseSuccess='chooseSuccess'></myHangye> -->
  </div>
</template>
<script>
import myHangye from "./hangye";

export default {
  components: {
    myHangye
  },
  props: ["accessObj"],
  data() {
    let userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    let organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[userInfo.organType];
    return {
      showHangye: false,
      userInfo,
      organInfo,
      typeId: "",
      tableData: [],
      pageCount: 1,
      typeName: "",
      amount: "",
      cost: "",
      checkbox1: false,
      checkbox2: true
    };
  },
  methods: {
    back() {
      this.$emit("mClose");
    },
    // 审核
    setStatus(row, index ) {
    	console.log(row,'row')
      this.$confirm("是否对该笔购买进行审核", "提示", {
        type: "warning",
        cancelButtonText: "拒绝",
        confirmButtonText: "同意",
        distinguishCancelAndClose: true
      })
        .then(() => {
          let data = {
            guid: row.guid,
            type: 1,
            token: this.$getkey()
          };
          this.$ajax(`${this.subUrl.activity}/sob/handleAudit`, data, res => {
            this.$message.success("已同意");
            this.$set(this.tableData[index], "status", 1);
          });
        })
        .catch(() => {
          let data = {
            guid: row.guid,
            type: 0,
            token: this.$getkey()
          };
          this.$ajax(`${this.subUrl.activity}/sob/handleAudit`, data, res => {
            this.$message.success("已拒绝");
            this.$set(this.tableData[index], "status", 0);
          });
        });
    },
    changeList(e) {
      this.pageNo = e;
      this.getList();
    },
    getList() {
      let data = {
        token: this.$getkey(),
        guid: this.accessObj.guid,
        pageSize: this.pageNo
      };
      this.$ajax(
        `${this.subUrl.activity}/sob/getSobAuditList`,
        data,
        res => {
          this.tableData = res.data.list;
          console.log(res.data);
          this.pageCount = res.data.pageCount * 1;
        },
        this
      );
    }
  },
  mounted() {
    console.log(this.accessObj);
    if (this.accessObj.remind == 1) {
      this.checkbox1 = true;
    } else {
      this.checkbox1 = false;
    }
    this.getList();
  }
};
</script>

<style scoped lang='scss'>
.main {
  height: 100%;
  overflow: auto;
  background: #fff;
  padding: 0 10px;
  .select {
    position: relative;
    height: 100%;
    .tableData {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 50px;
      top: 50px;
    }
  }
  .filterTop {
    height: 50px;
    line-height: 50px;
  }
}
input {
  outline: none;
  border-width: 1px;
  color: #666;
}
.inputBox > div {
  margin-bottom: 0.2rem;
}
.shangjidian {
  position: absolute;
  top: 50%;
  right: 0.6rem;
  transform: translateY(-50%);
}
input {
  border: none;
}
</style>


