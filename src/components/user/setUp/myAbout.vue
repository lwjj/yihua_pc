<template>
    <div class="box">
        <div class="main">
            <div class="first1">
                <img :src="data.logo">
                <h4>{{data.description}}</h4>
                <p>版本号：{{data.versionNo}}</p>
                <p>微信号：{{data.wechat}}</p>
                <p>客服电话：{{data.serviceTel}}</p>
                <p>电子邮箱：{{data.email}}</p>
                <p>官方版本：{{data.website}}</p>
                <p>版本所有：{{data.releaseAll}}</p>
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
            data:{}
        }
    },
    methods:{
        getDetails(){
            var data={
                token:this.$getkey(),
                organId:this.organInfo.guid,
            }
            this.$ajax(`${this.subUrl.user}/user/about`,
            data,
            res=>{
                this.data=res.data
                
            },
            this,
            );
        },
           
    },
    mounted(){
        this.userInfo=JSON.parse(decodeURIComponent(localStorage.getItem("userInfo")));
        this.organInfo=JSON.parse(decodeURIComponent(localStorage.getItem("organInfo")));
        this.getDetails()
    }
}   
</script>
<style lang="scss" scoped>
    .box{
        height:100%;
        margin-top:10px;
        width:98%;
        margin-left:1%;
        background:#fff;
        .main{
            width:50%;
            margin-left:20%;
            padding-top:20px;
            min-height:732px;
            .first1{
                width:100%;
                text-align:center;
                img{
                    width:300px;
                }
                p{
                    padding:15px 0;
                }
            }
        }
    }
.clear{
    clear:both;
}
</style>