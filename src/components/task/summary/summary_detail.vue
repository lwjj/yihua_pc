<template>
    <div id="wealth">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item @click.native='$router.go(-1)'>返回</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/">明细说明</a></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="main">
                <div class="top">
                    <el-date-picker
                    v-model="value1"
                    type="month"
                    placeholder="选择月份"
                    @change="changeData">
                    </el-date-picker>
                    <el-select v-model="value2" placeholder="请选择" v-if="userInfo.postType==2" @change="getMain(value2)">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="list_item" v-for="(item,index) in tabledata" :key="index">
                <div class="list_title">表单{{index+1}}标题:{{item.title}}</div>
                <div class="item" v-for="(item1,key) in item.tableRows" :key="key">
                    <div class="item_rows" v-for="(item2,key2) in item1.tableDatas" :key="key2">
                        <div>{{item2.value}}</div>
                    </div>
                </div>
            </div> 
            <div class="noDate">暂无数据</div>
        </div>
   </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      organInfo: {},
      value1: "",
      value2: "",
      options: [],
      tabledata: [],
      time: "",
      deptId: ""
    };
  },
  methods: {
    getDepartment() {
      if (this.userInfo.postType == 2) {
        var data = {
          token: this.$getkey(),
          organId: this.organInfo.guid
        };
        this.$ajax(
          `${this.subUrl.user}/admin/deptManage/organDepartmentInfo`,
          data,
          res => {
            for (var i = 0; i < res.data.length; i++) {
              var a = {};
              a.value = res.data[i].guid;
              a.label = res.data[i].deptName;
              this.options.push(a);
            }
          },
          this
        );
      }
    },
    getMain(val) {
      var data = {
        token: this.$getkey()
      };
      if (val == undefined) {
        data.deptId = this.userInfo.deptId;
        this.deptId = this.userInfo.deptId;
      } else {
        data.deptId = val;
        this.deptId = val;
      }
      if (this.time !== "") {
        data.repMonth = this.time;
      }
      this.$ajax(
        `${this.subUrl.activity}/manageMonRep/queryDeptRow`,
        data,
        res => {
          this.tabledata = [];
          this.tabledata = res.data;
        },
        this
      );
    },
    changeData() {
      var n = this.value1.getFullYear();
      var y = this.value1.getMonth() + 1;
      y = y.toString();
      if (y.length == 1) {
        y = "0" + y;
      }
      this.time = n + "-" + y;
      this.getMain(this.deptId);
    }
  },
  updated() {},
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getDepartment();
    this.getMain();
  }
};
</script>
<style lang="scss" scoped>
.noDate {
  margin: 20px auto;
  font-size: 16px;
  color: #666;
  text-indent: 1em;
  line-height: 50px;
  border-bottom: 1px solid #ddd;
  border-top: 1px solid #ddd;
}
#wealth {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: scroll;
  .box {
    overflow-x: hidden;
    height: 100%;
    margin-top: 10px;
    width: 98%;
    margin-left: 1%;
    background: #fff;
    .main {
      width: 98%;
      margin-left: 1%;
      padding-top: 10px;
    }
    .list_item {
      padding: 20px;
      border-bottom: 1px solid #ddd;
      .list_title {
        background: #e4e4e4;
        line-height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        font-size: 16px;
        text-align: center;
      }
      .item {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-around;
        line-height: 50px;
        font-size: 14px;
        border-left: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        .item_rows {
          flex: 1;
          border-right: 1px solid #ddd;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          & > div {
            padding: 0 20px;
          }
        }
        .mDelete {
          width: 80px;
          margin: 0 10px;
          height: 34px;
        }
      }
      .item:nth-child(2n + 1) {
        background: #e4e4e4;
      }
    }
  }
}
.clear {
  clear: both;
}
</style>
