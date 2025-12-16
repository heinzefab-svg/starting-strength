<template>
  <div id="app">
    <!-- Desktop Navigation -->
    <nav class="nav nav-desktop">
      <router-link to="/" :class="{ active: $route.name === 'workout' }">
        {{ $t('nav.workout') }}
      </router-link>
      <router-link to="/progress" :class="{ active: $route.name === 'progress' }">
        {{ $t('nav.progress') }}
      </router-link>
      <router-link to="/exercises" :class="{ active: $route.name === 'exercises' }">
        {{ $t('nav.exercises') }}
      </router-link>
      <router-link to="/stats" :class="{ active: $route.name === 'stats' }">
        {{ $t('nav.stats') }}
      </router-link>
      <router-link to="/measurements" :class="{ active: $route.name === 'measurements' }">
        {{ $t('nav.measurements') }}
      </router-link>
      <router-link to="/settings" :class="{ active: $route.name === 'settings' }">
        {{ $t('nav.settings') }}
      </router-link>
    </nav>

    <router-view />

    <!-- Mobile Bottom Navigation -->
    <nav class="nav-mobile">
      <router-link to="/" :class="{ active: $route.name === 'workout' }">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 10l-5 5-5-5M17 15l-5 5-5-5"/>
        </svg>
        <span>{{ $t('nav.workout') }}</span>
      </router-link>
      <router-link to="/progress" :class="{ active: $route.name === 'progress' }">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 3v18h18"/>
          <path d="M7 16l4-4 4 4 6-6"/>
        </svg>
        <span>{{ $t('nav.progress') }}</span>
      </router-link>
      <router-link to="/settings" :class="{ active: $route.name === 'settings' }">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
        </svg>
        <span>{{ $t('nav.settings') }}</span>
      </router-link>
      <button @click="showMenu = true" :class="{ active: showMenu || ['exercises', 'stats', 'measurements'].includes($route.name) }">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
        <span>{{ $t('nav.more') }}</span>
      </button>
    </nav>

    <!-- Mobile Menu Sidebar -->
    <div v-if="showMenu" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 2000;" @click="showMenu = false">
      <div @click.stop style="position: absolute; right: 0; top: 0; bottom: 0; width: 280px; max-width: 80%; background: var(--bg-secondary); padding: 1rem; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <h2 style="margin: 0; color: var(--text);">{{ $t('nav.menu') }}</h2>
          <button @click="showMenu = false" style="background: var(--bg-tertiary); border: none; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
            ×
          </button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <router-link to="/exercises" @click="showMenu = false" class="menu-item" :class="{ active: $route.name === 'exercises' }">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <span>{{ $t('nav.exercises') }}</span>
          </router-link>
          <router-link to="/stats" @click="showMenu = false" class="menu-item" :class="{ active: $route.name === 'stats' }">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <line x1="9" y1="3" x2="9" y2="21"/>
              <line x1="15" y1="3" x2="15" y2="21"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="3" y1="15" x2="21" y2="15"/>
            </svg>
            <span>{{ $t('nav.stats') }}</span>
          </router-link>
          <router-link to="/measurements" @click="showMenu = false" class="menu-item" :class="{ active: $route.name === 'measurements' }">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/>
              <path d="M18 2l4 4"/>
              <path d="M8 12h8"/>
              <path d="M12 8v8"/>
            </svg>
            <span>{{ $t('nav.measurements') }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      showMenu: false
    }
  },
  watch: {
    '$route'() {
      this.showMenu = false
      window.scrollTo(0, 0)
    }
  }
}
</script>
