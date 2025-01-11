import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/MainLayout.vue'),
      redirect: '/recommend',
      children: [
        {
          path: '/recommend',
          component: () => import('@/views/RecommendMusic.vue')
        },
        {
          path: '/artist',
          component: () => import('@/views/singer/ArTist.vue')
        },
        {
          path: '/singer-detail/:id',
          component: () => import('@/views/singer/SingerDetail.vue')
        },
        {
          path: '/album',
          component: () => import('@/views/song-sheet/AlBum.vue')
        },
        {
          path: '/song-detail/:id',
          component: () => import('@/views/song-sheet/SongDetail.vue')
        },
        {
          path: '/mymusic',
          component: () => import('@/views/MyMusic.vue')
        },
        {
          path: '/toplist',
          component: () => import('@/views/TopList.vue')
        },
        {
          path: '/login',
          component: () => import('@/views/LoginPage.vue')
        },
        {
          path: '/setting',
          component: () => import('@/views/SettingPage.vue')
        }
      ]
    }
  ]
})

export default router
