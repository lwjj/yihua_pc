<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/bazhua/circle' }">八爪圈</el-breadcrumb-item>
        <el-breadcrumb-item>我的报名</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-col class="content">
      <div class="topTitle">
        <div class="flex">
          选择状态：
          <el-select v-model="value" placeholder="请选择" @change="handleChange2()">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="flex">
             <el-date-picker
            v-model="dateValue"
            type="daterange"
            range-separator="至"
            @change="dateChange"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="flex">
          <el-input class="mr1" v-model="input" placeholder="请输入查询人"></el-input>
          <el-button plain @click.native="getList">查询</el-button>
        </div>
      </div>
      <!-- <el-col :span="24" style="margin: 10px 0">
        <el-col :span="5">
          <el-col :span="8">选择状态:</el-col>
          <el-col :span="16">
            <template>
              <el-select v-model="value" placeholder="请选择" @change="handleChange2()">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-col>
        </el-col>
        <el-col :span="10">
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            range-separator="至"
            @change="dateChange"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-input v-model="input" placeholder="请输入查询人"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button plain @click.native="getList">查询</el-button>
        </el-col>
      </el-col> -->
      <div class="tip-detail mt1"  v-if="tipList.length>0 &&item.bbs"  v-for="(item,index) in tipList" :key="index">
        <img :src="item.headPortrait" width="48" height="48" class="headerIcon" alt="">
        <div class="headRight">
          <div class="headerTitle">标题：{{item.bbs.title}}</div>
          <div class="headerContent">
            <div class="name">报名人：{{item.nickname}}</div>
            <div class="createDate">报名时间：{{item.createDate}}</div>
            <div class="status">
              状态：
              <div class="text-center" v-if="item.status*1==1" :style="{color:'rgb(35, 172, 56)'}">正常</div>
              <div class="text-center" v-if="item.status*1==2" :style="{color:'rgb(35, 172, 56)'}">完成</div>
              <div class="text-center foCo9" v-if="item.status*1==3">过期</div>
              <div class="text-center foCo9" v-if="item.status*1==4">关闭</div>
            </div>
          </div>
        </div>
      </div>

      <el-col v-if="tipList.length>0"  v-for="item,index in tipList" :key="index" class="tip-detail mt2"
              style=" cursor: pointer" :span="24">
        <el-col @click.native="toUserDetail(item.userId)" :span="4">
          <img :src="item.headPortrait" style="width: 80px;border-radius: 50%;" alt="">
        </el-col>
        <el-col :span="9" v-if="item.bbs" style="line-height: 30px" @click.native="toDetail(item.userId,item.bbs.guid)">
          <el-col>{{item.bbs.title}}</el-col>
          <el-col style="color: rgb(35, 172, 56)">{{item.nickname}}</el-col>
          <el-col>{{item.createDate}}</el-col>
        </el-col>
        <el-col :span="4" style="line-height: 30px">
          <el-col>
            <div class="text-center" v-if="item.status*1==1" :style="{color:'rgb(35, 172, 56)'}">正常</div>
            <div class="text-center" v-if="item.status*1==2" :style="{color:'rgb(35, 172, 56)'}">完成</div>
            <div class="text-center foCo9" v-if="item.status*1==3">过期</div>
            <div class="text-center foCo9" v-if="item.status*1==4">关闭</div>
          </el-col>
        </el-col>
        <el-col :span="7">
          <!-- <img style="width: 1.5rem" :src="item.qrcodeSrc" alt=""> -->
          </el-col>
        <!--<el-col style="line-height: 30px;background: #f5f5f5;margin: 10px 0;padding: 0 5px">{{item.content}}</el-col>-->
        <!--<el-col :span="24" style="line-height: 30px">-->
          <!--<el-col :span="3"><img style="width: 30%;border-radius: 50%" :src="item.headPortrait" alt=""></el-col>-->
          <!--<el-col :span="6">{{item.nickname}}</el-col>-->
          <!--<el-col :span="15" style="text-align: right">评论：{{item.commentNum}}&nbsp;&nbsp;&nbsp;浏览：{{item.viewNum}}</el-col>-->
        <!--</el-col>-->
      </el-col>
      <el-col v-if="tipList.length<=0" style="text-align: center" class="tip-detail">
        啦啦啦，啦啦啦，没有数据啦~~
      </el-col>
      <el-col>
        <el-pagination
          v-if="bm.rowCount"
          background
          style="float:right;"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="5"
          :total="bm.rowCount*1">
        </el-pagination>
        <!--<el-col class="flexRow flexAlignC flexJustE" :span="16">-->
          <!--<el-pagination background :page-size="bm.pageSize" @current-change="handleCurrentChange"-->
                         <!--layout="prev, pager, next" :total="bm.rowCount"></el-pagination>-->
          <!---->
        <!--</el-col>-->
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
      dateValue: [],
      userInfo,
      input: "",
      bm: {
        pageNo: 1,
        pageSize: 5,
        rowCount: 0,
        startDate: "",
        endDate: ""
      },
      value: 0,
      options: [
        {
          name: "全部",
          value: 0
        },
        {
          name: "正常",
          value: 1
        },
        {
          name: "完成",
          value: 2
        },
        {
          name: "关闭",
          value: 3
        },
        {
          name: "过期",
          value: 4
        }
      ],
      data: {},
      circleType: 1,
      tipList: [],
      tipTopList: [],
      district: {},
      tipType: [],
      scope: 0
    };
  },
  methods: {
    toDetail(id, guid) {
      this.$router.push("/bazhua/tipDetail?userId=" + id + "&bbsId=" + guid);
    },
    toUserDetail(id) {
      this.$router.push("/bazhua/userInfo1?guid=" + id);
    },
    dateChange() {
      console.log(this.dateValue);
      if (this.dateValue != null) {
        this.bm.startDate =
          this.dateValue[0].format("yyyy-MM-dd") + " 00:00:00";
        this.bm.endDate = this.dateValue[1].format("yyyy-MM-dd") + " 23:59:59";
      } else {
        this.bm.startDate = "";
        this.bm.endDate = "";
      }
      this.getList();
    },
    handleChange2() {
      this.getList();
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
      if (this.bm.startDate != "") {
        data.startDate = this.bm.startDate;
      }
      if (this.bm.endDate != "") {
        data.endDate = this.bm.endDate;
      }
      if (this.value != 0) {
        data.status = this.value;
      }
      if (this.input != "") {
        data.keyword = this.input;
      }
      this.$ajax(
        `${this.subUrl.sc}/bbsApplicant/listBbsApplicant`,
        data,
        res => {
          this.tipList = res.data.list;
          for (var i = 0; i < this.tipList.length; i++) {
            this.tipList[i].qrcodeSrc = `${this.baseUrl}${
              this.subUrl.sc
            }/bbsApplicant/getApplicantCode?userId=${
              this.tipList[i].userId
            }&token=${this.$getkey()}&guid=${this.tipList[i].guid}`;
          }
          this.bm.rowCount = res.data.rowCount;
        },
        this
      );
    }
  },
  mounted() {
    // 任务统计
    // this.getbbsType();
    // 获取任务类型
    this.getList();
  }
};
</script>
<style lang="scss" scoped>
.tip-detail {
  border: 1px dashed #ddd;
  padding: 10px;
  display: flex;
  .headRight{
    padding-left: 10px;
    display: flex;
    flex: 1;
    width: 100%;
    flex-flow: column wrap;
    justify-content: space-between;
    .headerContent{
      display: flex;
      width: 100%;
      justify-content: space-between;
      .status{
        display: flex;
      }
    }
  }
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
.topTitle{
  display: flex;
  justify-content: space-between;
}
</style>
