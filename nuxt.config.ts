export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt', '@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
    },
    display: 'swap',
    prefetch: true,
    preload: true,
  },
  ssr: false,
  css: ['~/assets/scss/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            $color-primary: #0E2138;
            $color-brand-red: #E63757;
            $color-background: #F5F6F8;
            $color-card: #FFFFFF;
            $color-text-primary: #0E2138;
            $color-text-secondary: #6B7280;
            $color-success: #1FBF8F;
            $color-warning: #F59E0B;
            $color-danger: #E63757;
            $color-chart-accent: #22C5E8;
          `
        }
      }
    }
  }
})
