<style lang="css">
</style>

<template>
<div>
<el-dialog
  title="商品明细"
  :visible.sync="detailShow"
  width="80%"
  >
  <el-form :model="formForNotive" v-loading="editLoading" size="medium" >
    <el-form-item label="编号" :label-width="formLabelWidth">
      <p class="hbs-no-margin-p">
        {{formForNotive.num}}
      </p>
    </el-form-item>
    <el-form-item label="金额" :label-width="formLabelWidth">
      <p class="hbs-no-margin-p">
        {{formForNotive.amount}}
      </p>
    </el-form-item>
    <el-form-item label="折扣" :label-width="formLabelWidth">
      <p class="hbs-no-margin-p">
        {{formForNotive.fee}}
      </p>
    </el-form-item>
    <el-form-item label="运费" :label-width="formLabelWidth">
      <p class="hbs-no-margin-p">
        {{formForNotive.trans}}
      </p>
    </el-form-item>
    <el-form-item label="下单时间" :label-width="formLabelWidth">
      <p class="hbs-no-margin-p">
        {{formForNotive.orderTime}}
      </p>
    </el-form-item>
    <el-form-item label="付款时间" :label-width="formLabelWidth">
      <p class="hbs-no-margin-p">
        {{formForNotive.payTime}}
      </p>
    </el-form-item>
    <el-form-item label="退款时间" :label-width="formLabelWidth">
      <p class="hbs-no-margin-p">
        {{formForNotive.returnTime}}
      </p>
    </el-form-item>
    <el-form-item label="订单状态" :label-width="formLabelWidth">
      <p class="hbs-no-margin-p">
        {{formForNotive.state}}
      </p>
    </el-form-item>
    <el-form-item label="订单列表" :label-width="formLabelWidth">
      <el-table 
         
      :data="formForNotive.goodsTable"
      stripe 
       element-loading-text="给我一点时间"
      style="margin-top:-10px;margin-left:10px"  >
        <el-table-column
            label="商品图片"
            >
            <template slot-scope="scope">
            <img :src="scope.row.goods_image" alt="" width="100px">
            </template>
        </el-table-column>
        <el-table-column
            label="商品名" 
            prop="goods_name"
            >
        </el-table-column>
        <el-table-column
            label="价格" 
            prop="goods_price"
            >
        </el-table-column>
        <el-table-column
            label="编号" 
            prop="goods_num"
            >
        </el-table-column>
        <el-table-column
            label="实付金额" 
            prop="goods_pay_price"
            >
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item label="收货信息" :label-width="formLabelWidth" v-if="formForNotive.buyerInfo">
      <el-form >
        <el-form-item label="收货地址" :label-width="formLabelWidth">
          <p class="hbs-no-margin-p">
            {{formForNotive.buyerInfo.address}}
          </p>
        </el-form-item>
        <el-form-item label="收货人" :label-width="formLabelWidth">
          <p class="hbs-no-margin-p">
            {{formForNotive.buyerInfo.name}}
          </p>
        </el-form-item>
        <el-form-item label="收货人电话" :label-width="formLabelWidth">
          <p class="hbs-no-margin-p">
            {{formForNotive.buyerInfo.phone}}
          </p>
        </el-form-item>
      </el-form>
    </el-form-item>

  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="detailShow = false">返 回</el-button>
  </span>
</el-dialog>
<el-container class="notice">
<el-header class="header" style="height:auto !important">
  <el-form :inline="true"  class="form">

  </el-form>  
  <el-form  :inline="true" class="form">

  </el-form>     
</el-header>
<el-main>
    <el-table
      :data="tableData"
      stripe 
      v-loading="listLoading" element-loading-text="给我一点时间"
      style="width: 100%" >

      <el-table-column
        label="店铺头像"
        >
        <template slot-scope="scope">
          <div style="width:100px;height:100px;align-items:center;display:flex;">
            <img :src="scope.row.storeImg" alt="" style="width:100px">
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="商品名" 
        prop="goodsName"
        >
      </el-table-column> -->
      <!-- <el-table-column
        label="类型" 
        prop="goodsType"
        >
      </el-table-column> -->
      <el-table-column
        label="编号" 
        prop="num"
        >
      </el-table-column>
      <!-- <el-table-column
        label="买家账号" 
        prop="customer"
        >
      </el-table-column>
      <el-table-column
        label="买家电话" 
        prop="customerPhone"
        >
      </el-table-column> -->
        <el-table-column
        label="状态" 
        >
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.state }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="价格" 
        prop="money"
        >
      </el-table-column>
      <!-- <el-table-column
        label="类别" 
        prop="buyType"
      </el-table-column>> -->
      <el-table-column
        label="退款时间" 
        prop="time"
        >
      </el-table-column>
      <el-table-column
        label="操作" 
        >
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="lookItem(scope.$index, scope.row)">查看明细</el-button>
          <el-button size="mini" type="danger" v-if="scope.row.state==='待退款'||scope.row.state==='待退货'" @click="changeItem(scope.$index, scope.row)">完成退货退款</el-button>
        </template>
      </el-table-column>
    </el-table>
</el-main>
<el-footer>
  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
  </el-pagination>
</el-footer>
</el-container>
</div>
</template>
<script>
//getROrderList_api 接口异常 php :未定义变量 bannnerModel
import {getROrderList_api,getROrder_api,changeROrder_api,  getReturnList,editReturnList} from '@/api/seller'
export default {
  created(){
    this.getList()
    // getROrder_api({order_id:59})
  },
  data() {
    return {
      // out
        formLabelWidth:'140px',
        formForNotive:{},
        editLoading:false,
        detailShow:false,
        tableData2:[],
      // header
        //excel
          tableDataAll:'',
          autoWidth:true,
          filename:'实物订单Excel',
          exportExcelStatus:'导出',
          downloadLoading:false,
        orderState:'',
        orderStateOptions:[{
            value: '',
            label: '全部订单'
          },{
            value: 0,
            label: '已取消'
          }, {
            value: 10,
            label: '未付款'
          }, {
            value: 20,
            label: '已付款'
          }, {
            value: 30,
            label: '已发货'
          }, {
            value: 40,
            label: '已收货'
        }],
      // body
        listLoading: false,
        tableData: [],
      // footer
        listQuery: {
          page: 1,
          limit: 20,
          search:"",
          time:""
        },
        total:1,
      // -------------------------
    }
  },
  methods: {
    //out
    
    //head
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      async handleDownload() {
        this.downloadLoading = true
        let allRes = await this.getList(true).catch(e=>{
          this.$notify({
              title: '失败',
              message: '操作失败:'+e.toString(),
              type: 'error'
            })
          return 0
        })
        console.log('allRes',allRes)
        if(!allRes){
          this.downloadLoading = false
          return console.log('获取数据失败:handleDownload')
        }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['订单ID', '订单金额', '订单号', '订单状态', '交易日期']
          const filterVal = ['id', 'money', 'num', 'state', 'time']
          const tableDataAll = this.tableDataAll
          const data = this.formatJson(filterVal, tableDataAll)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth
          })
          this.downloadLoading = false
        })
      },
      search(){ // 此时listQuery已经改变
        this.listQuery.page = 1
        this.getList()
      },
    // body
      getTableTagType(typeid){
        switch(typeid){
          case 0 :
          return 'info'
          case 10 :
          return ''
          case 20 :
          return 'success'
          default :
          return ''
        }
      },
      changeNewNotice(id,num){
        let sendData = {
          refund_id : id,
          order_type : 'vr_order',
        }
        editReturnList(sendData).then((res)=>{
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
          this.waitAddNotice = false
          console.error('editReturnList:',err)
        })
      },  
      changeItem(index,raw){
        let id = raw.id
        this.$confirm(`请确认您已退货退款`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.changeNewNotice(id)
        }).catch(()=>{
          this.$notify.info({
            title: '消息',
            message: '已取消'
          });
        })
      },
      lookItem(index,raw) {
        console.log()
        if(!raw||!raw.id){
            this.$notify.error({
              title: '错误',
              message: 'id不存在'
          })
          return
        }
        let data = raw.data
        this.detailShow = true
            let tempForm = {}
            // 编号
            tempForm.num = data.order_sn
            // 金额
            tempForm.amount = data.order_amount
            // 运费
            tempForm.trans = data.shipping_fee
            // 下单时间
            tempForm.orderTime = data.add_time
            // 付款时间
            tempForm.payTime = data.payment_time
            // 订单状态
            tempForm.state = data.order_state
            // 商品列表
            tempForm.goodsTable = data.order_goods
            // 收货信息
            tempForm.buyerInfo = data.order_reciver_info 
            
            // 退款时间
            tempForm.returnTime = data.refund_add_time
            // 折扣
            tempForm.fee = data.shipping_fee
            tempForm.reason_info = data.reason_info
            tempForm.express_name = data.express_name
            tempForm.invoice_no = data.invoice_no
            this.formForNotive = tempForm //基础form完成填充
          
      },
      async getList(all) {
        // 立一个flag 因为当前函数 promise化 需要检测 接口返回状态 
        let flag = false
        this.listLoading = true
        let sendData = Object.assign({},this.listQuery)
        sendData.order_type = 'vr_order' //默认实物
        if(all){
          sendData.limit = 0
        }
        if(typeof this.orderState === 'number'){
          sendData.order_state = this.orderState
        }
        await getReturnList(sendData).then(response => {
          this.listLoading = false
          if(response&&response.status==0){
            // 将flag 状态变为true 表明获取接口成功
            flag = true
            let result = response.data
            if(!result){
              result =[]
             console.log('getROrderList_api 没有任何数据')
            }
            let tempTableData = []
            result.forEach((aData)=>{
              tempTableData.push({
                id:aData.refund_id,
                storeImg:aData.store_avatar,
                num:aData.order_sn,
                money:aData.order_amount,
                time:aData.refund_add_time,
                state:aData.order_state,
                data:aData
                // goodsList:aData.order_goods,
              })
            })
            if(all){
              this.tableDataAll = tempTableData
            }else{
              this.tableData = tempTableData
            }
          }
          console.log("getList",response)
          // this.list = response.data
          this.total = response.pagination&&response.pagination.total?response.pagination.total:1
        })
        return flag
      },
    // foot
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
    // ----------------------------
    // body table表单获取数据
      
    //尝试 测试 接口 ----------------------------------
    //header
    // changeStaticType(index){
    //   this.activButton = index
    //   console.log('search changeStaticType')
    // },
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
    
    
  }
}
</script>