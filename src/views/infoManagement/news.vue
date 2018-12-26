<style scoped="scoped">
.graphic {
  border: solid #d5dbe7 1px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 30px 0;
}
.detial_content {
  border-bottom: solid 1px #f7f7f7;
  display: flex;
  padding-top: 20px;
}
.detial_content > div:first-child {
  min-width: 200px;
}
.company-video {
  width: 300px;
  height: 150px;
}
</style>
<template>
  <div class="app-container">
    <!--预览图片开始 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
    <!--顶部菜单开始 -->
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="CreateItem"
      >添加</el-button>
    </div>
    <!--顶部菜单结束 -->
    <!--中间表格开始 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="新闻标题" prop="information_title"></el-table-column>
      <el-table-column label="新闻图片" prop="information_image">
        <template slot-scope="scope">
          <img
            :key="item"
            @click="handlePictureCardPreview(item)"
            v-for="item in scope.row.information_image"
            :src="item"
            style="width:80px;margin-right: 10px;"
          >
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="label"></el-table-column>
      <el-table-column label="添加时间" prop="addtime"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-footer>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-footer>
    <!--中间表格结束 -->
    <!--内容弹框开始 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="90%">
      <el-form :rules="rules" ref="form" :model="form" label-width="120px">
        <el-form-item label="分类">
          <el-select v-model="category" placeholder="请选择" @change="handleSelect">
            <el-option
              v-for="item in categoryStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新闻标题" prop="information_title">
          <el-input v-model="form.information_title" placeholder="请输入新闻标题"></el-input>
        </el-form-item>
        <el-form-item label="新闻图片" prop="information_image">
          <el-upload
            action
            list-type="picture-card"
            accept="image/*"
            :limit="1"
            :auto-upload="false"
            :file-list="form.information_image | filterUrl"
            :on-change="handleImgChange"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemoveOne"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="新闻内容">
          <editor
            style="width: 100%; height:600px;"
            v-model="form.information_content"
            :menubar="editorConfig.menu"
            :height="500"
            v-if="dialogFormVisible"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit(form)"
            :disabled="isUpimg"
            :loading="isloading"
          >保存</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 内容弹框结束-->
  </div>
</template>
<script>
import {
  addInformation_api,
  getInformation_api,
  deleteInformation_api,
  putInformation_api
} from "@/api/seller";
import uploadFn from "@/utils/tencent_cos";
import config from "@/utils/config";
const form = {
  classify_id: null,
  information_title: "",
  information_content: "",
  information_image: []
};
import Moment from "@/utils/moment";
export default {
  mixins: [config],
  created() {
    //获取首页列表
    this.dynamicList();
  },
  filters: {
    //这里进行加入url到Ui框架
    filterUrl: function(value) {
      let arr = [];
      // console.log(value)
      if (!Array.isArray(value)) {
        arr.push({
          url: value
        }),
          (value = arr);
      } else {
        for (let i = 0; i < value.length; i++) {
          if (!value[i].url) {
            value[i] = {
              url: value[i]
            };
          }
        }
      }
      //console.log("过滤的")
      //console.log(value)
      return value;
    }
  },
  data() {
    return {
      //新闻列表
      tableData: [
        {
          information_image: [],
          information_title: ""
        }
      ],
      //弹框动态详情
      formObjRepeat: [
        {
          Repeat_images: [],
          Repeat_title: ""
        }
      ],
      //动态模块当前索引
      moddele_idx: "",
      //分页（请求参数）
      listQuery: {
        page: 1,
        limit: 10
      },
      //总条数
      total: 0,
      //判断弹框是新增还是编辑
      textMap: {
        edit: "编辑",
        create: "添加"
      },
      //默认弹框隐藏
      dialogFormVisible: false,
      //弹框状态
      dialogStatus: "",
      //表单内容
      form: Object.assign({}, form),
      //图片预览弹框是否打开
      dialogVisible: false,
      //要预览的图片
      dialogImageUrl: "",
      //表单验证规则
      rules: {
        information_title: [
          {
            required: true,
            message: "请输入新闻名称",
            trigger: "blur"
          },
          {
            min: 1,
            max: 20,
            message: "长度在1到20个字"
          }
        ],
        information_image: [
          {
            required: true,
            message: "请传1至3张图片",
            trigger: "change"
          }
        ]
      },
      //正在保存
      isloading: false,
      //正在上传图片
      isUpimg: false,
      editId: null,
      categoryStateOptions: [
        {
          value: "",
          label: "无"
        },
        {
          value: 1,
          label: "分类一"
        },
        {
          value: 2,
          label: "分类二"
        },
        {
          value: 3,
          label: "分类三"
        }
      ],
      category: ""
    };
  },
  methods: {
    //新增
    CreateItem() {
      this.category = "";
      this.dialogFormVisible = true; //打开内容弹框
      this.dialogStatus = "create";
      this.form = Object.assign({}, form);
    },
    //上传图片
    async handleImgChange(file, fileList) {
      this.isUpimg = true;
      let imgurl = await uploadFn(file.raw);
      this.isUpimg = false;
      this.form.information_image.push({
        url: imgurl[0]
      });
    },
    //预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //删除图片
    handleRemoveOne(file, fileList) {
      this.form.information_image = [];
    },
    //保存内容
    onSubmit(form) {
      console.log(this.$refs);
      this.isloading = true;
      // return
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.isloading = false;
          this.addDynamic();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //编辑对应项
    handleEdit(row) {
      this.form = Object.assign({}, row);
      this.dialogStatus = "edit";
      this.categoryStateOptions.forEach(item => {
        if (item.value == row.classify_id) {
          this.category = item.label;
        }
      });
      this.editId = row.information_id;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
    //删除
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该新闻信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log(row);
          this.deleteDynamic(row.information_id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //改变每页条数
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.dynamicList();
    },
    //选择哪一页
    handleCurrentChange(val) {
      console.log(val);
      this.listQuery.page = val;
      this.dynamicList();
    },
    //以下为api操作
    //获取新闻列表
    dynamicList() {
      let sendData = Object.assign({}, this.listQuery);
      console.log(sendData);
      getInformation_api(sendData).then(res => {
        if (res.status == 0) {
          this.total = res.pagination.total;
          res.data.forEach(item => {
            item.addtime = Moment(item.addtime * 1000).format(
              "yyyy-MM-dd HH:mm:ss"
            );
            item.information_image = JSON.parse(item.information_image);
            this.categoryStateOptions.forEach(itemOptions => {
              if (itemOptions.value == item.classify_id) {
                item.label = itemOptions.label;
              }
            });
          });
          this.tableData = res.data;
        }
      });
    },
    delUrlfun(e) {
      let arr = [];
      for (let i = 0; i < e.length; i++) {
        arr.push(e[i].url);
      }
      return arr;
    },
    //新增/编辑新闻
    addDynamic() {
      let sendData = {};
      for (let key in this.form) {
        if (key == "information_image") {
          this.form.information_image = this.delUrlfun(this.form.information_image);
          sendData[key] = JSON.stringify(this.form.information_image);
        } else {
          sendData[key] = this.form[key];
        }
      }

      if (this.dialogStatus === "create") {
        addInformation_api(sendData).then(res => {
          if (res.status == 0) {
            this.dialogFormVisible = false;
            this.isloading = false;
            this.$notify({
              title: "成功",
              message: "保存成功",
              type: "success",
              duration: 2000
            });
            this.dynamicList();
          }
        });
      } else if (this.dialogStatus === "edit") {
        putInformation_api(this.editId, sendData).then(res => {
          if (res.status == 0) {
            this.dialogFormVisible = false;
            this.isloading = false;
            this.$notify({
              title: "成功",
              message: "保存成功",
              type: "success",
              duration: 2000
            });
            this.dynamicList();
          }
        });
      }
    },
    //删除新闻
    deleteDynamic(id) {
      deleteInformation_api(id).then(res => {
        if (res.status == 0) {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000
          });
          this.dynamicList();
        }
      });
    },
    handleSelect(e) {
      console.log("列表状态");
      console.log(e);
      this.form.classify_id = e;
    }
  }
};
</script>
