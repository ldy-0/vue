<style scoped>
.form_wrap{
  padding: 20px;
}

.submit_btn{
  margin-left: 180px;
}
</style>

<template>
  <div class="form_wrap">
    <el-form label-width='180px' style="width:50%">
      <!-- <el-form-item :label='obj.title' label-width='110px' v-if='obj.title'></el-form-item> -->

      <c-input :obj='distribution'></c-input>

      <el-button type='primary' class='submit_btn' @click='submit(distribution.id)'>确定</el-button>
    </el-form>

    <!-- 激活 -->
    <el-form label-width='180px' style="width:50%">
      <c-input :obj='active'></c-input>

      <el-button type='primary' class='submit_btn' @click='submit(active.id)'>确定</el-button>
    </el-form>

    <!-- 充值 -->
    <el-form label-width='180px' style="width:50%">
      <c-input :obj='refill'></c-input>

      <el-button type='primary' class='submit_btn' @click='submit(refill.id)'>确定</el-button>
    </el-form>

    <!-- 余额 -->
    <el-form label-width='180px' style="width:50%">
      <c-input :obj='balance'></c-input>

      <el-button type='primary' class='submit_btn' @click='submit(balance.id)'>确定</el-button>
    </el-form>

    <!-- 现金 -->
    <el-form label-width='180px' style="width:50%">
      <c-input :obj='cash'></c-input>

      <el-button type='primary' class='submit_btn' @click='submit(cash.id)'>确定</el-button>
    </el-form>

    <!-- 红包/签到 -->
    <el-form label-width='180px' style="width:50%">
      <c-input :obj='sign'></c-input>

      <el-button type='primary' class='submit_btn' @click='submit(sign.id)'>确定</el-button>
    </el-form>

  </div>
</template>
<script>
import * as api from '@/api/setting';
import cInput from '@/components/customInput';

export default {
  name: 'asset',

  components: {
    cInput,
  },

  props: {
    obj: {
      type: Object,
    }
  },

  data(){
    return {
      distribution: { id: 1, title: '分销上下级赠送数量', placeholder: '赠送数量填写', value: '', from: 'assets_setting_1', custom: { pattern: /^\d+(\.\d{1,2})?$/, alert: '值必须为正数!' }, alert: null, },
      active: { id: 2, title: '德分激活赠送比例', placeholder: '赠送比例填写', value: '', from: 'assets_setting_2', custom: { pattern: /^(0(\.\d{1,2})?|1(\.0+)?)$/, alert: '值必须在0-1之间!' }, alert: null, },
      refill: { id: 3, title: 'VIP产品现金赠送比例', placeholder: '赠送比例填写', value: '', from: 'assets_setting_3', custom: { pattern: /^(0(\.\d{1,2})?|1(\.0+)?)$/, alert: '值必须在0-1之间!' }, alert: null, },
      balance: { id: 4, title: '电商产品余额赠送比例', placeholder: '赠送比例填写', value: '', from: 'assets_setting_4', custom: { pattern: /^(0(\.\d{1,2})?|1(\.0+)?)$/, alert: '值必须在0-1之间!' }, alert: null, },
      cash: { id: 5, title: '电商产品现金赠送比例', placeholder: '赠送比例填写', value: '', from: 'assets_setting_5', custom: { pattern: /^(0(\.\d{1,2})?|1(\.0+)?)$/, alert: '值必须在0-1之间!' }, alert: null, },
      sign: { id: 6, title: '红包雨/签到赠送比例', placeholder: '赠送比例填写', value: '', from: 'assets_setting_6', custom: { pattern: /^(0(\.\d{1,2})?|1(\.0+)?)$/, alert: '值必须在0-1之间!' }, alert: null, },

      validateList: ['distribution', 'active', 'refill', 'balance', 'cash', 'sign'],
    };
  },

  created(){
    this.getAsset();
  },

  methods: {
    validateError(){
      let list = this.validateList;

      for(let i = 0, len = list.length; i < len; i++){
        let item = this[list[i]];

        if(item.alert) return true;

        if(!item.value) return this.$message.error(`${item.title}值必须在0-1之间!`);
      }
    },

    submit(index){
      let list = [this.distribution, this.active, this.refill, this.balance, this.cash, this.sign],
          param = {};

      if(this.validateError()) return ;

      param.source = index;
      param.value = list[index - 1].value;

      this.saveAsset(param);
    },

    async saveAsset(param) {
      let res = await api.setAssetSetting(param);

      if(!res || typeof res === 'string' || res.error) return this.$message.error(res ? res.error || res : '设置资产失败!');

      this.$message.success('设置成功!');
      this.getAsset();
    },

    async getAsset(){
      let res = await api.getAssetSetting();

      if(!res || typeof res === 'string' || res.error) return this.$message.error(res ? res.error || res : '获取资产设置失败!');

      if(res.data) this.formatAsset(res.data);
    },

    formatAsset(data) {
      let list = [this.distribution, this.active, this.refill, this.balance, this.cash, this.sign];
      
      list.forEach(v => v.value = data[v.from]);
    },

    mock(){
      this.distribution.value = this.active.value = this.balance.value = this.refill.value = this.cash.value = this.sign.value = 0.1;
    }

  }
}
</script>