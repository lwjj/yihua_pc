<template>
    <div id="wealth">
        <div class="title">
            <div class="text">最新消息</div>
        </div>
        <div class="box">
            <div class="first1">
                <!-- <div style="text-align:right;margin-bottom:5px;">
                    <el-input type="text" style="height:35px;width:20%;" placeholder="请输入搜索内容" v-model="input">
                             <el-button slot="append" icon="el-icon-search" @click="getMain(1)"></el-button>
                    </el-input>
                </div> -->
                <el-table :data="tableData" :row-class-name="setClass" border style="width: 100%;"  height="100%">
                    <el-table-column fixed prop="messageDate" label="日期" width="180"></el-table-column>
                    <el-table-column prop="content" label="摘要" show-overflow-tooltip=""> </el-table-column>
                    <el-table-column prop="status" label="查阅" width="180"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" type="text" size="small">
                                详情
                            </el-button>
                            <el-button @click="remove(scope.row)" type="text" size="small">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    v-if="pageCount!==''"
                    style="text-align:center;margin-top:20px;"
                    background
                    layout="prev, pager, next"
                    :total="pageCount"
                    @current-change="select"
                    :current-page.sync="ye">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import fn from "@/assets/js/common.js";

export default {
  data() {
    return {
      userInfo: {},
      organInfo: {},
      tableData: [],
      pageCount: "",
      input: "",
      guid: "",
      ye: 1
    };
  },
  methods: {
    // 设定指定行的class名
    setClass(row, rowIndex) {
      return "warning-row";
    },
    remove(messageId) {
      var data = {
        token: this.$getkey(),
        messageId: messageId.guid
      };
      this.$confirm("是否删除当前信息", "提示", { type: "warning" }).then(
        () => {
          this.$ajax(
            `${this.subUrl.user}/commMessage/delUserMessage`,
            data,
            res => {
              this.getMain();
              this.$message.success("删除成功");
            },
            this
          );
        }
      );
    },
    getMain(pageNo) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        type: 2,
        keyword: this.input,
        pageNo: pageNo,
        pageSize: 11
      };
      this.$ajax(
        `${this.subUrl.user}/commMessage/getUserMessageList`,
        data,
        res => {
          this.tableData = [];
          this.$store.commit("setMessageNum", res.data.length);
          this.tableData = res.data;
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].status =
              this.tableData[i].status == 1 ? "已读" : "未读";
            if (this.tableData[i].content.length > 24) {
              this.tableData[i].content =
                this.tableData[i].content.slice(0, 25) + "。。。";
            }
          }
        },
        this
      );
    },
    select(val) {
      this.getMain(val);
    },
    handleClick(row) {
      this.guid = row.guid;
      console.log(row.guid);
      console.log(this.guid);
      this.$router.push({
        path: "/message/messageMain",
        name: "messageMain",
        params: { id: this.guid, num: 6 }
      });
    }
  },
  mounted() {
    if (this.$route.query.token) {
      this.$ajax(
        `${this.subUrl.user}/user/getUserInfo`,
        { token: this.$route.query.token, userId: this.$route.query.token },
        res => {
          res.data.userInfo = res.data.userInfo ? res.data.userInfo : {};
          res.data.organInfo = res.data.organInfo ? res.data.organInfo : {};
          localStorage.setItem(
            "userInfo",
            encodeURIComponent(JSON.stringify(res.data.userInfo))
          );
          localStorage.setItem(
            "organInfo",
            encodeURIComponent(JSON.stringify(res.data.organInfo))
          );
          localStorage.setItem("to", encodeURIComponent(res.data.token));
          fn.setIng(this.$route.query.token);
          var a = res.data.userInfo.organType;
          var b = res.data.userInfo.admin ? 1 : 0;
          localStorage.setItem("organType", a);
          localStorage.setItem("isManger", b);
          localStorage.setItem("user_Id", res.data.userInfo.guid);
          localStorage.setItem("organ_Id", res.data.organInfo.guid);
          localStorage.setItem(
            "mainColor",
            this.$color[res.data.userInfo.organType]
          );
          this.getMain();
        },
        this
      );
    } else {
      this.userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      this.organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      this.getMain();
    }
  }
};
</script>
<style lang="scss" scoped>
.clear {
  clear: both;
}
#wealth {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: auto;
  .box {
    height: 100%;
    background: #fff;
    padding-bottom: 10px;
    box-sizing: border-box;
    position: relative;
    .first1 {
      padding: 10px;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      overflow: auto;
    }
  }
}
</style>
