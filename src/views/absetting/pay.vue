<style>
  .pay{
    width: 200px;
  }
  .pay .el-checkbox{
    margin-left: 10px;
    margin-top: 10px;
  }
</style>

<template>
    <div style="margin-top:100px">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px">
            <el-form-item label="支付方式">
              
              <el-checkbox-group v-model="ruleForm.payType1" class="pay">
                <el-checkbox label="online"  name="payType" border>线上支付</el-checkbox>
                <el-checkbox label="offline" name="payType" border>货到付款</el-checkbox>
                <el-checkbox label="partpay" name="payType" border>10%定金+货到付款</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-button type="primary" @click="putCheckList('ruleForm')"
                :loading="waitAddNotice"
                style="margin:0 30%">确 定
            </el-button>
        </el-form>
    </div>

</template>


<script>
import {getCheckList_api,putCheckList_api} from '@/api/seller'

const ruleForm = {} 
export default {

  data(){
    return{
        type:[],
        ruleForm:{
          payType1:[],
        },
        rules:{
          payType: [
            {type:'array', required: true, message: '请选择可使用的支付方式', trigger: 'blur'}
        ], 
        },
        waitAddNotice:false,
        listLoading:false
    }
  },
  created(){
      this.getCheckList()
  },
  methods:{
    
    getCheckList(){
     this.listLoading = true
     let sendData = Object.assign({},this.listQuery)
      getCheckList_api(sendData).then(response=>{
          if(response&&response.status == 0 ){
              let payment = response.data
              this.ruleForm.payType1 = payment
          }
      })
    },

    async putCheckList(formName){
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
      let sendData = {
          payment:this.ruleForm.payType1
      }
      

      putCheckList_api(sendData).then(data=>{
        this.waitAddNotice = false
        if(data.status===0){
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          })
        }else{
          this.$notify({
            title: '失败',
            message: '操作失败',
            type: 'error'
          })
        }
      }).catch(e=>{
        this.waitAddNotice = false
        console.error('接口错误')
      })

    }
  }
}
</script>





