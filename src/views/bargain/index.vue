<style lang="css">
</style>

<template>
  <div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
    <!-- 添加-->
    <el-dialog :title="QisAddItem?'新增砍价':'查看砍价'" :visible.sync="QaddNewShow" width="60%" append-to-body>
      <el-form :model="QformForNotive" ref="qruleForm" :rules="Qrules">
        <el-table :data="goods_info" stripe v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%;margin-bottom:20px;">
          <el-table-column label="商品图片">
            <template slot-scope="scope">
              <div style="width:50px;height:50px;align-items:center;display:flex;">
                <img :src="scope.row.goodsImage" alt style="width:100%;height:100%">
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品名称" prop="goodsName"></el-table-column>
          <el-table-column label="商品原价" prop="goodsPrice"></el-table-column>
        </el-table>
        <el-form-item label="规格" :label-width="formLabelWidth" v-if="goodsDetail.skuClassList&&QisAddItem" prop="choiceGoodsId">
          <el-select v-model="alertValue" placeholder="请选择规格" @change="handele_select">
            <el-option v-for="(item,index) in goodsDetail.skuClassList" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格" :label-width="formLabelWidth" v-if="!QisAddItem" prop="choiceGoodsId">
          {{QformForNotive.goods_spec||'单规格商品'}}
        </el-form-item>
        <!-- <p class="hbs-margin-left140">图片建议尺寸：宽750*高750;限传一张;</p> -->

        <!-- 活动封面图 -->
        <custom-img :obj='img'></custom-img>
        <!-- 活动名 -->
        <custom-input :obj='ruleName'></custom-input>

        <el-form-item label="活动时间" :label-width="formLabelWidth" prop="dateRange">
          <el-date-picker style="width:400px" :picker-options="pickerOptions" v-model="QformForNotive.dateRange" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="砍价时限" :label-width="formLabelWidth" prop="outime">
          <el-input type="number" min="0" v-model="QformForNotive.outime" auto-complete="off">
            <template slot="append">小时</template>
          </el-input>
        </el-form-item>
        <el-form-item label="砍价类型" :label-width="formLabelWidth">
          <el-radio-group v-model="QformForNotive.cutprice_type">
            <el-radio :label="1">固定砍</el-radio>
            <el-radio :label="2">随机砍</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="QformForNotive.cutprice_type==1" label="固定砍价金额" :label-width="formLabelWidth" prop="cutprice_price">
          <el-input type="number" min="1" style="width:300px;" v-model="QformForNotive.cutprice_price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item style="display:inline-block" v-if="QformForNotive.cutprice_type==2" label="随机砍价金额" :label-width="formLabelWidth" prop="cutprice_few">
          <el-input type="number" min="1" style="width:150px;" v-model="QformForNotive.cutprice_few" auto-complete="off"></el-input> ——
        </el-form-item>
        <el-form-item style="display:inline-block" v-if="QformForNotive.cutprice_type==2" label="" label-width="0" prop="cutprice_more">
          <el-input type="number" min="1" style="width:150px;" v-model="QformForNotive.cutprice_more" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="售价" :label-width="formLabelWidth">
          <el-input disabled v-model="goodsDetail.price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="底价" :label-width="formLabelWidth" prop="goods_price">
          <el-input type="number" min="0" v-model.number="QformForNotive.goods_price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="库存" :label-width="formLabelWidth" prop="goods_storage">
          <el-input type="number" min="0" v-model.number="QformForNotive.goods_storage" auto-complete="off"></el-input>
        </el-form-item>

        <!-- 运费 -->
        <c-radio :obj='freightType'></c-radio>

        <custom-input :obj='freight' v-if="freightType.value == 1"></custom-input>
        <c-select :obj='freightTemp' v-if="freightType.value == 2"></c-select>
        <!-- <el-form-item label="运费" :label-width="formLabelWidth" prop="goods_freight">
          <el-input type="number" min="0" v-model.number="QformForNotive.goods_freight" auto-complete="off"></el-input>
        </el-form-item> -->

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="QaddNewShow=false">取消</el-button>
        <el-button v-if="QisAddItem" type="primary" @click="addKillGoods('ruleForm')" :disabled="QwaitAddNotice" :loading="QwaitAddNotice">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择商品" :visible.sync="addNewShow" width="60%">
      <el-container class="notice">
        <el-header class="header">
          <el-form :inline="true" :model="formInline" class="form">
            <el-form-item>
              <el-input style="width: 340px;" placeholder="请输入商品名称" v-model="listQuery2.search"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search2">查询</el-button>
            </el-form-item>
            <multiSelect :obj='multiSelect' @load='loadClass2' @search="searchByclass"></multiSelect>
          </el-form>
        </el-header>
        <el-container>
          <el-main>
            <el-table :data="tableData2" stripe v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%">
              <el-table-column label="商品图片">
                <template slot-scope="scope">
                  <div style="width:60px;height:60px;align-items:center;display:flex;">
                    <img :src="scope.row.goodsImage" alt style="width:100%">
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="商品名" prop="goodsName"></el-table-column>
              <el-table-column label="原价" prop="goodsPrice"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="choiceThis(scope.$index, scope.row)">选择</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
        <el-footer>
          <el-pagination background @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="listQuery2.page" :page-sizes="[10,20,30,50]" :page-size="listQuery2.limit" layout="total, sizes, prev, pager, next" :total="total2"></el-pagination>
        </el-footer>
      </el-container>
    </el-dialog>
    <el-container class="notice">
      <el-header class="header">
        <el-form :inline="true" :model="formInline" class="form">
          <el-form-item>
            <el-button type="primary" icon="el-icon-edit-outline" @click="addItem">添加砍价商品</el-button>
          </el-form-item>
          <el-form-item>
              <el-input style="width: 340px;" placeholder="请输入商品名称" v-model="listQuery.search"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table :data="tableData" stripe v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%">
          <el-table-column label="商品图片">
            <template slot-scope="scope">
              <div style="width:100px;height:100px;align-items:center;display:flex;">
                <img :src="scope.row.goods.goods_image" alt style="width:100px">
              </div>
            </template>
          </el-table-column>
          <el-table-column label="活动名">
            <template slot-scope="scope">{{scope.row.rule_name}}</template>
          </el-table-column>
          <el-table-column label="商品名">
            <template slot-scope="scope">
              {{scope.row.goods.goods_name}}
            </template>
          </el-table-column>
          <el-table-column label="商品原价（￥）" prop="goodsprice">
            <template slot-scope="scope">
              {{scope.row.goods.goods_marketprice}}
            </template>
          </el-table-column>
          <el-table-column label="底价（￥）" prop="goods_price"></el-table-column>
          <el-table-column label="时限（小时）" prop="outime"></el-table-column>
          <el-table-column label="砍价类型">
            <template slot-scope="scope">
              {{scope.row.cutprice_type?'固定砍':'随机砍'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="200px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="lookItem(scope.$index, scope.row)">详情</el-button>
              <el-button size="mini" v-if="scope.row.cutprice_commend == 0" type="success" icon="el-icon-sort-up" @click="changeStatus(scope.$index, scope.row,'recommend')">首页推荐</el-button>
              <el-button size="mini" v-if="scope.row.cutprice_commend == 1" type="warning" icon="el-icon-sort-down" @click="changeStatus(scope.$index, scope.row,'notrecommend')">取消推荐</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteItem(scope.$index, scope.row)">删除砍价</el-button>
              <el-button size="mini" type="primary" @click="openDialog(scope.$index, scope.row)">编辑</el-button>   
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total"></el-pagination>
      </el-footer>
    </el-container>

     <!-- sale num -->
    <el-dialog title="编辑" :visible.sync="showSaleDialog" width="50%" append-to-body>

      <el-form>
        <el-form-item label="砍价商品销量" :label-width="formLabelWidth" prop="goods_storage">
          <el-input v-model.number="goods_salenum" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showSaleDialog=false">取消</el-button>
        <el-button type="primary" @click="submitSale('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import {
  getGoodsList_api,
  getGoods_api,
  addCutprice_api,
  putCutprice_api,
  getCutprice_api,
  deleteCutprice_api
} from "@/api/seller";
import Moment from "@/utils/moment";
import uploadFn from "@/utils/tencent_cos";
import config from "@/utils/config";
import multiSelect from '@/components/multiSelect';
import customInput from '@/components/customInput';
import customImg from '@/components/customImg';
import classAPI from '@/api/classify';
import commonReq from '@/api/common' ;
import sale from './sale';
import cSelect from "@/components/customSelect";
import cRadio from "@/components/customRadio";
import transport from './transport';


const QformForNotive = {
  dateRange: [],
  cutprice_type: 1,
  goods_freight: 0,
  goods_storage: 0
};
export default {
  mixins: [config, sale, transport],

  components:{
    multiSelect,
    customInput,
    customImg,
    cRadio,
    cSelect,
  },

  data() {
    return {
      //本页参数
      multiSelect:{ title: '分类', source: [], value: [], alert: null, search:true},
      goods_info: [],
      choiceGoodsId: 0, //规格对应goods_id
      alertValue: "", //规格select的值
      goodsDetail: {}, //商品详情
      //弹框参数
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() < Date.now()-86400000;
        }
      },
      addNewShow: false,
      QisAddItem: false,
      QwaitAddNotice: false,
      QaddNewShow: false,
      QformForNotive: Object.assign({}, QformForNotive),
      Qrules: {
        dateRange: [
          {
            required: true,
            message: "必填项",
            trigger: "change"
          }
        ],
        choiceGoodsId:[{required:true,message:'选择规格',trigger:'change'}],
        goods_price: [{ required: true, message: "必填项", trigger: "blur" }],
        goods_storage: [{ required: true, message: "必填项", trigger: "blur" }],
        goods_freight: [{ required: true, message: "必填项", trigger: "blur" }],
        outime: [{ required: true, message: "必填项", trigger: "blur" }],
        cutprice_price: [
          { required: true, message: "必填项", trigger: "blur" }
        ],
        cutprice_few: [{ required: true, message: "必填项", trigger: "blur" }],
        cutprice_more: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      formLabelWidth: "120px",
      formInline: {},
      //弹框商品表格数据
      tableData2: [],
      listLoading2: false,
      listQuery2: {
        page: 1,
        limit: 10,
        search: "",
        time: ""
      },
      total2: 1,
      //图片预览
      dialogImageUrl: "",
      dialogVisible: false,
      //砍价列表参数
      industry: "",
      industryList: [],
      listLoading: false,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 1,
      ruleName: { type: 'text', title: '活动名', value: '', alert: null, width: '120px', },
      img: { title: '封面图', value: [], alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {}, width: '120px' },
    };
  },
  async created() {
    //获取自定义商品分类
    this.getList();
    this.getUploadToken();
    let classRes = await classAPI.getClassList({ parent_id: 0 });
    classRes.data.forEach(v => {
        v.label = v.storegc_name;
        v.value = v.storegc_id;
        v.children = [];
      });
    this.multiSelect.source = classRes.data;
  },
  filters: {
    filterUrl: function(value) {
      let arr = [];
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

      return value;
    }
  },
  methods: {
    //get data============================================
    getList() {
      this.listLoading = true;
      let sendData = Object.assign({}, this.listQuery);
      getCutprice_api(sendData)
        .then(response => {
          if (response && response.status == 0) {
            let result = response.data;
            this.tableData = result;
            this.total = response.pagination.total;
          } else {
          }
          this.listLoading = false;
        })
        .catch(e => {
          this.listLoading = false;
        });
    },
    getList2() {
      this.listLoading2 = true;
      let sendData = Object.assign({}, this.listQuery2);
      sendData.goods_state = 1;
      sendData.is_vip=0;
      sendData.is_pintuan = 0;
      sendData.store_id = 1;
      getGoodsList_api(sendData)
        .then(response => {
          // 这里由于结构做了调整，导致编辑页面需要的数据无法从列表获取，这里只需要给tableData额外传一个id
          if (response && response.status == 0) {
            let result = response.data;
            let tempTableData = [];
            result.forEach(aData => {
              let temp_fileList1 = [];
              tempTableData.push({
                id: aData.goods_commonid,
                goodsImage: aData.goods_image, //显示
                goodsName: aData.goods_name, //显示
                goodsPrice: aData.goods_marketprice, //显示
                goods_freight: aData.goods_freight
              });
            });
            this.tableData2 = tempTableData;
            this.total2 =
              response.pagination && response.pagination.total
                ? response.pagination.total
                : 1;
          } else {
          }
          // this.list = response
          this.listLoading2 = false;
        })
        .catch(e => {
          this.listLoading2 = false;
        });
    },
    //添加商品===================================
    addItem() {
      this.isAddItem = true;
      this.addNewShow = true;
      this.QformForNotive = Object.assign({},QformForNotive);

      // init freight
      this.freightType.value = 1;
      this.freightTemp.value = '';
      this.freight.value = '';

      this.getList2();
    },
    choiceThis(index, row) {
      (this.goods_info = [
        {
          goodsImage: row.goodsImage,
          goodsName: row.goodsName,
          goodsPrice: row.goodsPrice
        }
      ]),
        (this.goodsDetail = { price: 0 });
      let id = row.id;
      this.alertValue = "";
      this.QformForNotive.goods_freight = row.goods_freight;
      getGoods_api(id).then(res => {
        if (res.data.spec_value) {
          //多规格-规格列选
          res.data.skuClassList = res.data.SKUList.map(v =>
            JSON.stringify(v.goods_spec).replace(/^\{|\}$|"/g, "")
          );
          this.goodsDetail = res.data;
          this.goodsDetail.price = 0;
          this.goodsDetail.goods_storage = 0;
        } else {
          this.choiceGoodsId = res.data.SKUList[0].goods_id;
          this.goodsDetail.goods_storage = res.data.SKUList[0].goods_storage;
          this.goodsDetail.price = res.data.goods_price;
        }
      });
      this.QaddNewShow = true;
      this.QisAddItem = true;

      this.initBargain();
    },
    handele_select(e) {
      this.QformForNotive.choiceGoodsId = this.goodsDetail.SKUList[e].goods_id;
      this.choiceGoodsId = this.goodsDetail.SKUList[e].goods_id;
      this.goodsDetail.price = this.goodsDetail.SKUList[e].goods_price;
      this.QformForNotive.goods_storage = this.goodsDetail.SKUList[
        e
      ].goods_storage;
    },
    async addKillGoods(formName) {
      let res = await new Promise((res, rej) => {
        this.$refs["qruleForm"].validate(valid => {
          if (valid) {
            res(true);
          } else {
            res(false);
          }
        });
      });
      if (!res) return;
      if (!this.choiceGoodsId) return;

      //
      if(!this.img.value.length) return this.img.alert = `${this.img.title}不能为空!`;
      if(!this.ruleName.value) return this.ruleName.alert = `${this.ruleName.title}不能为空!`;

      // freight
      if (this.freightType.value == 1 && !this.freight.value) return (this.freight.alert = `请选择${this.freight.title}`);
      if (this.freightType.value == 2 && !this.freightTemp.value) return this.freightTemp.alert = `请选择${this.freightTemp.title}`;

      this.QwaitAddNotice = true;
      let send = {
        goods_id: this.choiceGoodsId,
        goods_price: this.QformForNotive.goods_price,
        outime: this.QformForNotive.outime,
        start_time: this.QformForNotive.dateRange[0]/1000,
        end_time: this.QformForNotive.dateRange[1]/1000,
        // goods_freight: this.QformForNotive.goods_freight,
        goods_storage: this.QformForNotive.goods_storage,
        cutprice_type: this.QformForNotive.cutprice_type,
        rule_name: this.ruleName.value, 
        images: this.img.value.map(v => (v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url )),
      };
      if (this.QformForNotive.cutprice_type == 1) {
        send.cutprice_price = this.QformForNotive.cutprice_price;
      } else {
        send.cutprice_few = this.QformForNotive.cutprice_few;
        send.cutprice_more = this.QformForNotive.cutprice_more;
      }

      // freight
      send.goods_freight = this.freightType.value == 1 ? this.freight.value : '0';
      send.transport_id = this.freightType.value == 2 ? this.freightTemp.value : '0';

      addCutprice_api(send).then(res => {
        this.QwaitAddNotice = false;
        this.addNewShow = false;
        this.QaddNewShow = false;
        if (res && res.status === 0) {
          this.$notify({
            title: "成功",
            message: "操作成功",
            type: "success"
          });
          this.getList();
        } else {
          this.$notify({
            title: "操作失败",
            message: res.error,
            type: "error"
          });
        }
      });
    },
    //上下架==============================================
    changeStatus(index, row, state) {
      let send = {
        cutprice_id: row.cutprice_id,
        type: state
      };
      putCutprice_api(send).then(res => {
        if (res.status == 0) {
          this.$notify({
            title: "操作成功",
            type: "success",
            message: "改变状态成功"
          });
          this.getList();
        } else {
          this.$notify({
            title: "操作失败",
            type: "error",
            message: res.error
          });
        }
      });
    },
    //delete=============================================
    deleteItem(index, row) {
      let id = row.cutprice_id;
      this.$confirm(`此操作将删除该条目, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteNewNotice(id);
        })
        .catch(() => {
          this.$notify.info({
            title: "消息",
            message: "已取消"
          });
        });
    },
    deleteNewNotice(id) {
      deleteCutprice_api(id)
        .then(res => {
          if (res && res.status === 0) {
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success"
            });
            this.getList();
          } else {
            this.$notify({
              title: "操作失败",
              message: res.error,
              type: "error"
            });
          }
        })
        .catch(err => {
          console.error("deleteAdmin_api");
        });
    },
    //lookItem
    lookItem(index, row) {
      this.QisAddItem = false;
      this.QaddNewShow = true;
      (this.goods_info = [
        {
          goodsImage: row.goods.goods_image,
          goodsName: row.goods.goods_name,
          goodsPrice: row.goods.goods_marketprice
        }
      ])
      this.goodsDetail.price = row.goods.goods_price
      this.QformForNotive = {
        goods_storage:row.goods.goods_storage,
        goods_freight:row.goods.goods_freight,
        dateRange:[row.start_time*1000,row.end_time*1000],
        outime:row.outime,
        cutprice_price:row.cutprice_price,
        cutprice_few:row.cutprice_few,
        cutprice_more:row.cutprice_more,
        cutprice_type:row.cutprice_type,
        goods_price:row.goods_price,
        goods_spec:row.goods.goods_spec
      };

      this.img = { 
        title: '封面图', 
        value: row.images ? row.images.map(v => ({ url: v })) : [], 
        limit: 1,
        alert: null, 
        url: 'https://up-z2.qiniup.com', 
        cdnUrl: 'https://cdn.health.healthplatform.xyz', 
        body: this.img.body, 
        width: '120px' 
      },

      this.img.limit = this.img.value.length;
      this.ruleName.value = row.rule_name;
    },
    //search=============================================
    search() {
      this.listQuery.page = 1;
      this.getList();
    },
    search2() {
      this.listQuery2.page = 1;
      this.getList2();
    },
    handleSizeChange2(val) {
      this.listQuery2.limit = val;
      this.getList2();
    },
    handleCurrentChange2(val) {
      this.listQuery2.page = val;
      this.getList2();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
        async loadClass2(val){
      let param,
          selClass,
          source = this.multiSelect.source;

      selClass = source.find(v => v.value == val[0]);
      if(val[1]) selClass = selClass.children.find(v => v.value == val[1]);

      let res = await classAPI.getClassList({ parent_id: val[1] || val[0] });

      res.data.forEach(v => {
        v.label = v.storegc_name;
        v.value = v.storegc_id;
        if(!val[1]) v.children = [];
      });

      selClass.children = res.data;
    },
    searchByclass(param){
      this.listQuery2.page =1;
      this.listQuery2.gc_id = param[2];
      this.getList2();
    },

    initBargain(){
      this.ruleName.value = '';
      this.ruleName.alert = null;

      this.img.value = [];
      this.img.alert = null;

      if('limit' in this.img) delete this.img.limit;
    },

    async getUploadToken(){
      let res = await commonReq.getUploadToken();
      if(res.error) return this.$message.error(`getUploadToken: ${res.error}`);
      this.img.body.token= res.data;
      this.img.body.config= "{ useCdnDomain: true }";
    },

  }
};
</script>