/**
 * Playwright wait strategies used by BaseActions.
 */
export enum WaitStrategy {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
  ATTACHED = 'attached',
  DETACHED = 'detached',
  LOAD = 'load',
  DOM_CONTENT_LOADED = 'domcontentloaded',
  NETWORK_IDLE = 'networkidle',
}
