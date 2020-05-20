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
    <el-button type="primary" icon="el-icon-edit" @click="toAddSubject">添加题目</el-button>
    <!-- <el-button type="primary" icon="document" @click="toGetSubList">批量导入</el-button> -->
    <el-upload
      :auto-upload="false"
      action=""
      :on-change="handlePicture"
      :limit="1"
      :show-file-list="false">
      <el-button style="margin:0px 10px 0 10px;" type="primary">批量导入</el-button>
    </el-upload>
    <!-- <upload-excel-component :on-success='handleSuccess'></upload-excel-component> -->

    <el-button type="primary" icon="document" :loading="downloadLoading" @click="toExport">导出</el-button>
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
        <el-button slot="append" icon="el-icon-search" @click="toSearchTitle"></el-button>
    </div>
    <div style="width:20px;height: 30px;"></div>

    <el-select v-model="classVal" value-key="id" placeholder="请选择" @change="toSearchClass">
      <el-option v-for="(item,index) in options" :label="item.label" :key="item.id"  :value="item.label"></el-option>
    </el-select>
        <!-- <div style="width:1px;height: 30px;"></div>
    <el-button slot="append" icon="el-icon-search" @click="toSearchClass"></el-button> -->

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
        prop="awsA"
        >
      </el-table-column>

        <el-table-column
        label="答案二"
        prop="awsB"
        >
      </el-table-column>
      <el-table-column
        label="答案三" 
        prop="awsC"
        >
      </el-table-column>

      <el-table-column
        label="答案四" 
        prop="awsD"
        >
      </el-table-column>
      <el-table-column
        label="分类" 
        prop="class"
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
<!-- <el-footer>
  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
  </el-pagination>
</el-footer> -->
</el-container>
    </div>
    
</template>
<script>
import {
  getLibList,
  postLibSearchTitle,
  getLibClassList,
  getLibSearchClass,
  deleteLibList,
  postLibAddList,
  putLibEditList,
  postImportLib
} from "@/api/libraryList";
import uploadFn from "@/utils/aahbs";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";

export default {
  components: { UploadExcelComponent },
  created() {
    this.getLibraryList_api();
    this.getClass();
  },
  data() {
    return {
      inputFile: "",
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
      tableData: []
    };
  },
  methods: {
    getLibraryList_api: function(page, limit) {
      var data = {
        page: 1,
        limit: 0
      };
      getLibList(data).then(res => {
        console.log("res", res);
        for (var i = 0; i < res.data.length; i++) {
          var res_data = res.data[i];
          this.tableData.push({
            id: res_data.topic_id,
            title: res_data.title,
            awsA: res_data.answer1,
            awsB: res_data.answer2,
            awsC: res_data.answer3,
            awsD: res_data.answer4,
            aws: res_data.answers,
            class: res_data.classify_name
          });
        }
      });
    },
    getClass: function() {
      var data = {
        page: 1,
        limit: 0
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
    toSearchTitle: function() {
      var data = { title: this.inputTitle };
      postLibSearchTitle(data).then(res => {
        console.log(res.data);
        this.tableData = [];
        for (var i = 0; i < res.data.length; i++) {
          var res_data = res.data[i];
          this.tableData.push({
            id: res_data.topic_id,
            title: res_data.title,
            awsA: res_data.answer1,
            awsB: res_data.answer2,
            awsC: res_data.answer3,
            awsD: res_data.answer4,
            aws: res_data.answers,
            class: res_data.classify_name
          });
        }
      });
    },
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
        classify_id: classify_id
      };
      getLibSearchClass(data).then(res => {
        console.log(res);
        this.tableData = [];
        for (var i = 0; i < res.data.length; i++) {
          var res_data = res.data[i];
          this.tableData.push({
            id: res_data.topic_id,
            title: res_data.title,
            awsA: res_data.answer1,
            awsB: res_data.answer2,
            awsC: res_data.answer3,
            awsD: res_data.answer4,
            aws: res_data.answers,
            class: res_data.classify_name
          });
        }
      });
    },
    toAddSubject: function() {
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
      console.log(this.form.value);
      var classify_id = null;
      for (var i = 0; i < this.options.length; i++) {
        var obj = this.options[i];
        if (obj.label === this.form.value) {
          classify_id = obj.id;
        }
      }
      this.dialogFormVisible = false;
      var data = {
        title: this.form.name,
        answer1: this.form.awsA,
        answer2: this.form.awsB,
        answer3: this.form.awsC,
        answer4: this.form.awsD,
        answers: this.form.aws,
        classify_id: classify_id
      };
      postLibAddList(data).then(res => {
        console.log(res);
        this.tableData = [];
        this.getLibraryList_api();
      });
    },
    yesEdit: function() {
      this.dialogFormVisible = false;
      var edited = this.tableData[this.editId].id;
      console.log(edited);
      var classify_id = null;
      for (var i = 0; i < this.options.length; i++) {
        var obj = this.options[i];
        if (obj.label === this.form.value) {
          classify_id = obj.id;
        }
      }
      var data = {
        title: this.form.name,
        classify_id: classify_id,
        answer1: this.form.awsA,
        answer2: this.form.awsB,
        answer3: this.form.awsC,
        answer4: this.form.awsD,
        answers: this.form.aws,
        topic_id: edited
      };
      putLibEditList(data).then(res => {
        console.log("edit res", res);
        this.tableData = [];
        this.getLibraryList_api();
      });
    },
    toGetSubList: function() {
      this.inputFile = document.getElementById("fileId").files[0];
      console.log(this.inputFile);
      var data = {
        file: document.getElementById("fileId").files[0]
      };
      console.log("data", data);
      postImportLib(data).then(res => {
        console.log(res);
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
          "分类",
          "答案一",
          "答案二",
          "答案三",
          "答案四",
          "正确答案"
        ];
        const filterVal = [
          "title",
          "class",
          "awsA",
          "awsB",
          "awsC",
          "awsD",
          "aws"
        ];
        const tableDataAll = this.tableData;
        const data = this.formatJson(filterVal, tableDataAll);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "平台题库列表"
        });
        this.downloadLoading = false;
      });
    },

    toClose: function() {
      this.isAddAws = false;
      this.form.awsD = "";
    },
    toEdit(id) {
      this.editId = id;
      this.dialogFormVisible = true;
      this.isAddAws = true;
      this.isShowEdit = true;

      var list = this.tableData[id];
      this.form.name = list.title;
      this.form.value = list.class;
      this.form.awsA = list.awsA;
      this.form.awsB = list.awsB;
      this.form.awsC = list.awsC;
      this.form.awsD = list.awsD;
      this.form.aws = list.aws;
    },
    toDelete(id) {
      var data = {
        topic_id: this.tableData[id].id
      };
      deleteLibList(data).then(res => {
        console.log(res);
      });
      this.tableData.splice(id, 1);
    },
    async handlePicture(file, fileList) {
      console.log("change", file);
      var url = await uploadFn(file.raw);
      console.log("url", url[0]);
      var data = {
        url: url[0]
      };
      postImportLib(data)
        .then(res => {
          console.log("resss!!", res);
          this.tableData = [];
          this.getLibraryList_api();
        })
        .catch(err => {
          // this.$notify.error({
          //   title: "上传出错",
          //   message: "请刷新后重新上传文件"
          // });
          console.log("resss", err);
          this.tableData = [];
          this.getLibraryList_api();
        });
    },
    async handleSuccess({ results, header }) {
      console.log(results);
      console.log(header);
      let data = {
        excel: results
      };
      postImportLib(data)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          this.$notify.error({
            title: "上传出错",
            message: "请刷新后重新上传文件"
          });
        });
    }
  }
};
</script>