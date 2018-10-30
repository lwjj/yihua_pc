<template>
  <div>
      <div class="select-div">
      <div style="margin-left:20px;margin-bottom:10px;cursor:pointer;" @click="confirm(0)">&lt;&lt;</div>
      <div class="first1">
        <span>状态</span>
        <el-select v-model="value2" placeholder="请选择" @change="handleChange1()">
          <el-option
          v-for="item in titleList"
          :key="item.guid"
          :label="item.name"
          :value="item.guid">
          </el-option>
        </el-select>
      </div>
      <div class="first2">
        <el-input v-model="input" placeholder="请输入搜索关键字"></el-input>
        <el-button plain @click.native="getList">查询</el-button>
      </div>
      <div class="clear"></div>
      <div class="first2_1">
        <span>供应商</span>
        <el-select v-model="value1" placeholder="请选择" @change="handleChange()">
          <el-option
          v-for="item in options1"
          :key="item.guid"
          :label="item.name"
          :value="item.guid">
          </el-option>
        </el-select>
      </div>
      <div class="clear"></div>
    </div>
    <el-col class="content">
      <el-col v-if="tipList.length>0" v-for="item,index in tipList" :key="index" class="tip-detail"
              style="" :span="24">
        <el-col>
          <!--&lt;!&ndash;<el-col :span="3">&ndash;&gt;-->
          <!--&lt;!&ndash;<img style="width: 90px;height: 100px" src="../../../../assets/images/circle/left-pic.jpg" alt="">&ndash;&gt;-->
          <!--&lt;!&ndash;</el-col>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-col :span="1">&ndash;&gt;-->
          <!--&nbsp;-->
          <!--</el-col>-->
          <el-col :span="8" @click.native="toGqDetail(index)"
                  style="cursor:pointer;line-height: 25px;border-right: 1px solid #f1f1f1">
            <el-col style="font-weight: 600">{{item.organName}}</el-col>
            <el-col>{{item.years}}年</el-col>
            <el-col>{{item.organAddress}}</el-col>
          </el-col>
          <el-col :span=3>
            &nbsp;
          </el-col>
          <el-col :span=6>
            <el-col>&nbsp;</el-col>
            <el-col style="cursor: pointer">
              <img @click="collectIt(index)" v-if="item.select" style="width: 20px;height: 20px"
                   src="../../../../assets/images/circle/select_active.png" alt="">
              <img @click="collectIt(index)" v-if="!item.select" style="width: 20px;height: 20px"
                   src="../../../../assets/images/circle/select.png" alt="">
            </el-col>
            <el-col></el-col>
            <el-col></el-col>
          </el-col>
        </el-col>
      </el-col>
      <el-col v-if="tipList.length<=0" style="text-align: center;padding-bottom:20px;">~没有数据了~</el-col>
      <el-col v-if="tipList.length>0">
        <el-col :span="6" style="cursor: pointer">全选
          <img @click="selectAll(1)" v-if="allSelect" style="width: 20px;height: 20px;margin-bottom: -4px"
               src="../../../../assets/images/circle/select_active.png" alt="">
          <img @click="selectAll(2)" v-if="!allSelect" style="width: 20px;height: 20px;margin-bottom: -4px"
               src="../../../../assets/images/circle/select.png" alt="">
        </el-col>
        <el-col :span="6">
          <el-button v-if="value2*1==0" @click="confirm(1)">推送</el-button>
        </el-col>
      </el-col>
      <el-col v-if="tipList.length>0">
        <el-pagination
          v-if="bm.rowCount"
          background
          style="float:right;"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="5"
          :total="bm.rowCount*1">
        </el-pagination>
        <!--<el-col class="flexRow flexAlignC flexJustE" :span="16">-->
        <!--<el-pagination background :page-size="bm.pageSize" @current-change="handleCurrentChange"-->
        <!--layout="prev, pager, next" :total="bm.rowCount"></el-pagination>-->
        <!---->
        <!--</el-col>-->
      </el-col>
    </el-col>
  </div>
</template>
<script>
  import Vue from "vue";
  import pushInformation from "./push_information.vue"
  import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
  Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
  };
  export default {
    data() {
      let TypeListCircle;
      var userInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("userInfo"))
      );
      var userType = userInfo.organType;
      if (userType == 1) {
        TypeListCircle = 1;
      } else if (userType == 5) {
        TypeListCircle = 2;
      } else {
        TypeListCircle = 3;
      }
      var circleType = TypeListCircle;
      return {
        allSelect: false,
        bannerList: [],
        input: '',
        guid: 1,
        titleList: [
          {
            guid: 0,
            name: '正常'
          },
          {
            guid: 1,
            name: '黑名单'
          }
        ],
        dateValue: [],
        selectedOptions2: [],
        selectedOptions1: '',
        userInfo,
        state1:0,
        state: 0,
        value1: '',
        value2: '',
        value3: '',
        value4: '',
        value5: '',
        value6: '',
        value7: '',
        value8: '',
        showDis1: false,
        showDis2: false,
        showDis3: false,
        showDis4: false,
        showDis5: false,
        bm: {
          pageNo: 1,
          pageSize: 5,
          rowCount: 0,
          startDate: '',
          endDate: ''
        },
        data: {},
        options1: [
          {
            guid: 0,
            name: '全部供应商'
          },
          {
            guid: 4,
            name: '金牌供应商'
          },
          {
            guid: 3,
            name: '高级供应商'
          },
          {
            guid: 2,
            name: '中级供应商'
          },
          {
            guid: 1,
            name: '基础供应商'
          }
        ],
        parameter:{
          token:'',
          userId:null,
          type:null,
          pageNo:1,
          pageSize:12,
          pageCount:0,
          kaIds:'',
          businessName:null,
          guidList:'',
          type1:''
        },
        circleType,
        tipList: [],
        tipTopList: [],
        district: {},
        tipType: [],
        scope: 0,
      };
    },
    methods: {
      confirm(n){
        if(n==1){
          var list = []
          for (var i = 0; i < this.tipList.length; i++) {
            if (this.tipList[i].select) {
              list.push(this.tipList[i].organId)
            }
          }
          var guid='';
          var guidList=JSON.stringify(list).split('["')[1].split('"]')[0].split('"');
          for(var i=0;i<guidList.length;i++){
            guid=guid+guidList[i]
          }
          this.parameter.guidList=guid
          if(this.parameter.guidList==''){
            this.$dialog.toast({mes: '请选择操作对象！'});
            return
          }
          this.$emit('bmData',this.parameter.guidList)
        }else{
          this.$emit('bmData',this.parameter.guidList)
        }
      },
      delItem(index) {
        var list = []
        for (var i = 0; i < this.tipList.length; i++) {
          if (this.tipList[i].select) {
            list.push(this.tipList[i].guid)
          }
        }
        var guid='';
        var guidList=JSON.stringify(list).split('["')[1].split('"]')[0].split('"');
        for(var i=0;i<guidList.length;i++){
          guid=guid+guidList[i]
        }
        var data = {
          token:this.$getkey(),
          guidList: guid,
        }
        data.type=index;
        console.log(index)
        this.$ajax(
          `${this.subUrl.bd}/purchase/delOrblackSupplier`,
          data,
          res => {
            this.$message.success('操作成功');
            this.getList();
          },
          this
        );
      },
      selectAll(index) {
        if (index == 2) {
          this.allSelect = true;
          for (var i = 0; i < this.tipList.length; i++) {
            this.tipList[i].select = true
          }
          var list = this.tipList;
          this.tipList = [];
          this.tipList = list
        } else {
          this.allSelect = false;
          for (var i = 0; i < this.tipList.length; i++) {
            this.tipList[i].select = false
          }
          var list = this.tipList;
          this.tipList = [];
          this.tipList = list
        }
      },
      dateChange() {
        console.log(this.dateValue)
        if (this.dateValue != null) {
          this.bm.startDate = this.dateValue[0].format("yyyy-MM-dd") + ' 00:00:00';
          this.bm.endDate = this.dateValue[1].format("yyyy-MM-dd") + ' 23:59:59';
        } else {
          this.bm.startDate = '';
          this.bm.endDate = '';
        }
        this.getList();
      },
      collectIt(index) {
        this.tipList[index].select = !this.tipList[index].select;
        this.allSelect = true
        if (this.tipList[index].select) {
          for (var i = 0; i < this.tipList.length; i++) {
            if (!this.tipList[i].select) {
              this.allSelect = false;
              return
            }
          }
        } else {
          this.allSelect = false;
        }
        var list = this.tipList;
        this.tipList = [];
        this.tipList = list
      },
      selectItem(guid) {
        this.guid = guid;
      },
      toDetail(id, guid) {
        this.$router.push('/user/we_business/supply/tipDetail?userId=' + id + '&bbsId=' + guid)
      },
      toUserDetail(id) {
        this.$router.push('/user/we_business/supply/userInfo?guid=' + id)
      },
      toGqDetail(index) {
        this.$router.push('/user/we_business/supply/supplier_details');
        this.tipList[index].titleText = "供应商详情"
        localStorage.setItem('libraryList', encodeURIComponent(JSON.stringify(this.tipList[index])));
      },
      handleChange() {
        this.state = this.value2;
        this.getList()
      },
      handleChange1() {
        this.state1 = this.value1;
        this.getList()
      },
      getbbsType() {
        this.tipType = [];
        var data = {
          token: this.$getkey(),
          circleType: this.circleType
        };
        var url = this.guid == 1 ? this.subUrl.sc + '/bbs/getBBsType' : this.subUrl.user + '/comm/getIndustryCategory'
        this.$ajax(
          url,
          data,
          res => {
            if (this.guid == 1) {
              this.tipType = res.data
            } else {
              this.tipType = [...res.data.icc, ...res.data.pm];
              console.log()
              this.tipType = JSON.parse(JSON.stringify(this.tipType).replace(/name/g, 'label').replace(/subclass/g, 'children').replace(/value/g, 'value1').replace(/guid/g, 'value'));
              console.log(this.tipType)
              for (var i = 0; i < this.tipType.length; i++) {
                for (var j = 0; j < this.tipType[i].children.length; j++) {
                  this.tipType[i].children[j] = JSON.parse(JSON.stringify(this.tipType[i].children[j]).replace(/children/g, 'child'));
                }

              }
              console.log(this.tipType)
            }
          },
          this
        );
      },
      handleCurrentChange(val) {
        this.bm.pageNo = val;
        this.getList()
      },
      getList() {
        var data = {
          token: this.$getkey(),
          pageNo: this.bm.pageNo,
          pageSize: this.bm.pageSize,
          type: this.state*1==0?'':this.state,
          state:this.value2,
          businessName: this.input
        };
        var url = this.subUrl.bd + '/purchase/mySupplierList'
        this.$ajax(
          url,
          data,
          res => {
            this.tipList = [];
            this.bm.rowCount = res.data.rowCount;
            this.tipList = res.data.list;
            for (var i = 0; i < this.tipList.length; i++) {
              this.tipList[i].select = false
            }
          },
          this
        );
      },
    },
    mounted() {
      // 任务统计
      this.selectItem(1);
      this.getbbsType();
      this.getList();
      this.organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      // this.circleType
    }
  };
</script>
<style lang="scss" scoped>
.clear{
  clear:both
}
  .tip-detail {
    line-height: 40px;
    border: 2px dashed #ededed;
    padding: 10px;
    margin-bottom: 10px
  }

  #new_progress {
    padding-left: 300px;
    padding-right: 40px;
     height: auto;
  }

  .content {
    padding: 20px 30px;
    margin: 20px 0;
    background: #fff;
    margin-top:0;
    padding:0;
  }

  .select-btn {
    margin-left: 10px;
    margin-bottom: 10px;
    padding-top:10px;
    cursor: pointer;
    text-align: center
  }

  .sure-btn {
    line-height: 40px;
    border: 1px solid #e6e6e6
  }

  .sure-btn:hover {
    background: #5881ff !important;
    color: #fff;
  }
    .select-div{
    background:#fff;
    padding-top:10px;
    .first1{
      float:left;
      margin-left:20px;
      margin-bottom:10px;
      span{
        margin-right:27px;
      }
    }
    .first2{
      float:left;
      margin-left:20px;
      margin-bottom:10px;
      span{
        margin-right:10px;
      }
      .el-input{
        width:250px;
      }
    }
    .first2_1{
      float:left;
      margin-left:20px;
      margin-bottom:10px;
      span{
        margin-right:10px;
      }
      .el-input{
        width:250px;
      }
    }
    .first3{
      float:left;
      margin-left:100px;
      margin-top:10px;
    }
    .first4{
      float:left;
      margin-left:10px;
      margin-top:10px;
    }
  }
</style>
