import type { Ref } from 'vue'
import gsap from 'gsap'

/**
 * Changement de section « en profondeur » : le contenu sortant part vers le
 * visiteur (il grossit et disparaît), le contenu entrant vient du fond (il
 * apparaît petit puis grossit jusqu'à sa taille normale). Rien ne glisse : les
 * deux sections se superposent à l'écran le temps de la transition, comme les
 * étoiles filent vers le visiteur.
 *
 * Les échos sont des copies de la section, en retard sur le mouvement
 * principal : plus petites que lui, elles se glissent derrière. Ils sont
 * masqués aux lecteurs d'écran (`aria-hidden`, `inert`, sans `id`) et retirés
 * du DOM en fin de transition.
 *
 * Tout est fini avant 1,0 s (`IN_START` + les retards d'écho + `IN_DURATION`,
 * soit 0,88 s) : c'est l'instant où le fond étoilé reprend sa vitesse normale
 * (voir BackgroundHyperspace), et le texte entrant doit alors être net, à sa
 * taille normale, sans écho.
 *
 * Attributs posés le temps de la transition, lus par ReadingZones :
 * - `data-depth`    : section en mouvement (sa zone de lecture est celle du repos) ;
 * - `data-departed` : section sortante devenue invisible (plus de zone) ;
 * - `data-echo`     : copie d'écho (jamais une zone).
 */
const OUT_SCALE = 2.2
const OUT_DURATION = 0.6
const OUT_FADE = 0.45
const IN_SCALE = 0.4
const IN_START = 0.15
const IN_DURATION = 0.55
const IN_FADE = 0.3
const ECHO_LAG = 0.06
/** Opacité de chaque écho : le premier est le plus proche du texte, les suivants s'estompent. */
const ECHO_ALPHAS = [0.32, 0.22, 0.12]

export function useDepthTransition(wrapper: Ref<HTMLElement | null>) {
  let echoes: HTMLElement[] = []

  function makeEcho(slide: HTMLElement): HTMLElement {
    const echo = slide.cloneNode(true) as HTMLElement
    echo.removeAttribute('id')
    echo.removeAttribute('data-depth')
    echo.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'))
    echo.setAttribute('data-echo', '')
    echo.setAttribute('aria-hidden', 'true')
    echo.setAttribute('inert', '')
    Object.assign(echo.style, {
      position: 'absolute',
      top: `${slide.offsetTop}px`,
      left: '0',
      width: '100%',
      height: `${slide.offsetHeight}px`,
      pointerEvents: 'none',
      userSelect: 'none',
    })
    slide.before(echo)
    echoes.push(echo)
    return echo
  }

  function clear() {
    echoes.forEach((echo) => echo.remove())
    echoes = []
  }

  /**
   * Ajoute le départ de `from` et l'arrivée de `to` à `tl`. `enter` déclenche
   * l'arrivée côté page (accélération des étoiles, texte de la section) : il
   * est appelé avant la copie des échos, qui doivent reprendre le texte entrant
   * tel qu'il sera affiché. `offset` ramène `to` à la place de `from`.
   * Sans `from` (première arrivée, à l'ouverture du sas d'entrée), seule
   * l'arrivée de `to` se joue.
   */
  function start(
    tl: gsap.core.Timeline,
    from: HTMLElement | null,
    to: HTMLElement,
    offset: number,
    height: number,
    enter: () => void,
  ) {
    const transformOrigin = `50% ${height / 2}px`

    from?.setAttribute('data-depth', '')
    to.setAttribute('data-depth', '')
    if (from) gsap.set(from, { transformOrigin })
    gsap.set(to, { y: offset, scale: IN_SCALE, opacity: 0, visibility: 'inherit', transformOrigin })

    enter()

    if (from) {
      tl.to(from, { scale: OUT_SCALE, duration: OUT_DURATION, ease: 'power2.in' }, 0).to(
        from,
        {
          autoAlpha: 0,
          duration: OUT_FADE,
          ease: 'power1.in',
          onComplete: () => from.setAttribute('data-departed', ''),
        },
        0,
      )
    }
    tl.to(to, { scale: 1, duration: IN_DURATION, ease: 'power2.out' }, IN_START).to(
      to,
      { opacity: 1, duration: IN_FADE, ease: 'power1.out' },
      IN_START,
    )

    ECHO_ALPHAS.forEach((alpha, k) => {
      const lag = (k + 1) * ECHO_LAG

      if (from) {
        const leaving = makeEcho(from)
        gsap.set(leaving, { y: 0, scale: 1, opacity: 0, visibility: 'inherit', transformOrigin })
        tl.to(leaving, { scale: OUT_SCALE, duration: OUT_DURATION, ease: 'power2.in' }, lag).fromTo(
          leaving,
          { opacity: alpha },
          { opacity: 0, duration: OUT_FADE, ease: 'power1.in', immediateRender: false },
          lag,
        )
      }

      // Un écho entrant apparaît vite, puis se résorbe en rejoignant le texte.
      const arriving = makeEcho(to)
      gsap.set(arriving, { y: offset, scale: IN_SCALE, opacity: 0, visibility: 'inherit', transformOrigin })
      const at = IN_START + lag
      tl.to(arriving, { scale: 1, duration: IN_DURATION, ease: 'power2.out' }, at)
        .to(arriving, { opacity: alpha, duration: IN_DURATION * 0.4, ease: 'none' }, at)
        .to(arriving, { opacity: 0, duration: IN_DURATION * 0.6, ease: 'power1.in' }, at + IN_DURATION * 0.4)
    })
  }

  /** Remet chaque section à sa place de repos : le wrapper se cale sur la cible, sans que rien ne bouge à l'écran. */
  function end(from: HTMLElement | null, to: HTMLElement, index: number, height: number) {
    clear()
    if (from) gsap.set(from, { clearProps: 'transform,transformOrigin' })
    gsap.set(to, { clearProps: 'transform,transformOrigin' })
    gsap.set(to, { autoAlpha: 1 })
    from?.removeAttribute('data-depth')
    from?.removeAttribute('data-departed')
    to.removeAttribute('data-depth')
    if (wrapper.value) gsap.set(wrapper.value, { y: -index * height })
  }

  return { start, end, clear }
}
