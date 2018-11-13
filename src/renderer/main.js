import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import '@/assets/scss/app.scss';
import vSelect from 'vue-select';

import App from './App';
import router from './router';
import store from './store';

Vue.component('v-select', vSelect);

Vue.use(BootstrapVue);
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
