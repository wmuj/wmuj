import { createRouter, createWebHistory } from 'vue-router'

// createRouter 用于创建路由实例
// 配置history模式
// 1.history模式:createWebHistory 地址栏不带#
//2.hash模式: createwebhashhistory 地址栏带#

// console.log(import.meta.env.DEV)
// vite 中的环境变量 import.meta.env.BASE_URL 就是vite.config.js 中的base配置项
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }, //异步写法 登录页
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/AriticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/AriticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

export default router
