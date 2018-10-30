<template>
    <div class="couponBox">
      <div class="tableContent">
        <el-table height="100%" :data='tableData' border>
          <el-table-column label="logo" width="130px">
            <template slot-scope="scope">
              <div class="imgLogo">
                <img class="logo" :src="scope.row.logoUrl" alt="logo">
              </div>
            </template>
          </el-table-column>
          <el-table-column label="营销标语" prop="slogan" width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="电话" prop="servicePhone" width="110" show-overflow-tooltip></el-table-column>
          <el-table-column label="地址" prop="shopAddress" width="110" show-overflow-tooltip></el-table-column>
          <el-table-column label="使用期限" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
               <span v-if="scope.row.startDate">{{scope.row.startDate.substr(0,10)}}至{{scope.row.endDate.substr(0,10)}}</span>
               <span v-else>永久</span>
            </template>
          </el-table-column>
          <el-table-column label="推广标题" prop="expandTitle" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column label="二维码" width="125">
            <template slot-scope="scope">
              <img class="qrcode" width="100" height="100" :src="`${baseUrl}/user/userCoupon/getCouponQRCode?token=${token1}&guid=${scope.row.guid}`" alt="logo">
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="180">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="primary" @click="goView(scope.row.expandTitle,scope.row.guid,scope.row.ruleIntroduction,scope.row.startDate,scope.row.endDate,scope.row.usableTime)" size='mini'>查看</el-button>
                <el-button type="danger" @click.stop="deleteItem(scope.row)"  size='mini'>删除</el-button>
              </el-button-group>
            </template>
          </el-table-column> 
        </el-table>
      </div> 
      <div class="paginationRight">
        <el-pagination 
          style="text-align:right;width:1000px"
          background
          v-if="pageCount > 0"
          layout="prev, pager, next"
          :total="pageCount*1"
          @current-change="changeOnlick">
        </el-pagination>
      </div>
      <div class="bounced" id="show" v-show='showTitle!==""'>
            <i id="close">
                <u>X</u>
            </i>
            <h2>{{showTitle}}</h2>
            <div class="bounced_1">
                <img :src="`${baseUrl}/user/userCoupon/getCouponQRCode?token=${token1}&guid=${showCode}`"/>
            </div>
            <div class="bounced_2">
                <p>使用规则：{{showRuleIntroduction}}</p>
                <p>可用时间：{{showStartDate}}<span v-if="showStartDate!==null">一</span>{{showEndDate}} {{showUsableTime}}</p>
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
      qr: "",
      token1: this.$getkey(),
      pageCount: "",
      pageSize: 4,
      showCode: "",
      showTitle: "",
      showRuleIntroduction: "",
      showStartDate: "",
      showEndDate: "",
      showUsableTime: ""
    };
  },
  methods: {
    coupons(pageNo) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        type: 2,
        pageNo: pageNo,
        pageSize: this.pageSize
      };
      this.$ajax(
        `${this.subUrl.user}/userCoupon/listUserCoupon`,
        data,
        res => {
          this.pageCount = res.data.pageCount * 10;
          this.tableData = res.data.list;
        },
        this
      );
    },
    // 删除当前会员卡
    deleteItem(e) {
      this.$confirm("是否删除当前会员卡", { type: "warning" }).then(() => {
        var data = {
          token: this.$getkey(),
          pushInformationId: e.guid
        };
        this.$ajax(
          `${this.subUrl.user}/userCoupon/delPushInformation`,
          data,
          res => {
            this.$message.success("删除成功");
            this.$emit("receive");
            this.coupons();
          },
          this
        );
      });
    },
    changeOnlick(val) {
      this.coupons(val);
    },
    goView(title, guid, ruleIntroduction, startDate, endDate, usableTime) {
      this.showCode = "";
      this.showCode = guid;
      this.showTitle = "";
      this.showTitle = title;
      this.showRuleIntroduction = "";
      this.showRuleIntroduction = ruleIntroduction;
      this.showStartDate = "";
      this.showStartDate = startDate;
      this.showEndDate = "";
      this.showEndDate = endDate;
      this.showUsableTime = "";
      this.showUsableTime = usableTime;
      var show = document.getElementById("show");
      if (show.className == "bounced") {
        document.getElementById("close").onclick = () => {
          var className = show.getAttribute("class");
          className = className.replace("bounced", "close1");
          document.getElementById("show").setAttribute("class", className);
        };
      } else {
        var className = show.getAttribute("class");
        className = className.replace("close1", "bounced");
        document.getElementById("show").setAttribute("class", className);
      }
    }
  },
  updated() {
    console.log(this.showStartDate);
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.coupons(1);
  }
};
</script>
<style lang="scss" scoped>
.couponBox {
  height: 100%;
  position: relative;
  .tableContent {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 50px;
  }
}
.imgLogo {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  img {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
span {
  font-size: 14px;
}
.coupon {
  padding: 0 20px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  width: 1000px;
  justify-content: space-between;
  align-items: center;
  .deleteButton {
    width: 80px;
    text-align: center;
    padding-left: 20px;
  }
  .item {
    flex: 1;
    display: flex;
    justify-content: center;
    flex-flow: column wrap;
    .img-wrapper {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid #ddd;
      img {
        width: 100%;
      }
    }
    .img-wrapper1 {
      width: 160px;
      height: 160px;
      img {
        width: 100%;
      }
    }
  }
}
.bounced {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-300px, -200px);
  width: 600px;
  height: 400px;
  background: #fff;
  border: 1px solid #ddd;
  z-index: 999;
  i {
    position: absolute;
    top: -15px;
    right: -15px;
    width: 40px;
    height: 40px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 50%;
    cursor: pointer;
    u {
      position: absolute;
      text-decoration: none;
      top: 2px;
      left: 10px;
      font-size: 30px;
    }
  }
  h2 {
    border-bottom: 1px dashed #ddd;
    text-align: center;
    padding: 20px 0;
    font-size: 28px;
  }
  .bounced_1 {
    padding: 10px 0;
    border-bottom: 2px dashed #ddd;
    text-align: center;
  }
  .bounced_2 {
    padding-top: 10px;
    text-align: center;
    p {
      margin-top: 10px;
    }
  }
}
.close1 {
  overflow: hidden;
  height: 0;
}
</style>
