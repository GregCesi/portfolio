interface Star {
  x: number
  y: number
  z: number
  prevZ: number
  speed: number
  color: string
}

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
      newStars.push({
        x: (Math.random() - 0.5) * 5000,
        y: (Math.random() - 0.5) * 5000,
        z,
        prevZ: z,
        speed: 0.1 + Math.random() * 0.5,
        color: this.getRandomColor()
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
        ctx.beginPath()
        ctx.strokeStyle = star.color
        ctx.lineWidth = scale * CONFIG.starSize * 0.5
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(x, y)
        ctx.stroke()
      }

      // Dessiner l'étoile
      ctx.beginPath()
      ctx.fillStyle = star.color
      ctx.arc(x, y, scale * CONFIG.starSize, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}