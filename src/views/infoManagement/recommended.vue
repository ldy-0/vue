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
      >选择商品</el-button>
    </div>
    <!--顶部菜单结束 -->
    <!--中间表格开始 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.goods_image" style="width:100px">
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
	  <el-table-column label="商品ID" prop="goods_commonid"></el-table-column>
      <el-table-column label="商品价格(元)" prop="goods_price"></el-table-column>
      <el-table-column label="分类" prop="gc_name"></el-table-column>
      <el-table-column label="状态" prop="gc_name">
        <template slot-scope="scope">
          <el-tag type="info">{{scope.row.goods_state==1 ? '在售' : '未售'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleCancel(scope.row)">取消推荐</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格分页开始 -->
    <el-pagination
      @size-change="handleSizeChange_table"
      @current-change="handleCurrentChange_table"
      :current-page="listQuery_Recommend.page"
      :page-sizes="[10,20,30]"
      :page-size="listQuery_Recommend.limit"
      layout="total, sizes, prev, pager, next"
      background
      :total="total_Recommend"
    ></el-pagination>
    <!--表格分页结束 -->
    <!--中间表格结束 -->
    <!--内容弹框开始 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
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
            <el-button
              size="mini"
              @click="handleSelect(scope.row)"
              :loading="isloading"
              type="success"
            >选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹框分页开始 -->
      <el-pagination
        @size-change="handleSizeChange_Goods"
        @current-change="handleCurrentChange_Goods"
        :current-page="listQuery_Goods.page"
        :page-sizes="[10,20,30]"
        :page-size="listQuery_Goods.limit"
        layout="total, sizes, prev, pager, next"
        background
        :total="total_Goods"
      ></el-pagination>
      <!--弹框分页结束 -->
    </el-dialog>
    <!-- 内容弹框结束-->
  </div>
</template>
<script>
import { getGoodsList_api, setting_api } from "@/api/seller";
export default {
  created() {
    //获取全部精品推荐
    this.getRecommendList();
  },
  data() {
    return {
      //商品列表
      tableData: [],
      //判断弹框是新增还是编辑
      textMap: {
        create: "推荐商品"
      },
      //默认弹框隐藏
      dialogFormVisible: false,
      //弹框状态
      dialogStatus: "",
      //弹框内容
      goodList: [],
      //图片预览弹框是否打开
      dialogVisible: false,
      //要预览的图片
      dialogImageUrl: "",
      //正在推荐
      isloading: false,
      //推荐表格分页（请求参数）
      listQuery_Recommend: {
        page: 1,
        limit: 10
      },
      //推荐商品总数
      total_Recommend: 0,
      //弹框商品分页（请求参数）
      listQuery_Goods: {
        page: 1,
        limit: 10
      },
      //商品总数
      total_Goods: 0
    };
  },
  methods: {
    //新增
    CreateItem() {
      this.dialogFormVisible = true; //打开内容弹框
      this.dialogStatus = "create";
      this.getGoodsList();
    },
    //预览图片
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //取消推荐
    handleCancel(raw) {
      console.log(raw);
      let sendData = {};
      sendData.goods_commonid = raw.goods_commonid;
      sendData.type = "notrecommend";
      setting_api(sendData).then(res => {
        if (res.status == 0) {
          this.$notify({
            title: "取消推荐",
            message: "操作成功",
            type: "success",
            duration: 2000
          });
          this.getRecommendList();
        }
      });
    },
    //选择商品
    handleSelect(raw) {
      console.log(raw);
      let sendData = {};
      sendData.goods_commonid = raw.goods_commonid;
      sendData.type = "recommend";
      setting_api(sendData).then(res => {
        if (res.status == 0) {
          this.$notify({
            title: "推荐商品",
            message: "操作成功",
            type: "success",
            duration: 2000
          });
          this.dialogFormVisible = false;
          this.getRecommendList();
        }
      });
    },
    //改变每页条数
    handleSizeChange_table(val) {
      console.log(val);
      this.listQuery_Recommend.limit = val;
      this.getRecommendList();
    },
    //选择哪一页
    handleCurrentChange_table(val) {
      console.log(val);
      this.listQuery_Recommend.page = val;
      this.getRecommendList();
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
    //以下为api操作
    //获取推荐商品列表
    getRecommendList() {
      this.listLoading = true;
      let getData = Object.assign({}, this.listQuery_Recommend);
      getData.goods_commend = 1;
      getGoodsList_api(getData).then(res => {
        if (res.status == 0) {
          this.listLoading = false;
          this.tableData = res.data;
          this.total_Recommend = res.pagination.total;
        }
      });
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
    }
  }
};
</script>