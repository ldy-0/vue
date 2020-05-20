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
</style>

<template>
<div>

<el-container class="notice">

  <el-main>

    <customHead :config='headConfig' @searchByKeyWord='searchByName' @searchByDate='searchByDate'></customHead>

    <custom-table :config='tableConfig'
                :data='list'
                :classList='classList'
                :total='listTotal'
                :isLoading='loadList'
                @signIn='showIn'
                @signOut='showOut'
                @change='change'></custom-table>

  </el-main>

</el-container>

  <!-- coulse List -->
  <el-dialog :visible.sync='canShowStudent' width='80%'>

    <customHead :config='studentHeadConfig' @searchByKeyWord='searchStudent' @exportFile='exportXLS'></customHead>

    <custom-table :config='studentConfig' 
                  :data='studentList' 
                  :classList='studentClass' 
                  :isLoading='loadStudent' 
                  :total='studentTotal'
                  @change='changeStudent'>
    </custom-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="canShowStudent=false">取消</el-button>
    </span>
  </el-dialog>

</div>
</template>
<script>

import api from '@/api/seller' 
import { getNames } from '@/utils/auth' 
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import customHead from '@/components/customHead/index.vue'
import customTable from '@/components/customTable/index.vue'

export default {
  components: {
    UploadExcelComponent,
    customHead,
    customTable,
  },
  created(){
    this.setNames();

    this.listConfig.date = `${new Date().toLocaleDateString()}`;
    this.getList()
  },
  data() {
    return {
      formLabelWidth:'80px',
      address: null,
      addressList: [],
      headConfig: {
        showSearchByKeyWord: true,
        showSearchByDate: true,
        // title: '添加教学点',
        inputWidth: '300px',
        dateWidth: '400px',
        placeholder: '请输入课程名',
      },
      studentHeadConfig: {
        showSearchByKeyWord: true,
        showExport: true,
        inputWidth: '300px',
        placeholder: '请输入手机号',
      },
      // course list
      tableConfig: {
        showOperate: true,
        showSignIn: true,
        showSignOut: true,
      },
      classList: [
        { key: '课程名称', value: 'course_name' },
        { key: '总期数', value: 'course_semester' },
        { key: '已上期数', value: 'finished_semester' },
        { key: '老师', value: 'teacher_name' },
        { key: '教学点', value: 'address_name' },
        { key: '时间段', value: 'times', }, // isMulti: true,
      ],
      listConfig: { // student
        page: 1,
        limit: 10,
      },
      loadList: false,
      list: [],
      listTotal: null,
      // student
      canShowStudent: false,
      loadStudent: false,
      studentKeyword: null,
      studentConfig: {},
      studentClass: [
        { key: '学生姓名', value: 'student_name' },
        { key: '家长姓名', value: 'parent_name' },
        { key: '家长手机号', value: 'parent_mobile' },
        { key: '签到老师', value: 'teacher_name' }, 
        { key: '签到时间', value: 'signinTime' },
      ],
      studentList: [],
      student: {
        page: 1,
        limit: 10,
      },
      studentTotal: 0,
    }
  },
  methods: {
    setNames(){
      let names = JSON.parse(getNames('names'));
      this.headConfig.placeholder = `请输入${names.words_name2}名`;
      this.classList = [
        { key: `${names.words_name2}名称`, value: 'course_name' },
        { key: '总期数', value: 'course_semester' },
        { key: '已上期数', value: 'finished_semester' },
        { key: names.words_name3, value: 'teacher_name' },
        { key: '教学点', value: 'address_name' },
        { key: '时间段', value: 'times', }, // isMulti: true,
      ];
      this.studentClass = [
        { key: `${names.words_name1}姓名`, value: 'student_name' },
        { key: '家长姓名', value: 'parent_name' },
        { key: '家长手机号', value: 'parent_mobile' },
        { key: `签到${names.words_name3}`, value: 'teacher_name' }, 
        { key: '签到时间', value: 'signinTime' },
      ];
    },
      searchByName(v){ this.getList(this.listConfig.course_name = v); },
      searchByDate(v){
        console.log('search', v);
        this.listConfig.date = `${v.startDate}|${v.endDate}`;
        this.getList();
      },
      searchStudent(v){ this.getStudentList(this.student.search = v) },
      showIn(item){
        this.canShowStudent = true;
        let signin = { key: '签到时间', value: 'signinTime' };
        this.studentClass.some(v => v.key === '签到时间') ? void(0) : this.studentClass[this.studentClass.length - 1] = signin;

        this.student.cschedule_id = item.cschedule_id;
        this.student.semester_no = item.semester_no;
        this.student.sign_type = 1;

        this.getStudentList(item);
      },
      showOut(item){
        this.canShowStudent = true;
        let signout = { key: '离开时间', value: 'signoutTime' };
        this.studentClass.some(v => v.key === '离开时间') ? void(0) : this.studentClass[this.studentClass.length - 1] = signout;

        this.student.cschedule_id = item.cschedule_id;
        this.student.semester_no = item.semester_no;
        this.student.sign_type = 2;

        this.getStudentList(item);
      },
      exportXLS(loading){

        import('@/vendor/Export2Excel').then(excel => {
          console.log('import', excel);
          const tHeader = this.studentClass.map(v => v.key); 
          const values = this.studentClass.map(v => v.value); 
          const data = this.studentList.map(o => values.map(v => o[v]) );

          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `签到列表-${new Date().toLocaleDateString()}`,
            autoWidth: this.autoWidth
          })

          loading.close();
        })

      },
      //
      async getList() { 
        this.loadList = true;

        let res = await api.getSignCourseList(this.listConfig, this); 
        if(res.data){
          res.data.forEach(v =>  v.times = Array.isArray(v.time) ? `${v.time[0]} ${v.time[1]}` : '' );
        }
        // res.data.forEach(v =>  v.times = Array.isArray(v.time) ? v.time.map(t => `${new Date(t[0]).toLocaleDateString()} ${t[1]}`) : [''] );
        console.log('course list res:', res.data);
        
        this.list = res.data;
        this.listTotal = res.pagination? res.pagination.total : 0;
        this.loadList = false;
      },
    change(v){
      this.listConfig.page = v.page;
      this.listConfig.limit = v.limit;
      console.log('size change', this.listConfig);
      this.getList();
    },
    async getStudentList(item){
      this.loadStudent = true;

      let res = await api.getSignList(this.student, this);
      if(Array.isArray(res.data)){
        res.data.forEach(v => { v.signinTime = new Date(v.signin_time * 1000).toLocaleString(); v.signoutTime = new Date(v.signout_time * 1000).toLocaleString(); });
      }
      console.log('signlist', res);

      this.studentList = res.data;
      this.studentTotal = res.pagination ? res.pagination.total : this.studentList.length;
      this.loadStudent = false;
    },
    changeStudent(v){
      console.log('change student list:', v);
      this.student.page = v.page;
      this.student.limit = v.limit;
      this.getStudentList();
    },
    
  }
}
</script>