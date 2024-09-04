<template>
  <a-layout-header>
    <a-flex justify="space-around" align="middle">
      <!-- Logo Section -->
      <a-flex>
        <div class="logo">
          <NuxtLink to="/">
            <img src="/logo.png" alt="Logo"/>
          </NuxtLink>
        </div>
      </a-flex>

      <!-- Desktop Menu (shows text on larger screens, icons on mobile) -->
      <a-flex class="desktop-menu" gap="middle" justify="space-around" align="center">
        <NuxtLink to="/">
          <a-button type="text" class="icon-button">
            <HomeTwoTone/>
            <span class="button-text">Trang chủ</span>
          </a-button>
        </NuxtLink>
        <NuxtLink to="/report" v-if="authStore.user.is_superuser">
          <a-button type="text" class="icon-button">
            <PieChartTwoTone/>
            <span class="button-text">Báo cáo</span>
          </a-button>
        </NuxtLink>
        <NuxtLink to="/record_book">
          <a-button type="text" class="icon-button">
            <BookTwoTone/>
            <span class="button-text">Sổ giao dịch</span>
          </a-button>
        </NuxtLink>
        

        <!-- Payout Dropdown -->
        <a-dropdown :trigger="['click']" :placement="bottomRight" :arrow="{ pointAtCenter: true }">
          <a-button type="text" class="icon-button">
            <DollarCircleTwoTone/>
            <span class="button-text">Payout</span>
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <NuxtLink to="/withdrawal">
                  <a-button type="text" class="icon-button">
                    <span class="button-text">Không có bill</span>
                  </a-button>
                </NuxtLink>
              </a-menu-item>
              <a-menu-item>
                <NuxtLink to="/settle">
                  <a-button type="text" class="icon-button">
                    <span class="button-text">Có bill</span>
                  </a-button>
                </NuxtLink>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <!-- Employee Dropdown -->
        <a-dropdown :trigger="['click']" :placement="bottomRight" :arrow="{ pointAtCenter: true }">
          <a-button type="text" class="icon-button">
            <ContactsTwoTone />
            <span class="button-text">Nhân viên</span>
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <NuxtLink to="/deposit">
                  <a-button type="text" class="icon-button">
                    <span class="button-text">Lệnh nạp tiền</span>
                  </a-button>
                </NuxtLink>
              </a-menu-item>
              <a-menu-item>
                <NuxtLink to="/working_session">
                  <a-button type="text" class="icon-button">
                    <span class="button-text">Lịch sử làm việc</span>
                  </a-button>
                </NuxtLink>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <!-- Language Dropdown -->
        <a-dropdown :trigger="['click']" :placement="bottomRight" :arrow="{ pointAtCenter: true }">
          <a-button type="text" class="icon-button">
            <InsuranceTwoTone />
            <span class="button-text">Ngôn ngữ</span>
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <NuxtLink to="/">
                  <a-button type="text" class="icon-button">
                    <span class="button-text">English</span>
                  </a-button>
                </NuxtLink>
              </a-menu-item>
              <a-menu-item>
                <NuxtLink to="/">
                  <a-button type="text" class="icon-button">
                    <span class="button-text">Tiếng Việt</span>
                  </a-button>
                </NuxtLink>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-flex>

      <!-- Avatar Section -->
      <a-flex class="desktop-menu" gap="middle" align="center">
        <a-dropdown :trigger="['click']" :placement="bottomRight" :arrow="{ pointAtCenter: true }">
          <a-avatar size="large" :style="{ backgroundColor: color, verticalAlign: 'middle' }" :gap="gap">
            {{ avatarValue }}
          </a-avatar>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <NuxtLink to="/">Thông tin tài khoản</NuxtLink>
              </a-menu-item>
              <a-menu-item>
                <a-button type="text" class="icon-button" @click="logout">
                  <span class="button-text">Đăng xuất</span>
                </a-button>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-flex>
    </a-flex>
  </a-layout-header>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth'; // Import your Pinia store

// Use the auth store to get user information
const authStore = useAuthStore();

// Avatar value
const avatarValue = ref('');

// Logout function
const logout = () => {
  authStore.logout();  // Call the logout method from the store
  location.reload();  // Reload the page or navigate to the login page if necessary
};

onMounted(() => {
  authStore.loadUserFromLocalStorage(); // Load user from local storage
  // Set avatarValue to the user's initials if user is present
  if (authStore.user?.username) {
    avatarValue.value = authStore.user.username.split(' ').map(n => n[0]).join(''); // 'JD' for 'John Doe'
  }
});
</script>

<style scoped>
.logo img {
  height: 40px;
}

.desktop-menu {
  display: flex;
}

.mobile-menu-btn {
  display: none;
}

/* Media Queries for Mobile View */
@media (max-width: 768px) {
  .button-text {
    display: none; /* Hide the button text on mobile */
  }

  .icon-button {
    padding: 0; /* Adjust padding for a more compact icon-only button */
  }
}
</style>
