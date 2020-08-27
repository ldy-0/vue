<style scoped>
</style>

<template>
  <div>
    <el-form label-width='68px' :disabled="config.disabled">
      <!-- <el-form-item :label='adminInfo.title' label-width='110px' v-if='config.title'></el-form-item> -->

      <c-input :obj='name'></c-input>
      <c-input :obj='account'></c-input>
      <c-input :obj='mobile'></c-input>

      <c-input :obj='pwd' v-if="!isAdminInfo"></c-input>

      <el-form-item label="权限">
        <div v-for="(firstItem, firstIndex) of routeList" :key="firstIndex">
          <div>{{firstItem.meta.desc}}</div>

          <el-checkbox-group v-model="authList" :disabled="adminInfo && adminInfo.is_admin == 1">
            <el-checkbox v-for="(secondItem, secondIndex) of firstItem.children" :label="secondItem.meta.roles" :key="secondIndex">{{secondItem.meta.desc}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>      

    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit" :disabled="loading" :loading="loading" v-if="config.submit">{{config.submit}}</el-button>
    </span>
  </div>
</template>
<script>
import cInput from '@/components/customInput'
import { getToken, setToken, removeToken, getUser, } from "@/utils/auth";
import * as sellerApi from "@/api/seller";
import { routeList  } from '@/router';

export default {
  name: 'remark',

  components: {
    cInput,
  },

  props: {
    config: {
      type: Object,
      default(){
        return {
          title: '',
        };
      }
    }
  },

  data(){
    return {
      loading: false,

      name: { type: 'string', title: '姓名',  value: '', alert: null, rule: { test: /^.+$/, message: '姓名填写不正确!', }, },
      account: { type: 'string', title: '账号',  value: '', alert: null, rule: { test: /^.+$/, message: '账号填写不正确!', }, },
      pwd: { type: 'string', title: '密码',  value: '', alert: null, rule: { test: /^.{6,}$/, message: '密码填写不正确!', }, },
      mobile: { type: 'string', title: '手机号',  value: '', alert: null, rule: { test: /^[1-9]\d{10}$/, message: '手机号填写不正确!', }, },
      authList: [],
      
      adminInfo: null,
    };
  },

  computed: {
    routeList(){ return routeList; },
    isAdminInfo(){ return this.config.isInfo; },
  },

  created(){
    if(this.isAdminInfo) this.getAdminInfo();
    
    if(this.config.detail) this.adminInfo = this.format(this.config.detail);
  },

  methods: {
    close() { this.$emit('close', this.config); },

    async getAdminInfo() {
      let res = await sellerApi.getAdmin({ seller_id: 1, });
      if(!res || typeof res === 'string' || res.error) return this.$message.error(res ? res.error || res : '!')

      if(res.data){
        this.adminInfo = this.format(res.data[0]);
      }
    },

    format(o) {
      this.name.value = o.seller_nick;
      this.account.value = o.seller_name;
      this.mobile.value = o.seller_id;

      if(o.is_admin) o.seller_limits = routeList.reduce((p, v) => p.concat(v.children.map(vv => vv.meta.roles)), []);
      this.authList = o.seller_limits;

      return o;
    },

    submit() {
      if(this.isIllegal()) return ;
      this.loading = true;
      let loading = this.$loading();

      let param = { sellergroup_id: 0, };
      
      param.seller_nick = this.name.value;
      param.seller_name = this.account.value;
      param.seller_mobile = this.mobile.value;
      param.seller_password = this.pwd.value;
      param.seller_limits = this.authList;

      this.save(param, loading);
    },

    async save(param, loading) {
      let res = await sellerApi.addAuth_api(param);

      loading.close();
      this.loading = false;
      if(!res || typeof res === 'string' || res.error) return this.$message.error(res ? res.error || res : this.adminInfo ? '修改失败!' : '添加失败!');

      this.$message.success(this.adminInfo ? '修改成功!' : '添加成功!');
      this.$emit('success', param); 
    },

    isIllegal() {
      let arr = [this.mobile, this.account, this.name], item;

      if(!this.adminInfo) arr.unshift(this.pwd);

      for(let i = arr.length - 1; i >= 0; i--){
        item = arr[i];
        if(item.rule && !item.rule.test.test(item.value)) return item.alert = item.rule.message;
        item.alert = null;
      }
    },
  }
}
</script>