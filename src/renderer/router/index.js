import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/accounts',
    },
    {
      path: '/order',
      name: 'order',
      component: require('@/components/pages/CreateOrderPage').default,
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: require('@/components/pages/AccountsPage').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
