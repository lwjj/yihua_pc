<template>
    <div class="main">
        <div class="box">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/enterprise_wealth/enterprise_details/enterprise_ticketRecord' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/user/enterprise_wealth/enterprise_ticket/enterprise_ticket/:sjd' }">兑换</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/user/enterprise_wealth/enterprise_ticket/enterprise_account' }">收款账户</el-breadcrumb-item>
                <el-breadcrumb-item>添加账户</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="info">
                <el-row style="margin-bottom:15px;">
                    <el-col :span="12" style="text-align:right">
                        <el-button @click="isSelect1(1)">添加微信账户</el-button>
                    </el-col>
                    <el-col :span="11" style="margin-left:10px;">
                        <el-button @click="isSelect1(2)">添加银行账户</el-button>
                    </el-col>
                </el-row>
                <el-form ref="form" :model="form" label-width="80px" v-show="select1==1">
                    <el-form-item label="账户密码">
                        <el-input v-model="form.password" @blur="getPassword" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="微信账户">
                        <el-input v-model="form.account"></el-input>
                    </el-form-item>
                    <el-form-item label="账户名称">
                        <el-input v-model="form.accountName"></el-input>
                    </el-form-item>
                    <el-form-item label="默认账户">
                        <el-radio-group v-model="form.isDefault">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="margin-left:40%;" type="primary" @click="onSubmit(1)">立即添加</el-button>
                    </el-form-item>
                </el-form>
                <el-form ref="form" :model="form" label-width="80px" v-show="select1==2">
                    <el-form-item label="账户密码">
                        <el-input v-model="form.password" @blur="getPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="银行账户">
                        <el-input v-model="form.account"></el-input>
                    </el-form-item>
                    <el-form-item label="账户名称">
                        <el-input v-model="form.accountName"></el-input>
                    </el-form-item>
                    <el-form-item label="默认账户">
                        <el-radio-group v-model="form.isDefault">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="margin-left:40%;" type="primary" @click="onSubmit(2)">立即添加</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
export default{
    data(){
        return{
            form: {
                 userInfo:{},
            organInfo:{},
                password:"",
                account:"",
                accountName:"",
                isDefault:""
            },
            select1:1,
            pwdOk:""
        }
    },
    methods:{
        isSelect1(num){
            this.select1=num
        },
        onSubmit(val){
            this.form.isDefault=this.form.isDefault=="是"?1:0
            if(val==1){
                if(this.pwdOk==1){
                    var data={
                            token:this.$getkey(),
                            userId:this.organInfo.organAccount,
                            password:this.form.password,
                            type:1,
                            account:this.form.account,
                            accountName:this.form.accountName,
                            isDefault:this.form.isDefault
                        }
                    this.$ajax(`${this.subUrl.user}/asset/addSan`,
                    data,
                    res=>{
                        if(res.code==1){
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            this.$router.push({path: '/user/enterprise_wealth/enterprise_ticket/enterprise_account'});
                        }else{
                            this.$message({
                                message: '请填写完整数据',
                                type: 'error'
                            });   
                        }
                    },    
                    this
                    );
                }else{
                    this.$message({
                        message: '用户密码错误',
                        type: 'error'
                    });
                };
            }else if(val==2){
                if(this.pwdOk==1){
                    var data={
                            token:this.$getkey(),
                            userId:this.organInfo.organAccount,
                            password:this.form.password,
                            type:3,
                            account:this.form.account,
                            accountName:this.form.accountName,
                            isDefault:this.form.isDefault
                        }
                    this.$ajax(`${this.subUrl.user}/asset/addSan`,
                    data,
                    res=>{
                        if(res.code==1){
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            this.$router.push({path: '/user/enterprise_wealth/enterprise_ticket/enterprise_account'});
                        }else{
                            this.$message({
                                message: '请填写完整数据',
                                type: 'error'
                            });   
                        }
                    },    
                    this
                    );
                }else{
                    this.$message({
                        message: '用户密码错误',
                        type: 'error'
                    });
                };
            }
        },
        getPassword(){
            var data={
                    token:this.$getkey(),
                    password:this.form.password,
                }
            this.$ajax(`${this.subUrl.user}/asset/validatePassword`,
            data,
            res=>{
                if(res.code==1){
                    this.pwdOk=1
                }else{
                    this.pwdOk=0
                }
            },    
            this
            );    
        }    
    },
    updated(){
        
    },
    mounted(){
        this.userInfo=JSON.parse(decodeURIComponent(localStorage.getItem("userInfo")))
        this.organInfo=JSON.parse(decodeURIComponent(localStorage.getItem("organInfo")))
        console.log(this.organInfo)   
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
            width:30%;
            margin-left:20%;
        } 
    }
}
</style>

