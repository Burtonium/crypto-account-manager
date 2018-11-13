<template>
  <div>
    <div v-if="currentState === states.INITIAL">
      <h2>Create Order</h2>
      <form>
        <div class="form-group">
          <label>Symbol:</label>
          <v-select :options="symbols" v-model="symbol"/>
        </div>
        <div class="form-group">
          <label>Type:</label>
          <select class="form-control" v-model="orderType">
            <option value="limit">Margin Limit</option>
            <option value="market">Margin Market</option>
            <option value="stop">Margin Stop</option>
            <option value="trailing-stop">Margin Trailing-Stop</option>
            <option value="fill-or-kill">Margin Fill or Kill</option>
            <option value="exchange limit">Exchange Limit</option>
            <option value="exchange stop">Exchange Stop</option>
            <option value="exchange trailing-stop">Exchange Trailing-Stop</option>
            <option value="exchange fill-or-kill">Exchange Fill or Kill</option>
          </select>
        </div>
        <div class="row form-group">
          <div class="col-sm-4">
            <input class="form-control" type="number" v-model="amount" placeholder="Amount %" min="0" max="100">
          </div>
          <div class="col-sm-4">
            <input class="form-control" type="number" v-model="price" placeholder="Price">
          </div>
        </div>
        <div class="row form-group">
          <div class="col-sm-3">
            <div class="form-check mt-1">
              <input class="form-check-input" type="checkbox" v-model="isHidden" id="isHiddenCheck">
              <label class="form-check-label" for="isHiddenCheck">
                Is hidden
              </label>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="form-check mt-1">
              <input class="form-check-input" type="checkbox" v-model="isPostOnly" id="isPostOnly">
              <label class="form-check-label" for="isPostOnly">
                Post only
              </label>
            </div>
          </div>
          <div class="col-sm-3 offset-sm-3">
            <button class="btn btn-primary" @click="calculateAmounts">Submit</button>
          </div>
        </div>
      </form>
    </div>
    <div v-if="currentState === states.FETCHING_BALANCES">
      Fetching balances...
    </div>
    <div v-if="currentState === states.AMOUNTS_CALCULATED">
      <table class="table">
        <tr v-for="accountAmount in accountAmounts">
          <td>{{ accountAmount.label }}</td>
          <td>{{ accountAmount.amount }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { bitfinex } from 'ccxt';
const Bitfinex = bitfinex;

const states = {
  INITIAL: 0,
  FETCHING_BALANCES: 1,
  AMOUNTS_CALCULATED: 2,
  ORDERS_PROCESSING: 3,
  ERROR: 4,
};

const orderTypes = [{
  label: 'Margin Limit',
  key: 'limit',
  type: 'margin',
}, {
  label: 'Margin Stop',
  key: 'stop',
  type: 'margin',
}, {
  label: 'Margin Market',
  key: 'market',
  type: 'margin',
}, {
  label: 'Margin Trailing-Stop',
  key: 'trailing-stop',
  type: 'margin',
}, {
  label: 'Margin Fill or Kill',
  key: 'fill-or-kill',
  type: 'margin',
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
      symbols: [],
      currentState: 0,
      accountAmounts: [],
      symbol: 'btcusd',
      orderType: 'limit',
      isHidden: false,
      isPostOnly: false,
      price: null,
      amount: null,
    };
  },
  computed: {
    ...mapGetters('Accounts', ['accounts']),
    accountsOptions() {
      return this.accounts.map(a => ({ value: a.id, label: a.label }));
    },
    states: () => states,
    orderTypes: () => orderTypes,
  },
  methods: {
    async calculateAmounts() {
      this.accounts.map(async (a) => {
        const bfx = new Bitfinex({
          secret: a.apiSecret,
          enableRateLimit: true,
          proxy: 'https://cors-anywhere.herokuapp.com/',
        });
        await bfx.loadMarkets();
        const balances = await bfx.fetchBalance();
        console.log(balances);
        return 1;
      });
      this.currentState = states.FETCHING_BALANCES;
    },
  },
  mounted() {
    const bfx = new Bitfinex({ proxy: 'https://cors-anywhere.herokuapp.com/' });
  },
};
</script>
