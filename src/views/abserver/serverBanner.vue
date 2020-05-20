<style lang="stylus">
.notice {
  .header {
    margin-top: 20px;
  }
}
</style>

<template>
<div>
  <!-- 编辑和添加共用 -->
  <!-- out -->
<el-dialog
  :title="isAddItem?'新增':'编辑'"
  :visible.sync="addNewShow"
  width="80%" 
  >
  <el-dialog :visible.sync="dialogVisible" append-to-body v-if="typeIndex==1">
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
  <el-form :model="formForNotive" ref="ruleForm" :rules="rules" >
    <el-form-item v-if="typeIndex==1" :label="typeIndex==1?'图片':'视频'"  :label-width="formLabelWidth" prop="fileList1">
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
    <el-form-item v-if="typeIndex==2" :label="typeIndex==1?'图片':'视频'"  :label-width="formLabelWidth" prop="fileList1">
          <el-upload 
          :auto-upload="false"
            action=""
          :limit="imgLimit1"
          list-type="text" 
          :on-success="onsuccess" 
          :on-preview="preview"
          :on-remove="remove1" 
          :on-change="change1" 
          :before-upload="beforeup" 
          :before-remove="beforere" 
          >
          <i class="el-icon-plus"></i>
        </el-upload>
    </el-form-item>
    <p class="hbs-margin-left80" v-if="typeIndex==1">请选择一张图片,建议尺寸： 宽750*高376</p>
    <p class="hbs-margin-left80" v-if="typeIndex==2">只能添加一个视频，若添加了视频则小程序端首页的轮播图变为该视频</p>
    <el-form-item label="跳转类型" :label-width="formLabelWidth" v-if="typeIndex==1">
        <el-select v-model="rules.fileList2[0].required" placeholder="请选择">
            <el-option
            v-for="item in jumpTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
    </el-form-item>
    <el-form-item v-if="rules.fileList2[0].required&&typeIndex==1" label="跳转图片" :label-width="formLabelWidth" prop="fileList2">
      <el-upload 
              :auto-upload="false"
                action=""
                :limit="imgLimit1"
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
    <el-button v-if="isAddItem" type="primary" @click="addNewBanner('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确 定</el-button>
     <el-button v-else type="primary" @click="editNewBanner('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确认修改</el-button>
  </span>
</el-dialog>
<!-- body -->
<el-container class="notice">
<el-header class="header">
  <el-form :inline="true" :model="formInline" class="form">
    <el-form-item>
      <el-button type="primary" icon="el-icon-edit-outline" @click="addItem">新增轮播图</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-edit-outline" @click="addItem2">新增视频</el-button>
    </el-form-item>
  </el-form>       
</el-header>
<el-main>
    <el-table
      :data="tableData"
      stripe 
      v-loading="listLoading" element-loading-text="给我一点时间"
      style="width: 100%" v-if="typeIndex==1">
      <el-table-column label="图片">
        <template slot-scope="scope">
          <div style="width:100px;height:100px;align-items:center;display:flex;">
            <img :src="scope.row.pic" alt="" style="width:100px">
          </div>
        </template>
      </el-table-column>
        <el-table-column
        label="跳转类型" 
        prop="urlTXT"
        >
      </el-table-column>
      <el-table-column
        label="操作" 
        min-width='300px'
        >
        <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="editItem(scope.$index, scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" @click="deleteItem(scope.$index, scope.row)">删除</el-button>
        
        </template>
      </el-table-column>
    </el-table>

    <el-form v-if="typeIndex==2&&videoInfo!=null">
      <video :src="videoInfo.banner_pic" alt="" style="width:300px;height:200px" controls="controls" />
      <div>
        <el-button size="mini" type="primary" @click="editItem2()">编辑</el-button>
        <el-button size="mini" type="danger" @click="deleteItem2()">删除</el-button>
      </div>
    </el-form>   
<!-- footer     -->
</el-main>
<el-footer v-if="typeIndex==1">
  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
  </el-pagination>
</el-footer>
</el-container>
</div>
</template>
<script>
import {getBannerList_api , deleteBanner_api , addBanner_api , editBanner_api} from '@/api/seller'
import uploadFn from '@/utils/aahbs'
// getList 接口 获取
// addNotice 接口 添加
const formForNotive = {
  fileList1:[],
  fileList2:[]
}
export default {
  data() {
    return {
      isAddItem:true,
      waitAddNotice:false,
      formForNotive:Object.assign({},formForNotive),
      addNewShow:false,
      formLabelWidth:'80px',

      dialogImageUrl: '',
      dialogVisible: false,
      // jumpType:'butiao',
      imgLimit1:1,
      jumpTypeOptions:[{
          value:true,
          label:'跳转'
      },{
          value:false,
          label:'不跳转'
      }],
      rules: {
        fileList1:[
          {
            type: "array", required: true, len: 1,
            message: '请选择一张图片',
          }
        ],
        fileList2:[
          {
            type: "array", required: true, len: 1,
            message: '请选择一张图片',
          }
        ],
      },
      // ------------------------------------
      //header
      formInline: {},
      // body 
      listLoading: false,
      tableData:[],
      listQuery: {
        page: 1,
        limit: 20
      },
      total:1,
      typeIndex: 1,
      videoInfo: null,
    }
  },
  created(){
    this.getList()
  },
  methods: {
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
      preview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
        console.log('preview----',arguments)
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
    addItem(){
      this.isAddItem = true,
      this.addNewShow = true,
      this.typeIndex = 1
      this.formForNotive = Object.assign({},formForNotive)
    },
    addItem2(){
      if(this.videoInfo == null){
       this.isAddItem = true,
       this.addNewShow = true,
       this.formForNotive = Object.assign({},formForNotive)
      }
      this.typeIndex = 2
      
    },
    async addNewBanner(formName){
      let res = await new Promise((res,rej)=>{
        this.$refs[formName].validate((valid) => {
          console.log(valid);
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
      let jumpType = this.rules.fileList2[0].required 
      //图一
      let allUrl1 = await uploadFn(this.formForNotive.fileList1[0].raw)
      sendData.banner_pic = allUrl1[0]

      // 跳转 图二
      if(jumpType&&this.typeIndex==1){
        let allUrl2 =  await uploadFn(this.formForNotive.fileList2[0].raw)
        sendData.banner_url = allUrl2[0]
      }
      // 默认上传
      sendData.banner_order = 1
      if(this.typeIndex == 2){
       sendData.is_vedio = '1'
      }
      addBanner_api(sendData).then((data)=>{
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
    //body
    getList() {
      this.listLoading = true
      let sendData = Object.assign({},this.listQuery)
      getBannerList_api(sendData).then(response => {
        if(response.data != null){
        if(response&&response.status == 0 ){
          let result = response.data
          let tempTableData = []
  
          result.forEach((aData)=>{
          if(aData.is_vedio == '0'){
            let temp_fileList1 =[]
            let temp_fileList2 =[]
            if(aData.banner_pic){
              temp_fileList1.push({url:aData.banner_pic})
            }
            if(aData.banner_url){
              temp_fileList2.push({url:aData.banner_url})
            }
            tempTableData.push({
              pic:aData.banner_pic,
              url:aData.banner_url,
              urlTXT:aData.banner_url?'跳转':'不跳转',
              id:aData.banner_id,
              order:aData.banner_order
            })
          } else if(aData.is_vedio == '1'){
              this.videoInfo = aData
          }
            
          })
          this.tableData = tempTableData
          this.total = response.pagination&&response.pagination.total?response.pagination.total:1
          }
          
        
        console.log("getList",response)
        // this.list = response.data
        
        
        this.listLoading = false
      }else{
        this.listLoading = false
      }
      
      })
      
    },

    editItem(index,rowData){
      let id = rowData.id
      let fileList1 = [{url:rowData.pic}]
      let fileList2 = rowData.url?[{url:rowData.url}]:[]
      let order = rowData.order
      this.rules.fileList2[0].required = !!rowData.url
      this.formForNotive ={
        fileList1,
        fileList2,
        order,
        id
      }
      this.isAddItem = false
      this.addNewShow = true
    },
    editItem2(){
     if(this.videoInfo == null){
       this.$message({
        message: '请先添加视频',
        type: 'faile'
      })
     } else {
      let id = this.videoInfo.banner_id
      let fileList1 = [{url:this.videoInfo.banner_pic}]
      let fileList2 = this.videoInfo.banner_url?[{url:this.videoInfo.banner_url}]:[]
      let order = this.videoInfo.banner_order
      this.rules.fileList2[0].required = !!this.videoInfo.banner_url
      this.formForNotive ={
        fileList1,
        fileList2,
        order,
        id
      }
      this.isAddItem = false
      this.addNewShow = true
     }
      
    },

    async editNewBanner(formName){
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
      let allUrl1,allUrl2
      let jumpType = this.rules.fileList2[0].required 
      if(this.formForNotive.fileList1[0].raw){
         allUrl1 = await uploadFn(this.formForNotive.fileList1[0].raw)
         allUrl1 = allUrl1[0]
      }else{
         allUrl1 = this.formForNotive.fileList1[0].url
      }
      sendData['banner_pic'] = allUrl1

      if(jumpType){    //判断是否有第二个上传图片
        if(this.formForNotive.fileList2[0].raw){
          allUrl2 = await uploadFn(this.formForNotive.fileList2[0].raw)
          allUrl2 = allUrl2[0]
        }else{
          allUrl2 = this.formForNotive.fileList2[0].url
        }
        sendData['banner_url'] = allUrl2
      }else{
        sendData['banner_url'] = null
      }
      sendData['banner_id'] = this.formForNotive.id
      sendData['banner_order'] = this.formForNotive.order
      console.log(sendData,'-------------------')
      editBanner_api(sendData).then(data=>{
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
    
    deleteItem(index,row){
      let id = row.id
      this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteBanner(id)
      }).catch(()=>{
        this.$notify.info({
          title: '消息',
          message: '已取消'
        });
      })
    },
    deleteItem2(){
      let id = this.videoInfo.banner_id
      this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteBanner(id)
        this.videoInfo = null
      }).catch(()=>{
        this.$notify.info({
          title: '消息',
          message: '已取消'
        });
      })
    },
    deleteBanner(id){

      deleteBanner_api(id).then(res=>{
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
    }
  }
}
</script>
