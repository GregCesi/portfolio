export type AppEvents = {
  'accelerate-stars': number | undefined;
  /** Émis au début de la transition vers une section (index 0-based) : lance sa révélation lente. */
  'section-enter': number;
}
