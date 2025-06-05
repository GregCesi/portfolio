import mitt from 'mitt'

// Simple event bus shared across components
// The payload for 'accelerate-stars' is the animation duration
export type Events = {
  'accelerate-stars': number | undefined
}

export default defineNuxtPlugin(() => {
  const emitter = mitt<Events>()
  return {
    provide: {
      emitter,
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $emitter: import('mitt').Emitter<Events>
  }
}