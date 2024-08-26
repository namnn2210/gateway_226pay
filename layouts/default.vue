<template>
  <Header v-if="!isLoginPage"/>
  <NuxtPage/>
<!--  <Footer/>-->
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

// Get the current route
const route = useRoute()

// Check if the current route is /login
const isLoginPage = route.path === '/login'
</script>

<style scoped>

</style>