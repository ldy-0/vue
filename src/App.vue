<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
    <!-- <router-view v-if="!$route.meta.keepAlive" /> -->
  </div>
</template>

<script>
import * as gd from '@/utils/global';

export default {
  name: 'App',

  created() {
    // localStorage.setItem('token', process.env.VUE_APP_TOKEN);
    let time = localStorage.getItem('time'),
        user = gd.getUser();

    console.log(Date.now() - time);
    if(time && Date.now() - time >= 1 * 10 * 60000 || user && !user.member_mobile){
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    addEventListener('beforeunload', () => {
      localStorage.setItem('time', Date.now());
    });
  }
}
</script>
