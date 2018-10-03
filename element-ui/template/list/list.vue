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
      <el-button type='primary' @click='addItem'>{{className}}</el-button>
    </el-form-item>

    <el-form-item v-if='showSearchByKeyword'>
      <el-input style="width: 340px;" placeholder="请输入联系方式" v-model="searchKeyWord"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchByPhone">查询</el-button>
    </el-form-item>

    <el-form-item label="时间" v-if='showSearchByDate'>
        <el-date-picker style="width:340px" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
          v-model="listQuery.time">
        </el-date-picker>
        <el-button type="primary" icon="el-icon-search" @click="searchByPhone">查询</el-button>
    </el-form-item>

    <el-form-item label="订单状态" :label-width="formLabelWidth" prop='class' v-if='showSelect'> 
      <el-select v-model="category" placeholder="请选择"> <!--multiple  -->
        <el-option v-for="item in categories" :key="item.id" :label="item.title" :value="item.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="" v-if='showExport'>
      <el-button  type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">导出Excel</el-button>
      <span class="hbs-inline-tips">导出所有数据，这个过程可能会需要花费  <span class="hbs-hot">几分钟</span> 的时间，请耐心等待</span>
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
          <el-button size="mini" type="primary" @click="deleteItem(scope.$index, scope.row)" v-if='showDeliver'>发货</el-button>
          <el-button size="mini" type="primary" @click="showDetail(scope.$index, scope.row)" v-if='showdetail'>详情</el-button>
          <el-button size="mini" type="primary" @click="showDetail(scope.$index, scope.row)" v-if='showResolve'>通过</el-button>
          <el-button size="mini" type="primary" @click="showDetail(scope.$index, scope.row)" v-if='showReject'>拒绝</el-button>
          <el-button size="mini" type="danger" @click="deleteItem(scope.$index, scope.row)" v-if='showDelete'>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
</el-main>
<el-footer>
  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,2,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
  </el-pagination>
</el-footer>
</el-container>

<el-dialog :visible.sync='showDialog'>
  <el-form>

    <el-form-item :label="item.key" :label-width="formLabelWidth" v-for='(item, index) in detailClassList' :key='index' v-if='!item.isHide'>
      <el-input v-model="detail[item.value]" auto-complete="off" :disabled='true' v-if='item.isText'></el-input>
      <img class='detail_img' :src='detail[item.value]' v-if='item.isImg' />
      <img class='detail_imgs' :src='v' v-for='(v, i) in detail[item.value]' :key='i' v-if='item.isImgs' />
      <el-input type='textarea' v-model="detail[item.value]" auto-complete="off" :disabled='true' v-if='item.isTexts'></el-input>
    </el-form-item>
    
  </el-form>
</el-dialog>

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
    this.category = this.$route.query.category;
    console.log(this.category);

    if(this.category === 'user'){
      this.showSearchByKeyword = true;
    }else if(this.category === 'order'){
      this.showSearchByKeyword = true;
      this.showSearchByDate = true; 
      this.showSelect = true;
      this.showOperate = true;
      this.showDeliver = true;
      this.showdetail = true;
      this.detailClassList = this.detailConfig[this.category];
    }else if(this.category === 'assess'){
      this.showSearchByKeyword = true;
      this.showSearchByDate = true;
      this.showOperate = true;
      this.showdetail = true;
      this.showDelete = true;
      this.detailClassList = this.detailConfig[this.category];
    }else if(this.category === 'auditing'){
      this.showSearchByKeyword = true;
      this.showSearchByDate = true;
      this.showOperate = true;
      this.showdetail = true;
      this.showResolve = true;
      this.showReject = true;
      this.detailClassList = this.detailConfig[this.category];
    }else if(this.category === 'authorize'){
      this.className = '添加成员';
      this.showAddBtn = true;
      this.showOperate = true;
      this.showDelete = true;
    }

    this.classList = this.config[this.category];

    this.getList()
  },

  data() {
    return {
      category: '',
      showAddBtn: false,
      showSearchByKeyword: false,
      showSearchByDate: false,
      showSelect: false,
      showExport: false,
      showOperate: false,
      showDeliver: false,
      showdetail: false,
      showResolve: false,
      showReject: false,
      showDelete: false,
      config: {
        'user': [
          { key: '头像', value: 'name' },
          { key: '昵称', value: 'company' },
          { key: '联系方式', value: 'price' },
        ],
        'order': [
          { key: '商品名称', value: 'name' },
          { key: '订单号', value: 'company' },
          { key: '买家', value: 'price' },
          { key: '订单状态', value: 'price' },
          { key: '金额', value: 'price' },
          { key: '下单时间', value: 'price' },
        ],
        'assess': [
          { key: '订单号', value: 'company' },
          { key: '商品名称', value: 'name' },
          { key: '商品图片', value: 'img', isImg: true },
          { key: '商品价格', value: 'price' },
          { key: '用户姓名', value: 'price' },
          { key: '用户头像', value: 'img', isImg: true },
          { key: '评价时间', value: 'price' },
          { key: '评价等级', value: 'level' },
        ],
        'auditing': [
          { key: '订单号', value: 'company' },
          { key: '商品名称', value: 'name' },
          { key: '商品图片', value: 'img', isImg: true },
          { key: '商品价格', value: 'price' },
          { key: '评价内容', value: 'price' },
          { key: '评价等级', value: 'level' },
        ],
        'authorize': [
          { key: '姓名', value: 'name', isIcon: true },
          { key: '设计师+', value: 'design', isIcon: true },
          { key: '半包定制', value: 'name', isIcon: true },
          { key: '易居管家', value: 'design', isIcon: true },
          { key: '整居定制', value: 'design', isIcon: true },
          { key: '集成暖通', value: 'design', isIcon: true },
          { key: '主材选购', value: 'design', isIcon: true },
          { key: '家具选购', value: 'design', isIcon: true },
          { key: '易居海外', value: 'design', isIcon: true },
          { key: '用户列表', value: 'design', isIcon: true },
          { key: '订单列表', value: 'design', isIcon: true },
          { key: '运营', value: 'design', isIcon: true },
        ]
      },
      detailConfig: {
        'order': [
          { key: '商品名称', value: 'name', isText: true, },
          { key: '商品图片', value: 'img', isImg: true, },
          { key: '金额', value: 'price', isText: true, },
          { key: '数量', value: 'price', isText: true, },
          { key: '订单编号', value: 'formData.price', isText: true, },
          { key: '运费', value: 'formData.price', isText: true, },
          { key: '下单时间', value: 'formData.price', isText: true, },
          { key: '付款时间', value: 'formData.price', isText: true, },
          { key: '订单状态', value: 'formData.price', isText: true, },
          { key: '收货人', value: 'formData.price', isText: true, },
          { key: '联系方式', value: 'formData.price', isText: true, },
          { key: '收货地址', value: 'formData.price', isText: true, },
          { key: '预约时间', value: 'formData.price', isHide: true, },
          { key: '备注', value: 'formData.price', isHide: true, },
        ],
        'assess': [
          { key: '订单号', value: 'price', isText: true, },
          { key: '商品名称', value: 'name', isText: true, },
          { key: '商品图片', value: 'img', isImg: true, },
          { key: '商品价格', value: 'price', isText: true, },
          { key: '用户姓名', value: 'price', isText: true, },
          { key: '用户头像', value: 'img', isImg: true, },
          { key: '收货人', value: 'price', isText: true, },
          { key: '联系方式', value: 'price', isText: true, },
          { key: '评论时间', value: 'price', isText: true, },
          { key: '评论等级', value: 'price', isText: true, },
          { key: '评论内容', value: 'content', isTexts: true, },
          { key: '评论图片', value: 'imgs', isImgs: true, },
        ],
        'auditing': [
          { key: '订单号', value: 'price', isText: true, },
          { key: '商品名称', value: 'name', isText: true, },
          { key: '商品图片', value: 'img', isImg: true, },
          { key: '商品价格', value: 'price', isText: true, },
          { key: '用户姓名', value: 'price', isText: true, },
          { key: '用户头像', value: 'img', isImg: true, },
          { key: '收货人', value: 'price', isText: true, },
          { key: '联系方式', value: 'price', isText: true, },
          { key: '评论时间', value: 'price', isText: true, },
          { key: '评论等级', value: 'price', isText: true, },
          { key: '评论内容', value: 'content', isTexts: true, },
          { key: '评论图片', value: 'imgs', isImgs: true, },
        ]
      },
      showDialog: false,
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
      detailClassList: [],
      formLabelWidth:'80px',
      formData: {
        name: '',
        company:'',
        detailList: []
      },
      searchKeyWord: '',
      tableData: [],
      className: '',
      classList: [],
      detail: {}, 
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
    addItem(){
      this.showDialog = true;
    },
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
          { name: 'sf开始的浪费口水都发送方SAF', 
            company: 'sfd', 
            img: 'http://yipingda-1257351977.cos.ap-shanghai.myqcloud.com/1538186038763%E7%BB%84-10%402x.png', 
            imgs: [ 'http://yipingda-1257351977.cos.ap-shanghai.myqcloud.com/1538186038763%E7%BB%84-10%402x.png', 
                    'http://yipingda-1257351977.cos.ap-shanghai.myqcloud.com/1538186038763%E7%BB%84-10%402x.png', ],
            price: '324.34', 
            level: 4.5 },
          { name: 'sf开始的浪费口水都发送方SAF', company: 'sfd', price: '324.34', level: 4.5, content: 'sf可是防空双方都是的反馈十六分迫使贷款购房的价格vi哦发动机受到了放到vfgodgvsdfjksdf' },
        ];
        this.total = this.tableData.length// res.pagination.total;
        this.listLoading = false
      },
      showDetail(index, row){
        this.showDialog = true;
        this.detail = row;
        console.log(index, row, this.detail)
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