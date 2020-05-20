<style lang="stylus">
  .notice
    .header
      margin-top 20px
    .big-icon
      font-size 30px
      color #409EFF
    .big-icon-no
      font-size 30px
      color #F56C6C
</style>

<template>
<div>
<el-dialog
  :title="isAddItem?'新增流量包':'编辑流量包'"
  :visible.sync="addNewShow"
  width="30%"
  >
  <el-form :model="formForNotive"  ref="ruleForm" :rules="rules" >
    <el-form-item label="流量数" :label-width="formLabelWidth"  prop="value">
      <el-input v-model.number="formForNotive.value" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="价格" :label-width="formLabelWidth" prop="price">
      <el-input v-model.number="formForNotive.price" 
       auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addNewShow=false" >取消</el-button>
    <el-button v-if="isAddItem" type="primary" @click="addAuth('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确 定</el-button>
    <el-button v-else type="primary" @click="editAuth('ruleForm')"
    :disabled="waitAddNotice" 
    :loading="waitAddNotice">确认修改</el-button>
  </span>
</el-dialog>
<el-container class="notice">
<el-header class="header">
<el-form :inline="true" :model="formInline" class="form">
  <el-form-item>
    <el-button type="primary" @click="addItem">新增流量包</el-button>
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
        label="ID" 
        prop="id"
        >
      </el-table-column>
      <el-table-column 
        label="流量"
        >
        <template slot-scope="scope">
          <el-tag size="medium">{{scope.row.value}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column 
        label="价格" 
        >
        <template slot-scope="scope">
          <el-tag size="medium" >{{ scope.row.price}}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column 
        label="密码" 
        prop="password"
        >
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

import {getFlowPackageList_api,deleteFlowPackage_api,addFlowPackage_api,editFlowPackage_api } from '@/api/admin' 
const formForNotive = { //此页面 静态数据
  price:"",
  value:"",
}
export default {
  created(){
    this.getList()
  },
  data() {
    return {
      //out
        //状态层
        waitAddNotice:false,
        addNewShow:false,
        isAddItem:true,
        // rolesList:['manage','auth','store','affiche'],
        rolesList:[
          {
            label:'affiche',
            text:'公告'
          },
          {
            label:'store',
            text:'店铺管理'
          },
          {
            label:'manage',
            text:'运营管理'
          },
          {
            label:'auth',
            text:'授权管理'
          },
        ],
        formLabelWidth:'140px',//弹框1 左侧文字默认宽度
        formForNotive:Object.assign({},formForNotive),
        rules: {
          value: [
              { type:"integer",required: true, message: '请输入流量数', trigger: 'blur',min: 1},
          ],
          price: [
              { type:"number",required: true, message: '请输入金额', trigger: 'blur',min: 0},
          ],
      },
      //body
        
        tableData: [{
            // username: '黄邦胜',
            // account:'huang',
            // password:'123456',
              // goods: '1',
              // notice: '1',
              // manageShop: '1',
              // manageSevice: '1',
        }],
      // -------------------------
      
      // ----------------------
      //out
      waitAddNotice:false,
      formForNotive:{
        name:'',
        account:'',
        password:'',
      },
      addNewShow:false,
      formLabelWidth:'80px',
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
    // out
      async addAuth(formName){
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
          flowpackage_value:this.formForNotive.value,
          flowpackage_price:this.formForNotive.price,
        }
        addFlowPackage_api(sendData).then(data=>{
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
          console.error('manageShop:addFlowPackage_api 接口错误')
        })
      },
      addItem(){ //显示 弹框
        // this.editLoading = false
        this.isAddItem = true
        this.addNewShow = true
        this.formForNotive = Object.assign({},formForNotive)
      },
      async editAuth(formName){
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
          // 后端生成
          flowpackage_id:this.formForNotive.id,
          // 前段统一
          flowpackage_value:this.formForNotive.value,
          flowpackage_price:this.formForNotive.price,
        }
        editFlowPackage_api(sendData).then(data=>{
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
          console.error('editAuth_api 接口错误')
        })
      },
      editItem(index,rowData){
        console.log(rowData)
        // this.editLoading = true
        this.formForNotive = Object.assign({},rowData)
        this.isAddItem = false
        this.addNewShow = true
      },
    // body
      getList() { //获取列表
        this.listLoading = true
        let sendData = Object.assign({},this.listQuery)
        getFlowPackageList_api(sendData).then(response => {
          if(response&&response.status==0){
            let result = response.data
            let tempTableData = []
            result.forEach((aData)=>{
              tempTableData.push({
                //后端生成
                id:aData.flowpackage_id,
                //前后统一
                value:Number(aData.flowpackage_value),
                price:Number(aData.flowpackage_price),
              })
            })
            this.tableData = tempTableData
            this.total = response.pagination.total?response.pagination.total:1
          }else{
          }
          console.log("getList",response)
          // this.list = response
          this.listLoading = false
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
          flowpackage_id:id,
        }
        deleteFlowPackage_api(sendData).then(res=>{
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
          console.error('deleteAdmin_api')
        })
      },
    // ----------------------
    //body
      
    //bdoy
      
      
      
    // 0-----------------------
    //out
    addNewNotice(){
      this.waitAddNotice = true
      setTimeout(()=>{
        //发送成功该做的事情
        this.waitAddNotice = false
        this.addNewShow = false
        this.form = {}
        this.$notify({
          title: '发送成功',
          message: '这是一条成功的提示消息',
          type: 'success'
        })
        //如果失败
        // this.waitAddNotice = false
      },2000)
    },
    lookDetail() {
      console.log(arguments)
    },
    searchByDate(){
      if(!this.dataRange||!this.dataRange.length||this.dataRange.length!==2){
        return console.log("日期错误")
      }
      let dateS = this.dataRange[0]
      let dateE = this.dataRange[1]
      let Sstr = dateS.getFullYear()+'-'+(dateS.getMonth()+1>9?(dateS.getMonth()+1):('0'+dateS.getMonth()))+'-'+(dateS.getDate()+1>9?(dateS.getDate()+1):('0'+dateS.getDate()))
      let Estr = dateE.getFullYear()+'-'+(dateE.getMonth()+1>9?(dateE.getMonth()+1):('0'+dateE.getMonth()))+'-'+(dateE.getDate()+1>9?(dateE.getDate()+1):('0'+dateE.getDate()))
      this.listQuery.time = Sstr+','+Estr
      this.listQuery.page = 1
      this.getList()
    },
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