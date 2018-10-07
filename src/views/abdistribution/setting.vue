<style lang="stylus">
    .onlyForm

        width 50%
        float left
    .intro_text
        width 50%
        float left
        padding 10% 10%
</style>

<template>
    <div>
        <div class="onlyForm">
            <h2 style="margin-left:50%">分销设置</h2>
            <el-form class="form" :model="formForNotive" ref="ruleForm" :rules="rules">
                <el-form-item label="分销佣金设置" :label-width="formLabelWidth">
                </el-form-item>
                <el-form-item label="分销提现门槛" :label-width="formLabelWidth" prop="Basic">
                    <el-col :span="22">
                        <el-input v-model="formForNotive.Basic" auto-complete="off"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="一级分销佣金比率" :label-width="formLabelWidth" prop="count1">
                    <el-col :span="22">
                        <el-input v-model="formForNotive.count1" auto-complete="off"></el-input>
                    </el-col>
                    <el-col class="line" :span="2">%</el-col>            
                </el-form-item>
                <el-form-item label="二级分销佣金比率" :label-width="formLabelWidth" prop="count2">
                    <el-col :span="22">
                        <el-input v-model="formForNotive.count2" auto-complete="off"></el-input>
                    </el-col>
                    <el-col class="line" :span="2">%</el-col>            
                </el-form-item>
                <el-form-item label="三级分销佣金比率" :label-width="formLabelWidth" prop="count3">
                    <el-col :span="22">
                        <el-input v-model="formForNotive.count3" auto-complete="off"></el-input>
                    </el-col>
                    <el-col class="line" :span="2">%</el-col>
                </el-form-item>
                
                <el-form-item label="分销积分设置" :label-width="formLabelWidth">
                </el-form-item>
                <el-form-item label="一级分销积分比率" :label-width="formLabelWidth" prop="points1">
                    <el-col :span="22">
                        <el-input v-model="formForNotive.points1" auto-complete="off"></el-input>
                    </el-col>
                    <el-col class="line" :span="2">%</el-col>            
                </el-form-item>
                <el-form-item label="二级分销积分比率" :label-width="formLabelWidth" prop="points2">
                    <el-col :span="22">
                        <el-input v-model="formForNotive.points2" auto-complete="off"></el-input>
                    </el-col>
                    <el-col class="line" :span="2">%</el-col>            
                </el-form-item>
                <el-form-item label="三级分销积分比率" :label-width="formLabelWidth" prop="points3">
                    <el-col :span="22">
                        <el-input v-model="formForNotive.points3" auto-complete="off"></el-input>
                    </el-col>
                    <el-col class="line" :span="2">%</el-col>           
                </el-form-item>
                <el-button type="primary"
                    :loading="waitAddNotice"
                    style="margin:0 80%"
                    @click="editShopText('ruleForm')">确 定
                </el-button>
            </el-form>
        </div>
        <div class="intro_text">
            <h4>规则</h4>
            <p>1：小数点后最多保留2位小数</p>
            <p>2：当您的用户购买商品时，例如 用户增加100金额或积分</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一级分销可以分得10元，则佣金比率填写 10</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;二级分销可以分得10元，则佣金比率填写 10</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;三级分销可以分得10元，则佣金比率填写 10</p>
            <p>3：佣金比率总和不建议超过90%</p>
        </div>
    </div>
</template>

<script>
import {getSaleConfig_api,editSaleConfig_api} from '@/api/seller' 
const formForNotive = {
    Basic:0,
    count1:0,
    count2:0,
    count3:0,
    points1:0,
    points2:0,
    points3:0,
}
export default {
    data(){
        return {
            formLabelWidth:'180px',
            formForNotive:Object.assign({},formForNotive),
            waitAddNotice:false,
            listloading:false,
            rules:{
                Basic: [
                    { type:'string',required: true, message: '请填写', trigger: 'blur' }
                ],
                count1: [
                    { type:'string',required: true, message: '请填写', trigger: 'blur' }
                ],
                count2: [
                    { type:'string',required: true, message: '请填写', trigger: 'blur' }
                ],
                count3: [
                    { type:'string',required: true, message: '请填写', trigger: 'blur' }
                ],
                points1: [
                    { type:'string',required: true, message: '请填写', trigger: 'blur' }
                ],
                points2: [
                    { type:'string',required: true, message: '请填写', trigger: 'blur' }
                ],
                points3: [
                    { type:'string',required: true, message: '请填写', trigger: 'blur' }
                ],
            }
        }
    },
    created(){
        this.getForm()
    },
    methods:{
      async getForm(){
        let sendData = {}
        await getSaleConfig_api(sendData).then(response=>{
          if(response&&response.status == 0){
              let aData = response.data
              this.formForNotive.Basic=aData.cill,
              this.formForNotive.count1=JSON.stringify(aData.commision_1),
              this.formForNotive.count2=JSON.stringify(aData.commision_2),
              this.formForNotive.count3=JSON.stringify(aData.commision_3),
              this.formForNotive.points1=JSON.stringify(aData.rank_1),
              this.formForNotive.points2=JSON.stringify(aData.rank_2),
              this.formForNotive.points3=JSON.stringify(aData.rank_3)
          }
        })
        
      },

      async editShopText(formName){
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
        let sendData ={}
        sendData.cill = this.formForNotive.Basic
        sendData.commision_1 = this.formForNotive.count1
        sendData.commision_2 = this.formForNotive.count2
        sendData.commision_3 = this.formForNotive.count3
        sendData.rank_1 = this.formForNotive.points1
        sendData.rank_2=this.formForNotive.points2,
        sendData.rank_3=this.formForNotive.points3

        editSaleConfig_api(sendData).then(data=>{
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
      },
    }
}
</script>

