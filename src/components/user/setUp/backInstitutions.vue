<template>
    <div class="box">
        <div class="first1">
            <el-table :data="tableData" style="width: 100%">
                 <el-table-column fixed prop="organName" label="机构名称" min-width="30%"></el-table-column>
                <el-table-column prop="organAddress" label="机构地址" min-width="30%"></el-table-column>
                <el-table-column prop="enterBuilding" label="机构楼宇" min-width="30%"></el-table-column>
                <el-table-column fixed="right" label="操作" min-width="10%">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">退出</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>  
    </div>
</template>
<script>
export default{
    data(){
        return{
            userInfo:{},
            organInfo:{},
            tableData:[]
        }
    },
    methods:{
        handleClick(row){
            this.$confirm('是否确定退出机构?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data={
                    token:this.$getkey(),
                }
                this.$ajax(`${this.subUrl.user}/admin/deptManage/quitOrgan`,
                data,
                res=>{
                    if(res.code==1){
                        this.$router.push({path:"/account/login"})
                        this.$message({
                            message: '退出成功',
                            type: 'success'
                        });
                        localStorage.clear()
                    }
            },
            this,
            );
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消退出'
            });          
            });
        },
        getMain(){
            console.log(this.organInfo)
            var a={
                organName:"",
                organAddress:"",
                enterBuilding:""
            }
            a.organName=this.organInfo.organName
            a.organAddress=this.organInfo.organAddress
            a.enterBuilding=this.organInfo.enterBuilding
            this.tableData.push(a)
        }
    },
    mounted(){
        this.userInfo=JSON.parse(decodeURIComponent(localStorage.getItem("userInfo")));
        this.organInfo=JSON.parse(decodeURIComponent(localStorage.getItem("organInfo")));
        this.getMain()
    }
}    
</script>
<style lang="scss" scoped>
#wealth{
    
    padding-left:260px;
    padding-right:10px;
    overflow:scroll;
    .box{
        margin-top:10px;
        width:98%;
        margin-left:1%;
        height:100%;
        background:#fff;
        min-height:732px;
        .first1{
            width:98%;
            padding-left:1%;
            background:#fff;
            padding-top:10px;
        }
    }
}

</style>
