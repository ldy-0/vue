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

<el-container class="notice">

<el-header class="header">
  <el-form :inline="true" :model="formInline" class="form">

    <el-form-item>
      <el-input style="width: 340px;" placeholder="请输入联系方式" v-model="searchKeyWord"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchByPhone">查询</el-button>
    </el-form-item>

    <el-form-item label="时间">
        <el-date-picker style="width:340px" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
          v-model="listQuery.time">
        </el-date-picker>
        <el-button type="primary" icon="el-icon-search" @click="searchByDate">查询</el-button>
    </el-form-item>

    <el-form-item label="">
      <el-button  type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">导出Excel</el-button>
      <!-- <span class="hbs-inline-tips">导出所有数据，这个过程可能会需要花费  <span class="hbs-hot">几分钟</span> 的时间，请耐心等待</span> -->
    </el-form-item>

  </el-form>       
</el-header>

<el-main>
    <el-table :data="tableData" stripe v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%" >

      <el-table-column :label="item.key" :prop="item.value" v-for='(item, index) in classList' :key='index'></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
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
          // phone: [
          //     { required: true, message: '请输入手机号', },
          //     { required: true, message: '手机号必须是11位', trigger: 'blur', min: 11, max: 11 },
          // ],
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
        { key: '联系方式', value: 'telephone' },
        { key: '小区地址', value: 'address' },
        { key: '面积', value: 'acreage' },
        { key: '意向风格', value: 'style' },
        { key: '备注', value: 'remark' },
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
      formInline: {},
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        search:"",
        time:""
      },
      total: 0,
      downloadLoading: false,
    }
  },
  methods: {
    searchByPhone(){
      console.log('search ----', this.searchKeyWord);
      this.listQuery.search = this.searchKeyWord;
      this.getList()
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
      async handleDownload() {
        this.downloadLoading = true
        let allRes = this.tableData 
        console.log('allRes',allRes)
        if(!allRes){
          this.downloadLoading = false
          return console.log('获取数据失败:handleDownload')
        }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = this.classList.map(v => v.key)
          const filterVal = this.classList.map(v => v.value) 

          let data = this.tableData.map(v => filterVal.map(val => v[val] || '' ) )
          console.log(tHeader, filterVal, data)
          // const data = this.formatJson(filterVal, tableData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'list',
            autoWidth: true 
          })
          this.downloadLoading = false
        })
      },
      //
      async getList() { //获取列表
        this.listLoading = true
        
        let res = await api.getCustommadeinfo(this.listQuery);

        this.tableData = res.data
        this.total = res.pagination.total;
        this.listLoading = false
      },
      showDelete(index, row){
        let id = row.id
        this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteItem(id)
        }).catch(()=>{ this.$notify.info({ title: '消息', message: '已取消' }); })
      },
      async deleteItem(id){
       let res = await api.deleteCustommadeinfo(id, {id}, this) 
       
       this.getList()
      },
    searchByDate(){
      let query = this.listQuery;

      query.starttime = new Date(query.time[0]).toISOString().split('T')[0]
      query.endtime = new Date(query.time[1]).toISOString().split('T')[0]

      delete this.listQuery.time
      this.listQuery.page = 1
      this.getList()
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