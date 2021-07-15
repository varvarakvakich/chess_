import Vue from 'vue'
import App from './App.vue'
import router from './router';
import './styles/common.css'
import './styles/modal-window.css'
import './styles/button.css'
import './styles/board.css'
import './styles/board-cell.css'

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
