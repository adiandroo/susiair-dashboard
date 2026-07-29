<template>
  <div class="placeholder-page">
    <header class="page-header"><h1>More</h1></header>
    <div class="container placeholder-content">
      <div class="placeholder-icon">
        <svg width="48" height="48" fill="none" stroke="#D1D5DB" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
      </div>
      <h3>Settings & More</h3>
      <p>Feature coming soon.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-header {
  background: linear-gradient(165deg, #0E2138 0%, #162D4A 100%);
  padding: 24px 20px;
  text-align: center;
  h1 { color: white; font-size: 18px; font-weight: 600; }

  @media (min-width: 768px) {
    padding: 32px 32px;
  }

  @media (min-width: 1024px) {
    padding: 32px 0;
  }
}
.placeholder-content {
  padding: 60px 16px;
  text-align: center;
  color: $color-text-secondary;

  .placeholder-icon { margin-bottom: 16px; }
  h3 { color: $color-text-primary; margin-bottom: 4px; }
  p { font-size: 14px; }
}
</style>
