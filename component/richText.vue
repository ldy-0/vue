<template>
  <div class="detail_wrap s_bg_f">
    <slot>
      <div class="detail_title s_fc_11">{{config.title}}</div>
    </slot>

    <div v-html="content"></div>
  </div>
</template>
<script>
export default {
  props: {
    config: {
      type: Object,
    },
  },

  data() {
    return {

    };
  },

  computed: {
    content(){
      if(!(this.config && this.config.text)) return '';

      return this.config.text.replace( /<img/g, "<img style='display: block; width: 100%;'");
    },
  },

  created() {

  },

};
</script>
<style scoped>
.detail_wrap {
  margin-bottom: 20px;
  word-break: break-all;
}
.detail_title {
  line-height: 88px;
  font-size: 28px;
  text-align: center;
}

.s_fc_11{ color: #636363; }
</style>