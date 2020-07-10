<template>
  <div class="empty_box">
    <img class="empty" src="../assets/images/empty.png" alt="">
    {{notice}}
  </div>
</template>
<script>
export default {
  props: {
    notice: {
      type: String,
      default: '没有更多数据了~'
    }
  },
  data() {
    return {};
  },
  created() { },
  methods: {}
};
</script>
<style lang='less' scoped>
.empty_box {
  width: 100%;
  height:400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 28px;
  line-height: 100px;
}
.empty {
  width: 157px;
  height: 105px;
}
</style>