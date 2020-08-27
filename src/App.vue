<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { getToken, setToken, removeToken, setUser, setRoles, getRoles } from "@/utils/auth";

export default{
  name: 'App',

  data() {
    return {
    };
  },

  methods: {
    initRouter() {
      try{
        var roles = getRoles();
      }catch(e){
        console.log(e);
      }

      this.$store.dispatch('GenerateRoutes', { roles }).then(() => {
        this.$router.addRoutes(this.$store.state.permission.addRouters);

        this.$store.dispatch('addRoute').then(() => {
          this.$router.push({ name: this.$route.name, });
        });
      }); 
    },
  },

  created(){
    this.initRouter();

    window.unload = function(){
    }
  },
}
</script>
