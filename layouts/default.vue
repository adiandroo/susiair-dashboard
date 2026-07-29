<template>
  <div class="app-shell">
    <div class="app-content">
      <slot />
    </div>
    <nav class="bottom-nav" role="navigation" aria-label="Main navigation">
      <NuxtLink to="/" class="nav-item" :class="{ active: route.path === '/' }" aria-label="Home" :aria-current="route.path === '/'">
        <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/></svg>
        <span>Home</span>
      </NuxtLink>
      <NuxtLink to="/schedule" class="nav-item" :class="{ active: route.path === '/schedule' }" aria-label="Schedule" :aria-current="route.path === '/schedule'">
        <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        <span>Schedule</span>
      </NuxtLink>
      <NuxtLink to="/logbook" class="nav-item" :class="{ active: route.path === '/logbook' }" aria-label="Logbook" :aria-current="route.path === '/logbook'">
        <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14M8 7h8M8 11h5"/></svg>
        <span>Logbook</span>
      </NuxtLink>
      <NuxtLink to="/more" class="nav-item" :class="{ active: route.path === '/more' }" aria-label="More" :aria-current="route.path === '/more'">
        <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        <span>More</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style lang="scss" scoped>
.app-shell {
  min-height: 100vh;
  background: $color-background;
}

.app-content {
  padding-bottom: 88px;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 640px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: $color-card;
  border-top: 1px solid #F3F4F6;
  padding: 8px 0;
  padding-bottom: max(8px, env(safe-area-inset-bottom));
  z-index: 100;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  font-weight: 500;
  color: #9CA3AF;
  text-decoration: none;
  padding: 6px 16px;
  border-radius: 12px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 24px;
    height: 3px;
    border-radius: 0 0 4px 4px;
    background: $color-brand-red;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  svg {
    width: 22px;
    height: 22px;
    transition: transform 0.2s ease;
  }

  &.active {
    color: $color-brand-red;

    &::before { transform: translateX(-50%) scaleX(1); }
    svg { transform: scale(1.05); }
  }

  &:not(.active):hover {
    color: #6B7280;
  }
}
</style>
