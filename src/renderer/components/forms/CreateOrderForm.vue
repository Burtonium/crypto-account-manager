<template>
  <div>
    <div v-if="currentState === states.INITIAL">
      <h2>Create Order</h2>
      <form>
        <div class="form-group">
          <label>Symbol:</label>
          <v-select :options="symbols" v-model="symbol"/>
        </div>
        <div class="row">
          <div class="form-group col-sm-6">
            <label>Type:</label>
            <select class="form-control" v-model="orderTypeIndex">
              <template v-for="(orderType, index) of orderTypes">
                <option :value="index">{{ orderType.label }}</option>
              </template>
            </select>
          </div>
          <div class="form-group col-sm-6">
            <label>Side:</label>
            <select class="form-control" v-model="side">
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
        </div>
        <div class="row form-group">
          <div class="col-sm-4">
            <input class="form-control" type="number" v-model="percent" placeholder="Amount %" min="0" max="100">
          </div>
          <div class="col-sm-4">
            <input class="form-control" type="number" v-model="price" placeholder="Price">
          </div>

          <div class="col-sm-4">
            <button class="btn btn-primary float-right" @click="calculateAmounts">Submit</button>
          </div>
        </div>
      </form>
    </div>
    <div v-if="currentState === states.FETCHING_BALANCES">
      Fetching balances...
    </div>
    <div v-if="currentState === states.AMOUNTS_CALCULATED">
      <h2>Order Details</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Account</th>
            <th>Amount</th>
            <th>Order Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pendingOrder in pendingOrders">
            <td>{{ pendingOrder.account.label }}</td>
            <td v-if="!pendingOrder.error">{{ pendingOrder.amount }} {{ market.base }}</td>
            <td class="text-danger" v-else>{{ pendingOrder.error.message }}</td>
            <td :class="orderStatusClass(pendingOrder.status)">{{ pendingOrder.status }}</td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-outline-default" @click="currentState = states.INITIAL">
        Back
      </button>
      <button class="btn btn-primary float-right" @click="submitOrders">Submit</button>
    </div>
    <div v-if="currentState === states.ORDERS_PROCESSING">
      Processing orders...
    </div>
    <div v-if="currentState === states.COMPLETED">
      <h2>Completed Orders</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Account</th>
            <th>Amount</th>
            <th>Order Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="completedOrder in completedOrders">
            <td>{{ completedOrder.account.label }}</td>
            <td v-if="!completedOrder.error">{{ completedOrder.amount }} {{ market.base }}</td>
            <td class="text-danger" v-else>{{ completedOrder.error.message }}</td>
            <td :class="orderStatusClass(completedOrder.status)">{{ completedOrder.status }}</td>
          </tr>
        </tbody>
      </table>

      <button class="btn btn-outline-default" @click="currentState = states.INITIAL">
        Back
      </button>
    </div>
    <div v-if="currentState === states.ERROR">
      ERROR

      <button class="btn btn-outline-default" @click="currentState = states.INITIAL">
        Back
      </button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

const states = {
  INITIAL: 0,
  FETCHING_BALANCES: 1,
  AMOUNTS_CALCULATED: 2,
  ORDERS_PROCESSING: 3,
  COMPLETED: 4,
  ERROR: 5,
};

const orderStatuses = {
  READY: 'Ready',
  PROCESSING: 'Processing',
  SUCCESS: 'Success',
  ERROR: 'Error',
  INVALID: 'Invalid Order',
};

const orderTypes = [{
  label: 'Margin Limit',
  key: 'limit',
  type: 'trading',
}, {
  label: 'Margin Stop',
  key: 'stop',
  type: 'trading',
}, {
  label: 'Margin Market',
  key: 'market',
  type: 'trading',
}, {
  label: 'Margin Trailing-Stop',
  key: 'trailing-stop',
  type: 'trading',
}, {
  label: 'Margin Fill or Kill',
  key: 'fill-or-kill',
  type: 'trading',
}, {
  label: 'Exchange Limit',
  key: 'exchange limit',
  type: 'exchange',
}, {
  label: 'Exchange Stop',
  key: 'exchange stop',
  type: 'exchange',
}, {
  label: 'Exchange Trailing Stop',
  key: 'exchange trailing-stop',
  type: 'exchange',
}, {
  label: 'Exchange Fill or Kill',
  key: 'exchange fill-or-kill',
  type: 'exchange',
}];

export default {
  data() {
    return {
      side: 'buy',
      symbols: ['Loading...'],
      currentState: 0,
      pendingOrders: [],
      symbol: '',
      market: {},
      orderTypeIndex: 0,
      isHidden: false,
      isPostOnly: false,
      price: null,
      percent: null,
      completedOrders: [],
    };
  },
  computed: {
    ...mapGetters('Accounts', ['accounts']),
    accountsOptions() {
      return this.accounts.map(a => ({ value: a.id, label: a.label }));
    },
    states: () => states,
    orderTypes: () => orderTypes,
    orderStatuses: () => orderStatuses,
  },
  methods: {
    ...mapActions('Orders', ['addOrder']),
    async calculateAmounts() {
      this.currentState = states.FETCHING_BALANCES;
      const orderType = this.orderTypes[this.orderTypeIndex];
      this.market = this.$bfx.markets[this.symbol];
      const pendingOrders = [];
      for (let i = 0; i < this.accounts.length; i++) { /* eslint-disable-line */
        const account = this.accounts[i];
        this.$bfx.apiKey = account.apiKey;
        this.$bfx.secret = account.apiSecret;

        const response = await this.$bfx.fetchBalance() /* eslint-disable-line */
          .catch((error) => {
            pendingOrders.push({
              account,
              error,
              status: orderStatuses.ERROR,
            });
          });

        if (response && response.info) {
          const filtered = response.info.filter((i) => {
            const sameOrderType = i.type === orderType.type;
            const sameCurrency = i.currency.toUpperCase() === this.market.base;
            return sameOrderType && sameCurrency;
          });
          const pendingOrder = filtered.length === 1 ? {
            amount: filtered[0].available * (this.percent / 100),
            account,
            status: orderStatuses.READY,
          } : {
            amount: 0,
            account,
            status: orderStatuses.INVALID,
          };

          if (pendingOrder.amount === 0) {
            pendingOrder.status = orderStatuses.INVALID;
          }
          pendingOrders.push(pendingOrder);
        }
      }
      this.pendingOrders = pendingOrders;
      this.currentState = states.AMOUNTS_CALCULATED;
    },
    orderStatusClass(status) {
      let classes = '';
      if (status === orderStatuses.SUCCESS || status === orderStatuses.READY) {
        classes = 'text-success';
      } else if (status === orderStatuses.PROCESSING) {
        classes = 'text-warning';
      } else if (status === orderStatuses.ERROR || status === orderStatuses.INVALID) {
        classes = 'text-danger';
      }
      return classes;
    },
    async submitOrders() {
      this.currentState = states.ORDERS_PROCESSING;
      const readyOrders = this.pendingOrders.filter(o => o.status === orderStatuses.READY);
      const completedOrders = [];
      for (let i = 0; i < readyOrders.length; i++) { /* eslint-disable-line */
        const pendingOrder = readyOrders[i];
        const type = orderTypes[this.orderTypeIndex].key;
        let order = await this.$bfx.createOrder( /* eslint-disable-line */
          this.symbol,
          type,
          this.side,
          pendingOrder.amount,
          this.price,
          { type },
        ).catch((error) => {
          completedOrders.push({ error: error.message, account: pendingOrder.account });
        });
        if (order) {
          order.account = pendingOrder.account;
          completedOrders.push(order);
        }
      }

      this.addOrder({
        completedOrders,
        timestamp: new Date(),
      });
      this.completedOrders = completedOrders;
      this.currentState = states.COMPLETED;
    },
  },
  async mounted() {
    await this.$bfx.loadMarkets();
    this.symbols = this.$bfx.symbols;
  },
};
</script>
