<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/bazhua/circle' }">八爪圈</el-breadcrumb-item>
        <el-breadcrumb-item>我的帖子</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-col class="content">
      <div class="list_item">
        <div class="label">选择状态</div>
        <el-select v-model="value8" placeholder="请选择" @change="handleChange2()">
          <el-option
            v-for="item in options7"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-table
          class="mt2"
          :data="tipList"
          border
          style="width: 100%;height:calc(100% - 100px)">
          <el-table-column
            fixed
            prop="createDate"
            label="日期"
            width="180">
          </el-table-column>
           <el-table-column 
            label="状态"
            width="150">
            <template slot-scope="scope">
               <span :style="`color:rgb(35, 172, 56)`" v-if="scope.row.status == 1">正常</span>
                <span :style="`color:rgb(35, 172, 56)`" v-if="scope.row.status == 2">关闭</span>
                <span :style="`color:rgb(35, 172, 56)`" v-if="scope.row.status == 3">过期</span>
                <span :style="`color:rgb(35, 172, 56)`" v-if="scope.row.status == 4">待审核</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            show-overflow-tooltip
            >
          </el-table-column>
            <el-table-column
            fixed="right"
            width="240"
            label="操作">
            <template slot-scope="scope">
                <el-button type="warning" size="mini" v-if="scope.row.status == 1" @click.native="open(1,scope.row.guid)">关闭</el-button>
                <el-button type="success" disabled size="mini" v-if="scope.row.status == 2" @click.native="open2(scope.row.guid)">打开 </el-button>
                
                <el-button type="danger" size="mini"  @click.native="open(2,scope.row.guid)">删除</el-button>
                <el-button type="primary" size="mini" @click.native="toDetail(scope.row.userId,scope.row.guid,scope.row.status)">详情</el-button>
            </template>
          </el-table-column>
      </el-table>
      <el-col class="mt1">
        <el-pagination
          v-if="bm.rowCount>0"
          background
          style="float:right;"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="12"
          :total="bm.rowCount*1">
        </el-pagination>
       
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
      value1: "",
      value2: "",
      value3: "",
      value4: "",
      value5: "",
      value6: "",
      value7: "",
      value8: "",
      showDis1: false,
      showDis2: false,
      showDis3: false,
      showDis4: false,
      showDis5: false,
      bm: {
        pageNo: 1,
        pageSize: 10,
        rowCount: 0
      },
      data: {},
      options1: [],
      options2: [],
      options3: [],
      options4: [],
      options5: [],
      options6: [],
      options7: [
        {
          name: "全部",
          value: 0
        },
        {
          name: "正常",
          value: 1
        },
        {
          name: "关闭",
          value: 2
        },
        {
          name: "过期",
          value: 3
        },
        {
          name: "待审核",
          value: 4
        }
      ],
      circleType: 1,
      tipList: [],
      tipTopList: [],
      district: {},
      tipType: [],
      scope: 0
    };
  },
  methods: {
    toDetail(id, guid, status) {
      if (status == 1) {
        this.$router.push("/bazhua/tipDetail?userId=" + id + "&bbsId=" + guid);
      } else if (status == 2) {
        this.$message.error("帖子已关闭");
      } else if (status == 3) {
        this.$message.error("帖子已过期");
      } else {
        this.$router.push("/bazhua/tipDetail?userId=" + id + "&bbsId=" + guid);
      }
    },
    toUserDetail(id) {
      this.$router.push("/bazhua/userInfo1?guid=" + id);
    },
    open(type, id) {
      var title = type * 1 == 1 ? "关闭" : "删除";
      this.$confirm("请确认" + title + "当前帖子", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.closeDel(type, id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消" + title
          });
        });
    },
    open2(id) {
      
     var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        bbsIdList: id
      };
     
      this.$ajax(
        `${this.subUrl.sc}/bbs/reopenBbsList`,
        data,
        res => {
          this.$message({
            type: "success",
            message: "打开成功!"
          });
          this.getList();
//        this.showInfo = true;
        },
        this
      );
    },
    closeDel(type, id) {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        bbsIdList: id
      };
      console.log(this.userInfo);
      var title = type * 1 == 1 ? "关闭" : "删除";
      var url = type == 1 ? "/bbs/closeBbsList" : "/bbs/deleteBBsList";
      this.$ajax(
        `${this.subUrl.sc}` + url,
        data,
        res => {
          this.$message({
            type: "success",
            message: title + "成功!"
          });
          this.getList();
          this.showInfo = true;
        },
        this
      );
    },
    handleChange(type, guid) {
      this.scope = type - 1;
      this.data.scopeValue = guid;
      this.getDistrict(type, guid);
    },
    handleChange1() {
      this.options6 = this.value6;
      this.showDis5 = this.value6 != "" ? true : false;
      this.value7 = "";
    },
    handleChange2() {
      this.getList();
    },
    getbbsType() {
      var data = {
        token: this.$getkey(),
        circleType: this.circleType
      };
      this.$ajax(
        `${this.subUrl.sc}/bbs/getBBsType`,
        data,
        res => {
          this.tipType = res.data;
        },
        this
      );
    },
    getDistrict(type, index) {
      var data = {
        id: index
      };
      this.$ajax(
        `${this.subUrl.user}/comm/getDistrictList`,
        data,
        res => {
          if (res.data.length > 0) {
            switch (type) {
              case 1:
                this.options1 = res.data;
                break;
              case 2:
                this.options2 = res.data;
                this.showDis1 = true;
                break;
              case 3:
                this.options3 = res.data;
                this.showDis2 = true;
                break;
              case 4:
                this.options4 = res.data;
                this.showDis3 = true;
                break;
              case 5:
                this.options5 = res.data;
                this.showDis4 = true;
                break;
            }
          } else {
            this.getList();
          }
        },
        this
      );
    },
    handleCurrentChange(val) {
      this.bm.pageNo = val;
      this.getList();
    },
    getList() {
      var data = {
        token: this.$getkey(),
        pageNo: this.bm.pageNo,
        pageSize: this.bm.pageSize,
        userId: this.userInfo.guid
      };
      if (this.value8 != 0) {
        data.status = this.value8;
      }
      this.$ajax(
        `${this.subUrl.sc}/bbs/listBbs`,
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
    this.getbbsType();
    // 获取任务类型
    this.getList();
    this.getDistrict(1, 0);
  }
};
</script>
<style lang="scss" scoped>
.list_item {
  display: flex;
  align-items: center;
  .label {
    width: 80px;
    padding-right: 10px;
    // text-align: right;
  }
  .flex1 {
  }
}
.tip-detail {
  line-height: 40px;
  border: 2px dashed #ededed;
  padding: 10px;
  margin-bottom: 10px;
}
#new_progress {
  height: 100%;
  overflow: auto;
}
.content {
  padding: 10px;
  margin: 20px 0;
  height: 100%;
  background: #fff;
}
</style>
