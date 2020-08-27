<style lang="css" scoped>
.area_wrap{
  position: relative;
  margin-left: 100px;
  padding: 20px 0 0;
  border: 1px solid #ccc;
}

.close_wrap{
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1;
  width: 20px;
  height: 20px;
}

.rule_wrap{
  white-space: pre-wrap;
}

.s_bg_10{ background: #337ab7; }
</style>

<template>
<div class="notice">

<el-header class="header">
  <custom-head :config='headConfig' @search='search' @emit='handleHeadEmit'></custom-head> 
</el-header>

<custom-table ref='table' :config='tableConfig' 
                :data='list' 
                :total='total' 
                :spanMethod="merge"
                @modify='handleTableEmit'
                @change='change'></custom-table>


<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
  <div v-if="[1, 2].indexOf(dialogConfig.status) !== -1">
    <el-form label-width='100px'>
      <!-- <custom-img :obj='img'></custom-img> -->

      <custom-input :obj='name'></custom-input>

      <custom-select :obj='company'></custom-select>

      <custom-input :obj='basicNum'></custom-input>
      <custom-input :obj='extNum'></custom-input>
      <custom-input :obj='basicPrice'></custom-input>
      <custom-input :obj='extPrice'></custom-input>

      <!-- area -->
      <!-- <el-form-item class='' label="配送区域">
        <el-button type='primary' @click='addArea'>添加</el-button>
      </el-form-item> -->

      <!-- status -->
      <!-- <custom-radio :obj="status"></custom-radio> -->

      <!-- <el-form-item :label="content.title">
        <editor style='width: 800px;' v-model='content.value'></editor>
        <el-alert type='error' :title='content.alert' v-if='content.alert'></el-alert>
      </el-form-item> -->
      
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" >取消</el-button>
      <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
    </span>
  </div>

  <div v-if="dialogConfig.status === 3">
    <div class='rule_wrap' v-for="(item, index) in ruleList" :key='index'>{{item}}</div> 
  </div>

  <div v-if="dialogConfig.status == 4">
    <!-- <div class='' v-for="(item, index) in area" :key="index"> -->
      <!-- <i class='close_wrap el-icon-close' @click='deleteArea(index, item)'></i> -->
      <el-form label-width='100px'>
        <custom-select :obj='area.province' @change="updateProvince" @show="initProvinceList"></custom-select>
        
        <custom-radio :obj='area.city' @change="updateCity"></custom-radio>

        <custom-input :obj='area.basicNum'></custom-input>
        <custom-input :obj='area.extNum'></custom-input>
        <custom-input :obj='area.basicPrice'></custom-input>
        <custom-input :obj='area.extPrice'></custom-input>
      </el-form>
    <!-- </div> -->

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" >取消</el-button>
      <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submitArea">确 定</el-button>
    </span>
  </div>

</el-dialog>


</div>
</template>
<script>

import api from '@/api/transport' 
import commonReq from '@/api/common' 
import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customInput from '@/components/customInput'
import customImg from '@/components/customImg'
import customSelect from '@/components/customSelect'
import customRadio from '@/components/customRadio'
import editor from '@/components/Tinymce'
import freight from './freight.js';
import transportextend from './transportextend.js';
import logistic from './logistic.js';

const BASICNUM = '起件数量(件)',
      EXTNUM = '续件数量(件)',
      BASICPRICE = '起件费用(元)',
      EXTPRICE = '续件费用(元)',
      COMPANY = '快递公司';

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

  mixins: [freight, transportextend, logistic],

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },
    unCheckProvinceArr(){ console.error(this.provinceArr); return this.provinceArr.filter(v => !v.list.every(v1 => v1.checked)); },
  },

  data() {
    return {
      storegc_id:null,
      dialogConfig: {
        title: '',
        status: 0, // 1: 添加，2：编辑 3：不懂点我 4: 添加区域
      },

      dialogList: [
        { name: 'name', value: 'transport_title', },
        { name: 'basicNum', value: 'basicNum', },
        { name: 'extNum', value: 'extNum', },
        { name: 'basicPrice', value: 'basicPrice', },
        { name: 'extPrice', value: 'extPrice', },
        { name: 'company', value: 'send_tpl_id', },
      ],

      name: { type: 'string', title: '模板标题', value: '', alert: null, },

      basicNum: { type: 'integer', title: BASICNUM, value: '', alert: null, },
      extNum: { type: 'integer', title: EXTNUM, value: '', alert: null, },
      basicPrice: { type: 'positive', title: BASICPRICE, value: '', alert: null, },
      extPrice: { type: 'positive', title: EXTPRICE, value: '', alert: null, },

      company: { title: COMPANY, valueKey: 'value', list: [], value: '', alert: null, },
      status: { title: '是否启用', list: [ { title: '是', value: 1, }, { title: '否', value: 2 } ], value: 1, alert: null, },

      areaList: [],
      area: null,
      provinceArr: [],

      content: { title: '内容', value: '', alert: null, },
      img: { title: '主图', value: [], limit: 1, alert: null, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
      stopSubmit: false,

      headConfig: {
        btnList: [
          { title: '添加模板', },
          { title: '不懂点我', },
        ],
        // placeHolder: '名称搜索',
      },

      tableConfig: {
        loading: false,
        showOperate: true,
        btnList: [
          { key: 'transport_id', value: '编辑', },
          { key: 'transport_id', value: '添加区域', },
          { key: 'isClose', value: '开启', },
          { key: 'status', value: '关闭', },
          { type: 'danger', key: 'transport_id', value: '删除', },
          { key: 'id', value: '编辑', },
          { type: 'danger', key: 'id', value: '删除', },
        ],
        classList: [
          { key: 'ID', value: 'transport_id' },
          { key: '标题', value: 'transport_title' },
          { key: COMPANY, value: 'companyName' },
          { isMulti: true, key: '配送区域', value: 'transportext_area', },
          { key: BASICNUM, value: 'basicNum' },
          { key: EXTNUM, value: 'extNum' },
          { key: BASICPRICE, value: 'basicPrice' },
          { key: EXTPRICE, value: 'extPrice' },
          { key: '状态', value: 'stateStr' },
          // { key: '图片', value: 'image', isImg:true },
        ],
      },
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
      },

      successTip: '操作成功',
      getListErrorTip: '获取运费模板列表失败',

      ruleList: [
        '运费按件计算规则：',
        '一、相同的商品，模板设置的规则计算：',
        '       如：运费规则1 首1件，运费10元，每续1件，续费5元；',
        '       配送区域至江苏，首1件，运费15元，每续1件，续费10元；',
        '      1、买家下单购买A商品三件,商品运费模板为规则1，那么买家选择配送至北京>>北京市>>东城区，则收取运费：10+5*2=20元；',
        '      2、买家下单购买A商品三件,商品运费模板为规则1，那么买家选择配送至江苏>>常州市>>新北区，则收取运费：15+10*2=35元；',
        '二、不相同的商品，模板设置的规则计算：',
        '       如：运费规则1 首1件，运费10元，每续1件，续费5元',
        '       配送区域至江苏，首1件，运费15元，每续1件，续费10元；',
        '       运费规则2 首1件，运费12元，每续1件，续费8元；',
        '       配送区域至江苏，首1件，运费16元，每续1件，续费12元；',
        '      1、买家下单购买A,B,C商品各两件,商品运费模板为规则1，那么买家选择配送至北京>>北京市>>东城区，则收取运费：(10+5*5)=35元；',
        '      2、买家下单购买A,B,C商品各两件,商品运费模板为规则1，那么买家选择配送至江苏>>常州市>>新北区，则收取运费：(15+10*5)=65元；',
        '      3、买家下单购买A,B,C商品各两件,商品A运费模板为规则1,商品B,C运费模板为规则2，那么买家选择配送至北京>>北京市>>东城区，则收取运费：(10+5*1)+(12+8*3)=51元；',
        '      4、买家下单购买A,B,C商品各两件,商品A运费模板为规则1,商品B,C运费模板为规则2，那么买家选择配送至江苏>>常州市>>新北区，则收取运费：(15+10*1)+(16+12*3)=77元；',
      ]
    }
  },

  watch: {
    content: {
      deep: true,
      handler(v1, v2){ this.content.alert = this.content.value ? null : `${this.content.title}不能为空!`; }
    },
  },

  methods: {
    merge(row, column, ri, ci){
      console.error(row, column, ri, ci);
    },
    handleHeadEmit(index){
      // add template
      if(index == 0) this.openDialog(1);

      // rule
      if(index == 1) this.openDialog(3);
    },

    handleTableEmit(item, index){
      // add template
      if(index == 0) this.openDialog(item);

      // add/edit area
      if(index == 1 || index == 5) this.setArea(item, 4, index);

      // change status
      if(index == 2 || index == 3) this.changeTransport(item);

      // delete template
      if(index == 4) this.deleteItem(item);

      // delete area
      if(index == 6) this.deleteArea(item);
    },

    showDetail(item, index){
      this.dialogConfig.status = index;

      this.detail = item;
    },

    setArea(item, index, type){
      this.dialogConfig.status = index;

      this.detail = item;

      this.area = item.area = this.initArea(item);

      this.initAreaData(type == 1 ? item.transport_id : item.id);
    },

    initAreaData(id){
      let list = this.list.filter(v => v.transport_id == id || v.id == id),
          cityIdArr = list.reduce((sum, v) => sum.concat(v.transportext_area_id), []);
      
      // reset city state / 重置城市状态
      this.provinceArr.forEach(province => province.list.forEach(v => v.checked = cityIdArr.some(id => id == v.id)));
    },

    initArea(item){
      let globalProvinceArr = this.provinceArr,
          cityIdArr = item.transportext_area_id,
          provinceIdArr = item.transportext_top_area_id,
          provinceArr = provinceIdArr.map(id => globalProvinceArr.find(v => v.id == id)),
          cityArr = provinceArr.reduce((sum, v) => sum.concat(v.list.filter(city => !city.checked || cityIdArr.some(id => city.id == id))), []);

      if(item && item.id){
        var [basicNum, extNum, basicPrice, extPrice] = [item.transportext_snum, item.transportext_xnum, item.transportext_sprice, item.transportext_xprice];
      }

      return {
        province: { type: 'multi', title: '配送省份', list: provinceArr, value: provinceIdArr, alert: null, },
        provinceCache: provinceIdArr.slice(),

        city: { type: 'multi', title: '配送城市', list: cityArr, value: cityIdArr, alert: null, },
        cityCache: cityIdArr.slice(),

        basicNum: { type: 'integer', title: BASICNUM, value: basicNum, alert: null, },
        extNum: { type: 'integer', title: EXTNUM, value: extNum, alert: null, },
        basicPrice: { type: 'positive', title: BASICPRICE, value: basicPrice, alert: null, },
        extPrice: { type: 'positive', title: EXTPRICE, value: extPrice, alert: null, },
      }
    },

    initDialog(item){
      let itemArr = this.dialogList;

      if(typeof item == 'object') this.detail = item;

      itemArr.forEach(v => {
        this[v.name].value = item[v.value] != null ? item[v.value] : '';
        this[v.name].alert = null;
      });

      // this.img.value = item.image ? [ { url: item.image } ] : [];
      // this.img.alert = null;
    },

    validate(){
      let validArr = ['name', 'basicNum', 'extNum', 'basicPrice', 'extPrice'];
      
      for(let i = 0, len = validArr.length; i < len; i++){
        let key = validArr[i];

        if(this[key].alert) return true;

        if(!this[key].value){
          return this[key].alert = `${this[key].title}不能为空!`;
        }
      }

      // if(!this.img.value.length) return this.img.alert = '请选择图片作为主图';

      if(this.company.value == null) return this.company.alert = `请选择${this.company.title}`;
    },

    async submit(){
      let status = this.dialogConfig.status,
          imgList = this.img.value,
          param;

      // this.mock();

      if(this.validate()) return ;
      
      this.stopSubmit = true;

      // let img = imgList.map(v => { return v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url });
      // if(!img[0]) return console.error('img value :', img);

      param = {
        title: this.name.value,
        send_tpl_id: this.company.value,
        start: this.basicNum.value,
        plus: this.extNum.value,
        postage: this.basicPrice.value,
        postageplus: this.extPrice.value,
      };

      this.save(param);
    },

    // 
    async save(param){
      let status = this.dialogConfig.status;
      let res = null;

      res = status == 1 ? await api.addTransport(param) : await api.setTransport(this.detail.transport_id, param);

      if(typeof res == 'string' || !res || res.error){
        this.stopSubmit = false;
        return this.$message.error(`${res ? res.error || res : '保存运费模板信息失败'}`);
      }

      if(res.status == 0) this.$message.success('操作成功');

      this.dialogConfig.status = 0;
      this.getList(); 

      this.stopSubmit = false;
    },

    format(v){
      let company = this.logisticList[v.send_tpl_id];

      // city Id List / 城市列表
      v.transportext_area_id = v.transportext_area_id ? v.transportext_area_id.replace(/^,|,$/g, '').split(',').map(v => Number(v)) : [];
      // province Id List / 省份列表
      v.transportext_top_area_id = v.transportext_top_area_id ? v.transportext_top_area_id.replace(/^,|,$/g, '').split(',').map(v => Number(v)) : [];

      // default template / 默认配送区域
      if('status' in v){
        v.stateStr = v.status == 1 ? '开启' : '关闭';
        v.isClose = v.status != 1;

        v.transportext_area = [];
      }else{
        v.id = v.transport_id;
        delete v.transport_id;

        let cityIdArr = v.transportext_area_id,
            provinceIdArr = v.transportext_top_area_id,
            provinceArr = this.provinceArr,
            selfProvinceArr = provinceIdArr.map(id => provinceArr.find(v => v.id == id));

        v.transportext_area = selfProvinceArr.reduce((sum, p) => sum.concat(p.list.filter(c => cityIdArr.some(id => c.id == id)).map(c => `${p.title}/${c.title}`)), []);
      }

      v.companyName = company ? company.name : '';

      let defaultTemp = v; // .extend.filter(v => v.transportext_is_default)[0];
      v.basicNum = defaultTemp.transportext_snum;
      v.basicPrice = defaultTemp.transportext_sprice;
      v.extNum = defaultTemp.transportext_xnum;
      v.extPrice = defaultTemp.transportext_xprice;
    },

    extend(base, v){
      let extendArr = ['transport_title', 'send_tpl_id', 'status'];

      extendArr.forEach(prop => v[prop] = base[prop]);

      return v;
    },

    async getList() {
      this.tableConfig.loading = true

      let res = await api.getTransportList(this.query);

      if(typeof res == 'string' || !res || res.error) return this.$message.error(res ? res.error || res : this.getListErrorTip);

      if(res && res.data){
        res.data = res.data.reduce((pre, val) => pre.concat(val.extend.map((v, i) => i == 0 ? this.extend(val, v) : v)), []);

        res.data.forEach(this.format);

        this.list = res.data || [];
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }
      
      this.tableConfig.loading = false
    },

    async changeTransport(item){
      let param = { status: item.status ? 0 : 1 };

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

    // immutable
    openDialog(status){
      this.dialogConfig.status = typeof status === 'number' ? status : 2;
      
      this.initDialog(status);
    },
    
    closeDialog(){ this.dialogConfig.status = 0; },

    search(param){
      this.query.page = 1;
      this.$refs.table.initPage();

      // keyword search
      param.search ? this.query.search = param.search : delete this.query.search;

      if(param.statusList) console.error('param', param);
      
      this.getList();
    },

    change(param){
      this.query.limit = param.limit;
      this.query.page = param.page;

      this.getList();
    },

    async getArea(){
      let loading = this.$loading();

      let res = await commonReq.getArea();

      if(res && res.data){
        this.provinceArr = res.data[0].map(v => { 
          return { 
                    id: v[0], 
                    title: v[1], 
                    checked: false, 
                    list: res.data[v[0]].map(v1 => ({ id: v1[0], parent: v[0], title: v1[1], checked: false, })), 
                  };
        });

        this.getList();
      }

      if(typeof res == 'string' || !res || res.error) this.$message.error(res ? res.error || res : '获取行政区接口报错');

      loading.close();
    },

    mock(){
      this.name.value = 'ttt';
      this.company.value = 123;
      this.basicNum.value = 1;
      this.extNum.value = 2;
      this.basicPrice.value = 3;
      this.extPrice.value = 4;
    }

  },

  created(){
    this.getArea();
  },
}
</script>