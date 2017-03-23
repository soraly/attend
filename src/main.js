

/* 项目启动 */
import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'

import './css/weui.min.css'
import './css/reset.css'
import './css/iconfont.css'

new Vue({
  render: h => h(App)
  // components: { firstcomponent, secondcomponent }
}).$mount('#app')