<style lang="stylus">
  .notice
    .header
      margin-top 20px
</style>

<template>
<div>
<!-- out -->
  <!-- 只发布 简单表单 -->
<el-dialog
  title="发布新资讯"
  :visible.sync="addNewShow"
  width="40%"
  >

  <el-form :model="formForNotive"  ref="ruleForm" :rules="rules" >
    <el-form-item  label="图片"  :label-width="formLabelWidth" prop="fileList">
          <el-upload 
          :auto-upload="false"
            action=""
          :limit="imgLimit"
          list-type="picture-card" 
          :on-success="onsuccess" 
          :on-preview="preview"
          :on-remove="remove" 
          :on-change="change" 
          :before-upload="beforeup" 
          :before-remove="beforere" 
          :file-list="formForNotive.fileList"
          >
          <i class="el-icon-plus"></i>
        </el-upload>
    </el-form-item>

    <el-form-item label="标题" :label-width="formLabelWidth"  prop="title">
      <el-input v-model="formForNotive.title" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="公众号链接" :label-width="formLabelWidth"  prop="content">
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

  <!-- 只显示 简单详情 -->
<el-dialog
  title="资讯详情"
  :visible.sync="detailShow"
  width="60%"
  >

  <el-form :model="detailForm" ref="ruleForm2">
    <el-form-item label="图片" :label-width="formLabelWidth">
      <div style="width:100px;height:100px;">
         <img style="width:100px;height:100px" :src="detailForm.image" alt="">
      </div>
    </el-form-item>
    <el-form-item label="标题" :label-width="formLabelWidth">
      <p class="s-no-margin-p">
        {{detailForm.title}}
      </p>
    </el-form-item>
    <el-form-item label="链接" :label-width="formLabelWidth">
      <p class="s-no-margin-p">
        {{detailForm.content}}
      </p>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="detailShow = false">返回</el-button>
  </span>
</el-dialog>
<el-container class="notice">
<!-- head -->
<el-header class="header">
  <el-form :inline="true"  class="form">
    <el-form-item>
      <el-button type="primary" icon="el-icon-edit-outline" @click="addNewShow = true">发布新资讯</el-button>
    </el-form-item>
  </el-form>       
</el-header>
<!-- body -->
<el-main>
  <el-table
    :data="tableData"
    stripe 
    v-loading="listLoading" element-loading-text="给我一点时间"
    style="width: 100%" >
    
    <!-- <el-table-column
      prop="time"
      label="时间"
      >
      <template slot-scope="scope">
        <i class="el-icon-date"></i>
        <span style="margin-left: 10px">{{ scope.row.time }}</span>
      </template>
    </el-table-column> -->
    <el-table-column
      label="标题" 
      prop="title"
      >
    </el-table-column>
    <el-table-column
      label="链接" 
      prop="content"
      >
    </el-table-column>
    <el-table-column
      label="操作"
      >
      <template slot-scope="scope">
      <el-button size="mini"  @click="lookDetail(scope.$index, scope.row)">查看详情</el-button>
      <el-button type="danger" size="mini" @click="deleItem(scope.$index, scope.row)">删除</el-button>

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
import {getInfo_api,addInfo_api,deleteInfo_api} from '@/api/seller' 

import uploadFn from '@/utils/aahbs'

// getList 接口 获取
// addNotice 接口 添加
const formForNotive={}
export default {
  data() {
    return {
      //out
      waitAddNotice:false,
      formForNotive:{
        fileList:[],
        title:'',
        content:''
      },
      rules: {
        title: [
            { required: true, message: '请输入标题', trigger: 'blur',min: 1},
        ],
        content: [
            { required: true, message: '请输入链接', trigger: 'blur',min: 1, },
        ],        
        fileList:[
          {
            type: "array", required: true, len: 1,
            message: '请选择一张图片',
          }
        ],
      },
      imgLimit:1,
      addNewShow:false,
      formLabelWidth:'100px',

      detailShow:false,
      detailForm:{
        title:'loading',
        content:'...'
      },
      //header
      // body
      listLoading: false,
      tableData: [
        {
          time: '2018-7-1',
          title: '测试数据',
          content: 'www.baidu.com',
          id:1
        },{
          time: '2018-7-2',
          title: '同志们好',
          content: '测试数据测试数据测试数据测试数据...',
          id:1
        }
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
  created(){
    this.getList()
  },
  methods: {
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
        this.formForNotive.fileList = arguments[1]
      },
      change() {
        console.log('change----',arguments)
        this.formForNotive.fileList = arguments[1] 
      },
      preview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
        console.log('preview----',arguments)
      },
    //out
    async addNewNotice(formName){ //添加
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
        title:this.formForNotive.title,
        url:this.formForNotive.content,
      }
      let allUrl1 = await uploadFn(this.formForNotive.fileList[0].raw)
      console.log('1111111111',allUrl1[0])
      sendData.img = allUrl1[0]

      
      addInfo_api(sendData).then(()=>{
        this.waitAddNotice = false
        this.formForNotive = {}
        this.addNewShow = false
        this.$notify({
          title: '发送成功',
          message: '已新增一条资讯',
          type: 'success'
        })
        this.getList()
      }).catch(err=>{
        this.waitAddNotice = false
        console.error('addInfo_api:',err)
      })
    },
    //header

    //body
    getList() { //获取列表
      this.listLoading = true
      let sendData = Object.assign({},this.listQuery)
      getInfo_api(sendData).then(response => {
        if(response&&response.status==0){

          let result = response.data
          let tempTableData = []
          result.forEach((aData)=>{
            tempTableData.push({
              id:aData.wxtitle_id,
              title:aData.title,
              content:aData.url,
              image:aData.img
            })
          })
          this.tableData = tempTableData
        }
        // this.list = response
          this.total = response.pagination&&response.pagination.total?response.pagination.total:1
        this.listLoading = false
      })
    },
    lookDetail(index,row) { //查看公告某条详情
      console.log('111111111',row)
      this.detailForm = this.tableData[index]
      this.detailShow = true
    },
    deleItem(index, row){
        let id = row.id
        this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteInfo(id)
        }).catch(()=>{
          this.$notify.info({
            title: '消息',
            message: '已取消'
          });
        })
    },

    deleteInfo(id){
      let sendData = {
        wxtitle_id:id
      }
        deleteInfo_api(sendData).then(res=>{
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
    
  }
}
</script>