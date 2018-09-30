<style lang="stylus">
  .notice
    .header
      margin-top 20px
</style>

<template>
<div>
<el-dialog
  title="新增投票"
  :visible.sync="addNewShow"
  width="80%"
  >
  <el-form :model="formForNotive"  ref="ruleForm" :rules="rules" >
    <el-form-item label="链接" :label-width="formLabelWidth"  prop="url">
      <el-input v-model="formForNotive.url" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="标题" :label-width="formLabelWidth"  prop="title">
      <el-input v-model="formForNotive.title" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addNewShow = false">取 消</el-button>
    <el-button type="primary" @click="addNewNotice('ruleForm')"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确 定</el-button>
  </span>
</el-dialog>
  <!-- ==================================== -->
<el-container class="notice">
<el-header class="header">
  <el-form :inline="true" :model="formInline" class="form">
    <el-form-item>
      <el-button type="primary"  @click="addItem">新增投票</el-button>
    </el-form-item>
  </el-form>       
</el-header>
<el-main>
    <el-table
      :data="tableData"
      stripe 
      v-loading="listLoading" element-loading-text="给我一点时间"
      style="width: 100%" >
      </el-table-column>
      <el-table-column
        label="活动id" 
        prop="id"
        >
      </el-table-column>
      <el-table-column
        label="活动链接" 
        prop="url"
        >
      </el-table-column>
      <el-table-column
        label="活动名" 
        prop="title"
        >
      </el-table-column>
      <el-table-column
        label="操作" 
        min-width='300px'
        >
        <template slot-scope="scope">
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
import {getVoteList_api,addVote_api,deleteVote_api} from '@/api/seller'
export default {
  data() {
    return {
      // out
        waitAddNotice:false,
        formForNotive:{},
        rules: {
          title: [
              { required: true, message: '请输入标题', trigger: 'blur',min: 1},
          ],
          url: [
              { required: true, message: '请输入内容', trigger: 'blur',min: 1 },
          ]
        },
        formLabelWidth:'80px',
      // head
        formInline: {},
        addNewShow:false,
      // body 
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
      // ------------------------------------
      //out
      //header
    }
  },
  created(){
    this.getList()
  },
  methods: {
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
        vote_id:id,
      }
      deleteVote_api(sendData).then(res=>{
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
        vote_title:this.formForNotive.title,
        vote_url:this.formForNotive.url,
      }
      addVote_api(sendData).then(()=>{
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
    // head
      addItem(){
        this.addNewShow = true
      },
      getList() {
        this.listLoading = true
        let sendData = Object.assign({},this.listQuery)
        getVoteList_api(sendData).then(response => {
          if(response&&response.status==0){
            let result = response.data
            let tempTableData = []
            result.forEach((aData)=>{
              tempTableData.push({
                //后端生成
                id:aData.vote_id,
                //前后统一
                title:aData.vote_title,//显示
                url:aData.vote_url,//显示
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
    // foot
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
    // ----------------
  }
}
</script>