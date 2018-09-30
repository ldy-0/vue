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
  
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .detail{
    margin: 20px 0 0;
    padding: 0 20px 20px 20px;
    border: 1px solid #d9d9d9;
  }
  .detailImg {
    width: 148px;
    height: 148px;
    display: block;
  }
  .close{
    position: relative;
    left: calc(100% - 30px);
  }

  .sku_form{
    position relative;
    padding: 20px 0 0 20px;
    border: 1px solid #d9d9d9;
  }
  .sku_form .sku_item{
    margin: 0 0 20px;
  }
  .sku_close{
    position absolute;
    top: 10px;
    left: calc(100% - 30px);
  }
</style>

<template>
<div>
<el-dialog :title="isAddItem ? `新增${className}` : `编辑${className}` " :visible.sync="isShow" width="30%">

  <el-form :model="formData"  ref="ruleForm" :rules="rules" >

    <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
      <el-input v-model="formData.name" auto-complete="off"></el-input>
    </el-form-item>
    
    <el-form-item label="图片" :label-width="formLabelWidth">
      <el-upload
        class="avatar-uploader"
        action="" 
        :limit='4'
        list-type="picture-card" 
        :auto-upload="false" 
        :file-list='formData.imgs' 
        :on-exceed='exceed'
        :on-success="handleAvatarSuccess"
        :on-change='addImage'> <!--:show-file-list="false" -->
        <!-- <img v-if="case_img" :src="formData.case_img" class="avatar"> -->
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>

    <!-- 设计师 -->
    <el-form-item label="设计公司" :label-width="formLabelWidth" prop="company" v-if='isDesign'>
      <el-input v-model="formData.company" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="价格" :label-width="formLabelWidth" prop="price">
      <el-input v-model.number="formData.price" auto-complete="off"></el-input>
    </el-form-item>

    <!-- 易居管家 -->
    <el-form-item label='单位' :label-width='formLabelWidth' v-if='showUnit'>
      <el-radio-group v-model="formData.unit">
        <el-radio-button v-for="(item, index) in units" :label="item" :key="index">{{item}}</el-radio-button>
      </el-radio-group>  
    </el-form-item>

    <el-form-item label="分类" :label-width="formLabelWidth" prop='category'> 
      <el-select v-model="formData.category" placeholder="请选择" @change='getClass'> <!--multiple  -->
        <el-option v-for="item in categories" :key="item.storegc_id" :label="item.storegc_name" :value="item.storegc_id"></el-option>
      </el-select>
    </el-form-item>

    <!-- 整居定制, 主材选购', '家具选购', '易居海外-->
    <el-form-item label="三级分类" :label-width="formLabelWidth" prop='twoCategory' v-if='showTwoClass'> 
      <el-select v-model="formData.twoCategory" placeholder="请选择" @change='getTwoClass'> <!--multiple  -->
        <el-option v-for="item in twoCategories" :key="item.storegc_id" :label="item.storegc_name" :value="item.storegc_id"></el-option>
      </el-select>
    </el-form-item>

    <!-- 整居定制 -->
    <el-form-item label='库存' :label-width='formLabelWidth' prop='amount' v-if='showAmount'>
      <el-input v-model.number="formData.amount" auto-complete="off"></el-input>
    </el-form-item>
    
    <!-- 整居定制,集成暖通  -->
    <el-form-item label='运费' :label-width='formLabelWidth' prop='freight' v-if='showFreight'>
      <el-input v-model.number="formData.freight" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label='规格' :label-width='formLabelWidth' v-if='showSku'>
      <el-radio-group v-model="skuType">
        <el-radio label="统一规格">统一规格</el-radio>
        <el-radio label="多规格">多规格</el-radio>
      </el-radio-group> 
      <!-- 统一规格 -->
      <el-form-item style='margin-bottom: 20px;' label="价格" prop="price" v-if="skuType === '统一规格'">
        <el-input v-model.number="formData.price" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item style='margin-bottom: 20px;' label="库存"  prop="amount" v-if="skuType === '统一规格'">
        <el-input v-model.number="formData.amount" auto-complete="off"></el-input>
      </el-form-item>
      <!-- 多规格 -->
      <el-button type='primary' size='mini' @click="addSku" v-if="skuType === '多规格'">添加规格</el-button>

      <el-form class='sku_form' :inline='true' :model="item" ref="ruleFormChild2" :rules="skuRules" v-for='(item, index) in formData.skuList' :key='index' v-if="skuType === '多规格'">

        <i class='sku_close el-icon-close' @click='deleteSku(index)'></i>
        <el-form-item class='sku_item' label="名称" prop="sp_value" >
          <el-input v-model="item.sp_value" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item class='sku_item' label="价格" prop="price">
          <el-input v-model.number="item.price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class='sku_item' label="库存"  prop="stock">
          <el-input v-model.number="item.stock" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
        
    </el-form-item>

    <el-form-item label='详情' :label-width="formLabelWidth">
      <el-button type='primary' @click='addDetail'>添加段落详情</el-button>

      <el-form class='detail' v-for='(item, index) in formData.detailList' :key='index'>
        <i class='close el-icon-close' @click='deleteDetail(index)'></i>
        <el-form-item label="图片" :label-width="detailLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="" 
            :show-file-list="false"
            :auto-upload="false" 
            :on-success="handleAvatarSuccess"
            :on-change='addDetailImage'>
            <img :src="item.img" class="detailImg" v-if='item.img'>
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容" :label-width="detailLabelWidth">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" placeholder="请输入内容" v-model="item.content"></el-input> 
        </el-form-item>
      </el-form>

    </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="isShow=false" >取消</el-button>
    <el-button v-if="isAddItem" type="primary" @click="submitForm('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确 定</el-button>
    <el-button v-else type="primary" @click="submitForm('ruleForm')"
    :disabled="waitAddNotice" 
    :loading="waitAddNotice">确认修改</el-button>
  </span>
</el-dialog>

<el-container class="notice">

<el-header class="header">
  <el-form :inline="true" :model="formInline" class="form">
    <el-form-item>
      <el-button type="primary" icon="el-icon-edit-outline" @click="showModal">添加{{className}}</el-button>
    </el-form-item>

    <el-form-item v-if='showSearch'>
      <el-input style="width: 340px;" placeholder="请输入联系方式" v-model="searchKeyWord"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchByPhone">查询</el-button>
    </el-form-item>

  </el-form>       
</el-header>

<el-main>
    <el-table :data="tableData" stripe v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%" >

      <el-table-column :label="item.key" :prop="item.value" v-for='(item, index) in classList' :key='index'></el-table-column>

      <!-- <el-table-column label="订单">
        <template slot-scope="scope">
          <i v-if="scope.row.super||(scope.row.checkboxGroup1&&scope.row.checkboxGroup1.indexOf('order')!==-1)" class="el-icon-check big-icon"></i>
          <i v-else class="el-icon-close big-icon-no"></i>
        </template>
      </el-table-column>
      <el-table-column 
        label="超级管理员" 
        prop="super">
        <template slot-scope="scope">
          <el-tag size="medium" :type="scope.row.super?'':'info'">{{ scope.row.super?'是':'否'}}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showModal(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="changeState(scope.$index, scope.row)">{{scope.row.goods_state ? '下架' : '上架'}}</el-button>
          <el-button size="mini" type="danger" @click="showDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
</el-main>
<el-footer>
  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,2,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
  </el-pagination>
</el-footer>
</el-container>


</div>
</template>
<script>

import api from '@/api/api' 
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import upLoadFile from '@/utils/aahbs.js'

export default {
  components: {
    UploadExcelComponent
  },

  created(){
    this.category = this.$route.query.category;
    console.log(this.category)
    let goodsList = [ '易居管家', '整居定制', '集成暖通', '主材选购', '家具选购', '易居海外' ];
    let index = goodsList.indexOf(this.category);
    
    this.className = index !== -1 ? '商品' : this.category;
    this.categoryId = index + 2;
    this.classList = this.config[this.category];

    if(this.category === '易居管家'){
      this.showSearch = false;
      this.showUnit = true;
    }else if(this.category === '整居定制'){
      this.showSearch = false;
      this.showTwoClass = true;
      this.showAmount = true;
      this.rules.amount = [
        { required: true, message: '请输入库存量' },
        { type:'number', message: '值必须为数字' },
      ];
      this.showFreight = true;
      this.rules.freight = [
        { required: true, message: '请输入运费' },
        { type:'number', message: '值必须为数字' },
      ]
    }else if(this.category === '集成暖通'){
      this.showSearch = false;
      this.showFreight = true;
      this.rules.freight = [
        { required: true, message: '请输入运费' },
        { type:'number', message: '值必须为数字' },
      ]
    }else if(this.category === '主材选购' || this.category === '家具选购' || this.category === '易居海外'){
      this.showSearch = false;
      this.showTwoClass = true;
      this.showAmount = true;
      this.rules.amount = [
        { required: true, message: '请输入库存量' },
        { type:'number', message: '值必须为数字' },
      ];
      this.showFreight = true;
      this.rules.freight = [
        { required: true, message: '请输入运费' },
        { type:'number', message: '值必须为数字' },
      ]
      this.showSku = true;
      
    }

    // this.listQuery.storegc_id = this.categoryId;
    this.listQuery.gc_id_1 = this.categoryId;
    this.initFormData();

    this.getList();

    this.getClass();
  },

  data() {
    return {
      category: '',
      categoryId: 1,
      config: {
        '设计师+': [
          { key: '姓名', value: 'name' },
          { key: '所属设计公司', value: 'company' },
          { key: '定金', value: 'price' },
          { key: '评分', value: 'level' },
        ],
        '易居管家': [
          { key: '名字', value: 'name' },
          { key: '价格', value: 'company' },
        ],
        '整居定制': [
          { key: '名字', value: 'goods_name' },
          { key: '价格', value: 'goods_price' },
          { key: '库存', value: 'goods_storage' },
        ],
        '集成暖通': [
          { key: '名字', value: 'name' },
          { key: '价格', value: 'company' },
        ],
        '主材选购': [
          { key: '名字', value: 'goods_name' },
          { key: '价格', value: 'goods_price' },
          { key: '库存', value: 'goods_storage' },
        ],
        '家具选购': [
          { key: '名字', value: 'goods_name' },
          { key: '价格', value: 'goods_price' },
          { key: '库存', value: 'goods_storage' },
        ],
        '易居海外': [
          { key: '名字', value: 'goods_name' },
          { key: '价格', value: 'goods_price' },
          { key: '库存', value: 'goods_storage' },
        ],
      },
      className: '',
      classList: [],
      showSearch: true,
      waitAddNotice:false,
      isAddItem:true,
      isShow: false,
        rules: {
          name: [
              { required: true, message: '请输入昵称', trigger: 'blur', min: 1, },
              { required: true, message: '不能超过15个字符!', trigger: 'blur', max: 15 }
          ],
          company: [
              { required: true, message: '请输入公司名', trigger: 'blur', min: 1, },
          ],
          price: [
            { required: true, message: '请输入价格' },
            { type:'number', message: '值必须为数字' },
          ],
          category: [
            { required: true, message: '请选择分类', trigger: 'change' }
          ],
          // phone: [
          //     { required: true, message: '请输入手机号', },
          //     { required: true, message: '手机号必须是11位', trigger: 'blur', min: 11, max: 11 },
          // ],
      },
      skuRules: {
        sp_value: [
            { required: true, message: '请输入昵称', trigger: 'blur', min: 1, },
            { required: true, message: '不能超过15个字符!', trigger: 'blur', max: 15 }
        ],
        price: [
            { required: true, message: '请输入价格' },
            { type:'number', message: '值必须为数字' },
        ],
        stock: [
            { required: true, message: '请输入库存' },
            { type:'number', message: '值必须为数字' },
        ],  
      },
      formLabelWidth:'80px',
      formData: {
        name: '',
        company:'',
        detailList: [],
      },
      tableData: [],
      searchKeyWord: '',
      imgs: [],
      isDesign: false,
      showUnit: false,
      showTwoClass: false,
      showAmount: false,
      showFreight: false,
      showSku: false,
      units: [ '200/1day', '200/1kg'],
      categories: [],
      twoCategories: [],
      skuType: '统一规格',
      detailLabelWidth: '40px',
      canAddDetail: true,
      formInline: {},
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        storegc_id: null,
      },
      total: 0,
    }
  },
  methods: {
    async getClass(id){
      console.log(id)
      let res = await api.getClassList({ parent_id: id || this.categoryId }, this);
      id ? this.twoCategories = res.data || [] : this.categories = res.data || [];

      if(id){
        this.categories.forEach(v => v.storegc_id === id ? this.formData.categoryName = v.storegc_name : void(0) );
      } 
    },
    getTwoClass(id){ this.categories.forEach(v => v.storegc_id === id ? this.formData.categoryName = v.storegc_name : void(0) ) },
    searchByPhone(){
      console.log('search ----', this.searchKeyWord);
    },
    async showModal(index, row){ //
      this.initFormData();

      if(row){
        this.isAddItem = false
        let res = await api.getGoods(row.goods_commonid, null, this);
        this.initFormData(res);
        console.log(res, this.formData.imgs)
      }

      this.isShow = true
    },
    async changeState(index, row){
      let param = {
        type: !row.goods_state ? 'offline' : 'online', 
        goods_commonid: row.goods_commonid,
      };

      console.log(param)
      let res = await api.setGoodsStatus(param, this);

      this.getList();
    },
    handleAvatarSuccess(res, file){
      alert(res, file);
    },
    exceed(){ this.$message({ type: 'error', message: '图片不能超过4张!' }) },
    addImage(e, list) {
      
      console.log('upload before', e, list)
      this.imgs = list;
      // upLoadFile(e.raw).then(v => {
      //   // this.formData.case_img = v[0]
      //   // this.case_img = true
      //   // console.log(this.formData.imgs)
      //   this.imgs.push(v[0])
      //   console.log(this.imgs)
      // }).catch(e=>{ console.error(e) })

    },
    addSku(){
      this.formData.skuList.push({ sp_value: null, price: null, marketprice: null, stock: null });
      console.log(this.formData.skuList)
    },
    deleteSku(index){
      index === 0 ? this.$notify.info({ content: 'a' }) : this.formData.skuList.splice(index, 1)
    },
    addDetail(){
      if(!this.canAddDetail)return this.$message({ message: '' });
      this.canAddDetail = false;
      this.formData.detailList.push({ img: '', content: '' })
    },
    addDetailImage(e, l) {
      console.log('upload before', e, l)
      let load = this.$loading();

      upLoadFile(e.raw).then(v => {
        this.formData.detailList[this.formData.detailList.length - 1].img = v[0]
        this.canAddDetail = true;
        load.close();
        console.log('detail img upload success ->', this.formData.detailList)
      }).catch(e=>{ load.close(); this.$message.error({ message: e }) })

    },
    deleteDetail(index){
      console.log(index);
      if(index === this.formData.detailList.length-1)this.canAddDetail = true;
      this.formData.detailList.splice(index, 1)
    },
    async submitForm(formName){
      
      let res = await this.$refs[formName].validate().catch(e => e);
      if(!res) return ;
 
      // 有三级分类必须选择三级分类(主材选购除外)
      if(this.showTwoClass && this.category !== '主材选购' && !this.formData.twoCategory) return this.$message.error({ message: '请选择三级分类' });
      // 多规格
      if(this.showSku && this.skuType === '多规格' && this.formData.skuList.length < 2) return this.$message.error({ message: '多规格至少需要设置两类' });

      this.waitAddNotice = true

      upLoadFile(this.imgs.map(v => v.raw)).then(v => {

        if(this.imgs.length > 0) this.formData.imgs = this.formData.imgs.map(v => v.url);
        console.log('upload done', this.imgs, this.formData.imgs)

        this.submit();
      }).catch(e=>{ console.error(e) })
      
    },
    async submit(){
      this.formData.skuList.forEach(v => v.marketprice = v.price)
      let o = this.formData,
          param = {
            goods_name: o.name,
            goods_image: o.imgs, 
            goods_marketprice: o.price,
            goods_costprice: '',
            goods_price: o.price,
            goods_discount: 1,
            storegc_id: 0,
            gc_id: this.category === '主材选购' ? o.twoCategory || o.category : (this.showTwoClass ? o.twoCategory : o.category),
            gc_name: o.categoryName, 
            gc_id_1: this.categoryId,
            gc_id_2: o.category,
            gc_id_3: o.twoCategory,
            goods_storage: o.amount,
            spec_name: o.skuList.map((v, i) => i), 
            spec_value: o.skuList.map(v => v.sp_value), 
            spec: o.skuList,
            goods_freight: o.freight,
            goods_body: o.detailList,
            is_virtual: 0,
            goods_advword: '',
            goods_serial: '',
          };

      if(!this.isAddItem){
        param.goods_faker_salenum = 0;
        param.is_appoint = 0;
        param.goods_stcids = '';
      }
      console.log('param', this.isAddItem, param, this.formData);
      let data = this.isAddItem ? await api.setGoods(param, this) : await api.updateGoods(this.formData.id, param, this);
      
      this.waitAddNotice = false;
      this.isAddItem = true;
      this.isShow = false;
      this.initFormData();

      this.getList();
    },      
      importDone({ results, header }) { // upload xls success
        this.tableData = results
        this.tableHeader = header
        console.log('-- import success', this.tableData, this.tableHeader)
      },
      beforeUpload(file) { // before upload xls
        const isLt2M = file.size / 1024 / 1024 < 1

        if (isLt2M) {
          return true
        }
        this.$message({
          message: 'Please do not upload files larger than 2m in size.',
          type: 'warning'
        })
        return false
      },
      //
      async getList() { //获取列表
        this.listLoading = true
        
        let res = await api.getGoodsList(this.listQuery, this);
        
        this.tableData = res.data;
        this.total = res.pagination.total;
        this.listLoading = false
      },
      showDelete(index, row){
        let id = row.goods_commonid;

        this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteItem(id)
        }).catch(()=>{ this.$notify.info({ title: '消息', message: '已取消' }); })
      },
      async deleteItem(id){
        let res = await api.deleteGoods({ goods_commonid: id }, this);

        this.getList();
      },
    // searchByDate(){
    //   if(!this.dataRange||!this.dataRange.length||this.dataRange.length!==2){
    //     return console.log("日期错误")
    //   }
    //   let dateS = this.dataRange[0]
    //   let dateE = this.dataRange[1]
    //   let Sstr = dateS.getFullYear()+'-'+(dateS.getMonth()+1>9?(dateS.getMonth()+1):('0'+dateS.getMonth()))+'-'+(dateS.getDate()+1>9?(dateS.getDate()+1):('0'+dateS.getDate()))
    //   let Estr = dateE.getFullYear()+'-'+(dateE.getMonth()+1>9?(dateE.getMonth()+1):('0'+dateE.getMonth()))+'-'+(dateE.getDate()+1>9?(dateE.getDate()+1):('0'+dateE.getDate()))
    //   this.listQuery.time = Sstr+','+Estr
    //   this.listQuery.page = 1
    //   this.getList()
    // },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    initFormData(item){
      item = item || {};

      this.formData = {
        id: item.goods_commonid || null, 
        name: item.goods_name || '',
        imgs: item.goodsimagesList && item.goodsimagesList.map(v => { return { url: v.goodsimage_url } }) || [],
        company: item.goods_company || '',
        price: Number(item.goods_price) || null,
        unit: item.unit || '',
        category: item.gc_id_2 || null,
        twoCategory: item.gc_id_3 || null,
        categoryName: item.gc_name || '',
        amount: item.SKUList && Number(item.SKUList[0].goods_storage) || '',
        freight: Number(item.goods_freight) || null,
        skuList: item.SKUList && item.SKUList.map(v => { return { sp_value: v.goods_spec, stock: v.goods_storage, price: v.goods_price  } }) || [],
        detailList: item.goods_body || [],
        // spec_name: [],
        // spec_value: [],
      }
      
      this.skuType = item.SKUList && item.SKUList.length > 1 ? '多规格' : '统一规格';
    } 
  }
}
</script>