<template>
<div id='quli_del'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>会议详情</div> -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/meeting' }">会议纪要</el-breadcrumb-item>
            <el-breadcrumb-item>会议详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="del">
      <ul class="delList clearfix">
        <li>会议议题:<span>{{Del.meetingTopic}}</span></li>
        <li>会议时间:<span>{{Del.meetingDate}}</span></li>
        <li>会议地点:<span>{{Del.meetingAddress}}</span></li>
        <li>记录人:<span>{{Del.recorderName}}</span></li>
        <li>参与人员:<span>{{Del.participantName}}</span></li>
        <li>单号:<span>{{Del.guid}}</span></li>
      </ul>
         <!-- 表单 -->
<div class="inform_table">
   <el-table
   border
    :data="tableData"
    height="500"
    empty-text
    >
    <el-table-column
    header-align="center"
      prop="spokesmanName"
      label="发言人"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="content"
      label="内容"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
    prop="executorName"
    label="执行人"
      >
       <!-- <template slot-scope="scope">
         <div>{{scope.row.type}}</div>
         <span class="emerType">类型:【{{scope.row.typeName}}】</span>
      </template> -->
    </el-table-column>
    <el-table-column
    header-align="center"
    prop="deadline"
    label="截止日期"
    :formatter="formatTime"

      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="completion"
      label="完成情况(%)"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="verifierName"
      label="验证人"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      label="操作"
      >
      <template slot-scope="scope">
        <el-button v-show="scope.row.isEnable && scope.row.type == 1" type="primary" plain size="small" @click="turnTo('/manage/quality/track_bill/'+scope.row.taskBillId)">查看跟踪任务单</el-button>
        <!-- <el-button v-show="scope.row.type == 1" type="primary" plain size="small" @click="turnTo('/manage/quality/track_bill/'+scope.row.taskBillId)">查看跟踪任务单</el-button> -->
        <!-- <el-button type="danger" plain size="small">编辑</el-button> -->
      </template>
    </el-table-column>
  </el-table>
 </div>
        <!-- <div class="lead_idea">
            <el-button class="subBtn" type="primary" @click="turnTo('/manage/quality/track_bill/'+tableData[0].taskBillId)">查看跟踪任务单</el-button>
      </div> -->
    </div>
</div>

</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      organInfo: {},
      Del: {},
      tableData: [],
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    turnTo(e) {
      this.$router.push(e);
    },
    //请求详情页面
    getDel() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        meetingSummaryBillId: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.activity}/meetingSummary/getMeetSummyBill`,
        data,
        res => {
          console.log(res, "res");
          this.Del = res.data.meetingSummaryBill;
          this.tableData = res.data.meetingSummaryBillRows;
        },
        this
      );
    },
    //时间格式化
    formatTime(row, column) {
      var date = row[column.property];
      if (date) {
        return date.split(" ")[0];
      } else {
        return "";
      }
    },
    back() {
      this.$router.go(-1);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getDel();
  }
};
</script>
<style lang="scss" scoped>
#quli_del {
  height: 100%;
  padding-left: 280px;
  padding-right: 20px;
  overflow: scroll;
  .text {
    i {
      padding: 20px 20px;
    }
  }
}
.del {
  padding-bottom: 200px;
}
.delList {
  background: #fff;
  padding: 20px 50px;
  margin-top: 20px;
  li {
    width: 50%;
    padding: 5px 0;
    float: left;
  }
  span {
    padding-left: 20px;
  }
}

.lead_idea {
  padding: 20px 50px;
  background: #fff;
  margin: 20px 0;
  text-align: right;
  .subBtn {
    margin-right: 50px;
  }
}
.upload_photo {
  background: #fff;
  padding: 0 0 20px 50px;
  .pho_title {
    padding-bottom: 10px;
  }
}
.delCon {
  padding: 5px 50px;
  background: #fff;
  p {
    padding: 5px 5px 50px 5px;
    border: 1px solid #ccc;
  }
}
.people {
  padding: 10px 50px;
  background: #fff;
  span {
    padding: 5px 10px;
    display: inline-block;
  }
}
// 表格
.inform_table {
  text-align: center;
  padding: 0;
}
</style>