<template>
  <div class="address_page_wrap s_bg_f5">
    <van-nav-bar left-arrow :title="title" fixed @click-left="goBack"></van-nav-bar>

    <div class="form_wrap s_bg_f">
      <van-field class="input_wrap s_fc_3" v-model="name.value" :label="name.title" :placeholder="name.placeholder" />
      <van-field class="input_wrap s_fc_3" v-model="mobile.value" :label="mobile.title" :placeholder="mobile.placeholder" />

      <div class="input_wrap row_wrap flex">
        <div class="input_title">{{area.title}}</div>

        <div class="area_value" @click="openAreaDialog">{{area.value}}</div>
      </div>

      <van-field type="textarea" rows="2" class="input_wrap s_fc_3" v-model="desc.value" :label="desc.title" :placeholder="desc.placeholder" />

      <div class="def_wrap row_wrap between">
        <div class="">
          <div>{{def.title}}</div>
          <div class="def_desc">{{def.desc}}</div>
        </div>

        <van-switch v-model="def.value" active-color="#4FB84A" inactive-color="#ccc" size="20" />
      </div>
    </div>

    <div class="submit_btn s_fc_f s_bg_13" @click="submit">保存</div>

    <van-popup v-model="showAreaDialog" position="bottom">
      <van-picker show-toolbar title="" :columns="addressList" :loading="loading" @change="changeArea" @confirm="confirmArea" @cancel="closeAreaDialog" />
    </van-popup>

  </div>
</template>
<script>
import { Field, } from 'vant';
import * as apiAddress from '@/api/address';
import user from '@/components/my/user';
import valid from '@/utils/valid';

export default {
  components: {
    [Field.name]: Field,
    user,
  },

  data() {
    return {
      name: { title: '收货人', value: '', rule: { test: /^.+$/, }, to: 'address_realname', placeholder: '请输入姓名', },
      mobile: { title: '手机号码', value: '', rule: { test: /^.+$/, }, to: 'address_tel_phone', placeholder: '11位手机号', },
      area: { title: '选择地区', value: '', rule: { test: /^.+$/, }, },
      desc: { title: '详细地址', value: '', rule: { test: /^.+$/, }, to: 'address_detail', placeholder: '街道门牌信息', },
      def: { title: '设为默认地址', value: false, desc: '注：每次下单时会使用该地址' },

      showAreaDialog: false,
      loading: false,
      provinceId: 1,
      cityId: 36,
      zoneId: 37,
      addressList: [],

      type: '',
      userInfo: null,
      doing: false,
      address: null,
    };
  },

  computed: {
    title(){ return '新增地址'; },

    isBack() { return this.$route.meta.isBack; },
  },

  methods: {
    init() {
      let route = this.$route,
          query = route.query;

      if(query.address){
        this.address = query.address;
        this.name.value = query.address.address_realname;
        this.mobile.value = query.address.address_tel_phone;
        this.area.value = query.address.area_info;
        this.desc.value = query.address.address_detail;
        this.def.value = query.address.address_is_default == 1;
        this.provinceId = query.address.province_id;
        this.cityId = query.address.city_id;
        this.zoneId = query.address.area_id;
      }
    },

    goBack() {
      this.$router.back();
    },

    openAreaDialog(item) {
      this.showAreaDialog = true;
    },

    closeAreaDialog() {
      this.showAreaDialog = false;
    },

    changeArea(p, v) {
      this.loading = true;

      if(v[0].id != this.provinceId){
        this.provinceId = v[0].id;
        this.getCity(p);
      }

      if(v[1].id != this.cityId){
        this.cityId = v[1].id;
        this.getZone(p);
      }

      if(v[1].id == this.cityId) return this.loading = false;
    },

    confirmArea(v) {
      this.area.value = `${v[0].text}${v[1].text}${v[2].text}`;
      this.zoneId = v[2].id;
      
      this.closeAreaDialog();
    },

    isIllegal() {
      let arr = [this.name, this.mobile, this.area, this.desc];

      for(var i = 0, len = arr.length; i < len; i++){
        var item = arr[i];
        if(item.rule && !item.rule.test.test(item.value)) return this.$toast.fail(item.rule.message || `${item.title}填写不正确`), true;
      }

      if(!valid.isMobile(this.mobile.value)) return this.$toast.fail(`${this.mobile.title}填写不正确!`), true;
    },

    submit(item) {
      let param = {},
          arr = [this.name, this.mobile, this.area, this.desc];

      if(this.doing || this.isIllegal()) return ;
      this.doing = true;
      
      arr.forEach(v => param[v.to] = v.value);

      param.address_mob_phone = this.mobile.value;
      param.area_info = this.area.value;
      param.province_id = this.provinceId;
      param.city_id = this.cityId;
      param.area_id = this.zoneId;
      param.address_is_default = this.def.value ? 1 : 0;
      
      this.save(param);
    },

    async save(param) {
      let res = await (this.address ? apiAddress.editAddress(this.address.address_id, param) : apiAddress.addAddress(param));
      
      if(!res || typeof res === 'string' || res.error){
        this.doing = false;
        return this.$toast.fail(res ? res.error || res : `${this.address ? '修改' : '添加'}失败!`);
      }

      if(res && res.status == 0){
        this.$toast.success(`${this.address ? '修改' : '添加'}成功!`);
        setTimeout(() => this.goBack(), 2000);
      }
      
    },

    async getArea(){
      let param = { level: 1, };

      let res = await apiAddress.getArea(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取省份信息失败!');

      if(res && res.status == 0){
        var list = Object.keys(res.data).map(k => ({ id: k, text: res.data[k], })),
            index = 0;

        if(this.provinceId) list.forEach((v, i) => { if(v.id == this.provinceId) index = i; });

        this.addressList = [
          { values: list, defaultIndex: index, },
          { values: [], defaultIndex: 0, },
          { values: [],  defaultIndex: 0, },
        ];

        this.getCity(undefined, this.provinceId);
      }

    },

    async getCity(picker, isEdit){
      let param = { level: 2, parentId: this.provinceId, };

      let res = await apiAddress.getArea(param);
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取城市信息失败!');

      if(res && res.status == 0){
        res.data.forEach((v, i) => { 
          v.id = v.area_id; 
          v.text = v.area_name; 
          if(v.area_id == this.cityId) this.addressList[1].defaultIndex = i; 
        });
        picker ? picker.setColumnValues(1, res.data) : this.addressList[1].values = res.data;

        if(picker || !isEdit) this.cityId = res.data[0].id;
        this.getZone(picker, isEdit);
      }

    },

    async getZone(picker, isEdit){
      let param = { level: 3, parentId: this.cityId, };

      let res = await apiAddress.getArea(param);
      this.loading = false;
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取区，县信息失败!');

      if(res && res.status == 0){
        res.data.forEach((v, i) => {
          v.id = v.area_id;
          v.text = v.area_name;
          if(v.area_id == this.zoneId) this.addressList[2].defaultIndex = i;
        });
        picker ? picker.setColumnValues(2, res.data) : this.addressList[2].values = res.data;

        if(picker || !isEdit) this.zoneId = res.data[0].id;
      }

    },

    async getUser(){
      if(!valid.isAuth()) return ;

      this.$toast.loading({ message: 'Loading...', forbidClick: true, duration: 0, });

      let param = {};

      let res = await apiUser.getUser();
      if(!res || typeof res === 'string' || res.error) return this.$toast.fail(res ? res.error || res : '获取用户信息失败!');

      if(res && res.status == 0){
        localStorage.setItem('user', JSON.stringify(res.data));
      }

      this.$toast.clear();
    },
  },

  activated() {
    if(this.isBack) return ;

    this.init();
    this.getArea();
  },
};
</script>
<style lang='less' scoped>
.address_page_wrap{
  box-sizing: border-box;
  height: 100vh;
  padding: 128px 0 0;
}

.input_wrap{
  box-sizing: border-box;
  height: 100px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 28px;
}
.row_wrap{
  align-items: center;
  padding: 0 30px;
}
.area_value{
  flex-grow: 1;
  min-height: 100%;
  line-height: 100px;
  margin: 0 0 0 40px;
}

.def_wrap{
  height: 150px;
}
.def_desc{
  margin: 20px 0 0;
  font-size: 26px;
  color: #999;
}

.submit_btn{
  position: fixed;
  left: calc(50% - 345px);
  bottom: 20px;
  width: 690px;
  height: 88px;
  line-height: 88px;
  font-size: 36px;
  border-radius: 10px;
  text-align: center;
}

.s_fc_11{ color: #FC6B76; }
.s_fc_12{ color: #D30D1B; }
.s_fc_13{ color: #4FB84A; }

.s_bg_11{ background: #FC6B76; }
.s_bg_13{ background: #4FB84A; }
</style>
<style>
.address_page_wrap .van-field__label{
  width: 150px;
}

.van-picker__cancel, .van-picker__confirm{
  color: #333;
}
</style>