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
    <!-- <el-button type="primary" icon="el-icon-edit" @click="toAddSubject">添加题目</el-button> -->
    <el-dropdown @command="toCheckEdit">
            <el-button type="primary">添加题目<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="up">单独上传</el-dropdown-item>
              <el-dropdown-item command="check">从列表选择</el-dropdown-item>
            </el-dropdown-menu>
    </el-dropdown>
    <div style="width:20px;height: 30px;"></div>

    <el-upload
      :auto-upload="false"
      action=""
      :on-change="addSomeList"
      :limit="1"
      :show-file-list="false">
      <el-button style="margin:0px 10px 0 10px;" type="primary">批量导入</el-button>
    </el-upload>

    <el-button type="primary" icon="document" :loading="downloadLoading" @click="toExport">导出</el-button>
    
    <el-dialog title="从列表选择" :visible.sync="isDialogCheck">
      <el-select v-model="classVal" value-key="id" placeholder="请选择" @change="toSearchClass">
        <el-option v-for="(item,index) in options" :label="item.label" :key="item.id"  :value="item.label"></el-option>
      </el-select>
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
      <el-table-column
        label="分类" 
        prop="classify_name"
        >
      </el-table-column>
      <el-table-column
        label="操作" 
        >
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toDialogAdd(scope.$index,scope)">添加</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-dialog>

    <el-dialog title="添加题目" :visible.sync="dialogFormVisible">
        <el-form :model="form" class="el-form">
            <el-form-item label="题目">
                <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="分类" >
            <el-select v-model="form.value" value-key="id" placeholder="请选择">
                <el-option v-for="item in options" :label="item.label" :key="item.id"  :value="item.label"></el-option>
            </el-select>
            </el-form-item>

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
        <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogFormVisible = false">取 消</el-button> -->
            <el-button type="primary" v-if="!isShowEdit"  @click="toYesAdd">确 定</el-button>
            <el-button type="primary" v-if="isShowEdit" @click="yesEdit">编 辑</el-button>
        </div>
    </el-dialog>
    <div style="width:20px;height: 30px;"></div>

    <div class="input-search">
        <el-input v-model="inputTitle" placeholder="题目搜索"></el-input>
        <div style="width:1px;height: 30px;"></div>
        <el-button slot="append" icon="el-icon-search" @click="searchTitle"></el-button>
    </div>
    <div style="width:20px;height: 30px;"></div>

    <!-- <el-select v-model="classVal" value-key="id" placeholder="请选择">
      <el-option v-for="item in options" :label="item.label" :key="item.id"  :value="item"></el-option>
    </el-select>
        <div style="width:1px;height: 30px;"></div>
    <el-button slot="append" icon="el-icon-search"></el-button> -->

    </div>

<el-container class="notice">
<el-main>
    <el-table
      :data="tableData"
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
          <el-button size="mini" type="info" @click="toEdit(scope.$index)">编辑</el-button>
          <el-button size="mini" type="danger" @click="toDelete(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
</el-main>
<el-footer>
  <el-pagination
    layout="prev, pager, next"
    :total="pageLength"
    :page-size="10"
     @current-change="handleCurrentChange">
  </el-pagination>
</el-footer>
</el-container>
    </div>
    
</template>
<script>
import {
  postSomeList,
  getLibClassList,
  getLibList,
  getShopList,
  postAddShopList,
  deleteShopList,
  putEditShopList,
  postLibSearchTitle,
  getSearchAwsClass
} from "@/api/answer";
import uploadFn from "@/utils/aahbs";

export default {
  created() {
    getShopList({
      page: 1,
      limit: 0
    }).then(res => {
      this.pageLength = res.data.length;
    });

    this.getShopList_api(1, 10);
    this.getClass(1, 0);
    this.getLibraryList_api(1, 0);
  },
  data() {
    return {
      pageLength: 0,
      isDialogCheck: false,
      downloadLoading: false,

      isShowEdit: false,
      editId: null,
      isAddAws: false,
      dialogFormVisible: false,
      form: {
        name: "",
        value: "",
        awsA: "",
        awsB: "",
        awsC: "",
        awsD: "",
        aws: ""
      },
      classVal: "",
      options: [],
      formLabelWidth: "120px",

      inputTitle: "",
      tableData: [],
      dialogTableData: []
    };
  },
  methods: {
    toSearchClass: function() {
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
      getSearchAwsClass(data).then(res => {
        console.log("res class", res);
        this.dialogTableData = res.data;
      });
    },
    handleCurrentChange: function(val) {
      // console.log(`当前页: ${val}`);
      this.getShopList_api(val, 10);
    },
    searchTitle: function() {
      var data = {
        title: this.inputTitle
      };
      postLibSearchTitle(data).then(res => {
        this.tableData = res.data;
      });
    },
    getLibraryList_api: function(page, limit) {
      var data = {
        page: page,
        limit: limit
      };
      getLibList(data).then(res => {
        this.dialogTableData = res.data;
      });
      for (var i = 0; i < this.dialogTableData.length; i++) {
        this.dialogTableData.primary = "primary";
      }
    },
    getShopList_api: function(page, limit) {
      //获取list
      var data = {
        page: page,
        limit: limit
      };
      this.tableData = [];
      getShopList(data).then(res => {
        console.log(res.data);
        this.tableData = res.data;
      });
    },
    getClass: function(page, limit) {
      //获取class
      var data = {
        page: page,
        limit: limit
      };
      getLibClassList(data).then(res => {
        console.log("getLibClassList", res);
        for (var i = 0; i < res.data.length; i++) {
          var res_data = res.data[i];
          this.options.push({
            label: res_data.name,
            id: res_data.classify_id
          });
        }
      });
    },
    toCheckEdit: function(command) {
      //添加题目
      if (command === "up") {
        this.toAddSubject();
      }
      if (command === "check") {
        this.isDialogCheck = true;
        this.primary = "primary";
      }
    },
    toDialogAdd: function(id, column) {
      //对话框里从列表添加
      console.log("column", column);
      // this.tableData.push(this.dialogTableData[id]);
      this.dialogTableData[id].primary = "warning";
      var data = this.dialogTableData[id];
      postAddShopList(data).then(res => {
        this.getShopList_api(1, 0);
        this.dialogTableData.splice(id, 1);
      });
    },
    toAddSubject: function() {
      //对话框里单独添加
      this.dialogFormVisible = true;
      this.isShowEdit = false;

      this.form.name = "";
      this.form.value = "";
      this.form.awsA = "";
      this.form.awsB = "";
      this.form.awsC = "";
      this.form.awsD = "";
      this.form.aws = "";
    },
    toYesAdd: function() {
      //确定单独添加题目
      var classify_id = null;
      for (var i = 0; i < this.options.length; i++) {
        if (this.form.value === this.options[i].label) {
          classify_id = this.options[i].id;
        }
      }
      var data = {
        title: this.form.name,
        answer1: this.form.awsA,
        answer2: this.form.awsB,
        answer3: this.form.awsC,
        answer4: this.form.awsD,
        answers: this.form.aws,
        classify_id: classify_id
      };
      postAddShopList(data).then(res => {
        this.dialogFormVisible = false;
        this.getShopList_api(1, 0);
      });
    },
    yesEdit: function() {
      //确定编辑
      var classify_id = null;
      for (var i = 0; i < this.options.length; i++) {
        if (this.form.value === this.options[i].label) {
          classify_id = this.options[i].id;
        }
      }
      var edited = this.tableData[this.editId].question_id;
      var data = {
        question_id: edited,
        title: this.form.name,
        answer1: this.form.awsA,
        answer2: this.form.awsB,
        answer3: this.form.awsC,
        answer4: this.form.awsD,
        answers: this.form.aws,
        classify_id: classify_id
      };
      putEditShopList(data).then(res => {
        this.dialogFormVisible = false;
        this.getShopList_api(1, 0);
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
      //导出
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "题目",
          "分类",
          "答案一",
          "答案二",
          "答案三",
          "答案四",
          "正确答案"
        ];
        const filterVal = [
          "title",
          "classify_name",
          "answer1",
          "answer2",
          "answer3",
          "answer4",
          "answers"
        ];
        const tableDataAll = this.tableData;
        const data = this.formatJson(filterVal, tableDataAll);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "商家题目列表"
        });
        this.downloadLoading = false;
      });
    },

    toClose: function() {
      //答案四关闭
      this.isAddAws = false;
      this.form.awsD = "";
    },
    toEdit(id) {
      //题目列表里的编辑操作
      this.editId = id;
      this.dialogFormVisible = true;
      this.isAddAws = true;
      this.isShowEdit = true;
      var list = this.tableData[id];
      this.form.name = list.title;
      this.form.value = list.classify_name;
      this.form.awsA = list.answer1;
      this.form.awsB = list.answer2;
      this.form.awsC = list.answer3;
      this.form.awsD = list.answer4;
      this.form.aws = list.answers;
    },
    toDelete(id) {
      //题目列表里的删除操作
      var question_id = this.tableData[id].question_id;
      var data = {
        question_id: question_id
      };
      deleteShopList(data).then(res => {
        console.log(res);
        this.tableData.splice(id, 1);
      });
    },
    async addSomeList(file, fileList) {
      console.log("change", file);
      var url = await uploadFn(file.raw);
      console.log("url", url[0]);
      var data = {
        url: url[0]
      };
      postSomeList(data)
        .then(res => {
          console.log("res", res);
          this.getShopList_api(1, 0);
        })
        .catch(err => {
          console.log("err", err);
          this.getShopList_api(1, 0);
        });
    }
  }
};
</script>