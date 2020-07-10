<template>
  <div class="page_wrap login_page_wrap s_bg_f5">
    <van-nav-bar :title="title" fixed></van-nav-bar>

    <div class="count_wrap s_fc_9 s_bg_f">
      <div class="count s_fc_13">{{total}}</div>
      <div class="count_desc">总人数(人)</div>
    </div>

    <div class="user_list_wrap">
    <!-- <van-pull-refresh class="list_wrap" v-model="refreshing" @refresh="onRefresh"> -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">

        <div class="info between s_bg_f" v-for="(item, index) in list" :key="index">
          <div class="user_info_wrap flex s_fc_3">
            <img class="i_avatar" :src="item.member_avatar" />
            <div class="user_info">
              <div class="user_name">{{item.member_nick}}</div>
              <div>{{item.member_mobile}}</div>
            </div>
          </div>

          <div class="s_fc_13">总消费<span>{{item.order_amount}}</span>元</div>
        </div>

      </van-list>
    <!-- </van-pull-refresh> -->
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
      count: 0,
      refreshing: false,
      loading: false,
      finished: false,

      page: 1,
      limit: 10,
      total: 0,
      list: [],
    };
  },

  computed: {
    title() { return '分享成员'; },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      this.getList();
    },

    onRefresh(e) {
      this.finished = false;
      this.list = [];
      this.page = 1;

      this.loading = true;
      this.getList();
    },

    onLoad(e) {
      if(this.total <= this.page++ * this.limit) return this.finished = true;

      this.getList();
    },

    format(v) {

      return v;
    },

    async getList() {
      let param = { page: this.page, limit: this.limit, };
      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let res = await apiUser.getChildren(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取明细信息失败!')

      if(res && res.data){
        res.data.forEach(v => this.list.push(this.format(v)));
        this.total = res.pagination ? res.pagination.total : this.list.lenght;
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },
  },

  created() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.page_wrap{
  box-sizing: border-box;
  padding: 128px 0 0;
}

.count_wrap{
  box-sizing: border-box;
  height: 272px;
  padding-top:48px;
  text-align: center;
}
.count{
  font-size: 60px;
  letter-spacing: 2px;
}
.count_desc{
  margin: 34px 0 0;
  font-size: 30px;
  letter-spacing: 1px;
}

.user_list_wrap{
  margin: 20px 0 0;
}
.info{
  align-items: center;
  box-sizing: border-box;
  margin: 1px 0 0;
  padding: 26px 30px;
  font-size: 28px;
}
.user_info_wrap{

}
.user_info{
  margin: 0 0 0 20px;
}
.user_name{
  width: 240px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.i_avatar{
  width: 84px;
  height: 84px;
  border-radius: 50%;
}

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }
.s_fc_13{ color: #4FB84A; }

.s_bg_11{ background: #FC6B76; }
</style>
<style>
.login_page_wrap .van-tab--active .van-tab__text {
  font-size: 28px;
  font-weight: bold;
}

.login_page_wrap .van-field__label{
  display: flex;
  width: 90px;
}
</style>