<template>
    <div class="scheduling">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{path:'/manage/scheduling/scheduling_show'}">管理处调度</el-breadcrumb-item>
                <el-breadcrumb-item>编辑</el-breadcrumb-item>  
            </el-breadcrumb>
        </div>
        <el-form ref="form" :model="form" label-width="100px">
            <!-- <el-form-item label="日期：" class="floor1">
                <el-date-picker type="date" @click="getDay" placeholder="选择日期" v-model="getDD" style="width: 15%;" format="yyyy 年 MM 月 dd 日" value-format="timestamp"></el-date-picker>
                <span>{{week}}</span>
            </el-form-item> -->
            <el-form-item label="调度日期：">
              <el-select v-model="dateType" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select> 
            </el-form-item>
            <el-form-item label="总调度：" class="floor1">
                <el-input v-model="customer10" style="width:40%"></el-input>
                <el-button @click="allEmployees(1)">请选择</el-button>

                <div class="selectBox" v-show="customerShow4"> 
                  <el-button size="mini" type="primary" class="button_right" @click="customerOk(4)">选取</el-button>
                  <div class="clear"></div>
                    <ul v-if="customerShow4">
                        <li v-for="item in allPeople" :key=item.num>
                            <el-radio v-model="radio" :label=item.num>
                                <span>姓名：{{item.userName}}</span>
                                <span>手机：{{item.account}}</span>
                                <span>职位：{{item.post}}</span>
                            </el-radio>
                        </li>       
                        
                    </ul>
                </div>
            </el-form-item>
            <el-form-item label="总值班：" class="floor1">
                <el-input v-model="customer11" style="width:40%"></el-input>
                <el-button @click="allEmployees(2)">请选择</el-button>
                <div class="selectBox" v-if="customerShow5">  
                    <el-button  size="mini" type="primary" class="button_right" @click="customerOk(4)">选取</el-button>
                    <div class="clear"></div>
                    <ul v-if="customerShow5">
                        <li v-for="item in allPeople" :key=item.num>
                            <el-radio v-model="radio" :label=item.num>
                                <span>姓名：{{item.userName}}</span>
                                <span>手机：{{item.account}}</span>
                                <span>职位：{{item.post}}</span>
                            </el-radio>
                        </li>       
                      
                    </ul>
                </div>
            </el-form-item>
            <el-form-item label="值班表：" class="floor1">
                <div>
                    <h3>早班：</h3>
                    <div>
                        <el-input placeholder="客服部" style="width:18%" v-model="customer1"></el-input>
                        <el-button @click="getCustomer(1)">请选择</el-button>
                        <el-input placeholder="工程部" style="width:18%" v-model="customer2"></el-input>
                        <el-button @click="getEngineering(2)">请选择</el-button> 
                        <el-input placeholder="秩序部" style="width:18%" v-model="customer3"></el-input>
                        <el-button @click="getOrder(3)">请选择</el-button> 
                        <div class="customer" style="width:55%">
                            <div class="selectBox" v-if="customerShow">
                                <el-button type="primary" size="mini" class="button_right" @click="customerOk(1)">选取</el-button>       
                                <div class="clear"></div>  
                                <ul v-if="customerShow">
                                    <li v-for="item in customer" :key=item.num>
                                        <el-radio v-model="radio" :label=item.num>
                                            <span>姓名：{{item.userName}}</span>
                                            <span>手机：{{item.account}}</span>
                                            <span>职位：{{item.post}}</span>
                                        </el-radio>
                                    </li>       
                                </ul>
                            </div>
                        </div> 
                    </div>
                </div>
                <div>
                    <h3>中班：</h3>
                    <div>
                        <el-input placeholder="客服部" style="width:18%" v-model="customer4"></el-input>
                        <el-button @click="getCustomer(4)">请选择</el-button>
                        <el-input placeholder="工程部" style="width:18%" v-model="customer5"></el-input>
                        <el-button @click="getEngineering(5)">请选择</el-button> 
                        <el-input placeholder="秩序部" style="width:18%" v-model="customer6"></el-input>
                        <el-button @click="getOrder(6)">请选择</el-button> 
                        <div class="customer" style="width:55%">
                            <div class="selectBox" v-if="customerShow2">
                                <el-button class="button_right" size="mini" type="primary" @click="customerOk(2)">选取</el-button> 
                                <ul v-if="customerShow2">
                                    <li v-for="item in customer" :key=item.num>
                                        <el-radio v-model="radio" :label=item.num>
                                            <span>姓名：{{item.userName}}</span>
                                            <span>手机：{{item.account}}</span>
                                            <span>职位：{{item.post}}</span>
                                        </el-radio>
                                    </li>       
                                </ul>
                            </div>
                        </div> 
                    </div>
                </div>
                <div>
                    <h3>晚班：</h3>
                    <div>
                        <el-input placeholder="客服部" style="width:18%" v-model="customer7"></el-input>
                        <el-button @click="getCustomer(7)">请选择</el-button>
                        <el-input placeholder="工程部" style="width:18%" v-model="customer8"></el-input>
                        <el-button @click="getEngineering(8)">请选择</el-button> 
                        <el-input placeholder="秩序部" style="width:18%" v-model="customer9"></el-input>
                        <el-button @click="getOrder(9)">请选择</el-button> 
                        <div class="customer" style="width:55%">
                            <div class="selectBox" v-if="customerShow3">
                                <el-button class="button_right"  size="mini" type="primary" @click="customerOk(3)">选取</el-button>       
                                <ul v-if="customerShow3">
                                    <li v-for="item in customer" :key=item.num>
                                        <el-radio v-model="radio" :label=item.num>
                                            <span>姓名：{{item.userName}}</span>
                                            <span>手机：{{item.account}}</span>
                                            <span>职位：{{item.post}}</span>
                                        </el-radio>
                                    </li>       
                                    <div class="clear"></div>  
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="电话：" class="floor1">
                <el-input v-model="phone1" placeholder="客服部电话" :maxlength="11" style="width:18%"></el-input>
                <el-input v-model="phone2" placeholder="工程部电话" :maxlength="11" style="width:18%;margin-left:5.5%;"></el-input>
                <el-input v-model="phone3" placeholder="秩序部电话" :maxlength="11" style="width:18%;margin-left:5.5%;"></el-input>
            </el-form-item>
            <el-button class="scheduling_submit" @click="getSubmit">提交</el-button>
        </el-form>
    </div>
</template>
<script>
export default {
  data() {
    return {
      // dateType (integer, optional): 日期类型 默认今天 1:今天 2:明天 3:昨天 ,
      options: [{ name: "今天", value: 1 }, { name: "明天", value: 2 }],
      typeDay: "",
      timeOk: 0,
      getDD: "",
      form: {},
      week: "",
      oldWeek: "",
      radio: 0,
      customer: [],
      allPeople: [],
      isall: 0,
      allPeople1: [],
      allPeople2: [],
      allPeople3: [],
      customerShow: false,
      customerShow2: false,
      customerShow3: false,
      customerShow4: false,
      customerShow5: false,
      customer1: "",
      customer1Id: 0,
      customer2: "",
      customer2Id: 0,
      customer3: "",
      customer3Id: 0,
      customer4: "",
      customer4Id: 0,
      customer5: "",
      customer5Id: 0,
      customer6: "",
      customer6Id: 0,
      customer7: "",
      customer7Id: 0,
      customer8: "",
      customer8Id: 0,
      customer9: "",
      customer9Id: 0,
      customer10: "",
      customer10Id: 0,
      customer11: "",
      customer11Id: 0,
      choose: 0,
      phone1: "",
      phone2: "",
      phone3: "",
      dateType: 1
    };
  },
  methods: {
    // 获取最近一天设置的管理处调度
    getDetail() {
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid,
        dateType: 4
      };
      this.$ajax(
        `${this.subUrl.activity}/watchBill/getWatchBill`,
        data,
        res => {
          this.costom = res.data;
          for (var [i, v] of res.data.list.entries()) {
            for (var [j, s] of v.entries()) {
              this[`customer${i * 3 + s.sort * 1}`] = s.userInfo.name;
              this[`customer${i * 3 + s.sort * 1}Id`] = s.userId;
            }
          }
          for (var [i, v] of res.data.deptList.entries()) {
            this["phone" + (i + 1)] = v.tel;
          }
          this.customer10 = res.data.watch.name;
          this.customer10Id = res.data.watch.userId;
          this.customer11 = res.data.dispatcher.name;
          this.customer11Id = res.data.dispatcher.userId;
        },
        this
      );
    },
    getWeek() {
      if (this.oldWeek.slice(0, 3) == "Mon") {
        this.week = "星期一";
      } else if (this.oldWeek.slice(0, 3) == "Tue") {
        this.week = "星期二";
      } else if (this.oldWeek.slice(0, 3) == "Wed") {
        this.week = "星期三";
      } else if (this.oldWeek.slice(0, 3) == "Thu") {
        this.week = "星期四";
      } else if (this.oldWeek.slice(0, 3) == "Fri") {
        this.week = "星期五";
      } else if (this.oldWeek.slice(0, 3) == "Sat") {
        this.week = "星期六";
      } else if (this.oldWeek.slice(0, 3) == "Sun") {
        this.week = "星期日";
      }
    },
    getCustomer(n) {
      if (n == 1) {
        if (this.customerShow == true) {
          this.customerShow = false;
        } else {
          this.customerShow = true;
          this.customerShow2 = false;
          this.customerShow3 = false;
          this.customerShow4 = false;
          this.customerShow5 = false;
        }
      } else if (n == 4) {
        if (this.customerShow2 == true) {
          this.customerShow2 = false;
        } else {
          this.customerShow2 = true;
          this.customerShow = false;
          this.customerShow3 = false;
          this.customerShow4 = false;
          this.customerShow5 = false;
        }
      } else if (n == 7) {
        if (this.customerShow3 == true) {
          this.customerShow3 = false;
        } else {
          this.customerShow3 = true;
          this.customerShow = false;
          this.customerShow2 = false;
          this.customerShow4 = false;
          this.customerShow5 = false;
        }
      }
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid,
        deptType: 1
      };
      this.$ajax(
        `${this.subUrl.activity}/watchBill/getDeptMember`,
        data,
        res => {
          this.radio = 0;
          this.customer = [];
          if (n == 1) {
            this.choose = 1;
          } else if (n == 4) {
            this.choose = 4;
          } else {
            this.choose = 7;
          }
          this.customer = res.data;
          this.allPeople1 = res.data;
          for (var i = 1; i <= this.customer.length; i++) {
            this.customer[i - 1].num = i;
          }
        },
        this
      );
    },
    customerOk(n) {
      if (n == 1) {
        if (this.choose == 1) {
          this.customer1 =
            this.customer[this.radio - 1].userName +
            "   " +
            this.customer[this.radio - 1].account;
          this.customer1Id = this.customer[this.radio - 1].userId;
          this.customerShow = false;
        } else if (this.choose == 2) {
          this.customer2 =
            this.customer[this.radio - 1].userName +
            "   " +
            this.customer[this.radio - 1].account;
          this.customer2Id = this.customer[this.radio - 1].userId;
          this.customerShow = false;
        } else if (this.choose == 3) {
          this.customer3 =
            this.customer[this.radio - 1].userName +
            "   " +
            this.customer[this.radio - 1].account;
          this.customer3Id = this.customer[this.radio - 1].userId;
          this.customerShow = false;
        }
      } else if (n == 2) {
        if (this.choose == 4) {
          this.customer4 =
            this.customer[this.radio - 1].userName +
            "   " +
            this.customer[this.radio - 1].account;
          this.customer4Id = this.customer[this.radio - 1].userId;
          this.customerShow2 = false;
        } else if (this.choose == 5) {
          this.customer5 =
            this.customer[this.radio - 1].userName +
            "   " +
            this.customer[this.radio - 1].account;
          this.customer5Id = this.customer[this.radio - 1].userId;
          this.customerShow2 = false;
        } else if (this.choose == 6) {
          this.customer6 =
            this.customer[this.radio - 1].userName +
            "   " +
            this.customer[this.radio - 1].account;
          this.customer6Id = this.customer[this.radio - 1].userId;
          this.customerShow2 = false;
        }
      } else if (n == 3) {
        if (this.choose == 7) {
          this.customer7 =
            this.customer[this.radio - 1].userName +
            "   " +
            this.customer[this.radio - 1].account;
          this.customer7Id = this.customer[this.radio - 1].userId;
          this.customerShow3 = false;
        } else if (this.choose == 8) {
          this.customer8 =
            this.customer[this.radio - 1].userName +
            "   " +
            this.customer[this.radio - 1].account;
          this.customer8Id = this.customer[this.radio - 1].userId;
          this.customerShow3 = false;
        } else if (this.choose == 9) {
          this.customer9 =
            this.customer[this.radio - 1].userName +
            "   " +
            this.customer[this.radio - 1].account;
          this.customer9Id = this.customer[this.radio - 1].userId;
          this.customerShow3 = false;
        }
      } else if (n == 4) {
        if (this.choose == 10) {
          this.customer10 =
            this.allPeople[this.radio - 1].userName +
            "   " +
            this.allPeople[this.radio - 1].account;
          this.customer10Id = this.allPeople[this.radio - 1].userId;
          this.customerShow4 = false;
        } else if (this.choose == 11) {
          this.customer11 =
            this.allPeople[this.radio - 1].userName +
            "   " +
            this.allPeople[this.radio - 1].account;
          this.customer11Id = this.allPeople[this.radio - 1].userId;
          this.customerShow5 = false;
        }
      }
    },
    getOrder(n) {
      if (n == 3) {
        if (this.customerShow == true) {
          this.customerShow = false;
        } else {
          this.customerShow = true;
          this.customerShow2 = false;
          this.customerShow3 = false;
          this.customerShow4 = false;
          this.customerShow5 = false;
        }
      } else if (n == 6) {
        if (this.customerShow2 == true) {
          this.customerShow2 = false;
        } else {
          this.customerShow2 = true;
          this.customerShow = false;
          this.customerShow3 = false;
          this.customerShow4 = false;
          this.customerShow5 = false;
        }
      } else if (n == 9) {
        if (this.customerShow3 == true) {
          this.customerShow3 = false;
        } else {
          this.customerShow3 = true;
          this.customerShow = false;
          this.customerShow2 = false;
          this.customerShow4 = false;
          this.customerShow5 = false;
        }
      }
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid,
        deptType: 3
      };
      this.$ajax(
        `${this.subUrl.activity}/watchBill/getDeptMember`,
        data,
        res => {
          this.radio = 0;
          this.customer = [];
          if (n == 3) {
            this.choose = 3;
          } else if (n == 6) {
            this.choose = 6;
          } else {
            this.choose = 9;
          }
          this.customer = res.data;
          this.allPeople3 = res.data;
          for (var i = 1; i <= this.customer.length; i++) {
            this.customer[i - 1].num = i;
          }
        },
        this
      );
    },
    getEngineering(n) {
      if (n == 2) {
        if (this.customerShow == true) {
          this.customerShow = false;
        } else {
          this.customerShow = true;
          this.customerShow2 = false;
          this.customerShow3 = false;
          this.customerShow4 = false;
          this.customerShow5 = false;
        }
      } else if (n == 5) {
        if (this.customerShow2 == true) {
          this.customerShow2 = false;
        } else {
          this.customerShow2 = true;
          this.customerShow = false;
          this.customerShow3 = false;
          this.customerShow5 = false;
          this.customerShow4 = false;
        }
      } else if (n == 8) {
        if (this.customerShow3 == true) {
          this.customerShow3 = false;
        } else {
          this.customerShow3 = true;
          this.customerShow = false;
          this.customerShow2 = false;
          this.customerShow4 = false;
          this.customerShow5 = false;
        }
      }
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid,
        deptType: 2
      };
      this.$ajax(
        `${this.subUrl.activity}/watchBill/getDeptMember`,
        data,
        res => {
          this.radio = 0;
          this.customer = [];
          if (n == 2) {
            this.choose = 2;
          } else if (n == 5) {
            this.choose = 5;
          } else {
            this.choose = 8;
          }
          this.customer = res.data;
          this.allPeople2 = res.data;
          for (var i = 1; i <= this.customer.length; i++) {
            this.customer[i - 1].num = i;
          }
        },
        this
      );
    },
    allEmployees(n, cb) {
      if (n == 1) {
        this.choose = 10;
        if (this.customerShow4 == true) {
          this.customerShow4 = false;
        } else {
          this.customerShow4 = true;
          this.customerShow5 = false;
          this.customerShow3 = false;
          this.customerShow2 = false;
          this.customerShow = false;
        }
        if (this.allPeople.length < 1) {
          var data = {
            token: this.$getkey(),
            organId: this.organInfo.guid
          };
          this.$ajax(
            `${this.subUrl.user}/admin/deptManage/organDepartmentInfo`,
            data,
            res => {
              var all = res.data;
              for (var i = 0; i < all.length; i++) {
                for (var b = 0; b < all[i].empList.length; b++) {
                  this.allPeople.push(all[i].empList[b]);
                }
              }
              for (var i = 1; i <= this.allPeople.length; i++) {
                this.allPeople[i - 1].num = i;
              }
              cb && cb(res);
            },
            this
          );
        }
      }
      if (n == 2) {
        this.choose = 11;
        if (this.customerShow5 == true) {
          this.customerShow5 = false;
        } else {
          this.customerShow5 = true;
          this.customerShow4 = false;
          this.customerShow3 = false;
          this.customerShow2 = false;
          this.customerShow = false;
        }
      }
    },
    getDay() {
      var dd = new Date().getTime();
      var d1 = new Date().getHours();
      var d2 = new Date().getMinutes();
      var d3 = new Date().getSeconds();
      var d4 = new Date().getMilliseconds();
      var today = d1 * 60 * 60 * 1000 + d2 * 60 * 1000 + d3 * 1000 + d4;
      dd = dd - today;
      if (this.getDD + 86400000 == dd) {
        this.typeDay = 3;
        this.timeOk = 1;
      } else if (this.getDD - 86400000 == dd) {
        this.typeDay = 2;
        this.timeOk = 1;
      } else if (this.getDD == dd) {
        this.typeDay = 1;
        this.timeOk = 1;
      } else {
        this.$message({
          message: "请选择今天或明天",
          type: "error"
        });
        this.timeOk = 0;
      }
      this.allEmployees(1, () => {
        this.choose10;
      });
      var c = new Date(dd).toUTCString();
    },
    getSubmit() {
      // this.getDay();
      if (
        this.phone1 !== "" &&
        this.phone2 !== "" &&
        this.phone3 !== "" &&
        this.customer1 !== "" &&
        this.customer2 !== "" &&
        this.customer3 !== "" &&
        this.customer4 !== "" &&
        this.customer5 !== "" &&
        this.customer6 !== "" &&
        this.customer7 !== "" &&
        this.customer8 !== "" &&
        this.customer9 !== "" &&
        this.customer10 !== "" &&
        this.customer11 !== ""
      ) {
        var data = {
          token: this.$getkey(),
          dateType: this.dateType,
          organId: this.organInfo.guid,
          dispatcher: this.customer10Id,
          watch: this.customer11Id,
          csTel: this.phone1,
          prTel: this.phone2,
          orTel: this.phone3,
          watchkeeper: {
            mos: [
              {
                userId: this.customer1Id,
                sort: 1
              },
              {
                userId: this.customer2Id,
                sort: 2
              },
              {
                userId: this.customer3Id,
                sort: 3
              }
            ],
            mis: [
              {
                userId: this.customer4Id,
                sort: 1
              },
              {
                userId: this.customer5Id,
                sort: 2
              },
              {
                userId: this.customer6Id,
                sort: 3
              }
            ],
            nis: [
              {
                userId: this.customer7Id,
                sort: 1
              },
              {
                userId: this.customer8Id,
                sort: 2
              },
              {
                userId: this.customer9Id,
                sort: 3
              }
            ]
          }
        };
        this.$ajax1(
          `${this.subUrl.activity}/watchBill/add`,
          data,
          res => {
            if (res.code == 1) {
              this.$message({
                showClose: true,
                message: "编辑成功",
                type: "success"
              });
              this.$router.push({
                path: "/manage/scheduling/scheduling_show"
              });
            }
          },
          this
        );
      } else {
        this.$message({
          message: "请填写完成信息",
          type: "error"
        });
      }
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
    this.getDetail();
    this.allEmployees(1, () => {
      this.customerShow4 = false;
    });
  }
};
</script>
<style lang="scss" scoped>
.scheduling {
  .el-form {
    background: #fff;
    padding: 20px;
    width: 100%;
    .floor1 {
      padding: 10px 0;
      // margin-left: 20px;
      span {
        margin-left: 20px;
        font-size: 14px;
      }
    }
  }
}
.customer {
  ul {
    li {
      float: left;
    }
    .el-button {
      margin-left: 5%;
    }
  }
}
.clear {
  clear: both;
}
.scheduling_submit {
  width: 200px;
  margin-left: 30%;
  margin-bottom: 50px;
}
.selectBox {
  position: absolute;
  background: #fff;
  width: 800px;
  height: 200px;
  padding: 0 20px;
  z-index: 999;
  border: 1px solid #ddd;
  & > ul {
    position: absolute;
    padding: 0 20px;
    left: 0;
    right: 0;
    top: 40px;
    bottom: 0;
    overflow: auto;
  }
}
</style>
