<style lang="css">
  .header{
    margin-top: 20px;
  }

.time{
  display: flex; 
  align-items: center;
}

.custom_detail{
  position: relative;
  width: 80%;
  /* height: 300px; */
  margin: 20px 0;
  padding: 30px 10px;
  border: 1px solid gray;
}
.close{
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>

<template>
<div>

<custom-dialog :config='dialogConfig' :visible='canShowForm' :detail='formData' @cancel='clearForm' @submit='saveCourse' @addDetail='addTeacher'>
  <div class='custom_detail' v-for='(item, index) in formData.detailList' :key='index'>
    <el-form label-width="100px" :model='item' ref='detailForm' :rules='detailRule' >
      <i class='el-icon-close close' @click='deleteDetail(index)' v-if='isAddItem'></i>

      <el-form-item label="上课时间" prop='date'>
        <el-date-picker style="width:400px" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" 
                            v-model="item.date"
                            @change='addDate(index, $event)'>
        </el-date-picker>
        <div class='time' v-for='(item, i) in item.dateList' :key='i'>
            <div class='f-fs' v-text='item.value'></div>
            <el-button style='margin-left: 20px;' @click='deleteDate(index, i)' type='danger' size='mini'>删除</el-button>
        </div>
      </el-form-item>

      <el-form-item :label="names.words_name3" prop='teacher' style='margin: 20px 0 0;'>
        <el-select v-model='item.teacher' :placeholder="'请选择'+names.words_name3" > <!--@focus='setTeacherList(index)' --> 
            <el-option v-for="option in teacherList" :key="option.teacher_id" :label="option.teacher_name" :value="option.teacher_id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="教学点" style='margin: 20px 0;' prop='address'>
        <el-select v-model='item.address' placeholder="请选择教学点">
            <el-option v-for="option in addressList" :key="option.address_id" :label="option.address_name" :value="option.address_id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="可预约人数" prop='max_stunum'>
        <el-input v-model="item.max_stunum" auto-complete="off" @input='inputSum($event, item)'></el-input>
      </el-form-item>

    </el-form>
  </div>
</custom-dialog>

<el-container class="notice">

<el-header class="header">
  <customHead :config='headConfig' @add='showForm' @searchByKeyWord='searchByKeyWord'></customHead>
</el-header>

<el-main>
  <custom-table :config='tableConfig'
                :data='tableData'
                :classList='tableClass'
                :total='total'
                :isLoading='listLoading'
                @update='showForm'
                @delete='deleteCourse'
                @showStudent='showStudent'
                @change='change'></custom-table>

</el-main>
</el-container>

<!-- edit coulse --> 
  <el-dialog :visible.sync='canShowStudent' width='80%'>
    <el-form :inline="true" :model="formInline" class="form">

      <el-form-item>
        <el-input style="width: 340px;" placeholder="请输入联系方式" v-model="studentKeyword"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchStudent">查询</el-button>
      </el-form-item>

      <!-- <el-form-item>
        <upload-excel-component :on-success='importDone' :before-upload="beforeUpload"></upload-excel-component>
      </el-form-item> -->
    </el-form>

    <custom-table :config='studentConfig'
                  :data='studentList'
                  :classList='studentClass'
                  :total='studentTotal'
                  :isLoading='loadStudent'
                  @showAdd='editSemester("add", $event)'
                  @showMinus='editSemester("minus", $event)'
                  @delete='deleteStudent'
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
import customHead from '@/components/customHead/index.vue' 
import customTable from '@/components/customTable/index.vue' 
import customDialog from '@/components/customDialog/index.vue' 

export default {
  created(){
    this.setNames();

    this.getClassList();
    this.getTeacherList();
    this.getAddressList();

    this.getList()
  },

  components: {
    customHead,
    customTable,
    customDialog,
  },

  data() {
    return {
      detailList: [],
      detailRule: {
          // 'date': [ { required: true, message: '请选择时间', trigger: 'change' }, ],
          'teacher': [ { required: true, message: '请选择类别', trigger: 'change' }, ],
          'address': [ { required: true, message: '请选择教学点', trigger: 'change' } ],
          'max_stunum': [ { required: true, message: '请输入可预约人数', trigger: 'blur' } ],
      },
      error: null,
      headConfig: {
        showAdd: true,
        showSearchByKeyWord: true,
        title: '添加课程',
        inputWidth: '300px',
        placeholder: '请输入课程名',
      },
      listLoading: false,
      tableConfig: {
        showOperate: true,
        showUpdate: true,
        showStudent: true,
        showDelete: true,
        showStudentTitle: '',
      },
      tableData: [],
      tableClass: [
        { key: '姓名', value: 'course_name' },
        { key: '总期数', value: 'course_semester' },
        // { key: '价格', value: 'price' },
        { key: '可预约人数', value: 'max_stunum' },
        { key: '已预约人数', value: 'stu_num' },
        { key: '老师', value: 'teacher_name', }, //isMulti: true,
        { key: '教学点', value: 'address_name', },
        { key: '时间段', value: 'times', isMulti: true, },
      ],
      listQuery: {
        page: 1,
        limit: 10,
      },
      total:1,
      formLabelWidth:'100px',
      // 
      dialogConfig: {
        width: '60%',
        labelWidth: '100px',
        canSubmit: true,
        classList: [
          { key: '课程名称', value: 'course_name', isText: true, },
          { key: '期数', value: 'course_semester', isInteger: true, },
          // { key: '上课时间', value: 'times', isDates: true, },
          // { key: '教学点', value: 'teach_address', placeholder: '请选择教学点(可多选)', list: [], id: 'address_id', name: 'address_name', isMultiSelect: true, },
          // { key: '教师', value: 'teacher', placeholder: '请选择教学点(可多选)', list: [], id: 'teacher_id', name: 'teacher_name', isMultiSelect: true, },
          // { key: '可预约人数', value: 'max_stunum', isInteger: true, },
          { key: '添加老师', value: 'detailList', isDetail: true, },
        ],
        rules: {
          'course_name': [ { required: true, message: '请输入名字', trigger: 'blur' }, ],
          'course_class': [ { required: true, message: '请选择类别', trigger: 'change' }, ],
          'course_semester': [
              { required: true, message: '请输入期数', trigger: 'blur' },
              { type: 'number', message: '周期值必须为数字', trigger: 'blur' },
              { type: 'number', min: 1, message: '周期值必须大于0', trigger: 'blur' },
          ],
          'teach_address': [ { required: true, message: '请选择教学点', trigger: 'change' } ],
          'teacher': [ { required: true, message: '请选择老师', trigger: 'change' } ],
          'max_stunum': [
              { required: true, message: '请输入可预约人数', trigger: 'blur' },
              { type: 'number', message: '可预约人数必须为数字', trigger: 'blur' },
              { type: 'number', min: 1, message: '可预约人数必须大于0', trigger: 'blur' },
          ],
        }
      },
      canShowForm: false, // 是否显示添加/修改课程弹窗
      canSubmit:false,
      isAddItem:true, // 是否是添加课程
      formData: {
        detailList: [], // 老师,地址 
      },
      formInline: {},
      addressList: [],
      teacherList: [],
      // student
      canShowStudent: false, 
      canEditSemester: true,
      studentConfig: {
        showOperate: true,
        showAdd: true,
        showMinus: true,
        showDelete: true,
      },
      loadStudent: false,
      studentKeyword: null,
      studentList: [],
      studentClass: [
        { key: '学生姓名', value: 'student_name' },
        { key: '家长姓名', value: 'parent_name' },
        { key: '家长手机', value: 'parent_mobile' },
        { key: '总期数', value: 'buy_semester' },
        { key: '已上期数', value: 'over_semester' },
        // { key: '剩余期数', value: '' },
      ],
      student: {
        page: 1,
        limit: 10,
        cschedule_id: null,
        student_state: 1,
      },
      studentTotal: 0,
      names: null,
    }
  },

  methods: {
    // edit names
    setNames(){
      let names = JSON.parse(getNames('names'));
      console.log('names: ', names);
      this.names = names;
      this.headConfig.title = `添加${names.words_name2}`;
      this.headConfig.placeholder = `请输入${names.words_name2}名`;
      this.tableClass = [
        { key: '姓名', value: 'course_name' },
        { key: '总期数', value: 'course_semester' },
        // { key: '价格', value: 'price' },
        { key: '可预约人数', value: 'max_stunum' },
        { key: '已预约人数', value: 'subscribe_num' },
        { key: names.words_name3, value: 'teacher_name', }, //isMulti: true,
        { key: '教学点', value: 'address_name', },
        { key: '时间段', value: 'times', isMulti: true, },
      ];
      this.tableConfig.showStudentTitle = `查看${names.words_name1}`;
      this.dialogConfig.classList = [
          { key: `${names.words_name2}名称`, value: 'course_name', isText: true, },
          { key: '期数', value: 'course_semester', isInteger: true, },
          { key: `添加${names.words_name3}`, value: 'detailList', isDetail: true, },
      ];
      this.studentClass = [
        { key: `${names.words_name1}姓名`, value: 'student_name' },
        { key: '家长姓名', value: 'parent_name' },
        { key: '家长手机', value: 'parent_mobile' },
        { key: '总期数', value: 'buy_semester' },
        { key: '已上期数', value: 'over_semester' },
      ];
    },
    searchByKeyWord(v){
      this.listQuery.course_name = v;
      console.log('address search :', this.listQuery);

      this.getList();
    },
    showForm(row){
      this.canShowForm = true;
      this.dialogConfig.canSubmit = true;

      this.isAddItem = !row;
      this.initForm(row);
      console.log('showForm :', this.dialogConfig, row);
    },
    clearForm(done){ this.canShowForm = false; },
    initForm(item){
      let detail = {};

      for(let key in (item || this.formData)){ detail[key] = item ? item[key] : Array.isArray(this.formData[key]) ? [] : '' }

      if(item){
        let dateList = detail.time ? detail.time.map(v => { 
            let times = v[1].split('-'),
                start = `${v[0]} ${times[0]}`,
                end = `${v[0]} ${times[0]}`;

            return { startdate: v[0], enddate: v[0], starttime: times[0], endtime: times[1],
                    startStamp: new Date(start).getTime(), 
                    endStamp: new Date(end).getTime(),
                    value: `${start}-${end}` };
          }).reverse() : [];

        detail.detailList = [{
          teacherList: null,
          teacher: detail.teacher_id,
          address: detail.address_id,
          max_stunum: detail.max_stunum, 
          subscribe_num: detail.subscribe_num,
          dateList,
        }];
        
      }

      console.log('init form data done', detail);
      this.formData = detail;
    },
    // detail
    addTeacher(){
      if(!this.isAddItem) return ;

      let detail = { date: '', dateList: [], teacher: '', teacherList: null, address: '', max_stunum: '', };
      
      this.formData.detailList.push(detail); 
    },
    deleteDetail(index){ this.formData.detailList.splice(index, 1); },
    setTeacherList(index){
      let o = this.formData.detailList;

      // o[index].teacherList = this.teacherList.filter(v => o.every(detail => v.teacher_id !== detail.teacher) );
      o[index].teacherList = this.teacherList;
    },
    getTime(temp){ return new Date(temp).toTimeString().split(' ')[0].substr(0, 5) },
    deleteDate(index, i){ 
      let dateList = this.formData.detailList[index].dateList;

      dateList[i].startStamp < Date.now() ? this.$message.error({ message: '该时间不可删除！' }) : this.formData.detailList[index].dateList.splice(i, 1); 
    },
    addDate(index, e){
      let o = this.formData.detailList[index],
          dateList = o.dateList,
          startdate= e[0].toLocaleDateString(), 
          starttime= this.getTime(e[0]),
          enddate= e[1].toLocaleDateString(),
          endtime= this.getTime(e[1]),
          date = { startdate, starttime, enddate, endtime, startStamp: e[0].getTime(), endStamp: e[1].getTime(), value: `${startdate} ${starttime}-${enddate} ${endtime}` };

      if(date.startStamp < Date.now()) return this.$message.error({ message: '选择时间无效' });

      if(dateList.length >= this.formData.course_semester) return this.$message.error({ message: '上课时间数量超过指定期数' });

      // if(date.endStamp - date.startStamp > 24 * 3600000) return this.$message.error({ message: '' });
      let stamp = 24 * 3600000,
          timeZone = 8 * 3600000;
      console.log(date.endStamp - date.startStamp, stamp, date.startStamp % stamp);
      if( date.endStamp - date.startStamp >= (stamp - timeZone - date.startStamp % stamp) )return this.$message.error({ message: '上课,下课时间必须在同一天以内!' });

      // sort
      for(var i = 0, len = dateList.length; i < len; i++){
        if(dateList[i].startStamp >= date.startStamp){
          o.dateList = dateList.concat(date, dateList.splice(i));
          break;
        }
      }
      o.dateList.length === i && o.dateList.push(date);
      console.log('add date: ', date);
    },
    inputSum(v, item){
      console.log('input sum', v, item); 
      
      if(v <= 0 || v % 1 !== 0)return this.error = { message: '值必须为正整数' };

      if(item && item.subscribe_num && v < item.subscribe_num) return this.error = { message: '可预约人数必须大于已预约人数!' };

      this.error = null;
    },
    async saveCourse () {
      let detailList = this.formData.detailList,
          csch_data = [],
          time_data = [];

      if(!detailList.length) return this.$message.error({ message: '至少设置一名老师！' });

      for(let i = 0, len = this.$refs[`detailForm`].length; i < len; i++){
        let res = await this.$refs[`detailForm`][i].validate().catch(e => e);
        if(!res) return ;
      }

      if(this.error) return this.$message.error(this.error);

      if(/[-\[\]]/g.test(this.formData.course_name)) return this.$message.error({ message: `${this.names.words_name2}名不能包含非法字符!` });

      this.dialogConfig.canSubmit = false;

        detailList.forEach((v, i) => {

          if(this.isAddItem){
            csch_data.push(`${i + 1}|${v.teacher}|${v.address}|${v.max_stunum}`);
            time_data = time_data.concat(v.dateList.map((date, index) => `${i + 1}|${date.startdate}|${date.starttime}-${date.endtime}`));
          }else{
            csch_data = `${v.teacher}|${v.address}|${v.max_stunum}`;
            time_data = v.dateList.map((date, index) => `${date.startdate}|${date.starttime}-${date.endtime}`);
          }
        });
      
      let param = {
        course_name: this.formData.course_name,
        course_semester: this.formData.course_semester,
        csch_data,
        time_data,
      };
      if(!this.isAddItem) param.cschedule_id = this.formData.cschedule_id;

      console.log('save course param:', this.formData, param);
      
      let res = this.isAddItem ? await api.setCoulse(param, this) : await api.updateCourse(param, this);

      this.canShowForm = false;
      this.getList();
      
    },
    async getList() { 
      this.listLoading = true

      let res = await api.getCoulseList(this.listQuery, this);
      if(Array.isArray(res.data)){
        res.data.forEach(v =>  v.times = Array.isArray(v.time) ? v.time.map(t => `${new Date(t[0]).toLocaleDateString()} ${t[1]}`).reverse() : [''] );
      }

      this.tableData = res.data;
      this.total = res.pagination ? res.pagination.total : 0;
      console.log('get course', this.tableData, this.total);
      this.listLoading = false
    },
    async deleteCourse(item){
      let res = await api.deleteCoulse({ cschedule_id: item.cschedule_id }, this);
      console.log('delete course', item);

      this.getList();
    },
    showStudent(row){
      this.canShowStudent = true;

      this.student.cschedule_id = row.cschedule_id;
      this.student.course_semester = row.course_semester;
      this.getStudentList();
    },
    change(v){
      console.log('change', v);
      this.listQuery.page = v.page;
      this.listQuery.limit = v.limit; 
      this.getList()
    },
    // student
    searchStudent(){
      console.log('search student', this.studentKeyword);
      this.student.search = this.studentKeyword;
      this.getStudentList();
    },
    async getStudentList(){
      this.loadstudent = true;

      let res = await api.getCourseStudent(this.student, this);
      
      this.studentList = res.data;
      this.studentTotal = res.pagination ? res.pagination.total : this.studentList.length;

      this.loadstudent = false;
    },
    async editSemester(str, item){
      if(str === 'add' && item.buy_semester === this.student.course_semester) return this.$message.error({ message: '购买期数已达课程最大期数' });
      if(str === 'minus' && item.buy_semester <= 1) return this.$message.error({ message: '购买期数不能低于一期' });
      if(!this.canEditSemester) return ;
      this.canEditSemester = false;

      let param = {
        stucourse_id: item.stucourse_id,
        buy_semester: str === 'add' ? ++item.buy_semester : --item.buy_semester,
      };
      console.log(`${str} semester: `, param, item);

      let res = await api.changeSemester(param, this);
      this.canEditSemester = true;
      this.getStudentList();
    },
    async deleteStudent(item){
      console.log('delete student:', item);

      let res = await api.deleteStucourse({ stucourse_id: item.stucourse_id }, this);
      this.getStudentList();
    },
    changeStudent(v){
      this.student.page = v.page;
      this.student.limit = v.limit;
      this.getStudentList()
    },
    // 
    async getClassList(){
      let res = await api.getClassList(null, this);
      console.log('teacher list:', res.data);
      
      this.dialogConfig.classList[1].list = res.data;
    },
    async getTeacherList(){
      let res = await api.getTeacherList(null, this);
      console.log('teacher list:', res.data);
      
      this.teacherList = res.data;
      // this.dialogConfig.classList[4].list = res.data;
    },
    async getAddressList(){
      let res = await api.getAddressList(null, this);
      console.log('address list:', res);
      
      this.addressList = res.data;
      // this.dialogConfig.classList[3].list = res.data;
    },
    
  }
}
</script>