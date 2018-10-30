<template>
    <div class="tR_box">
        <el-table :data=tableData border  height="100%" style="width:100%">
            <el-table-column prop="createTime" label="时间" min-width="20%"></el-table-column>
            <el-table-column prop="explains" label="消费方式" min-width="20%"></el-table-column>
            <el-table-column prop="businessPoint" label="商机点" min-width="20%"></el-table-column>
            <el-table-column prop="status" label="状态" min-width="20%"></el-table-column>
        </el-table>
        <el-pagination  class="center"  v-if="pageCount>0" style="text-align:right;padding:10px 0;" background layout="prev,pager,next" :total=pageCount @current-change="select"></el-pagination>
    </div>
</template>
<script>
export default{
    data(){
        return{
            userInfo:{},
            organInfo:{},
            tableData:[],
            pageCount:0,
        }
    },
    methods:{
        getMain(pageNo){
            var data={
                token:this.$getkey(),
                userId:this.userInfo.guid,
                pageNo:pageNo,
                pageSize:10,
                type:6
            }
            this.$ajax(`${this.subUrl.user}/asset/getBpLog`,
            data,
            res=>{  
                this.tableData=res.data.list
                this.pageCount=(res.data.pageCount)*10
                console.log(this.pageCount)
                for(var p=0;p<this.tableData.length;p++){
                    if(this.tableData[p].businessPoint!==null){
                        this.tableData[p].businessPoint="-"+this.tableData[p].businessPoint
                    }else{
                        this.tableData[p].businessPoint="0"    
                    }
                    if(this.tableData[p].status==0){
                        this.tableData[p].status="失败"
                    }else{
                        this.tableData[p].status="成功"    
                    }
                }
            },
            this
            );
        },
        select(val){
            this.getMain(val)    
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
.tR_box{
    width:100%;
    margin-left:15px;
    margin-top:10px;
}
</style>
