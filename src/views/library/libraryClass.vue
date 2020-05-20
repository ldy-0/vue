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
    <el-button type="primary" icon="el-icon-edit" @click="toAddClass">添加分类</el-button>

    <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
        <el-form  class="el-form">
            <el-form-item label="分类">
                <el-input v-model="name" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogFormVisible = false">取 消</el-button> -->
            <el-button type="primary" v-if="!isAdd" @click="yesClass">添 加</el-button>
            <el-button type="primary" v-if="isAdd" @click="editClass">编 辑</el-button>
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
        label="分类" 
        prop="name"
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
  getClassList,
  postAddClass,
  putEditClass,
  deleteClassList
} from "@/api/libraryList";

export default {
  created() {
    this.getClassList_api();
  },
  data() {
    return {
      editId: null,
      dialogFormVisible: false,
      isAdd: false,
      name: "",
      formLabelWidth: "80px",
      tableData: []
    };
  },
  methods: {
    getClassList_api: function(page, limit) {
      var data = {
        page: 1,
        limit: 0
      };
      getClassList(data).then(res => {
        console.log("class list res", res.data);
        this.tableData = [];
        this.tableData = res.data;
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
      postAddClass(data).then(res => {
        console.log("add", res);
        this.getClassList_api();
        this.dialogFormVisible = false;
      });
    },
    toDelete: function(id) {
      console.log(this.tableData[id].classify_id);
      var data = {
        classify_id: this.tableData[id].classify_id
      };
      deleteClassList(data).then(res => {
        console.log(res);
        this.tableData.splice(id, 1);
      });
    },
    toEdit: function(id) {
      this.editId = id;
      this.dialogFormVisible = true;
      this.isAdd = true;
      this.name = this.tableData[id].name;
      console.log("tab", this.tableData);
    },
    editClass: function() {
      console.log("editClassID", this.editId);
      this.tableData[this.editId].name = this.name;
      var data = {
        name: this.tableData[this.editId].name,
        classify_id: this.tableData[this.editId].classify_id
      };
      putEditClass(data).then(res => {
        console.log(res);
        this.dialogFormVisible = false;
      });
    }
  }
};
</script>