<style lang="css">
</style>

<template>
<div class="notice">

<el-header class="header">
  <custom-head :config='headConfig' @add='openDialog(1)' @search='search' @change='headChange'></custom-head> 
</el-header>

<custom-table ref='table' :config='tableConfig' :data='list' :total='total' @update='openDialog' @modify='dispatch' @change='change'></custom-table>

<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
  <div v-if="[1, 2].indexOf(dialogConfig.status) !== -1">

    <sign :obj="detail" @cancel="closeDialog" @submit="submit"></sign> 

  </div>

</el-dialog>

</div>
</template>
<script>

import api from '@/api/activity' 
import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customSelect from '@/components/select'
import editor from '@/components/Tinymce'
import sign from './component/sign'
// import uploadFn from "@/utils/tencent_cos";

export default {
  components: {
    customHead,
    customTable,
    customSelect,
    editor,
    sign,
  },

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },
  },

  data() {
    return {
      dialogConfig: {
        title: '',
        status: 0, // 1: 添加活动，2：查看详情 
      },

      content: { title: '活动规则', value: '', alert: null, disabled: false, },
      // goods: { title: '关联商品', categories: [], value: '', alert: null, },
      stopSubmit: false,

      headConfig: {
        title: '添加活动',
        switchList: [
          { title: '开启活动', value: false, }
        ],
        // placeHolder: '名称搜索',
      },

      tableConfig: {
        showOperate: true,
        btnList: [
          { key: 'signin_id', value: '查看详情', },
          { key: 'showEnd', value: '结束' },
          { key: 'signin_id', value: '删除', type: 'danger' },
        ],
        classList: [
          { key: '活动日期', value: 'dateStr' },
          { key: '活动时间', value: 'timeStr' },
          { key: '已参与人数', value: 'member_count' },
          { key: '签到红包总量', value: 'max_amount' },
          { key: '状态', value: 'statusStr' },
          // { key: '图片', value: 'image', isImg:true },
        ],
      },
      list: [],
      total: 0,
      query: { page: 1, limit: 10, },
      detail: null,

      rainMap: {
        0: '未开始',
        1: '进行中',
        2: '已结束',
      },
      
      interval: null,

    }
  },

  watch: {
    content: {
      deep: true,
      handler(v1, v2){ this.content.alert = this.content.value ? null : `${this.content.title}不能为空!`; }
    },
  },

  methods: {
    openDialog(status){
      this.dialogConfig.status = typeof status === 'number' ? status : 2;
      
      this.detail = typeof status == 'object' ? status : null;
    },
    
    closeDialog(){
      let config = this.dialogConfig;

      config.status = 0;
    },

    search(param){
      this.query.page = 1;
      this.$refs.table.initPage();

      param.search ? this.query.search = param.search : delete this.query.search;
      
      this.getList();
    },

    headChange(type, index, v){
      // 活动开关
      if(type == 'switch' && index == 0) this.changeRainSwitch(v);
    },

    dispatch(item, index){
      // 查看详情
      if(index == 0) this.openDialog(item);

      // 结束
      if(index == 1) this.changeStatus(item);

      // 删除
      if(index == 2) this.deleteItem(item);
    },

    async initActivityForm(item){
      this.status.value = this.rainMap[item.status] || '';
      this.people.value = item.member_count || '';
      this.score.value = item.issue || '';
    },
    
    submit(param){
      this.stopSubmit = true;

      this.save(param);
    },

    // 
    async save(param){
      let status = this.dialogConfig.status;
      let res = null;

      res = status == 1 ? await api.addSign(param) : await api.setSign(this.detail.signin_id, param);

      if(typeof res == 'string' || !res || res.error){
        this.stopSubmit = false;
        return this.$message.error(`${res ? res.error || res : '保存活动信息失败'}`);
      }

      if(res.status ==0) this.$message.success('操作成功');

      this.dialogConfig.status = 0;
      this.getList(); 

      this.stopSubmit = false;
    },

    async getList() { 
      this.tableConfig.loading = true

      let res = await api.getSignList(this.query, this);

      if(typeof res == 'string' || !res || res.error) return this.$message.error(res ? res.error || res : '获取签到活动列表失败');

      if(res && res.data){
        res.data.forEach(this.format);

        this.list = res.data || [];
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }
      
      this.tableConfig.loading = false
    },

    format(v){
      let startArr = v.start_time.split(' '),
          endArr = v.end_time.split(' '),
          timePattern = /(\s)\S*$/;

      v.imgList = [ { url: v.banner } ];

      v.dateStr = `${startArr[0]}至${endArr[0]}`;
      v.timeStr = `${v.signin_start_time}-${v.signin_end_time}`;
      v.date = [new Date(v.start_time), new Date(v.end_time)];
      v.time = [new Date(v.start_time.replace(timePattern, `$1${v.signin_start_time}`)), new Date(v.end_time.replace(timePattern, `$1${v.signin_end_time}`))];

      // 未开始
      if(v.status == 1 && v.time[0].getTime() > new Date().getTime()) v.status = 0;

      v.statusStr =  this.rainMap[v.status];

      // 
      v.showEnd = v.status == 1;

    },

    change(param){
      this.query.limit = param.limit;
      this.query.page = param.page;

      this.getList();
    },

    async changeStatus(item){
      let res = await api.changeSign(item.signin_id); 

      res && res.data ? this.$message.success('修改成功') : this.$message.error(res ? res.error || res : '结束失败');

      this.getList();
    },

    async deleteItem(item){
      let res = await api.deleteSign(item.signin_id, null);

      res.status == 0 ? this.$message.success('删除成功') : this.$message.error(res ? res.error || res : '删除失败');

      this.getList();
    },

    async getSwitch(){
      let res = await api.getSignSwitch();

      if(typeof res == 'string' || !res || res.error) this.$message.error(res ? res.error || res : '获取活动状态接口失败');

      this.headConfig.switchList[0].value = res && res.data == 1 ? true : false;
    },

    async changeRainSwitch(value){
      value = Number(value);
      let res = await api.setSignSwitch({ value, });

      res.status == 0 ? this.$message.success('设置成功') : this.$message.error(res ? res.error || res : '设置失败');

      this.getSwitch();
    },

    getActivityTime(){
      let d = this.date.value,
          t1 = this.time.value[0],
          t2 = this.time.value[1],
          year = d.getFullYear(),
          month = (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1),
          date = (d.getDate() < 10 ? '0' : '') + d.getDate(),
          startHour = (t1.getHours() < 10 ? '0' : '') + t1.getHours(),
          endHour = (t2.getHours() < 10 ? '0' : '') + t2.getHours(),
          startMinute = (t1.getMinutes() < 10 ? '0' : '') + t1.getMinutes(),
          endMinute = (t2.getMinutes() < 10 ? '0' : '') + t2.getMinutes(),
          startSecond = (t1.getSeconds() < 10 ? '0' : '') + t1.getSeconds(),
          endSecond = (t2.getSeconds() < 10 ? '0' : '') + t2.getSeconds(),
          start, end;
        
      start = `${year}-${month}-${date} ${startHour}:${startMinute}:${startSecond}`;
      end = `${year}-${month}-${date} ${endHour}:${endMinute}:${endSecond}`;

      return [start, end];
    },

  },

  created(){
    this.getList();
    this.interval = setInterval(() => { this.getList(); }, 60 * 1000);

    this.getSwitch();
  },

  beforeRouteLeave(to, from, next){
    if(this.interval) clearInterval(this.interval);

    next();
  }
}
</script>