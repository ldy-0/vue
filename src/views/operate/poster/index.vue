<style lang="css">
</style>

<template>
<div class="notice">

<el-header class="header">
  <custom-head :config='headConfig' @add='openDialog(1)' @search='search' @change='headChange' @emit="clickHeadBtn"></custom-head> 
</el-header>

<custom-table ref='table' :config='tableConfig' :data='tableConfig.list' :total='tableConfig.total' @update='openDialog' @modify='dispatch' @change='change'></custom-table>

<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
  <div v-if="[1, 2].indexOf(dialogConfig.status) !== -1">

    <poster :obj="detail" :classList="classList" @cancel="closeDialog" @submit="submit"></poster> 

  </div>

  <classify v-if="dialogConfig.status === CLASS" @update="updateClass"></classify>  

</el-dialog>

</div>
</template>
<script>

import classApi from '@/api/classify' 
import api from '@/api/activity' 
import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customSelect from '@/components/select'
import editor from '@/components/Tinymce'
import poster from './component/poster'
import classify from './component/classify'
// import uploadFn from "@/utils/tencent_cos";

export default {
  components: {
    customHead,
    customTable,
    customSelect,
    editor,
    poster,
    classify,
  },

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },
  },

  data() {
    return {
      dialogConfig: {
        title: '',
        status: 0, // 1: 添加海报，2：修改海报 3. 分类列表
      },

      CLASS: 3,

      content: { title: '活动规则', value: '', alert: null, disabled: false, },
      // goods: { title: '关联商品', categories: [], value: '', alert: null, },
      stopSubmit: false,

      headConfig: {
        title: '上传图片',
        btnList: [
          { title: '查看分类', },
        ],
        selectLabelList: ['分类'],
        selectList: [],
        placeHolder: '请输入名称',
      },
      classList: [],

      tableConfig: {
        showOperate: true,
        btnList: [
          { key: 'poster_id', value: '修改', },
          { key: 'poster_id', value: '删除', type: 'danger' },
        ],
        classList: [
          { key: '序号', value: 'poster_id' },
          { key: '分类', value: 'class_name' },
          { key: '上传时间', value: 'create_time' },
          { key: '背景图', value: 'bg_image', isImg: true, },
          { key: '示意图', value: 'image', isImg: true, },
          { key: '名称', value: 'name' },
        ],
        list: [],
        total: 0,
        query: { page: 1, limit: 10, },
        detail: null,
      },

      rainMap: {
        0: '未开始',
        1: '进行中',
        2: '已结束',
      },
      
    }
  },

  methods: {
    openDialog(status){
      this.dialogConfig.status = typeof status === 'number' ? status : 2;

      this.detail = typeof status == 'object' ? status : null;
    },
    
    closeDialog(){
      let config = this.dialogConfig;

      config.status = 0;
    },

    search(param){
      let query = this.tableConfig.query,
          statusList = param.statusList,
          o = {};

      query.page = 1;
      this.$refs.table.initPage();

      if(param.search) o.search = param.search;
      if(statusList[0] >= 0) o.class_id = statusList[0];

      o.page = query.page;
      o.limit = query.limit;
      this.tableConfig.query = o;
      
      this.getList();
    },

    headChange(type, index, v){
    },

    updateClass(){
      this.getClassList();
    },

    clickHeadBtn(index) {
      if(index == 0) return this.openDialog(3); 
    },

    dispatch(item, index){
      // 修改 
      if(index == 0) this.openDialog(item);

      // 删除
      if(index == 1) this.deleteItem(item);
    },

    submit(param){
      this.stopSubmit = true;

      this.save(param);
    },

    // 
    async save(param){
      let status = this.dialogConfig.status;
      let res = null;

      res = status == 1 ? await api.addPoster(param) : await api.setPoster(this.detail.poster_id, param);

      if(typeof res == 'string' || !res || res.error){
        this.stopSubmit = false;
        return this.$message.error(`${res ? res.error || res : '保存活动信息失败'}`);
      }

      if(res.status ==0) this.$message.success('操作成功');

      this.dialogConfig.status = 0;
      this.getList(); 

      this.stopSubmit = false;
    },

    async getList() { 
      let tableConfig = this.tableConfig;

      tableConfig.loading = true

      let res = await api.getPosterList(tableConfig.query);

      if(typeof res == 'string' || !res || res.error) return this.$message.error(res ? res.error || res : '获取分享列表失败');

      if(res && res.data){
        res.data.forEach(this.format);

        tableConfig.list = res.data || [];
        tableConfig.total = res.pagination ? res.pagination.total : tableConfig.list.length;
      }
      
      tableConfig.loading = false
    },

    format(v){
      let classList = this.classList;

      v.sketchList = [ { url: v.image, } ];
      v.imgList = [ { url: v.bg_image, } ];

      let classify = classList.filter(item => item.class_id === v.class_id)[0];
      v.class_name = classify ? classify.class_name : '-';

      // 
      v.showEnd = v.status == 1;
    },

    change(param){
      let query = this.tableConfig.query;

      query.limit = param.limit;
      query.page = param.page;

      this.getList();
    },

    async deleteItem(item){
      let res = await api.deletePoster(item.poster_id, null);

      res.status == 0 ? this.$message.success('删除成功') : this.$message.error(res ? res.error || res : '删除失败');

      this.getList();
    },

    async getClassList() {
      let headConfig = this.headConfig,
          selectList = headConfig.selectList,
          arr = [ { id: -1, title: '全部', } ],
          res = await classApi.getShareClassList();

      if(!res || typeof res === 'string' || res.error) return this.$message.error(res ? res.error || res : '获取分类列表失败!');

      if(res && res.data){
        res.data.forEach(v => {
          v.id = v.class_id;
          v.title = v.class_name;
        });
      }

      selectList.shift();
      if(res.data) selectList.unshift(arr.concat(this.classList = res.data)); 

      this.getList();
    },

  },

  created(){
    this.getClassList();
  },

  beforeRouteLeave(to, from, next){
    if(this.interval) clearInterval(this.interval);

    next();
  }
}
</script>