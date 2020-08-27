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

    <!-- 积分 -->
    <el-form label-width='180px' style="width:50%">
      <c-input :obj='integral'></c-input>

      <el-button type='primary' class='submit_btn' @click='submit(integral.id)'>确定</el-button>
    </el-form>

    <!-- 合作共赢 -->
    <el-form label-width='180px' style="width:50%; margin: 20px 0 0;">
      <custom-img :obj="vipBg"></custom-img>

      <el-button type='primary' class='submit_btn' @click='submit(vipBg.id)'>确定</el-button>
    </el-form>

    <!-- 资产说明  -->
    <el-form label-width='180px' style="width:50%; margin: 20px 0 0;">
      <el-form-item :label="content.title">
        <editor style='width: 800px;' v-model='content.value'></editor>
      </el-form-item>

      <el-button type='primary' class='submit_btn' @click='submit(content.id)'>确定</el-button>
    </el-form>

  </div>
</template>
<script>
import * as api from '@/api/setting';
import commonReq from "@/api/common";
import cInput from '@/components/customInput';
import customImg from '@/components/customImg';
import editor from "@/components/Tinymce";

export default {
  name: 'asset',

  components: {
    cInput,
    customImg,
    editor,
  },

  props: {
    obj: {
      type: Object,
    }
  },

  data(){
    return {
      distribution: { id: 1, title: '分销上下级赠送数量', placeholder: '赠送数量填写', value: '', from: 'assets_setting_1', custom: { pattern: /^\d+(\.\d{1,4})?$/, alert: '值必须为正数!' }, alert: null, },
      active: { id: 2, title: '德分激活赠送比例', placeholder: '赠送比例填写', value: '', from: 'assets_setting_2', custom: { pattern: /^(0(\.\d{1,4})?|1(\.0+)?)$/, alert: '值必须在0-1之间!' }, alert: null, },
      refill: { id: 3, title: 'VIP产品现金赠送比例', placeholder: '赠送比例填写', value: '', from: 'assets_setting_3', custom: { pattern: /^(0(\.\d{1,4})?|1(\.0+)?)$/, alert: '值必须在0-1之间!' }, alert: null, },
      balance: { id: 4, title: '电商产品余额赠送比例', placeholder: '赠送比例填写', value: '', from: 'assets_setting_4', custom: { pattern: /^(0(\.\d{1,4})?|1(\.0+)?)$/, alert: '值必须在0-1之间!' }, alert: null, },
      cash: { id: 5, title: '电商产品现金赠送比例', placeholder: '赠送比例填写', value: '', from: 'assets_setting_5', custom: { pattern: /^(0(\.\d{1,4})?|1(\.0+)?)$/, alert: '值必须在0-1之间!' }, alert: null, },
      sign: { id: 6, title: '红包雨/签到赠送比例', placeholder: '赠送比例填写', value: '', from: 'assets_setting_6', custom: { pattern: /^(0(\.\d{1,4})?|1(\.0+)?)$/, alert: '值必须在0-1之间!' }, alert: null, },
      integral: { id: 7, title: '积分消费比例', placeholder: '赠送比例填写', value: '', from: 'assets_setting_7', custom: { pattern: /^(0(\.\d{1,4})?|1(\.0+)?)$/, alert: '值必须在0-1之间!' }, alert: null, },

      vipBg: { id: 8, title: "合作共赢", value: [], from: 'assets_setting_8', limit: 1, alert: null, url: '', cdnUrl: '', body: {}, width: '180px', },
      content: { id: 9, title: "资产说明", value: "", from: 'assets_setting_9', alert: null },

      validateList: ['distribution', 'active', 'refill', 'balance', 'cash', 'sign'],
    };
  },

  created(){
    this.getUploadToken();
    this.getAsset();
  },

  methods: {
    validateError(index){
      let list = this.validateList,
          vipBg = this.vipBg.value;

      for(let i = 0, len = list.length; i < len; i++){
        let item = this[list[i]];

        if(item.alert) return true;

        if(!item.value) return this.$message.error(`${item.title}值必须在0-1之间!`);
      }

      if(index === this.vipBg.id && (!vipBg || !vipBg.length)) return this.$message.error(`请选择图片!`), true;
    },

    submit(index){
      let vipBg = this.vipBg,
          list = [this.distribution, this.active, this.refill, this.balance, this.cash, this.sign, this.integral, 'vipBg', this.content],
          param = {};

      if(this.validateError(index)) return ;

      param.source = index;
      param.value = index === vipBg.id ? this.fromImg(list[index - 1]) : list[index - 1].value;

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
      let vipBg = this.vipBg,
          list = [this.distribution, this.active, this.refill, this.balance, this.cash, this.sign, this.integral, this.content];
      
      list.forEach(v => v.value = data[v.from]);

      vipBg.value = [{ url: data[vipBg.from] }];
    },

    fromImg(k){
      let o = this[k],
          values = o.value;

      console.log(values);
      let arr = values.map(v => v.raw ? { url: `${o.cdnUrl}/${v.response.key}` } : v);

      return o.limit == 1 ? arr[0] ? arr[0].url : '' : arr.map(v => JSON.stringify(v));
    },

    async getUploadToken() {
      let vipBg = this.vipBg,
          res = await commonReq.getUploadToken();

      if (!res || res.error || typeof res === 'string') return this.$message.error(`getUploadToken: ${res.error}`);

      vipBg.url = commonReq.uploadUrl;
      vipBg.cdnUrl = commonReq.cdnUrl;
      vipBg.body = { token: res.data, config: { useCdnDomain: true, }, };
    },

    mock(){
      this.distribution.value = this.active.value = this.balance.value = this.refill.value = this.cash.value = this.sign.value = 0.1;
    }

  }
}
</script>