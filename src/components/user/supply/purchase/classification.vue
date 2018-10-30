<template>
<div class="classList">
    <el-button class="mb1"  @click="confirm" size="mini" type='primary'>确定</el-button>
    <el-collapse  v-model="activeNames">
       <el-collapse-item :title="item.name" v-for="(item,index) in list" :key="index" :name="index">
          <div class="box1">
            <ul >
              <li v-for="(todo,index1) in item.subclass" :key="index1"
                  @click="checkBox(todo.guid,todo.name,item.guid)"
                  :style="{background:piacked==todo.guid?mainColor:'',color:piacked==todo.guid?'white':''}">
                {{todo.name}}
              </li>
            </ul>
          </div>
       </el-collapse-item>
    </el-collapse> 
</div>
</template>
<script>
export default {
  props: ["changeNo"],
  data() {
    return {
      activeNames: [0],
      mainColor: "",
      num: null,
      userInfo: "",
      organInfo: "",
      titleText: "",
      getkey: "",
      organId: "",
      interestList: [],
      // valueCenterList:[],
      addArr: [],
      addArr1: [],
      piacked: null,
      list: [],
      guid: "",
      fguid: "",
      showXieyi: false,
      name: ""
    };
  },
  computed: {},
  methods: {
    //行业分类
    getIndustryCategory() {
      if (this.changeNo == 1) {
        let data = {};
        this.$ajax(
          `${this.subUrl.user}/comm/getIndustryCategory`,
          data,
          res => {
            this.list = res.data.icc.concat(res.data.pm);
          },
          this
        );
      } else if (this.changeNo == 2) {
        let data = {};
        data.token = this.$getkey();
        data.organId = this.organId;
        this.$ajax(
          `${this.subUrl.user}/comm/getIndustryCategory2`,
          data,
          res => {
            this.list = res.data;
          },
          this
        );
      }
    },
    turnTo(url) {
      this.$router.push(url);
    },
    back() {
      this.$emit("bmData1");
      store.guid = null;
      store.name = null;
      store.fguid = null;
    },
    confirm() {
      if (!this.fguid) return this.$message.error("请选择服务分类");
      this.$emit("bmData", {
        guid: this.guid,
        fguid: this.fguid,
        name: this.name
      });
    },
    checkBox(guid, name, fguid) {
      this.piacked = guid;
      // store.guid = guid;
      // store.name = name;
      // store.fguid = fguid;
      this.guid = guid;
      this.name = name;
      this.fguid = fguid;
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    this.user = JSON.parse(decodeURIComponent(localStorage.getItem("user")));
    this.users = JSON.parse(decodeURIComponent(localStorage.getItem("users")));

    this.mainColor = localStorage.getItem("mainColor");
    this.userId = this.userInfo.guid;
    // this.$getkey() = fn.getIng();
    this.organId = this.organInfo.guid;
    this.getIndustryCategory();
  },
  beforeUpdate() {}
};
</script>
<style scoped>
.layout_my .header:after {
  display: none;
}

.layout_my {
  background: #f7f7f9;
}

.layout_my .blue_box {
  height: 0.88rem;
  background-size: 100% 100%;
  color: white;
}

.box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.2rem;
  background: #f3f3f3;
  padding: 0.2rem 0.3rem;
  border-bottom: 1px solid #d8d8d8;
}

.box span {
  width: 100%;
  height: 100%;
  background: white;
  border: 1px solid #d8d8d8;
  border-radius: 0.06rem;
  padding: 0.1rem 0.1rem;
}

.box span > input {
  width: 100%;
  height: 100%;
  border: none;
  color: #777;
}

.box1 {
  width: 100%;
  display: flex;
}

.box1 ul {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
}
.classList {
  padding: 10px;
  background: #fff;
}

.box1 ul li {
  border: 1px solid #e6e6e6;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  margin: 0 5px 5px 0;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  padding: 3px 5px;
}

.box2 {
  width: 100%;
  display: flex;
  padding: 0.2rem 0.2rem;
}

.box2 span {
  width: 100%;
  border: 1px solid #d8d8d8;
  border-radius: 0.06rem;
  background: white;
}

.box2 span > textarea {
  width: 100%;
  height: 2rem;
  border: none;
}

.box3 {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  padding: 0.1rem 0.1rem;
}

.box3 label {
  width: 30%;
  height: 0.9rem;
  border: 1px solid #e1e1e1;
  border-radius: 0.9rem;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  margin: 0.1rem 0.1rem;
}

.box3 label > span {
  color: #333;
  letter-spacing: 0.07rem;
}

.box3 label > a {
  color: #aaaaaa;
}
</style>
