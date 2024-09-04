<template>
  <div>
    <a-flex justify="center">
      <a-card class="session-card" title="Danh sách phiên làm việc">
        <a-flex>
          <a-form 
            :model="formState"
            name="payout_search"
            v-bind="layout"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
            class="payout-form"
          >
            <a-row :gutter="isMobile ? 8 : 24">
              <a-col :span="isMobile ? 24 : 24">
                <a-form-item name="start_end_date" label="Chọn ngày giờ">
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
            <a-row :gutter="isMobile ? 8 : 24">
              <a-col :span="isMobile ? 24 : 12">
                <a-form-item name="status" label="Trạng thái">
                  <a-select v-model:value="formState[`status`]" style="width: 100%">
                    <a-select-option value="Working">Đang làm việc</a-select-option>
                    <a-select-option value="Done">Hoàn thành</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="isMobile ? 24 : 12">
                <a-form-item label="Nhân viên">
                  <a-select v-model:value="formState[`employee`]" style="width: 100%">
                    <a-select-option value='All'>Tất cả</a-select-option>
                    <a-select-option v-for="user in users" :key="user.id" :value="user.username">
                      {{ user.username }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-button :loading="loading" type="primary" html-type="submit" :icon="h(SearchOutlined)" block>Tìm kiếm</a-button>
          </a-form>
        </a-flex>
        <a-table 
          :columns="sessionColumns"
          :data-source="listSessions"
          class="table-session"
          :scroll="{ x: '100%' }"
          :style="{ width: isMobile ? '100%' : 'auto' }"
          style="font-size: 11px;"
        >

        </a-table>
      </a-card>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, createVNode } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import { useRuntimeConfig } from '#app';
import { useWindowSize } from '@vueuse/core';
import { SearchOutlined } from '@ant-design/icons-vue';


const authStore = useAuthStore();
// Use VueUse to detect screen size for responsiveness
const { width } = useWindowSize();
const isMobile = ref(false);
const users = ref<Array<{ id: number, username: string }>>([]);
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;
const loading = ref(false);
const listSessions = ref([]);

const sessionColumns = [
  {
    title: "Nhân viên", 
    dataIndex:'user', 
    key:'user',
    customRender: ({ record }) => {
      return record.user.username;
    },
  },
  {
    title: "Giờ bắt đầu", 
    dataIndex: "start_time", 
    key: 'start_time',
    customRender: ({ text }) => {
      return dayjs(text).format('DD/MM/YYYY HH:mm:ss'); // Format the date
    },
  },
  {
    title: "Giờ kết thúc", 
    dateIndex: "end_time", 
    key: "end_time",
    customRender: ({ text }) => {
      return dayjs(text).format('DD/MM/YYYY HH:mm:ss'); // Format the date
    },
  },
  {
    title: "Trạng thái", 
    dateIndex: "status", 
    key: "status"
  }
]

onMounted(async () => {
  authStore.loadUserFromLocalStorage();
  // Set mobile view threshold
  isMobile.value = width.value < 768; // Consider mobile for screens under 768px
  await fetchListSessions();
});

const formState = reactive({
  start_end_date: 
  [
    dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'),  // Start of today (00:00:00)
    dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')     // End of today (23:59:59)
  ],
  status: 'Working',
  employee: 'All',
});

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const onFinish = async (values: any) => {
  await fetchListSessions();
  console.log('Success:', formState);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const fetchListSessions = async () => {
  loading.value = true;
  try {
    const accessToken = localStorage.getItem('token'); // Ensure access token is retrieved
    const params = new URLSearchParams({
      start_datetime: formState.start_end_date[0], // Use the start date
      end_datetime: formState.start_end_date[1],   // Use the end date
      status: formState.status || '',          // Optional status
      employee: formState.employee || '',      // Optional employee username
    });

    const response = await axios.get(`${apiUrl}/employee/list_employee_session`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include authorization header
      },
      params
    });

    console.log(response.data.data)

    listSessions.value = response.data.data.list_sessions
    
  } catch (error) {
    console.error('Error fetching payouts:', error);
  } finally {
    loading.value = false;  // Stop loading after the request finishes
  }
}
</script>

<style>
.session-card, .payout-form, .payoutTable {
  width: 1300px;
  margin-top: 20px;
}

.table-session {
  margin-top: 20px;
}

/* Media Queries for Mobile */
@media (max-width: 768px) {
  .session-card {
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
  .session-card {
    width: 1000px; /* Adjust width for larger screens within this range */
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