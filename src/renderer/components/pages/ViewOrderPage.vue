<template>
  <div class="container mt-3">
    <div v-if="order">
      <h2>Order Details</h2>
      <p>
        Order id: {{ order.id }}<br>
        Timestamp: {{ order.timestamp }}
      </p>
      <h2>Orders</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Account</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in order.completedOrders">
            <td>{{ order.id || 'N/A' }}</td>
            <td>{{ order.account.label }}</td>
            <td>{{ order.error ? `Error: ${order.error}` : order.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      Order not found
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters('Orders', ['orders']),
    order() {
      return this.orders.find(o => o.id === parseInt(this.$route.params.orderId, 10));
    },
  },
};
</script>
