<template>
    <div id="report">
        <div class="title">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{path:'/user/blackstone/blackstone_my'}">百事通</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{name:'blackstone_view',params:{hid:kaId}}">详情</el-breadcrumb-item>
                    <el-breadcrumb-item>举报</el-breadcrumb-item>   
                </el-breadcrumb>
        </div>
        <div class="report_box">
            <div class="report_main">
                <div class="report_title">{{text}}</div>
                <div class="report_all">    
                    <div class="report_options">
                        <p style="width:150px;display:inline-block;margin-left:10px;">
                            <span>
                                <el-radio v-model="content" label="盗版或侵权">盗版或侵权</el-radio>
                            </span>
                            <span>
                                <el-radio v-model="content" label="广告或垃圾信息">广告或垃圾信息</el-radio>
                            </span>
                            <span>
                                <el-radio v-model="content" label="编辑内容">编辑内容</el-radio>
                            </span>
                        </p>
                        <p style="width:150px;display:inline-block;">
                            <span>
                                <el-radio v-model="content" label="黄，赌，毒，诽谤，暴力等信息">黄，赌，毒，诽谤，暴力等信息</el-radio>
                            </span>
                            <span>
                                <el-radio v-model="content" label="反政府，反人类等反对信息">反政府，反人类等反对信息</el-radio>
                            </span>
                            <span>
                               
                            </span>
                        </p>
                    </div>
                    <div style="padding:10px 0;width:100%;"  v-if="content=='编辑内容'">
                        <el-input type="textarea" :maxlength="100" :autosize="{ minRows: 3, maxRows: 4}" placeholder="请输入举报内容" v-model="parameter.content"></el-input>     
                    </div> 
                    <div class="report_text" v-if="content=='盗版或侵权'">
                        <ol>
                            <li class="report_text_1">    
                                <div style="margin-bottom:10px;">上传身份证或营业执照（ 加盖单位公章 ）</div>
                                    <el-upload
                                        :action="uploadUrl"
                                        list-type="picture-card"
                                        :data='otherData'
                                        :before-upload="beforeAvatarUpload"
                                        :on-preview="handlePictureCardPreview"
                                        :on-success="uploadSuccess"
                                        :on-error="uploadError"
                                        :limit='1'
                                        :on-exceed='uploadMax'
                                        :on-remove="handleRemove">
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                    <el-dialog :visible.sync="dialogVisible" size="tiny">
                                        <img width="100%" :src="dialogImageUrl" alt="">
                                    </el-dialog>
                            </li>
                            <li class="report_text_2">
                                <div class="text_01">上传收书面函（ 格式如下 ）</div>
                                <div class="text_02">本人/本单位承诺，对所举报平台的信息内容中侵犯本人/本单位合法权利的指控真实，正确，完整，并愿意对要求所删除相关涉嫌侵权内容的行为承担一切法律责任和后果。</div>
                                <div class="text_03">签名（ 单位加盖公章 ）：</div>
                                <div class="text_04"></div>
                                <div>
                                    <p>年 月 日</p>
                                    <p>联系人：</p>
                                    <p>邮箱地址：</p>
                                    <p>地址：</p>
                                </div>
                                <el-upload
                                        :action="uploadUrl1"
                                        list-type="picture-card"
                                        :data='otherData1'
                                        :before-upload="beforeAvatarUpload1"
                                        :on-preview="handlePictureCardPreview1"
                                        :on-success="uploadSuccess1"
                                        :on-error="uploadError1"
                                        :limit='1'
                                        :on-exceed='uploadMax1'
                                        :on-remove="handleRemove1">
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                    <el-dialog :visible.sync="dialogVisible1" size="tiny">
                                        <img width="100%" :src="dialogImageUrl1" alt="">
                                    </el-dialog>
                            </li>                          
                        </ol>
                    </div>
                    <div class="nofl"></div>
                    <div class="report_bottom">
                        <router-link :to="{name:'blackstone_view',params:{hid:kaId}}"><el-button>取消</el-button></router-link>
                        <el-button @click="report">提交</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import fn from '@/assets/js/common'
import Vue from "vue";
import qs from "qs";
export default{
    data(){
        this.uploadUrl = "http://up-z2.qiniu.com";
        this.uploadUrl1 = "http://up-z2.qiniu.com";
        return{
            userInfo:{},
            organInfo:{},
            kaId:"",
            text:"",
            imgUrl:'',
            imgUrl1:'',
            dictDataValue:0,
            content:"",
            token:'',
            images:[],
            getHearLog:{
                domain:'',
                token:'',
                name:'',
                pid:null,
            },
            parameter:{
                token:'',
                userId:null,
                kaId:null,
                type:1,
                content:'',
                license:null,
                written:null
            },
            dialogImageUrl: "",
            dialogVisible: false,
            otherData:{},
            imgsAll:[],
            dialogImageUrl1: "",
            dialogVisible1: false,
            otherData1:{},
            imgsAll1:[]

        }
    },
    methods:{
        back(){
            this.$router.go(-1)
        },
        report(){    

        if(this.content!=="盗版或侵权"){
            var data={
                userId:this.parameter.userId,
                token:this.parameter.getkey,
                kaId:this.parameter.kaId,
                content:this.parameter.content,
                type:0
            }
        }else if(this.content=="盗版或侵权"){
                var a=[]
                for(var key in this.imgsAll){
                    this.imgsAll[key]
                    a.push(this.imgsAll[key])
                }
                var b=[]
                for(var key in this.imgsAll1){
                    this.imgsAll1[key]
                    b.push(this.imgsAll[key])
                }
            if(a.length==1&&b.length==1){
                this.parameter.license=a
                this.parameter.written=b
                var data={
                    userId:this.parameter.userId,
                    token:this.parameter.getkey,
                    kaId:this.parameter.kaId,
                    content:this.parameter.content,
                    type:1,
                    license:this.parameter.license,
                    written:this.parameter.written,
                }
            }else{                 
                this.$message({
                        message: '需上传身份和书面函！',
                        type: 'error'
                    });
                return
            }
        }
        this.xhr.post(`${this.subUrl.bd}/knowAll/report`, qs.stringify(data)).then((res) => {        
            if (res.data.code == 1) {
                this.$message({
                        message: '举报成功！',
                        type: 'success'
                    });
                this.$router.go(-1)
            } else if (res.data.code == '-902'){
                fn.re_login(this);
            } else if (res.data.code == '-1'){
               this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
            }else {
                this.$message({
                        message: '系统错误！',
                        type: 'error'
                    });
            }
        })
      },
        update(e){
            let file = e.target.files[0];//详细信息
            let d = new Date();
            let type = file.name.split('.');//点切割
            //console.log(type)//获得数组
            let tokenParem = {
                'putPolicy':'{\"name\":\"$(fname)\",\"size\":\"$(fsize)\",\"w\":\"$(imageInfo.width)\",\"h\":\"$(imageInfo.height)\",\"hash\":\"$(etag)\"}',
                'key':'orderReview/'+d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()+'/'+d.valueOf()+'.'+type[type.length-1],
                'bucket':this.getHearLog.domain,//七牛的地址，这个是你自己配置的（变量）
            };
            //console.log(tokenParem)

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
            param.append('token',this.token);
            console.log(param.get('token'))
            this.uploading(param,config,file.name);//然后将参数上传七牛
            return;
        },
        uploading(param,config,pathName){
            this.xhr.post('http://up-z2.qiniu.com',param,config)
            .then(response=>{
                this.getHearLog.name=response.data.key;
                if(this.getHearLog.name!=''){
                    if(this.getHearLog.pid==1){
                        this.imgUrl=this.getHearLog.domain+'/'+this.getHearLog.name;
                        this.parameter.license=this.getHearLog.name;
                        this.show=true;
                    }else if(this.getHearLog.pid==2){
                        this.imgUrl1=this.getHearLog.domain+'/'+this.getHearLog.name;
                        this.parameter.written=this.getHearLog.name;
                        this.show1=true;
                    }
                }
                let localArr = this.images.map((val,index,arr)=>{
                    return arr[index].localSrc;
                })
                if(!~localArr.indexOf(pathName)){
                    this.images.push({'src':this.showUrl+response.data.key,'localSrc':pathName});
                }else{
                    alert('已上传该图片');
                }
            })
        },
        getQiniuInfo(pid){
            this.xhr.post(`${this.subUrl.user}/qiniu/getInfo?token=`+this.parameter.getkey).then(res=>{
            if (res.data.code == 1) {         
                this.getHearLog=res.data.data;
                this.getHearLog.pid=pid;
            } else{
                this.$dialog.toast({mes: res.data.msg});
            }
        })
      },
      addImg(pid){
        this.getQiniuInfo(pid);
      },
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
     getUploadToken1() {
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
          this.otherData1 = obj;
          // obj.token;
        },
        this
      );
    },
        handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
        },
        uploadSuccess(res) {
            this.imgsAll[res.key] = res.key;
            console.log(this.imgsAll)
        },
        uploadError() {
        this.$message.error("上传失败");
        },
        uploadMax() {
        this.$message.error("最多上传1张图片");
        },
        beforeAvatarUpload(file) {
            const isImage = file.type.indexOf("image");
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (isImage==-1) {
                this.$message.error('上传图片格式有误!');
                return false
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
                return false
            }
            return isImage && isLt2M;
        },
        handleRemove(file, fileList) {
        delete this.imgsAll[file.response.key];
        },
        

        handlePictureCardPreview1(file) {
        this.dialogImageUrl1 = file.url;
        this.dialogVisible1 = true;
        },
        uploadSuccess1(res) {
            this.imgsAll1[res.key] = res.key;
        },
        uploadError1() {
        this.$message.error("上传失败");
        },
        uploadMax1() {
        this.$message.error("最多上传1张图片");
        },
        beforeAvatarUpload1(file) {
            const isImage = file.type.indexOf("image");
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (isImage==-1) {
                this.$message.error('上传图片格式有误!');
                return false
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
                return false
            }
            return isImage && isLt2M;
        },
        handleRemove1(file, fileList) {
        delete this.imgsAll1[file.response.key];
        },

    },
    mounted(){
        this.userInfo=JSON.parse(decodeURIComponent(localStorage.getItem("userInfo")))
        this.organInfo=JSON.parse(decodeURIComponent(localStorage.getItem("organInfo")))
        this.kaId=this.$route.params.hid
        this.text=this.$route.params.text
        this.parameter.getkey = fn.getIng()     
        this.parameter.userId = this.userInfo.guid
        this.parameter.kaId = this.$route.params.hid
        this.getUploadToken() 
        this.getUploadToken1()
    }
}
</script>
<style lang="scss" scoped>
#report{
    overflow:scroll;
    padding-left:260px;
}
.nofl{
    clear:both
}
.report_box{
    background:#fff;
    width:98%;
    margin-left:1%;
    margin-top:10px;
    .report_main{
        padding-top:30px;
        padding-left:50px;
        .report_title{
            font-size:20px;
        }
        .report_all{
            margin-top:15px;
            width:40%;
            .report_options{
                width:100%;
                border-bottom:1px dashed #ddd;
                p{
                    span{
                        display:inline-block;
                        padding-bottom:10px;
                    }
                }
            }
            .report_text{
                ol{
                    padding-left:20px;
                    .report_text_1{
                        .text_upload{
                            float:left;
                            margin-left:10px;
                            margin-top:20px;
                            width:110px;
                            height:110px;
                            position:relative;
                            border:1px solid #ddd;
                            i{
                                margin-top:45px;
                                margin-left:22px;
                            }
                            .file{
                                width:0;
                                height:0;
                                position:absolute;
                                top:40%;
                                left:32%;
                            }
                            img{
                                width:100%;
                                height:100%;
                            }
                        }
                    }
                    .report_text_2{
                        clear:both;
                        width:90%;
                        padding-top:20px;
                        .text_01{
                            margin-bottom:10px;
                        }
                        .text_02{
                            margin-bottom:10px;
                        }
                        .text_03{
                            float:right
                        }
                        .text_04{
                            clear:both
                        }
                        .text2_upload{
                            float:left;
                            margin-left:10px;
                            margin-top:20px;
                            margin-bottom:30px;
                            width:110px;
                            height:110px;
                            position:relative;
                            border:1px solid #ddd;
                            i{
                                margin-top:45px;
                                margin-left:22px;
                            }
                            .file{
                                width:0;
                                height:0;
                                position:absolute;
                                top:40%;
                                left:32%;
                            }
                            img{
                                width:100%;
                                height:100%;
                            }
                        }
                    }
                }
            }
            .report_bottom{
                margin:10px 0 10px 35%;
                padding-bottom:10px;
            }
        }
    }
}
</style>

