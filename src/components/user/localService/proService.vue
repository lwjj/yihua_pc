<template>
  <div id="new_progress">
    <div class="title">
      <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>本楼业务/楼宇单元</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item class="cursor" @click.native="back">本地服务</el-breadcrumb-item>
        <el-breadcrumb-item>产品服务详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="contact">
      <el-col v-if="details.organInfoDto3"
              style="overflow: auto;background: #fff;padding: 0.2rem">
        <el-col>
          <el-col>
            <el-col :span="3" style="text-align: right">
              <span style="color: #9d9e9d;margin-right: 10px">标题:</span>
            </el-col>
            <el-col :span="7">{{details.title}}</el-col>
            <!-- 修改之后只有已上线状态 -->
            <el-col :span="10" v-if="details.state*1== 0">已删除</el-col>
            <el-col :span="10" v-if="details.state*1== 1">已上线</el-col>
            <el-col :span="10" v-if="details.state*1== 2">已下线</el-col>
            <el-col :span="10" v-if="details.state*1== 3">已上线</el-col>
            <el-col :span="10" v-if="details.state*1== 4">未通过</el-col>
          </el-col>
          <el-col v-if="details.organInfoDto3">
            <el-col :span="3" style="text-align: right">
              <span style="color: #9d9e9d;margin-right: 10px">供应商:</span>
            </el-col>
            <el-col :span="7">{{details.organInfoDto3.organName}}</el-col>
            <el-col :span="10" @click.native="toBusiness(details.userId,details.organInfoDto3.organName)" style="color: rgb(35, 172, 56);cursor: pointer" v-if="details.userId!=userInfo.guid">【商家名片】</el-col>
          </el-col>
          <el-col v-if="details.organInfoDto3">
            <el-col :span="3" style="text-align: right">
              <span style="color: #9d9e9d;margin-right: 10px">&nbsp;</span>
            </el-col>
            <el-col :span="7">{{details.organInfoDto3.years}}年</el-col>
            <el-col :span="10" style="color: rgb(35, 172, 56);cursor: pointer" @click.native="contactMe()" v-if="details.userId!=userInfo.guid">【商家联系我】</el-col>
            <!--<el-col :span="10" v-else="details.userId!=userInfo.guid">点击花费{{para.value}}商机点获取联系方式</el-col>-->
          </el-col>
          <el-col v-if="details.organInfoDto3">
            <el-col :span="3" style="text-align: right">
              <span style="color: #9d9e9d;margin-right: 10px">发布时间:</span>
            </el-col>
            <el-col :span="7">{{details.createTime}}</el-col>
            <el-col :span="4">联系人电话：{{details.organInfoDto3.phone}}</el-col>
            <el-col :span="4" v-if="details.organInfoDto3.phone.split('*').length>1">
              <el-button @click.native="open()">点击获取</el-button>
            </el-col>
          </el-col>
          <el-col>
            <el-col :span="3" style="text-align: right">
              <span style="color: #9d9e9d;margin-right: 10px">所在地:</span>
            </el-col>
            <el-col :span="7">{{details.organInfoDto3.organAddress}}</el-col>
          </el-col>
          <el-col>
            <el-col :span="3" style="text-align: right">
              <span style="color: #9d9e9d;margin-right: 10px">最小采购:</span>
            </el-col>
            <el-col :span="7">{{details.minNumber==0?'不限':details.minNumber}}</el-col>
          </el-col>
          <el-col style="display:flex;align-item:center;">
            <el-col  :span="3" style="display:flex;align-items:center;justify-content:flex-end;">
              <span style="color: #9d9e9d;margin-right: 10px">价格:</span>
            </el-col>
            <el-col style="display:flex;align-items:center;" :span="2">{{details.price}}
            </el-col>
            <el-col style="display:flex;align-items:center;" :span="5" v-if="userInfo.guid !== details.userId">
              <el-button size='mini' v-if="details.isLookPhone == 0" @click.native="sendPrice">点击询价</el-button>
              <el-button size='mini' v-else @click.native="toShowBg(3)">点击询价</el-button>
            </el-col>
          </el-col>
        </el-col>
        <el-col v-if="details.isGroup!=0">
          <el-col
            style="line-height: 35px;color: #f2725e;border-bottom: 1px solid #f3f6f5;border-top: 1px solid #f3f6f5;">
            团购进行中
          </el-col>
          <el-col style="color: #999999">
            <el-col :span="4">
              已参加 <span style="color: rgb(242, 114, 94);font-size: 18px">{{details.paGroupNum}}</span>
            </el-col>
            <el-col :span="6">截止时间:{{details.endTime}}</el-col>
          </el-col>
          <el-col style="color: #999999">
            <el-col :span="4">
              {{details.priceSectionDescribe}}
            </el-col>
            <el-col :span="6">服务区域：{{details.scopeValueStr}}</el-col>
          </el-col>
        </el-col>
        <el-col style="margin-top: 10px;border-bottom: 1px solid #e6e6e6;padding: 0.2rem;color: #999999">
          <el-col>详情介绍：{{details.explains}}</el-col>
          <el-col  v-for="(item,index) in details.productParameterList" v-if="item.parameterName && item.parameterValue" :key="index">
            参数名：{{item.parameterName}}&nbsp;&nbsp;&nbsp;参数值：{{item.parameterValue}}
          </el-col>
          <el-col>
            <el-col :span="4" v-for="(item,index) in details.productImg.split(',')" :key="index">
              <img style="margin: 0.2rem;width: 100px;height: 100px;" :src="item" alt="">
            </el-col>
          </el-col>
        </el-col>
        <el-col style="margin-top: 10px;border-bottom: 1px solid #e6e6e6;padding: 0.2rem;color: #999999">
          <el-col>服务内容：{{details.serviceContent}}</el-col>
          <el-col>关键字：{{details.keyword}}</el-col>
        </el-col>
        <el-col style="margin-top: 10px;border-bottom: 1px solid #e6e6e6;padding: 0.2rem;color: #999999">
          <el-col>范围：{{details.scopeValueStr}}</el-col>
        </el-col>
        <el-col style="margin-top: 10px;border-bottom: 1px solid #e6e6e6;padding: 0.2rem;color: #999999">
          <el-col>免责申明：</el-col>
          <el-col> {{content1}}</el-col>
        </el-col>
        <el-col style="margin-top: 10px;border-bottom: 1px solid #e6e6e6;padding: 0.2rem;color: #999999">
          <el-col>友情提示：</el-col>
          <el-col>{{content2}}</el-col>
        </el-col>
        <!-- 自己发的不展示 -->
        <el-col v-if="userInfo.guid!=details.userId" style="display: flex;margin: 0.3rem;width: 300px">
          <el-button v-if="details.isBespeak==1" size='small' type='primary' @click.native="toShowBg(2)">免费预约</el-button>
          <el-button v-if="details.isGroup==1" size='small' type='primary' @click.native="toShowBg(1)">参加团购</el-button>
        </el-col>
      </el-col>
    </div>
    <div v-if="showAlert" class="productAlert">
      <div>
        <div style="color: #999999;line-height: 30px;" v-if="toJoin&&type!=3">
          <div class="alertTitle">{{type == 1?'预约':'参团'}}</div>
          <div style="display: flex;margin: 0.1rem;">
            <div class="label">姓名：&nbsp;</div>
            <input style="flex: 4;line-height: 30px" placeholder="请填写" type="text">
          </div>
          <div style="display: flex;margin: 0.1rem;">
            <div class="label">电话：&nbsp;</div>
            <input style="flex: 4;line-height: 30px" placeholder="请填写" type="text">
          </div>
          <div style="display: flex;margin: 0.1rem;">
            <div class="label">验证码：&nbsp;</div>
            <input style="flex: 4;line-height: 30px" placeholder="请填写" type="text">
          </div>
          <div style="display: flex;margin: 0.1rem;">
            <div class="label">地址：&nbsp;</div>
            <input style="flex: 4;line-height: 30px" placeholder="请填写" type="text">
          </div>
          <div style="display: flex;margin: 0.1rem;">
            <div class="label">备注：&nbsp;</div>
            <textarea class='remarks' style="border-color:#ddd;flex: 4;line-height: 30px;border-color:#ddd;" placeholder="请填写" type="text"></textarea>
          </div>
          <div style="display: flex;margin: 0.1rem;">
            <div class="label"></div>
             <el-button size='small' type='primary' @click.native="hidBg()">取消</el-button>
              <el-button size='small' type='primary' @click.native="toMake()">确定</el-button>
          </div>
          
        </div>
        <div style="color: #999999" v-if="type==3">
          <div class="alertTitle">询价</div>
          <div style="display: flex;margin: 0.1rem;">
            <div class="label">我的留言：&nbsp;</div>
            <textarea v-model="leaveMsg" style="flex: 4;line-height: 30px;" placeholder="请填写" type="text"></textarea>
          </div>
          <div style="display: flex;margin: 0.1rem;">
            <div class="label"></div>
            <div>
          <el-button size='small' type='primary' @click.native="hidBg()">取消</el-button>
            <el-button size='small' type='primary' @click="toLeftMsg()">确定</el-button>
            </div>
            
          </div>
          <!-- <div style="display: flex;margin: 0.3rem;">
           
          </div> -->
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      leaveMsg: "",
      details: "",
      userInfo: "",
      organInfo: "",
      content1: "",
      content2: "",
      showAlert: false,
      toJoin: true,
      type: 0,
      para: {
        value: ""
      },
      data: {
        name: "",
        phone: "",
        code: "",
        remarks: "",
        address: "",
        type: ""
      }
    };
  },
  methods: {
    toBusiness(id, name) {
      this.$router.push(
        "/user/we_business/supply/bussnessCard?userId=" + id + "&oName=" + name
      );
    },
    contactMe() {
      let data = {};
      data.token = this.$getkey();
      data.productId = this.$route.query.guid;
      this.$ajax(
        `${this.subUrl.bd}/product/applyContact`,
        data,
        res => {
          this.$message.success("已通知商家");
          this.hidBg();
          this.getDetail();
        },
        this
      );
    },
    toMake() {
      let data = {};
      this.data.type = this.type;
      this.data.token = this.$getkey();
      this.data.productId = this.$route.query.guid;
      data.type = this.type;
      var title = this.type * 1 == 1 ? "参加团购" : "预约";
      this.$confirm("确定" + title, "标题名称", {
        confirmButtonText: "确定"
      })
        .then(() => {
          this.$ajax(
            `${this.subUrl.bd}/product/addGroup`,
            this.data,
            res => {
              this.$message.success(title + "操作成功");
              this.getDetail();
            },
            this
          );
        })
        .catch(() => {});
    },
    toLeftMsg() {
      let data = {};
      data.token = this.$getkey();
      data.productId = this.$route.query.guid;
      data.message = this.leaveMsg;
      if (data.message == "") {
        return this.$message.warning("请先输入您的留言");
      }
      this.$ajax(
        `${this.subUrl.bd}/product/addProductInquiry`,
        data,
        res => {
          this.$message.success("留言成功");
          this.hidBg();
          this.getDetail();
        },
        this
      );
    },
    open(cb) {
      this.$confirm("查看需支付" + this.para.value + "商机点", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {};
          data.token = this.$getkey();
          data.guid = this.$route.query.guid;
          data.lookType = 3;
          data.payType = 2;
          this.$ajax(
            `${this.subUrl.bd}/purchase/lookPhone`,
            data,
            res => {
              this.$message.success("支付成功");
              this.getDetail();
              cb && cb();
            },
            this
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    sendPrice() {
      this.open(res => {
        this.toShowBg(3);
      });
    },
    toShowBg(type) {
      this.showAlert = true;
      this.type = type;
    },
    hidBg() {
      this.showAlert = false;
      this.type = 0;
    },
    lookPhonePara() {
      let data = {};
      data.token = this.$getkey();
      data.type = "lookPhone";
      this.$ajax(
        `${this.subUrl.bd}/purchase/lookPhonePara`,
        data,
        res => {
          this.para = res.data.para;
        },
        this
      );
    },
    getAgreement1() {
      this.$ajax(
        `${this.subUrl.user}/comm/getProtocol`,
        { type: 13 },
        res => {
          this.content1 = res.data ? res.data.content : "";
        },
        this
      );
    },
    getAgreement2() {
      this.$ajax(
        `${this.subUrl.user}/comm/getProtocol`,
        { type: 14 },
        res => {
          this.content2 = res.data ? res.data.content : "";
        },
        this
      );
    },
    getDetail() {
      var data = {};
      data.token = this.$getkey();
      data.productId = this.$route.query.guid;

      this.$ajax(
        `${this.subUrl.bd}/product/productInfo`,
        data,
        res => {
          console.log(res.data, "productInfo");
          this.details = res.data.productInfo;
        },
        this
      );
    }
  },
  mounted() {
    this.lookPhonePara();
    this.getDetail();
    this.getAgreement1();
    this.getAgreement2();
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
  }
};
</script>
<style scoped lang='scss'>
.productAlert {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.3);
  & > div {
    position: absolute;
    width: 800px;
    left: 50%;
    background: #fff;
    padding: 10px 10px;
    top: 50%;
    transform: translate(-50%, -50%);
    max-height: 80%;
    overflow: hidden;
    border-radius: 4px;
    & > div:nth-child(1) {
      // width: 100px;
    }
    .alertTitle {
      line-height: 40px;
      text-align: center;
      color: #333;
      font-size: 16px;
    }
    .label {
      width: 100px;
      text-align: right;
      padding-right: 10px;
      box-sizing: border-box;
    }
    .label + input,
    .label + textarea {
      border-radius: 4px;
      padding: 0 10px;
    }
  }
}
.main {
  height: 100%;
  background: #fff;
}
.content {
  padding: 20px 30px;
  margin: 20px 0;
  background: #fff;
}

#new_progress {
  height: 100%;
}

.contact {
  width: 100%;
  margin-bottom: 0.2rem;
  overflow: hidden;
  background: white;
}
.main {
  height: 100%;
  overflow: auto;
}
textarea {
    border-color: #ddd !important;
}
</style>
