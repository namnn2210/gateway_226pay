<template>
  <div>
    <a-flex justify="center">
      <a-card class="report-card" title="Report">
        <a-tabs v-model:activeKey="activeKey" centered>
          <a-tab-pane key="1">
            <template #tab>
              <span>
                <apple-outlined />
                General Report
              </span>
            </template>
          </a-tab-pane>
          <a-tab-pane key="2">
            <template #tab>
              <span>
                <android-outlined />
                User Report
              </span>
            </template>
            <a-table :columns="userReport" :data-source="userReportList" style="font-size: 12px;">
              
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-flex>

    <!-- Modal for Bank Account Details -->
    <a-modal v-model:open="isModalVisible" :width="1000" :title="`Transaction History - ${selectedAccountNumber}`" @ok="handleOk" @cancel="handleCancel">
      <a-input-search v-model:value="searchQuery" placeholder="Search..." @input="filterTransactionHistory" style="margin-bottom: 16px;" />
      <a-row :gutter="24">
        <a-col :span="12">
          <b>Tổng số kết quả: </b> {{ totalResultsCount }}
        </a-col>
        <a-col :span="12">
          <b>Tổng số tiền: </b> {{ totalAmount }}
        </a-col>
      </a-row>
      <a-table :columns="transactionHistory" :data-source="filteredTransactionHistory" style="font-size: 12px;">
        <template #empty>
          <div v-if="loading">Loading...</div>
          <div v-else>No transaction history available.</div>
        </template>
      </a-table>
    </a-modal>

    <a-modal v-model:open="payoutModalVisible" :width="1000" title="Chi tiết" @ok="handlePayoutModalOk" @cancel="handlePayoutModalOk">
      <a-table :columns="workingHistory" :data-source="workingHistoryList" style="font-size: 12px;">
        
      </a-table>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, h } from 'vue';
import { useRuntimeConfig } from '#app';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

const activeKey = ref('1')
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;
const authStore = useAuthStore();
let isModalVisible = ref(false);
let payoutModalVisible = ref(false);
let selectedPayoutDetails = ref({});
let selectedAccountDetails = ref('');
let selectedAccountNumber = ref('');
let transactionHistoryList = ref([]);
let workingHistoryList = ref([])
let userReportList = ref([]);
let loading = ref(false);
let searchQuery = ref(''); 

onMounted(async () => {
  authStore.loadUserFromLocalStorage();
  await fetchUserReport();
});

const totalResultsCount = computed(() => filteredTransactionHistory.value.length);
const totalAmount = computed(() => {
  return filteredTransactionHistory.value.reduce((sum, transaction) => {
    return sum + (transaction.amount || 0); // Sum the amounts
  }, 0);
});

const filteredTransactionHistory = computed(() => {
  if (!searchQuery.value) {
    return transactionHistoryList.value;
  }
  return transactionHistoryList.value.filter(transaction =>
    Object.values(transaction).some(value =>
      String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

const transactionHistory = [
  { title: 'Số tài khoản', dataIndex: 'account_number', key: 'account_number_1' },
  { title: 'Mã giao dịch', dataIndex: 'transaction_number', key: 'transaction_number' },
  { 
    title: 'Số tiền', 
    dataIndex: 'amount', 
    key: 'amount', 
    customRender: ({ text, record }) => {
      const color = record.transaction_type === 'IN' ? 'green' : 'red';
      return h('span', { style: { color } }, Intl.NumberFormat().format(text));
    } 
  },
  { title: 'Ngày giao dịch', dataIndex: 'transaction_date', key: 'transaction_date' },
  { title: 'Nội dung', dataIndex: 'description', key: 'description' },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
];

const workingHistory = [
  {
    title: 'Bắt đầu', 
    dataIndex: 'start_time',
    key: 'start_time',
    customRender: ({ text }) => {
      return dayjs(text).format('DD/MM/YYYY HH:mm:ss'); // Format the date
    } 
  },
  {
    title: 'Kết thúc', 
    dataIndex: 'end_time',
    key: 'end_time',
    customRender: ({ text }) => {
      return dayjs(text).format('DD/MM/YYYY HH:mm:ss'); // Format the date
    } 
  },
  { 
    title: 'Số tiền bắt đầu', 
    dataIndex: 'start_balance', 
    key: 'start_balance',
    customRender: ({ text }) => {
      return Intl.NumberFormat().format(text);
    }  
  },
  { 
    title: 'Số tiền nạp', 
    dataIndex: 'deposit', 
    key: 'deposit',
    customRender: ({ text }) => {
      return Intl.NumberFormat().format(text);
    }  
  },
  { 
    title: 'Số tiền nạp', 
    dataIndex: 'deposit', 
    key: 'deposit',
    customRender: ({ text }) => {
      return Intl.NumberFormat().format(text);
    }  
  },
]

const userReport = [
  {title:'#', dataIndex:'user', key:'user'},
  {
    title:'User', 
    dataIndex:'user', 
    key:'user',
    customRender: ({ record }) => {
      return record.user.username
    },
  },
  {
    title:'Bank Accounts', 
    dataIndex:'bank_accounts', 
    key:'bank_accounts',
    customRender: ({ record }) => {
      return h('ul', {}, record.bank_accounts.map(account => 
        h('li', {}, 
          h('a', {
            href: '#',
            onClick: (e) => {
              e.preventDefault();
              openModal(account);
            }
          }, `${account.account_number} - ${account.bank_name.name} - ${account.bank_type} - ${Intl.NumberFormat().format(account.balance)}`)
        )
      ));
    },
  },
  {
    title:'Lịch sử hoạt động', 
    dataIndex:'history', 
    key:'history',
    customRender: ({ record }) => {
      return h('a', {
        href: '#',
        onClick: (e) => {
          e.preventDefault();
          openPayoutModal(record);  // Open modal on click
        }
      }, 'Chi tiết');
    }
  }
]

const openModal = async (account) => {
  selectedAccountDetails.value = `${account.account_number} - ${account.bank_name} - ${account.bank_type} - $${account.balance.toFixed(2)}`;
  selectedAccountNumber.value = `${account.account_number}`
  isModalVisible.value = true;
  console.log('before fetch history', account.account_number)
  await fetchTransactionHistory(account.account_number);
};

const openPayoutModal = async (record) => {
  payoutModalVisible.value = true; // Show modal
  console.log(record);
  await fetchWorkingHistory(record.user.username)
};

const handleOk = () => {
  isModalVisible.value = false;
};

const handlePayoutModalOk = () => {
  payoutModalVisible.value = false;
};

const handleCancel = () => {
  isModalVisible.value = false;
};

const fetchUserReport = async () => {
  const accessToken = localStorage.getItem('token');
  try {
    const response = await axios.get(`${apiUrl}/report/report_all`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,  // Include access token in headers
      },
    });

    userReportList.value = response.data.user_data;
    console.log(response.data.user_data)

  } catch (error) {
    console.error('Error fetching employee deposit:', error);
  }
};

const fetchTransactionHistory = async (accountNumber) => {
  const accessToken = localStorage.getItem('token');
  
  loading.value = true;
  try {
    console.log(accountNumber)
    let accountNumberPostData = {
      account_no: accountNumber
    }
    console.log(accountNumberPostData)
    const response = await axios.post(
      `${apiUrl}/bank/record_book_report`,
      accountNumberPostData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,  // Include access token in headers
      },
    });

    console.log(response.data)
    transactionHistoryList.value = response.data.transactions;  // Assuming the response has a `transactions` array
    loading.value = false;

  } catch (error) {
    console.error('Error fetching transaction history:', error);
    message.error('Failed to fetch transaction history');
    loading.value = false;
  }
};

const fetchWorkingHistory = async (username) => {
  const accessToken = localStorage.getItem('token');

  try {
    const params = new URLSearchParams({
      username: username, // Use the start date
    });

    const response = await axios.get(
      `${apiUrl}/report/report_payout_by_user`,
      {
      headers: {
        Authorization: `Bearer ${accessToken}`,  // Include access token in headers
      },
      params
    });

    workingHistoryList.value = response.data.data.report_data

  } catch (error) {
    console.error('Error fetching transaction history:', error);
    message.error('Failed to fetch transaction history');
  }
}

</script>

<style>
.report-card {
  width: 1200px;
  margin-top: 20px;
}
ul {
  padding-left: 0;
  list-style-type: none;
}

li {
  margin-bottom: 4px;
}
</style>