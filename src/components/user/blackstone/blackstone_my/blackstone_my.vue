<template>    
    <div id="library">
        <div class="title">
            <div class="text">百事通</div>
        </div>
        <div class="library_top">
            <el-select v-model="value" style="float:right;padding-top:10px;" @change="changeSelect" placeholder="请选择">
                <el-option v-for="item in ButtonType" :key="item.guid" :label="item.dictDataName" :value="item.guid">
                </el-option>
            </el-select>
            <el-input style="width:200px;float:right;margin-top:10px;margin-right:10px;" @change="inputChange" placeholder="搜索" suffix-icon="el-icon-search" v-model="value2">
            </el-input>
            <!-- <el-button @click="getInform" style="margin-left:20px;">全部</el-button> -->
            <div class="stone_form">
                <div style="height:calc(100% - 60px)">
                    <el-table :data="tableData" height="100%" style="width: 100%" border>
                        <el-table-column prop="title" label="标题" min-width="27%"></el-table-column>
                        <el-table-column prop="createDate" label="创建时间" min-width="17%"></el-table-column>
                        <el-table-column prop="grade" label="评分" min-width="6%"></el-table-column>
                        <el-table-column prop="bp" label="商机点" min-width="7%"></el-table-column>
                        <el-table-column prop="keyword" label="关键字" min-width="12%"></el-table-column>
                        <el-table-column prop="content" label="内容" min-width="25%"></el-table-column>
                        <el-table-column fixed="right" label="操作" min-width="6%">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div> 
                <el-pagination v-if="pageCount" background class="center" style="float:right;margin:10px 0;" layout="prev,pager,next" :total="pageCount" @current-change="handleCurrentChange" ></el-pagination>
                <div class="clear:both"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      bd: [],
      userInfo: {},
      organInfo: {},
      deptType: [],
      ButtonType: [],
      pageSize: 15,
      pageCount: 0,
      pageNo: 1,
      list: [],
      tableData: [],
      value: "全部",
      keyword: "",
      value2: ""
    };
  },
  methods: {
    inputChange() {
      this.value = 0;
      this.getInform(1);
    },
    changeSelect() {
      if (this.value !== 0) {
        this.goQuery(this.value, 1);
      } else if (this.value == 0) {
        this.getInform(1);
      }
    },
    handleClick(item) {
      this.$router.push({
        name: "blackstone_view",
        params: { hid: item.guid, road: 0 }
      });
    },
    getTitle1(pageNo) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        pageNo: this.pageNo,
        type: this.userInfo.organType == 1 ? 2 : 1
      };
      this.$ajax(
        `${this.subUrl.user}/comm/getKaType`,
        data,
        res => {
          this.ButtonType = res.data;
          this.ButtonType.unshift({
            guid: 0,
            dictDataName: "全部",
            dictDataValue: "全部"
          });
        },
        this
      );
    },
    handleCurrentChange(pageNo) {
      this.getInform(pageNo);
    },
    getInform(pageNo) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        pageSize: 11,
        pageNo: pageNo,
        keyword: this.value2
      };
      this.$ajax(
        `${this.subUrl.bd}/knowAll/getknowAllList`,
        data,
        res => {
          this.deptType = res.data;
          this.pageCount = Number(this.deptType.pageCount) * 10;
          this.tableData = this.deptType.list;
          this.pageSize = this.deptType.pageSize;
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].content.length > 14) {
              this.tableData[i].content =
                this.tableData[i].content.slice(0, 12) + "。。";
            }
          }
        },
        this
      );
    },
    goQuery(guid, pageNo) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        typeId: guid,
        pageSize: 10,
        pageNo: pageNo
      };
      this.$ajax(
        `${this.subUrl.bd}/knowAll/getknowAllList`,
        data,
        res => {
          this.tableData = [];
          this.deptType = res.data;
          this.pageCount = Number(this.deptType.pageCount) * 10;
          this.tableData = this.deptType.list;
          this.pageSize = this.deptType.pageSize;
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].content.length > 14) {
              this.tableData[i].content =
                this.tableData[i].content.slice(0, 12) + "。。";
            }
          }
        },
        this
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
    this.getTitle1();
    this.getInform();
  }
};
</script>
<style lang="scss" scoped>
.library_top {
  background: #fff;
  height: 100%;
  padding: 0 10px;
  position: relative;
}
.stone_button {
  width: 100%;
  background: #fff;
  .el-button {
    width: 100px;
    height: 40px;
    margin: 5px 0 5px 10px;
  }
}
.stone_form {
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 70px;
  right: 0;
  background: #fff;
  padding-top: 5px;
  border-bottom: 1px solid #ddd;
  .stone_form_button {
    width: 70%;
    margin-top: 10px;
    padding-bottom: 10px;
    .stone_font {
      font-size: 21px;
    }
  }
  .stone_form_son {
    width: 70%;
    height: 230px;
    margin-left: 35px;
    margin-top: 20px;
    border: 1px solid #ddd;
    .el-row {
      border-bottom: 1px dashed #ddd;
      padding: 5px 0;
    }
    .stone_text {
      width: 100%;
      margin: 10px 10px;
      overflow: auto;
      height: 170px;
    }
  }
}
</style>
