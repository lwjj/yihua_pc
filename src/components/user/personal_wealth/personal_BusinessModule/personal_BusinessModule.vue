<template>
    <div class="main">
        <div class="box">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/personal_wealth/personal_details/personal_ticketRecord' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>业务办理</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="info1">
                <el-collapse v-model="activeName" accordion>
                    <el-collapse-item title="已开用功能" name="1">
                        <div class="cellItem"  v-for="item in form1" :key="item.guid">
                            <div>{{item.name}}</div>
                            <div>{{item.bp}}点/月</div>
                            <div>有效期:{{item.time}}</div>
                        </div>
                        <!-- <el-row :gutter="20">
                            <el-col :span="3" v-for="item in form1" :key="item.guid">
                                <i>{{item.title}}</i>
                                <p>{{item.name}}</p>
                                <p>{{item.price}}</p>
                                <p>{{item.time}}</p>
                            </el-col>
                        </el-row> -->
                    </el-collapse-item>
                    <el-collapse-item title="添加新功能模块(未启用)" name="2">
                        <el-collapse v-model="activeName2" accordion>
                            <el-collapse-item :title=item.name :name=item.num v-for="item in form2" :key="item.guid">
                                <div class="cellItem"  v-for="item1 in item.list" :key="item1.guid">
                                    <div>{{item1.name}}</div>
                                    <div style="width:70px">{{item1.price}}点/月</div>
                                    <div><el-button @click="open(item1)" size="mini">开通</el-button></div>
                                </div>
                                <!-- <el-row :gutter="20">
                                    <el-col :span="3" v-for="item1 in item.list" :key="item1.guid">
                                        <i>{{item1.title}}</i>
                                        <p>{{item1.name}}</p>
                                        <p>{{item1.price}}</p>
                                        <el-button @click="open(item1)">开通</el-button>    
                                    </el-col>
                                </el-row> -->
                            </el-collapse-item>
                        </el-collapse>    
                    </el-collapse-item>
                </el-collapse> 
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
      form1: [],
      form2: [],
      activeName: "1",
      activeName2: "1"
    };
  },
  methods: {
    getMain() {
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/asset/getBusinessList`,
        data,
        res => {
          this.form1 = res.data.buyBusiness;
          for (var i = 0; i < this.form1.length; i++) {
            if (this.form1[i].price == undefined) {
              this.form1[i].price = "免费使用";
            } else {
              this.form1[i].price = this.form1[i].price + "点/月";
            }
            if (this.form1[i].start_time == undefined) {
              this.form1[i].time = "永久有限";
            } else {
              this.form1[i].time =
                this.form1[i].start_time.substr(0, 10) +
                "至" +
                this.form1[i].end_time.substr(0, 10);
            }
            this.form1[i].title = this.form1[i].name.slice(0, 1);
          }
          this.form2 = res.data.notBuyBusiness;
          for (var a = 0; a < this.form2.length; a++) {
            this.form2[a].num = a + 1;
            if (this.form2[a].list !== undefined) {
              for (var b = 0; b < this.form2[a].list.length; b++) {
                this.form2[a].list[b].title = this.form2[a].list[b].name.slice(
                  0,
                  1
                );
                if (this.form2[a].list[b].price !== undefined) {
                  this.form2[a].list[b].price =
                    this.form2[a].list[b].bp;
                } else {
                  this.form2[a].list[b].price = "免费使用";
                }
              }
            }
          }
        },
        this
      );
    },
    open(item1) {
      this.$router.push({
        name: "personal_addBModule",
        params: {
          guid: item1.guid,
          title: item1.title,
          name: item1.name,
          sjd: item1.price
        }
      });
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getMain();
  }
};
</script>
<style lang="scss" scoped>
.cellItem {
  display: flex;
  border-bottom: 1px solid #ddd;
  padding: 0 10px;
  height: 40px;
  line-height: 40px;
  background: #f1f1f1;
  & > div:nth-child(1) {
    width: 250px;
    max-width: 250px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  & > div:nth-child(2) {
    width: 60px;
  }
  &:hover {
    background: #ddd;
    cursor: pointer;
  }
}
.clear {
  clear: both;
}
.main {
  height: 100%;
  background: #fff;
  margin-top: 10px;
  overflow: auto;
  .box {
    padding-top: 10px;
    padding-left: 10px;
    .info1 {
      .el-row {
        .el-col {
          text-align: center;
          margin-bottom: 10px;
          i {
            display: inline-block;
            width: 60px;
            height: 60px;
            line-height: 60px;
            background: #ddd;
            border-radius: 50%;
            font-size: 30px;
            font-weight: bold;
          }
          p {
            margin-top: 10px;
          }
        }
      }
    }
  }
}
</style>

