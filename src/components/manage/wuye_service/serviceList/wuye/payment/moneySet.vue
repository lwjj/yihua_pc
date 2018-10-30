<template>
    <div class="newRightContent">
        <div class="border bgwhite">
            <div class="yd-layout" style="width:750px">
                <div class="title">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{path: '/manage/wuye_service'}">物业服务单</el-breadcrumb-item>
                        <el-breadcrumb-item @click.native="$router.go(-1)">缴费</el-breadcrumb-item>
                        <el-breadcrumb-item>银行卡设置</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <!-- <yd-navbar title="缴费设置" slot='navbar' :bgcolor='mainColor' height='.88rem' color='#fff'>
                    <span slot="left" @click='$router.go(-1)'>
                        <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
                    </span>
                </yd-navbar> -->
                <div class="bgwhite jiaofei">
                    <div class="flex-row h7">
                        <span class="label">收款人</span>
                        <input class="myInput flex1" v-model="obj.payee" type="text">
                    </div>
                    <div class="flex-row h7">
                        <span class="label">账号</span>
                        <input class="myInput flex1" type='number' v-model="obj.payeeAccount">
                    </div>
                    <div class="flex-row h7">
                        <span class="label">开户行</span>
                        <input class="myInput flex1" type='text' v-model="obj.payeeAccountBank">
                    </div>
                </div>
                <div class="flex-row center jusCenter h8 radius" @click="changeInfo" :style="{margin:'1rem auto 1rem',width:'200px',background:mainColor,color:'#fff'}">保存</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    return {
      mainColor: this.$color[this.userInfo.organType],
      obj: {
        ppa_id: "",
        payee: "",
        payeeAccount: "",
        payeeAccountBank: ""
      },
      isChange: false
    };
  },
  methods: {
    changeInfo() {
      if (this.isChange) {
        var obj = this.obj;
        if (obj.payee == "") {
          return this.$message({ message: "请输入收款人", type: "error" });
        } else if (obj.payeeAccount == "") {
          return this.$message({ message: "请输入账号", type: "error" });
        } else if (obj.payeeAccountBank == "") {
          return this.$message({ message: "请输入开户行", type: "error" });
        }
        this.$confirm("是否保存修改").then(() => {
          this.changeBankInfo();
        });
      } else {
        this.addCard();
      }
    },
    getUserInfo() {
      var data = {
        token: this.$getkey(),
        orgId: this.organInfo.guid
      };
      this.$ajax(
        `${this.subUrl.activity}/payAccount/detail`,
        data,
        res => {
          console.log(res);
          if (res.data) {
            this.obj = res.data;
            this.isChange = true;
          }
        },
        this
      );
    },
    changeBankInfo() {
      this.obj.token = this.$getkey();
      this.obj.ppa_id = this.obj.guid;
      this.$ajax(
        `${this.subUrl.activity}/payAccount/editPayAccount`,
        this.obj,
        res => {
          return this.$message({ message: "修改成功", type: "success" });
        },
        this
      );
    },
    addCard() {
      console.log(this.userInfo);
      var data = {
        token: this.$getkey(),
        orgId: this.organInfo.guid
      };
      data = Object.assign({}, data, this.obj);
      console.log(data);
      this.$ajax(
        `${this.subUrl.activity}/payAccount/addPayAccount`,
        data,
        res => {
          this.$message({ message: res.msg, icon: "success", timeout: 1500 });
        },
        this
      );
    }
  },
  mounted() {
    this.getUserInfo();
  }
};
</script>
