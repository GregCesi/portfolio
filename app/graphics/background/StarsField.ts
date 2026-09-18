import type ReadingZones from './ReadingZones'

interface Star {
  x: number
  y: number
  z: number
  prevZ: number
  speed: number
  color: string
  rgb: [number, number, number]
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Couleur d'étoile à la luminosité `light` (1 = couleur d'origine). */
function shade(star: Star, light: number): string {
  if (light >= 0.999) return star.color
  return `rgb(${Math.round(star.rgb[0] * light)} ${Math.round(star.rgb[1] * light)} ${Math.round(star.rgb[2] * light)})`
}

/**
 * Longueur (px) d'un tronçon de traînée : chaque tronçon a sa propre luminosité,
 * celle de son extrémité la plus proche du texte (un tronçon ne peut donc pas
 * mordre sur une zone de lecture tout en restant lumineux).
 */
const STREAK_PIECE = 24
const STREAK_MAX_PIECES = 16

// Configuration exacte de l'original
const CONFIG = {
  starCount: 800,
  starSpeed: 0.1,
  starSize: 1.5,
  starColors: [
    { color: "#ffffff", weight: 40 },
    { color: "#4cc9f0", weight: 40 },
    { color: "#f72585", weight: 2 }
  ],
  fov: 250,
  warpSpeed: 1,
  warpFactor: 0
}

export default class StarsField {
  private stars: Star[] = []
  private time = 0
  private zones: ReadingZones | null = null

  /** Zones de lecture : les étoiles s'éteignent derrière le texte (voir ReadingZones). */
  setZones(zones: ReadingZones | null) {
    this.zones = zones
  }

  constructor() {
    this.initStars()
  }

  private getRandomColor(): string {
    const totalWeight = CONFIG.starColors.reduce((sum, color) => sum + color.weight, 0)
    let random = Math.random() * totalWeight

    for (const color of CONFIG.starColors) {
      random -= color.weight
      if (random <= 0) return color.color
    }
    
    return CONFIG.starColors[0]!.color
  }

  private initStars() {
    const newStars = []
    for (let i = 0; i < CONFIG.starCount; i++) {
      const z = Math.random() * 2000
      const color = this.getRandomColor()
      newStars.push({
        x: (Math.random() - 0.5) * 5000,
        y: (Math.random() - 0.5) * 5000,
        z,
        prevZ: z,
        speed: 0.1 + Math.random() * 0.5,
        color,
        rgb: hexToRgb(color),
      })
    }
    this.stars = newStars
  }

  // Méthodes pour contrôler le warp (appelées par WarpEffect)
  setWarpSpeed(speed: number) {
    CONFIG.warpSpeed = speed
  }

  setWarpFactor(factor: number) {
    CONFIG.warpFactor = factor
  }

  update(deltaTime: number, ctx: CanvasRenderingContext2D, width: number, height: number, centerX: number, centerY: number) {
    // Mise à jour du temps (identique à l'original)
    this.time += deltaTime * 0.001
    if (CONFIG.warpSpeed === 1) {
      CONFIG.warpFactor = 0.5 + 0.5 * Math.sin(this.time * 0.5)
    }

    // Mise à jour des étoiles (identique à l'original)
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i]
      star!.prevZ = star!.z
      star!.z -= (star!.speed * 10 + CONFIG.warpSpeed * 10 * CONFIG.warpFactor) * deltaTime * 0.01

      if (star!.z <= 0) {
        star!.z = 2000
        star!.x = (Math.random() - 0.5) * 5000
        star!.y = (Math.random() - 0.5) * 5000
        star!.prevZ = star!.z
      }
    }

    const zones = this.zones
    zones?.tick(performance.now())

    // Tri des étoiles par profondeur (identique à l'original)
    const sortedStars = [...this.stars].sort((a, b) => b.z - a.z)

    // Rendu des étoiles (identique à l'original)
    for (const star of sortedStars) {
      const scale = CONFIG.fov / (star.z + CONFIG.fov)
      const x = centerX + star.x * scale
      const y = centerY + star.y * scale
      const prevScale = CONFIG.fov / (star.prevZ + CONFIG.fov)
      const prevX = centerX + star.x * prevScale
      const prevY = centerY + star.y * prevScale

      // Dessiner la ligne de vitesse (avec vérification des limites comme l'original)
      if (Math.abs(x - prevX) < width / 2 && Math.abs(y - prevY) < height / 2) {
        ctx.lineWidth = scale * CONFIG.starSize * 0.5
        const length = Math.hypot(x - prevX, y - prevY)
        const pieces = zones ? Math.min(STREAK_MAX_PIECES, Math.max(1, Math.ceil(length / STREAK_PIECE))) : 1
        let lightA = zones ? zones.light(prevX, prevY) : 1
        for (let p = 0; p < pieces; p++) {
          const x0 = prevX + ((x - prevX) * p) / pieces
          const y0 = prevY + ((y - prevY) * p) / pieces
          const x1 = prevX + ((x - prevX) * (p + 1)) / pieces
          const y1 = prevY + ((y - prevY) * (p + 1)) / pieces
          const lightB = zones ? zones.light(x1, y1) : 1
          ctx.beginPath()
          ctx.strokeStyle = shade(star, Math.min(lightA, lightB))
          ctx.moveTo(x0, y0)
          ctx.lineTo(x1, y1)
          ctx.stroke()
          lightA = lightB
        }
      }

      // Dessiner l'étoile
      ctx.beginPath()
      ctx.fillStyle = shade(star, zones ? zones.light(x, y) : 1)
      ctx.arc(x, y, scale * CONFIG.starSize, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}