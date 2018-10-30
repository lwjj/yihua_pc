<template>
    <div class="main">
        <div class="box">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/enterprise_wealth/enterprise_details/enterprise_ticketRecord' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>会员购买</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="mb">
                <h3>会员购买</h3>
                <div class="first1" v-for="item in table" :key="item.guid">
                    <div class="a">
                        <img :src="item.image">
                    </div>
                    <div class="b">
                        <div class="b1"><h4>{{item.name}}</h4></div>
                        <div class="b2"><p>描述：</p></div>
                        <div class="b3"><p><nobr>{{item.detail}}</nobr></p></div>
                    </div>
                    <div class="c">
                        <el-button @click="goPay(item.num)">点击购买</el-button>
                    </div>
                </div>
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
            table:[],
            num:""
        }    
    },
    methods:{
        getMain(){
            var data={
                token:this.$getkey(),
            }
            this.$ajax(`${this.subUrl.user}/asset/getVipDetailList`,
            data,
            res=>{
                this.table=res.data
                for(var i=0;i<this.table.length;i++){
                    this.table[i].num=i+1    
                }        
                console.log(this.table)
            },
            this,
            );
        },
        goPay(num){
            this.num=num
            this.$router.push({name:'enterprise_buyType',params:{type:this.num}})
        }      
    },
    mounted(){
        this.userInfo=JSON.parse(decodeURIComponent(localStorage.getItem("userInfo")))
        this.organInfo=JSON.parse(decodeURIComponent(localStorage.getItem("organInfo")))
        this.getMain()    
    }  
}   
</script>
<style lang="scss" scoped>
.clear{
    clear:both;
}
.main{
    height:100%;
    background:#fff;
    width:97%;
    margin-left:2%;
    margin-top:10px;
    .box{
        padding-top:10px;
        padding-left:10px;
        .mb{
            width:60%;
            margin-left:10%;
            h3{
                text-align:center;
            }
            .first1{
                margin-left:5%;
                height:120px;
                border:1px solid #ddd;
                border-right:0;
                border-left:0;
                overflow:hidden;
                .a{ 
                    width:20%;
                    height:100%;
                    float:left;
                    img{
                        width:95px;
                        margin-top:10px;
                    }
                } 
                .b{
                    width:60%;
                    height:100%;
                    float:left;
                    
                    .b1{
                        float:left;
                        width:20%;
                        height:100%;
                        h4{
                          margin-top:50px;  
                        }
                    }
                    .b2{
                        height:100%;
                        float:left;
                        width:15%;
                        p{
                            margin-top:50px;         
                        }
                    }
                    .b3{
                        height:100%;
                        float:left;
                        width:65%;  
                        p{
                            overflow:hidden;
                            text-overflow:ellipsis; 
                            margin-top:50px;    
                        }
                    }
                }
                .c{
                    width:20%;
                    height:100%;
                    float:left;
                    .el-button{
                        margin-top:23%;
                    }
                }
            }
        }
    }
}
</style>

