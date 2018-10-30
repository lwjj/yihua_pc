<template>
    <div class="index">
        <div class="view">
            <div class="title">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{path:'/user/blackstone/blackstone_my'}">百事通</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="road1==1" :to="{path:'/user/blackstone/my_library/library_collection'}">我的文库</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="road1==2" :to="{path:'/user/blackstone/my_library/library_download'}">我的文库</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="road1==3" :to="{path:'/user/blackstone/my_library/library_upload'}">我的文库</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="road1==4" :to="{path:'/user/blackstone/blackstone_wealth/wealth_upload'}">我的财富</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="road1==5" :to="{path:'/user/blackstone/blackstone_wealth/wealth_download'}">我的财富</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="road1==6" :to="{path:'/user/blackstone/blackstone_wealth/wealth_punish'}">我的财富</el-breadcrumb-item>
                    <el-breadcrumb-item>详情</el-breadcrumb-item>  
                </el-breadcrumb>
            </div>
            <div class="view_left">
                <div class="view_left_floor1">
                    <a>{{deptType.title}}</a>
                </div>
                <div class="view_left_floor2">
                    <div class="center_1">
                        <div><img width="100" height="100" style="border-radius:50%" :src="headPortrait"></div>
                    </div>
                    <div class="center_2">
                         <div class="center_2_1">
                            <span>上传者：{{deptType.nickname}}</span>
                            <span>创建时间：{{deptType.createDate}}</span>
                            <span>评分：{{deptType.grade}}</span>
                            <span>浏览：{{deptType.browseNum}}</span>
                            <span>下载次数：{{deptType.downloadNum}}</span>
                        </div>
                        <div class="center_2_2">
                            <span>
                                <el-tag type="success" v-if="keyword1!==''">{{keyword1}}</el-tag>
                            </span>
                            <span>
                                <el-tag type="success" v-if="keyword2!==''">{{keyword2}}</el-tag>
                            </span>
                        </div>
                        <div class="center_2_3">
                            <a>{{deptType.content}}</a>
                        </div>
                    </div> 
                </div>
                <div class="view_left_floor3">
                    <span style="margin-left:280px;"><b>{{deptType.bp}}</b>个商机点
                    </span>
                    <span v-if="attachment.length>0" style="margin-left:150px;">
                        <!-- <a>附件({{attachment.length}})</a> -->
                    </span> 
                    <span>
                        <el-button @click="open6" v-if="isDownload!='查看'">{{isDownload}}</el-button>
                    </span>
                    <span style="float:right;margin-right:30px">
                        <router-link :to="{name:'blackstone_report',params:{hid:kaId,text:deptType.title}}">
                            <el-button>举报</el-button>
                        </router-link>
                    </span>
                    <span style="float:right;margin-right:10px;">
                        <el-button @click="Collect()">{{isCollect}}</el-button>
                    </span>
                </div> 
                <div class="view_left_floor4">
                    <a style="font-size:16px;">我的点评</a>
                    <p>
                        评分：
                        <el-rate v-model="value1"></el-rate>
                    </p>
                    <div class="input_1">
                        <span>
                            <i>留言：</i>
                            <el-input type="textarea" :maxlength="300" :autosize="{ minRows: 3, maxRows: 4}" placeholder="请输入内容(最大限度300字)" v-model="textarea"></el-input>
                        </span>

                    </div>
                    <div class="button_1">
                        <el-button @click="published">发表</el-button>                      
                    </div>
                </div>
            </div>
             <div style="padding:0 20px;" v-if="isDownload=='查看'">
                    <!-- 图片附件 -->
                     <div v-if="sliders.length > 0">
                        <div class="label">图片附件</div>
                        <vue-preview class='imgPath' :slides="sliders" v-if='sliders'  @close="''"></vue-preview>
                    </div>
                   <div v-if="otherArr.length > 0">
                        <div class="label">其他附件</div>
                        <div class="" style="width:500px;">
                            <div class="flex jusB mb1" v-for="(item,index) in otherArr" :key="index">
                                <div class="labelTitle">{{item.fileName}}</div>
                                <el-button type="primary" size="mini" @click="downLoadFile(item.path,item.fileName)">下载</el-button>
                            </div>
                        </div>
                    </div>

            
            </div>
            <div class="view_right">
                <div class="view_right_comments">
                    <div style="1px solid #ddd;padding-bottom:20px;font-size:16px;padding:0 10px;">评论区</div>
                    <el-row class="comments_box" v-for="item in commentType" :key="item.value">
                        <div class="flex jusB">
                            <div style="width:60px;" class="comments_header"><img :src="item.userInfo.headPortrait"></div>
                            <div  style="flex:1;padding-right:30px;">
                                <div class="comments_text">
                                    <div class="flex jusB">
                                        <b>{{item.userInfo.nickname}}</b>
                                        <span>{{item.createDate}}</span>
                                    </div> 
                                </div>
                                <div class="comments_x">
                                    <p>{{item.content}}</p>
                                </div>
                            </div> 
                        </div>  
                    </el-row>
                </div>
                <el-pagination v-if="pageCount" class="view_p" background small layout="prev, pager, next" :total="pageCount" :page-size="10" @current-change="handleCurrentChange" ></el-pagination>
            </div>
            <div class="clearfix"></div>
            <div v-if="isOpen==1" class="pupOpen">
                <p class="pupOpen_1">需支付</p>
                <p class="pupOpen_2">{{deptType.bp}}个商机点</p>
                <el-select v-model="selectValue" placeholder="请选择">
                    <el-option
                    v-for="item in options111"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <div>
                    <el-button @click="pupOpenNo">取消</el-button>
                    <el-button @click="pupOpenOk">确认</el-button>
                </div>
            </div>
            <div v-if="isOpen==1" style="width:100%;height:100%;position:fixed;background:rgba(0,0,0,0.5);top:0;left:0;z-index:100"></div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      picShow: 0,
      item: [],
      userInfo: {},
      organInfo: {},
      deptType: [],
      publishedType: [],
      commentType: [],
      getCountType: [],
      getCollect: [],
      kaId: "",
      value1: null,
      textarea: null,
      pageSiz: 0,
      pageNo: 1,
      fileName: "",
      pageCount: 0,
      headPortrait: "",
      isCollect: "",
      istrue: true,
      attachment: [],
      otherArr: [],
      sliders: [],
      isFirst: false,
      isDownload: "",
      pay: 0,
      road1: "",
      keyword1: "",
      keyword2: "",
      viewPicShow: [],
      picPath: [],
      isOpen: 0,
      selectValue: 1,
      options111: [
        {
          value: 1,
          label: "个人账户"
        },
        {
          value: 2,
          label: "企业账户"
        }
      ]
    };
  },
  methods: {
    pupOpenNo() {
      this.$message({
        type: "info",
        message: "已取消下载"
      });
      this.isOpen = 0;
    },
    pupOpenOk() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        kaId: this.kaId,
        type: 2,
        payType: this.selectValue
      };
      this.$ajax(
        `${this.subUrl.bd}/knowAll/buy`,
        data,
        res => {
          if (res.code == 1) {
            this.$message({
              type: "success",
              message: "下载成功!"
            });
            this.getInform();
            this.isDownload = "查看";
            this.isOpen = 0;
          } else {
            this.$message({
              type: "error",
              message: "余额不足!"
            });
          }
        },
        this
      );
    },
    handleCurrentChange(pageNo) {
      this.getContent(pageNo);
    },
    downLoadFile(url,fileName) {
      open(`${url}?attname=${encodeURIComponent(fileName)}`, "_blank");
    },
    getInform() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        kaId: this.kaId
      };
      this.$ajax(
        `${this.subUrl.bd}/knowAll/detail`,
        data,
        res => {
          this.deptType = res.data.knowAll;
          var imgArr = [];
          var otherArr = [];
          if (res.data.commAccessoryList) {
            for (var b of res.data.commAccessoryList) {
              var temp = b.fileName.split(".");
              var tempFile = temp[temp.length - 1];
              console.log(tempFile);
              if (
                tempFile == "jpg" ||
                tempFile == "jpeg" ||
                tempFile == "png" ||
                tempFile == "gif"
              ) {
                imgArr.push(b);
              } else {
                otherArr.push(b);
              }
            }
          }
          this.$setImg(imgArr, this);
          this.otherArr = otherArr;
          this.headPortrait = this.deptType.userInfo.headPortrait;
          this.isCollect = this.deptType.isCollect == 1 ? "已收藏" : "未收藏";
          this.isDownload = this.deptType.isDownload == 0 ? "未下载" : "查看";
          if (this.userInfo.guid == this.deptType.userId) {
            this.isDownload = "查看";
          }
          var judge = this.deptType.keyword.indexOf(",");
          if (judge > -1) {
            var a;
            a = this.deptType.keyword.split(",");
            this.keyword1 = a[0];
            this.keyword2 = a[1];
          } else if (this.deptType.keyword !== "") {
            this.keyword1 = this.deptType.keyword;
          }
          this.viewPicShow = res.data.commAccessoryList;
          console.log(res.data.commAccessoryList);
        },
        this
      );
    },
    getCommentCount() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        kaId: this.$route.params.hid
      };
      this.$ajax(
        `${this.subUrl.bd}/knowAll/getComment`,
        data,
        res => {
          this.getCountType = res.data.list;
          this.pageCount = Number(this.getCountType.length);
          this.pageSize = this.getCountType.length;
        },
        this
      );
    },
    getComment() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        kaId: this.$route.params.hid,
        pageNo: 1,
        pageSize: 10
      };
      this.$ajax(
        `${this.subUrl.bd}/knowAll/getComment`,
        data,
        res => {
          this.commentType = res.data.list;
          this.pageSize = this.deptType.pageSize;
        },
        this
      );
    },
    published() {
      if (!this.textarea) return;
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        kaId: this.$route.params.hid,
        grade: this.value1,
        content: this.textarea
      };
      this.$ajax(
        `${this.subUrl.bd}/knowAll/comment`,
        data,
        res => {
          this.publishedType = res.code;
          console.log(this.publishedType);
          if (this.publishedType == 1) {
            this.$message({
              message: "评论成功",
              type: "success"
            });
          } else {
            this.$message.error("评论失败");
          }
          this.grade = "";
          this.textarea = "";
          this.value1 = 0;
          this.getComment();
        },
        this
      );
    },
    getContent(pageNo) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        kaId: this.$route.params.hid,
        pageNo: pageNo,
        pageSize: 4
      };
      this.$ajax(
        `${this.subUrl.bd}/knowAll/getComment`,
        data,
        res => {
          this.commentType = res.data.list;
          this.pageSize = this.deptType.pageSize;
        },
        this
      );
    },
    Collect() {
      if (this.isCollect == "已收藏") {
        return;
      } else {
        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          kaId: this.$route.params.hid
        };
        this.$ajax(
          `${this.subUrl.bd}/knowAll/collect`,
          data,
          res => {
            this.getCollect = res.code;
            this.isCollect = "已收藏";
            this.$message({
              message: "收藏成功",
              type: "success"
            });
          },
          this
        );
      }
    },
    viewClose() {
      this.picShow = 0;
    },
    open6() {
      if (this.isDownload == "未下载") {
        this.isOpen = 1;
      }
    }
  },
  updated() {
    console.log(this.picPath);
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.kaId = this.$route.params.hid;
    this.getInform();
    this.getComment();
    this.getCommentCount();
    if (this.$route.params.road) {
      this.road1 = this.$route.params.road;
    }
  }
};
</script>
<style lang="scss" scoped>
.pupOpen {
  position: absolute;
  width: 420px;
  height: 230px;
  padding-bottom: 30px;
  background: #fff;
  z-index: 101;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto auto;
  text-align: center;
  .pupOpen_1 {
    padding: 10px 0;
  }
  .pupOpen_2 {
    padding-bottom: 20px;
  }
  .el-select {
    padding-bottom: 50px;
  }
}

.clear {
  clear: both;
}
.index {
  padding-left: 260px;
}

.view {
  margin-top: 10px;
  margin-left: 1%;
  background: #fff;
  padding-bottom: 80px;
  height: auto;
  .view_left {
    width: 100%;
    .view_left_floor1 {
      padding: 10px 0 10px 10px;
      border-bottom: 1px solid #ddd;
    }
    .view_left_floor2 {
      padding: 10px 0;
      margin-left: 10px;
      .center_1 {
        float: left;
        div {
          padding: 4px 4px 0;
          border: 1px solid #ddd;
          text-align: center;
        }
      }
      .center_2 {
        margin-left: 120px;
        width: auto;
        margin-right: 20px;
        .center_2_1 {
          padding: 10px 0 10px 30px;
          font-size: 16px;
          span {
            margin-right: 20px;
          }
        }
        .center_2_2 {
          margin-left: 30px;
          word-wrap: break-word;
          span {
            display: inline-block;
            margin-right: 10px;
          }
        }
        .center_2_3 {
          margin-top: 10px;
          margin-left: 30px;
          min-width: 700px;
        }
      }
    }
    .view_left_floor3 {
      padding-top: 30px;
      margin-bottom: 20px;
      padding-bottom: 10px;
    }
    .view_left_floor4 {
      padding-left: 10px;
      border-top: 1px solid #ddd;
      a {
        display: block;
        padding-bottom: 5px;
        margin-top: 5px;
      }
      p {
        display: inline-block;
        padding-bottom: 5px;
        .el-rate {
          display: inline-block;
        }
      }
      .input_1 {
        margin-bottom: 10px;
        i {
          display: inline-block;
          margin-bottom: 5px;
        }
      }
      .button_1 {
        width: 100%;
        padding: 10px;
      }
    }
  }
  .view_right {
    width: 100%;
    padding-top: 20px;
    // border-top: 2px solid #ddd;
    height: auto;
    .comments_box {
      border-bottom: 1px solid #ddd;
      padding: 10px 0;
      .comments_header {
        text-align: center;
        border: 1px solid #ddd;
        margin-left: 15px;
        img {
          width: 48px;
          height: 48px;
          padding: 4px 4px 0;
        }
      }
      .comments_text {
        margin-left: 10px;
        border-bottom: 1px dashed #ddd;
        padding-bottom: 5px;
      }
      .comments_x {
        margin-left: 10px;
        padding-top: 5px;
      }
    }
    .view_p {
      margin-top: 40px;
      text-align: right;
      padding-bottom: 20px;
    }
  }
}
</style>

  