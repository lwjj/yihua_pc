<template>
<div id='inform_del'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>物业关系详情</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/user/we_business' }">本楼业务</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/user/we_business/business_manage' }">商家管理</el-breadcrumb-item>
            <el-breadcrumb-item>商家名片</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
        <!-- <div class="del_top">
          <div>名称：
              <span class="idea">{{organInfo.organName}}</span>
            </div>
        </div> -->
    <div class="del">
        <div class="del_title">
            <span>名称：{{$route.query.organName}}</span>
        </div>
      <ul class="delList clearfix">
        <li><i>联系人：</i><span>{{del.name}}</span></li>
        <li><i>手机号码：</i><span>{{del.phone}}</span></li>
        <li><i>联系QQ：</i><span>{{del.qq}}</span></li>
        <li><i>联系邮箱：</i><span>{{del.email}}</span></li>
        <li><i>固定电话：</i><span>{{del.telePhone}}</span></li>
        <li><i>详细地址：</i><span>{{del.address}}</span></li>
        <li><i>所在大厦：</i><span>{{del.building}}</span></li>
      </ul>
    </div>
    <div class="del">
        <div class="del_title">
            <span>企业介绍</span>
<!--             <el-tag color="#409EFF" style='color:#fff' class="floatR" :v-text="vipGrade"></el-tag> -->
            <div style="float:right;width:90px;height:30px;background-color:#1e82d2;color:#fff;border-radius:5px;text-align:center;line-height:30px">{{vipGrade}}</div>
        </div>
      <ul class="delList clearfix">
        <li><i class="logo">LOGO：</i><img :src="del.logo" alt=""></li>
        <li><i>成立时间：</i><span>{{del.foundinTime}}</span></li>
        <li><i>注册资本：</i><span>{{del.capital}}</span></li>
        <li><i>所属行业：</i><span>{{del.industry}}</span></li>
         <!-- 写字楼性质 1:商务综合楼 2:纯写字楼 , -->
        <li><i>法人代表：</i><span>{{del.representative}}</span></li>  
        <li><i>员工人数：</i><span>{{del.peopleNum}}</span></li>
        <li><i>年营业额：</i><span>{{del.turnover}}</span></li>
        <li><i>企业官网：</i><span>{{del.website}}</span></li>
        <li><i>微信号：</i><span>{{del.weChat}}</span></li>
        <li class="lastLi"><i class="lastI">资质照片：</i><img class="quliphoto" v-for="(item,index) in del.accessoryList" :key="index" :src="item.path" alt=""></li>
      </ul>
    </div>
     <!-- <div class="bandBtn">
            <el-button type="primary" @click="band(1)">绑定</el-button>
      </div> -->
</div>

</template>
<script>
export default {
  data() {
    return {
      vipGrade:'',
      userInfo: "",
      organInfo: "",
      del: {},
      accessoryList: [],
      isFirst:false,
      sliders: null
    };
  },
  methods: {
    //请求详情页面
    getDel() {
      var data = {
        token: this.$getkey(),
        userId: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.bd}/opportunity/getShopCard`,
        data,
        res => {
          if (res.data) {
            this.accessoryList = res.data.accessoryList;
            this.$setImg(res.data.accessoryList,this);
            this.del = res.data;
          }
        },
        this
      );
    },
    getVip(){
      var that = this
      var data = {
        token: this.$getkey(),
        userId: this.$route.params.id
      };
      this.$ajax(
        `${this.subUrl.user}/user/queryUserVipTypeByGuid`,
        data,
        res => {
          console.log(res.data.vipType,'res.data')
          if(res.data.vipType ==1){
            this.vipGrade = "基础会员"
          }else if(res.data.vipType ==2) {
            this.vipGrade = "中级会员"
          }else if(res.data.vipType ==3) {
            this.vipGrade = "高级会员"
          }else if(res.data.vipType ==4) {
            this.vipGrade = "黄金会员"
          }
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
    this.getDel();
    this.getVip();
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
span {
  font-size: 14px;
}
.del_top {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #fff;
  padding: 0 20px;
}
.del_title {
  // font-size: 16px;
  // font-weight: 700;
  margin-top: 20px;
  padding: 10px 40px;
  height: 50px;
  line-height: 50px;
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
.delList {
  background: #fff;
  padding: 20px 50px;
  li {
    width: 50%;
    padding: 5px 0;
    float: left;
    &:first-of-type {
      width: 100%;
      img {
        width: 100px;
        vertical-align: middle;
      }
    }
  }
  span {
    padding-left: 20px;
  }
  i {
    width: 100px;
    display: inline-block;
  }
  .lastLi {
    width: 100%;
    margin-top: 20px;
    border-top: 1px dashed #ccc;
    .quliphoto {
      width: 300px;
      vertical-align: top;
    }
    .lastI {
      display: block;
      margin: 10px 0;
    }
  }
}

.bandBtn {
  // background: #fff;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 20px 0;
  button {
    width: 150px;
  }
}
</style>