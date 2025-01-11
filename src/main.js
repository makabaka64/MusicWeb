import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores/index'
import { Icon } from '@iconify/vue'
import 'element-plus/dist/index.css'
import './assets/styles/global.css'

const app = createApp(App)
app.component('yin-icon', Icon)
app.use(router)
app.use(pinia)
app.mount('#app')
