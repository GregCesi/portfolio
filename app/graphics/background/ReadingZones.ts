/**
 * Zones de lecture : le fond reste un noir continu, ce sont les étoiles qui
 * s'effacent à l'approche du texte.
 *
 * Aucun voile, aucun rectangle : le canvas ne connaît que la position des blocs
 * de texte visibles (mesurée dans le DOM) et, pour un point donné, renvoie un
 * facteur de luminosité. Loin du texte : 1 (étoile pleine). Contre le texte :
 * `MIN_LIGHT`. Entre les deux, une descente douce sur `FADE` pixels, sans arête.
 * Une étoile qui passe derrière une lettre est alors trop sombre pour en
 * altérer le contraste (WCAG AA), y compris pendant le warp.
 */

interface Box {
  left: number
  top: number
  right: number
  bottom: number
}

/** Éléments qui portent du texte lisible ou interactif. */
const TEXT_SELECTOR = 'h1, h2, h3, p, li, a, button, .subnav__indicator'

/** Distance (px) au bloc de texte en deçà de laquelle l'étoile est au plus sombre. */
const NEAR = 18
/** Longueur (px) de la descente douce entre étoile éteinte et étoile pleine. */
const FADE = 130
/** Luminosité minimale d'une étoile posée derrière le texte (0 à 1). */
const MIN_LIGHT = 0.07
/** Intervalle de mesure du DOM (ms) hors transition. */
const REFRESH_MS = 40

export default class ReadingZones {
  private boxes: Box[] = []
  private lastRefresh = -Infinity
  private busyUntil = 0

  /** Pendant une transition, le texte bouge : mesure à chaque image. */
  boost(durationMs: number) {
    this.busyUntil = performance.now() + durationMs
  }

  /** À appeler une fois par image, avant les appels à `light`. */
  tick(now: number) {
    if (now < this.busyUntil || now - this.lastRefresh >= REFRESH_MS) {
      this.measure()
      this.lastRefresh = now
    }
  }

  private measure() {
    const reach = NEAR + FADE
    const vw = window.innerWidth
    const vh = window.innerHeight
    const boxes: Box[] = []
    const nodes = document.body.querySelectorAll<HTMLElement>(TEXT_SELECTOR)
    for (let i = 0; i < nodes.length; i++) {
      const r = nodes[i]!.getBoundingClientRect()
      if (r.width <= 0 || r.height <= 0) continue
      if (r.right < -reach || r.left > vw + reach || r.bottom < -reach || r.top > vh + reach)
        continue
      boxes.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom })
    }
    this.boxes = boxes
  }

  /** Luminosité (MIN_LIGHT à 1) d'une étoile au point (x, y) de l'écran. */
  light(x: number, y: number): number {
    let best = Infinity
    for (let i = 0; i < this.boxes.length; i++) {
      const b = this.boxes[i]!
      const dx = x < b.left ? b.left - x : x > b.right ? x - b.right : 0
      const dy = y < b.top ? b.top - y : y > b.bottom ? y - b.bottom : 0
      const d2 = dx * dx + dy * dy
      if (d2 < best) {
        best = d2
        if (best === 0) break
      }
    }
    if (best === Infinity) return 1
    const t = (Math.sqrt(best) - NEAR) / FADE
    if (t <= 0) return MIN_LIGHT
    if (t >= 1) return 1
    const s = t * t * (3 - 2 * t)
    return MIN_LIGHT + (1 - MIN_LIGHT) * s
  }
}
