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

  <el-header class='header'>
    
    <customHead :config='headConfig' @add='showForm' @searchByKeyWord='searchByKeyWord'></customHead>

  </el-header>

  <el-main>

    <el-table :data="addressList" stripe v-loading="loadAddress" element-loading-text="给我一点时间" style="width: 100%" >
      <el-table-column label='名称' prop='address_name'></el-table-column>
      <el-table-column label='地址' prop='address_detail'></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showForm(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="showDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background 
                  @size-change="addressSizeChange" 
                  @current-change="addressPageChange" 
                  :current-page="listParam.page" 
                  :page-sizes="[10,20,30, 50]" 
                  :page-size="listParam.limit" 
                  layout="total, sizes, prev, pager, next" :total="addressTotal">
    </el-pagination>

  </el-main>

</el-container>
<!-- form -->
<el-dialog :title="isAdd ? '新增教学点' : '修改教学点' " :visible.sync="canShowForm" width="60%" :before-close='clearForm'>

  <el-form :model="addressForm"  ref="ruleForm" :rules="rules">
    <!-- 名称 -->
    <el-form-item label="名称" :label-width="formLabelWidth"  prop="address_name">
      <el-input v-model="addressForm.address_name" auto-complete="off"></el-input>
    </el-form-item>

    <!-- 地址 -->
    <el-form-item label="地址" :label-width="formLabelWidth" prop='address_detail'>
      <el-input v-model="addressForm.address_detail" auto-complete="off"></el-input>
    </el-form-item>

  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="clearForm" >取消</el-button>
    <el-button type="primary" :disabled="!canSubmit" :loading="!canSubmit" @click="saveAddress('ruleForm')">确 定</el-button>
  </span>
</el-dialog>

</div>
</template>
<script>

import api from '@/api/seller' 
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import customHead from '@/components/customHead/index.vue'

export default {
  components: {
    UploadExcelComponent,
    customHead,
  },
  created(){
    this.getList()
  },
  data() {
    return {
      formLabelWidth:'80px',
      headConfig: {
        showAdd: true,
        showSearchByKeyWord: true,
        title: '添加教学点',
        inputWidth: '300px',
        placeholder: '请输入地址点',
      },
      canSubmit: true,
      canShowForm: false,
      isAdd: true, // 区别添加和修改
      rules: {
        address_name: [ { required: true, message: '请输入名称', trigger: 'blur' } ],
        address_detail: [ { required: true, message: '请输入地址详情', trigger: 'blur' } ],
      },
      addressForm: {
        address_name: '',
        address_detail: '',
      },
      listParam: { 
        page: 1,
        limit: 10,
        address_name: '',
      },
      loadAddress: false,
      addressList: [],
      addressTotal: null,
      interval: null,
    }
  },
  methods: {
      searchByKeyWord(v){
        this.listParam.address_name = v;
        console.log('address search :', this.listParam);

        this.getList();
      },
      showForm(index, row){
        this.canShowForm = true;
        this.canSubmit = true;
        this.initForm();

        if(typeof index !== 'number') return this.isAdd = true;

        this.isAdd = false;
        this.initForm(row);
      },
      clearForm(done){
        this.initForm();
        this.canShowForm = false;
        // done && done();
      },
      initForm(item){
        let detail = {};

        for(let key in (item || this.addressForm)){ detail[key] = item ? item[key] : '' }
        console.log(detail);
        this.addressForm = detail;
      },
      async saveAddress(rule){
        let res = await this.$refs[rule].validate().catch(e => e);
        if(!res) return 

        if(/[-\[\]]/g.test(this.addressForm.address_name)) return this.$message.error({ message: `地址不能包含非法符号` });

        this.canSubmit = false;
        console.log('save address :', this.addressForm);
        if(this.isAdd){
          await api.setAddress(this.addressForm, this) 
        }else{
          delete this.addressForm.store_id; 
          await api.updateAddress(this.addressForm, this); 
        }

        this.canShowForm = false;
        this.clearForm();
        this.getList();
      },
      showDelete(index, row){
        this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', { type: 'warning' }).then(async () => {

          this.deleteAddress(row);

        }).catch(()=>{ this.$notify.info({ title: '消息', message: '已取消' }); })
      },
      async deleteAddress(item){
        await api.deleteAddress({address_id: item.address_id}, this); 

        this.getList();
      },
      //
      async getList() { //获取列表
        this.loadAddress = true;

        let res = await api.getAddressList(this.listParam, this);
        
        this.addressList = res.data;
        this.addressTotal = res.pagination ? res.pagination.total : 0;
        this.loadAddress = false;
      },
      
    addressSizeChange(val) {
      this.listParam.limit = val
      this.listParam.page = 1;
      this.getList()
    },
    addressPageChange(val) {
      this.listParam.page = val
      this.getList()
    },
     
  }
}
</script>