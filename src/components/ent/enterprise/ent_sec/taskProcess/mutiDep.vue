<template>
<div class="addRightContent">
 <div class="border bgwhite">
   <yd-layout class="yd-layout" style="width:750px;">
   <div class="title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{path: '/entprise/workstation'}">工作台</el-breadcrumb-item>
          <el-breadcrumb-item @click.native='back'>返回</el-breadcrumb-item>
          <el-breadcrumb-item>选择执行人</el-breadcrumb-item>
      </el-breadcrumb>
   </div>
    <!-- <yd-navbar class="header" slot="navbar" v-show="!userAgent.isWX" v-title="'部门管理'" title="部门管理" color="#fff"
               :bgcolor="mainColor"
               height=".88rem">
      <a @click="back()" slot="left"> 
        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
      </a>
    </yd-navbar> --> 
    <div class="list-top">
      <ul class="oul" v-for="(it,index) in passW" v-if="it.empList.length > 0" :key="index">
        <li @click="showList(index)">
          <img v-show="it.empList.length>0" v-bind:class="it.showList&&it.empList.length>0?'l-left l-click':'l-left'"
               src="../../../../../assets/images/rent/my/root-list.png"
               alt="">
          <img v-show="it.empList.length==0" class="l-left l-click" src="" alt="" @click="showList(index)">
          <span class="l-center">{{it.deptName}}</span>
        </li>
        <ul v-show="it.showList">
          <li class="child-bottom" @click="selectThis(index,no)" v-for="(item,no) in it.empList" :key="no"
              v-if="it.empList.length>0">
            <img v-show="!item.isSelect" class="list-item"
                 src="../../../../../assets/images/rent/my/unselected_pic.png" alt="">
            <img v-show="item.isSelect" class="list-item" src="../../../../../assets/images/rent/my/job_selected.png"
                 alt="">
            <span class="l-center">
                {{item.userName}}</span>
            <span class="l-center-span" v-if="item.post">{{item.post}}</span>
            <span class="l-center-span" v-if="!item.post">暂无</span>
          </li>
        </ul>
      </ul>
    </div> 
    <div style="padding:20px">
      <el-button type="primary" @click="delPeople">确定</el-button>
    </div>
  </yd-layout>
 </div>
</div>
  
</template>
<script>
import fn from "@/assets/js/product";
import qs from "qs";

export default {
  props: ["organId", "type", "deptId"],
  data() {
    return {
      organInfo: "",
      hasMessage: {
        count: 99,
        new: true
      },
      value2: "",
      result: [],
      url: this.fromRoute ? this.fromRoute : "",
      userInfo: "",
      mainColor: "",
      passW: [],
      deptName: "",
      guid: "",
      toAddDept: false,
      toDel: [],
      isAllSelected: false,
      editDeptGuid: "",
      showRightImg: true,
      delDeptBg: false,
      sureDelGuid: "",
      delThisDept: "",
      isSelected: false,
      myUser: {}
    };
  },
  watch: {},
  methods: {
    back() {
      this.$emit("setUserId");
    },
    //向父组件传递数据
    delPeople() {
      var flag = true;
      let userArr = [],
        userIdArr = [],
        list = [];
      for (var i of this.passW) {
        for (var j of i.empList) {
          if (j.isSelect) {
            flag = false;
            userArr.push(j.userName);
            userIdArr.push(j.userId);
            list.push(j);
          }
        }
      }
      if (flag) {
        return this.$dialog.toast("请选择部门人员");
      } else {
        var data = {
          userArr,
          userIdArr,
          list
        };
        this.$emit("setUserId", data);
      }
    },
    selectThis(index, no) {
      var flag = true;
      for (var i = 0; i < this.passW.length; i++) {
        for (var j = 0; j < this.passW[i].empList.length; j++) {
          if (index == i && no == j) {
            this.isSelect = true;
            if (this.passW[i].empList[j].isSelect) {
              this.$set(this.passW[i].empList[j], "isSelect", false);
            } else {
              this.$set(this.passW[i].empList[j], "isSelect", true);
            }
            // this.myUser = this.passW[i].empList[j];
          } else {
            // this.$set(this.passW[i].empList[j], 'isSelect', false)
          }
        }
      }
    },
    delDept(guid, name) {
      this.toAddDept = true;
      this.delDeptBg = true;
      this.sureDelGuid = guid;
      this.delThisDept = name;
    },
    sureDelDept(guid) {
      var data = {
        organId: this.organInfo.guid,
        token: this.getkey,
        pageNo: 1,
        pageSeze: 15
      };
      this.xhr
        .post(
          `${this.subUrl.user}/admin/deptManage/delDepartment?token=` +
            data.token +
            "&organId=" +
            data.organId +
            "&DepartmentId=" +
            guid
        )
        .then(res => {
          if (res.data.code == 1) {
            this.getDepartmentInfo();
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
          this.sureDelGuid = "";
        });
      this.cancelAdd();
    },
    addDEpt() {
      var data = {
        organId: this.organInfo.guid,
        token: this.getkey,
        pageNo: 1,
        pageSeze: 15
      };
      if (this.editDeptGuid && this.editDeptGuid != "") {
        this.xhr
          .post(
            `${this.subUrl.user}/admin/deptManage/editDepartment?token=` +
              data.token +
              "&organId=" +
              data.organId +
              "&deptId=" +
              this.editDeptGuid +
              "&departmentName=" +
              this.deptName
          )
          .then(res => {
            if (res.data.code == 1) {
              this.getDepartmentInfo();
              this.deptName = "";
              this.editDeptGuid = "";
              this.toAddDept = false;
            } else if (res.data.code == "-902") {
              //-902
              /*重新登录*/
              // fn.re_login(this);
            } else {
              this.$dialog.toast({ mes: res.data.msg });
            }
          });
      } else {
        this.xhr
          .post(
            `${this.subUrl.user}/admin/deptManage/addDepartment?token=` +
              data.token +
              "&organId=" +
              data.organId +
              "&departmentName=" +
              this.deptName
          )
          .then(res => {
            if (res.data.code == 1) {
              this.getDepartmentInfo();
              this.deptName = "";
              this.toAddDept = false;
            } else if (res.data.code == "-902") {
              //-902
              /*重新登录*/
              // fn.re_login(this);
            } else {
              this.$dialog.toast({ mes: res.data.msg });
            }
          });
      }
    },
    showList(index) {
      if (this.passW[index].showList) {
        this.passW[index].showList = false;
      } else {
        this.passW[index].showList = true;
      }
      var arr = this.passW;
      this.passW = [];
      this.passW = arr;
    },
    itemClickHandler() {},
    submitHandler(value) {
      this.arr = [];
      this.selectTab = 4;
      this.page = 1;
      var flag = true;
      for (var i = 0; i < this.passW.length; i++) {
        for (var j = 0; j < this.passW[i].empList.length; j++) {
          if (this.passW[i].empList[j].userName == `${value}`) {
            this.passW[i].showList = true;
            this.passW[i].empList[j].isSelect = true;
            flag = false;
          }
        }
      }
      if (flag) {
        this.$dialog.toast({ mes: `此员工不存在` });
      }
      var arr = this.passW;
      this.passW = [];
      this.passW = arr;
      var data = { token: this.getkey, organId: this.organInfo.guid };
      // {params: {type: 'pulldown', page: this.page}
      this.xhr
        .post(
          `${this.subUrl.admin}/latestNews/organNews?token=` +
            this.getkey +
            "&keyword=" +
            `${value}` +
            "&organId=" +
            this.organInfo.guid +
            "&pageNo=" +
            this.page +
            "&pageSize=10"
        )
        .then(res => {
          if (res.data.code == 1) {
            this.arr = [...res.data.data.list, ...this.arr];
            if (res.data.data.list.length == 0) {
              this.showErr = true;
            } else {
              this.showErr = false;
            }
            this.page++;
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    getDepartmentInfo(cb) {
      var data = { organId: this.organId, token: this.getkey };
      // if (this.deptId) {
      //   data.deptId = this.deptId;
      // }
      // if (this.type) {
      //   data.type = this.type;
      // }
      this.xhr
        .post(
          `${this.subUrl.user}/admin/deptManage/organDepartmentInfo`,
          this.$qs.stringify(data)
        )
        .then(res => {
          if (res.data.code == 1) {
            this.passW = res.data.data;
            for (var i = 0; i < this.passW.length; i++) {
              this.passW[i].showList = false;
              for (var j = 0; j < this.passW[i].empList; j++) {
                this.passW[i].empList[j].isSelect = false;
              }
            }
            cb && cb();
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            // fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
          }
        });
    },
    clearLoacl() {
      this.alertS = true;
    },
    quit() {
      this.alertS = false;
    },
    getUserInfo(cb) {
      var data = { userId: this.userId, token: this.getkey };
      this.xhr
        .post(`${this.subUrl.user}/user/getUserInfo`, qs.stringify(data))
        .then(res => {
          if (res.data.code == 1) {
            this.userInfo = res.data.data.userInfo;
            this.organInfo = res.data.data.organInfo;
            cb && cb();
          } else if (res.data.code == "-902") {
            //-902
            /*重新登录*/
            fn.re_login(this);
          } else {
            this.$dialog.toast({ mes: res.data.msg });
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
    this.mainColor = this.$color[this.userInfo.organType];
    this.userId = this.userInfo.guid;
    this.getkey = fn.getIng();
    this.userId = this.userInfo.guid;
    if (this.$route.query.update) {
      this.getDepartmentInfo();
    }
    if (
      this.$route.path.split("/")[this.$route.path.split("/").length - 1] ==
      "send_inviteCode"
    ) {
      this.showRightImg = false;
    }
    // this.$router.push({path: this.$route.path})
    var that = this;
    this.getUserInfo(function() {
      that.getDepartmentInfo();
    });
  }
};
</script>
<style scoped>
.top_title {
  width: 100%;
  line-height: 0.8rem;
  font-size: 0.18rem;
  padding: 0 0.3rem;
}

.layout_my {
  background: #f7f7f9;
}

.layout_my .header:after {
  display: none;
}

.list-top {
  width: 100%;
  background: #ffffff;
  /*margin-top: 1.2em;*/
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  margin-bottom: 0.5rem;
}

li {
  height: 0.9rem;
  background: white;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 0 0.3rem;
  position: relative;
  border-bottom: 1px solid #f0f0f0;
}

.child-bottom {
  border-bottom: 1px;
}

.child-bottom:before {
  content: "";
  position: absolute;
  right: -91%;
  bottom: -1%;
  width: 177%;
  /* height: 200%; */
  border-bottom: 2px solid #f0f0f0;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.m-right {
  width: 0.32rem;
}

.l-right1 {
  height: 0.3rem;
  width: 0.3rem;
  right: 0.3rem;
  top: 1em;
  position: absolute;
}

.l-right2 {
  height: 0.3rem;
  width: 0.3rem;
  right: 1rem;
  top: 1em;
  position: absolute;
}

.l-right3 {
  height: 0.3rem;
  width: 0.3rem;
  right: 1.8rem;
  top: 1em;
  position: absolute;
}

.l-center {
  margin: 0 0.3rem;
}

.l-left {
  height: 0.3rem;
  width: 0.3rem;
  transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  /* IE 9 */
  -moz-transform: rotate(-90deg);
  /* Firefox */
  -webkit-transform: rotate(-90deg);
  /* Safari 和 Chrome */
  -o-transform: rotate(-90deg);
  -webkit-transition: 0.2s ease-in;
  transition: 0.2s ease-in;
}

.l-click {
  transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  /* IE 9 */
  -moz-transform: rotate(0deg);
  /* Firefox */
  -webkit-transform: rotate(0deg);
  /* Safari 和 Chrome */
  -o-transform: rotate(0deg);
}

.black-bg {
  background: black;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  position: fixed;
  z-index: 99;
}

.list-item {
  width: 1.5em;
  height: 1.5em;
}

/*//弹框*/

.alert-div {
  position: absolute;
  width: 80%;
  margin-top: 30%;
  margin-left: 10%;
  background: #ffffff;
  border-radius: 6px;
  padding: 0.3em 0 0;
  z-index: 99;
}

.alert-div input {
  width: 80%;
  margin-bottom: 1em;
  border: 1px solid #e6e6e6;
  line-height: 3em;
  border-radius: 0.3em;
  padding: 0 0.5em;
  background: #ebf3f3;
  margin-left: 10%;
}

.alert-div .alert-title {
  margin-left: 10%;
  line-height: 4em;
  font-size: 12px;
  color: #999999;
}

.alert-div .alert-title-del {
  line-height: 4em;
  text-align: center;
  font-size: 15px;
  color: #444444;
}

.alert-div .last-btn {
  border-top: 1px solid #ebf3f3;
  width: 100%;
  line-height: 4em;
  display: flex;
}

.last-btn :first-child {
  border-right: 1px solid #ebf3f3;
  color: #999999;
}

.l-center-span {
  text-align: left;
  left: 40%;
  position: absolute;
  width: 50%;
  font-size: 12px;
  color: #999999;
}

.selected_footer {
  position: fixed;
  width: 100%;
  bottom: 0;
}

.selected_footer .l-left {
  height: 1.4em;
  width: 1.4em;
  transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  -webkit-transition: 0.2s ease-in;
  transition: 0.2s ease-in;
}

.bottom-del {
  background: red;
  color: #ffffff;
  line-height: 3.2em;
  height: 100%;
  width: 6em;
  padding-left: 1.6em;
  right: 0em;
  position: absolute;
  text-align: center;
}

.del-right {
  height: 0.3rem;
  width: 0.3rem;
  right: 0.9rem;
  position: absolute;
}
</style>
