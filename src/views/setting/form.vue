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

  .submit_btn{
    margin: 20px 0 0; 
  }
</style>

<template>
<div>

<el-container class="notice">

<el-main>
  <!-- <el-button type='primary' @click='addDetail'>添加段落详情</el-button> -->

  <el-form class='' :model='formData' ref='form' :rules='rules'>

    <!-- <i class='close el-icon-close' @click='deleteDetail(index)'></i>

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
    </el-form-item> -->

    <el-form-item :label='item.key' :label-width='formLabelWidth' :prop='item.value' v-for='(item, index) in classList' :key='index'>
      <el-input placeholder="请输入内容" v-model.number="formData[item.value]" v-if='item.isText'></el-input> 
      <el-input type='textarea' placeholder="请输入内容" v-model.number="formData[item.value]" v-if='item.isTexts'></el-input> 
    </el-form-item>

  </el-form>

  <el-button type='primary' class='submit_btn' @click='submit'>确定</el-button>
</el-main>

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
    console.log('setting', this.category)

    this.classList = this.config[this.category];
    
    this.getList()
  },

  data() {
    return {
      category: '',
      config: {
        '集成暖通': [
          { key: '定金比例', value: 'value', isText: true },
        ],
        '主材选购': [
          { key: '设计服务', value: '设计服务', isText: true },
          { key: '安装服务', value: '安装服务', isText: true },
          { key: '搬运服务', value: '搬运服务', isText: true },
        ],
        '家具选购':[
          { key: '安装服务', value: '安装服务', isText: true },
          { key: '搬运服务', value: '搬运服务', isText: true },
        ],
        'help': [
          { key: '文字内容', value: 'value', isTexts: true },
        ]
      },
      rules: {
        name: [
            { required: true, message: '请输入昵称', trigger: 'blur', min: 1, },
            { required: true, message: '不能超过15个字符!', trigger: 'blur', max: 15 }
        ],
        value: [
            { required: true, message: '请输入定金比例' },
            // { type:'number', message: '值必须为数字' },
        ],
        '设计服务': [
            { required: true, message: '请输入设计服务费' },
            { type:'number', message: '值必须为数字' },
        ],
        '安装服务': [
            { required: true, message: '请输入安装服务费' },
            { type:'number', message: '值必须为数字' },
        ],
        '搬运服务': [
            { required: true, message: '请输入搬运服务费' },
            { type:'number', message: '值必须为数字' },
        ],
      },
      showDesign: false,
      showInstall: false,
      showMove: false,
        waitAddNotice:false,
        isAddItem:true,
        isShow: false,
        rolesList:[
          { label:'goods', text:'商品' },
        ],
      formLabelWidth:'80px',
      formData: {},
      tableData: [],
      searchKeyWord: '',
      imgs: [],
      detailLabelWidth: '40px',
      canAddDetail: true,
      categories: [
        { id: 1, title: '111' },
        { id: 3, title: '311' },
      ],
      formInline: {},
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        search:"",
        time:""
      },
      total: 0,
    }
  },
  methods: {
    searchByPhone(){
      console.log('search ----', this.searchKeyWord);
    },
    showModal(index, row){ //
      if(row){
        this.isAddItem = false
        console.log(row)
      }

      this.isShow = true
    },
    addDetail(){
      if(!this.canAddDetail)return this.$message({ message: '' });
      this.canAddDetail = false;
      this.formData.detailList.push({ img: '', content: '' })
    },
    addDetailImage(e, l) {
      console.log('upload before', e, l)

      upLoadFile(e.raw).then(v => {
        this.formData.detailList[this.formData.detailList.length - 1].img = v[0]
        this.canAddDetail = true
        console.log('add img', this.formData.detailList)
      }).catch(e=>{ console.error(e) })

    },
    async submitForm(){
      
      let res = await this.$refs['form'].validate().catch(e => e);
      if(!res) return ;

      this.waitAddNotice = true
      console.log('formData', this.formData);
      // if(this.isAddItem){
      //   var addres = await api.setTeacher(this.formData);
      // }
      this.submit();
      
      this.waitAddNotice = false
      this.addNewShow = false;
      
    },
    async submit(){
      console.log('formData --', this.formData);

      if(this.category === '集成暖通'){
        this.setDepositscale();
      }else if(this.category === '主材选购'){
        this.setExtraservice(5);
      }else if(this.category === '家具选购'){
        this.setExtraservice(6);
      }else if(this.category === 'help'){
        this.setHelp();
      }
      
    },
    async setDepositscale(){
      let res = await api.updateDepositscale(this.formData, this);

      this.getDepositscale();
    },
    async setExtraservice(id){
      let o = this.formData,
          value = [];

      for(let key in o){
        value.push(`${key}:${o[key]}`); 
      }
      
      let res = await api.updateExtraservice(id, { value }, this);

      this.getExtraservice(id);
    },
    async setHelp(){
      
      let res = await api.updateHelp(this.formData, this);  
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
        
        // let res = await api.getTeacherList(this.listQuery);
        if(this.category === '集成暖通'){
          this.getDepositscale();
        }else if(this.category === '主材选购'){
          this.getExtraservice(5);
        }else if(this.category === '家具选购'){
          this.getExtraservice(6);
        }else if(this.category === 'help'){
          this.getHelp();
        }
        
        this.listLoading = false
      },
      async getDepositscale(){
        let res = await api.getDepositscale(null, this);

        this.formData= { value: Number(res) };
      },
      async getExtraservice(id){
        
        let res = await api.getExtraservice(id, null, this);

        if(res){
          this.formData = {};
          res.forEach(v => this.formData[v.split(':')[0]] = Number(v.split(':')[1]) );
        }

      },     
      async getHelp(){
        let res = await api.getHelp(null, this);
        this.formData = {};
        this.formData.value = res;
      },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    
  }
}
</script>