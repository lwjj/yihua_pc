<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/user' }">个人中心</el-breadcrumb-item>
        <el-breadcrumb-item>用户详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-col class="content" v-if="friendInfo.user">
        <el-col>
          <el-col class="tip-detail"
                  style="">
            <el-col :span="2" style="min-width: 100px;cursor: pointer">
              <img v-if="friendInfo.user.headPortrait" @click="showUserInfo(friendInfo.user.userId2)" style="width: 100px;border-radius: 50%" :src="friendInfo.user.headPortrait"
                                                                            alt=""></el-col>
            <el-col :span="8" style="margin-left: 1rem">
              <el-col :span="24" style="font-weight: 600">昵称：{{friendInfo.user.nickname}}</el-col>
              <el-col :span="24">id:{{friendInfo.user.guid}}</el-col>
              <!--<el-col :span="24">{{friendInfo.user.description||friendInfo.user.description==''?friendInfo.user.description:'暂无好友描述哦'}}</el-col>-->
            </el-col>
            <el-col :span="6" v-if="showBack" style="margin-left: 1rem;margin-top: 1.5rem;cursor: pointer">
              <el-button plain @click.native="backList">返回</el-button>
            </el-col>
            <!--<el-col>-->
              <!--<el-col :span="8">-->
                <!--<el-col><el-input v-model="input1" placeholder="备注"></el-input></el-col>-->
                <!--<el-col><el-input v-model="input2" placeholder="描述"></el-input></el-col>-->
              <!--</el-col>-->
              <!--<el-col :span="2">&nbsp;</el-col>-->
              <!--<el-col :span="6" style="margin-top: 1rem">-->
                <!--<el-button plain @click.native="open(friendInfo.user.guid)">确定</el-button>-->
              <!--</el-col>-->
            <!--</el-col>-->
          </el-col>
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
              <div class="right-intro-div">
                <div class="" style="background:#f6f6f6;margin:0;padding:0 .2rem;">{{friendInfo.user.introduceMyself?friendInfo.user.introduceMyself:"无"}}</div>
              </div>
            </div>
            <div class="friend-detail-col">
              <div class="left-intro">出生年月：</div>
              <div class="right-intro">
                <div class="selfBg">
                  {{friendInfo.user.birthday?friendInfo.user.birthday:"无"}}
                </div>
              </div>
            </div>
            <div class="friend-detail-col">
              <div class="left-intro">出生地：</div>
              <div class="right-intro">
                <div class="selfBg">{{friendInfo.user.birthplace?friendInfo.user.birthplace:"无"}}</div></div>
            </div>
            <div class="friend-detail-col">
              <div class="left-intro">工作地：</div>
              <div class="right-intro">
                <div class="selfBg">{{friendInfo.user.workplace?friendInfo.user.workplace:"无"}}</div></div>
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
            <div class="friend-detail-col">
              <div class="left-tel-type">电话：</div>
              <div class="right-intro">
                <div class="selfBg">
                  {{friendInfo.user.account?friendInfo.user.account:"无"}}
                </div>
              </div>
            </div>
            <div class="friend-detail-col">
              <div class="left-tel-type">微信：</div>
              <div class="right-intro">
                <div class="selfBg">
                  {{friendInfo.user.wechat?friendInfo.user.wechat:"无"}}
                </div>
              </div>
            </div>
            <div class="friend-detail-col">
              <div class="left-tel-type">QQ：</div>
              <div class="right-intro">
                <div class="selfBg">{{friendInfo.user.qq?friendInfo.user.qq:"无"}}</div>
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
        showInfo:true,
        input: '',
        input1:'',
        input2:'',
        bm: {
          pageNo: 1,
          pageSize: 5,
          rowCount: 0
        },
        value: 1,
        options: [
          {
            name: '正常',
            value: 1
          },
          {
            name: '黑名单',
            value: 2
          },
        ],
        showBack:false,
        data: {},
        circleType: 1,
        tipList: [],
        tipTopList: [],
        district: {},
        tipType: [],
        scope: 0,
        friendInfo:{}
      };
    },
    methods: {
      backList(){
        this.$router.go(-1)
      },
      showUserInfo(id){
        var data = {
          token: this.$getkey(),
          userId:id
        }
        this.$ajax(
          `${this.subUrl.user}/user/accountInfo`,
          data,
          res => {
            this.showInfo=false
            this.friendInfo=res.data;
          },
          this
        );
      },
      open1(type, id1, id2) {
        var title = type * 1 == 2 ? '拉黑' : '拉白'
        this.$confirm('此操作将' + title + '该好友, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.black(type, id1, id2)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消拉黑'
          });
        });
      },
      open(id) {
        console.log(id)
        this.$confirm('请确认修改备注与描述?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.changeRemark(id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消拉黑'
          });
        });
      },
      changeRemark(id){
        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          userId2: id,
          remark: this.input1,
          desc: this.input2
        }
        this.$ajax(
          `${this.subUrl.sc}/friend/updateRemark`,
          data,
          res => {
            this.$message({
              type: 'success',
              message: '备注设置成功!'
            });
            this.getList();
            this.showInfo=true
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
        }
        this.$ajax(
          `${this.subUrl.sc}/friend/blacklist`,
          data,
          res => {
            var title = type * 1 == 2 ? '拉黑' : '拉白'
            this.$message({
              type: 'success',
              message: title + '成功!'
            });
            this.getList()
          },
          this
        );
      },
      handleCurrentChange(val) {
        this.bm.pageNo = val;
        this.getList()
      },
      handleChange() {
        this.getList()
      },
      getList() {
        var data = {
          token: this.$getkey(),
          pageNo: this.bm.pageNo,
          pageSize: this.bm.pageSize,
          userId: this.userInfo.guid,
          status: this.value
        };
        if (this.input != '') {
          data.keyword = this.input
        }
        this.$ajax(
          `${this.subUrl.sc}/friend/listFriend`,
          data,
          res => {
            this.tipList = res.data.list;
            this.bm.rowCount=res.data.rowCount
          },
          this
        );
      },
    },
    mounted() {
      console.log(this.$route);
      if(this.$route.path=='/bazhua/userInfo1'){
        this.showBack=true
      }
      // 任务统计
      // this.getbbsType();
      // 获取任务类型
      this.showUserInfo(this.$route.query.guid);
    }
  };
</script>
<style lang="scss" scoped>
  .tip-detail {
    line-height: 30px;
    border: 2px dashed #ededed;
    padding: 10px;
    margin-bottom: 10px
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
    margin-top: .3rem;
    background: #fff;
    border-bottom: 1px solid #ddd;
  }

  .friend-intro-title {
    line-height: 1rem;
    height: 1rem;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding-left: 1em;
    position: relative;
  }

  .friend-intro-title div {
    position: absolute;
    height: 1rem;
    color: #fff;
    bottom: 0;
    padding: 0 .3rem;
    line-height: 1rem;
    font-size: .3rem;
    display: inline-block;
  }

  .friend-detail-col {
    display: flex;
    line-height: 3em;
    padding-left: 1em;
  }

  .left-intro {
    width: 22%;
    color: #999999;
  }

  .left-tel-type {
    width: 15%;
    color: #999999;
  }

  .right-intro {
    width: 78%;
    display: flex;
    flex-wrap: wrap;
  }

  .right-intro div {
    width: 30%;
  }

  .right-intro div > span {
    padding: 0.3em 1.3em;
    background: #f6f6f6;
  }

  .right-intro-div {
    height: 6em;
    margin-top: 0.6em;
    margin-right: 2em;
    background: #f6f6f6;
    width: 70%;
    padding: 0 0.5em;
  }
</style>
