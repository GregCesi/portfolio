export interface SlideMenuProps {
  labels: string[]
  activeIndex: number
}

export interface SlideMenuEmits {
  (e: 'select', index: number): void
}

export interface SlideMenuItemProps {
  label: string
  index: number
  active: boolean
  horizontal?: boolean
}

export interface SlideMenuItemEmits {
  (e: 'select', index: number): void
}
