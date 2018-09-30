<style lang="stylus">
  .notice
    .header
      margin-top 20px
    .big-icon
      font-size 30px
      color #409EFF
    .big-icon-no
      font-size 30px
      color #b19999
      // color #F56C6C
</style>

<template>
<div>

<el-container class="notice">

  <el-main>
    <el-form :inline="true"  class="form"> <!--:model="formInline" -->

      <el-form-item label="">
        <el-input style="width: 340px;" placeholder="请输入手机号" v-model="studentConfig.keyword"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
      </el-form-item>

      <el-form-item label="导出Excel">
        <el-button  type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">{{exportExcelStatus}}</el-button>
        <!-- <span class="hbs-inline-tips">导出所有数据，这个过程可能会需要花费  <span class="hbs-hot">几分钟</span> 的时间，请耐心等待</span> -->
      </el-form-item>
    
    </el-form>

    <el-table :data="list" stripe v-loading="loadList" element-loading-text="给我一点时间" style="width: 100%" >
      <el-table-column :label='item.key' :prop='item.value' v-for='(item, index) in classList' :key='index'></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showItem(scope.$index, scope.row)">查看</el-button>
          <el-button size="mini" type="danger" @click="deleteItem(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background 
                  @size-change="sizeChange" 
                  @current-change="pageChange" 
                  :current-page="listConfig.page" 
                  :page-sizes="[10,2,30, 50]" 
                  :page-size="listConfig.limit" 
                  layout="total, sizes, prev, pager, next" :total="listTotal">
    </el-pagination>

  </el-main>

</el-container>

  <!-- coulse List -->
  <el-dialog :visible.sync='canShowStudent'>

    <el-form :inline="true" class="form">
      <!-- <el-form-item>
          <el-input style="width: 340px;" placeholder="请输入手机号" v-model="studentConfig.keyword"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="searchStudent">查询</el-button>
      </el-form-item> -->

      <!-- <el-form-item>
        <el-button type="primary" icon="el-icon-edit-outline" @click="exportXLS">导出</el-button>
      </el-form-item> -->
    </el-form>

    <!-- <el-table :data="studentList" stripe v-loading="loadStudent" element-loading-text="给我一点时间" style="width: 100%" >

      <el-table-column :label="item.key" :prop="item.value" v-for='(item, index) in formList' :key='index'></el-table-column>

    </el-table> -->
    <el-form :data="studentList" stripe v-loading="loadStudent" element-loading-text="给我一点时间" style="width: 100%" >

      <el-form-item :label="item.key" :prop="item.value" v-for='(item, index) in formList' :key='index'>
          <el-input style="width: 340px;" v-model="studentList[item.value]" disabled='true'></el-input>
      </el-form-item>

    </el-form>

    <!-- <el-pagination background 
                    @size-change="studentSizeChange" 
                    @current-change="studentPageChange" 
                    :current-page="studentConfig.page" 
                    :page-sizes="[10, 2, 30, 50]" 
                    :page-size="studentConfig.limit" 
                    layout="total, sizes, prev, pager, next" :total="studentTotal">
    </el-pagination> -->

    <span slot="footer" class="dialog-footer">
      <el-button @click="canShowStudent=false">取消</el-button>
    </span>
  </el-dialog>

</div>
</template>
<script>

import {getAuthList_api,deleteAuth_api,addAuth_api,editAuth_api} from '@/api/seller' 
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  components: {
    UploadExcelComponent
  },
  created(){
    this.getList()
  },
  data() {
    return {
      formLabelWidth:'80px',
      address: null,
      addressList: [],
      classList: [
        { key: '预约人', value: 'name' },
        { key: '联系方式', value: 'num_total' },
        { key: '预约课程', value: 'coulse' },
        { key: '预约老师', value: 'teacher' },
        // { key: '教学点', value: 'address' },
        { key: '时间段', value: 'times' },
      ],
      listConfig: { // student
        page: 1,
        limit: 10,
        coulseId: 0,
        teacherId: 0,
        parentName: '',
        parentPhone: 1,
      },
      loadList: false,
      list: [],
      listTotal: null,
      canShowStudent: false,
      loadStudent: false,
      studentConfig: {
        page: 1,
        limit: 10,
        keyword: '',
      },
      studentList: [],
      studentTotal: null,
      formList: [
        { key: '预 约 人 ', value: 'name' },
        { key: '联系方式', value: 'phone' },
        { key: '学生姓名', value: 'name' },
        { key: '家长姓名', value: 'parentName' },
        { key: '预约课程', value: 'teacher' },
        { key: '预约老师', value: 'teacher' },
        { key: '预约时间', value: 'teacher' },
      ]
    }
  },
  methods: {
      search(){
        console.log('search', this.listConfig.keyword);
      },
      showItem(index, row){
        this.canShowStudent = true;
        this.studentList = { name: 'k1sdfkjsdfgdp', phone: 10, parentName: 'skfjkdsf看视频低空飞过佛i给fig水平高奋斗过v佛光v就' };
        this.studentTotal = this.studentList.length;
      },
      deleteItem(index,row){
        let id = row.id
        this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', {
          // confirmButtonText: '确定',
          // cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('delete student');
        }).catch(()=>{
          console.log('delete student cancel');
          this.$notify.info({ title: '消息', message: '已取消' });
        })
      },
      searchStudent(){
        console.log('search', this.studentConfig.keyword);
      },
      //
      getList() { //获取列表
        this.loadList = true;

        // let sendData = Object.assign({},this.listQuery)
        
        this.list = [
          { name: 'k1', coulse: 'kk1', phone: 10, parentName: 'skfjkdsf看视频低空飞过佛i给fig水平高奋斗过v佛光v就' },
          { name: 'k1sdfkjsdfgdp', phone: 10, teacher: 't2', parentName: 'skfjkdsf看视频低空飞过佛i给fig水平高奋斗过v佛光v就' },
        ];
        this.listTotal = this.list.length;
        this.loadList = false;
      },
      delete(id){
        let sendData = {
          seller_id:id,
        }
        deleteAuth_api(sendData).then(res=>{
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
          console.error('deleteseller_api')
        })
          
        
      },
    studentSizeChange(val) {
      this.student.limit = val
      this.getList()
    },
    studentPageChange(val) {
      this.student.page = val
      this.getList()
    },
    sizeChange(val){
      console.log('size change', val);
    },
    pageChange(val){
      
      console.log('page change', val);
    }
    
  }
}
</script>