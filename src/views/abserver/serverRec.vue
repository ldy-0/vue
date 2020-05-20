<style lang="stylus">
  .notice
    .header
      margin-top 20px
</style>

<template>
<div>
<el-dialog
  title="新增推荐"
  :visible.sync="addNewShow"
  width="80%"
  >
  <el-container class="notice">
        <!-- <el-header class="header">
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
        </el-header> -->
        <el-container>
            <el-main>
                <el-table
                :data="tableData2"
                stripe 
                v-loading="listLoading2" element-loading-text="给我一点时间"
                style="width: 100%" >

                <el-table-column
                    label="商品图片"
                    >
                    <template slot-scope="scope">
                      <div style="width:100px;height:100px;align-items:center;display:flex;">
                        <img :src="scope.row.goodsImage" alt="" width="100px">
                      </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="商品名" 
                    prop="goodsName"
                    >
                </el-table-column>
                <el-table-column
                    label="价格" 
                    prop="goodsPrice"
                    >
                </el-table-column>
                <!-- <el-table-column
                    label="库存" 
                    prop="goodsTotal"
                > -->
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
                    <el-button size="mini" type="primary" @click="chooseItem(scope.$index, scope.row,'recommend')">选择</el-button>
                    </template>
                </el-table-column>
                </el-table>
            </el-main>
        </el-container>
        <el-footer>
        <el-pagination background @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="listQuery2.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery2.limit" layout="total, sizes, prev, pager, next" :total="total2">
        </el-pagination>
        </el-footer>
  </el-container>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addNewShow = false">关闭</el-button>
  </span>
</el-dialog>
  <!-- ==================================== -->
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
          <div style="width:100px;height:100px;align-items:center;display:flex;">
            <img :src="scope.row.goodsImage" alt="" style="width:100px">
          </div>
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
        <el-button size="mini" type="danger" @click="chooseItem(scope.$index, scope.row)" >取消推荐</el-button>
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
import {getGoodsList_api,editRec_api} from '@/api/seller'
export default {
  data() {
    return {
      // out
        formLabelWidth:'80px',
        listLoading2: false,
        tableData2: [],
        listQuery2: {
          page: 1,
          limit: 5,
          search:"",
          time:""
        },
        total2:1,
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
    
    // out
      // out-body
        chooseItem(index,raw,target){
          let id = raw.id
          let type = target==='recommend'?'recommend':'notrecommend'
          let sendData = {
            type,
            goods_commonid:id
          }
          editRec_api(sendData).then(data=>{
            if(data.status===0){
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success'
              })
              if(target){
                this.getList2()
                this.getList()
              }else{
                this.getList()
              }
            }else{
              this.$notify({
                title: '失败',
                message: '操作失败',
                type: 'error'
              })
            }
          }).catch(e=>{
            console.error('manageShop:editRec_api 接口错误')
          })
        },
        // getlist2 =>body
      // out-foot
        handleSizeChange2(val) {
          this.listQuery2.limit = val
          this.getList2()
        },
        handleCurrentChange2(val) {
          this.listQuery2.page = val
          this.getList2()
        },
    // head
      addItem(){
        this.addNewShow = true
        this.getList2()
      },
      // listLoading2 listQuery2 tableData2 total2
      getList2() {
        this.listLoading2 = true
        let sendData = Object.assign({},this.listQuery2)
        sendData.goods_commend = 0
        getGoodsList_api(sendData).then(response => {
          this.listLoading2 = false
          if(response&&response.status==0){
            let result = response.data
            let tempTableData = []
            result.forEach((aData)=>{
              tempTableData.push({
                //后端生成
                id:aData.goods_commonid,
                //前后统一
                goodsImage:aData.goods_image,//显示
                goodsName:aData.goods_name,//显示
                goodsPrice:aData.goods_price,//显示
              })
            })
            this.tableData2 = tempTableData
            this.total2 = response.pagination&&response.pagination.total?response.pagination.total:1
          }else{

          }
          console.log("getList",response)
        }).catch(e=>{
          this.listLoading2 = false
        })
      },
    // body
      getList() {
        this.listLoading = true
        let sendData = Object.assign({},this.listQuery)
        sendData.goods_commend = 1
        getGoodsList_api(sendData).then(response => {
          if(response&&response.status==0){
            let result = response.data
            let tempTableData = []
            result.forEach((aData)=>{
              tempTableData.push({
                //后端生成
                id:aData.goods_commonid,
                //前后统一
                goodsImage:aData.goods_image,//显示
                goodsName:aData.goods_name,//显示
                goodsPrice:aData.goods_price,//显示
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