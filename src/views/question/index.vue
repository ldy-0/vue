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

    <custom-head :config='headConfig' @searchByKeyWord='searchByPhone'></custom-head>
          
  </el-header>

  <custom-table :config='tableConfig' 
                :data='list' 
                :total='total' 
                :isLoading='isLoading' 
                @look='showForm'
                @change='change'></custom-table>

  <custom-dialog :config='dialogConfig'
                  :visible='isShow'
                  :detail='formData'
                  @cancel='cancel'>

      <div class=''>
        <div class='' v-for='(item, index) in questList' :key='index'>
          <div v-text='item.title'></div>
          <el-radio-group v-model='item.checked' disabled>
            <el-radio style='width: 100%; margin-left: 0;' :label='v' v-for='(v, i) in item.ans' :key='i'></el-radio>
          </el-radio-group>
        </div>
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
import config from './config.js'

export default {
  components: {
    customTable,
    customHead,
    customDialog,
  },

  mixins: [config],

  data() {
    return {
      isShow: false, // Dialog visible
      isAddItem: true,
      isLoading: false, // Table Loading
      list: [], // Table Data
      detail: null,
      listQuery: { // table Data param
        page: 1,
        limit: 2,
      },
      total: 0, 
      dialogConfig: {
        isCustom: true,
      },
      questList: [
        { title: 'this is title', ans: ['aa', 'bb', 'c'], checked: 'aa' }
      ]
    }
  },

  methods: {
    showForm(item) { //
      if (item) {
        this.detail = item
        this.isAddItem = false
      } else {
        this.isAddItem = true
      }

      this.initForm(item)
      this.isShow = true
    },
    cancel() { this.isShow = false; },
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
    change(v) {
      this.listQuery.page = v.page
      this.listQuery.limit = v.limit
      this.getList()
    },
    async deleteItem(item) {
      let res = await api.deleteClass(item.storegc_id, null, this);

      this.getList();

    },

  },

  created() { 
    this.getList() 
  }
}
</script>