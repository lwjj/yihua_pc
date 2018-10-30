<template>
   <div>
     <div class="content scroll_content">
      <div class="btn">
        <el-button class="" size="" type="default"  @click="chooseCancel">取消</el-button>
        <el-button class="" size="" type="primary"  @click="chooseSuccess()">确定</el-button>
      </div>
       <div class="tips"><b>可选</b>（从以下类目选择一项）</div>
       <div class="choose_free" v-for="(item,key) in options_free"  :key="key">
         <div class="list">
           <div class="item" @click="showFree(key)">
             <span class="icon" :class="{green:key%4==0,red:key%4==1,blue:key%4==2,yellow:key%4==3}"></span>
             <div class="item-title">{{item.name}}</div>
             <div class="arrow">
               <img v-show="!item.show" src="../../assets/images/register/right.png">
               <img v-show="item.show" src="../../assets/images/register/bottom.png">
             </div>
           </div>
           <div class="subContent" v-show="item.show">
             <el-button class="buttonChoose" v-for="(item1,key1) in item.subclass" :key="key1"
                        :type="item1.show?'primary':'hollow'" @click.native="choose_free(key,key1)">{{item1.name}}
             </el-button>
           </div>
         </div>
       </div>
       <div class="tips"><b>必选</b>（从以下类目选择一项）</div>
       <div class="choose_require" v-for="(item,key) in options_require"  :key="key">
         <div class="list">
           <div class="item" @click="showRequire(key)">
             <span class="icon" :class="{green:key%4==0,red:key%4==1,blue:key%4==2,yellow:key%4==3}"></span>
             <div class="item-title">{{item.name}}</div>
             <div class="arrow">
               <img v-show="!item.show" src="../../assets/images/register/right.png">
               <img v-show="item.show" src="../../assets/images/register/bottom.png">
             </div>
           </div>
           <div class="subContent" v-show="item.show">
             <el-button class="buttonChoose" shape="circle" v-for="(item1,key1) in item.subclass"
                        :key="key1"
                        :type="item1.show?'primary':'hollow'" @click.native="choose_require(key,key1)">{{item1.name}}
             </el-button>
           </div>
         </div>
       </div>
     </div>

   </div>
</template>
<script>
import Vue from "vue";
export default {
  name: "",
  props: ["url"],
  data() {
    return {
      options_free: [],
      options_require: [],
      freeIndex: -1,
      requireIndex: -1
    };
  },
  methods: {
    chooseCancel(){
      this.$emit('chooseSuccess');
    },
    chooseSuccess() {
      console.log(this.freeObj, this.requireObj);
      if (this.requireObj) {
        let obj = {};
        if (
          this.options_require[this.requireObj.a].subclass[this.requireObj.b]
            .show
        ) {
          if (
            this.freeObj &&
            this.options_free[this.freeObj.a].subclass[this.freeObj.b].show
          ) {
            obj.free =
              this.freeObj &&
              this.options_free[this.freeObj.a].subclass[this.freeObj.b];
          }
          obj.require = this.options_require[this.requireObj.a].subclass[
            this.requireObj.b
          ];
          console.log(obj);
          this.$emit("chooseSuccess", obj);
        } else {
          this.$message.error( "请选择必选行业");
        }
      } else {
        this.$message.error("请选择必选行业");
      }
    },
    getHangye() {
      this.$ajax(
        `${this.subUrl.user}/comm/getIndustryCategory`,
        "",
        res => {
          if (res.code == 1) {
            console.log(res.data);
            this.options_free = res.data.pmc;
            this.options_require = res.data.icc;
          }
        },
        this
      );
    },
    cancel() {
      this.$emit("cancel");
      return false;
    },
    showFree(e) {
      if (this.options_free[e].show) {
        this.$set(this.options_free[e], "show", false);
      } else {
        this.$set(this.options_free[e], "show", true);
      }
    },
    showRequire(e) {
      if (this.options_require[e].show) {
        this.$set(this.options_require[e], "show", false);
      } else {
        this.$set(this.options_require[e], "show", true);
      }
    },
    choose_free(a, b) {
      if (this.options_free[a].subclass[b].show) {
        if (!this.freeObj) {
          this.freeObj = {};
        } else {
          this.$set(
            this.options_free[this.freeObj.a].subclass[this.freeObj.b],
            "show",
            false
          );
        }
        this.$set(this.options_free[a].subclass[b], "show", false);
        this.freeObj = { a, b };
      } else {
        if (!this.freeObj) {
          this.freeObj = {};
        } else {
          this.$set(
            this.options_free[this.freeObj.a].subclass[this.freeObj.b],
            "show",
            false
          );
        }
        this.$set(this.options_free[a].subclass[b], "show", true);
        this.freeObj = { a, b };
      }
    },
    choose_require(a, b) {
      if (this.options_require[a].subclass[b].show) {
        if (!this.requireObj) {
          this.requireObj = {};
        } else {
          this.$set(
            this.options_require[this.requireObj.a].subclass[this.requireObj.b],
            "show",
            false
          );
        }
        this.$set(this.options_require[a].subclass[b], "show", false);
        this.requireObj = { a, b };
      } else {
        if (!this.requireObj) {
          this.requireObj = {};
        } else {
          this.$set(
            this.options_require[this.requireObj.a].subclass[this.requireObj.b],
            "show",
            false
          );
        }
        this.$set(this.options_require[a].subclass[b], "show", true);
        this.requireObj = { a, b };
      }
    }
  },
  mounted() {
    this.getHangye();
    console.log(11);
  }
};
</script>
<style scoped>
.content{
  width: 800px;
  margin: 50px auto ;
  background: #fff;
  padding: 50px 20px; 
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
}
.scroll_content{
  margin: 50px auto!important;
}
.btn{
  float: right;
}
.item {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 3px;
  background: #fff;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  margin-bottom: -1px;
}
.arrow img:nth-child(1) {
  width: 10px;
  margin-right: 10px;
}
.arrow img:nth-child(2) {
  height: 10px;
  margin-right: 10px;

}
.item-title {
  flex: 1;
}
.subContent {
  padding: 20px 20px;
}
.buttonChoose {
  height: 40px;
  border-radius: 10px;
}
.tips {
  font-size: 14px;

  color: #777;
  padding: 0 10px;
  height: 70px;
  line-height: 70px;
}
.tips b {
  font-size: 16px;
  font-weight: 400;
}
.icon {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  margin: 10px;
}
.green {
  background: #52d4e4;
}
.blue {
  background: #3eb7e6;
}
.red {
  background: #fa697c;
}
</style>
