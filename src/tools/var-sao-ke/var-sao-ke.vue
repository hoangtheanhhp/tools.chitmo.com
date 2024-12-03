<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface Transaction {
  date: Date
  amount: number
  notes: string | null
  code: string
  bank: string | null
}

const searchTerm = ref('');
const bank = ref('');
const code = ref('');
const date = ref(null);
const amount = ref(0);
const transactions = ref<Transaction[]>([]);

const columns = [
  { title: t('tools.var-sao-ke.amount'), key: 'amount' },
  { title: t('tools.var-sao-ke.date'), key: 'date' },
  { title: t('tools.var-sao-ke.notes'), key: 'notes' },
  { title: t('tools.var-sao-ke.code'), key: 'code' },
  { title: t('tools.var-sao-ke.bank'), key: 'bank' },
];

const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [5, 10, 20],
  total: 0,
  onChange: (page: number) => {
    paginationReactive.page = page;
    searchTransactions();
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize;
    paginationReactive.page = 1;
    searchTransactions();
  },
});

async function searchTransactions() {
  const queryParams = new URLSearchParams({
    searchTerm: searchTerm.value,
    bank: bank.value,
    code: code.value,
    date: date.value ? new Date(date.value).toISOString() : '',
    amount: amount.value.toString(),
    limit: paginationReactive.pageSize.toString(),
    page: paginationReactive.page.toString(),
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  fetch(`${apiUrl}/transaction?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then((data) => {
      transactions.value = data.transactions;
      paginationReactive.total = data.totalCount;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
</script>

<template>
  <n-form-item :label="$t('tools.var-sao-ke.searchTerm')">
    <n-input v-model:value="searchTerm" :placeholder="$t('tools.var-sao-ke.enterSearchTerm')" />
  </n-form-item>
  <n-form-item :label="$t('tools.var-sao-ke.bank')">
    <n-input v-model:value="bank" :placeholder="$t('tools.var-sao-ke.enterBankName')" />
  </n-form-item>
  <n-form-item :label="$t('tools.var-sao-ke.transactionCode')">
    <n-input v-model:value="code" :placeholder="$t('tools.var-sao-ke.enterTransactionCode')" />
  </n-form-item>
  <n-form-item :label="$t('tools.var-sao-ke.date')">
    <n-date-picker v-model:value="date" type="date" />
  </n-form-item>
  <n-form-item :label="$t('tools.var-sao-ke.amount')">
    <n-input-number v-model:value="amount" :placeholder="$t('tools.var-sao-ke.enterAmount')" />
  </n-form-item>
  <n-form-item>
    <n-button type="primary" @click="searchTransactions">
      {{ $t('search') }}
    </n-button>
  </n-form-item>
  <n-data-table
    :columns="columns"
    :data="transactions"
    :pagination="paginationReactive"
    :max-height="500"
  />
</template>
