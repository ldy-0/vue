<style lang="stylus">
  .notice
    .header
      margin-top 20px
      .header-form
        margin-top 30px
</style>
<style>
    .header_box {
        border-radius: 4px;
        min-height: 50px;
        line-height: 50px;
        text-align: center;
        border:1px solid #ccc;
    }
</style>

<template>
<div>
    <el-dialog
        title="提现明细"
        :visible.sync="addNewShow"
        width="60%"
        >
        <el-form :inline="true" :model="formInline" class="form">
          <el-form-item label="累计佣金" :label-width="formLabelWidth">
            <p class="s-no-margin-p">
              ￥{{tempForm.commission}}
            </p>
          </el-form-item>
          <el-form-item label="已提现金额" :label-width="formLabelWidth">
            <p class="s-no-margin-p">
              ￥{{tempForm.withdraw}}
            </p>
          </el-form-item>
          <el-form-item label="剩余佣金" :label-width="formLabelWidth">
            <p class="s-no-margin-p">
              ￥{{tempForm.able}}
            </p>
          </el-form-item>
        </el-form>       
        <el-table
          :data="tableData2"
          stripe 
          v-loading="listLoading" element-loading-text="给我一点时间"
          style="width: 100%" >
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
          <el-table-column
            label="时间" 
            prop="time"
            >
          </el-table-column>
          <el-table-column
            label="金额" 
            prop="count"
            >
          </el-table-column>
          <el-table-column
            label="状态" 
            prop="status"
            >
          </el-table-column>
        </el-table>
        <el-footer>
          <el-pagination background @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="listQuery2.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total2">
          </el-pagination>
        </el-footer>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addNewShow = false">返回</el-button>
        </span>
    </el-dialog>
    <el-container class="notice">
      <el-header class="header" style="height:200px">
          <el-row :gutter="20">
              <el-col :span="12">
                  <div class="grid-content header_box">
                      累计佣金金额 
                      <div style="color:red">${{commission_total}}</div>
                  </div>
              </el-col>
              <el-col :span="12">
                  <div class="grid-content header_box">
                      已提现金额 
                      <div style="color:red">${{withdraw_total}}</div>
                  </div>
              </el-col>
          </el-row>
        <el-form :inline="true" :model="formInline" class="header-form">
          <el-form-item label="查询">
              <el-input v-model="listQuery.search" placeholder="输入手机号码查询"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          </el-form-item>
        </el-form>  

      </el-header>
      <el-main>
          <el-table
            :data="tableData"
            stripe 
            v-loading="listLoading" element-loading-text="给我一点时间"
            style="width: 100%" >
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
            <el-table-column
              label="会员" 
              prop="name"
              >
            </el-table-column>
            <el-table-column
              label="手机号" 
              prop="telephone"
              >
            </el-table-column>
            <el-table-column
              label="累计佣金金额" 
              prop="commission"
              >
            </el-table-column>
            <el-table-column
              label="已提现金额" 
              prop="withdraw"
              >
            </el-table-column>
            <el-table-column
              label="剩余金额" 
              prop="able"
              >
            </el-table-column>
            <el-table-column
              label="操作"
              >
              <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary" 
                @click="look(scope.$index, scope.row)">提现记录</el-button>
              <!-- <el-button
                size="mini" 
                type="danger" 
                @click="deleteItem(scope.$index, scope.row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
      </el-main>
      <el-footer>
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
        </el-pagination>
      </el-footer>
    </el-container>
</div>
</template>
<script>
// getList 接口 获取
// addNotice 接口 添加
import {getSales_api,getSalecount_api,getWithdrawRecord_api} from '@/api/seller' 
const formForNotive = {
        title:'',
        // num:''
      }
export default {
  created(){
    this.getList()
    this.getsalecount()
  },
  data() {
    return {
      //out
      
      isAddItem:true,
      waitAddNotice:false,
      addNewShow:false,

      formForNotive:Object.assign({},formForNotive),
      formLabelWidth:'180px',
      //header
      formInline: {},
      commission_total:0,
      withdraw_total:0,
      // body
      tempForm:{},
      listLoading: false,
      tableData: [],
      tableData2: [],
      member_id:'',
            // footer
      listQuery: {
        page: 1,
        limit: 20,
        search:'',
        time:""
      },
      listQuery2: {
        page: 1,
        limit: 20,
        search:'',
        time:""
      },
      total:1,
      total2:1,
    }
  },
  methods: {
    search(){
      this.getList()
    },
    getList() {
        this.listLoading = true
        let sendData = Object.assign({},this.listQuery)
        if(this.listQuery.search !=''){
          sendData.telephone = this.listQuery.search
        }
      getSales_api(sendData).then(response => {
        if(response&&response.status==0){
          let result = response.data
          let tempTableData = []
          result.forEach((aData)=>{
            tempTableData.push({
              name:aData.member_name,
              id:aData.member_id,
              telephone:aData.member_mobile,
              commission:aData.commission_total,
              withdraw:aData.withdraw_total,
              able:aData.withdraw_able,

            })
          })
        this.tableData = tempTableData
        this.total = response.pagination&&response.pagination.total?response.pagination.total:1
        }else{
          this.listLoading = false
        }
        this.listLoading = false
      })
    },

    getsalecount(){
      let sendData = {}
      getSalecount_api(sendData).then(response=>{
        if(response&&response.status == 0){
          let res = response.data
          this.commission_total = Number(res.commission_total).toFixed(2)
          this.withdraw_total = Number(res.withdraw_total).toFixed(2)
        }
      })
    },

    look(index,row){
      this.addNewShow = true
      this.listLoading = true
      this.tempForm = this.tableData[index]
      let id = row.id
      this.member_id = id
      this.getList2(id)
    },
    getList2(id){
      let sendData = Object.assign({},this.listQuery2)
      sendData.member_id = id
      getWithdrawRecord_api(sendData).then(res=>{
        if(res&& res.status == 0){
          let result2 = res.data
          let tempTableData2 = []
          result2.withdraw_info.forEach((aData)=>{
            tempTableData2.push({
              time:aData.ctime,
              count:aData.money,
              status:aData.status,
            })
          })
          this.tableData2 = tempTableData2
          this.total2 = res.pagination&&res.pagination.total?res.pagination.total:1
        }
        this.listLoading = false
      })
    },
//----------------------------------------------------
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSizeChange2(val) {
      this.listQuery2.limit = val
      this.getList2(this.member_id)
    },
    handleCurrentChange2(val) {
      this.listQuery2.page = val
      this.getList2(this.member_id)
    },
  }
}
</script>