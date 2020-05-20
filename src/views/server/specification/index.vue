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
  
  .dialog_detail{
    margin: 20px 0 0;
    padding: 0 20px 20px 20px;
    border: 1px solid #d9d9d9;
  }
  
  .border {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    border: 1px solid #dcdfe6; 
  }
  .close{
    position: relative;
    left: calc(100% - 30px);
  }

  .interval{
    margin: 20px 0 0;
  }

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
                @update='showForm'
                @delete='deleteItem'
                @change='change'></custom-table>

  <custom-dialog :config='dialogConfig'
                  :visible='isShow'
                  :detail='formData'
                  @addDetail='addDetail'
                  @submit='submit'
                  @cancel='cancel'>

    <detail :detailList='formData.content'></detail>
    <!-- <el-form class='dialog_detail' label-width='80px' :model='item' v-for='(item, index) in detailList' :key='index' ref='detailRule' :rules='detailRule'>
      <i class='el-icon-close close' @click='deleteDetail(index)'></i>
      <el-form-item label='图片' prop='imgs'>

        <el-upload action='' list-type="picture-card" :auto-upload="false" :limit='1' :file-list='item.imgs'
                                                                                      :disabled='item.disabled'
                                                                                      :on-remove='changeDetailImgs'
                                                                                      :on-change="changeDetailImgs">
            <i class="el-icon-plus"></i>
        </el-upload>

      </el-form-item>

      <el-form-item class='interval' label='内容' prop='content'>
        <el-input type='textarea' v-model="item.content"></el-input>
      </el-form-item>
    </el-form> -->

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
import detail from '@/components/detail'

export default {
  components: {
    customTable,
    customHead,
    customDialog,
    detail
  },

  created() {
    this.getList()
  },

  data() {
    return {
      headConfig: {
        showAdd: true,
        title: '新增设计规范'
      },
      tableConfig: {
        showOperate: true,
        showUpdate: true,
        showDelete: true,
        classList: [
          { key: '规范名称', value: 'title' },
          { key: '排序', value: 'sort' },
        ], 
      },
      dialogConfig: {
        width: '80%',
        labelWidth: '100px',
        classList: [
          { key: '规范名称', value: 'title', isText: true, },
          { key: '排序', value: 'sort', isText: true, },
          { key: '内容', value: 'sort', title: '添加内容', isDetail: true, },
        ],
        rules: {
          'title': [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { message: '不能超过15个字符!', max: 15, trigger: 'blur' }
          ],
          'sort': [ { required: true, message: '值不能为空!', trigger: 'blur' } ],
        },
        canSubmit: true,
      },
      isShow: false,
      isAddItem: true,
      isLoading: false,
      list: [],
      formData: {
        title: '',
        sort: '',
        content: []
      },
      detail: null, // selected item
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      // detailRule: {
      //   'content': [ { required: true, message: '请输入内容', trigger: 'blur' }, ],
      //   imgs: [ { type: 'array', required: true, message: '请添加图片' } ],
      // },
      searchKeyWord: ''
    }
  },
  methods: {
    // detail
    addDetail() {
      console.error(this.formData)
      if (this.formData.content.length && !this.formData.content[this.formData.content.length - 1].disabled) { return this.$message.error({ message: '请完善上个内容再添加' }); }
      this.formData.content.push({ imgs: [], content: '', disabled: false })
    },
    async showForm(item) {
      if (item) {
        this.detail = await api.getSpecification(item.id, null, this)
        this.detail.content.forEach(v => { v.imgs = [{ url: v.img }]; v.disabled = true })

        this.isAddItem = false
      } else {
        this.isAddItem = true
      }

      this.initForm(this.detail)
      this.isShow = true
    },
    cancel() { this.isShow = false },
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
    async submit(formName) {
      let o = this.formData
      // detail
      // let len = this.$refs['detailRule'] && this.$refs['detailRule'].length;
      // if(len) {
      //   for(let i = 0; i < len; i++) {
      //     let res = await this.$refs['detailRule'][i].validate().catch(e => e);
      //     if(!res) return ;
      //   }
      // }

      this.dialogConfig.canSubmit = true
      console.log('formData', o)

      let param = {
        title: o.title,
        sort: o.sort,
        content: o.content.map(v => { return { content: v.content, img: v.imgs[0] && v.imgs[0].url } })
      }
      let res = this.isAddItem ? await api.setSpecification(param, this) : await api.updateSpecification(this.detail.id, param, this)

      this.dialogConfig.canSubmit = true
      this.isShow = false

      this.getList()
    },
    change(v) {
      this.listQuery = v
      this.getList()
    },
    async getList() {
      this.isLoading = true

      console.log('param', this.listQuery)
      let res = await api.getSpecificationList(this.listQuery, this)

      if (res && res.data) {
        this.list = res.data || []
        this.total = this.list.length // res.pagination ? res.pagination.total : 0;
      }

      this.isLoading = false
      console.log('classList res: ', res, this.list)
    },
    async deleteItem(item) {
      let res = await api.deleteSpecification(item.id, null, this)

      this.getList()
    }
  }
}
</script>