<template>
  <a-layout-header>
    <a-flex justify="space-around" align="middle">
      <!-- Logo Section -->
      <a-flex>
        <div class="logo">
          <img src="/new-logo.png" alt="Logo"/>
        </div>
      </a-flex>

      <!-- Desktop Menu (shows text on larger screens, icons on mobile) -->
      <a-flex class="desktop-menu" gap="middle" justify="space-around" align="center">
        <NuxtLink to="/">
          <a-button type="text" class="icon-button">
            <HomeTwoTone/>
            <span class="button-text">Home</span>
          </a-button>
        </NuxtLink>
        <a-button type="text" class="icon-button">
          <PieChartTwoTone/>
          <span class="button-text">Report</span>
        </a-button>
        <a-button type="text" class="icon-button">
          <BookTwoTone/>
          <span class="button-text">Record Book</span>
        </a-button>

        <!-- Payout Dropdown -->
        <a-dropdown :trigger="['click']" :placement="bottomRight" :arrow="{ pointAtCenter: true }">
          <a-button type="text" class="icon-button">
            <DollarCircleTwoTone/>
            <span class="button-text">Payout</span>
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <NuxtLink to="/">Withdrawal</NuxtLink>
              </a-menu-item>
              <a-menu-item>
                <NuxtLink to="/">Settle</NuxtLink>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <!-- Employee Dropdown -->
        <a-dropdown :trigger="['click']" :placement="bottomRight" :arrow="{ pointAtCenter: true }">
          <a-button type="text" class="icon-button">
            <TeamOutlined/>
            <span class="button-text">Employee</span>
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <NuxtLink to="/">Deposit</NuxtLink>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <!-- Language Dropdown -->
        <a-dropdown :trigger="['click']" :placement="bottomRight" :arrow="{ pointAtCenter: true }">
          <a-button type="text" class="icon-button">
            <TeamOutlined/>
            <span class="button-text">Language</span>
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <NuxtLink to="/">English</NuxtLink>
              </a-menu-item>
              <a-menu-item>
                <NuxtLink to="/">Tiếng Việt</NuxtLink>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-flex>

      <!-- Avatar Section -->
      <a-flex class="desktop-menu" gap="middle" align="center">
        <a-dropdown :trigger="['click']" :placement="bottomRight" :arrow="{ pointAtCenter: true }">
          <a-avatar :size="{ xs: 24 }">
            <template #icon>
              <AntDesignOutlined />
            </template>
          </a-avatar>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <NuxtLink to="/">Thông tin tài khoản</NuxtLink>
              </a-menu-item>
              <a-menu-item>
                <NuxtLink to="/">Đăng xuất</NuxtLink>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-flex>
    </a-flex>
  </a-layout-header>
</template>

<script>
export default {
  name: 'Navbar',
}
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
