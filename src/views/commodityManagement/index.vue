<style scoped>
.filter-container {
  display: flex;
}
.filter-container .filter-item {
  margin-bottom: 0px;
  margin-right: 40px;
}
.search_div {
  display: flex;
  margin-right: 40px;
}
.search_div > button {
  margin-left: 20px;
}
.graphic {
  border: solid #d5dbe7 1px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 30px 0;
}
</style>
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
      >新增商品</el-button>
      <div class="search_div">
        <el-select v-model="value_top" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="searchGoods('class_find')" icon="el-icon-search">分类查询</el-button>
      </div>
      <div class="search_div">
        <el-input v-model="listQuery.search" placeholder="请输入商品名称"></el-input>
        <el-button type="primary" @click="searchGoods('name_find')" icon="el-icon-search">名称查询</el-button>
      </div>
      <div class="search_div">
        <el-select v-model="listQuery.goods_state" placeholder="请选择">
          <el-option label="在售" value="1"></el-option>
          <el-option label="未售" value="0"></el-option>
        </el-select>
        <el-button type="primary" @click="searchGoods('state_find')" icon="el-icon-search">状态查询</el-button>
      </div>
    </div>
    <div class="filter-container">
      <el-badge :value="checkedGoodsNum.length" class="item" style="margin-right: 40px;">
        <el-button round disabled icon="el-icon-check">已选数量</el-button>
      </el-badge>
      <el-button round type="primary" @click="pushUpload" icon="el-icon-upload2">批量上架</el-button>
      <el-button round type="danger" @click="pullDownload" icon="el-icon-download">批量下架</el-button>
    </div>
    <!--顶部菜单结束 -->
    <!--中间表格开始 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      v-loading="listLoading"
      element-loading-text="给我一点时间"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="图片" prop="url">
        <template slot-scope="scope">
          <img
            @click="handlePictureCardPreview(scope.row)"
            :src="scope.row.goods_image"
            style="width:50px"
          >
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="价格" prop="goods_price"></el-table-column>
      <el-table-column label="分类" prop="gc_name"></el-table-column>
      <el-table-column label="状态" prop="gc_name">
        <template slot-scope="scope">
          <el-tag type="info">{{scope.row.goods_state==1 ? '在售' : '未售'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handeleDel(scope.$index,scope.row)">删除</el-button>
          <el-button
            size="mini"
            type="primary"
            v-if="scope.row.goods_state==0"
            @click="handlePush(scope.$index, scope.row)"
          >上架</el-button>
          <el-button
            size="mini"
            type="warning"
            v-else
            @click="handlePull(scope.$index, scope.row)"
          >下架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--中间表格结束 -->
    <!-- 表格分页开始 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.page"
      :page-sizes="[10,20,30,50]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next"
      background
      :total="total"
    ></el-pagination>
    <!--表格分页结束 -->
    <!--内容弹框开始 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="90%">
      <el-form :rules="rules" ref="form" :model="form" size="medium">
        <el-form-item label="商品分类" label-width="140px">
          <template>
            <el-select v-model="alertValue" placeholder="请选择分类" @change="handele_select">
              <el-option
                v-for="item in selectedOptions_alert"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="商品轮播图(1-10张)" prop="goods_image" label-width="140px">
          <el-upload
            action
            list-type="picture-card"
            accept="image/*"
            :limit="10"
            :auto-upload="false"
            :on-change="handleImgChange_image"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove_goods_image"
            :file-list="form.goods_image | filterUrl"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <p class="hbs-margin-left140">图片建议尺寸：宽750*高750</p>
        <el-form-item label="商品名称" prop="goods_name" label-width="140px">
          <el-input v-model="form.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品排序" prop="goods_sort" label-width="140px">
          <el-input v-model="form.goods_sort" type="number" placeholder="商品显示顺序"></el-input>
        </el-form-item>
        <el-form-item label="规格" label-width="140px">
          <!-- size 和 size2xxx 都是单独的属性 -->
          <el-tabs v-model="form.size" style="margin-top:-3px;margin-left:10px">
            <el-tab-pane label="统一规格" name="one" :disabled="!isAddItem&&form.size!=='one'">
              <el-form
                :model="formForNotiveChild1"
                :inline="true"
                ref="ruleFormChild1"
                :rules="rulesChild1"
                class="margin-btm20"
              >
                <el-form-item label="现价" prop="price">
                  <el-input v-model.number="formForNotiveChild1.price" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="原价" prop="marketprice">
                  <el-input v-model.number="formForNotiveChild1.marketprice" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="库存" prop="count">
                  <el-input v-model.number="formForNotiveChild1.count" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="多规格" name="mutil" :disabled="!isAddItem&&form.size!=='mutil'">
              <multi-sku :classList='skuClassList' :skuList='skus' :limit='5' @update='updateMultiSku' v-if="form.size === 'mutil'"></multi-sku> 
              <!-- <div
                v-for="(formItem,index) of formForNotiveChild2List"
                :key="index"
                class="margin-btm20"
              >
                <el-form :inline="true" :model="formItem" ref="ruleFormChild2" :rules="rulesChild2">
                  <el-form-item label="名称" prop="name">
                    <el-input v-model="formItem.name" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="现价" prop="price">
                    <el-input v-model.number="formItem.price" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="原价" prop="marketprice">
                    <el-input v-model.number="formItem.marketprice" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="库存" prop="count">
                    <el-input v-model.number="formItem.count" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-button @click="deleteSize_out(index)">删除</el-button>
                </el-form>
              </div>
              <div style="margin-top:10px;margin-left:10px">
                <el-button @click="addSize_out">添加规格</el-button>
              </div> -->
            </el-tab-pane>
          </el-tabs>
        </el-form-item>

        <el-form-item label="商品运费" prop="goods_freight" label-width="140px">
          <el-input type="number" v-model="form.goods_freight"></el-input>
        </el-form-item>
        <el-form-item label="基础销量" prop="goods_faker_salenum" label-width="140px">
          <el-input type="number" v-model="form.goods_faker_salenum"></el-input>
        </el-form-item>

        <!-- 这里添加动态图文个数开始 -->
        <el-form-item label="商品详情" label-width="140px">
          <el-button
            size="mini"
            type="success"
            @click="addGraphic()"
            v-if="dialogStatus === 'edit' && form.formObjRepeat"
          >添加内容</el-button>
          <editor
            style="width: 800px; height: 300px;"
            :menubar="editorConfig.menu"
            :height="editorConfig.height"
            v-model="form.goods_body"
            v-if="dialogFormVisible && !form.formObjRepeat"
          />
        </el-form-item>
        <p
          class="hbs-margin-left140"
          v-if="dialogStatus === 'edit' && form.formObjRepeat"
        >图片建议尺寸：宽750*高不限</p>
        <!-- 这里添加动态图文个数结束 -->
        <!-- 图文模块部分开始 -->
        <div
          v-for="(formItem,index) of form.formObjRepeat"
          :key="index"
          @click="getIndex(index)"
          v-if="dialogStatus === 'edit' && form.formObjRepeat"
        >
          <el-form :model="formItem">
            <el-row :gutter="20" class="graphic">
              <el-col :span="24">
                <div class="grid-content bg-purple">
                  <el-form-item label="描述" label-width="130px" prop="title">
                    <el-input
                      v-model="formItem.Repeat_title"
                      type="textarea"
                      autosize
                      placeholder="请输入内容"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="grid-content bg-purple">
                  <el-form-item label="图片(1张)" label-width="130px" prop="content">
                    <el-upload
                      action
                      list-type="picture-card"
                      accept="image/*"
                      :limit="1"
                      :auto-upload="false"
                      :file-list="formItem.Repeat_images"
                      :on-change="handleImgChange_detail"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="handleRemove_detail"
                    >
                      <i class="el-icon-plus"></i>
                    </el-upload>
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="24" style="margin-left: 130px;">
                <div>
                  <el-button type="danger" @click="deleteItem(index)">删除</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- 图文模块部分结束 -->
        <el-form-item>
          <el-button
            type="primary"
            :disabled="isUpimg"
            @click="onSubmit(form)"
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
  addGoods_api,
  getGoodsList_api,
  deleGoods_api,
  editRec_api,
  getGoods_api,
  upDownGoods_api,
  getEntryList_api,
  getIndustryList_api,
  setting_api
} from "@/api/seller";
import uploadFn from "@/utils/tencent_cos";
import config from "./config";
import multiSku from "@/components/multiSku";

//初始化常量
const form = {
  goods_name: "",
  goods_price: "",
  goods_storage: "",
  goods_advword: "",
  goods_image: [],
  goods_body: "",
  formObjRepeat: [
    {
      Repeat_images: [],
      Repeat_title: ""
    }
  ],
  goods_freight: "",
  goods_faker_salenum: "",
  goods_marketprice: "",
  size: "one"
};
const formForNotiveChild1 = {
  price: "",
  count: ""
};
const formForNotiveChild2List = [];
//新增商品字段
const sendData = {
  storegc_id: "",
  goods_name: "",
  goods_price: "", //商品现价
  goods_serial: "",
  goods_advword: "",
  goods_image: [],
  goods_body: [],
  goods_storage: "",
  gc_name: "自定义分类",
  mobile_body: "",
  goods_faker_salenum: "", //基础销量
  goods_freight: 0,
  goods_marketprice: "" //商品原价
};
//修改商品字段
const editData = {
  gc_id: "",
  gc_name: "",
  goods_commonid: "",
  goods_name: "",
  goods_price: "",
  goods_marketprice: "",
  goods_storage: "",
  goods_serial: "",
  goods_image: [],
  goods_body: [],
  goods_freight: 0,
  goods_advword: "",
  mobile_body: "",
  goods_faker_salenum: ""
};
export default {
  mixins: [config],
  created() {
    //获取自定义商品分类
    this.getGoodsClass();
    //获取全部商品列表
    this.getGoodsList();
  },
  filters: {
    //这里进行加入url到Ui框架
    filterUrl: function(value) {
      //console.log("进来的")
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

  //以上为自定义方法
  data() {
    return {
      //商品勾选列表
      checkedGoodsNum: [],
      //弹框下拉分类
      selectedOptions_alert: [],
      //选项下拉数据
      options: [],
      //选择的分类
      value_top: "",
      //弹框选择的分类
      alertValue: "",
      //商品列表
      tableData: [],
      //分页（请求参数）
      listQuery: {
        page: 1,
        limit: 10,
        time: "",
        search: "",
        goods_state: ""
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
        selectedOptions_alert: [
          {
            required: true,
            message: "请选择商品类型",
            trigger: "change"
          }
        ],
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          },
          {
            min: 1,
            max: 20,
            message: "长度在1到20个字"
          }
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur"
          }
        ],
        goods_storage: [
          {
            required: true,
            message: "请输入商品库存",
            trigger: "blur"
          }
        ],
        goods_freight: [
          {
            required: true,
            message: "请输入商品运费",
            trigger: "blur"
          }
        ],
        goods_image: [
          {
            required: false,
            message: "请传1至3张图片",
            trigger: "change"
          }
        ],
        goods_body: [
          {
            required: false,
            message: "请传1至3张图片",
            trigger: "change"
          }
        ],
        goods_sort: [
          {
            required: false,
            message: "选填项",
            trigger: "blur"
          }
        ],
        goods_advword: [
          {
            required: true,
            message: "请输入商品描述",
            trigger: "blur"
          },
          {
            min: 1,
            max: 30,
            message: "长度在1到30个字"
          }
        ]
      },
      //正在上传图片
      isUpimg: false,
      //表格刷新
      listLoading: false,
      //正在保存
      isloading: false,
      //最后提交的表单数据
      sendData: Object.assign({}, sendData),
      //最后修改的数据
      editData: Object.assign({}, editData),
      //动态模块当前索引
      moddele_idx: "",

      isAddItem: true,
      formForNotiveChild1: Object.assign({}, formForNotiveChild1),
      rulesChild1: {
        price: [
          {
            required: true,
            message: "请输入商品价格,不少于0",
            trigger: "blur",
            min: 0,
            type: "number"
          }
        ],
        marketprice: [
          {
            required: true,
            message: "请输入参考价格,不少于0",
            trigger: "blur",
            min: 0,
            type: "number"
          }
        ],
        count: [
          {
            required: true,
            message: "请输入商品库存,不少于0的整数",
            trigger: "blur",
            min: 0,
            type: "integer"
          }
        ]
      },
      formForNotiveChild2List: Object.assign([], formForNotiveChild2List),
      rulesChild2: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
            min: 1,
            type: "string"
          }
        ],
        price: [
          {
            required: true,
            message: "请输入商品价格,不少于0",
            trigger: "blur",
            min: 0,
            type: "number"
          }
        ],
        marketprice: [
          {
            required: true,
            message: "请输入参考价格,不少于0",
            trigger: "blur",
            min: 0,
            type: "number"
          }
        ],
        count: [
          {
            required: true,
            message: "请输入商品库存,不少于0",
            trigger: "blur",
            min: 0,
            type: "number"
          }
        ]
      },
      skuClassList: [],
      skus: [],
      classList: [],
      limit: 1,
    };
  },

  computed: {
    // skuClassList(){ 
    //   return [];
    //   // return [ { name: '颜色', skus: [{ name: '黑色' }, { name: '白色' } ] }, ]; 
    // },
    // skus(){ 
    //   return [];
    //   // return [
    //   //   { name: '黑色', price: 1.00, amount: 100, },
    //   //   { name: '白色', price: 2, amount: 2000 },
    //   // ];
    // },
  },
  
  components: {
    multiSku
  },

  methods: {
    //规格2

    addSize_out() {
      this.formForNotiveChild2List.push({});
    },
    deleteSize_out(index) {
      this.formForNotiveChild2List.splice(index, 1);
    },
    //获取当前模块索引值
    getIndex(index) {
      this.moddele_idx = index;
    },
    //添加图片模块
    addGraphic() {
      console.log("添加图片模块");

      this.form = Object.assign({}, this.form);
      console.log(this.form.formObjRepeat);
      this.form.formObjRepeat.push({
        Repeat_images: [],
        Repeat_title: ""
      });
    },
    //删除某个图文模块
    deleteItem(idx) {
      this.form = Object.assign({}, this.form);
      this.form.formObjRepeat.splice(idx, 1);
    },
    //保存内容
    async onSubmit(form) {
      // console.error('multiSKu', this.formForNotiveChild2List);
      if (this.form.size === "one") {
        //如果 size是统一 仅对统一表单进行验证
        let resChild1 = await new Promise((res, rej) => {
          this.$refs["ruleFormChild1"].validate(valid => {
            if (valid) {
              // alert('submit!');
              res(true);
            } else {
              res(false);
              // console.log('error submit!!');
              // return false;
            }
          });
        });
        if (!resChild1) {
          return;
        }
      } else {
        let err = '';
        if(!this.formForNotiveChild2List.length) return this.$message.error(`规格类别不能空`);

        this.formForNotiveChild2List.some((v, i) => {
          if(!v.price){
            err = '请设置正确价格';
          }else if(v.price <= 0){
            err = '价格必须大于零';
          }else if(v.count < 0 && typeof v.count !== 'number'){
            err = '请设置正确库存'; 
          }else if(v.count < 0){
            err = '库存数量必须大于零'; 
          }

          return err;
        });

        if(err) return this.$message.error(err);
        //如果 size是 多个 仅对 多个表单进行验证
        // let formChild2PromiseList = [];
        // for (let i = 0; i < this.formForNotiveChild2List.length; i++) {
        //   console.log(this.formForNotiveChild2List.length);
        //   let one = new Promise((res, rej) => {
        //     this.$refs["ruleFormChild2"][i].validate(valid => {
        //       if (valid) {
        //         res(true);
        //       } else {
        //         rej(false);
        //       }
        //     });
        //   });
        //   formChild2PromiseList.push(one);
        // }
        // let resChild2 = await Promise.all(formChild2PromiseList);
        // if (!resChild2) {
        //   return;
        // }
      }
      console.log("form最后1");
      console.log(this.form);
      console.log(this.sendData);
      console.log(this.formForNotiveChild2List);
      console.log(this.form.size);
      //商品价格
      if (this.form.size === "one") {
        // 类型转换
        this.formForNotiveChild1.price = this.formForNotiveChild1.price
          ? Number(this.formForNotiveChild1.price)
          : 0;
        this.form.goods_price = this.formForNotiveChild1.price;
        this.form.goods_marketprice = this.formForNotiveChild1.marketprice;
      } else {
        // 类型转换
        let temp = this.formForNotiveChild2List[0].price
          ? Number(this.formForNotiveChild2List[0].price)
          : 0;
        this.form.goods_price = temp;
        this.form.goods_marketprice = this.formForNotiveChild2List[0].marketprice;
      }
      if (this.form.size === "one") {
        //单规格
        this.form.spec_value = null;
        this.form.goods_storage = this.formForNotiveChild1.count;
      } else {
        // 多规格
        let tempMutil = [];
        let tempSepc_value = [];
        for (
          let i = 0, len = this.formForNotiveChild2List.length;
          i < len;
          i++
        ) {
          tempMutil.push({
            price: this.formForNotiveChild2List[i].price,
            marketprice: this.formForNotiveChild2List[i].marketprice,
            sp_value: this.formatName(this.formForNotiveChild2List[i].name),
            spec_attr: this.formForNotiveChild2List[i].index.join('_'),
            stock: this.formForNotiveChild2List[i].count,
          });
          // tempSepc_value.push(this.formForNotiveChild2List[i].name);
          // console.error(tempMutil);
        }

        let spec_name = {}, spec_value = {};
        this.classList.forEach((v, i) => {
          let o = {};
          v.skus.forEach((sku, skuIndex) => o[skuIndex] = sku.name);// tempSepc_value;
          spec_value[i] = o;
        });
        this.classList.forEach((v, i) => spec_name[i] = v.name);

        this.form.spec_value = spec_value;
        this.form.spec_name = spec_name;

        this.form.goods_storage = "";
        this.form.spec = tempMutil;
        // return console.error('---', this.form.spec_name, this.form.spec_value);
      }
      this.sendData = Object.assign({}, sendData);

      if (this.dialogStatus === "edit" && this.form.formObjRepeat)
        this.form.goods_body = JSON.stringify(this.form.formObjRepeat);

      this.$refs["form"].validate(valid => {
        if (valid) {
          this.isloading = true;
          for (let key in this.form) {
            this.sendData[key] = this.form[key];
          }
          sendData.goods_sort = Number(this.form.goods_sort);
          console.log("form最后");
          console.log(this.form);
          console.log(this.sendData);
          //这里判断是编辑商品还是新增商品
          if (this.dialogStatus == "edit") {
            this.isloading = false;
            this.editGoods(this.form);
          } else {
            this.isloading = false;
            console.log("发送这一不");
            console.log(this.sendData);
            this.addGoods(this.sendData);
          }
        } else {
          return false;
        }
      });
    },
    //获取商品列表
    getGoodsList() {
      this.listLoading = true;
      let getData = Object.assign({}, this.listQuery);
      for (let key in getData) {
        if (!getData[key]) {
          delete getData[key];
        }
      }
      getData.type = "sort";
      getGoodsList_api(getData).then(res => {
        if (res.status == 0) {
          this.listLoading = false;
          this.tableData = res.data;
          this.total = res.pagination.total;
        }
      });
    },
    //获取商品分类总信息
    getGoodsClass() {
      getIndustryList_api().then(res => {
        if (res.status == 0) {
          for (let i = 0; i < res.data.length; i++) {
            this.options.push({
              value: res.data[i].storegc_id,
              label: res.data[i].storegc_name
            });
          }
        }
      });
    },
    //根据条件搜索商品
    searchGoods(type) {
      console.log(this.value_top);
      console.log(this.listQuery);
      if (type == "class_find") {
        if (!this.value_top) {
          return false;
        } else {
          this.listQuery.gc_id = this.value_top;
          this.getGoodsList();
        }
      } else if (type == "name_find") {
        if (this.listQuery.search) {
          this.getGoodsList();
        }
      } else {
        if (this.listQuery.goods_state) {
          this.getGoodsList();
        }
      }
    },
    //新增
    CreateItem() {
      if (this.options.length == 0) {
        this.$message.error("请新增商品分类！");
        return;
      }
      this.isAddItem = true;
      this.selectedOptions_alert = this.options;
      this.alertValue = "";
      console.log(this.options);
      //return
      this.form = Object.assign({}, form);
      this.formForNotiveChild1 = Object.assign({}, formForNotiveChild1);
      this.formForNotiveChild2List = Object.assign([], formForNotiveChild2List);
      console.log(this.form);
      this.form.goods_image = [];
      this.form.formObjRepeat = null;

      // multi sku
      this.skuClassList = [];
      this.skus = [];

      // this.form.formObjRepeat = [
      //   {
      //     Repeat_images: [],
      //     Repeat_title: ""
      //   }
      // ];
      this.dialogFormVisible = true; //打开内容弹框
      this.dialogStatus = "create";
    },
    handleSelect_top(value) {
      console.log(value);
      console.log("筛选");
      this.listQuery.storegc_id = value[value.length - 1];
    },
    //下拉分类查询
    handleSelect_alert(value) {
      console.log("选中");
      console.log(value);

      //this.goodClass=value;
      //this.storegc_id = value[value.length - 1];
    },
    //弹框分类选择
    handele_select(val) {
      console.log("选择后得分类");
      //console.log(val)
      //console.log(this.selectedOptions_alert)
      //console.log(this.form)
      let arr = this.selectedOptions_alert.filter((e, idx) => {
        return this.selectedOptions_alert[idx].value == val;
      });
      this.form.gc_id = val;
      this.alertValue = this.form.gc_id;
      //console.log(arr)
      this.form.gc_name = arr[0].label;
      console.log(this.form);
    },
    //上传轮播
    async handleImgChange_image(file, fileList) {
      this.isUpimg = true;
      console.log("change");
      console.log(file);
      console.log(file.raw);

      let imgurl = await uploadFn(file.raw);

      this.isUpimg = false;
      console.log(this.form);
      this.form.goods_image.push({ url: imgurl[0] });
      console.log("goods_image");
      console.log(this.form.goods_image);
    },
    //商品详情图
    async handleImgChange_detail(file, fileLis) {
      console.log("商品详情");
      console.log(this.form);
      this.isUpimg = true;
      let imgurl = await uploadFn(file.raw);

      console.log(imgurl);

      this.isUpimg = false;
      this.form.formObjRepeat[this.moddele_idx].Repeat_images.push({
        url: imgurl[0]
      });
      console.log(this.form);
    },
    //删除多图图片
    handleRemove_goods_body(file, fileList) {
      console.log("删除图片");

      this.form.goods_body = fileList;
      //return
      console.log(this.form.goods_body);
    },
    //删除商品详情图
    handleRemove_detail(file, fileList) {
      console.log(fileList);
      let that = this;
      // 				if(this.dialogStatus=='edit'){
      // 					return false
      // 				}else{
      // return
      //this.form.formObjRepeat
      setTimeout(function() {
        console.log("删除商品详情图");

        console.log(that.moddele_idx);
        that.form.formObjRepeat[that.moddele_idx].Repeat_images.splice(0, 1);
      }, 50);
      //}
      console.log(that.form);
    },
    //删除单个图片
    handleRemove_goods_image(file, fileList) {
      console.log("删除图片");
      this.form.goods_image = fileList;
    },
    //预览图片
    handlePictureCardPreview(file) {
      console.log("预览图片");
      console.log(file);
      this.dialogImageUrl = file.goods_image || file.url;
      this.dialogVisible = true;
    },

    //编辑商品
    handleEdit(index, row) {
      this.isAddItem = false;
      this.form = Object.assign({}, form);
      getGoods_api(row.goods_commonid).then(res => {
        console.log(res);
        let resObj = res.data;
        this.form = res.data;
        let arr = res.data.goodsimagesList;
        this.form.goods_image = [];
        for (let i = 0; i < arr.length; i++) {
          this.form.goods_image.push(arr[i].goodsimage_url);
        }
        this.form.formObjRepeat =
          resObj.goods_body[0] === "[" ? JSON.parse(resObj.goods_body) : null;
        this.form.goods_storage = resObj.SKUList[0].goods_storage;
        this.form.size = resObj.spec_value ? "mutil" : "one";

        console.log(this.form.size);
        // 此时需要 判断 规格 单或多
        let tempForm2 = {}; //单规格 零时变量
        let tempForm3 = []; //多规格 零时变量
        if (this.form.size === "mutil") {
          for (let i = 0, len = resObj.SKUList.length; i < len; i++) {
            tempForm3.push({
              price: Number(resObj.SKUList[i].goods_price),
              marketprice: Number(resObj.SKUList[i].goods_marketprice),
              // name: resObj.SKUList[i].goods_spec,
              count: Number(resObj.SKUList[i].goods_storage)
            });
          }

          // format sku classList
          let spec_name = resObj.spec_name;
          if(spec_name){

            this.skuClassList = spec_name.map((v, i) => { 
              let skus = resObj.spec_value[i].map(sku => { return { name: sku }; }); 
              return { name: v, skus };
            });

            this.skus = tempForm3;
          }else{
            this.skuClassList = [];
            this.skus = [];
          }
          // console.error(this.skuClassList, this.skus);
          // this.formForNotiveChild2List = tempForm3;
        } else {
          tempForm2 = {
            price: Number(resObj.goods_price),
            marketprice: Number(resObj.goods_marketprice),
            count: Number(resObj.SKUList[0].goods_storage)
          };
          this.formForNotiveChild1 = tempForm2;
        }
        console.log("分类");
        console.log(this.options);

        this.selectedOptions_alert = this.options;
        let storegc_id = this.options.filter(e => {
          return e.label == resObj.gc_name;
        });
        console.log(storegc_id);
        if (storegc_id.length == 0) {
          this.form.storegc_id = "";
          this.alertValue = "";
        } else {
          this.form.storegc_id = storegc_id[0].value;
          this.alertValue = this.form.storegc_id;
        }
        console.log("填充的form图文详情");
        console.log(this.form.formObjRepeat);
        this.dialogFormVisible = true;
        this.dialogStatus = "edit";
      });
    },
    //上架商品api
    push_pullGoods(obj) {
      setting_api(obj).then(res => {
        console.log(res);
        if (res.status == 0) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.getGoodsList();
        } else {
          this.$message({
            type: "warning",
            message: "操作失败!"
          });
        }
      });
    },
    //上架商品
    handlePush(index, row) {
      let send = {
        type: "online",
        goods_commonid: []
      };
      send.goods_commonid.push(row.goods_commonid);
      //return
      this.push_pullGoods(send);
    },
    //下架商品
    handlePull(index, row) {
      console.log(index, row);
      let send = {
        type: "offline",
        goods_commonid: []
      };
      send.goods_commonid.push(row.goods_commonid);
      //return
      this.push_pullGoods(send);
    },
    //删除商品
    handeleDel(index, row) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteGoods(row.goods_commonid);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //全选
    handleSelectionChange(list) {
      console.log("勾选");
      console.log(list);
      this.checkedGoodsNum = list;
    },
    //批量上架
    pushUpload() {
      if (this.checkedGoodsNum.length == 0) {
        this.$message({
          message: "请选择商品",
          type: "warning"
        });
      } else {
        let send = {
          type: "online",
          goods_commonid: []
        };

        console.log(this.checkedGoodsNum);
        let arr = this.checkedGoodsNum.filter(e => {
          return e.goods_state == 0;
        });
        for (let i = 0; i < arr.length; i++) {
          send.goods_commonid.push(arr[i].goods_commonid);
        }
        this.push_pullGoods(send);
      }
    },
    //批量下架
    pullDownload() {
      if (this.checkedGoodsNum.length == 0) {
        this.$message({
          message: "请选择商品",
          type: "warning"
        });
      } else {
        let send = {
          type: "offline",
          goods_commonid: []
        };
        let arr = this.checkedGoodsNum.filter(e => {
          return e.goods_state == 1;
        });
        for (let i = 0; i < arr.length; i++) {
          send.goods_commonid.push(arr[i].goods_commonid);
        }
        this.push_pullGoods(send);
      }
    },
    //改变每页条数
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getGoodsList();
    },
    //选择哪一页
    handleCurrentChange(val) {
      console.log(val);
      this.listQuery.page = val;
      this.getGoodsList();
    },
    // 以下为api操作=============================================
    //去除url
    delUrlfun(e) {
      console.log("去除");
      console.log(e);
      let arr = [];
      for (let i = 0; i < e.length; i++) {
        arr.push(e[i].url);
      }
      return arr;
    },
    //新增商品
    addGoods(res) {
      let delUrl_goods_image = this.delUrlfun(res.goods_image);
      res.goods_image = delUrl_goods_image;
      delete res.formObjRepeat;
      //console.log(this.options)
      //console.log(res)
      let gc_name_one = "";
      for (let i = 0; i < this.options.length; i++) {
        if (
          this.options[i].value == res.gc_id ||
          this.options[i].value == res.storegc_id
        ) {
          gc_name_one = this.options[i].label;
        }
      }
      res.gc_name = gc_name_one;
      console.log("添加的商品");
      console.log(res);
      //return
      addGoods_api(res)
        .then(data => {
          if (data.status == 0) {
            this.dialogFormVisible = false;
            this.isloading = false;
            this.$notify({
              title: "成功",
              message: "保存成功",
              type: "success",
              duration: 2000
            });
            this.getGoodsList();
          }
        })
        .catch(e => {
          console.error("addGoods_api 接口错误");
        });
    },
    //编辑商品
    editGoods(obj) {
      console.log("编辑的数据");
      console.log(obj);

      let delUrl_goods_image = this.delUrlfun(obj.goods_image);
      obj.goods_image = delUrl_goods_image;
      delete obj.formObjRepeat;
      // for (let key in obj) {
      //   if (key in this.editData) {
      //     this.editData[key] = obj[key];
      //   }
      // }
      console.log("最后发送的数据");
      console.log(obj);
      //return
      editRec_api(obj)
        .then(data => {
          console.log("上传返回的结果");
          console.log(data);
          if (data.status == 0) {
            this.dialogFormVisible = false;
            this.isloading = false;
            this.$notify({
              title: "成功",
              message: "保存成功",
              type: "success",
              duration: 2000
            });
            this.getGoodsList();
          }
        })
        .catch(e => {
          console.error("addGoods_api 接口错误");
        });
    },
    //删除某个商品
    deleteGoods(id) {
      let delData = {
        goods_commonid: id
      };
      deleGoods_api(delData).then(res => {
        console.log(res);
        if (res.status == 0) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getGoodsList();
        } else {
          this.$message({
            type: "warning",
            message: "删除失败!"
          });
        }
      });
    },

    // Update multi sku goods
    updateMultiSku(classList, skus){
      // console.error('update', classList, skus);
      this.classList = classList;
      this.formForNotiveChild2List = skus;
    },
    formatName(name){
      let o = {};

      name.replace(/;$/, '').split(';').forEach((v, i) => o[this.classList[i].name] = v);

      return o;
    }

  }
};
</script>
