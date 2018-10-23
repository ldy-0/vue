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

    <el-form-item v-if='showSearchByKeyword'>
      <el-input style="width: 340px;" placeholder="请输入联系方式" v-model="searchKeyWord"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchByPhone">查询</el-button>
    </el-form-item>

    <el-form-item v-if='showSearchByOrder'>
      <el-input style="width: 340px;" placeholder="请输入订单号" v-model="searchKeyWord"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchByPhone">查询</el-button>
    </el-form-item>

    <el-form-item label="时间" v-if='showSearchByDate'>
        <el-date-picker style="width:340px" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
          v-model="listQuery.time">
        </el-date-picker>
        <el-button type="primary" icon="el-icon-search" @click="searchByDate">查询</el-button>
    </el-form-item>

    <el-form-item label="订单状态" :label-width="formLabelWidth" prop='class' v-if='showSelect'> 
      <el-select placeholder="请选择" v-model='orderState' @change='changeStatus'> <!-- multiple  -->
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
          <el-button size="mini" type="text" @click="showDialog(scope.$index, scope.row)" v-if='showEdit'>编辑</el-button>
          <el-button size="mini" type="text" @click="sendGoods(scope.$index, scope.row)" v-if="showDeliver && scope.row.order_state === '已支付'">发货</el-button>
          <el-button size="mini" type="text" @click="refund(scope.$index, scope.row)" v-if='showRefund'>{{scope.row.order_state === '待退款' ? '退款' : '已退款'}}</el-button>
          <el-button size="mini" type="text" @click="showDetail(scope.$index, scope.row)" v-if='showdetail'>详情</el-button>
          <el-button size="mini" type="text" @click="resolve(scope.$index, scope.row)" v-if='showResolve && !scope.row.geval_state'>通过</el-button>
          <!-- <el-button size="mini" type="text" @click="reject(scope.$index, scope.row)" v-if='showReject'>拒绝</el-button> -->
          <el-button size="mini" type="text" @click="showDeleteDialog(scope.$index, scope.row)" v-if='showDelete'>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
</el-main>
<el-footer>
  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
  </el-pagination>
</el-footer>
</el-container>

<el-dialog :visible.sync='isShowDialog'>
  <el-form :disabled='isDisabled'>

    <el-form-item :label="item.key" :label-width="formLabelWidth" v-for='(item, index) in detailClassList' :key='index' v-if='!item.isHide'>

      <!-- 单行文本 -->
      <el-input v-model="detail[item.value]" auto-complete="off" v-if='item.isText'></el-input>

      <img class='detail_img' :src='detail[item.value]' v-if='item.isImg' />

      <img class='detail_imgs' :src='v' v-for='(v, i) in detail[item.value]' :key='i' v-if='item.isImgs' />

      <el-input type='textarea' v-model="detail[item.value]" auto-complete="off" :disabled='true' v-if='item.isTexts'></el-input>

      <!-- 单选 -->
      <el-radio-group v-model='detail[item.value]' @change='changeRadio(item, $event)' v-if='item.isRadio'>
        <el-radio label='1'>是</el-radio>
        <el-radio label='0'>否</el-radio>
      </el-radio-group>
    </el-form-item>
    
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="isShow=false; waitAddNotice=false;" >取消</el-button>
    <el-button type="primary" :disabled="waitAddNotice" :loading="waitAddNotice" @click="submitForm('ruleForm')">确 定</el-button>
  </span>
</el-dialog>

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
      this.isDisabled = true;
      this.detailClassList = this.detailConfig[this.category];
    }else if(this.category === 'afterService'){
      this.showSearchByKeyword = true;
      this.showSearchByDate = true; 
      this.showSelect = true;
      this.showOperate = true;
      this.showRefund = true;
      this.showdetail = true;
      this.isDisabled = true;
      this.detailClassList = this.detailConfig[this.category];
      this.categories = [
        { id: null, title: '全部' },
        { id: 1, title: '未退款' },
        { id: 3, title: '已退款' },
      ]
    }else if(this.category === 'assess'){
      this.showSearchByOrder = true;
      this.showSearchByDate = true;
      this.showOperate = true;
      this.showdetail = true;
      this.showResolve = true;
      this.showReject = true;
      this.showDelete = true;
      this.isDisabled = true;
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
      this.showEdit = true;
      this.showDelete = true;
      this.detailClassList = this.detailConfig[this.category];
    }

    this.classList = this.config[this.category];

    this.getList()
  },

  data() {
    return {
      category: '',
      showAddBtn: false,
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
      config: {
        'user': [
          { key: '头像', value: 'member_avatar', isImg: true, },
          { key: '昵称', value: 'member_truename' },
          { key: '联系方式', value: 'member_mobile' },
        ],
        'order': [
          { key: '', value: 'goods_image', isImg: true },
          { key: '商品名称', value: 'goods_name' },
          { key: '订单号', value: 'order_sn' },
          { key: '买家昵称', value: 'buyer_name' },
          { key: '买家手机号', value: 'buyer_telephone' },
          { key: '订单状态', value: 'order_state' },
          { key: '金额', value: 'order_amount' },
          { key: '下单时间', value: 'add_time' },
        ],
        'afterService': [
          { key: '', value: 'goods_image', isImg: true },
          { key: '商品名称', value: 'goods_name' },
          { key: '订单号', value: 'order_sn' },
          { key: '买家昵称', value: 'buyer_name' },
          { key: '买家手机号', value: 'buyer_telephone' },
          { key: '状态', value: 'order_state' },
          { key: '金额', value: 'order_amount' },
          { key: '下单时间', value: 'add_time' },
        ],
        'assess': [
          { key: '订单号', value: 'geval_orderno' },
          { key: '商品名称', value: 'geval_goodsname' },
          { key: '商品图片', value: '', isImg: true },
          { key: '商品价格', value: 'geval_goodsprice' },
          { key: '用户姓名', value: 'geval_frommembername' },
          { key: '用户头像', value: 'geval_frommemberavatar', isImg: true },
          { key: '评价时间', value: 'assess_time' },
          { key: '评价等级', value: 'geval_scores' },
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
          { key: '姓名', value: 'seller_nick', },
          { key: '设计师+', value: 'design', isIcon: true },
          { key: '半包定制', value: 'bb', isIcon: true },
          { key: '易居管家', value: 'gj', isIcon: true },
          { key: '整居定制', value: 'zj', isIcon: true },
          { key: '集成暖通', value: 'jc', isIcon: true },
          { key: '主材选购', value: 'zc', isIcon: true },
          { key: '家具选购', value: 'jj', isIcon: true },
          { key: '易居海外', value: 'hw', isIcon: true },
          { key: '用户列表', value: 'user', isIcon: true },
          { key: '订单列表', value: 'order', isIcon: true },
          { key: '运营', value: 'server', isIcon: true },
        ]
      },
      detailConfig: {
        'order': [
          { key: '商品名称', value: 'goods_name', isText: true, },
          { key: '商品图片', value: 'goods_image', isImg: true, },
          { key: '金额', value: 'order_amount', isText: true, },
          { key: '数量', value: 'goods_num', isText: true, },
          { key: '订单编号', value: 'order_sn', isText: true, },
          { key: '运费', value: 'shipping_fee', isText: true, },
          { key: '下单时间', value: 'add_time', isText: true, },
          { key: '付款时间', value: 'payment_time', isText: true, },
          { key: '订单状态', value: 'order_state', isText: true, },
          { key: '收货人', value: 'name', isText: true, },
          { key: '联系方式', value: 'phone', isText: true, },
          { key: '收货地址', value: 'address', isText: true, },
          { key: '预约时间', value: 'formData.price', isHide: true, },
          { key: '备注', value: 'remark', isHide: true, },
        ],
        'afterService': [
          { key: '商品名称', value: 'goods_name', isText: true, },
          { key: '商品图片', value: 'goods_image', isImg: true, },
          { key: '金额', value: 'order_amount', isText: true, },
          { key: '数量', value: 'goods_num', isText: true, },
          { key: '订单编号', value: 'order_sn', isText: true, },
          { key: '运费', value: 'shipping_fee', isText: true, },
          { key: '下单时间', value: 'add_time', isText: true, },
          { key: '付款时间', value: 'payment_time', isText: true, },
          { key: '订单状态', value: 'refund_state', isText: true, },
          { key: '收货人', value: 'name', isText: true, },
          { key: '联系方式', value: 'phone', isText: true, },
          { key: '收货地址', value: 'address', isText: true, },
        ],
        'assess': [
          { key: '订单号', value: 'geval_orderno', isText: true, },
          { key: '商品名称', value: 'geval_goodsname', isText: true, },
          { key: '商品图片', value: 'img', isImg: true, },
          { key: '商品价格', value: 'geval_goodsprice', isText: true, },
          { key: '用户姓名', value: 'geval_frommembername', isText: true, },
          { key: '用户头像', value: 'geval_frommemberavatar', isImg: true, },
          { key: '收货人', value: 'price', isText: true, },
          { key: '联系方式', value: 'price', isText: true, },
          { key: '评论时间', value: 'assess_time', isText: true, },
          { key: '评论等级', value: 'geval_scores', isText: true, },
          { key: '评论内容', value: 'geval_content', isTexts: true, },
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
        ],
        'authorize': [
          { key: '账号', value: 'seller_nick', isText: true },
          { key: '密码', value: 'seller_password', isText: true },
          { key: '设计师+', value: 'design', isRadio: true },
          { key: '半包定制', value: 'bb', isRadio: true },
          { key: '易居管家', value: 'gj', isRadio: true },
          { key: '整居定制', value: 'zj', isRadio: true },
          { key: '集成暖通', value: 'jc', isRadio: true },
          { key: '主材选购', value: 'zc', isRadio: true },
          { key: '家具选购', value: 'jj', isRadio: true },
          { key: '易居海外', value: 'hw', isRadio: true },
          { key: '用户列表', value: 'user', isRadio: true },
          { key: '订单列表', value: 'order', isRadio: true },
          { key: '运营', value: 'server', isRadio: true },
        ]
      },
      isShowDialog: false,
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
        { id: null, title: '全部' },
        { id: 0, title: '已取消' },
        { id: 10, title: '未付款' },
        { id: 20, title: '已付款' },
        { id: 30, title: '已发货' },
        { id: 40, title: '已收货' },
        { id: 50, title: '未评价' },
      ],
      orderState: '',
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
    showDialog(index, row){

      this.detailClassList = row ? this.detailConfig[this.category] : this.detailConfig[this.category].slice(0, 2);

      this.initDetail(row);

      this.isShowDialog = true;
      this.isAddItem = !row;

    },
    searchByPhone(){
      console.log('search ----', this.searchKeyWord);
      this.listQuery.search = this.searchKeyWord;
      this.getList();
    },
    searchByDate(){
      console.log(this.listQuery.time)
      // this.listQuery.starttime = new Date(this.listQuery.time[0]).toISOString().split('T')[0]
      // this.listQuery.endtime = new Date(this.listQuery.time[1]).toISOString().split('T')[0]
      this.listQuery.starttime = new Date(this.listQuery.time[0]).toLocaleDateString().replace(/\//g, '-');
      this.listQuery.endtime = new Date(this.listQuery.time[1]).toLocaleDateString().replace(/\//g, '-');
      
      this.listQuery.page = 1
      delete this.listQuery.time
      this.getList()
    },
    changeStatus(id){
      if(this.category === 'order'){
        this.getOrder(id)
      }else if(this.category === 'afterService'){
        this.getAfterService(id)
      }
    },
    changeRadio(item, value){
      console.log('- radio -', this.detail, item, value)
    },
    submitForm(r){

      // let res = await this.$refs[formName].validate().catch(e => e);
      // if(!res) return ;

      this.waitAddNotice = true // 防点击

      this.submit();
    },
    async submit(){
      if(!this.isAddItem){
        let o = this.detail;
        o.seller_limits = [];

        for(let key in o){ // 设置权限
          o[key] === '1' ? o.seller_limits.push(key) : void(0);
        }
      }

      this.detail.sellergroup_id = 0;
      this.detail.seller_name = this.detail.seller_nick;
      console.log('detail', this.detail);

      let res = this.isAddItem ? await api.setUser(this.detail, this) : await api.updateUser(this.detail.seller_id, this.detail, this);

      this.waitAddNotice = false;
      this.isShowDialog = false;  
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
        this.listLoading = true
        console.log('listQuery --', this.listQuery);
        
        if(this.category === 'authorize'){
          this.getUser();
        }else if(this.category === 'user'){
          this.getMember();
        }else if(this.category === 'order'){
          this.getOrder();
        }else if(this.category === 'afterService'){
          this.getAfterService();
        }else if(this.category === 'assess'){
          this.getAssess();
        }
        
      },
      showDetail(index, row){
        this.isShowDialog = true;
        this.detail = row;
        if(this.category === 'order'){
          this.getOrderDetail(row.order_id)
        }else if(this.category === 'assess'){
          this.getAssessDetail(row.geval_id)
        }else if(this.category === 'afterService'){
          this.getAfterServiceDetail(row.refund_id)
        }

        console.log(index, row, this.detail)
      },
      showDeleteDialog(index,row){

        this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteItem(row)
        }).catch(()=>{ this.$notify.info({ title: '消息', message: '已取消' }); })
      },
      async deleteItem(row){
        if(this.category === 'authorize'){
          this.deleteUser(row.seller_id);
        }else if(this.category === 'assess'){
          this.deleteAssess(row.geval_id)
        }

      },
      async deleteUser(id){
        let res = await api.deleteUser(id, null, this);

        this.getList();
      },
      async deleteAssess(id){
        let res = await api.deleteAssess(id, null, this);

        this.getList();
      },
    initDetail(item){
      let o = {};
      
      if(typeof item === 'object'){
        if(this.category === 'authorize'){
          for(let key in item){ o[key] = item[key]; }
          this.detailClassList.map(v => v.value).forEach(v => o[v] = item[v] || '0')
        }else{
          for(let key in item){ o[key] = item[key]; }
        }
      }
     
      this.detail = o;
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
    async getUser(){
      let res = await api.getUserList(this.listQuery);

      this.tableData = this.format(res.data);
      this.total = this.tableData.length// res.pagination.total;
      this.listLoading = false
    },
    format(data){
      data.forEach(item => item.seller_limits.forEach(v => item[v] = '1') );
      if(data[0].is_admin === 1) data.shift()
      return data;
    },
    async getMember(){
      
      let res = await api.getMember(this.listQuery);

      this.tableData = res.data;
      this.total = res.pagination.total;
      this.listLoading = false;
    },
    async getOrder(item){
      this.listQuery.order_state = item || null;
      let res = await api.getOrderList(this.listQuery);

      delete this.listQuery.order_state;
      this.tableData = res.data;
      this.total = res.pagination.total;
      this.listLoading = false;
    },
    async getOrderDetail(order_id){
      let res = await api.getOrderDetail(order_id, {order_id}, this),
          o = res.data[0];

      for(let key in o.order_reciver_info){
        o[key] = o.order_reciver_info[key] 
      }
      for(let key in o.order_goods[0]){
        o[key] = o.order_goods[0][key] 
      }
      this.initDetail(o) 
    },
    async sendGoods(index, row){
      let param = {
        order_id: row.order_id,
        state_type: 'deliver_goods'
      };
      let res = await api.updateOrder(row.order_id, param, this)

      this.getOrder(this.orderState)
    },
    async getAfterService(item){
      this.listQuery.refund_state = item;
      let res = await api.getRefundList(this.listQuery);

      delete this.listQuery.refund_state;
      this.tableData = res.data;
      this.total = res.pagination.total;
      this.listLoading = false;
    },
    async refund(index, row){
      if(row.order_state === '已完成') return ;

      let res = await api.refund(row.refund_id, {}, this);

      this.getList()
    },
    async getAfterServiceDetail(id){
      let res = await api.getRefund(id, null, this),
          o = res.data;

      for(let key in o.order_reciver_info){
        o[key] = o.order_reciver_info[key] 
      }
      for(let key in o.order_goods[0]){
        o[key] = o.order_goods[0][key] 
      }
      this.initDetail(o)
    },
    async getAssess(){
      let res = await api.getAssessList(this.listQuery)

      res.data.forEach(v => v.assess_time = `${new Date(Number(v.geval_addtime) * 1000).toISOString().split('T')[0]} ${new Date(Number(v.geval_addtime) * 1000).toTimeString().split(' ')[0]}` )
      this.tableData = res.data;
      this.total = res.pagination.total;
      this.listLoading = false;
    },
    async getAssessDetail(id){
      let res = await api.getAssessDetail(id, null, this),
          o = res.data;

      o.assess_time = `${new Date(Number(o.geval_addtime) * 1000).toISOString().split('T')[0]} ${new Date(Number(o.geval_addtime) * 1000).toTimeString().split(' ')[0]}`
      o.imgs = o.geval_image !== '' ? JSON.parse(o.geval_image) : []
      this.initDetail(o)
    },
    async resolve(index, row){
      let res = await api.auditingAssess(row.geval_id, null, this);

      this.getList()
    },
    async reject(){
      // let res = await 
    }
  }
}
</script>