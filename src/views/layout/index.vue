<template>
  <div>
    <transition name="fade-transform" mode="out-in">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <tabbar ref="tabbar"></tabbar>
  </div>
</template>

<script>
import tabbar from '@/components/tabbar.vue';
export default {
  data() {
    return {

    }
  },

  watch: {
    $route(n, o){
      this.$refs.tabbar.updateIndex();
    },
  },

  created() {

  },
  components: {
    tabbar: tabbar
  },
  methods: {

  },

}
</script>
