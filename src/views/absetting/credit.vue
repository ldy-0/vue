<style lang="stylus">
  .notice
    .header
      margin-top 20px
</style>

<template>
<div>
<!-- out -->
  <!-- 只发布 简单表单 -->
<el-dialog
  title="获得积分编辑"
  :visible.sync="addNewShow"
  width="50%"
  >
  <el-form :model="formForNotive"  ref="ruleForm" :rules="rules" >
    <el-form-item label="积分" :label-width="formLabelWidth"  prop="addCredit">
      <el-input v-model="formForNotive.addCredit" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addNewShow = false">取 消</el-button>
    <el-button type="primary" @click="editNewNotice('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确 定</el-button>
  </span>
</el-dialog>

<el-container class="notice">
<!-- body -->
<el-main>
  <el-table
    :data="tableData"
    stripe 
    v-loading="listLoading" element-loading-text="给我一点时间"
    style="width: 100%" >
    
    <el-table-column
      prop="creditType"
      label="积分类型"
      >

    </el-table-column>
    <el-table-column
      label="获得积分" 
      prop="addCredit"
      >
    </el-table-column>
    <el-table-column
      label="操作"
      >
      <template slot-scope="scope">
      <el-button
        size="mini"
        @click="editDetail(scope.$index, scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</el-main>
<!-- footer -->
<!-- <el-footer>
  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
  </el-pagination>
</el-footer> -->
</el-container>
</div>
</template>
<script>
import {getCredit_api,editCredit_api} from '@/api/seller' 

// getList 接口 获取
// addNotice 接口 添加
const formForNotive={}
export default {
  data() {
    return {
      //out
      waitAddNotice:false,
      formForNotive:{
        addCredit:'',
      },
      rules: {
        addCredit: [
            { required: true, message: '请输入该类型可获取的积分', trigger: 'blur',min: 1},
        ]
      },
      imgLimit1:1,
      addNewShow:false,
      formLabelWidth:'80px',

      detailShow:false,
      detailForm:{
        title:'loading',
        content:'...'
      },
      //header
      // body
      listLoading: false,
      tableData: [
        {
          creditType:"签到",
          addCredit:"5",
          id:1
        }
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
  created(){
    this.getList()
  },
  methods: {
    async editNewNotice(formName){ //添加
      let res = await new Promise((res,rej)=>{
        this.$refs[formName].validate((valid) => {
          if (valid) {
            res(true)
          } else {
            res(false)
          }
        })
      })
      if(!res){
        return 
      }
      this.waitAddNotice = true
      let sendData = {
          integrate_scores:this.formForNotive.addCredit,
          integrate_id:this.formForNotive.id
      }
      
      editCredit_api(sendData).then(()=>{
        this.waitAddNotice = false
        this.formForNotive = {}
        this.addNewShow = false
        this.$notify({
          title: '发送成功',
          message: '已更新成功',
          type: 'success'
        })
        this.getList()
      }).catch(err=>{
        this.waitAddNotice = false
        console.error('addNotice_api:',err)
      })
    },
    //header

    //body
    getList() { //获取列表
      this.listLoading = true
      let sendData = Object.assign({},this.listQuery)
      getCredit_api(sendData).then(response => {
        if(response&&response.status==0){

          let result = response.data
          let tempTableData = []
          result.forEach((aData)=>{
            tempTableData.push({
              id:aData.integrate_id,
              addCredit:aData.integrate_scores,
              creditType:aData.integrate_title
            })
          })
          this.tableData = tempTableData
        }
        this.total = response.pagination&&response.pagination.total?response.pagination.total:1
        this.listLoading = false
      })
    },
    editDetail(index,rowData) { //查看某条详情
      this.addNewShow = true
      this.formForNotive = Object.assign({},rowData)
      console.log("11",this.formForNotive)
    },
    //footer
    
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