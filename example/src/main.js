import Vue from 'vue'
import T from 'T'
import AMAP from 'AMap'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

console.log(T)
console.log(AMAP)
