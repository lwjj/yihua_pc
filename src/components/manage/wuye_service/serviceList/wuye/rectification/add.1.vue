<template>
<div style="height:100vh">
  <yd-layout v-show="showUser">
      <yd-navbar title="上报违规" slot='navbar' v-show="!userAgent.isWX" :bgcolor='mainColor' color='#fff' height='.88rem'>
          <div slot="left" @click="$router.go(-1)">
            <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
          </div>
      </yd-navbar>
      <div style="padding:.4rem 0" class="bgwhite">
          <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem">
        <!-- 左边 -->
        <div style="width:1.68rem;text-align:right;" class="mr2">客户名称</div>
        <input type="text" @click='chooseDong' placeholder="栋" v-model='dong.text' class="clear-input pdlr2 flex1 mr1" style="border-radius:.1rem;width:1.8rem;height:.65rem"
          readonly>
        <input type="text" @click='chooseUnit' placeholder="单元号" v-model='unit.text' class="clear-input pdlr2 flex1" style="border-radius:.1rem;width:1.8rem;height:.65rem"
          readonly>
        <div></div>
      </div>
      <!-- 联系人 -->
      <!-- v-model="unit.ownerInfo.userName" -->
      <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem">
        <div style="width:1.7rem;text-align:right;" class="mr2" >联系人</div>
        <input class="clear-input flex1 pdlr1" readonly v-model="rentName" style="height:.65rem" type="text">
      </div>
      <!-- 联系电话 -->
       <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem">
        <div style="width:1.7rem;text-align:right;" class="mr2">联系电话</div>
        <input class="clear-input flex1 pdlr1" readonly maxlength="11" v-model="rentPhone" style="height:.65rem" type="text">
      </div>
       <!-- <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem">
        <div style="width:1.7rem;text-align:right;" class="mr2">审批人</div>
        <input class="clear-input flex1 pdlr1"  readonly @click="showUser=false" v-model="approverName" style="height:.65rem" type="text">
      </div> -->
      <!-- 检查日期 -->
       <!-- <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem">
        <div style="width:1.7rem;text-align:right;" class="mr2">上报时间</div>
        <yd-datetime type='date' class="border flex1 pdlr1" v-model="startTime" style="height:.68rem"></yd-datetime>
      </div> -->
      <!--  -->
      <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem">
        <div style="width:1.7rem;text-align:right;" class="mr2">业主信息</div>
        <div style="width:2rem">{{ownerName}}</div>
        <div style="width:2rem">{{ownerPhone}}</div>
      </div>
       <div class="flex-row-nowarp bgwhite h8 flex-start" style="padding-right:.6rem;min-height:.8rem;height:auto">
        <div style="width:1.7rem;text-align:right;" class="mr2">违规内容</div>
        <yd-textarea  style="flex:1;height:3rem;" v-model="content" class="border pdlr1" :show-counter='false' maxlength=300>

        </yd-textarea>
      </div>
      <!-- 确定 -->
      <div class="flex-row-nowarp flex-start mt2">
        <div style="width:1.7rem;text-align:right;" class="mr2"></div>
          <yd-button type='hollow' @click.native="confirm">确定</yd-button>
      </div>
    </div>
    <vue-pickers v-show="show1" slot="bottom" class="slideBox" :selectData="pickData1" v-on:cancel="close" v-on:confirm="confirmFn"></vue-pickers>
    <vue-pickers v-show="show2" slot="bottom" class="slideBox" :selectData="pickData2" v-on:cancel="close" v-on:confirm="confirmFn1"></vue-pickers>
  </yd-layout>
  <departMent v-if='!showUser' @setUserId='setUserId'></departMent>

</div>
</template>
<script>
import VuePickers from "vue-pickers";
import departMent from "../repair/department_manager";
export default {
  components: {
    VuePickers,
    departMent
  },
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.mainColor = this.$color[this.userInfo.organType];
    return {
      showUser: true,
      approverName: "",
      pickData1: {
        columns: 1,
        isChange: false,
        pData1: []
      },
      pickData2: {
        columns: 1,
        isChange: false,
        pData1: []
      },
      dong: {},
      unit: {
      },
      
      rentName:"",
      rentPhone:"",
      ownerName:"",
      ownerPhone:"",
      show1: false,
      show2: false,
      name: "",
      phone: "",
      startTime: "",
      content: ""
    };
  },
  methods: {
    setUserId(e) {
      this.showUser = true;
      console.log(this.result);
      if (e) {
        console.log(e);
        this.approverName = e.userName;
        this.approverId = e.userId;
      }
    },
    confirm() {
      if (!this.dong.text) {
        return this.$dialog.toast({ mes: "请选择栋" });
      } else if (!this.unit.text) {
        return this.$dialog.toast({ mes: "请选择单元" });
      }else if (!this.unit.organId) {
        return this.$dialog.toast({ mes: "该单元没有企业入驻,请重新选择!" });
      } else if (!this.content) {
        return this.$dialog.toast({ mes: "请输入违规内容" });
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        issueOrganId: this.unit.organId,
        content: this.content,
        // approverId: this.approverId
      };
      this.$ajax(`${this.subUrl.activity}/rectification/addRectification`,data,res=>{
          this.$dialog.toast({mes:"上报成功!",icon:"success",callback:res=>{
              this.$router.go(-1);
          }});
      },this);
    },
    chooseDong() {
      if (this.pickData1.pData1.length == 0) {
        return this.$dialog.toast({ mes: "数据为空", timeout: 1000 });
      } else {
        this.show1 = true;
      }
    },
    chooseUnit() {
      if (this.pickData2.pData1.length == 0) {
        return this.$dialog.toast({ mes: "数据为空", timeout: 1000 });
      } else {
        this.show2 = true;
      }
    },
    getDong(id) {
      console.log(id)
      this.xhr
        .post(
          `${this.subUrl.common}/comm/getBuildingRid`,
          this.$qs.stringify({
            buildingId: id
          })
        )
        .then(res => {
          if (res.data.code == 1) {
            let len = res.data.data.length;
            let arr = [];
            for (var i = 0; i < len; i++) {
              var obj = res.data.data[i];
              obj.value = res.data.data[i].guid;
              obj.text = res.data.data[i].ridName;
              arr.push(obj);
            }
            this.pickData1.pData1 = arr;
          } else {
            this.$dialog.alert({
              mes: res.data.msg
            });
            this.pickData2.pData1 = [];
            this.pickData3.pData1 = [];
          }
        });
    },
    getUnit(id) {
      this.xhr
        .post(
          `${this.subUrl.common}/comm/getEnterUnit`,
          this.$qs.stringify({
            ridId: id
          })
        )
        .then(res => {
          if (res.data.code == 1) {
            let len = res.data.data.length;
            let arr = [];
            for (var i = 0; i < len; i++) {
              var obj = res.data.data[i];
              console.log();
              obj.value = res.data.data[i].ridId;
              obj.text = res.data.data[i].unitName;
              arr.push(obj);
            }
            this.pickData2.pData1 = arr;
          } else {
            this.$dialog.alert({
              mes: res.data.msg
            });
          }
        });
    },
    confirmFn(e) {
      this.dong = e.select1;
      console.log(JSON.stringify(e.select1));
      this.show1 = false;
      this.buildingRidId = e.select1.guid;
      this.getUnit(this.dong.guid);
      this.unit = {};
      this.roomNumber = "";
      this.acceptOrgId = "";
    },
    confirmFn1(e) {
      console.log(JSON.stringify(e.select1));
      this.unit = e.select1;
      this.roomNumber = e.select1.guid;
      this.acceptOrgId = e.select1.organId;
       if(!e.select1.clientInfo){
        return this.$dialog.toast({mes:"无用户信息"})
      }
      this.rentName = e.select1.clientInfo.name;
     
      this.rentPhone = e.select1.clientInfo.account;
      this.ownerName = e.select1.ownerInfo.name;
      this.ownerPhone = e.select1.ownerInfo.account;
      // rentPhone:"",
      // ownerName:"",
      // ownerPhone:"",
      this.show2 = false;
    },
    close: function() {
      this.show1 = false;
      this.show2 = false;
    }
  },
  mounted() {
    this.getDong(this.userInfo.buildingId);
  }
};
</script>

