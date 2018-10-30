<template>
<div id='inform_del' v-if="loading">
   
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>物业关系详情</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/user/we_business' }">本楼业务</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/user/we_business/we_purchase' }">本楼采购</el-breadcrumb-item>
            <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div> 
    <div class="layout" v-show="!showShop">
        <!-- <div class="del_top">
          <div>名称：
              <span class="idea">{{organInfo.organName}}</span>
            </div>
        </div> -->
    <div class="del">
        <div class="del_title">
            <!-- （0,：已删除，1：已上线，2：已下线，3：审核中，4：未通过）  -->
            <span v-if="del.state == 0">状态：已删除</span>
            <span v-if="del.state == 1">状态：已上线</span>
            <span v-if="del.state == 2">状态：已下线</span>
            <span v-if="del.state == 3">状态：审核中</span>
            <span v-if="del.state == 4">状态：未通过</span>
        </div>
      <ul class="delList1 clearfix">
        <li><i>联系人：</i><span>{{del.organInfoDto3.userName}}</span></li>
        <li><i>电话：</i><span>{{del.organInfoDto3.phone}}</span><span style="color:#888;margin-left:100px;">已被查看{{del.lookNumber}}次</span></li>
        <li style="color:#888;margin-top:20px;border-top:1px solid #ccc;">联系时请说是在【八爪网】看到的</li>
      </ul>
    </div>

    <div class="del">
        <div class="del_title">
            <span v-if="show6">报价</span>
            <span v-if="show7">投标登记</span>
        </div>
      <ul class="delList1 clearfix">
        <li><i>报价：</i><span>{{del.typeName}}</span></li>
        <li style="width:100%;"><i>附言：</i><p style="border:1px solid #ccc;padding:5px 5px 50px 5px;margin-top:10px;">{{del.content}}</p></li>
      </ul>
    </div>

    <div class="del">
      <ul v-if="show6" class="delList2 clearfix">
        <li><i>标题：</i><span class="">{{del.title}}</span><el-tag v-if="del.isUrgent==1" type="danger" style="margin-left:20px;">急</el-tag></li>
        <li><i>采购数量：</i><span class="">{{del.number==-1?'面议':del.number}}</span></li>
        <li><i>发布日期：</i><span class="">{{del.startTime | date}}</span></li>
        <li><i>买家地址：</i><span class="">{{del.deliveryAddress}}</span></li>
        <li><i>截至日期：</i><span class="">{{del.startTime | date}}</span></li>
        <li><i>范围：</i><span class="">{{del.scopeValueStr}}</span></li>
        <li><i>供应要求：</i><span class="">{{del.positionCondition | fmtType}}</span></li>
      </ul>
       <ul v-if="show7" class="delList2 clearfix">
          <li><i>项目名称：</i><span class="">{{del.title}}</span><el-tag v-if="del.isUrgent==1" type="danger" style="margin-left:20px;">急</el-tag></li>
          <li><i>招标金额：</i><span>{{del.money==0?'面议':del.money}}</span></li>
          <li><i>发布日期：</i><span>{{del.startTime | date}}</span></li>
          <li><i>截至日期：</i><span>{{del.endTime | date}}</span></li>
          <li><i>买家地址：</i><span>{{del.address}}</span></li>
          <li><i>交货日期：</i><span>{{del.deliveryTime | date}}</span></li>
          <li><i>交货地址：</i><span>{{del.deliveryAddress}}</span></li>
          <li><i>范围：</i><span class="">{{del.scopeValueStr}}</span></li>
          <li><i>供应要求：</i><span class="">{{del.positionCondition | fmtType}}</span></li>
          <li><i>供应商要求：</i><span class="">{{del.positionCondition | fmtShop}}</span></li>
          <li style="width:100%;margin-top:20px;"><i>商家资质要求</i><p style="border:1px solid #ccc;padding:5px 5px 50px 5px;margin-top:10px;"> {{del.seniority==null?'暂无':del.seniority}}</p></li>
        </ul>
    </div>
    <!-- 表单 -->
<div class="inform_table">
   <el-table
    :data="del.purchaseDetailsList"
    >
    <el-table-column
      label="产品/服务"
      prop="productService"
      >
    </el-table-column>
    <el-table-column  
      label="数量"
      prop="number"
      >
    </el-table-column>
    <el-table-column 
      label="金额(元)"
      prop="money"
      >
    </el-table-column>
  </el-table>
  <div style="padding: 20px 0px;background:#fff;">
      <p style="border:1px solid #ccc;padding:5px 5px 50px 5px;background:#fff;">{{del.explains}}</p>
      <div class="keyword">
          <ul class="clearfix">
            <li v-if="keyword[0]">{{keyword[0]}}</li>
            <li v-if="keyword[1]">{{keyword[1]}}</li>
            <li v-if="keyword[2]">{{keyword[2]}}</li>
          </ul>
          
      </div>
  </div>
 </div>
  <div class="del">
        <div class="del_title">
            <span v-if="show6">报价</span>
            <span v-if="show7">投标登记(由采购方联系您)</span>
        </div>
      <ul class="delList1 clearfix">
        <el-form label-width="90px">
            <el-form-item label="我的报价：">
                <el-input v-model="myPrice"></el-input>
            </el-form-item>
            <el-form-item label="我的附言：">
                <el-input type="textarea" :autosize="{minRows: 4}" v-model="myPrice"></el-input>
            </el-form-item>
        </el-form>
      </ul>
    </div>
     <div class="recommend">
            <el-button type="primary" @click="recommend">推荐</el-button>
      </div>
    </div>
        <selectShop v-show="showShop" @selectSuccess="selectSuccess" @back="back"></selectShop>

      <!-- 选择商家 -->


</div>

</template>
<script>
import selectShop from "./select_shop";
export default {
  components: {
    selectShop
  },
  data() {
    return {
      recomType:"",
      show6:false,
      show7:false,
      title: "",
      showShop: false,
      loading: false,
      userInfo: "",
      organInfo: "",
      del: {},
      accessoryList: [],
      userIdList: "",
      keyword: [],
      myPrice: "",
      myContent: "",
      checkList: []
    };
  },
  filters: {
    fmtType: input => {
      //（0,：不限，1：本省，2：本市，3：本区,4：片区） ,
      if (input == 0) {
        return "不限";
      } else if (input == 1) {
        return "本省";
      } else if (input == 2) {
        return "本市";
      } else if (input == 3) {
        return "本区";
      } else if (input == 4) {
        return "片区";
      }
    },
    fmtShop: input => {
      //（0,：不限，1：基础商家，2：中级商家，3：高级商家，4：金牌商家） ,
      if (input == 0) {
        return "不限";
      } else if (input == 1) {
        return "基础商家";
      } else if (input == 2) {
        return "中级商家";
      } else if (input == 3) {
        return "高级商家";
      } else if (input == 4) {
        return "金牌商家";
      }
    }
  },
  methods: {
    //
    recommend() {
      this.showShop = true;
    },
    back() {
      this.showShop = false;
    },
    selectSuccess(checkList) {
      this.checkList = checkList;
      if(this.$route.params.type==6){
        this.recomType = 6;
      }else if(this.$route.params.type==7){
        this.recomType = 7;
      }
      this.yes();
      this.showShop = false;
    },
    //推荐
    yes() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        type: this.recomType,  //	类型（6：采购，7：招标）
        guid: this.$route.params.id,
        userIdList: this.checkList.join()
      };
      this.$ajax(
        `${this.subUrl.bd}/buildingBuy/recommendBusiness`,
        data,
        res => {
          console.log(res, "yes");
          this.$message.success("推荐成功");
        },
        this
      );
    },
    //请求采购单详情页面
    purchasingInfo() {
      var data = {
        token: this.$getkey(),
        guid: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.bd}/purchase/purchasingInfo`,
        data,
        res => {
          console.log(res, "purchasingInfo");
          this.del = res.data.purchasingInfo;
          this.keyword = res.data.purchasingInfo.keyword.split(",");
          this.loading = true;
        },
        this
      );
    },
    //请求 招标书详情
    tenderInfo() {
      var data = {
        token: this.$getkey(),
        guid: this.$route.params.id,
        type: ""
      };
      this.$ajax(
        `${this.subUrl.bd}/purchase/tenderInfo`,
        data,
        res => {
          console.log(res, "tenderInfo");
          this.del = res.data.tenderOrderInfo;
          this.keyword = res.data.tenderOrderInfo.keyword.split(",");
          this.loading = true;
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
    if (this.$route.params.type == 6) {
      this.title = "采购单详情";
      this.purchasingInfo();
      this.show6 = true;
    } else if (this.$route.params.type == 7) {
      this.title = "招标书详情";
      this.tenderInfo();
      this.show7 = true;
    }
  }
};
</script>
<style lang="scss" scoped>
#inform_del {
  height: 100%;
  padding-left: 280px;
  padding-right: 20px;
  overflow: scroll;
  .text {
    i {
      padding: 20px 20px;
    }
  }
}
.del {
  margin-top: 20px;
}
.del_title {
  // font-size: 16px;
  // font-weight: 700;
  margin-top: 20px;
  padding: 10px 40px;
  background: #fff;
  border-bottom: 1px solid #ccc;
  .idea {
    padding-left: 100px;
    font-weight: 400;
    font-size: 15px;
  }
  .tag {
    float: right;
  }
}
.delList1 {
  background: #fff;
  padding: 20px 50px;
  li {
    width: 100%;
    padding: 5px 0;
    float: left;
  }
  span {
    // padding-left: 20px;
  }
  i {
    width: 100px;
    display: inline-block;
  }
}
.delList2 {
  background: #fff;
  padding: 20px 50px;
  li {
    width: 50%;
    padding: 5px 0;
    float: left;
    &:first-of-type {
      width: 100%;
    }
  }
  .del_text {
    padding-left: 20px;
  }
  i {
    width: 120px;
    display: inline-block;
  }
}

.recommend {
  // background: #fff;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 20px 0;
  button {
    width: 150px;
  }
}
.inform_table {
  padding: 0;
  margin-top: 20px;
}
.keyword {
  ul {
    padding-left: 20px;
  }
  li {
    border: 1px solid #ccc;
    float: left;
    padding: 2px 30px;
    margin: 10px 20px 0px 0px;
    border-radius: 5px;
    color: #888;
  }
}
</style>