export interface SlideContainerExposed {
  goTo: (index: number) => void
  current: Readonly<Ref<number>>
  totalSlides: Ref<number>
  canGoNext: Ref<boolean>
  canGoPrevious: Ref<boolean>
}
