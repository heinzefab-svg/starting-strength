export class ExerciseAnimation {
  constructor(canvas, exerciseKey) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.exerciseKey = exerciseKey
    this.frame = 0
    this.animationId = null
    this.isPlaying = false

    this.resize()
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect()
    this.canvas.width = rect.width * window.devicePixelRatio
    this.canvas.height = rect.height * window.devicePixelRatio
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    this.width = rect.width
    this.height = rect.height
  }

  start() {
    this.isPlaying = true
    this.animate()
  }

  stop() {
    this.isPlaying = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }

  animate() {
    if (!this.isPlaying) return

    this.ctx.clearRect(0, 0, this.width, this.height)
    this.draw()
    this.frame += 0.015

    this.animationId = requestAnimationFrame(() => this.animate())
  }

  draw() {
    const centerX = this.width / 2
    const centerY = this.height / 2

    switch (this.exerciseKey) {
      case 'SQUAT':
        this.drawSquat(centerX, centerY)
        break
      case 'BENCH_PRESS':
        this.drawBenchPress(centerX, centerY)
        break
      case 'DEADLIFT':
        this.drawDeadlift(centerX, centerY)
        break
      case 'OVERHEAD_PRESS':
        this.drawOverheadPress(centerX, centerY)
        break
      case 'BARBELL_ROW':
        this.drawBarbellRow(centerX, centerY)
        break
      case 'PULLUPS':
        this.drawPullups(centerX, centerY)
        break
      case 'DIPS':
        this.drawDips(centerX, centerY)
        break
    }
  }

  drawDetailedFigure(x, y, config) {
    const ctx = this.ctx
    const scale = Math.min(this.width, this.height) / 400

    // Shadow
    ctx.save()
    ctx.globalAlpha = 0.2
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.ellipse(x, y + 120 * scale, 40 * scale, 8 * scale, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // Head
    ctx.save()
    const headGradient = ctx.createRadialGradient(
      x + config.headX * scale - 3 * scale,
      y + config.headY * scale - 3 * scale,
      2,
      x + config.headX * scale,
      y + config.headY * scale,
      18 * scale
    )
    headGradient.addColorStop(0, '#ffb894')
    headGradient.addColorStop(1, '#ff9b6e')
    ctx.fillStyle = headGradient
    ctx.beginPath()
    ctx.arc(x + config.headX * scale, y + config.headY * scale, 16 * scale, 0, Math.PI * 2)
    ctx.fill()

    // Face detail
    ctx.fillStyle = 'rgba(0,0,0,0.1)'
    ctx.beginPath()
    ctx.arc(x + config.headX * scale - 5 * scale, y + config.headY * scale - 2 * scale, 2 * scale, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x + config.headX * scale + 5 * scale, y + config.headY * scale - 2 * scale, 2 * scale, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // Neck
    ctx.fillStyle = '#ff9b6e'
    ctx.beginPath()
    ctx.moveTo(x + config.headX * scale - 6 * scale, y + (config.headY + 12) * scale)
    ctx.lineTo(x + config.shoulderLX * scale, y + config.shoulderY * scale)
    ctx.lineTo(x + config.shoulderRX * scale, y + config.shoulderY * scale)
    ctx.lineTo(x + config.headX * scale + 6 * scale, y + (config.headY + 12) * scale)
    ctx.closePath()
    ctx.fill()

    // Torso with muscle definition
    const torsoGradient = ctx.createLinearGradient(
      x + config.shoulderLX * scale,
      y + config.shoulderY * scale,
      x + config.torsoX * scale,
      y + config.torsoY * scale
    )
    torsoGradient.addColorStop(0, '#ff6b35')
    torsoGradient.addColorStop(0.5, '#ff8659')
    torsoGradient.addColorStop(1, '#ff6b35')

    ctx.fillStyle = torsoGradient
    ctx.beginPath()
    ctx.moveTo(x + config.shoulderLX * scale, y + config.shoulderY * scale)
    ctx.lineTo(x + config.shoulderRX * scale, y + config.shoulderY * scale)
    ctx.lineTo(x + (config.torsoX + 15) * scale, y + config.torsoY * scale)
    ctx.lineTo(x + (config.torsoX - 15) * scale, y + config.torsoY * scale)
    ctx.closePath()
    ctx.fill()

    // Chest/pec definition
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'
    ctx.lineWidth = 2 * scale
    ctx.beginPath()
    ctx.arc(x + (config.shoulderLX + 8) * scale, y + (config.shoulderY + 8) * scale, 8 * scale, 0.5, 2.5)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x + (config.shoulderRX - 8) * scale, y + (config.shoulderY + 8) * scale, 8 * scale, 0.7, 2.7)
    ctx.stroke()

    // Arms - Upper arm (bicep/tricep)
    const armGradient = ctx.createLinearGradient(
      x + config.shoulderLX * scale,
      y + config.shoulderY * scale,
      x + config.elbowLX * scale,
      y + config.elbowLY * scale
    )
    armGradient.addColorStop(0, '#ffb894')
    armGradient.addColorStop(0.5, '#ff9b6e')
    armGradient.addColorStop(1, '#ffb894')

    // Left upper arm
    ctx.strokeStyle = armGradient
    ctx.lineWidth = 16 * scale
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(x + config.shoulderLX * scale, y + config.shoulderY * scale)
    ctx.lineTo(x + config.elbowLX * scale, y + config.elbowLY * scale)
    ctx.stroke()

    // Right upper arm
    ctx.beginPath()
    ctx.moveTo(x + config.shoulderRX * scale, y + config.shoulderY * scale)
    ctx.lineTo(x + config.elbowRX * scale, y + config.elbowRY * scale)
    ctx.stroke()

    // Left forearm
    ctx.lineWidth = 12 * scale
    ctx.beginPath()
    ctx.moveTo(x + config.elbowLX * scale, y + config.elbowLY * scale)
    ctx.lineTo(x + config.handLX * scale, y + config.handLY * scale)
    ctx.stroke()

    // Right forearm
    ctx.beginPath()
    ctx.moveTo(x + config.elbowRX * scale, y + config.elbowRY * scale)
    ctx.lineTo(x + config.handRX * scale, y + config.handRY * scale)
    ctx.stroke()

    // Hands
    ctx.fillStyle = '#ffb894'
    ctx.beginPath()
    ctx.arc(x + config.handLX * scale, y + config.handLY * scale, 6 * scale, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x + config.handRX * scale, y + config.handRY * scale, 6 * scale, 0, Math.PI * 2)
    ctx.fill()

    // Legs - Upper leg (quads/hamstrings)
    const legGradient = ctx.createLinearGradient(
      x + config.torsoX * scale,
      y + config.torsoY * scale,
      x + config.kneeLX * scale,
      y + config.kneeLY * scale
    )
    legGradient.addColorStop(0, '#3a3a3a')
    legGradient.addColorStop(0.5, '#2a2a2a')
    legGradient.addColorStop(1, '#3a3a3a')

    // Left upper leg
    ctx.strokeStyle = legGradient
    ctx.lineWidth = 20 * scale
    ctx.beginPath()
    ctx.moveTo(x + (config.torsoX - 8) * scale, y + config.torsoY * scale)
    ctx.lineTo(x + config.kneeLX * scale, y + config.kneeLY * scale)
    ctx.stroke()

    // Right upper leg
    ctx.beginPath()
    ctx.moveTo(x + (config.torsoX + 8) * scale, y + config.torsoY * scale)
    ctx.lineTo(x + config.kneeRX * scale, y + config.kneeRY * scale)
    ctx.stroke()

    // Left lower leg
    ctx.lineWidth = 14 * scale
    ctx.beginPath()
    ctx.moveTo(x + config.kneeLX * scale, y + config.kneeLY * scale)
    ctx.lineTo(x + config.footLX * scale, y + config.footLY * scale)
    ctx.stroke()

    // Right lower leg
    ctx.beginPath()
    ctx.moveTo(x + config.kneeRX * scale, y + config.kneeRY * scale)
    ctx.lineTo(x + config.footRX * scale, y + config.footRY * scale)
    ctx.stroke()

    // Shoes
    ctx.fillStyle = '#1a1a1a'
    ctx.beginPath()
    ctx.ellipse(x + config.footLX * scale, y + config.footLY * scale, 10 * scale, 6 * scale, -0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(x + config.footRX * scale, y + config.footRY * scale, 10 * scale, 6 * scale, 0.3, 0, Math.PI * 2)
    ctx.fill()

    // Barbell if present
    if (config.barbell) {
      this.drawBarbell(x + config.barbellX * scale, y + config.barbellY * scale, scale, config.barbellAngle || 0)
    }
  }

  drawBarbell(x, y, scale, angle = 0) {
    const ctx = this.ctx

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)

    // Bar
    const barGradient = ctx.createLinearGradient(0, -4 * scale, 0, 4 * scale)
    barGradient.addColorStop(0, '#c0c0c0')
    barGradient.addColorStop(0.5, '#ffffff')
    barGradient.addColorStop(1, '#a0a0a0')

    ctx.fillStyle = barGradient
    ctx.fillRect(-70 * scale, -4 * scale, 140 * scale, 8 * scale)

    // Knurling texture
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'
    ctx.lineWidth = 1
    for (let i = -60; i < -20; i += 3) {
      ctx.beginPath()
      ctx.moveTo(i * scale, -3 * scale)
      ctx.lineTo(i * scale, 3 * scale)
      ctx.stroke()
    }
    for (let i = 20; i < 60; i += 3) {
      ctx.beginPath()
      ctx.moveTo(i * scale, -3 * scale)
      ctx.lineTo(i * scale, 3 * scale)
      ctx.stroke()
    }

    // Collars
    ctx.fillStyle = '#4a4a4a'
    ctx.fillRect(-65 * scale, -5 * scale, 6 * scale, 10 * scale)
    ctx.fillRect(59 * scale, -5 * scale, 6 * scale, 10 * scale)

    // Plates (left side)
    this.drawPlate(-75 * scale, 0, scale, 20 * scale, '#ff6b35')
    this.drawPlate(-85 * scale, 0, scale, 16 * scale, '#ffd23f')
    this.drawPlate(-93 * scale, 0, scale, 12 * scale, '#00d9a1')

    // Plates (right side)
    this.drawPlate(75 * scale, 0, scale, 20 * scale, '#ff6b35')
    this.drawPlate(85 * scale, 0, scale, 16 * scale, '#ffd23f')
    this.drawPlate(93 * scale, 0, scale, 12 * scale, '#00d9a1')

    ctx.restore()
  }

  drawPlate(x, y, scale, radius, color) {
    const ctx = this.ctx

    // Plate gradient
    const plateGradient = ctx.createRadialGradient(x - 2 * scale, y - 2 * scale, 2, x, y, radius)
    plateGradient.addColorStop(0, this.lightenColor(color, 20))
    plateGradient.addColorStop(0.7, color)
    plateGradient.addColorStop(1, this.darkenColor(color, 20))

    ctx.fillStyle = plateGradient
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()

    // Inner hole
    ctx.fillStyle = '#1a1a1a'
    ctx.beginPath()
    ctx.arc(x, y, radius * 0.3, 0, Math.PI * 2)
    ctx.fill()

    // Shine effect
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.4, 0.5, 2)
    ctx.stroke()
  }

  lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = Math.min(255, (num >> 16) + amt)
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt)
    const B = Math.min(255, (num & 0x0000FF) + amt)
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
  }

  darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = Math.max(0, (num >> 16) - amt)
    const G = Math.max(0, ((num >> 8) & 0x00FF) - amt)
    const B = Math.max(0, (num & 0x0000FF) - amt)
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
  }

  drawSquat(centerX, centerY) {
    const t = Math.sin(this.frame) * 0.5 + 0.5
    const squat = t * 50

    this.drawDetailedFigure(centerX, centerY, {
      headX: 0,
      headY: -90 + squat,
      shoulderLX: -20,
      shoulderRX: 20,
      shoulderY: -60 + squat,
      torsoX: 0,
      torsoY: -10 + squat,
      elbowLX: -35,
      elbowLY: -50 + squat,
      elbowRX: 35,
      elbowRY: -50 + squat,
      handLX: -45,
      handLY: -65 + squat,
      handRX: 45,
      handRY: -65 + squat,
      kneeLX: -15,
      kneeLY: 30 + squat,
      kneeRX: 15,
      kneeRY: 30 + squat,
      footLX: -20,
      footLY: 90,
      footRX: 20,
      footRY: 90,
      barbell: true,
      barbellX: 0,
      barbellY: -65 + squat,
      barbellAngle: 0
    })
  }

  drawBenchPress(centerX, centerY) {
    const t = Math.sin(this.frame) * 0.5 + 0.5
    const press = t * 40

    // Draw bench
    const scale = Math.min(this.width, this.height) / 400
    const ctx = this.ctx

    const benchGradient = ctx.createLinearGradient(
      centerX - 80 * scale,
      centerY + 15 * scale,
      centerX - 80 * scale,
      centerY + 35 * scale
    )
    benchGradient.addColorStop(0, '#4a4a4a')
    benchGradient.addColorStop(1, '#2a2a2a')

    ctx.fillStyle = benchGradient
    ctx.fillRect(centerX - 80 * scale, centerY + 15 * scale, 160 * scale, 20 * scale)

    // Bench legs
    ctx.fillStyle = '#3a3a3a'
    ctx.fillRect(centerX - 75 * scale, centerY + 35 * scale, 10 * scale, 30 * scale)
    ctx.fillRect(centerX + 65 * scale, centerY + 35 * scale, 10 * scale, 30 * scale)

    this.drawDetailedFigure(centerX, centerY, {
      headX: -60,
      headY: -5,
      shoulderLX: -25,
      shoulderRX: 25,
      shoulderY: 10,
      torsoX: 0,
      torsoY: 35,
      elbowLX: -40,
      elbowLY: -15 - press,
      elbowRX: 40,
      elbowRY: -15 - press,
      handLX: -45,
      handLY: -40 - press,
      handRX: 45,
      handRY: -40 - press,
      kneeLX: 30,
      kneeLY: 45,
      kneeRX: 45,
      kneeRY: 45,
      footLX: 35,
      footLY: 70,
      footRX: 50,
      footRY: 70,
      barbell: true,
      barbellX: 0,
      barbellY: -40 - press,
      barbellAngle: 0
    })
  }

  drawDeadlift(centerX, centerY) {
    const t = Math.sin(this.frame) * 0.5 + 0.5
    const lift = t * 70
    const bend = (1 - t) * 0.4

    this.drawDetailedFigure(centerX, centerY, {
      headX: 0,
      headY: -30 - lift,
      shoulderLX: -20,
      shoulderRX: 20,
      shoulderY: -10 - lift * 0.9,
      torsoX: 0,
      torsoY: 35 - lift * 0.6,
      elbowLX: -30,
      elbowLY: 15 - lift * 0.8,
      elbowRX: 30,
      elbowRY: 15 - lift * 0.8,
      handLX: -35,
      handLY: 60 - lift,
      handRX: 35,
      handRY: 60 - lift,
      kneeLX: -15,
      kneeLY: 50 - lift * 0.4,
      kneeRX: 15,
      kneeRY: 50 - lift * 0.4,
      footLX: -20,
      footLY: 90,
      footRX: 20,
      footRY: 90,
      barbell: true,
      barbellX: 0,
      barbellY: 60 - lift,
      barbellAngle: bend
    })
  }

  drawOverheadPress(centerX, centerY) {
    const t = Math.sin(this.frame) * 0.5 + 0.5
    const press = t * 60

    this.drawDetailedFigure(centerX, centerY, {
      headX: t > 0.5 ? -10 : 0,
      headY: -90,
      shoulderLX: -20,
      shoulderRX: 20,
      shoulderY: -60,
      torsoX: 0,
      torsoY: -10,
      elbowLX: -35,
      elbowLY: -50 - press * 0.6,
      elbowRX: 35,
      elbowRY: -50 - press * 0.6,
      handLX: -40,
      handLY: -40 - press,
      handRX: 40,
      handRY: -40 - press,
      kneeLX: -15,
      kneeLY: 30,
      kneeRX: 15,
      kneeRY: 30,
      footLX: -20,
      footLY: 90,
      footRX: 20,
      footRY: 90,
      barbell: true,
      barbellX: 0,
      barbellY: -40 - press,
      barbellAngle: 0
    })
  }

  drawBarbellRow(centerX, centerY) {
    const t = Math.sin(this.frame) * 0.5 + 0.5
    const row = t * 35

    this.drawDetailedFigure(centerX, centerY, {
      headX: 0,
      headY: -50,
      shoulderLX: -20,
      shoulderRX: 20,
      shoulderY: -30,
      torsoX: 0,
      torsoY: 10,
      elbowLX: -30,
      elbowLY: 20 - row,
      elbowRX: 30,
      elbowRY: 20 - row,
      handLX: -35,
      handLY: 50 - row,
      handRX: 35,
      handRY: 50 - row,
      kneeLX: -15,
      kneeLY: 45,
      kneeRX: 15,
      kneeRY: 45,
      footLX: -20,
      footLY: 90,
      footRX: 20,
      footRY: 90,
      barbell: true,
      barbellX: 0,
      barbellY: 50 - row,
      barbellAngle: 0
    })
  }

  drawPullups(centerX, centerY) {
    const t = Math.sin(this.frame) * 0.5 + 0.5
    const pull = t * 50

    const scale = Math.min(this.width, this.height) / 400

    // Draw pull-up bar
    const ctx = this.ctx
    const barGradient = ctx.createLinearGradient(0, centerY - 110 * scale, 0, centerY - 105 * scale)
    barGradient.addColorStop(0, '#888')
    barGradient.addColorStop(0.5, '#ccc')
    barGradient.addColorStop(1, '#666')

    ctx.strokeStyle = barGradient
    ctx.lineWidth = 8 * scale
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(centerX - 100 * scale, centerY - 110 * scale)
    ctx.lineTo(centerX + 100 * scale, centerY - 110 * scale)
    ctx.stroke()

    this.drawDetailedFigure(centerX, centerY, {
      headX: 0,
      headY: -70 - pull,
      shoulderLX: -20,
      shoulderRX: 20,
      shoulderY: -50 - pull,
      torsoX: 0,
      torsoY: 0 - pull,
      elbowLX: -30,
      elbowLY: -80 - pull * 0.5,
      elbowRX: 30,
      elbowRY: -80 - pull * 0.5,
      handLX: -35,
      handLY: -110,
      handRX: 35,
      handRY: -110,
      kneeLX: -12,
      kneeLY: 35 - pull,
      kneeRX: 12,
      kneeRY: 35 - pull,
      footLX: -15,
      footLY: 65 - pull,
      footRX: 15,
      footRY: 65 - pull,
      barbell: false
    })
  }

  drawDips(centerX, centerY) {
    const t = Math.sin(this.frame) * 0.5 + 0.5
    const dip = t * 40

    const scale = Math.min(this.width, this.height) / 400

    // Draw dip bars
    const ctx = this.ctx
    const barGradient = ctx.createLinearGradient(centerX - 50 * scale, 0, centerX - 45 * scale, 0)
    barGradient.addColorStop(0, '#666')
    barGradient.addColorStop(0.5, '#999')
    barGradient.addColorStop(1, '#555')

    ctx.strokeStyle = barGradient
    ctx.lineWidth = 6 * scale
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(centerX - 50 * scale, centerY - 70 * scale)
    ctx.lineTo(centerX - 50 * scale, centerY + 50 * scale)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(centerX + 50 * scale, centerY - 70 * scale)
    ctx.lineTo(centerX + 50 * scale, centerY + 50 * scale)
    ctx.stroke()

    this.drawDetailedFigure(centerX, centerY, {
      headX: 0,
      headY: -70 + dip,
      shoulderLX: -20,
      shoulderRX: 20,
      shoulderY: -50 + dip,
      torsoX: 0,
      torsoY: -5 + dip,
      elbowLX: -45,
      elbowLY: -40 + dip * 0.5,
      elbowRX: 45,
      elbowRY: -40 + dip * 0.5,
      handLX: -50,
      handLY: -50,
      handRX: 50,
      handRY: -50,
      kneeLX: -10,
      kneeLY: 30 + dip,
      kneeRX: 10,
      kneeRY: 30 + dip,
      footLX: -15,
      footLY: 60 + dip,
      footRX: 15,
      footRY: 60 + dip,
      barbell: false
    })
  }
}
