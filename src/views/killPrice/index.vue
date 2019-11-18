<style lang="css">
</style>

<template>
  <div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
    <!-- 添加-->
    <el-dialog title="添加秒杀商品" :visible.sync="addNewShow" width="60%">
      <el-dialog title="新增秒杀" :visible.sync="QaddNewShow" width="50%" append-to-body>
        <el-form :model="QformForNotive" ref="qruleForm" :rules="Qrules" label-width='120px'>
          <el-form-item label="规格" :label-width="formLabelWidth" v-if="goodsDetail.skuClassList" prop="choiceGoodsId">
            <el-select v-model="alertValue" placeholder="请选择规格" @change="handele_select">
              <el-option v-for="(item,index) in goodsDetail.skuClassList" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>

          <custom-img :obj='img'></custom-img>

          <p class="hbs-margin-left140">图片建议尺寸：宽750*高750;限传一张;</p>
          <el-form-item label="活动名称" :label-width="formLabelWidth" prop="rule_name">
            <el-input v-model.number="QformForNotive.rule_name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="活动时间" :label-width="formLabelWidth" prop="dateRange">
            <el-date-picker style="width:400px" v-model="QformForNotive.dateRange" 
              type="datetimerange" range-separator="至" start-placeholder="开始日期" 
              end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="售价" :label-width="formLabelWidth">
            <el-input disabled v-model="goodsDetail.price" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="秒杀价" :label-width="formLabelWidth" prop="goods_price">
            <el-input v-model.number="QformForNotive.goods_price" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="实际秒杀数量" :label-width="formLabelWidth" prop="limit_num">
            <el-input v-model.number="QformForNotive.limit_num" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="每人限购" :label-width="formLabelWidth" prop="limit_buy">
            <el-input v-model.number="QformForNotive.limit_buy" auto-complete="off"></el-input>
          </el-form-item>

          <!-- 运费 -->
          <c-radio :obj='freightType'></c-radio>

          <custom-input :obj='freight' v-if="freightType.value == 1"></custom-input>
          <c-select :obj='freightTemp' v-if="freightType.value == 2"></c-select>
          <!-- <el-form-item label="运费" :label-width="formLabelWidth" prop="goods_freight">
            <el-input v-model.number="QformForNotive.goods_freight" auto-complete="off"></el-input>
          </el-form-item> -->

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="QaddNewShow=false">取消</el-button>
          <el-button type="primary" @click="addKillGoods('ruleForm')" :disabled="QwaitAddNotice" :loading="QwaitAddNotice">确 定</el-button>
        </span>
      </el-dialog>
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
            <el-button type="primary" icon="el-icon-edit-outline" @click="addItem">添加秒杀商品</el-button>
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
                <img :src="scope.row.image" alt style="width:100px">
              </div>
            </template>
          </el-table-column>
          <el-table-column label="秒杀商品ID" prop="id"></el-table-column>
          <el-table-column label="活动名" prop="rule_name"></el-table-column>
          <el-table-column label="商品名" prop="name"></el-table-column>
          <el-table-column label="商品原价（￥）" prop="goodsprice"></el-table-column>
          <el-table-column label="秒杀价格（￥）" prop="killPrice"></el-table-column>
          <el-table-column label="秒杀数量" prop="limit_num"></el-table-column>
          <el-table-column label="秒杀限购" prop="limit_buy"></el-table-column>
          <el-table-column label="活动时间" prop="active_time" width="200"></el-table-column>
          <el-table-column label="秒杀商品状态">
            <template slot-scope="scope">
              <el-tag size="medium">{{ scope.row.rule_status==1?'秒杀中':scope.row.rule_status == 2?'下架中':'秒杀超时' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="200px">
            <template slot-scope="scope">
              <el-button size="mini" v-if="scope.row.rule_commend == 0" type="success" icon="el-icon-sort-up" @click="changeRecommend(scope.$index, scope.row,'1')">首页推荐</el-button>
              <el-button size="mini" v-if="scope.row.rule_commend == 1" type="warning" icon="el-icon-sort-down" @click="changeRecommend(scope.$index, scope.row,'0')">取消推荐</el-button>
              <!-- <el-button size="mini" v-if="scope.row.rule_status==2?true:false" type="success" icon="el-icon-sort-up" @click="changeStatus(scope.$index, scope.row,'1')">上架</el-button>
              <el-button size="mini" v-if="scope.row.rule_status==1?true:false" type="warning" icon="el-icon-sort-down" @click="changeStatus(scope.$index, scope.row,'2')">下架</el-button> -->
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteItem(scope.$index, scope.row)">删除秒杀</el-button>
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
        <el-form-item label="秒杀商品销量" :label-width="formLabelWidth" prop="goods_storage">
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
  addSecKill_api,
  putSecKill_api,
  getSecKill_api,
  deleteSeckill_api
} from "@/api/seller";
import Moment from "@/utils/moment";
import uploadFn from "@/utils/tencent_cos";
import config from "@/utils/config";
import customImg from '@/components/customImg';
import commonReq from '@/api/common' ;
import multiSelect from '@/components/multiSelect';
import classAPI from '@/api/classify';
import sale from './sale';
import customInput from "@/components/customInput";
import cSelect from "@/components/customSelect";
import cRadio from "@/components/customRadio";
import transport from './transport';

const QformForNotive = {
  dateRange: [],
  limit_buy:1,
  goods_freight:0,
  fileList:[]
};
export default {
  mixins: [config, sale, transport],

  components:{
    customImg,
    multiSelect,
    customInput,
    cRadio,
    cSelect,
  },

  data() {
    return {
      multiSelect:{ title: '分类', source: [], value: [], alert: null, search:true},
      img: { title: '封面图', value: [], alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      //本页参数
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
        fileList: [
          {
            required: true,
            message: "必填项",
            trigger: "change"
          }
        ],
        dateRange: [
          {
            required: true,
            message: "必填项",
            trigger: "change"
          }
        ],
        goods_price: [{required: true,message: "必填项",trigger: "blur"}],
        limit_num: [{required: true,message: "必填项",trigger: "blur"}],
        limit_buy: [{required: true,message: "必填项",trigger: "blur"}],
        goods_freight: [{required: true,message: "必填项",trigger: "blur"}],
        rule_name: [{required: true,message: "必填项",trigger: "blur"}],
      },
      formLabelWidth: "120px",
      //
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
      //秒杀列表参数
      industry: "",
      industryList: [],
      listLoading: false,
      tableData: [],
      listQuery: {
        page: 1,
        limit: 10,
      },
      total: 1,
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
      getSecKill_api(sendData)
        .then(response => {
          // 这里由于结构做了调整，导致编辑页面需要的数据无法从列表获取，这里只需要给tableData额外传一个id
          if (response && response.status == 0) {
            let result = response.data;
            let tempTableData = [];
            result.forEach(aData => {
              tempTableData.push({
                //后端生成
                id: aData.rule_id,
                rule_name: aData.rule_name,
                image: aData.goods.goods_image,
                name: aData.goods.goods_name,
                goodsprice: aData.goods.goods_marketprice,
                killPrice: aData.goods_price,
                limit_num: aData.goods.goods_storage,
                limit_buy: aData.limit_buy,
                active_time:
                  aData.end_time == "2038-01-19 11:14:07"
                    ? "不限"
                    : aData.start_time.replace("00:00:00", "") +
                      "至" +
                      aData.end_time.replace("00:00:00", ""),
                rule_status:aData.rule_status,
                rule_commend:aData.rule_commend
              });
            });
            this.tableData = tempTableData;
            this.total =response.pagination.total;
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
      getGoodsList_api(sendData)
        .then(response => {
          // 这里由于结构做了调整，导致编辑页面需要的数据无法从列表获取，这里只需要给tableData额外传一个id
          if (response && response.status == 0) {
            let result = response.data;
            let tempTableData = [];
            result.forEach(aData => {
              let temp_fileList1 = [];
              let temp_fileList2 = [];
              if (aData.goods_image) {
                temp_fileList1.push({ url: aData.goods_image });
              }
              if (aData.id_card_front) {
                temp_fileList2.push({ url: aData.id_card_front });
              }
              if (aData.id_card_behind) {
                temp_fileList2.push({ url: aData.id_card_behind });
              }
              // goodstotal 库存 前后端不一致 需要特殊处理
              tempTableData.push({
                //后端生成
                id: aData.goods_commonid,
                isUp: aData.goods_state,
                //前后统一
                goodsImage: aData.goods_image, //显示
                goodsType: aData.is_appoint ? 1 : 0,
                is_virtualTXT: aData.is_virtual ? "虚拟" : "实体", //显示补充，实际无用
                goodsName: aData.goods_name, //显示
                goodsPrice: aData.goods_marketprice, //显示
                goodsNum: aData.goods_serial //显示
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
    //add seckill goods===================================
    addItem() {
      this.isAddItem = true;
      this.addNewShow = true;

      // init freight
      this.freightType.value = 1;
      this.freightTemp.value = '';
      this.freight.value = '';

      this.getList2();
    },
    choiceThis(index, row) {
      this.goodsDetail = {price:0};
      this.QformForNotive = Object.assign({},QformForNotive);
      this.img.value = [];
      let id = row.id;
      this.alertValue = "";
      getGoods_api(id).then(res => {
        if (res.data.spec_value) {
          //多规格-规格列选
          res.data.skuClassList = res.data.SKUList.map(v =>
            JSON.stringify(v.goods_spec).replace(/^\{|\}$|"/g, "")
          );
          this.goodsDetail = res.data;
          this.goodsDetail.price = 0;
        } else {
          this.choiceGoodsId = res.data.SKUList[0].goods_id;
          this.goodsDetail.price =res.data.goods_price;
        }
      });
      this.QaddNewShow = true;
    },
    handele_select(e) {
      this.choiceGoodsId = this.goodsDetail.SKUList[e].goods_id;
      this.goodsDetail.price = this.goodsDetail.SKUList[e].goods_price;
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
      if(!this.choiceGoodsId) return;

      // cover Image
      if(!this.img.value.length) return this.img.alert = `封面图不能为空!`;
      let img = this.img.value.map(v => { return v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url });
      if(!img[0]) return console.error('img value :', img);

      // freight
      if (this.freightType.value == 1 && !this.freight.value) return (this.freight.alert = `请选择${this.freight.title}`);
      if (this.freightType.value == 2 && !this.freightTemp.value) return this.freightTemp.alert = `请选择${this.freightTemp.title}`;

      this.QwaitAddNotice = true;

      let send = {
        goods_id:this.choiceGoodsId,
        goods_price:this.QformForNotive.goods_price,
        start_time:this.QformForNotive.dateRange[0],
        end_time:this.QformForNotive.dateRange[1],
        limit_num:this.QformForNotive.limit_num,
        limit_buy:this.QformForNotive.limit_buy,
        images:img,
        // goods_freight:this.QformForNotive.goods_freight,
        rule_name:this.QformForNotive.rule_name
      }

      // freight
      send.goods_freight = this.freightType.value == 1 ? this.freight.value : '0';
      send.transport_id = this.freightType.value == 2 ? this.freightTemp.value : '0';

      addSecKill_api(send).then(res=>{
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
              message:res.error,
              type: "error"
            });
          }
      })
    },
    //上下架==============================================
    changeStatus(index, row,state) {
      let send = {
        rule_id:[row.id],
        rule_status:state
      }
      putSecKill_api(send).then(res=>{
        if(res.status == 0){
          this.$notify({
            title:'操作成功',
            type:'success',
            message:'改变状态成功'
          })
          this.getList();
        }else{
          this.$notify({
            title:'操作失败',
            type:'error',
            message:res.error
          })
        }
      })
    },
    changeRecommend(index, row, state) {
      let send = {
        rule_id:[row.id],
        rule_commend: state
      };
      putSecKill_api(send).then(res => {
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
      let id = row.id;
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
      deleteSeckill_api(id)
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
              message:res.error,
              type: "error"
            });
          }
        })
        .catch(err => {
          console.error("deleteAdmin_api");
        });
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
    //upLoad
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async handleImgChange_image(file, fileList) {
      let url1 = await uploadFn(file.raw);
      console.log(this.QformForNotive);
      this.QformForNotive.fileList.push({ url: url1[0] });
    },
    handleRemove_goods_image(file, fileList) {
      this.QformForNotive.fileList = fileList;
    },
    async getUploadToken(){
      let res = await commonReq.getUploadToken();
      if(res.error) return this.$message.error(`getUploadToken: ${res.error}`);
      this.img.body.token= res.data;
      this.img.body.config= "{ useCdnDomain: true }";
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
  }
};
</script>