<template>
  <div class="add-account">
    <h2>Add Account</h2>
    <form>
      <div class="form-group">
        <input type="text" class="form-control" placeholder="Label" v-model="account.label">
      </div>
      <div class="form-group">
        <label>Exchange:</label>
        <select class="form-control">
          <option value="bitfinex">Bitfinex</option>
        </select>
      </div>
      <div class="form-group">
        <input type="text" class="form-control" placeholder="Api key" v-model="account.apiKey">
      </div>
      <div class="form-group">
        <input type="text" class="form-control" placeholder="Secret" v-model="account.apiSecret">
      </div>
      <button type="submit" class="btn btn-primary mb-2" @click="handleAddAccount">Add Account</button>
    </form>
  </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      account: {
        apiKey: '',
        secret: '',
        label: '',
      },
    };
  },
  methods: {
    ...mapActions('Accounts', ['addAccount']),
    handleAddAccount() {
      this.addAccount(this.account);
      this.clearFields();
    },
    clearFields() {
      this.apiKey = '';
      this.secret = '';
      this.label = '';
    },
  },
};
</script>
