<style lang="stylus">
  .notice
    .header
      margin-top 20px
</style>

<template>
<div>

<el-dialog
  title="添加用户"
  :visible.sync="addNewShow2"
  width="40%"
  >
  <el-form :model="formForNotive"  ref="ruleForm" :rules="rules" >
    <el-form-item label="姓名" :label-width="formLabelWidth"  prop="username">
      <el-input v-model="formForNotive.username" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="联系方式" :label-width="formLabelWidth"  prop="phone">
      <el-input v-model="formForNotive.phone" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="积分数" :label-width="formLabelWidth"  prop="credit">
      <el-input v-model="formForNotive.credit" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addNewShow2 = false">取 消</el-button>
    <el-button type="primary" @click="addNewNotice('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确 定</el-button>
  </span>
</el-dialog>
  <!-- 两个 弹框！！！ 1 2 -->
<el-container class="notice">
<el-header class="header" style="height:100px">
  <el-form :inline="true" :model="formInline" class="form">
    <el-form-item>
      <el-button type="primary" icon="el-icon-edit-outline" @click="addItem">新增用户</el-button>
    </el-form-item>
    <el-form-item>
      <el-input style="width: 340px;" placeholder="请输入手机号码查询" v-model="listQuery.search"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
    </el-form-item>
  </el-form>    
    <el-form  :inline="true" class="form">
    <el-form-item label="导出Excel">
      <el-button  type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">{{exportExcelStatus}}</el-button>
      <span class="s-inline-tips">导出所有数据</span>
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
        label="姓名"
        prop="username"
        >

      </el-table-column>
      <el-table-column
        label="联系方式"
        prop="phone"
        >
      </el-table-column>
      <el-table-column
        label="积分"
        prop="credit"
        >
      </el-table-column>
      <!-- <el-table-column
        label="操作" 
        min-width='100px'
        >
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="deleteItem(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
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
import {getUser_api,addUser_api} from '@/api/seller' 

// getList 接口 获取
// addNotice 接口 添加     
const formForNotive = {}
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
      exportExcelStatus:'导出',
      downloadLoading:false,
      tableDataAll:'',
    
      // body
      listLoading: false,
      tableData: [
        {
          username: '张三',
          phone: '123456',
          credit: '12',
          child: '111',
          opera: ''
        }
      ],
      tableData2: [
        {
          childName: '张三',
          childPhone: '123456',
          childCredit: '1211'
        }
      ],
      formForNotive:{},
      rules: {
        username: [
            { required: true, message: '请输入用户姓名', trigger: 'blur',min: 1 }
        ],        
        phone:[
          {required: true,  message: '请输入用户联系方式', trigger: 'blur',min: 1 }
        ],
        credit:[
          {required: true,  message: '请输入用户积分', trigger: 'blur',min: 1 }
        ],
      },
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
          const tHeader = ['id','姓名', '联系方式', '积分']
          const filterVal = ['id', 'username', 'phone', 'credit']
          const tableDataAll = this.tableDataAll
          const data = this.formatJson(filterVal, tableDataAll)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth
          })
          this.downloadLoading = false
          this.getList()
        })
      },
    //head
      search(){ // 此时listQuery已经改变
        this.getList()
      },
      async getList(all) {
        let flag = false
        this.listLoading = true
        let sendData = Object.assign({},this.listQuery)
        if(all){
          sendData.limit = 0
        }
        await getUser_api(sendData).then(response => {
          this.listLoading = false
          if(response&&response.status== 0){
            flag = true
            let result = response.data
            let tempTableData = []
            result.forEach((aData)=>{
              tempTableData.push({
                username:aData.member_truename,
                phone:aData.member_mobile,
                credit:aData.member_points,
              })
            })
            if(all){
              this.tableDataAll = tempTableData
            }else{
              this.tableData = tempTableData
            }
          }
          this.total = response.pagination&&response.pagination.total?response.pagination.total:1
          this.listLoading = false
        })
          return flag
      },

    //body
      addItem(){
        this.addNewShow2 = true
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
        let sendData = {}
        sendData.member_truename = this.formForNotive.username
        sendData.member_telphone = this.formForNotive.phone
        sendData.member_point = this.formForNotive.credit
      addUser_api(sendData).then((data)=>{
        this.waitAddNotice = false
        this.addNewShow2 = false
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
        this.addNewShow2 = false
        console.error('接口错误')
      })
      },

    deleteItem(index,row){
      let id = row.id
      this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteUser(id)
      }).catch(()=>{
        this.$notify.info({
          title: '消息',
          message: '已取消'
        });
      })
    },
    deleteUser(id){
      deleteUser_api(id).then(res=>{
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

    //footer
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleSizeChange2(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange2(val) {
        this.listQuery.page = val
        this.getList()
      },


    
  }
}
</script>