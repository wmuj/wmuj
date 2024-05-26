import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
// import { useUserStore } from './modules/user'
// import { useCountStore } from './modules/counter'
// export { useCountStore }
// export { useUserStore }
export * from './modules/user' //接受user模块的全部按需导入这里导出
export * from './modules/counter'
