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
<el-dialog :title="isAddItem ? `新增${className}` : `编辑${className}` " :visible.sync="isShow" width="30%">

  <el-form :model="formData"  ref="ruleForm" :rules="rules" >

    <el-form-item label="分类名称" :label-width="formLabelWidth" prop="name">
      <el-input v-model="formData.storegc_name" auto-complete="off"></el-input>
    </el-form-item>
    <!-- <el-form-item :label="item.key" :label-width="formLabelWidth" prop="name" v-for='(item, index) in FormClassList' :key='index'>
      <el-input v-model="formData.storegc_name" auto-complete="off"></el-input>
    </el-form-item> -->
    
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="isShow=false" >取消</el-button>
    <el-button v-if="isAddItem" type="primary" @click="submit('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确 定</el-button>
    <el-button v-else type="primary" @click="submit('ruleForm')"
    :disabled="waitAddNotice" 
    :loading="waitAddNotice">确认修改</el-button>
  </span>
</el-dialog>
<el-dialog :visible.sync='showClass' width='30%'>
  <el-form>
    <el-form-item>
      <el-button type='primary' @click='showModal'>添加二级分类</el-button>
    </el-form-item>

    <el-form-item label='分类名称' v-for='(item, index) in twoClassList' :key='index'>
      <el-input style='width: 80%;' v-model="item.storegc_name" auto-complete='off' :disabled='true'></el-input>
      <i class='el-icon-close' @click='deleteTwoClass(item)'></i>
    </el-form-item>
  </el-form>
  <!-- <div slot='footer'>
    <el-button type='primary' @click='saveTwoClass'>确定</el-button>
    <el-button @click='showClass=false'>取消</el-button>
  </div> -->
</el-dialog>

<el-container class="notice">

<el-header class="header">
  <el-form :inline="true" :model="formInline" class="form">
    <el-form-item>
      <el-button type="primary" icon="el-icon-edit-outline" @click="showModal">新增{{className}}</el-button>
    </el-form-item>

  </el-form>       
</el-header>

<el-main>
    <el-table :data="tableData" stripe v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%" >

      <el-table-column :label="item.key" :prop="item.value" v-for='(item, index) in classList' :key='index'></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showModal(scope.$index, scope.row)" v-if="category !== '易居管家' || ['家政保洁', '施工员', '项目经理'].indexOf(scope.row.storegc_name) === -1">编辑</el-button>
          <el-button size="mini" type="danger" @click="showDelete(scope.$index, scope.row)" v-if="category !== '易居管家' || ['家政保洁', '施工员', '项目经理'].indexOf(scope.row.storegc_name) === -1">删除</el-button>
          <el-button size="mini" type="primary" @click="showTwoClass(scope.$index, scope.row)" v-if='hasTwoClass'>二级分类</el-button>
        </template>
      </el-table-column>
    </el-table>
</el-main>
<el-footer>
  <el-pagination background @size-change="sizeChange" @current-change="pageChange" :current-page="listQuery.page" :page-sizes="[20,40,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
  </el-pagination>
</el-footer>
</el-container>


</div>
</template>
<script>

import api from '@/api/api' 
import upLoadFile from '@/utils/aahbs.js'

export default {
  components: {
  },

  async created(){
    this.category = this.$route.query.category;
    let singleClassList = [ '设计师+', '易居管家', '集成暖通' ];
    console.log('--', this.category)

    this.hasTwoClass = singleClassList.indexOf(this.category) !== -1 ? false : true;

    // let res = await api.getClassList({ parent_id: 0 }, this);
    // res.data.forEach(v => v.storegc_name === this.category ? this.categoryId = v.storegc_id : null)
    // this.listQuery.parent_id = this.categoryId;
    // console.log('-get 8-', res, this.categoryId)
    this.listQuery.parent_id = this.config.indexOf(this.category) + 1;

    this.getList()
  },

  formData: {
    name: '',
  },

  data() {
    return {
      config: [ '设计师+', '易居管家', '整居定制', '集成暖通', '主材选购', '家具选购', '易居海外' ],
      className: '分类',
      classList: [
        { key: '分类标题', value: 'storegc_name' },
      ],
      category: '',
      categoryId: null,
      hasTwoClass: null,
      waitAddNotice:false,
      isAddItem:true,
      isShow: false,
      rules: {
        storegc_name: [
            { required: true, message: '请输入昵称' },
            { required: true, message: '不能超过15个字符!', trigger: 'blur', max: 15 }
        ],
        price: [
            { required: true, message: '请输入价格' },
            { type:'number', message: '值必须为数字' },
        ],
      },
      formLabelWidth:'80px',
      formData: {
        name: '',
      },
      tableData: [],
      searchKeyWord: '',
      showClass: false,
      parentClass: {},
      twoClassList: [],
      categories: [
        { id: 1, title: '111' },
        { id: 3, title: '311' },
      ],
      formInline: {},
      listLoading: false,
      listQuery: {
        parent_id: 0,
        page: 1,
        limit: 2,
      },
      total: 0,
    }
  },
  methods: {
    searchByPhone(){
      console.log('search ----', this.searchKeyWord);
    },
    showModal(index, row){ //
      if(row){
        this.isAddItem = false;
        this.formData = row;
        console.log(row)
      }

      this.isShow = true
    },
    async submit(formName){
      
      let res = await this.$refs[formName].validate().catch(e => e);
      if(!res) return ;

      this.waitAddNotice = true
      console.log('formData', this.formData);
      
      let param = {
        storegc_name: this.formData.storegc_name, 
        storegc_parent_id: this.showClass ? this.parentClass.storegc_id : this.listQuery.parent_id,
      };
      let r = this.isAddItem ? await api.setClass(param, this) : await api.updateClass(this.formData.storegc_id, param, this);

      this.formData = {};
      this.waitAddNotice = false;
      this.isAddItem = true;
      this.isShow = false;

      this.showClass ? this.getTwoList() : this.getList();
      
    },
    showDelete(index, row){

      this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteItem(row.storegc_id);
      }).catch(()=>{ this.$notify.info({ title: '消息', message: '已取消' }); })
    },
    async showTwoClass(index, row){
      this.showClass = true;
      this.parentClass = row;

      this.getTwoList();
    },
    addTwoClass(){
      // this.twoClassList.push({ storegc_name: '' });
    },
    deleteTwoClass(item){ 
      this.showDelete(null, item);
      // this.twoClassList.splice(index, 1) 
    },
    saveTwoClass(){
      let param = {
        storegc_name: '',
        storegc_parent_id: this.parentClass.storegc_id,
      };

      this.twoClassList.forEach(async v => {
        param.storegc_name = v.storegc_name; 
        let res =  await api.setClass(param, this);

      })
      
      console.log(this.twoClassList)
    },
    sizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    pageChange(val) {
      this.listQuery.page = val
      this.getList()
    },
      // 
      async getList() { //获取列表
        this.listLoading = true

        console.log('param', this.listQuery)
        let data = await api.getClassList(this.listQuery, this);
        // this.tableData = [
        //   { name: 'sf开始的浪费口水都发送方SAF', company: 'sfd', price: '324.34', level: 4.5, twoClassList: [{content: 'aaa'}] },
        //   { name: 'sf开始的浪费口水都发送方SAF', company: 'sfd', price: '324.34', level: 4.5 },
        // ];
        this.tableData = data.data && data.data || [];
        this.total = this.tableData.length// res.pagination.total;
        this.listLoading = false
      },
      async deleteItem(id){
        let res = await api.deleteClass(id, null, this);

        this.showClass ? this.getTwoList() : this.getList();
        
      },
      async getTwoList(){

        let res = await api.getClassList({ parent_id: this.parentClass.storegc_id }, this);
        this.twoClassList = res.data || [];
        
      },
    
    
  }
}
</script>