import { createRouter, createWebHistory } from 'vue-router'
import { userStore } from '@/store/userStore'
//Import views
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import SellerDashboard from '@/views/SellerDashboard.vue'
import Dashboard from '@/views/Dashboard.vue'
import Products from '@/views/Products.vue'
import ProductDetails from '@/views/ProductDetails.vue'



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
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, roles: ['SELLER'] }
  },
  {
    path: '/seller/dashboard',
    name: 'SellerDashboard',
    component: SellerDashboard,
    meta: { requiresAuth: true, roles: ['SELLER'] }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { requiresAuth: false}
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: {
      requiresAuth: true,
      roles: ['SELLER', 'SUPER_ADMIN']
    }
  },
  {
    path: "/product/:id",
    name: "ProductDetails",
    component: ProductDetails,
  },
   
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  console.log('in login')
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!user) {
      // Not authenticated, redirect to login
      showGlobalMessage('Please log in to access this page', 'warning');
      return next('/login');
    }
    
    // Check role-based access
    if (to.meta.roles && !to.meta.roles.includes(user.role)) {
      showGlobalMessage('You do not have permission to access this page', 'error');
      
      // Redirect to appropriate page based on role
      if (user.role === 'USER') {
        return next('/');
      } else {
        return next('/dashboard');
      }
    }
  } else if (user && to.path === '/login') {
    // User is already logged in and trying to access login page
    // Redirect to appropriate page based on role
    if (user.role === 'USER') {
      return next('/');
    } else {
      return next('/dashboard');
    }
  }
  
  next();
});

export default router