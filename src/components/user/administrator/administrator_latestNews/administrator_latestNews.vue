<template>
     <div id="wealth">
        <div class="title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/user/administrator' }">管理员</el-breadcrumb-item>
                <el-breadcrumb-item>最新消息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="main">
                <div class="top">
                    <div>
                        <router-link to="/user/administrator/administrator_latestNews/administrator_all"><el-button @click="select(0)">全部</el-button></router-link>
                        <router-link to="/user/administrator/administrator_latestNews/administrator_system"><el-button @click="select(1)">系统消息</el-button></router-link>
                        <router-link to="/user/administrator/administrator_latestNews/administrator_add"><el-button @click="select(2)">加入消息</el-button></router-link>
                    </div>
                    <el-tooltip class="only" effect="dark" content="请选择清空类型（默认所有，选择则点击左边按钮）" placement="right">        
                        <el-button  @click="empty">清空</el-button>
                    </el-tooltip>
                </div>
                <router-view></router-view>
            </div>
        </div>
     </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      organInfo: {},
      type1: 0
    };
  },
  methods: {
    select(num) {
      if (num == 0) {
        this.type1 = 0;
      } else if (num == 1) {
        this.type1 = 1;
      } else {
        this.type1 = 2;
      }
    },
    empty() {
      var data = {
        token: this.$getkey(),
        organId: this.organInfo.guid,
        type: this.type1
      };
      this.$confirm("是否清空消息", "提示", { type: "warning" })
        .then(() => {
          this.$ajax(
            `${this.subUrl.user}/admin/latestNews/emptyOrganNews`,
            data,
            res => {
              if (res.code == 1) {
                this.$message({
                  message: "清空成功",
                  type: "success"
                });
                if (this.type1 == 0) {
                  this.$router.push({
                    pash:
                      "/user/administrator/administrator_latestNews/administrator_all"
                  });
                } else if (this.type1 == 1) {
                  this.$router.push({
                    pash:
                      "/user/administrator/administrator_latestNews/administrator_system"
                  });
                } else if (this.type1 == 2) {
                  this.$router.push({
                    pash:
                      "/user/administrator/administrator_latestNews/administrator_add"
                  });
                }
              }
            },
            this
          );
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
  }
};
</script>
<style lang="scss" scoped>
#wealth {
  height: 100%;
  padding-left: 260px;
  padding-right: 10px;
  overflow: auto;
  .box {
    height: 100%;
    background: #fff;
    .main {
      height: 100%;
      .top {
        height: 60px;
        justify-content: space-between;
        display: flex;
        align-items: center;
        overflow: hidden;
        div {
          a {
            margin-right: 10px;
          }
        }
        .only {
          float: right;
        }
      }
      .body {
        height: calc(100% - 60px);
        position: relative;
      }
    }
  }
}
</style>

