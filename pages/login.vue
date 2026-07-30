<template>
  <div class="login-page">
    <div class="login-bg"></div>
    <div class="login-card">
      <div class="login-logo">
        <img src="/images/susiair-logo.png" alt="Susi Air" width="200" height="40" />
      </div>
      <p class="login-subtitle">Pilot Portal</p>

      <form class="login-form" @submit.prevent="handleLogin">
        <p v-if="error" class="form-error">{{ error }}</p>
        <div class="form-group">
          <label>Username</label>
          <input v-model="username" type="text" class="input" :class="{ 'input--error': error && !username }" placeholder="Enter your username" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" class="input" :class="{ 'input--error': error && !password }" placeholder="Enter your password" />
        </div>
        <button type="submit" class="btn btn--primary btn--lg login-btn">Sign In</button>
      </form>

      <p class="login-help">Need help? Contact <strong>CRD</strong></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFlightStore } from '~/stores/flight'

definePageMeta({ layout: false })

useHead({
  title: 'Sign In',
  meta: [
    { name: 'description', content: 'Sign in to the Susi Air pilot operations dashboard.' },
  ],
})

const router = useRouter()
const store = useFlightStore()
const username = ref('')
const password = ref('')
const error = ref('')

function handleLogin() {
  if (!username.value && !password.value) {
    error.value = 'Please enter your username and password.'
    return
  }
  if (!username.value) {
    error.value = 'Please enter your username.'
    return
  }
  if (!password.value) {
    error.value = 'Please enter your password.'
    return
  }
  error.value = ''
  store.login()
  router.push('/')
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: $color-background;
  position: relative;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  top: -20%;
  right: -30%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(14, 33, 56, 0.04) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.login-card {
  width: 100%;
  max-width: 360px;
  background: $color-card;
  border-radius: 20px;
  padding: 40px 32px;
  box-shadow: 0 8px 32px rgba(14, 33, 56, 0.08), 0 2px 8px rgba(14, 33, 56, 0.04);
  text-align: center;
  position: relative;
  z-index: 1;
}

.login-logo {
  margin-bottom: 10px;
  display: flex;
  justify-content: center;

  img {
    height: 40px;
    width: auto;
  }
}

.login-title {
  font-size: 32px;
  font-weight: 700;
  color: $color-primary;
  letter-spacing: -0.02em;
  margin-bottom: 4px;

  .text-red { color: $color-brand-red; }
}

.login-subtitle {
  color: $color-text-secondary;
  margin-bottom: 32px;
  font-size: 14px;
}

.login-form {
  text-align: left;
}

.form-group {
  margin-bottom: 20px;

  label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: $color-text-secondary;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
}

.form-error {
  background: #FEF2F2;
  color: #DC2626;
  font-size: 12px;
  font-weight: 500;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.input--error {
  border-color: #DC2626;
  &:focus { border-color: #DC2626; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1); }
}

.login-btn {
  width: 100%;
  margin-top: 8px;
}

.login-help {
  margin-top: 24px;
  font-size: 13px;
  color: $color-text-secondary;

  strong {
    color: $color-brand-red;
    cursor: pointer;
    font-weight: 600;

    &:hover { text-decoration: underline; }
  }
}
</style>
