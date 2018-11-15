<template>
    <div class="account-list">
      <h2 class="float-left">Orders</h2>
      <button class="btn btn-primary float-right" @click="clearAll">Clear all</button>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>
              Order id
            </th>
            <th>
              Order count
            </th>
            <th>
              Timestamp
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders">
            <td>{{ order.id }}</td>
            <td>{{ order.completedOrders.length }}</td>
            <td>{{ order.timestamp }}</td>
            <td><router-link :to="`orders/${order.id}`">View</router-link></td>
          </tr>
        </tbody>
      </table>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'orders-list',
  data() {
    return {
      label: '',
      selectedAccount: null,
    };
  },
  computed: mapGetters('Orders', ['orders']),
  methods: mapActions('Orders', ['deleteOrder', 'clearAll']),
};
</script>

<style>

</style>
