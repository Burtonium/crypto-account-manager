<template>
  <div class="container mt-3">
    <add-account-form />
    <account-list />
  </div>
</template>
<script>
import AddAccountForm from '@/components/forms/AddAccountForm';
import AccountList from '@/components/AccountList';

export default {
  components: {
    AddAccountForm,
    AccountList,
  },
};
</script>
