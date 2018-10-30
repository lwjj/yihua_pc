<template>
    <div id="wealth">
        <div class="title">
            <div class="text">圈子消息</div>
        </div>
        <div class="box">
            <div class="first1">
                <div style="text-align:right;margin-bottom:10px;">
                    <el-input type="text" style="height:35px;width:20%;" placeholder="请输入搜索内容" v-model="input">
                             <el-button slot="append" icon="el-icon-search" @click="getMain(1)"></el-button>
                    </el-input>
                </div>
                <el-table height="calc(100% - 85px)" :row-class-name="setClass" :data="tableData" border style="width: 100%;text-align:">
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
                <div class="paginationRight">
                  <el-pagination
                    v-if="pageCount>0"
                    style="text-align:right;margin-top:20px;"
                    background
                    layout="prev, pager, next"
                    :total="pageCount"
                    @current-change="select"
                    :current-page.sync="ye">
                   </el-pagination>
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
      pageCount: "",
      input: "",
      guid: "",
      ye: 1
    };
  },
  methods: {
    // 设定指定行的class名
    setClass({ row, rowIndex }) {
      if (row.status == "未读") {
        return "warning-row";
      } else {
        return "";
      }
    },
    remove(messageId) {
      var data = {
        token: this.$getkey(),
        messageId: messageId.guid
      };
      this.$ajax(
        `${this.subUrl.user}/commMessage/delUserMessage`,
        data,
        res => {
          this.getMain(this.ye);
        },
        this
      );
    },
    getMain(pageNo) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        type: 3,
        keyword: this.input,
        pageNo: pageNo,
        pageSize: 11
      };
      this.$ajax(
        `${this.subUrl.user}/commMessage/listCommMessage`,
        data,
        res => {
          this.tableData = [];
          this.tableData = res.data.pagination.list;
          this.pageCount = res.data.pagination.pageCount * 10;
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
        params: { id: this.guid, num: 3 }
      });
    }
  },
  mounted() {
    if (this.$route.query.type) {
      this.$router.push({
        path: "/message/messageMain",
        name: "messageMain",
        params: { id: this.$route.params.guid, num: this.$route.query.type }
      });
    }
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getMain(1);
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
    .first1 {
      height: 100%;
      padding: 10px 0;
    }
  }
}
</style>