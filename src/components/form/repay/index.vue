<style scoped>

</style>

<template>
  <div>
    <custom-form :config="formConfig" @close="close" @submit="submit">

      <custom-table ref="mainTable" :config='tableConfig' :data='list' :total='total' @modify='handleTableEvent' :showPagination="false"></custom-table>

    </custom-form>

    <el-dialog :title="dialogConfig.title" :visible.sync="showDialog" :before-close='closeDialog' width="80%">

      <!-- 修改时间 -->
      <div v-if='dialogConfig.status === 1'>
        <el-form label-width='100px'>
          <custom-date :obj="repayTime"></custom-date>

          <el-form-item>到期时间{{detail.repay_time}}超时时长{{detail.over_time}}</el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" :disabled="clicked" :loading="clicked" @click="changeRepayTime">确 定</el-button>
        </div>
      </div>

    </el-dialog>
  </div>
</template>
<script>
import customForm from '@/components/form/form'
import customTable from '@/components/customTable'
import customDate from '@/components/customDate'
import api from '@/api/member';
import format from '@/utils/format';

export default {
  name: 'member',

  components: {
    customForm,
    customTable,
    customDate,
  },

  props: {
    obj: {
      type: Object,
      default: {
        title: '',
      }
    }
  },

  data(){
    return {
      formConfig: {
        show: true,
        list: [
          { type: 'img', title: '头像', value: '', from: 'member_avatar', style: 'width: 100px; height: 100px;' },
          { title: '昵称', value: '', from: 'member_truename', alert: null, },
          { title: '等级', value: '', from: 'vip_level', alert: null, },
          { title: '可用互转德分', value: '', from: 'recharge_rc_balance', alert: null, },
          { title: '可用消费德分', value: '', from: 'available_rc_balance', alert: null, },
          { type: 'input', title: '上级推荐码', value: '', from: 'inviter_mobile', to: 'inviter', pattern: /^1\d{10}$/, alert: null, },
          { title: '上级名称', value: '', from: 'inviter_nick', alert: null, },

          { type: 'input', title: '姓名', value: '', from: 'member_nick', to: 'member_nick', pattern: /^.+$/, errorStr: '不能为空!', alert: null, },
          { type: 'input', title: '联系方式', value: '', from: 'member_mobile', to: 'member_mobile', pattern: /^1\d{10}$/, alert: null, },
        ],
        submit: '确定',
      },

      clicked: false,

      tableConfig: {
        loading: false,
        showOperate: true,
        btnList: [
           { key: 'order_id', value: '取消', },
           { key: 'order_id', value: '延期', },
        ],
        classList: [
          { key: '图片', value: 'goods_image', isImg: true, },
          { key: '姓名', value: 'goods_name' },
          { key: '订单编号', value: 'order_sn' },
          { key: '订单金额', value: 'order_amount' },
          { key: '分期总额', value: 'order_amount' },
          { key: '逾期总额', value: 'repay_amount' },
          { key: '到期时间', value: 'repay_time' },
          { key: '超时时间', value: 'overTimeStr' },
        ],
      },
      list: [],
      total: 0,
      detail: null,

      dialogConfig: {
        title: '',
        status: -1, // 1: 修改延期时间
      },

      repayTime: { type: 'date', title: '设置延期', value: '', alert: null, },
    };
  },

  computed: {
    showDialog(){ return [1].indexOf(this.dialogConfig.status) !== -1; },
  },

  methods: {
    initForm(o) {
      let config = this.formConfig;

      config.list.forEach(v => v.value = o.member_info[v.from]);
      

      if(o.repay_order){
        o.repay_order.forEach(this.formatOrder);
        this.list = o.repay_order;
      }
      
    },

    formatOrder(v) {
      let goods = v.order_goods[0];

      v.goods_image = goods.goods_image;
      v.goods_name = goods.goods_name;

      // 超时时间
      v.overTimeStr = `${Math.floor(v.over_time / 86400)}天${Math.floor(v.over_time % 86400 / 3600)}时`;
    },

    close() {
      this.$emit('close');
    },

    handleTableEvent(item, index) {
      if(index == 0) this.cancelRepay(item.order_id);
      
      if(index == 1) this.openTimeDialog(item);
    },
    
    closeDialog() {
      this.dialogConfig.status = -1;
    },

    openTimeDialog(item) {
      this.dialogConfig.status = 1;
      this.detail = item;
      this.repayTime.value = new Date(item.repay_time);
    },

    async cancelRepay(param) {
      let res = await api.cancelRepay(param);

      if(!res || typeof res === 'string' || res.error) return this.$message.error(res ? res.error || res : '取消失败!')

      this.$message.success('取消成功!');
      this.clicked = false;
      this.$emit('submit', param);
    },

    async changeRepayTime() {
      let param = {},
          repayTime = this.repayTime;

      if(!repayTime.value) return this.$message.error(`请设置延期时间!`);
      let loading = this.$loading();
      
      repayTime.value.setDate(repayTime.value.getDate() - 1);
      param.repay_time = repayTime.value;

      let res = await api.changeRepayTime(this.detail.order_id, param);
      if(!res || typeof res === 'string' || res.error) return this.$message.error(res ? res.error || res : '设置失败!'), loading.close();

      // update
      res = await api.getRepayMember(this.obj.member_info.member_id);
      if(!res || typeof res === 'string' || res.error) return this.$message.error(res ? res.error || res : '获取详情信息失败!');

      if(res.data && res.data.repay_order){
        res.data.repay_order.forEach(this.formatOrder);
        this.list = res.data.repay_order;
      }

      this.$message.success('设置成功!');

      this.clicked = false;
      loading.close();
      this.closeDialog();
    },

    submit() {
      let form = this.formConfig,
          obj = this.obj.member_info,
          list = form.list.filter(v => v.to),
          param = { type: 'memberinfo', };

      list.forEach(v => param[v.to] = v.value);
      param.member_id = obj.member_id;

      if(this.validate(list)) return ;
      this.clicked = true;

      this.save(param);
    },

    validate(list) {
      return list.some(v => !v.pattern || v.pattern.test(v.value) ? false : (this.$message.error(`${v.title}${v.errorStr || '不正确!'}`), true));
    },

    async save(param) {
      // return console.log(param);

      let res = await api.UpDownMember_api(param);

      if(!res || typeof res === 'string' || res.error) return this.$message.error(res ? res.error || res : '修改会员信息接口报错!')

      this.$message.success('修改成功!');
      this.clicked = false;
      this.$emit('submit', param);
    }
  },

  mounted() {
    let config = this.formConfig;

    this.initForm(this.obj);
  }
}
</script>