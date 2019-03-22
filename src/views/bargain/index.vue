<style lang="stylus">
.notice {
  .header {
    margin-top: 20px;
  }
}
</style>

<template>
  <div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
    <!-- 添加-->
    <el-dialog title="添加秒杀商品" :visible.sync="addNewShow" width="50%">
      <el-dialog title="新增秒杀" :visible.sync="QaddNewShow" width="50%" append-to-body>
        <el-form :model="QformForNotive" ref="qruleForm" :rules="Qrules">
          <el-form-item label="规格" :label-width="formLabelWidth" v-if="goodsDetail.skuClassList" prop="choiceGoodsId">
            <el-select v-model="alertValue" placeholder="请选择规格" @change="handele_select">
              <el-option v-for="(item,index) in goodsDetail.skuClassList" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="封面图" prop="fileList" :label-width="formLabelWidth">
            <el-upload action list-type="picture-card" accept="image/*" :limit="1" :auto-upload="false" :on-change="handleImgChange_image" :on-preview="handlePictureCardPreview" :on-remove="handleRemove_goods_image" :file-list="QformForNotive.fileList">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <p class="hbs-margin-left140">图片建议尺寸：宽750*高750;限传一张;</p>
          <el-form-item label="活动时间" :label-width="formLabelWidth" prop="dateRange">
            <el-date-picker style="width:400px" v-model="QformForNotive.dateRange" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="每次砍价时限" :label-width="formLabelWidth" prop="dateRange">
            <el-input type="number" min="0" v-model="QformForNotive.tprice2" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="团购类型" :label-width="formLabelWidth">
            <el-radio-group v-model="QformForNotive.radio">
              <el-radio :label="1">固定砍</el-radio>
              <el-radio :label="2">随机砍</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="QformForNotive.radio==1" label="固定砍价金额" :label-width="formLabelWidth" prop="tprice2">
            <el-input type="number" v-model="QformForNotive.tprice2" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item v-if="QformForNotive.radio==2" label="随机砍价区间" :label-width="formLabelWidth" prop="tpeople2">
            <el-input type="number" style="width:100px;" v-model="QformForNotive.tpeople2" auto-complete="off"></el-input>
            <el-input type="number" style="width:100px;" v-model="QformForNotive.tpeople2" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="现价" :label-width="formLabelWidth">
            <el-input disabled v-model="goodsDetail.price" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="底价" :label-width="formLabelWidth" prop="goods_price">
            <el-input v-model.number="QformForNotive.goods_price" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="库存" :label-width="formLabelWidth" prop="limit_num">
            <el-input v-model.number="QformForNotive.limit_num" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="运费" :label-width="formLabelWidth" prop="goods_freight">
            <el-input v-model.number="QformForNotive.goods_freight" auto-complete="off"></el-input>
          </el-form-item>
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
              <el-table-column label="价格" prop="goodsPrice"></el-table-column>
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
          <el-table-column label="商品名" prop="name"></el-table-column>
          <el-table-column label="商品价格（￥）" prop="goodsprice">
            <template slot-scope="scope">
              {{scope.row.goods.goods_price}}
            </template>
          </el-table-column>
          <el-table-column label="秒杀价格（￥）" prop="goods_price"></el-table-column>
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
              <el-button size="mini" v-if="scope.row.rule_status==2?true:false" type="success" icon="el-icon-sort-up" @click="changeStatus(scope.$index, scope.row,'1')">上架</el-button>
              <el-button size="mini" v-if="scope.row.rule_status==1?true:false" type="warning" icon="el-icon-sort-down" @click="changeStatus(scope.$index, scope.row,'2')">下架</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteItem(scope.$index, scope.row)">删除秒杀</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total"></el-pagination>
      </el-footer>
    </el-container>
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
const QformForNotive = {
  dateRange: [],
  limit_buy: 1,
  goods_freight: 0,
  fileList: [],
  radio:1
};
export default {
  mixins: [config],
  data() {
    return {
      //本页参数
      choiceGoodsId: 0, //规格对应goods_id
      alertValue: "", //规格select的值
      goodsDetail: {}, //商品详情
      //弹框参数
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
        goods_price: [{ required: true, message: "必填项", trigger: "blur" }],
        limit_num: [{ required: true, message: "必填项", trigger: "blur" }],
        limit_buy: [{ required: true, message: "必填项", trigger: "blur" }],
        goods_freight: [{ required: true, message: "必填项", trigger: "blur" }],
        rule_name: [{ required: true, message: "必填项", trigger: "blur" }]
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
        limit: 10
      },
      total: 1
    };
  },
  async created() {
    //获取自定义商品分类
    this.getList();
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
          // 这里由于结构做了调整，导致编辑页面需要的数据无法从列表获取，这里只需要给tableData额外传一个id
          if (response && response.status == 0) {
            let result = response.data;
            result.forEach(aData => {
                aData.active_time=
                  aData.end_time == "2038-01-19 11:14:07"
                    ? "不限"
                    : aData.start_time.replace("00:00:00", "") +
                      "至" +
                      aData.end_time.replace("00:00:00", "");
            });
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
                goodsPrice: aData.goods_price, //显示
                goodsNum: aData.goods_serial, //显示
                goods_freight:aData.goods_freight
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
      this.getList2();
    },
    choiceThis(index,row) {
      this.goodsDetail = { price: 0 };
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
        } else {
          this.choiceGoodsId = res.data.SKUList[0].goods_id;
          this.goodsDetail.price = res.data.goods_price;
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
      if (!this.choiceGoodsId) return;
      this.QwaitAddNotice = true;
      let send = {
        goods_id: this.choiceGoodsId,
        goods_price: this.QformForNotive.goods_price,
        start_time: this.QformForNotive.dateRange[0],
        end_time: this.QformForNotive.dateRange[1],
        limit_num: this.QformForNotive.limit_num,
        limit_buy: this.QformForNotive.limit_buy,
        images: [this.QformForNotive.fileList[0].url],
        goods_freight: this.QformForNotive.goods_freight,
        rule_name: this.QformForNotive.rule_name
      };
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
        rule_id: [row.id],
        rule_status: state
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
    //search=============================================
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
    }
  }
};
</script>