<template>
<div id='subTemplate'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>品质稽查详情</div> -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/quality' }">品质稽查</el-breadcrumb-item>
            <el-breadcrumb-item>品质稽查详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="del">
      <ul class="delList clearfix">
        <li>稽查日期:<span>{{Del.examineDate}}</span></li>
        <li>稽查类型:<span v-text="this.Del.type == 1 ? '交叉检查': '联合检查' "></span></li>
        <li>制表人:<span>{{Del.userName}}</span></li>
        <li>制表时间:<span>{{Del.createDate}}</span></li>
        <li>单号:<span>{{Del.guid}}</span></li>
      </ul>
         <!-- 表单 -->
<div class="inform_table">
   <el-table
   border
    :data="tableData"
    height="500"
    >
    <el-table-column
    header-align="center"
      prop="checkerName"
      label="检查人"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="deptName"
      label="被检部门"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
    prop="problem"
    label="存在问题"
      >
       <!-- <template slot-scope="scope">
         <div>{{scope.row.type}}</div>
         <span class="emerType">类型:【{{scope.row.typeName}}】</span>
      </template> -->
    </el-table-column>
    <el-table-column
    header-align="center"
    prop="deadline"
    label="整改期限"
    :formatter="formatTime"

      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="measure"
      label="措施"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      prop="progress"
      label="进度(%)"
      >
    </el-table-column>
    <el-table-column
    header-align="center"
      label="操作"
      >
      <template slot-scope="scope">
        <el-button type="primary" plain size="small" @click="turnTo('/manage/quality/track_bill/'+scope.row.taskBillId)">查看跟踪任务单</el-button>
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
      // desc: "同意同意同意同意"
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
        postType: this.userInfo.postType,
        examineBillId: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.activity}/examine/getExamineBill`,
        data,
        res => {
          console.log(res, "res");
          this.Del = res.data.examineBill;
          this.tableData = res.data.examineBillRowList;
          console.log(this.Del, "Del");
          console.log(this.tableData, "tableData");
        },
        this
      );
    },
    //时间格式化
    formatTime(row, column) {
      var date = row[column.property];
      return date.split(" ")[0];
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
#subTemplate {
  height: 100%;
  padding-left: 270px;
  padding-right: 10px;
  overflow: scroll;
  .text {
    i {
      padding: 20px 20px;
    }
  }
}
.del {
  // padding-bottom: 200px;
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