<template>
  <div class="page_wrap s_bg_f4">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <div class="form_wrap s_bg_f" v-for="(item, index) in detail.order_goods" :key="index">
      <!-- goods -->
      <div class="goods_wrap flex s_fc_8">
        <img class="i_goods" :src="item.goods_image" />

        <div class="goods_info_wrap">
          <div class="goods_name s_fc_3">{{item.goods_name}}</div>

          <!-- <div class="goods_sku_wrap between s_fc_8">
            <div class="goods_standard">规格：{{item.goods_spec || "统一规格"}}</div>
            <div class="goods_number">×{{item.goods_num}}</div>
          </div> -->

          <div class="goods_price_wrap s_fc_15">
            <span>¥</span>
            <span class="goods_price_integer">{{item.goods_price}}</span>
          </div>
        </div>
      </div>

      <!-- rate -->
      <div class="rate_wrap flex s_fc_2">
        <div class="rate_title">评分</div>

        <van-rate class="rate" v-model="rate.value" color="#4FB84A" size="18" />
      </div>

      <!-- comment -->
      <div class="comment_wrap">
        <van-field v-model="message.value" rows="7" autosize label="" label-width="0" type="textarea" maxlength="140" :placeholder="message.placeholder" show-word-limit />
      </div>

      <!-- img -->
      <div class="img_wrap">
        <van-uploader v-model="imgList.value" multiple>
          <div class="upload_wrap s_fc_17">
            <img class="i_upload" src="../../../assets/images/global/upload.png" />
            <div class="">添加图片</div>
          </div>
        </van-uploader>
      </div>

    </div>

    <div class="submit_btn s_fc_f s_bg_13" @click="submit">提交</div>

  </div>
</template>
<script>
import moment from 'moment';
import * as math from 'mathjs';
import * as api from '@/api/common';
import * as apiOrder from '@/api/order';
import * as gd from '@/utils/global';
import address from '@/components/my/address';

export default {
  components: {
    [address.name]: address,
  },

  data() {
    return {
      rate: { value: 0, to: 'score', placeholder: '评分不能为空!', },
      message: { value: '', to: 'content', placeholder: '请输入评论...', },
      imgList: { value: [], to: '', message: '', },

      type: null,
      id: null,
      detail: {},

      imgToken: null,
      imgConfig: '{ useCdnDomain: true }',
    };
  },

  computed: {
    title() { return '商品评价'; },

    isBack() { return this.$route.meta.isBack; },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      this.type = query.type;
      this.id = query.id;

      this.doing = false;
      this.rate.value = 0;
      this.message.value = '';
      this.imgList.value = [];

      this.getInfo();
    },

    goBack() {
      this.$router.back();
    },

    isIllegal() {
      let arr = [this.rate, this.message];

      for(var i = 0, len = arr.length; i < len; i++){
        if(!arr[i].value) return this.$toast.fail(`${arr[i].placeholder}`), true;
      }
    },

    async submit() {
      let param = { order_id: this.id, order_no: this.detail.order_sn, goods_type: 'real', goods_id: this.detail.order_goods[0].goods_id, },
          imgList = this.imgList.value,
          newImgList = [],
          arr = [this.rate, this.message,];

      if(this.doing || this.isIllegal()) return ;
      this.doing = true;

      for(let i = 0, len = imgList.length; i < len; i++){
        let fd = new FormData();
        fd.append('token', this.imgToken);
        fd.append('config', this.imgConfig);
        fd.append('file', imgList[i].file);

        let imgRes = await api.uploadImg(fd);
        newImgList.push(`${gd.imgCdnUrl}${imgRes.hash}`);
      }

      arr.forEach(v => param[v.to] = v.value);

      param.geval_image = newImgList;

      this.save(param);
    },

    async save(param) {
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiOrder.evaluate(param);
      if(!res || typeof res === 'string' || res.error) return this.doing = false, this.$toast.fail(res ? res.error || res : '评价失败!');

      if(res.data){
        this.$toast.success('评价成功!');
        setTimeout(() => this.$router.back(), 1000);
      }
    },

    format(order){
      order.couponPrice = math.subtract(math.add(order.goods_total_prices, order.shipping_fee), order.order_amount);
      order.pointPrice = math.divide(order.order_points, 10);
      order.refundPrice = math.subtract(math.subtract(order.order_amount, order.pointPrice), order.pd_amount );

      let freight = order.shipping_fee;

      if(order.pointPrice >= freight){
        order.pointPrice = math.subtract(order.pointPrice, freight);
      }else{
        freight = math.subtract(freight, order.pointPrice);
        order.pointPrice = 0;

        if(order.pd_amount >= freight){
          order.pd_amount = math.subtract(order.pd_amount, freight);
        }else{
          freight = math.subtract(freight, order.pd_amount);
          order.pd_amount = 0;

          order.refundPrice = math.subtract(order.refundPrice, freight);
        }
      }
      
      order.order_goods.forEach(goods => this.formatSpec(goods));

      return order;
    },

    formatSpec(item) {
      let specStr = '',
          specObj = item.goods_spec;

      for(let key in specObj){ specStr += `${specObj[key]}; `; }

      item.specStr = specStr ? specStr.replace(/;\s$/g, '') : '统一规格';
    },

    async getInfo() {
      let param = {};
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiOrder.getOrder(this.id);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取订单信息失败!');

      if(res && res.data){
        this.detail = this.format(res.data[0]);
        res = await api.getImgToken();

        if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取七牛云信息失败!');
        this.imgToken = res.data;
      }

      this.$toast.clear();
    },

  },

  activated() {
    // if(this.isBack) return ;

    this.init();
  },
};
</script>
<style lang='less' scoped>
.page_wrap{
  padding: 128px 0 110px;
  font-size: 28px;
}

.form_wrap{
  padding: 0 0 30px 0;
}

.goods_wrap{
  margin: 10px 20px 0;
}
.goods_info_wrap{
  width: 500px;
  padding: 10px 0px 10px 25px;
  font-size: 28px;
  word-break: break-all;
}
.goods_name{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.goods_price_wrap{
  margin: 70px 0 0;
  font-size: 26px;
}
.goods_price_integer{
  font-size: 32px;
}
.goods_sku_wrap{
  margin: 70px 0 0;
}
.goods_standard {
  width: 400px;
  font-size: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rate_wrap{
  align-items: center;
  height: 100px;
  margin: 30px 30px 0;
  border-top: 1px solid #f7f7f7;
}
.rate{
  margin: 0 0 0 30px;
}

.comment_wrap{
  border-top: 1px solid #f7f7f7;
}

.img_wrap{
  margin: 20px 20px 0;
}
.upload_wrap{
  width: 160px;
  margin: 0 20px 0 0;
  padding: 30px 0;
  border: 1px dashed #d9d9d9;
  font-size: 22px;
  text-align: center;
}

.submit_btn {
  line-height: 88px;
  margin: 25px 75px 0;
  font-size: 36px;
  border-radius: 10px;
  text-align: center;
}

.i_goods{
  width: 160px;
  height: 160px;
  border-radius: 10px;
}
.i_upload{
  width: 54px;
  height: 61px;
}

.ml10{ margin: 0 0 0 10; }

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }
.s_fc_13{ color: #4FB84A; }
.s_fc_14{ color: #202020; }
.s_fc_15{ color: #dd3d27; }
.s_fc_16{ color: #af0000; }
.s_fc_17{ color: #b6b6b6; }

.s_bg_11{ background: #FC6B76; }
.s_bg_13{ background: #4FB84A; }
.s_bg_f4{ background: #f4f4f4; }
</style>
<style>
</style>