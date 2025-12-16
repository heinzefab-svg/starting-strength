<template>
  <div class="container">
    <div class="card">
      <div class="card-header">{{ $t('exercises.title') }}</div>
      <p class="mb-3 text-secondary">
        {{ $t('exercises.description') }}
      </p>

      <div v-for="(exercise, key) in exercises" :key="key" class="card card-elevated mb-3">
        <div @click="toggleExercise(key)" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 class="mb-1">{{ $t(exercise.nameKey) }}</h3>
            <p class="text-secondary" style="font-size: 0.875rem;">{{ $t(exercise.descriptionKey) }}</p>
            <p class="mt-1" style="font-weight: 600; font-size: 0.875rem; color: var(--primary);">
              {{ exercise.sets }} x {{ exercise.reps }} • +{{ exercise.increment }}{{ settings.weightUnit }} {{ $t('exercises.progression') }}
            </p>
          </div>
          <span style="font-size: 2rem; color: var(--primary);">{{ expandedExercise === key ? '−' : '+' }}</span>
        </div>

        <div v-if="expandedExercise === key" class="mt-3" style="padding-top: 1.5rem; border-top: 1px solid var(--border);">
          <h4 class="mb-2" style="color: var(--primary);">{{ $t('exercises.instructions') }}</h4>
          <ol style="margin-left: 1.5rem; margin-bottom: 1.5rem; color: var(--text-secondary);">
            <li v-for="(instruction, i) in getInstructions(exercise)" :key="i" class="mb-1">
              {{ instruction }}
            </li>
          </ol>

          <h4 class="mb-2" style="color: var(--accent);">{{ $t('exercises.tips') }}</h4>
          <ul style="margin-left: 1.5rem; margin-bottom: 1.5rem; color: var(--text-secondary);">
            <li v-for="(tip, i) in getTips(exercise)" :key="i" class="mb-1">
              {{ tip }}
            </li>
          </ul>

          <div v-if="exerciseStats[key]" class="mt-3" style="padding-top: 1.5rem; border-top: 1px solid var(--border);">
            <h4 class="mb-2" style="color: var(--success);">{{ $t('exercises.yourStats') }}</h4>
            <div class="grid grid-3">
              <div>
                <div class="text-secondary" style="font-size: 0.875rem;">{{ $t('exercises.currentWeight') }}</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">
                  {{ exerciseStats[key].current }}{{ settings.weightUnit }}
                </div>
              </div>
              <div>
                <div class="text-secondary" style="font-size: 0.875rem;">{{ $t('exercises.sessions') }}</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent);">
                  {{ exerciseStats[key].sessions }}
                </div>
              </div>
              <div>
                <div class="text-secondary" style="font-size: 0.875rem;">{{ $t('exercises.totalVolume') }}</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--success);">
                  {{ exerciseStats[key].volume }}{{ settings.weightUnit }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EXERCISES } from '../data/exercises'
import storage from '../services/storage'

export default {
  name: 'ExercisesView',
  data() {
    return {
      exercises: EXERCISES,
      expandedExercise: null,
      exerciseStats: {},
      settings: { weightUnit: 'kg' }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.settings = storage.getSettings()

      Object.keys(EXERCISES).forEach(key => {
        const history = storage.getExerciseHistory(key)
        if (history.length > 0) {
          const latest = history[history.length - 1].exercise
          const totalVolume = history.reduce((sum, h) => {
            const sets = h.exercise.sets.filter(s => s.completed).length
            return sum + (h.exercise.weight * h.exercise.targetReps * sets)
          }, 0)

          this.exerciseStats[key] = {
            current: latest.weight,
            sessions: history.length,
            volume: Math.round(totalVolume)
          }
        }
      })
    },
    getInstructions(exercise) {
      const locale = this.$i18n.locale
      return exercise.instructions[locale] || exercise.instructions.en
    },
    getTips(exercise) {
      const locale = this.$i18n.locale
      return exercise.tips[locale] || exercise.tips.en
    },
    toggleExercise(key) {
      this.expandedExercise = this.expandedExercise === key ? null : key
    }
  }
}
</script>
