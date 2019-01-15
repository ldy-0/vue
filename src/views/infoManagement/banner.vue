<template>
  <div class="app-container">
    <!--预览图片开始 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
    <!--预览图片结束 -->
    <!--顶部菜单开始 -->
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="CreateItem"
      >添加图片</el-button>
    </div>
    <!--顶部菜单结束 -->
    <!--中间表格开始 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img
            @click="handlePictureCardPreview(scope.row)"
            :src="scope.row.banner_pic"
            style="width:100px"
          >
        </template>
      </el-table-column>
      <!-- 	<el-table-column label="标题" prop='banner_title'>
      </el-table-column>-->
      <el-table-column label="跳转类型" prop="label"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--中间表格结束 -->
    <!--内容弹框开始 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="form" :model="form" label-width="120px">
        <el-form-item label="图片" prop="banner_pic">
          <el-upload
            action
            list-type="picture-card"
            accept="image/*"
            :limit="1"
            :auto-upload="false"
            :file-list="form.banner_pic | filterUrl"
            :on-change="handleImgChange"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="排序序号" prop="banner_order">
          <el-input v-model="form.banner_order" placeholder="请输入排序序号0为最前，以此类推"></el-input>
        </el-form-item>
        <el-form-item label="跳转类型">
          <el-select v-model="category" placeholder="请选择" @change="handleSelect">
            <el-option
              v-for="item in categoryStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转图片" prop="banner_url" v-if="form.banner_type == 1 ">
          <el-upload
            action
            list-type="picture-card"
            accept="image/*"
            :limit="1"
            :auto-upload="false"
            :file-list="form.banner_url | filterUrl"
            :on-change="handleImgChangeTwo"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemoveTwo"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转商品" prop="banner_url" v-if="form.banner_type == 2 ">
          <div>跳转商品ID：{{form.banner_url}}</div>
          <el-button type="primary" @click="chooseGoods">选择商品</el-button>
        </el-form-item>
        <el-form-item label="跳转公众号文章" prop="banner_url" v-if="form.banner_type == 3 ">
          <el-input v-model="form.banner_url" placeholder="请输入跳转公众号文章链接"></el-input>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="showGoodsList">
      <el-table :data="goodList" style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <img
              @click="handlePictureCardPreview(scope.row)"
              :src="scope.row.goods_image"
              style="width:80px"
            >
          </template>
        </el-table-column>
        <el-table-column label="商品ID" prop="goods_commonid"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="choose(scope.row)" :loading="isloading" type="success">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹框分页开始 -->
      <el-pagination
        @size-change="handleSizeChange_Goods"
        @current-change="handleCurrentChange_Goods"
        :current-page="listQuery_Goods.page"
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery_Goods.limit"
        layout="total, sizes, prev, pager, next"
        background
        :total="total_Goods"
      ></el-pagination>
      <!--弹框分页结束 -->
    </el-dialog>
  </div>
</template>
<script>
import {
  getBannerList_api,
  deleteBanner_api,
  addBanner_api,
  editBanner_api,
  getGoodsList_api
} from "@/api/seller";
import uploadFn from "@/utils/tencent_cos";

//初始化常量
const form = {
  banner_pic: [],
  banner_type: 0,
  banner_title: "",
  banner_url: "",
  banner_order: ""
};
export default {
  created() {
    //获取首页列表
    this.getBannerList();
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
      //案例列表
      tableData: [],
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
      form: {
        banner_pic: [],
        //banner_title: '',
        region: "",
        banner_url: ""
      },
      //图片预览弹框是否打开
      dialogVisible: false,
      //要预览的图片
      dialogImageUrl: "",
      //表单验证规则
      rules: {
        banner_pic: [
          {
            required: true,
            message: "请上传图片",
            trigger: "change"
          }
        ]
      },
      categoryStateOptions: [
        {
          value: 0,
          label: "不跳"
        },
        {
          value: 1,
          label: "图片"
        },
        {
          value: 2,
          label: "商品"
        },
        {
          value: 3,
          label: "公众号文章 "
        }
      ],
      category: "",
      //正在上传图片
      isUpimg: false,
      //正在保存
      isloading: false,
      listQuery_Goods: {
        page: 1,
        limit: 10
      },
      //商品总数
      total_Goods: 0,
      goodList: [],
      showGoodsList: false
    };
  },
  methods: {
    //新增
    CreateItem() {
      this.category = "";
      (this.form = Object.assign({}, form)), (this.form.banner_pic = []);
      this.form.banner_url = "";
      this.dialogFormVisible = true; //打开内容弹框
      this.dialogStatus = "create";
    },
    //上传图片
    async handleImgChange(file, fileList) {
      console.log("change");
      console.log(file, fileList);
      this.isUpimg = true;
      let imgurl = await uploadFn(file.raw);
      this.isUpimg = false;
      this.form.banner_pic.push({
        url: imgurl[0]
      });
      console.log(this.form);
    },
    //跳转图片
    async handleImgChangeTwo(file, fileList) {
      console.log("change");
      console.log(file, fileList);
      this.isUpimg = true;
      let imgurl = await uploadFn(file.raw);
      console.log("上传完");
      console.log(imgurl);
      this.isUpimg = false;
      this.form.banner_url.push({
        url: imgurl[0]
      });
      console.log(this.form);
    },
    //删除图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
      console.log("删除");
      this.form.banner_pic = [];
    },
    handleRemoveTwo(file, fileList) {
      console.log(file, fileList);
      this.form.banner_url = [];
    },
    //预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.banner_pic || file.url;
      this.dialogVisible = true;
    },
    //保存内容
    onSubmit(form) {
      //console.log(this.$refs)
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.isloading = true;
          if (this.dialogStatus == "create") {
            this.addBannerList();
          } else {
            this.editBanner();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //编辑对应项
    handleEdit(row) {
      this.form = Object.assign({}, row); // copy obj
      this.dialogStatus = "edit";
      this.dialogFormVisible = true;
      this.categoryStateOptions.forEach(item => {
        if (item.value == row.banner_type) {
          this.category = item.label;
        }
      });
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
    //删除
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteBanner(row.banner_id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //以下为api操作
    //获取轮播图
    getBannerList() {
      let sendData = {};
      getBannerList_api(sendData).then(res => {
        if (res.status == 0) {
          this.tableData = res.data;
          res.data.forEach(item => {
            this.categoryStateOptions.forEach(itemOptions => {
              if (itemOptions.value == item.banner_type) {
                item.label = itemOptions.label;
              }
            });
          });
        }
      });
    },
    //增加轮播图
    addBannerList() {
      let sendData = {};
      sendData.banner_type = this.form.banner_type;
      sendData.banner_pic = this.form.banner_pic[0].url;
      sendData.banner_order = this.form.banner_order;
      if (this.form.banner_type == 1) {
        sendData.banner_url = this.form.banner_url[0]
          ? this.form.banner_url[0].url
          : null;
      } else {
        sendData.banner_url = this.form.banner_url;
      }
      addBanner_api(sendData).then(res => {
        if (res.status == 0) {
          this.dialogFormVisible = false;
          this.isloading = false;
          this.$notify({
            title: "成功",
            message: "保存成功",
            type: "success",
            duration: 2000
          });
          this.getBannerList();
        }
      });
    },

    //修改轮播图
    editBanner() {
      console.log("图片");
      console.log(this.form);
      //return
      let sendData = {};
      if (this.form.banner_pic[0].url) {
        sendData.banner_pic =
          this.form.banner_pic.length == 0 ? "" : this.form.banner_pic[0].url;
        if (this.form.banner_url) {
          sendData.banner_url = this.form.banner_url;
        } else {
          sendData.banner_url = "";
        }
      } else {
        if (
          Array.isArray(this.form.banner_url) &&
          this.form.banner_url.length != 0
        ) {
          sendData.banner_url = this.form.banner_url[0].url;
        } else {
          sendData.banner_url =
            this.form.banner_url.length == 0 ? "" : this.form.banner_url;
        }
        sendData.banner_pic =
          this.form.banner_pic.length == 0 ? "" : this.form.banner_pic;
      }
      sendData.banner_type = this.form.banner_type;
      sendData.banner_id = this.form.banner_id;
      sendData.banner_order = Number(this.form.banner_order);
      editBanner_api(sendData).then(res => {
        if (res.status == 0) {
          this.dialogFormVisible = false;
          this.isloading = false;
          this.$notify({
            title: "成功",
            message: "修改成功",
            type: "success",
            duration: 2000
          });
          this.getBannerList();
        } else if (res.status == 1) {
          this.isloading = false;
          this.$notify({
            title: "失败",
            message: res.error,
            type: "fail",
            duration: 2000
          });
          this.getBannerList();
        }
      });
    },
    //删除轮播图
    deleteBanner(id) {
      deleteBanner_api(id).then(res => {
        if (res.status == 0) {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000
          });
          this.getBannerList();
        }
      });
    },
    handleSelect(e) {
      console.log(e);
      if (e == 1) {
        this.form.banner_url = [];
      }
      this.form.banner_type = e;
    },
    chooseGoods() {
      this.showGoodsList = true; //打开内容弹框
      this.getGoodsList();
    },
    //选择商品
    choose(raw) {
      console.log(raw);
      this.form.banner_url = raw.goods_commonid;
      this.showGoodsList = false;
    },
    //获取所有商品列表
    getGoodsList() {
      let getData = Object.assign({}, this.listQuery_Goods);
      getData.goods_commend = 0;
      getGoodsList_api(getData).then(res => {
        if (res.status == 0) {
          this.goodList = res.data;
          this.total_Goods = res.pagination.total;
        }
      });
    },
    //改变每页条数
    handleSizeChange_Goods(val) {
      this.listQuery_Goods.limit = val;
      this.getGoodsList();
    },
    //选择哪一页
    handleCurrentChange_Goods(val) {
      console.log(val);
      this.listQuery_Goods.page = val;
      this.getGoodsList();
    }
  }
};
</script>
