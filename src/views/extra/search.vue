<template>
  <div class="search">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <van-search clearable v-model="value" placeholder="请输入搜索关键词" show-action shape="round" @search="onSearch">
      <div class="search_ss" slot="action" @click="onSearch">搜索</div>
    </van-search>
    <div class="history" v-if="isHave">
      <div class="history_title">
        <div>搜索记录</div>
        <img class="delete" @click="deleteItem" src="../../assets/images/icon_delete-@2x.png" alt="">
      </div>
      <div class="history_list">
        <div @click="startSearch(item.name)" class="history_item" v-for="(item,index) in sercherStorageList"
          :key="index">
          {{item.name}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Search } from 'vant';
import Cookies from 'js-cookie';
import navBar from '@/components/navBar';

import request from '@/utils/request';
export default {
  components: {
    [Search.name]: Search,
    navBar: navBar
  },
  data() {
    return {
      value: '',
      sercherStorageList: [],
      isHave: false,
    };
  },

  computed: {
    title(){ return '搜索'; },
  },

  created() {
    if (Cookies.get('searchData')) {
      this.sercherStorageList = JSON.parse(Cookies.get('searchData'));
      this.isHave = true;
    }
  },
  methods: {
    //开始搜索，并记录历史
    onSearch() {
      let serVal = this.value.trim();
      if (serVal) {
        this.searchHistory(serVal);
        this.startSearch(serVal);
      }
    },
    startSearch(name) {
      this.$router.push({
        path: '/searchResult?search=' + name,
      })
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
    deleteItem() {
      this.$dialog.confirm({
        title: '删除确认',
        message: '是否删除搜索记录?'
      }).then(() => {
        this.sercherStorageList = [];
        Cookies.remove('searchData');
      }).catch(() => {
        // on cancel
      });
    },
    goBack() {
      this.$router.back();
    },
    
  }
};
</script>
<style lang='less' scoped>
.search {
  color: #666;
  padding: 120px 0 0;
}
.search_ss {
  font-size: 28px;
  color: #666;
}
.search_history {
  position: absolute;
  top: 238px;
  width: 100%;
  color: #666;
  background: #ededed;
}
.search_history .search_history_item {
  line-height: 90px;
  margin: 4px 0;
  padding-left: 30px;
  background: #fff;
}

.history {
  font-size: 26px;
  color: #888;
  padding: 0 30px;
  width: 100%;
  box-sizing: border-box;
}
.history .history_title {
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
}
.history .history_title img {
  width: 29px;
  height: 29px;
}
.history .history_list .history_item {
  display: inline-block;
  line-height: 40px;
  margin: 10px 30px 10px 0px;
  padding: 10px 40px;
  border-radius: 30px;
  background: rgba(82, 190, 79, 1);
  color: #fff;
}
</style>
<style >
.search .van-search__content {
  background: #f7f7f7;
  width: 607px;
}
</style>