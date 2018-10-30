<template>
    <div id="blackstone"> 
        <router-view></router-view>
        <div class="layout">     
            <div class="stone_button">
                <span @click="$router.push('/user/blackstone/blackstone_my')" :class="isActive == 1?'tabActive':''">百事通</span>
                <span @click="$router.push('/user/blackstone/my_library/library_collection')" :class="isActive == 2?'tabActive':''">我的文库</span>
                <span @click="$router.push('/user/blackstone/blackstone_wealth/wealth_upload')" :class="isActive ==3 ?'tabActive':''">我的财富</span>
            </div> 
        </div>
    </div>
</template>
<script>
export default {
  data() {
    this.mHeight = Number(this.$getClientHeight()) - 200;
    return {
      isActive: 1
    };
  },
  methods: {
    getActive(a) {
      if (a.path.indexOf("blackstone_my") > -1) {
        this.isActive = 1;
      } else if (a.path.indexOf("my_library") > -1) {
        this.isActive = 2;
      } else if (a.path.indexOf("blackstone_wealth") > -1) {
        this.isActive = 3;
      }
    }
  },
  watch: {
    $route: function(a) {
      this.getActive(a);
    }
  },
  mounted() {
    this.getActive(this.$route);
  }
};
</script>
<style lang="scss" scoped>
#blackstone {
  overflow: auto;
  height: 100%;
}
.layout {
  padding-left: 210px;
}
.filtrate {
  height: 60px;
  background: #fff;
  line-height: 60px;
  width: 100%;
  .el-menu {
    background: #fff;
    float: left;
  }
}
.block {
  float: right;
  margin-right: 100px;
  display: block;
  .el-input__inner {
    padding: 0 10px;
  }
}
.stone_button {
  margin-top: 12px;
  background: #fff;
  padding: 10px 0;
  right: 0;
  left: 270px;
  padding: 0 60px;
  height: 60px;
  font-weight: 600;
  line-height: 60px;
  justify-content: space-between;
  display: flex;
  bottom: 0;
  position: fixed;
  z-index: 12;
}
.stone_button span {
  font-size: 14px;

  cursor: pointer;
  padding: 0 20px;
}
.stone_button .tabActive {
  color: #409eff;
}
</style>
