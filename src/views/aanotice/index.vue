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
  title="发布新公告"
  :visible.sync="addNewShow"
  width="30%"
  >
  <el-form :model="formForNotive"  ref="ruleForm" :rules="rules" >
    <el-form-item label="公告标题" :label-width="formLabelWidth"  prop="title">
      <el-input v-model="formForNotive.title" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="公告内容" :label-width="formLabelWidth"  prop="content">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="formForNotive.content">
      </el-input>
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
  title="公告详情"
  :visible.sync="detailShow"
  width="60%"
  >
  <el-form :model="detailForm">
    <el-form-item label="公告标题" :label-width="formLabelWidth">
      <p class="s-no-margin-p">
        {{detailForm.title}}
      </p>
    </el-form-item>
    <el-form-item label="公告内容" :label-width="formLabelWidth">
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
      <el-button type="primary" icon="el-icon-edit-outline" @click="addNewShow = true">发布新公告</el-button>
    </el-form-item>
    <!-- <el-form-item label="时间">
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
    </el-form-item> -->
  </el-form>       
</el-header>
<!-- body -->
<el-main>
  <el-table
    :data="tableData"
    stripe 
    v-loading="listLoading" element-loading-text="给我一点时间"
    style="width: 100%" >
    <el-table-column
      prop="time"
      label="时间"
      >
      <template slot-scope="scope">
        <i class="el-icon-date"></i>
        <span style="margin-left: 10px">{{ scope.row.time }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="公告标题" 
      prop="title"
      >
    </el-table-column>
    <el-table-column
      label="操作"
      >
      <template slot-scope="scope">
      <el-button
        size="mini"
        @click="lookDetail(scope.$index, scope.row)">查看详情</el-button>
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
// getList 接口 获取
// addNotice 接口 添加
import {getNotice_api,addNotice_api} from '@/api/admin'
export default {
  data() {
    return {
      //out
      waitAddNotice:false,
      formForNotive:{
        title:'',
        content:''
      },
      rules: {
        title: [
            { required: true, message: '请输入标题', trigger: 'blur',min: 1},
        ],
        content: [
            { required: true, message: '请输入内容', trigger: 'blur',min: 1, },
        ]
      },
      addNewShow:false,
      formLabelWidth:'80px',

      detailShow:false,
      detailForm:{
        title:'loading',
        content:'...'
      },
      //header
      // body
      listLoading: false,
      tableData: [
        // {
        //   time: '2018-7-1',
        //   title: '测试数据',
        //   content: '测试数据测试数据测试数据测试数据...',
        //   id:1
        // },{
        //   time: '2018-7-2',
        //   title: '同志们好',
        //   content: '测试数据测试数据测试数据测试数据...',
        //   id:1
        // }
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
    //out
    async addNewNotice(formName){ //添加新公告
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
        affiche_title:this.formForNotive.title,
        affiche_content:this.formForNotive.content,
        affiche_sort:1
      }
      addNotice_api(sendData).then(()=>{
        this.waitAddNotice = false
        this.formForNotive = {}
        this.addNewShow = false
        this.$notify({
          title: '发送成功',
          message: '已新增一条公告',
          type: 'success'
        })
        this.getList()
      }).catch(err=>{
        this.waitAddNotice = false
        console.error('addNotice_api:',err)
      })
    },
    //header

    //body
    getList() { //获取公告列表
      this.listLoading = true
      let sendData = Object.assign({},this.listQuery)
      getNotice_api(sendData).then(response => {
        if(response&&response.status==0){

          let result = response.data
          let tempTableData = []
          result.forEach((aData)=>{
            tempTableData.push({
              id:aData.affiche_id,
              title:aData.affiche_title,
              content:aData.affiche_content,
              time:aData.add_time,
            })
          })
          this.tableData = tempTableData
        }
        console.log("getList",response)
        // this.list = response
        this.total = response.pagination.total
        this.listLoading = false
      })
    },
    lookDetail(index) { //查看公告某条详情
      this.detailForm = this.tableData[index]
      this.detailShow = true
      console.log(arguments)
    },
    //footer
    
    
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