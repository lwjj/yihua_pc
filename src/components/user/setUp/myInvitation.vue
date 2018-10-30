<template>
    <div class="box">
        <div class="topFix">
            <el-button type="text" @click="show(1)">邀请租户二维码</el-button>
            <el-button type="text" @click="show(2)">邀请商家二维码</el-button>
            <!-- <el-button type="success" @click="show(2)">查看奖励</el-button> -->
        </div>
        <el-table :data="tableData" border height="calc(100% - 50px)" style="width: 100%">
            <el-table-column prop="inviteDate" label="邀请日期" min-width="15%"></el-table-column>
            <el-table-column prop="payDate" label="付费日期" min-width="15%"></el-table-column>
            <el-table-column prop="type" label="类型" min-width="10%"></el-table-column>
            <el-table-column prop="estimateReward" label="预估奖励" min-width="10%"></el-table-column>
            <el-table-column prop="actualReward" label="实际奖励" min-width="10%"></el-table-column>
            <el-table-column prop="status" label="状态"  min-width="10%"></el-table-column>
            <el-table-column prop="organName" label="公司名字"  min-width="20%"></el-table-column>
            <el-table-column prop="contactName" label="联系人"  min-width="10%"></el-table-column>
        </el-table>
        <div class="paginationRight">
          <el-pagination v-show="pageCount>0" background layout="prev, pager, next" @current-change="select" :total="pageCount"></el-pagination>
        </div>
        <div class="first3_close" id="show">
            <div>
                <img v-show="this.n==1" :src="`${baseUrl}/user/user/inviteLessee?token=${token1}`"/>
                <img v-show="this.n==2" :src="`${baseUrl}/user/user/inviteMerchant?token=${token1}`"/>
                <i id="close">X</i>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      organInfo: {},
      tableData: [],
      pageCount: 1,
      token1: this.$getkey(),
      n: ""
    };
  },
  methods: {
    getDetails(page) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        pageNo: page,
        pageSize: 10
      };
      this.$ajax(
        `${this.subUrl.user}/user/myInvitation`,
        data,
        res => {
          this.tableData = res.data.list;
          this.pageCount = res.data.pageCount * 10;
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].status =
              this.tableData[i].status == 0 ? "未消费" : "消费";
            this.tableData[i].type =
              this.tableData[i].type == 1 ? "企业（租户）" : "供应商（商家）";
          }
        },
        this
      );
    },
    select(val) {
      this.getDetails(val);
    },
    show(n) {
      var show = document.getElementById("show");
      if (n == 1) {
        this.n = 1;
        if (show.className == "first3_close") {
          var className = show.getAttribute("class");
          className = className.replace("first3_close", "first3");
          show.setAttribute("class", className);
        }
      } else if (n == 2) {
        this.n = 2;
        //console.log(this.n)
        if (show.className == "first3_close") {
          var className = show.getAttribute("class");
          className = className.replace("first3_close", "first3");
          show.setAttribute("class", className);
        }
      }
    },
    close() {
      var close = document.getElementById("close");
      var show = document.getElementById("show");
      close.onclick = function() {
        var className = show.getAttribute("class");
        className = className.replace("first3", "first3_close");
        show.setAttribute("class", className);
      };
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getDetails(1);

    this.close();
  }
};
</script>
<style lang="scss" scoped>
#show {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.box {
  height: 100%;
  background: #fff;
  position: relative;
  overflow: visible !important;
  .topFix {
    position: absolute;
    top: -50px;
    height: 50px;
    overflow: hidden;
    z-index: 3;
    right: 10px;
  }
  .first1 {
    float: right;
  }
  .first2 {
    height: 714px;
    .el-pagination {
      margin-top: 10px;
      text-align: right;
    }
  }
  .first3 {
    position: absolute;
    width: 300px;
    height: 300px;
    background: #fff;
    z-index: 999;
    border: 1px solid #ddd;
    top: 34px;
    right: 0;
    div {
      img {
        width: 90%;
        height: 90%;
        margin-top: 5%;
        margin-left: 5%;
      }
      i {
        position: absolute;
        width: 20px;
        height: 20px;
        z-index: 999;
        background: #fff;
        border-radius: 50%;
        border: 1px solid #ddd;
        top: -5px;
        right: -5px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .first3_close {
    opacity: 0;
  }
}
.clear {
  clear: both;
}
</style>