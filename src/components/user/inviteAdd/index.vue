<template>
  <div id='quality'>
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/user/we_business' }">本楼业务</el-breadcrumb-item>
        <el-breadcrumb-item>邀请加入</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="layout">
      <!--<div class="filtrate">-->
      <!--<div class="block">-->
      <!--<el-select style="width:150px" v-model="status"  placeholder="全部状态" @change="filterStatus" >-->
      <!--<el-option-->
      <!--v-for="item in stateList"-->
      <!--:key="item.value"-->
      <!--:label="item.label"-->
      <!--:value="item.value">-->
      <!--</el-option>-->
      <!--</el-select>-->
      <!--<el-cascader-->
      <!--placeholder="业务类型"-->
      <!--:show-all-levels="false"-->
      <!--:options="industryList"-->
      <!--:props="props"-->
      <!--v-model="selectedOptions"-->
      <!--@change="selectIndustry">-->
      <!--</el-cascader>-->
      <!--&lt;!&ndash; <el-button type="primary" @click="turnTo('/user/we_business/building_unit/unit_msg')">房屋信息</el-button> &ndash;&gt;-->
      <!--</div>-->
      <!--</div>-->
      <!-- 表单 -->
      <div class="inform_table" style="background: #fff;margin-left: 10px">
        <div style="display: flex;margin-bottom: 20px">
          <div style="width: 300px;line-height: 25px;text-align: center">
            <img style="width: 200px" :src="this.MerchantQrcode" alt=""><br>邀请商家
          </div>
          <div style="width: 300px;line-height: 25px;text-align: center">
            <img style="width: 200px" :src="this.LesseeQrcode" alt=""><br>邀请租户
          </div>
        </div>
        <div style="line-height: 35px">我的邀请：</div>
        <el-table
          :data="tableData"
          :height="mHeight"
        >
          <!--@selection-change="handleSelectionChange"-->
          <!--<el-table-column-->
          <!--align="center"-->
          <!--type="selection"-->
          <!--width="100"-->
          <!--&gt;-->
          <!--</el-table-column>-->
          <el-table-column
            label="邀请人"
            prop="vipName"
          >
            <!-- <template slot-scope="scope">
                <div>{{scope.row.organName}}</div>
            </template> -->
          </el-table-column>
          <el-table-column
            label="公司名称"
            prop="organName"
          >
            <!-- <template slot-scope="scope">
                <div>{{scope.row.organName}}</div>
            </template> -->
          </el-table-column>
          <el-table-column
            label="联系人"
            prop="contactName"
          >
            <!-- <template slot-scope="scope">
                <div>{{scope.row.organName}}</div>
            </template> -->
          </el-table-column>
          <el-table-column
            label="类型"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.type*1==1">企业（租户）</div>
              <div v-if="scope.row.type*1==2">供应商（商家）</div>
            </template>
          </el-table-column>
          <el-table-column
            label="邀请时间"
            prop="inviteDate"
          >
          </el-table-column>
          <!--<el-table-column-->
          <!--label="操作"-->
          <!--&gt;-->
          <!--<template slot-scope="scope">-->
          <!--<el-button type="primary" plain size="small" @click="turnTo('/user/we_business/business_manage/business_card/'+scope.row.optUserId)">详情</el-button>-->
          <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
      </div>
      <!--<el-button type="danger" @click="deletebus" style="margin:0px 0 0 20px;">删除</el-button>-->
      <el-pagination
        v-if="rowCount"
        background
        style="float:right;"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :page-size="12"
        :total="rowCount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      this.mHeight = tableHeight; // 定义的 window.tableHeight

      return {
        rowCount: "",
        userInfo: {},
        organInfo: {},
        tableData: [],
        industryList: [],
        selectedOptions: [],
        classId: "",
        status: "",
        statusId: "",
        organList: "",
        props: {
          label: "name",
          value: "guid",
          children: "children"
        },
        bm: {
          pageNo: 1,
          pageSize: 15,
        },
        LesseeQrcode: '',
        MerchantQrcode: '',
        // 固定数据 （0,：不限，1：基础商家，2：中级商家，3：高级商家，4：金牌商家） ,
        stateList: [
          {
            value: "",
            label: "全部商家"
          },
          {
            value: "1",
            label: "基础商家"
          },
          {
            value: "2",
            label: "中级商家"
          },
          {
            value: "3",
            label: "高级商家"
          },
          {
            value: "4",
            label: "金牌商家"
          }
        ]
      };
    },
    methods: {
      // back() {
      //   this.$router.go(-1);
      // },
      // 下一页
      handleCurrentChange(pageNo) {
        this.getList(pageNo);
      },
      turnTo(e) {
        this.$router.push(e);
      },
      // 筛选状态
      filterStatus(e) {
        this.statusId = e;
        this.getList();
      },
      // 过滤type   0:空置; 1:使用中; 2:装修; 3:欠费; 4:未收楼; 5:出租中 ,
      filterType(e) {
        if (e.status == 0) {
          return "空置";
        } else if (e.status == 1) {
          return "使用中";
        } else if (e.status == 2) {
          return "装修";
        } else if (e.status == 3) {
          return "欠费";
        } else if (e.status == 4) {
          return "未收楼";
        } else if (e.status == 5) {
          return "出租中";
        }
      },
      // 选择  业务类型
      selectIndustry(value) {
        console.log(value);
        this.classId = value[1];
        this.getList();
      },
      // 获取行业 业务类型
      getIndustry() {
        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          pageNo: this.bm.pageNo,
          pageSize: this.bm.pageSize
        };
        this.$ajax(
          `${this.subUrl.user}/user/myInvitation`,
          data,
          res => {
            console.log(res, "getIndustry");
            let obj = {
              name: "全部",
              guid: "",
              children: [{name: "全部", guid: ""}]
            };
            let newArr = res.data.pmc.concat(res.data.icc);
            for (let val of newArr) {
              val.children = val.subclass;
            }
            console.log(newArr, "newArr");
            newArr.unshift(obj);
            this.industryList = newArr;
          },
          this
        );
      },
      // 选择商家
      handleSelectionChange(val) {
        console.log(val, "val");
        let arr = [];
        for (let ele of val) {
          arr.push(ele.organId);
        }
        this.organList = arr.join();
        console.log(this.organList, "organlist");
      },

      // 删除商家
      deletebus() {
        if (this.organList == "") {
          this.$message.error("请选择商家");
          return;
        }
        var data = {
          token: this.$getkey(),
          organList: this.organList
        };
        this.$ajax(
          `${this.subUrl.bd}/buildingBuy/delManageSupplier`,
          data,
          res => {
            console.log(res, "delete");
            this.$message.success("删除成功");
            this.organList = "";
            this.getList();
          },
          this
        );
      },
      // 获取列表
      getList() {
        var data = {
          token: this.$getkey(),
          userId: this.userInfo.guid,
          pageNo: this.bm.pageNo,
          pageSize: this.bm.pageSize
        };
        this.$ajax(
          `${this.subUrl.user}/user/myInvitation`,
          data,
          res => {
            console.log(res, "getList");
            this.tableData = res.data.list;
            this.rowCount = +res.data.rowCount;
          },
          this
        );
      },
      getQrcode(index) {
        var url = index == 1 ? '/user/inviteLessee' : '/user/inviteMerchant';
        var data = {
          token: this.$getkey(),
        };
        // this.LesseeQrcode=`${this.subUrl.user}`+url+'?token='+data.token;
        if (index == 1) {
          this.LesseeQrcode = this.baseUrl + this.subUrl.user + url + '?token=' + data.token;
          console.log(this.LesseeQrcode)
        } else {
          this.MerchantQrcode = this.baseUrl + this.subUrl.user + url + '?token=' + data.token;
          console.log(this.MerchantQrcode)
        }
        this.xhr1.get(
          `${this.subUrl.user}` + url + '?token=' + data.token,
          {},
          res => {
          },
          this
        );
      }
    },
    mounted() {
      this.getQrcode(1);
      this.getQrcode(2);
      this.userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      this.organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      this.getList();
      // this.getIndustry();
    }
  };
</script>
<style lang="scss" scoped>
  #quality {
    height: 100%;
    padding-left: 260px;
    padding-right: 10px;
    overflow: scroll;
    .text {
      i {
        padding: 20px 20px;
      }
    }
  }

  .layout {
  }

  .filtrate {
    width: 100%;
    height: 60px;
    background: #fff;
    line-height: 60px;
    padding-left: 20px;
    .thisTit {
      padding-left: 50px;
    }
  }

  //tab 切换
  .el-menu-item {
    font-size: 16px;
    font-weight: 700;
  }

  .block {
    float: right;
    margin-right: 10px;
    display: block;
    .el-range-editor.el-input__inner {
      padding: 0 10px;
    }
  }

  .inform_table {
    // text-align: center;
  }

  // emerType
  .emerType {
    color: #888;
  }
</style>
