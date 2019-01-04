<style lang="stylus">
.notice {
  .header {
    margin-top: 20px;
  }
}
</style>

<template>
  <div>
    <!-- 添加-->
    <el-dialog title="添加团购商品" :visible.sync="addNewShow" width="80%">
      <el-dialog title="新增团购" :visible.sync="QaddNewShow" width="50%" append-to-body>
        <el-form :model="QformForNotive" ref="qruleForm" :rules="Qrules">
          <el-form-item
            label="规格"
            :label-width="formLabelWidth"
            v-if="goodsDetail"
            prop="choiceGoodsId"
          >
            <el-select v-model="alertValue" placeholder="请选择规格" @change="handele_select">
              <el-option
                v-for="(item,index) in goodsDetail.spec_value"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="团购价" :label-width="formLabelWidth" prop="tprice">
            <el-input v-model.number="QformForNotive.tprice" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="团购人数" :label-width="formLabelWidth" prop="tpeople">
            <el-input v-model.number="QformForNotive.tpeople" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="团购时限" :label-width="formLabelWidth" prop="thours">
            <el-input v-model.number="QformForNotive.thours" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="活动时间" :label-width="formLabelWidth">
            <el-radio-group v-model="radio" @change="choiceRadio">
              <el-radio :label="0">不限</el-radio>
              <el-radio :label="1">日期选择</el-radio>
            </el-radio-group>
            <el-date-picker
              v-if="radio==1"
              style="width:400px"
              v-model="QformForNotive.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="QaddNewShow=false">取消</el-button>
          <el-button
            type="primary"
            @click="QaddOne('ruleForm')"
            :disabled="QwaitAddNotice"
            :loading="QwaitAddNotice"
          >确 定</el-button>
        </span>
      </el-dialog>
      <el-container class="notice">
        <!-- <el-header class="header">
          <el-form :inline="true" :model="formInline" class="form">
            <el-form-item>
              <el-input style="width: 340px;" placeholder="请输入商品名称、编码" v-model="listQuery2.search"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search2">查询</el-button>
            </el-form-item>
            <el-form-item label="分类" :label-width="formLabelWidth">
              <el-select v-model="listQuery2.storegc_id" placeholder="请选择">
                <el-option
                  v-for="item in industryList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-header>-->
        <el-container>
          <el-main>
            <el-table
              :data="tableData2"
              stripe
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              style="width: 100%"
            >
              <el-table-column label="商品图片">
                <template slot-scope="scope">
                  <div style="width:100px;height:100px;align-items:center;display:flex;">
                    <img :src="scope.row.goodsImage" alt style="width:100px">
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="商品名" prop="goodsName"></el-table-column>
              <el-table-column label="价格" prop="goodsPrice"></el-table-column>
              <el-table-column label="操作" min-width="300px">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="editItem(scope.$index, scope.row)"
                  >选择</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
        <el-footer>
          <el-pagination
            background
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page="listQuery2.page"
            :page-sizes="[10,20,30, 50]"
            :page-size="listQuery2.limit"
            layout="total, sizes, prev, pager, next"
            :total="total2"
          ></el-pagination>
        </el-footer>
      </el-container>
    </el-dialog>
    <!--内容弹框开始 -->
    <el-dialog title="编辑团购商品" :visible.sync="dialogFormVisible" width="90%">
      <el-form :rules="rules2" ref="form" :model="form" size="medium">
        <el-form-item label="商品分类" label-width="140px">
          <template>
            <el-select v-model="alertValue" placeholder="请选择分类" @change="handele_select2">
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
              <div
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
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>

        <el-form-item label="商品运费" prop="goods_freight" label-width="140px">
          <el-input type="number" v-model="form.goods_freight"></el-input>
        </el-form-item>
        <el-form-item label="基础销量" prop="goods_faker_salenum" label-width="140px">
          <el-input type="number" v-model="form.goods_faker_salenum"></el-input>
        </el-form-item>
        <el-form-item label="商品详情" label-width="140px">
          <editor
            style="width: 800px; height: 300px;"
            :menubar="editorConfig.menu"
            :height="editorConfig.height"
            v-model="form.goods_body"
          />
        </el-form-item>
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
    <el-container class="notice">
      <el-header class="header">
        <el-form :inline="true" :model="formInline" class="form">
          <el-form-item>
            <el-button type="primary" icon="el-icon-edit-outline" @click="addItem">添加团购商品</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          :data="tableData"
          stripe
          v-loading="listLoading"
          element-loading-text="给我一点时间"
          style="width: 100%"
        >
          <el-table-column label="商品图片">
            <template slot-scope="scope">
              <div style="width:100px;height:100px;align-items:center;display:flex;">
                <img :src="scope.row.image" alt style="width:100px">
              </div>
            </template>
          </el-table-column>
          <el-table-column label="团购商品ID" prop="id"></el-table-column>
          <el-table-column label="商品名" prop="name"></el-table-column>
          <el-table-column label="商品价格" prop="goodsprice"></el-table-column>
          <el-table-column label="团购价格" prop="gurouprice"></el-table-column>
          <el-table-column label="团购商品状态">
            <template slot-scope="scope">
              <el-tag size="medium">{{ scope.row.tstate }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="300px">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteItem(scope.$index, scope.row)">取消团购</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
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
    </el-container>
  </div>
</template>
<script>
import {
  getGoodsList_api,
  getgroupbuy_api,
  addgroupbuy_api,
  deletegroupbuy_api,
  getGoods_api,
  getgroupGoods_api,
  getIndustryList_api
} from "@/api/seller";
import Moment from "@/utils/moment";
import config from "@/utils/config";
const QformForNotive = {
  dateRange: ""
};
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
const formForNotiveChild2List = [{}];
export default {
  mixins: [config],
  data() {
    return {
      QrulesChild: {},
      QisAddItem: false,
      QwaitAddNotice: false,
      QaddNewShow: false,
      QformForNotive: Object.assign({}, QformForNotive),
      Qrules: {
        tprice: [
          {
            required: true,
            message: "请输入价格,不少于0",
            trigger: "blur",
            min: 0,
            type: "number"
          }
        ],
        tpeople: [
          {
            required: true,
            message: "请输入团购人数",
            trigger: "blur",
            min: 2,
            type: "integer"
          }
        ],
        thours: [
          {
            required: true,
            message: "团购小时数",
            trigger: "blur",
            min: 1,
            type: "integer"
          }
        ],
        tlimit: [
          {
            required: true,
            message: "成员数量限制",
            trigger: "blur",
            min: 1,
            type: "integer"
          }
        ]
      },

      Q_outData: "",
      Q_Aid: "",

      Qlistshow: false,
      inline: true,
      QaddNewShow: false,
      QtableData: [],
      QlistLoading: false,
      QlistQuery: {
        page: 1,
        limit: 10,
        search: "",
        time: ""
      },
      Qtotal: 1,
      //out
      addNewShow: false,
      formInline: {},
      listQuery2: {
        page: 1,
        limit: 10,
        search: "",
        time: ""
      },
      total2: 1,
      tableData2: [
        {
          goodsImage: "",
          goodsName: "",
          goodsType: "",
          goodsNum: "",
          goodsState: "",
          goodsPrice: "",
          goodsTotal: "",
          goodsSell: ""
          //   opera: '查看123'
        },
        {
          goodsImage: "",
          goodsName: "",
          goodsType: "",
          goodsNum: "",
          goodsState: "",
          goodsPrice: "",
          goodsTotal: "",
          goodsSell: ""
          //   opera: '查看123'
        }
      ],
      listLoading2: false,
      dialogImageUrl: "",
      imgLimit1: 1,
      dialogVisible: false,
      fileList1: [
        {
          url: ""
        }
      ],
      fileList2: [
        {
          url: ""
        }
      ],
      industryList: [],

      isAddItem: true,
      waitAddNotice: false,
      // ---------------------
      formForNotive: {
        name: "",
        value: ""
      },
      addNewShow: false,
      formLabelWidth: "120px",
      //header
      industry: "",
      formInline: {},
      // body
      listLoading: false,
      tableData: [
        {
          image: "",
          goodsName: "",
          goodsPrice: ""
        }
      ],
      // footer
      listQuery: {
        page: 1,
        limit: 20,
        search: "",
        time: ""
      },
      total: 1,
      goodsDetail: null,
      alertValue: "",
      choiceGoodsId: null,
      radio: 0,
      dialogFormVisible: false,
      formForNotiveChild1: Object.assign({}, formForNotiveChild1),
      formForNotiveChild2List: Object.assign([], formForNotiveChild2List),
      //表单内容
      form: Object.assign({}, form),
      selectedOptions_alert: [],
      options: [],
      value_top: "",
      //弹框选择的分类
      alertValue: "",
       //正在上传图片
      isUpimg: false,
      isloading: false,
      //表单验证规则
      rules2: {
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
      }
    };
  },
  async created() {
    //获取自定义商品分类
    this.getGoodsClass();
    this.getList();
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
  methods: {
    // Q
    HeditItem(id) {
      this.QformForNotive = Object.assign({ id });
      this.QaddNewShow = true;
    },
    // out Q
    // out
    async QaddOne() {
      this.QeditOne();
    },
    async QeditOne() {
      let res = await new Promise((res, rej) => {
        this.$refs["qruleForm"].validate(valid => {
          if (valid) {
            res(true);
          } else {
            res(false);
          }
        });
      });
      if (!res) {
        return;
      }
      this.QwaitAddNotice = true;
      let dateStart = "2018-12-31 00:00:00";
      let dateEnd = "2048-12-31 00:00:00";

      if (this.radio == 0) {
        dateStart = "2018-12-31 00:00:00";
        dateEnd = "2048-12-31 00:00:00";
      } else {
        dateStart = Moment(this.QformForNotive.dateRange[0]).format(
          "yyyy-MM-dd HH:mm:ss"
        );
        dateEnd = Moment(this.QformForNotive.dateRange[1]).format(
          "yyyy-MM-dd HH:mm:ss"
        );
      }
      let sendData = {
        goods_id: this.choiceGoodsId,
        goods_price: this.QformForNotive.tprice,
        group_num: this.QformForNotive.tpeople,
        limit_time: this.QformForNotive.thours,
        start_time: dateStart,
        end_time: dateEnd
      };
      addgroupbuy_api(sendData)
        .then(data => {
          this.QwaitAddNotice = false;
          this.QaddNewShow = false;
          if (data && data.status === 0) {
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success"
            });
            this.getList();
            this.QaddNewShow = false;
            this.addNewShow = false;
          } else if (data.status === 1) {
            this.$notify({
              title: "失败",
              message: data.error,
              type: "error"
            });
          } else {
            this.$notify({
              title: "失败",
              message: "操作失败",
              type: "error"
            });
          }
        })
        .catch(e => {
          this.QwaitAddNotice = false;
          this.QaddNewShow = false;
          console.error("manageShop:addgroupbuy_api 接口错误");
        });
    },
    QdeleteAA(index) {
      this.QformForNotiveChildList.splice(index, 1);
    },
    QaddAA() {
      this.QformForNotiveChildList.push({});
    },
    // head
    QaddItem() {
      //显示 弹框
      this.QisAddItem = true;
      this.QaddNewShow = true;
      this.QformForNotive = Object.assign({}, QformForNotive);
    },
    // body

    QgetList() {
      this.QlistLoading = true;
      let sendData = Object.assign({}, this.QlistQuery);
      sendData.id = this.Q_Aid;
      getQList_api(sendData)
        .then(response => {
          if (response && response.status == "success") {
            let result = response.result;
            let tempTableData = [];
            result.forEach(aData => {
              tempTableData.push({
                id: aData.examinationId, //试卷id
                QID: aData.id, //题目id
                title: aData.title, //问题
                order: aData.order, //序号
                answer: aData.answer //答案
              });
            });
            this.QtableData = tempTableData;
          }
          // this.list = response
          this.Qtotal =
            response.paging && response.paging.total
              ? response.paging.total
              : 0;
          this.QlistLoading = false;
        })
        .catch(e => {
          console.error(e);
          this.QlistLoading = false;
        });
    },
    QeditItem(index, rowData) {
      // this.editLoading = true
      this.QformForNotive = Object.assign({}, rowData);
      let answerList = JSON.parse(rowData.answer);
      this.QformForNotiveChildList = Object.assign([], answerList);
      this.QisAddItem = false;
      this.QaddNewShow = true;
    },
    QdeleteNewNotice(id, QID) {
      let sendData = {
        examinationId: id,
        questionId: QID // 父亲(外层)id
      };
      deleteQOne_api(sendData)
        .then(res => {
          if (res && res.status === "success") {
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success"
            });
            this.QgetList();
          } else {
            this.$notify({
              title: "错误",
              message: "操作失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          console.error("deleteAdmin_api");
        });
    },
    QdeleteItem(index, row) {
      let QID = row.QID;
      let id = row.id;
      this.$confirm(`此操作将删除该条目, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.QdeleteNewNotice(id, QID);
        })
        .catch(() => {
          this.$notify.info({
            title: "消息",
            message: "已取消"
          });
        });
    },
    Qsave() {},
    // foot
    QhandleSizeChange(val) {
      this.QlistQuery.limit = val;
      this.getList();
    },
    QhandleCurrentChange(val) {
      this.QlistQuery.page = val;
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
    //out
    getindustryList() {
      return new Promise((res, rej) => {
        getEntryList_api({ limit: 0 })
          .then(data => {
            if (data.status === 0) {
              let tempData = [{ label: "全部分类", value: null }];
              for (let i = 0, len = data.data.length; i < len; i++) {
                tempData.push({
                  label: data.data[i].storegc_name,
                  value: data.data[i].storegc_id
                });
              }
              this.industryList = tempData;
              res();
            } else {
              console.error("manageShop:getEntryList_api 状态码为1");
              rej(data);
            }
          })
          .catch(e => {
            console.error("manageShop:getEntryList_api 接口错误");
            rej();
          });
      });
    },
    addDetailItem() {
      this.formForNotive.goodsDetail.push({
        fileList: [],
        title: "xxx",
        content: "cccxxx"
      });
    },
    //file upload
    onsuccess() {
      console.log("sucess----", arguments);
    },
    beforere() {
      console.log("beforere----", arguments);
    },
    beforeup() {
      console.log("beforeup----", arguments);
    },
    remove() {
      console.log("remove----", arguments);
    },
    change() {
      console.log("change----", arguments);
    },
    preview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      console.log("preview----", arguments);
    },

    getList_detail() {
      console.log("getList_detail 暂时留白");
    },
    handleSizeChange_detail(val) {
      this.listQuery_detail.limit = val;
      this.getList_detail();
    },
    handleCurrentChange_detail(val) {
      this.listQuery_detail.page = val;
      this.getList_detail();
    },
    addNewNotice() {
      this.waitAddNotice = true;
      setTimeout(() => {
        //发送成功该做的事情
        this.waitAddNotice = false;
        this.addNewShow = false;
        this.form = {};
        this.$notify({
          title: "发送成功",
          message: "这是一条成功的提示消息",
          type: "success"
        });
        //如果失败
        // this.waitAddNotice = false
      }, 2000);
    },
    addItem() {
      this.isAddItem = true;
      this.addNewShow = true;
      this.getList2();
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
    //body
    editNewNotice(id) {
      let sendData = {
        goods_commonid: id,
        pin_token: "join"
      };
      addgroupbuy_api(sendData)
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
              title: "错误",
              message: "操作失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          console.error("addgroupbuy_api");
        });
    },

    editItem(index, row) {
      this.goodsDetail = null;
      //点击选择商品
      let id = row.id;
      this.alertValue = "";
      getGoods_api(id).then(res => {
        if (res.data.spec_value) {
          this.goodsDetail = res.data;
          console.log("多规格");
        } else {
          this.choiceGoodsId = res.data.SKUList[0].goods_id;
        }
      });
      this.HeditItem(id); //弹出表单
    },
    deleteNewNotice(id) {
      let sendData = {
        goods_id: id,
        pin_token: "wipe"
      };
      deletegroupbuy_api(sendData)
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
              title: "错误",
              message: "操作失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          console.error("deleteAdmin_api");
        });
    },
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
    searchByDate() {
      if (
        !this.dataRange ||
        !this.dataRange.length ||
        this.dataRange.length !== 2
      ) {
        return console.log("日期错误");
      }
      let dateS = this.dataRange[0];
      let dateE = this.dataRange[1];
      let Sstr =
        dateS.getFullYear() +
        "-" +
        (dateS.getMonth() + 1 > 9
          ? dateS.getMonth() + 1
          : "0" + dateS.getMonth()) +
        "-" +
        (dateS.getDate() + 1 > 9 ? dateS.getDate() + 1 : "0" + dateS.getDate());
      let Estr =
        dateE.getFullYear() +
        "-" +
        (dateE.getMonth() + 1 > 9
          ? dateE.getMonth() + 1
          : "0" + dateE.getMonth()) +
        "-" +
        (dateE.getDate() + 1 > 9 ? dateE.getDate() + 1 : "0" + dateE.getDate());
      this.listQuery.time = Sstr + "," + Estr;
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      let sendData = Object.assign({}, this.listQuery);
      getgroupbuy_api(sendData)
        .then(response => {
          // 这里由于结构做了调整，导致编辑页面需要的数据无法从列表获取，这里只需要给tableData额外传一个id
          if (response && response.status == 0) {
            let result = response.data;
            let tempTableData = [];
            result.forEach(aData => {
              tempTableData.push({
                //后端生成
                id: aData.rule_id,
                image: aData.goods.goods_image,
                name: aData.goods.goods_name,
                goodsprice: aData.goods.goods_price,
                gurouprice: aData.goods_price,
                tpeople: aData.group_num ? aData.group_num : "",
                thours: aData.limit_time ? aData.limit_time : "",
                tstate:
                  new Date().getTime() < new Date(aData.end_time).getTime()
                    ? "团购中"
                    : "已下架"
              });
            });
            this.tableData = tempTableData;
            this.total =
              response.pagination && response.pagination.total
                ? response.pagination.total
                : 0;
          } else {
          }
          console.log("getgroupbuy_api", response);
          // this.list = response
          this.listLoading = false;
        })
        .catch(e => {
          this.listLoading = false;
        });
    },
    handele_select(e) {
      this.choiceGoodsId = this.goodsDetail.SKUList[e].goods_id;
      console.log(this.choiceGoodsId);
    },
    choiceRadio(e) {
      this.radio = e;
      console.log(e);
    },
    //编辑商品
    handleEdit(index, row) {
      this.form = Object.assign({}, form);
      console.log(row);
      getgroupGoods_api(row.id).then(res => {
        console.log(res);
        let resObj = res.data.goods;
        this.form = res.data.goods;
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
              name: resObj.SKUList[i].goods_spec,
              count: Number(resObj.SKUList[i].goods_storage)
            });
          }
          this.formForNotiveChild2List = tempForm3;
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
    async handleImgChange_image(file, fileList) {
      this.isUpimg = true;
      console.log("change");
      let imgurl = await uploadFn(file.raw);

      this.isUpimg = false;
      console.log(this.form);
      this.form.goods_image.push({ url: imgurl[0] });
      console.log("goods_image");
      console.log(this.form.goods_image);
    },
    //弹框分类选择
    handele_select2(val) {
      console.log("选择后得分类");
   
      let arr = this.selectedOptions_alert.filter((e, idx) => {
        return this.selectedOptions_alert[idx].value == val;
      });
      this.form.gc_id = val;
      this.alertValue = this.form.gc_id;
  
      this.form.gc_name = arr[0].label;
      console.log(this.form);
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
  }
};
</script>