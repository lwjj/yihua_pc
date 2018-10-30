<template> 
    <div>
        {{parent}}
         子组件二
           <hr>
    </div>
</template>
<script>
export default {
  props: ["parent"],
  data() {
    return {};
  },
  watch: {
    parent: function(a, b) {
      console.log(a, b);
    }
  }
};
</script>
