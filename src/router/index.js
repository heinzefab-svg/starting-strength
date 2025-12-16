import { createRouter, createWebHistory } from 'vue-router'
import WorkoutView from '../views/WorkoutView.vue'
import ProgressView from '../views/ProgressView.vue'
import ExercisesView from '../views/ExercisesView.vue'
import StatsView from '../views/StatsView.vue'
import MeasurementsView from '../views/MeasurementsView.vue'
import SettingsView from '../views/SettingsView.vue'

const routes = [
  {
    path: '/',
    name: 'workout',
    component: WorkoutView
  },
  {
    path: '/progress',
    name: 'progress',
    component: ProgressView
  },
  {
    path: '/exercises',
    name: 'exercises',
    component: ExercisesView
  },
  {
    path: '/stats',
    name: 'stats',
    component: StatsView
  },
  {
    path: '/measurements',
    name: 'measurements',
    component: MeasurementsView
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
