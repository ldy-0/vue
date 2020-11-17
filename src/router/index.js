import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

let category = [
  {
    path: '/category',
    name: 'category',
    component: () => import('@/views/class/index.vue'),
    meta: {},
  },
];

let news = [
  {
    path: '/news',
    name: 'news',
    component: () => import('@/views/news/index.vue'),
    meta: {},
  },
  {
    path: '/news/detail',
    name: 'newsDetail',
    component: () => import('@/views/news/detail.vue'),
    meta: {},
  },
];

let about = [
  {
    path: '/platform',
    name: 'platform',
    component: () => import('@/views/about/platform.vue'),
    meta: {},
  },
  {
    path: '/about/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/about/about.vue')
  },
];

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },

  ...category,
  ...news,
  ...about,
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
