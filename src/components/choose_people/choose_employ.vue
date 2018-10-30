<template>
<div id='' class="whiteChoosePeople">
  <div class="chooseTitle clearfix">
    <el-button class="btn" type="primary" style="width:80px" size="small" @click="submit">确定</el-button>
  </div>
 <!--  <div><el-checkbox :indeterminate="isAll" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox></div>
  <el-collapse v-model="activeNames" >
  <el-collapse-item v-for="(item,index) in organList" :key="index" :title="item.deptName" :name="index" >
    <el-checkbox-group v-model="checkList" class="collapse">
      <ul class="">
        <li v-for="(item2,index2) in item.empList" :key="index2">
            <el-checkbox class="chooseBox" :label="item2.userId+','+item2.userName" @change="checkSuccess">
              <span>{{item2.userName}}</span>
              <span>{{item2.post}}</span>
              <span>{{item2.account}}</span>
            </el-checkbox>
        </li>
      </ul>
    </el-checkbox-group>
  </el-collapse-item>
</el-collapse> -->

 <div style="margin-top: 50px;"><el-checkbox :indeterminate="isAll" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox></div>
  <el-collapse v-model="activeNames" >
  <el-collapse-item v-for="(item,index) in organList" :key="index" :title="item.deptName" :name="index" >

   <!--  这里是二级 -->

    <div><el-checkbox :indeterminate="item.indeterminate" v-model="item.selected" @change="handleCheckeditemAllChange(index,item.no,$event)">全选</el-checkbox></div>
    <el-checkbox-group v-model="checkList" class="collapse">
      <ul class="">
        <li v-for="(item2,index2) in item.empList" :key="index2">

    <!-- 这里是三级 -->      

            <el-checkbox class="chooseBox" :label="item2.userId+','+item2.userName"  v-model="item2.selected" @change="handleCheckedCountryChange(index,item2.no,index,$event)" :key="item2.no">
              <span>{{item2.userName}}</span>
              <span>{{item2.post}}</span>
              <span>{{item2.account}}</span>
            </el-checkbox>
        </li>
      </ul>
    </el-checkbox-group>
  </el-collapse-item>
</el-collapse>

</div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: "",
      organInfo: "",
      organList: "",
      isAll: true,
      checkAll: false,
      activeNames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      checkList: [],
      allList: [],
      ischeckAll:false,
      indeterminate:false

    };
  },
  methods: {
    //一级事件
    handleCheckAllChange(e) {
      this.ischeckAll = e;
      if(e == true){
        this.checkList = JSON.parse(JSON.stringify(this.allList))
        console.log(this.checkList,"checkListcheckListcheckList")
        for(var i=0,len=this.organList.length; i<len; i++){ //二级全选反选不确定
            this.organList[i].selected = e
            for(var j=0,len1=this.organList[i].empList.length; j<len1; j++){
              this.organList[i].empList[j].selected = e
            }
          }
      }else{
        this.checkList = []
        this.indeterminate = false
          for(var i=0,len=this.organList.length; i<len; i++){ //三级全选反选不确定
            this.organList[i].selected = e
            for(var j=0,len1=this.organList[i].empList.length; j<len1; j++){
              this.organList[i].empList[j].selected = e
            }
          }
        }
    },

    //二级事件
    handleCheckeditemAllChange(index, topId, e){
       this.organList[index].selected = e//二级勾选后，子级全部勾选或者取消
       if(e == false) this.organList[index].indeterminate = false //去掉二级不确定状态


        var CA = this.organList[index].empList
     
        for(var i=0,len=CA.length;i<len;i++){
          CA[i].selected = true
        }

        var childrenArray = this.organList[index].empList

        if(childrenArray){
          for(var i=0,len=childrenArray.length; i<len; i++)
            childrenArray[i].selected = e
        }
        var itemArr =[]
        var del = []
        if(e ==true){
          for(var i=0,len=CA.length;i<len;i++){
            itemArr.push(CA[i].userId+","+CA[i].userName)
        }
        this.checkList = this.checkList.concat(itemArr) 
      }else{
        for(var i =0;i<CA.length;i++){
            del.push(CA[i].userId+","+CA[i].userName)
          }
          console.log(del,"dededededede")
        for(var i=0;i<del.length;i++){
            for(var j=0;j<this.checkList.length;j++){
              if(this.checkList[j]==del[i]){
                this.checkList.splice(j, 1)
                console.log(this.checkList[j],"this.checkList[j]")
              }
            }
          }
        }
        console.log(this.checkList,"aaaa1111223")
        this.getIsCheckAll()
    },
    //三级change事件
    handleCheckedCountryChange(topIndex, sonId, topId, e){
       var childrenArray = this.organList[topIndex].empList
        var tickCount = 0, unTickCount = 0, len = childrenArray.length
        for(var i = 0; i < len; i++){
          if(sonId == childrenArray[i].no) childrenArray[i].selected = e
          if(childrenArray[i].selected == true) tickCount++
          if(childrenArray[i].selected != true) unTickCount++
        }
        if(tickCount == len) {//三级级全勾选
          this.organList[topIndex].selected = true
          this.organList[topIndex].indeterminate = false
        } else if(unTickCount == len) {//三级级全不勾选
          this.organList[topIndex].selected = false
          this.organList[topIndex].indeterminate = false
        } else {
          this.organList[topIndex].selected = false
          this.organList[topIndex].indeterminate = true //添加二级不确定状态
        }
 
        this.getIsCheckAll()
    },
    getIsCheckAll(){
      var tickCount = 0, unTickCount = 0, ArrLength = this.organList.length

        for(var j=0; j<ArrLength; j++){//全选checkbox状态
          if(this.organList[j].selected == true) tickCount++
          if(this.organList[j].selected == false) unTickCount++
        }
        if(tickCount == ArrLength) {//二级全勾选
          this.ischeckAll = true
          this.indeterminate = false
        } else if(unTickCount == ArrLength) {//二级全不勾选
          this.ischeckAll = false
          this.indeterminate = false
        } else {
          this.ischeckAll = false
          this.indeterminate = true //添加一级不确定状态
        }
         
         let a = []
       this.checkList = [...new Set(this.checkList)]
        console.log(this.checkList,"888888888888888888888888888888888888")
    },
    checkSuccess(val) {},
    // 提交
    submit() {

      this.$emit("checkMen", this.checkList);
    },
    // 获取机构部门人员
    getOrganMan() {
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/admin/deptManage/organDepartmentInfo`,
        data,
        res => {
          console.log(res, "OrganMan");
          for (var i of res.data) {
            for (var j of i.empList) {
              this.allList.push(`${j.userId},${j.userName}`);
            }
          }
          this.organList = res.data;
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
    this.getOrganMan();
  }
};
</script>
<style lang="scss" scoped>
#choose_people {
  margin: 0 !important;
}
.chooseTitle {
	  position: fixed;
    z-index: 1000;
    width: 100%;
    background: #fff;
    top: 75px;
    padding-top: 10px;
  .btn {
    float: left;
  }
}
.chooseBox {
  span {
    display: inline-block;
    padding: 10px;
  }
}
</style>