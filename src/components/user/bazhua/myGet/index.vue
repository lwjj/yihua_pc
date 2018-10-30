<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/user/we_business/bazhua/circle' }">我的圈子</el-breadcrumb-item>
        <el-breadcrumb-item>给我回复</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-col class="content "> 
      <div class="mt2"></div>
      <el-col  v-for="(item,index) in tipList" @click.native="toDetail(item.userId,item.bbsId,item.bbs.status)"  :key="index" class="tip-detail" :span="24">
        <div class="myTitle">
          <img :src="item.headPortrait" @click.stop="toUserDetail(item.userId)" width="48" height="48" class="cursor" :alt="item.nickname">
          <div class="mRight">
            <div class="m-top">
              <div>{{item.nickname}}</div>
              <div style="color:#999">{{item.createDate}}</div>
            </div>
            <!-- you右边添加好友 -->
            <div class="iconGroup">
              <!-- userId也就是评论人 -->
              <img @click.stop="open1(1,item.userId)" v-if="userInfo.guid!= item.userId" class="mr1 cursor" title="添加好友"  width="25"
                 src="../../../../assets/images/circle/add.jpg" alt="">
            <img @click.stop="open1(2,item.userId)" class="cursor" title="拉黑好友" width="25"
                 src="../../../../assets/images/circle/black.jpg" alt="">
            </div>
          </div>
        </div>
        <div class="myContent" v-if="item.bbs">
          {{item.content.length > 200?item.content.substr(0,200)+'...':item.content}}
        </div>
        <!-- <el-col :span="24" style="line-height: 30px">
          <el-col :span="3" @click.native="toUserDetail(item.userId)" style="width: 100px;cursor: pointer"><img style="width: 50px;border-radius: 50%" :src="item.headPortrait" alt=""></el-col>
          <el-col @click.native="toDetail(item.userId,item.bbs.guid)" style="width: 300px;cursor: pointer">{{item.nickname}}<br><span style="font-size: 13px;color: #999999">{{item.createDate}}</span></el-col>
          <el-col :span="6">
            <img @click="open1(1,item.replyUserId)" style="width: 50px"
                 src="../../../../assets/images/circle/add.jpg" alt="">
            <img @click="open1(2,item.replyUserId)" style="width: 50px"
                 src="../../../../assets/images/circle/black.jpg" alt="">
          </el-col>
        </el-col>
        <el-col style="line-height: 30px;padding: 0 5px">{{item.content}}</el-col>
        <el-col @click.native="toDetail(item.userId,item.bbs.guid)" style="line-height: 30px;padding: 0 5px;cursor: pointer" v-if="item.bbs  && item.bbs.commAccessoryList && item.bbs.commAccessoryList.length>0">
          <el-col style="width: 100px"><img style="width: 100px;height:100px" :src="item.bbs.commAccessoryList[0].path" alt=""></el-col>
          <el-col style="background: #f5f5f5;width: 500px;height:100px;padding: 0 5px;overflow: hidden">{{item.bbs.content}}</el-col>
        </el-col> -->
      </el-col>
      <el-col>
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
      input: "",
      dateValue: [],
      userInfo,
      bm: {
        pageNo: 1,
        pageSize: 5,
        rowCount: 0,
        startDate: "",
        endDate: ""
      },
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
      console.log(id);
      this.$router.push("/bazhua/userInfo1?guid=" + id);
    },
    dateChange() {
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
    handleCurrentChange(val) {
      this.bm.pageNo = val;
      this.getList();
    },
    black(type, id) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        userId2: id
      };
      if (type == 2) {
        data.status = 2;
      }
      var url = type == 1 ? "/friend/saveFriend" : "/friend/deleteFriend";
      this.$ajax(
        `${this.subUrl.sc}` + url,
        data,
        res => {
          var title = type * 1 == 2 ? "移除" : "添加";
          this.$message({
            type: "success",
            message: title + "成功!"
          });
          this.getList();
        },
        this
      );
    },
    open1(type, id) {
      var title = type * 1 == 1 ? "添加该用户为好友" : "移除该好友";
      this.$confirm("确定" + title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.black(type, id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
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
      if (this.input != "") {
        data.keyword = this.input;
      }
      if (this.value8 != 0) {
        data.status = this.value8;
      }
      this.$ajax(
        `${this.subUrl.sc}/bbsComment/replyToMe`,
        data,
        res => {
          this.tipList = res.data.list;
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
  border: 1px dashed #ddd;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  .myTitle {
    display: flex;
    flex: 1;
    justify-content: space-between;
    .mRight {
      padding-left: 10px;
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 2;
    }
  }
  .myContent {
    line-height: 2;
  }
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
