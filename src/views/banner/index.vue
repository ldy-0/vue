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
      <custom-img :obj='img'></custom-img>

      <custom-input :obj='sort'></custom-input>

      <custom-select :obj='bannerType'></custom-select>

      <custom-radio :obj='navType' @change="changeNavType"></custom-radio>

      <custom-select :obj='columnType' v-if="isNavColumn"></custom-select>
      <custom-img :obj='navImg' v-if="isNavImg"></custom-img>
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
import customRadio from '@/components/customRadio'
import number from '@/components/number'
import integer from '@/components/integer'
import dateTimeRange from '@/components/dateTimeRange'
import customImg from '@/components/customImg'
import customFile from '@/components/customFile'
import editor from '@/components/Tinymce'
import uploadFn from "@/utils/tencent_cos";
import api from '@/api/banner';
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

    isNavColumn(){ return this.navType.value == 2; },
    isNavImg(){ return this.navType.value == 3; },
  },

  data() {
    return {
      dialogConfig: {
        title: '',
        status: 0, // 1:添加 2：编辑
        ADD: 1,
        EDIT: 2,
      },

      img: { title: '图片', value: [], limit: 1, alert: null, err: '图片不能为空!', },
      navImg: { title: '跳转图片', value: [], limit: 1, alert: null, err: '跳转图片不能为空!', },
      sort: { type: 'string', title: '排序', value: '', err: '排序值填写不正确!', alert: null, },
      bannerType: {
        title: '类型',
        list: [
          { id: 1, title: '首页' },
          { id: 2, title: '产品类目' },
          { id: 3, title: '平台简介' },
          { id: 4, title: '新闻资讯' },
        ], 
        value: 1, 
        alert: null, 
      },

      navType: {
        title: '跳转类型',
        list: [
          { id: 1, title: '否' },
          { id: 2, title: '跳转栏目' },
          { id: 3, title: '跳转图片' },
        ],
        value: 1,
        alert: null,
      },

      columnType: {
        title: '跳转栏目',
        list: [
          { id: 1, title: '首页' },
          { id: 2, title: '产品类目' },
          { id: 3, title: '平台简介' },
          { id: 4, title: '新闻资讯' },
        ], 
        value: 1, 
        alert: null, 
      },
      content: { title: '内容', value: '', alert: null, },
      contentFile: { title: '内容', value: [], limit: 1, preventValidate: true, alert: null, },
      doing: false,

      headConfig: {
        btnList: [
          { title: '新增轮播图', },
        ],
      },

      tableConfig: {
        showOperate: true,
        showDelete: true,
        classList: [
          { key: "排序", value: "banner_sort" },
          { key: "主图", value: "banner_image", isImg: true },
          { key: "栏目", value: "typeStr" },
          { key: "调整类型", value: "navTypeStr" }
        ],
        btnList: [
          { key: 'banner_id', title: '编辑', },
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
        return this.updateForm();
      }

    },

    handleTableClick(item, i) {
      this.detail = item;

      if(i == 0) return this.updateForm(item);
    },


    changeNavType(id) {
      if(!this.isNavColumn) this.columnType.value = 1;
      if(!this.isNavImg) this.navImg.value = [];
    },

    async getList() {
      let loading = this.$loading();

      let res = await api.getList(this.query, this);
      loading.close();

      if(res && res.status == 0){
        res.data.forEach(this.format);
        this.list = res.data;
        return this.total = res.pagination.total;
      }

      this.$message.error(res ? res.error || res : '获取轮播图列表失败!');
    },

    format(item) {
      let res = this.bannerType.list.filter(v => v.id == item.banner_programa)[0];
      item.typeStr = res ? res.title : '';

      res = this.navType.list.filter(v => v.id == item.banner_type)[0];
      item.navTypeStr = res ? res.title : '';
    },

    updateForm(item) {
      if(this.list.length >= 5) return this.$message.error('banner图片最多不超过5张!');

      this.dialogConfig.status = item ? this.dialogConfig.EDIT : this.dialogConfig.ADD;

      this.img.value = item ? [{ url:item.banner_image }] : [];
      this.sort.value = item ? item.banner_sort : "";
      this.bannerType.value = item ? Number(item.banner_programa) : 1;
      this.navType.value = item ? item.banner_type : 1;

      if(this.isNavColumn) this.columnType.value = item ? Number(item.banner_url) : '';
      if(this.isNavImg) this.navImg.value = item ? [{ url: item.banner_url, }] : [];
    },

    closeDialog() {
      let config = this.dialogConfig;

      config.status = 0;
    },

    async submit() {
      let paramArr = [],
        query = this.query,
        param, fileList;

      this.img.alert = this.img.value.length ? null : this.img.err;
      if(this.img.alert) return ;

      if(!vd.isPositiveInteger(this.sort.value)) return this.$message.error(this.sort.err);

      if(this.isNavImg){
        this.navImg.alert = this.navImg.value.length ? null : this.navImg.err;
        if(this.navImg.alert) return ;
      }

      let loading = this.$loading(); 
      if(this.doing) return ;
      this.doing = true;

      let imgList = await uploadFn(this.img.value.filter(v => v.raw).map(v => v.raw));
      imgList = imgList.concat(this.img.value.filter(v => !v.raw).map(v => v.url));

      if(this.isNavImg){
        var navImgList = await uploadFn(this.navImg.value.filter(v => v.raw).map(v => v.raw));
        navImgList = imgList.concat(this.navImg.value.filter(v => !v.raw).map(v => v.url));
      }

      param = {
        banner_sort: this.sort.value,
        banner_image: imgList[0],
        banner_programa: this.bannerType.value,
        banner_type: this.navType.value,
        banner_url: this.isNavColumn ? this.columnType.value : this.isNavImg ? navImgList[0] : '',
      };

      this.save(param, loading);
    },

    async save(param, loading) {
      let res = await (this.isAdd ? api.add(param) : api.edit(this.detail.banner_id, param));

      res.status ==0 ? this.$message.success('操作成功') : this.$message.error('操作失败');

      this.getList();
      this.doing = false;
      loading.close();
      this.dialogConfig.status = 0;
    },

    async deleteItem(item) {
      let res = await api.del(item.banner_id);

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

  },

  created() {
    this.getList();
  }
}
</script>