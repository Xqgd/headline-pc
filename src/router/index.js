import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/',
    // name: 'layout',
    component: () => import('../views/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/home/index.vue')
      },
      {
        path: '/article',
        name: 'article',
        component: () => import('../views/article/index.vue')
      },
      {
        path: '/image',
        name: 'image',
        component: () => import('../views/image/index.vue')
      },
      {
        path: '/publish',
        name: 'publish',
        component: () => import('../views/publish/index.vue')
      },
      {
        path: '/comment',
        name: 'comment',
        component: () => import('../views/comment/index.vue')
      },
      {
        path: '/fans',
        name: 'fans',
        component: () => import('../views/fans/index.vue')
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('../views/settings/index.vue')
      },
    ]
  }
 
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 如果要访问的页面不是 /login，校验登录状态
  // 如果没有登录，则跳转到登录页面
  // 如果登录了，则允许通过
  // 允许通过
  // next()

  const user = JSON.parse(window.localStorage.getItem('user'))

  // 校验非登录页面的登录状态
  if (to.path !== '/login') {
    if (user) {
      // 已登录，允许通过
      next()
    } else {
      // 没有登录，跳转到登录页面
      next('/login')
    }
  } else {
    // 登录页面，正常允许通过
    next()
  }
})

export default router
