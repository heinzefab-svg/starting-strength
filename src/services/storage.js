const STORAGE_KEYS = {
  WORKOUTS: 'ss_workouts',
  MEASUREMENTS: 'ss_measurements',
  SETTINGS: 'ss_settings'
}

class StorageService {
  getWorkouts() {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS)
    return data ? JSON.parse(data) : []
  }

  saveWorkout(workout) {
    const workouts = this.getWorkouts()
    workouts.push({
      ...workout,
      id: Date.now(),
      date: new Date().toISOString()
    })
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts))
    return workouts
  }

  updateWorkout(id, updates) {
    const workouts = this.getWorkouts()
    const index = workouts.findIndex(w => w.id === id)
    if (index !== -1) {
      workouts[index] = { ...workouts[index], ...updates }
      localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts))
    }
    return workouts
  }

  deleteWorkout(id) {
    const workouts = this.getWorkouts().filter(w => w.id !== id)
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts))
    return workouts
  }

  getMeasurements() {
    const data = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS)
    return data ? JSON.parse(data) : []
  }

  saveMeasurement(measurement) {
    const measurements = this.getMeasurements()
    measurements.push({
      ...measurement,
      id: Date.now(),
      date: new Date().toISOString()
    })
    localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(measurements))
    return measurements
  }

  getSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    const defaultSettings = {
      weightUnit: 'kg',
      language: 'de',
      workoutA: ['SQUAT', 'BENCH_PRESS', 'DEADLIFT'],
      workoutB: ['SQUAT', 'OVERHEAD_PRESS', 'BARBELL_ROW'],
      bodyweightProgression: 'weight',
      restTimerEnabled: true,
      restTimerDuration: 180 // seconds (3 minutes)
    }

    // Merge with defaults to handle new settings in updates
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings
  }

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    return settings
  }

  getLatestForExercise(exerciseKey) {
    const workouts = this.getWorkouts()
    const exerciseWorkouts = workouts
      .filter(w => w.exercises && w.exercises.some(e => e.key === exerciseKey))
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    if (exerciseWorkouts.length === 0) return null

    const latestWorkout = exerciseWorkouts[0]
    return latestWorkout.exercises.find(e => e.key === exerciseKey)
  }

  getExerciseHistory(exerciseKey) {
    const workouts = this.getWorkouts()
    return workouts
      .filter(w => w.exercises && w.exercises.some(e => e.key === exerciseKey))
      .map(w => ({
        date: w.date,
        exercise: w.exercises.find(e => e.key === exerciseKey)
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }
}

export default new StorageService()
