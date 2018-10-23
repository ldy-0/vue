<style lang="stylus">
  .notice
    .header
      margin-top 20px
</style>

<template>
<div>
<el-dialog :title="isAddItem?'新增轮播图':'编辑轮播图'" :visible.sync="isShow" width="80%">
  <!-- <el-dialog :visible.sync="dialogVisible" append-to-body>
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog> -->
  <el-form :model="formData" ref="ruleForm" :rules="rules" >
    <el-form-item label="图片" :label-width="formLabelWidth">
          <el-upload 
          :auto-upload="false"
          action=""
          :limit="imgLimit"
          :on-exceed='exceed'
          list-type="picture-card" 
          :on-preview="preview"
          :on-change="changeImg" 
          :on-remove="changeImg" 
          :file-list="formData.img"
          >
          <i class="el-icon-plus" ></i>
        </el-upload>
    </el-form-item>
    <p class="hbs-margin-left80">请选择一张图片,建议尺寸： 宽750*高376</p>

    <el-form-item label="跳转类型" :label-width="formLabelWidth">
        <!-- <el-select v-model="rules.fileList2[0].required" placeholder="请选择"> -->
        <el-select v-model="formData.type" placeholder="请选择" @change='changeType'>
            <el-option v-for="item in classs" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
    </el-form-item>

    <el-form-item v-if="formData.type === 1" label="跳转图片" :label-width="formLabelWidth" >
      <el-upload 
              :auto-upload="false"
              action=""
              :on-exceed='exceed'
              list-type="picture-card" 
              :on-preview="preview" 
              :on-change="changeImgUrl" 
              :on-remove="changeImgUrl" 
              :file-list="formData.img_url" 
              >
              <i class="el-icon-plus"></i>
      </el-upload>
    </el-form-item>
      
    <el-form-item v-if='formData.type === 2' label='跳转商品详情' :label-width='formLabelWidth' prop='category'>
      <!-- <el-cascader expand-trigger="hover"
        :options="categories"
        v-model="formData.category"
        @change="setCategory">
      </el-cascader> -->
      
      <el-select v-model="formData.category" placeholder="请选择" @change='getClass'> <!--multiple  -->
        <el-option v-for="item in categories" :key="item.storegc_id" :label="item.storegc_name" :value="item.storegc_id"></el-option>
      </el-select>

      <el-select v-model="formData.category2" placeholder="请选择" @change='getClass2'> 
        <el-option v-for="item in categories2" :key="item.storegc_id" :label="item.storegc_name" :value="item.storegc_id"></el-option>
      </el-select>
      
      <!-- <el-select v-model="formData.category3" placeholder="请选择" @change='getClass3'> 
        <el-option v-for="item in categories3" :key="item.storegc_id" :label="item.storegc_name" :value="item.storegc_id"></el-option>
      </el-select> -->

      <el-select v-model="formData.category4" placeholder="请选择" @change='getId'> <!--multiple  -->
        <el-option v-for="item in categories4" :key="item.goods_commonid" :label="item.goods_name" :value="item.goods_commonid"></el-option>
      </el-select>
    </el-form-item>

  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="isShow = false">取 消</el-button>
    <el-button v-if="isAddItem" type="primary" @click="submitForm('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确 定</el-button>
     <el-button v-else type="primary" @click="submitForm('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确认修改</el-button>
  </span>
</el-dialog>
<!-- body -->
<el-container class="notice">
<el-header class="header">
  <el-form :inline="true" :model="formInline" class="form">
    <el-form-item>
      <el-button type="primary" icon="el-icon-edit-outline" @click="showModal">新增轮播图</el-button>
    </el-form-item>
  </el-form>       
</el-header>
<el-main>
    <el-table
      :data="tableData"
      stripe 
      v-loading="listLoading" element-loading-text="给我一点时间"
      style="width: 100%" >

      <el-table-column label="图片">
        <template slot-scope="scope">
          <div style="width:100px;height:100px;align-items:center;display:flex;">
            <img :src="scope.row.banner_pic" alt="" style="width:40px; height: 40px;">
          </div>
        </template>
      </el-table-column>

      <el-table-column label="跳转类型" prop="typeStr"></el-table-column>

      <el-table-column label="操作" min-width='300px'>
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showModal(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteItem(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

<!-- footer     -->
</el-main>
<el-footer>
  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
  </el-pagination>
</el-footer>
</el-container>
</div>
</template>
<script>
import {getBannerList_api , deleteBanner_api , addBanner_api , editBanner_api} from '@/api/seller'
import api from '@/api/api'
import uploadFn from '@/utils/aahbs'
import upLoadFile from '@/utils/aahbs.js'


export default {
  data() {
    return {
      isAddItem:true,
      waitAddNotice:false,
      isShow:false,
      formLabelWidth:'100px',
      dialogImageUrl: '',
      dialogVisible: false,
      formData: {},
      imgs: [],
      hasImg: false,
      img_urls: [],
      hasImgUrl: false,
      imgLimit:1,
      classs: [
        { value: 0, label:'不跳转' },
        { value: 1, label:'跳转图片' },
        { value: 2, label:'跳转商品' },
      ],
      rules: {
        img:[
          // { type: "array", required: true, len: 1, message: '请选择一张图片', }
        ],
        fileList2:[
          { type: "array", required: true, len: 1, message: '请选择一张图片', }
        ],
      },
      categories: [
        // { label: '家具选购', value: '家具选购', children: [ { label: '1', value: '11' }, { label: '2', value: '12' } ] }
      ],
      categories2: [],
      categories3: [],
      categories4: [],
      formInline: {},
      // body 
      listLoading: false,
      tableData:[],
      listQuery: {
        page: 1,
        limit: 20
      },
      total:1,
    }
  },

  computed: {
    getImgs(){
      return [ this.formData.img === '' ? {} : { url: this.formData.img} ];
    }
  },

  created(){
    this.initFormData();

    this.getList()
  },
  methods: {
    async showModal(index, row){ //
      this.initFormData();
      this.isAddItem = true;

      if(row){
        this.isAddItem = false
        // let res = await api.getGoods(row.goods_commonid, null, this);
        this.initFormData(row);
        console.log(row, this.formData.imgs)
      }

      if(this.isAddItem && this.tableData.length >= 5){
        return this.$message({ message: '轮播图最多为5个' });
      }

      if(this.formData.type === 2){
        this.changeType(2);
      }

      this.hasImg = this.hasImgUrl = this.isAddItem;
      this.isShow = true
    },
    exceed(files, filelist){
      console.log(files, filelist); 
    },
      preview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
        console.log('preview----',arguments)
      },
      changeImg(e){
        this.hasImg = true;
        if(e.raw) this.imgs[0] = e.raw;
        console.log('upload img--', this.imgs);
      },
      changeImgUrl(e, list) {
        this.hasImgUrl = true;
        this.img_urls = list;
        // this.imgs[1] = e.raw;
        console.log('upload imgUrl--', this.imgs, list);
      },
    async changeType(i){
      if(i === 2){
        let res = await api.getClassList({ parent_id: 0 }, this);
        this.categories = res.data || [];
      }
    },
    async getClass(id){
      console.log(id)
      let res = await api.getClassList({ parent_id: id }, this);
      this.categories2 = res.data || [];
      this.category2 = null; 
    },
    // async getClass2(id){
    //   console.log(id)
    //   let res = await api.getClassList({ parent_id: id }, this);
    //   this.categories3 = res.data || [];
    //   this.category3 = '';
    // },
    async getClass2(id){
      console.log(id)
      let res = await api.getGoodsList({ gc_id_2: id }, this);
      this.categories4 = res.data || [];
    },
    getId(id){
      console.log('store_id: --', id);
      this.formData.id = id;
    },
    addItem(){
      this.isAddItem = true,
      this.isShow = true,
      this.formForNotive = Object.assign({},formForNotive)
    },
    setCategory(val){
      console.log(val); 
    },
    async submitForm(formName){

      if(this.hasImg && !this.imgs[0]){
        console.log('---', this.formData.img)
        return this.$message({ message: '请选择一张图片' });
      }

      if(this.hasImgUrl && this.formData.type === 1 && this.img_urls.length < 1){
        return this.$message({ message: '请选择跳转图片' });
      }

      if(this.formData.type === 2 && !this.formData.id){
        return this.$message({ message: '请选择跳转商品' });
      }

      this.waitAddNotice = true;

      let imgs = [], // 已上传图片列表
          hasBanner = this.imgs[0]; 
      this.img_urls.forEach(v => v.raw ? this.imgs.push(v.raw) : imgs.push(v.url) )

      if(this.hasImg || this.hasImgUrl){

        upLoadFile(this.imgs).then(v => {
          if(hasBanner){
            this.formData.img[0] = v[0];
            this.formData.img_url = v.slice(1);
          }else{
            this.formData.img_url = v.slice(0);
          }
         console.log('upload success :', this.formData) 
          
          this.submit(imgs.length && imgs);
        }).catch(e=>{ console.error(e) })

      }else{
        this.submit();
      }
       
      
    },
    async submit(imgs){
      let o = this.formData,
          pic = o.img[0],
          url = imgs ? imgs.concat(o.img_url)[0] : o.img_url[0], // [0],
            param = {
              banner_pic: pic.url || pic,
              banner_url: o.type === 2 ? o.id : o.type === 1 ? url.url || url : null,
              type: o.type,
            };

      console.log('param --', param, this.isAddItem);
      let res = this.isAddItem ? await api.setBanner(param, this) : await api.updateBanner(this.formData.banner_id, param, this);

      this.getList();
      this.waitAddNotice = false;
      this.isShow = false;
      this.imgs = [];
    },
    async getList() {
      this.listLoading = true

      let res = await api.getBannerList(null, this);
      res.data.forEach(v => this.classs.forEach(val => val.value === v.type ? v.typeStr = val.label : void(0) ) );
      this.tableData = res.data;
      
      this.listLoading = false;
    },

    deleteItem(index,row){
      let id = row.banner_id;
      this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteBanner(id);
      }).catch(()=>{ this.$notify.info({ title: '消息', message: '已取消' }); })
    },
    async deleteBanner(id){
      let res = await api.deleteBanner(id, null, this);

      this.getList();
    },
    initFormData(item = {}){
      this.formData = {
        banner_id: item.banner_id || null,
        img: item.banner_pic && [{url: item.banner_pic}] || [], 
        img_url: item.banner_url && /http/.test(item.banner_url) && [{url: item.banner_url}] || [],
        id: Number(item.banner_url) || null, 
        type: item.type || 0,
      }
      console.log('formData', this.formData);
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    }
  }
}
</script>
