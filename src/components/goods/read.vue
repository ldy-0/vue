<template>
  <div class="goods_wrap s_bg_f">

    <div class="flex s_fc_9" @click="goDetail">
        <img class="i_goods" :src="config.image" />

        <div class="goods_info_wrap">
          <div class="goods_name s_fc_3">{{config.title}}</div>
          <div class='goods_desc s_fc_6'>{{config.desc}}</div>

          <div class='between mt40 s_fc_9'>
            <div class='goods_statistic flex'>
              <img class='i_view' src='../../assets/images/activity/view.png' />
              <div class='ml10'>{{config.view}}</div>
              <img class='i_share ml10' src='../../assets/images/activity/s_share.png' />
              <div class='ml10'>{{config.share}}</div>
            </div>

            <div class='more_btn s_fc_f'>了解更多</div>
          </div>
        </div>
    </div>

  </div>
</template>
<script>
import * as apiCommon from '@/api/common';
import valid from '@/utils/valid';
import * as gd from '@/utils/global';

export default {
  props: {
    config: {
      type: Object,
    },
  },

  data() {
    return {
      doing: false,
    };
  },

  computed: {
    isVipGoodsList(){ return this.config.isVip; },
  },

  methods: {
    goDetail() {
      let id = this.config.goodsexplain_id;

      this.$router.push({ name: 'readDetail', query: { id, }, });
    },

  },

  created() {
  },
};
</script>
<style lang='less' scoped>
.goods_wrap{
  margin: 20px 0 0;
  font-size: 28px;
}
.goods_info_wrap{
  flex-grow: 1;
  align-self: flex-start;
  margin: 0 0 0 20px;
  padding: 10px 0 20px;
  font-size: 28px;
  word-break: break-all;
}
.goods_name, .goods_desc{
  width: 400px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.goods_desc{
  margin: 6px 0 0;
  font-size: 26px;
}

.goods_statistic{
  align-items: center;
  align-self: flex-end;
  font-size: 24px;
}
.more_btn{
  padding: 20px 30px;
  font-size: 24px;
  border-radius: 30px;
  background: #58BEB5;
}

.i_goods{
  flex-shrink: 0;
  align-self: flex-start;
  width: 206px;
  height: 206px;
  border-radius: 20px;
}
.i_view, .i_share{
  width: 30px;
  height: 24px;
}

.ml10{
  margin-left: 10px;
}

.s_fc_11{ color: #FF557A; }
.s_fc_12{ color: #FF0032; }
.s_fc_13{ color: #151212; }
.s_fc_14{ color: #E06F00; }
.s_fc_15{ color: #DD3D27; }

.s_bg_11{ background: #F5F5F5; }
.s_bg_12{ background: #FFF0D5; }
.s_bg_13{ background: #FFE9E9; }

.s_bg_fa{ background: #fafafa; }
</style>