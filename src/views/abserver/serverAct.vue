<style lang="stylus">
  .notice
    .header
      margin-top 20px
</style>

<template>
<div>
  <!-- 编辑和添加共用 -->
  <!-- out -->
<el-dialog
  title='新增动态'
  :visible.sync="addNewShow"
  width="50%"
  >
  <el-dialog :visible.sync="dialogVisible" append-to-body>
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
  <el-form :model="formForNotive" :rules="rules" ref="ruleForm">
      <el-form-item  label="图片"  :label-width="formLabelWidth" prop="fileList">
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
          :file-list="formForNotive.fileList"
          >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <!-- <p class="s-margin-left80">请选择一张图片,建议尺寸： 宽750*高376</p> -->
    <el-form-item label="内容" :label-width="formLabelWidth" prop="content">
      <el-input v-model="formForNotive.content" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addNewShow = false">取 消</el-button>
    <el-button type="primary" @click="addNewNotice('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
  title="动态详情"
  :visible.sync="detailShow"
  width="60%"
  >
  <el-form :model="detailForm">
    <el-form-item label="动态图片" :label-width="formLabelWidth">
        <div style="width:150px;height:150px;align-items:center;display:inline-block;" v-for="item in detailForm.fileList">
            <img :src="item.url" alt="动态图片" style="width:150px;padding:10px">
        </div>
    </el-form-item>
    <el-form-item label="动态内容" :label-width="formLabelWidth">
      <p class="s-no-margin-p">
        {{detailForm.content}}
      </p>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="detailShow = false">返回</el-button>
  </span>
</el-dialog>
<!-- body -->
<el-container class="notice">
<el-header class="header">
  <el-form :inline="true" :model="formInline" class="form">
    <el-form-item>
      <el-button type="primary" icon="el-icon-edit-outline" @click="addItem">新增动态</el-button>
    </el-form-item>
    <el-form-item label="时间">
      <el-date-picker
        style="width:400px"
        v-model="dataRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="searchByDate">查询</el-button>
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
        label="图片"
        >
        <template slot-scope="scope">
          <div style="width:100px;height:100px;align-items:center;display:flex;">
            <img :src="scope.row.image" alt="" style="width:100px">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="时间" 
        prop="date"
        >
      </el-table-column>
        <el-table-column
        label="内容" 
        prop="content"
        >
      </el-table-column>
      <el-table-column
        label="操作" 
        min-width='300px'
        >
        <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="lookItem(scope.$index, scope.row)">详情</el-button>
        <el-button size="mini" type="danger" @click="deleItem(scope.$index, scope.row)">删除</el-button>
        
        </template>
      </el-table-column>
    </el-table>

<!-- footer -->
</el-main>
    <el-footer>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
      </el-pagination>
    </el-footer>
</el-container>
</div>
</template>
<script>
import {addAct_api,getActList_api,deleAct_api} from '@/api/seller'
import uploadFn from '@/utils/aahbs'
// getList 接口 获取
// addNotice 接口 添加
const formForNotive = {}
export default {
  data() {
    return {
      //out
      dialogImageUrl: '',
      imgLimit1:9,
      dialogVisible: false,
      detailShow:false,
      isAddItem:true,
      waitAddNotice:false,
      formForNotive:{
          fileList:[],
          content:''
      },
      detailForm:{
        content:"",
        image:""
      },
      addNewShow:false,
      formLabelWidth:'80px',
      //header
      formInline: {},
      // body 
      listLoading: false,
      dataRange:"",
      tableData: [
        // {
        //   image:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2544791346,860572115&fm=27&gp=0.jpg',
        //   date:'2018-07-12 至 2018-08-08',
        //   content:'111111111',
        //   fileList:[{url:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2544791346,860572115&fm=27&gp=0.jpg'}]
        // }
      ],
      rules:{
        fileList:[
          {
            type: "array", required: true,message: '请选择一张图片',
          }
        ],
        content: [
            { type:"string", required: true, message: '请输入内容', trigger: 'blur',min: 1 }
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
    //out
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
    remove1() { //每次改变图片获取最新的filelist
        console.log('remove----',arguments)
        this.formForNotive.fileList = arguments[1]
    },
    change1() {
      console.log('change----',arguments)
      this.formForNotive.fileList = arguments[1]
    },
    addDetailItem(){
      this.formForNotive.goodsDetail.push({
            fileList:[],
            title:'xxx',
            content:'cccxxx',
          })
    },
      //file upload
      
    
    // getList_detail(){
    //   console.log('getList_detail 暂时留白')
    // },
    // handleSizeChange_detail(val) {
    //   this.listQuery_detail.limit = val
    //   this.getList_detail()
    // },
    // handleCurrentChange_detail(val) {
    //   this.listQuery_detail.page = val
    //   this.getList_detail()
    // },
    formatDateTime(inputTime) {  
        var date = new Date(inputTime*1000);
        var y = date.getFullYear();  
        var m = date.getMonth() + 1;  
        m = m < 10 ? ('0' + m) : m;  
        var d = date.getDate();  
        d = d < 10 ? ('0' + d) : d;  
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;  
        second = second < 10 ? ('0' + second) : second; 
        return y + '-' + m + '-' + d+'   '+h+':'+minute+':'+second;  
    },
    getList() {
      this.listLoading = true
      let sendData = Object.assign({},this.listQuery)
      getActList_api(sendData).then(response => {    
        if(response&&response.status == 0){
          let result = response.data
          let tempTableData = []
          result.forEach((aData)=>{
            let image = JSON.parse(aData.dynamic_images)
            let temp_fileList = []
            if(aData.dynamic_images){
              for(let i=0,len=image.length;i<len;i++){
                temp_fileList.push({
                  url:image[i]
                })
              }
              console.log('110',temp_fileList)
            }
            // let date = new Date(parseInt(aData.dynamic_created_at)*1000).toLocaleString().replace(/:\d{1,2}$/,'')
           let date = this.formatDateTime(aData.dynamic_created_at)
           tempTableData.push({
              fileList:temp_fileList,
              image:image[0],
              content:aData.dynamic_content,
              date:date,
              id:aData.dynamic_id
            })
          })
          this.tableData = tempTableData
          this.total = response.pagination&&response.pagination.total?response.pagination.total:1
          this.listLoading = false
        }

      })
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
        console.log('-----------------',arr,'-----------------')
        return {
          files,urls
        }
      },
    addItem(){   
      this.addNewShow = true
      this.formForNotive = Object.assign({},formForNotive)
    },
  async  addNewNotice(formName){

      console.log(this.formForNotive)
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
      let sendData = {}
      let allUrl1 
      let fileAndUrl = this.getFiles(this.formForNotive.fileList)
      console.log(fileAndUrl,'files')
      let files = fileAndUrl.files
      console.log(files,'files')
      let allUrl = await uploadFn(files)
      console.log(allUrl,'allUrl')
      let urls = allUrl.concat(fileAndUrl.urls)
      console.log(urls,'urls')

      sendData.dynamic_images = JSON.stringify(urls)
      
      sendData.dynamic_content = this.formForNotive.content
      addAct_api(sendData).then(data=>{
        this.addNewShow = false
        this.waitAddNotice = false
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


    deleItem(index,row){
      let id = row.id
      this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteAct(id)
      }).catch(()=>{
        this.$notify.info({
          title: '消息',
          message: '已取消'
        });
      })
    },
    deleteAct(id){
      let sendData = {
        dynamic_id:id,
      }
      deleAct_api(sendData).then(res=>{
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


    //body
    lookItem(index,rowData){
      this.detailForm = Object.assign({},rowData)
      this.detailShow = true
    },

    searchByDate(){
      if(!this.dataRange){
        this.getList()
        return
      }
      let date1 = Math.floor(this.dataRange[0].getTime()/1000)
      let date2 = Math.floor(this.dataRange[1].getTime()/1000)
      this.listQuery.time = date1+'-'+date2
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
