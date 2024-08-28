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
        <a-select-option value="ACB">ACB</a-select-option>
        <a-select-option value="MB">MB</a-select-option>
        <a-select-option value="Techcombank">Techcombank</a-select-option>
        <a-select-option value="Vietinbank">Vietinbank</a-select-option>
      </a-select>
    </a-form-item>

    <!-- Submit button triggers form validation -->
    <a-button type="primary" html-type="submit" :loading="loading">Submit</a-button>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive, ref, defineEmits } from 'vue';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} is required!',
};

const formState = reactive({
  scode: '',
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
</script>
