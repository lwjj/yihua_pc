<template>
  <div id="new_progress">
    <div class="title">
    <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/user/we_business/bazhua/circle">八爪圈</el-breadcrumb-item>
      <el-breadcrumb-item>我的评论</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
    <el-col class="content">
      <div class="topTitle flex" style="justify-content:space-between">
        <el-date-picker
            v-model="dateValue"
            type="daterange"
            range-separator="至"
            @change="dateChange"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        <!-- <div class="flex">
          <el-input class="mr1" v-model="input" placeholder="请输入关键字"></el-input>
          <el-button plain @click.native="getList">查询</el-button>
          
        </div> -->
      </div>
      <!-- <div class="mt2"></div> -->
      <!-- 表格开始 -->
      <el-table
          class="mt2"
          :data="tipList"
          border
          style="width: 100%">
          <el-table-column
            fixed
            prop="createDate"
            label="评论时间"
            width="180">
          </el-table-column>
           <!-- <el-table-column 
            label="状态"
            width="150">
            <template slot-scope="scope">
               <span :style="`color:rgb(35, 172, 56)`" v-if="scope.row.status == 1">正常</span>
                <span :style="`color:rgb(35, 172, 56)`" v-if="scope.row.status == 2">关闭</span>
                <span :style="`color:rgb(35, 172, 56)`" v-if="scope.row.status == 3">过期</span>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="bbs.title"
            label="标题"
            width="240"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            prop="bbs.content"
            label="内容"
            width="240"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            prop="content"
            label="评论内容"
            show-overflow-tooltip
            >
          </el-table-column>
            <el-table-column
            fixed="right"
            width="100"
            label="操作">
            <template slot-scope="scope">
                <el-button type="primary" size="mini" @click.native="toDetail(scope.row.bbs.userId,scope.row.bbs.guid,scope.row.bbs.status)">详情</el-button>
            </template>
          </el-table-column>
      </el-table>

      <!-- 表格结束 -->
      <el-col class="mt2">
        <el-pagination
          v-if="bm.rowCount"
          background
          style="float:right;"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="5"
          :total="bm.rowCount*1">
        </el-pagination>
        <!--<el-col class="flexRow flexAlignC flexJustE" :span="16">-->
        <!--<el-pagination background :page-size="bm.pageSize" @current-change="handleCurrentChange"-->
        <!--layout="prev, pager, next" :total="bm.rowCount"></el-pagination>-->
        <!---->
        <!--</el-col>-->
      </el-col>
    </el-col>
  </div>
</template>
<script>
export default {
  data() {
    var userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    return {
      dateValue: [],
      userInfo,
      input: "",
      bm: {
        pageNo: 1,
        pageSize: 5,
        rowCount: 0,
        startDate: "",
        endDate: ""
      },
      value: 0,
      options: [
        {
          name: "全部",
          value: 0
        },
        {
          name: "正常",
          value: 1
        },
        {
          name: "完成",
          value: 2
        },
        {
          name: "关闭",
          value: 3
        },
        {
          name: "过期",
          value: 4
        }
      ],
      data: {},
      circleType: 1,
      tipList: [],
      tipTopList: [],
      district: {},
      tipType: [],
      scope: 0
    };
  },
  methods: {
    toDetail(id, guid,status) {
      if (status == 1) {
        this.$router.push(
          "/user/we_business/bazhua/tipDetail?userId=" + id + "&bbsId=" + guid
        );
      } else if (status == 2) {
        this.$message.error("帖子已关闭");
      } else if (status == 3) {
        this.$message.error("帖子已过期");
      } else {
        this.$router.push(
          "/user/we_business/bazhua/tipDetail?userId=" + id + "&bbsId=" + guid
        );
      }
    },
    toUserDetail(id) {
      this.$router.push("/bazhua/userInfo1?guid=" + id);
    },
    dateChange() {
      console.log(this.dateValue);
      if (this.dateValue != null) {
        this.bm.startDate =
          this.dateValue[0].format("yyyy-MM-dd") + " 00:00:00";
        this.bm.endDate = this.dateValue[1].format("yyyy-MM-dd") + " 23:59:59";
      } else {
        this.bm.startDate = "";
        this.bm.endDate = "";
      }
      this.getList();
    },
    handleChange2() {
      this.getList();
    },
    handleCurrentChange(val) {
      this.bm.pageNo = val;
      this.getList();
    },
    getList() {
      var data = {
        token: this.$getkey(),
        pageNo: this.bm.pageNo,
        pageSize: this.bm.pageSize,
        userId: this.userInfo.guid
      };
      if (this.bm.startDate != "") {
        data.startDate = this.bm.startDate;
      }
      if (this.bm.endDate != "") {
        data.endDate = this.bm.endDate;
      }
      if (this.value != 0) {
        data.status = this.value;
      }
      if (this.input != "") {
        data.keyword = this.input;
      }
      this.$ajax(
        `${this.subUrl.sc}/bbsComment/listBbsComment`,
        data,
        res => {
          this.tipList = res.data.list;
          for (var i = 0; i < this.tipList.length; i++) {
            this.tipList[i].qrcodeSrc = `${this.baseUrl}${
              this.subUrl.sc
            }/bbsApplicant/getApplicantCode?userId=${
              this.tipList[i].userId
            }&token=${this.$getkey()}&guid=${this.tipList[i].guid}`;
          }
          this.bm.rowCount = res.data.rowCount;
        },
        this
      );
    }
  },
  mounted() {
    // 任务统计
    // this.getbbsType();
    // 获取任务类型
    this.getList();
  }
};
</script>
<style lang="scss" scoped>
.tip-detail {
  line-height: 40px;
  border: 2px dashed #ededed;
  padding: 10px;
  margin-bottom: 10px;
}
#new_progress {
  padding-left: 300px;
  padding-right: 40px;
  height: 100%;
  overflow: scroll;
}

.content {
  padding: 20px 30px;
  margin: 20px 0;
  background: #fff;
}
</style>
