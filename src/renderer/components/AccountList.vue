<template>
    <div class="account-list">
      <h2>Accounts</h2>
      <ul>
        <li v-for="account in accounts">
          {{ account.label }} <a href @click="deleteAccount(account.id)">delete</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'landing-page',
  data() {
    return {
      label: '',
      types: ['bitfinex'],
      selectedAccount: null,
    };
  },
  computed: mapGetters('Accounts', ['accounts']),
  methods: mapActions('Accounts', ['deleteAccount']),
};
</script>

<style>

</style>
