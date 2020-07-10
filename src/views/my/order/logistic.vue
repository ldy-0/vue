<template>
  <div class="page_wrap s_bg_f5">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <!-- 商品信息 -->
    <div class="goods_list_wrap s_fc_8 s_bg_f">
      <div class="" v-for="(item, index) in detail.order_goods" :key="index">
        <div class='goods_img_wrap'>
          <img class='goods_img' :src='item.goods_image' />
          <div class='goods_num s_fc_f s_bg_0'>共{{item.goods_num}}件</div>
        </div>

        <div class='goods_name s_fc_11'>{{item.goods_name}}</div>
      </div>
    </div>

    <!-- success -->
    <div class='decoration_wrap between s_fc_f s_bg_11' v-if="isSuccess">
      <div class=''>
        <div class='decoration_success'>已完成</div>
        <div>包裹已经送到</div>
      </div>

      <img class='i_package' src='../../../assets/images/order/package.png' />
    </div>

    <!-- 复制 -->
    <div class='logistic_wrap between s_fc_2 s_bg_f'>
      <div>{{logistic[0]}} {{logistic[2]}}</div>
      <img class='i_logistic' src='../../../assets/images/order/copy.png' @click='copy' />
    </div>

    <!-- 物流信息 -->
    <div class="detail_wrap s_fc_2 s_bg_f">
      <div v-for="(item, index) in detailList" :key="index">
        <div class="flex">
          <div class="time_wrap">{{item.timeStr}}</div>

          <div class='graph_wrap'>
            <div class='dot s_bg_11'></div>
            <div class="line s_bg_12" :class="{ last_line: detailList.length === index + 1 }"></div>
          </div>

          <div class='desc_wrap'>
            <div>{{item.AcceptStation}}</div>
          </div>
        </div>
      </div>

      <div class='load_wrap flex center s_fc_12' v-if="!collapse" @click='showMore'>
        <div>点击查看更多物流详情</div>
        <img class='i_load' src='../../../assets/images/order/load.png' />
      </div>


      <div v-if="!logisticList.length">{{logisticRes ? logisticRes.Reason : ''}}</div>
    </div>

  </div>
</template>
<script>
import moment from 'moment';
import * as math from 'mathjs';
import * as apiOrder from '@/api/order';
import * as gd from '@/utils/global';
import ClipboardJS from 'clipboard';

export default {
  components: {
  },

  data() {
    return {
      detail: {},
      logistic: [],
      logisticRes: null,
      logisticList: [],
      collapse: false,

      clip: null,
    };
  },

  computed: {
    title() { return '查看物流'; },
    isSuccess(){ return this.logisticRes && this.logisticRes.state == '3' },

    isBack() { return this.$route.meta.isBack; },

    detailList(){ 
      return this.collapse ? this.logisticList : this.logisticList.slice(0, 3);
    },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      this.id = query.id;
      this.getInfo();
    },

    goBack() {
      this.$router.back();
    },

    copy() {
      if(this.clip) this.clip.destroy();

      let clip = new ClipboardJS('.i_logistic', {
        text: e => `${this.logistic[0]} ${this.logistic[2]}`,
      });

      clip.on('success', e => this.$toast.success(`复制成功!`));
      clip.on('error', e => this.$toast.fail(`复制失败!`));

      this.clip = clip;
    },

    showMore(){
      this.collapse = true;
    },

    async getInfo() {
      let param = {};
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiOrder.getOrder(this.id);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取订单信息失败!')

      if(res && res.data){
        this.detail = res.data[0];

        // this.detail.shipping_code = ['1', , '2'];
        if(this.detail.shipping_code){
          this.logistic = this.detail.shipping_code;

          this.getLogistic();
        }
      }

      this.$toast.clear();
    },

    async getLogistic(){
      let param = {
        OrderCode: this.detail.order_sn,
        ShipperCode: this.logistic[1],
        LogisticCode: this.logistic[2],
      };

      let res = await apiOrder.getLogistic(param);
      // res = this.mock();
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取物流信息失败!')
      
      if(res && res.data){
        res.data.Traces.forEach(this.format);

        this.logisticRes = res.data;
        this.logisticList = res.data.Traces;
        this.collapse = this.logisticList.length < 4;
      }

    },

    format(v){
      v.timeStr = v.AcceptTime.replace(/^\d{4}\/|:\d{2}$/g, '');
    },

    mock() {
      let o = { data: { Traces: [], Reason: 'sdfsdf', }, };

      o .data.Traces = [ 
        { AcceptTime: '2019/05/09 04:01:28', AcceptStation: '[收货地址]湖北省武汉市硚口区国际企业峰会 湖北省武汉市硚口区国际企业峰会 湖北省武汉市硚口区国际企业峰会 A3-402', status: 1 },
        { AcceptTime: '2014/06/25 04:01:28', AcceptStation: '[收货地址]湖北省武汉市硚口区国际企业峰会 A3-402', },
        { AcceptTime: '2014/06/25 04:01:28', AcceptStation: '[收货地址]湖北省武汉市硚口区国际企业峰会 A3-402', },
        { AcceptTime: '2014/06/25 04:01:28', AcceptStation: '[收货地址]湖北省武汉市硚口区国际企业峰会 A3-402', },
        { AcceptTime: '2014/06/25 04:01:28', AcceptStation: '[收货地址]湖北省武汉市硚口区国际企业峰会 A3-402', },
      ];

      return o;
    },

  },

  activated() {
    if(this.isBack) return ;

    this.init();
  },

  deactivated() {
    if(this.clip) this.clip.destroy();
  },
};
</script>
<style lang='less' scoped>
.page_wrap{
  height: 100vh;
  padding: 128px 0 0;
}

.goods_list_wrap{
  margin: 20px 20px 0;
  padding: 60px 0 30px;
  border-radius: 10px 10px 0 0;
}
.goods_img_wrap{
  position: relative;
  left: calc(50% - 81px);
  width: 162px;
  height: 162px;
}
.goods_img{
  width: 100%;
  height: 100%;
  border-radius: 12px;
}
.goods_num{
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 6px 0;
  border-radius: 0 0 12px 12px;
  font-size: 24px;
  text-align: center;
}
.goods_name{
  margin: 20px 0 0;  
  text-align: center;
}

.decoration_wrap{
  margin: 0 20px;
  padding: 20px 60px 20px 30px;
  border-radius: 0 0 10px 10px;
  font-size: 24px;
}
.decoration_success{
  font-size: 34px;
}

.logistic_wrap, .detail_wrap{
  margin: 20px 20px 0;
  border-radius: 10px;
}
.logistic_wrap{
  padding: 50px 10px 50px 30px;
  font-size: 32px;
}

.detail_wrap{
  position: relative;
  margin-bottom: 20px;
  padding: 60px 0 60px 30px;
  font-size: 24px;
}
.time_wrap{
  width: 140px;
  text-align: center;
  align-self: center;
}
.graph_wrap{
  position: relative;
  margin: 0 30px;
}
.dot{
  position: relative;
  top: calc(50% - 5px);
  z-index: 1;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.line{
  position: absolute;
  top: 50%;
  left: 4px;
  width: 2px;
  height: 100%;
}
.last_line{
  height: 0%;
}
.desc_wrap{
  width: 480px;
  padding: 20px 0;
}

.load_wrap{
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 20px;
}

.i_package{
  width: 93px;
  height: 99px;
}
.i_logistic{
  width: 42px;
  height: 42px;
}
.i_load{
  width: 24px;
  height: 24px;
  margin-left: 15px;
}

.ml10{ margin: 0 0 0 10; }

.s_fc_11{ color: #535353; }
.s_fc_12{ color: #939393; }
.s_fc_13{ color: #4FB84A; }
.s_fc_14{ color: #202020; }
.s_fc_15{ color: #dd3d27; }
.s_fc_16{ color: #af0000; }
.s_fc_17{ color: #636363; }
.s_fc_18{ color: #282425; }

.s_bg_11{ background: #4FB84A; }
.s_bg_12{ background: #cecece; }
.s_bg_f5{ background: #f5f5f5; }
</style>
<style>

</style>