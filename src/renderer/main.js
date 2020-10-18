import Vue from 'vue'
import App from './App.vue'
import router from './route/index'
import http from './http/http'
import Axios from 'axios'

//引入element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI) //使用elementUI

Vue.prototype.$http = http        // 绑定全局http

import store from './store/index'   // vuex store



Vue.config.productionTip = false
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'    // 放置electron安全信息

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
