import type { Ref } from 'vue'
import gsap from 'gsap'
import { arrivalStart, journey } from '~/composables/useJourney'

/**
 * Changement de section « en profondeur », en trois phases qui se suivent
 * sans se chevaucher (EXE-49) : Départ — le contenu sortant part vers le
 * visiteur et s'efface ; Trajet — aucun texte à l'écran ; Arrivée — la
 * section entrante vient du fond, d'un seul bloc, comme un objet qui
 * s'approche (EXE-72). Rien ne glisse : les deux sections se superposent à
 * l'écran le temps de la transition, comme les étoiles filent vers le
 * visiteur (voir BackgroundHyperspace, qui rejoue le même découpage pour
 * l'accélération du fond).
 *
 * L'arrivée anime une distance, de `1 / arrivalStartScale` jusqu'à 1, et la
 * section prend l'échelle `1 / distance` : sa taille croît lentement au loin
 * puis de plus en plus vite en approchant, comme en perspective. Échelle et
 * opacité portent sur la section entière, jamais sur un de ses textes : tout
 * grossit et apparaît ensemble. Durées et courbe sont lues dans les réglages
 * du voyage (useJourney) à chaque changement de section.
 *
 * Les échos du départ sont des copies de la section sortante, en retard sur
 * son mouvement : plus petites que lui, elles se glissent derrière. Ils sont
 * masqués aux lecteurs d'écran (`aria-hidden`, `inert`, sans `id`) et retirés
 * du DOM en fin de transition. Leur retard raccourcit d'autant leur propre
 * durée : ils s'effacent tous exactement quand la section sortante devient
 * invisible, jamais pendant le trajet.
 *
 * Attributs posés le temps de la transition, lus par ReadingZones :
 * - `data-depth`    : section en mouvement (sa zone de lecture est celle du repos) ;
 * - `data-departed` : section sortante devenue invisible (plus de zone) ;
 * - `data-echo`     : copie d'écho (jamais une zone).
 */
const OUT_SCALE = 2.2
/** Part du départ au bout de laquelle le texte sortant est invisible (0,25 s sur 0,4 s, EXE-49) : aucune marge avec le trajet. */
const OUT_FADE_RATIO = 0.625
/** Part de l'arrivée pendant laquelle la section entrante passe de transparente à opaque. */
const IN_FADE_RATIO = 0.4
const ECHO_LAG = 0.02
/** Opacité de chaque écho : le premier est le plus proche du texte, les suivants s'estompent. */
const ECHO_ALPHAS = [0.32, 0.22, 0.12]

/**
 * Abscisse, dans la section, du centre de son titre (premier `h1` ou `h2`) :
 * l'arrivée grossit autour de ce point, pour que le titre vienne du fond en
 * ligne droite, sans dériver de côté, même quand il n'est pas centré dans la
 * fenêtre. Lue avant toute transformation de la section.
 */
function headingCenterX(section: HTMLElement): string {
  const heading = section.querySelector('h1, h2')
  if (!heading) return '50%'
  const box = heading.getBoundingClientRect()
  return `${box.left + box.width / 2 - section.getBoundingClientRect().left}px`
}

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
   * l'arrivée côté page (accélération des étoiles, texte de la section).
   * `offset` ramène `to` à la place de `from`.
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
    const outDuration = journey.departDuration
    const outFade = outDuration * OUT_FADE_RATIO
    const inStart = arrivalStart()
    const inDuration = journey.arrivalDuration
    const startScale = journey.arrivalStartScale
    const approach = { distance: 1 / startScale }
    const arrivalOrigin = `${headingCenterX(to)} ${height / 2}px`

    from?.setAttribute('data-depth', '')
    to.setAttribute('data-depth', '')
    if (from) gsap.set(from, { transformOrigin })
    gsap.set(to, { y: offset, scale: startScale, opacity: 0, visibility: 'inherit', transformOrigin: arrivalOrigin })

    enter()

    if (from) {
      tl.to(from, { scale: OUT_SCALE, duration: outDuration, ease: 'power2.in' }, 0).to(
        from,
        {
          autoAlpha: 0,
          duration: outFade,
          ease: 'power1.in',
          onComplete: () => from.setAttribute('data-departed', ''),
        },
        0,
      )

      ECHO_ALPHAS.forEach((alpha, k) => {
        // Décalé de `lag`, l'écho s'efface plus vite que le texte : tous
        // atteignent l'opacité 0 exactement à `outFade`, jamais pendant le trajet.
        const lag = (k + 1) * ECHO_LAG
        const leaving = makeEcho(from)
        gsap.set(leaving, { y: 0, scale: 1, opacity: 0, visibility: 'inherit', transformOrigin })
        tl.to(leaving, { scale: OUT_SCALE, duration: outDuration - lag, ease: 'power2.in' }, lag).fromTo(
          leaving,
          { opacity: alpha },
          { opacity: 0, duration: outFade - lag, ease: 'power1.in', immediateRender: false },
          lag,
        )
      })
    }

    tl.to(
      approach,
      {
        distance: 1,
        duration: inDuration,
        ease: journey.arrivalEase,
        onUpdate: () => {
          gsap.set(to, { scale: 1 / approach.distance })
        },
      },
      inStart,
    ).to(to, { opacity: 1, duration: inDuration * IN_FADE_RATIO, ease: 'power1.out' }, inStart)
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
