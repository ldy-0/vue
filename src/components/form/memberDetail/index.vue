<style scoped>

</style>

<template>
  <div>
    <custom-form :config="formConfig" @close="close" @submit="submit"></custom-form>
  </div>
</template>
<script>
import customForm from '@/components/form/form'
import api from '@/api/member';

export default {
  name: 'member',

  components: {
    customForm,
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
          { title: '微信号码', value: '', from: 'member_ww', alert: null, },
          { title: 'QQ号码', value: '', from: 'member_qq', alert: null, },
          { title: '公司', value: '', from: 'company', alert: null, },
          { title: '职位', value: '', from: 'job', alert: null, },
          { title: '邮箱', value: '', from: 'email', alert: null, },
          { title: '地址', value: '', from: 'address', alert: null, },
          { type: 'video', title: '视频', value: '', from: 'video', alert: null, },
          { title: '图片', value: [], from: 'imgs', alert: null, },
          { title: '内容', value: '', from: 'content', alert: null, },
        ],
        submit: '确定',
      },

      clicked: false,
    };
  },

  computed: {
  },

  methods: {
    initForm(o) {
      let config = this.formConfig;

      config.list.forEach(v => v.value = o[v.from]); 
    },

    close() {
      this.$emit('close');
    },

    submit() {
      let form = this.formConfig,
          obj = this.obj,
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