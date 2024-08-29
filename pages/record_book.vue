<template>
  <div>
    <a-flex justify="center">
      <a-card class="record-card" title="Record Book">
        <a-form
          :model="formState"
          name="record_search"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
          class="record-form"
        >
          <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item name="search" label="Search">
              <a-input v-model:value="formState[`text`]" placeholder="Search" style="width: 100%"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="start_end_date" label="Choose Date">
              <a-range-picker
                v-model:value="formState['start_end_date']"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-button :loading="loading" type="primary" html-type="submit" :icon="h(SearchOutlined)" block>Search</a-button>
        </a-form>
        <a-row class="result-table" :gutter="24">
          <a-col :span="12">
            <a-table 
              :columns="transactionHistoryColumns" 
              :data-source="inTransactions" 
              class="table-wrapper"
              size="middle" 
              rowKey="transaction_number"
              :expandedRowKeys="expandedRowKeyIn ? [expandedRowKeyIn] : []"
              @expand="onExpandIn"
              style="font-size: 11px;"
            >
                <template #expandedRowRender="{ record }">
                  <a-flex justify="flex-start" gap="middle" align="center">
                  
                    <a-flex vertical style="font-size: 11px;">
                      <p>
                        <b>Transaction Number: </b> {{ record.transaction_number }}
                      </p>
                      <p>
                        <b>Memo: </b> {{ record.description }}
                      </p>
                    </a-flex>
                  
                  </a-flex>
                </template>
                <template #expandColumnTitle>
                  
                </template>
            </a-table>
          </a-col>
          <a-col :span="12">
            <a-table 
              :columns="transactionHistoryColumns" 
              :data-source="outTransactions" 
              class="table-wrapper"
              size="middle" 
              rowKey="transaction_number"
              :expandedRowKeys="expandedRowKeyOut ? [expandedRowKeyOut] : []"
              @expand="onExpandOut"
              style="font-size: 11px;"
            >
              <template #expandedRowRender="{ record }">
                <a-flex justify="flex-start" gap="middle" align="center">
                  <a-flex vertical style="font-size: 11px;">
                      <p>
                        <b>Transaction Number: </b> {{ record.transaction_number }}
                      </p>
                      <p>
                        <b>Memo: </b> {{ record.description }}
                      </p>
                    </a-flex>
                  
                </a-flex>
              </template>
              <template #expandColumnTitle>
                
              </template>
            </a-table>
          </a-col>
        </a-row>
      </a-card>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import dayjs from 'dayjs';
import { reactive, ref, onMounted, createVNode, h } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useRuntimeConfig } from '#app';
import { useAuthStore } from '@/stores/auth';

const loading = ref(false);
const authStore = useAuthStore();
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;
const expandedRowKeyIn = ref<string | null>(null); // Stores the expanded row's key
const expandedRowKeyOut = ref<string | null>(null); // Stores the expanded row's key

let inTransactions = ref([]);
let outTransactions = ref([]);

const formState = reactive({
  start_end_date: 
  [
    dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'),  
    dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')     
  ],
  text: '',
});

const onExpandIn = (expanded: boolean, record: any) => {
  if (expanded) {
    expandedRowKeyIn.value = record.transaction_number;  // Expand the clicked row
  } else {
    expandedRowKeyIn.value = null;  // Collapse the row if already expanded
  }
};

const onExpandOut = (expanded: boolean, record: any) => {
  if (expanded) {
    expandedRowKeyOut.value = record.transaction_number;  // Expand the clicked row
  } else {
    expandedRowKeyOut.value = null;  // Collapse the row if already expanded
  }
};

const transactionHistoryColumns = [
  { title: 'Account Number', dataIndex: 'account_number', key: 'account_number_1' },
  { 
    title: 'Amount', 
    dataIndex: 'amount', 
    key: 'amount', 
    customRender: ({ text, record }) => {
      const color = record.transaction_type === 'IN' ? 'green' : 'red';
      return h('span', { style: { color } }, Intl.NumberFormat().format(text));
    } 
  },
  { 
    title: 'Date', 
    dataIndex: 'transaction_date', 
    key: 'transaction_date',
    customRender: ({ text }) => {
      return dayjs(text).format('DD/MM/YYYY HH:mm:ss'); // Format the date
    }
  },
  { title: 'Transfer Code', dataIndex: 'transfer_code', key: 'transfer_code' },
  { title: 'Memo', dataIndex: 'description', key: 'description' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
]

const onFinish = async (values: any) => {
  await fetchRecord();
  console.log('Success:', formState);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

onMounted(async () => {
  authStore.loadUserFromLocalStorage();
  await fetchRecord();
});

const fetchRecord = async () => {
  loading.value = true;
  try {
    const accessToken = localStorage.getItem('token'); // Ensure access token is retrieved
    const params = new URLSearchParams({
      start_datetime: formState.start_end_date[0], // Use the start date
      end_datetime: formState.start_end_date[1],   // Use the end date
      text: formState.text || '',              // Optional search text
    });

    const response = await axios.get(`${apiUrl}/bank/record_book`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include authorization header
      },
      params
    });

    inTransactions.value = response.data.data.in_transactions
    outTransactions.value = response.data.data.out_transactions
  } catch (error) {
    console.error('Error fetching payouts:', error);
  } finally {
    loading.value = false;  // Stop loading after the request finishes
  }
}
</script>

<style>
.record-card {
  width: 1500px;
}
.result-table {
  margin-top:20px;
}
</style>