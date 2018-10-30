<template>
    <div>
       <div> 
            <el-button type="primary" @click="add">加一</el-button>
            子组件一
           <hr>
       </div>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    add() {
      this.$emit("receive");
    }
  }
};
</script>
