<style lang="css">
.header{
  margin: 20px 0;
}
</style>

<template>
<div>
<!-- <el-container class="notice"> -->

<el-header class="header">
  <custom-head :config='headConfig' @add='updateForm(1)' @search='search'></custom-head> 
</el-header>

<custom-table :config='tableConfig' 
                :data='list' 
                :total='total' 
                :isLoading='isLoading' 
                @auth='auth'
                @change='change'></custom-table>
</div>
</template>
<script>

import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customInput from '@/components/input'
import customImg from '@/components/customImg'
import uploadFn from "@/utils/tencent_cos";
import { voidTypeAnnotation } from 'babel-types';
import api from '@/api/member';

export default {
  components: {
    customHead,
    customTable,
    customInput,
    customImg,
  },

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },
  },

  data() {
    return {
      dialogConfig: {
        title: '',
        status: 0, // 1:添加分类，2：编辑分类， 3：二级分类列表
      },
      name: { title: '名称', value: '', alert: null, },
      img: { title: '主图', value: [], limit: 1, alert: null },
      stopSubmit: false,

      headConfig: {
        placeHolder: '手机号搜索',
        categories: [
          { id:null, name: '全部', },
          { id: 0, name: '未处理', },
          { id: 1, name: '通过', },
          { id: 2, name: '拒绝', }
        ]
      },

      tableConfig: {
        showOperate: true,
        showAuth: true,
        classList: [
          { key: '姓名', value: 'member_nick' },
          { key: '联系方式', value: 'member_mobile' },
          { key: '推荐码', value: 'inviter_mobile' },
          { key: '申请级别', value: 'vip_level' },
          { key: '收款金额', value: 'money' },
          { key: '状态', value: 'stateStr' },
        ],
      },
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
      },
      isLoading: false,

    }
  },
  methods: {
    //列表================================================
    async getList() {
      this.isLoading = true;
      let res = await api.getMemberApply_api(this.query, this);

      res.data.forEach(this.format);

      this.list = res.data;
      this.total =res.pagination.total;
      this.isLoading = false;
    },
    format(item) {
      item.state= item.status;
      if(item.status == 0){
        item.stateStr = '未处理'
      }else if(item.status ==1){
        item.stateStr = '已同意'
      }else{
        item.stateStr = '已拒绝'
      }
    },
    //查看详情============================================
    updateForm(status) {
      let formData = this.formData;

      this.dialogConfig.status = typeof status === "number" ? status : 2;

      this.keys.forEach(v => {
        formData[v].value = status[v];
      });

      this.img.value = status.img[0].url;
      formData.content = status.content;
      this.detail = status;
    },

    //操作================================================
    async auth(item, state) {
      let send = {
        id:item.apply_id,
        status:state
      }
      let res = await api.auditMemberApply_api(send,this);
      if(res.status == 0){
        this.$message({message:'操作成功',type:'success'});
      }else{
        this.$message({message:res.error,type:'error'});
      }
      this.getList();
    },
    closeDialog() {
      let config = this.dialogConfig;
      config.status = 0;
    },
    async save(param) {
      this.stopSubmit = false;
    },
    async deleteItem(id) {

    },
    //查询 分页===========================================
    change(param) {
      this.query.limit = param.limit;
      this.query.page = param.page;
      this.getList();
    },
    search(param) {
      this.query.search = param.search;
      this.query.status = param.status;
      this.getList();
    },
  },
  created(){
    this.getList();
  },
}
</script>