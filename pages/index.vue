<template>
  <a-flex class="statistic" justify="space-evenly" gap="small" wrap="wrap">
    <a-card class="stat-card">
      <a-statistic title="Total" :value="112893" style="margin-right: 50px"/>
    </a-card>
    <a-card class="stat-card">
      <a-table :columns="depositColumns">
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'action'">
            <a>Delete</a>
          </template>
        </template>
        <template #expandedRowRender="{ record }">
          <p style="margin: 0">

          </p>
        </template>
        <template #expandColumnTitle>

        </template>
      </a-table>
    </a-card>
  </a-flex>
  <a-flex class="statistic" justify="space-evenly" gap="small" wrap="wrap">
    <a-card class="stat-card">
      <a-statistic title="Bank IN" :value="112893" style="margin-right: 50px"/>
      <a-table :columns="bankAccountColumns">
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'action'">
            <a>Delete</a>
          </template>
        </template>
        <template #expandedRowRender="{ record }">
          <p style="margin: 0">

          </p>
        </template>
        <template #expandColumnTitle>

        </template>
      </a-table>
    </a-card>
    <a-card class="stat-card">
      <a-statistic title="Bank OUT" :value="112893" style="margin-right: 50px"/>
      <a-table :columns="bankAccountColumns">
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'action'">
            <a-switch v-model:checked="checked" />
          </template>
        </template>
      </a-table>
    </a-card>
  </a-flex>
  <a-flex class="statistic" justify="space-evenly" gap="small" wrap="wrap">
    <a-card class="stat-card">
      <template #title>Latest IN Transaction History</template>
      <a-table :columns="latestTransactionHistoryColumns" :data-source="latestInTransactions">
      </a-table>
    </a-card>
    <a-card class="stat-card">
      <template #title>Latest OUT Transaction History</template>
      <a-table :columns="latestTransactionHistoryColumns" :data-source="latestOutTransactions">
      </a-table>
    </a-card>
  </a-flex>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { useRuntimeConfig } from '#app'
let intervalId: number | undefined;

const checked = ref<boolean>(false);
const config = useRuntimeConfig()
const apiUrl = config.public.apiBase

const depositColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
  { title: 'Action', key: 'action' },
];
const bankAccountColumns = [
  {title: 'Account Number', dataIndex: 'account_number', key: 'account_number'},
  {title: 'Bank Name', dataIndex: 'bank_name', key: 'bank_name'},
  {title: 'Balance', dataIndex: 'balance', key: 'balance'},
  {title: 'User', dataIndex: 'user', key: 'user'},
  {title: 'Last Update', dataIndex: 'updated_at', key: 'updated_at'},
  { title: 'Action', key: 'action' },
]
const latestTransactionHistoryColumns = [
  {title: 'Account Number', dataIndex: 'account_number', key: 'account_number'},
  {title: 'Reference Number', dataIndex: 'transaction_number', key: 'transaction_number'},
  {title: 'Amount', dataIndex: 'amount', key: 'amount'},
  {title: 'Date', dataIndex: 'created_at', key: 'created_at'},
  {title: 'Memo', dataIndex: 'description', key: 'description'},
]

let latestInTransactions = ref([]);
let latestOutTransactions = ref([]);

const fetchLatestTransactions = async () => {
  try {
    const response = await axios.get(`${apiUrl}/bank/update_transaction_history`); // Replace with your API endpoint
    latestInTransactions = response.data.in;
    latestOutTransactions = response.data.out
    console.log(response.data)
  } catch (error) {
    console.error('Error fetching deposit data:', error);
  }
};

</script>

<style scoped>
.statistic {
  margin-top: 20px;
}
.stat-card {
  width: 600px;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .stat-card {
    width: 100%; /* Take full width on mobile */
  }
}
</style>