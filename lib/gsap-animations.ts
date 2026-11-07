import gsap from "gsap";

/**
 * Animate numerical metric counters smoothly using GSAP
 */
export function animateMetricCounter(
  target: { value: number },
  endValue: number,
  onUpdate: (current: number) => void,
  duration = 1.2
) {
  return gsap.to(target, {
    value: endValue,
    duration,
    ease: "power2.out",
    onUpdate: () => onUpdate(target.value),
  });
}

/**
 * Radar sonar wave ripple timeline
 */
export function createRadarPulse(element: HTMLElement | null) {
  if (!element) return null;
  const tl = gsap.timeline({ repeat: -1 });
  tl.fromTo(
    element,
    { scale: 0.8, opacity: 0.8 },
    { scale: 2.4, opacity: 0, duration: 2.2, ease: "power1.out" }
  );
  return tl;
}

