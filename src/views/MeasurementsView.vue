<template>
  <div class="container">
    <div class="card">
      <div class="card-header">{{ $t('measurements.title') }}</div>

      <div class="card card-elevated mb-3">
        <h3 class="mb-2">{{ $t('measurements.addMeasurement') }}</h3>

        <div class="grid grid-2">
          <div>
            <label style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ $t('measurements.bodyweight') }} ({{ settings.weightUnit }})</span>
              <span style="font-size: 1.25rem; color: var(--primary); font-weight: 700;">{{ newMeasurement.weight || 0 }}{{ settings.weightUnit }}</span>
            </label>
            <input type="range" min="40" max="150" step="0.5" v-model.number="newMeasurement.weight" />
          </div>
          <div>
            <label style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ $t('measurements.waist') }} ({{ $t('common.cm') }})</span>
              <span style="font-size: 1.25rem; color: var(--accent); font-weight: 700;">{{ newMeasurement.waist || 0 }}cm</span>
            </label>
            <input type="range" min="50" max="150" step="0.5" v-model.number="newMeasurement.waist" />
          </div>
          <div>
            <label style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ $t('measurements.chest') }} ({{ $t('common.cm') }})</span>
              <span style="font-size: 1.25rem; color: var(--success); font-weight: 700;">{{ newMeasurement.chest || 0 }}cm</span>
            </label>
            <input type="range" min="60" max="150" step="0.5" v-model.number="newMeasurement.chest" />
          </div>
          <div>
            <label style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ $t('measurements.leftArm') }} ({{ $t('common.cm') }})</span>
              <span style="font-size: 1.25rem; color: var(--primary); font-weight: 700;">{{ newMeasurement.leftArm || 0 }}cm</span>
            </label>
            <input type="range" min="20" max="60" step="0.5" v-model.number="newMeasurement.leftArm" />
          </div>
          <div>
            <label style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ $t('measurements.rightArm') }} ({{ $t('common.cm') }})</span>
              <span style="font-size: 1.25rem; color: var(--primary); font-weight: 700;">{{ newMeasurement.rightArm || 0 }}cm</span>
            </label>
            <input type="range" min="20" max="60" step="0.5" v-model.number="newMeasurement.rightArm" />
          </div>
          <div>
            <label style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ $t('measurements.leftThigh') }} ({{ $t('common.cm') }})</span>
              <span style="font-size: 1.25rem; color: var(--accent); font-weight: 700;">{{ newMeasurement.leftThigh || 0 }}cm</span>
            </label>
            <input type="range" min="30" max="100" step="0.5" v-model.number="newMeasurement.leftThigh" />
          </div>
          <div>
            <label style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ $t('measurements.rightThigh') }} ({{ $t('common.cm') }})</span>
              <span style="font-size: 1.25rem; color: var(--accent); font-weight: 700;">{{ newMeasurement.rightThigh || 0 }}cm</span>
            </label>
            <input type="range" min="30" max="100" step="0.5" v-model.number="newMeasurement.rightThigh" />
          </div>
          <div>
            <label style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ $t('measurements.leftCalf') }} ({{ $t('common.cm') }})</span>
              <span style="font-size: 1.25rem; color: var(--success); font-weight: 700;">{{ newMeasurement.leftCalf || 0 }}cm</span>
            </label>
            <input type="range" min="20" max="60" step="0.5" v-model.number="newMeasurement.leftCalf" />
          </div>
          <div>
            <label style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ $t('measurements.rightCalf') }} ({{ $t('common.cm') }})</span>
              <span style="font-size: 1.25rem; color: var(--success); font-weight: 700;">{{ newMeasurement.rightCalf || 0 }}cm</span>
            </label>
            <input type="range" min="20" max="60" step="0.5" v-model.number="newMeasurement.rightCalf" />
          </div>
        </div>

        <div class="mb-2">
          <label>{{ $t('measurements.notes') }}</label>
          <textarea v-model="newMeasurement.notes" :placeholder="$t('measurements.notesPlaceholder')" rows="2"></textarea>
        </div>

        <button @click="saveMeasurement" class="btn btn-primary">
          {{ $t('measurements.saveMeasurement') }}
        </button>
      </div>

      <div v-if="measurements.length > 0">
        <div class="grid grid-2 mb-3">
          <div class="stat-card">
            <div class="stat-value">{{ latestWeight }}{{ settings.weightUnit }}</div>
            <div class="stat-label">{{ $t('measurements.currentWeight') }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" :style="{ color: weightChange >= 0 ? 'var(--success)' : 'var(--danger)' }">
              {{ weightChange >= 0 ? '+' : '' }}{{ weightChange }}{{ settings.weightUnit }}
            </div>
            <div class="stat-label">{{ $t('measurements.weightChange') }}</div>
          </div>
        </div>

        <div class="card card-elevated mb-3">
          <h3 class="mb-2">{{ $t('measurements.bodyweightProgress') }}</h3>
          <canvas ref="weightChart"></canvas>
        </div>

        <div class="card card-elevated">
          <h3 class="mb-2">{{ $t('measurements.measurementHistory') }}</h3>
          <div class="exercise-list">
            <div v-for="measurement in recentMeasurements" :key="measurement.id" class="exercise-item">
              <div style="flex: 1;">
                <div class="exercise-name">{{ formatDate(measurement.date) }}</div>
                <div class="exercise-detail">
                  {{ $t('measurements.bodyweight') }}: {{ measurement.weight }}{{ settings.weightUnit }}
                  <span v-if="measurement.waist"> • {{ $t('measurements.waist') }}: {{ measurement.waist }}cm</span>
                  <span v-if="measurement.chest"> • {{ $t('measurements.chest') }}: {{ measurement.chest }}cm</span>
                </div>
                <div v-if="measurement.leftArm || measurement.rightArm || measurement.leftThigh || measurement.rightThigh || measurement.leftCalf || measurement.rightCalf" class="exercise-detail mt-1">
                  <span v-if="measurement.leftArm">{{ $t('measurements.leftArm') }}: {{ measurement.leftArm }}cm</span>
                  <span v-if="measurement.rightArm"> • {{ $t('measurements.rightArm') }}: {{ measurement.rightArm }}cm</span>
                  <span v-if="measurement.leftThigh"> • {{ $t('measurements.leftThigh') }}: {{ measurement.leftThigh }}cm</span>
                  <span v-if="measurement.rightThigh"> • {{ $t('measurements.rightThigh') }}: {{ measurement.rightThigh }}cm</span>
                  <span v-if="measurement.leftCalf"> • {{ $t('measurements.leftCalf') }}: {{ measurement.leftCalf }}cm</span>
                  <span v-if="measurement.rightCalf"> • {{ $t('measurements.rightCalf') }}: {{ measurement.rightCalf }}cm</span>
                </div>
                <div v-if="measurement.notes" class="mt-1 text-secondary" style="font-size: 0.875rem; font-style: italic;">
                  {{ measurement.notes }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center" style="padding: 2rem;">
        <p class="text-tertiary">{{ $t('measurements.noData') }}</p>
      </div>
    </div>

    <!-- Alert Modal -->
    <div v-if="showAlert" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1001; padding: 1rem;" @click.self="closeAlert">
      <div class="card" style="max-width: 400px; width: 100%; text-align: center; position: relative;">
        <button @click="closeAlert" style="position: absolute; top: 1rem; right: 1rem; background: var(--bg-tertiary); border: none; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; z-index: 1;">
          ×
        </button>
        <p style="margin-bottom: 1.5rem; font-size: 1.125rem;">{{ alertMessage }}</p>
        <button @click="closeAlert" class="btn btn-primary" style="width: 100%;">
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import storage from '../services/storage'

Chart.register(...registerables)

export default {
  name: 'MeasurementsView',
  data() {
    return {
      measurements: [],
      settings: { weightUnit: 'kg' },
      newMeasurement: {
        weight: null,
        waist: null,
        chest: null,
        leftArm: null,
        rightArm: null,
        leftThigh: null,
        rightThigh: null,
        leftCalf: null,
        rightCalf: null,
        notes: ''
      },
      weightChart: null,
      showAlert: false,
      alertMessage: ''
    }
  },
  computed: {
    recentMeasurements() {
      return [...this.measurements].reverse()
    },
    latestWeight() {
      if (this.measurements.length === 0) return 0
      return this.measurements[this.measurements.length - 1].weight
    },
    weightChange() {
      if (this.measurements.length < 2) return 0
      const first = this.measurements[0].weight
      const latest = this.measurements[this.measurements.length - 1].weight
      return (latest - first).toFixed(1)
    }
  },
  mounted() {
    this.loadData()
    if (this.measurements.length > 0) {
      this.$nextTick(() => {
        this.initChart()
      })
    }
  },
  beforeUnmount() {
    if (this.weightChart) {
      this.weightChart.destroy()
    }
  },
  methods: {
    loadData() {
      this.measurements = storage.getMeasurements()
      this.settings = storage.getSettings()
    },
    saveMeasurement() {
      if (!this.newMeasurement.weight) {
        this.alertMessage = this.$t('measurements.enterWeight')
        this.showAlert = true
        return
      }

      storage.saveMeasurement(this.newMeasurement)
      this.newMeasurement = {
        weight: null,
        waist: null,
        chest: null,
        leftArm: null,
        rightArm: null,
        leftThigh: null,
        rightThigh: null,
        leftCalf: null,
        rightCalf: null,
        notes: ''
      }
      this.loadData()

      this.$nextTick(() => {
        if (this.weightChart) {
          this.weightChart.destroy()
        }
        this.initChart()
      })
    },
    initChart() {
      const ctx = this.$refs.weightChart
      if (!ctx) return

      this.weightChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.measurements.map(m => new Date(m.date).toLocaleDateString()),
          datasets: [{
            label: `${this.$t('measurements.bodyweight')} (${this.settings.weightUnit})`,
            data: this.measurements.map(m => m.weight),
            borderColor: '#00d9a1',
            backgroundColor: 'rgba(0, 217, 161, 0.1)',
            tension: 0.3,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#00d9a1'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              grid: {
                color: '#333333'
              },
              ticks: {
                color: '#b0b0b0'
              }
            },
            x: {
              grid: {
                color: '#333333'
              },
              ticks: {
                color: '#b0b0b0'
              }
            }
          }
        }
      })
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString()
    },
    closeAlert() {
      this.showAlert = false
    }
  }
}
</script>
