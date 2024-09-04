<template>
  <a-flex class="statistic" gap="small" justify="space-evenly" wrap="wrap">
    <a-card class="stat-card">
      <a-statistic title="Tổng tiền" :value="totalFinal" style="margin-right: 50px"/>
      <a-row :gutter="18">
        <a-col :span="12">
          <a-statistic
            :value="amountIn"
            :precision="2"
            :value-style="{ color: '#3f8600' }"
            style="margin-right: 50px"
          >
            <template #prefix>
              <PlusOutlined />
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="12">
          <a-statistic
            :value="amountOut"
            :precision="2"
            :value-style="{ color: '#cf1322' }"
            style="margin-right: 50px"
          >
            <template #prefix>
              <MinusOutlined />
            </template>
          </a-statistic>
        </a-col>
      </a-row>
    </a-card>
    <a-card class="stat-card">
      <template v-if="authStore.user.is_superuser">
        <a-table 
        :columns="depositColumns" 
        :data-source="employeeDeposit" 
        class="table-wrapper"
        rowKey="id"
        :expandedRowKeys="expandedRowKey ? [expandedRowKey] : []"
        @expand="onExpand"
        style="font-size: 11px;">
        <template #expandedRowRender="{ record }">
          <a-flex justify="flex-start" gap="middle" align="center">
            
          </a-flex>
        </template>
        <template #expandColumnTitle>

        </template>
      </a-table>
      </template>
      <template v-else>
        <a-flex direction="column" gap="small" vertical>
          <!-- Create Deposit Request Button -->
          <a-button type="primary" @click="addDepositRequestModal">Tạo lệnh nạp tiền</a-button>
          
          <!-- Start/End Session Button -->
          <a-button 
            :type="sessionActive ? 'danger' : 'primary'" 
            :style="{ backgroundColor: sessionActive ? '#cf1322' : '#3f8600', borderColor: sessionActive ? '#cf1322' : '#3f8600' }"
            @click="toggleSession">
            {{ sessionActive ? 'Kết thúc phiên làm việc' : 'Bắt đầu phiên làm việc' }}
          </a-button>
        </a-flex>

        <!-- Confirm Start/End Session Modal -->
        <a-modal 
          v-model:open="isConfirmModalVisible" 
          :title="confirmAction === 'start' ? 'Bắt đầu phiên làm việc' : 'Kết thúc phiên làm việc'"
          :confirm-loading="confirmLoading" 
          @ok="handleConfirmOk" 
          @cancel="handleConfirmCancel">
          <p>Bạn có chắc muốn {{ confirmAction === 'start' ? 'bắt đầu' : 'kết thúc' }} phiên làm việc?</p>
        </a-modal>

        <!-- Add Deposit Modal -->
        <a-modal v-model:open="openDeposit" title="Add New Deposit" :confirm-loading="confirmDepositLoading" @ok="handleDepositOk">
          <AddDeposit @submit="handleDepositSubmit"/>
        </a-modal>
      </template>

    </a-card>
  </a-flex>

  <a-flex class="statistic" justify="space-evenly" wrap="wrap" gap="small">
    <!-- Bank IN Table -->
    <a-card class="stat-card">
      <a-flex wrap="wrap" justify="space-between" align="center">
        <a-statistic title="Ngân hàng VÀO" :value="totalIn" style="margin-right: 50px"/>
        <a-button type="primary" @click="addAccountModal">Thêm tài khoản</a-button>
        <a-modal v-model:open="open" title="Add New Bank Account" :confirm-loading="confirmLoading" @ok="handleOk">
          <AddBank @submit="handleFormSubmit"/>
        </a-modal>
      </a-flex>
      <a-table :columns="bankAccountColumns" :data-source="bankAccountsIn" class="table-wrapper" row-key="id" size="middle" style="font-size: 11px;">
        <template #bodyCell="{ column, record }">
          <!-- Switch for IN accounts -->
          <template v-if="column.key === 'action'">
            <a-switch :checked="record.isChecked" @change="(checked) => toggleSwitch(record, checked)" checked-children="ON" un-checked-children="OFF"/>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Bank OUT Table -->
    <a-card class="stat-card">
      <a-statistic title="Ngân hàng RA" :value="totalOut" style="margin-right: 50px"/>
      <a-table :columns="bankAccountColumns" :data-source="bankAccountsOut" class="table-wrapper" row-key="id" size="middle" style="font-size: 11px;">
        <template #bodyCell="{ column, record }">
          <!-- Switch for OUT accounts -->
          <template v-if="column.key === 'action'">
            <a-switch :checked="record.isChecked" @change="(checked) => toggleSwitch(record, checked)" checked-children="ON" un-checked-children="OFF"/>
          </template>
        </template>
      </a-table>
    </a-card>
  </a-flex>

  <a-flex class="statistic" justify="space-evenly" wrap="wrap" gap="small">
    <a-card class="stat-card">
      <template #title>Giao dịch VÀO gần nhất</template>
      <a-table :columns="latestTransactionHistoryColumns" :data-source="latestInTransactions" class="table-wrapper"
               size="middle" style="font-size: 11px;">
      </a-table>
    </a-card>
    <a-card class="stat-card">
      <template #title>Giao dịch RA gần nhất</template>
      <a-table :columns="latestTransactionHistoryColumns" :data-source="latestOutTransactions" class="table-wrapper"
               size="middle" style="font-size: 11px;">
      </a-table>
    </a-card>
  </a-flex>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, h } from 'vue';
import dayjs from 'dayjs';
import axios from 'axios';
import { useRuntimeConfig } from '#app';
import AddBank from '@/components/AddBank.vue'
import { useAuthStore } from '@/stores/auth';
import { Tag } from 'ant-design-vue';

let transactionIntervalId: number | undefined;
let depositIntervalId: number | undefined;
let bankAccountId: number | undefined;
let amountTotalId: number | undefined;
let latestInTransactions = ref([]);
let latestOutTransactions = ref([]);
let employeeDeposit = ref([]);
let bankAccountsIn = ref([]);
let bankAccountsOut = ref([]);
let totalIn = ref(0);
let totalOut = ref(0);
let totalFinal = ref(0)
let newBankAccountData = ref(null);
let newDepositData = ref(null);
let amountIn = ref(0);
let amountOut = ref(0);

const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;
const open = ref<boolean>(false);
const openDeposit = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const confirmDepositLoading = ref<boolean>(false);
const authStore = useAuthStore();
const expandedRowKey = ref<number | null>(null);

const sessionActive = ref(false);
const isConfirmModalVisible = ref(false);
const confirmAction = ref<'start' | 'end'>('start');

const toggleSession = () => {
  if (sessionActive.value) {
    confirmAction.value = 'end';
  } else {
    confirmAction.value = 'start';
  }
  isConfirmModalVisible.value = true;
};

const handleConfirmOk = async () => {
  confirmLoading.value = true;

  const accessToken = localStorage.getItem('token');
  const sessionType = confirmAction.value === 'start' ? 'start' : 'end';

  try {
    const response = await axios.post(`${apiUrl}/employee/employee_session/${sessionType}`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Check if the response status is 200
    if (response.status === 200) {
      // Toggle the session state after a successful API call
      sessionActive.value = !sessionActive.value;

      // Close the modal
      isConfirmModalVisible.value = false;
    } else {
      console.error(`Unexpected response status: ${response.status}`);
      // Optionally handle non-200 responses (e.g., show a notification)
    }

  } catch (error) {
    console.error(`Error during session ${sessionType}:`, error);
    // Handle the error (e.g., show a notification)
  } finally {
    confirmLoading.value = false;
  }
};



const handleConfirmCancel = () => {
  isConfirmModalVisible.value = false;
};

const onExpand = (expanded: boolean, record: any) => {
  if (expanded) {
    expandedRowKey.value = record.id;  // Expand the clicked row
  } else {
    expandedRowKey.value = null;  // Collapse the row if already expanded
  }
};

const addAccountModal = () => {
  open.value = true;
};

const addDepositRequestModal = () => {
  openDeposit.value = true;
}

const handleFormSubmit = (formData) => {
  newBankAccountData.value = formData;  // Store form data
  console.log('New Bank Account Data:', newBankAccountData.value);
};

const handleDepositSubmit = (formData) => {
  newDepositData.value = formData;
  console.log('New Deposite Data', newDepositData.value)
}

const handleOk = () => {
  confirmLoading.value = true;

  setTimeout(() => {
    open.value = false;
    confirmLoading.value = false;
  }, 2000);
};

// Add `isChecked` field to each account for individual switch control
const processBankAccounts = (accounts) => {
  return accounts.map(account => ({
    ...account,
    isChecked: account.status,  // Ensure `isChecked` is set
  }));
};

const depositColumns = [
  { 
    title: 'Người yêu cầu', 
    dataIndex: 'user', 
    key: 'user',
    customRender: ({ record }) => {
      return record.user.username
    },
  },
  { 
    title: 'Số tiền', 
    dataIndex: 'amount', 
    key: 'amount',
    customRender: ({ text }) => {
      return Intl.NumberFormat().format(text);
    }  
  },
  { 
    title: 'Trạng thái', 
    dataIndex: 'status', 
    key: 'status',
    customRender: ({ record }) => {
      const color = record.status ? 'green' : 'yellow';
      const text = record.status ? 'DONE' : 'PENDING';
      return h(Tag, { color }, { default: () => text });
    } 
  },
  { 
    title: 'Ngày khởi tạo', 
    dataIndex: 'created_at', 
    key: 'created_at',
    customRender: ({ text }) => {
      return dayjs(text).format('DD/MM/YYYY HH:mm:ss'); // Format the date
    } 
  },
];

const bankAccountColumns = [
  { 
    title: 'Số tài khoản', 
    dataIndex: 'account_number', 
    key: 'account_number',
    customRender: ({ record }) => {
      return h('div', [
        h('div', record.account_number), // Display account number
        h('div', { style: { fontSize: '11px', color: '#888', fontStyle: 'italic' } }, `(${record.account_name})`), // Display account name in italics
      ]);
    },
  },
  { 
    title: 'Ngân hàng', 
    dataIndex: 'bank_name', 
    key: 'bank_name',
    customRender: ({ record }) => {
      return record.bank_name.name;
    },
  },
  { 
    title: 'Số dư', 
    dataIndex: 'balance', 
    key: 'balance', 
    customRender: ({ text, record }) => {
      const color = record.bank_type === 'IN' ? 'green' : 'red'; // Conditional color based on bank_type
      return h('span', { style: { color } }, Intl.NumberFormat().format(text)); // Format balance with commas
    }
  },
  { 
    title: 'Người dùng', 
    dataIndex: 'user', 
    key: 'user',
    customRender: ({ record }) => {
      return record.user.username;
    },
  },
  { 
    title: 'Cập nhật gần nhất', 
    dataIndex: 'updated_at', 
    key: 'updated_at',
    customRender: ({ text }) => {
      return dayjs(text).format('DD/MM/YYYY HH:mm:ss'); // Format the date
    }
  
  },
  { title: 'Hành động', key: 'action' },
];

const latestTransactionHistoryColumns = [
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

// Fetch function that includes the access token in the headers
const fetchLatestTransactions = async () => {
  const accessToken = localStorage.getItem('token');
  try {
    const response = await axios.get(`${apiUrl}/bank/update_transaction_history`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,  // Include access token in headers
      },
    });

    latestInTransactions.value = response.data.data.in;
    latestOutTransactions.value = response.data.data.out;
  } catch (error) {
    console.error('Error fetching transaction data:', error);
  }
};

const fetchEmployeeDeposit = async () => {
  const accessToken = localStorage.getItem('token');
  try {
    const response = await axios.get(`${apiUrl}/employee/employee_deposit`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,  // Include access token in headers
      },
    });

    employeeDeposit.value = response.data.data.list_deposit;
  } catch (error) {
    console.error('Error fetching employee deposit:', error);
  }
};

const fetchBankAccounts = async () => {
  const accessToken = localStorage.getItem('token');
  try {
    const response = await axios.get(`${apiUrl}/bank/list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,  // Include access token in headers
      },
    });

    const accounts = response.data.data.list_user_bank;

    bankAccountsIn.value = processBankAccounts(accounts.filter(account => account.bank_type === 'IN'));
    bankAccountsOut.value = processBankAccounts(accounts.filter(account => account.bank_type === 'OUT'));
    console.log(bankAccountsIn);
    console.log(bankAccountsOut);
    // Calculate totalIn and totalOut by summing the balances
    totalIn.value = bankAccountsIn.value.reduce((sum, account) => sum + account.balance, 0);
    totalOut.value = bankAccountsOut.value.reduce((sum, account) => sum + account.balance, 0);
    totalFinal.value = totalIn.value + totalOut.value

  } catch (error) {
    console.error('Error fetching employee deposit:', error);
  }
};

const fetchAmountToday = async () => {
  const accessToken = localStorage.getItem('token');
  try {
    const response = await axios.get(`${apiUrl}/bank/get_amount_today`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,  // Include access token in headers
      },
    });

    amountIn.value = response.data.data.in;
    amountOut.value = response.data.data.out;

  } catch (error) {
    console.error('Error fetching employee deposit:', error);
  }
};

// Method to toggle the switch for a specific row
const toggleSwitch = async (record, checked) => {
  record.isChecked = checked;
  try {
    const accessToken = localStorage.getItem('token');
    await axios.post(`${apiUrl}/bank/toggle_bank_status`, {
      id: record.id,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(`Account ${record.id} status updated successfully.`);
  } catch (error) {
    console.error(`Error updating account ${record.id} status:`, error);
  }
};

import { useWindowSize } from '@vueuse/core'; 
const { width } = useWindowSize();
// Start polling every 15 seconds when the component is mounted
onMounted(() => {
  fetchLatestTransactions();
  fetchEmployeeDeposit();
  fetchBankAccounts();
  fetchAmountToday();

  authStore.loadUserFromLocalStorage();
  console.log('====', width.value)


  transactionIntervalId = setInterval(fetchLatestTransactions, 15000);
  depositIntervalId = setInterval(fetchEmployeeDeposit, 15000);
  bankAccountId = setInterval(fetchBankAccounts, 15000);
  amountTotalId = setInterval(fetchAmountToday, 15000);
});

// Clean up intervals when the component is unmounted
onUnmounted(() => {
  if (transactionIntervalId) {
    clearInterval(transactionIntervalId);
  }
  if (depositIntervalId) {
    clearInterval(depositIntervalId);
  }
  if (bankAccountId) {
    clearInterval(bankAccountId);
  }
  if (amountTotalId) {
    clearInterval(amountTotalId);
  }
});
</script>


<style scoped>
/* Container for the statistics section */
/* Container for the statistics section */
.statistic {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin-top: 20px;
}

/* Styling for each card in the statistics section */
.stat-card {
  flex: 1;                   /* Allow the card to take up available space */
  margin-bottom: 10px;       /* Add space below each card */
  max-width: 100%;           /* Ensure the card does not exceed its container's width */
  overflow: hidden;          /* Prevent content overflow */
}

/* Ensure the table wrapper takes full width and handles overflow */
.table-wrapper {
  width: 100%;               /* Ensure the wrapper takes full width */
  overflow-x: auto;          /* Allow horizontal scrolling if necessary */
}

/* Ensure the table inside the card takes full width */
.stat-card .ant-table {
  width: 100% !important;    /* Force the table to take full width of the card */
}

/* Ensure long text in table cells wraps */
.ant-table-cell {
  word-wrap: break-word;
  white-space: normal;
}

/* Media queries for different screen sizes */

/* Desktop and larger screens */
@media (min-width: 1440px) {
  .stat-card {
    width: 100%;             /* Ensure the card takes full width on larger screens */
    margin-bottom: 10px;     /* Maintain margin at the bottom */
  }
}

/* Tablets and smaller screens */
@media (max-width: 1439px) {
  .stat-card {
    width: 100%;             /* Ensure the card takes full width */
    margin-bottom: 10px;     /* Maintain margin at the bottom */
  }
}

/* Mobile screens */
@media (max-width: 768px) {
  .stat-card {
    width: 100%;             /* Take full width on mobile screens */
    margin-bottom: 10px;     /* Maintain margin at the bottom */
    flex-basis: 100%;        /* Ensure each card takes 100% of the row */
  }

  .statistic {
    justify-content: center; /* Center cards on mobile screens */
  }
}
</style>
