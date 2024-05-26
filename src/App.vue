<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useUserStore, useCountStore } from './stores'
// 在vue3 compositionapi中
// 1.获取路由对象 router useRouter
// const router = useRouter()
// 2.获取路由参数 route useRoute
// const route = useRoute()
const router = useRouter()
const route = useRoute()
const goList = () => {
  router.push('/list')
  console.log(router, route)
}
const userStore = useUserStore()
const countStore = useCountStore()
</script>

<template>
  <div>
    <hr />
    <hr />
    <router-view></router-view>
    <hr />
    <hr />
    <hr />

    我是APP
    <test-demo></test-demo>
    <el-button @click="$router.push('/home')">跳首页</el-button>
    <el-button @click="goList">跳列表页</el-button>

    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>

    <p>{{ userStore.token }}</p>
    <el-button @click="userStore.setToken('2E3R34R4334')">登录</el-button>
    <el-button @click="userStore.removeToken('')">退出</el-button>
    <hr />
    <p>{{ countStore.count }}</p>
    <el-button @click="countStore.add(10)">加法</el-button>
  </div>
</template>

<style scoped></style>
