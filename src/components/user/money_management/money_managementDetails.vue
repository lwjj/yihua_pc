<template>
    <div id="wealth">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path:'/user/money_management'}">财务审批</el-breadcrumb-item>
                <el-breadcrumb-item>财务送批详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="first1">
                <div class="first1_1">
                    <p>{{data1.title}}</p>
                </div>
                <div class="first1_2">
                    <div class="first1_2_1">
                        <p>
                            <a>管理处：</a>  
                            <span> {{organName}}</span>
                        </p>
                        <p>
                            <a>编制：</a>  
                            <span> {{name}}</span>
                        </p>
                        <p>
                            <a>单号：</a>  
                            <span> {{data1.guid}}</span>
                        </p>
                    </div>
                    <div class="first1_2_2">
                        <p>
                            <a>创建时间：</a>  
                            <span> {{data1.createTime}}</span>
                        </p>
                        <p>
                            <a>启动时间：</a> 
                            <span> {{data1.startTime}}</span>
                        </p>
                        <p>
                            <a>完成时间：</a>  
                            <span> {{data1.endTime}}</span>
                        </p>
                    </div>
                </div>
                <div class="clear"></div>
                <div class="first1_3">
                    <div class="first1_3_box">
                        <div class="first1_3_a">
                            <a>{{data1.content}}</a>
                        </div>
                        <div class="first1_3_img">
                            <vue-preview class='imgPath' :slides="sliders" v-if='sliders'  @close="''"></vue-preview>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="first1_4" v-if="data3.length!==0">
                    <div class="first1_4_box">
                        <a>审批信息</a>
                        <div class="first1_4_p">
                            <p>{{data1.reply}}</p>
                        </div>
                        <div style="padding:0 60px;">
                            <vue-preview class='imgPath' :slides="sliders1"  @close="''"></vue-preview>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="bgwhite" style="padding:20px;" v-if="data1.status==2">
                    <el-button @click="goReply(0)">不同意</el-button>
                    <el-button @click="goReply(1)">同意</el-button>
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
      orId: "",
      data1: [],
      organName: "",
      name: "",
      data2: [],
      data3: [],
      sliders: null,
      sliders1: null
    };
  },
  methods: {
    getMain() {
      if (this.$route.params.orId !== undefined) {
        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          orId: this.$route.params.orId
        };
        this.$ajax(
          `${this.subUrl.activity}/ownersCom/ocReport/Detail`,
          data,
          res => {
            this.data1 = res.data.ocReport;
            this.organName = this.data1.info.organName;
            this.name = this.data1.info.name;
            this.data2 = res.data.commAccessoryList;
            this.data3 = res.data.replyAccessoryList;
            if (res.data.commAccessoryList) {
              var aaaa = this.$setImg(res.data.commAccessoryList, this);
            }
            if (res.data.replyAccessoryList) {
              this.$setImg1(res.data.replyAccessoryList, this);
            }
          },
          this
        );
      } else {
        this.$message({
          message: "请选择要查看的详情",
          type: "warning"
        });
        this.$router.push({ path: "/user/money_management" });
      }
    },
    goReply(num) {
      var guid = this.data1.guid;
      this.$router.push(
        "/user/money_management/money_reply/" + num + "/" + guid
      );
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getMain();
    this.orId = this.$route.params.orId;
  }
};
</script>
<style lang="scss" scoped>
.clear {
  clear: both;
}
#wealth {
  overflow: auto;
  .box {
    .first1 {
      padding-top: 10px;
      width: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      .first1_1 {
        width: 100%;
        line-height: 30px;
        background: #fff;
        border-bottom: 1px solid #ddd;
        p {
          margin-left: 50px;
        }
      }
      .first1_2 {
        padding: 30px 0 20px 0;
        background: #fff;
        margin-bottom: 20px;
        border-bottom: 1px solid #ddd;
        .first1_2_1 {
          width: 50%;
          float: left;
          margin-left: 50px;
        }
        div {
          p {
            padding-bottom: 10px;
            a {
              display: inline-block;
              width: 80px;
              text-align: right;
            }
            span {
              margin-left: 20px;
            }
          }
        }
      }
      .first1_3 {
        width: 100%;
        background: #fff;
        padding-bottom: 20px;
        .first1_3_box {
          width: 100%;
          padding-top: 20px;
          .first1_3_a {
            overflow-x: hidden;
            overflow-y: auto;
            width: 92%;
            margin-left: 60px;
            height: 200px;
            border: 1px solid #ddd;
            display: block;
            a {
              display: block;
              width: 98%;
              margin-left: 1%;
              margin-top: 5px;
            }
          }
          .first1_3_img {
            width: 92%;
            margin-left: 60px;
            margin-top: 10px;
            ul {
              li {
                float: left;
                margin-left: 10px;
                img {
                  width: 200px;
                  height: 128px;
                }
              }
            }
          }
        }
      }
      .first1_4 {
        width: 100%;
        background: #fff;
        padding-bottom: 20px;
        .first1_4_box {
          width: 100%;
          a {
            display: block;
            margin-bottom: 10px;
            padding-top: 10px;
            margin-left: 20px;
          }
          .first1_4_p {
            overflow-x: hidden;
            overflow-y: auto;
            width: 92%;
            margin-left: 60px;
            height: 200px;
            border: 1px solid #ddd;
            display: block;
            p {
              display: block;
              width: 98%;
              margin-left: 1%;
              margin-top: 5px;
            }
          }
          .first1_4_img {
            width: 92%;
            margin-left: 60px;
            margin-top: 10px;
            ul {
              li {
                float: left;
                margin-left: 10px;
                img {
                  width: 200px;
                  height: 128px;
                }
              }
            }
          }
        }
      }
      .first1_5 {
        text-align: center;
        margin-top: 20px;
        .el-button {
          width: 30%;
        }
      }
    }
    height: 100%;
    overflow: auto;
    background: #fff;
  }
}
</style>
