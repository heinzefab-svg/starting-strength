<template>
  <div class="container">
    <div class="card">
      <div class="card-header">{{ $t('settings.title') }}</div>

      <div style="margin-bottom: 2rem;">
        <label>{{ $t('settings.language') }}</label>
        <select v-model="settings.language" @change="changeLanguage">
          <option value="de">Deutsch</option>
          <option value="en">English</option>
        </select>
      </div>

      <div style="margin-bottom: 2rem;">
        <label>{{ $t('settings.weightUnit') }}</label>
        <select v-model="settings.weightUnit">
          <option value="kg">{{ $t('common.kg') }}</option>
          <option value="lbs">{{ $t('common.lbs') }}</option>
        </select>
      </div>

      <div style="margin-bottom: 2rem;">
        <label>{{ $t('settings.bodyweightProgression') }}</label>
        <select v-model="settings.bodyweightProgression">
          <option value="weight">{{ $t('settings.progressWithWeight') }}</option>
          <option value="reps">{{ $t('settings.progressWithReps') }}</option>
        </select>
        <p class="text-tertiary" style="font-size: 0.875rem; margin-top: 0.5rem;">
          {{ settings.bodyweightProgression === 'weight' ? 'Pull-ups/Dips: 3×5 → 3×5 +2.5kg' : 'Pull-ups/Dips: 3×5 → 3×6' }}
        </p>
      </div>

      <div style="margin-bottom: 2rem;">
        <h3 style="margin-bottom: 1rem; color: var(--text);">{{ $t('settings.restTimer') }}</h3>

        <label style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; cursor: pointer;">
          <input type="checkbox" v-model="settings.restTimerEnabled" style="width: auto; margin: 0;">
          <span>{{ $t('settings.restTimerEnabled') }}</span>
        </label>

        <div v-if="settings.restTimerEnabled">
          <label>{{ $t('settings.restTimerDuration') }}</label>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <input
              type="range"
              v-model.number="settings.restTimerDuration"
              min="60"
              max="600"
              step="30"
              style="flex: 1;"
            />
            <span style="min-width: 80px; font-weight: 700; color: var(--primary);">
              {{ Math.floor(settings.restTimerDuration / 60) }}:{{ (settings.restTimerDuration % 60).toString().padStart(2, '0') }}
            </span>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 2rem;">
        <h3 style="margin-bottom: 1rem; color: var(--text);">{{ $t('settings.workoutConfiguration') }}</h3>

        <div class="card card-elevated" style="margin-bottom: 1rem;">
          <h4 style="margin-bottom: 1rem; color: var(--primary);">{{ $t('settings.workoutA') }}</h4>
          <label style="text-transform: none;">{{ $t('settings.selectExercises') }}</label>
          <div style="display: grid; gap: 0.5rem;">
            <label v-for="(exercise, key) in exercises" :key="key"
                   style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: var(--bg-tertiary); border-radius: 8px; cursor: pointer; text-transform: none;">
              <input type="checkbox"
                     :value="key"
                     v-model="settings.workoutA"
                     style="width: auto; margin: 0;">
              <span style="color: var(--text);">{{ $t(exercise.nameKey) }}</span>
            </label>
          </div>
        </div>

        <div class="card card-elevated">
          <h4 style="margin-bottom: 1rem; color: var(--accent);">{{ $t('settings.workoutB') }}</h4>
          <label style="text-transform: none;">{{ $t('settings.selectExercises') }}</label>
          <div style="display: grid; gap: 0.5rem;">
            <label v-for="(exercise, key) in exercises" :key="key"
                   style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: var(--bg-tertiary); border-radius: 8px; cursor: pointer; text-transform: none;">
              <input type="checkbox"
                     :value="key"
                     v-model="settings.workoutB"
                     style="width: auto; margin: 0;">
              <span style="color: var(--text);">{{ $t(exercise.nameKey) }}</span>
            </label>
          </div>
        </div>
      </div>

      <button @click="saveSettings" class="btn btn-primary">
        {{ $t('settings.save') }}
      </button>
    </div>

    <!-- Backup & Restore -->
    <div class="card">
      <div class="card-header">{{ $t('settings.backupRestore') }}</div>

      <div style="display: grid; gap: 1rem;">
        <div>
          <p class="text-secondary" style="margin-bottom: 1rem;">
            {{ $t('settings.exportDescription') }}
          </p>
          <button @click="exportData" class="btn btn-secondary" style="width: 100%;">
            {{ $t('settings.exportData') }}
          </button>
        </div>

        <div>
          <p class="text-secondary" style="margin-bottom: 1rem;">
            {{ $t('settings.importDescription') }}
          </p>
          <input
            ref="fileInput"
            type="file"
            accept=".json"
            @change="handleFileSelect"
            style="display: none;"
          />
          <button @click="$refs.fileInput.click()" class="btn btn-secondary" style="width: 100%;">
            {{ $t('settings.importData') }}
          </button>
        </div>
      </div>
    </div>

    <div class="card" style="border-color: var(--danger); background: var(--bg-secondary);">
      <div class="card-header" style="background: linear-gradient(135deg, var(--danger) 0%, var(--warning) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
        {{ $t('settings.dangerZone') }}
      </div>
      <p class="text-secondary mb-3">
        {{ $t('settings.clearDataWarning') }}
      </p>
      <button @click="clearAllData" class="btn btn-danger">
        {{ $t('settings.clearAllData') }}
      </button>
    </div>

    <!-- Saved Alert Modal -->
    <div v-if="showSavedAlert" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1001; padding: 1rem;" @click.self="closeSavedAlert">
      <div class="card" style="max-width: 400px; width: 100%; text-align: center; position: relative;">
        <button @click="closeSavedAlert" style="position: absolute; top: 1rem; right: 1rem; background: var(--bg-tertiary); border: none; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; z-index: 1;">
          ×
        </button>
        <p style="margin-bottom: 1.5rem; font-size: 1.125rem;">{{ $t('settings.saved') }}</p>
        <button @click="closeSavedAlert" class="btn btn-primary" style="width: 100%;">
          OK
        </button>
      </div>
    </div>

    <!-- Clear Data Confirmation Modal -->
    <div v-if="showClearConfirm" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1001; padding: 1rem;" @click.self="cancelClearData">
      <div class="card" style="max-width: 400px; width: 100%; text-align: center; position: relative;">
        <button @click="cancelClearData" style="position: absolute; top: 1rem; right: 1rem; background: var(--bg-tertiary); border: none; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; z-index: 1;">
          ×
        </button>
        <p style="margin-bottom: 1.5rem; font-size: 1.125rem;">{{ $t('settings.clearDataConfirm') }}</p>
        <div style="display: flex; gap: 1rem;">
          <button @click="confirmClearData" class="btn btn-danger" style="flex: 1;">
            {{ $t('settings.clearAllData') }}
          </button>
          <button @click="cancelClearData" class="btn btn-secondary" style="flex: 1;">
            {{ $t('common.cancel') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Cleared Alert Modal -->
    <div v-if="showClearedAlert" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1001; padding: 1rem;">
      <div class="card" style="max-width: 400px; width: 100%; text-align: center;">
        <p style="margin-bottom: 1.5rem; font-size: 1.125rem;">{{ $t('settings.dataCleared') }}</p>
      </div>
    </div>

    <!-- Import Success Modal -->
    <div v-if="showImportSuccess" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1001; padding: 1rem;">
      <div class="card" style="max-width: 400px; width: 100%; text-align: center;">
        <p style="margin-bottom: 1.5rem; font-size: 1.125rem; color: var(--success);">{{ $t('settings.importSuccess') }}</p>
      </div>
    </div>

    <!-- Import Error Modal -->
    <div v-if="showImportError" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1001; padding: 1rem;" @click.self="closeImportError">
      <div class="card" style="max-width: 400px; width: 100%; text-align: center; position: relative;">
        <button @click="closeImportError" style="position: absolute; top: 1rem; right: 1rem; background: var(--bg-tertiary); border: none; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; z-index: 1;">
          ×
        </button>
        <p style="margin-bottom: 1rem; font-size: 1.125rem; color: var(--danger);">{{ $t('settings.importError') }}</p>
        <p style="font-size: 0.875rem; color: var(--text-secondary);">{{ importErrorMessage }}</p>
        <button @click="closeImportError" class="btn btn-secondary" style="width: 100%; margin-top: 1.5rem;">
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import storage from '../services/storage'
import { EXERCISES } from '../data/exercises'

export default {
  name: 'SettingsView',
  data() {
    return {
      settings: {
        weightUnit: 'kg',
        language: 'de',
        workoutA: [],
        workoutB: [],
        bodyweightProgression: 'weight',
        restTimerEnabled: true,
        restTimerDuration: 180
      },
      exercises: EXERCISES,
      showSavedAlert: false,
      showClearConfirm: false,
      showClearedAlert: false,
      showImportSuccess: false,
      showImportError: false,
      importErrorMessage: ''
    }
  },
  mounted() {
    this.settings = storage.getSettings()
  },
  methods: {
    changeLanguage() {
      this.$i18n.locale = this.settings.language
      localStorage.setItem('locale', this.settings.language)
    },
    saveSettings() {
      storage.saveSettings(this.settings)
      this.showSavedAlert = true
    },
    clearAllData() {
      this.showClearConfirm = true
    },
    confirmClearData() {
      localStorage.clear()
      this.showClearConfirm = false
      this.showClearedAlert = true
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    },
    cancelClearData() {
      this.showClearConfirm = false
    },
    closeSavedAlert() {
      this.showSavedAlert = false
    },
    exportData() {
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        data: {
          workouts: storage.getWorkouts(),
          measurements: storage.getMeasurements(),
          settings: storage.getSettings()
        }
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const timestamp = new Date().toISOString().split('T')[0]
      link.href = url
      link.download = `starting-strength-backup-${timestamp}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target.result)

          // Validate data structure
          if (!importData.data || !importData.data.workouts || !importData.data.measurements || !importData.data.settings) {
            throw new Error('Invalid backup file format')
          }

          // Import data
          localStorage.setItem('ss_workouts', JSON.stringify(importData.data.workouts))
          localStorage.setItem('ss_measurements', JSON.stringify(importData.data.measurements))
          localStorage.setItem('ss_settings', JSON.stringify(importData.data.settings))

          this.showImportSuccess = true
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        } catch (error) {
          this.importErrorMessage = error.message
          this.showImportError = true
        }
      }
      reader.readAsText(file)

      // Reset file input
      event.target.value = ''
    },
    closeImportError() {
      this.showImportError = false
      this.importErrorMessage = ''
    }
  }
}
</script>
