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

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<template>
    <div class="div">
<div class="el-div">
    <el-button type="primary" icon="el-icon-edit" @click="toAddClass">新增房间</el-button>

    <el-dialog title="添加房间" :visible.sync="dialogFormVisible">
        <el-form  class="el-form" :model="form">
            <el-form-item label="题库">
                <el-select :disabled="isAdd" v-model="form.libName" value-key="id" placeholder="请选择" @change="changeLibNum($event)">
                  <el-option v-for="item in options" :label="item.name" :key="item.id"  :value="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="题库数量">
                <el-input v-model="libNum" :disabled="true" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="答题数量">
                <el-input v-model="form.awsNum" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="每题费用">
                <el-input v-model="form.cost" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="活动规则">
              <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 5}"
                placeholder="请输入内容"
                v-model="form.rule">
              </el-input>
            </el-form-item>

            <el-form-item label="奖品">
              <el-input v-model="form.domains[0].value" auto-complete="off"></el-input>
              <div style="margin: 20px 0;"></div>
              <el-upload
                    :multiple="false"
                    :auto-upload="false"
                    action=""
                    :on-change="handlePicture0"
                    list-type="picture-card"
                    :on-remove="handleRemove0"
                    :file-list="imgUrl1">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <!-- <el-form-item label="奖品二">
              <el-input v-model="form.domains[1].value" auto-complete="off"></el-input>
              <div style="margin: 20px 0;"></div>
              <el-upload
                    :auto-upload="false"
                    action=""
                    list-type="picture-card"
                    :file-list="imgUrl2"
                    :on-change="handlePicture1"
                    :on-remove="handleRemove1"
                    :on-success="handUpSuccess">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="奖品三">
              <el-input v-model="form.domains[2].value" auto-complete="off"></el-input>
              <div style="margin: 20px 0;"></div>
              <el-upload
                    :auto-upload="false"
                    action=""
                    list-type="picture-card"
                    :file-list="imgUrl3"
                    :on-change="handlePicture2"
                    :on-remove="handleRemove2"
                    :on-success="handUpSuccess">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="奖品四">
              <el-input v-model="form.domains[3].value" auto-complete="off"></el-input>
              <div style="margin: 20px 0;"></div>
              <el-upload
                    :auto-upload="false"
                    action=""
                    list-type="picture-card"
                    :file-list="imgUrl4"
                    :on-change="handlePicture3"
                    :on-remove="handleRemove3"
                    :on-success="handUpSuccess">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="奖品五">
              <el-input v-model="form.domains[4].value" auto-complete="off"></el-input>
              <div style="margin: 20px 0;"></div>
              <el-upload
                    :auto-upload="false"
                    action=""
                    list-type="picture-card"
                    :file-list="imgUrl5"
                    :on-change="handlePicture4"
                    :on-remove="handleRemove4"
                    :on-success="handUpSuccess">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item> -->
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
        label="选用题库" 
        prop="library_name"
        >
      </el-table-column>
      <el-table-column
        label="每题费用" 
        prop= "cost"
        >
      </el-table-column>
      <el-table-column
        label="操作" 
        >
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="toEdit(scope.$index)">编辑</el-button>
          <el-button size="mini" type="danger" v-if="tableData[scope.$index].switch === 0" @click="toStop(scope.$index)">停用</el-button>
          <el-button size="mini" type="primary" v-if="tableData[scope.$index].switch === 1" @click="toStart(scope.$index)">启用</el-button>
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
  getPayRoomList,
  grtLibList,
  postAddPayRoom,
  deletePayRoom,
  putStopPayRoom,
  putEditPayRoom
} from "@/api/answer";
import uploadFn from "@/utils/aahbs";

export default {
  created() {
    this.getList_api(1, 0);
    this.getLibList_api(1, 0);
  },
  data() {
    return {
      imgUrl1: [],
      imgUrl2: [],
      imgUrl3: [],
      imgUrl4: [],
      imgUrl5: [],

      clickData: null,
      dialogImageUrl: "",
      libNum: "",
      editId: null,
      dialogFormVisible: false,
      dialogVisible: false,
      isAdd: false,
      form: {
        cost: "",
        libName: "",
        awsNum: "",
        rule: "",
        domains: [
          {
            value: "",
            imageUrl: ""
          },
          {
            value: "",
            imageUrl: ""
          },
          {
            value: "",
            imageUrl: ""
          },
          {
            value: "",
            imageUrl: ""
          },
          {
            value: "",
            imageUrl: ""
          }
        ]
      },
      formLabelWidth: "150px",
      tableData: [],
      options: [],
      urlArr: []
    };
  },
  methods: {
    getLibList_api: function(page, limit) {
      //题库列表
      var data = {
        page: page,
        limit: limit
      };
      grtLibList(data).then(res => {
        this.options = res.data;
        console.log("class", res.data);
      });
    },
    getList_api: function(page, limit) {
      //房间列表
      var data = {
        page: page,
        limit: limit
      };
      getPayRoomList(data).then(res => {
        console.log(res.data);
        this.tableData = res.data;
      });
    },
    toAddClass: function() {
      //新增房间入口
      this.imgUrl1 = [];
      // this.imgUrl2 = [];
      // this.imgUrl3 = [];
      // this.imgUrl4 = [];
      // this.imgUrl5 = [];
      this.dialogFormVisible = true;
      this.isAdd = false;
      this.libNum = "";
      this.form.cost = "";
      this.form.libName = "";
      this.form.awsNum = "";
      this.form.rule = "";
      this.form.domains[0].value = "";
      this.form.domains[0].imageUrl = [];
      // this.form.domains[1].value = "";
      // this.form.domains[1].imageUrl = [];
      // this.form.domains[2].value = "";
      // this.form.domains[2].imageUrl = [];
      // this.form.domains[3].value = "";
      // this.form.domains[3].imageUrl = [];
      // this.form.domains[4].value = "";
      // this.form.domains[4].imageUrl = [];
    },
    upImg: async function() {
      var prize = [];
      for (var i = 0; i < 5; i++) {
        if (this.urlArr[i] != "") {
          let src = await uploadFn(this.urlArr[i]);
          prize[i] = src;
        }
      }
      console.log("prize", prize[0][0]);
    },
    yesClass: function() {
      //对话框下角的确定添加按钮
      console.log("form", this.form);
      var library_id = null;
      for (var i = 0; i < this.options.length; i++) {
        if (this.form.libName === this.options[i].name) {
          library_id = this.options[i].library_id;
        }
      }

      var data = {
        cost: this.form.cost,
        library_id: Number(library_id),
        number: Number(this.form.awsNum),
        regulation: this.form.rule,
        prize1: JSON.stringify({
          name: this.form.domains[0].value,
          url: this.form.domains[0].imageUrl
        }),
        prize2: JSON.stringify({
          name: this.form.domains[1].value,
          url: this.form.domains[1].imageUrl
        }),
        prize3: JSON.stringify({
          name: this.form.domains[2].value,
          url: this.form.domains[2].imageUrl
        }),
        prize4: JSON.stringify({
          name: this.form.domains[3].value,
          url: this.form.domains[3].imageUrl
        }),
        prize5: JSON.stringify({
          name: this.form.domains[4].value,
          url: this.form.domains[4].imageUrl
        })
      };
      console.log("data", data);
      postAddPayRoom(data).then(res => {
        console.log("res sss", res);
        this.$message(res.error);
        this.dialogFormVisible = false;
        this.getList_api(1, 0);
      });
    },
    editClass: function() {
      //对话框确定编辑
      // console.log("editClassID", this.editId);
      var library_id = null;
      for (var i = 0; i < this.options.length; i++) {
        if (this.form.libName === this.options[i].name) {
          library_id = this.options[i].library_id;
        }
      }

      var data = {
        apartment_id: this.tableData[this.editId].apartment_id,
        cost: Number(this.form.cost),
        library_id: Number(library_id),
        number: Number(this.form.awsNum),
        regulation: this.form.rule,
        prize1: JSON.stringify({
          name: this.form.domains[0].value,
          url: this.form.domains[0].imageUrl
          // url: this.imgUrl1
        }),
        prize2: JSON.stringify({
          name: this.form.domains[1].value,
          url: this.form.domains[1].imageUrl
          // url: this.imgUrl2
        }),
        prize3: JSON.stringify({
          name: this.form.domains[2].value,
          url: this.form.domains[2].imageUrl
          // url: this.imgUrl3
        }),
        prize4: JSON.stringify({
          name: this.form.domains[3].value,
          url: this.form.domains[3].imageUrl
          // url: this.imgUrl4
        }),
        prize5: JSON.stringify({
          name: this.form.domains[4].value,
          url: this.form.domains[4].imageUrl
          // url: this.imgUrl5
        })
      };
      console.log("editdata", data);

      console.log(this.imgUrl1);
      // console.log(this.imgUrl2);
      // console.log(this.imgUrl3);
      // console.log(this.imgUrl4);
      // console.log(this.imgUrl5);
      console.log(this.form.domains[0].imageUrl);
      // console.log(this.form.domains[1].imageUrl);
      // console.log(this.form.domains[2].imageUrl);
      // console.log(this.form.domains[3].imageUrl);
      // console.log(this.form.domains[4].imageUrl);

      putEditPayRoom(data).then(res => {
        console.log("ressss",res);
        this.dialogFormVisible = false;
        this.getList_api(1, 0);
      });
    },
    toDelete: function(id) {
      //列表单条删除
      var data = {
        apartment_id: this.tableData[id].apartment_id
      };
      deletePayRoom(data).then(res => {
        this.tableData.splice(id, 1);
      });
    },
    toEdit: function(id) {
      // 列表单条编辑
      this.imgUrl1 = [];
      // this.imgUrl2 = [];
      // this.imgUrl3 = [];
      // this.imgUrl4 = [];
      // this.imgUrl5 = [];
      for (var i = 0; i < this.options.length; i++) {
        if (this.tableData[id].library_id === this.options[i].library_id) {
          this.libNum = this.options[i].number;
        }
      }
      this.editId = id;
      this.dialogFormVisible = true;
      this.isAdd = true;
      this.form.cost = this.tableData[id].cost;
      this.form.libName = this.tableData[id].library_name;
      this.form.awsNum = this.tableData[id].number;
      this.form.rule = this.tableData[id].regulation;
      this.form.domains[0].value = JSON.parse(this.tableData[id].prize1).name;

      // this.form.domains[1].value = JSON.parse(this.tableData[id].prize2).name;
      // this.form.domains[2].value = JSON.parse(this.tableData[id].prize3).name;
      // this.form.domains[3].value = JSON.parse(this.tableData[id].prize4).name;
      // this.form.domains[4].value = JSON.parse(this.tableData[id].prize5).name;

      this.imgUrl1 =
        JSON.parse(this.tableData[id].prize1).url != ""
          ? [JSON.parse(this.tableData[id].prize1)]
          : [];
      // this.imgUrl2 =
      //   JSON.parse(this.tableData[id].prize2).url != ""
      //     ? [JSON.parse(this.tableData[id].prize2)]
      //     : [];
      // this.imgUrl3 =
      //   JSON.parse(this.tableData[id].prize3).url != ""
      //     ? [JSON.parse(this.tableData[id].prize3)]
      //     : [];
      // this.imgUrl4 =
      //   JSON.parse(this.tableData[id].prize4).url != ""
      //     ? [JSON.parse(this.tableData[id].prize4)]
      //     : [];
      // this.imgUrl5 =
      //   JSON.parse(this.tableData[id].prize5).url != ""
      //     ? [JSON.parse(this.tableData[id].prize5)]
      //     : [];
      console.log(JSON.parse(this.tableData[id].prize1));
      // console.log(JSON.parse(this.tableData[id].prize2));
      // console.log(JSON.parse(this.tableData[id].prize3));
      // console.log(JSON.parse(this.tableData[id].prize4));
      // console.log(JSON.parse(this.tableData[id].prize5));

      console.log("e imgurl", this.imgUrl1);
      // console.log("e imgurl", this.imgUrl2);
      // console.log("e imgurl", this.imgUrl3);
      // console.log("e imgurl", this.imgUrl4);
      // console.log("e imgurl", this.imgUrl5);

      this.form.domains[0].imageUrl =
        this.imgUrl1.length === 1 ? this.imgUrl1[0].url : "";
      // this.form.domains[1].imageUrl =
      //   this.imgUrl2.length === 1 ? this.imgUrl2[0].url : "";
      // this.form.domains[2].imageUrl =
      //   this.imgUrl3.length === 1 ? this.imgUrl3[0].url : "";
      // this.form.domains[3].imageUrl =
      //   this.imgUrl4.length === 1 ? this.imgUrl4[0].url : "";
      // this.form.domains[4].imageUrl =
      //   this.imgUrl5.length === 1 ? this.imgUrl5[0].url : "";
    },
    toStop: function(id) {
      //列表停用
      var data = {
        apartment_id: this.tableData[id].apartment_id,
        switch: 1
      };
      putStopPayRoom(data).then(res => {
        this.$message({
          showClose: true,
          message: "房间停止成功",
          type: "success"
        });
        this.tableData[id].switch = 0;
        this.getList_api(1, 0);
      });
    },
    toStart: function(id) {
      //列表启用
      var data = {
        apartment_id: this.tableData[id].apartment_id,
        switch: 0
      };
      putStopPayRoom(data).then(res => {
        this.$message({
          showClose: true,
          message: "房间启用成功",
          type: "success"
        });
        this.tableData[id].switch = 1;
        this.getList_api(1, 0);
      });
    },
    removeDomain(item) {
      //删除奖品选项
      var index = this.form.domains.indexOf(item);
      if (index != -1) {
        this.form.domains.splice(index, 1);
      }
    },
    addDomain() {
      //添加奖品
      this.form.domains.push({
        value: "",
        key: Date.now(),
        imageUrl: ""
      });
    },
    changeLibNum: function(event) {
      console.log(event);
      for (var i = 0; i < this.options.length; i++) {
        if (event === this.options[i].name) {
          this.libNum = this.options[i].number;
          console.log(this.libNum);
        }
      }
    },

    handleRemove0(file, fileList) {
      console.log(file, fileList);
      this.form.domains[0].imageUrl = "";
    },
    handleRemove1(file, fileList) {
      console.log(file, fileList);
      this.form.domains[1].imageUrl = "";
    },
    handleRemove2(file, fileList) {
      console.log(file, fileList);
      this.form.domains[2].imageUrl = "";
    },
    handleRemove3(file, fileList) {
      console.log(file, fileList);
      this.form.domains[3].imageUrl = "";
    },
    handleRemove4(file, fileList) {
      console.log(file, fileList);
      this.form.domains[4].imageUrl = "";
    },

    async handlePicture0(file, fileList) {
      console.log("change0", file);
      this.urlArr[0] = file.raw;
      this.form.domains[0].imageUrl = (await uploadFn(file.raw))[0];
    },
    async handlePicture1(file, fileList) {
      console.log("change1", file);
      this.urlArr[1] = file.raw;
      this.form.domains[1].imageUrl = (await uploadFn(file.raw))[0];
    },
    async handlePicture2(file, fileList) {
      console.log("change2", file);
      this.urlArr[2] = file.raw;
      this.form.domains[2].imageUrl = (await uploadFn(file.raw))[0];
    },
    async handlePicture3(file, fileList) {
      console.log("change3", file);
      this.urlArr[3] = file.raw;
      this.form.domains[3].imageUrl = (await uploadFn(file.raw))[0];
    },
    async handlePicture4(file, fileList) {
      console.log("change4", file);
      this.urlArr[4] = file.raw;
      this.form.domains[4].imageUrl = (await uploadFn(file.raw))[0];
    },
    handUpSuccess: function(response, file, fileList) {
      console.log("fileList", fileList);
      console.log("file", file);
    }
  }
};
</script>