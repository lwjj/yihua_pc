<template>
<div id='pur_del'>
    <div class="title">
        <div class="text"><i @click="back" class="el-icon-arrow-left"></i>详情</div>
    </div>
    <div class="del">
        <!-- <div class="del_title">
            <span>标题:{{Del.title}}</span>
        </div>       -->
      <ul class="delList clearfix">
        <li>标题:<span>{{Del.title}}</span></li>
        <li v-show="this.Del.type==3">月份:<span>{{Del.custoMmonth}}</span></li>
        <li v-show="this.Del.type==2">日期:<span>{{startTime}} 至 {{endTime}}</span></li>
        <li>部门:<span>{{Del.deptName}}</span></li>
        <li>填表日期:<span>{{reportTime}}</span></li>
        <li>单号:<span>{{Del.guid}}</span></li>
        <li>开始时间:<span>{{Del.startTime}}</span></li>
        <li>结束时间:<span>{{Del.endTime}}</span></li>
      </ul>
       <div class="work_content" v-if="this.Del.type!=4">
          <!-- 表单 -->
        <div class="inform_table">
          <!-- 日报 -->
          <el-table 
            v-show="this.Del.type==1"
            border
            :data="workContnet"
            >
            <el-table-column
            header-align="center"
            width="80px"
            type="index"
            label="序号"
            >
          </el-table-column>
            <el-table-column
            header-align="center"
              prop="workContent"
              label="工作内容"
              >
            </el-table-column>
            <el-table-column
            header-align="center"
              prop="workMeasure"
              label="措施"
              >
            </el-table-column>
            <!-- <el-table-column
            header-align="center"
              prop="executorName"
              label="执行人"
              >
            </el-table-column>
            <el-table-column
            header-align="center"
              prop="progress"
              label="完成情况(%)"
              >
            </el-table-column> -->
          </el-table>
          <!-- 周报 -->
          <el-table 
            v-show="this.Del.type==2"
            border
            :data="workContnet"
            >
            <el-table-column
            header-align="center"
            width="80px"
            type="index"
            label="序号"
            >
          </el-table-column>
            <el-table-column
            header-align="center"
              prop="workContent"
              label="工作内容"
              >
            </el-table-column>
            <el-table-column
              header-align="center"
              prop="workMeasure"
              label="措施"
              >
            </el-table-column>
            <!-- <el-table-column
              v-show="Del.type!=2"
              header-align="center"
              prop="startTime"
              label="开始时间"
              :formatter="formatTime"
              >
            </el-table-column>
            <el-table-column
              v-show="Del.type!=2"
              header-align="center"
              prop="endTime"
              label="截至时间"
              :formatter="formatTime"
              >
            </el-table-column> -->
            <el-table-column
            header-align="center"
              prop="executorName"
              label="执行人"
              >
            </el-table-column>
            <el-table-column
            header-align="center"
              prop="progress"
              label="完成情况(%)"
              >
            </el-table-column>
          </el-table>
          <!-- 月报 -->
          <el-table
            v-show="this.Del.type==3"
            border
            :data="workContnet"
            >
            <el-table-column
            header-align="center"
            width="80px"
            type="index"
            label="序号"
            >
          </el-table-column>
          
            <el-table-column
            header-align="center"
              prop="workContent"
              label="工作内容"
              >
            </el-table-column>
            <el-table-column
            header-align="center"
              prop="workMeasure"
              label="措施"
              >
            </el-table-column>
            <el-table-column
              header-align="center"
              prop="endTime"
              label="截至时间"
              :formatter="formatTime"
              >
            </el-table-column>
            <el-table-column
            header-align="center"
              prop="executorName"
              label="执行人"
              >
            </el-table-column>
            <el-table-column
            header-align="center"
              prop="progress"
              label="完成情况(%)"
              >
            </el-table-column>
          </el-table>
        </div>
  
        </div>
      <div class="info" v-if='this.Del.type==4'>
        <div> 
          <span>工作建议</span>
        </div>
          <p>{{Del.suggest?Del.suggest:"暂无详情"}}</p> 
      </div>
      <div class="info">
        <div>
          <span v-show="this.Del.type==1 && Del.summarize != ''">今日总结</span>
          <span v-show="this.Del.type==2">本周总结</span>
          <span v-show="this.Del.type==3">下月计划</span>
          <span v-show="this.Del.type==4">工作总结</span>
        </div>
        <p v-show="Del.summarize != ''">{{Del.summarize?Del.summarize:"暂无详情"}}</p> 
        <vue-preview class='imgPath' :slides="sliders" v-if='sliders'  @close="''"></vue-preview>
      </div>
      
      <div class="lead_idea" v-if="$route.query.type==1|| Del.eply">
          <div class="idea" v-if="$route.query.type==1|| Del.eply" >审批意见</div>
          <p v-show="this.Del.isEply">{{Del.eply}}</p>
          <div v-if="!Del.isEply && $route.query.type == 1">
             <el-input type="textarea" :rows="3" resize="no" placeholder="请输入审批意见" v-show="!this.Del.isEply" v-model="eply" class="idea_text"></el-input>
              <el-button v-show="!this.Del.isEply" class="" type="primary" @click="submitIdea">确定</el-button>
          </div>
      </div>
    </div>
</div>

</template>
<script>
export default {
  data() {
    return {
      sliders: [],
      isFirst: false,
      imgBox: "",
      Del: {},
      eply: "",
      startTime: "",
      endTime: "",
      reportTime: "",
      workContnet: [],
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    //请求详情页面
    getDel() {
      var data = {
        token: this.$getkey(),
        userId: localStorage.getItem("user_Id"),
        reportId: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.activity}/workbench/workReport/myReport/detail`,
        data,
        res => {
          console.log(res, "res");
          this.Del = res.data.workReport;
          this.workContnet = res.data.reportDetailList;
          this.imgBox = res.data.commAccessoryList;
          var b = this.$setImg(res.data.commAccessoryList, this);
          this.reportTime = this.Del.reportTime.split(" ")[0];
          if (this.Del.startTime && this.Del.endTime) {
            this.startTime = this.Del.startTime.split(" ")[0];
            this.endTime = this.Del.endTime.split(" ")[0];
          }
        },
        this
      );
    },
    // 提交审批意见
    submitIdea() {
      if (this.eply == "") {
        this.$message.error("请填写审批意见");
        return;
      }
      var data = {
        token: this.$getkey(),
        reportId: this.$route.params.id,
        eply: this.eply
      };
      this.$ajax(
        `${
          this.subUrl.activity
        }/workbench/workReport/myReport/eplyReportDetail`,
        data,
        res => {
          console.log(res, "res");
          this.$message.success("审批成功");
          this.back();
        },
        this
      );
    },
    //表格时间格式化
    formatTime(row, column) {
      var date = row[column.property];
      if (!date == "") {
        return date.split(" ")[0];
      }
    },
    // li时间格式化
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
#pur_del {
  height: 100%;
  padding-left: 300px;
  padding-right: 40px;
  overflow: scroll;
  .text {
    i {
      padding: 20px 20px;
    }
  }
}

.del_title {
  margin-top: 20px;
  padding: 10px 40px;
  background: #fff;
  border-bottom: 1px solid #ccc;
  .idea {
    float: right;
  }
}
.delList {
  background: #fff;
  padding: 20px 50px;
  li {
    width: 50%;
    padding: 5px 0;
    float: left;
  }
  span {
    padding-left: 20px;
  }
}
.work_content {
  margin-top: 20px;
  padding: 10px 40px;
  background: #fff;
  .con_title {
    li {
      width: 50%;
      float: left;
      border-bottom: 1px solid #ccc;
      padding: 10px 0;
    }
  }
  .con_list {
    margin: 30px 0;
    li {
      &:nth-of-type(1) {
        p {
          margin: 0 0 5px 0;
        }
      }
      &:nth-of-type(2),
      &:nth-of-type(3) {
        width: 50%;
        float: left;
        color: #999;
      }
    }
  }
}
.info {
  padding: 0 50px;
  background: #fff;
  & > div {
    line-height: 30px;
  }
  p {
    padding: 10px 10px 100px 10px;
    border: 1px solid #ccc;
  }
  .photo {
    li {
      float: left;
      margin: 10px 10px;
      border: 1px solid #ccc;
      img {
        width: 150;
        height: 150px;
        display: block;
      }
    }
  }
}
.lead_idea {
  padding: 20px 50px;
  background: #fff;
  margin: 20px 0;
  p {
    padding: 10px 10px 100px 10px;
    border: 1px solid #ccc;
  }
  .idea {
    padding: 10px 0;
  }
  .idea_text {
    padding: 10px;
    font-size: 16px;
    width: 100%;
    min-height: 100px;
  }
}
.inform_table {
  text-align: center;
  .el-table {
    font-size: 15px;
  }
}
.subBtn {
  float: right;
}
</style>