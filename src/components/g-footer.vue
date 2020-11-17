<template>
  <div class="ft_wrap bg s_fc_10">

    <div class="ft">
      <p>Copyright &#169; 2020-{{year}} {{config.domain}}，All Rights Reserved </p> <!-- 使用本网站即表示接受 用户协议。 -->
      <p>版权所有 {{config.company}}</p>

      <p>
        <a target="_black" :href="url">{{config.province}}公网安备 {{config.record}}号</a>&nbsp;&nbsp;&nbsp;&nbsp;
        <span>{{config.province}}ICP备{{config.ICP}}</span>
      </p>
      <!-- <p>经营主体证照 风险监测信息 互联网药品信息服务资格证书：（{{config.province}}）-经营性-{{config.medicineLicense}}</p> -->
      <!-- <p>医疗器械网络交易服务第三方平台备案凭证：（粤）网械平台备字[2019]第00001号</p> -->
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

      URL: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=',
    };
  },

  computed: {
    url(){ return this.URL + this.config.record; }
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

a{
  color: inherit;
  text-decoration: none;
}
a:hover{
  text-decoration: underline;
}

.s_fc_10{ color: #505050; }
</style>
