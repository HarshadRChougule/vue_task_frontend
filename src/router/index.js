import { createRouter, createWebHistory } from 'vue-router'
import { userStore } from '@/store/userStore'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import SellerDashboard from '@/views/SellerDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/seller/dashboard',
    name: 'SellerDashboard',
    component: SellerDashboard,
    meta: { requiresAuth: true, roles: ['SELLER'] }
  },
  {
    path: '/test',
    name: 'test',
    component: SellerDashboard,
    meta: { requiresAuth: true, roles: ['SELLER'] }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const user = userStore.user  // Use the userStore instead of localStorage

  if (requiresAuth && (!user || Object.keys(user).length === 0)) {
    console.log('Authentication required, redirecting to login')
    next('/login')
  } else if (requiresAuth && user) {
    if (to.meta.roles && !to.meta.roles.includes(user.role)) {
      console.log('Page Restricted: User does not have the required role')
      alert('Page Restricted: You do not have access to this page')
      next(from.path)
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router