<style lang="stylus">
  .notice
    .header
      margin-top 20px
</style>

<template>
<div>
  <!-- 两个 弹框！！！ 1 2 -->
<el-dialog
  title="添加访问量"
  :visible.sync="addNewShow"
  width="50%"
  >
  <el-form :model="formForNotive" ref="ruleForm" :rules="rules" >
    <el-form-item label="添加访问量" :label-width="formLabelWidth">
      <el-input v-model="formForNotive.visitCount" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addNewShow = false">取 消</el-button>
    <el-button  type="primary" @click="addNewNotice"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确 定</el-button>
  </span>
</el-dialog>
<el-container class="notice">
<el-header class="header">
  <el-form :inline="true" :model="formInline" class="form">
    <el-form-item>
      <el-input style="width: 340px;" placeholder="请输入联系方式或店名" v-model="listQuery.search"></el-input>
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
        label="店铺ID" 
        prop="id"
        >
      </el-table-column>
      <el-table-column
        label="店名" 
        prop="title"
        >
      </el-table-column>
      <el-table-column
        label="剩余访问量" 
        prop="lastvisit"
        >
      </el-table-column>
      <el-table-column
        label="联系方式" 
        prop="phone"
        >
      </el-table-column>
      <el-table-column
        prop="opare"
        label="操作"
        >
        <template slot-scope="scope">
        <el-button 
         type="primary"
          size="mini"
          @click="changeItem(scope.$index, scope.row)">添加访问量</el-button>
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
import {getShop_api,changeShopServer_api} from '@/api/admin'

const formForNotive = {
        visitCount:'',
      }
export default {
  created(){
    this.getList()
  },
  data() {
    return {
      //out
        //访问量
      formForNotive:Object.assign({},formForNotive),
      rules: {
          visitCount: [
              { required: true, message: '请输入访问量,值为正整数', trigger: 'blur' ,type:'integer',min:1},
          ]
      },
      waitAddNotice:false,
      addNewShow:false,
      // --------------------
      //out
      
      formLabelWidth:'130px',
      //header
      industry:'',
      industryList: [{
          value: 'edu',
          label: '教育'
        }, {
          value: 'others',
          label: '其他'
        }],
      formInline: {},
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
  methods: {
    //out
      async addNewNotice(){
        let res = await new Promise((res,rej)=>{
          this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
              // alert('submit!');
              res(true)
            } else {
              res(false)
              // console.log('error submit!!');
              // return false;
            }
          })
        })
        if(!res){
          return 
        }
        this.waitAddNotice = true
        let sendData = {}
        sendData.store_id = this.formForNotive.id
        sendData.view = this.formForNotive.visitCount
        changeShopServer_api(sendData).then(data=>{
          this.waitAddNotice = false
          this.addNewShow = false
          if(data.status===0){
            this.$notify({
              title: '成功',
              message: '已增加访问量',
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
          console.error('manageShop:addGoods_api 接口错误')
        })
      },
    //head
      search(){ // 此时listQuery已经改变
        this.getList()
      },
      getList() { //获取店铺列表
        this.listLoading = true
        let sendData = Object.assign({},this.listQuery)
        getShop_api(sendData).then(response => {
          this.listLoading = false
          if(response&&response.status==0){
            let result = response.data
            let tempTableData = []
            result.forEach((aData)=>{
              tempTableData.push({
                //后端生成
                id:aData.store_id,
                industryName:aData.storeclass_name,
                //前后统一
                title:aData.store_name,
                username:aData.contacts_name,
                phone:aData.contacts_phone,
                account:aData.seller_name,
                lastvisit:aData.total_view,
                isUp:aData.store_state,
              })
            })
            this.tableData = tempTableData
            this.total = response.pagination&&response.pagination.total?response.pagination.total:1
          }else{

          }
          console.log("getList",response)
          // this.list = response
          this.listLoading = false
        }).catch(e=>{
          this.listLoading = false
        })
      },
    //body
      changeItem(index,row){ //显示 弹框
        // this.editLoading = false
        this.isAddItem = true
        this.addNewShow = true
        this.formForNotive = Object.assign({},formForNotive)
        this.formForNotive.id = row.id
      },

    //foot
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
    // --------------------------------
    //out

    
    
  }
}
</script>