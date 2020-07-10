<template>
  <div class="page_wrap login_page_wrap s_bg_f">
    <van-nav-bar left-arrow @click-left="goBack"></van-nav-bar>

    <!-- agreement -->
    <div class="agreement_wrap s_bg_f">
      <div class="agreement_title_wrap s_fc_12">健德用户协议</div>

      <div class="agreement_ctn s_fc_9" v-for="(item, index) in aContent" :key="index">
        <div class="title">{{item.title}}</div>
        <div class="content" v-for="(v, i) in item.content" :key="i">{{v}}</div>
      </div>

    </div>

    <div>
      <van-button color="#F88400" class="return_btn" size="small" type="primary" @click="goBack">返 回</van-button>
    </div>

  </div>
</template>
<script>
import { Field, } from 'vant';
import * as apiUser from '@/api/user';

export default {
  components: {
    [Field.name]: Field,
  },

  data() {
    return {
      LOGIN: 'login',
      REGISTER: 'register',
      type: 'login',
      
      aContent: [
        { 
          title: '会员服务条款', 
          content: [
              '在您注册成为健德生态VIP商城会员之前，请认真阅读本《健德生态会员服务条款》（以下简称“服务条款”）并选择接受或不接受本服务条款，您的购买、登录、使用等行为将视为对本服务条款的接受，并同意接受本服务条款各项条款的约束。 接受此条款并点击注册，注册成为VIP商业会员后，即可享受VIP商城会员服务。'], 
        },
        {
          title: '会员权利和义务',
          content: [
            '1.健德生态VIP商城会员：是通过健德生态小程序申请会员的客户。',
            '2.会员服务：成为健德生态VIP商城以后，在商城购物时可以享受会员优惠和健德生态商城包邮服务，以及健德生态商城其他的优惠活动（如商城拼团，优惠券，促销等单独活动说明）。',
            '3.会员身份识别：健德生态商城以会员的微信ID作为唯一会员识别标识，一个微信ID只能注册一个会员账号，请会员在支付前确认自己的微信ID并输入微信支付密码。使用德分显示商品价格的，只能使用德分支付，德分支付请提前设置好德分支付密码，妥善保管并牢记密码。',
            '4.健德生态商城会员账号有效期：自注册之日起，终生有效。',
            '5.健德生态商城会员账号不计息，不得转让或租借赠予他人，由此产生一切损失自行承担。',
            '6.会员在购买商品时，务必提供真实准确的个人信息：收货地址，收货电话，收货人等详细信息，如因会员自己填写的信息有误，造成的损失，健德生态商城一律不承担。',
            '7.常规商品（除VIP商城德分商品外）退换货：自商品售出之日（以会员实际收货日期为准）起7日内可以退换货，15日内可以换货。15日后系统自动默认收货的不能退换货。会员在收到货后，请务必仔细检查包装，以及产品是否完好，如有包装破损，可以选择拒收，如产品有质量问题，请第一时间联系健德生态商城客服：400-000-1941。（详见健德生态商城售后服务）',
          ],
        },
        {
          title: '用户隐私制度',
          content: [
            '当您在健德生态商城购物时，我们可能需要您提供您个人的微信ID，收货地址，电话号码或其它联络信息，以便我们及时处理您的订单，这些信息仅作为健德生态商城销售和会员购物使用，健德生态商城不会因市场行销目的向健德生态以外的其它公司泄露任何顾客个人信息，但在某些情况下，比如在送货服务中，健德生态商城需要与专业运输公司合作，他们将根据顾客提供的姓名和地址运送健德生态商城的商品。此种情况下，健德生态商城将严格监督合作公司，确保顾客个人信息和隐私不被侵犯。',
          ]
        },
        {
          title: '用户的帐号、密码和安全性',
          content: [
            '用户一旦注册健德生态商城会员，系统将自动识别您的微信ID，为会员的唯一识别标识，如果因用户未保管好自己的微信ID帐号和密码，造成的损失，用户将负全部责任。',
          ]
        }
      ],
    };
  },

  computed: {
  },

  methods: {
    goBack(){ return this.$router.back(); },

  },

  created() {
  },
};
</script>
<style lang='less' scoped>
.page_wrap{
  height: 100vh;
}

.agreement_wrap{
  padding: 0 0 120px 0;
}
.agreement_title_wrap{
  padding: 45px 0;
  font: normal normal 36px / normal Source Han Sans CN;
  text-align: center;
}
.agreement_ctn{
  padding: 0 40px;
  font-size: 24px;
  letter-spacing: 1px;
}
.title{
  padding: 20px 0 0;
  font-weight: bold;
}
.content{
  text-indent: 2em;
}

.return_btn{
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 100px;
  line-height: 100px;
}

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #313131; }

.s_bg_11{ background: #FC6B76; }
</style>
<style>
.login_page_wrap .van-tab--active .van-tab__text {
  font-size: 28px;
  font-weight: bold;
}
</style>