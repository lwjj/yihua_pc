<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native="$router.go(-1)">返回</el-breadcrumb-item>
        <el-breadcrumb-item>用户详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-col class="content" v-if="friendInfo.user">
      <div class="userInfo">
           <img v-if="friendInfo.user.headPortrait" @click="showUserInfo(friendInfo.user.userId2)" width="48" height="48" style="border-radius:50%" :src="friendInfo.user.headPortrait"
                                                                            alt="">
            <div class="nameBox">
              <div class="name">昵称：{{friendInfo.user.nickname}}</div>
              <div class="name">用户id:{{friendInfo.user.guid}}</div>
            </div>
      </div>
        <el-col>
         <el-col>
          <div class="friend-intro" v-if="friendInfo.userInfo">
            <div class="friend-intro-title">
              <div :style="`background-color:red;`">个人信息</div>
            </div>

            <div class="friend-detail-col">
              <div class="left-intro">兴趣爱好：</div>
              <div class="right-intro">
                <div v-if="friendInfo.userInfo.interestName" v-for="(item,index) in friendInfo.userInfo.interestName.split(',')" :key="index"><span>{{item}}</span></div>
                <div v-else>无</div>
              </div>
            </div>
            <div class="friend-detail-col">
              <div class="left-intro">自我介绍：</div>
              <div class="right-intro">
                {{friendInfo.userInfo.introduceMyself?friendInfo.userInfo.introduceMyself:"无"}}
              </div>
            </div>
            <div class="friend-detail-col">
              <div class="left-intro">出生年月：</div>
              <div class="right-intro">
                <div class="selfBg">
                  {{friendInfo.userInfo.birthday?friendInfo.userInfo.birthday:"无"}}
                </div>
              </div>
            </div>
            <div class="friend-detail-col">
              <div class="left-intro">出生地：</div>
              <div class="right-intro">
                <div class="selfBg">{{friendInfo.userInfo.birthplace?friendInfo.userInfo.birthplace:"无"}}</div></div>
            </div>
            <div class="friend-detail-col">
              <div class="left-intro">工作地：</div>
              <div class="right-intro">
                <div class="selfBg">{{friendInfo.userInfo.workplace?friendInfo.userInfo.workplace:"无"}}</div></div>
            </div>
            <!-- <div class="friend-detail-col">
              <div class="left-intro">血型：</div>
              <div class="right-intro">{{user.bloodType}}</div>
            </div> -->
            <!-- <div class="friend-detail-col">
              <div class="left-intro">星座：</div>
              <div class="right-intro">{{user.constellation}}</div>
            </div> -->
          </div>
          <div class="friend-intro" style="padding-bottom: 3em">
            <div class="friend-intro-title">
              <div :style="`background-color:red;`">联系信息</div>
            </div>
            <!-- <div class="friend-detail-col">
              <div class="left-intro">电话：</div>
              <div class="right-intro">
                <div class="selfBg">
                  {{friendInfo.user.account?friendInfo.user.account:"无"}}
                </div>
              </div>
            </div> -->
            <div class="friend-detail-col">
              <div class="left-intro">微信：</div>
              <div class="right-intro">
                <div class="selfBg">
                  {{friendInfo.userInfo.wechat?friendInfo.userInfo.wechat:"无"}}
                </div>
              </div>
            </div>
            <div class="friend-detail-col">
              <div class="left-intro">QQ：</div>
              <div class="right-intro">
                <div class="selfBg">{{friendInfo.userInfo.qq?friendInfo.userInfo.qq:"无"}}</div>
              </div>
            </div>
          </div>
          </el-col>
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
      userInfo,
      showInfo: true,
      input: "",
      input1: "",
      input2: "",
      bm: {
        pageNo: 1,
        pageSize: 5,
        rowCount: 0
      },
      value: 1,
      options: [
        {
          name: "正常",
          value: 1
        },
        {
          name: "黑名单",
          value: 2
        }
      ],
      showBack: false,
      data: {},
      circleType: 1,
      tipList: [],
      tipTopList: [],
      district: {},
      tipType: [],
      scope: 0,
      friendInfo: {}
    };
  },
  methods: {
    backList() {
      this.$router.go(-1);
    },
    showUserInfo(id) {
      var data = {
        token: this.$getkey(),
        userId2: id
      };
      this.$ajax(
        `${this.subUrl.sc}/friend/getFriendDetail`,
        data,
        res => {
          this.showInfo = false;
          var obj = res.data;
          if (!res.data.userInfo.enabledCircleInfo) {
            obj.userInfo.sex = "未公开";
            obj.userInfo.birthday = "未公开";
            obj.userInfo.birthplace = "未公开";
            obj.userInfo.workplace = "未公开";
          }
          if (!res.data.userInfo.enabledContact) {
            obj.userInfo.qq = "未公开";
            obj.userInfo.wechat = "未公开";
          }
          if (!res.data.userInfo.enabledIndInfo) {
            obj.userInfo.interestName = "未公开";
            obj.userInfo.introduceMyself = "未公开";
          }

          this.friendInfo = obj;
        },
        this
      );
    },
    open1(type, id1, id2) {
      var title = type * 1 == 2 ? "拉黑" : "拉白";
      this.$confirm("此操作将" + title + "该好友, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.black(type, id1, id2);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消拉黑"
          });
        });
    },
    open(id) {
      console.log(id);
      this.$confirm("请确认修改备注与描述?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.changeRemark(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消拉黑"
          });
        });
    },
    changeRemark(id) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        userId2: id,
        remark: this.input1,
        desc: this.input2
      };
      this.$ajax(
        `${this.subUrl.sc}/friend/updateRemark`,
        data,
        res => {
          this.$message({
            type: "success",
            message: "备注设置成功!"
          });
          this.getList();
          this.showInfo = true;
        },
        this
      );
    },
    black(type, id1, id2) {
      var data = {
        token: this.$getkey(),
        userId: id1,
        userId2: id2,
        status: type
      };
      this.$ajax(
        `${this.subUrl.sc}/friend/blacklist`,
        data,
        res => {
          var title = type * 1 == 2 ? "拉黑" : "拉白";
          this.$message({
            type: "success",
            message: title + "成功!"
          });
          this.getList();
        },
        this
      );
    },
    handleCurrentChange(val) {
      this.bm.pageNo = val;
      this.getList();
    },
    handleChange() {
      this.getList();
    },
    getList() {
      var data = {
        token: this.$getkey(),
        pageNo: this.bm.pageNo,
        pageSize: this.bm.pageSize,
        userId: this.userInfo.guid,
        status: this.value
      };
      if (this.input != "") {
        data.keyword = this.input;
      }
      this.$ajax(
        `${this.subUrl.sc}/friend/listFriend`,
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
    console.log(this.$route);
    if (this.$route.path == "/bazhua/userInfo1") {
      this.showBack = true;
    }
    // 任务统计
    // 获取任务类型
    this.showUserInfo(this.$route.query.guid);
  }
};
</script>
<style lang="scss" scoped>
.tip-detail {
  line-height: 30px;
  border: 1px dashed #ddd;
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
.friend-intro {
  margin-top: 20px;
  background: #fff;
  border-bottom: 1px solid #ddd;
}

.friend-intro-title {
  height: 34px;
  line-height: 34px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  padding-left: 1em;
  position: relative;
}

.friend-intro-title div {
  position: absolute;
  height: 40px;
  color: #fff;
  bottom: 0;
  padding: 0 0.3rem;
  line-height: 40px;
  font-size: 14px;
  background: #c50000 !important;
  display: inline-block;
}

.friend-detail-col {
  display: flex;
  line-height: 3em;
  padding-left: 1em;
}
.selfBg {
  width: 100%;
  line-height: 2 !important;
}
.left-intro {
  width: 80px;
  text-align: right;
  line-height: 2;
  color: #999999;
}

.right-intro {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  div {
    flex: initial;
    margin-right: 10px;
  }
  line-height: 2;
}

// .right-intro div {
//   width: 30%;
// }

.right-intro div > span {
  padding: 0.3em 1.3em;
  background: #f6f6f6;
}

// .right-intro-div {
//   height: 6em;
//   margin-top: 0.6em;
//   margin-right: 2em;
//   padding: 0 0.5em;
// }
.userInfo {
  display: flex;
  align-items: center;
  border: 1px dashed #ddd;
  padding: 10px;
  img {
    margin-right: 10px;
  }
  .nameBox {
    display: flex;
    flex-flow: column wrap;
    justify-content: space-between;
    .name:nth-child(1) {
      margin-bottom: 10px;
    }
  }
}
</style>
