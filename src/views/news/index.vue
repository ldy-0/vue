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

<custom-table ref='mainTable'
                :config='tableConfig' 
                :data='list' 
                :total='total' 
                :isLoading='isLoading' 
                @update='updateForm'
                @delete='deleteItem'
                @change='change'></custom-table>


<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="50%">
    <el-form label-width='100px'>
      <custom-img :obj='img'></custom-img>

      <custom-input :obj='title'></custom-input>

      <custom-input :obj='desc'></custom-input>

      <custom-select :obj='classify'></custom-select>

      <!-- <custom-radio :obj='recommend'></custom-radio> -->

      <custom-select :obj='newsType' @change='switchType'></custom-select>

      <el-form-item :label="content.title" v-if='newsType.value == 1'>
        <editor style='width: 800px;' v-model='content.value'></editor>
      </el-form-item>

      <custom-file :obj='contentFile' v-else></custom-file>
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
import customInput from '@/components/customInput'
import customSelect from '@/components/select'
import customRadio from '@/components/radio'
import number from '@/components/number'
import integer from '@/components/integer'
import dateTimeRange from '@/components/dateTimeRange'
import customImg from '@/components/customImg'
import customFile from '@/components/customFile'
import editor from '@/components/Tinymce'
import uploadFn from "@/utils/tencent_cos";
import { voidTypeAnnotation } from 'babel-types';
import api from '@/api/case';
import classApi from '@/api/classify';
import commonReq from '@/api/common' 

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
  },

  data() {
    return {
      dialogConfig: {
        title: '',
        status: 0, // 1:添加分类，2：编辑分类， 3：二级分类列表
      },

      img: { title: '商品图片', value: [], limit: 1, alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      title: { type: 'string', title: '标题', value: '', alert: null, },
      desc: { type: 'string', title: '描述', value: '', alert: null, },
      classify: { 
        title: '分类', 
        categories: [
          { id: 1, title: '公司新闻' },
          { id: 2, title: '行业动态' },
        ], 
        value: '', 
        alert: null, 
      },
      newsType: { 
        title: '类型', 
        categories: [
          { id: 1, title: '文本' },
          { id: 2, title: '视频' },
          { id: 3, title: '音频' },
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
      contentFile: { title: '内容', value: [], limit: 1, alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      stopSubmit: false,

      headConfig: {
        title: '添加案例',
        placeHolder: '请输入案例名',
        selectList: [
          [
            { id: -1, title: '全部' },
            // { id: 1, title: '公司新闻' },
            // { id: 2, title: '行业动态' },
          ],
        ],
      },

      tableConfig: {
        showOperate: true,
        updateTitle: '编辑',
        showDelete: true,
        classList: [
          { key: "主图", value: "information_image", isImg: true },
          { key: "案例标题", value: "information_title" },
          // { key: "案例内容", value: "information_content" },
          { key: "分类", value: "classify_name" },
          // { key: "热门推荐", value: "recommend" }
        ]
      },
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
      },
      isLoading: true,
      
      newsClassList: [],
    }
  },

  methods: {
    switchType(id){
      this.content.value = '';
      this.contentFile.value = [];
    },

    async getList() {
      //获取列表
      this.isLoading = true;
      
      let res = await api.getCase(this.query, this);

      res.data.forEach(this.format);

      this.list = res.data;
      this.total = res.pagination.total;
      this.isLoading = false;
    },

    format(item) {
      // item.classify_name = item.classify_id==1? '公司新闻' : '行业动态';
      let matcher = this.newsClassList.filter(v => v.classify_id == item.classify_id)[0];
      item.classify_name = matcher ? matcher.classify_name: '-';

      // item.recommend = item.sort==1?'是':'否';
    },

    //========================================================
    updateForm(status) {
      this.dialogConfig.status = typeof status === "number" ? status : 2;

      this.information_id = status.information_id;

      this.img.value =status == 1?[]:[{url:status.information_image}];
      this.title.value = status.information_title || "";
      this.desc.value = status.information_desc || '';

      this.classify.value = status.classify_id || 1;
      this.recommend.value = status.sort || 1;
      this.newsType.value = status.type || 1;
      this.newsType.value != 1 ? this.contentFile.value = JSON.parse(status.information_content) : this.content.value = status.information_content || '';
    },

    closeDialog() {
      let config = this.dialogConfig;

      config.status = 0;
    },

    async submit() {
      let paramArr = ["title"],
        query = this.query,
        param, fileList;

      this.img.alert = this.img.value.length ? null : "请选择图片作为主图";

      if (
        paramArr.some(v => {
          return this[v].value ? false : (this[v].alert = `请输入${this[v].title}`);
        })
      )
        return;

      if (typeof this.classify.value !== "number") return this.classify.alert = `请选择${this.classify.title}`;
      // if (typeof this.recommend.value !== "number") return this.recommend.alert = `请选择${this.recommend.title}`;

      this.stopSubmit = true;

      let img = this.img.value.map(v => { return v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url });
      if(!img[0]) return console.error('img value :', img);

      if(this.newsType.value != 1){
        fileList = this.contentFile.value.map(v => { return v.raw ? { url: `${this.contentFile.cdnUrl}/${v.response.key}`, name: v.name } : { url: v.url, name: v.name } });
      }
      console.error(this.contentFile.value);

      param = {
        information_image: img[0],
        information_title: this.title.value,
        information_desc: this.desc.value,
        classify_id: this.classify.value,
        sort: this.recommend.value,
        type: this.newsType.value,
        information_content: fileList ? JSON.stringify(fileList) : this.content.value,
      };
      let res = null;
      if(this.dialogConfig.status==1){
        res = await api.addCase(param,this);
      }else{
        param.information_id = this.information_id;
        res = await api.editCase(param,this);
      }
      if(res.status ==0){
        this.$message.success('操作成功');
      } else{
        this.$message.error('操作失败');
      }
      this.getList();
      this.stopSubmit = false;
      this.dialogConfig.status = 0;
    },

    async deleteItem(item) {
      let res = await api.deleteCase(item.information_id, null, this);
      this.getList();
    },
    //=========================================================
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

    // 获取新闻分类列表
    async getNewsClassList() { 
      let selectClassList = this.headConfig.selectList[0];
      
      let res = await classApi.getNewsClassList({}, this);

      if(res.error) return this.$message.error(res.error || res);

      res.data.forEach(v => {
        v.title = v.classify_name;
        v.id = v.classify_id;

        selectClassList.push(v);
      });

      this.classify.categories = this.newsClassList = res.data || [];
      this.getList();
    },

  },

  created() {
    this.getNewsClassList();

    this.getUploadToken();
  }
}
</script>