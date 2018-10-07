<style lang="stylus">
  .notice
    .header
      margin-top 20px
</style>

<template>
<div>
  <!-- 编辑和添加共用 -->
<el-dialog
  title="新增商品"
  :visible.sync="addNewShow"
  width="80%"
  >
  <el-container class="notice">
        <el-header class="header">
        <el-form :inline="true" :model="formInline" class="form">
            <el-form-item>
                <el-input style="width: 340px;" placeholder="请输入商品名称、编码" v-model="listQuery.search"></el-input>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchByDate">查询</el-button>
            </el-form-item>
            <el-form-item label="分类" :label-width="formLabelWidth">
                <el-select v-model="goodsType" placeholder="请选择">
                        <el-option
                        v-for="item in goodsTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>       
        </el-header>
        <el-container>
            <el-main>
                <el-table
                :data="tableData2"
                stripe 
                v-loading="listLoading" element-loading-text="给我一点时间"
                style="width: 100%" >

                <el-table-column
                    label="商品图片"
                    >
                    <template slot-scope="scope">
                    <img :src="scope.row.goodsImage" alt="" width="100px">
                    </template>
                </el-table-column>
                <el-table-column
                    label="商品名" 
                    prop="goodsName"
                    >
                </el-table-column>
                <el-table-column
                    label="类型" 
                    prop="goodsType"
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
                </el-table-column><el-table-column
                    label="价格" 
                    prop="goodsPrice"
                    >
                </el-table-column><el-table-column
                    label="库存" 
                    prop="goodsTotal"
                    >
                </el-table-column><el-table-column
                    label="销量" 
                    prop="goodsSell"
                    >
                </el-table-column>
                <el-table-column
                    label="操作" 
                    min-width='300px'
                    >
                    <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="editItem(scope.$index, scope.row)">选择</el-button>
                    </template>
                </el-table-column>
                </el-table>
            </el-main>
        </el-container>
        <el-footer>
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
        </el-pagination>
        </el-footer>
  </el-container>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addNewShow = false">取 消</el-button>
    <el-button type="primary" @click="addNewNotice"
     :disabled="waitAddNotice"
     :loading="waitAddNotice">确 定</el-button>
  </span>
</el-dialog>
<el-container class="notice">
<el-header class="header">
  <el-form :inline="true" :model="formInline" class="form">
    <el-form-item>
      <el-button type="primary" icon="el-icon-edit-outline" @click="addItem">新增商品</el-button>
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
          <img :src="scope.row.image" alt="" width="100px">
        </template>
      </el-table-column>
      <el-table-column
        label="商品名称" 
        prop="goodsName"
        >
      </el-table-column>
      <el-table-column
        label="商品价格" 
        prop="goodsPrice"
        >
      </el-table-column>
      <el-table-column
        label="操作" 
        min-width='300px'
        >
        <template slot-scope="scope">
        <!-- <el-button size="mini" type="primary" @click="editItem(scope.$index, scope.row)">编辑</el-button> -->
        <el-button size="mini" type="danger" @click="lookItem(scope.$index, scope.row)">删除</el-button>
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
// getList 接口 获取
// addNotice 接口 添加
export default {
  data() {
    return {
      //out
      tableData2: [
        {
          goodsImage:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3942989250,3371488751&fm=27&gp=0.jpg',
          goodsName: '老北京鸡肉卷',
          goodsType: '炸鸡',
          goodsNum: '123987',
          goodsState: '在售',
          goodsPrice: '321',
          goodsTotal: '321',
          goodsSell: '321',
        //   opera: '查看123'
        },
        {
          goodsImage:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=4005596794,992112216&fm=27&gp=0.jpg',
          goodsName: '香辣鸡腿堡',
          goodsType: '炸鸡',
          goodsNum: '1223987',
          goodsState: '在售',
          goodsPrice: '3221',
          goodsTotal: '3221',
          goodsSell: '3212',
        //   opera: '查看123'
        }
      ],
      dialogImageUrl: '',
      imgLimit1:1,
        dialogVisible: false,
        fileList1: [{url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3994633895,563142661&fm=27&gp=0.jpg'}],
        fileList2: [{url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3994633895,563142661&fm=27&gp=0.jpg'}],
      goodsType:'分类2',
      goodsTypeOptions:[{
          value:'分类1',
          label:'啊哈哈'
      },{
          value:'分类2',
          label:'嘎嘎'
      }],
      
      isAddItem:true,
      waitAddNotice:false,
      formForNotive:{
        name:'奥术大师',
        value:'100',
      },
      addNewShow:false,
      formLabelWidth:'80px',
      //header
      industry:'',
      formInline: {},
      // body 
      listLoading: false,
      tableData: [
        {
          image:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2544791346,860572115&fm=27&gp=0.jpg',
          goodsName:'鸡腿',
          goodsPrice:'10',
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
  methods: {
    //out
    addDetailItem(){
      this.formForNotive.goodsDetail.push({
            fileList:[],
            title:'xxx',
            content:'cccxxx',
          })
    },
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
    addNewNotice(){
      this.waitAddNotice = true
      setTimeout(()=>{
        //发送成功该做的事情
        this.waitAddNotice = false
        this.addNewShow = false
        this.form = {}
        this.$notify({
          title: '发送成功',
          message: '这是一条成功的提示消息',
          type: 'success'
        })
        //如果失败
        // this.waitAddNotice = false
      },2000)
    },
    addItem(){
      this.isAddItem = true
      this.addNewShow = true
      // this.formForNotive = {}
    },
    //body
    editItem(){
      this.isAddItem = false
      this.addNewShow = true
      //获取数据 填充form
      this.formForNotive = {
        title:'当前轮播图名称',
        username:'当前轮播图名称',
        phone:'当前轮播图名称',
        account:'当前轮播图名称',
        name:'当前轮播图名称',
        industry:'餐饮',
        city:['杭州','西湖']
      }
    },
    lookItem() {
      console.log(arguments)
      this.detailShow = true
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
    getList() {
      this.listLoading = true
      let sendData = Object.assign({},this.listQuery)
      if(!sendData.time){
        delete sendData.time
      }
      fetchNoticeList(sendData).then(response => {
        if(response.data&&response.data.status==="success"){
          let result = response.data.result
          let tempTableData = []
          result.forEach((aData)=>{
            tempTableData.push({
              name:aData.name,
              phone:aData.phone,
              deviceCode:aData.deviceCode,
              swingCard:aData.swingCard,
              cashBack:aData.cashBack
            })
          })
          this.tableData = tempTableData
        }
        console.log("getList",response)
        // this.list = response.data
        this.total = response.data.paging.total
        this.listLoading = false
      })
    },
  }
}
</script>