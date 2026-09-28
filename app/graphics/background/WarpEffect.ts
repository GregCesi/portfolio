import gsap from 'gsap'
import type StarsField from './StarsField'

export default class WarpEffect {
  private starsField: StarsField
  private normalizeTimeout: ReturnType<typeof setTimeout> | null = null
  private timeline: gsap.core.Timeline | null = null
  private isWarping = false

  constructor(starsField: StarsField) {
    this.starsField = starsField
  }

  start(duration: number = 0.8, speed: number = 10) {
    // Logique identique à l'original : réservée au mouvement réduit (EXE-49).
    if (this.normalizeTimeout) clearTimeout(this.normalizeTimeout)
    this.timeline?.kill()

    this.starsField.setWarpSpeed(speed)
    this.starsField.setWarpFactor(1)
    this.isWarping = true

    this.normalizeTimeout = setTimeout(() => {
      this.starsField.setWarpSpeed(1)
      this.isWarping = false
    }, duration * 1000)
  }

  /**
   * Voyage en trois phases, synchronisé au changement de section « en
   * profondeur » (voir useDepthTransition) : accélération progressive
   * pendant `depart`, vitesse de croisière tenue pendant `travel`, puis
   * décélération pendant `arrive` jusqu'à un bref recul (au plus 0,2 s) avant
   * de retrouver la vitesse de repos pile à la fin — l'instant où le texte
   * entrant se pose. Aucun saut de vitesse à aucune frontière.
   */
  journey(depart: number, travel: number, arrive: number, cruiseSpeed: number = 4) {
    if (this.normalizeTimeout) clearTimeout(this.normalizeTimeout)
    this.timeline?.kill()

    const rebound = Math.min(0.2, arrive * 0.3)
    const brake = arrive - rebound
    const proxy = { speed: 1 }

    this.starsField.setWarpFactor(1)
    this.isWarping = true

    this.timeline = gsap
      .timeline({
        onUpdate: () => this.starsField.setWarpSpeed(proxy.speed),
        onComplete: () => {
          this.starsField.setWarpSpeed(1)
          this.isWarping = false
        },
      })
      .to(proxy, { speed: cruiseSpeed, duration: depart, ease: 'sine.inOut' }, 0)
      .to(proxy, { speed: -cruiseSpeed * 0.25, duration: brake, ease: 'sine.inOut' }, depart + travel)
      .to(proxy, { speed: 1, duration: rebound, ease: 'sine.inOut' }, depart + travel + brake)
  }

  update(
    _deltaTime: number,
    _ctx: CanvasRenderingContext2D,
    _width: number,
    _height: number,
    _centerX: number,
    _centerY: number,
  ) {
    // WarpEffect ne fait que déclencher, la logique d'animation est dans StarsField
    // comme dans l'original
  }

  destroy() {
    if (this.normalizeTimeout) {
      clearTimeout(this.normalizeTimeout)
      this.normalizeTimeout = null
    }
    this.timeline?.kill()
    this.timeline = null
  }
}
