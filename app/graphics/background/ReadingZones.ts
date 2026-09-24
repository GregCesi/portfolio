import gsap from 'gsap'

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

/**
 * Transition de section en profondeur (voir useDepthTransition) : un écho est
 * une copie, jamais du texte ; une section sortante devenue invisible n'en a
 * plus non plus.
 */
const NOT_TEXT_SELECTOR = '[data-echo], [data-departed]'
/** Section en mouvement (mise à l'échelle autour du centre de l'écran). */
const MOVING_SELECTOR = '[data-depth]'

/** Distance (px) au bloc de texte en deçà de laquelle l'étoile est au plus sombre. */
const NEAR = 18
/** Longueur (px) de la descente douce entre étoile éteinte et étoile pleine. */
const FADE = 12
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
      const node = nodes[i]!
      if (node.closest(NOT_TEXT_SELECTOR)) continue
      const r = node.getBoundingClientRect()
      if (r.width <= 0 || r.height <= 0) continue
      let { left, top, right, bottom } = r
      // Le texte d'une section en mouvement grossit ou rétrécit : sa zone reste
      // celle qu'il a au repos, elle ne grossit pas avec lui.
      const moving = node.closest<HTMLElement>(MOVING_SELECTOR)
      if (moving) {
        const scale = Number(gsap.getProperty(moving, 'scaleX')) || 1
        const cx = vw / 2
        const cy = vh / 2
        left = cx + (left - cx) / scale
        right = cx + (right - cx) / scale
        top = cy + (top - cy) / scale
        bottom = cy + (bottom - cy) / scale
      }
      if (right < -reach || left > vw + reach || bottom < -reach || top > vh + reach) continue
      boxes.push({ left, top, right, bottom })
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
