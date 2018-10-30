<template>
    <div class="main">
        <div class="box">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/personal_wealth/personal_details/personal_ticketRecord' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/user/personal_wealth/personal_ticket/personal_ticket/:sjd' }">兑换</el-breadcrumb-item>
                <el-breadcrumb-item>收款账户</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="info">
                <el-row style="text-align:center">
                    <el-col :span="24"><h2>收款账户</h2></el-col>
                </el-row>
                <el-row style="text-align:right">
                    <el-col :span="21" v-show="ceiling==1"><el-button type="text" @click=
                    "go">添加账户</el-button></el-col>
                    <el-col :span="21" v-show="ceiling==2"><el-button type="text">上限七个账户</el-button></el-col>
                </el-row>
                <el-row style="margin-top:10px;border-bottom:1px solid #ddd; padding-bottom:10px;" v-for="item in this.dataTable" :key="item.guid">
                    <el-col :span="3" style="font-size:18px; font-weight:bold">{{item.type}}</el-col>
                    <el-col :span="13" style="margin-top:2px;margin-left:7%;">微信账号：{{item.account}}</el-col>
                    <el-col :span="3" style="text-align:right"><el-button @click="deltSan(item.guid)">解绑账号</el-button></el-col>
                    <el-col :span="3"><el-button @click="defaultSan(item.guid)">{{item.status}}</el-button></el-col>
                </el-row>
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
            dataTable:[],
            ceiling:1
        }
    },
    methods:{
         getCollectionName(){
            var data={
                token:this.$getkey(),
                userId:this.userInfo.guid,
            }
            this.$ajax(`${this.subUrl.user}/asset/getSanList`,
            data,
            res=>{
                this.dataTable=res.data
                if(this.dataTable.length>6){
                    this.ceiling=2
                }else{
                    this.ceiling=1  
                }
                for(var i=0;i<this.dataTable.length;i++){
                    this.dataTable[i].type=this.dataTable[i].type==1?"微信支付":"银行卡支付"
                    this.dataTable[i].status=this.dataTable[i].status==1?"默认账号":"设为默认"
                }
                console.log(this.dataTable)
            },
            this
            );
        },
        go(){
            this.$router.push({path:'/user/personal_wealth/personal_ticket/personal_add'})
        },
        defaultSan(sanId){
            this.$confirm('此操作将转换默认收款账户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data={
                    token:this.$getkey(),
                    userId:this.userInfo.guid,
                    sanId:sanId
                }
                this.$ajax(`${this.subUrl.user}/asset/setDefaultSan`,
                data,
                res=>{
                    if(res.code==1){
                        this.getCollectionName()
                        this.$message({
                            message: '转换成功',
                            type: 'success'
                        });
                    }
                },
                this
                );
            }).catch(() => {
                this.$message({
                    message: '转换失败',
                    type: 'errorr'
                });
            });    
        },
        deltSan(sanId){
            this.$confirm('此操作将删除该收款账户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data={
                    token:this.$getkey(),
                    userId:this.userInfo.guid,
                    sanId:sanId
                }
                this.$ajax(`${this.subUrl.user}/asset/delSan`,
                data,
                res=>{
                    if(res.code==1){
                        this.getCollectionName()
                        this.$message({
                            message: '解绑成功',
                            type: 'success'
                        });
                    }
                },
                this
                );
            }).catch(() => {
                this.$message({
                    message: '解绑失败',
                    type: 'errorr'
                });
            });       
        }
    },
    mounted(){
        this.userInfo=JSON.parse(decodeURIComponent(localStorage.getItem("userInfo")))
        this.organInfo=JSON.parse(decodeURIComponent(localStorage.getItem("organInfo")))
        this.getCollectionName()    
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
        .info{
            width:50%;
            margin-left:20%;
        } 
    }
}
</style>

