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
    <el-form :inline="true"  class="form"> 

      <el-form-item label="">
        <el-input style="width: 340px;" placeholder="请输入手机号" v-model="keyword"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
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
                  :page-sizes="[10, 20, 30, 50]" 
                  :page-size="listConfig.limit" 
                  layout="total, sizes, prev, pager, next" :total="listTotal">
    </el-pagination>

  </el-main>

</el-container>

  <!-- coulse List -->
  <el-dialog :visible.sync='canShowStudent' width='80%'>

    <el-form :data="detail" stripe v-loading="loadStudent" element-loading-text="给我一点时间" style="width: 100%" :disabled='true'>

      <el-form-item :label="item.key" :prop="item.value" v-for='(item, index) in formList' :key='index'>
          <el-input style="width: 340px;" v-model="detail[item.value]"></el-input>
      </el-form-item>

    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="canShowStudent=false">取消</el-button>
    </span>
  </el-dialog>

</div>
</template>
<script>

import api from '@/api/seller' 
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
        { key: '预约人', value: 'member_name' },
        { key: '联系方式', value: 'appointment_phone' },
        { key: '预约课程', value: 'course_name' },
        { key: '预约老师', value: 'teacher_name' },
        { key: '预约时间', value: 'appointment_date' },
      ],
      listConfig: { // student
        page: 1,
        limit: 10,
      },
      keyword: '',
      loadList: false,
      list: [],
      listTotal: null,
      canShowStudent: false,
      loadStudent: false,
      detail: {},
      formList: [
        { key: '预 约 人 ', value: 'member_name' },
        { key: '联系方式', value: 'appointment_phone' },
        { key: '学生姓名', value: 'student_name' },
        { key: '家长姓名', value: 'member_name' },
        { key: '预约课程', value: 'course_name' },
        { key: '预约老师', value: 'teacher_name' },
        { key: '预约时间', value: 'appointment_date' },
      ]
    }
  },
  methods: {
      search(){
        this.listConfig.search = this.keyword;
        console.log('search', this.listConfig);

        this.getList();
      },
      showItem(index, row){
        this.canShowStudent = true;

        this.detail = row;
        // this.getDetail(row.appoinment_id);
      },
      deleteItem(index,row){
        this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(row);
          this.deleteAppoinment(row.appointment_id);
        }).catch(()=>{ this.$notify.info({ title: '消息', message: '已取消' }); })
      },
    //
    async getList() { //获取列表
      this.loadList = true;

      let res = await api.getCourseAppoinment(this.listConfig, this);
      console.log('appoinment res: ', res);
      res.data.forEach(v => v.time = `${v.appoinment_date}${v.appoinment_time}`);
      
      this.list = res.data ? res.data : [];
      this.listTotal = res.pagination ? res.pagination.total : 0; 
      this.loadList = false;
    },
    async getDetail(appoinment_id){
      // let res = await api.getCourseAppoinment({ appoinment_id }, this);
      
      console.log('appoinment res: ', res);
    },
    async deleteAppoinment(appointment_id){
      let res = await api.deleteCourseAppoinment({ appointment_id, }, this);
      console.log('delete id:', id);
      this.getList();
    },
    sizeChange(val){
      this.listConfig.limit = val;
      console.log('size change', this.listConfig);
      this.getList();
    },
    pageChange(val){
      this.listConfig.page = val;
      console.log('page change', this.listConfig);
      this.getList();
    }
    
  }
}
</script>