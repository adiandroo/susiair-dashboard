<template>
  <div class="documents-list">
    <template v-if="loading">
      <div v-for="i in 3" :key="i" class="doc-item card" :style="{ animationDelay: i * 50 + 'ms' }">
        <div class="doc-indicator skeleton"></div>
        <div class="doc-body">
          <div class="doc-info">
            <span class="skeleton skeleton-label"></span>
            <span class="skeleton skeleton-date"></span>
          </div>
          <span class="skeleton skeleton-badge"></span>
        </div>
      </div>
    </template>
    <div v-else
      v-for="(doc, index) in store.getDocumentsWithStatus"
      :key="doc.id"
      class="doc-item card"
      :style="{ '--accent': accentColor(doc.status), animationDelay: index * 50 + 'ms' }"
    >
      <div class="doc-indicator"></div>
      <div class="doc-body">
        <div class="doc-info">
          <span class="doc-label">{{ doc.label }}</span>
          <span class="doc-date">Expires: {{ formatDate(doc.expiryDate) }}</span>
        </div>
        <span :class="['badge', badgeClass(doc.status)]">
          <span v-if="doc.status === 'expired'">Expired</span>
          <span v-else-if="doc.status === 'warning'">{{ doc.daysRemaining }}d left</span>
          <span v-else>{{ doc.daysRemaining }}d</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFlightStore } from '~/stores/flight'

withDefaults(defineProps<{ loading?: boolean }>(), { loading: false })
const store = useFlightStore()

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function badgeClass(status: string): string {
  return status === 'expired' ? 'badge--danger' : status === 'warning' ? 'badge--warning' : 'badge--safe'
}

function accentColor(status: string): string {
  return status === 'expired' ? '#DC2626' : status === 'warning' ? '#D97706' : '#059669'
}
</script>

<style lang="scss" scoped>
.documents-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.doc-item {
  display: flex;
  align-items: stretch;
  padding: 0;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(14, 33, 56, 0.08);
    transform: translateY(-1px);
  }
}

.doc-indicator {
  width: 4px;
  flex-shrink: 0;
  background: var(--accent);
  border-radius: 0 4px 4px 0;
}

.doc-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  gap: 12px;
}

.doc-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.doc-label {
  font-weight: 600;
  font-size: 13px;
  color: $color-text-primary;
  line-height: 1.3;
}

.doc-date {
  font-size: 11px;
  color: $color-text-secondary;
  line-height: 1.3;
}

.skeleton {
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
}

.skeleton-label { width: 120px; height: 14px; }
.skeleton-date { width: 100px; height: 11px; }
.skeleton-badge { width: 50px; height: 22px; border-radius: 20px; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
