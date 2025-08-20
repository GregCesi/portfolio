interface Star {
  x: number
  y: number
  z: number
  prevZ: number
  speed: number
  color: string
}

const BASE_STAR_SPEED_MIN = 0.1
const BASE_STAR_SPEED_MAX = 0.5

const STAR_COLORS = [
  { color: '#ffffff', weight: 40 },
  { color: '#4cc9f0', weight: 40 },
  { color: '#f72585', weight: 2 }
]

export default class StarsField {
  private stars: Star[] = []
  private width = window.innerWidth
  private height = window.innerHeight
  private centerX = this.width / 2
  private centerY = this.height / 2
  private warpFactor = 1
  private warpSpeed = 1

  constructor(private starCount = 800, private fov = 250, private starSize = 1.5) {
    this.initStars()
  }

  private getRandomColor(): string {
    const totalWeight = STAR_COLORS.reduce((sum, c) => sum + c.weight, 0)
    let random = Math.random() * totalWeight

    for (const entry of STAR_COLORS) {
      random -= entry.weight
      if (random <= 0) return entry.color
    }
    return STAR_COLORS[0]!.color
  }

  private initStars() {
    const newStars: Star[] = []
    for (let i = 0; i < this.starCount; i++) {
      const z = Math.random() * 2000
      newStars.push({
        x: (Math.random() - 0.5) * 5000,
        y: (Math.random() - 0.5) * 5000,
        z,
        prevZ: z,
        speed: BASE_STAR_SPEED_MIN + Math.random() * BASE_STAR_SPEED_MAX,
        color: this.getRandomColor()
      })
    }
    this.stars = newStars
  }

  

  setWarpFactor(value: number) {
    this.warpFactor = value
  }

  setWarpSpeed(value: number) {
    this.warpSpeed = value
  }

  update(deltaTime: number, ctx: CanvasRenderingContext2D) {
    for (const star of this.stars) {
      // Mettre à jour les profondeurs
      star.prevZ = star.z
      star.z -= (star.speed * 10 + this.warpSpeed * 10 * this.warpFactor) * deltaTime * 0.01

      // Remise à zéro quand on arrive trop près
      if (star.z <= 0) {
        star.z = 2000
        star.x = (Math.random() - 0.5) * 5000
        star.y = (Math.random() - 0.5) * 5000
        star.prevZ = star.z
      }

      // Calcul de position actuelle
      const scale = this.fov / (star.z + this.fov)
      const x = this.centerX + star.x * scale
      const y = this.centerY + star.y * scale

      // Calcul de la position précédente (à partir de prevZ)
      const prevScale = this.fov / (star.prevZ + this.fov)
      const prevX = this.centerX + star.x * prevScale
      const prevY = this.centerY + star.y * prevScale

      // Ligne de vitesse (de prev -> current)
      if (Math.floor(performance.now() / 16) % 2 === 0) {
        ctx.beginPath()
        ctx.strokeStyle = star.color
        ctx.lineWidth = scale * this.starSize * 0.15
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(x, y)
        ctx.stroke()
      }

      // Etoile (point)
      ctx.beginPath()
      ctx.fillStyle = star.color
      ctx.arc(x, y, scale * this.starSize, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}
