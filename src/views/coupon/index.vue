<style lang="stylus">
.notice {
  .header {
    margin-top: 20px;
  }
}
</style>

<template>
  <div>
    <!-- 添加 -->
    <el-dialog title="新增优惠券" :visible.sync="addNewShow" width="70%">
      <el-form :model="formForNotive" ref="ruleForm" :rules="rules">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="formForNotive.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="时间" :label-width="formLabelWidth" prop="dateRange">
          <el-date-picker
            style="width:400px"
            v-model="formForNotive.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="面值" :label-width="formLabelWidth" prop="value">
          <el-input v-model.number="formForNotive.value" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="发行数量" :label-width="formLabelWidth" prop="total">
          <el-input v-model.number="formForNotive.total" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="个人获取限制" :label-width="formLabelWidth" prop="getTotal">
          <el-input v-model.number="formForNotive.getTotal" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="使用次数限制" :label-width="formLabelWidth" prop="useTotal">
          <el-input v-model.number="formForNotive.useTotal" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addNewShow = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addNewNotice"
          :disabled="waitAddNotice"
          :loading="waitAddNotice"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="优惠券明细" :visible.sync="detailShow" width="80%">
      <el-form :model="detailForm" size="medium">
        <el-form-item label="优惠券ID" :label-width="formLabelWidth">
          <p class="hbs-no-margin-p">{{detailForm.vouchertemplate_id}}</p>
        </el-form-item>
        <el-form-item label="优惠券名字" :label-width="formLabelWidth">
          <p class="hbs-no-margin-p">{{detailForm.vouchertemplate_title}}</p>
        </el-form-item>
        <el-form-item label="优惠券面值" :label-width="formLabelWidth">
          <p class="hbs-no-margin-p">{{detailForm.vouchertemplate_price}}</p>
        </el-form-item>
        <!-- <el-form-item label="满减" :label-width="formLabelWidth">
        <p class="hbs-no-margin-p">
          {{detailForm.vouchertemplate_limit}}
        </p>
        </el-form-item>-->
        <el-form-item label="创建人ID" :label-width="formLabelWidth">
          <p class="hbs-no-margin-p">{{detailForm.vouchertemplate_creator_id}}</p>
        </el-form-item>
        <el-form-item label="优惠券状态" :label-width="formLabelWidth">
          <p class="hbs-no-margin-p">{{detailForm.vouchertemplate_state_text}}</p>
        </el-form-item>
        <el-form-item label="发行总量" :label-width="formLabelWidth">
          <p class="hbs-no-margin-p">{{detailForm.vouchertemplate_total}}</p>
        </el-form-item>
        <el-form-item label="已被领取量" :label-width="formLabelWidth">
          <p class="hbs-no-margin-p">{{detailForm.vouchertemplate_giveout}}</p>
        </el-form-item>
        <el-form-item label="已被使用取量" :label-width="formLabelWidth">
          <p class="hbs-no-margin-p">{{detailForm.vouchertemplate_used}}</p>
        </el-form-item>
        <el-form-item label="发行时间" :label-width="formLabelWidth">
          <p class="hbs-no-margin-p">{{detailForm.vouchertemplate_adddate}}</p>
        </el-form-item>
        <el-form-item label="领取限制数量" :label-width="formLabelWidth">
          <p class="hbs-no-margin-p">{{detailForm.vouchertemplate_eachlimit}}</p>
        </el-form-item>
        <el-form-item label="使用数量限制" :label-width="formLabelWidth">
          <p class="hbs-no-margin-p">{{detailForm.vouchertemplate_eachrestricted}}</p>
        </el-form-item>
        <el-form-item label="生效时间范围" :label-width="formLabelWidth">
          <p class="hbs-no-margin-p">{{detailForm.vouchertemplate_aging}}</p>
        </el-form-item>
        <el-form-item label="使用范围" :label-width="formLabelWidth">
          <p class="hbs-no-margin-p">{{detailForm.vouchertemplate_usable_range}}</p>
        </el-form-item>
        <!-- <el-form-item label="开始生效时间" :label-width="formLabelWidth">
        <p class="hbs-no-margin-p">
          {{detailForm.vouchertemplate_startdate}}
        </p>
      </el-form-item>
      <el-form-item label="生效结束时间" :label-width="formLabelWidth">
        <p class="hbs-no-margin-p">
          {{detailForm.vouchertemplate_enddate}}
        </p>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailShow = false">返 回</el-button>
      </span>
    </el-dialog>
    <el-container class="notice">
      <el-header class="header">
        <el-form :inline="true" :model="formInline" class="form">
          <el-form-item>
            <el-button type="primary" icon="el-icon-edit-outline" @click="addItem">新增优惠券</el-button>
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
          <el-table-column label="优惠券名" prop="name"></el-table-column>
          <el-table-column label="优惠券面值" prop="value"></el-table-column>
          <el-table-column label="操作" min-width="300px">
            <template slot-scope="scope">
              <el-button size="mini" @click="lookItem(scope.$index, scope.row)">查看详情</el-button>
              <el-button size="mini" type="danger" @click="deleteItem(scope.$index, scope.row)">删除</el-button>
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
import // getCouponList_api,
// addCoupon_api,
// getGoodsList_api,
// deleteCoupon_api
"@/api/seller";
const formForNotive = {
  //此页面 静态数据
  name: "优惠券名字", // 优惠券名字
  // now:"", //优惠券 发行时间
  // getType:"", //优惠券 领取方式
  // useRange:"", //优惠券 使用范围
  // goodId:"", //优惠券 商品id 此处特殊，编辑之前通过商品的id反查商店id
  // startTime:"", //优惠券  起始时间
  // endTime:"", //优惠券  起始时间
  dateRange: "",
  value: 10, //优惠券 面值
  total: 100, //优惠券 数量
  getTotal: 10, //优惠券 获取限制数量
  useTotal: 5 //优惠券 使用限制
};
export default {
  created() {
    this.getList();
  },
  data() {
    return {
      //out
      detailShow: false,
      detailForm: {},
      addNewShow: false,
      formLabelWidth: "140px",
      rules: {
        name: [
          {
            required: true,
            message: "请输入优惠券名字",
            trigger: "blur",
            min: 1
          }
        ],
        dateRange: [
          {
            type: "array",
            required: true,
            len: 2,
            message: "请选择日期"
          }
        ],
        value: [
          {
            required: true,
            message: "请输入优惠券面值,请输入不少于1的整数",
            trigger: "blur",
            min: 1,
            type: "integer"
          }
        ],
        total: [
          {
            required: true,
            message: "请输入发行数量,请输入不少于1的整数",
            trigger: "blur",
            min: 1,
            type: "integer"
          }
        ],
        getTotal: [
          {
            required: true,
            message: "请输入个人获得优惠券数量的限制,请输入不少于1的整数",
            trigger: "blur",
            min: 1,
            type: "integer"
          }
        ],
        useTotal: [
          {
            required: true,
            message: "请输入个人使用优惠券数量的限制,请输入不少于1的整数",
            trigger: "blur",
            min: 1,
            type: "integer"
          }
        ]
      },
      // head
      waitAddNotice: false,
      formForNotive: Object.assign({}, formForNotive),
      // body
      listLoading: false,
      tableData: [],
      // footer
      listQuery: {
        page: 1,
        limit: 20,
        search: "",
        time: ""
      },
      total: 1,
      // ------------------------

      //header
      industry: "",
      formInline: {}
      // body
    };
  },
  methods: {
    // out
    async addNewNotice() {
      //添加新公告
      let res = await new Promise((res, rej) => {
        this.$refs["ruleForm"].validate(valid => {
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
      if (!res) {
        return;
      }
      this.waitAddNotice = true;
      // 发行时间戳
      let tempNow = new Date()
        .getTime()
        .toString()
        .slice(0, 10);
      tempNow = Number(tempNow);
      // 商品id goods_commonid
      let goodsId = await getGoodsList_api()
        .then(response => {
          if (response && response.status == 0) {
            let result = response.data;
            return result[0].goods_commonid;
          }
        })
        .catch(e => {});
      if (!goodsId) {
        this.waitAddNotice = false;
        return console.log("goodsId 不存在");
      }
      // 优惠券生效范围时间戳 两个字段
      let dateStart = Number(
        this.formForNotive.dateRange[0]
          .getTime()
          .toString()
          .slice(0, 10)
      );
      let dateEnd = Number(
        this.formForNotive.dateRange[1]
          .getTime()
          .toString()
          .slice(0, 10)
      );
      let sendData = {
        // 名称
        vouchertemplate_title: this.formForNotive.name,
        // 发行时间戳
        vouchertemplate_adddate: tempNow,
        // 领取方式
        vouchertemplate_payment: 3,
        // 使用范围
        vouchertemplate_usable_range: "全店铺",
        // 名称
        vouchertemplate_goods_id: 2,
        // 优惠券开始生效时间戳
        vouchertemplate_startdate: dateStart,
        // 优惠券结束生效时间戳
        vouchertemplate_enddate: dateEnd,
        // 优惠券 面值
        vouchertemplate_price: this.formForNotive.value,
        // 优惠券 发行数量
        vouchertemplate_total: this.formForNotive.total,
        // 优惠券 领取限制数量
        vouchertemplate_eachlimit: this.formForNotive.getTotal,
        // 优惠券 使用数量限制
        vouchertemplate_eachrestricted: this.formForNotive.useTotal
        // 描述
        // vouchertemplate_desc:this.formForNotive.name,
      };
      addCoupon_api(sendData)
        .then(() => {
          this.waitAddNotice = false;
          this.formForNotive = {};
          this.addNewShow = false;
          this.$notify({
            title: "发送成功",
            message: "已新增一条公告",
            type: "success"
          });
          this.getList();
        })
        .catch(err => {
          this.waitAddNotice = false;
          console.error("addCoupon_api:", err);
        });
    },
    // head
    addItem() {
      //显示 弹框
      // this.editLoading = false
      this.isAddItem = true;
      this.addNewShow = true;
      this.formForNotive = Object.assign({}, formForNotive);
    },
    // body
    getList() {
      this.listLoading = true;
      let sendData = Object.assign({}, this.listQuery);
      getCouponList_api(sendData)
        .then(response => {
          this.listLoading = false;
          if (response && response.status == 0) {
            let result = response.data;
            let tempTableData = [];
            result.forEach(aData => {
              tempTableData.push({
                //后端生成
                id: aData.vouchertemplate_id,
                //前后统一
                name: aData.vouchertemplate_title,
                value: aData.vouchertemplate_price,
                detail: aData
              });
            });
            this.tableData = tempTableData;
            this.total =
              response.pagination && response.pagination.total
                ? response.pagination.total
                : 1;
          } else {
            this.listLoading = false;
          }
        })
        .catch(e => {
          console.log(e);
          this.listLoading = false;
        });
    },
    deleteNewNotice(id) {
      let sendData = {
        vouchertemplate_id: id
      };
      deleteCoupon_api(sendData)
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
          console.error("upDownShop");
        });
    },
    deleteItem(index, raw) {
      let id = raw.id;
      this.$confirm(`此操作将删除该条目, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteNewNotice(id); //批量
        })
        .catch(() => {
          this.$notify.info({
            title: "消息",
            message: "已取消"
          });
        });
    },
    lookItem(index, raw) {
      this.detailShow = true;
      this.detailForm = raw.detail;
      console.log(this.detailForm);
    },
    // ---------------------------------
    //out
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

    //body
    editItem() {
      this.addNewShow = true;
      //获取数据 填充form
      this.formForNotive = {
        title: "当前优惠券名称",
        username: "当前优惠券名称",
        phone: "当前优惠券名称",
        account: "当前优惠券名称",
        name: "当前优惠券名称",
        industry: "餐饮",
        city: ["杭州", "西湖"]
      };
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
    }
  }
};
</script>