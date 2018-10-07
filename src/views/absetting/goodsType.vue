<style lang="stylus">
  .notice
    .header
      margin-top 20px
</style>

<template>
<div>
<el-dialog
  :title="isAddItem?'新增类型':'编辑类型'"
  :visible.sync="addNewShow"
  width="30%"
  >
  <el-form :model="formForNotive"  ref="ruleForm" :rules="rules" >
    <el-form-item label="商品类型" :label-width="formLabelWidth" prop="title">
      <el-input v-model="formForNotive.title" auto-complete="off"></el-input>
    </el-form-item>
    <!-- <el-form-item label="序号" :label-width="formLabelWidth">
      <el-input v-model="formForNotive.num" auto-complete="off" placeholder="数字范围为0~255，数字越小越靠前"></el-input>
    </el-form-item> -->
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addNewShow = false">取 消</el-button>
    
    <el-button v-if="isAddItem" type="primary" @click="addNewNotice('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确 定</el-button>
     <el-button v-else type="primary" @click="editNewNotice('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确认修改</el-button>
  </span>
</el-dialog>
<el-container class="notice">
<el-header class="header">
  <el-form :inline="true" :model="formInline" class="form">
    <el-form-item>
      <el-button type="primary" icon="el-icon-edit-outline" @click="addItem">新增类型</el-button>
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
        label="商品类型" 
        prop="title"
        >
      </el-table-column>
      <!-- <el-table-column
        label="序号"
        >
        <template slot-scope="scope">
          <i class="el-icon-edit-outline"></i>
          <span style="margin-left: 10px">{{ scope.row.order }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        >
        <template slot-scope="scope">
        <el-button
          size="mini"
          type="primary" 
          @click="editItem(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini" 
          type="danger" 
          @click="deleteItem(scope.$index, scope.row)">删除</el-button>
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
import {addIndustry_api,deleteIndustry_api,editIndustry_api,getIndustryList_api} from '@/api/seller' 
const formForNotive = {
        title:'',
        // num:''
      }
export default {
  created(){
    this.getList()
  },
  data() {
    return {
      //out
      isAddItem:true,
      waitAddNotice:false,
      addNewShow:false,

      formForNotive:Object.assign({},formForNotive),
      rules: {
        title: [
            { required: true, message: '请输入商品类型', trigger: 'blur',min: 1 }
        ]
      },
      formLabelWidth:'80px',
      //header
      formInline: {},
      // body
      listLoading: false,
      tableData: [
        {title:'食品'},{title:'家具'}
      ],
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
    addItem(){ //显示 弹框
      // this.editLoading = false
      this.isAddItem = true
      this.addNewShow = true
      this.formForNotive = Object.assign({},formForNotive)
    },
    async addNewNotice(formName){
      let res = await new Promise((res,rej)=>{
        this.$refs[formName].validate((valid) => {
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
      let sendData = {
        storegc_name:this.formForNotive.title,
        storegc_parent_id:0

      }
      addIndustry_api(sendData).then(data=>{
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
        console.error('接口错误')
      })
    },
    editItem(index,rowData){
      // this.editLoading = true
      this.formForNotive = Object.assign({},rowData)
      this.isAddItem = false
      this.addNewShow = true
    },
    async editNewNotice(formName){
      let res = await new Promise((res,rej)=>{
        this.$refs[formName].validate((valid) => {
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
      let sendData = {
        storegc_name:this.formForNotive.title,
        storegc_id:this.formForNotive.id
      }
      editIndustry_api(sendData).then(data=>{
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
        console.error('接口错误')
      })
    },
    //head
    deleteItem(index,row){
      let id = row.id
      console.log('row',row)
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

      deleteIndustry_api(id).then(res=>{
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
    getList() {
      this.listLoading = true
      let sendData = Object.assign({},this.listQuery)
      getIndustryList_api(sendData).then(response => {
        if(response&&response.status==0){
          let result = response.data
          let tempTableData = []
          result.forEach((aData)=>{
            tempTableData.push({
              //后端生成
              id:aData.storegc_id,
              //前后统一
              title:aData.storegc_name,
            })
          })
          this.tableData = tempTableData
        this.total = response.pagination&&response.pagination.total?response.pagination.total:1
        }else{

        }
        console.log("getList",response)
        // this.list = response
        this.listLoading = false
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
    // ---------------------------
  }
}
</script>