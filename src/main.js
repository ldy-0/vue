import 'babel-polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'

import { Swiper as SwiperClass, Navigation, Pagination, Mousewheel, Autoplay } from 'swiper/swiper.esm'
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
SwiperClass.use([Navigation, Pagination, Mousewheel, Autoplay])

import 'swiper/swiper-bundle.css'

import {
  Image,
} from 'element-ui'
Vue.component(Image.name, Image);
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.use(getAwesomeSwiper(SwiperClass))

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
