import type StarsField from './StarsField'

export default class WarpEffect {
  private starsField: StarsField
  private normalizeTimeout: ReturnType<typeof setTimeout> | null = null
  private isWarping = false

  constructor(starsField: StarsField) {
    this.starsField = starsField
  }

  start(duration: number = 0.8, speed: number = 10) {
    // Logique identique à l'original
    if (this.normalizeTimeout) clearTimeout(this.normalizeTimeout)

    this.starsField.setWarpSpeed(speed)
    this.starsField.setWarpFactor(1)
    this.isWarping = true
    
    this.normalizeTimeout = setTimeout(() => {
      this.starsField.setWarpSpeed(1)
      this.isWarping = false
    }, duration * 1000)
  }

  update(_deltaTime: number, _ctx: CanvasRenderingContext2D, _width: number, _height: number, _centerX: number, _centerY: number) {
    // WarpEffect ne fait que déclencher, la logique d'animation est dans StarsField
    // comme dans l'original
  }

  destroy() {
    if (this.normalizeTimeout) {
      clearTimeout(this.normalizeTimeout)
      this.normalizeTimeout = null
    }
  }
}