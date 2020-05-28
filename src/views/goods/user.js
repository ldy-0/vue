import * as cookie from "@/utils/auth";

export default {
  data() {
    return {
      userInfo: null,
    };
  },

  methods: {
    initUser() {
      try{
        this.userInfo = JSON.parse(cookie.getUser());
      }catch(err){
        console.log(err);
      }
    },
  },
}