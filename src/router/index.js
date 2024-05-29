import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
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

// 登录访问拦截 =>默认直接放行的
// 根据返回值决定，是放行还是拦截返回值：
// 1.undefined /true 直接放行
// 2.false 拦回from的地址页面
// 3.具体路径或路径对象 拦截到对应的地址去
// ‘/login’{name:'login'}

router.beforeEach((to) => {
  // 、如果没有token访问的非登录页 兰姐登录，其他情况正常放行
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') return '/login'
})
export default router
