<style lang="stylus">
  .notice
    .header
      margin-top 20px
    .big-icon
      font-size 30px
      color #409EFF
    .big-icon-no
      font-size 30px
      color #b19999
      // color #F56C6C

</style>

<template>
<div>

<el-container class="notice">

  <el-header class="header">

    <custom-head :config='headConfig' @add='showForm'></custom-head>
          
  </el-header>

  <custom-table :config='tableConfig' 
                :data='list' 
                :total='total' 
                :isLoading='isLoading' 
                @delete='deleteItem'
                @change='change'></custom-table>

  <custom-dialog :config='dialogConfig'
                  :visible='isShow'
                  :detail='formData'
                  @submit='submit'
                  @cancel='cancel'>
    <!-- goods -->
    <div>
      <custom-head :config='goodsHeadConfig' :keyword='searchKeyWord' @keywordSelect='searchByKeyword'></custom-head>
      <custom-table :config='goodsTableConfig'
                    :data='goodsList'
                    :isLoading='goodsLoading'
                    :total='goodsTotal'></custom-table>
    </div>

  </custom-dialog>

</el-container>

</div>
</template>
<script>

import api from '@/api/api' 
import upLoadFile from '@/utils/aahbs.js'
import customTable from '@/components/customTable'
import customHead from '@/components/customHead'
import customDialog from '@/components/customDialog'

export default {
  components: {
    customTable,
    customHead,
    customDialog,
  },

  async created() {

    this.getList()
  },

  data() {
    return {
      headConfig: {
        showAdd: true,
        title: '新增推荐'
      },
      tableConfig: {
        showOperate: true,
        showDelete: true,
        classList: [
          { key: '商品图片', value: 'storegc_name', isImg: true },
          { key: '商品名称', value: 'storegc_name' },
          { key: '商品价格(￥)', value: 'storegc_sort' },
        ], 
      },
      dialogConfig: {
        width: '80%',
        isCustom: true,
        isDisabled: true,
      },
      isShow: false,
      isAddItem: true,
      isLoading: false,
      list: [],
      formData: {
        storegc_name: '',
        storegc_sort: '',
      },
      detail: null,
      listQuery: {
        page: 1,
        limit: 2,
      },
      total: 0,
      // goods 
      goodsHeadConfig: {
        width: '300px',
        showKeywordSearch: true,
      },
      goodsTableConfig: {
        showOperate: true,
        showSelect: true,
        selectTitle: '选择',
        classList: [
          { key: '商品图片', value: 'storegc_name', isImg: true },
          { key: '商品名称', value: 'storegc_name' },
          { key: '商品价格(￥)', value: 'storegc_sort' },
          { key: '库存', value: 'storegc_name' },
          { key: '分类', value: 'storegc_name' },
          { key: '状态', value: 'storegc_name' }
        ]
      },
      goodsList: [],
      goodsLoading: false,
      goodsListQuery: {
        page: 1,
        limit: 2
      },
      goodsTotal: 0,
      searchKeyWord: '',
      showClass: false,
    }
  },
  methods: {
    searchByKeyword() {
      console.log('search ----', this.searchKeyWord);
    },
    showForm(item) { //
      if (item) {
        this.detail = item;
        this.isAddItem = false;
      }else{
        this.isAddItem = true;
      }

      this.dialogConfig.isCustom ? this.getGoodsList() : this.initForm(item);
      this.isShow = true
    },
    cancel() { this.isShow = false },
    initForm(item) {
      let o = this.formData,
          obj = {}

      if (item) {
        for(let key in o){ obj[key] = item[key] }
      }else{
        for(let key in o){ obj[key] = Array.isArray(o[key]) ? [] : '' }
      }

      this.formData = obj;
      console.log('initform :', item, this.formData);
    },
    async submit(formName){

      this.dialogConfig.canSubmit = true
      console.log('formData', this.formData);
      
      let o = this.formData,
          param = {
            storegc_name: o.storegc_name, 
            storegc_parent_id: o.storegc_parent_id,
            storegc_sort: o.storegc_sort,
          };
      let res = this.isAddItem ? await api.setClass(param, this) : await api.updateClass(this.detail.storegc_id, param, this);

      this.dialogConfig.canSubmit = true;
      this.isShow = false;

      this.showClass ? this.getTwoList() : this.getList();
      
    },
    change(v) {
      this.listQuery.page = v.page;
      this.listQuery.limit = v.limit; 
      this.getList()
    },
    async getList() { //获取列表
      this.isLoading = true

      console.log('param', this.listQuery)
      let res = await api.getClassList(this.listQuery, this);

      this.list = res.data && res.data || [];
      this.total = this.list.length; // res.pagination ? res.pagination.total : 0;
      this.isLoading = false
      console.log('classList res: ', res, this.list);
    },
    async deleteItem(item) {
      let res = await api.deleteClass(item.storegc_id, null, this);

      this.showClass ? this.getTwoList() : this.getList();
    },
    async getGoodsList() {
      this.goodsLoading = true
      // FIXME: getGoodsList
      let res = await api.getClassList(this.goodsListQuery, this)

      this.goodsList = res.data;
      this.total = this.goodsList.length; // res.pagination ? res.pagination.total : 0;
      this.goodsLoading = false
    }
    
  }
}
</script>