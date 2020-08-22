<template>
  <div class="search_page_wrap s_bg_f">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <van-search clearable v-model="value" placeholder="请输入搜索关键词" show-action shape="round" @search="onSearch">
      <div class="search_ss" slot="action" @click="onSearch">搜索</div>
    </van-search>

    <div class="goods">
      <van-tabs @change="changeTab" v-model="activeName" :border="false" color="#4FB84A" title-active-color="#4FB84A" v-if="isSearchList">
        <van-tab title="商品" name="goods"></van-tab>
        <van-tab title="店铺" name="store"></van-tab>
      </van-tabs>

      <van-list v-if="list.length" :immediate-check="false" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">

        <div class="goods_list_wrap between" v-if="isGoods">
          <goods :config="item" v-for="(item, index) in list" :key="index"></goods>
        </div>

        <div v-if="isStore">
           <store :config="item" v-for="(item, index) in list" :key="index"></store> 
        </div>

      </van-list>
      <empty v-else notice="暂无相关商品" />
    </div>
  </div>
</template>
<script>
import { Search } from 'vant';
import * as apiGoods from '@/api/goods';
import * as apiStore from '@/api/store';
import navBar from '@/components/navBar';
import empty from '@/components/empty';
import goods from '@/components/goods/goods.vue';
import store from '@/components/store/store.vue';
import Cookies from 'js-cookie';
import request from '@/utils/request';
export default {
  components: {
    [Search.name]: Search,
    navBar: navBar,
    empty: empty,
    goods,
    store,
  },
  data() {
    return {
      value: '',
      id: null, // 分类Id
      activeName: 'goods',
      sercherStorageList: [],

      className: '',

      page: 1,
      limit: 10,
      total: 0,
      list: [],
      loading: false,
      finished: false,
    };
  },
  
  computed: {
    title(){ return this.id ? this.className : '搜索'; },
    
    isBack() { return this.$route.meta.isBack; },

    isClassList(){ return this.id; },
    isSearchList() { return !this.id; },

    isGoods(){ return this.activeName == 'goods'; },
    isStore(){ return this.activeName == 'store'; },
  },

  methods: {
    //开始搜索，并记录历史
    onSearch() {
      this.value = this.value.trim();

      this.clear();

      // 分类
      if(this.isClassList){
        return this.getGoodsList();
      }

      if (this.value) {
        this.searchHistory(this.value);
        if(this.isGoods) this.getGoodsList();
        if(this.isStore) this.getStoreList();
      }
    },

    format(v){

      if(this.isStore){
        v.store_goods.forEach(goods => {
          goods.priceArr = goods.goods_price.split('.');
        });
      }

      return v;
    },

    async getGoodsList() {
      let param = { page: this.page, limit: this.limit, };

      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });
      
      if(this.id) param.gc_id = this.id;
      if(this.value) param.search = this.value;

      let res = await apiGoods.getGoodsList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取商品信息失败!')

      if(res && res.data){
        res.data.forEach(v => this.list.push(this.format(v)));
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },

    async getStoreList() {
      let param = { page: this.page, limit: this.limit, };

      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });
      
      if(this.id) param.gc_id = this.id;
      if(this.value) param.search = this.value;

      let res = await apiStore.getStoreList(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取店铺信息失败!')

      if(res && res.data){
        res.data.forEach(v => this.list.push(this.format(v)));
        this.total = res.pagination ? res.pagination.total : this.list.length;
      }

      this.loading = this.refreshing = false;
      this.$toast.clear();
    },

    // async startSearch() {
    //   if (this.activeName == 'store') {
    //     let send = Object.assign(this.query2);
    //     send.search = this.value;
    //     let res = await request.get('/api/v2/member/store', { params: send })
    //     if (res.status == 0) {
    //       this.storeList = this.storeList.concat(res.data);
    //     }
    //     if (res.pagination.pages <= this.query2.page) {
    //       this.finished2 = true;
    //     }
    //     this.loading2 = false;
    //   }
    // },
    changeTab(name) {
      this.clear();

      console.log(this.isGoods, this.isStore);
      if(this.isGoods) this.getGoodsList();
      if(this.isStore) this.getStoreList();
    },
    
    onLoad() {
      if(this.total <= this.page++ * this.limit) return this.finished = true;

      if(this.isGoods) this.getGoodsList();
      if (this.isStore) this.getStoreList();
    },
    //添加缓存
    searchHistory(serVal) {
      let res = this.judgeRepeat(serVal);
      if (!res) return;
      let searchData = this.sercherStorageList;
      if (searchData.length > 5) {
        searchData.shift();
      }
      searchData.push({
        id: this.sercherStorageList.length,
        name: serVal
      });
      Cookies.set("searchData", searchData);
    },
    judgeRepeat(serVal) {
      let repeat_bool = true;
      for (let i = 0; i < this.sercherStorageList.length; i++) {
        if (this.sercherStorageList[i].name == serVal) {
          repeat_bool = false;
        }
      }
      return repeat_bool;
    },

    goBack() {
      this.$router.go(-1);
    },

    clear() {
      this.list = [];
      this.page = 1;
      this.finished = false;

      scrollTo(0, 0);
    },
  },

  activated() {
    if(this.isBack) return ;

    let query = this.$route.query;
    this.activeName = 'goods';
    this.id = null;
    this.value = '';
    this.clear();

    if (Cookies.get('searchData')) {
      this.sercherStorageList = JSON.parse(Cookies.get('searchData'));
      this.isHave = true;
    }

    if(query.id){
      this.className = query.name;
      this.getGoodsList(this.id = query.id);
    }

    if(query.search){
      this.value = query.search;
      return this.onSearch();
    }
  },
};
</script>
<style lang='less' scoped>
.search_page_wrap {
  padding: 128px 0 0;
  color: #666;
  min-height: 100vh;
  .search_ss {
    font-size: 28px;
    color: #666;
  }
}
.goods {
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  .goods_item {
    height: 460px;
    width: 345px;
    border: 1px solid #eee;
    margin-top: 25px;
    border-radius: 10px;
    box-shadow: 1px 4px 10px #eee;
    overflow: hidden;
    line-height: 45px;
    .goods_item-img {
      width: 100%;
      height: 335px;
    }
    .goods_item-name {
      width: 100%;
      font-size: 28px;
      padding: 0 10px;
      box-sizing: border-box;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .price_icon {
      font-size: 24px;
    }
    .goods_item-price {
      font-size: 30px;
      padding: 0 10px 0 10px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      color: #dd3d27;
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .goods_item-tag {
      width: 68px;
      height: 34px;
    }
  }
}

.goods_list_wrap{
  box-sizing: border-box;
  flex-wrap: wrap;
  padding: 0 20px;
}
</style>

<style>
.search .goods .van-tabs__line {
  width: 40px !important;
  height: 3px;
}
.search .van-list__finished-text {
  width: 100%;
}
</style>