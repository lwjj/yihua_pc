<template>
    <div id="wealth">
        <div class="title">
            <div class="text">消息设置</div>
        </div>
        <div class="box">
            <div class="first1">
                <el-row class="border">
                    <el-col>
                        <span>物业消息</span>
                        <div>
                            <el-radio-group v-model="radio1" @change="change">
                                <el-radio label="选中">开启</el-radio>
                                <el-radio label="未选中">关闭</el-radio>
                            </el-radio-group>    
                        </div>   
                    </el-col>
                    <el-col>
                        <span>电商消息</span>
                        <div>
                            <el-radio-group v-model="radio2" @change="change">
                                <el-radio v-model="radio2" label="选中">开启</el-radio>
                                <el-radio v-model="radio2" label="未选中">关闭</el-radio> 
                            </el-radio-group>    
                        </div>   
                    </el-col>
                    <el-col>
                        <span>圈子消息</span>
                        <div>
                            <el-radio-group v-model="radio3" @change="change">
                                <el-radio v-model="radio3" label="选中">开启</el-radio>
                                <el-radio v-model="radio3" label="未选中">关闭</el-radio> 
                            </el-radio-group>    
                        </div>   
                    </el-col>
                    <el-col>
                        <span>平台消息</span> 
                        <div>
                            <el-radio-group v-model="radio4" @change="change">
                                <el-radio v-model="radio4" label="选中">开启</el-radio>
                                <el-radio v-model="radio4" label="未选中">关闭</el-radio>
                            </el-radio-group>     
                        </div>  
                    </el-col>
                    <el-col>
                        <span>推送消息</span> 
                        <div>
                            <el-radio-group v-model="radio5" @change="change">
                                <el-radio v-model="radio5" label="选中">开启</el-radio>
                                <el-radio v-model="radio5" label="未选中">关闭</el-radio> 
                            </el-radio-group>    
                        </div>  
                    </el-col>
                </el-row>
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
      radio1: "",
      radio2: "",
      radio3: "",
      radio4: "",
      radio5: ""
    };
  },
  methods: {
    getSelect() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/commMessage/getSetting`,
        data,
        res => {
          this.radio1 = res.data.enabledPropertyNews == 0 ? "未选中" : "选中";
          this.radio2 = res.data.enabledEBNews == 0 ? "未选中" : "选中";
          this.radio3 = res.data.enabledCircleNews == 0 ? "未选中" : "选中";
          this.radio4 = res.data.enabledTerraceNews == 0 ? "未选中" : "选中";
          this.radio5 = res.data.enabledPushNews == 0 ? "未选中" : "选中";
        },
        this
      );
    },
    change() {
      var a = this.radio1 == "未选中" ? 0 : 1;
      var b = this.radio2 == "未选中" ? 0 : 1;
      var c = this.radio3 == "未选中" ? 0 : 1;
      var d = this.radio4 == "未选中" ? 0 : 1;
      var e = this.radio5 == "未选中" ? 0 : 1;
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        enabledPropertyNews: a,
        enabledEBNews: b,
        enabledCircleNews: c,
        enabledTerraceNews: d,
        enabledPushNews: e
      };
      console.log(data);
      this.$ajax(
        `${this.subUrl.user}/commMessage/settingCommMessage`,
        data,
        res => {
          if (res.code == 1) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "修改失败",
              type: "error"
            });
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
    this.getSelect();
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
      padding: 10px 0;
      .el-row {
        .el-col {
          padding: 20px 0;
          border-bottom: 1px solid #ddd;
          margin-bottom: -1px;
          span {
            float: left;
            margin-left: 120px;
          }
          div {
            float: right;
            margin-right: 100px;
          }
        }
      }
    }
  }
}
</style>
