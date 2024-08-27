<template>
  <div>
    <a-flex justify="center">
      <a-card class="payout-card" title="Payout" :style="{ width: isMobile ? '100%' : '1500px' }">
        <a-button type="primary" @click="addPayouttModal">Add Payout</a-button>
        <a-modal v-model:open="open" title="Add New Payout" :confirm-loading="confirmLoading" @ok="handleOk">
          <AddPayout/>
        </a-modal>
        <a-flex :style="{ width: isMobile ? '100%' : '1500px' }">
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
                  <a-select v-model:value="formState[`user`]" style="width: 100%">
                    <!-- Example options -->
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-button type="primary" html-type="submit" :icon="h(SearchOutlined)" block>Search</a-button>
          </a-form>
        </a-flex>
        <a-table class="payoutTable" :columns="payoutColumns" :style="{ width: isMobile ? '100%' : 'auto' }">
          <template #expandedRowRender="{ record }">
            <p style="margin: 0">
              {{ record.description }}
            </p>
          </template>
          <template #expandColumnTitle>
            <span style="color: red">More</span>
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
import { reactive, ref, onMounted } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useWindowSize } from '@vueuse/core';  // Use VueUse to detect window size

const open = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
let totalResults = ref(0);
let totalAmount = ref(0);

// Use VueUse to detect screen size for responsiveness
const { width } = useWindowSize();
const isMobile = ref(false);

onMounted(() => {
  // Set mobile view threshold
  isMobile.value = width.value < 768; // Consider mobile for screens under 768px
});

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const formState = reactive({
  start_end_date: ['', ''],
  text: '',
  status: 'Pending',
  user: '',
});

const payoutColumns = [
  { title: 'Order ID', dataIndex: 'order_id', key: 'order_id' },
  { title: 'CID', dataIndex: 'cid', key: 'cid' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

const onFinish = (values: any) => {
  console.log('Success:', values, formState);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const addPayouttModal = () => {
  open.value = true;
};

const handleOk = () => {
  confirmLoading.value = true;
  setTimeout(() => {
    open.value = false;
    confirmLoading.value = false;
  }, 2000);
};
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
</style>
