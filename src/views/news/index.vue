<style lang="css">
.header{
  margin: 20px 0;
}
</style>

<template>
<div>

<el-header class="header">
  <custom-head :config='headConfig' @emit="handleHeaderClick" @search='search'></custom-head> 
</el-header>

<custom-table ref='mainTable' :config='tableConfig' :data='list' :total='total' :isLoading='isLoading' @modify='handleTableClick' @delete='deleteItem' @change='change'></custom-table>

<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
    <el-form label-width='100px'>
      <custom-input :obj='name'></custom-input>

      <custom-img :obj='img'></custom-img>

      <!-- <custom-input :obj='desc'></custom-input> -->

      <!-- <custom-radio :obj='recommend'></custom-radio> -->

      <!-- <custom-select :obj='newsType' @change='switchType'></custom-select> -->

      <el-form-item :label="content.title" v-if='isArticle'>
        <editor style='width: 800px;' v-model='content.value'></editor>
      </el-form-item>

      <custom-file :obj='contentFile' v-else></custom-file>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" >取消</el-button>
      <el-button type="primary" :disabled="doing" :loading="doing" @click="submit">确 定</el-button>
    </span>
</el-dialog>


</div>
</template>
<script>

import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customInput from '@/components/customInput'
import customSelect from '@/components/customSelect'
import customRadio from '@/components/radio'
import number from '@/components/number'
import integer from '@/components/integer'
import dateTimeRange from '@/components/dateTimeRange'
import customImg from '@/components/customImg'
import customFile from '@/components/customFile'
import editor from '@/components/Tinymce'
import uploadFn from "@/utils/tencent_cos";
import api from '@/api/news';
import classApi from '@/api/classify';
import commonReq from '@/api/common' 
import vd from '@/utils/validate'
import moment from '@/utils/moment'

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
    customFile,
    editor,
  },

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },
    isAdd(){ return this.dialogConfig.status == 1; },

    isArticle(){ return this.newsType.value == 1; },
    isVideo(){ return this.newsType.value == 2; },
  },

  data() {
    return {
      dialogConfig: {
        title: '',
        status: 0, // 1:添加分类，2：编辑分类， 3：二级分类列表
        ADD: 1,
        EDIT: 2,
      },

      img: { title: '图片', value: [], limit: 1, alert: null, err: '图片不能为空!', },
      name: { type: 'string', title: '标题:', value: '', err: '标题不能为空!', alert: null, },
      desc: { type: 'string', title: '描述', value: '', alert: null, },
      newsType: { 
        title: '类型', 
        list: [
          { id: 1, title: '文章' },
          { id: 2, title: '视频' },
          // { id: 3, title: '音频' },
        ], 
        value: 1, 
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
      contentFile: { title: '内容', value: [], limit: 1, preventValidate: true, alert: null, },
      doing: false,

      headConfig: {
        // placeHolder: '请输入案例名',
        btnList: [
          { title: '发布文章', },
          { title: '发布视频', },
        ],
        // selectList: [
        //   [
        //     { id: -1, title: '全部' },
        //     { id: 1, title: '公司新闻' },
        //     { id: 2, title: '行业动态' },
        //   ],
        // ],
      },

      tableConfig: {
        showOperate: true,
        showDelete: true,
        classList: [
          { key: "序号", value: "index" },
          { key: "主图", value: "news_image", isImg: true },
          { key: "类型", value: "typeStr" },
          { key: "标题", value: "news_title" },
          { key: "发布时间", value: "time" }
        ],
        btnList: [
          { key: 'news_id', title: '编辑', },
        ],
      },
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
      },
      isLoading: false,
      
      newsClassList: [],
    }
  },

  methods: {
    handleHeaderClick(i) {
      if(i == 0){
        this.newsType.value = 1;
        return this.updateForm();
      }

      if(i == 1){
        this.newsType.value = 2;
        return this.updateForm();
      }
    },

    handleTableClick(item, i) {
      this.detail = item;

      if(i == 0) return this.updateForm(item);
    },

    switchType(id){
      this.content.value = '';
      this.contentFile.value = [];
    },

    async getList() {
      let loading = this.$loading();

      let res = await api.getCase(this.query, this);
      loading.close();

      if(res && res.status == 0){
        res.data.forEach(this.format);
        this.list = res.data;
        return this.total = res.pagination.total;
      }

      this.$message.error(res ? res.error || res : '获取新闻列表失败!');
    },

    format(item, index) {
      let res = this.newsType.list.filter(v => v.id == item.news_type)[0];
      item.typeStr = res ? res.title : '';

      item.index = (this.query.page - 1) * this.query.limit + index + 1;

      item.time = moment(item.add_time * 1000).format('yyyy/MM/dd hh:mm:ss');
    },

    updateForm(item) {
      this.dialogConfig.status = item ? this.dialogConfig.EDIT : this.dialogConfig.ADD;

      if(item) this.newsType.value = item.news_type;

      this.img.value = item ? [{ url:item.news_image }] : [];
      this.name.value = item ? item.news_title : "";
      // this.desc.value = item ? item.information_desc : '';

      if(this.isArticle){
        this.content.value = item ? item.news_content : '';
      }else{
        try{
          this.contentFile.value = item ? JSON.parse(item.news_content) : []; 
        }catch(e){
          this.contentFile.value = [];
        }
      }
    },

    closeDialog() {
      let config = this.dialogConfig;

      config.status = 0;
    },

    async submit() {
      let paramArr = ['name'],
        query = this.query,
        param, fileList;

      if(vd.isEmpty(this.name.value)) return this.$message.error(this.name.err);

      this.img.alert = this.img.value.length ? null : this.img.err;
      if(this.img.alert) return ;

      let loading = this.$loading(); 
      if(this.doing) return ;
      this.doing = true;

      let imgList = await uploadFn(this.img.value.filter(v => v.raw).map(v => v.raw));
      imgList = imgList.concat(this.img.value.filter(v => !v.raw).map(v => v.url));

      if(this.isVideo){
        fileList = await uploadFn(this.contentFile.value.filter(v => v.raw).map(v => v.raw));
        fileList = fileList.map(v => ({ url: v, name: v.substr(v.lastIndexOf('/') + 1), }));
        // fileList = this.contentFile.value.map(v => { return v.raw ? { url: `${this.contentFile.cdnUrl}/${v.response.key}`, name: v.name } : { url: v.url, name: v.name } });
      }

      param = {
        news_title: this.name.value,
        news_image: imgList[0],
        news_type: this.newsType.value,
        news_content: this.isVideo ? JSON.stringify(fileList) : this.content.value,
      };

      this.save(param, loading);
    },

    async save(param, loading) {
      let res = await (this.isAdd ? api.addCase(param) : api.editCase(this.detail.news_id, param));

      res.status ==0 ? this.$message.success('操作成功') : this.$message.error('操作失败');

      this.getList();
      this.doing = false;
      loading.close();
      this.dialogConfig.status = 0;
    },

    async deleteItem(item) {
      let res = await api.deleteCase(item.news_id);

      if(res && res.status == 0){
        return this.getList();
      }

      this.$message.error(res ? res.error || res : '删除失败!');
    },

    search(param) {
      let statusList = param.statusList;

      this.query.page = 1;
      this.$refs.mainTable.initPage();

      this.query.search = param.search;
      // this.query.classify_id = param.status; 
      statusList[0] == -1 ? (delete this.query.classify_id) : (this.query.classify_id = statusList[0]);

      this.getList();
    },

    change(param) {
      this.query.limit = param.limit;
      this.query.page = param.page;
      this.getList();
    },

    async getUploadToken(){
      let res = await commonReq.getUploadToken();

      if(res.error) return this.$message.error(`getUploadToken: ${res.error}`);

      this.contentFile.body.token = this.img.body.token = res.data;
      this.contentFile.body.config = this.img.body.config = "{ useCdnDomain: true }";
    },

  },

  created() {
    this.getList();
  }
}
</script>