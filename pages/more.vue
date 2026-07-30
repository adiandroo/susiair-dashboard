<template>
  <div class="placeholder-page">
    <PageHeader title="More" />
    <PlaceholderContent title="Settings &amp; More" description="Feature coming soon." />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'More',
  meta: [
    { name: 'description', content: 'Account settings, preferences, and additional features.' },
  ],
})
</script>
