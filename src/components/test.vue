<template>
    <div>
        <test1 @receive='receive'></test1>
        <test2 :parent='parent'></test2>
    </div>
    
</template>
<script>
import test1 from "./test1.vue";
import test2 from "./test2.vue";
export default {
  components: {
    test1,
    test2
  },
  data() {
    return {
      parent: 1
    };
  },
  methods: {
    receive() {
      this.parent++;
    }
  }
};
</script>
