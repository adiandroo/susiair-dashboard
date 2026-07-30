<template>
  <header class="page-header">
    <h1>{{ title }}</h1>
    <slot />
  </header>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<style lang="scss" scoped>
.page-header {
  background: linear-gradient(165deg, #0E2138 0%, #162D4A 100%);
  padding: 24px 20px;
  text-align: center;

  h1 {
    color: white;
    font-size: 18px;
    font-weight: 600;
  }

  @media (min-width: 768px) {
    padding: 32px 32px;
  }

  @media (min-width: 1024px) {
    padding: 32px 0;
  }
}
</style>
