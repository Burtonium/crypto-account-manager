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
      path: '/orders',
      name: 'orders',
      component: require('@/components/pages/OrdersPage').default,
    },
    {
      path: '/orders/:orderId',
      name: 'view-order',
      component: require('@/components/pages/ViewOrderPage').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
