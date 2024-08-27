<template>
  <a-flex justify="center" align="center" class="loginDiv" vertical>

    <a-form
        :model="formState"
        name="normal_login"
        class="login-form"
    >
      <a-form-item
          label="Username"
          name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="formState.username">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.password">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>


      <a-form-item>
        <a-form-item name="remember" no-style>
          <a-checkbox v-model:checked="formState.remember">Nhớ đăng nhập</a-checkbox>
        </a-form-item>
      </a-form-item>

      <a-form-item class="login-form-item-center">
        <a-button @click="login" :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
          Đăng nhập
        </a-button>
      </a-form-item>
    </a-form>
  </a-flex>
</template>
<script lang="ts" setup>
import { reactive, computed } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import {useAuthStore} from "~/stores/auth";
const authStore = useAuthStore()

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}
const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
});

const disabled = computed(() => {
  return !(formState.username && formState.password);
});


const login = async () => {
  try {
    console.log('logging in...')
    await authStore.login(formState.username, formState.password)
    formState.username = ''
    formState.password = ''
  } catch (error) {
    console.error('Login failed:', error.message)
  }
}
</script>
<style scoped>
.loginDiv {
  height: 100vh;
}

/* Style the form */
.login-form {
  max-width: 300px;
  width: 100%;
}

.login-form-item-center {
  display: flex;
  justify-content: center; /* Center the button horizontally */
}

#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}

</style>
