<template>
  <div class="container">
    <div class="card">
      <div class="card-header">{{ $t('stats.title') }}</div>

      <div v-if="workouts.length === 0" class="text-center" style="padding: 2rem;">
        <p class="text-tertiary">{{ $t('stats.noData') }}</p>
      </div>

      <div v-else>
        <div class="grid grid-2 mb-3">
          <div class="stat-card">
            <div class="stat-value">{{ workouts.length }}</div>
            <div class="stat-label">{{ $t('stats.totalWorkouts') }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ workoutStreak }}</div>
            <div class="stat-label">{{ $t('stats.dayStreak') }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ totalVolume.toLocaleString() }}</div>
            <div class="stat-label">{{ $t('stats.totalVolume') }} ({{ settings.weightUnit }})</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ averageWorkoutTime }}</div>
            <div class="stat-label">{{ $t('stats.avgWorkoutTime') }}</div>
          </div>
        </div>

        <div class="card card-elevated mb-3">
          <h3 class="mb-2">{{ $t('stats.exerciseProgress') }}</h3>
          <div class="mb-2">
            <select v-model="selectedExercise" style="margin-bottom: 0;">
              <option v-for="(exercise, key) in availableExercises" :key="key" :value="key">
                {{ $t(exercise.nameKey) }}
              </option>
            </select>
          </div>
          <canvas ref="progressChart"></canvas>
        </div>

        <div class="card card-elevated mb-3">
          <h3 class="mb-2">{{ $t('stats.volumeTrends') }}</h3>
          <canvas ref="volumeTrendsChart"></canvas>
        </div>

        <div class="card card-elevated">
          <h3 class="mb-2">{{ $t('stats.volumeByExercise') }}</h3>
          <canvas ref="volumeChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import storage from '../services/storage'
import { EXERCISES } from '../data/exercises'

Chart.register(...registerables)

export default {
  name: 'StatsView',
  data() {
    return {
      workouts: [],
      settings: { weightUnit: 'kg' },
      selectedExercise: null,
      progressChart: null,
      volumeChart: null,
      volumeTrendsChart: null,
      availableExercises: {}
    }
  },
  computed: {
    totalVolume() {
      return this.workouts.reduce((total, workout) => {
        return total + workout.exercises.reduce((exerciseTotal, exercise) => {
          const setsCompleted = exercise.sets.filter(s => s.completed).length
          return exerciseTotal + (exercise.weight * exercise.targetReps * setsCompleted)
        }, 0)
      }, 0)
    },
    workoutStreak() {
      if (this.workouts.length === 0) return 0

      const sortedDates = this.workouts
        .map(w => new Date(w.date).toDateString())
        .reverse()

      let streak = 1
      for (let i = 1; i < sortedDates.length; i++) {
        const current = new Date(sortedDates[i])
        const previous = new Date(sortedDates[i - 1])
        const diffDays = Math.floor((previous - current) / (1000 * 60 * 60 * 24))

        if (diffDays <= 2) {
          streak++
        } else {
          break
        }
      }
      return streak
    },
    averageWorkoutTime() {
      const times = this.workouts
        .filter(w => w.startTime && w.endTime)
        .map(w => {
          const start = new Date(w.startTime)
          const end = new Date(w.endTime)
          return (end - start) / 1000 / 60
        })

      if (times.length === 0) return '0m'
      const avg = times.reduce((a, b) => a + b, 0) / times.length
      return Math.round(avg) + 'm'
    }
  },
  watch: {
    selectedExercise() {
      this.updateProgressChart()
    }
  },
  mounted() {
    this.loadData()
    if (this.workouts.length > 0) {
      this.$nextTick(() => {
        this.initCharts()
      })
    }
  },
  beforeUnmount() {
    if (this.progressChart) this.progressChart.destroy()
    if (this.volumeChart) this.volumeChart.destroy()
    if (this.volumeTrendsChart) this.volumeTrendsChart.destroy()
  },
  methods: {
    loadData() {
      this.workouts = storage.getWorkouts()
      this.settings = storage.getSettings()

      // Get available exercises from workouts
      const exerciseKeys = new Set()
      this.workouts.forEach(w => {
        w.exercises.forEach(e => exerciseKeys.add(e.key))
      })

      this.availableExercises = {}
      exerciseKeys.forEach(key => {
        if (EXERCISES[key]) {
          this.availableExercises[key] = EXERCISES[key]
        }
      })

      if (!this.selectedExercise && Object.keys(this.availableExercises).length > 0) {
        this.selectedExercise = Object.keys(this.availableExercises)[0]
      }
    },
    initCharts() {
      this.updateProgressChart()
      this.updateVolumeTrendsChart()
      this.updateVolumeChart()
    },
    updateProgressChart() {
      if (!this.selectedExercise) return

      const history = storage.getExerciseHistory(this.selectedExercise)

      if (this.progressChart) {
        this.progressChart.destroy()
      }

      const ctx = this.$refs.progressChart
      if (!ctx) return

      this.progressChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: history.map(h => new Date(h.date).toLocaleDateString()),
          datasets: [{
            label: `${this.$t('workout.weight')} (${this.settings.weightUnit})`,
            data: history.map(h => h.exercise.weight),
            borderColor: '#ff6b35',
            backgroundColor: 'rgba(255, 107, 53, 0.1)',
            tension: 0.3,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#ff6b35'
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
    updateVolumeTrendsChart() {
      // Get last 10 workouts for trends
      const recentWorkouts = this.workouts.slice(-10)

      if (this.volumeTrendsChart) {
        this.volumeTrendsChart.destroy()
      }

      const ctx = this.$refs.volumeTrendsChart
      if (!ctx) return

      const volumeData = recentWorkouts.map(workout => {
        return workout.exercises.reduce((sum, exercise) => {
          const completedSets = exercise.sets.filter(s => s.completed)
          return sum + completedSets.reduce((exSum, set) => {
            return exSum + (exercise.weight * (set.reps || exercise.targetReps))
          }, 0)
        }, 0)
      })

      this.volumeTrendsChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: recentWorkouts.map(w => new Date(w.date).toLocaleDateString()),
          datasets: [{
            label: `${this.$t('workout.volume')} (${this.settings.weightUnit})`,
            data: volumeData,
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
              beginAtZero: true,
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
                color: '#b0b0b0',
                maxRotation: 45,
                minRotation: 0
              }
            }
          }
        }
      })
    },
    updateVolumeChart() {
      const exerciseKeys = Object.keys(this.availableExercises)
      const volumeData = exerciseKeys.map(key => {
        const history = storage.getExerciseHistory(key)
        return history.reduce((sum, h) => {
          const sets = h.exercise.sets.filter(s => s.completed).length
          return sum + (h.exercise.weight * h.exercise.targetReps * sets)
        }, 0)
      })

      if (this.volumeChart) {
        this.volumeChart.destroy()
      }

      const ctx = this.$refs.volumeChart
      if (!ctx) return

      this.volumeChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: exerciseKeys.map(key => this.$t(EXERCISES[key].nameKey)),
          datasets: [{
            label: `${this.$t('stats.totalVolume')} (${this.settings.weightUnit})`,
            data: volumeData,
            backgroundColor: [
              '#ff6b35',
              '#ffd23f',
              '#00d9a1',
              '#ff4757',
              '#8b5cf6',
              '#ff8659',
              '#ffa502'
            ]
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
              beginAtZero: true,
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
    }
  }
}
</script>
