<template>
  <a-form
    :model="formState"
    v-bind="layout"
    :validate-messages="validateMessages"
    ref="payoutForm"
    @finish="onFinish"
  >
    <a-form-item :name="['scode']" label="CID">
      <a-select v-model="formState.scode">
        <a-select-option value="1">1</a-select-option>
        <a-select-option value="2">2</a-select-option>
        <a-select-option value="3">3</a-select-option>
        <a-select-option value="4">4</a-select-option>
        <a-select-option value="5">5</a-select-option>
        <a-select-option value="6">6</a-select-option>
        <a-select-option value="7">7</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item :name="['orderid']" label="Order ID" :rules="[{ required: true }]">
      <a-input v-model:value="formState.orderid" />
    </a-form-item>
    <a-form-item :name="['money']" label="Amount">
      <a-input v-model:value="formState.money" />
    </a-form-item>
    <a-form-item :name="['accountno']" label="Account Number" :rules="[{ required: true }]">
      <a-input v-model:value="formState.accountno" />
    </a-form-item>
    <a-form-item :name="['accountname']" label="Account Name" :rules="[{ required: true }]">
      <a-input v-model:value="formState.accountname" />
    </a-form-item>
    <a-form-item :name="['bankcode']" label="Bank Name">
      <a-select v-model:value="formState.bankcode">
        <a-select-option v-for="bank in listBanks" :value="bank.code">
          {{ bank.short_name }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <!-- Submit button triggers form validation -->
    <a-button type="primary" html-type="submit" :loading="loading">Submit</a-button>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive, ref, defineEmits, onMounted } from 'vue';
import axios from 'axios';
import { useRuntimeConfig } from '#app';
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;
const authStore = useAuthStore();
let listBanks = ref([]);

onMounted(async () => {
  authStore.loadUserFromLocalStorage();
  await fetchBanks();
});

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} is required!',
};

const formState = reactive({
  scode: '1',
  orderid: '',
  money: '',
  accountno: '',
  accountname: '',
  bankcode: '',
});

const loading = ref(false);
const payoutForm = ref(null);

// Emit form data to parent on successful submission
const emit = defineEmits(['submit']);

// Handle form submission
const onFinish = () => {
  emit('submit', { ...formState });
  console.log('Form submitted:', formState);
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

</script>
