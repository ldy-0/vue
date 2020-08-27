<style lang="css">
.welcom{
  padding: 20px 0 0 100px;
}
</style>

<template>
  <div class="dashboard-container" id="home">

    <h2 class="welcom">欢迎进入后台管理!</h2>

    <!-- <component :is="currentRole" class="dashboard-hbs" :class="down"></component> -->

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import admin from './admin'
import seller from './seller'
import { getRoles } from '@/utils/auth'
import uploadFn from '@/utils/tencent_cos'

export default {
  name: 'home',

  components: {
    admin, 
    seller 
  },

  data() {
    return {
      currentRole: 'admin',
      down:''
    }
  },

  computed: {
    ...mapGetters([
      'roles'
    ])
  },

  methods:{
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },

    async upload(){
      let files = Array.prototype.slice.call(this.$refs['i1'].files) 
      let allUrl = await uploadFn(files)
      console.log(allUrl)
    }
  },
  

  mounted(){
    setTimeout(()=>{
      this.down = "hbs-down"
    },800)
  },
  beforeDestroy(){
  },
  created() {
    let roles = []
    try{
      roles = JSON.parse(getRoles())
    }catch(e){
      console.log(e)
      roles = []
    }
    if(roles.indexOf('admin')>-1||roles.indexOf('admin2')>-1){
      this.currentRole = 'admin'
    }else{
      this.currentRole = 'seller'
    }
  },
  
}
</script>
