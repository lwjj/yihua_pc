<template>
    <div class="box">
        <div class="first">
            <div class="no" v-if="isHas!==1">暂无权限</div>
            <div class="yes" v-if="isHas==1">
                <span>开启助手</span>
                <el-radio-group v-model="radio" @change="select()">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
            </div>
        </div>
    </div>
</template>
<script>
import fn from "@/assets/js/product";
export default{
    data(){
        return{
            userInfo:{},
            organInfo:{},
            open:0,
            radio:0,
            isHas:""
        }
    },
    methods:{
        getMain(){
            var data={
                token:this.$getkey(),
                userId:this.userInfo.guid
            }
            this.$ajax(`${this.subUrl.activity}/myhelper/check`,
            data,
            res=>{
                if(res.data==1){
                    this.open=1
                    this.isHas=res.data
                }
            },
            this,
            );        
        },
        setItems(){
            
        },
        select(){
            this.$confirm('是否开启助手', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '已开启助手'
                    });
                this.switchId()
            }).catch(() => {
                this.radio = 0,
                this.$message({
                    type: 'info',
                    message: '已取消'
                    });      
                });
        },
        switchId(){
                var data={
                    token:this.$getkey(),
                    userId:this.userInfo.guid,
                    manageOrganId:this.organInfo.guid
                };
                console.log(data)
                this.$ajax(`${this.subUrl.activity}/advancedQuery/queryMode`,
                data,
                res=>{
                    var obj=res.data;
                    obj.userInfo=this.userInfo
                    obj.organInfo=this.organInfo
                    obj.tempToken=this.$getkey()
                    localStorage.setItem("tempObj1",encodeURIComponent(JSON.stringify(obj)));
                    this.$ajax(`${this.subUrl.user}/user/getUserInfo`,
                    {userId:obj.userId,token:obj.token},
                    res=>{
                        console.log(res)
                        localStorage.setItem("userInfo",encodeURIComponent(JSON.stringify(res.data.userInfo)));
                        localStorage.setItem("organInfo",encodeURIComponent(JSON.stringify(res.data.organInfo)))
                        fn.setIng(obj.token);
                        var a=res.data.userInfo.organType;
                        var b=res.data.userInfo.admin?1:0
                        localStorage.setItem("organType",a)
                        localStorage.setItem("isManger",b)
                        localStorage.setItem("user_Id",res.data.userInfo.guid)
                        localStorage.setItem("organ_Id",res.data.organInfo.guid)
                        localStorage.setItem("mainColor",this.$color[res.data.userInfo.organType]);
                        this.$router.replace("/manage/wuye_service");
                        localStorage.setItem("reload",ture)
                    },
                    this
                    );
                },
                this
                );
        }
    },
    mounted(){
        this.userInfo=JSON.parse(decodeURIComponent(localStorage.getItem("userInfo")));
        this.organInfo=JSON.parse(decodeURIComponent(localStorage.getItem("organInfo")));
        this.getMain()
        this.setItems()
    }
}   
</script>
<style lang="scss" scoped>
    .box{
        height:100%;
        width:98%;
        margin-left:1%;
        background:#fff;
        position:relative;
        min-height:732px;
        .first{
            .no{
                padding-bottom:30px;
                text-align:center;
            }
            .yes{
                padding-bottom:30px;
                span{
                    padding-left:20px;
                }
                .el-radio-group{
                    float:right;
                    padding-right:20px;
                }
            }
        }
    }
.clear{
    clear:both;
}
</style>