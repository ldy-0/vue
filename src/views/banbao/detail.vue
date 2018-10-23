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
  <el-button type='primary' @click='addDetail'>添加段落详情</el-button>

  <el-form class='detail' v-for='(item, index) in formData.detailList' :key='index'>

    <i class='close el-icon-close' @click='deleteDetail(index)'></i>

    <el-form-item label="图片" :label-width="detailLabelWidth">
      <el-upload
        class="avatar-uploader"
        action="" 
        :litmit='1'
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
    this.getList()
  },
  data() {
    return {
        waitAddNotice:false,
        isAddItem:true,
        isShow: false,
        rolesList:[
          { label:'goods', text:'商品' },
        ],
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
          
      },
      formLabelWidth:'80px',
      formData: {
        name: '',
        company:'',
        detailList: []
      },
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
    }
  },
  methods: {
    showModal(index, row){ //
      if(row){
        this.isAddItem = false
        console.log(row)
      }

      this.isShow = true
    },
    handleAvatarSuccess(res, file){
      alert(res, file);
    },
    // exceed(){ this.$message({ type: 'error', message: '图片不能超过4张!' }) },
    addDetail(){
      if(!this.canAddDetail)return this.$message({ message: '请先完善当前表单' });
      this.canAddDetail = false;
      this.formData.detailList.push({ img: '', content: '' })
    },
    deleteDetail(index){
      this.formData.detailList.splice(index, 1);
      this.canAddDetail = this.formData.detailList.length === 0;
    },
    addDetailImage(e, l) {
      console.log('upload before', e, l)

      upLoadFile(e.raw).then(v => {
        this.formData.detailList[this.formData.detailList.length - 1].img = v[0]
        this.canAddDetail = true
        console.log('add img', this.formData.detailList)
      }).catch(e=>{ console.error(e) })

    },
    async submit(formName){
      if(!this.formData.detailList.every(v => v.img !== '' && v.content !== ''))return this.$message({ message: '请完善信息' });
      
      this.waitAddNotice = true
      let param = {
        value: this.formData.detailList,
      };
      console.log('param : --', param);
      let data = await api.updateCustommade(param, this); 

      this.getList();
      this.waitAddNotice = false
      this.addNewShow = false;
      
    },
      //
      async getList() { //获取列表
        this.listLoading = true
        
        let res = await api.getCustommadeList();
        this.formData.detailList = res.data || [];
        console.log('banbao detailList:', this.formData.detailList)
        
        this.listLoading = false
      },
    
  }
}
</script>