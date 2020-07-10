<style>
.classify .van-sidebar-item {
  padding: 30px 20px;
  background: #f5f5f5;
}
.classify .van-sidebar-item--select {
  border-color: #4db846;
  background: #fff;
}
.classify .van-sidebar-item__text {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.classify .van-sidebar-item--select .van-sidebar-item__text {
  color: #4db846;
}
</style>
<template>
  <div class="classify">
    <div class="header">分类</div>
    <router-link class="search" to="/search">
      <img class="search-img" src="../assets/images/icon_sousuo@2x.png" alt="" />
      搜索商品
    </router-link>
    <div class="classify_box">
      <van-sidebar class="classify_left" v-model="activeKey">
        <van-sidebar-item @click="setActiveKey" :title="item.storegc_name" v-for="item in list"
          :key="item.storegc_id" />
      </van-sidebar>
      <div class="classify_right">
        <div v-for="k in classList" :key="k.storegc_id">
          <div class="classify_second" v-if="k.children&&k.children.length>0">
            <div class="classify_second-title">{{k.storegc_name}}</div>
            <div class="classify_second-class">
              <div class="class_box" v-for="i in k.children" :key="i.storegc_id" @click="goSearch(i)">
                <img :src="i.storegc_pic" alt="">
                <div class="class_name">
                  {{i.storegc_name}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <empty v-if="classList.length==0" notice="此处是空的哦~" />
      </div>
    </div>
  </div>
</template>
<script>
import { Sidebar, SidebarItem } from 'vant';
import request from '@/utils/request';
import empty from '@/components/empty';
export default {
  components: {
    [Sidebar.name]: Sidebar,
    [SidebarItem.name]: SidebarItem,
    empty: empty
  },
  data() {
    return {
      activeKey: 0,
      list: [],
    };
  },
  computed: {
    classList() {
      if(this.list.length==0) return [];
      if (this.list[this.activeKey].children) {
        return this.list[this.activeKey].children;
      } else {
        return [];
      }
    },

    isBack() { return this.$route.meta.isBack; },
  },

  activated() {
    if(this.isBack) return ;

    this.getClassify();
  },

  methods: {
    async getClassify() {
      let res = await request.get('/api/v2/member/storegc');
      if (res.status == 0) {
        this.list = res.data;
      }
    },
    setActiveKey(e) {
      this.activeKey = e;
    },

    goSearch(item) {
      let id = item.storegc_id;
      this.$router.push({ name: 'searchResult', query: { id, }, });
    },
  }
};
</script>
<style lang='less' scoped>
@allHeight: 100vh;
@bottomHeight: 100px;
.classify {
  background: #fff;
  height: calc(100vh - 100px);
}
.header {
  width: 100%;
  height: 100px;
  text-align: center;
  font-size: 32px;
  line-height: 100px;
}
.search {
  width: 702px;
  height: 60px;
  background: #eee;
  color: #333;
  margin: 0 auto;
  border-radius: 10px;
  display: flex;
  align-items: center;
  font-size: 28px;
  .search-img {
    width: 30px;
    height: 30px;
    margin: 0 20px;
  }
}
.classify_box {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  border-top: 1px solid #eee;
  height: 85%;
  .classify_left {
    width: 25%;
    height: 100%;
    text-align: center;
    overflow-y: scroll;
    background: #f5f5f5;
    border-right: 1px solid #eee;
    padding-bottom: 50px;
  }
  .classify_right {
    width: 75%;
    padding: 20px 30px;
    box-sizing: border-box;
    height: 100%;
    overflow-y: scroll;
    padding-bottom: 50px;
  }
}
.classify_second {
  border-bottom: 1px solid #eee;
  .classify_second-title {
    font-size: 28px;
    color: #000;
  }
  .classify_second-class {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    .class_box {
      width: 140px;
      height: 180px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      margin: 30px 0;
      img {
        width: 140px;
        height: 140px;
      }
      .class_name {
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        text-align: center;
        font-size: 28px;
      }
    }
    &::after {
      content: " ";
      width: 140px;
      height: 200px;
      display: block;
    }
  }
}
</style>