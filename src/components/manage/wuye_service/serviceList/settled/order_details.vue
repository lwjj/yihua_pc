<template>
  <yd-layout class="layout_my">
    <div class="blue_box" v-show="!userAgent.isWX">
      <yd-navbar class="header" v-title="'入驻详情'" title="入驻详情" color="#fff" :bgcolor="mainColor" height=".88rem">
         <span class="spanLeft" @click="back" slot="left">
            <span><yd-navbar-back-icon color="#fff"></yd-navbar-back-icon></span>
        </span>

      </yd-navbar>
    </div>
  <div class="out">
    <div class="organInfos">
      <div class="info">
         <ul>
           <li><span>企业名称：</span><p>1栋101单元</p></li>
           <li><span>所在行业：</span><p>深圳高通科技信息有限公司</p></li>
           <li><span>租用单元：</span><p>2017-10-10  2018-10-10</p></li>
           <li><span>合同编号：</span><p>发展需要</p></li>
           <li><span>起止日期：</span><p>2017-10-10  2018-10-10</p></li>
           <li><span>缴费日期：</span><p>2017-10-10  2018-10-10</p></li>
           <li><span>备注信息：</span><p>2017-10-10  2018-10-10</p></li>
         </ul>
      </div>
    </div>

    <div class="text1">
       <ul>
         <li><p>通信地址</p><span>同意按租户申请时间迁出</span></li>
         <li><p>联系人</p><span>完好</span></li>
         <li><p>联系电话</p><span>完好</span></li>
       </ul>
    </div>

    <div class="staff">
         <p class="font28">抄表信息</p>
         <ul>
           <li>
               <p>
                 <span>水表</span>
                  <i>抄表人：马萧萧</i>
               </p>
               <p>
                  <span>本期读数：2000</span>
                  <i>时间：2017-10-10</i>
               </p>
           </li>
           <li>
            
               <p>
                  <span>电表</span>
                  <i>抄表人：马萧萧</i>
               </p>
               <p>
                  <span>本期读数：2000</span>
                  <i>时间：2017-10-10</i>
               </p>
           </li>
         </ul>
    </div>

    <div class="status">
      <div class="one" v-for="(item,index) in statusList" :key="index">
           <div class="z">
            <div class="dot">
              <ul><li></li></ul>
            </div>
           <div class="wire" :style="{background:mainColor}"></div>
           </div>
           <div class="tag">
               <div class="result">
                   <ul>
                     <li>
                       <span :style="{color:mainColor}">{{item.title}}</span>
                       <p><i><img src="../../../../../assets/images/rent/estate/search.png" alt=""></i>{{item.createTime}}</p>
                      </li>
                      <li>处理人：{{item.usetName}}</li>
                      <li>备注：{{item.remark}}</li>
                   </ul>
               </div>
               <div class="arrow">
                <em></em><span></span>
               </div>

            </div>
      </div>
    </div>
      <div class="text" style="margin-top:.3rem;">
      <p><span style="color:#999">办理信息</span></p>
      <ul>
          <li><p>物业名称</p><span>深圳市国际中心大厦管理处</span></li>
          <li><p>办理日期</p><span>2017-01-01 14：00</span></li>
          <li><p>办理人</p><span>马华云</span></li>
      </ul>
     </div>

     <div class='buttons'><button :style="{background:mainColor}">确 定</button></div>
   </div>
  </yd-layout>
</template>
<script>
import Vue from "vue";
import fn from "@/assets/js/product";
import qs from "qs";

export default {
  data() {
    return {
      organInfo: {},
      userInfo: {},
      getkey: "",
      mainColor: "",
      titleT: "",
      show: true,
      s: true,
      p: true,
      decorationId: null,
      statusList: [],
      lists: [],
      decoration: {},
      decorationRowList: [],
      accessoryFiles: []
    };
  },
  methods: {
    toggle() {
      this.show = !this.show;
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      history.back();
    },
    // 获取邀请信息列表
    getDecoration() {
      var data = {
        userId: this.userId,
        token: this.getkey,
        decorationId: this.decorationId
      };
      this.xhr
        .post(
          `${this.subUrl.activity}/decoration/getDecoration?` +
            qs.stringify(data)
        )
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            if (res.data.data.decoration != null) {
              this.decoration = res.data.data.decoration;
              if (this.decoration.status == 1) {
                this.decoration.status = "进行中";
              } else if (this.decoration.status == 1) {
                this.decoration.status = "不同意";
              } else if (this.decoration.status == 1) {
                this.decoration.status = "完成";
              } else if (this.decoration.status == 1) {
                this.decoration.status = "关闭";
              }
              this.decoration.endDate = res.data.data.decoration.endDate.split(
                " "
              )[0];
              this.decoration.createDate = res.data.data.decoration.createDate.split(
                " "
              )[0];
              this.decoration.startDate = res.data.data.decoration.startDate.split(
                " "
              )[0];
            }

            this.lists = res.data.data.decorationRowList;
            this.accessoryFiles = res.data.data.accessoryFiles;

            res.data.data.tasksRecordList.forEach(element => {
              element.createTime = element.createTime.split(" ")[0];
            });
            this.statusList = res.data.data.tasksRecordList;
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
    this.decorationId = this.$route.query.guid;

    // this.getDecoration()
  }
};
</script>
<style scoped>
.layout_my .header:after {
  display: none;
}
.layout_my {
  background: #eef3fa;
}

.layout_my .blue_box {
  height: 0.88rem;
  background-size: 100% 100%;
}
.organInfos {
  width: 100%;
  background: white;
}
.name {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0.3rem;
  background: white;
  border-bottom: 1px solid #f3f6f5;
}
.name span {
  display: flex;
  border-radius: 0.05rem;
  border: 1px solid #2d88d4;
  color: #2d88d4;
  padding: 0.05rem 0.1rem;
  font-size: 0.22rem;
}

.info {
  width: 100%;
  background: white;
  border-bottom: 1px solid #f3f6f5;
  padding: 0.2rem 0.4rem;
  font-size: 0.28rem;
}
.info ul li {
  display: flex;
  height: 0.6rem;
  position: relative;
}
.info ul li > span {
  width: 1.6rem;
  text-align: right;
  color: #9d9e9d;
}
.info ul li > i {
  padding: 0.02rem 0.05rem;
  border: 1px solid #2d88d4;
  font-size: 0.22rem;
  position: absolute;
  right: 0;
  top: 0;
  border-radius: 0.05rem;
  color: #2d88d4;
}

.out {
  width: 100%;
  height: calc(100vh - 0.88rem);
  overflow-y: scroll;
}
.text1 {
  width: 100%;
  background: white;
  margin-top: 0.3rem;
}
.text1 ul {
  width: 100%;
  padding: 0.1rem 0.1rem;
}
.text1 ul > li {
  height: 0.6rem;
  display: flex;
  align-items: center;
}
.text1 ul > li > p {
  width: 1.6rem;
  text-align: right;
  color: #9d9e9d;
}
.text1 ul > li > span {
  flex: 1;
  padding: 0 0.2rem;
}

.staff {
  width: 100%;
  display: flex;
  flex-flow: column;
  background: white;
  margin-top: 0.3rem;
}
.staff > p {
  width: 100%;
  height: 0.8rem;
  padding: 0 0.3rem;
  display: flex;
  align-items: center;
  border-top: 1px solid #d7d7d7;
  border-bottom: 1px solid #d7d7d7;
  color: #b0b0b0;
}
.staff > ul {
  width: 100%;
  padding: 0 0.3rem;
}
.staff > ul > li {
  height: 1.4rem;
  border-bottom: 1px solid #eff2f2;
  display: flex;
  justify-content: space-between;
  position: relative;
  align-items: center;
}
.staff > ul > li > p {
  padding: 0.1rem 0.1rem;
  display: flex;
  flex-flow: column;
}
.staff > ul > li > p > i {
  font-size: 0.24rem;
  color: #999;
  margin-top: 0.1rem;
}

.aaa {
  height: 0.8rem;
  display: flex;
  justify-content: space-between;
  padding: 0 0.4rem;
  align-items: center;
  background: white;
  margin-top: 0.3rem;
}
.aaa > a {
  width: 1.6rem;
  height: 0.6rem;
  border-radius: 0.04rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.aaa > p > span {
  margin-right: 0.2rem;
}

.status {
  width: 100%;
  background: #fafefd;
  margin-top: 0.3rem;
}
.one {
  width: 100%;
  height: 2rem;
  background: #f8f8f9;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #f2f3f3;
}
.tag {
  width: 70%;
  height: 1.7rem;
  border: 1px solid #f2f3f3;
  position: relative;
  background-color: #fff;
  border-radius: 0.1rem;
}
.arrow {
  position: absolute;
  width: 0.3rem;
  height: 0.3rem;
  top: 0.6rem;
  left: -0.4rem;
}
.arrow * {
  display: block;
  border-width: 0.2rem;
  position: absolute;
  border-style: dashed solid dashed dashed;
  font-size: 0;
  line-height: 0;
}
.arrow em {
  border-color: transparent #f2f3f3 transparent transparent;
}
.arrow span {
  border-color: transparent #fff transparent transparent;
  left: 1px;
}

.one .dot {
  width: 0.6rem;
  height: 0.6rem;
  background: #f8f8f9;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 889;
}
.z {
  position: relative;
  width: 0.6rem;
  height: 0.6rem;
  margin-right: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dot ul {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  background: #999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dot ul li {
  width: 0.16rem;
  height: 0.16rem;
  background: white;
  border-radius: 50%;
}
.dot > div:nth-child(1) {
  width: 0.26rem;
  height: 0.26rem;
  background: #999;
  border-radius: 0.26rem;
}
.status > div:first-child .dot ul {
  background: #23ac38;
}

.result {
  width: 100%;
  height: 100%;
  padding: 0.2rem 0.3rem;
}
.result ul {
  width: 100%;
}
.result ul li:nth-child(1) {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
}
.result ul li:nth-child(1) > p {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b1b1b1;
  font-size: 0.24rem;
}
.result ul li:nth-child(1) > p > i {
  width: 0.3rem;
  height: 0.3rem;
  margin-right: 0.1rem;
}
.result ul li:nth-child(1) > p > i > img {
  height: 100%;
  width: 100%;
}
.result ul li:nth-child(1) > span {
  font-weight: 600;
  margin-bottom: 0.1rem;
  font-size: 0.3rem;
}
.result ul li:nth-child(2),
.result ul li:nth-child(3) {
  font-size: 0.28rem;
  color: #8a8a8a;
  margin-bottom: 0.05rem;
}

.wire {
  width: 0.04rem;
  height: 2rem;
  background: #b1b1b1;
  position: absolute;
  z-index: 888;
  top: -2rem;
}
.status > div:nth-child(1) > .z > .wire {
  display: none;
}

.text {
  position: relative;
  display: flex;
  flex-flow: column;
  width: 100%;
  background: white;
  border-top: 1px solid #e6e8e7;
}
.text > p {
  width: 100%;
  height: 0.7rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.4rem;
  border-bottom: 1px solid #e6e8e7;
}
.text > ul {
  width: 100%;
  padding: 0.1rem 0.3rem;
}
.text > ul > li {
  width: 100%;
  height: 0.5rem;
  display: flex;
  align-items: center;
}
.text > ul > li > p {
  width: 1.6rem;
  text-align: center;
}
.text > i {
  width: 1rem;
  height: 1rem;
  background: red;
  position: absolute;
  right: 0.5rem;
  top: 0.8rem;
}
.text > ol {
  width: 100%;
  padding: 0.1rem 0.4rem;
}
.text > ol > li {
  border-bottom: 1px solid #e6e8e7;
  width: 100%;
  justify-content: space-between;
  display: flex;
  align-items: center;
  height: 0.7rem;
}
.text > ol > li:last-child {
  border: none;
}
.text > div {
  width: 100%;
  display: flex;
}
.text > div > i {
  width: 1.4rem;
  height: 1.4rem;
  margin: 0.1rem 0.25rem;
  border-radius: 0.1rem;
}
.text > div > i > img {
  width: 100%;
  height: 100%;
  border-radius: 0.1rem;
}

.feedback {
  width: 100%;
  padding: 0.1rem 0.4rem;
  display: flex;
  flex-flow: column;
  background: white;
  margin-top: 0.3rem;
}
.feedback > span {
  width: 100%;
  height: 0.6rem;
  color: #c5c5c5;
  font-size: 0.24rem;
  display: flex;
  align-items: center;
}
.feedback > p {
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 0.1rem;
}
.feedback > p > img {
  width: 100%;
  height: 100%;
}

.buttons {
  width: 100%;
  margin: 0.4rem 0;
  display: flex;
  justify-content: center;
}
.buttons > button {
  width: 90%;
  height: 0.8rem;
  color: white;
  font-size: 0.3rem;
  font-weight: 600;
  border-radius: 0.1rem;
  border: none;
}
</style>
