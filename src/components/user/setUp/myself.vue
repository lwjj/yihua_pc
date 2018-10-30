<template>
    <div class="box">
        <div class="main" style="float:left;">
            <div class="main_left">
                <div class="first1">
                    <div class="first1_div_img" @click="addImg(1)">
                        <img v-if="data.user" :src="data.user.headPortrait" alt="" @click=" getHobby(0)">
                    </div>
                    <div style="margin:10px 0">
                        <span>资料完成度</span>
                        <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage"></el-progress>
                    </div>
                </div>   
                <div class="first2">
                    <span>基本资料&nbsp;&nbsp;</span>
                    <el-radio-group v-model="radio1">
                        <el-radio :label="1">公开</el-radio>
                        <el-radio :label="0">不公开</el-radio>
                    </el-radio-group>
                    <div>
                        <div class="first2_left">
                                <p>昵称</p>
                                <p>ID</p>
                                <p>姓名</p>
                                <p>手机</p>
                                <p>写字楼</p>
                                <p>所属企业</p>
                                <p>部门</p>
                                <p>岗位</p>
                        </div>
                        <div class="first2_right" v-if="data.user">
                                <p>{{data.user.nickname}}</p>
                                <p>{{data.user.guid}}</p>
                                <p>{{data.user.name}}</p>
                                <p>{{data.user.account}}</p>
                                <p>{{data.user.buildingName}}</p>
                                <p>{{data.user.organName}}</p>
                                <p>{{data.user.deptName}}</p>
                                <p>{{data.user.postName}}</p>
                        </div>
                        <div class="clear"></div>
                    </div>
                </div>
                <div class="first3">
                    <span>个人资料&nbsp;&nbsp;</span>
                    <el-radio-group v-model="radio2">
                        <el-radio :label="1">公开</el-radio>
                        <el-radio :label="0">不公开</el-radio>
                    </el-radio-group>
                    <div>
                        <div class="first3_left">
                            <p>兴趣爱好</p> 
                            <p>自我介绍</p>
                        </div>
                        <div class="first3_right">
                            <p>{{data.userInfo.interestName}} <span style="font-size: 5px"><el-button style="padding:3px;margin-left:10px;" type="success" @click="getHobby(1),dialogFormVisible = true">点击修改</el-button></span></p>
                            <p>{{data.userInfo.introduceMyself}} <span><el-button style="padding:3px;margin-left:10px;" type="success" @click="getHobby(2),dialogFormVisible = true">点击修改</el-button></span></p>
                        </div>
                        <div class="clear"></div>
                    </div>
                </div>
            </div>
            <div class="main_right">
                <div class="first4">
                    <span>圈子资料&nbsp;&nbsp;</span>
                    <el-radio-group v-model="radio3">
                        <el-radio :label="1">公开</el-radio>
                        <el-radio :label="0">不公开</el-radio>
                    </el-radio-group>
                    <div>
                        <div class="first4_left">
                            <p>性别</p>
                            <p>出生年月</p>
                            <p>出生地</p>
                            <p>工作地</p>
                            <p>价值中心</p>
                            <p>星座</p>
                        </div>
                        <div class="first4_right">
                            <p>{{sex}}<span><el-button @click="getHobby(3),dialogFormVisible = true" style="padding:3px;margin-left:10px;" type="success">点击修改</el-button></span></p>
                            <p>{{data.userInfo.birthday}}<span><el-button style="padding:3px;margin-left:10px;"  @click="getHobby(4),dialogFormVisible = true" type="success">点击修改</el-button></span></p>
                            <p>{{data.userInfo.birthplace}}<span><el-button @click="getHobby(5),dialogFormVisible = true" style="padding:3px;margin-left:10px;" type="success">点击修改</el-button></span></p>
                            <p>{{data.userInfo.workplace}} <span><el-button style="padding:3px;margin-left:10px;" type="success" @click="getHobby(6),dialogFormVisible = true">点击修改</el-button></span></p>
                            <p>{{data.userInfo.valueCenterName}} <span><el-button style="padding:3px;margin-left:10px;" type="success" @click="getHobby(7),dialogFormVisible = true">点击修改</el-button></span></p>
                            <p>{{data.userInfo.constellatio}} <span><el-button style="padding:3px;margin-left:10px;" type="success" @click="getHobby(8),dialogFormVisible = true">点击修改</el-button></span></p>
                        </div>
                        <div class="clear"></div>
                    </div>
                </div>
                <div class="first5">
                    <span>联系方式&nbsp;&nbsp;</span>
                    <el-radio-group v-model="radio4">
                        <el-radio :label="1">公开</el-radio>
                        <el-radio :label="0">不公开</el-radio>
                    </el-radio-group>
                    <div>
                        <div class="first5_left">
                            <p>微信</p>
                            <p>QQ</p>
                            <p>物流地址</p>
                        </div>
                        <div class="first5_right">
                            <p>{{data.userInfo.wechat}} <span><el-button @click="getHobby(9),dialogFormVisible = true" style="padding:3px;margin-left:10px;" type="success">点击修改</el-button></span></p>
                            <p>{{data.userInfo.qq}} <span><el-button @click="getHobby(10),dialogFormVisible = true" style="padding:3px;margin-left:10px;" type="success">点击修改</el-button></span></p>
                            <p>{{data.userInfo.logisticsAddress}} <span><el-button style="padding:3px;margin-left:10px;" @click="getHobby(11),dialogFormVisible = true" type="success">点击修改</el-button></span></p>
                        </div>  
                        <div class="clear"></div>
                    </div>
                </div>
                <div class="first6">
                    <el-button @click="change">保存</el-button>
                </div>
            </div>


            <el-dialog :visible.sync="dialogFormVisible" style="text-align: center">
                  <div v-if="mainOpen==0">
                    <input class="file" name="file" type="file" accept="image/*" @change="update"/>
                  </div>
                  <div v-if="mainOpen==1" style="padding:20px 0">
                     <el-checkbox-group v-model="checkboxGroup6" >
                        <el-checkbox v-for="(item,index) in getHobby1" :key="index"  :label="item.dictDataName" border></el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div v-if="mainOpen==2" >
                    <el-input v-model="introduceMyself1" :maxlength="38" placeholder="请输入内容" style="width:700px;margin-bottom:20px"></el-input>
                </div>
                <div v-if="mainOpen==3">
                    <el-radio v-model="radio5" label="0" style="margin-bottom:20px">女</el-radio>
                    <el-radio v-model="radio5" label="1" style="margin-bottom:20px">男</el-radio>
                </div>
                <div v-if="mainOpen==4">
                     <el-date-picker v-model="datValue1" type="month" placeholder="选择日期" style="margin-bottom:20px"></el-date-picker>
                </div>
                <div v-if="mainOpen==5">
                     <el-cascader @change="picker" :options="citys" v-model="selectedOptions3" style="margin-bottom:20px"></el-cascader>
                </div> 
                <div v-if="mainOpen==6" >
                    <el-input v-model="workplace1" :maxlength="18" placeholder="请输入内容" style="width:700px;margin-bottom:20px"></el-input>
                </div>
                <div v-if="mainOpen==7" >
                     <el-checkbox-group v-model="checkboxGroup7">
                        <el-checkbox v-for="(item,index) in getValue1" :key="index"  :label="item.dictDataName" border  style="margin:10px"></el-checkbox>
                    </el-checkbox-group>
                </div>
                <div v-if="mainOpen==8" >
                     <el-button v-for="(item,index) in constellatios" :key="index" @click="selectConstellatio(item.name)" style="margin:10px">{{item.name}}</el-button>  
                </div>
                <div v-if="mainOpen==9">
                    <el-input v-model="wechat" :maxlength="18" placeholder="请输入内容" style="width:700px;margin-bottom:20px"></el-input>
                </div>
                <div v-if="mainOpen==10">
                    <el-input v-model="qq" :maxlength="18" placeholder="请输入内容" style="width:700px;margin-bottom:20px"></el-input>
                </div>
                <div v-if="mainOpen==11">
                    <el-input v-model="logisticsAddress" :maxlength="63" placeholder="请输入内容" style="width:700px;margin-bottom:20px"></el-input>
                </div>
                <div>
                    <el-button type="danger" @click="changeClose()">取消</el-button>
                    <el-button type="success" @click="changeClose(1)">确定</el-button>
                </div>
            </el-dialog>
            <!-- <div class="center" v-if="open==1" style="height:250px;box-shadow: 5px 5px 5px gray;border-radius:20px;border:1px solid gray">
                <div v-if="mainOpen==0">
                    <input class="file" name="file" type="file" accept="image/*" @change="update"/>
                </div>
                <div v-if="mainOpen==1" style="padding:20px 0">
                     <el-checkbox-group v-model="checkboxGroup6" >
                        <el-checkbox v-for="(item,index) in getHobby1" :key="index"  :label="item.dictDataName" border></el-checkbox>
                    </el-checkbox-group>
                </div>
                <div v-if="mainOpen==2" >
                    <el-input v-model="introduceMyself1" :maxlength="38" placeholder="请输入内容"></el-input>
                </div>
                <div v-if="mainOpen==3">
                    <el-radio v-model="radio5" label="0">女</el-radio>
                    <el-radio v-model="radio5" label="1">男</el-radio>
                </div>
                <div v-if="mainOpen==4">
                     <el-date-picker v-model="datValue1" type="month" placeholder="选择日期" ></el-date-picker>
                </div>
                <div v-if="mainOpen==5">
                     <el-cascader @change="picker" :options="citys" v-model="selectedOptions3"></el-cascader>
                </div> 
                <div v-if="mainOpen==6" >
                    <el-input v-model="workplace1" :maxlength="18" placeholder="请输入内容"></el-input>
                </div>
                <div v-if="mainOpen==7" >
                     <el-checkbox-group v-model="checkboxGroup7">
                        <el-checkbox v-for="(item,index) in getValue1" :key="index"  :label="item.dictDataName" border></el-checkbox>
                    </el-checkbox-group>
                </div>
                <div v-if="mainOpen==8" >
                     <el-button v-for="(item,index) in constellatios" :key="index" @click="selectConstellatio(item.name)">{{item.name}}</el-button>  
                </div>
                <div v-if="mainOpen==9">
                    <el-input v-model="wechat" :maxlength="18" placeholder="请输入内容"></el-input>
                </div>
                <div v-if="mainOpen==10">
                    <el-input v-model="qq" :maxlength="18" placeholder="请输入内容"></el-input>
                </div>
                <div v-if="mainOpen==11">
                    <el-input v-model="logisticsAddress" :maxlength="63" placeholder="请输入内容"></el-input>
                </div>
                <div>
                    <el-button type="danger" @click="changeClose()">取消</el-button>
                    <el-button type="success" @click="changeClose(1)">确定</el-button>
                </div>
            </div> -->
            <div class="clear"></div>
        </div>
    </div>
</template>
<script>
import city from "./city-data";
import fn from "@/assets/js/common";
import Vue from "vue";
import qs from "qs";
export default {
  data() {
    return {
      dialogFormVisible : false,
      userInfo: {},
      organInfo: {},
      open: 0,
      mainOpen: 0,
      data: {
        userInfo: {},
        user: {}
      },
      percentage: 0,
      radio1: "",
      radio2: "",
      radio3: "",
      radio4: "",
      //头像
      getHearLog: {
        domain: "",
        token: "",
        name: "",
        pid: null
      },
      token: "",
      images: [],
      postImg: "",
      //性别
      sex: "",
      //兴趣爱好
      getHobby1: [],
      newHobby1: [],
      newHobby2: "",
      checkboxGroup6: [],
      //自我介绍
      introduceMyself1: "",
      //出生年月
      datValue1: "",
      //性别
      radio5: "",
      //出生地
      citys: [],
      newCitys: [],
      postCitys: "",
      selectedOptions3: [],
      //工作地
      workplace1: "",
      //价值中心
      getValue1: [],
      newValue1: [],
      newValue2: "",
      checkboxGroup7: [],
      //星座
      constellatio1: "",
      constellatios: [
        {
          name: "白羊座",
          time: "3.12-4.19"
        },
        {
          name: "金牛座",
          time: "4.20-5.20"
        },
        {
          name: "双子座",
          time: "5.21-6.21"
        },
        {
          name: "巨蟹座",
          time: "6.22-7.22"
        },
        {
          name: "狮子座",
          time: "7.23-8.22"
        },
        {
          name: "处女座",
          time: "8.23-9.22"
        },
        {
          name: "天秤座",
          time: "9.23-10.23"
        },
        {
          name: "天蝎座",
          time: "10.24-11.22"
        },
        {
          name: "射手座",
          time: "11.23-12.21"
        },
        {
          name: "魔蝎座",
          time: "12.22-1.19"
        },
        {
          name: "水瓶座",
          time: "1.20-2.28"
        },
        {
          name: "双鱼座",
          time: "2.29-3.20"
        }
      ],
      //微信
      wechat: "",
      //QQ
      qq: "",
      //物流地址
      logisticsAddress: ""
    };
  },
  methods: {
    getDetails() {
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
      this.$ajax(
        `${this.subUrl.user}/user/accountInfo`,
        data,
        res => {
          this.data = res.data;
          this.percentage = parseInt(this.data.userInfo.dataPerfection * 100);
          this.radio1 = this.data.userInfo.enabledBasicsInfo * 1;
          this.radio2 = this.data.userInfo.enabledIndInfo * 1;
          this.radio3 = this.data.userInfo.enabledCircleInfo * 1;
          this.radio4 = this.data.userInfo.enabledContact * 1;
          this.sex = this.data.userInfo.sex == 0 ? "女" : "男";
          this.radio5 = this.data.userInfo.sex;
          this.wechat = this.data.userInfo.wechat;
          this.qq = this.data.userInfo.qq;
          this.logisticsAddress = this.data.userInfo.logisticsAddress;
          this.introduceMyself1 = this.data.userInfo.introduceMyself;
          this.workplace1 = this.data.userInfo.workplace;
          var a = res.data.user.headPortrait.lastIndexOf("/");
          this.postImg = res.data.user.headPortrait.slice(a + 1);
        },
        this
      );
      var data = {};
      this.$ajax(
        `${this.subUrl.user}/comm/getHobby`,
        data,
        res => {
          this.getHobby1 = res.data;
          //console.log(this.getHobby1)
        },
        this
      );
      var data = {};
      this.$ajax(
        `${this.subUrl.user}/comm/getValueCenter`,
        data,
        res => {
          this.getValue1 = res.data;
        },
        this
      );
    },
    change() {
      if (this.checkboxGroup6.length !== 0) {
        this.data.userInfo.interestName = this.checkboxGroup6.join(",");
        this.newHobby1 = [];
        this.newHobby2 = "";
        for (var i = 0; i < this.checkboxGroup6.length; i++) {
          for (var a = 0; a < this.getHobby1.length; a++) {
            if (this.checkboxGroup6[i] == this.getHobby1[a].dictDataName) {
              this.newHobby1.push(this.getHobby1[a].guid);
            }
          }
        }
        this.newHobby2 = this.newHobby1.join(",");
      } else {
        var arr = this.data.userInfo.interestName.split(",");
        for (var c = 0; c < arr.length; c++) {
          for (var d = 0; d < this.getHobby1.length; d++) {
            if (arr[c] == this.getHobby1[d].dictDataName) {
              this.newHobby1.push(this.getHobby1[d].guid);
            }
          }
        }
        // console.log(this.newHobby1)
        this.newHobby2 = this.newHobby1.join(",");
      }
      if (this.checkboxGroup7.length !== 0) {
        this.data.userInfo.valueCenterName = this.checkboxGroup7.join(",");
        this.newValue1 = [];
        this.newValue2 = "";
        for (var i = 0; i < this.checkboxGroup7.length; i++) {
          for (var a = 0; a < this.getValue1.length; a++) {
            if (this.checkboxGroup7[i] == this.getValue1[a].dictDataName) {
              this.newValue1.push(this.getValue1[a].guid);
            }
          }
        }
        this.newValue2 = this.newValue1.join(",");
      } else {
        var arr = this.data.userInfo.valueCenterName.split(",");
        //console.log(arr)
        for (var c = 0; c < arr.length; c++) {
          for (var d = 0; d < this.getValue1.length; d++) {
            if (arr[c] == this.getValue1[d].dictDataName) {
              this.newValue1.push(this.getValue1[d].guid);
            }
          }
        }
        //console.log(this.newValue1)
        this.newValue2 = this.newValue1.join(",");
      }
      var data = {
        token: this.$getkey(),
        userId: this.userInfo.guid,
        wechat: this.wechat,
        QQ: this.qq,
        logisticsAddress: this.logisticsAddress,
        introduceMyself: this.introduceMyself1,
        workplace: this.workplace1
      };
      if (this.radio1 || this.radio1 == 0) {
        data.enabledBasicsInfo = this.radio1;
      }
      if (this.radio2 || this.radio2 == 0) {
        data.enabledIndInfo = this.radio2;
      }
      if (this.radio3 || this.radio3 === 0) {
        data.enabledCircleInfo = this.radio3;
      }
      if (this.radio4 || this.radio4 === 0) {
        data.enabledContact = this.radio4;
      }
      if (this.radio5 || this.radio5 === 0) {
        data.sex = this.radio5;
      }
      if (this.newHobby2) {
        data.interest = this.newHobby2;
      }
      if (this.newValue2) {
        data.valueCenter = this.newValue2;
      }
      if (this.datValue1) {
        data.birthday = this.datValue1;
      }
      if (this.selectedOptions3.length > 0) {
        data.birthplace = this.postCitys;
      }
      if (this.constellatio1) {
        data.constellatio = this.constellatio1;
      }
      if (this.postImg) {
        data.headPortrait = this.postImg;
      }
      this.$ajax(
        `${this.subUrl.user}/user/saveUserInfo`,
        data,
        res => {
          if (res.code == 1) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.getDetails();
          }
        },
        this
      );
    },
    getHobby(n) {
      this.open = 1;
      this.mainOpen = n;
    },
    repair(n) {},
    changeClose(n) {
      this.open = 0;
      this.dialogFormVisible=false;
      if (n == 1) {
        if (this.checkboxGroup6.length !== 0) {
          this.data.userInfo.interestName = this.checkboxGroup6.join(",");
        }
        if (this.checkboxGroup7.length !== 0) {
          this.data.userInfo.valueCenterName = this.checkboxGroup7.join(",");
        }
        this.data.userInfo.introduceMyself = this.introduceMyself1;
        this.data.userInfo.workplace = this.workplace1;
        this.sex = this.radio5 == 0 ? "女" : "男";
        this.data.userInfo.wechat = this.wechat;
        this.data.userInfo.qq = this.qq;
        this.data.userInfo.logisticsAddress = this.logisticsAddress;
        if (this.constellatio1 !== "") {
          this.constellatio1 = this.data.userInfo.constellatio;
        }
        if (this.getHearLog.domain !== "") {
          this.data.user.headPortrait =
            this.getHearLog.domain + "/" + this.postImg;
        }
        if (this.postCitys !== "") {
          this.data.userInfo.birthplace = this.postCitys;
        }
        if (this.datValue1 !== "") {
          var a = this.datValue1.getFullYear();

          // console.log(a)
          var b = this.datValue1.getMonth() + 1;
          this.data.userInfo.birthday = a + "年," + b + "月";
          this.datValue1 = this.data.userInfo.birthday;
        } else {
          this.datValue1 = this.data.userInfo.birthday;
        }
      }
    },
    selectConstellatio(name) {
      this.constellatio1 = name;
      this.data.userInfo.constellatio = name;
    },
    picker(val) {
      if (val.length == 3) {
        this.newCitys = [];
        for (var i = 0; i < this.citys.length; i++) {
          if (this.citys[i].value == this.selectedOptions3[0]) {
            this.newCitys.push(this.citys[i].label);
            for (var b = 0; b < this.citys[i].children.length; b++) {
              if (this.citys[i].children[b].value == this.selectedOptions3[1]) {
                this.newCitys.push(this.citys[i].children[b].label);
                for (
                  var c = 0;
                  c < this.citys[i].children[b].children.length;
                  c++
                ) {
                  if (
                    this.citys[i].children[b].children[c].value ==
                    this.selectedOptions3[2]
                  ) {
                    this.newCitys.push(
                      this.citys[i].children[b].children[c].label
                    );
                    this.postCitys = this.newCitys.join(" ");
                  }
                }
              }
            }
          }
        }
      } else if (val.length == 2) {
        this.newCitys = [];
        for (var i = 0; i < this.citys.length; i++) {
          if (this.citys[i].value == this.selectedOptions3[0]) {
            this.newCitys.push(this.citys[i].label);
            for (var b = 0; b < this.citys[i].children.length; b++) {
              if (this.citys[i].children[b].value == this.selectedOptions3[1]) {
                this.newCitys.push(this.citys[i].children[b].label);
                this.postCitys = this.newCitys.join(" ");
              }
            }
          }
        }
      }
    },
    update(e) {
      let file = e.target.files[0]; //详细信息
      let d = new Date();
      let type = file.name.split("."); //点切割
      //console.log(type)

      let tokenParem = {
        putPolicy:
          '{"name":"$(fname)","size":"$(fsize)","w":"$(imageInfo.width)","h":"$(imageInfo.height)","hash":"$(etag)"}',
        key:
          "orderReview/" +
          d.getFullYear() +
          "/" +
          (d.getMonth() + 1) +
          "/" +
          d.getDate() +
          "/" +
          d.valueOf() +
          "." +
          type[type.length - 1],
        bucket: this.getHearLog.domain //七牛的地址，这个是你自己配置的（变量）
      };
      let param = new FormData(); //创建form对象
      param.append("chunk", "0"); //断点传输
      param.append("chunks", "1");
      param.append("file", file, file.name);
      //console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      //先从自己的服务端拿到token
      this.token = this.getHearLog.token;
      param.append("token", this.token);
      this.uploading(param, config, file.name); //然后将参数上传七牛
      return;
    },
    uploading(param, config, pathName) {
      this.xhr.post("http://up-z2.qiniu.com", param, config).then(response => {
        console.log(response.data.key);
        this.postImg = response.data.key;

        let localArr = this.images.map((val, index, arr) => {
          return arr[index].localSrc;
        });
        if (!~localArr.indexOf(pathName)) {
          this.images.push({
            src: this.showUrl + response.data.key,
            localSrc: pathName
          });
        } else {
          this.$message({
            message: "已上传过该图片！",
            type: "error"
          });
        }
      });
    },
    getQiniuInfo(pid) {
      this.xhr
        .post(`${this.subUrl.user}/qiniu/getInfo?token=` + this.getkey)
        .then(res => {
          if (res.data.code == 1) {
            this.getHearLog = res.data.data;
            this.getHearLog.pid = pid;
          }
        });
    },
    addImg(pid) {
      this.getQiniuInfo(pid);
    }
  },
  updated() {},
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getDetails();
    this.citys = city.CityInfo;
    this.getkey = fn.getIng();
    //console.log(this.citys)
  }
};
</script>
<style lang="scss" scoped>
.clear {
  clear: both;
}
.box {
  height: 100%;
  margin-top: 10px;
  margin-left: 1%;
  background: #ddd;
  .main {
    margin-left: 1%;
    position: relative;
    min-height: 732px;
    .main_left {
      .first1 {
        width: 700px;
        margin: 0 auto;
        text-align: center;
        .first1_div_img {
          width: 128px;
          height: 128px;
          margin-left: 286px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            cursor: pointer;
          }
        }
        div {
          .el-progress {
            margin-left: 35%;
            width: 30%;
            margin-top: 10px;
          }
        }
      }
      .first2 {
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
        width: 700px;
        margin: 0 auto;
        div {
          .first2_left {
            width: 48%;
            float: left;
            margin-left: 4%;
            p {
              padding-top: 10px;
            }
          }
          .first2_right {
            float: right;
            width: 48%;
            p {
              padding-top: 10px;
            }
          }
        }
      }
      .first3 {
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
        padding-top: 10px;
        width: 700px;
        margin: 0 auto;
        div {
          .first3_left {
            width: 48%;
            float: left;
            margin-left: 4%;
            p {
              padding-top: 10px;
            }
          }
          .first3_right {
            float: right;
            width: 48%;
            p {
              padding-top: 10px;
            }
          }
        }
      }
    }
    .main_right {
      .first4 {
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
        padding-top: 10px;
        width: 700px;
        margin: 0 auto;
        div {
          .first4_left {
            width: 48%;
            float: left;
            margin-left: 4%;
            p {
              padding-top: 10px;
            }
          }
          .first4_right {
            float: right;
            width: 48%;
            p {
              padding-top: 10px;
            }
          }
        }
      }
      .first5 {
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
        padding-top: 10px;
        width: 700px;
        margin: 0 auto;
        div {
          .first5_left {
            width: 48%;
            float: left;
            margin-left: 4%;
            p {
              padding-top: 10px;
            }
          }
          .first5_right {
            float: right;
            width: 48%;
            p {
              padding-top: 10px;
            }
          }
        }
      }
      .first6 {
        padding-bottom: 10px;
        padding-top: 10px;
        width: 100%;
        margin: 0 auto;
        .el-button {
          width: 100%;
          text-align: center;
        }
      }
    }
    .center {
      width: 800px;
      height: 400px;
      border: 1px solid #ddd;
      background: #fff;
      z-index: 999;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto auto;
      div {
        margin-top: 10px;
      }
      .el-button {
        margin-top: 20px;
      }
    }
  }
}
.clear {
  clear: both;
}
</style>