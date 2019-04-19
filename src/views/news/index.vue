<style lang="css">
.header{
  margin: 20px 0;
}
</style>

<template>
<div>

<el-header class="header">
  <custom-head :config='headConfig' @add='updateForm(1)' @search='search'></custom-head> 
</el-header>

<custom-table :config='tableConfig' 
                :data='list' 
                :total='total' 
                :isLoading='isLoading' 
                @update='updateForm'
                @delete='deleteItem'
                @change='change'></custom-table>


<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
    <el-form label-width='100px'>
      <custom-img :obj='img'></custom-img>

      <custom-input :obj='title'></custom-input>

      <custom-select :obj='classify'></custom-select>

      <custom-radio :obj='recommend'></custom-radio>

      <el-form-item :label="content.title">
        <editor style='width: 800px;' v-model='content.value'></editor>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" >取消</el-button>
      <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
    </span>
</el-dialog>


</div>
</template>
<script>

import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customInput from '@/components/input'
import customSelect from '@/components/select'
import customRadio from '@/components/radio'
import number from '@/components/number'
import integer from '@/components/integer'
import dateTimeRange from '@/components/dateTimeRange'
import customImg from '@/components/img'
import editor from '@/components/Tinymce'
import uploadFn from "@/utils/tencent_cos";
import { voidTypeAnnotation } from 'babel-types';

export default {
  components: {
    customHead,
    customTable,
    customInput,
    customSelect,
    customRadio,
    number,
    integer,
    dateTimeRange,
    customImg,
    editor,
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
      img: { title: '主图', value: [], limit: 1, alert: null },
      title: { title: '标题', value: '', alert: null, },
      classify: { 
        title: '分类', 
        categories: [
          { id: 1, title: '公司新闻' },
          { id: 2, title: '行业动态' },
        ], 
        value: '', 
        alert: null, 
      },
      recommend: {
        title: '热门推荐',
        categories: [
          { id: 1, title: '是' },
          { id: 2, title: '否' },
        ],
        value: '',
        alert: null,
      },
      content: { title: '内容', value: '', alert: null, },
      stopSubmit: false,

      headConfig: {
        title: '添加案例',
        placeHolder: '请输入案例名',
        categories: [
          { id: 1, title: '公司新闻' },
          { id: 2, title: '行业动态' },
        ]
      },

      tableConfig: {
        showOperate: true,
        updateTitle: '编辑',
        showDelete: true,
        classList: [
          { key: '主图', value: 'image', isImg: true, },
          { key: '案例标题', value: 'title' },
          { key: '案例内容', value: 'content' },
          { key: '分类', value: 'class' },
          { key: '热门推荐', value: 'recommend' },
        ],
      },
      list: [],
      total: 0,
      query: {
        
        page: 1,
        limit: 10,
      },
      isLoading: true,

    }
  },
  methods: {
    search(param){
      console.error('search :', param); 
    },
    updateForm(status){
      this.dialogConfig.status = typeof status === 'number' ? status : 2;

      // FIXME: 
      this.img.value = status.img || []; 
      this.title.value = status.title || '';
      this.classify.value = status.class || '';
      this.recommend.value = status.recommend || '';
      this.content.value = status.content || '';
      // console.error('updateform', this.dialogConfig.status, this.name.value, this.img.value);
    },
    change(param){
      console.error('param :', param);
      this.query.limit = param.limit;
      this.query.page = param.page;
    },
    closeDialog(){
      let config = this.dialogConfig;

      config.status = 0;
    },
    async submit(){
      let paramArr = ['title'],
          query = this.query,
          param;

      this.img.alert = this.img.value.length ? null : '请选择图片作为主图';

      if(paramArr.some(v => { return this[v].value ? false : this[v].alert = `请输入${this[v].title}`; })) return;

      if(typeof this.classify.value !== 'number') return this.classify.alert = `请选择${this.classify.title}`;
      if(typeof this.recommend.value !== 'number') return this.recommend.alert = `请选择${this.recommend.title}`;
      
      this.stopSubmit = true;

      // let uploadArr = this.img.value.filter(v => v.raw).map(v => v.raw);
      // let imgRes = await uploadFn(uploadArr);
      // console.error('imgRes :', imgRes);

      param = {
        img: this.img.value,
        title: this.title.value,
        classify: this.classify.value,
        recommend: this.recommend.value,
        content: this.content.value,
      };

      // return console.error(img, o, 'about param : ', param);
      this.save(param);
    },
    format(item){
      item.img = [ {url: item.image }];
    },
    // 
    async save(param){
      console.error('save: ', param); 

      this.stopSubmit = false;
    },
    async getList() { //获取列表
      this.isLoading = true

      // console.error('param', this.query)
      // let res = await api.getClassList(this.listQuery, this);

      let res = [
        { image: 'https://image-static.segmentfault.com/242/285/2422858747-59bb89180b2b2_articlex', title: '13211122233', content: 'skdfsdf', class: 1, recommend: 1 },
        { image: 'https://image-static.segmentfault.com/242/285/2422858747-59bb89180b2b2_articlex', title: '13211122233', content: 'skdfsdf', class: 1, recommend: 1 },
      ];
      res.data.forEach(this.format);

      this.list = res.data;
      res.pagination.total// res.pagination.total;
      this.isLoading = false
    },
    async deleteItem(id){
      console.error('delete Item', id);
      // let res = await api.deleteClass(id, null, this);

      this.getList();
    },

  },

  created(){
    this.getList();
  },
}
</script>