export default {
  data(){
    return {
      USE_COUPON: 1,
      NOT_USE_COUPON: 2,
      coupon: { 
        title: "能否使用优惠券", 
        list: [
          { id: 1, title: '是' }, 
          { id: 2, title: "否" }
        ], 
        value: 1, 
        alert: null, 
        disabled: false,
      },
    };
  },

  methods: {
    initCoupon(o) {
      let coupon = this.coupon;

      coupon.disabled = false;

      // add good
      if(!o) return coupon.value = this.isNewPeople ? this.NOT_USE_COUPON : this.USE_COUPON;

      if(o.is_vip) coupon.disabled = true;
      coupon.value = o.is_vip || o.use_coupon != this.USE_COUPON ? this.NOT_USE_COUPON : this.USE_COUPON;
    },

    updateCoupon(index) {
      let isVip = this.isVipGoods,
          coupon = this.coupon;

      coupon.disabled = isVip; 
      coupon.value = isVip ? this.NOT_USE_COUPON : this.USE_COUPON;
    },

    setCoupon(o) {
      let coupon = this.coupon;

      o.use_coupon = coupon.value === this.USE_COUPON ? 1 : 0;
    }
  },
}