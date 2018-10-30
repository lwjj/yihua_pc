<template>
    <div class="myContent">
        <div class="title" @click="back">
            <div class="text">
            <i class="el-icon-arrow-left"></i>
            部门明细详情</div>
        </div>
       <div class="myList" style="margin-left:10px;" v-if="tableList.length>0">
           <div class="list_item" v-for="(item,index) in tableList" :key="index">
                <div class="list_title">表格{{index+1}}标题：{{item.title}}
                <div>
                    <!-- <el-button type="danger" size="small" style="height:34px;" @click="deleteTable(index)">删除表格</el-button> -->
                    <!-- <el-button type="primary" size="small" style="height:34px" @click="addRow(index)">添加行</el-button> -->
                </div>
                </div>
                <div class="item" v-for="(item1,key) in item.tableRows" :key="key">
                <div class="item_rows" v-for="(item2,key1) in item1.tableDatas" :key="key1">
                    <div>{{item2.value}}</div>
                    <!-- <div v-else><el-input v-model="item2.value"></el-input></div> -->
                    </div>  
                    <!-- <el-button class="mDelete" @click.stop="deleteLine(index,key)" v-if="key!=0" size="mini" type='danger'>删除</el-button> -->
                    <!-- <div class="item_rows" v-for="(item2,key1) in item1.tableDatas" :key="key1"> -->
                    <!-- tableList[index].tableRows[key].tableDatas[key1].value -->
                    <!-- <el-input v-model="test" placeholder="请输入内容"></el-input> -->
                </div>
            </div>
       </div>
       <div class="noData" v-else>
         暂无详情
       </div>
    </div>
</template> 
<script>
export default {
  props: ["detailData"],
  data() {
    return {
      month: "",
      modelData: {
        tableRows: [
          {
            tableDatas: [
              {
                trId: "",
                value: ""
              },
              {
                trId: "",
                value: ""
              },
              {
                trId: "",
                value: ""
              },
              {
                trId: "",
                value: ""
              }
            ],
            tid: 0,
            type: 0
          }
        ],
        title: "",
        type: 1
      },
      tableList: [],
      newTableShow1: false,
      newTableShow2: false,
      isbuild: false,
      showMask: false,
      showBuild: false,
      show: true,
      showMingxi: false,
      test: "",
      userInfo: "",
      organInfo: ""
    };
  },
  methods: {
    back() {
      this.$emit("back");
    },
    mingxiBack() {
      // this.$emit("mingxiBack");
      this.$router.go(-1);
    },
    buildTable() {
      this.showBuild = true;
      this.showMask = true;
    },
    // 添加表头
    addCol() {
      if (this.modelData.tableRows[0].tableDatas.length >= 10) {
        return this.$message({ message: "最多创建10个表头", type: "error" });
      }
      this.$set(
        this.modelData.tableRows[0].tableDatas,
        this.modelData.tableRows[0].tableDatas.length,
        {
          trId: "",
          value: ""
        }
      );
    },
    // 删除表头
    deleteCol() {
      if (this.modelData.tableRows[0].tableDatas.length == 1) {
        return this.$message({ message: "最少保留一个表头", type: "error" });
      }
      this.modelData.tableRows[0].tableDatas.splice(
        this.modelData.tableRows[0].tableDatas.length - 1,
        1
      );
    },
    create() {
      this.buildNew();
    },
    //创建
    buildNew() {
      if (!this.modelData.title)
        return this.$message({ message: "请完善标题", type: "error" });
      for (let [i, val] of this.modelData.tableRows[0].tableDatas.entries()) {
        if (!val.value)
          return this.$message({ message: "请完善表头", type: "error" });
      }
      this.tableList.push(this.modelData);
      // 对表头重新赋值
      this.modelData = {
        tableRows: [
          {
            tableDatas: [
              {
                trId: "",
                value: ""
              },
              {
                trId: "",
                value: ""
              },
              {
                trId: "",
                value: ""
              },
              {
                trId: "",
                value: ""
              }
            ],
            tid: 0,
            type: 0
          }
        ],
        title: "",
        type: 1
      };
      //遮罩
      this.showMask = false;
      this.showBuild = false;
    },
    getDetail() {
      let data = {
        token: this.$getkey(),
        userId: this.userInfo.guid
      };
    },
    cancel() {
      this.showMask = false;
      this.showBuild = false;
    },
    //添加行
    addRow(index) {
      this.$set(this.tableList[index]);
      let n = this.tableList[index].tableRows[0].tableDatas.length;
      let tempArr = [];
      console.log(n);
      for (let i = 0; i < n; i++) {
        tempArr.push({
          trId: i,
          value: ""
        });
      }
      console.log(tempArr);
      var obj = {
        tid: index + 1,
        type: 2,
        tableDatas: tempArr
      };
      this.$set(
        this.tableList[index].tableRows,
        this.tableList[index].tableRows.length,
        obj
      );
      console.log(this.tableList[index].tableRows);
    },
    // 删除行
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    // 删除整个表格
    deleteTable(index) {
      this.$confirm("是否删除整个表格", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.tableList.splice(index, 1);
      });
    },
    // 所有表格删除行
    deleteLine(index, key) {
      this.tableList[index].tableRows.splice(key, 1);
    },
    // 保存
    save() {
      if (!this.month)
        return this.$message({ message: "请选择月份", type: "error" });
      if (this.tableList.length == 0) {
        this.$message.error("请先创建表格再保存");
      } else {
        for (let i = 0; i < this.tableList.length; i++) {
          for (let j = 0; j < this.tableList[i].tableRows.length; j++) {
            for (
              let z = 0;
              z < this.tableList[i].tableRows[j].tableDatas.length;
              z++
            ) {
              if (!this.tableList[i].tableRows[j].tableDatas[z].value) {
                return this.$message({
                  message: "表格内容不能为空",
                  tyep: "error"
                });
              }
            }
          }
        }
        console.log(
          JSON.stringify(this.userInfo),
          JSON.stringify(this.organInfo)
        );
        let data = {
          deptId: this.userInfo.deptId,
          token: this.$getkey(),
          organId: this.organInfo.guid,
          repMonth: this.month,
          userId: this.userInfo.guid,
          tableList: this.tableList
        };
        this.$ajax1(
          `${this.subUrl.activity}/manageMonRep/saveMonthlyRow`,
          data,
          res => {
            this.$message({ message: "提交成功", type: "success" });
            this.$router.go(-1);
          },
          this
        );
        console.log(data);
      }
    }
  },
  mounted() {
    this.userInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("userInfo"))
    );
    this.organInfo = JSON.parse(
      decodeURIComponent(localStorage.getItem("organInfo"))
    );
    // this.getDetail();
    console.log(this.detailData);
    this.tableList = this.detailData;
  }
};
</script>


<style lang="scss" scoped>
.myContent {
  // border: 1px solid #f00;
  margin: 10px;
  margin-left: 270px;
}
.myList {
  background: #fff;
  min-height: 300px;
  margin-left: 10px;
  margin-top: 10px;
  .mMonth {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px 20px;
  }
  .list_item {
    padding: 20px;
    border-bottom: 1px solid #ddd;
    .list_title {
      background: #e4e4e4;
      line-height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      font-size: 16px;
      text-align: center;
    }
    .item {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: space-around;
      line-height: 50px;
      font-size: 14px;
      border-left: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      .item_rows {
        flex: 1;
        border-right: 1px solid #ddd;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        & > div {
          padding: 0 20px;
        }
      }
      .mDelete {
        width: 80px;
        margin: 0 10px;
        height: 34px;
      }
    }

    .item:nth-child(2n + 1) {
      background: #e4e4e4;
    }
    .item:nth-child(2) {
      .item_rows:last-child {
        // padding-right: 100px;
      }
    }
  }
}

.mTable {
  display: flex;
}
.mTable > div {
  margin-right: 10px;
}
#build_mingxi {
  // background: #ccc;
  position: relative;
  width: 100%;
  height: 100%;
}
// 遮罩层
.mask {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  z-index: 99;
  background-color: black;
  -moz-opacity: 0.7;
  opacity: 0.7;
  filter: alpha(opacity=70);
}
.top_header {
  height: 50px;
  background: #fff;
  h4 {
    line-height: 50px;
    padding-left: 20px;
    i {
      padding: 20px;
    }
  }
}
//表头创建
.inform_table {
  width: 100%;
  height: 400px;
  position: absolute;
  background: #fff;
  padding: 50px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: 150px auto;

  z-index: 999;
}
.table_header {
  .left {
    float: left;
  }
  .middle {
    float: left;
    margin-left: 100px;
  }
  .right {
    float: right;
  }
}
.build_tabHeader {
  margin-top: 10px;
}
.createTitle {
  text-align: left;
  h4 {
    float: left;
    line-height: 36px;
    padding: 0 10px;
  }
}
.btnBox {
  text-align: left;
  button {
    margin-top: 20px;
  }
}
// 创建的新表
.newCreateTable {
  background: #fff;
  margin: 20px 0px 20px 20px;
  padding: 10px 0;
  text-align: center;
  .newtitle {
    h4 {
      padding-left: 20px;
    }
  }
}
.allsub {
  background: #fff;
  margin: 20px 0;
  padding: 10px;
}
</style>