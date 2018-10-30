<template>
    <div class="scheduling">
        <div class="title">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/manage/work'}">工作管理</el-breadcrumb-item>
            <el-breadcrumb-item>管理处调度</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="main">
          <div class="scheduling_select">
            <div class="tips">*如果不修改值班人员就无需编辑明天的，会自动读取今天的，如果要修改，编辑明天的，到时数据会自动更改</div>
            <el-select v-model="value" placeholder="请选择" @change="getMain">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
              </el-option>
            </el-select>
            <router-link v-if="showBuild" to="/manage/scheduling/scheduling_editor" v-show="isRight"><el-button>编辑</el-button></router-link>
          </div>
          <div style="clear:both;"></div>
          <div class="sucheduling_main">
            <div style="width:98%;margin-left:1%;border:1px solid #ddd;">
                <div class="floor1">
                    <h3>日期：</h3>
                    <span>{{tableDate2.watchDate}}</span>
                    <h3 class="floor1_last">{{tableDate2.week}}</h3>
                </div>
                <div class="floor2_box">
                  <div class="floor2">
                      <h3>总调度：</h3>
                      <span>{{tableDate2.dispatcher}}</span>
                  </div>
                  <div class="floor3">
                      <h3>总值班：</h3>
                      <span>{{tableDate2.watch}}</span>
                  </div>
                  <div class="clear"></div>
                </div>
                <div class="floor4">
                    <div class="floor4_box">
                        <div>
                            <h4>早班</h4>
                            <span>客服部：<i>{{tableDate2.early1}}</i></span>
                            <span>工程部：<i>{{tableDate2.early2}}</i></span>
                            <span style="border:0">秩序部：<i>{{tableDate2.early3}}</i></span>
                            <p class="clear"></p>
                        </div>
                        <div>
                            <h4>中班</h4>
                            <span>客服部：<i>{{tableDate2.student1}}</i></span>
                            <span>工程部：<i>{{tableDate2.student2}}</i></span>
                            <span style="border:0">秩序部：<i>{{tableDate2.student3}}</i></span>
                            <p class="clear"></p>
                        </div>
                        <div>
                            <h4>晚班</h4>
                            <span>客服部：<i>{{tableDate2.night1}}</i></span>
                            <span>工程部：<i>{{tableDate2.night2}}</i></span>
                            <span style="border:0">秩序部：<i>{{tableDate2.night3}}</i></span>
                            <p class="clear"></p>
                        </div>
                        <div style="border-bottom:0;">
                            <h4>电话</h4>
                            <span>客服部：<i>{{tableDate2.phone1}}</i></span>
                            <span>工程部：<i>{{tableDate2.phone2}}</i></span>
                            <span style="border:0">秩序部：<i>{{tableDate2.phone3}}</i></span>
                            <p class="clear"></p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
       
    </div>
</template>
<script>
export default {
  data() {
    return {
      showBuild: false,
      userInfo: {},
      organInfo: {},
      type1: "",
      tableDate1: [],
      tableDate2: {
        watchDate: "",
        week: "",
        dispatcher: "",
        watch: "",
        early1: "",
        early2: "",
        early3: "",
        student1: "",
        student2: "",
        student3: "",
        night1: "",
        night2: "",
        night3: "",
        phone1: "",
        phone2: "",
        phone3: ""
      },
      isRight: true,
      options: [
        {
          value: "1",
          label: "今天"
        },
        {
          value: "2",
          label: "明天"
        },
        {
          value: "3",
          label: "昨天"
        }
      ],
      value: "今天"
    };
  },
  methods: {
    getMain() {
      value: "今天";
      console.log(this.value);
      if (this.value == 1 || this.value == "今天") {
        this.type1 = 1;
      } else {
        this.type1 = this.value;
      }
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid,
        dateType: this.type1
      };
      this.$ajax(
        `${this.subUrl.activity}/watchBill/getWatchBill`,
        data,
        res => {
          this.tableDate1 = res.data;
          this.tableDate2 = {};
          //日期
          this.tableDate2.watchDate = this.tableDate1.watchDate;
          //星期
          this.tableDate2.week = this.tableDate1.week;
          if (this.tableDate1.watch) {
            //总调度
            this.tableDate2.dispatcher =
              this.tableDate1.dispatcher.name +
              " " +
              this.tableDate1.dispatcher.account;
            //总值班
            this.tableDate2.watch =
              this.tableDate1.watch.name + " " + this.tableDate1.watch.account;
            //早班
            this.tableDate2.early1 =
              this.tableDate1.list[0][0].userInfo.name +
              "" +
              this.tableDate1.list[0][0].userInfo.account;
            this.tableDate2.early2 =
              this.tableDate1.list[0][1].userInfo.name +
              "" +
              this.tableDate1.list[0][1].userInfo.account;
            this.tableDate2.early3 =
              this.tableDate1.list[0][2].userInfo.name +
              "" +
              this.tableDate1.list[0][2].userInfo.account;
            //中班
            this.tableDate2.student1 =
              this.tableDate1.list[1][0].userInfo.name +
              "" +
              this.tableDate1.list[1][0].userInfo.account;
            this.tableDate2.student2 =
              this.tableDate1.list[1][1].userInfo.name +
              "" +
              this.tableDate1.list[1][1].userInfo.account;
            this.tableDate2.student3 =
              this.tableDate1.list[1][2].userInfo.name +
              "" +
              this.tableDate1.list[1][2].userInfo.account;
            //晚班
            this.tableDate2.night1 =
              this.tableDate1.list[2][0].userInfo.name +
              "" +
              this.tableDate1.list[2][0].userInfo.account;
            this.tableDate2.night2 =
              this.tableDate1.list[2][1].userInfo.name +
              "" +
              this.tableDate1.list[2][1].userInfo.account;
            this.tableDate2.night3 =
              this.tableDate1.list[2][2].userInfo.name +
              "" +
              this.tableDate1.list[2][2].userInfo.account;
            //电话
            this.tableDate2.phone1 = this.tableDate1.deptList[0].tel;
            this.tableDate2.phone2 = this.tableDate1.deptList[1].tel;
            this.tableDate2.phone3 = this.tableDate1.deptList[2].tel;
          }
        },
        this
      );
    },
    getRight() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/user/getPermissions`,
        data,
        res => {
          if (res.data.propertyManagement.subclass.length > 0) {
            this.isRight = true;
          } else {
            this.isRight = false;
          }
        },
        this
      );
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
    this.getMain();
    console.log(this.userInfo);
    this.getRight();
    this.$getRoot(res => {
      this.rootList = res;
      for (var a of this.rootList.propertyManagement.subclass) {
        if (a.name == "工作管理") {
          for (var b of a.subclass) {
            if (b.name == "管理处调度") {
              if (b.subclass.length > 0) {
                this.showBuild = true;
              }
            }
          }
        }
      }
    }, this);
  }
};
</script>
<style lang="scss" scoped>
.main {
  overflow: auto;
  height: 100%;
  background: #fff;
}
.tips {
  color: #ec0000;
  float: left;
  padding: 0 10px;
  line-height: 40px;
}
.scheduling {
  height: 100%;
  .scheduling_select {
    padding-right: 40px;
    text-align: right;
    padding-top: 10px;
    background: #fff;
    .el-select {
      padding-right: 10px;
      margin-left: 1%;
    }
  }
}
.sucheduling_main {
  background: #fff;
  padding-top: 20px;
  padding-right: 20px;
  .floor1 {
    text-align: center;
    padding: 20px 0;
    border-bottom: 1px solid #ddd;
    h3 {
      display: inline-block;
    }
    .floor1_last {
      margin-left: 10px;
    }
  }
  .floor2_box {
    border-bottom: 1px solid #ddd;
    .floor2 {
      padding: 20px 0;
      float: left;
      border-right: 1px solid #ddd;
      text-align: center;
      width: 50%;
      h3 {
        display: inline-block;
      }
    }
    .floor3 {
      float: left;
      text-align: center;
      width: 50%;
      padding: 20px 0;
      h3 {
        display: inline-block;
      }
    }
  }
  .floor4 {
    .floor4_box {
      div {
        border-bottom: 1px solid #ddd;
        h4 {
          padding: 20px 0;
          float: left;
          width: 25%;
          text-align: center;
          border-right: 1px solid #ddd;
        }
        span {
          padding: 20px 0;
          display: block;
          float: left;
          font-size: 14px;
          text-align: center;
          width: 25%;
          border-right: 1px solid #ddd;
        }
      }
    }
  }
  .floor5 {
    padding-top: 10px;
    margin-left: 30px;
    div {
      margin-left: 40px;
      span {
        font-size: 19px;
        margin-left: 10px;
      }
    }
    padding-bottom: 100px;
  }
}
.clear {
  clear: both;
}
</style>
