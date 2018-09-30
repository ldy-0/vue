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
<el-dialog :title="isAddItem ? `新增${className}` : `编辑${className}` " :visible.sync="isShow" width="30%">

  <el-form :model="formData"  ref="ruleForm" :rules="rules" >

    <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
      <el-input v-model="formData.name" auto-complete="off"></el-input>
    </el-form-item>
    
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="addNewShow=false" >取消</el-button>
    <el-button v-if="isAddItem" type="primary" @click="submit('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确 定</el-button>
    <el-button v-else type="primary" @click="submit('ruleForm')"
    :disabled="waitAddNotice" 
    :loading="waitAddNotice">确认修改</el-button>
  </span>
</el-dialog>

<el-container class="notice">

<el-header class="header">
  <el-form :inline="true" :model="formInline" class="form">
    <el-form-item>
      <el-button type="primary" icon="el-icon-edit-outline" @click="showModal">新增{{className}}</el-button>
    </el-form-item>

  </el-form>       
</el-header>

<el-main>
    <el-table :data="tableData" stripe v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%" >

      <el-table-column :label="item.key" :prop="item.value" v-for='(item, index) in classList' :key='index'></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showModal(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteItem(scope.$index, scope.row)">删除</el-button>
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
      //out
        waitAddNotice:false,
        isAddItem:true,
        isShow: false,
        rules: {
          name: [
              { required: true, message: '请输入昵称', trigger: 'blur', min: 1, },
              { required: true, message: '不能超过15个字符!', trigger: 'blur', max: 15 }
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
      className: '分类',
      classList: [
        { key: '分类标题', value: 'name' },
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
        this.isAddItem = false;
        console.log(row)
      }

      this.isShow = true
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
        }).catch(()=>{
          this.$notify.info({
            title: '消息',
            message: '已取消'
          });
        })
      },
      deleteNewNotice(id){
        let sendData = {
          seller_id:id,
        }
        deleteAuth_api(sendData).then(res=>{
          if(res&&res.status===0){
              this.$notify({
              title: '成功',
              message: '操作成功',
              type:'success'
            });
            this.getList()
          }else{
            this.$notify({
              title: '错误',
              message: '操作失败',
              type:'error'
            });
          }
        }).catch(err=>{
          console.error('deleteseller_api')
        })
          
        
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