<template>
    <div class="main">
        <div class="box">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/enterprise_wealth/enterprise_details/enterprise_ticketRecord' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>兑奖提示</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="suc">
                <h3>提示</h3>
                <h4>兑奖申请已提交{{sjd}}元</h4>
                <h4>提交时间：{{newDate}}</h4>
                <h4>预计到账：{{futureDate}}</h4>
                <el-button @click="goTicket">返回</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default{
    data(){
        return{
             userInfo:{},
            organInfo:{},
            newDate:"",
            futureDate:"",
            sjd:""
        }    
    },
    methods:{
        getDate(){
            let n=new Date().getFullYear()
            let y=new Date().getMonth()+1
            let r=new Date().getDate()
            this.newDate=n+"-"+y+"-"+r
            let a1=new Date().getTime()+86400000+86400000
            let a2=new Date(a1)
            let n1=a2.getFullYear()
            let y1=a2.getMonth()+1
            let r1=a2.getDate()
            this.futureDate=n1+"-"+y1+"-"+r1
        },
        goTicket(){
            this.$router.push({path: '/user/personal_wealth/personal_details/personal_ticketRecord'});
        }
        
    },
    mounted(){
        this.userInfo=JSON.parse(decodeURIComponent(localStorage.getItem("userInfo")))
        this.organInfo=JSON.parse(decodeURIComponent(localStorage.getItem("organInfo")))
        this.getDate()
        this.sjd=this.$route.params.sjd
    }  
}   
</script>
<style lang="scss" scoped>
.main{
    height:100%;
    background:#fff;
    width:97%;
    margin-left:2%;
    margin-top:10px;
    .box{
        padding-top:10px;
        padding-left:10px;
        .suc{
            width:25%;
            margin-left:35%;
            h3{
                margin-left:10%;
            }
            h4{
                margin-bottom:20px;
            }
            .el-button{
                margin-left:13%;
            }
        }
    }
}
</style>

