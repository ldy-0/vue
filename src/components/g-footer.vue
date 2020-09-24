<template>
  <div class="ft_wrap bg s_fc_10">

    <div class="ft">
      <p>Copyright &#169; 2020-{{year}} {{config.domain}}，All Rights Reserved 使用本网站即表示接受 唯品会用户协议。</p>
      <p>版权所有 {{config.company}}</p>

      <p>粤公网安备 44010302111111号 粤ICP备08114786号</p>
      <p>经营主体证照 风险监测信息 互联网药品信息服务资格证书：（粤）-经营性-2018-0271</p>
      <p>医疗器械网络交易服务第三方平台备案凭证：（粤）网械平台备字[2019]第00001号</p>
    </div>

  </div>
</template>

<script>

export default {
  props: {
    config: {
      type: Object, 
      default(){
        return {};
      },
    },
  },

  data() {
    return {
      year: '',
    };
  },
  
  methods: {
    
  },

  created() {
    let t = new Date();

    this.year = t.getFullYear();
  },
}
</script>

<style scoped>
.ft_wrap{
  padding: 4.2em 0;
  font-size: 14px;
  line-height: 1.4;
  background-image: url('../assets/g/footerBg.png');
  text-align: center;
}

.s_fc_10{ color: #505050; }
</style>
