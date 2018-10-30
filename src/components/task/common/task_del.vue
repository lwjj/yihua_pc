<template>
<div id='subTemplate' v-if="loading">
    <div class="title">
        <div class="text"><i @click="back" class="el-icon-arrow-left"></i>任务详情</div>
        <el-button v-show="taskProShow" type="primary" size="small" class="taskpro" @click="turnTo('/task/allocate/task_progress/'+$route.params.id)">任务进度</el-button>
    </div>
    <div class="del" v-show="show">
      <ul class="delList clearfix">
        <li>状态:
          <span class="state" v-if="taskDel.taskBill.status==3">未启动</span>
          <span class="state" v-if="taskDel.taskBill.status==4">进行中</span>
          <span class="state" v-if="taskDel.taskBill.status==1">完成</span>
          <span class="state" v-if="taskDel.taskBill.status==0">关闭</span>
          <span class="state" v-if="taskDel.taskBill.status==5">验收</span>
          <span class="state" v-if="taskDel.taskBill.status==6">超时未完成</span>
          <span class="state" v-if="taskDel.taskBill.status==7">超时完成</span>
      </li>
        <li>标题:<span>{{taskDel.taskBill.taskName}}</span></li>
        <li v-if="taskDel.taskBill.startDate">
          开始时间:<span v-text="taskDel.taskBill.startDate.split(' ')[0]"></span>
          <span style="margin-left:20px" v-if="taskDel.taskBill.completionDate">
             结束时间:<span v-text="taskDel.taskBill.completionDate.split(' ')[0]"></span>
          </span>
        </li>  
        <li v-if="taskDel.taskBill.createDate">
          创建时间:<span v-text="taskDel.taskBill.createDate.split(' ')[0]"></span>
        </li>
        <li>类型:<span>{{taskDel.taskBill.typeName}}</span></li>
        <li>单号:<span>{{taskDel.taskBill.guid}}</span></li>
      </ul>
      <div class="info">
        <p>{{taskDel.taskBill.taskDetail}}</p> 
        <vue-preview class='imgPath' :slides="sliders" v-if='sliders'  @close="''"></vue-preview>
        </div>
      <div class="people">
          <div class="ptitle">执行人信息</div>
          <p>创建人:<span>{{taskDel.taskBill.userName}}</span></p>
          <p >执行人:<span v-for="(item,index) in taskDel.taskBill.executorInfo" :key="index">{{item.name}}</span></p>
          <!-- name 报错 -->
          <p>验证人:<span v-if="taskDel.taskBill.identifierInfo">{{taskDel.taskBill.identifierInfo.name}}</span></p>  
      </div>
       <!-- 表单 -->
      <div class="inform_table">
        <el-table
        border
           empty-text="暂无指派人"
          :data="taskDel.taskProgressList"
          >
          <el-table-column
          header-align="center"
            label="指派人"
            prop="userName"
            >
          </el-table-column>
          <el-table-column
          header-align="center"
            label="完成度(%)"
            prop="progress"
            >
          </el-table-column>
          <el-table-column
          header-align="center"
            label="更新时间"
            prop="updataTime"
            >
          </el-table-column>
          <el-table-column
          header-align="center"
            label="操作"
            >
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="turnTo('/task/allocate/progress_del/' + scope.row.guid)" plain>详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="state_bar">
          <el-steps :active="0"  space="200px">
            <el-step :title="item.title" v-for="(item,index) in taskDel.tasksRecordList" :key="index" :description="item.createTime">
              <img width="20" src="../../../assets/images/circle/select.png" slot="icon" alt="">
            </el-step>
        </el-steps>
      </div>
      
      <!-- <div class="submitBtn" v-if="this.$route.params.type==1"> -->
      <div class="submitBtn" v-if="submitShow">
        <el-button type="danger" @click="deal(0)">驳回</el-button>
        <el-button type="primary" v-if="userInfo.postType<4 && showShow" @click="assign()">指派人</el-button>
        <el-button type="success" @click="deal(1)">确定</el-button>
      </div>
      <div class="submitBtn" v-if="showReceive">
        <el-button type="primary" @click="receive">验收</el-button>
      </div>
    </div>
    <choosemyEmp class="choose" v-show="showEmploy" @checkMen="checkEmploy"></choosemyEmp>  
</div>

</template>
<script>
  
import choosemyEmp from "../../choose_people/choose_myEmp";
export default {
  components: {
    choosemyEmp
  },
  data() {
    return {
      sliders: null,
      loading: false,
      taskProShow: false,
      submitShow: false,
      showReceive: false,
      showtaskpro: false,
      show: true,
      showEmploy: false,
      taskDel: {},
      dialogImageUrl: "",
      dialogVisible: false,
      type: "",
      employ: "",
      employId: "",
      showShow:true
    };
  },
  methods: {
    receive() {
      this.$confirm("是否验收任务", "", { type: "warning" }).then(() => {
        console.log("taskId", this.$route.params.id);
        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid
        };
        data.taskId = this.$route.params.id;
        this.$ajax(
          `${this.subUrl.activity}/taskBill/taskProgress/completeIdentify`,
          data,
          res => {
            this.$message.success("验收成功");
            this.$router.go(-1);
          },
          this
        );
      });
    },
    turnTo(e) {
      this.$router.push(e);
    },
    // 指派人
    assign() {
      this.show = false;
      this.showEmploy = true;
    },
    // 选员工执行
    checkEmploy(checkList) {
      this.show = true;
      this.showEmploy = false;
      let arr = [];
      this.employ = [];
      checkList.forEach(ele => {
        this.employ.push(ele.split(",")[1]);
        arr.push(ele.split(",")[0]);
      }, this);
      this.employId = arr.join(",");
      this.deal(2);
    },
    //经理处理任务  0:驳回 1：确定（自己执行） 2：指派人执行
    deal(val) {
      var data = {
        token: this.$getkey(),
        userId: localStorage.getItem("user_Id"),
        idList: this.employId,
        taskBillId: this.$route.params.id,
        type: val
      };
      this.$ajax(
        `${this.subUrl.activity}/taskBill/allocationTask/assignedExecutor`,
        data,
        res => {
          this.$message.success("处理成功");
          this.back();
        },
        this
      );
    },
    //请求详情页面
    getTaskDel() {
      var data = {
        token: this.$getkey(),
        userId: localStorage.getItem("user_Id"),
        taskId: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.activity}/taskBill/taskProgress/taskBillDetail`,
        data,
        res => {
          this.taskDel = res.data;
          if (this.taskDel.tasks != null) {
            if (this.taskDel.tasks.status == 1) {
              this.submitShow = true;
            } else if (this.taskDel.tasks.status == 2) {
              this.taskProShow = true;
            } else if (this.taskDel.tasks.status == 3) {
              this.showReceive = true;
            }
          }
          for(let i=0;i<res.data.taskBill.executorInfo.length;i++){
            // if(this.taskDel.guid == res.data.taskBill.executorInfo[i].userId == localStorage.getItem("user_Id")){
            if(this.taskDel.taskBill.identifierInfo.userId ==  localStorage.getItem("user_Id")){
              this.showShow = false
            }
          }
          console.log(res.data.taskBill.executorInfo,"99999999999999999999")
          // 图片预览设置
          if (res.data.commAccessoryList) {
            var aaaa = this.$setImg(res.data.commAccessoryList, this);
          }
          this.loading = true;
        },
        this
      );
    },

    back() {
      this.$router.go(-1);
    },
    handleRemove(file, fileList) {},
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.getTaskDel();
  }
};
</script>



<style lang="scss" scoped>
#subTemplate {
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
.del {
  padding-bottom: 200px;
}
.delList {
  background: #fff;
  padding: 20px 50px;
  margin: 20px 0;
  li {
    width: 50%;
    padding: 5px 0;
    &:first-of-type {
      width: 100%;
    }
    &:nth-of-type(1),
    &:nth-of-type(2),
    &:nth-of-type(3) {
      float: left;
    }
    &:nth-of-type(4),
    &:nth-of-type(5) {
      float: right;
    }
  }
  span {
    padding-left: 20px;
  }
}
.info {
  padding: 20px 50px;
  background: #fff;
  margin: 20px 0;
  p {
    padding: 5px 5px 100px 5px;
    border: 1px solid #ccc;
  }
  .photo {
    li {
      float: left;
      margin: 10px 10px;
      width: 120px;
      height: 120px;
      overflow: hidden;

      img {
        height: 100%;
        display: block;
      }
    }
  }
}
.people {
  padding: 10px 50px 20px 50px;
  background: #fff;
  margin: 20px 0;
  .ptitle {
    color: #888;
    height: 30px;
    border-bottom: 1px solid #ccc;
  }
  p {
    padding: 10px 0 0 50px;
    span {
      padding-left: 20px;
    }
  }
}
.assign {
  padding: 20px 50px;
  background: #fff;
  margin: 20px 0;
  ul {
    float: left;
    width: 33%;
    li {
      height: 40px;
      line-height: 40px;
      text-align: center;
      &:first-of-type {
        color: #888;
        border-bottom: 1px solid #ccc;
      }
    }
  }
}
.state_bar {
  padding: 20px 100px;
  background: #fff;
}
.submitBtn {
  padding: 10px 0;
  margin-top: 20px;
  text-align: center;
  background: #fff;
  button {
    margin: 0 50px;
  }
}
.taskpro {
  position: absolute;
  top: 25px;
  right: 500px;
}
.inform_table {
  padding: 0;
  text-align: center;
}
</style>