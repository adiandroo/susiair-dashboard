<template>
  <div class="placeholder-content">
    <div class="placeholder-icon">
      <slot name="icon">
        <svg width="48" height="48" fill="none" stroke="#D1D5DB" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
      </slot>
    </div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<style lang="scss" scoped>
.placeholder-content {
  padding: 60px 16px;
  text-align: center;
  color: $color-text-secondary;

  .placeholder-icon { margin-bottom: 16px; }

  h3 {
    color: $color-text-primary;
    margin-bottom: 4px;
  }

  p { font-size: 14px; }
}
</style>
