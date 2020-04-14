<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default{
    name: 'App',

    created(){
      window.unload = function(){
        localStorage.setItem('healthReferrer', location.pathname);
      }
    }
  }
</script>
