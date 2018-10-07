<style lang="stylus">
  .notice
    .header
      margin-top 20px
</style>

<template>
<div>
<el-dialog
  title="下线人数详情"
  :visible.sync="addNewShow"
  width="60%">
      <el-table
      :data="tableData2"
      stripe 
      v-loading="listLoading" element-loading-text="给我一点时间"
      style="width: 100%" >
      <el-table-column
        label="下线姓名"
        prop="member_name"
        >
      </el-table-column>
      <el-table-column
        label="下线联系方式"
        prop="telephone"
        >
      </el-table-column>
      <el-table-column
        prop="opare"
        label="操作"
        >
        <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="deleChildItem(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  <el-footer>
    <el-pagination background @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
    </el-pagination>
  </el-footer>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addNewShow = false">关闭</el-button>
  </span>
</el-dialog>

<el-dialog
  title="添加销售"
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
    <!-- <el-form-item label="积分数" :label-width="formLabelWidth"  prop="credit">
      <el-input v-model="formForNotive.credit" auto-complete="off"></el-input>
    </el-form-item> -->
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
<el-header class="header">
  <el-form :inline="true" :model="formInline" class="form">
    <el-form-item>
      <el-button type="primary" icon="el-icon-edit-outline" @click="addItem">新增销售</el-button>
    </el-form-item>
    <el-form-item>
      <el-input style="width: 340px;" placeholder="请输入手机号码查询" v-model="listQuery.search"></el-input>
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
        label="姓名"
        prop="username"
        >

      </el-table-column>
      <el-table-column
        label="联系方式"
        prop="phone"
        >
      </el-table-column>
      <!-- <el-table-column
        label="积分"
        prop="credit"
        >
      </el-table-column> -->
      <el-table-column
        label="下线人数"
        prop="childNum"
        >

      </el-table-column>
      <el-table-column
        prop="opare"
        label="操作"
        >
        <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="getList2(scope.$index, scope.row)">详情</el-button>
        <el-button type="danger" size="mini" @click="deleItem(scope.$index, scope.row)">删除</el-button>
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
import {getSales_api,getChild_api,addSales_api,getCreditSection_api,deleteSales_api,deleteChildSales_api} from '@/api/seller' 

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
        // credit:[
        //   {required: true,  message: '请输入用户积分', trigger: 'blur',min: 1 }
        // ],
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
    //head
      search(){ // 此时listQuery已经改变
        this.getList()
      },
      getList() {
        this.listLoading = true
        let sendData = Object.assign({},this.listQuery)
        getSales_api(sendData).then(response => {
          if(response&&response.status== 0){
            let result = response.data
            let tempTableData = []
            result.forEach((aData)=>{
              tempTableData.push({
                phone:aData.telephone,
                saler_id:aData.saler_id,
                member_id:aData.member_id,
                username:aData.name,
                childNum:aData.child.length,
                child:aData.child
              })
            })
            this.tableData = tempTableData
          }
          this.total = response.pagination&&response.pagination.total?response.pagination.total:1
          this.listLoading = false
        })
      },
    //body
      getList2(index,rowData) {
        this.addNewShow = true
        this.tableData2 = rowData.child
      },

      deleItem(index,row){
        let phone = row.phone
        this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.deleteSales(phone)
        }).catch(()=>{
            this.$notify.info({
              title: '消息',
              message: '已取消'
          });
        })
      },

      deleteSales(phone){
        let sendData = {
            telephone:phone
          }
          deleteSales_api(sendData).then(res=>{
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

      deleChildItem(index,row){
        let id = row.sl_id
        this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.deleteChildSales(id)
        }).catch(()=>{
            this.$notify.info({
              title: '消息',
              message: '已取消'
          });
        })
      },
      deleteChildSales(id){
          let sendData = {
            sl_id:id
          }
        deleteChildSales_api(sendData).then(res=>{
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
          this.addNewShow = false
      },

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
          sendData.telephone = this.formForNotive.phone
          sendData.name = this.formForNotive.username
        addSales_api(sendData).then((data)=>{
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