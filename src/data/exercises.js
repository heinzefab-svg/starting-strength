export const EXERCISES = {
  SQUAT: {
    key: 'SQUAT',
    name: 'Squat',
    nameKey: 'exerciseNames.squat',
    descriptionKey: 'exerciseDescriptions.squat',
    sets: 3,
    reps: 5,
    increment: 2.5,
    instructions: {
      de: [
        'Stange auf dem Rücken, Hände außerhalb der Schultern',
        'Füße schulterbreit, Zehen leicht nach außen',
        'Tief einatmen, mit Hüfte zurück absenken',
        'Parallel durchbrechen (Hüftfalte unter Knie)',
        'Nach oben drücken, Knie raus, Brust hoch',
        'Oben ausatmen, wiederholen'
      ],
      en: [
        'Bar on back, hands outside shoulders',
        'Feet shoulder-width, toes slightly out',
        'Big breath, descend with hips back',
        'Break parallel (hip crease below knee)',
        'Drive up, knees out, chest up',
        'Exhale at top, repeat'
      ]
    },
    tips: {
      de: [
        'Stange über Mittelfuß halten',
        'Knie über Zehen führen',
        'Neutrale Wirbelsäule beibehalten',
        'Auf Boden 1-2m vor dir schauen'
      ],
      en: [
        'Keep bar over mid-foot throughout',
        'Knees track over toes',
        'Maintain neutral spine',
        'Look at floor 4-6 feet ahead'
      ]
    }
  },
  BENCH_PRESS: {
    key: 'BENCH_PRESS',
    name: 'Bench Press',
    nameKey: 'exerciseNames.benchPress',
    descriptionKey: 'exerciseDescriptions.benchPress',
    sets: 3,
    reps: 5,
    increment: 2.5,
    instructions: {
      de: [
        'Auf Bank legen, Augen unter der Stange',
        'Griff etwas breiter als Schultern',
        'Schulterblätter zurückziehen, Rücken wölben',
        'Ausheben, Stange über Schultern',
        'Zur mittleren Brust senken, Ellbogen 45°',
        'Bis zur Streckung drücken'
      ],
      en: [
        'Lie on bench, eyes under bar',
        'Grip slightly wider than shoulders',
        'Retract shoulder blades, arch back',
        'Unrack, bar over shoulders',
        'Lower to mid-chest with elbows at 45°',
        'Press up to lockout'
      ]
    },
    tips: {
      de: [
        'Füße flach auf dem Boden',
        'Stange fest greifen',
        'Brust bei jeder Wdh. berühren',
        'Stangenpfad leicht diagonal'
      ],
      en: [
        'Feet flat on floor',
        'Squeeze the bar hard',
        'Touch chest every rep',
        'Bar path slightly diagonal'
      ]
    }
  },
  DEADLIFT: {
    key: 'DEADLIFT',
    name: 'Deadlift',
    nameKey: 'exerciseNames.deadlift',
    descriptionKey: 'exerciseDescriptions.deadlift',
    sets: 1,
    reps: 5,
    increment: 5,
    instructions: {
      de: [
        'Stange über Mittelfuß, Schienbeine 2-3cm von Stange',
        'Vorbeugen, Griff außerhalb der Beine',
        'Knie beugen bis Schienbeine Stange berühren',
        'Brust hoch, Stange vom Boden lösen',
        'Stange an Beinen hochziehen bis zur Streckung',
        'Kontrolliert zum Boden ablassen'
      ],
      en: [
        'Bar over mid-foot, shins 1 inch from bar',
        'Bend over, grip outside legs',
        'Bend knees until shins touch bar',
        'Chest up, squeeze bar off floor',
        'Drag bar up legs to lockout',
        'Lower under control to floor'
      ]
    },
    tips: {
      de: [
        'Stange an Beinen halten',
        'Vollständige Streckung - Hüfte und Knie',
        'Neutrale Wirbelsäule durchgehend',
        'Nicht zwischen Wdh. abfedern'
      ],
      en: [
        'Keep bar against legs',
        'Full lockout - hips and knees',
        'Neutral spine throughout',
        'No bouncing between reps'
      ]
    }
  },
  OVERHEAD_PRESS: {
    key: 'OVERHEAD_PRESS',
    name: 'Overhead Press',
    nameKey: 'exerciseNames.overheadPress',
    descriptionKey: 'exerciseDescriptions.overheadPress',
    sets: 3,
    reps: 5,
    increment: 2.5,
    instructions: {
      de: [
        'Stange auf vorderen Schultern, Hände knapp außerhalb Schultern',
        'Ellbogen leicht vor der Stange',
        'Tief einatmen, gerade nach oben drücken',
        'Kopf zurück bewegen wenn Stange vorbei kommt',
        'Über Kopf ausstrecken, oben Schultern hochziehen',
        'Zurück zur Startposition senken'
      ],
      en: [
        'Bar on front delts, hands just outside shoulders',
        'Elbows slightly in front of bar',
        'Big breath, press straight up',
        'Move head back as bar passes face',
        'Lock out overhead, shrug at top',
        'Lower to starting position'
      ]
    },
    tips: {
      de: [
        'Gesäß anspannen für Stabilität',
        'Vertikaler Stangenpfad',
        'Vollständige Streckung über Kopf',
        'Unterarme vertikal von vorne und Seite'
      ],
      en: [
        'Squeeze glutes for stability',
        'Vertical bar path',
        'Full lockout overhead',
        'Forearms vertical from front and side'
      ]
    }
  },
  BARBELL_ROW: {
    key: 'BARBELL_ROW',
    name: 'Barbell Row',
    nameKey: 'exerciseNames.barbellRow',
    descriptionKey: 'exerciseDescriptions.barbellRow',
    sets: 3,
    reps: 5,
    increment: 2.5,
    instructions: {
      de: [
        'Wie Kreuzheben-Startposition, Stange vom Boden heben',
        'Oberkörper etwa 45° vorgeneigt',
        'Stange über Mittelfuß hängen lassen',
        'Zur unteren Brust/oberen Bauch ziehen',
        'Ellbogen nach hinten, Schulterblätter zusammen',
        'Kontrolliert zur Startposition senken'
      ],
      en: [
        'Like deadlift start, lift bar off floor',
        'Torso roughly 45° forward lean',
        'Let bar hang over mid-foot',
        'Pull to lower chest/upper abdomen',
        'Elbows back, squeeze shoulder blades',
        'Lower under control to start'
      ]
    },
    tips: {
      de: [
        'Neutrale Wirbelsäule durchgehend',
        'Keine Körperschwung verwenden',
        'Zur Hüfte ziehen, nicht zur Brust',
        'Schulterblätter bei jedem Zug zusammenziehen'
      ],
      en: [
        'Maintain neutral spine throughout',
        'No body english',
        'Pull to hip, not chest',
        'Squeeze shoulder blades each rep'
      ]
    }
  },
  PULLUPS: {
    key: 'PULLUPS',
    name: 'Pull-ups',
    nameKey: 'exerciseNames.pullups',
    descriptionKey: 'exerciseDescriptions.pullups',
    sets: 3,
    reps: 5,
    increment: 2.5,
    isBodyweight: true,
    instructions: {
      de: [
        'An Stange hängen, Hände schulterbreit oder weiter',
        'Obergriff (Handflächen weg)',
        'Schulterblätter nach unten und zusammen ziehen',
        'Hochziehen bis Kinn über Stange',
        'Kontrolliert zur vollständigen Streckung senken',
        'Wiederholen ohne Schwung'
      ],
      en: [
        'Hang from bar, hands shoulder-width or wider',
        'Overhand grip (palms away)',
        'Pull shoulder blades down and together',
        'Pull up until chin over bar',
        'Lower under control to full extension',
        'Repeat without momentum'
      ]
    },
    tips: {
      de: [
        'Vollständige Streckung bei jedem Zug',
        'Kein Schwungholen',
        'Brust zur Stange führen',
        'Schultern aktiv halten'
      ],
      en: [
        'Full extension every rep',
        'No kipping or swinging',
        'Lead with chest to bar',
        'Keep shoulders active'
      ]
    }
  },
  DIPS: {
    key: 'DIPS',
    name: 'Dips',
    nameKey: 'exerciseNames.dips',
    descriptionKey: 'exerciseDescriptions.dips',
    sets: 3,
    reps: 5,
    increment: 2.5,
    isBodyweight: true,
    instructions: {
      de: [
        'An Barren aufstützen, Arme gestreckt',
        'Leicht nach vorne lehnen',
        'Absenken bis Ellbogen 90°',
        'Nach oben drücken bis Arme gestreckt',
        'Ellbogen nah am Körper halten',
        'Ohne Schwung wiederholen'
      ],
      en: [
        'Support yourself on bars, arms extended',
        'Lean slightly forward',
        'Lower until elbows at 90°',
        'Push up until arms locked',
        'Keep elbows close to body',
        'Repeat without momentum'
      ]
    },
    tips: {
      de: [
        'Vollständige Streckung oben',
        'Kontrollierte Absenkung',
        'Schultern unten und zurück',
        'Körper leicht nach vorne geneigt'
      ],
      en: [
        'Full lockout at top',
        'Controlled descent',
        'Shoulders down and back',
        'Body leaning slightly forward'
      ]
    }
  }
}

export const DEFAULT_WORKOUT_A = ['SQUAT', 'BENCH_PRESS', 'DEADLIFT']
export const DEFAULT_WORKOUT_B = ['SQUAT', 'OVERHEAD_PRESS', 'BARBELL_ROW']

export function getNextWorkout(lastWorkoutType) {
  if (!lastWorkoutType || lastWorkoutType === 'B') return 'A'
  return 'B'
}

export function calculateProgression(exercise, completed, failed = false) {
  const exerciseData = EXERCISES[exercise]
  if (!exerciseData) return null

  if (failed) {
    return {
      advice: 'Keep the same weight and try again',
      nextWeight: completed.weight,
      reason: 'Failed to complete all sets'
    }
  }

  const allSetsCompleted = completed.sets.every(set =>
    set.reps >= exerciseData.reps
  )

  if (!allSetsCompleted) {
    return {
      advice: 'Keep the same weight and try again',
      nextWeight: completed.weight,
      reason: 'Not all reps completed'
    }
  }

  return {
    advice: `Add ${exerciseData.increment}${completed.unit || 'kg'}`,
    nextWeight: completed.weight + exerciseData.increment,
    reason: 'All sets completed successfully'
  }
}

export function getDefaultWeight(exerciseKey) {
  const exercise = EXERCISES[exerciseKey]
  if (exercise?.isBodyweight) return 0

  const defaults = {
    'SQUAT': 20,
    'BENCH_PRESS': 20,
    'DEADLIFT': 40,
    'OVERHEAD_PRESS': 20,
    'BARBELL_ROW': 20
  }
  return defaults[exerciseKey] || 20
}

export function getExerciseName(exerciseKey, locale = 'en') {
  const exercise = EXERCISES[exerciseKey]
  return exercise ? exercise.name : exerciseKey
}
