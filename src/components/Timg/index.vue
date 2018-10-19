<template>
  <div>
      <el-upload action=''
        list-type="picture-card"
        :auto-upload="false"
        :limit='3'
        :file-list='detail[item.value]' 
        :on-remove='removeImg'
        :on-change="changeImgs">
        <i class="el-icon-plus"></i>
      </el-upload>
  </div>
</template>

<script>
export default {
  name: 'BackToTop',
  props: {
    test: {
      type: String,
      default: 'fade'
    }
  },
  data() {
    return {
    }
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },

  methods: {

  }
}
</script>

<style scoped>

</style>
