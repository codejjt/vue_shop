import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('../views/login/Login.vue')
const Home = () => import('../views/home/Home')
const Welcome = () => import('../views/welcome/Welcome')
const Users = () => import('../views/users/Users')

  const routes = [
    {
      path: '/',
      redirect: 'Login'
    },
    {
      path: '/Login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        }
      ]
    }
  ]

const router = new VueRouter({
  routes,
  mode: 'history'
})


router.beforeEach((to, from, next) => {

  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next 是一个函数，表示放行
  //next() 放行    next('/login') 强制跳转

  if (to.path == '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
