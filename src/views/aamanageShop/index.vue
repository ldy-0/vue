<style lang="stylus">
  .notice
    .header
      margin-top 20px
</style>

<template>
<div>
  <!-- out -->
  <!-- 编辑和添加共用 -->
<el-dialog
  :title="isAddItem?'新增店铺':'编辑店铺'"
  :visible.sync="addNewShow" 
  
  width="70%" 
  >
  <el-dialog :visible.sync="dialogVisible" append-to-body>
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
  <el-form :model="formForNotive"  ref="ruleForm" :rules="rules" >
    <el-form-item label="店铺名称" :label-width="formLabelWidth" prop="title">
      <el-input v-model="formForNotive.title" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="店主姓名" :label-width="formLabelWidth"  prop="username">
      <el-input v-model="formForNotive.username" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="联系方式" :label-width="formLabelWidth" prop="phone">
      <el-input v-model="formForNotive.phone" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="店主账号" :label-width="formLabelWidth" prop="account">
      <el-input :disabled="!isAddItem" v-model="formForNotive.account" placeholder="此处为商家账号，要求必须唯一" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item  label="所属行业"  :label-width="formLabelWidth" prop="industry">
      <el-select v-model="formForNotive.industry" placeholder="请选择行业">
        <el-option
          v-for="item in industryList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <!-- {{formForNotive.province}}+{{formForNotive.city}} -->
    <!-- 默认 0 17 湖北 武汉 -->
      <el-form-item  label="省"  :label-width="formLabelWidth" prop="province">
        <el-select filterable @change="provinceChange" v-model="formForNotive.province" placeholder="请选择">
          <el-option
            v-for="item in optionsProvince"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  label="城市" prop="city"  :label-width="formLabelWidth" >
        <el-select filterable v-model="formForNotive.city" placeholder="请选择">
          <el-option
            v-for="item in optionsCity"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

    <el-form-item  label="上传营业执照"  :label-width="formLabelWidth" prop="fileList1">
          <el-upload 
          :auto-upload="false"
            action=""
            :limit="imgLimit1"
          list-type="picture-card" 
          :on-success="onsuccess"
          :on-preview="preview"
          :on-remove="remove1" 
          :on-change="change1"
          :before-upload="beforeup" 
          :before-remove="beforere" 
          :file-list="formForNotive.fileList1"
          >
          <i class="el-icon-plus"></i>
        </el-upload>
    </el-form-item>
    <el-form-item  label="身份证(正反面)"  :label-width="formLabelWidth" prop="fileList2">
          <el-upload 
          :auto-upload="false"
            action="" 
            :limit="imgLimit2"
          list-type="picture-card" 
          :on-success="onsuccess"
          :on-preview="preview"
          :on-remove="remove2" 
          :on-change="change2"
          :before-upload="beforeup" 
          :before-remove="beforere" 
          :file-list="formForNotive.fileList2"
          >
          <i class="el-icon-plus"></i>
        </el-upload>
    </el-form-item>
    <!-- {{formForNotive.checked}} -->
    <el-form-item label="支付数据" :label-width="formLabelWidth">
      <el-checkbox v-model="formForNotive.checked">是否为独立小程序</el-checkbox>
    </el-form-item>
    <el-form :model="formForNotiveChild" v-if="formForNotive.checked" 
      ref="ruleFormChild" :rules="rulesChild">
      <el-form-item label="appid" :label-width="formLabelWidth" prop="appid" >
        <el-input  v-model="formForNotiveChild.appid" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="secretid" :label-width="formLabelWidth" prop="secretid">
        <el-input  v-model="formForNotiveChild.secretid" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="商户号" :label-width="formLabelWidth" prop="shopNum">
        <el-input  v-model.number="formForNotiveChild.shopNum" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="支付秘钥" :label-width="formLabelWidth" prop="payKey">
        <el-input  v-model="formForNotiveChild.payKey" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addNewShow = false">取 消</el-button>
    <el-button v-if="isAddItem" type="primary" @click="addShop('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确 定</el-button>
     <el-button v-else type="primary" @click="editShop('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确认修改</el-button>
  </span>
</el-dialog>
<el-container class="notice">
<el-header class="header" style="height:auto;">
  <el-form :inline="true" :model="formInline" class="form">
    <el-form-item>
      <el-button type="primary" icon="el-icon-edit-outline" @click="addItem">新增店铺</el-button>
    </el-form-item>
    <el-form-item>
      <el-input style="width: 340px;" placeholder="请输入联系方式或店名" v-model="listQuery.search"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
    </el-form-item>
    <!-- 在listQuery中添加 ？ -->
    <!-- <el-form-item>
      <el-select v-model="industry" placeholder="请选择行业">
        <el-option
          v-for="item in industryList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-button type="primary" icon="el-icon-search" @click="searchByDate">查询</el-button> -->
  </el-form>
  <el-form  :inline="true" class="form">
    <el-form-item label="导出Excel">
      <el-button  type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">{{exportExcelStatus}}</el-button>
      <span class="s-inline-tips">导出所有数据，这个过程可能会需要花费  <span class="s-hot">几分钟</span> 的时间，请耐心等待</span>
    </el-form-item>
  </el-form>
  <el-form :inline="true"  class="form">
    <el-badge :value="selectedItem.length" style="margin-right:20px">
      <el-button :type="selectedItem.length?'primary':''" round icon="el-icon-tickets">{{selectedItem.length>0?'已选'+selectedItem.length+'条目':'请勾选项目'}}</el-button>
    </el-badge>
    <el-form-item>
      <el-button type="success" round @click="downMutilItem(1)"  :disabled="selectedItem.length<1">批量上架</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="danger" round @click="downMutilItem(0)" :disabled="selectedItem.length<1">批量下架</el-button>
    </el-form-item>
  </el-form>          
</el-header>
<el-main>
    <el-table
      :data="tableData"
      stripe 
      v-loading="listLoading" element-loading-text="给我一点时间"
      style="width: 100%" 
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="店铺ID"
        prop="id"
        >
      </el-table-column>
      <el-table-column
        label="店主姓名"
        prop="username"
        >
      </el-table-column>
      <el-table-column
        label="联系方式" 
        prop="phone"
        >
      </el-table-column>
      <el-table-column
        label="店名" 
        prop="title"
        >
      </el-table-column>
      <el-table-column
        label="行业" 
        prop="industryName"
        >
      </el-table-column>
      <el-table-column
        label="剩余访问量" 
        prop="lastvisit"
        >
        <!-- <template slot-scope="scope">
          <i class="el-icon-edit-outline"></i>
          <span style="margin-left: 10px">{{ scope.row.lastvisit }}</span>
        </template> -->
      </el-table-column>
      <el-table-column
        label="独立小程序" 
        prop="hasPayDataTXT"
        >
      </el-table-column>
      <el-table-column
        label="操作" 
        min-width='200px'
        >
        <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="editItem(scope.$index, scope.row)">查看和编辑</el-button>
        <el-button size="mini" type="danger" v-if="scope.row.isUp" @click="downItem(scope.$index, scope.row,0)">下架店铺</el-button>
        <el-button size="mini" v-else type="success" @click="downItem(scope.$index, scope.row,1)">上架店铺</el-button>
        <!-- <el-button size="mini" type="info" @click="lookItem(scope.$index, scope.row)">查看明细</el-button> -->
        </template>
      </el-table-column>
      <el-table-column
        label="危险操作" 
        >
        <template slot-scope="scope">
        <el-button size="mini" type="danger" @click="deleteItem(scope.$index, scope.row)">删除店铺</el-button>
        </template>
      </el-table-column>
    </el-table>
</el-main>
<el-footer>
  <el-pagination background @size-change="handleSizeChange"  @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
  </el-pagination>
</el-footer>
</el-container>
</div>
</template>
<script>
// getList 接口 获取
// addNotice 接口 添加
import {getPostionList_api,getIndustryList_api,addShop_api,editShop_api,getShop_api,upDownShop,deleteShop_api,getROrderList_api} from '@/api/admin'
import uploadFn from '@/utils/aahbs'

const formForNotive = { //此页面 静态数据
        title:'',
        username:'',
        phone:'',
        account:'',
        industry:'',
        province:'',
        city:'',
        fileList1:[],//[{url:'xxx},{raw:File}] 格式
        fileList2:[],
        checked:false
      }
const formForNotiveChild = { //此页面 静态数据
        appid:'',
        secretid:'',
        shopNum:'',
        payKey:''
      }
// const formForNotiveChild = { //此页面 静态数据
//         appid:'wx688a62dbb767216d',
//         secretid:'28183b40e4dd912241ebe8144a799a90',
//         shopNum:1234567890,
//         payKey:'28183b40e4dd912241ebe8144a799a90'
//       }
export default {
  created(){
    this.getList()
    // console.log('created',window.JSON.parse(localStorage.positonList))
    this.getPostionList()
    this.getIndustryList()
    // getROrderList_api()
  },
  data() {
    return {
      //out
        //状态层
      // editLoading:false,
      waitAddNotice:false,
      addNewShow:false,
      isAddItem:true,
  
      positonList:[],
      optionsProvince:[{label:'湖北',value:17}],
      optionsCity:[{label:'武汉市',value:258}],
      dialogImageUrl: '', //上传图片大图显示
      dialogVisible: false,
      imgLimit1:1, //弹框图片限制
      imgLimit2:2,
      formLabelWidth:'140px',//弹框1 左侧文字默认宽度

      industryList: [{  //通过接口获取 created时
          value: 'edu',
          label: '教育'
        }, {
          value: 'others',
          label: '其他'
        }],
      formForNotive:Object.assign({},formForNotive),
      rules: {
        title: [
            { required: true, message: '请输入店铺名称', trigger: 'blur' },
            { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
        phone: [
            { type:"string",required: true, message: '请输入联系方式', trigger: 'blur',min: 6},
        ],
        account: [
            { type:"string",required: true, message: '请输入账号', trigger: 'blur',min: 1},
        ],
        industry: [
            { type:"number",required: true, message: '请输入行业', trigger: 'blur',min: 1},
        ],
        province: [
            { type:"number",required: true, message: '请输入省份', trigger: 'blur',min: 1},
        ],
        city: [
            { type:"number",required: true, message: '请输入城市', trigger: 'blur',min: 1},
        ],
        fileList1:[
          {
            type: "array", required: true, len: 1,
            message: '请选择一张图片',
            // fields: {
            //   0: {required: true}
            // }
          }
        ],
        fileList2:[
          {
            type: "array", required: true, len: 2,
            message: '请选择两张图片',
          }
        ],
      },
      formForNotiveChild:Object.assign({},formForNotiveChild),
      rulesChild: {
        appid: [
            { required: true, message: '请输入appid,微信公众平台=>设置=>开发设置=>开发者设置', trigger: 'blur' },
            { len:18, message: '请输入正确的appid', trigger: 'blur' }
        ],
        secretid: [
            { required: true, message: '请输入secretid,微信公众平台=>设置=>开发设置=>开发者设置', trigger: 'blur' },
            { len:32, message: '请输入正确的secretid', trigger: 'blur' }
        ],
        shopNum: [
            { type:"integer",required: true, message: '请输入正确的商户号', trigger: 'blur',min: 1},
        ],
        payKey: [
            { required: true, message: '请输入支付秘钥', trigger: 'blur' },
            { len:32, message: '请输入正确的支付秘钥', trigger: 'blur' }
        ],
      },
      //head
        // excel 
          tableDataAll:'',
          autoWidth:true,
          filename:'店铺管理Excel',
          exportExcelStatus:'导出',
          downloadLoading:false,
      selectedItem:[],
      formInline: {},
      //body
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
      // ------------------------
    }
  },
  methods: {
    //test
    // handleSelectionChange(row){
    //   console.log(row)
    // },
    //out
    getIndustryList(){ //获取 行业列表 
      return new Promise((res,rej)=>{
        getIndustryList_api().then(data=>{
          if(data.status===0){
            let tempData = []
            for(let i = 0 ,len = data.data.length;i<len;i++){
              tempData.push({
                label:data.data[i].storeclass_name,
                value:data.data[i].storeclass_id,
              })
            }
            this.industryList = tempData
            res()
          }else{
            console.error('manageShop:getIndustryList_api 状态码为1')
            rej(data)
          }
        }).catch(e=>{
          console.error('manageShop:getIndustryList_api 接口错误')
          rej()
        })
      })
    },
    getPostionList(){ //获取 位置列表
      try{
        if(localStorage.positonList&&typeof localStorage.positonList === 'string'&&localStorage.positonList.length>100){
          console.log('localStorage.positonList')
          this.positonList = window.JSON.parse(localStorage.positonList)
          this.optionsProvince = this.positonList[0]
          this.optionsCity = this.positonList[17]
          return
        }
      }catch(err){
        console.error(err,'getPostionList localstoryge')
      }
      //第一次获取
      getPostionList_api().then(data=>{
        if(data.status===0){
          let tempData1 = []
          let tempData = []
          for(let key in data.data){
            tempData1[key] = data.data[key]
          }
          for(let i = 0 ,len = tempData1.length;i<len;i++){
            tempData.push([])
            // [0]
            for(let j = 0 , len2 = tempData1[i].length;j<len2;j++){
              tempData[i].push({
                label:tempData1[i][j][1],
                value:tempData1[i][j][0]
              })
            }
          }
          //对data处理完毕
          console.log(tempData)
          try{
            localStorage.positonList = window.JSON.stringify(tempData)
          this.positonList = tempData
          this.optionsProvince = this.positonList[0]
          this.optionsCity = this.positonList[17]
          }catch(err){
            console.log(err,'------------api then-------------')
          }
        }
      }).catch(e=>{
        console.error('manageShop:getPostionList_api 接口错误')
      })
    },
    provinceChange(index){ // 位置 改变的钩子 select联动
      this.optionsCity = this.positonList[index]
      this.formForNotive.city = this.positonList[index][0].value
    },
    preview(file) { //预览任意图片
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
        console.log('preview----',arguments)
    },
    remove1() { //每次改变图片获取最新的filelist
        console.log('remove----',arguments)
        this.formForNotive.fileList1 = arguments[1]
    },
    change1() {
      console.log('change----',arguments)
      this.formForNotive.fileList1 = arguments[1]
    },
    remove2() { //每次改变图片获取最新的filelist
        console.log('remove----',arguments)
        this.formForNotive.fileList2 = arguments[1]
    },
    change2() {
      console.log('change----',arguments)
      this.formForNotive.fileList2 = arguments[1]
    },
    async addShop(formName){
      if(this.formForNotive.checked){
        let resChild = await new Promise((res,rej)=>{
          this.$refs['ruleFormChild'].validate((valid) => {
            if (valid) {
              res(true)
            } else {
              res(false)
            }
          })
        })
        if(!resChild){
          return 
        }
      }
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
      let sendData = new FormData() 

      let payDataTemp = []
      if(this.formForNotive.checked){
        payDataTemp.push({
          key:'appid',
          value:this.formForNotiveChild.appid
        })
        payDataTemp.push({
          key:'secretid',
          value:this.formForNotiveChild.secretid
        })
        payDataTemp.push({
          key:'shopNum',
          value:this.formForNotiveChild.shopNum
        })
        payDataTemp.push({
          key:'payKey',
          value:this.formForNotiveChild.payKey
        })
      }
      try{
        payDataTemp = JSON.stringify(payDataTemp)
      }catch(e){
        payDataTemp = '[]'
      }
      sendData.append('payData',payDataTemp)

      let allUrl1 = await uploadFn(this.formForNotive.fileList1[0].raw)
      let allUrl2 = await uploadFn(this.formForNotive.fileList2[0].raw)
      let allUrl3 = await uploadFn(this.formForNotive.fileList2[1].raw)
      try{
        sendData.append('business_licence',allUrl1[0])
        sendData.append('id_card_front',allUrl2[0])
        sendData.append('id_card_behind',allUrl3[0])
      }catch(err){
        this.waitAddNotice = false
        console.log(err,'图片不能为空')
      }

      sendData.append('store_member_name',this.formForNotive.account)
        //store_telephone contacts_phone
      // sendData.append('store_telephone',this.formForNotive.phone)
      sendData.append('store_name',this.formForNotive.title)
      sendData.append('storeclass_id',this.formForNotive.industry)
      sendData.append('contacts_name',this.formForNotive.username)
        //store_telephone contacts_phone
      sendData.append('contacts_phone',this.formForNotive.phone)
      sendData.append('company_province_id',this.formForNotive.province)
      sendData.append('company_city_id',this.formForNotive.city)
      
      console.log(sendData)
      addShop_api(sendData).then(data=>{
        this.waitAddNotice = false
        this.addNewShow = false
        if(data.status===0){
          this.$notify({
            title: '上传成功',
            message: '已新增店铺',
            type: 'success'
          })
          this.getList()
        }else{
          this.$notify({
            title: '上传失败',
            message: '新增店铺失败',
            type: 'error'
          })
        }
      }).catch(e=>{
        this.waitAddNotice = false
        this.addNewShow = false
        console.error('manageShop:getPostionList_api 接口错误')
      })
    },
    async editShop(formName){ 
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
      let payDataTemp = []
      if(this.formForNotive.checked){
        payDataTemp.push({
          key:'appid',
          value:this.formForNotiveChild.appid
        })
        payDataTemp.push({
          key:'secretid',
          value:this.formForNotiveChild.secretid
        })
        payDataTemp.push({
          key:'shopNum',
          value:this.formForNotiveChild.shopNum
        })
        payDataTemp.push({
          key:'payKey',
          value:this.formForNotiveChild.payKey
        })
      }
      try{
        payDataTemp = JSON.stringify(payDataTemp)
      }catch(e){
        payDataTemp = '[]'
      }
      sendData['payData'] = payDataTemp
      // let sendData = new FormData() 
      //图片处理
      let allUrl1,allUrl2,allUrl3
      if(this.formForNotive.fileList1[0].raw){
         allUrl1 = await uploadFn(this.formForNotive.fileList1[0].raw)
         allUrl1 = allUrl1[0]
      }else{
         allUrl1 = this.formForNotive.fileList1[0].url
      }
      sendData['business_licence'] = allUrl1

      if(this.formForNotive.fileList2[0].raw){
         allUrl2 = await uploadFn(this.formForNotive.fileList2[0].raw)
         allUrl2 = allUrl2[0]
      }else{
         allUrl2 = this.formForNotive.fileList2[0].url
      }
      sendData['id_card_front'] = allUrl2

      if(this.formForNotive.fileList2[1].raw){
         allUrl3 = await uploadFn(this.formForNotive.fileList2[1].raw)
         allUrl3 = allUrl3[0]
      }else{
         allUrl3 = this.formForNotive.fileList2[1].url
      }
      sendData['id_card_behind'] = allUrl3

      sendData['store_id'] = this.formForNotive.id
      // sendData['seller_name'] = this.formForNotive.account
      sendData['store_name'] = this.formForNotive.title
      sendData['storeclass_id'] = this.formForNotive.industry
      sendData['contacts_name'] = this.formForNotive.username
      sendData['contacts_phone'] = this.formForNotive.phone
      sendData['company_province_id'] = this.formForNotive.province
      sendData['company_city_id'] = this.formForNotive.city
      
      // //后台生成 id
      // sendData.append('store_id',this.formForNotive.id)
      // // sendData.append('seller_name',this.formForNotive.account)
      //   //store_telephone contacts_phone
      // // sendData.append('store_telephone',this.formForNotive.phone)
      // sendData.append('store_name',this.formForNotive.title)
      // sendData.append('storeclass_id',this.formForNotive.industry)
      // sendData.append('contacts_name',this.formForNotive.username)
      //   //store_telephone contacts_phone
      // sendData.append('contacts_phone',this.formForNotive.phone)
      // sendData.append('company_province_id',this.formForNotive.province)
      // sendData.append('company_city_id',this.formForNotive.city)
      
      // //图片处理
      // if(this.formForNotive.fileList1[0].raw){
      //   let allUrl1 = await uploadFn(this.formForNotive.fileList1[0].raw)
      //   sendData.append('business_licence',allUrl1[0])
      // }else{
      //   let allUrl1 = this.formForNotive.fileList1[0].url
      //   sendData.append('business_licence',allUrl1)
      // }

      // if(this.formForNotive.fileList2[0].raw){
      //   let allUrl2 = await uploadFn(this.formForNotive.fileList2[0].raw)
      //   sendData.append('id_card_front',allUrl2[0])
      // }else{
      //   let allUrl2 = this.formForNotive.fileList2[0].url
      //   sendData.append('id_card_front',allUrl2)
      // }

      // if(this.formForNotive.fileList2[1].raw){
      //   let allUrl3 = await uploadFn(this.formForNotive.fileList2[1].raw)
      //   sendData.append('id_card_behind',allUrl3[0])
      // }else{
      //   let allUrl3 = this.formForNotive.fileList2[1].url
      //   sendData.append('id_card_behind',allUrl3)
      // }
      
      editShop_api(sendData).then(data=>{
        this.waitAddNotice = false
        this.addNewShow = false
        if(data.status===0){
          this.$notify({
            title: '上传成功',
            message: '已新增店铺',
            type: 'success'
          })
          this.getList()
        }else{
          this.$notify({
            title: '上传失败',
            message: '新增店铺失败',
            type: 'error'
          })
        }
      }).catch(e=>{
        this.waitAddNotice = false
        this.addNewShow = false
        console.error('manageShop:editShop_api 接口错误')
      })
    },
    //head
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
          const tHeader = ['店铺ID', '店主姓名', '联系方式', '店名', '行业','剩余访问量','独立小程序','上架状态']
          const filterVal = ['id', 'username', 'phone', 'title', 'industryName','lastvisit','hasPayDataTXT','isUpTXT']
          const tableDataAll = this.tableDataAll
          const data = this.formatJson(filterVal, tableDataAll)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth
          })
          this.downloadLoading = false
        })
      },
    addItem(){ //显示 弹框
      // this.editLoading = false
      this.isAddItem = true
      this.addNewShow = true
      this.formForNotive = Object.assign({},formForNotive)
    },
    search(){ // 此时listQuery已经改变
      this.getList()
    },
    //body
    deleteNewNotice(id){
        let sendData = {
          store_id:id,
        }
        deleteShop_api(sendData).then(res=>{
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
    deleteItem(index,row){
        let id = row.id
        this.$confirm(`此操作将删除该店铺，并删除该店铺所有数据, 是否继续?`, '提示', {
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
    handleSelectionChange(row){ //批量处理
      this.selectedItem = row
    },
    async getList(all) { //获取店铺列表
      // 立一个flag 因为当前函数 promise化 需要检测 接口返回状态 
      let flag = false
      this.listLoading = true
      let sendData = Object.assign({},this.listQuery)
      if(all){
          sendData.limit = 0
      }
      await getShop_api(sendData).then(response => {
        this.listLoading = false
        if(response&&response.status==0){
          flag = true
          let result = response.data
          let tempTableData = []
          result.forEach((aData)=>{
            let temp_fileList1 =[]
            let temp_fileList2 =[]
            if(aData.business_licence){
              temp_fileList1.push({url:aData.business_licence})
            }
            if(aData.id_card_front){
              temp_fileList2.push({url:aData.id_card_front})
            }
            if(aData.id_card_behind){
              temp_fileList2.push({url:aData.id_card_behind})
            }
            // 返回的字段 改这个 aData.hasPayData 
            let hasPayData = aData.payData
            let temphasPayData = []
            try{
              //确保 hasPayData 是数组
              //现在返回的是一个对象
              let n = 0
              for(let key in hasPayData){
                temphasPayData.push(
                  {
                    value:hasPayData[key],
                    key:key
                  }
                )
                n++
              }
              if(temphasPayData.length===0){
                hasPayData = []
              }else{
                hasPayData = temphasPayData
              }
            }catch(e){
              hasPayData = []
            }
            tempTableData.push({
              //后端生成
              id:aData.store_id,
              industryName:aData.storeclass_name,
              //前后统一
              username:aData.contacts_name,
              phone:aData.contacts_phone,
              title:aData.store_name,
              account:aData.seller_name,
              province:aData.company_province_id,
              city:aData.company_city_id,
              industry:aData.storeclass_id,
              fileList1:temp_fileList1,
              fileList2:temp_fileList2,
              lastvisit:aData.total_view,
              isUp:aData.store_state,
              isUpTXT:aData.store_state?'上架中':'已下架',
              // 支付数据
              hasPayDataTXT:hasPayData.length>0?'是':'否',
              hasPayData:hasPayData,
              checked:hasPayData.length>0
            })
          })
          if(all){
              this.tableDataAll = tempTableData
          }else{
              this.tableData = tempTableData
              this.total = response.pagination&&response.pagination.total?response.pagination.total:1
          }
        }else{

        }
        console.log("getList",response)
        // this.list = response
        this.listLoading = false
      }).catch(e=>{
        this.listLoading = false
      })
      return flag
    },
    editItem(index,rowData){
      // this.editLoading = true
      this.formForNotive = Object.assign({},rowData)
      //补洞
      this.optionsCity = this.positonList[this.formForNotive.province]
      if(rowData.checked){
        let temp = {}
        for(let i =0,len=rowData.hasPayData.length;i<len;i++){
          console.log(rowData.hasPayData[i].key)
          temp[rowData.hasPayData[i].key] = rowData.hasPayData[i].value
        }
        this.formForNotiveChild =  Object.assign({},temp)
      }else{
        this.formForNotiveChild =  Object.assign({},formForNotiveChild)
      }
      this.isAddItem = false
      this.addNewShow = true
    },
    async downShop(id,wantUp,mutil){
      let sendData = {}
      if(mutil){
        let tempIdList = []
        for(let i =0 ;i<this.selectedItem.length;i++){
          tempIdList.push(this.selectedItem[i].id)
        }
        sendData = {
          store_id:tempIdList,
          store_state:wantUp
        }
      }else{
        sendData = {
          store_id:[id],
          store_state:wantUp
        }
      }
      upDownShop(sendData).then(res=>{
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
        console.error('upDownShop')
      })
        
    },
    async downMutilItem(wantUp){
        this.$confirm(`此操作将${wantUp===1?'批量上架':'批量下架'}该店铺, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.downShop(0,wantUp,true) //批量
        }).catch(()=>{
          this.$notify.info({
            title: '消息',
            message: '已取消'
          });
        })
    },
    async downItem(index,data,wantUp){
      let id = data.id
      this.$confirm(`此操作将${wantUp===1?'上架':'下架'}该店铺, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.downShop(id,wantUp)
      }).catch(()=>{
        this.$notify.info({
          title: '消息',
          message: '已取消'
        });
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
    // -----------------
    //out
      //file upload
      onsuccess(){
        console.log('sucess----',arguments)
      },
      beforere(){
        console.log('beforere----',arguments)
      },
      beforeup(){
        console.log('beforeup----',arguments)
      },
      remove() {
        console.log('remove----',arguments)
      },
      change() {
        console.log('change----',arguments)
      },
  }
}
</script>