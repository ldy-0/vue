<style lang="stylus">
  .notice
    .header
      margin-top 20px
  .margin-btm20
    margin-bottom 20px
</style>

<template>
<div>
  <!-- 编辑和添加共用 -->

<!-- <el-dialog
  :title="isAddItem?'新增门店':'编辑门店'"
  :visible.sync="addNewShow" 
  width="30%" 
  class="out-dialog"
  >
  <el-form :model="formForNotive"  ref="ruleForm" :rules="rules" size="medium" >
    <el-form-item label="门店名字" :label-width="formLabelWidth" prop="name">
      <el-input v-model="formForNotive.name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="门店地址" :label-width="formLabelWidth" prop="address">
      <el-input v-model="formForNotive.address" auto-complete="off"></el-input>
    </el-form-item>
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
</el-dialog> -->
<el-dialog
  title="购买流量包"
  :visible.sync="buyPageShow" 
  width="70%" 
  class="out-dialog"
  >
  <el-form  size="medium" v-loading="buyPageLoading">
    <el-form-item label="支付二维码" :label-width="formLabelWidth" >
      <div src="" alt="" ref="codeimg" id="codeimg" style="width:200px; height:200px; margin-top:15px;">
      </div>
    </el-form-item>
  </el-form>
</el-dialog>
<el-container class="notice">
<el-header class="header" style="height:auto;">
  <!-- <el-form :inline="true" :model="formInline" class="form">
    <el-form-item>
      <el-button type="primary" icon="el-icon-edit-outline" @click="addItem">新增门店</el-button>
    </el-form-item>
  </el-form> -->
  <el-form :inline="true" :model="formInline" class="form">
    <el-form-item label="当前剩余流量">
      <el-tag size="medium" >{{lastFlow}}</el-tag>
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

      <el-table-column
        label="操作" 
        min-width='300px'
        >
        <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="buyItem(scope.$index, scope.row)">购买流量包</el-button>
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
import {getFlowList_api,buyFlow_api,buyFlowState_api,getStoreview_api} from '@/api/seller'
// import QRobj from '@/utils/Qcode'

const formForNotive = {}
export default {
  mounted(){
    
  },
  created(){
    this.getFlowInfo()
    this.getList()
  },
  data() {
    return {
      // buy
      flag30:'',
      timer:'',
      qrcode:'',
      buyPageLoading:false,
      buyPageShow:false,
      // out
        formForNotive:Object.assign({},formForNotive),
        rules: {
          name: [
              { required: true, message: '请输入门店名字', trigger: 'blur' },
              { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
          address: [
              { required: true, message: '请输入地址', trigger: 'blur' },
              { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
        },
      formLabelWidth:'120px',
        waitAddNotice:false,
        addNewShow:false,
        isAddItem:true,
      //head
        lastFlow:'正在加载',
        formInline: {},
      // body
      listLoading: false,
      tableData: [],
    // footer
      listQuery: {
        page: 1,
        limit: 20,
        // search:"",
        // time:""
      },
      total:1,
      // --------------------
    }
  },
  methods: {
    getFlowInfo(){
      let sendData = {}
       getStoreview_api(sendData).then(response=>{
        if(response&&response.status == 0){
          this.lastFlow = response.data.view
        }
      })
    },
    //   out
    async editNewNotice(formName){
        //基础验证
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
        // 通过验证
        this.waitAddNotice = true
        let sendData = {}
        //id
        sendData.school_id = this.formForNotive.id
        sendData.school_name = this.formForNotive.name
        sendData.school_address = this.formForNotive.address
        editSchool_api(sendData).then(data=>{
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
          console.error('manageShop:editSchool_api 接口错误')
        })
      },
    async addNewNotice(formName){
        //基础验证
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
        // 通过验证
        this.waitAddNotice = true
        let sendData = {}
        sendData.school_name = this.formForNotive.name
        sendData.school_address = this.formForNotive.address
        addSchool_api(sendData).then(data=>{
          this.waitAddNotice = false
          this.addNewShow = false
          if(data.status===0){
            this.$notify({
              title: '上传成功',
              message: '已新增门店',
              type: 'success'
            })
            this.getList()
          }else{
            this.$notify({
              title: '上传失败',
              message: '新增门店失败',
              type: 'error'
            })
          }
        }).catch(e=>{
          this.waitAddNotice = false
          this.addNewShow = false
          console.error('manageShop:addSchool_api 接口错误')
        })
    },
    //   head
    addItem(){ //显示 弹框
        this.isAddItem = true
        this.addNewShow = true
        this.formForNotive = Object.assign({},formForNotive)
    },
    //   body
    checkStatus(id){
      this.flag30 = setTimeout(()=>{
        clearInterval(this.timer)
        this.$notify({
                title: '超时',
                message: '请重新打开二维码',
                type:'error'
              });
        this.buyPageShow = false
      },30000)
      this.timer = setInterval(()=>{
        let sendData = {
          floworder_id:id
        }
        buyFlowState_api(sendData).then(res=>{
          if(res&&res.status===0){
            if(res.data&&res.data.order_state==='success'){
              this.$notify({
                title: '成功',
                message: '操作成功',
                type:'success'
                });
              clearInterval(this.timer)
              clearTimeout(this.flag30)
              this.buyPageShow = false
              this.getFlowInfo()
            }else if(res.data&&res.data.order_state==='fail'){
              this.$notify({
                title: '错误',
                message: '操作失败',
                type:'error'
              });
              clearInterval(this.timer)
              clearTimeout(this.flag30)
              this.buyPageShow = false
            }
        }else{
          // 没有响应
        }
        }).catch(err=>{
          console.error('buyFlowState_api')
        })
      },3000)
    },
    makeImg(str){
      console.log(this.$refs)
      document.getElementById('codeimg').innerHTML = ''
      this.qrcode = new window.QRCode(document.getElementById('codeimg'), {
        width : 200,
        height : 200
      })
      this.qrcode.makeCode(str)
    },
    buyItem(index,raw){
        clearInterval(this.timer)
        clearTimeout(this.flag30)
        this.buyPageShow = true
        this.buyPageLoading = true
        let sendData = {
          flowpackage_id:raw.id
        }
        buyFlow_api(sendData).then(data=>{
          this.buyPageLoading = false
          if(data&&data.status===0){
            console.log(data)
            this.makeImg(data.data.pay_url)
            this.checkStatus(data.data.floworder_id)
          }else{
            this.$notify({
              title: '失败',
              message: '操作失败',
              type: 'error'
            })
          }
        }).catch(e=>{
          this.buyPageLoading = false
          console.error('manageShop:buyFlow_api 接口错误')
        })
        
    },
    async deleteItem(index,raw){
        let id = raw.id
        this.$confirm(`此操作将删除该项, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteNewNotice(id) //批量
        }).catch(()=>{
          this.$notify.info({
            title: '消息',
            message: '已取消'
          });
        })
      },
    deleteNewNotice(id){
        deleteSchool_api(id).then(res=>{
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
          console.error('deleteSchool_api')
        })
    },
    getList() {
        this.listLoading = true
        let sendData = Object.assign({},this.listQuery)
        getFlowList_api(sendData).then(response => {
          if(response&&response.status==0){
            let result = response.data
            let tempTableData = []
            result.forEach((aData)=>{
              tempTableData.push({
                //后端生成
                id:aData.flowpackage_id,
                //前后统一
                value:aData.flowpackage_value,
                price:aData.flowpackage_price,//显示
              })
            })
            this.tableData = tempTableData
            this.total = response.pagination&&response.pagination.total?response.pagination.total:1
          }else{
              console.error('getSchoolList => status === 1')
          }
          this.listLoading = false
        }).catch(e=>{
          this.listLoading = false
        })
      },
    //   foot
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    //   ------------------------
  }
}
</script>