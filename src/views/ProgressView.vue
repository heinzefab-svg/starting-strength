<template>
  <div class="container">
    <div class="card">
      <div class="card-header">{{ $t('progress.title') }}</div>

      <div v-if="workouts.length === 0" class="text-center" style="padding: 2rem;">
        <p class="text-tertiary">{{ $t('progress.noData') }}</p>
      </div>

      <div v-else>
        <div class="grid grid-2 mb-3">
          <div class="stat-card">
            <div class="stat-value">{{ workouts.length }}</div>
            <div class="stat-label">{{ $t('progress.totalWorkouts') }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ totalVolume.toFixed(0) }}</div>
            <div class="stat-label">{{ $t('progress.totalVolume') }} ({{ settings.weightUnit }})</div>
          </div>
          <div class="stat-card" style="border-left: 3px solid var(--accent);">
            <div class="stat-value" style="color: var(--accent);">{{ currentStreak }}</div>
            <div class="stat-label">{{ $t('progress.dayStreak') }}</div>
          </div>
          <div class="stat-card" style="border-left: 3px solid var(--success);">
            <div class="stat-value" style="color: var(--success);">{{ longestStreak }}</div>
            <div class="stat-label">{{ $t('progress.longestStreak') }}</div>
          </div>
        </div>

        <!-- Stall Detection Warnings -->
        <div v-if="stallDetections.length > 0" class="card card-elevated mb-3" style="background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 87, 34, 0.1) 100%); border-left: 4px solid var(--warning);">
          <div class="card-header" style="display: flex; align-items: center; gap: 0.5rem; color: var(--warning);">
            <span style="font-size: 1.5rem;">⚠️</span>
            <span>{{ $t('progress.stallDetected') }}</span>
          </div>
          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">
            {{ $t('progress.stallDescription') }}
          </p>
          <div style="display: grid; gap: 0.75rem;">
            <div v-for="stall in stallDetections" :key="stall.key"
                 style="padding: 1rem; background: var(--bg-tertiary); border-radius: 8px; border-left: 3px solid var(--warning);">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                <div>
                  <div style="font-weight: 600; color: var(--text); margin-bottom: 0.25rem;">
                    {{ $t(stall.nameKey) }}
                  </div>
                  <div style="font-size: 0.875rem; color: var(--text-secondary);">
                    {{ $t('progress.failedSessions', { count: stall.failedCount }) }}
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 0.875rem; color: var(--text-tertiary);">
                    {{ $t('progress.currentWeight') }}
                  </div>
                  <div style="font-size: 1.25rem; font-weight: 700; color: var(--warning);">
                    {{ stall.currentWeight }}{{ settings.weightUnit }}
                  </div>
                </div>
              </div>
              <div style="padding: 0.75rem; background: var(--bg); border-radius: 6px; margin-top: 0.75rem;">
                <div style="font-size: 0.875rem; color: var(--success); font-weight: 600; margin-bottom: 0.5rem;">
                  {{ $t('progress.deloadRecommendation') }}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: var(--text-secondary);">{{ $t('progress.deloadTo') }}</span>
                  <span style="font-size: 1.5rem; font-weight: 700; color: var(--success);">
                    {{ stall.deloadWeight }}{{ settings.weightUnit }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Personal Records Board -->
        <div class="card card-elevated mb-3" style="background: linear-gradient(135deg, rgba(0, 217, 161, 0.05) 0%, rgba(255, 215, 0, 0.05) 100%);">
          <div class="card-header" style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.5rem;">🏆</span>
            <span>{{ $t('progress.personalRecords') }}</span>
          </div>
          <div style="display: grid; gap: 0.75rem;">
            <div v-for="pr in personalRecords" :key="pr.key"
                 style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background: var(--bg-tertiary); border-radius: 8px; border-left: 3px solid var(--success);">
              <div style="flex: 1;">
                <div style="font-weight: 600; color: var(--text); margin-bottom: 0.25rem;">
                  {{ $t(pr.nameKey) }}
                </div>
                <div style="font-size: 0.875rem; color: var(--text-secondary);">
                  {{ formatDate(pr.date) }}
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--success);">
                  <span v-if="pr.isBodyweight && pr.weight > 0">+</span>{{ pr.weight }}{{ settings.weightUnit }}
                </div>
                <div style="font-size: 0.875rem; color: var(--text-tertiary);">
                  {{ pr.totalReps }} {{ $t('workout.reps') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-for="exercise in exerciseProgress" :key="exercise.key" class="card card-elevated mb-3">
          <h3 class="mb-2">{{ $t(exercise.nameKey) }}</h3>

          <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
            <div>
              <div class="text-secondary" style="font-size: 0.875rem;">{{ $t('progress.current') }}</div>
              <div style="font-size: 1.75rem; font-weight: 700;">
                <span v-if="exercise.isBodyweight && exercise.current > 0">+</span>{{ exercise.current }}{{ settings.weightUnit }}
              </div>
            </div>
            <div style="text-align: right;">
              <div class="text-secondary" style="font-size: 0.875rem;">{{ $t('progress.nextTarget') }}</div>
              <div style="font-size: 1.75rem; font-weight: 700; color: var(--success);">
                <span v-if="exercise.isBodyweight && exercise.next > 0">+</span>{{ exercise.next }}{{ settings.weightUnit }}
              </div>
            </div>
          </div>

          <div class="mt-2 text-tertiary" style="font-size: 0.875rem;">
            {{ $t('progress.totalLifted') }}: {{ exercise.totalLifted }}{{ settings.weightUnit }} •
            {{ exercise.sessions }} {{ $t('progress.sessions') }}
            <span v-if="exercise.weightGain > 0"> • +{{ exercise.weightGain }}{{ settings.weightUnit }}</span>
            <span v-if="exercise.estimated1RM"> • {{ $t('progress.estimated1RM') }}: {{ exercise.estimated1RM }}{{ settings.weightUnit }}</span>
          </div>

          <div v-if="exercise.sessions > 1" style="margin-top: 1rem;">
            <canvas :ref="`chart-${exercise.key}`"></canvas>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">{{ $t('progress.recentWorkouts') }}</div>
      <div class="exercise-list">
        <div v-for="workout in recentWorkouts" :key="workout.id" class="exercise-item" style="flex-direction: column; align-items: stretch;">
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 0.5rem;">
            <div style="flex: 1; min-width: 0;">
              <div class="exercise-name">{{ $t('workout.title') }} {{ workout.type }}</div>
              <div class="exercise-detail">
                {{ formatDate(workout.date) }} • {{ workout.exercises.length }} {{ $t('workout.exercises') }}
              </div>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
              <button @click="editWorkout(workout)" class="btn btn-secondary" style="padding: 0.5rem 0.75rem; font-size: 0.875rem; min-width: auto;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button @click="deleteWorkout(workout.id)" class="btn btn-danger" style="padding: 0.5rem 0.75rem; font-size: 0.875rem; min-width: auto;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Display notes from exercises -->
          <div v-if="workout.exercises.some(e => e.notes && e.notes.trim())" style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--border);">
            <div v-for="exercise in workout.exercises.filter(e => e.notes && e.notes.trim())" :key="exercise.key" style="margin-bottom: 0.5rem;">
              <div style="font-weight: 600; color: var(--text); font-size: 0.875rem; margin-bottom: 0.25rem;">
                {{ $t(EXERCISES[exercise.key].nameKey) }}:
              </div>
              <div style="color: var(--text-secondary); font-size: 0.875rem; font-style: italic; padding-left: 1rem;">
                "{{ exercise.notes }}"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editingWorkout" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1001; padding: 1rem; padding-bottom: 80px;" @click.self="cancelEdit">
      <div class="card" style="max-width: 600px; width: 100%; max-height: 85vh; overflow-y: auto; position: relative;">
        <button @click="cancelEdit" style="position: absolute; top: 1rem; right: 1rem; background: var(--bg-tertiary); border: none; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; z-index: 1;">
          ×
        </button>
        <div class="card-header">{{ $t('progress.edit') }} {{ $t('workout.title') }}</div>

        <div v-for="(exercise, index) in editingWorkout.exercises" :key="index" class="exercise-card">
          <h3 class="exercise-card-header">{{ $t(EXERCISES[exercise.key].nameKey) }}</h3>

          <div class="mb-2">
            <label style="display: flex; justify-content: space-between; align-items: center;">
              <span>
                {{ EXERCISES[exercise.key].isBodyweight ? $t('workout.addedWeight') : $t('workout.weight') }} ({{ settings.weightUnit }})
              </span>
              <span style="font-size: 1.5rem; color: var(--primary); font-weight: 700;">{{ exercise.weight }}{{ settings.weightUnit }}</span>
            </label>
            <input
              type="range"
              :min="0"
              :max="EXERCISES[exercise.key].isBodyweight ? 50 : 300"
              :step="EXERCISES[exercise.key].increment"
              v-model.number="exercise.weight"
            />
          </div>

          <div class="sets-grid">
            <div v-for="(set, setIndex) in exercise.sets" :key="setIndex" style="margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span class="set-label">{{ $t('workout.set') }} {{ setIndex + 1 }}:</span>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="font-weight: 700; color: var(--primary); font-size: 1.125rem;">{{ set.reps }}</span>
                  <span class="text-secondary">{{ $t('workout.reps') }}</span>
                  <button
                    @click="set.completed = !set.completed"
                    class="btn set-complete-btn"
                    :class="set.completed ? 'btn-success' : 'btn-secondary'"
                  >
                    {{ set.completed ? '✓' : ' ' }}
                  </button>
                </div>
              </div>
              <input
                type="range"
                :min="0"
                :max="20"
                :step="1"
                v-model.number="set.reps"
                style="margin: 0; width: 100%;"
              />
            </div>
          </div>

          <div class="mb-2">
            <label>{{ $t('workout.notes') }}</label>
            <textarea
              v-model="exercise.notes"
              :placeholder="$t('workout.notesPlaceholder')"
              rows="2"
            ></textarea>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
          <button @click="saveEdit" class="btn btn-success" style="flex: 1;">
            {{ $t('common.save') }}
          </button>
          <button @click="cancelEdit" class="btn btn-secondary">
            {{ $t('common.cancel') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1002; padding: 1rem;" @click.self="cancelDelete">
      <div class="card" style="max-width: 400px; width: 100%; text-align: center; position: relative;">
        <button @click="cancelDelete" style="position: absolute; top: 1rem; right: 1rem; background: var(--bg-tertiary); border: none; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; z-index: 1;">
          ×
        </button>
        <p style="margin-bottom: 1.5rem; font-size: 1.125rem;">{{ $t('progress.deleteConfirm') }}</p>
        <div style="display: flex; gap: 1rem;">
          <button @click="confirmDelete" class="btn btn-danger" style="flex: 1;">
            {{ $t('progress.delete') }}
          </button>
          <button @click="cancelDelete" class="btn btn-secondary" style="flex: 1;">
            {{ $t('common.cancel') }}
          </button>
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
  name: 'ProgressView',
  data() {
    return {
      workouts: [],
      settings: { weightUnit: 'kg' },
      editingWorkout: null,
      EXERCISES,
      showDeleteConfirm: false,
      deleteWorkoutId: null,
      exerciseCharts: {}
    }
  },
  computed: {
    recentWorkouts() {
      return [...this.workouts].reverse().slice(0, 10)
    },
    currentStreak() {
      if (this.workouts.length === 0) return 0

      const sortedWorkouts = [...this.workouts].sort((a, b) => new Date(b.date) - new Date(a.date))
      let streak = 0
      let lastDate = null

      for (const workout of sortedWorkouts) {
        const workoutDate = new Date(workout.date)
        workoutDate.setHours(0, 0, 0, 0)

        if (!lastDate) {
          lastDate = workoutDate
          streak = 1
          continue
        }

        const dayDiff = Math.floor((lastDate - workoutDate) / (1000 * 60 * 60 * 24))

        if (dayDiff === 0) {
          // Same day, continue
          continue
        } else if (dayDiff <= 2) {
          // Within 2 days (allows for rest day)
          streak++
          lastDate = workoutDate
        } else {
          // Gap too large, streak broken
          break
        }
      }

      return streak
    },
    longestStreak() {
      if (this.workouts.length === 0) return 0

      const sortedWorkouts = [...this.workouts].sort((a, b) => new Date(a.date) - new Date(b.date))
      let currentStreak = 1
      let maxStreak = 1
      let lastDate = null

      for (const workout of sortedWorkouts) {
        const workoutDate = new Date(workout.date)
        workoutDate.setHours(0, 0, 0, 0)

        if (!lastDate) {
          lastDate = workoutDate
          continue
        }

        const dayDiff = Math.floor((workoutDate - lastDate) / (1000 * 60 * 60 * 24))

        if (dayDiff === 0) {
          // Same day, continue
          continue
        } else if (dayDiff <= 2) {
          // Within 2 days
          currentStreak++
          maxStreak = Math.max(maxStreak, currentStreak)
          lastDate = workoutDate
        } else {
          // Gap too large, reset streak
          currentStreak = 1
          lastDate = workoutDate
        }
      }

      return maxStreak
    },
    stallDetections() {
      const allExerciseKeys = [...new Set([
        ...this.settings.workoutA,
        ...this.settings.workoutB
      ])]

      const stalls = []

      allExerciseKeys.forEach(key => {
        const exercise = EXERCISES[key]
        const history = storage.getExerciseHistory(key)

        if (history.length < 3) return

        // Get last 3 workouts
        const lastThree = history.slice(-3)

        // Check if all 3 had the same weight
        const sameWeight = lastThree.every(h => h.exercise.weight === lastThree[0].exercise.weight)

        if (!sameWeight) return

        // Check if at least 2 of them had incomplete sets
        const failedWorkouts = lastThree.filter(h => {
          return h.exercise.sets.some(s => !s.completed)
        })

        if (failedWorkouts.length >= 2) {
          const currentWeight = lastThree[0].exercise.weight
          const deloadWeight = Math.round((currentWeight * 0.9) / exercise.increment) * exercise.increment

          stalls.push({
            key,
            nameKey: exercise.nameKey,
            currentWeight,
            deloadWeight,
            failedCount: failedWorkouts.length
          })
        }
      })

      return stalls
    },
    personalRecords() {
      const allExerciseKeys = [...new Set([
        ...this.settings.workoutA,
        ...this.settings.workoutB
      ])]

      return allExerciseKeys.map(key => {
        const exercise = EXERCISES[key]
        const history = storage.getExerciseHistory(key)

        if (history.length === 0) return null

        // Find the workout with the highest weight where all sets were completed
        let maxWeightWorkout = null
        let maxWeight = -1

        history.forEach(h => {
          const allSetsCompleted = h.exercise.sets.every(s => s.completed)
          if (allSetsCompleted && h.exercise.weight > maxWeight) {
            maxWeight = h.exercise.weight
            maxWeightWorkout = h
          }
        })

        if (!maxWeightWorkout) return null

        const totalReps = maxWeightWorkout.exercise.sets
          .filter(s => s.completed)
          .reduce((sum, s) => sum + (s.reps || maxWeightWorkout.exercise.targetReps), 0)

        return {
          key,
          nameKey: exercise.nameKey,
          isBodyweight: exercise.isBodyweight,
          weight: maxWeightWorkout.exercise.weight,
          date: maxWeightWorkout.date,
          totalReps
        }
      }).filter(pr => pr !== null).sort((a, b) => b.weight - a.weight)
    },
    totalVolume() {
      return this.workouts.reduce((total, workout) => {
        return total + workout.exercises.reduce((exerciseTotal, exercise) => {
          const completedSets = exercise.sets.filter(s => s.completed)
          const setVolume = completedSets.reduce((sum, set) => {
            return sum + (exercise.weight * (set.reps || exercise.targetReps))
          }, 0)
          return exerciseTotal + setVolume
        }, 0)
      }, 0)
    },
    exerciseProgress() {
      const allExerciseKeys = [...new Set([
        ...this.settings.workoutA,
        ...this.settings.workoutB
      ])]

      return allExerciseKeys.map(key => {
        const exercise = EXERCISES[key]
        const history = storage.getExerciseHistory(key)

        if (history.length === 0) {
          return {
            key,
            nameKey: exercise.nameKey,
            current: 0,
            next: 0,
            progress: 0,
            totalLifted: 0,
            sessions: 0
          }
        }

        const latest = history[history.length - 1].exercise
        const increment = exercise.increment

        const totalLifted = history.reduce((sum, h) => {
          const completedSets = h.exercise.sets.filter(s => s.completed)
          const setVolume = completedSets.reduce((setSum, set) => {
            return setSum + (h.exercise.weight * (set.reps || h.exercise.targetReps))
          }, 0)
          return sum + setVolume
        }, 0)

        const starting = history[0].exercise.weight
        const current = latest.weight
        const next = current + increment

        // Calculate estimated 1RM using Epley formula: 1RM = weight × (1 + reps/30)
        // Use the best completed set from the latest workout
        let estimated1RM = null
        if (!exercise.isBodyweight && latest.sets.length > 0) {
          const completedSets = latest.sets.filter(s => s.completed && s.reps > 0 && s.reps < 12)
          if (completedSets.length > 0) {
            const bestSet = completedSets.reduce((best, set) => {
              const currentReps = set.reps || latest.targetReps
              const bestReps = best.reps || latest.targetReps
              const currentEst = latest.weight * (1 + currentReps / 30)
              const bestEst = latest.weight * (1 + bestReps / 30)
              return currentEst > bestEst ? set : best
            })
            const reps = bestSet.reps || latest.targetReps
            estimated1RM = Math.round(latest.weight * (1 + reps / 30))
          }
        }

        return {
          key,
          nameKey: exercise.nameKey,
          current,
          next,
          isBodyweight: exercise.isBodyweight,
          totalLifted: Math.round(totalLifted),
          sessions: history.length,
          weightGain: current - starting,
          estimated1RM
        }
      }).filter(e => e.sessions > 0)
    }
  },
  mounted() {
    this.loadData()
    this.$nextTick(() => {
      this.initCharts()
    })
  },
  beforeUnmount() {
    this.destroyCharts()
  },
  methods: {
    loadData() {
      this.workouts = storage.getWorkouts()
      this.settings = storage.getSettings()
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    editWorkout(workout) {
      this.editingWorkout = JSON.parse(JSON.stringify(workout))
    },
    saveEdit() {
      storage.updateWorkout(this.editingWorkout.id, this.editingWorkout)
      this.editingWorkout = null
      this.loadData()
      this.$nextTick(() => {
        this.destroyCharts()
        this.initCharts()
      })
    },
    cancelEdit() {
      this.editingWorkout = null
    },
    deleteWorkout(id) {
      this.deleteWorkoutId = id
      this.showDeleteConfirm = true
    },
    confirmDelete() {
      storage.deleteWorkout(this.deleteWorkoutId)
      this.loadData()
      this.showDeleteConfirm = false
      this.deleteWorkoutId = null
      this.$nextTick(() => {
        this.destroyCharts()
        this.initCharts()
      })
    },
    cancelDelete() {
      this.showDeleteConfirm = false
      this.deleteWorkoutId = null
    },
    destroyCharts() {
      Object.values(this.exerciseCharts).forEach(chart => {
        if (chart) chart.destroy()
      })
      this.exerciseCharts = {}
    },
    initCharts() {
      this.exerciseProgress.forEach(exercise => {
        if (exercise.sessions <= 1) return

        const history = storage.getExerciseHistory(exercise.key)
        const chartRef = this.$refs[`chart-${exercise.key}`]

        if (!chartRef || !chartRef[0]) return

        const ctx = chartRef[0]
        const isBodyweight = exercise.isBodyweight

        this.exerciseCharts[exercise.key] = new Chart(ctx, {
          type: 'line',
          data: {
            labels: history.map(h => new Date(h.date).toLocaleDateString()),
            datasets: [{
              label: `${this.$t(exercise.nameKey)} (${this.settings.weightUnit})`,
              data: history.map(h => h.exercise.weight),
              borderColor: isBodyweight ? '#FFD700' : '#00d9a1',
              backgroundColor: isBodyweight ? 'rgba(255, 215, 0, 0.1)' : 'rgba(0, 217, 161, 0.1)',
              tension: 0.3,
              fill: true,
              pointRadius: 4,
              pointBackgroundColor: isBodyweight ? '#FFD700' : '#00d9a1'
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
                beginAtZero: !isBodyweight,
                grid: {
                  color: '#333333'
                },
                ticks: {
                  color: '#b0b0b0',
                  callback: function(value) {
                    return (isBodyweight && value > 0 ? '+' : '') + value
                  }
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
      })
    }
  }
}
</script>
