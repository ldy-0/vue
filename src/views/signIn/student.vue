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
  <!-- <el-dialog :visible.sync='canShowStudent'> -->
    <el-form :inline="true"  class="form"> <!--:model="formInline" -->

      <el-form-item>
        <el-input style="width: 340px;" placeholder="请输入联系方式" v-model="listConfig.parentPhone"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchStudent">查询</el-button>
      </el-form-item>

      <!-- <el-form-item>
        <upload-excel-component :on-success='importDone' :before-upload="beforeUpload"></upload-excel-component>
      </el-form-item> -->

    </el-form>

    <el-table :data="studentList" stripe v-loading="loadStudent" element-loading-text="给我一点时间" style="width: 100%" >
      <el-table-column label='学生姓名' prop='student_name'></el-table-column>
      <el-table-column label='家长姓名' prop='parent_name'></el-table-column>
      <el-table-column label='家长手机' prop='parent_mobile'></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showCoulse(scope.$index, scope.row)">查看</el-button>
          <el-button size="mini" type="danger" @click="deleteStudent(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background 
                  @size-change="sizeChange" 
                  @current-change="pageChange" 
                  :current-page="listConfig.page" 
                  :page-sizes="[10,2,30, 50]" 
                  :page-size="listConfig.limit" 
                  layout="total, sizes, prev, pager, next" :total="studentTotal">
    </el-pagination>

    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="canShowStudent=false">取消</el-button>
    </span> -->
  <!-- </el-dialog> -->
  </el-main>

</el-container>

  <!-- coulse List -->
  <el-dialog :visible.sync='canShowCoulse'>
    <!-- <el-select v-model="address" placeholder="请选择教学点">
        <el-option
          v-for="item in addressList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
    </el-select> -->

    <el-table :data="coulseList" stripe v-loading="loadCoulse" element-loading-text="给我一点时间" style="width: 100%" >

      <el-table-column label="课程名称" prop="name"></el-table-column>
      <el-table-column label="总期数" prop='num'></el-table-column>
      <el-table-column label="已上期数" prop='numed'></el-table-column>
      <el-table-column label="老师" prop='teacher'></el-table-column>
      <el-table-column label="教学点" prop='address'></el-table-column>
      <el-table-column label="时间段" prop='time'></el-table-column>

      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showStudent(scope.$index, scope.row)">详情</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <el-pagination background 
                    @size-change="coulseSizeChange" 
                    @current-change="coulsePageChange" 
                    :current-page="coulse.page" 
                    :page-sizes="[10,2,30, 50]" 
                    :page-size="coulse.limit" 
                    layout="total, sizes, prev, pager, next" :total="coulseTotal">
    </el-pagination>

    <span slot="footer" class="dialog-footer">
      <el-button @click="canShowCoulse=false">取消</el-button>
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
      canShowCoulse: false,
      loadCoulse: false,
      coulse: {
        page: 1,
        limit: 10,
      },
      coulseList: [],
      coulseTotal: '',
      address: null,
      addressList: [],
      listConfig: { // student
        page: 1,
        limit: 10,
        coulseId: 0,
        teacherId: 0,
        parentName: '',
        parentPhone: 1,
      },
      canShowStudent: false,
      loadStudent: false,
      studentList: [],
      studentTotal: null,
    }
  },
  methods: {
    searchStudent(){
      console.log('search student', this.listConfig.parentPhone);
    },
    sizeChange(val) {
      this.listConfig.limit = val
      this.getList()
    },
    pageChange(val) {
      this.listConfig.page = val
      this.getList()
    },
    showCoulse(index, rowData){
      console.log(rowData)
      
      this.canShowCoulse = true;
      this.loadCoulse = true;
      this.coulseList = [
        { name: 'k1', num: 10, numed: 2, teacher: 'sjdfk；是看佛德国发动进攻i都经过到了法国害怕佛靠打工', address: 'skfjkdsf看视频低空飞过佛i给fig水平高奋斗过v佛光v就', time: new Date().toLocaleString() },
        { name: 'k1', num: 10, numed: 2, address: 'skfjkdsf看视频低空飞过佛i给fig水平高奋斗过v佛光v就', time: new Date().toLocaleString() },
        { name: 'k1', num: 10, numed: 2, address: 'skfjkdsf看视频低空飞过佛i给fig水平高奋斗过v佛光v就', time: new Date().toLocaleString() },
        { name: 'k1', num: 10, numed: 2, address: 'skfjkdsf看视频低空飞过佛i给fig水平高奋斗过v佛光v就', time: new Date().toLocaleString() }
      ];
      this.loadCoulse = false;
      this.coulseTotal = this.coulseList.length;
    },
      importDone({ results, header }) { // upload xls success
        this.tableData = results
        this.tableHeader = header
        console.log('-- import success', this.tableData, this.tableHeader)
      },
      beforeUpload(file) { // before upload xls
        const isLt2M = file.size / 1024 / 1024 < 1

        if (isLt2M) {
          return true
        }
        this.$message({
          message: 'Please do not upload files larger than 2m in size.',
          type: 'warning'
        })
        return false
      },
      showStudent(index, row){
        this.canShowStudent = true;
        this.getList(); 
      },
      async getList() { //获取列表
        this.loadStudent = true;

        // let sendData = Object.assign({},this.listQuery)
        let studentList = await api.getStudentList(this.listConfig);
        this.studentList = studentList.data;
        this.studentTotal = studentList.pagination.total;
        console.log('get student', studentList);
        
        // this.studentList = [
        //   { name: 'k1', phone: 10, parentName: 'skfjkdsf看视频低空飞过佛i给fig水平高奋斗过v佛光v就' },
        //   { name: 'k1sdfkjsdfgdp', phone: 10, parentName: 'skfjkdsf看视频低空飞过佛i给fig水平高奋斗过v佛光v就' },
        // ];
        this.loadStudent = false;
      },
      deleteStudent(index,row){
        let id = row.id
        this.$confirm(`此操作将删除该条目, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('delete student');
        }).catch(()=>{
          console.log('delete student cancel');
          this.$notify.info({ title: '消息', message: '已取消' });
        })
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
    
    coulseSizeChange(val){
      console.log('coulse size change', val);
    },
    coulsePageChange(val){
      
      console.log('coulse page change', val);
    }
    
  }
}
</script>