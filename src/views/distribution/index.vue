<style lang="css">
.header {
  margin: 20px 0;
}

.form_title,
.form_ctn {
  font-size: 14px;
  line-height: 36px;
}
.form_title {
  box-sizing: border-box;
  display: inline-block;
  width: 100px;
  padding: 0 12px 0 0;
  font-weight: bold;
  text-align: right;
}
.form_img {
  width: 150px;
  height: 150px;
}
</style>

<template>
  <div>

    <el-header class="header">
      <custom-head :config='headConfig' @search='search'></custom-head>
    </el-header>

    <custom-table ref='mainTable' :config='tableConfig' :data='list' :total='total' :isLoading='isLoading' @show='updateForm' @change='change'></custom-table>

    <el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
      <el-header class="header" v-if='showDialog'>
        <custom-head :config='twoHeadConfig' @search='searchTwo'></custom-head>
      </el-header>

      <custom-table :config='tableConfig' :data='twoList' :total='twoTotal' :isLoading='twoIsLoading' @show='updateFormTwo' @change='changeTwo'></custom-table>

    </el-dialog>

    <!-- Third distribution -->
    <el-dialog :title="twoDialogConfig.title" :visible.sync="twoShowDialog" :before-close='closeDialogTwo' width="80%">
      <el-header class="header" v-if='twoShowDialog'>
        <custom-head :config='thirdHeadConfig' @search='searchThird'></custom-head>
      </el-header>

      <custom-table :config='tableConfig' :data='thirdList' :total='thirdTotal' :isLoading='thirdIsLoading' @show='updateFormThird' @change='changeThird'></custom-table>

    </el-dialog>

  </div>
</template>
<script>
import customTable from "@/components/customTable";
import customHead from "@/components/customHead";
import uploadFn from "@/utils/tencent_cos";
import { voidTypeAnnotation } from "babel-types";
import api from "@/api/member";

export default {
  components: {
    customHead,
    customTable
  },

  computed: {
    showDialog() {
      return Boolean(this.dialogConfig.status);
    },
    twoShowDialog() {
      return Boolean(this.twoDialogConfig.status);
    }
  },

  data() {
    return {
      inviter_id:null,
      inviter_id2:null,
      dialogConfig: {
        title: "",
        status: 0 // 1:添加分类，2：编辑分类， 3：二级分类列表
      },
      keys: ["nickName", "name", "mobile", "price", "status"],
      stopSubmit: false,

      headConfig: {
        placeHolder: "请输入手机号"
      },

      tableConfig: {
        // showOperate: true,
        // detailTitle: "查看下级",
        classList: [
          { key: "头像", value: "member_avatar", isAvatar: true },
          { key: "昵称", value: "member_truename" },
          { key: "联系方式", value: "member_mobile" },
          // { key: "累计佣金", value: "total_rc_balance" },
          // { key: "佣金", value: "available_rc_balance" },
          // { key: "上级", value: "inviter_nick" }
        ]
      },
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10
      },
      isLoading: true,
      // two List
      twoDialogConfig: {
        title: "",
        status: 0 // 2：二级分类列表
      },
      twoHeadConfig: {
        placeHolder: "请输入手机号"
      },
      twoList: [],
      twoTotal: 0,
      twoQuery: {
        page: 1,
        limit: 10
      },
      twoIsLoading: true,
      // third List
      thirdDialogConfig: {
        title: "",
        status: 0 // 3：三级分类列表
      },
      thirdHeadConfig: {
        placeHolder: "请输入手机号"
      },
      thirdList: [],
      thirdTotal: 0,
      thirdQuery: {
        page: 1,
        limit: 10
      },
      thirdIsLoading: true
    };
  },
  methods: {
//列表============================================
    async getList() {
      this.isLoading = true;
      let res = await api.getMember_api(this.query, this);
      res.data.forEach(this.format);

      this.list = res.data;
      this.total = res.pagination.total;
      this.isLoading = false;
    },
    async getTwoList(id) {
      this.twoIsLoading = true;
      let send = Object.assign({}, this.twoQuery);
      send.inviter_id = id;
      let res = await api.getMember_api(send, this);
      // res.data.forEach(this.format);

      this.twoList = res.data;
      this.twoTotal = res.pagination.total;
      this.twoIsLoading = false;
    },
    async getThirdList(id) {
      this.thirdIsLoading = true;
      let send = Object.assign({}, this.thirdQuery);
      send.inviter_id = id;
      let res = await api.getMember_api(send, this);
      // res.data.forEach(this.format);

      this.thirdList = res.data;
      this.thirdTotal = res.pagination.total;
      this.thirdIsLoading = false;
    },
    format(item) {
      item.img = [{ url: item.image }];
      if (item.card_mall == 1) {
        item.lock_state = true;
      } else {
        item.lock_state = false;
      }
    },
//操作============================================
    showDetail(item) {
      let dialogConfig = this.dialogConfig,
        formData2 = this.formData2,
        formData = this.formData;

      dialogConfig.status = 1;

      this.keys.forEach(v => (formData[v].value = item[v]));
      this.keys2.forEach(v => (formData2[v].value = item[v]));
      this.formData.member_avatar.value = item.member_avatar;
      this.formData.card_mall = item.card_mall;
    },
    updateForm(status) {
      this.dialogConfig.status = typeof status === "number" ? status : 2;
      this.inviter_id = status.member_id;
      this.getTwoList(status.member_id);
    },
    closeDialog() {
      let config = this.dialogConfig;

      config.status = 0;
    },
    updateFormTwo(status) {
      this.twoDialogConfig.status = typeof status === "number" ? status : 3;
      this.tableConfig.showOperate = false;
      this.inviter_id2 = status.member_id;
      this.getThirdList(status.member_id);
    },
    closeDialogTwo() {
      let config = this.twoDialogConfig;
      this.tableConfig.showOperate = true;
      config.status = 0;
    },
    updateFormThird(status) {
      this.dialogConfig.status = typeof status === "number" ? status : 2;
      this.member_id = status.member_id;
      this.score.value = status.available_rc_balance || "";
    },
    closeDialogThird() {
      let config = this.dialogConfig;

      config.status = 0;
    },
//分页 查询==========================================
    change(param) {
      this.query.limit = param.limit;
      this.query.page = param.page;
      this.getList();
    },
    search(param) {
      this.query.page = 1;
      this.$refs.mainTable.initPage();

      this.query.search = param.search;
      this.query.vip_level = param.status;
      this.getList();
    },
    searchTwo(param) {
      this.twoQuery.search = param.search;
      this.twoQuery.vip_level = param.status;
      this.getTwoList(this.inviter_id);
    },
    changeTwo(param) {
      this.twoQuery.limit = param.limit;
      this.twoQuery.page = param.page;
      this.getTwoList(this.inviter_id);
    },
    searchThird(param) {
      this.thirdQuery.search = param.search;
      this.thirdQuery.vip_level = param.status;
      this.getThirdList(this.inviter_id2);
    },
    changeThird(param) {
      this.thirdQuery.limit = param.limit;
      this.thirdQuery.page = param.page;
      this.getThirdList(this.inviter_id2);
    }
  },

  created() {
    this.getList();
  }
};
</script>