<style lang="stylus">
  .notice
    .header
      margin-top 20px
</style>

<template>
<div>
  <!-- 编辑和添加共用 -->
<el-dialog
  title="编辑"
  :visible.sync="addNewShow"
  width="80%"
  >
  <el-dialog :visible.sync="dialogVisible" append-to-body>
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
  <el-form :model="formForNotive"  ref="ruleForm" :rules="rules" size="medium" >
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
      <p class="s-margin-left80">请选择一张图片,建议尺寸： 宽120*高120</p>
      <el-form-item label="标题" :label-width="formLabelWidth">
        <el-input v-model="formForNotive.title" auto-complete="off"></el-input>
      </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addNewShow = false">取 消</el-button>
    <el-button type="primary" @click="editNewNotice"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确 定</el-button>
  </span>
</el-dialog>
<el-container class="notice">
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
              <img :src="scope.row.image" alt="" width="100px">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="标题" 
        prop="title"
        >
      </el-table-column>
      <el-table-column
        label="操作" 
        min-width='300px'
        >
        <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="editItem(scope.$index, scope.row)">编辑</el-button>
        <!-- <el-button size="mini" type="danger" @click="lookItem(scope.$index, scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
</el-main>
</el-container>
</div>
</template>
<script>
// getList 接口 获取
// addNotice 接口 添加
import {getEntryList_api,editEntry_api} from '@/api/seller'
import uploadFn from '@/utils/aahbs'

export default {
  data() {
    return {
      //out
      imgLimit1:1,
      dialogImageUrl: '',
      dialogVisible: false,
      waitAddNotice:false,

      formForNotive:{},
      rules: {
        fileList1:[
            {
              type: "array", required: true, len: 1,
              message: '请选择一张图片',
            }
        ],
        title: [
              { required: true, message: '请输入标题', trigger: 'blur' },
              { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
      },
      addNewShow:false,
      formLabelWidth:'80px',
      //header
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
    }
  },
  created(){
    this.getList()
  },
  methods: {
    //图片相关
      remove1() { //每次改变图片获取最新的filelist
          console.log('remove----',arguments)
          this.formForNotive.fileList1 = arguments[1]
      },
      change1() {
        console.log('change----',arguments)
        this.formForNotive.fileList1 = arguments[1]
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
    //body
      getList() {
        this.listLoading = true
        let sendData = Object.assign({},this.listQuery)
        getEntryList_api(sendData).then(data=>{
        this.listLoading = false
          if(data.status===0){
            let tempData = []
            for(let i = 0 ,len = data.data.length;i<len;i++){
              tempData.push({
                id:data.data[i].storegc_id,
                storeId:data.data[i].store_id,
                parentId:data.data[i].storegc_parent_id,
                image:data.data[i].storegc_pic,
                sort:data.data[i].storegc_sort,
                title:data.data[i].storegc_name,
                state:data.data[i].storegc_state,
              })
            }
            this.tableData = tempData
          }else{
            console.error('manageShop:getEntryList_api 状态码为1')
          }
        }).catch(e=>{
        this.listLoading = false
          console.error('manageShop:getEntryList_api 接口错误')
        })
      },
      async editNewNotice(){
        let res = await new Promise((res,rej)=>{
            this.$refs['ruleForm'].validate((valid) => {
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
        let sendData = {
          storegc_id:this.formForNotive.id,
          storegc_name:this.formForNotive.title,
        }
        if(this.formForNotive.fileList1[0].raw){
            let urls1 = await uploadFn(this.formForNotive.fileList1[0].raw)
            sendData.storegc_pic = urls1[0]
        }else{
            sendData.storegc_pic = this.formForNotive.fileList1[0].url
        }
        editEntry_api(sendData).then(data=>{
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
          console.error('manageShop:editEntry_api 接口错误')
        })
      },
      editItem(index){
        this.formForNotive = Object.assign({},this.tableData[index])
        this.formForNotive.fileList1 = []
        if(this.formForNotive.image){
          this.formForNotive.fileList1 = [
            {url:this.formForNotive.image}
          ]
        }
        this.addNewShow = true
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
    // -------------------------
  }
}
</script>