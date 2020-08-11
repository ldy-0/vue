<style lang="css">
.header {
  margin: 20px 0;
  height: 88px !important;
}
</style>

<template>
  <div>

    <el-header class="header">
      <custom-head style="display:inline-block" :config='headConfig' @add='updateForm(1)' @search='search'></custom-head>

      <el-form :inline="true" style="display:inline-block">
        <multiSelect :obj='headConfig.multiSelect' @load='loadClass' @search="searchByclass"></multiSelect>
      </el-form>
    </el-header>

    <custom-table ref='mainTable' :config='tableConfig' :data='list' :total='total' @update='updateForm' @delete='deleteItem' @change='change' @modify='handleTableEvent'></custom-table>

    <goods :obj="goodsConfig" @submit="submitGoods" @close="closeGoodsDialog" v-if="showGoods"></goods>

    <el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
      <refuse :obj='refuse' v-if='dialogConfig.status == REFUSE'></refuse>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import customTable from "@/components/customTable";
import customHead from "@/components/customHead";
import customInput from "@/components/customInput";
import multiSelect from "@/components/multiSelect";
import dateTimeRange from "@/components/dateTimeRange";
import customImg from "@/components/customImg";
import refuse from '@/components/form/refuseGoods';
import goods from '@/components/form/goods';
import api from "@/api/goods";
import commonReq from "@/api/common";
import classAPI from "@/api/classify";
import user from './user';

export default {
  mixins: [user],

  components: {
    customHead,
    customTable,
    customInput,
    multiSelect,
    dateTimeRange,
    customImg,
    refuse,
    goods,
  },

  computed: {
    showDialog() { return this.dialogConfig.status ? this.dialogConfig.status < 100 : false; },
    showGoods(){ return [this.ADDGOODS, this.EDITGOODS].indexOf(this.dialogConfig.status) !== -1 },
    isAdmin(){ return this.userInfo && this.userInfo.is_admin == 1; },
  },

  data() {
    return {
      CLOSEDIALOG: 0,
      ADDGOODS: 100,
      EDITGOODS: 101,
      REFUSE: 3,

      AUTHING: 10,
      PRE_AUTH: 11,

      goodsConfig: {
        show: true,
        detail: null,
        submit: '确定',
      },
      
      dialogConfig: {
        title: "",
        status: 0 // 1:添加分类，2：编辑分类， 3：拒绝原因
      },

      skuClassList: [],
      skuList: [],
      detail: null,
      stopSubmit: false,

      headConfig: {
        // title: "添加商品",
        placeHolder: "请输入商品名称",
        multiSelect: { title: "分类", source: [], value: [], alert: null, search: true },
      },

      tableConfig: {
        loading: false,
        showOperate: true,
        // updateTitle: "详情",
        // showDelete: true,
        btnList: [
          { key: 'isAuthing', value: '编辑' },
          { key: 'isEdited', value: '同意' },
          { key: 'isAuthing', value: '拒绝', type: 'danger' },
          // { key: 'isWxShow', value: '隐藏' },
          // { key: 'isWxHidden', value: '显示' },
        ],
        classList: [
          { key: "排序序号", value: "goods_sort" },
          { key: "图片", value: "goods_image", isImg: true },
          { key: "商品名称", value: "goods_name" },
          { key: "店铺名称", value: "store_name" },
          { key: "分类", value: "classStr" },
          // { key: "二级分类", value: "gc_name_2" },
          // { key: "三级分类", value: "gc_name_3" },
          { key: "库存", value: "goods_storage" },
          { key: "建议零售价(元)", value: "goods_marketprice" },
          { key: "商品售价(元)", value: "goods_price" },
          { key: "类别", value: "categoryStr" },
          { key: "状态", value: "stateStr" }
        ]
      },
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        goods_verify: '10,11',
      },

      allClass: [],
      stateObj: {
        1: '上架',
        2: '已拒绝',
        10: '待审核',
        11: '预审核通过',
      },

      refuse: {
        title: '确认拒绝此店家商品上架申请？',
        refuse: { title: '拒绝原因', value: '', type: 'text', alert: null, },
      },

    };
  },
  methods: {
    search(param) {
      this.query.page = 1;
      this.$refs.mainTable.initPage();

      this.query.search = param.search;
      this.query.is_vip = param.statusList[0];
      this.query.goods_state = param.statusList[1];

      this.getList();
    },
    searchByclass(param) {
      this.query.page = 1;
      this.query.gc_id = param[2];
      this.getList();
    },

    // 列表操作
    handleTableEvent(item, index){
      // 详情
      if(index == 0) return this.updateForm(item);
      // 预审核通过
      if(index == 1) return this.changeGoods(item, 'pre_apply');
      // 预审核拒绝
      if(index == 2) return this.openRefuseDialog(item);
      // wx show
      // if(index == 2) return this.changeGoods(item, 'only_app');
      // wx hidden
      // if(index == 3) return this.changeGoods(item, 'all_end');
    },

    openRefuseDialog(item){ 
      let refuse = this.refuse.refuse;

      this.dialogConfig.status = this.REFUSE; 
      this.detail = item; 

      refuse.value = '';
      refuse.alert = null;
    },

    async updateForm(status) {
      let goods,
          config = this.goodsConfig;

      // 编辑
      if (status != 1) {
        let res = await api.getGoods(status.goods_commonid);
        if (res.error) return this.$message.error(res.error);
        goods = res.data;
      }

      // 获取一级分类列表
      let classRes = await classAPI.getClassList({ parent_id: 0 });
      if(!classRes || typeof classRes === 'string' || classRes.error) return this.$message.error(classRes ? classRes.error || classRes : '获取分类列表失败!')
      classRes.data.forEach(v => {
        v.label = v.storegc_name;
        v.value = v.storegc_id;
        v.children = [];
      });
      
      // 编辑时获取二/三级分类列表
      if (goods) {
        await this.loadClass([goods.gc_id_1, 0, 0], classRes.data);
        await this.loadClass([goods.gc_id_1, goods.gc_id_2, 0], classRes.data);
      }

      config.classList = classRes.data;
      config.classify = goods ? [goods.gc_id_1, goods.gc_id_2, goods.gc_id_3] : [];

      config.detail = this.detail = goods;

      this.dialogConfig.status = typeof status === "number" ? this.ADDGOODS : this.EDITGOODS;
    },

    closeGoodsDialog() {
       this.dialogConfig.status = this.CLOSEDIALOG;
    },

    change(param) {
      console.log("param :", param);
      this.query.limit = param.limit;
      this.query.page = param.page;
      this.getList();
    },
    
    closeDialog() {
      let config = this.dialogConfig;

      config.status = 0;
    },

    async submit() {
      // refuse 
      if(this.dialogConfig.status == this.REFUSE) return this.changeGoods(this.detail, 'refuse');
    },

    submitGoods(param) {
      this.getList();
      this.dialogConfig.status = this.CLOSEDIALOG;
    },
    
    exchange(sourceList, valueList, filterProperty, destProperty) {
      let res,
        resList = [];

      sourceList.forEach((list, index) => {
        res = list.filter(v => v[filterProperty] == valueList[index])[0];
        resList[index] = res ? res[destProperty] : "";
      });
      return resList;
    },

    async getFirstClassList() {
      let res = await classAPI.getClassList({ parent_id: 0 });

      if(!res || typeof res === 'string' || res.error) return this.$message.error(res ? res.error || res : '获取分类列表失败!')

      if(res.data){
        res.data.forEach(v => {
          v.label = v.storegc_name;
          v.value = v.storegc_id;
          v.children = [];
        });

        this.headConfig.multiSelect.source = res.data;
      }
    },

    //
    async loadClass(val, source) {
      let param, selClass;

      if(!source) source = this.headConfig.multiSelect.source;

      selClass = source.find(v => v.value == val[0]);
      if(!selClass) return ;

      if (val[1]) selClass = selClass.children.find(v => v.value == val[1]);
      if(!selClass) return ;

      let res = await classAPI.getClassList({ parent_id: val[1] || val[0] });

      res.data.forEach(v => {
        v.label = v.storegc_name;
        v.value = v.storegc_id;
        if (!val[1]) v.children = [];
      });

      selClass.children = res.data;
    },
    // async loadClass2(val, source) {
    //   let param, selClass;

    //   selClass = source.find(v => v.value == val[0]);
    //   if (val[1]) selClass = selClass.children.find(v => v.value == val[1]);

    //   let res = await classAPI.getClassList({ parent_id: val[1] || val[0] });

    //   res.data.forEach(v => {
    //     v.label = v.storegc_name;
    //     v.value = v.storegc_id;
    //     if (!val[1]) v.children = [];
    //   });

    //   selClass.children = res.data;
    // },


    async getList() {
      this.tableConfig.loading = true;
      this.query.type = 'sort'
      let res = await api.getGoodsList(this.query, this);

      if(!res || typeof res === 'string' || res.error) return this.$message.error(res ? res.error || res : '获取列表失败!')

      // get all class list
      let allClass = await classAPI.getClassList();
      if (allClass.error) this.$message.error(allClass.error);
      this.allClass = allClass.data;

      res.data.forEach(this.format);

      this.list = res.data;
      this.total = res.pagination.total;
      this.tableConfig.loading = false;
    },

    format(item) {
      let matcher,
        arr = ["is_vip", "goods_state"],
        classify;

      item.img = [{ url: item.goods_image }];
      item.detailImg = item.detailImg ? item.detailImg.map(v => { return { url: v }; }) : [];

      // 分类名
      this.allClass.filter(v => {
        if (v.storegc_id == item.gc_id_1) item.gc_name_1 = v.storegc_name;
        if (v.storegc_id == item.gc_id_2) item.gc_name_2 = v.storegc_name;
        if (v.storegc_id == item.gc_id_3) item.gc_name_3 = v.storegc_name;
      });
      item.classStr = `${item.gc_name_1}/${item.gc_name_2}/${item.gc_name_3}`;

      // 
      item.isAuthing = item.goods_verify == this.AUTHING;
      item.isEdited = item.isAuthing && item.goods_price;

      item.stateStr = this.stateObj[item.goods_verify];

      item.categoryStr = '入驻商家';

      item.only_app == 0 ? item.isWxShow = true : item.isWxHidden = true;
    },

    async deleteItem(item) {
      let res = await api.deleteGoods(item.goods_commonid);

      this.getList();
    },

    async changeGoods(item, type){
      let refuse = this.refuse.refuse;

      let send = {
        goods_commonid: ['online', 'offline'].indexOf(type) !== -1 ? [item.goods_commonid] : item.goods_commonid,
        type,
      };

      if(type == 'refuse'){
        if(!refuse.value) return refuse.alert = `${refuse.title}不能为空!`;
        send.goods_verifyremark = refuse.value;
      }

      let loading = this.$loading({ text: '正在更新状态...', });

      let res = await api.changeGoods(send);

      if(typeof res === 'string' || !res || res.error) return this.handleError(res ? res.error || res : '修改失败', loading);

      this.$message.success("操作成功");

      this.dialogConfig.status = this.CLOSEDIALOG;
      this.getList();

      loading.close();
    },

    // async getUploadToken() {
    //   let res = await commonReq.getUploadToken();

    //   if (res.error) return this.$message.error(`getUploadToken: ${res.error}`);

    //   this.detailImg.body.token = this.img.body.token = res.data;
    //   this.detailImg.body.config = this.img.body.config = "{ useCdnDomain: true }";
    // },

    // utils
    formatClass() {
      let arr = this.classify.value,
        source = this.classify.source;
      return source[arr[0]].children[arr[1]].children[arr[2]];
    },

    handleError(text, loading){
      if(loading) loading.close();

      this.$message.error(text);
    },

  },

  async created() {
    this.getFirstClassList();

    this.getList();

    this.initUser();
  }
};
</script>