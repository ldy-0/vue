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

import api from '@/api/seller' 
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
      className: '设计师',
      classList: [
        { key: '姓名', value: 'name' },
        { key: '所属设计公司', value: 'company' },
        { key: '定金', value: 'price' },
        { key: '评分', value: 'level' },
      ],
      searchKeyWord: '',
      imgs: [],
      detailLabelWidth: '40px',
      canAddDetail: true,
      categories: [
        { id: 1, title: '111' },
        { id: 3, title: '311' },
      ],
      address: null,
      addressList: [],
      industry:'',
      industryList: [{
          value: 'edu',
          label: '教育'
        }, {
          value: 'others',
          label: '其他'
        }],
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
    handleAvatarSuccess(res, file){
      alert(res, file);
    },
    exceed(){
      this.$message({ type: 'error', message: '图片不能超过4张!' })
    },
    addImage(e) {
      
      console.log('upload before', e, this.imgs)
      upLoadFile(e.raw).then(v => {
        // this.formData.case_img = v[0]
        // this.case_img = true
        // console.log(this.formData.imgs)
        this.imgs.push(v[0])
        console.log(this.imgs)
      }).catch(e=>{ console.error(e) })

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
    deleteDetail(index){
      console.log(index);
      if(index === this.formData.detailList.length-1)this.canAddDetail = true;
      this.formData.detailList.splice(index, 1)
    },
    async submit(formName){
      
      let res = await this.$refs[formName].validate().catch(e => e);
      if(!res) return ;

      this.waitAddNotice = true
      console.log('formData', this.formData);
      // if(this.isAddItem){
      //   var addres = await api.setTeacher(this.formData);
      // }
      
      this.waitAddNotice = false
      this.addNewShow = false;
      // addAuth_api(sendData).then(data=>{
      //   this.waitAddNotice = false
      //   this.addNewShow = false
      //   if(data.status===0){
      //     this.$notify.success({ title: '成功', message: '添加成功' })
      //     this.getList()
      //   }else{
      //     this.$notify({
      //       title: '失败',
      //       message: '操作失败',
      //       type: 'error'
      //     })
      //   }
      // }).catch(e=>{
      //   this.waitAddNotice = false
      //   this.addNewShow = false
      //   console.error('appointmentShop:addIndustry_api 接口错误')
      // })
    },
      
      async editAuth(formName){
        let res = await new Promise((res,rej)=>{
        this.$refs[formName].validate((valid) => {
            if (valid) {
              res(true)
            } else {
              res(false)
            }
          })
        })
        if(!res){
          return 
        }
        this.waitAddNotice = true
        let sendData = {
          // 后端生成
          seller_id:this.formData.id,
          // 前段统一
          seller_nick:this.formData.username,
          // seller_name:this.formData.account,
          seller_password:this.formData.password,
          seller_limits:this.formData.checkboxGroup1,
          sellergroup_id:0,
        }
        editAuth_api(sendData).then(data=>{
          this.waitAddNotice = false
          this.addNewShow = false
          if(data.status===0){
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            })
            this.getList()
          }else{
            this.$notify({
              title: '失败',
              message: '操作失败',
              type: 'error'
            })
          }
        }).catch(e=>{
          this.waitAddNotice = false
          this.addNewShow = false
          console.error('editAuth_api 接口错误')
        })
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
        this.tableData = [
          { name: 'sf开始的浪费口水都发送方SAF', company: 'sfd', price: '324.34', level: 4.5 },
          { name: 'sf开始的浪费口水都发送方SAF', company: 'sfd', price: '324.34', level: 4.5 },
        ];
        this.total = this.tableData.length// res.pagination.total;
        this.listLoading = false
      },
      deleteItem(index,row){
        let id = row.id
        this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteNewNotice(id)
        }).catch(()=>{ this.$notify.info({ title: '消息', message: '已取消' }); })
      },
      deleteNewNotice(id){
        let sendData = {
          seller_id:id,
        }
        deleteAuth_api(sendData).then(res=>{
          if(res&&res.status===0){
              this.$notify.success({ title: '成功', message: '操作成功' });
            this.getList()
          }else{
            this.$notify({ title: '错误', message: '操作失败', type:'error' });
          }
        }).catch(err=>{
          console.error('deleteseller_api')
        })
          
        
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
    
  }
}
</script>