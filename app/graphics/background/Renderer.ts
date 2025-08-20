export interface Animatable {
  update: (deltaTime: number, ctx: CanvasRenderingContext2D) => void
}

export default class Renderer {
  private canvas: HTMLCanvasElement
  private ctx!: CanvasRenderingContext2D
  private objects: Animatable[] = []
  private lastTime = 0
  private animationFrameId: number | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  init() {
    const context = this.canvas.getContext('2d')
    if (!context) {
      throw new Error('Unable to get canvas 2D context')
    }
    this.ctx = context
    this.resize()
    window.addEventListener('resize', this.resize)
  }

  private resize = () => {
    this.canvas.width  = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  register(object: Animatable) {
    this.objects.push(object)
  }

  start() {
    this.lastTime = performance.now()
    const loop = (timestamp: number) => {
      const dt = timestamp - this.lastTime
      this.lastTime = timestamp

      // Clear the canvas
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.08)"
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

      // Update all registered objects
      this.objects.forEach(obj => obj.update(dt, this.ctx))

      this.animationFrameId = requestAnimationFrame(loop)
    }

    this.animationFrameId = requestAnimationFrame(loop)
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    window.removeEventListener('resize', this.resize)
  }
}
