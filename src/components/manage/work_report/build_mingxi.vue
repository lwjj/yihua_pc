<template>
<!-- -->
<div id='build_mingxi'>
<div v-show="showMask" class="mask"></div>
<div class="top_header">
    <h4 class="floatL"><i @click="mingxiBack" class="el-icon-d-arrow-left"></i>明细说明</h4>
    <el-button class="floatR" type="primary" style="margin:10px 10px" @click="save">保存</el-button>
    <el-button class="floatR" style="margin:10px 10px" type="primary" @click="buildTable">新建表格</el-button>
</div>
    <!-- 表格 -->
   <!--创建表头  -->
<div v-show="showBuild" class="inform_table">
     <div class="table_header clearfix">
        <div class="left">1)&nbsp;请先填写标题和表头</div>
        <div class="right">
            <el-button type="primary" size="small" @click="addCol">添加表头</el-button>
            <el-button type="primary" size="small" @click="deleteCol">删除表头</el-button>
        </div>
    </div>   
<div class="build_tabHeader">
       <div class="createTitle"><h4>标题:</h4><el-input  style="width:200px" v-model="table_title" clearable placeholder="请输入标题"></el-input></div>
   <el-table 
    border
   :data="tableData" 
   style="width: 100%">
      <el-table-column 
      header-align="center"
        v-for="(item,index) in cols"
        :key="index"
        :label="item.value"
        >
         <template slot-scope="scope">
            <el-input type="textarea"  :autosize="{minRows: 1}" v-model="scope.row[keyArr[index+1]]"></el-input>
        </template>
      </el-table-column>
    </el-table> 
    <div class="btnBox">
      <el-button type="primary" size="small"  @click="create" >确定创建</el-button>
      <el-button type="primary" size="small"  @click="cancel" class="floatR">取消</el-button>
    </div> 
    </div> 
 </div>

<!--  -->
<div v-for="(item,index) in tableArr" :key="index" >
  <!-- 新建的表 -->
  <div class="newCreateTable" >
    <div class="newtitle">
      <h4 v-text="table_title" class="floatL"></h4>
      <!-- <el-button type="primary" size="small" @click="deleteRow" class="floatR" style="margin-left:20px;">删除行</el-button> -->
      <el-button type="primary" size="small" @click="addRow" class="floatR">添加行</el-button>
    </div>
      <el-table 
      border
      :data="newTableData1" 
      style="width: 100%">
        <el-table-column 
          header-align="center"
          v-for="(item,index) in newCols1"
          :key="index"
          :label="item.value"
          >
          <template slot-scope="scope">
              <el-input type="textarea"  :autosize="{minRows: 1}" v-model="scope.row[keyArr[index+1]]"></el-input>
          </template>
        </el-table-column>
        <el-table-column
      header-align="center"
        label="操作"
        >
        <template slot-scope="scope">
          <el-button type="danger" plain size="small"  @click.native.prevent="deleteRow(scope.$index, newTableData1)">删除</el-button>
        </template>
      </el-table-column>
      </el-table>  
  </div>
</div>

<!-- <div class="allsub">
    <el-button type="primary"  @click="save">保存</el-button>
</div> -->
</div>
</template> 
<script>
export default {
  data() {
    return {
      newTableShow1: false,
      newTableShow2: false,

      isbuild: false,
      showMask: false,
      showBuild: false,
      tables: [],
      tableRows: [],
      tableArr: [],
      table_title: "",
      show: true,
      showMingxi: false,
      tableHeader: "",
      userInfo: "",
      organInfo: "",
      keyArr: [
        "header0",
        "header1",
        "header2",
        "header3",
        "header4",
        "header5",
        "header6",
        "header7",
        "header8",
        "header9",
        "header10"
      ],
      cols: [
        { value: "表头1" },
        { value: "表头2" },
        { value: "表头3" },
        { value: "表头4" }
      ],
      tableData: [{ header1: "", header2: "" }],

      newCols1: [],
      newTableData1: [],

      newCols2: [],
      newTableData2: [],

      newCols3: [],
      newTableData3: [],

      newCols4: [],
      newTableData4: [],

      newCols5: [],
      newTableData5: [],

      newCols6: [],
      newTableData6: [],

      newCols7: [],
      newTableData7: [],

      newCols8: [],
      newTableData8: [],

      newCols9: [],
      newTableData9: [],

      newCols10: [],
      newTableData10: [],

      newCols11: [],
      newTableData11: []
    };
  },
  methods: {
    mingxiBack() {
      this.$emit("mingxiBack");
    },
    buildTable() {
      this.showBuild = true;
      this.showMask = true;
    },
    // 添加表头
    addCol() {
      var num = this.cols.length + 1;
      console.log(num, "num");
      this.tableHeader = "表头";
      // var obj = { prop: "header" + num, label: this.tableHeader + num };
      var obj = { value: this.tableHeader + num };
      console.log(obj, "obj");
      this.cols.push(obj);
      console.log(this.cols);

      this.tableData[0][this.keyArr[num]] = "";
      console.log(this.tableData, "tableData");
    },
    // 删除表头
    deleteCol() {
      this.cols.splice(this.cols.length - 1, 1);
      console.log(this.cols, "this.cols");
      delete this.tableData[0][this.keyArr[this.cols.length + 1]];
    },
    create() {
      this.buildNew();
    },
    //创建
    buildNew() {
      // let colsArr = [
      //   "newCols0",
      //   "newCols1",
      //   "newCols2",
      //   "newCols3",
      //   "newCols4",
      //   "newCols5",
      //   "newCols6",
      //   "newCols7",
      //   "newCols8",
      //   "newCols9",
      //   "newCols10"
      // ];
      let num = this.tableArr.length + 1;
      this.isbuild = true;
      // [...this.newCols] = this.cols;
      console.log(this.newCols1);
      this.newCols1 = JSON.parse(JSON.stringify(this.cols));
      this.newTableData1 = JSON.parse(JSON.stringify(this.tableData));
      let i = 0;
      if (this.table_title == "") {
        this.$message.error("请输入标题");
        return;
      }
      console.log(this.tableData[0], "this.tableData[0]");
      for (var key in this.tableData[0]) {
        if (this.tableData[0][key] == "") {
          this.$message.error("请输入完整的表头");
          return;
        }
        // 赋值给新的表头
        this.newCols1[i].value = this.tableData[0][key];
        i++;
      }
      for (var key in this.newTableData1[0]) {
        this.newTableData1[0][key] = "";
      }
      console.log(this.newTableData1, "newTableData1");

      this.tableArr.push(this.newCols1);

      //遮罩
      this.showMask = false;
      this.showBuild = false;
    },

    cancel() {
      this.showMask = false;
      this.showBuild = false;
    },
    //添加行
    addRow() {
      // 深拷贝对象
      let obj = JSON.parse(JSON.stringify(this.tableData[0]));
      for (var i in obj) {
        obj[i] = "";
      }
      this.newTableData1.push(obj);
      console.log(this.newTableData1);
    },
    // 删除行
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },

    // 保存
    save() {
      this.tables = [];
      this.tableRows = [];
      if (!this.isbuild) {
        this.$message.error("请先创建表格再保存");
        return;
      }
      console.log(this.newTableData, "subnewTableData");
      this.tables = [
        {
          // createTime: "2018-02-01 00:00:00",
          deptId: this.userInfo.deptId,
          manageMonthRepId: 0,
          organId: this.organInfo.guid,
          tableRows: this.tableRows, //  表格数据
          title: this.table_title,
          type: 0 //表单所属类型
        }
      ];
      // 表头内容
      this.newCols1.forEach((ele, i) => {
        ele.trId = 0;
      });
      console.log(this.newCols, "newcols");
      let rowHeader = {
        tableDatas: [],
        tid: "",
        type: 1
      };
      rowHeader.tableDatas = JSON.parse(JSON.stringify(this.newCols1));
      this.tableRows.push(rowHeader);
      console.log(this.tableRows, "rowHeader");

      // 表格内容
      this.newTableData1.forEach((ele, i) => {
        let rowContent = {
          tableDatas: [],
          tid: 0,
          type: 2
        };
        for (var key in this.newTableData1[i]) {
          let obj2 = {};
          obj2.trId = i + 1;
          obj2.value = this.newTableData1[i][key];
          rowContent.tableDatas.push(obj2);
        }
        this.tableRows.push(rowContent);
      });
      console.log(this.tableRows, "rowHeader,rowContent");
      this.$emit("getMingxi", this.tables);
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
  margin: 20px 20px;
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