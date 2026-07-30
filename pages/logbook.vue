<template>
  <div class="placeholder-page">
    <PageHeader title="Logbook" />
    <PlaceholderContent title="Logbook" description="Feature coming soon.">
      <template #icon>
        <svg width="48" height="48" fill="none" stroke="#D1D5DB" stroke-width="1.5" viewBox="0 0 24 24"><path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14M8 7h8M8 11h5"/></svg>
      </template>
    </PlaceholderContent>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Logbook',
  meta: [
    { name: 'description', content: 'View and manage your flight logbook entries.' },
  ],
})
</script>
