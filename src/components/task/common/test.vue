<template>
 <div id = "subTemplate">

<!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/manage/' }">本楼业务</el-breadcrumb-item>
            <el-breadcrumb-item>楼宇管理</el-breadcrumb-item>
        </el-breadcrumb>


<!--  分页 -->
        <el-pagination  
            v-if="rowCount"
            background
            style="float:right;"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :page-size="12"
            :total="rowCount">
        </el-pagination>

          handleCurrentChange(pageNo) {
             this.getList(pageNo);
            },
        rowCount: "",
        this.rowCount = +res.data.rowCount;

       this.mHeight = Number(this.$getClientHeight()) - 200;
           this.mHeight =tableHeight  // 定义的 window.tableHeight

<!-- 图片预览 -->
 <ul class="photo clearfix" >
            <li v-for="(item,index) in taskDel.commAccessoryList" :key="index">
                <img 
                  class="preview-img" 
                  :key="index" 
                  :src="item.src" 
                  height="100" 
                  @click="$preview.open(index, taskDel.commAccessoryList)">
            </li>
        </ul>




<!-- 边距 -->
<!-- subTemplate -->
<!-- 覆盖样式 -->
 </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
     // 弹窗提示
    deleteRid() {
      this.$confirm("是否删除栋?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
         
        })
        .catch(() => {});
    },

     // 图片预览设置
          for (let val of res.data.commAccessoryList) {
            let img = document.createElement("img");
            img.src = val.path;
            val.src = val.path;
            img.onload = function() {
              // 防止网速慢时图片未加载获取不到图片宽高
              val.w = img.width;
              val.h = img.height;
            };
          },


   // 选择帖子
    handleSelectionChange(val) {
      console.log(val, "tie");
      let arr = [];
      for (let ele of val) {
        arr.push(ele.guid);
      }
      this.bbsIdList = arr.join();
      console.log(this.bbsIdList, "bbsIdList");
    },


     formatTime(row, column) {
      var date = row[column.property];
      return date.split(" ")[0];
    },


     // 过滤type   状态（1，正常,2，关闭(下架),3过期） ,
    filterType(row, column) {
      let date = row[column.property];
      if (date == 1) {
        return "正常";
      } else if (date == 2) {
        return "下架";
      } else if (date == 3) {
        return "过期";
      }
    },


  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
// 图片预览设置
.photo {
    li {
      float: left;
      margin: 10px 10px;
      width: 120px;
      height: 120px;
      overflow: hidden;

      img {
        height: 100%;
        display: block;
      }
    }
  }
}

</style>