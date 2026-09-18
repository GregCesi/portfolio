export interface Animatable {
  update: (deltaTime: number, ctx: CanvasRenderingContext2D, width: number, height: number, centerX: number, centerY: number) => void
}

export default class Renderer {
  private canvas: HTMLCanvasElement
  private ctx!: CanvasRenderingContext2D
  private objects: Animatable[] = []
  private lastTime = 0
  private animationFrameId: number | null = null
  private isAnimating = false
  private resizeTimeout: number | null = null
  
  // Dimensions
  private width = 0
  private height = 0
  private centerX = 0
  private centerY = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  init() {
    const context = this.canvas.getContext('2d')
    if (!context) {
      throw new Error('Unable to get canvas 2D context')
    }
    this.ctx = context
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  private handleResize = () => {
    // Annuler le redimensionnement précédent s'il n'est pas encore exécuté
    if (this.resizeTimeout) {
      window.cancelAnimationFrame(this.resizeTimeout)
    }

    // Utiliser requestAnimationFrame pour regrouper les mises à jour
    this.resizeTimeout = window.requestAnimationFrame(() => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      
      // Ne mettre à jour que si la taille a réellement changé
      if (newWidth !== this.width || newHeight !== this.height) {
        this.width = this.canvas.width = newWidth
        this.height = this.canvas.height = newHeight
        this.centerX = newWidth / 2
        this.centerY = newHeight / 2
        
        // Redessiner immédiatement après le redimensionnement
        if (this.ctx) {
          this.ctx.fillStyle = "rgba(5, 7, 10, 1)" // Fond noir bleuté plein (#05070A) pour éviter le clignotement
          this.ctx.fillRect(0, 0, newWidth, newHeight)
        }
      }
    })
  }

  private handleVisibilityChange = () => {
    if (document.hidden) {
      this.stop()
    } else {
      this.start()
    }
  }

  register(object: Animatable) {
    this.objects.push(object)
  }

  start() {
    if (!this.isAnimating) {
      this.lastTime = performance.now()
      const loop = (timestamp: number) => {
        const deltaTime = timestamp - this.lastTime
        this.lastTime = timestamp

        // Effet de traînée (identique à l'original)
        this.ctx.fillStyle = "rgba(5, 7, 10, 0.15)"
        this.ctx.fillRect(0, 0, this.width, this.height)

        // Update all registered objects
        this.objects.forEach(obj => 
          obj.update(deltaTime, this.ctx, this.width, this.height, this.centerX, this.centerY)
        )

        this.animationFrameId = requestAnimationFrame(loop)
      }

      this.animationFrameId = requestAnimationFrame(loop)
      this.isAnimating = true
    }
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    this.isAnimating = false
  }

  destroy() {
    this.stop()
    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  }

  // Getters pour les dimensions (utile pour les objets qui en ont besoin)
  get canvasWidth() { return this.width }
  get canvasHeight() { return this.height }
  get canvasCenterX() { return this.centerX }
  get canvasCenterY() { return this.centerY }
}