<template>
  <div class="newRightContent"> 
    <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-if="userInfo.organType == 3" :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
            <el-breadcrumb-item @click.native='$router.go(-1)'>返回</el-breadcrumb-item>
            <el-breadcrumb-item >合作楼盘</el-breadcrumb-item>
        </el-breadcrumb>
    </div> 
    <div class="tableBox"> 
      <el-table
        :data="list"
        height="250"
        border
        style="width: 100%">
        <el-table-column
          label="大厦图标"
          width="140">
          <template slot-scope="scope">
            <img :src="scope.row.logo" class="buildingLogo" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="buildingName"
          label="大厦"
          width="180">
        </el-table-column>
        <el-table-column
          prop="isBuy"
          label="是否已签"
          :formatter="setStatus"
           >
        </el-table-column>

        <el-table-column
          label="详情" 
           >
           <template slot-scope="scope">
             <el-button size="small" @click="toDetail(scope.row)" type="primary">详情</el-button>
           </template>
        </el-table-column>
      </el-table>
      <el-pagination
       class="tableBottom"
        background
        @current-change='changeData'
        layout="prev, pager, next"
        :page-count="pageCount"
        >
      </el-pagination>
    </div>
   
    <!-- <yd-infinitescroll style="margin-top:.2rem;" :callback="loadList" ref="infinitescrollDemo">
			<div style="padding:0;" class="" slot="list">
				<div class="list flex1" v-for="(item,index) in list" @click="toDetail(item)" :key="index">
					<div class="list_item flex-row-nowrap bgwhite"> 
							<div class="icon mr3"> 
                  <img style="width:.8rem;height:.8rem;" :src="item.logo" alt="">
							</div> 
							<div style="flex:1">
									<div class="font32 foCo0 mb1">{{item.buildingName}}</div>
							</div>
					</div>
          <div class="flex flex-end center" style="width:2rem;height:100%">      <span class="state state0" v-if="item.isBuy == 0">未签</span>
              <span class="state state1" v-if="item.isBuy == 1">已签</span>
          </div>
			</div>
			</div>
			<span slot="doneTip">啦啦啦，啦啦啦，没有数据啦~~</span>
    </yd-infinitescroll> -->
      
  </div>
</template>
<script>
export default {
  data() {
    let userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    let organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.mainColor = this.$color[userInfo.organType];
    return {
      userInfo,
      organInfo,
      list: [],
      currentIndex: -1,
      currentIndex1: -1,
      currentIndex2: -1,
      isFilter: false,
      current: {},
      pageNo: 1,
      areaList: [[], [], [], []],
      hangyeList: [[], []],
      current1: {},
      pageCount: 1,
      value4: "",
      props: {
        value: "index",
        label: "dictDataValue",
        children: "children"
      },
      options: [
        {
          name: "已签",
          value: "1"
        },
        {
          name: "未签",
          value: "0"
        }
      ],
      options1: []
    };
  },
  methods: {
    handleItemChange(val) {
      let id = "";
      console.log(val);
      if (val.length == 1) {
        id = this.options1[val[0]].guid;
      } else if (val.length == 2) {
        id = this.options1[val[0]].children[val[1]].guid;
      } else if (val.length == 3) {
        id = this.options1[val[0]].children[val[1]].children[val[2]].guid;
      }

      this.getDistrict(id, res => {
        for (let [i, v] of res.entries()) {
          if (val.length < 3) {
            v.children = [];
          }
          v.index = i;
        }
        console.log(res);
        if (val.length == 1) {
          this.$set(this.options1[val[0]], "children", res);
        } else if (val.length == 2) {
          this.$set(this.options1[val[0]].children[val[1]], "children", res);
        } else if (val.length == 3) {
          this.$set(
            this.options1[val[0]].children[val[1]].children[val[2]],
            "children",
            res
          );
        }
      });
    },
    setStatus(a, b, c) {
      if (c == 1) {
        return "已签";
      } else {
        return "未签";
      }
    },
    toDetail(e) {
      this.$router.push(
        `/estate/serviceList/building/detail?${this.$qs.stringify(e)}`
      );
    },
    randomColor: function() {
      var i = Math.round(Math.random() * 4);
      var colorArr = ["#3eb7e6", "#62c88c", "#fab23e", "#fa697c", "#adb8c0"];
      return colorArr[i];
    },
    cancelIndex() {
      this.currentIndex = -1;
      this.isFilter = false;
    },
    chooseIndex(e) {
      this.currentIndex = e;
      this.isFilter = true;
    },
    confirmFn(e) {
      if (e == 0) {
        // this.$dialog.toast({ mes: "您选择的是" + this.current.dictDataName });
        this.$refs.infinitescrollDemo.$emit("ydui.infinitescroll.loadedDone");
        this.list = [];
        this.pageNo = 1;
        this.getList();
      } else if (e == 2) {
        this.$refs.infinitescrollDemo.$emit("ydui.infinitescroll.loadedDone");
        this.list = [];
        this.pageNo = 1;
        this.getList();
      }

      this.isFilter = false;
      this.currentIndex = -1;
    },
    // 筛选地区
    setList(val, i, j) {
      if (i < 3) {
        this.getDistrict(val.guid, res => {
          this.$set(this.areaList, i * 1 + 1, res);
        });
      }
      for (var a = i; a < this.areaList.length; a++) {
        for (var b = 0; b < this.areaList[a].length; b++) {
          if (i == a && b == j) {
            this.$set(this.areaList[i][j], "selected", true);
            this.current = Object.assign({}, this.areaList[i][j]);
          } else {
            this.$set(this.areaList[a][b], "selected", false);
          }
        }
      }
      if (i == 0) {
        this.$set(this.areaList, 1, []);
        this.$set(this.areaList, 2, []);
        this.$set(this.areaList, 3, []);
        this.$set(this.areaList[0], "show", false);
      } else if (i == 1) {
        this.$set(this.areaList, 2, []);
        this.$set(this.areaList, 3, []);
        this.$set(this.areaList[0], "show", false);
      } else if (i == 2) {
        this.$set(this.areaList, 3, []);
        this.$set(this.areaList[0], "show", true);
      } else if (i == 3) {
      }
    },
    //筛选分类
    setList1(val, i, j) {
      if (i == 0) {
        var arr = this.hangyeList[i][j].subclass
          ? this.hangyeList[i][j].subclass
          : [];
        this.hangyeList[1] = arr;
      }
      for (var a = i; a < this.hangyeList.length; a++) {
        for (var b = 0; b < this.hangyeList[a].length; b++) {
          if (i == a && b == j) {
            this.$set(this.hangyeList[i][j], "selected", true);
            this.current1 = Object.assign({}, this.hangyeList[i][j]);
          } else {
            this.$set(this.hangyeList[a][b], "selected", false);
          }
        }
      }
    },
    gethangye() {
      this.$ajax(
        `${this.subUrl.user}/comm/getIndustryCategory`,
        {},
        res => {
          this.hangyeList[0] = this.hangyeList[0]
            .concat(res.data.pmc)
            .concat(res.data.icc);
        },
        this
      );
    },
    getDistrict(id, cb) {
      let data = {
        id
      };
      this.$ajax(
        `${this.subUrl.user}/comm/getDistrictList`,
        data,
        res => {
          cb && cb(res.data);
        },
        this
      );
    },
    contact(e) {
      e = e ? e : "15707973128";
      this.$dialog.alert({
        mes: "请联系客服" + e
      });
    },
    loadList() {
      this.getList();
    },
    changeData(e) {
      this.pageNo = e;
      this.getList();
    },
    changeData1(e) {
      this.pageNo = 1;

      this.getList();
    },
    changeData2(e) {
      this.current.guid = this.options1[e[0]].children[e[1]].children[
        e[2]
      ].children[e[3]].guid;
      this.pageNo = 1;
      this.getList();
    },
    getList() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        organId: this.organInfo.guid,
        pageNo: this.pageNo
      };
      if (this.current.guid) {
        data.scopeValue = this.current.guid;
      }
      // if (this.currentIndex2 > -1) {
      //   // data.status = this.statusList[this.currentIndex2].value;
      // }

      data.status = this.value4;
      this.$ajax(
        `${this.subUrl.activity}/sob/getSobList`,
        data,
        res => {
          this.list = res.data.list;
          this.pageCount = res.data.pageCount * 1;
          this.pageNo++;
        },
        this
      );
    }
  },
  mounted() {
    this.getList();
    this.getDistrict(0, res => {
      console.log(res);
      for (let [i, v] of res.entries()) {
        v.children = [];
        v.index = i;
      }
      this.options1 = res;
      console.log(this.options1);
      this.areaList[0] = res;
      this.$set(this.areaList, 0, res);
    });
    this.gethangye();
  }
};
</script>
<style scoped>
.tableBox {
  padding-top: 20px;
}
.statusList {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 0.7rem;
  padding: 0.1rem 0;
}
.buildingLogo {
  width: 80px;
  height: 80px;
}
.statusList .flex > div {
  padding: 0.1rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.1rem;
  color: #999;
}
.list {
  background: #fff;
  border-bottom: 1px solid #ddd;
  justify-content: space-between;
  padding-right: 0.2rem;
}
.list_item {
  margin-left: 0.45rem;
  padding: 0.2rem 0.3rem 0.2rem 0;
  /* border-bottom: 1px solid #ddd; */
}
.list_item:last-child {
  margin-bottom: -1px;
}
.list_item .icon {
  width: 0.8rem;
  height: 0.8rem;
  /* border-radius: 50%; */
  /* border: 1px solid #ddd; */
  text-align: center;
  line-height: 0.8rem;
  font-size: 0.4rem;
  color: #fff;
}
.contact {
  line-height: 0.6rem;
  padding: 0 0.1rem;
  border-radius: 0.1rem;
}
.myButton {
  width: 1.56rem;
  border: 1px solid #fff;
}
.timeFilter {
  /* display: flex; */
  /* flex-flow: row nowrap; */
  padding: 0;
}
.flex_list {
  padding: 0 0.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 0.7rem;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  margin-bottom: -1px;
}
.myList {
  display: flex;
}
.myList > div {
  max-height: 5rem;
  overflow-y: auto;
  overflow-x: hidden;
}
.myList span {
  width: 1.5rem;
}
/*  */
.statusFilte {
  padding: 0.24rem 0;
  padding-bottom: 0;
}
.myButton {
  margin-right: 0.2rem;
  margin-bottom: 0.2rem;
}
.filter {
  top: 0;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;
  box-sizing: border-box;
  /* padding: 0 0 0.5rem; */
  transform: translate(0, 0);
  background: #fff;
  border-radius: 0;
}
.layout_my .header:after {
  display: none;
}

.layout_my {
  background: #f7f7f9;
}

.layout_my .blue_box {
  height: 0.88rem;
  background: #0093d2;
  background-size: 100% 100%;
}

.headTab {
  width: 100%;
  height: 0.9rem;
  background: white;
}
.headTab .flex1 {
  border-bottom: 2px solid #fff;
}
.headTab .flex1.active {
  color: rgb(30, 130, 210);
  border-color: rgb(30, 130, 210);
}
.headTab ul {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row;
}

.headTab ul li {
  width: 25%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.32rem;
}
</style>


