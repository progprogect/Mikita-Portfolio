export const isMobile =
  typeof window !== 'undefined' &&
  (window.matchMedia('(max-width: 820px)').matches || 'ontouchstart' in window);

export const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const quality = {
  dpr: Math.min(window.devicePixelRatio || 1, isMobile ? 1.75 : 2),
  stars: isMobile ? 2600 : 6500,
  dust: isMobile ? 300 : 900,
  contactParticles: isMobile ? 1800 : 3600,
  portalParticles: isMobile ? 1200 : 2600,
  /** lateral offset of 3D panels from the camera path */
  panelSide: isMobile ? 0.9 : 4.6,
  /** small vertical lift so panels sit slightly above screen center on mobile */
  panelLift: isMobile ? 0.4 : 0,
  /** how far ahead of the stop the panels sit; short on mobile so the camera
      flies past the image right after the stop and the text takes over */
  panelAhead: isMobile ? 5 : 10,
  ringRadius: isMobile ? 7 : 10.5,
} as const;
