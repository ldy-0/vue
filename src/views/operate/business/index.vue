<style lang="css">
.header{
  margin: 20px 0;
}

.form_title, .form_ctn{
  font-size: 14px;
  line-height: 36px;
}
.form_title{
  box-sizing: border-box;
  display: inline-block;
  width: 150px;
  padding: 0 12px 0 0;
  font-weight: bold;
  text-align: right;
  vertical-align: top;
}
.form_img{
  width: 200px;
  height: 160px;
  margin-right: 20px;
  /* border-radius: 50%; */
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
                @show='updateForm'
                @delete='deleteItem'
                @change='change'></custom-table>


<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
    <el-form label-width='150px'>
      <div>
        <span class='form_title'>营业执照</span>
        <img class='form_img' :src='detail.licenseImg' @click="preview(detail.licenseImg)" />
      </div>

      <div v-for='(item, index) in keys' :key='index'>
        <span class='form_title'>{{formData[item].title}}</span>
        <span class='form_ctn'>{{formData[item].value}}</span>
      </div>

      <div>
        <span class='form_title'>身份证</span>
        <img v-for='(i,index) in detail.idImg' :key='index' class='form_img' :src="i" @click='preview(i)' alt="">
      </div>

      <div>
        <span class='form_title'>生产许可证</span>
        <img class='form_img' :src='detail.cardImg' @click='preview(detail.cardImg)' />
      </div>

      <div v-if="detail.foodImg">
        <span class='form_title'>食品系列相关证件</span>
        <img class='form_img' :src='detail.foodImg' @click='preview(detail.foodImg)' />
      </div>

      <div v-if="detail.healthImg">
        <span class='form_title'>保健食品注册批件</span>
        <img class='form_img' :src='detail.healthImg' @click="preview(detail.healthImg)" />
      </div>

    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" >取消</el-button>
      <!-- <el-button type="danger" :disabled="stopSubmit" :loading="stopSubmit" @click="deleteItem(detail)">删除</el-button> -->
    </span>
</el-dialog>

<el-dialog :title="dialogConfig.title" :visible.sync="showPreview" :before-close='closePreview' width="80%">
  <img :src='previewImg' />
</el-dialog>

</div>
</template>
<script>

import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customImg from '@/components/customImg'
import uploadFn from "@/utils/tencent_cos";
import api from '@/api/business'
import Moment from "@/utils/moment";

export default {
  components: {
    customHead,
    customTable,
    customImg,
  },

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },
    showPreview(){ return Boolean(this.previewImg); },
    keys(){ return this.formData ? Object.keys(this.formData) : []; },
  },

  data() {
    return {
      dialogConfig: {
        title: '',
        status: 0, // 1:添加分类，2：编辑分类， 3：二级分类列表
      },
      formData: {
        company: { title: '昵称', value: '', alert: null, },
        create_time: { title: '申请时间', value: '', alert: null, },
        dockerName: { title: '对接人姓名', value: '', alert: null, },
        dockerMobile: { title: '对接人联系方式', value: '', alert: null, },
      },
      detail: {},
      stopSubmit: false,

      headConfig: {
        // dateWidth: 100,
        // placeHolder: '请输入订单号',
      },

      tableConfig: {
        showOperate: true,
        showDetail: true,
        // showDelete: true,
        classList: [
          { key: '公司名', value: 'company' },
          { key: '营业执照', value: 'licenseImg', isImg: true, },
          { key: '生产许可证', value: 'cardImg', isImg: true, },
          { key: '申请时间', value: 'create_time' },
        ],
      },
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
      },
      isLoading: true,

      previewImg: null,
    }
  },
  methods: {
    preview(img){ this.previewImg = img; },
    closePreview(){ this.previewImg = null; },

    async getList() {
      this.isLoading = true;
      let res = await api.getList(this.query, this);

      if(res && res.data){
        res.data.forEach(this.format);

        this.list = res.data;
      }

      this.total = res.pagination ? res.pagination.total : this.list.length;
      this.isLoading = false;
    },

    format(item) {
      let card = item.apply_info;

      for(let key in card){
        item[key] = card[key];
      }
      // item.geval_addtime = Moment(item.geval_addtime*1000).format("yyyy-MM-dd HH:mm:ss");
    },

    //查看详情============================================
    updateForm(status) {
      let formData = this.formData;

      this.dialogConfig.status = typeof status === "number" ? status : 2;

      this.keys.forEach(v => {
        formData[v].value = status[v];
      });

      this.detail = Object.assign({},status);
    },

    //查询================================================
    search(param) {

      this.query.page = 1;
      this.$refs.mainTable.initPage();

        this.query.search  = param.search;
      if(param.date){
        this.query.starttime = param.date.startDate;
        this.query.endtime = param.date.endDate;
      }else{
        delete this.query.starttime;
        delete this.query.endtime;
      }
      this.getList();
    },
    //操作================================================
    auth(item, state) {
      
    },
    closeDialog() {
      let config = this.dialogConfig;
      config.status = 0;
    },
    async save(param) {
      this.stopSubmit = false;
    },
    async deleteItem(item) {
        let res = await api.deleteAssess(item.geval_id);
        if(res.status == 0) this.$message.success('删除成功');
        if(res.status != 0) this.$message.error('删除失败',res.error);
      this.getList();
    },

    //分页
    change(param) {
      this.query.limit = param.limit;
      this.query.page = param.page;
      this.getList();
    }
  },
  created(){
    this.getList();
  },
}
</script>