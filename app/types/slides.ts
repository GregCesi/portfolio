export interface SlideContainerExposed {
  goTo: (index: number, opts?: { direct?: boolean }) => void
  enter: () => void
  current: Readonly<Ref<number>>
  totalSlides: Ref<number>
  canGoNext: Ref<boolean>
  canGoPrevious: Ref<boolean>
}
