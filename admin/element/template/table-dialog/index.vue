<style lang="css" scoped>
</style>

<template>
<div class="notice">

<el-header class="header">
  <custom-head :config='headConfig' @search='search' @emit='handleHeadEmit'></custom-head> 
</el-header>

<custom-table ref='table' :config='tableConfig' :data='list' :total='total' @modify='handleTableEmit' @change='change'></custom-table>

<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
  <div v-if="[1, 2].indexOf(dialogConfig.status) !== -1">
    <el-form label-width='100px'>
      <custom-img :obj='img'></custom-img>

      <custom-input :obj='name'></custom-input>

      <custom-input :obj='num'></custom-input>

      <custom-input :obj='price'></custom-input>

      <custom-select :obj='company'></custom-select>

      <custom-radio :obj="status"></custom-radio>

      <el-form-item :label="content.title">
        <editor style='width: 800px;' v-model='content.value'></editor>
        <el-alert type='error' :title='content.alert' v-if='content.alert'></el-alert>
      </el-form-item>
      
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" >取消</el-button>
      <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
    </span>
  </div>

</el-dialog>


</div>
</template>
<script>
import commonReq from '@/api/common' 
import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customInput from '@/components/customInput'
import customImg from '@/components/customImg'
import customSelect from '@/components/customSelect'
import customRadio from '@/components/customRadio'
import editor from '@/components/Tinymce'

const NAME = '姓名',
      MOBILE = '手机号',
      AREA = '城市';

const STATUSLIST = [
  { title: '全部', value: 0 },
  { title: '未处理', value: 1 },
  { title: '已完成', value: 2 },
  { title: '已拒绝', value: 3 },
];

export default {
  components: {
    customHead,
    customTable,
    customInput,
    customImg,
    customSelect,
    customRadio,
    editor,
  },

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },
  },

  data() {
    return {
      storegc_id:null,
      dialogConfig: {
        title: '',
        status: 0, // 1: 添加，2：编辑
      },

      dialogList: [
        { name: 'name', value: 'name', },
        { name: 'num', value: 'mobile', },
        { name: 'price', value: 'mobile', },
        { name: 'company', value: 'id', },
      ],
      validArr: ['name', 'num', 'price'],

      img: { title: '主图', value: [], limit: 1, alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      name: { type: 'string', title: 'name', value: '', alert: null, },
      num: { type: 'integer', title: 'num', value: '', alert: null, },
      price: { type: 'positive', title: 'price', value: '', alert: null, },

      company: { title: 'company', valueKey: 'value', list: STATUSLIST, value: '', alert: null, },

      status: { title: '是否启用', list: [ { title: '是', value: 1, }, { title: '否', value: 2 } ], value: 1, alert: null, },

      content: { title: '内容', value: '', alert: null, },

      stopSubmit: false,

      headConfig: {
        btnList: [
          { title: 'add' },
        ],
        placeHolder: '名称搜索',
        selectList: [
          { title: '状态', list: STATUSLIST },
        ], 
      },

      tableConfig: {
        loading: false,
        showOperate: true,
        btnList: [
          { key: 'id', value: '编辑', },
          { type: 'danger', key: 'id', value: '删除', },
        ],
        classList: [
          { key: '图片', value: 'image', isImg:true },
          { key: NAME, value: 'name' },
          { key: '状态', value: 'stateStr' },
          { key: '配送区域', value: 'arr', isMulti: true, },
        ],
      },
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
      },

      successTip: '操作成功',
      getListErrorTip: '获取列表失败',

    }
  },

  watch: {
    content: {
      deep: true,
      handler(v1, v2){ this.content.alert = this.content.value ? null : `${this.content.title}不能为空!`; }
    },
  },

  methods: {
    handleHeadEmit(index){
      // add 
      if(index == 0) this.openDialog(1);
    },

    handleTableEmit(item, index){
      // resolve
      if(index == 0) this.openDialog(item);

      // delete 
      if(index == 1) this.deleteItem(item);
    },

    initDialog(item){
      let itemArr = this.dialogList;

      if(typeof item == 'object') this.detail = item;

      itemArr.forEach(v => {
        this[v.name].value = item[v.value] != null ? item[v.value] : '';
        this[v.name].alert = null;
      });

      this.img.value = item.image ? [ { url: item.image } ] : [];
      this.img.alert = null;
    },

    validError(){
      let validArr = this.validArr;
      
      for(let i = 0, len = validArr.length; i < len; i++){
        let key = validArr[i];

        if(!this[key].value){ this[key].alert = `${this[key].title}不能为空!`; }

        if(this[key].alert) return true;
      }

      if(!this.img.value.length) return this.img.alert = '请选择图片作为主图';

      if(!this.company.value && String(this.company.value) !== '0') return this.company.alert = `请选择${this.company.title}`;
    },

    async submit(){
      let status = this.dialogConfig.status,
          imgList = this.img.value,
          param;

      this.mock();

      if(this.validError()) return ;
      
      this.stopSubmit = true;

      // let img = imgList.map(v => { return v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url });
      // if(!img[0]) return console.error('img value :', img);

      param = {
        name: this.name.value,
        id: this.company.value,
        num: this.num.value,
        price: this.price.value,
      };

      console.error(param);
      // this.save(param);
    },

    // 
    async save(param){
      let status = this.dialogConfig.status;
      let res = null;

      res = status == 1 ? await api.addTransport(param) : await api.setTransport(this.detail.transport_id, param);

      if(typeof res == 'string' || !res || res.error){
        this.stopSubmit = false;
        return this.$message.error(`${res ? res.error || res : '保存信息失败'}`);
      }

      if(res.status == 0) this.$message.success('操作成功');

      this.dialogConfig.status = 0;
      this.getList(); 

      this.stopSubmit = false;
    },

    format(v){
      v.stateStr = v.status == 1 ? '开启' : '关闭';
      v.done = v.status != 1;

      let defaultTemp = v;
      v.basicNum = defaultTemp.transportext_snum;
      v.extPrice = defaultTemp.transportext_xprice;
    },

    async getList() {
      return this.mock();
      this.tableConfig.loading = true

      let res = await api.getTransportList(this.query);

      if(typeof res == 'string' || !res || res.error) return this.$message.error(res ? res.error || res : this.getListErrorTip);

      if(res && res.data){
        res.data.forEach(this.format);

        this.list = res.data || [];
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }
      
      this.tableConfig.loading = false
    },

    async changeStatus(item, index){
      let param = { status: index ? 0 : 1 };
      return console.error(param);

      let res = await api.changeTransport(item.transport_id, param);

      res.status == 0 ? this.$message.success(this.successTip) : this.$message.error(res.error);

      this.getList();
    },
    
    async deleteItem(item){
      let res = await api.deleteTransport(item.transport_id);

      res.status == 0 ? this.$message.success(this.successTip) : this.$message.error(res.error);

      this.getList();
    },

    // async getUploadToken(){
    //   let res = await commonReq.getUploadToken();

    //   if(res.error) return this.$message.error(`getUploadToken: ${res.error}`);

    //   this.img.body.token = res.data;
    //   this.img.body.config = "{ useCdnDomain: true }";
    // },

    search(param){
      let statusList = param.statusList;

      this.query.page = 1;
      this.$refs.table.initPage();

      // keyword search
      param.search ? this.query.search = param.search : delete this.query.search;

      if(statusList){
        this.query.status = statusList[0];
      }
      
      console.error(this.query);
      this.getList();
    },

    // immutable
    openDialog(status){
      this.dialogConfig.status = typeof status === 'number' ? status : 2;
      
      this.initDialog(status);
    },
    
    closeDialog(){ 
      this.stopSubmit = false;
      this.dialogConfig.status = 0; 
    },

    change(param){
      this.query.limit = param.limit;
      this.query.page = param.page;

      this.getList();
    },

    mock(){
      let img = 'https://cdn.health.healthplatform.xyz/Fj2MUuTZ5UvAG0LqSFBcI__J1U2D';

      let list = [
        { id: 1, name: '1111', mobile: '12345', area: 'SK地方豆腐干开的饭馆', status: 1, image: img, arr: ['1', '2'], },
        { id: 2, name: '1111', mobile: '12345', area: 'SK地方豆腐干开的饭馆', status: 0, image: img, arr: ['1', '2'], },
      ];

      list.forEach(this.format);
      this.list = list;
      this.total = list.length;

      this.name.value = 'ttt';
      this.num.value = 1;
      this.price.value = 3;
      // this.company.value = 1;
    }

  },

  created(){
    this.getList();
  },
}
</script>