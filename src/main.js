import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores/index'
import { Icon } from '@iconify/vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'element-plus/dist/index.css'
import './assets/styles/global.css'

const app = createApp(App)
pinia.use(piniaPluginPersistedstate) // 注册持久化插件

app.component('yin-icon', Icon)
app.use(router)
app.use(pinia)
app.mount('#app')
