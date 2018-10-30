<template>
<div id='new_task'>
      <div class="title">
        <div class="text">新任务</div>
    </div>
    <div class="layout clearfix">
    <!-- 筛选条件 -->
    <div class="filtrate">
       <div class="block">
      <span class="demonstration">筛选条件</span>
      <el-date-picker
        v-model="dateValue"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期" @change="date">
      </el-date-picker>
  </div>
   <el-select v-model="value" placeholder="请选择类型">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
   <el-select v-model="value" placeholder="请选择状态">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</div>
  <!-- 导航 -->
  <div class="nav">
    <ul>
      <li><a>全部</a></li>
      <li><a>未读</a></li>
      <li><a>完成</a></li>
      <li><a>异常</a></li>
    </ul>
  </div>
    </div>
   
</div>
</template>
<script>
export default {
  data() {
    return {
      dateValue: "",
      options: [
        
      ],
      value: ""
    };
  },
  methods: {
    date() {
      console.log(this.dateValue, "date");
    }
  }
};
</script>
<style lang="scss" scoped>
#new_task {
  padding-left: 310px;
}

.filtrate {
  width: 100%;
  height: 50px;
}
.block {
  display: inline;
}
.nav ul {
  width: 100%;
}
.nav li a {
  padding: 20px 100px;
  float: left;
}
</style> 