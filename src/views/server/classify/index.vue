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

<!-- <el-dialog :visible.sync='showClass' width='30%'>
  <el-form>
    <el-form-item>
      <el-button type='primary' @click='showModal'>添加二级分类</el-button>
    </el-form-item>

    <el-form-item label='分类名称' v-for='(item, index) in twoClassList' :key='index'>
      <el-input style='width: 80%;' v-model="item.storegc_name" auto-complete='off' :disabled='true'></el-input>
      <i class='el-icon-close' @click='deleteTwoClass(item)'></i>
    </el-form-item>
  </el-form>
</el-dialog> -->

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
                  @submit='submit'
                  @cancel='cancel'></custom-dialog>
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

  async created(){
    // this.category = this.$route.query.category;
    // let singleClassList = [ '设计师+', '集成暖通' ];
    // console.log('--', this.category)

    // this.hasTwoClass = singleClassList.indexOf(this.category) !== -1 ? false : true;

    // this.listQuery.parent_id = this.config.indexOf(this.category) + 1;

    this.getList()
  },

  data() {
    return {
      headConfig: {
        showAdd: true,
        title: '新增分类',
      },
      tableConfig: {
        showOperate: true,
        showUpdate: true,
        showDelete: true,
        classList: [
          { key: '分类标题', value: 'storegc_name' },
          { key: '排序', value: 'storegc_sort' },
        ], 
      },
      dialogConfig: {
        width: '60%',
        labelWidth: '100px',
        classList: [
          { key: '分类名称', value: 'storegc_name', isText: true, },
          { key: '排序', value: 'storegc_sort', isText: true, },
        ],
        rules: {
          'storegc_name': [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { message: '不能超过15个字符!', max: 15, trigger: 'blur' }
          ],
          'storegc_sort': [ { required: true, message: '值不能为空!', trigger: 'blur' } ],
        },
        canSubmit: true,
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
        parent_id: 0,
        page: 1,
        limit: 2,
      },
      total: 0,
      category: '',
      hasTwoClass: null,
      searchKeyWord: '',
      showClass: false,
      parentClass: {},
      twoClassList: [],
    }
  },
  methods: {
    searchByPhone(){
      console.log('search ----', this.searchKeyWord);
    },
    showForm(item){ //
      if(item){
        this.detail = item;
        this.isAddItem = false;
      }else{
        this.isAddItem = true;
      }

      this.initForm(item);
      this.isShow = true
    },
    cancel(){ this.isShow = false; },
    initForm(item){
      let o = this.formData,
          obj = {};

      if(item){
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
    // showDelete(index, row){

    //   this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.deleteItem(row.storegc_id);
    //   }).catch(()=>{ this.$notify.info({ title: '消息', message: '已取消' }); })
    // },
    // async showTwoClass(index, row){
    //   this.showClass = true;
    //   this.parentClass = row;

    //   this.getTwoList();
    // },
    // deleteTwoClass(item){ 
    //   this.showDelete(null, item);
    // },
    // saveTwoClass(){
    //   let param = {
    //     storegc_name: '',
    //     storegc_parent_id: this.parentClass.storegc_id,
    //   };

    //   this.twoClassList.forEach(async v => {
    //     param.storegc_name = v.storegc_name; 
    //     let res =  await api.setClass(param, this);

    //   })
      
    //   console.log(this.twoClassList)
    // },
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
    async deleteItem(item){
      let res = await api.deleteClass(item.storegc_id, null, this);

      this.showClass ? this.getTwoList() : this.getList();
      
    },
      // async getTwoList(){

      //   let res = await api.getClassList({ parent_id: this.parentClass.storegc_id }, this);
      //   this.twoClassList = res.data || [];
        
      // },
    
  }
}
</script>