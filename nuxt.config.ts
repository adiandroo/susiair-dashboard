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
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      titleTemplate: '%s | Susi Air Dashboard',
      title: 'Dashboard',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/images/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/images/favicon.ico' },
      ],
      meta: [
        { name: 'description', content: 'Pilot operations dashboard for Susi Air — flight scheduling, hours tracking, and document management.' },
        { name: 'theme-color', content: '#0E2138' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { property: 'og:title', content: 'Susi Air Dashboard' },
        { property: 'og:description', content: 'Pilot operations dashboard for Susi Air — flight scheduling, hours tracking, and document management.' },
        { property: 'og:type', content: 'website' },
      ],
    },
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
