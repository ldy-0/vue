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
  .detail_img, .detail_imgs{
    width: 148px;
    height: 148px;
  }
  .detail_img {
    display: block;
  }
  .detail_imgs{
    margin: 0 20px;
  }
  .close{
    position: relative;
    left: calc(100% - 30px);
  }

  .thumb_img{
    width: 60px;
    height: 40px;
  }
</style>

<template>
<div>

<el-container class="notice">

<el-header class="header">
  <el-form :inline="true" :model="formInline" class="form">

    <el-form-item v-if='showAddBtn'>
      <el-button type='primary' @click='showDialog'>{{className}}</el-button>
    </el-form-item>

  </el-form>       
</el-header>

<el-main>
    <el-table :data="tableData" stripe v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%" >

      <el-table-column :label="item.key" :prop="item.value" v-for='(item, index) in classList' :key='index'>
        <template slot-scope="scope">
          
          <img class='thumb_img' :src='scope.row[item.value]' v-if='item.isImg' />

          <div v-else-if='item.isIcon'>
            <i class='el-icon-check' v-if='scope.row[item.value]'></i>
            <i class='el-icon-close' v-else></i>
          </div>

          <div v-else>{{scope.row[item.value]}}</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" v-if='showOperate'>
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="showDialog(scope.$index, scope.row)" v-if='showdetail'>编辑</el-button>
          <!-- <el-button size="mini" type="text" @click="showDialog(scope.$index, scope.row)" v-if='showdetail'>详情</el-button> -->
          <el-button size="mini" type="text" @click="showDeleteDialog(scope.$index, scope.row)" v-if='showDelete'>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
</el-main>
<el-footer>
  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
  </el-pagination>
</el-footer>
</el-container>

<customDialog :config='dialogConfig' :detail='detail' :visible='isShowDialog' @cancel='isShowDialog = false;' @submit='submitForm' @getQrcode='getQR'></customDialog>


</div>
</template>
<script>

import api from '@/api/seller'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import customDialog from '@/components/customDialog/index.vue'
import upLoadFile from '@/utils/aahbs.js'
import { getStoreId } from '@/utils/auth'

export default {
  components: {
    UploadExcelComponent,
    customDialog,
  },

  created(){
    this.category = this.$route.query.category;
    // console.log(this.category);
    console.log('- store.state -', this.$store.state.user)

    this.showOperate = true;
    this.showdetail = true;
    this.showDelete = true;

    this.getList();
  },

  data() {
    return {
      category: '',
      showAddBtn: true,
      showSearchByKeyword: false,
      showSearchByOrder: false,
      showSearchByDate: false,
      showSelect: false,
      showExport: false,
      showOperate: false,
      showDeliver: false,
      showRefund: false,
      showdetail: false,
      showResolve: false,
      showReject: false,
      showEdit: false,
      showDelete: false,
      isDisabled: false,
      classList: [
          { key: '餐桌名字', value: 'table_name', isText: true, },
          { key: '编号', value: 'table_no', isNumber: true, },
      ],
      isShowDialog: false,
      dialogConfig: {
        width: '80%',
        classList: [
          { key: '餐桌名字', value: 'table_name', isText: true, },
          { key: '编号', value: 'table_no', isNumber: true, },
          { key: '二维码', value: 'table_code', isCreateQrcode: true },
          // { key: '图片', value: 'imgList', isImg: true },
        ], 
        rules: {
          'table_name': [
            { required: true, message: '请输入名字', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          'table_no': [
            { required: true, message: '编号不能为空' },
            { type: 'number', message: '编号必须为数字值'}
          ],
          'table_code': [
            { required: true, message: '请生成二维码!', trigger: 'blur' },
          ],
        },
        canSubmit: true,
      },
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
      searchKeyWord: '',
      tableData: [],
      className: '添加餐桌',
      detail: {}, 
      imgs: [],
      detailLabelWidth: '40px',
      canAddDetail: true,
      orderState: '',
      formInline: {},
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
      },
      total: 0,
      imgs: [],
    }
  },
  methods: {
    showDialog(index, row){

      if(row){
        // this.isDisabled = true;
        this.initDetail(row);
      }else{
        this.isDisabled = false;
        this.initDetail();
      }

      this.isAddItem = !row;
      this.isShowDialog = true;

    },
    async getQR(){

      if(!this.detail.table_no) return this.$message.error({ message: `请输入编号！` })
      console.log('qr param: ', getStoreId());
      let param = {
        page: 'pages/home',
        // scene: `{id:1,did:${this.detail.table_no}}`,
        scene: `${getStoreId()},${this.detail.table_no}`,
        width: 430,
        auto_color: false,
        line_color: {"r":"0","g":"0","b":"0"},
        is_hyaline: false
      }
      console.log('param --', param)

      let res = await api.createQRcode(param, this);

      this.detail.table_code = res.url;
    },
    changeImgs(e, list){
      console.log('change img--', list)
      this.imgs = list;
    },
    removeImg(file, fileList){
      console.log('remove', fileList)
      this.imgs = list;
    },
    download(){
      
    },
    async handleDownload() {
        let loading = this.$loading();

        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = this.classList.map(v => v.key)
          const filterVal = this.classList.map(v => v.value) 

          let data = this.tableData.map(v => filterVal.map(val => v[val] || '' ) )
          console.log(tHeader, filterVal, data)

          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'list',
            autoWidth: true 
          })
          this.downloadLoading = false
        })
      },
    submitForm(imgs){

      this.dialogConfig.canSubmit = false;
      // console.log('submit detail', imgs)

      this.submit();
    },
    async submit(){

      console.log('detail', this.detail);

      let res = this.isAddItem ? await api.addDesk(this.detail, this) : await api.updateDesk(this.detail, this);

      this.dialogConfig.canSubmit = true;
      this.isShowDialog = false;
      this.isAddItem = true;
      this.getList();
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
      //
      getList() { //获取列表
        let loading = this.$loading({ fullscreen: true })
        console.log('listQuery --', this.listQuery);
        
        this.getDeskList(); 

        loading.close(); 
      },
      showDeleteDialog(index,row){

        this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', { type: 'warning' }).then((e) => {
          this.deleteItem(row)
        }).catch((e)=>{ this.$notify.info({ title: '消息', message: `已取消` }); })
      },
      async deleteItem(row){
        this.deleteDesk(row.table_id);
      },
      async deleteDesk(id){
        let param = {
          table_id: id,
        };

        let res = await api.deleteDesk.call(this, param);

        this.getList();
      },
    initDetail(item){
      let detail = {};
      
      if(typeof item === 'object'){
        for(let key in item){ detail[key] = item[key]; }
        // detail.imgList = typeof detail.imgList === 'string' ? [ { url: detail.imgList } ] : detail.imgList.map(v => { return { url: v } }) 
      }else{
        this.dialogConfig.classList.forEach(v => detail[v.value] = undefined)
      }
     
      this.detail = detail;
      console.log('init detail done --', item, this.detail);
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    // 
    async getDeskList(){
      let res = await api.getDeskList.call(this, this.listQuery);

      // let url = 'http://admin-1256953590.cos.ap-shanghai.myqcloud.com/1539331723928tab_fenxiangzhuan%402x.png'
      // res.data.forEach(v => { v.imgList = [url, url], v.qrcode = url })
      // let img = 'http://admin-1256953590.cos.ap-shanghai.myqcloud.com/1539331723928tab_fenxiangzhuan%402x.png';
      // res.data.forEach(v => v.qrcode = [img, img, img])
      this.tableData = res.data;
      console.log('talbedata --', this.tableData)
      this.total = res.pagination.total;
      this.listLoading = false
    },
    
  }
}
</script>