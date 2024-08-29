<template>
  <div>
    <a-flex justify="center">
      <a-card class="deposit-card" title="List Deposit">
        <a-flex>
          <a-table 
            class="deposit-table table-wrapper" 
            :columns="depositColumns" 
            :data-source="employeeDeposit" 
            rowKey="id"
            :expand-column-width="100"
            :expandedRowKeys="expandedRowKey ? [expandedRowKey] : []"
            @expand="onExpand"
            style="font-size: 11px;"
          >
            <template #expandedRowRender="{ record }">
          <a-flex justify="flex-start" gap="middle" align="center" >
            <a-flex vertical style="font-size: 11px;">
              <p>
                <b>Note: </b> {{ record.note }}
              </p>
              <p>
                <b>Bank Name: </b> {{ record.bankname }}
              </p>
              <p>
                <b>Bank Code: </b> {{ record.bankcode }}
              </p>
              <p>
                <b>Account Number: </b> {{ record.accountno }}
              </p>
              <p>
                <b>Account Name: </b> {{ record.accountname }}
              </p>
            </a-flex>
            <a-flex vertical>
              <p>
                <b>Updated By: </b> {{ record.updated_by.username }}
              </p>
              <p>
                <b>Updated At: </b> {{ record.updated_at }}
              </p>
            </a-flex>
            <a-flex gap="small">
              <b>Action: </b> <a-button type="primary" v-if="!record.status" success>Pay</a-button> <a-button type="primary" danger>Delete</a-button>
            </a-flex>
          </a-flex>
        </template>
        <template #expandColumnTitle>

        </template>
          </a-table>
        </a-flex>
      </a-card>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, h, createVNode } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import { useRuntimeConfig } from '#app';
let employeeDeposit = ref([]);
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;
const expandedRowKey = ref<number | null>(null);

const onExpand = (expanded: boolean, record: any) => {
  if (expanded) {
    expandedRowKey.value = record.id;  // Expand the clicked row
  } else {
    expandedRowKey.value = null;  // Collapse the row if already expanded
  }
};

const depositColumns = [
  { 
    title: 'Request User', 
    dataIndex: 'user', 
    key: 'user',
    customRender: ({ record }) => {
      return record.user.username;
    } 
  },
  { 
    title: 'Amount', 
    dataIndex: 'amount', 
    key: 'amount',
    customRender: ({ text }) => {
      return h('span', Intl.NumberFormat().format(text));
    } 
  },
  { 
    title: 'Status', 
    dataIndex: 'status', 
    key: 'status',
    customRender: ({ status }: { status: boolean }) => {
      return status 
        ? createVNode('a-tag', { color: 'processing' }, { default: () => 'PENDING' })
        : createVNode('a-tag', { color: 'success' }, { default: () => 'DONE' });
    } 
  },
  { 
    title: 'Created At', 
    dataIndex: 'created_at', 
    key: 'created_at',
    customRender: ({ text }) => {
      return dayjs(text).format('DD/MM/YYYY HH:mm:ss'); // Format the date
    } 
  },
];

onMounted(async () => {
  await fetchEmployeeDeposit();
});

const fetchEmployeeDeposit = async () => {
  const accessToken = localStorage.getItem('token');
  try {
    const response = await axios.get(`${apiUrl}/employee/employee_deposit`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,  // Include access token in headers
      },
    });
    console.log(response.data.data.list_deposit)
    employeeDeposit.value = response.data.data.list_deposit;
  } catch (error) {
    console.error('Error fetching employee deposit:', error);
  }
};

</script>

<style>
/* Media Queries for Mobile */
.deposit-card {
  width: 1500px;
  margin-top: 20px;
}
.deposit-table {
  width: 1500px;
}

@media (max-width: 768px) {
  .deposit-card {
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
  .deposit-card {
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