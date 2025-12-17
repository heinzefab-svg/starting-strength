<template>
  <div class="container">
    <!-- Last Workout Summary -->
    <div v-if="!currentWorkout && lastWorkout" class="workout-summary">
      <div class="summary-header">
        <div>
          <div class="summary-title">{{ $t('workout.lastWorkout') }}</div>
          <div class="summary-date">{{ formatDate(lastWorkout.date) }}</div>
        </div>
      </div>
      <div class="summary-stats">
        <div>
          <div class="summary-stat-value">{{ lastWorkout.type }}</div>
          <div class="summary-stat-label">{{ $t('workout.title') }}</div>
        </div>
        <div>
          <div class="summary-stat-value">{{ lastWorkout.exercises.length }}</div>
          <div class="summary-stat-label">{{ $t('workout.exercises') }}</div>
        </div>
        <div>
          <div class="summary-stat-value">{{ calculateVolume(lastWorkout) }}{{ settings.weightUnit }}</div>
          <div class="summary-stat-label">{{ $t('workout.volume') }}</div>
        </div>
        <div v-if="lastWorkout.duration">
          <div class="summary-stat-value">{{ lastWorkout.duration }}m</div>
          <div class="summary-stat-label">{{ $t('workout.duration') }}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        {{ currentWorkout ? $t('workout.currentWorkout') : $t('workout.startNew') }}
      </div>

      <div v-if="!currentWorkout">
        <p style="margin-bottom: 1.5rem;" class="text-secondary">
          {{ $t('workout.nextWorkout') }}: <strong style="color: var(--primary);">{{ nextWorkoutType }}</strong>
        </p>
        <button @click="startWorkout" class="btn btn-primary">
          {{ $t('workout.startWorkout') }} {{ nextWorkoutType }}
        </button>
      </div>

      <div v-else>
        <div class="workout-progress" style="margin-bottom: 0.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div>
              <h3 style="margin: 0; font-size: 1.25rem;">{{ $t('workout.title') }} {{ currentWorkout.type }}</h3>
              <p class="text-tertiary" style="font-size: 0.75rem; margin: 0;">
                {{ formatDate(currentWorkout.startTime) }}
              </p>
            </div>
            <div style="text-align: right;">
              <div class="text-tertiary" style="font-size: 0.75rem;">{{ $t('workout.workoutTime') }}</div>
              <div style="font-size: 1rem; font-weight: 600; color: var(--text-secondary);">{{ formattedWorkoutTime }}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="progress-bar" style="flex: 1; margin: 0;">
              <div class="progress-fill" :style="{ width: overallProgress + '%' }"></div>
            </div>
            <div style="font-size: 0.875rem; font-weight: 600; color: var(--text-secondary); min-width: 40px; text-align: right;">{{ Math.round(overallProgress) }}%</div>
          </div>
        </div>

        <!-- Pause Screen -->
        <div v-if="isPaused" class="card card-elevated" style="text-align: center; padding: 1.5rem;">
          <h2 style="margin: 0 0 1rem 0; color: var(--success); font-size: 1.5rem;">{{ $t('workout.restPeriod') }}</h2>

          <div style="margin-bottom: 1rem;">
            <div style="font-size: 3rem; font-weight: 700;" :style="{ color: settings.restTimerEnabled && restTimerRemaining <= 0 ? 'var(--success)' : 'var(--accent)' }">
              {{ settings.restTimerEnabled ? formattedRestTimerCountdown : formattedRestTime }}
            </div>
            <div v-if="settings.restTimerEnabled && restTimerRemaining <= 0" style="font-size: 1.125rem; color: var(--success); margin-top: 0.5rem;">
              ✓ {{ $t('workout.restComplete') }}
            </div>
          </div>

          <div class="text-secondary" style="margin-bottom: 1.5rem; font-size: 0.875rem;">
            {{ $t('workout.nextUp') }}: <strong style="color: var(--text);">{{ getNextSetInfo() }}</strong>
          </div>

          <button @click="endPause" class="btn btn-primary" style="width: 100%;">
            {{ isLastSet ? $t('workout.finishWorkout') : $t('workout.startNextSet') }}
          </button>
        </div>

        <!-- Active Set Screen -->
        <div v-else>
          <!-- Current Set -->
          <div class="exercise-card" style="padding: 1.25rem;">
            <div style="text-align: center; margin-bottom: 1rem;">
              <h3 style="margin: 0; font-size: 1.5rem; color: var(--text);">{{ $t(exerciseData[currentExercise.key].nameKey) }}</h3>
              <div style="font-size: 0.875rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                {{ $t('workout.set') }} {{ currentSetIndex + 1 }}/{{ currentExercise.sets.length }} • {{ $t('workout.exerciseProgress') }} {{ currentExerciseIndex + 1 }}/{{ currentWorkout.exercises.length }}
              </div>
            </div>

            <!-- Weight/Reps Display -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: 10px; text-align: center;">
                <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">
                  {{ exerciseData[currentExercise.key].isBodyweight ? $t('workout.addedWeight') : $t('workout.weight') }}
                </div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--primary);">{{ currentExercise.weight }}{{ settings.weightUnit }}</div>
                <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.25rem;">→ {{ currentExercise.suggestedWeight }}{{ settings.weightUnit }}</div>
              </div>
              <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: 10px; text-align: center;">
                <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">{{ $t('workout.reps') }}</div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--primary);">{{ currentSet.reps }}</div>
                <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.25rem;">→ {{ currentExercise.targetReps }}</div>
              </div>
            </div>

            <!-- Warmup & Plate Calculator Buttons -->
            <div v-if="!exerciseData[currentExercise.key].isBodyweight && currentExercise.weight > 20" style="margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <button v-if="currentExercise.weight > 40" @click="showWarmupCalculator = true" class="btn btn-secondary" style="font-size: 0.875rem;">
                {{ $t('workout.warmupCalculator') }}
              </button>
              <button @click="showPlateCalculator = true" class="btn btn-secondary" style="font-size: 0.875rem;">
                {{ $t('workout.plateCalculator') }}
              </button>
            </div>

            <!-- Edit Mode Toggle & Sliders -->
            <div v-if="isEditMode" style="margin-bottom: 1rem;">
              <div style="margin-bottom: 0.75rem;">
                <label style="font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 0.25rem; display: block;">
                  {{ exerciseData[currentExercise.key].isBodyweight ? $t('workout.addedWeight') : $t('workout.weight') }}
                </label>
                <input
                  type="range"
                  :min="0"
                  :max="exerciseData[currentExercise.key].isBodyweight ? 50 : 300"
                  :step="exerciseData[currentExercise.key].increment"
                  v-model.number="currentExercise.weight"
                  @input="saveWorkoutState"
                  style="margin: 0 0 0.25rem 0;"
                />
                <div style="text-align: center; font-size: 1.25rem; color: var(--primary); font-weight: 700;">
                  {{ currentExercise.weight }}{{ settings.weightUnit }}
                </div>
              </div>
              <div>
                <label style="font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 0.25rem; display: block;">{{ $t('workout.reps') }}</label>
                <input
                  type="range"
                  :min="0"
                  :max="20"
                  :step="1"
                  v-model.number="currentSet.reps"
                  @input="saveWorkoutState"
                  style="margin: 0 0 0.25rem 0;"
                />
                <div style="text-align: center; font-size: 1.25rem; color: var(--primary); font-weight: 700;">
                  {{ currentSet.reps }}
                </div>
              </div>
            </div>

            <div style="text-align: center; margin-bottom: 1rem;">
              <label style="display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; background: var(--bg-tertiary); padding: 0.5rem 1rem; border-radius: 8px;">
                <span style="font-size: 0.875rem; color: var(--text-secondary);">{{ $t('workout.editMode') }}</span>
                <label class="toggle-switch" style="margin: 0; width: 44px; height: 24px;">
                  <input type="checkbox" v-model="isEditMode">
                  <span class="toggle-slider" style="border-radius: 24px;"></span>
                </label>
              </label>
            </div>

            <div v-if="currentExerciseIndex === 0 && currentSetIndex === 0">
              <label>{{ $t('workout.notes') }}</label>
              <textarea
                v-model="currentExercise.notes"
                :placeholder="$t('workout.notesPlaceholder')"
                rows="2"
                style="margin-bottom: 0;"
                @input="saveWorkoutState"
              ></textarea>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div style="display: flex; gap: 0.75rem; margin-top: 0;">
            <button @click="goToPause" class="btn btn-primary" style="flex: 1; padding: 0.875rem 1rem;">
              {{ isLastSet ? $t('workout.finishWorkout') : $t('workout.done') }}
            </button>
            <button @click="cancelWorkout" class="btn btn-danger" style="padding: 0.875rem 1rem;">
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Workout Configuration Modal -->
    <div v-if="showWorkoutConfig" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 1001; padding: 1rem; padding-bottom: 80px;" @click.self="showWorkoutConfig = false">
      <div class="card" style="max-width: 700px; width: 100%; max-height: 85vh; overflow-y: auto; position: relative;">
        <button @click="showWorkoutConfig = false" style="position: absolute; top: 1rem; right: 1rem; background: var(--bg-tertiary); border: none; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; z-index: 1;">
          ×
        </button>
        <div class="card-header">{{ $t('settings.workoutConfiguration') }}</div>
        <p class="text-secondary mb-3">
          {{ $t('workout.configureWorkouts') }}
        </p>

        <div class="card card-elevated" style="margin-bottom: 1rem;">
          <h4 style="margin-bottom: 1rem; color: var(--primary);">{{ $t('settings.workoutA') }}</h4>
          <div style="display: grid; gap: 0.5rem;">
            <label v-for="(exercise, key) in exerciseData" :key="key"
                   style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: var(--bg-tertiary); border-radius: 8px; cursor: pointer; text-transform: none;">
              <input type="checkbox"
                     :value="key"
                     v-model="configWorkoutA"
                     style="width: auto; margin: 0;">
              <span style="color: var(--text);">{{ $t(exercise.nameKey) }}</span>
            </label>
          </div>
        </div>

        <div class="card card-elevated">
          <h4 style="margin-bottom: 1rem; color: var(--accent);">{{ $t('settings.workoutB') }}</h4>
          <div style="display: grid; gap: 0.5rem;">
            <label v-for="(exercise, key) in exerciseData" :key="key"
                   style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: var(--bg-tertiary); border-radius: 8px; cursor: pointer; text-transform: none;">
              <input type="checkbox"
                     :value="key"
                     v-model="configWorkoutB"
                     style="width: auto; margin: 0;">
              <span style="color: var(--text);">{{ $t(exercise.nameKey) }}</span>
            </label>
          </div>
        </div>

        <div style="margin-top: 1.5rem;">
          <button @click="saveWorkoutConfig" class="btn btn-success" style="width: 100%;">
            {{ $t('common.continue') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Initial Assessment Modal -->
    <div v-if="showAssessment" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 1001; padding: 1rem; padding-bottom: 80px; overflow: hidden;">
      <div class="card" style="max-width: 700px; width: 100%; max-height: 85vh; overflow-y: auto;">
        <div style="display: flex; justify-content: flex-end; margin-bottom: 0.5rem;">
          <button @click="skipAssessment" style="background: var(--bg-tertiary); border: none; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
            ×
          </button>
        </div>
        <div class="card-header" style="margin-top: 0;">{{ $t('workout.initialAssessment') }}</div>
        <p class="text-secondary mb-3">
          {{ $t('workout.assessmentDescription') }}
        </p>

        <div v-for="(exercise, key) in assessmentExercises" :key="key" class="card card-elevated mb-3">
          <h3 class="mb-2">{{ $t(exercise.nameKey) }}</h3>

          <div v-if="!exercise.isBodyweight">
            <label style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.25rem; display: block;">
              {{ $t('workout.currentWeight') }} ({{ settings.weightUnit }})
            </label>
            <input
              type="range"
              :min="exercise.key === 'DEADLIFT' ? 20 : 10"
              :max="200"
              :step="exercise.increment"
              v-model.number="assessmentData[key]"
              style="margin: 0 0 0.5rem 0;"
            />
            <div style="text-align: center; font-size: 1.5rem; color: var(--primary); font-weight: 700; margin-bottom: 0.5rem;">
              {{ assessmentData[key] || 0 }}{{ settings.weightUnit }}
            </div>
            <p class="text-tertiary" style="font-size: 0.875rem;">
              {{ $t('workout.assessmentWeightHelp') }}
            </p>
          </div>

          <div v-else>
            <label style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.25rem; display: block;">
              {{ $t('workout.maxReps') }}
            </label>
            <input
              type="range"
              :min="0"
              :max="20"
              :step="1"
              v-model.number="assessmentData[key]"
              style="margin: 0 0 0.5rem 0;"
            />
            <div style="text-align: center; font-size: 1.5rem; color: var(--primary); font-weight: 700; margin-bottom: 0.5rem;">
              {{ assessmentData[key] || 0 }}
            </div>
            <p class="text-tertiary" style="font-size: 0.875rem; margin-bottom: 0.5rem;">
              {{ $t('workout.assessmentRepsHelp') }}
            </p>
            <p v-if="assessmentData[key] >= 0" style="font-size: 0.875rem; color: var(--success);">
              {{ $t('workout.startingReps') }}: {{ Math.max(1, Math.floor(assessmentData[key] * 0.8)) }}
            </p>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem;">
          <button @click="completeAssessment" class="btn btn-success" style="width: 100%;">
            {{ $t('workout.startFirstWorkout') }}
          </button>
          <button @click="skipAssessment" class="btn btn-secondary" style="width: 100%;">
            {{ $t('workout.skipAssessment') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Alert Modal -->
    <div v-if="showAlert" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1002; padding: 1rem; padding-bottom: 80px; overflow: hidden;" @click.self="closeAlert">
      <div class="card" style="max-width: 400px; width: 100%; text-align: center;">
        <div style="display: flex; justify-content: flex-end; margin-bottom: 0.5rem;">
          <button @click="closeAlert" style="background: var(--bg-tertiary); border: none; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
            ×
          </button>
        </div>
        <p style="margin-bottom: 1.5rem; font-size: 1.125rem;">{{ alertMessage }}</p>
        <button @click="closeAlert" class="btn btn-primary" style="width: 100%;">
          OK
        </button>
      </div>
    </div>

    <!-- Cancel Confirmation Modal -->
    <div v-if="showCancelConfirm" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1002; padding: 1rem; padding-bottom: 80px; overflow: hidden;" @click.self="closeCancelConfirm">
      <div class="card" style="max-width: 400px; width: 100%; text-align: center;">
        <div style="display: flex; justify-content: flex-end; margin-bottom: 0.5rem;">
          <button @click="closeCancelConfirm" style="background: var(--bg-tertiary); border: none; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
            ×
          </button>
        </div>
        <p style="margin-bottom: 1.5rem; font-size: 1.125rem;">{{ $t('workout.confirmCancel') }}</p>
        <div style="display: flex; gap: 1rem;">
          <button @click="confirmCancel" class="btn btn-danger" style="flex: 1;">
            {{ $t('common.confirm') }}
          </button>
          <button @click="closeCancelConfirm" class="btn btn-secondary" style="flex: 1;">
            {{ $t('common.cancel') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Workout Summary Modal -->
    <div v-if="showWorkoutSummary && workoutSummary" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 1002; padding: 1rem; padding-bottom: 80px; overflow: hidden;" @click.self="showWorkoutSummary = false">
      <div class="card" style="max-width: 500px; width: 100%; max-height: 85vh; overflow-y: auto; background: linear-gradient(135deg, rgba(0, 217, 161, 0.05) 0%, rgba(255, 215, 0, 0.05) 100%);">
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎉</div>
          <h2 style="margin: 0; font-size: 1.75rem; color: var(--success);">{{ $t('workout.workoutComplete') }}</h2>
          <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary);">{{ $t('workout.title') }} {{ workoutSummary.type }}</p>
        </div>

        <div class="grid grid-2" style="gap: 0.75rem; margin-bottom: 1.5rem;">
          <div class="stat-card" style="background: var(--bg-tertiary);">
            <div class="stat-value" style="font-size: 2rem;">{{ Math.floor(workoutSummary.duration / 60) }}:{{ (workoutSummary.duration % 60).toString().padStart(2, '0') }}</div>
            <div class="stat-label">{{ $t('workout.duration') }}</div>
          </div>
          <div class="stat-card" style="background: var(--bg-tertiary);">
            <div class="stat-value" style="font-size: 2rem;">{{ workoutSummary.totalVolume.toFixed(0) }}</div>
            <div class="stat-label">{{ $t('workout.volume') }} ({{ settings.weightUnit }})</div>
          </div>
          <div class="stat-card" style="background: var(--bg-tertiary);">
            <div class="stat-value" style="font-size: 2rem;">{{ workoutSummary.totalSets }}</div>
            <div class="stat-label">{{ $t('workout.totalSets') }}</div>
          </div>
          <div class="stat-card" style="background: var(--bg-tertiary);">
            <div class="stat-value" style="font-size: 2rem;">{{ workoutSummary.totalReps }}</div>
            <div class="stat-label">{{ $t('workout.totalReps') }}</div>
          </div>
        </div>

        <button @click="showWorkoutSummary = false" class="btn btn-primary" style="width: 100%;">
          {{ $t('common.continue') }}
        </button>
      </div>
    </div>

    <!-- Warmup Calculator Modal -->
    <div v-if="showWarmupCalculator && currentExercise" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1002; padding: 1rem; padding-bottom: 80px; overflow: hidden;" @click.self="showWarmupCalculator = false">
      <div class="card" style="max-width: 500px; width: 100%; max-height: 85vh; overflow-y: auto;">
        <div style="display: flex; justify-content: flex-end; margin-bottom: 0.5rem;">
          <button @click="showWarmupCalculator = false" style="background: var(--bg-tertiary); border: none; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
            ×
          </button>
        </div>
        <div class="card-header" style="margin-top: 0;">{{ $t('workout.warmupCalculator') }}</div>
        <p style="margin-bottom: 1.5rem; font-size: 0.875rem; color: var(--text-secondary);">
          {{ $t('workout.warmupDescription') }}
        </p>

        <div style="display: grid; gap: 0.75rem;">
          <div v-for="warmup in warmupSets" :key="warmup.label"
               style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: var(--bg-tertiary); border-radius: 8px; border-left: 3px solid var(--accent);">
            <div style="flex: 1;">
              <div style="font-weight: 600; color: var(--text); margin-bottom: 0.25rem;">
                {{ warmup.label }}
              </div>
              <div style="font-size: 0.875rem; color: var(--text-secondary);">
                {{ warmup.reps }} {{ $t('workout.reps') }}
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent);">
                {{ warmup.weight }}{{ settings.weightUnit }}
              </div>
            </div>
          </div>
        </div>

        <button @click="showWarmupCalculator = false" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;">
          {{ $t('common.back') }}
        </button>
      </div>
    </div>

    <!-- Plate Calculator Modal -->
    <div v-if="showPlateCalculator && currentExercise" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1002; padding: 1rem; padding-bottom: 80px; overflow: hidden;" @click.self="showPlateCalculator = false">
      <div class="card" style="max-width: 500px; width: 100%; max-height: 85vh; overflow-y: auto;">
        <div style="display: flex; justify-content: flex-end; margin-bottom: 0.5rem;">
          <button @click="showPlateCalculator = false" style="background: var(--bg-tertiary); border: none; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
            ×
          </button>
        </div>
        <div class="card-header" style="margin-top: 0;">{{ $t('workout.plateCalculator') }}</div>
        <p style="margin-bottom: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
          {{ $t('workout.plateDescription') }}
        </p>
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary);">
            {{ currentExercise.weight }}{{ settings.weightUnit }}
          </div>
          <div style="font-size: 0.875rem; color: var(--text-tertiary);">
            {{ $t('workout.targetWeight') }}
          </div>
        </div>

        <div style="padding: 1rem; background: var(--bg-tertiary); border-radius: 8px; margin-bottom: 1rem;">
          <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
            {{ $t('workout.loadPerSide') }}
          </div>
          <div v-if="platesToLoad.length > 0" style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
            <div v-for="(plate, index) in platesToLoad" :key="index"
                 style="display: flex; align-items: center; justify-content: center; padding: 0.5rem 1rem; background: var(--bg); border-radius: 6px; border: 2px solid var(--primary);">
              <span style="font-size: 1.25rem; font-weight: 700; color: var(--primary);">{{ plate }}{{ settings.weightUnit }}</span>
            </div>
          </div>
          <div v-else style="text-align: center; color: var(--text-tertiary); font-style: italic;">
            {{ $t('workout.barOnly') }}
          </div>
        </div>

        <div style="font-size: 0.875rem; color: var(--text-tertiary); text-align: center; margin-bottom: 1rem;">
          {{ $t('workout.totalWithBar') }}: {{ totalBarWeight }}{{ settings.weightUnit }}
        </div>

        <button @click="showPlateCalculator = false" class="btn btn-primary" style="width: 100%;">
          {{ $t('common.back') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import storage from '../services/storage'
import { EXERCISES, getNextWorkout, getDefaultWeight } from '../data/exercises'

export default {
  name: 'WorkoutView',
  data() {
    return {
      currentWorkout: null,
      nextWorkoutType: 'A',
      lastWorkout: null,
      settings: { weightUnit: 'kg' },
      exerciseData: EXERCISES,
      showAssessment: false,
      showWorkoutConfig: false,
      assessmentData: {},
      assessmentExercises: {},
      configWorkoutA: [],
      configWorkoutB: [],
      workoutStartTime: null,
      workoutTime: 0,
      restTime: 0,
      pauseStartTime: null,
      timerInterval: null,
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      isPaused: false,
      isEditMode: false,
      showAlert: false,
      alertMessage: '',
      showCancelConfirm: false,
      showSavedAlert: false,
      restTimerNotified: false,
      showWarmupCalculator: false,
      showPlateCalculator: false,
      showWorkoutSummary: false,
      workoutSummary: null
    }
  },
  computed: {
    platesToLoad() {
      if (!this.currentExercise || !this.currentExercise.weight) return []

      const targetWeight = this.currentExercise.weight
      const barWeight = 20
      const weightPerSide = (targetWeight - barWeight) / 2

      if (weightPerSide <= 0) return []

      // Available plates (in kg, ordered from largest to smallest)
      const availablePlates = [20, 15, 10, 5, 2.5, 1.25, 0.5]
      const plates = []
      let remaining = weightPerSide

      for (const plate of availablePlates) {
        while (remaining >= plate) {
          plates.push(plate)
          remaining = Math.round((remaining - plate) * 100) / 100
        }
      }

      return plates
    },
    totalBarWeight() {
      if (!this.currentExercise) return 20

      const barWeight = 20
      const platesWeight = this.platesToLoad.reduce((sum, plate) => sum + plate, 0) * 2

      return barWeight + platesWeight
    },
    warmupSets() {
      if (!this.currentExercise || !this.currentExercise.weight) return []

      const workingWeight = this.currentExercise.weight
      const barWeight = 20 // Standard barbell weight

      // Don't show warmups if working weight is too light
      if (workingWeight <= 40) return []

      const warmups = []

      // Bar only
      warmups.push({
        label: this.$t('workout.warmupBar'),
        weight: barWeight,
        reps: 5
      })

      // 40% of working weight
      if (workingWeight > 50) {
        warmups.push({
          label: '40%',
          weight: Math.round((workingWeight * 0.4) / 2.5) * 2.5,
          reps: 5
        })
      }

      // 60% of working weight
      if (workingWeight > 60) {
        warmups.push({
          label: '60%',
          weight: Math.round((workingWeight * 0.6) / 2.5) * 2.5,
          reps: 3
        })
      }

      // 80% of working weight
      if (workingWeight > 80) {
        warmups.push({
          label: '80%',
          weight: Math.round((workingWeight * 0.8) / 2.5) * 2.5,
          reps: 2
        })
      }

      // 90% of working weight
      if (workingWeight > 100) {
        warmups.push({
          label: '90%',
          weight: Math.round((workingWeight * 0.9) / 2.5) * 2.5,
          reps: 1
        })
      }

      return warmups
    },
    currentExercise() {
      if (!this.currentWorkout || !this.currentWorkout.exercises) return null
      return this.currentWorkout.exercises[this.currentExerciseIndex]
    },
    currentSet() {
      if (!this.currentExercise || !this.currentExercise.sets) return null
      return this.currentExercise.sets[this.currentSetIndex]
    },
    isLastSet() {
      if (!this.currentWorkout) return false
      const isLastExercise = this.currentExerciseIndex === this.currentWorkout.exercises.length - 1
      const isLastSetOfExercise = this.currentSetIndex === this.currentExercise.sets.length - 1
      return isLastExercise && isLastSetOfExercise
    },
    overallProgress() {
      if (!this.currentWorkout) return 0
      let totalSets = 0
      let completedSets = 0

      this.currentWorkout.exercises.forEach((exercise, exIndex) => {
        exercise.sets.forEach((set, setIndex) => {
          totalSets++
          if (exIndex < this.currentExerciseIndex ||
              (exIndex === this.currentExerciseIndex && setIndex < this.currentSetIndex) ||
              (exIndex === this.currentExerciseIndex && setIndex === this.currentSetIndex && this.isPaused)) {
            completedSets++
          }
        })
      })

      return totalSets > 0 ? (completedSets / totalSets * 100) : 0
    },
    formattedWorkoutTime() {
      const minutes = Math.floor(this.workoutTime / 60)
      const seconds = this.workoutTime % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    },
    formattedRestTime() {
      const minutes = Math.floor(this.restTime / 60)
      const seconds = this.restTime % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    },
    formattedRestTimerCountdown() {
      const remaining = Math.max(0, this.restTimerRemaining)
      const minutes = Math.floor(remaining / 60)
      const seconds = remaining % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    },
    restTimerRemaining() {
      if (!this.settings.restTimerEnabled || !this.isPaused) return this.settings.restTimerDuration
      return this.settings.restTimerDuration - this.restTime
    }
  },
  mounted() {
    this.loadData()

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Check if first visit
    if (!localStorage.getItem('workoutConfigured')) {
      this.showWorkoutConfig = true
      return
    }

    this.loadWorkoutState()
  },
  beforeUnmount() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
    }
  },
  methods: {
    loadData() {
      this.settings = storage.getSettings()
      const workouts = storage.getWorkouts()
      const lastWorkout = workouts[workouts.length - 1]

      if (lastWorkout) {
        this.lastWorkout = lastWorkout
        const duration = lastWorkout.startTime && lastWorkout.endTime
          ? Math.round((new Date(lastWorkout.endTime) - new Date(lastWorkout.startTime)) / 1000 / 60)
          : null
        this.lastWorkout.duration = duration
      }

      this.nextWorkoutType = getNextWorkout(lastWorkout?.type)
    },
    loadWorkoutState() {
      const savedState = localStorage.getItem('currentWorkoutState')
      if (!savedState) return

      try {
        const state = JSON.parse(savedState)
        this.currentWorkout = state.currentWorkout
        this.currentExerciseIndex = state.currentExerciseIndex
        this.currentSetIndex = state.currentSetIndex
        this.isPaused = state.isPaused
        this.workoutStartTime = state.workoutStartTime
        this.pauseStartTime = state.pauseStartTime

        // Calculate elapsed time from start
        if (this.workoutStartTime) {
          this.workoutTime = Math.floor((Date.now() - this.workoutStartTime) / 1000)
        }

        // Resume timer
        if (this.timerInterval) {
          clearInterval(this.timerInterval)
        }

        this.timerInterval = setInterval(() => {
          if (this.workoutStartTime) {
            this.workoutTime = Math.floor((Date.now() - this.workoutStartTime) / 1000)
          }
          if (this.isPaused && this.pauseStartTime) {
            this.restTime = Math.floor((Date.now() - this.pauseStartTime) / 1000)
          }
        }, 1000)
      } catch (e) {
        console.error('Failed to load workout state:', e)
        localStorage.removeItem('currentWorkoutState')
      }
    },
    saveWorkoutState() {
      if (!this.currentWorkout) {
        localStorage.removeItem('currentWorkoutState')
        return
      }

      const state = {
        currentWorkout: this.currentWorkout,
        currentExerciseIndex: this.currentExerciseIndex,
        currentSetIndex: this.currentSetIndex,
        isPaused: this.isPaused,
        workoutStartTime: this.workoutStartTime,
        pauseStartTime: this.pauseStartTime
      }

      localStorage.setItem('currentWorkoutState', JSON.stringify(state))
    },
    startWorkout() {
      const workouts = storage.getWorkouts()

      // First time setup: configure workouts
      if (workouts.length === 0 && !localStorage.getItem('workoutConfigured')) {
        // Initialize with default workouts
        this.configWorkoutA = [...this.settings.workoutA]
        this.configWorkoutB = [...this.settings.workoutB]
        this.showWorkoutConfig = true
        return
      }

      // Check for new exercises that need assessment (works for any workout)
      this.prepareAssessment()
      if (Object.keys(this.assessmentExercises).length > 0) {
        this.showAssessment = true
        return
      }

      this.createWorkout()
    },
    saveWorkoutConfig() {
      if (this.configWorkoutA.length === 0 || this.configWorkoutB.length === 0) {
        this.alertMessage = this.$t('workout.selectExercisesWarning')
        this.showAlert = true
        return
      }

      // Save workout configuration
      this.settings.workoutA = this.configWorkoutA
      this.settings.workoutB = this.configWorkoutB
      storage.saveSettings(this.settings)
      localStorage.setItem('workoutConfigured', 'true')

      this.showWorkoutConfig = false

      // Now show assessment for the configured exercises
      this.prepareAssessment()
      if (Object.keys(this.assessmentExercises).length > 0) {
        this.showAssessment = true
      } else {
        this.createWorkout()
      }
    },
    prepareAssessment() {
      // Get exercises for the next workout only
      const nextWorkoutExercises = this.nextWorkoutType === 'A' ? this.settings.workoutA : this.settings.workoutB

      // Filter to only exercises that have never been performed
      const exercisesNeedingAssessment = nextWorkoutExercises.filter(key => {
        const history = storage.getExerciseHistory(key)
        return history.length === 0
      })

      // If no exercises need assessment, skip it
      if (exercisesNeedingAssessment.length === 0) {
        return
      }

      // Initialize assessment data and exercises
      this.assessmentExercises = {}
      this.assessmentData = {}

      exercisesNeedingAssessment.forEach(key => {
        this.assessmentExercises[key] = EXERCISES[key]
        this.assessmentData[key] = this.assessmentExercises[key].isBodyweight ? 0 : getDefaultWeight(key)
      })
    },
    completeAssessment() {
      // Save assessment data to localStorage for use in workout creation
      localStorage.setItem('assessmentData', JSON.stringify(this.assessmentData))
      localStorage.setItem('assessmentCompleted', 'true')
      this.showAssessment = false
      this.createWorkout()
    },
    skipAssessment() {
      localStorage.setItem('assessmentCompleted', 'true')
      this.showAssessment = false
      this.createWorkout()
    },
    createWorkout() {
      const workoutType = this.nextWorkoutType
      const exerciseKeys = workoutType === 'A' ? this.settings.workoutA : this.settings.workoutB
      const assessmentData = JSON.parse(localStorage.getItem('assessmentData') || '{}')

      // Reset and start timers
      this.workoutStartTime = Date.now()
      this.workoutTime = 0
      this.restTime = 0
      this.pauseStartTime = null
      this.currentExerciseIndex = 0
      this.currentSetIndex = 0
      this.isPaused = false
      this.isEditMode = false

      if (this.timerInterval) {
        clearInterval(this.timerInterval)
      }

      this.timerInterval = setInterval(() => {
        if (this.workoutStartTime) {
          this.workoutTime = Math.floor((Date.now() - this.workoutStartTime) / 1000)
        }
        if (this.isPaused && this.pauseStartTime) {
          this.restTime = Math.floor((Date.now() - this.pauseStartTime) / 1000)

          // Rest timer notification
          if (this.settings.restTimerEnabled && !this.restTimerNotified) {
            if (this.restTime >= this.settings.restTimerDuration) {
              this.restTimerNotified = true
              this.playRestTimerAlert()
            }
          }
        }
      }, 1000)

      this.currentWorkout = {
        type: workoutType,
        startTime: new Date().toISOString(),
        exercises: exerciseKeys.map(key => {
          const exerciseData = EXERCISES[key]
          const lastPerformance = storage.getLatestForExercise(key)

          let suggestedWeight = getDefaultWeight(key)
          let suggestedReps = exerciseData.reps

          // Use assessment data for first workout if available
          if (!lastPerformance && assessmentData[key] !== undefined) {
            if (exerciseData.isBodyweight) {
              // For bodyweight: use 80% of assessed max reps, minimum 1 rep
              const assessedReps = Math.floor(assessmentData[key])
              suggestedReps = Math.max(1, Math.floor(assessedReps * 0.8))
              suggestedWeight = 0
            } else {
              // For weighted: use 90% of assessed weight
              suggestedWeight = Math.max(
                getDefaultWeight(key),
                Math.round((assessmentData[key] * 0.9) / exerciseData.increment) * exerciseData.increment
              )
            }
          } else if (lastPerformance) {
            if (exerciseData.isBodyweight) {
              const allSetsCompleted = lastPerformance.sets.every(set =>
                set.completed && set.reps >= lastPerformance.targetReps
              )

              if (allSetsCompleted) {
                // Check progression mode setting
                if (this.settings.bodyweightProgression === 'reps') {
                  // Reps mode: increase reps, keep weight at 0
                  suggestedWeight = 0
                  suggestedReps = lastPerformance.targetReps + 1
                } else {
                  // Weight mode: add weight, keep reps at default (5)
                  suggestedWeight = lastPerformance.weight + exerciseData.increment
                  suggestedReps = exerciseData.reps
                }
              } else {
                // Keep same targets
                suggestedWeight = lastPerformance.weight
                suggestedReps = lastPerformance.targetReps
              }
            } else {
              // Weighted exercise progression
              const allSetsCompleted = lastPerformance.sets.every(set =>
                set.completed && set.reps >= exerciseData.reps
              )

              if (allSetsCompleted) {
                // Success - increase weight
                suggestedWeight = lastPerformance.weight + exerciseData.increment
              } else {
                // Failed - keep same weight
                suggestedWeight = lastPerformance.weight
              }
            }
          }

          return {
            key,
            name: exerciseData.name,
            weight: suggestedWeight,
            suggestedWeight,
            targetReps: suggestedReps,
            sets: Array(exerciseData.sets).fill(null).map(() => ({
              reps: suggestedReps,
              completed: false
            })),
            notes: ''
          }
        })
      }

      this.saveWorkoutState()
    },
    goToPause() {
      // Automatically mark set as completed
      this.currentSet.completed = true

      if (this.isLastSet) {
        this.finishWorkout()
        return
      }

      this.isPaused = true
      this.pauseStartTime = Date.now()
      this.restTime = 0
      this.restTimerNotified = false
      this.saveWorkoutState()
    },
    endPause() {
      if (this.isLastSet) {
        this.finishWorkout()
        return
      }

      this.isPaused = false
      this.pauseStartTime = null
      this.restTime = 0

      // Move to next set
      if (this.currentSetIndex < this.currentExercise.sets.length - 1) {
        this.currentSetIndex++
      } else {
        // Move to next exercise
        this.currentExerciseIndex++
        this.currentSetIndex = 0
      }

      this.saveWorkoutState()
    },
    getNextSetInfo() {
      if (this.isLastSet) {
        return this.$t('workout.finishWorkout')
      }

      let nextExerciseIndex = this.currentExerciseIndex
      let nextSetIndex = this.currentSetIndex + 1

      if (nextSetIndex >= this.currentExercise.sets.length) {
        nextExerciseIndex++
        nextSetIndex = 0
      }

      const nextExercise = this.currentWorkout.exercises[nextExerciseIndex]
      const exerciseName = this.$t(this.exerciseData[nextExercise.key].nameKey)
      return `${exerciseName} - ${this.$t('workout.set')} ${nextSetIndex + 1}`
    },
    finishWorkout() {
      if (!this.currentWorkout) return

      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }

      // Calculate workout summary stats
      const totalVolume = this.currentWorkout.exercises.reduce((sum, exercise) => {
        const completedSets = exercise.sets.filter(s => s.completed)
        return sum + completedSets.reduce((exSum, set) => {
          return exSum + (exercise.weight * (set.reps || exercise.targetReps))
        }, 0)
      }, 0)

      const totalSets = this.currentWorkout.exercises.reduce((sum, exercise) => {
        return sum + exercise.sets.filter(s => s.completed).length
      }, 0)

      const totalReps = this.currentWorkout.exercises.reduce((sum, exercise) => {
        return sum + exercise.sets.filter(s => s.completed).reduce((repSum, set) => {
          return repSum + (set.reps || exercise.targetReps)
        }, 0)
      }, 0)

      this.workoutSummary = {
        type: this.currentWorkout.type,
        exercises: this.currentWorkout.exercises.length,
        totalSets,
        totalReps,
        totalVolume,
        duration: this.workoutTime
      }

      const workout = {
        ...this.currentWorkout,
        endTime: new Date().toISOString(),
        completed: true
      }

      storage.saveWorkout(workout)
      localStorage.removeItem('currentWorkoutState')
      this.currentWorkout = null
      this.isPaused = false
      this.currentExerciseIndex = 0
      this.currentSetIndex = 0
      this.loadData()
      this.showWorkoutSummary = true
    },
    cancelWorkout() {
      this.showCancelConfirm = true
    },
    confirmCancel() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
      localStorage.removeItem('currentWorkoutState')
      this.currentWorkout = null
      this.isPaused = false
      this.currentExerciseIndex = 0
      this.currentSetIndex = 0
      this.showCancelConfirm = false
    },
    closeAlert() {
      this.showAlert = false
    },
    closeSavedAlert() {
      this.showSavedAlert = false
    },
    closeCancelConfirm() {
      this.showCancelConfirm = false
    },
    playRestTimerAlert() {
      // Play a sound and show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Rest Timer Complete!', {
          body: 'Your rest period is over. Ready for the next set?',
          icon: '/icon-192x192.png',
          vibrate: [200, 100, 200]
        })
      }

      // Vibrate if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 200])
      }

      // Play a beep sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    },
    calculateVolume(workout) {
      return workout.exercises.reduce((total, exercise) => {
        const setsCompleted = exercise.sets.filter(s => s.completed).length
        return total + (exercise.weight * exercise.targetReps * setsCompleted)
      }, 0)
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }
}
</script>
