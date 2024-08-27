<template>
  <a-form
      :model="formState"
      v-bind="layout"
      :validate-messages="validateMessages"
      @finish="onFinish"
  >
    <a-form-item :name="['cid']" label="CID">
      <a-select >
        <a-select-option value="1">1</a-select-option>
        <a-select-option value="2">2</a-select-option>
        <a-select-option value="3">3</a-select-option>
        <a-select-option value="4">4</a-select-option>
        <a-select-option value="4">5</a-select-option>
        <a-select-option value="4">6</a-select-option>
        <a-select-option value="4">7</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item :name="['order_id']" label="Order ID" :rules="[{ required: true }]">
      <a-input v-model:value="formState.order_id" />
    </a-form-item>
    <a-form-item :name="['amount']" label="Amount" :rules="[{ required: true }]">
      <a-input v-model:value="formState.amount" />
    </a-form-item>
    <a-form-item :name="['accountno']" label="Account Number" :rules="[{ required: true }]">
      <a-input v-model:value="formState.accountno" />
    </a-form-item>
    <a-form-item :name="['accountname']" label="Account Name" :rules="[{ required: true }]">
      <a-input v-model:value="formState.accountname" />
    </a-form-item>
    <a-form-item :name="['password']" label="Bank Password">
      <a-input-password v-model:value="formState.password" />
    </a-form-item>
    <a-form-item :name="['bank']" label="Bank Name">
      <a-select>
        <a-select-option value="ACB">ACB</a-select-option>
        <a-select-option value="MB">MB</a-select-option>
        <a-select-option value="Techcombank">Techcombank</a-select-option>
        <a-select-option value="Vietinbank">Vietinbank</a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>

import { reactive } from 'vue';
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} is required!',
};

const formState = reactive({
  cid: '',
  order_id: '',
  amount: '',
  accountno: '',
  accountname: '',
  bank: '',
});
const emit = defineEmits(['submit']);
const onFinish = (values: any) => {
  emit('submit', formState);
  console.log('Success:', values);
};
</script>

