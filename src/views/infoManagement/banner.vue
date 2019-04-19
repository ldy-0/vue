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
            style="width:100px;height:100px;"
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
          <custom-img :obj="img"></custom-img>
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

        <custom-img :obj='detailImg' v-if="form.banner_type == 1 "></custom-img>

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
            @click="onSubmit('form')"
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
import commonReq from '@/api/common' 
import customImg from '@/components/customImg'

//初始化常量
const form = {
  banner_pic: [],
  banner_type: 0,
  banner_title: "",
  banner_url: "",
  banner_order: ""
};
export default {
  components:{
    customImg
  },
  created() {
    //获取首页列表
    this.getBannerList();
    this.getUploadToken();
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
      img: { title: '图片', value: [], limit: 1, alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      detailImg: { title: '跳转图片', value: [], limit: 1, alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
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
      this.form = Object.assign({}, form);
      this.category = 0;
      this.img.value = [];
      this.detailImg.value = [];
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
          if (this.dialogStatus == "create") {
            this.addBannerList();
          } else {
            this.editBanner();
          }
        } else {
          return false;
        }
      });
    },
    //编辑对应项
    handleEdit(row) {
      this.form = Object.assign({}, row); // copy obj
      this.dialogStatus = "edit";
      this.dialogFormVisible = true;
      this.img.value = [{url:row.banner_pic}] ||[];
      this.categoryStateOptions.forEach(item => {
        if (item.value == row.banner_type) {
          this.category = item.label;
          this.detailImg.value = [{url:row.banner_url}] ||[];
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
      this.img.alert = this.img.value.length ? null : '请选择图片作为主图';

      sendData.banner_type = this.form.banner_type;
      //
      let img = this.img.value.map(v => { return v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url });
      if(!img[0]) return console.error('img value :', img);
      sendData.banner_pic = img[0];

      sendData.banner_order = this.form.banner_order;
      if (this.form.banner_type == 1) {
        let detailImg = this.detailImg.value.map(v => { return v.raw ? `${this.detailImg.cdnUrl}/${v.response.key}` : v.url });
        if(!detailImg[0]) return console.error('img value :', detailImg);
        sendData.banner_url = detailImg[0];
      } else {
        sendData.banner_url = this.form.banner_url;
      }
      this.isloading = true;
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
      let img = this.img.value.map(v => { return v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url });
      if(!img[0]) return console.error('img value :', img);
      sendData.banner_pic = img[0];
      
      if (this.form.banner_type == 1) {
        let detailImg = this.detailImg.value.map(v => { return v.raw ? `${this.detailImg.cdnUrl}/${v.response.key}` : v.url });
        if(!detailImg[0]) return console.error('img value :', detailImg);
        sendData.banner_url = detailImg[0];
      } else {
        sendData.banner_url = this.form.banner_url;
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
      getData.goods_state =1;
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
    },
    async getUploadToken(){
      let res = await commonReq.getUploadToken();

      if(res.error) return this.$message.error(`getUploadToken: ${res.error}`);

      this.detailImg.body.token = this.img.body.token = res.data;
      this.detailImg.body.config = this.img.body.config = "{ useCdnDomain: true }";
    },
  }
};
</script>
