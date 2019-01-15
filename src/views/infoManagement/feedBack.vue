<style lang="stylus">
.notice {
  .header {
    margin-top: 20px;
  }

  .big-icon {
    font-size: 30px;
    color: #409EFF;
  }

  .big-icon-no {
    font-size: 30px;
    color: #b19999;
    // color #F56C6C
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.detail {
  margin: 20px 0 0;
  padding: 0 20px 20px 20px;
  border: 1px solid #d9d9d9;
}

.detail_img, .detail_imgs {
  width: 148px;
  height: 148px;
}

.detail_img {
  display: block;
}

.detail_imgs {
  margin: 0 20px;
}

.close {
  position: relative;
  left: calc(100% - 30px);
}

.thumb_img {
  width: 60px;
  height: 40px;
}
</style>

<template>
  <div>
    <el-container class="notice">
      <!-- <el-header class="header">
        <el-form :inline="true" :model="formInline" class="form">
          <el-form-item v-if="showAddBtn">
            <el-button type="primary" @click="showDialog">{{className}}</el-button>
          </el-form-item>

          <el-form-item v-if="showSearchByKeyword">
            <el-input style="width: 340px;" placeholder="请输入联系方式" v-model="searchKeyWord"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="searchByPhone">查询</el-button>
          </el-form-item>

          <el-form-item v-if="showSearchByOrder">
            <el-input style="width: 340px;" placeholder="请输入订单号" v-model="searchKeyWord"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="searchByPhone">查询</el-button>
          </el-form-item>

          <el-form-item label="时间" v-if="showSearchByDate">
            <el-date-picker
              style="width:340px"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              v-model="listQuery.time"
            ></el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="searchByDate">查询</el-button>
          </el-form-item>

          <el-form-item label="订单状态" :label-width="formLabelWidth" prop="class" v-if="showSelect">
            <el-select placeholder="请选择" v-model="orderState" @change="changeStatus">
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-header> -->

      <el-main>
        <el-table
          :data="tableData"
          stripe
          v-loading="listLoading"
          element-loading-text="给我一点时间"
          style="width: 100%"
        >
          <el-table-column
            :label="item.key"
            :prop="item.value"
            v-for="(item, index) in classList"
            :key="index"
          >
            <template slot-scope="scope">
              <img class="thumb_img" :src="scope.row[item.value]" v-if="item.isImg">

              <div v-else-if="item.isIcon">
                <i class="el-icon-check" v-if="scope.row[item.value]"></i>
                <i class="el-icon-close" v-else></i>
              </div>

              <div v-else>{{scope.row[item.value]}}</div>
            </template>
          </el-table-column>

          <el-table-column label="操作" v-if="showOperate">
            <template slot-scope="scope"> 
              <el-button
                size="mini"
                type="text"
                @click="showDetail(scope.$index, scope.row)"
                v-if="showdetail"
              >详情</el-button>
              <!-- <el-button
                size="mini"
                type="text"
                @click="resolve(scope.$index, scope.row)"
                v-if="showResolve && !scope.row.geval_state"
              >通过</el-button> -->
              <!-- <el-button size="mini" type="text" @click="reject(scope.$index, scope.row)" v-if='showReject'>拒绝</el-button> -->
              <el-button
                size="mini"
                type="text"
                @click="showDeleteDialog(scope.$index, scope.row)"
                v-if="showDelete"
              >删除</el-button>
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
          :page-sizes="[10,20,30,50]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next"
          :total="total"
        ></el-pagination>
      </el-footer>
    </el-container>

    <el-dialog :visible.sync="isShowDialog">
      <el-form :disabled="isDisabled">
        <el-form-item
          :label="item.key"
          :label-width="formLabelWidth"
          v-for="(item, index) in detailClassList"
          :key="index"
          v-if="!item.isHide"
        >
          <!-- 单行文本 -->
          <el-input v-model="detail[item.value]" auto-complete="off" v-if="item.isText"></el-input>

          <img class="detail_img" :src="detail[item.value]" v-if="item.isImg">
          
          <img
            class="detail_imgs"
            :src="v"
            v-for="(v, i) in detail[item.value]"
            :key="i"
            v-if="item.isImgs"
          >

          <el-input
            type="textarea"
            v-model="detail[item.value]"
            auto-complete="off"
            :disabled="true"
            v-if="item.isTexts"
          ></el-input>

          <!-- 单选 -->
          <el-radio-group
            v-model="detail[item.value]"
            @change="changeRadio(item, $event)"
            v-if="item.isRadio"
          >
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow=false; waitAddNotice=false;">取消</el-button>
        <el-button
          type="primary"
          :disabled="waitAddNotice"
          :loading="waitAddNotice"
          @click="submitForm('ruleForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAssessList,
  getAssessDetail,
  deleteAssess,
  auditingAssess
} from "@/api/seller";
// import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import upLoadFile from "@/utils/tencent_cos.js";

export default {
  created() {
    this.category = "feedBack";
    console.log(this.category);

    this.showSearchByOrder = true;
    this.showSearchByDate = true;
    this.showOperate = true;
    this.showdetail = true;
    this.showResolve = true;
    this.showReject = true;
    this.showDelete = true;
    this.isDisabled = true;
    this.detailClassList = this.detailConfig[this.category];

    this.classList = this.config[this.category];

    this.getList();
  },

  data() {
    return {
      category: "",
      showAddBtn: false,
      showSearchByKeyword: false,
      showSearchByOrder: false,
      showSearchByDate: false,
      showSelect: false,
      showExport: false,
      showOperate: false,
      showDeliver: false,
      showRefund: false,
      showdetail: false,
      showResolve: false,
      showReject: false,
      showEdit: false,
      showDelete: false,
      isDisabled: false,
      config: {
        feedBack: [
          { key: "订单号", value: "geval_orderno" },
          { key: "商品名称", value: "geval_goodsname" },
          { key: "商品图片", value: "geval_goodsimage", isImg: true },
          { key: "商品价格", value: "geval_goodsprice" },
          { key: "用户姓名", value: "geval_frommembername" },
          { key: "用户头像", value: "geval_frommemberavatar", isImg: true },
          { key: "评价时间", value: "assess_time" },
          { key: "评价等级", value: "geval_scores" }
        ]
      },
      detailConfig: {
        feedBack: [
          { key: "订单号", value: "geval_orderno", isText: true },
          { key: "商品名称", value: "geval_goodsname", isText: true },
          { key: "商品图片", value: "geval_goodsimage", isImg: true },
          { key: "商品价格", value: "geval_goodsprice", isText: true },
          { key: "用户姓名", value: "geval_frommembername", isText: true },
          { key: "用户头像", value: "geval_frommemberavatar", isImg: true },
          // { key: "收货人", value: "price", isText: true },
          // { key: "联系方式", value: "price", isText: true },
          { key: "评论时间", value: "assess_time", isText: true },
          { key: "评论等级", value: "geval_scores", isText: true },
          { key: "评论内容", value: "geval_content", isTexts: true },
          { key: "评论图片", value: "imgs", isImgs: true }
        ]
      },
      isShowDialog: false,
      waitAddNotice: false,
      isAddItem: true,
      isShow: false,
      rolesList: [{ label: "goods", text: "商品" }],
      rules: {
        name: [
          { required: true, message: "请输入昵称", trigger: "blur", min: 1 },
          {
            required: true,
            message: "不能超过15个字符!",
            trigger: "blur",
            max: 15
          }
        ],
        company: [
          { required: true, message: "请输入公司名", trigger: "blur", min: 1 }
        ],
        price: [
          { required: true, message: "请输入价格" },
          { type: "number", message: "值必须为数字" }
        ]
        // phone: [
        //     { required: true, message: '请输入手机号', },
        //     { required: true, message: '手机号必须是11位', trigger: 'blur', min: 11, max: 11 },
        // ],
      },
      detailClassList: [],
      formLabelWidth: "80px",
      formData: {
        name: "",
        company: "",
        detailList: []
      },
      searchKeyWord: "",
      tableData: [],
      className: "",
      classList: [],
      detail: {},
      imgs: [],
      detailLabelWidth: "40px",
      canAddDetail: true,
      categories: [
        { id: null, title: "全部" },
        { id: 0, title: "已取消" },
        { id: 10, title: "未付款" },
        { id: 20, title: "已付款" },
        { id: 30, title: "已发货" },
        { id: 40, title: "已收货" },
        { id: 50, title: "未评价" }
      ],
      orderState: "",
      formInline: {},
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0
    };
  },
  methods: {
    showDialog(index, row) {
      this.detailClassList = row
        ? this.detailConfig[this.category]
        : this.detailConfig[this.category].slice(0, 2);

      this.initDetail(row);

      this.isShowDialog = true;
      this.isAddItem = !row;
    },
    searchByPhone() {
      console.log("search ----", this.searchKeyWord);
      this.listQuery.search = this.searchKeyWord;
      this.getList();
    },
    searchByDate() {
      console.log(this.listQuery.time);
      // this.listQuery.starttime = new Date(this.listQuery.time[0]).toISOString().split('T')[0]
      // this.listQuery.endtime = new Date(this.listQuery.time[1]).toISOString().split('T')[0]
      this.listQuery.starttime = new Date(this.listQuery.time[0])
        .toLocaleDateString()
        .replace(/\//g, "-");
      this.listQuery.endtime = new Date(this.listQuery.time[1])
        .toLocaleDateString()
        .replace(/\//g, "-");

      this.listQuery.page = 1;
      delete this.listQuery.time;
      this.getList();
    },
    changeStatus(id) {
      if (this.category === "order") {
        this.getOrder(id);
      } else if (this.category === "afterService") {
        this.getAfterService(id);
      }
    },
    changeRadio(item, value) {
      console.log("- radio -", this.detail, item, value);
    },
    submitForm(r) {
      // let res = await this.$refs[formName].validate().catch(e => e);
      // if(!res) return ;

      this.waitAddNotice = true; // 防点击

      this.submit();
    },
    async submit() {
      if (!this.isAddItem) {
        let o = this.detail;
        o.seller_limits = [];

        for (let key in o) {
          // 设置权限
          o[key] === "1" ? o.seller_limits.push(key) : void 0;
        }
      }

      this.detail.sellergroup_id = 0;
      this.detail.seller_name = this.detail.seller_nick;
      console.log("detail", this.detail);

      let res = this.isAddItem
        ? await api.setUser(this.detail, this)
        : await api.updateUser(this.detail.seller_id, this.detail, this);

      this.waitAddNotice = false;
      this.isShowDialog = false;
      this.getList();
    },
    handleAvatarSuccess(res, file) {
      alert(res, file);
    },
    exceed() {
      this.$message({ type: "error", message: "图片不能超过4张!" });
    },
    addImage(e) {
      console.log("upload before", e, this.imgs);
      upLoadFile(e.raw)
        .then(v => {
          // this.formData.case_img = v[0]
          // this.case_img = true
          // console.log(this.formData.imgs)
          this.imgs.push(v[0]);
          console.log(this.imgs);
        })
        .catch(e => {
          console.error(e);
        });
    },
    addDetail() {
      if (!this.canAddDetail) return this.$message({ message: "" });
      this.canAddDetail = false;
      this.formData.detailList.push({ img: "", content: "" });
    },
    addDetailImage(e, l) {
      console.log("upload before", e, l);

      upLoadFile(e.raw)
        .then(v => {
          this.formData.detailList[this.formData.detailList.length - 1].img =
            v[0];
          this.canAddDetail = true;
          console.log("add img", this.formData.detailList);
        })
        .catch(e => {
          console.error(e);
        });
    },
    deleteDetail(index) {
      console.log(index);
      if (index === this.formData.detailList.length - 1)
        this.canAddDetail = true;
      this.formData.detailList.splice(index, 1);
    },
    importDone({ results, header }) {
      // upload xls success
      this.tableData = results;
      this.tableHeader = header;
      console.log("-- import success", this.tableData, this.tableHeader);
    },
    beforeUpload(file) {
      // before upload xls
      const isLt2M = file.size / 1024 / 1024 < 1;

      if (isLt2M) {
        return true;
      }
      this.$message({
        message: "Please do not upload files larger than 2m in size.",
        type: "warning"
      });
      return false;
    },
    //
    getList() {
      //获取列表
      this.listLoading = true;
      this.getAssess();
    },
    showDetail(index, row) {
      this.isShowDialog = true;
      this.detail = row;

      this.getAssessDetail(row.geval_id);

      console.log(index, row, this.detail);
    },
    showDeleteDialog(index, row) {
      this.$confirm(`此操作将删除该条目, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteItem(row);
        })
        .catch(() => {
          this.$notify.info({ title: "消息", message: "已取消" });
        });
    },
    async deleteItem(row) {
      this.deleteAssess(row.geval_id);
    },

    async deleteAssess(id) {
      deleteAssess(id, null, this).then(res => {
        if (res.status == 0) {
          this.$notify.info({ title: "消息", message: "删除成功" });
          this.getList();
        } else {
          this.$notify.info({ title: "消息", message: res.error });
        }
      });
    },
    initDetail(item) {
      let o = {};

      if (typeof item === "object") {
        for (let key in item) {
          o[key] = item[key];
        }
      }

      this.detail = o;
      console.log("init detail done --", item, this.detail);
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    //

    format(data) {
      data.forEach(item => item.seller_limits.forEach(v => (item[v] = "1")));
      if (data[0].is_admin === 1) data.shift();
      return data;
    },

    async getAssess() {
      getAssessList(this.listQuery).then(res => {
        res.data.forEach(
          v =>
            (v.assess_time = `${
              new Date(Number(v.geval_addtime) * 1000)
                .toISOString()
                .split("T")[0]
            } ${
              new Date(Number(v.geval_addtime) * 1000)
                .toTimeString()
                .split(" ")[0]
            }`)
        );
        this.tableData = res.data;
        this.total = res.pagination.total;
        this.listLoading = false;
      });
    },
    async getAssessDetail(id) {
      getAssessDetail(id, null, this).then(res => {

        let o = res.data;
        o.assess_time = `${
          new Date(Number(o.geval_addtime) * 1000).toISOString().split("T")[0]
        } ${
          new Date(Number(o.geval_addtime) * 1000).toTimeString().split(" ")[0]
        }`;
        o.imgs = o.geval_image !== "" ? JSON.parse(o.geval_image) : [];
        this.initDetail(o);
      });
    },
    async resolve(index, row) {
      auditingAssess(row.geval_id, null, this).then(res => {
        this.getList();
      });
    },
    async reject() {
      // let res = await
    }
  }
};
</script>