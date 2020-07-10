<template>
  <div class="page_wrap s_bg_f5">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <div class="title_wrap">我的地址</div>
    
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">

      <van-list class="list_wrap" v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">
        <div class="goods_list_wrap">

          <div class="address_wrap s_bg_f" v-for="(item, index) in list" :key="index" @click="goBack(item)">
            <div class="user_info flex s_fc_2">
              <div class="user_name">{{item.address_realname}}</div>
              <div>{{item.address_mob_phone}}</div>
            </div>
          
            <div class="address_info">{{item.area_info}}{{item.address_detail}}</div>

            <div class="other_wrap between">
              <div class="default s_fc_13">{{ item.address_is_default == 1 ? '[默认地址]' : '' }}</div>

              <div class="operate_info flex">
                <div class="operate_btn flex" @click.stop="goDetail(item)">
                  <img class="i_icon" src="../../../assets/images/icon_xiugai@2x.png">
                  <div>修改</div>
                </div>
                <div class="operate_btn flex" @click.stop="del(item)">
                  <img class="i_icon" src="../../../assets/images/icon_shanchu@2x.png">
                  <div>删除</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </van-list>
        
    </van-pull-refresh>

    <div class="add_btn s_fc_f s_bg_13" @click="goDetail()">新增地址</div>
  </div>
</template>
<script>
import { Field, } from 'vant';
import * as math from 'mathjs';
import * as api from '@/api/common';
import * as apiUser from '@/api/user';
import * as apiAddress from '@/api/address';
import * as Type from '@/utils/type';
import * as gd from '@/utils/global';
import address from '@/components/my/address.vue';

export default {
  components: {
    [Field.name]: Field,
    'c-address': address,
  },

  data() {
    return {
      bannerConfig: {
        bgImg: null,
      },

      type: '',
      status: -1,
      refreshing: false,
      loading: false,
      finished: false,
      isFixed: false,

      page: 1,
      limit: 10,
      total: 0,
      allList: [],

      canBack: false,
    };
  },

  computed: {
    title() { return '地址管理'; },

    list() { return this.allList.slice(0, this.page * this.limit); },

    isBack() { return this.$route.meta.isBack; },
  },

  methods: {
    init() {
      let route = this.$route,
          params = route.params;

      this.canBack = params.from && params.from === 'submitOrder';

      this.clear(true);
      this.getList();
    },

    goDetail(item) {
      let query = {};

      if(item) query.address = item;

      this.$router.push({ name: 'addressDetail', query, });
    },

    onRefresh(e) {
      this.clear(true);

      this.loading = true;

      this.getList();
    },

    onLoad(e) {
      if(this.total <= this.page++ * this.limit) return this.finished = true;

      // this.getList();
      this.loading = false;
    },

    async del(item) {
      let res = await apiAddress.deleteAddress(item.address_id);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '删除失败!');

      if(res && res.status == 0){
        this.$toast.success('删除成功!');
        this.getList(this.clear());
      }
    },

    format(v){

      return v;
    },

    async getList() {
      let param = { page: this.page, limit: this.limit, };
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiAddress.getAddressList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取地址信息失败!')

      if(res && res.data){
        res.data.forEach(v => this.allList.push(this.format(v)));
        this.total = res.pagination ? res.pagination.total : this.allList.lenght;
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },

    clear(deep) {
      this.allList = [];
      this.page = 1;
      this.finished = false;

      if(deep){
        scrollTo(0, 0);
      }
    },

    goBack(item) {
      if(item.address_id){
        if(!this.canBack) return ;

        localStorage.setItem('address', JSON.stringify(item));
      }

      this.$router.back();
    },

  },

  activated() {
    if(this.isBack){
      this.clear(true);
      return this.getList();
    }

    this.init();
  },

};
</script>
<style lang='less' scoped>
.page_wrap{
  min-height: 100vh;
  padding: 128px 0 130px;
}

.list_wrap{
  min-height: 100vh;
}

.goods_list_wrap{
  flex-wrap: wrap;
  padding: 0 20px; 
}

.title_wrap{
  width: 100%;
  height: 88px;
  letter-spacing: 1px;
  font-size: 32px;
  box-sizing: border-box;
  padding: 25px 0 0 30px;
  color: #979797;
  background-color: #f6f6f6;
}

.address_wrap {
  padding: 23px 30px 16px;
  border-top: 1px solid #f4f4f4;
}
.user_info{
  font-size: 32px;
}
.user_name{
  width: 320px;
  margin: 0 10px 0 0;
}
.address_info {
  margin: 10px 0;
  font-size: 24px;
  color: #979797;
}

.default {
  font-size: 22px;
}

.other_wrap{
  align-items: flex-end;
}
.operate_info{
  font-size: 28px;
}
.operate_btn{
  align-items: center;
  margin: 0 0 0 40px;
}

.add_btn{
  position: fixed;
  bottom: 20px;
  width: 690px;
  height: 88px;
  left: calc(50% - 345px);
  line-height: 88px;
  font-size: 36px;
  border-radius: 10px;
  text-align: center;
}

.i_icon{
  width: 26px;
  height: 26px;
  margin-right: 12px;
}

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }
.s_fc_13{ color: #4FB84A; }
.s_fc_14{ color: #494949; }
.s_fc_15{ color: #3f3f3f; }
.s_fc_16{ color: #FF0032; }
.s_fc_17{ color: #151212; }

.s_bg_11{ background: #FC6B76; }
.s_bg_12{ background: #FF0032; }
.s_bg_13{ background: #4FB84A; }
</style>
<style>
.van-tab--active .van-tab__text {
  font-size: 28px;
  font-weight: bold;
}

.van-tabs__wrap--scrollable .van-tab{
  flex: 0 0 20% !important;
}
.van-tabs__line{
  background: #FF557A;
}

.van-sticky--fixed{
  top: 88px;
}
</style>