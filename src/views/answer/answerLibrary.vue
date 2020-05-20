<style>
@import url("//unpkg.com/element-ui@2.4.6/lib/theme-chalk/index.css");
.div {
  margin: 20px;
  display: flex;
  flex-direction: column;
}
.el-div {
  /* margin: 20px; */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-flow: nowrap;
}
.input-search {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 320px;
}

.el-form {
  width: 750px;
}
.el-form-item {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: nowrap;
}
</style>

<template>
    <div class="div">
<div class="el-div">
    <el-button type="primary" icon="el-icon-edit" @click="toAddClass">添加题库</el-button>

    <el-dialog title="题库" :visible.sync="dialogFormVisible">
        <el-form  class="el-form">
            <el-form-item label="题库">
                <el-input v-model="name" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogFormVisible = false">取 消</el-button> -->
            <el-button type="primary" v-if="!isAdd" @click="yesClass">添 加</el-button>
            <el-button type="primary" v-if="isAdd" @click="editClass">确定修改</el-button>
        </div>
    </el-dialog>
    
    <div style="width:20px;height: 30px;"></div>
</div>

<el-container class="notice">
<el-main>
    <el-table
      :data="tableData"
      style="width: 100%" >
      <el-table-column
        label="题库" 
        prop="name"
        >
      </el-table-column>
      <el-table-column
        label="操作" 
        >
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="toEdit(scope.$index)">修改名称</el-button>
          <el-button size="mini" type="info" @click="getFoucShopList(scope.$index)">编 辑</el-button>
          <el-button size="mini" type="danger" @click="toDelete(scope.$index)">删  除</el-button>
        <!-- <el-dropdown  @command="toCheckEdit(scope.$index)"> -->
        <el-dropdown  @command="toCheckEdit" trigger="click">
            <el-button type="primary" size="mini" @click="dropDown(scope.$index)">
              添 加<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="up">单独上传</el-dropdown-item>
              <el-dropdown-item command="check">从列表选择</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

    <el-dialog title="从列表选择" :visible.sync="isDialogCheck_copy">
    <el-select v-model="classVal" value-key="id" placeholder="请选择" @change="toSearchClass">
      <el-option v-for="(item,index) in options" :label="item.label" :key="item.id"  :value="item.label"></el-option>
    </el-select>
      <el-table
      :data="dialogTableData_copy"
      style="width: 100%" >

      <el-table-column
        label="题目"
        prop="title"
        >
      </el-table-column>

      <el-table-column
        label="答案一" 
        prop="answer1"
        >
      </el-table-column>

        <el-table-column
        label="答案二"
        prop="answer2"
        >
      </el-table-column>
      <el-table-column
        label="答案三" 
        prop="answer3"
        >
      </el-table-column>

      <el-table-column
        label="答案四" 
        prop="answer4"
        >
      </el-table-column>
      <el-table-column
        label="分类" 
        prop="classify_name"
        >
      </el-table-column>
      <el-table-column
        label="操作" 
        >
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toDialogAdd(scope.$index)">添加</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-dialog>

        <el-dialog
            title="单独上传"
            :visible.sync="dialogUP"
            width="30%">

            <el-form :model="form" class="el-form">
            <el-form-item label="题目">
                <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>

            <!-- <el-form-item label="分类" >
            <el-select v-model="form.value" value-key="id" placeholder="请选择">
                <el-option v-for="item in options" :label="item.label" :key="item.id"  :value="item.label"></el-option>
            </el-select>
            </el-form-item> -->

            <el-button type="primary" @click="isAddAws = true">添加答案</el-button>
            <div style="width:20px;height: 30px;"></div>

            <el-form-item label="答案一" >
                <el-input v-model="form.awsA" auto-complete="off"></el-input>
                <!-- <i class="el-icon-delete"></i> -->
            </el-form-item>

            <el-form-item label="答案二" >
                <el-input v-model="form.awsB" auto-complete="off"></el-input>
                <!-- <i class="el-icon-delete"></i> -->
            </el-form-item>

            <el-form-item label="答案三" >
                <el-input v-model="form.awsC" auto-complete="off"></el-input>
                <!-- <i class="el-icon-delete"></i> -->
            </el-form-item>

            <el-form-item label="答案四" v-if="isAddAws">
                <el-input v-model="form.awsD" auto-complete="off">
                  <el-button slot="append" icon="el-icon-error" @click="toClose"></el-button>
                </el-input>
                <!-- <i class="el-icon-delete"></i> -->
            </el-form-item>

            <el-form-item label="正确答案" >
            <el-select v-model="form.aws" placeholder="请选择">
                <el-option :label="form.awsA" :value="form.awsA"></el-option>
                <el-option :label="form.awsB" :value="form.awsB"></el-option>
                <el-option :label="form.awsC" :value="form.awsC"></el-option>
                <el-option :label="form.awsD" :value="form.awsD" v-if="isAddAws"></el-option>
            </el-select>
            </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" v-if="isDialogEdit" @click="yestoDialogEdit">确定编辑</el-button>
                <el-button type="primary" v-if="!isDialogEdit" @click="yesAddDiologUp">确 定</el-button>
            </span>
        </el-dialog>

    <el-dialog title="" :visible.sync="isDialogCheck">
      <el-button type="primary" icon="document" :loading="downloadLoading" @click="toExport">导出</el-button>
      <!-- <el-button type="primary" icon="document" :loading="downloadLoading" @click="toExport">批量导入</el-button> -->
      <el-upload
      :auto-upload="false"
      action=""
      :on-change="addSomeList"
      :limit="1"
      :show-file-list="false">
      <el-button style="margin:10px 0px 0 0px;" type="primary">批量导入</el-button>
      </el-upload>

      <el-table
      :data="dialogTableData"
      style="width: 100%" >

      <el-table-column
        label="题目"
        prop="title"
        >
      </el-table-column>

      <el-table-column
        label="答案一" 
        prop="answer1"
        >
      </el-table-column>

        <el-table-column
        label="答案二"
        prop="answer2"
        >
      </el-table-column>
      <el-table-column
        label="答案三" 
        prop="answer3"
        >
      </el-table-column>

      <el-table-column
        label="答案四" 
        prop="answer4"
        >
      </el-table-column>
      <!-- <el-table-column
        label="分类" 
        prop="classify_name"
        >
      </el-table-column> -->
      <el-table-column
        label="操作" 
        >
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="toDialogEdit(scope.$index)">编辑</el-button>
          <el-button size="mini" type="danger" @click="toDialogDelete(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-dialog>

        </template>
      </el-table-column>
    </el-table>
</el-main>
<!-- <el-footer>
  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
  </el-pagination>
</el-footer> -->
</el-container>
    </div>
    
</template>
<script>
import {
  getLibClassList,
  getShopList,
  grtLibList,
  postAddLibList,
  deleteLibIndexList,
  putEditClass,
  postAddToLib,
  getShopLibList,
  deleteDialong,
  putEditDialog,
  postGetLibFormShop,
  postImportList,
  getLibSearchClass
} from "@/api/answer";
import uploadFn from "@/utils/aahbs";

export default {
  created() {
    this.getShopList_api(1, 0);
    this.getClass(1, 0);
    this.getLibList_api(1, 0);
  },
  data() {
    return {
      classVal: "",
      isDialogCheck: false,
      isDialogCheck_copy: false,
      downloadLoading: false,

      dialogTableData: [],
      dialogTableData_copy: [], //从列表加到题库
      clickindex: null,
      isAddAws: false,

      dialogUP: false,
      // dialogCheck: false,

      editId: null,
      dialogFormVisible: false,
      isAdd: false,
      isDialogEdit: false,
      name: "",
      formLabelWidth: "100px",
      form: {
        name: "",
        value: "",
        awsA: "",
        awsB: "",
        awsC: "",
        awsD: "",
        aws: ""
      },
      options: [],
      tableData: [],
      fousid: null
    };
  },
  methods: {
    toSearchClass: function() {
      //按分类来搜索
      console.log(this.classVal);
      var classify_id = null;
      for (var i = 0; i < this.options.length; i++) {
        var obj = this.options[i];
        if (obj.label === this.classVal) {
          classify_id = obj.id;
        }
      }
      var data = {
        page: 1,
        limit: 0,
        classify_id: classify_id
      };
      getLibSearchClass(data).then(res => {
        console.log("class res", res);
        this.dialogTableData_copy = res.data;
      });
    },
    getLibList_api: function(page, limit) {
      var data = {
        page: page,
        limit: limit
      };
      grtLibList(data).then(res => {
        this.tableData = res.data;
      });
    },
    getClass: function(page, limit) {
      //获取所有分类
      var data = {
        page: page,
        limit: limit
      };
      getLibClassList(data).then(res => {
        console.log(res);
        for (var i = 0; i < res.data.length; i++) {
          var res_data = res.data[i];
          this.options.push({
            label: res_data.name,
            id: res_data.classify_id
          });
        }
      });
    },
    getFoucShopList: function(id) {
      this.fousid = id;
      //获取指定的题库题目
      var data = {
        page: 1,
        limit: 0,
        library_id: this.tableData[id].library_id
      };
      getShopLibList(data).then(res => {
        this.isDialogCheck = true;
        console.log(res.data);
        this.dialogTableData = res.data;
      });
    },
    getShopList_api: function(page, limit) {
      //获取题库题目list
      var data = {
        page: page,
        limit: limit
      };
      this.tableData = [];
      getShopList(data).then(res => {
        console.log(res.data);
        this.dialogTableData_copy = res.data;
      });
    },
    toClose: function() {
      //答案四关闭
      this.isAddAws = false;
      this.form.awsD = "";
    },
    toCheckEdit: function(command) {
      console.log("command", command);
      if (command === "up") {
        this.dialogUP = true;
        this.isDialogEdit = false;
        this.form = {
          name: "",
          value: "",
          awsA: "",
          awsB: "",
          awsC: "",
          awsD: "",
          aws: ""
        };
      } else {
        // this.dialogCheck = true;
        this.isDialogCheck_copy = true;
        for (var i = 0; i < this.dialogTableData_copy.length; i++) {
          this.dialogTableData_copy[i].disabled = true;
        }
      }
    },
    dropDown: function(index) {
      console.log("index", index);
      this.clickindex = index;
    },
    yesAddDiologUp: function() {
      var data = {
        library_id: this.tableData[this.clickindex].library_id,
        title: this.form.name,
        answer1: this.form.awsA,
        answer2: this.form.awsB,
        answer3: this.form.awsC,
        answer4: this.form.awsD,
        answers: this.form.aws
      };
      postAddToLib(data).then(res => {
        this.form = {
          name: "",
          value: "",
          awsA: "",
          awsB: "",
          awsC: "",
          awsD: "",
          aws: ""
        };
        this.dialogUP = false;
      });
    },
    toAddClass: function() {
      this.dialogFormVisible = true;
      this.isAdd = false;
      this.name = "";
    },
    yesClass: function() {
      var data = {
        name: this.name
      };
      postAddLibList(data).then(res => {
        console.log(res);
        this.dialogFormVisible = false;
        this.getLibList_api(1, 0);
      });
    },
    editClass: function() {
      // this.tableData[this.editId].name = this.name;
      var data = {
        name: this.name,
        library_id: this.tableData[this.editId].library_id
      };
      putEditClass(data).then(res => {
        this.dialogFormVisible = false;
        this.getLibList_api(1, 0);
        this.editId = null;
      });
    },
    toDelete: function(id) {
      var data = {
        library_id: this.tableData[id].library_id
      };
      deleteLibIndexList(data).then(res => {
        this.tableData.splice(id, 1);
        console.log(res);
      });
    },
    toEdit: function(id) {
      this.editId = id;
      this.dialogFormVisible = true;
      this.isAdd = true;
      this.name = this.tableData[id].name;
    },
    toDialogDelete: function(id) {
      //对话框删除
      console.log(this.dialogTableData[id].information_id);
      var data = {
        information_id: this.dialogTableData[id].information_id
      };
      deleteDialong(data).then(res => {
        console.log(res);
        this.dialogTableData.splice(id, 1);
      });
    },
    toDialogEdit: function(id) {
      //对话框编辑
      this.editId = id;
      this.dialogUP = true;
      this.isDialogEdit = true;
      this.isAddAws = true;

      this.form.name = this.dialogTableData[id].title;
      this.form.awsA = this.dialogTableData[id].answer1;
      // this.form.value = this.dialogTableData[id].title;
      this.form.awsB = this.dialogTableData[id].answer2;
      this.form.awsC = this.dialogTableData[id].answer3;
      this.form.awsD = this.dialogTableData[id].answer4;
      this.form.aws = this.dialogTableData[id].answers;
      // this.form.title = this.dialogTableData[id].title;
    },
    yestoDialogEdit: function() {
      var data = {
        library_id: this.tableData[this.fousid].library_id,
        title: this.form.name,
        answer1: this.form.awsA,
        answer2: this.form.awsB,
        answer3: this.form.awsC,
        answer4: this.form.awsD,
        answers: this.form.aws,
        information_id: this.dialogTableData[this.editId].information_id
      };
      putEditDialog(data).then(res => {
        this.form = {
          name: "",
          value: "",
          awsA: "",
          awsB: "",
          awsC: "",
          awsD: "",
          aws: ""
        };
        this.dialogUP = false;
        this.getFoucShopList(this.fousid);
      });
    },

    toDialogAdd: function(id) {
      this.dialogTableData_copy[id].disabled = false;
      var data = {
        question_id: this.dialogTableData_copy[id].question_id,
        library_id: this.tableData[this.clickindex].library_id
      };
      postGetLibFormShop(data).then(res => {
        this.dialogTableData_copy.splice(id, 1);
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    toExport: async function() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "题目",
          "答案一",
          "答案二",
          "答案三",
          "答案四",
          "正确答案"
        ];
        const filterVal = [
          "title",
          "answer1",
          "answer2",
          "answer3",
          "answer4",
          "answers"
        ];
        const tableDataAll = this.dialogTableData;
        const data = this.formatJson(filterVal, tableDataAll);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "题库题目列表"
        });
        this.downloadLoading = false;
      });
    },
    async addSomeList(file, fileList) {
      console.log("change", file);
      var url = await uploadFn(file.raw);
      console.log("url", url[0]);
      var data = {
        url: url[0]
      };
      postImportList(data)
        .then(res => {
          console.log("res", res);
          // this.getShopList_api(1, 0);
        })
        .catch(err => {
          console.log("err", err);
          // this.getShopList_api(1, 0);
        });
    }
  }
};
</script>