<style lang="stylus" scoped>
  .notice
    .header
      margin-top 20px   
  .header-form   
    margin-left 50px
</style>

<template>
<div>
<el-container class="notice">
<el-header class="header" style="height:100px">
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
        label="时间"
        prop="time"
        >
      </el-table-column>
      <el-table-column
        label="会员名称"
        prop="username"
        >
      </el-table-column>
      <el-table-column
        label="联系方式"
        prop="phone"
        >
      </el-table-column>
      <el-table-column
        label="提现金额"
        prop="count"
        >
      </el-table-column>

      <el-table-column
        label="佣金余额"
        prop="sur_commission"
        >
      </el-table-column>
      <el-table-column label="审核" min-width="160px">
          <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="changeStatusItem('1',scope.$index,scope.row)">同意</el-button>
              <el-button size="mini" type="danger" @click="changeStatusItem('2',scope.$index,scope.row)">拒绝</el-button>
              <!-- <el-button size="mini" type="danger" @click="deleteItem(scope.$index,scope.row)">删除</el-button> -->
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
import {getWithdraw_api,changeWithdraw_api} from '@/api/seller' 
 
export default {
  data() {
    return {
      //out
      waitAddNotice:false,
      addNewShow:false,
      addNewShow2:false,
      formLabelWidth:'130px',
      //header
      formInline: {},
      downloadLoading:false,    
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
    }
  },
  created(){
    this.getList()
  },
  methods: {
    //head---------------------------------------------
      search(){
        this.getList()
      },

      async getList() {
        this.listLoading = true
        let sendData = Object.assign({},this.listQuery)
        if(this.listQuery.search !=''){
          sendData.telephone = this.listQuery.search
        }
        await getWithdraw_api(sendData).then(response => {
          this.listLoading = false
          if(response&&response.status== 0){
            let result = response.data
            let tempTableData = []
            result.forEach((aData)=>{
              tempTableData.push({
                username:aData.member_name,
                phone:aData.member_mobile,
                status:aData.status,
                count:aData.money,
                time:aData.ctime,
                sur_commission:aData.sur_commission,
                id:aData.member_withdrawid
              })
            })
            this.tableData = tempTableData
          }
          this.total = response.pagination&&response.pagination.total?response.pagination.total:1
          this.listLoading = false
        })
      },
    //body
      changeStatusItem(status,index,row){
              this.$confirm(status =='1'?'是否已完成线下提现':'是否拒绝本次提现','提示',{
                   confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
              }).then(()=>{
                  this.changeStatus(status,index,row)
              }).catch(()=>{
                this.$notify.info({
                    title: '消息',
                    message: '已取消'
                });
              })
      },
      changeStatus(status,index,row){
            let sendData = {
                member_withdrawid:row.id,
                status:status,
            }
            changeWithdraw_api(sendData).then(res=>{
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
                console.error('....')
            })
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
          member_withdrawid:id
        }
        deleteWithdra_api(sendData).then(res=>{
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
          console.error('deleteIndustry_api')
        })
      },

    //footer------------------------------------
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      }

  }
}
</script>