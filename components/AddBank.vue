<template>
  <a-form
      :model="formState"
      v-bind="layout"
      :validate-messages="validateMessages"
      @finish="onFinish"
  >
    <a-form-item :name="['account_number']" label="Account Number" :rules="[{ required: true }]">
      <a-input v-model:value="formState.account_number" />
    </a-form-item>
    <a-form-item :name="['account_name']" label="Account Name" :rules="[{ required: true }]">
      <a-input v-model:value="formState.account_name" />
    </a-form-item>
    <a-form-item :name="['username']" label="Bank Username" :rules="[{ required: true }]">
      <a-input v-model:value="formState.username" />
    </a-form-item>
    <a-form-item :name="['password']" label="Bank Password">
      <a-input-password v-model:value="formState.password" />
    </a-form-item>
    <a-form-item label="Bank Type">
      <a-select :name="['bank_type']">
        <a-select-option value="IN">IN</a-select-option>
        <a-select-option value="OUT">OUT</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Bank Name">
      <a-select :name="['bank_code']">
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
  account_number: '',
  account_name: '',
  username: '',
  password: '',
  bank_type: 'IN',
  bank_code: 'ACB',
});
const emit = defineEmits(['submit']);
const onFinish = (values: any) => {
  emit('submit', formState);
  console.log('Success:', values);
};
</script>

