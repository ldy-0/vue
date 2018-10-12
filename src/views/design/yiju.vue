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
</style>

<template>
<div>
<el-dialog :title="isAddItem ? `新增` : `编辑` " :visible.sync="isShow" width="30%" @close='closeDialog'>

  <el-form :model="formData"  ref="ruleForm" :rules="rules" :disabled='!isEdit'>

    <el-form-item label="标题" :label-width="formLabelWidth" prop="name">
      <el-input v-model="formData.name" auto-complete="off"></el-input>
    </el-form-item>
    
    <el-form-item label="图片" :label-width="formLabelWidth">
      <el-upload
        class="avatar-uploader"
        action="" 
        :limit='1'
        list-type="picture-card" 
        :auto-upload="false" 
        :file-list='formData.imgs' 
        :on-exceed='exceed'
        :on-success="handleAvatarSuccess"
        :on-change='addImage'> <!--:show-file-list="false" -->
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>

    <!-- <el-form-item label="设计公司" :label-width="formLabelWidth" prop="company">
      <el-input v-model="formData.company" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="价格" :label-width="formLabelWidth" prop="price">
      <el-input v-model.number="formData.price" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="分类" :label-width="formLabelWidth" prop='class'> 
      <el-select v-model="formData.category" placeholder="请选择"> 
        <el-option v-for="item in categories" :key="item.id" :label="item.title" :value="item.id"></el-option>
      </el-select>
    </el-form-item> -->

    <el-form-item label='详情' :label-width="formLabelWidth" :disabled='!isEdit'>
      <el-button type='primary' @click='addDetail'>添加段落详情</el-button>

      <el-form class='detail' v-for='(item, index) in formData.detailList' :key='index' :disabled='!isEdit'>
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

  <span slot="footer" class="dialog-footer" v-if='isEdit'>
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
      <el-button type="primary" icon="el-icon-edit-outline" @click="showModal">添加</el-button>
    </el-form-item>

  </el-form>       
</el-header>

<el-main>
    <el-table :data="tableData" stripe v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%" >

      <el-table-column :label="item.key" :prop="item.value" v-for='(item, index) in classList' :key='index'></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showModal(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="showModal(scope.$index, scope.row, false)">详情</el-button>
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

    this.initFormData();

    this.getList()
  },
  data() {
    return {
        waitAddNotice:false,
        isAddItem:true,
        isShow: false,
        isEdit: true,
        rules: {
          name: [
              { required: true, message: '请输入昵称', trigger: 'blur', min: 1, },
              { required: true, message: '不能超过15个字符!', trigger: 'blur', max: 15 }
          ],
          price: [
              { required: true, message: '请输入价格' },
              { type:'number', message: '值必须为数字' },
          ],
          // phone: [
          //     { required: true, message: '请输入手机号', },
          //     { required: true, message: '手机号必须是11位', trigger: 'blur', min: 11, max: 11 },
          // ],
      },
      formLabelWidth:'80px',
      formData: {
        
      },
      tableData: [],
      classList: [
        { key: '标题名称', value: 'title' },
        { key: '内容', value: 'content' },
      ],
      imgs: [], // 图片对象列表
      detailLabelWidth: '40px',
      canAddDetail: true,
      // categories: [
      //   { id: 1, title: '111' },
      //   { id: 3, title: '311' },
      // ],
      formInline: {},
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
      },
      total: 0,
    }
  },
  methods: {
    
    async showModal(index, row, isEdit = true){ //
      if(row){
        this.isAddItem = false;
        this.isEdit = isEdit;

        let res = await api.getAcademy(row.id, null, this);
        this.initFormData(res);
      }

      this.isShow = true
    },
    handleAvatarSuccess(res, file){
      alert(res, file);
    },
    exceed(){ this.$message({ type: 'error', message: '图片不能超过1张!' }) },
    addImage(e) {
      this.imgs.push(e.raw);
      console.log('add image --', e, this.imgs)

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
        this.canAddDetail = true
        load.close();
        console.log('add img', this.formData.detailList)
      }).catch(e=>{ console.error(e) })

    },
    deleteDetail(index){
      if(!this.isEdit) return ;
      console.log(index);
      if(index === this.formData.detailList.length-1)this.canAddDetail = true;
      this.formData.detailList.splice(index, 1)
    },
    async submitForm(formName){
      
      let res = await this.$refs[formName].validate().catch(e => e);
      if(!res) return ;

      this.waitAddNotice = true
      // 
      upLoadFile(this.imgs).then(v => {

        this.formData.imgs = this.imgs.length > 0 ? v[0] : this.formData.imgs[0].url;
        console.log('upload done', v, this.formData.imgs)

        this.submit();
      }).catch(e=>{ console.error(e) });

      
      
    },
    async submit(){
      let v = this.formData,
          param = {
            title: v.name,
            pic: v.imgs,
            body: v.detailList,
            sort: 0,
          };

      console.log('param: --', param);
      let res = this.isAddItem ? await api.setAcademy(param, this) : await api.updateAcademy(this.formData.id, param, this);
      
      this.waitAddNotice = false;
      this.isShow = false;
      this.imgs = [];

      this.getList(this.listQuery);
    },
    closeDialog(){
      this.isAddItem = true;
      this.waitAddNotice = false;
      this.initFormData();
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
        
        let res = await api.getAcademyList(this.listQuery);
        // this.tableData = [
        //   { name: 'sf开始的浪费口水都发送方SAF', company: 'sfd', price: '324.34', level: 4.5 },
        //   { name: 'sf开始的浪费口水都发送方SAF', company: 'sfd', price: '324.34', level: 4.5 },
        // ];
        this.tableData = res.data;
        this.total = this.tableData.length// res.pagination.total;
        this.listLoading = false
      },
    showDelete(index, row){
        let id = row.id;

        this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteItem(id)
        }).catch(()=>{ this.$notify.info({ title: '消息', message: '已取消' }); })
    },
    async deleteItem(id){
      let res = await api.deleteAcademy(id, null, this);

      this.getList();
    }, 
    initFormData(item = {}){
      this.formData = {
        id: item.id || null,
        name: item.title || '',
        imgs: item.pic ? [{url: item.pic}] : [], 
        detailList: item.body || [],
      };
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