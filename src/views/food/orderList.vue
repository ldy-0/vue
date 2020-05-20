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

    <!-- <el-form-item v-if='showSearchByOrder'>
      <el-input style="width: 340px;" placeholder="请输入订单号" v-model="searchSN"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchBySN">查询</el-button>
    </el-form-item> -->

    <!-- <el-form-item label="时间" v-if='showSearchByDate'>
        <el-date-picker style="width:340px" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
          v-model="listQuery.time">
        </el-date-picker>
        <el-button type="primary" icon="el-icon-search" @click="searchByDate">查询</el-button>
    </el-form-item> -->

    <el-form-item label="订单状态" :label-width="formLabelWidth" prop='class' v-if='showSelect'> 
      <el-select placeholder="请选择" v-model='orderState' @change='changeStatus'> <!-- multiple  -->
        <el-option v-for="item in categories" :key="item.id" :label="item.title" :value="item.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="" v-if='showExport'>
      <el-button  type="primary" icon="document" @click="exportFile">导出Excel</el-button>
      <span class="hbs-inline-tips">导出所有数据，这个过程可能会需要花费  <span class="hbs-hot">几分钟</span> 的时间，请耐心等待</span>
    </el-form-item>

  </el-form>       
</el-header>

<el-main>
    <customTable :config='tableConfig' 
                  :data='tableData' 
                  :isLoading='listLoading' 
                  :classList='classList' 
                  :total='total' 
                  @change='changeList' 
                  @showDetail='showDetail'
                  @changeState='changeState' ref='table'></customTable>
    <!-- <el-table :data="tableData" stripe v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%" >

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
          <el-button size="mini" type="text" @click="showDetail(scope.$index, scope.row)" v-if='showdetail'>详情</el-button>
        </template>
      </el-table-column>
    </el-table> -->
</el-main>
<!-- <el-footer>
  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,2,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
  </el-pagination>
</el-footer> -->
</el-container>

<el-dialog :visible.sync='isShowDialog'>
  <el-form :disabled='isDisabled'>

    <el-form-item :label="item.key" :label-width="formLabelWidth" v-for='(item, index) in detailClassList' :key='index' v-if='!item.isHide'>

      <el-input v-model="detail[item.value]" auto-complete="off" v-if='item.isText'></el-input>

      <img class='detail_img' :src='detail[item.value]' v-if='item.isImg' />

      <div v-if='item.isImgs'>
        <img class='detail_imgs' :src='v' v-for='(v, i) in detail[item.value]' :key='i' />
      </div>

      <el-input type='textarea' v-model="detail[item.value]" auto-complete="off" :disabled='true' v-if='item.isTexts'></el-input>

      <el-radio-group v-model='detail[item.value]' v-if='item.isRadio'>
        <el-radio label=1>是</el-radio>
        <el-radio label=0>否</el-radio>
      </el-radio-group>
    </el-form-item>
    
  </el-form>

  <!-- <span slot="footer" class="dialog-footer">
    <el-button @click="isShow=false; waitAddNotice=false;" >取消</el-button>
    <el-button type="primary" :disabled="waitAddNotice" :loading="waitAddNotice" @click="submitForm('ruleForm')">确 定</el-button>
  </span> -->
</el-dialog>

</div>
</template>
<script>

import api from '@/api/seller'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import customTable from '@/components/customTable/index.vue'
import upLoadFile from '@/utils/aahbs.js'

export default {
  components: {
    UploadExcelComponent,
    customTable,
  },

  created(){
    this.showSearchByKeyword = true;
    this.showSearchByOrder = true;
    this.showSelect = true;
    this.showExport = true;
    this.showOperate = true;
    this.showDeliver = true;
    this.showdetail = true;
    this.isDisabled = true;

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
      tableConfig: {
        showOperate: true,
        showDetail: true,
        showDeliver: true,
      },
      classList: [
        { key: '店铺头像', value: 'store_avatar', isImg: true },
        { key: '编号', value: 'order_sn' },
        { key: '状态', value: 'order_state' },
        { key: '价格', value: 'order_amount' },
        { key: '订单类别', value: 'payment_name' },
        { key: '下单时间', value: 'add_time' },
      ],
      detailClassList: [
          { key: '商品名称', value: 'goods_name', isText: true, },
          { key: '商品图片', value: 'goods_image', isImg: true, },
          { key: '金额', value: 'order_amount', isText: true, },
          { key: '数量', value: 'goods_num', isText: true, },
          { key: '订单编号', value: 'order_sn', isText: true, },
          { key: '下单时间', value: 'add_time', isText: true, },
          { key: '付款时间', value: 'payment_time', isText: true, },
          { key: '订单状态', value: 'order_state', isText: true, },
          { key: '收货人', value: 'name', isText: true, },
          { key: '联系方式', value: 'phone', isText: true, },
          { key: '收货地址', value: 'address', isText: true, },
          { key: '备注', value: 'remark', isHide: true, },
      ],
      isShowDialog: false,
        waitAddNotice:false,
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
      },
      formLabelWidth:'80px',
      formData: {
        name: '',
        company:'',
        detailList: []
      },
      searchKeyWord: '',
      searchSN: null,
      tableData: [],
      className: '',
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

      // this.detailClassList = row ? this.detailConfig[this.category] : this.detailConfig[this.category].slice(0, 2);

      this.initDetail(row);

      this.isShowDialog = true;
      this.isAddItem = !row;

    },
    searchByPhone(){
      console.log('search ----', this.searchKeyWord);
      this.listQuery.order_sn = this.searchKeyWord;
      this.getList();
    },
    searchBySN(){
      this.$refs.table.init();
      console.log('search ----', this.searchSN);
      this.listQuery.order_sn = this.searchSN;
      this.getList();
    },
    searchByDate(){
      console.log(this.listQuery.time)
      this.listQuery.starttime = new Date(this.listQuery.time[0]).toISOString().split('T')[0]
      this.listQuery.endtime = new Date(this.listQuery.time[1]).toISOString().split('T')[0]
      
      this.listQuery.page = 1
      delete this.listQuery.time
      this.getList()
    },
    changeStatus(id){
      this.$refs.table.init();
      this.getOrder(id);
    },
    async exportFile() {
        let loading = this.$loading({ fullscreen: true })

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
          loading.close() 
        })
    },
    submitForm(r){

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
      importDone({ results, header }) { // upload xls success
        this.tableData = results
        this.tableHeader = header
        console.log('-- import success', this.tableData, this.tableHeader)
      },
      //
      getList() { //获取列表
        let loading = this.$loading({ fullscreen: true })
        console.log('listQuery --', this.listQuery);
        
        this.getOrder();

        loading.close(); 
      },
      showDetail(row){
        this.isShowDialog = true;
        // this.initDetail(row);

        this.getOrderDetail(row.order_id)

        console.log(row, this.detail)
      },
    initDetail(item){
      let detail = {};
      
      if(typeof item === 'object'){
        for(let key in item){ detail[key] = item[key]; }
      }
     
      this.detail = detail;
      console.log('init detail done --', item, this.detail);
    },
    // handleSizeChange(val) {
    //   console.log('--customTable--', this.$refs.table.init)
    //   this.listQuery.limit = val
    //   this.getList()
    // },
    // handleCurrentChange(val) {
    //   this.listQuery.page = val
    //   this.getList()
    // },
    // 
    changeList(v){
      console.log('change list ---', v);
      this.listQuery = v;
      
      this.getList();
    },
    format(data){
      data.forEach(item => item.seller_limits.forEach(v => item[v] = '1') );
      return data;
    },
    async getOrder(item){
      this.listQuery.order_state = item === 0 ? 0 : item;
      this.listQuery.order_type = 10;
      
      let res = await api.getOrderList(this.listQuery, this);

      delete this.listQuery.order_state;
      if(this.listQuery.order_sn) delete this.listQuery.order_sn;
      this.tableData = res.data;
      this.total = res.pagination.total;
      this.listLoading = false;
    },
    async getOrderDetail(order_id){
      let res = await api.getOrderDetail.call(this, {order_id}),
          o = res.data[0];

      for(let key in o.order_reciver_info){
        o[key] = o.order_reciver_info[key] 
      }
      for(let key in o.order_goods[0]){
        o[key] = o.order_goods[0][key] 
      }
      this.initDetail(o) 
    },
    async changeState(row){
      let param = {
        order_id: row.order_id,
        state_type: 'deliver_goods'
      };
      let res = await api.updateOrderState(param, this)

      this.getOrder(this.orderState)
    },
    async refund(index, row){
      if(row.order_state === '已完成') return ;

      let res = await api.refund(row.refund_id, {}, this);

      this.getList()
    },
    
  }
}
</script>