<template>
  <div>
    <a-flex justify="center">
      <a-card class="payout-card" title="Payout">
        <a-button type="primary" @click="addPayouttModal">Add Payout</a-button>
        <a-modal v-model:open="open" title="Add New Payout" :confirm-loading="confirmLoading" footer="">
          <AddPayout @submit="handlePayoutSubmit"/>
        </a-modal>
        <a-flex >
          <a-form 
            :model="formState"
            name="payout_search"
            v-bind="layout"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
            class="payout-form"
          >
            <a-row :gutter="isMobile ? 8 : 24">
              <a-col :span="isMobile ? 24 : 12">
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
              <a-col :span="isMobile ? 24 : 12">
                <a-form-item name="search" label="Search">
                  <a-input v-model:value="formState[`text`]" placeholder="Search" style="width: 100%"></a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="isMobile ? 8 : 24">
              <a-col :span="isMobile ? 24 : 12">
                <a-form-item name="status" label="Status">
                  <a-select v-model:value="formState[`status`]" style="width: 100%">
                    <a-select-option value="Pending">Pending</a-select-option>
                    <a-select-option value="Done">Done</a-select-option>
                    <a-select-option value="Canceled">Canceled</a-select-option>
                    <a-select-option value="Reported">Reported</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="isMobile ? 24 : 12">
                <a-form-item label="User">
                  <a-select v-model:value="formState[`employee`]" style="width: 100%">
                    <a-select-option value='All'>All</a-select-option>
                    <a-select-option v-for="user in users" :key="user.id" :value="user.username">
                      {{ user.username }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-button :loading="loading" type="primary" html-type="submit" :icon="h(SearchOutlined)" block>Search</a-button>
          </a-form>
        </a-flex>
        <a-table 
          :columns="payoutColumns"
          :data-source="listPayouts"
          rowKey="orderid"
          :expandedRowKeys="expandedRowKey ? [expandedRowKey] : []"
          @expand="onExpand"
          :scroll="{ x: '100%' }"
          :style="{ width: isMobile ? '100%' : 'auto' }"
        >
          <template #expandedRowRender="{ record }">
            <a-flex justify="flex-start" gap="middle" align="center">
            <a-flex vertical>
              <p>
                <b>Amount: </b> {{ record.money }}
              </p>
              <p>
                <b>Account Number: </b> {{ record.accountno }}
              </p>
              <p>
                <b>Account Name: </b> {{ record.accountname }}
              </p>
              <p>
                <b>Bank Name: </b> {{ record.bankname }}
              </p>
              <p>
                <b>Bank Code: </b> {{ record.bankcode }}
              </p>
            </a-flex>
            <a-flex vertical>
              <p>
                <b>Created At: </b> {{ record.created_at }}
              </p>
              <p>
                <b>Created By: </b> {{ record.user.username }}
              </p>
              <p>
                <b>Updated At: </b> {{ record.updated_at }}
              </p>
              <p>
                <b>Updated By: </b> {{ record.updated_by ? record.updated_by.username : '' }}
              </p>
            </a-flex>
            <a-flex vertical>
              <p>
                <b>Auto/Manual: </b> {{ record.is_auto ? 'Auto' : 'Manual' }}
              </p>
              <p>
                <b>Action: </b> <a-button type="primary" @click="showPayModal" style="background-color: green;">Pay</a-button> <a-button type="primary" @click="handleDelete(record)" danger>Delete</a-button> <a-button type="primary" @click="handleMove(record)" style="background-color: yellow; color:black;">Move</a-button>
                <a-modal v-model:open="payOpen" title="Payout Detail">
                  <template #footer>
                    <a-button key="back" @click="handleReport(record)" danger>Report</a-button>
                    <a-button key="back" @click="handleCancel(record)">Cancel</a-button>
                    <a-button key="submit" type="primary" :loading="payLoading" @click="showProcessBankModal">Done</a-button>
                    <a-modal v-if="listBanks.length" v-model:open="processBankOpen" title="Process Bank">
                      <template #footer>
                        <a-button key="submit" type="primary" :loading="processBankLoading" @click="handleDone(record)">Done</a-button>
                      </template>
                      <!-- Only render the select dropdown if banks are loaded -->
                      <a-select v-if="listBanks.length" v-model="processBank" style="width: 100%">
                        <a-select-option value=1>ACB</a-select-option>
                        <a-select-option value=2>MB</a-select-option>
                        <a-select-option value=3>Techcombank</a-select-option>
                        <a-select-option value=4>Vietinbank</a-select-option>
                      </a-select>
                    </a-modal>
                  </template>
                  <p class='qrCode'>
                    <img :src="generateQrCodeUrl(record)" alt="QR Code" style="width: 100%;"/>
                  </p>
                </a-modal>
              </p>
            </a-flex>
          </a-flex>
          </template>
          <template #expandColumnTitle>
            
          </template>
          <template #title>
            <a-row :gutter="24">
              <a-col :span="12">
                <b>Total Results: </b> {{ totalResults }}
              </a-col>
              <a-col :span="12">
                <b>Total Amount: </b> {{ totalAmount }}
              </a-col>
            </a-row>
          </template>
        </a-table>
      </a-card>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import { reactive, ref, onMounted, createVNode } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useWindowSize } from '@vueuse/core';  // Use VueUse to detect window size
import { useAuthStore } from '@/stores/auth'; // Import your Pinia store
import axios from 'axios';
import dayjs from 'dayjs';
import { useRuntimeConfig } from '#app';
import { notification } from 'ant-design-vue';

let totalResults = ref(0);
let totalAmount = ref<number>(0);
let listPayouts = ref([]);
let listBanks = ref([]);

// Use the auth store to get user information
const authStore = useAuthStore();
// Use VueUse to detect screen size for responsiveness
const { width } = useWindowSize();
const isMobile = ref(false);
const open = ref<boolean>(false);
const payOpen = ref<boolean>(false);
const processBankOpen = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;
const users = ref<Array<{ id: number, username: string }>>([]);
const expandedRowKey = ref<number | null>(null); // Stores the expanded row's key
const loading = ref(false);
const payLoading = ref(false);
const processBankLoading = ref(false);
const processBank = ref(1);
const addPayoutRef = ref(null);

const showPayModal = () => {
  payOpen.value = true;
};
const showProcessBankModal = async () => {
  processBankOpen.value = true;
  await fetchBanks();
  payOpen.value = false;
};

const generateQrCodeUrl = (record) => {
  const bankcode = record.bankcode;
  const accountno = record.accountno;
  const money = record.money;
  const accountname = encodeURIComponent(record.accountname);  // URL-encode the account name for safety
  return `https://img.vietqr.io/image/${bankcode}-${accountno}-print.jpg?amount=${money}&addInfo=Z${accountname}&accountName=${accountname}`;
};

const handleDone = async (record) => {
  console.log(processBank.value)
  if (!processBank.value || !record.id) {
    notification['error']({
      message: 'Error',
      description: 'Please select a valid bank and ensure the record is valid.',
    });
    return;
  }

  processBankLoading.value = true;
  await updatePayout(record, 'done');  // Pass 'done' as the update type
  processBankLoading.value = false;
};

const handleCancel = (record) => {
  Modal.confirm({
    title: 'Are you sure cancel this payout?',
    icon: createVNode(ExclamationCircleOutlined),
    content: 'This cannot be undone',
    async onOk() {
      await updatePayout(record, 'cancel')
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};

const handleReport = (record) => {
  Modal.confirm({
    title: 'Are you sure report this payout?',
    icon: createVNode(ExclamationCircleOutlined),
    content: 'This cannot be undone',
    async onOk() {
      await updatePayout(record, 'report')
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}

const handleDelete = (record) => {
  Modal.confirm({
    title: 'Are you sure delete this payout?',
    icon: createVNode(ExclamationCircleOutlined),
    content: 'This cannot be undone',
    async onOk() {
      await deletePayout(record)
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}

const handleMove = (record) => {
  Modal.confirm({
    title: 'Are you sure move this payout?',
    icon: createVNode(ExclamationCircleOutlined),
    content: 'This cannot be undone',
    async onOk() {
      await movePayout(record)
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

onMounted(async () => {
  authStore.loadUserFromLocalStorage();
  // Set mobile view threshold
  isMobile.value = width.value < 768; // Consider mobile for screens under 768px
  await fetchUsers();
  await fetchPayouts();
});

const formState = reactive({
  start_end_date: 
  [
    dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'),  // Start of today (00:00:00)
    dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')     // End of today (23:59:59)
  ],
  text: '',
  status: 'Pending',
  employee: 'All',
});

const payoutColumns = [
  { title: 'Order ID', dataIndex: 'orderid', key: 'orderid' },
  { title: 'CID', dataIndex: 'scode', key: 'scode' },
  { 
    title: 'Status', 
    dataIndex: 'status', 
    key: 'status',
    customRender: ({ status }: { status: boolean }) => {
      return status 
        ? h('a-tag', { color: 'success' }, { default: () => 'DONE' })
        : h('a-tag', { color: 'processing' }, { default: () => 'PENDING' });
    }
  },
];

const onExpand = (expanded: boolean, record: any) => {
  if (expanded) {
    expandedRowKey.value = record.orderid;  // Expand the clicked row
  } else {
    expandedRowKey.value = null;  // Collapse the row if already expanded
  }
};

const onFinish = async (values: any) => {
  await fetchPayouts();
  console.log('Success:', formState);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const addPayouttModal = () => {
  open.value = true;
};

const handlePayoutSubmit = async (formData) => {
  try {
    confirmLoading.value = true;
    
    const accessToken = localStorage.getItem('token'); // Retrieve the access token
    const response = await axios.post(`${apiUrl}/payout/add`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Add authorization token
      },
    });

    if (response.status === 200) {
      notification['success']({
        message: 'Success',
        description: 'Payout added successfully!',
      });
      open.value = false; // Close the modal
      await fetchPayouts(); // Refresh the payout list
    }
  } catch (error) {
    console.error('Error adding payout:', error);
    notification['error']({
      message: 'Error',
      description: 'An error occurred while adding the payout.',
    });
  } finally {
    confirmLoading.value = false;
  }
};



// Function to fetch users from API
const fetchUsers = async () => {
  try {
    const accessToken = localStorage.getItem('token'); // Ensure access token is retrieved
    const response = await axios.get(`${apiUrl}/payout/list_users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include authorization header
      },
    });
    users.value = response.data.data.list_users; // Assuming the API returns { data: [users] }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const fetchBanks = async () => {
  try {
    const accessToken = localStorage.getItem('token'); // Ensure access token is retrieved
    const response = await axios.get(`${apiUrl}/bank/get_banks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include authorization header
      },
    });
    
    if (response.data.data.list_banks) {
      listBanks.value = response.data.data.list_banks; // Ensure banks are populated
      console.log('Banks fetched successfully:', listBanks.value);  // Add this to check the data
    } else {
      console.error('No banks found');
    }
  } catch (error) {
    console.error('Error fetching banks:', error);
  }
};

const fetchPayouts = async () => {
  loading.value = true;
  try {
    const accessToken = localStorage.getItem('token'); // Ensure access token is retrieved
    const params = new URLSearchParams({
      start_datetime: formState.start_end_date[0], // Use the start date
      end_datetime: formState.start_end_date[1],   // Use the end date
      text: formState.text || '',              // Optional search text
      status: formState.status || '',          // Optional status
      employee: formState.employee || '',      // Optional employee username
    });

    const response = await axios.get(`${apiUrl}/payout/list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include authorization header
      },
      params
    });
    let payouts = response.data.data.list_payouts

    listPayouts.value = response.data.data.list_payouts
    totalResults.value = payouts.length;
    totalAmount.value = payouts.reduce((acc, payout) => acc + payout.money, 0);
  } catch (error) {
    console.error('Error fetching payouts:', error);
  } finally {
    loading.value = false;  // Stop loading after the request finishes
  }
}

const updatePayout = async (record, updateType) => {
  try {
    const accessToken = localStorage.getItem('token'); // Ensure access token is retrieved
    let updateData = {};

    if (updateType !== 'done') {
      updateData = { id: record.id }; // For non-done actions (cancel, report)
    } else {
      updateData = {
        id: record.id,
        bank_id: processBank.value,  // Include bank ID for 'done'
      };
    }

    const response = await axios.post(
      `${apiUrl}/payout/update_payout/${updateType}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include authorization header
        },
      }
    );

    if (response.status === 200) {
      let updateText = updateType === 'report' ? 'reported' : 
                       updateType === 'cancel' ? 'canceled' : 'processed successfully';
      notification['success']({
        message: 'Success',
        description: `Payout is ${updateText}!`,
      });

      // Reload the page after a short delay for user feedback
      processBankOpen.value = false;
      await fetchPayouts();
    }
  } catch (error) {
    console.error('Error updating payout:', error);
  }
};

const deletePayout = async (record) => {
  try {
    const accessToken = localStorage.getItem('token'); // Ensure access token is retrieved
    const deleteData = {
      id:record.id
    }

    const response = await axios.post(
      `${apiUrl}/payout/delete_payout`,
      deleteData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include authorization header
        },
      }
    );

    if (response.status === 200) {
      notification['success']({
        message: 'Success',
        description: `Payout is deleted!`,
      });

      // Reload the page after a short delay for user feedback
      // processBankOpen.value = false;
      await fetchPayouts();
    }
  } catch (error) {
    console.error('Error updating payout:', error);
  }
}

const movePayout = async (record) => {
  try {
    const accessToken = localStorage.getItem('token'); // Ensure access token is retrieved
    const deleteData = {
      id:record.id
    }

    const response = await axios.post(
      `${apiUrl}/payout/move_payout`,
      deleteData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include authorization header
        },
      }
    );

    if (response.status === 200) {
      notification['success']({
        message: 'Success',
        description: `Payout is moved to settle!`,
      });

      // Reload the page after a short delay for user feedback
      // processBankOpen.value = false;
      await fetchPayouts();
    }
  } catch (error) {
    console.error('Error updating payout:', error);
  }
}
</script>

<style scoped>
.payout-card, .payout-form, .payoutTable {
  margin-top: 20px;
}

/* Media Queries for Mobile */
@media (max-width: 768px) {
  .payout-card {
    width: 100% !important;
  }

  .payout-form {
    width: 100%;
  }

  .payoutTable {
    width: 100% !important;
  }
}

@media (min-width: 1280px) and (max-width: 1440px) {
  .payout-card {
    width: 1200px; /* Adjust width for larger screens within this range */
  }

  .payout-form {
    width: 1200px; /* Ensure the form adjusts accordingly */
  }

  .payoutTable {
    width: 1200px; /* Ensure the table adjusts accordingly */
  }

  /* You can adjust the gutter spacing or form item layout if needed */
  .payout-form .ant-col {
    padding: 0 16px; /* Example adjustment to form columns' padding */
  }
}
</style>
