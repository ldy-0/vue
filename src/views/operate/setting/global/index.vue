<style lang="css" scoped>
.header{
}

.input_wrap{
  display: inline-block;
  width: 25%;
}
</style>

<template>
<div class="notice">

<div class="header">
  <el-form label-width='100px'>
    <div class="input_wrap">
      <custom-input :obj='integral'></custom-input>
    </div>
    <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit(integral)">确 定</el-button>

    <div class="input_wrap">
      <custom-input :obj='tax'></custom-input>
    </div>

    <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit(tax)">确 定</el-button>
  </el-form>
</div>

<custom-table ref='table' :config='tableConfig' :data='list' :total='total' @modify='dispatch' @change='change'></custom-table>

<el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">
  <div v-if="[VIP].indexOf(dialogConfig.status) !== -1">
    <el-form label-width='100px'>
      <custom-input :obj='vip0'></custom-input>
      <el-form-item label-width='100px'>
        <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit(vip0)">确 定</el-button>
      </el-form-item>

      <custom-input :obj='vip1'></custom-input>
      <el-form-item label-width='100px'>
        <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit(vip1)">确 定</el-button>
      </el-form-item>

      <custom-input :obj='vip2'></custom-input>
      <el-form-item label-width='100px'>
        <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit(vip2)">确 定</el-button>
      </el-form-item>

      <custom-input :obj='vip3'></custom-input>
      <el-form-item label-width='100px'>
        <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit(vip3)">确 定</el-button>
      </el-form-item>

      <custom-input :obj='vip4'></custom-input>
      <el-form-item label-width='100px'>
        <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit(vip4)">确 定</el-button>
      </el-form-item>

      <custom-input :obj='vip5'></custom-input>
      <el-form-item label-width='100px'>
        <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit(vip5)">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>

  <div v-if="[OWNER].indexOf(dialogConfig.status) !== -1">
    <el-form label-width='100px'>
      <custom-input :obj='owner0'></custom-input>
      <el-form-item label-width='100px'>
        <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit(owner0)">确 定</el-button>
      </el-form-item>

      <custom-input :obj='owner1'></custom-input>
      <el-form-item label-width='100px'>
        <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit(owner1)">确 定</el-button>
      </el-form-item>

      <custom-input :obj='owner2'></custom-input>
      <el-form-item label-width='100px'>
        <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit(owner2)">确 定</el-button>
      </el-form-item>

      <custom-input :obj='owner3'></custom-input>
      <el-form-item label-width='100px'>
        <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit(owner3)">确 定</el-button>
      </el-form-item>

      <custom-input :obj='owner4'></custom-input>
      <el-form-item label-width='100px'>
        <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit(owner4)">确 定</el-button>
      </el-form-item>

      <custom-input :obj='owner5'></custom-input>
      <el-form-item label-width='100px'>
        <el-button type="primary" :disabled="stopSubmit" :loading="stopSubmit" @click="submit(owner5)">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>

</el-dialog>

</div>
</template>
<script>

import api from '@/api/activity' 
import apiSetting from '@/api/setting' 
import customTable from '@/components/customTable';
import customHead from '@/components/customHead';
import customSelect from '@/components/select'
import customInput from '@/components/customInput'
// import uploadFn from "@/utils/tencent_cos";

export default {
  components: {
    customHead,
    customTable,
    customSelect,
    customInput,
  },

  computed: {
    showDialog(){ return Boolean(this.dialogConfig.status); },
  },

  data() {
    return {
      VIP: 1,
      OWNER: 2,
      dialogConfig: {
        title: '',
        status: 0, // 1:返利  2: 对接 
      },

      stopSubmit: false,

      headConfig: {
        title: '添加活动',
      },

      tableConfig: {
        showOperate: true,
        btnList: [
          { key: 'title', value: '编辑', },
        ],
        classList: [
          { key: 'VIP分润比例', value: 'title' },
          { key: '代理', value: 'vip0' },
          { key: 'VIP1', value: 'vip1' },
          { key: 'VIP2', value: 'vip2' },
          { key: 'VIP3', value: 'vip3' },
          { key: 'VIP4', value: 'vip4' },
          { key: 'VIP5', value: 'vip5' },
        ],
      },
      list: [],
      total: 0,
      query: { page: 1, limit: 10, },
      detail: null,

      integral: { title: '积分比例', index: 14, value: '', rule: { test: /(^0(\.\d{1,2})?$)|(^1(\.0{1,2})?$)/, }, to: 'rebate_setting_14', preventValidate: true, },
      tax: { title: '扣除税费合计百分比设置', index: 1, value: '', rule: { test: /(^0(\.\d{1,2})?$)|(^1(\.0{1,2})?$)/, }, width: '180px', to: 'rebate_setting_1', preventValidate: true, },
      vip0: { title: '体验代理', index: 2, value: '', rule: { test: /(^0(\.\d{1,2})?$)|(^1(\.0{1,2})?$)/, }, to: 'rebate_setting_2', },
      vip1: { title: 'vip1', index: 3, value: '', rule: { test: /(^0(\.\d{1,2})?$)|(^1(\.0{1,2})?$)/, }, to: 'rebate_setting_3', },
      vip2: { title: 'vip2', index: 4, value: '', rule: { test: /(^0(\.\d{1,2})?$)|(^1(\.0{1,2})?$)/, }, to: 'rebate_setting_4', },
      vip3: { title: 'vip3', index: 5, value: '', rule: { test: /(^0(\.\d{1,2})?$)|(^1(\.0{1,2})?$)/, }, to: 'rebate_setting_5', },
      vip4: { title: 'vip4', index: 6, value: '', rule: { test: /(^0(\.\d{1,2})?$)|(^1(\.0{1,2})?$)/, }, to: 'rebate_setting_6', },
      vip5: { title: 'vip5', index: 7, value: '', rule: { test: /(^0(\.\d{1,2})?$)|(^1(\.0{1,2})?$)/, }, to: 'rebate_setting_7', },
      owner0: { title: '体验代理', index: 8, value: '', rule: { test: /(^0(\.\d{1,2})?$)|(^1(\.0{1,2})?$)/, }, to: 'rebate_setting_8', },
      owner1: { title: 'vip1', index: 9, value: '', rule: { test: /(^0(\.\d{1,2})?$)|(^1(\.0{1,2})?$)/, }, to: 'rebate_setting_9', },
      owner2: { title: 'vip2', index: 10, value: '', rule: { test: /(^0(\.\d{1,2})?$)|(^1(\.0{1,2})?$)/, }, to: 'rebate_setting_10', },
      owner3: { title: 'vip3', index: 11, value: '', rule: { test: /(^0(\.\d{1,2})?$)|(^1(\.0{1,2})?$)/, }, to: 'rebate_setting_11', },
      owner4: { title: 'vip4', index: 12, value: '', rule: { test: /(^0(\.\d{1,2})?$)|(^1(\.0{1,2})?$)/, }, to: 'rebate_setting_12', },
      owner5: { title: 'vip5', index: 13, value: '', rule: { test: /(^0(\.\d{1,2})?$)|(^1(\.0{1,2})?$)/, }, to: 'rebate_setting_13', },

    }
  },


  methods: {
    openDialog(status, item){
      this.dialogConfig.status = status;
      
      this.detail = typeof item == 'object' ? status : null;
    },
    
    closeDialog(){
      let config = this.dialogConfig;

      config.status = 0;
    },

    dispatch(item, index){
      // 编辑
      if(index == 0) this.openDialog(item.type, item);

    },

    isIllegal(arr) {
      let item;

      for(let i = 0, len = arr.length; i < len; i++){
        item = arr[i];

        if(item.rule && !item.rule.test.test(item.value)) return this.$message.error(item.rule.message || `${item.title}填写不正确!`), true;
      }
    },

    submit(item){
      let arr = [item];
      if(this.isIllegal(arr)) return ;
      this.stopSubmit = true;

      let param = { 
        source: item.index,
        value: item.value,
      };

      this.save(param);
    },

    async save(param){
      let status = this.dialogConfig.status;
      let res = null;

      res = await apiSetting.setRebateSetting(param);

      if(typeof res == 'string' || !res || res.error){
        this.stopSubmit = false;
        return this.$message.error(`${res ? res.error || res : '保存活动信息失败'}`);
      }

      if(res.status ==0) this.$message.success('操作成功');

      this.dialogConfig.status = 0;
      this.getRebate();

      this.stopSubmit = false;
    },

    change(param){
      this.query.limit = param.limit;
      this.query.page = param.page;

      this.getList();
    },

    format(o) {
      this.tax.value = o.rebate_setting_1;
      this.integral.value = o.rebate_setting_14;

      let list= [
        { title: '全局设置VIP分润比例', type: this.VIP, },
        { title: '全局设置对接比例', type: this.OWNER, },
      ];

      [2, 3, 4, 5, 6, 7].forEach(i => this[`vip${i - 2}`].value = list[0][`vip${i - 2}`] = o[`rebate_setting_${i}`] || 0);
      [8, 9, 10, 11, 12, 13].forEach(i => this[`owner${i - 8}`].value = list[1][`vip${i - 8}`] = o[`rebate_setting_${i}` || 0]);

      this.list = list;
    },

    async getRebate(){
      let res = await apiSetting.getRebateSetting();
      if(typeof res == 'string' || !res || res.error) this.$message.error(res ? res.error || res : '获取返利接口失败');

      if(res && res.data){
        this.format(res.data);
      }
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
    this.getRebate();
  },

}
</script>