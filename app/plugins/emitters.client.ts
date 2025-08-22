// plugins/emitter.client.ts
import mitt from 'mitt'
import type { AppEvents } from '~/types/events'

export default defineNuxtPlugin(() => {
  const emitter = mitt<AppEvents>()
  return {
    provide: { emitter },
  }
})

// Augmentation de type Nuxt pour avoir useNuxtApp().$emitter typé
declare module '#app' {
  interface NuxtApp {
    $emitter: import('mitt').Emitter<AppEvents>
  }
}
