<template>
  <div class="couponBox">
      <div class="tableContent">
        <el-table height="100%" :data='tableData' border>
          <el-table-column label="logo" width="130px">
            <template slot-scope="scope">
              <div class="imgLogo">
                <img class="logo" :src="scope.row.logo" alt="logo">
              </div>
            </template>
          </el-table-column>
          <el-table-column label="机构名" prop="organName" width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="姓名" prop="name" width="110" show-overflow-tooltip></el-table-column>
          <el-table-column label="电话" prop="phone" width="110" show-overflow-tooltip></el-table-column>
          <el-table-column label="地址" prop="address" width="110" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="180">
            <template slot-scope="scope">
              <el-button-group>
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
      <div v-if="false"> 
              <el-row>
                  <el-col style="text-align:center" v-if="tableData.length==0">暂无名片</el-col>
                  <el-col  v-for="item in tableData" :key="item.guid">
                      <div class="coupon cursor">
                          <div class="item">
                              <div class="img-wrapper">
                                  <img :src="item.logo">
                              </div>
                          </div>
                          <div class="item">
                              <div>机构名:{{item.organName}}</div>
                              <div class="mt1">姓名:{{item.name}}</div>
                          </div>
                          <div class="item">
                              <div>电话:{{item.phone}}</div> 
                              <div>地址:{{item.address}}</div> 
                          </div>
                          <div class="item">
                              <!-- <div class="img-wrapper1">
                                  <img :src="`${baseUrl}/user/userCoupon/getCouponQRCode?token=${token1}&guid=${item.guid}`" alt="">
                              </div> -->
                              <el-button type="danger" class="deleteButton" @click.stop="deleteItem(item)" size='mini'>删除</el-button>

                          </div>
                      </div> 
                  </el-col>
                  <el-col>
                      
                  </el-col>
              </el-row>
              <el-pagination
                      background 
                      style="text-align:right;width:1000px"
                      layout="prev, pager, next"
                      :total="pageCount*1"
                      @current-change="changeOnlick">
                      </el-pagination>
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
    deleteItem(e) {
      console.log(e);
      this.$confirm("是否删除当前名片", { type: "warning" }).then(() => {
        var data = {
          token: this.$getkey(),
          oppOrganId: e.oppOrganId
        };
        this.$ajax(
          `${this.subUrl.user}/userCoupon/delUserCard`,
          data,
          res => {
            this.$message.success("删除成功");
            this.$emit("receive");
            this.coupons(1);
          },
          this
        );
      });
    },
    coupons(pageNo) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        type: 3,
        pageNo: pageNo,
        pageSize: this.pageSize
      };
      this.$ajax(
        `${this.subUrl.user}/userCoupon/listUserCard`,
        data,
        res => {
          this.pageCount = res.data.pageCount * 10;
          this.tableData = res.data.list;
        },
        this
      );
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

.close1 {
  overflow: hidden;
  height: 0;
}
</style>
