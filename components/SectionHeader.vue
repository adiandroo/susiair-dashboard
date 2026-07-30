<template>
  <div class="section-header">
    <h2>{{ title }}</h2>
    <button v-if="actionLabel" class="see-all-btn" @click="$emit('action')">{{ actionLabel }}</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  actionLabel?: string
}>()

defineEmits<{ action: [] }>()
</script>

<style lang="scss" scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding: 0 4px;

  h2 {
    font-size: 17px;
    font-weight: 700;
    color: $color-text-primary;
  }
}

.see-all-btn {
  font-size: 13px;
  font-weight: 600;
  color: $color-brand-red;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.15s ease;

  &:hover { background: rgba(230, 55, 87, 0.06); }
}
</style>
