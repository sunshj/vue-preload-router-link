<template>
  <div class="container">
    <AppNav class="app-nav" />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNav from './components/App/AppNav.vue'
</script>

<style scoped>
.container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app-nav {
  background-color: #fff;
  padding: 5px;
  position: fixed;
  right: 0;
}
</style>
