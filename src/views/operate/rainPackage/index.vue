<style lang="css">
</style>

<template>
<div class="notice">

<el-header class="header">
  <custom-head :config='headConfig' @add='openDialog(1)' @search='search' @change='headChange'></custom-head> 
</el-header>

<custom-table ref='table' :config='tableConfig' 
                :data='list' 
                :total='total' 
                @update='openDialog'
                @modify='dispatch'
                @change='change'></custom-table>


<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
  <div v-if="[1, 2].indexOf(dialogConfig.status) !== -1">
    <el-form label-width='100px'>

      <custom-date :obj='date'></custom-date>
      <custom-time :obj='time'></custom-time>

      <custom-input :obj='number'></custom-input>
      <custom-input :obj='limit'></custom-input>

      <custom-img :obj='img'></custom-img>

      <el-form-item :label="content.title" label-width='180px'>
        <editor style='width: 800px;' :disabled='content.disabled' v-model='content.value'></editor>
        <el-alert type='error' :title='content.alert' v-if='content.alert'></el-alert>
      </el-form-item>

      <div v-if="dialogConfig.status == 2">
        <el-form-item :label="status.title" label-width='180px'>{{status.value}}</el-form-item>
        <el-form-item :label="people.title" label-width='180px'>{{people.value}}</el-form-item>
        <el-form-item :label="score.title" label-width='180px'>{{score.value}}</el-form-item>
      </div>

      <el-form-item label-width='180px' v-if="!detail || detail.status == 0">
        <el-button @click="closeDialog" >取消</el-button>
        <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit">确 定</el-button>
      </el-form-item>
      
    </el-form>

  </div>

</el-dialog>

</div>
</template>
<script>

import api from '@/api/activity' 
import commonReq from '@/api/common' 
import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customInput from '@/components/customInput'
import customImg from '@/components/customImg'
import customSelect from '@/components/select'
import customDate from '@/components/customDate'
import editor from '@/components/Tinymce'
// import uploadFn from "@/utils/tencent_cos";

export default {
  components: {
    customHead,
    customTable,
    customInput,
    customImg,
    customSelect,
    customDate,
    customTime: customDate,
    editor,
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

      date: { type: 'date', title: '活动日期', value: '', alert: null, width: '180px', },
      time: { type: 'timerange', title: '活动时间', value: '', alert: null, width: '180px', },
      number: { type: 'positive', title: '单次活动游戏次数', value: '', alert: null, width: '180px', disabled: false, },
      limit: { type: 'positive', title: '单次活动奖励积分上限', value: '', alert: null, width: '180px', disabled: false, },
      content: { title: '活动规则', value: '', alert: null, disabled: false, },
      status: { title: '状态', value: '', alert: null, },
      people: { title: '参与人数', value: '', alert: null, },
      score: { title: '发放积分', value: '', alert: null, },
      // goods: { title: '关联商品', categories: [], value: '', alert: null, },
      img: { title: '活动图片', value: [], limit: 1, alert: null, width: '180px', disabled: false, url: 'https://up-z2.qiniup.com', cdnUrl: 'https://cdn.health.healthplatform.xyz', body: {} },
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
          { key: 'luckymoney_id', value: '查看详情', },
          { key: 'showEnd', value: '结束' },
          { key: 'luckymoney_id', value: '删除', type: 'danger' },
        ],
        classList: [
          { key: '活动日期', value: 'dateStr' },
          { key: '活动时间', value: 'timeStr' },
          { key: '单次活动奖励积分上限', value: 'max_amount' },
          { key: '已参与人数', value: 'member_count' },
          { key: '发放积分总量', value: 'issue' },
          { key: '状态', value: 'statusStr' },
          // { key: '图片', value: 'image', isImg:true },
        ],
      },
      list: [],
      total: 0,
      query: { page: 1, limit: 10, },
      detail: '',

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
      
      this.initActivityForm(status);
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
      let isEdit = this.dialogConfig.status == 2,
          inputArr = [ ['date', 'date'], ['time', 'time'], ['number', 'max_time'], ['limit', 'max_amount'], ['content', 'explain'] ];

      if(isEdit){
        // let res = await api.getRain(item.luckymoney_id);
        // console.error('----', res);
      }

      this.detail = typeof item == 'object' ? item : '';

      inputArr.forEach(v => {
        this[v[0]].value = item[v[1]] || '';
        this[v[0]].alert = null;
        this[v[0]].disabled = isEdit;
      });

      this.img.value = item.banner ? [ { url: item.banner} ] : [];
      this.img.alert = null;
      this.img.disabled = isEdit;

      // 未开始状态
      if(isEdit && item.status == 0){
        this.img.disabled = this.content.disabled = false; 
      }

      this.status.value = this.rainMap[item.status] || '';
      this.people.value = item.member_count || '';
      this.score.value = item.issue || '';
    },
    
    validate(){
      let validArr = ['date', 'time', 'number', 'limit', 'content'];
      
      for(let i = 0, len = validArr.length; i < len; i++){
        let key = validArr[i];

        if(this[key].alert) return true;

        if(!this[key].value){
          return this[key].alert = `${this[key].title}不能为空!`;
        }
      }

      if(!this.img.value.length) return this.img.alert = '请选择图片';
    },

    async submit(){
      // this.mock();

      let status = this.dialogConfig.status,
          imgList = this.img.value,
          param, timeArr;

      if(this.validate()) return ;
      
      this.stopSubmit = true;

      let img = imgList.map(v => { return v.raw ? `${this.img.cdnUrl}/${v.response.key}` : v.url });
      if(!img[0]) return console.error('img value :', img);

      timeArr = this.getActivityTime();

      param = {
        start_time: timeArr[0],
        end_time: timeArr[1],
        max_time: this.number.value,
        max_amount: this.limit.value,
        explain: this.content.value,
        banner: img[0],
      };

      this.save(param);
    },

    // 
    async save(param){
      let status = this.dialogConfig.status;
      let res = null;

      res = status == 1 ? await api.addRain(param) : await api.setRain(this.detail.luckymoney_id, param);

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

      let res = await api.getRainList(this.query, this);

      if(typeof res == 'string' || !res || res.error) return this.$message.error(res ? res.error || res : '获取红包雨活动列表失败');

      if(res && res.data){
        res.data.forEach(this.format);

        this.list = res.data || [];
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }
      
      this.tableConfig.loading = false
    },

    format(v){
      let startArr = v.start_time.split(' '),
          endArr = v.end_time.split(' ');

      v.dateStr = startArr[0];
      v.timeStr = `${startArr[1]}-${endArr[1]}`;
      v.date = new Date(v.start_time);
      v.time = [new Date(v.start_time), new Date(v.end_time)];

      // 未开始
      if(v.status == 1 && v.date.getTime() > new Date().getTime()) v.status = 0;

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
      let res = await api.changeRain(item.luckymoney_id); 

      res && res.data ? this.$message.success('修改成功') : this.$message.error(res ? res.error || res : '结束失败');

      this.getList();
    },

    async deleteItem(item){
      let res = await api.deleteRain(item.luckymoney_id, null);

      res.status == 0 ? this.$message.success('删除成功') : this.$message.error(res ? res.error || res : '删除失败');

      this.getList();
    },

    async getSwitch(){
      let res = await api.getRainSwitch();

      if(typeof res == 'string' || !res || res.error) this.$message.error(res ? res.error || res : '获取活动状态接口失败');

      this.headConfig.switchList[0].value = res && res.data == 1 ? true : false;
    },

    async changeRainSwitch(value){
      let res = await api.setRainSwitch({ value, });

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

    // 
    // async getGoodsList() {
    //   let res = await api.getGoodsList({ is_vip: 1, }, this);

    //   if(typeof res == 'string' || !res || res.error) return this.$message.error(res ? res.error || res : '获取VIP商品列表失败');

    //   if(res && res.data){
    //     res.data.forEach(this.goodsFormat);

    //     // this.goods.categories = res.data || [];
    //   }
    // },

    // goodsFormat(v){ },

    async getUploadToken(){
      let res = await commonReq.getUploadToken();

      if(typeof res == 'string' || !res || res.error) return this.$message.error(`getUploadToken: ${res ? res.error || res : '获取七牛token失败'}`);

      this.img.body.token = res.data;
      this.img.body.config = "{ useCdnDomain: true }";
    },

    mock(){
      this.img.value = [{ url: 'https://cdn.health.healthplatform.xyz/Fj8MCYMw8rWnjcX04s3ZFO49LfSn' }];
      this.number.value = 2;
      this.limit.value = 100;
      this.content.value = '<p>this is rules</p>';
    }
  },

  created(){
    this.getUploadToken();

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