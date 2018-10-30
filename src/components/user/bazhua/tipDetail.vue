<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native="$router.go(-1)">返回</el-breadcrumb-item>
        <el-breadcrumb-item>帖子详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content bbsDetail" v-if="info.bbs">
        <div class="toptitle">
          <div style="display:inline-block;margin-right:20px;">
            <img class="header" @click="toUserDetail(info.bbs.userId)" style="width: 48px;height:48px;border-radius: 50%;cursor: pointer" :src="info.bbs.headPortrait">
          </div>
          <div style="line-height: 28px;display:inline-block;">
           <div class="flex">
              <div class="mr1 bbsTitle">{{info.bbs.title}}</div>
             <div class="t-c-date">{{info.bbs.createDate | times}}</div>
           </div>
            <div v-if="label">
              <div style="margin-bottom:5px;margin-right:5px;float:left;" v-for="(item,index) in label" v-if="item" :key="index">
                <span style="color:rgb(116, 223, 160);border: 1px solid rgb(116, 223, 160);padding: 3px 5px;font-size: 12px;border-radius: 4px">{{item?item.substr(0,4):""}}</span>
              </div>
            </div>
            <div class="clear"></div>
           
          </div>
        </div>
        <div>
          <div class="bbsContent">
            {{info.bbs.content}}
          </div>
          <div style="margin: 5px;width:90%;min-width:800px;">
            <vue-preview class='imgPath' :slides="sliders" v-if='sliders'  @close="''"></vue-preview>
          </div>
          <div class="clear"></div>
        </div>
        <div v-if="info.bbsApplicantList" style="border-top: 1px dashed #ddd;cursor: pointer;min-width:800px;width:90%;">
          <div class="flex" style="align-items:center">
            <div style="width: 50px;float:left;">报名：</div>
            <div  style="padding: 10px 0;float:left;align-item:center" class="flex">
              <img v-for="(item,index) in info.bbsApplicantList" @click="toUserDetail(item.userId)" :key="index" style="width: 35px;height: 35px;border-radius: 50%;margin-right:5px;" :src="item.headPortrait" alt="">
                <span v-if="info.bbsApplicantList.length<=0">还没有人报名哦~</span>
                <el-button type="text" @click.native="open()">报名</el-button>
            </div>
            <div style="width: 100px;line-height: 50px;padding: 10px 0;float:right;margin-right:35px;">
            </div>
          </div>
          <div class="clear"></div>
        </div>
        <div style="padding: 10px;min-width:800px;width:90%;border-bottom: 1px dashed #ddd;" >
          <div style="width:400px;float:left;" class="mr1">
            <el-input style="width:100%;" v-model="comment" placeholder="请输入评论"></el-input>
          </div>
            <el-button class="ml1" type="text"  @click.native="sendComponent(1,'',info.bbs.guid,0,info.bbs.userId)">评论</el-button>
          <div class="clear"></div>
        </div>
        <div v-for="(item,index) in components" v-if="components" :key="index" style="border-bottom: 1px solid #ddd;padding: 10px 0;min-width:800px;width:90%;">
          <div class="subTitle">
            <div class="mr1">
              <img @click="toUserDetail(item.userId)" class="header" style="width: 35px;height:35px;border-radius: 50%" :src="item.headPortrait">
            </div>
             <div>
               <div>{{item.nickname}}</div>
                <div :key="index"><span class="foCo9">{{item.createDate | times}}</span></div>
             </div>
          </div>
          
          <div style="float:left;margin-top:10px;">
            <div>
              {{item.content}}
            </div>
            <div class="t-c-date bbsContent" >{{item.praise}}</div>
          </div>
          <div  style="line-height: 40px;float:right;margin-top:-20px;">
            <img @click="goodThis(item.guid,index)" v-if="item.likeStatus == 0" style="width: 20px;cursor: pointer" src="../../../assets/images/circle/good-icon.jpg" alt="">
            <img @click="goodThis(item.guid,index)" v-else style="width: 20px;cursor: pointer" src="../../../assets/images/circle/good-icon-active.png" alt="">
          </div>
          <div class="clear"></div>
          <div>
            <div style="padding: 10px;background:#fff">
              <div v-for="(subItem,subIdx) in item.childList" :key="subIdx" >
                <span class="font600">{{subItem.nickname}}：</span>
                <span class="foCo9" v-show='subItem.userId != subItem.replyUserId'> 对 <span class="targetUser">{{subItem.replyUserIdName}}</span>回复：</span>
                <span class="foCo9" style="font-size: 14px;color: #999999;float:right;margin-right:10px;">{{subItem.createDate | times}}</span>
                <div style="padding-top:10px;">"{{subItem.content}}"</div>
              </div>
            </div>
          </div>
          <div class="clear"></div>
          <div style="min-width:800px;width:90%;">
            <div style="width:400px;float:left;;">
              <el-input style="width:100%" v-model="item.comment2" placeholder="请输入评论"></el-input>
            </div>
            <!-- <div  style="width:100px;float:left"> -->
              <el-button class="ml1"  type="text" @click.native="sendComponent(2,index,item.bbsId,item.guid,item.userId,item)">评论</el-button>
            <!-- </div> -->
          </div>
          <div class="clear"></div>
        </div>
        <div v-if="components.length<=0" style="text-align:center;">
          <span style="line-height: 50px;">暂时还没有评论</span>
        </div>
    </div>
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
      comment: "",
      info: {},
      label: "",
      components: [],
      sliders: null,
      comment2: ""
    };
  },
  methods: {
    open() {
      this.$confirm("是否参加该活动?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.addThisTips();
        })
        .catch(() => {
          this.$message({
            type: "success",
            message: "已取消报名"
          });
        });
    },
    addThisTips() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        bbsId: this.$route.query.bbsId
      };
      this.$ajax(
        `${this.subUrl.sc}/bbsApplicant/saveBbsApplicant`,
        data,
        res => {
          this.$message({
            type: "success",
            message: "成功参加该活动!"
          });
          this.getDetail();
        },
        this
      );
    },
    toDetail(id, guid) {
      this.$router.push("/bazhua/tipDetail?userId=" + id + "&bbsId=" + guid);
    },
    toUserDetail(id) {
      this.$router.push("/bazhua/userInfo?guid=" + id);
    },
    sendComponent(type, index, bbsId, guid, replyUserId,item) {
      if (type == 2 && item.comment2 == "") {
        return this.$message({
          type: "error",
          message: "请先输入评论!"
        });
      } else if (type == 1 && this.comment == "") {
        return this.$message({
          type: "error",
          message: "请先输入评论!"
        });
      } else {
        var data = {
          userId: this.userInfo.guid,
          token: this.$getkey(),
          bbsId: bbsId,
          replyUserId: replyUserId,
          bbsCommentId: type == 1 ? 0 : guid,
          comment: type == 1 ? this.comment : item.comment2
        };
        this.$ajax(
          `${this.subUrl.sc}/bbsComment/saveBbsComment`,
          data,
          res => {
            this.$message({
              type: "success",
              message: "评论成功!"
            });
            this.getDetail();
            this.comment = "";
            this.comment2 = "";
            item?item.comment2 = "":"";
            this.getDetail();
          },
          this
        );
      }
    },
    goodThis(guid, index) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        likeObjId: guid
      };
      this.$ajax(
        `${this.subUrl.sc}/bbs/saveLike`,
        data,
        res => {
          this.$set(this.components[index], "likeStatus", 1);
          this.$message({
            type: "success",
            message: "点赞成功!"
          });
        },
        this
      );
    },
    getDetail() {
      var data = {};
      data.token = this.$getkey();
      data.userId = this.userInfo.guid;
      data.bbsId = this.$route.query.bbsId;
      this.$ajax(
        `${this.subUrl.sc}/bbs/getBbsDetail`,
        data,
        res => {
          this.info = res.data;
          console.log(this.info.bbs);
          if (res.data.bbs.keyword) {
            this.label = res.data.bbs.keyword.split(",");
          }
          if (
            res.data.bbs.commAccessoryList &&
            res.data.bbs.commAccessoryList.length > 0
          ) {
            if (res.data.bbs.commAccessoryList) {
              this.$setImg(res.data.bbs.commAccessoryList, this);
            }
          }

          this.components = res.data.bbsCommentList
            ? res.data.bbsCommentList
            : [];
          if (this.components && this.components.length > 0) {
            for (var i = 0; i < this.components.length; i++) {
              this.components[i].sendComment = "";
            }
          }
        },
        this
      );
    }
  },
  updated() {
    // console.log(this.components);
  },
  mounted() {
    // 获取任务类型
    this.getDetail();
  }
};
</script>
<style lang="scss" scoped>
.toptitle {
  display: flex;
  align-items: center;
}
.foCo9 {
  font-size: 12px !important;
}
.clear {
  clear: both;
}
.content {
  padding: 20px 30px;
  margin: 20px 0;
  background: #fff;
}

#new_progress {
  padding-left: 300px;
  padding-right: 40px;
  height: 100%;
  overflow: scroll;
}
.t-c-date {
  color: #999;
}
.subTitle {
  display: flex;
  align-items: center;
}
</style>
