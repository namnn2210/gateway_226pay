<template>
  <div>
    <a-form
      :model="formState"
      v-bind="layout"
      :validate-messages="validateMessages"
      @finish="onFinish"
  >
    <a-form-item :name="['amount']" label="Amount" :rules="[{ required: true }]">
      <a-input-number v-model:value="formState.amount" />
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
  </div>
</template>

<script lang="ts" setup>
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} is required!',
};

const formState = reactive({
  amount: '',
  bank_code: 'ACB',
});
const emit = defineEmits(['submit']);
const onFinish = (values: any) => {
  emit('submit', formState);
  console.log('Success:', values);
};
</script>

<style>

</style>