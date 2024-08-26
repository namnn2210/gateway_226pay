<script setup lang="ts">

</script>

<template>
  <a-layout-footer class="footer">
    <div class="footer-content">
      © {{ new Date().getFullYear() }} 226Pay. All Rights Reserved.
    </div>
  </a-layout-footer>
</template>

<style scoped>
.footer {
  text-align: center;
  background-color: #001529;
  color: white;
}

.footer-content {
  padding: 16px 0;
}
</style>