<template>
<!-- 新建任务 -->
<div id='build_inform'>
    <div class="title">
        <!-- <div class="text"><i @click="back" class="el-icon-arrow-left"></i>财务送批报告</div> -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/yewei_contact' }">业主往来</el-breadcrumb-item>
            <el-breadcrumb-item>财务送批报告</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
<div class="container">

<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="标题" prop="title">
    <el-input v-model="ruleForm.title" placeholder="请输入标题"></el-input>
  </el-form-item>
  <el-form-item label="启动时间" prop="startTime">
     <el-date-picker
     value-format="yyyy-MM-dd"
     format="yyyy 年 MM 月 dd 日"       
     style="width:100%"
      v-model="ruleForm.startTime"
      type="date"
      placeholder="请选择启动时间"
      >
    </el-date-picker>
  </el-form-item>
  <el-form-item label="完成时间" prop="endTime">
       <el-date-picker
     value-format="yyyy-MM-dd"
     format="yyyy 年 MM 月 dd 日"       
     style="width:100%"
      v-model="ruleForm.endTime"
      type="date"
      placeholder="请选择完成时间"
      >
    </el-date-picker>
  </el-form-item>
<!-- 任务详情 -->
  <el-form-item label="内容" prop="content" >
    <el-input type="textarea"  :autosize=" {minRows: 6}" v-model="ruleForm.content"></el-input>
  </el-form-item>
<!-- 照片 -->
<el-form-item label="上传附件">
    <el-upload
                :action="uploadUrl"
                :data='otherData'
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePictureCardPreview"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :limit='4'
                :on-exceed='uploadMax'
                :on-remove="handleRemove">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" size="tiny">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>

     </el-form-item>
   <el-form-item class="submitBtn">
    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
  </el-form-item>
</el-form>
</div>
</div>

</template> 
<script>
import fn from '@/assets/js/common'
import Vue from "vue"
import qs from "qs"
export default {
  data() {
    this.uploadUrl = "http://up-z2.qiniu.com";
    return {
      fileName:'',
      userInfo: "",
      organInfo: "",
      message: "发布成功",
      dialogImageUrl: "",
      dialogVisible: false,
      ruleForm: {
        title: "",
        content: "",
        startTime: "",
        endTime: "",
        accessorys:""
      },
      token:"",
      getHearLog:{
                domain:'',
                token:'',
                name:'',
                pid:null,
            },
       imgAll:{
          imgUrl1:"",
          imgUrl2:"",
          imgUrl3:"",
          imgUrl4:"",
          imgUrl5:"",
          imgUrl6:"",
          imgUrl7:"",
          imgUrl8:"",
      },

      images:[],
      dialogImageUrl: "",
      dialogVisible: false,
      otherData:{},
      imgsAll:[],

      imageName:[],
      fileList:[],
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [
          { required: true, message: "请填写任务详情", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "请选择启动时间", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请选择完成时间", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
      getUploadToken() {
      this.$ajax(
        `${this.subUrl.user}/qiniu/getInfo`,
        { token: this.$getkey() },
        res => {
          console.log(res.data, "token");
          var obj = {
            chunk: 0,
            chunks: 1,
            token: res.data.token
          };
          this.otherData = obj;
          // obj.token;
        },
        this
      );
    },
    handlePictureCardPreview(file) {
      window.open(file.url, "_blank");
    },
    uploadSuccess(res) {
        
        this.imgsAll[res.key] = res.key;
        this.fileList.push({
        fileName:this.fileName,
        path:res.key
       })
        console.log(this.fileList,"33333333333333333333333333333")
    },
    uploadError() {
      this.$message.error("上传失败");
    },
    uploadMax() {
      this.$message.error("最多上传4个文件");
    },
    beforeAvatarUpload(file) {
        // const isImage = file.type.indexOf("image");
        // const isLt2M = file.size / 1024 / 1024 < 2;

        // if (isImage==-1) {
        //     this.$message.error('上传图片格式有误!');
        //     return false
        // }
        // if (!isLt2M) {
        //      this.$message.error('上传头像图片大小不能超过 2MB!');
        //      return false
        // }
        // return isImage && isLt2M;
        this.fileName = file.name
        console.log(this.fileName,"this.fileNamethis.fileNamethis.fileName")
    },
    handleRemove(file, fileList) {
      delete this.imgsAll[file.response.key];
    },
    back() {
      this.$router.go(-1);
    },
     update(e){
            let file = e.target.files[0];//详细信息
            let d = new Date();
            let type = file.name.split('.');//点切割
            console.log(type)
            
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
                bucket: this.getHearLog.domain//七牛的地址，这个是你自己配置的（变量）
            };
            let param = new FormData(); //创建form对象
            param.append('chunk','0');//断点传输
            param.append('chunks','1');
            param.append('file',file,file.name)
            console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
            let config = {
                headers:{'Content-Type':'multipart/form-data'}
            };
            //先从自己的服务端拿到token
            this.token = this.getHearLog.token;
            //console.log(this.getHearLog.token)
            param.append('token',this.token);
            //console.log(param.get('token'))
            this.uploading(param,config,file.name);//然后将参数上传七牛
            return;
        },
    uploading(param,config,pathName){
            this.xhr.post("http://up-z2.qiniu.com",param,config)
            .then(response=>{
                this.imageName.push(response.data.key);
                this.ruleForm.accessorys = this.imageName.join(",");
                this.getHearLog.name=response.data.key;
                if(this.getHearLog.name!=''){
                    if(this.getHearLog.pid==1){
                        this.imgAll.imgUrl1=this.getHearLog.domain+'/'+this.getHearLog.name;         
                    }else if(this.getHearLog.pid==2){
                        this.imgAll.imgUrl2=this.getHearLog.domain+'/'+this.getHearLog.name;
                    }else if(this.getHearLog.pid==3){
                        this.imgAll.imgUrl3=this.getHearLog.domain+'/'+this.getHearLog.name;
                    }else if(this.getHearLog.pid==4){
                        this.imgAll.imgUrl4=this.getHearLog.domain+'/'+this.getHearLog.name;
                    }else if(this.getHearLog.pid==5){
                        this.imgAll.imgUrl5=this.getHearLog.domain+'/'+this.getHearLog.name;
                    }else if(this.getHearLog.pid==6){
                        this.imgAll.imgUrl6=this.getHearLog.domain+'/'+this.getHearLog.name;
                    }else if(this.getHearLog.pid==7){
                        this.imgAll.imgUrl7=this.getHearLog.domain+'/'+this.getHearLog.name;
                    }else if(this.getHearLog.pid==8){
                        this.imgAll.imgUrl8=this.getHearLog.domain+'/'+this.getHearLog.name;
                    }
                }
                let localArr = this.images.map((val,index,arr)=>{
                    return arr[index].localSrc;
                })
                if(!~localArr.indexOf(pathName)){
                    this.images.push({'src':this.showUrl+response.data.key,'localSrc':pathName});
                }else{
                    this.$message({
                        message: '已上传过该图片！',
                        type: 'error'
                    });
                }
            })
    },
    getQiniuInfo(pid){
            this.xhr.post(`${this.subUrl.user}/qiniu/getInfo?token=`+this.getkey).then(res=>{
                if (res.data.code == 1) {         
                    this.getHearLog=res.data.data;
                    this.getHearLog.pid=pid;
                    
                }
            })
        },
    addImg(pid){
        this.getQiniuInfo(pid);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    
    // 提交发布
    submitForm(formName) {
        var a=new Date(this.ruleForm.startTime).getTime()
        var b=new Date(this.ruleForm.endTime).getTime()
        var imggs=[]
        console.log(this.imgsAll,"this.imgsAllthis.imgsAllthis.imgsAllthis.imgsAll")
      for(var key in this.fileList){
        imggs.push({"fileName":this.fileList[key].fileName,"path":this.fileList[key].path})
      }
      this.ruleForm.accessorys=imggs.join(",")
        if(a<b){
                this.$refs[formName].validate(valid => {
                    if (valid) {
                    var data = {
                        token: this.$getkey(),
                        userId: this.userInfo.guid,
                        title: this.ruleForm.title,
                        content: this.ruleForm.content,
                        startTime: this.ruleForm.startTime + " 00:00:00",
                        endTime: this.ruleForm.endTime + " 00:00:00",
                        type: 2,
                    };

                    this.$ajax1(
                        `${this.subUrl.activity}/ownersCom/ocReport/add?${this.$qs.stringify(data)}`,
                        imggs,
                        res => {
                        console.log(res, "submit");
                        this.$message.success("提交成功");
                        this.back();
                        },
                        this
                    );
                    } else {
                    this.$message.error("请填写完整信息");
                    return false;
                    }
                });
        }else{
            this.$message({
                message: '完成时间不能小于启动日期时间',
                type: 'error'
            });
        }
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.getUploadToken() 
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.getkey = fn.getIng()
  }
};
</script>
<style lang="scss" scoped>
#build_inform {
  height: 100%;
  padding-left: 300px;
  padding-right: 40px;
  overflow: scroll;
  .text {
    i {
      padding: 20px 20px;
    }
  }
}
.container {
  padding: 20px 0;
  margin-top: 20px;
  background: #fff;
}
// 表格居中
.el-form {
  margin: 0 auto !important;
  padding: 0 100px;
}
.submitBtn {
  text-align: center;
  button {
    margin: 0 50px;
  }
}
.library_input3{
        margin-top:10px;
        .el-row{
            padding-left:20px;
            .el-col{
                border:1px solid #ddd;
                height:100px;
                margin-bottom:10px;
                position:relative;
                i{
                    margin-top:40px;
                    margin-left:45%;
                }
                input{
                    position:absolute;
                    top:35%;
                    left:20%;
                    width:0;
                    height:0;
                }
                img{
                    width:100%;
                    height:100%;
                }
            }
        }
    }
</style>