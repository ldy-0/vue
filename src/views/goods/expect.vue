<style lang="css">
.header {
  margin: 20px 0;
  height: 88px !important;
}
</style>

<template>
  <div>

    <el-header class="header">
      <custom-head style="display:inline-block" :config='headConfig' @emit='handleHeadEvent' @search='search'></custom-head>

      <el-form :inline="true" style="display:inline-block">
        <multiSelect :obj='headConfig.multiSelect' @load='loadClass' @search="searchByclass"></multiSelect>
      </el-form>
    </el-header>

    <custom-table ref='mainTable' :config='tableConfig' :data='list' :total='total' @delete='deleteItem' @change='change' @modify='handleTableEvent'></custom-table>

    <goods :obj="goodsConfig" @submit="submitGoods" @close="closeGoodsDialog" v-if="showGoods"></goods>

    <el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
      <el-form label-width='120px'>
        <custom-radio :obj="repayDscore" v-if="dialogConfig.status == REPAY"></custom-radio>

        <custom-input :obj="freezeTime" v-if="dialogConfig.status == FREEZETIME"></custom-input>
      </el-form>

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
import customRadio from "@/components/customRadio";
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
    customRadio,
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
      REPAY: 3,
      FREEZETIME: 4,

      AUTHING: 10,
      PRE_AUTH: 11,

      goodsConfig: {
        show: true,
        showRepay: true,
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
        btnList: [
          { title: '添加商品', },
          { title: '分期设置', },
          { title: '冗余时间设置', },
        ],
        placeHolder: "请输入商品名称",
        multiSelect: { title: "分类", source: [], value: [], alert: null, search: true },
        selectLabelList: ['状态'], //'是否分期', 
        selectList: [
          // [
          //   { id: null, name: "全部" },
          //   { id: 1, name: '是' },
          //   { id: 0, name: "否" }
          // ],
          [
            { id: null, name: "全部" },
            { id: 1, name: "上架" },
            { id: 0, name: "下架" }
          ],
        ]
      },

      tableConfig: {
        loading: false,
        showOperate: true,
        showDelete: true,
        btnList: [
          { key: 'goods_commonid', value: '编辑' },
          { key: 'isDown', value: '上架' },
          { key: 'goods_state', value: '下架' },
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
          { key: "是否分期", value: "repayStr" },
          { key: "分期首付", value: "prepay_price" },
          { key: "类别", value: "categoryStr" },
          { key: "状态", value: "stateStr" }
        ]
      },
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        is_repay: 1,
      },

      allClass: [],
      stateObj: {
        1: '上架',
        2: '已拒绝',
        10: '待审核',
        11: '预审核通过',
      },

      repayDscore: { 
        title: "能否德分支付", value: 1, alert: null, disabled: false,
        list: [
          { id: 1, title: "是" }, 
          { id: 2, title: "否" },
        ],
      },
      freezeTime: { type: 'text', title: '冗余时间设置(天)', value: '', alert: null, },

    };
  },
  methods: {
    search(param) {
      let statusList = param.statusList;

      this.query.page = 1;
      this.$refs.mainTable.initPage();

      this.query.search = param.search;
      // this.query.repay = param.statusList[0];
      this.query.goods_state = statusList[0];

      this.getList();
    },
    searchByclass(param) {
      this.query.page = 1;
      this.query.gc_id = param[2];
      this.getList();
    },

    handleHeadEvent(index) {
      // 添加商品
      if(index == 0) return this.updateForm(1);
      // 分期设置
      if(index == 1) return this.openDialog(this.REPAY);
      // 冗余时间设置
      if(index == 2) return this.openDialog(this.FREEZETIME);
    },

    // 列表操作
    handleTableEvent(item, index){
      console.log(index);
      // 详情
      if(index == 0) return this.updateForm(item);
      // up
      if(index == 1) return this.changeGoods(item, 'online');
      // down
      if(index == 2) return this.changeGoods(item, 'offline');
      // wx show
      // if(index == 2) return this.changeGoods(item, 'only_app');
      // wx hidden
      // if(index == 3) return this.changeGoods(item, 'all_end');

    },

    async openDialog(type){ 
      let repayDscore = this.repayDscore,
          freezeTime = this.freezeTime;

      this.dialogConfig.status = type;
      repayDscore.value = freezeTime.value = '';
      repayDscore.alert = freezeTime.alert = null;

      
      let res = await api.getRepaySetting();
      if(!res || typeof res === 'string' || res.error) return this.$message.error(res ? res.error || res : '获取分期设置信息失败!')
      
      if(res.data){
        repayDscore.value = res.data.repay_rcb == 1 ? 1 : 2;
        freezeTime.value = res.data.repay_day;
      }
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

    submit() {
      let freezeTime = this.freezeTime,
          param = {};

      // 分期德分设置
      if(this.REPAY == this.dialogConfig.status){
        param.source = 'rcb';
        param.value = this.repayDscore.value == 1 ? 1 : 0;
        
        let loading = this.$loading();
        
        return this.saveRepaySetting(param, loading);
      }

      // 冗余时间设置
      if(this.FREEZETIME == this.dialogConfig.status){
        param.source = 'day';
        param.value = freezeTime.value;

        if(!/^[1-9]\d*$/.test(freezeTime.value)) return freezeTime.alert = `冗余时间未设置或设置不正确`;
        
        let loading = this.$loading();
        
        return this.saveRepaySetting(param, loading);
      }
    },

    async saveRepaySetting(param, loading) {
      let res = await api.setRepaySetting(param);
      if(!res || typeof res === 'string' || res.error) return this.$message.error(res ? res.error || res : '设置失败!'), loading.close();

      this.$message.success('设置成功!');
      this.closeDialog();
      loading.close();
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
      let matcher, classify;

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

      // 是否分期
      item.repayStr = item.is_repay == 1 ? '是' : '否';

      item.stateStr =  item.goods_state == 1 ? '上架' : '下架'; //this.stateObj[item.goods_verify];

      item.categoryStr = item.is_vip ? 'VIP商品' : '普通商品';
      
      // 是否显示上架按钮
      item.isDown = item.goods_state == 0 && (item.store_id == 1 || item.is_vip);
      item.only_app == 0 ? item.isWxShow = true : item.isWxHidden = true;
    },

    async deleteItem(item) {
      let res = await api.deleteGoods(item.goods_commonid);

      this.getList();
    },

    async changeGoods(item, type){
      let refuse;

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