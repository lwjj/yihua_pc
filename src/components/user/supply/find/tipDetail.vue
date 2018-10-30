<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/user/we_business/supply/find' }">供求市场</el-breadcrumb-item>
        <el-breadcrumb-item>帖子详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-col class="content" v-if="info.bbs">
      <el-col>
        <el-col :span="4" style="">
          <img class="header" @click="toUserDetail(info.bbs.userId)" style="width: 80px;border-radius: 50%;cursor: pointer" :src="info.bbs.headPortrait">
        </el-col>
        <el-col :span="12" style="line-height: 28px">
          <el-col>{{info.bbs.title}}</el-col>
          <div class="t-c-label">
            <el-col :span="12" v-for="(item,index) in label" v-if="item" :key="index">
            <span style="
            color:rgb(116, 223, 160);border: 1px solid rgb(116, 223, 160);
padding: 5px 10px;font-size: 13px;border-radius: 4px">{{item?item.substr(0,4):""}}</span>
            </el-col>
          </div>
          <!-- <div class="t-c-date">{{info.bbs.createDate | times}}</div> -->
          <el-col class="t-c-date">{{info.bbs.createDate | times}}</el-col>
        </el-col>
        <el-col :span="4" style="line-height: 60px">
          <el-progress type="circle" :percentage="75" color="#8e71c7"></el-progress>
        </el-col>
      </el-col>
      <el-col>
        <el-col :span="20">
          {{info.bbs.content}}
        </el-col>
        <el-col :span="20" style="margin: 5px">
          <el-col :span=8 style="min-width: 150px" v-for="(item,i) in info.bbs.commAccessoryList" :key="i">
            <img style="width: 150px;height: 150px" :src="item.path" alt="">
          </el-col>
        </el-col>
      </el-col>
      <el-col style="border-bottom: 1px dashed #e6e6e6;border-top: 1px dashed #e6e6e6;cursor: pointer">
        <el-col :span="20">
          <el-col style="width: 50px;line-height: 50px;padding: 10px 0">报名：</el-col>
          <el-col :span="12" style="min-width: 150px;padding: 10px 0">
            <img v-for="(item,index) in info.bbsApplicantList" @click="toUserDetail(item.userId)" :key="index" style="width: 50px;height: 50px;border-radius: 50%" :src="item.headPortrait" alt="">
              <span style="line-height: 50px" v-if="info.bbsApplicantList.length<=0">还没有人报名哦~</span>
          </el-col>
          <el-col style="width: 50px;line-height: 50px;padding: 10px 0">
            <el-button plain @click.native="open()">报名</el-button>
          </el-col>
        </el-col>
      </el-col>
      <el-col :span="18" style="border-bottom: 1px solid #ededed;padding: 10px">
        <el-col :span="12">
          <el-input v-model="comment" placeholder="请输入评论"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button plain @click.native="sendComponent(1,'',info.bbs.guid,0,info.bbs.userId)">评论</el-button>
        </el-col>
      </el-col>
      <el-col v-for="(item,index) in components" :key="index" style="border-bottom: 1px solid #e6e6e6;padding: 10px 0">
        <el-col :span="4" style="">
          <img @click="toUserDetail(item.userId)" class="header" style="width: 80px;border-radius: 50%" :src="item.headPortrait">
        </el-col>
        <el-col :span="12" style="line-height: 28px">
          <el-col>{{item.nickname}}</el-col>
          <div class="t-c-label">
            <el-col :span="12" :key="index">
            <span style="
            color:rgb(116, 223, 160);font-size: 13px;">{{item.createDate | times}}</span>
            </el-col>
          </div>
          <!-- <div class="t-c-date">{{info.bbs.createDate | times}}</div> -->
          <el-col class="t-c-date">{{item.praise}}</el-col>
        </el-col>
        <el-col :span="12" style="line-height: 40px">
          {{item.content}}
        </el-col>
        <el-col :span="8" style="line-height: 40px">
          <img @click="goodThis(item.guid)" style="width: 30px;cursor: pointer" src="../../../../assets/images/circle/good-icon.jpg" alt="">
          <!--<img style="width: 30px" src="../../../assets/images/circle/comment-icon.jpg" alt="">-->
        </el-col>
        <el-col>
          <el-col :span="4">&nbsp;</el-col>
          <el-col :span="20" style="padding: 10px 0">
            <el-col v-for="(subItem,subIdx) in item.childList" :key="subIdx" style="background: #f5f5f5;padding: 10px">
              <span style="color:red">{{subItem.nickname}}：</span>
              <span class="foCo9" v-show='subItem.userId != subItem.replyUserId'> 对 <span class="targetUser">{{subItem.replyUserIdName}}</span>回复：</span>
              <span class="foCo6" style="font-size: 14px;color: #999999">{{subItem.createDate | times}}</span>
              <el-col>"{{subItem.content}}"</el-col>
            </el-col>
          </el-col>
        </el-col>
        <el-col :span="4">&nbsp;</el-col>
        <el-col :span="18">
          <el-col :span="12">
            <el-input v-model="item.sendComment" placeholder="请输入评论"></el-input>
          </el-col>
          <el-col :span="6">
            <el-button plain @click.native="sendComponent(2,index,item.bbsId,item.guid,item.userId)">确定</el-button>
          </el-col>
        </el-col>
      </el-col>
      <el-col v-if="components.length<=0">
        <span style="line-height: 50px">暂时还没有评论</span>
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
        comment:'',
        info: {},
        label: '',
        components: ''
      };
    },
    methods: {
      open() {
        this.$confirm('是否参加该活动?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.addThisTips()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消拉黑'
          });
        });
      },
      addThisTips(){
        var data = {
          token: this.$getkey(),
          userId:this.userInfo.guid,
          bbsId:this.$route.query.bbsId
        }
        this.$ajax(
          `${this.subUrl.sc}/bbsApplicant/saveBbsApplicant`,
          data,
          res => {
            this.$message({
              type: 'success',
              message: '成功参加该活动!'
            });
          },
          this
        );
      },
      toDetail(id,guid){
        this.$router.push('/bazhua/tipDetail?userId='+id+'&bbsId='+guid)
      },
      toUserDetail(id){
        this.$router.push('/bazhua/userInfo?guid='+id)
      },
      sendComponent(type,index, bbsId, guid, replyUserId) {
        if (type==2&&this.components[index].sendComment == ""&&index!='') {
          return this.$message({
            type: 'success',
            message: '请先输入评论!'
          });
        }
        if (type==1&&this.comment == "") {
          return this.$message({
            type: 'success',
            message: '请先输入评论!'
          });
        }
        var data={
          userId: this.userInfo.guid,
          token: this.$getkey(),
          bbsId: bbsId,
          replyUserId: replyUserId,
          bbsCommentId: type==1?0:guid,
          comment: type==1?this.comment:this.components[index].sendComment
        }
        this.$ajax(
          `${this.subUrl.sc}/bbsComment/saveBbsComment`,data
          ,
          res => {
            this.$message({
              type: 'success',
              message: '评论成功!'
            });
            this.getDetail();
            this.components[index].sendComment=''
          },
          this
        );
      },
      goodThis(guid){
        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          likeObjId: guid
        };
        this.$ajax(
          `${this.subUrl.sc}/bbs/saveLike`,
          data,
          res => {
            this.$message({
              type: 'success',
              message:'点赞成功!'
            });
          },
          this
        );
      },
      getDetail() {
        var data = {}
        data.token = this.$getkey();
        data.userId = this.$route.query.userId;
        data.bbsId = this.$route.query.bbsId;

        this.$ajax(
          `${this.subUrl.sc}/bbs/getBbsDetail`,
          data,
          res => {
            this.info = res.data;
            if (res.data.bbs.keyword != null) {
              this.label = res.data.bbs.keyword.split(",");
            }
            this.components = res.data.bbsCommentList;
            for(var i=0;i<this.components.length;i++){
              this.components[i].sendComment='';
            }
          },
          this
        );
      }
    },
    mounted() {
      // 获取任务类型
      this.getDetail();
    }
  };
</script>
<style lang="scss" scoped>
  .content {
    padding: 20px 30px;
    margin: 20px 0;
    background: #fff;
  }

  #new_progress {
    padding-left: 300px;
    padding-right: 40px;
     height: auto;
  }
</style>
