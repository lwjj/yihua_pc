<template>
    <div class="stone_form">
        <el-row :gutter="20">
            <el-col :span="12" v-for="item in list" :key="item.value" class="stone_div">
                <div class="stone_form_son">
                    <el-row :gutter="20" style="margin-left:0;margin-right:0;">
                        <el-col :span="12">{{item.title}}</el-col>
                        <el-col :span="12" class="right">评分：{{item.grade}}</el-col>
                    </el-row>
                    <div class="stone_text" style="margin:2px 2px">{{item.content}}</div>                    
                </div>
                <el-row :gutter="20" class="stone_form_button" style="margin-left:33px;">
                    <el-col :span="9" style="margin-top:5px;">需要<b class="stone_font">{{item.bp}}</b>个商机点</el-col>
                    <el-col :span="4" class="right"><el-button type="text"  v-if="item.keyword!==''">{{item.keyword}}</el-button></el-col>
                    <el-col :span="4" v-if="item.keyword==''">&nbsp;</el-col>
                    <el-col :span="11" class="right" style="padding-right:0;"><el-button>查看</el-button></el-col>
                </el-row>
            </el-col>                                                                     
        </el-row>
        <el-pagination v-if="pageCount" class="center" style="margin-right:170px;padding:14px 0;" layout="prev,pager,next" :total="pageCount" @current-change="handleCurrentChange" ></el-pagination>
    </div>
</template>
<script>
export default{
    data(){
        return{
            bd:[],
            userInfo:{},
            organInfo:{},
            deptType:[],
            pageSize:0,
            pageCount:0,
            list:[]
        }
    },
    methods:{
        handleCurrentChange(pageNo){
            this.getInform(pageNo)
        },
        getInform(pageNo){
            var data={
                token:this.$getkey(),
                userId:this.userInfo.guid,
                pageSize:4,
                pageNo:pageNo               
            }
            this.$ajax(`${this.subUrl.bd}/knowAll/getknowAllList`,
            data,
            res=>{
                this.deptType=res.data;
                this.pageCount=Number(this.deptType.pageCount)*10
                this.list=this.deptType.list
            },
            this
            );
        }
    },
    mounted(){
        this.userInfo=JSON.parse(decodeURIComponent(localStorage.getItem("userInfo")))
        this.organInfo=JSON.parse(decodeURIComponent(localStorage.getItem("organInfo")))
        this.getInform()
    }   
}    
</script>
<style lang="scss" scoped>
.stone_form{
    width:97%;
    margin-top:20px;
    margin-left:25px;
    background:#fff;
    padding-top:5px;
    .stone_form_button{
        width:70%;
        margin-top:10px;
        padding-bottom:10px;
        .stone_font{
            font-size:21px;
        }
    }
    .stone_form_son{
        width:70%;
        height:230px;
        margin-left:35px;
        margin-top:20px;
        border:1px solid #ddd;
        .el-row{
            border-bottom:1px dashed #ddd;
            padding:5px 0;
        
        }
        .stone_text{
            width:100%;
            margin:10px 10px;
        }
    }
}
</style>    