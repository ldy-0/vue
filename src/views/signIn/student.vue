<style lang="stylus">
  .notice
    .header
      margin-top 20px
</style>

<template>
<div>

<el-container class="notice">

  <el-main>
    <el-form :inline="true"  class="form"> <!--:model="formInline" -->

      <el-form-item>
        <el-input style="width: 340px;" placeholder="请输入联系方式" v-model="keyword"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchStudent">查询</el-button>
      </el-form-item>

      <el-select v-model="student.student_state" placeholder="分类" @change='changeState'>
          <el-option v-for="item in categoies" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>

    </el-form>

    <custom-table :config='studentConfig' 
                  :data='studentList' 
                  :classList='studentClass' 
                  :isLoading='loadStudent' 
                  :total='studentTotal'
                  @update='updatePhone'
                  @showDetail='showCourse'
                  @delete='deleteStudent'
                  @change='changeStudent'>
    </custom-table>

  </el-main>

</el-container>

  <!-- coulse List -->
  <el-dialog :visible.sync='canShowCoulse' width='80%'>

    <custom-table :config='courseConfig' 
                  :data='courseList' 
                  :classList='courseClass' 
                  :isLoading='loadCourse' 
                  :total='courseTotal'
                  @change='changeCourse'></custom-table>   

    <span slot="footer" class="dialog-footer">
      <el-button @click="canShowCoulse=false">取消</el-button>
    </span>
  </el-dialog>

  <!-- update phone -->
  <custom-dialog :visible='canShowUpdateStudent' :config='updateConfig' :detail='updateParam' @cancel='cancelUpdateStudent' @submit='submitUpdate'></custom-dialog>

</div>
</template>
<script>

import api from '@/api/seller' 
import { getNames } from '@/utils/auth' 
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import customTable from '@/components/customTable/index.vue'
import customDialog from '@/components/customDialog/index.vue'

export default {
  components: {
    UploadExcelComponent,
    customTable,
    customDialog,
  },
  created(){
    this.setNames();

    this.getStudentList()
  },
  data() {
    return {
      formLabelWidth:'80px',
      address: null,
      addressList: [],
      canShowStudent: false,
      loadStudent: false,
      studentConfig: {
        showOperate: true,
        showUpdate: true,
        showLook: true,
        showDelete: true,
      },
      studentClass: [
        { key: '学生姓名', value: 'student_name' },
        { key: '家长姓名', value: 'parent_name' },
        { key: '家长手机', value: 'parent_mobile' },
        { key: '分类', value: 'status' },
      ],
      studentList: [],
      student: {
        page: 1,
        limit: 10,
        student_state: 0,
      },
      studentTotal: 0,
      keyword: '',
      categoies: [
        { id: 1, name: '匹配' },
        { id: 0, name: '不匹配' }
      ],
      // course
      canShowCoulse: false,
      courseConfig: {},
      courseClass: [
        { key: '课程名称', value: 'course_name' },
        { key: '总期数', value: 'course_semester' },
        { key: '已上期数', value: 'finished_semester' },
        { key: '老师', value: 'teacher_name', },
        { key: '教学点', value: 'address_name' },
        { key: '时间点', value: 'times', isMulti: true, },
      ],
      loadCourse: false,
      courseList: [],
      course: {
        page: 1,
        limit: 10,
        student_id: null,
      },
      courseTotal: 0,
      // update ma
      canShowUpdateStudent: false,
      updateConfig: {
        labelWidth: '100px',
        isDisable: false,
        canSubmit: true,
        classList: [
          { key: '手机号', value: 'parent_mobile', isPhone: true, },
        ], 
      },
      updateParam: {
        student_id: null,
        parent_mobile: '',
      },
    }
  },
  methods: {
    setNames(){
      let names = JSON.parse(getNames('names'));
      this.studentClass = [
        { key: `${names.words_name1}姓名`, value: 'student_name' },
        { key: `家长姓名`, value: 'parent_name' },
        { key: `家长手机`, value: 'parent_mobile' },
        { key: '分类', value: 'status' },
      ];
      this.courseClass = [
        { key: `${names.words_name2}名称`, value: 'course_name' },
        { key: '总期数', value: 'course_semester' },
        { key: '已上期数', value: 'finished_semester' },
        { key: names.words_name2, value: 'teacher_name', },
        { key: '教学点', value: 'address_name' },
        { key: '时间点', value: 'times', isMulti: true, },
      ];
    },
    searchStudent(){
      console.log('search student', this.keyword);
      this.student.search = this.keyword;
      this.getStudentList();
    },
    changeState(v){ 
      this.studentConfig.showUpdate = !v;
      this.getStudentList();
    },
    async getStudentList(){
      this.loadStudent = true;

      let res = await api.getStudentList(this.student, this);
      if(res.data) res.data.forEach(v => v.status = v.student_state ? '匹配' : '不匹配');
      
      this.studentList = res.data;
      this.studentTotal = res.pagination ? res.pagination.total : 0;
      this.loadStudent = false;
    },
    updatePhone(item){
      this.canShowUpdateStudent = true;
      this.updateConfig.canSubmit = true;
      console.log('update student:', item);

      this.updateParam.student_id = item.student_id;
      this.updateParam.parent_mobile = item.parent_mobile;
    },
    showCourse(item){
      console.log('student item:', item)
      this.canShowCoulse = true;
      
      this.course.student_id = item.student_id;
      this.getCourseList();
    },
    async deleteStudent(item){
      console.log('delete student:', item);
      let res = await api.deleteStudent({ student_id: item.student_id }, this);

      this.getStudentList();
    },
    changeStudent(v){
      console.log('change student list:', v);
      this.student.page = v.page;
      this.student.limit = v.limit;
      this.getStudentList();
    },
    // update phone
    cancelUpdateStudent(){
      this.canShowUpdateStudent = false;
    },
    async submitUpdate(){
      this.updateConfig.canSubmit = false;
      console.log('update phone', this.updateParam);
      let res = await api.updatePhone(this.updateParam, this);
      console.log('update phone res:', res);

      this.canShowUpdateStudent = false;
      this.getStudentList();
    },
    // course
    async getCourseList(){
      this.loadCourse = true;

      let res = await api.getCoulseList(this.course, this);
      if(res.data){
        res.data.forEach(v =>  v.times = Array.isArray(v.time) ? v.time.map(t => `${t[0]} ${t[1]}`) : [''] );
      }

      this.courseList = res.data;
      console.log('get student course list', this.courseList);
      this.courseTotal = res.pagination ? res.pagination.total : 0; // courseList
      this.loadCourse = false;  
    },
    changeCourse(v){
      console.log('change course list:', v);
      this.course.page = v.page;
      this.course.limit = v.limit;
      this.getCourseList();
    },
    
  }
}
</script>