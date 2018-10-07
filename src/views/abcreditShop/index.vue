<style lang="stylus">
  .notice
    .header
      margin-top 20px
  .margin-btm20
    margin-bottom 20px
// #app    
//   .out-dialog
//     .el-dialog
//       padding-right 10%
      
</style>

<template>
<div>
  <!-- 编辑和添加共用 -->
<el-dialog
  :title="isAddItem?'积分商品发布':'编辑积分商品'"
  :visible.sync="addNewShow" 
  width="70%" 
  class="out-dialog"
  >
  <el-dialog :visible.sync="dialogVisible" append-to-body>
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
  <el-form :model="formForNotive"  v-loading="editLoading" ref="ruleForm" :rules="rules" size="medium" >
    <el-form-item  label="商品图片"  :label-width="formLabelWidth"  prop="fileList1">
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
    <el-form-item label="商品名称" :label-width="formLabelWidth" prop="goodsName">
      <el-input v-model="formForNotive.goodsName" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="商品价格" :label-width="formLabelWidth" prop="goodsPrice">
      <!-- <el-input v-model="formForNotive.goodsPrice" auto-complete="off" size="mini"></el-input> -->
      <el-col :span="3">
        <el-input v-model="formForNotive.goodsCredit" auto-complete="off" size="mini"></el-input>
      </el-col>
      <el-col :span="1">积分 + </el-col>
      <el-col :span="3">
        <el-input v-model="formForNotive.goodsPrice" auto-complete="off" size="mini"></el-input>
      </el-col>
          <el-col :span="1">元</el-col>
    </el-form-item>

    <el-form-item label="商品编号" :label-width="formLabelWidth" prop="goodsNum">
      <el-input v-model="formForNotive.goodsNum" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="商品库存" :label-width="formLabelWidth" prop="goodsTotal">
      <el-input v-model="formForNotive.goodsTotal" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="商品描述" :label-width="formLabelWidth" prop="goodsDescribe">
      <el-input v-model="formForNotive.goodsDescribe" type="textarea" auto-complete="off"></el-input>
    </el-form-item>
    <!-- <el-form-item label="运费" :label-width="formLabelWidth" prop="goodsTrans">
      <el-input v-model="formForNotive.goodsTrans" auto-complete="off"></el-input>
    </el-form-item> -->
    <el-form-item label="商品详情设置" :label-width="formLabelWidth" prop="fileList2" >
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
  <!-- header -->
<el-header class="header" style="height:auto;">
  <el-form :inline="true" :model="formInline" class="form">
    <el-form-item>
      <el-button type="primary" icon="el-icon-edit-outline" @click="addItem">新增商品</el-button>
    </el-form-item>
    <!-- <el-form-item>
      <el-input style="width: 340px;" placeholder="请输入商品名称、编号" v-model="listQuery.search"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
    </el-form-item> -->
    <!-- 在listQuery中添加 ？ -->
    <!-- <el-form-item>
      <el-select v-model="section" placeholder="兑换条件" >
        <el-option
          v-for="item in creditSection"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button> -->
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
      @selection-change="handleSelectionChange"
      style="width: 100%" >
      <el-table-column
        type="selection"
        width="105">
      </el-table-column>
      <el-table-column
        label="商品图片"
        >
        <template slot-scope="scope">
          <div style="width:100px;height:100px;align-items:center;display:flex;">
            <img :src="scope.row.goodsImage" alt="" style="width:100px">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="商品名" 
        prop="goodsName"
        >
      </el-table-column>

      <el-table-column
        label="编号" 
        prop="goodsNum"
        >
      </el-table-column>
        <el-table-column
        label="状态" 
        prop="goodsState"
        >
      </el-table-column>
      <el-table-column
        label="积分" 
        prop="goodsCredit"
        >
      </el-table-column>
      <el-table-column
        label="价格" 
        prop="goodsPrice"
        >
      </el-table-column>
      <el-table-column
        label="库存" 
        prop="goodsTotal"
        >
      </el-table-column>
      <el-table-column
        label="销量" 
        prop="goodsSell"
        >
      </el-table-column>
      <el-table-column
        label="操作" 
        min-width='300px'
        >
        <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="editItem(scope.$index, scope.row)">编辑和查看</el-button>
        <el-button size="mini" type="primary" @click="deleItem(scope.$index, scope.row)">删除</el-button>
        <el-button size="mini" type="danger" v-if="scope.row.isUp" @click="downItem(scope.$index, scope.row,0)">下架商品</el-button>
        <el-button size="mini" v-else type="success" @click="downItem(scope.$index, scope.row,1)">上架商品</el-button>
        </template>
      </el-table-column>
    </el-table>
</el-main>
<!-- footer -->
<el-footer>
  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
  </el-pagination>
</el-footer>
</el-container>
</div>
</template>
<script>
import {getCreditSection_api,addCreditGoods_api,getCreditGoodsList_api,getCreditGoods_api,
upDownCreditGoods_api,editCreditGoods_api,deleCreditGoods_api,upDownCreditGoods_api2} from '@/api/seller'
import uploadFn from '@/utils/aahbs'

const formForNotive = {
        fileList1:[],
        goodsName:'',
        goodsCredit:'',
        goodsPrice:0,
        goodsNum:'',     //编号
        goodsTotal:'',  //库存
        goodsDescribe:'',
        goodsTrans:0,
        fileList2:[],
      }

export default {
  created(){
    // this.getCreditSectionList()
    this.getList()
  },
  data() {
    return {
      // out
        editLoading:false,//此页面的编辑页为 获取单条详情方式，故添加loading
        imgLimit1:1,
        imgLimit2:9,
        dialogImageUrl: '',
        dialogVisible: false,

        formForNotive:Object.assign({},formForNotive),
        rules: {
          goodsName: [
              { required: true, message: '请输入商品名', trigger: 'blur' },
              { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
          goodsCredit: [
              { type:"string",required: true, message: '请输入商品价格', trigger: 'blur',min: 1},
          ],
          goodsNum: [
              { type:"string",required: true, message: '请输入商品编号', trigger: 'blur',min: 1},
          ],
          goodsTotal: [
              { type:"string",required: true, message: '请输入库存', trigger: 'blur',min: 1},
          ],
          goodsDescribe: [
              { type:"string",required: true, message: '请输入描述', trigger: 'blur',min: 1},
          ],
          // goodsTrans: [
          //     { type:"string",required: true, message: '请输入运费', trigger: 'blur',min: 1},
          // ],
          fileList1:[
            {
              type: "array", required: true, len: 1,
              message: '请选择一张图片',
            }
          ],
          fileList2:[
            {
              type: "array", required: true, min: 1,
              message: '至少选择一张图片',
            }
          ],
          
        },
        waitAddNotice:false,
        addNewShow:false,
        isAddItem:true,
      //head
        formInline: {},
      //body
        selectedItem:[],
      //FOOT
        listQuery_detail: {
          page: 1,
          limit: 20,
          search:"",
          time:""
        },
        total_detail:1,
        section:"",
        creditSection:[{label:'校区1',value:1},{label:'校区2',value:2},],

      // --------------------
      //out
      detailListLoading:false,
      detailShow:false,
      detailTableData:[
        {
          time:'2014.1.2',
          username: '张三',
          phone: '123456',
          detail: '一个汉堡',
          type: '餐饮',
        }
      ],
      
      formLabelWidth:'140px',
      //header
      
      // body
      listLoading: false,
      tableData: [

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
    // out

      //规格2
      addSize_out(){
        this.formForNotiveChild2List.push({})
      },
      deleteSize_out(index){
        this.formForNotiveChild2List.splice(index,1)
      },
      //图片相关
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
        console.log(this.formForNotive.fileList2)
      },
      onsuccess(){
        console.log('sucess----',arguments)
      },
      beforere(){
        console.log('beforere----',arguments)
      },
      beforeup(){
        console.log('beforeup----',arguments)
      },
      preview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
        console.log('preview----',arguments)
      },
      getFiles(arr){ //得到文件数组
        let files = []
        let urls = [] 
        arr.forEach(item=>{
          if(item.raw){
            files.push(item.raw)
          }else{
            urls.push(item.url)
          }
        })
        return {
          files,urls
        }
      },
      //添加新商品条目
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
        // 通过验证

        this.waitAddNotice = true
        let sendData = {}

        // //废物值
        // sendData.cate_id = 764
        // sendData.cate_name = '自定义分类'
        // sendData.type_id = 0
        // sendData.mobile_body = 764
        // sendData.goods_marketprice = this.formForNotive.goodsPrice
        // sendData.goods_costprice = this.formForNotive.goodsPrice
        // sendData.goods_discount = 1
        // sendData.school_name = '11'
        // sendData.school_id = 112
        // // 近似 废物值
        // sendData.is_virtual = false
        // sendData.virtual_limit = 10
        // sendData.virtual_indate = ''
        // sendData.is_platform_store = false
        // sendData.is_virtual = false

        // 商品图片
        let urls1 = await uploadFn(this.formForNotive.fileList1[0].raw)
        // sendData.goods_image = urls1[0]
        sendData.pgoods_image = JSON.stringify(urls1)
        
        // let fileAndUrl0 = this.getFiles(this.formForNotive.fileList1)
        // let files0 = fileAndUrl0.files
        // let urls0Piece1 = await uploadFn(files0)
        // let urls0 = urls0Piece1.concat(fileAndUrl0.urls)
        // sendData.goods_image= urls0?JSON.stringify(urls0):''

        // 商品详情 万金油
        let fileAndUrl = this.getFiles(this.formForNotive.fileList2)
        let files2 = fileAndUrl.files
        let urls2Piece1 = await uploadFn(files2)
        let urls2 = urls2Piece1.concat(fileAndUrl.urls)
        sendData.pgoods_body= urls2?JSON.stringify(urls2):''

        //商品名称
        sendData.pgoods_name= this.formForNotive.goodsName
        // 商品编号
        sendData.pgoods_serial= this.formForNotive.goodsNum
        //库存 放在规格里 
        sendData.pgoods_storage= this.formForNotive.goodsTotal
        //描述
        sendData.pgoods_description= this.formForNotive.goodsDescribe
        // 运费
        sendData.pgoods_view= 0

        sendData.pgoods_price = this.formForNotive.goodsPrice
        sendData.pgoods_points = this.formForNotive.goodsCredit

        addCreditGoods_api(sendData).then(data=>{
          this.waitAddNotice = false
          this.addNewShow = false
          if(data.status===0){
            this.$notify({
              title: '上传成功',
              message: '已新增商品',
              type: 'success'
            })
            this.getList()
          }else{
            this.$notify({
              title: '上传失败',
              message: '新增商品失败',
              type: 'error'
            })
          }
        }).catch(e=>{
          this.waitAddNotice = false
          this.addNewShow = false
          console.error('manageShop:addGoods_api 接口错误')
        })
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
        // 通过验证
        this.waitAddNotice = true
        let sendData = {}

        // //废物值
        // sendData.cate_id = 764
        // sendData.cate_name = '自定义分类'
        // sendData.type_id = 0
        // sendData.mobile_body = 764
        // sendData.goods_marketprice = this.formForNotive.goodsPrice
        // sendData.goods_costprice = this.formForNotive.goodsPrice
        // sendData.goods_discount = 1
        // sendData.school_name = '11'
        // sendData.school_id = 112
        // // 近似 废物值
        // sendData.is_virtual = false
        // sendData.virtual_limit = 10
        // sendData.virtual_indate = ''
        // sendData.is_platform_store = false
        // sendData.is_virtual = false

        // 商品图片
        // let urls1 = await uploadFn(this.formForNotive.fileList1[0].raw)
        // // sendData.goods_image = urls1[0]
        // sendData.pgoods_image = JSON.stringify(urls1)

        let fileAndUrl0 = this.getFiles(this.formForNotive.fileList1)
        let files0 = fileAndUrl0.files
        let urls0Piece1 = await uploadFn(files0)
        let urls0 = urls0Piece1.concat(fileAndUrl0.urls)
        sendData.goods_image= urls0?JSON.stringify(urls0):''
        

        // 商品详情 万金油
        let fileAndUrl = this.getFiles(this.formForNotive.fileList2)
        let files2 = fileAndUrl.files
        let urls2Piece1 = await uploadFn(files2)
        let urls2 = urls2Piece1.concat(fileAndUrl.urls)
        sendData.pgoods_body= urls2?JSON.stringify(urls2):''

        //商品名称
        sendData.pgoods_name= this.formForNotive.goodsName
        // 商品编号
        sendData.pgoods_serial= this.formForNotive.goodsNum
        //库存 放在规格里 
        sendData.pgoods_storage= this.formForNotive.goodsTotal
        //描述
        sendData.pgoods_description= this.formForNotive.goodsDescribe
        // 运费
        sendData.pgoods_view= 0
        sendData.pgoods_id= this.formForNotive.id

        
        
        sendData.pgoods_price = Number(this.formForNotive.goodsPrice)
        sendData.pgoods_points = this.formForNotive.goodsCredit

        editCreditGoods_api(sendData).then(data=>{
          this.waitAddNotice = false
          this.addNewShow = false
          if(data.status===0){
            this.$notify({
              title: '上传成功',
              message: '已新增商品',
              type: 'success'
            })
            this.getList()
          }else{
            this.$notify({
              title: '上传失败',
              message: '新增商品失败',
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
      addItem(){ //显示 弹框
        this.isAddItem = true
        this.addNewShow = true
        this.formForNotive = Object.assign({},formForNotive)
      },
    //body
      handleSelectionChange(row){ //批量处理
        this.selectedItem = row
      },

      editItem(index,row){
        this.formForNotive = Object.assign({},row)
        console.log(row)
        this.isAddItem = false
        this.addNewShow = true
      },

      async downShop(id,wantUp,mutil){ //批量传mutil
        let sendData = {
          pgoods_id:id,
          type:wantUp===0?'offline':'online'
        }
        upDownCreditGoods_api(sendData).then(res=>{
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
      async downShop2(id,wantUp,mutil){ //批量传mutil
        let sendData = {
          pgoods_id_arr:[15,16],
          type:wantUp===0?'offline':'online'
        }
        if(mutil){
          let tempIdList = []
          for(let i =0 ;i<this.selectedItem.length;i++){
            tempIdList.push(this.selectedItem[i].id)
          }
          sendData = {
            pgoods_id_arr:tempIdList,
            type:wantUp===0?'offline':'online'
          }
        }
        else{
          sendData = {
            pgoods_id_arr:[id],
            type:wantUp===0?'offline':'online'
          }
        }
        upDownCreditGoods_api2(sendData).then(res=>{
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
        this.$confirm(`此操作将${wantUp===1?'批量上架':'批量下架'}该商品, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.downShop2(0,wantUp,true) //批量
        }).catch(()=>{
          this.$notify.info({
            title: '消息',
            message: '已取消'
          });
        })
      },
      async downItem(index,data,wantUp){
        let id = data.id
        this.$confirm(`此操作将${wantUp===1?'上架':'下架'}该商品, 是否继续?`, '提示', {
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

      getList() {
        this.listLoading = true
        let sendData = Object.assign({},this.listQuery)

        getCreditGoodsList_api(sendData).then(response => {
          if(response&&response.status==0){
            let result = response.data
            let tempTableData = []
            let temp_image = ""
            result.forEach((aData)=>{
              
                let temp_fileList1 = []
                let temp_fileList2 = []
                if(aData.pgoods_image){
                  let image = JSON.parse(aData.pgoods_image)
                  temp_fileList1.push({url:image[0]})
                  temp_image = JSON.parse(aData.pgoods_image)                
                }
                if(aData.pgoods_body){
                    let temp_file = JSON.parse(aData.pgoods_body)
                    for(var i=0;i<temp_file.length;i++){
                      temp_fileList2.push({
                        url:temp_file[i]
                      })
                    }
                }

              tempTableData.push({
                //后端生成
                id:aData.pgoods_id,
                isUp:aData.pgoods_show,
                //前后统一
                fileList1:temp_fileList1,
                fileList2:temp_fileList2,
                goodsImage:temp_image[0],//显示
                goodsName:aData.pgoods_name,//显示
                goodsPrice:Number(aData.pgoods_price),//显示
                goodsCredit:aData.pgoods_points,
                goodsNum:aData.pgoods_serial,//显示
                goodsState:aData.pgoods_state,
                goodsSell:aData.pgoods_salenum,
                goodsTotal:JSON.stringify(aData.pgoods_storage),
                goodsDescribe:aData.pgoods_description,
                // goodsTrans:JSON.stringify(aData.pgoods_view),
              })          
            })
            this.tableData = tempTableData
            this.total = response.pagination&&response.pagination.total?response.pagination.total:1
          }else{

          }
          console.log("getList",response)
          this.listLoading = false
        }).catch(e=>{
          this.listLoading = false
        })
      },

    deleItem(index,row){
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
        pgoods_id:id,
      }
      deleCreditGoods_api(sendData).then(res=>{
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
    // -------------------------------------------------------------
    // ------------------------------------
    //out
    addDetailItem(){
      this.formForNotive.goodsDetail.push({
            fileList:[],
            title:'xxx',
            content:'cccxxx',
          })
    },
      //file upload
      
    getCreditSectionList() {
      this.listLoading = true
      let sendData = Object.assign({},this.listQuery)
      getCreditSection_api (sendData).then(response => {
        if(response && response.status==0){
          let result = response.data
          let tempTableData = []
          result.forEach((aData)=>{
            tempTableData.push({
              value:aData.psubsection_id,
              label:aData.psubsection_numerical,
            })
          })
          this.creditSection = tempTableData
        }
        this.listLoading = false
      })
    },
    getList_detail(){
      console.log('getList_detail 暂时留白')
    },
    handleSizeChange_detail(val) {
      this.listQuery_detail.limit = val
      this.getList_detail()
    },
    handleCurrentChange_detail(val) {
      this.listQuery_detail.page = val
      this.getList_detail()
    },
    

    //body
    search(){
        this.getList()
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