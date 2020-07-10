import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './styles/common.less';
import 'lib-flexible';
import FastClick from 'fastclick';
FastClick.attach(document.body);

//vant-ui全局使用组件;
import { NavBar, Toast, Tab, Tabs, List, Dialog, Button, PullRefresh, Swipe, SwipeItem, Lazyload, Checkbox, Icon, Field, ActionSheet, CountDown, Rate, Uploader, Sticky, Switch, Picker, Popup, CheckboxGroup, Radio, RadioGroup, PasswordInput, NumberKeyboard } from 'vant';
Vue.use(NavBar).use(Tab).use(Tabs).use(Button).use(Dialog).use(Toast).use(List).use(PullRefresh).use(Picker).use(Popup);
Vue.use(Swipe).use(SwipeItem).use(Lazyload).use(CountDown).use(Rate).use(Uploader).use(Sticky);
Vue.use(Radio).use(RadioGroup).use(Checkbox).use(CheckboxGroup).use(Field).use(Icon).use(Switch).use(ActionSheet).use(PasswordInput).use(NumberKeyboard);

// 轮播图
import 'swiper/swiper-bundle.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper);

Vue.config.productionTip = false;

import * as filters from './filter/index';

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

let vm = new Vue({
  router,
  render: h => { return h(App) }
}).$mount('#app')