import StarsField from './StarsField'

export default class WarpEffect {
  private starsField: StarsField
  private elapsed = 0
  private duration = 800 // 0.8s comme avant

  constructor(starsField: StarsField) {
    this.starsField = starsField
  }

  start() {
    this.elapsed = 0
    this.starsField.setWarpSpeed(10)
  }

  update(deltaTime: number) {
    this.elapsed += deltaTime

    // oscillation du warpFactor
    const t = this.elapsed / this.duration
    const factor = 0.5 + 0.5 * Math.sin(t * 0.5)
    this.starsField.setWarpFactor(factor)

    // fin
    if (this.elapsed >= this.duration) {
      this.starsField.setWarpSpeed(1)
      this.starsField.setWarpFactor(1)
    }
  }
}
