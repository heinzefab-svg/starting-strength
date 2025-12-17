import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './style.css'
import { registerSW } from 'virtual:pwa-register'

// Register service worker with update detection
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    if (confirm('🎉 New version available! Reload to update?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('✅ App ready to work offline')
  },
  onRegistered(registration) {
    // Check for updates every hour
    if (registration) {
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000)
    }
  },
  onRegisterError(error) {
    console.error('SW registration error:', error)
  }
})

// Handle install prompt
let deferredPrompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
  // Show install button/banner if needed
  window.dispatchEvent(new CustomEvent('pwa-installable'))
})

window.addEventListener('appinstalled', () => {
  deferredPrompt = null
  console.log('PWA installed successfully')
})

// Provide global install function
window.installPWA = async () => {
  if (!deferredPrompt) return false
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  deferredPrompt = null
  return outcome === 'accepted'
}

createApp(App)
  .use(router)
  .use(i18n)
  .mount('#app')
