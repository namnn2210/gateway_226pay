<template>
  <div>
    <a-flex justify="center">
      <a-card class="deposit-card" title="Danh sách nạp tiền">
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
              <a-flex justify="flex-start" gap="middle" align="center">
                <a-flex vertical style="font-size: 11px;">
                  <p><b>Ghi chú: </b> {{ record.note }}</p>
                  <p><b>Tên ngân hàng: </b> {{ record.bankname }}</p>
                  <p><b>Mã ngân hàng: </b> {{ record.bankcode }}</p>
                  <p><b>Số tài khoản: </b> {{ record.accountno }}</p>
                  <p><b>Tên tài khoản: </b> {{ record.accountname }}</p>
                </a-flex>
                <a-flex vertical style="font-size: 11px;">
                  <p><b>Người cập nhật: </b> {{ record.updated_by.username }}</p>
                  <p><b>Giờ cập nhật: </b> {{ record.updated_at }}</p>
                </a-flex>
                <a-flex gap="small" style="font-size: 11px;">
                  <b>Action: </b> 
                  <a-button type="primary" v-if="!record.status" success>Thanh toán</a-button> 
                  <a-button type="primary" danger>Xóa</a-button>
                </a-flex>
              </a-flex>
            </template>
            <template #expandColumnTitle></template>
          </a-table>
        </a-flex>
      </a-card>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import { useRuntimeConfig } from '#app';
import { Tag } from 'ant-design-vue';

let employeeDeposit = ref([]);
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;
const expandedRowKey = ref<number | null>(null);

const onExpand = (expanded: boolean, record: any) => {
  if (expanded) {
    expandedRowKey.value = record.id;
  } else {
    expandedRowKey.value = null;
  }
};

const depositColumns = [
  {
    title: 'Người yêu cầu',
    dataIndex: 'user',
    key: 'user',
    customRender: ({ record }) => record.user.username
  },
  {
    title: 'Số tiền',
    dataIndex: 'amount',
    key: 'amount',
    customRender: ({ text }) => Intl.NumberFormat().format(text)
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
    customRender: ({ text }) => dayjs(text).format('DD/MM/YYYY HH:mm:ss')
  }
];

onMounted(async () => {
  await fetchEmployeeDeposit();
});

const fetchEmployeeDeposit = async () => {
  const accessToken = localStorage.getItem('token');
  try {
    const response = await axios.get(`${apiUrl}/employee/employee_deposit`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    employeeDeposit.value = response.data.data.list_deposit;
  } catch (error) {
    console.error('Error fetching employee deposit:', error);
  }
};
</script>

<style scoped>
.deposit-card {
  width: 1500px;
  margin-top: 20px;
}

.deposit-table {
  width: 100%;  /* Ensure the table takes the full width of its container */
}

/* Ensure the table wrapper also respects the full width */
.table-wrapper {
  width: 100%;   /* Ensure the wrapper takes the full width */
  overflow-x: auto; /* Allow horizontal scrolling if necessary */
}

/* Make sure all table cells can expand to fill available space */
.ant-table {
  width: 100%;  /* Ensure the entire table takes up 100% of its container */
}

/* Ensure no overflow issues with the table cells */
.ant-table-cell {
  word-wrap: break-word;
  white-space: normal;
}

/* Media Queries for Mobile */
@media (max-width: 768px) {
  .deposit-card {
    width: 100% !important; /* Card takes full width on mobile */
  }

  .deposit-table {
    width: 100% !important; /* Table also takes full width */
  }
}

@media (min-width: 1280px) and (max-width: 1440px) {
  .deposit-card {
    width: 1200px; /* Adjust width for larger screens within this range */
  }

  .deposit-table {
    width: 100%; /* Ensure the table adjusts accordingly */
  }
}
</style>
