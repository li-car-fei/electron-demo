import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Details from '../views/Details.vue'
import Todo_detail from '../views/Todo_detail.vue'
import Search from '../views/Search'
import LandingPage from '../components/LandingPage.vue'
import Translate from '../views/Translate'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/details',
      name: 'details',
      component: Details
    },
    {
      path: '/todo_detail/:id',
      name: 'todo_detail',
      component: Todo_detail
    },
    {
      path: '/search',
      name: 'search_todo',
      component: Search
    },
    {
      path: '/ocr',
      name: 'landing-page',
      component: LandingPage
    },
    {
      path: '/pdfRead/:url',
      name: 'pdfRead',
      component: require('@/components/pdf'),
      props: true
    },
    {
      path: '/ReadPdf/:url',
      name: 'ReadPdf',
      component: require('@/components/pdfRead'),
      props: true
    },
    {
      path: '/translate',
      name: 'translate',
      component: Translate
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});

//跳转前设置title
router.beforeEach((to, from, next) => {
  window.document.title = to.name;
  next();
});

export default router
