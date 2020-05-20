<style lang="stylus">
  .notice
    .header
      margin-top 20px
  
  .detail{
    margin: 20px 0 0;
    padding: 0 20px 20px 20px;
    border: 1px solid #d9d9d9;
  }
  .detailImg {
    width: 148px;
    height: 148px;
    display: block;
  }
  .close{
    position: relative;
    left: calc(100% - 30px);
  }
</style>

<template>
<div>

<el-container class="notice">

  <el-header class="header">

    <custom-head :config='headConfig' @searchByKeyWord='searchByPhone' @changeState='changeState'></custom-head>
          
  </el-header>

  <custom-table :config='tableConfig' 
                :data='list' 
                :total='total' 
                :isLoading='isLoading' 
                @look='look'
                @auth='auth'
                @custom='custom'
                @change='change'></custom-table>

  <custom-dialog :config='dialogConfig'
                  :list='classList'
                  :visible='isShow'
                  :detail='formData'
                  @cancel='cancel'>

      <div class=''>
        <!-- <div class='' v-for='(item, index) in questList' :key='index'>
          <div v-text='item.title'></div>
          <el-radio style='width: 100%; margin-left: 0;' :label='v' v-for='(v, i) in item.ans' :key='i'></el-radio>
        </div> -->
      </div>

  </custom-dialog>
</el-container>

</div>
</template>
<script>

import api from '@/api/api' 
import upLoadFile from '@/utils/aahbs.js'
import config from './config.js'

export default {
  mixins: [config],

  data() {
    return {
      headConfig: {
        width: '300px',
        showKeywordSearch: true,
        placeHolder: '手机号搜索',
        dateWidth: '400px',
        selectLabel: '状态',
        categories: [
          { id: 0, title: '全部' },
          { id: 1, title: '待付款' },
          { id: 2, title: '待发货' },
          { id: 3, title: '已发货' },
          { id: 4, title: '已完成' },
        ]
      },
      tableConfig: {
        showOperate: true,
        showLook: true,
        lookTitle: '详情',
        showDelete: true,
        showDeliver: true,
        custom: '查看评论',
        classList: [
          { key: '商品', value: 'storegc_name', isImg: true },
          { key: '商品名', value: 'storegc_name' },
          { key: '订单号', value: 'storegc_name' },
          { key: '买家', value: 'storegc_sort' },
          { key: '订单状态', value: 'storegc_sort' },
          { key: '金额(￥)', value: 'storegc_sort' },
          { key: '下单时间', value: 'storegc_sort' }
        ]
      },
      classList: [
          { key: '商品', value: 'storegc_sort', isImgs: true },
          { key: '商品名', value: 'storegc_name', isText: true },
          { key: '金额(￥)', value: 'storegc_sort', isText: true },
          { key: '数量', value: 'storegc_name', isText: true },
          { key: '订单号', value: 'storegc_name', isText: true },
          { key: '运费', value: 'storegc_name', isText: true },
          { key: '下单时间', value: 'storegc_sort', isText: true },
          { key: '付款时间', value: 'storegc_sort', isText: true },
          { key: '订单状态', value: 'storegc_sort', isText: true },
          { key: '联系人', value: 'storegc_sort', isText: true },
          { key: '联系方式', value: 'storegc_sort', isText: true },
          { key: '收货地址', value: 'storegc_sort', isText: true },
      ],
      dialogConfig: {
        isDisabled: true,
        // isCustom: true,
        // rules: {
        //   'storegc_name': [
        //     { required: true, message: '请输入分类名称', trigger: 'blur' },
        //     { message: '不能超过15个字符!', max: 15, trigger: 'blur' }
        //   ],
        //   'storegc_sort': [ { required: true, message: '值不能为空!', trigger: 'blur' } ],
        // },
        // canSubmit: true,
      },
      formData: {
        storegc_name: '',
        storegc_sort: '',
      },
      searchKeyWord: ''
    }
  },

  methods: {
    look(item) {
      if(this.dialogConfig.classList){
        let arr = this.classList;
        this.classList =  this.dialogConfig.classList;
        this.dialogConfig.classList = arr;
      }
      this.showForm(item);
    },
    custom(item, str) {
      this.dialogConfig.classList = this.classList;
      this.classList = [
        { key: '评论图片', value: 'storegc_sort', isImgs: true },
        { key: '评论时间', value: 'storegc_sort', isText: true },
        { key: '评论内容', value: 'storegc_sort', isText: true },
      ];

      this.showForm(item);
    },
    auth(item, state) {
      console.warn(item, state)
    },
    async submit(formName) {

      this.dialogConfig.canSubmit = true
      console.log('formData', this.formData)

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
    initForm(item) {
      let o = this.formData,
          obj = {};

      if (item) {
        for (let key in o) { obj[key] = item[key] }
      } else {
        for (let key in o) { obj[key] = Array.isArray(o[key]) ? [] : '' }
      }

      this.formData = obj
      console.log('initform :', item, this.formData)
    },
    async deleteItem(item) {
      let res = await api.deleteClass(item.storegc_id, null, this)

      this.getList()
    }

  },

}
</script>