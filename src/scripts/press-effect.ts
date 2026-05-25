export {};

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const pressableSelector = [
  "a[href]",
  "button:not(:disabled)",
  "[role='button']",
  "[data-cursor='view']",
  "[data-cursor='play']",
  "[data-cursor='panorama']",
  "[data-cursor='link']"
].join(",");

const isDisabled = (element: HTMLElement) =>
  element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true" || element.closest("[inert]");

if (!motionQuery.matches) {
  const layer = document.createElement("div");
  const activeTimers = new WeakMap<HTMLElement, number>();
  let lastPointerTarget: HTMLElement | null = null;
  let lastPointerAt = 0;
  layer.className = "press-effects";
  layer.setAttribute("aria-hidden", "true");
  document.body.append(layer);
  document.documentElement.classList.add("press-effects-ready");

  const getPressTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return null;
    const pressTarget = target.closest<HTMLElement>(pressableSelector);
    if (!pressTarget || isDisabled(pressTarget)) return null;
    return pressTarget;
  };

  const pulseTarget = (target: HTMLElement) => {
    window.clearTimeout(activeTimers.get(target));
    target.classList.remove("is-press-lit");
    void target.offsetWidth;
    target.classList.add("is-press-lit");

    activeTimers.set(
      target,
      window.setTimeout(() => {
        target.classList.remove("is-press-lit");
      }, 560)
    );
  };

  const emitBurst = (x: number, y: number, target: HTMLElement) => {
    const burst = document.createElement("span");
    const state = target.dataset.cursor ?? (target instanceof HTMLAnchorElement ? "link" : "");
    const rect = target.getBoundingClientRect();
    const size = Math.max(68, Math.min(180, Math.max(rect.width, rect.height) * 1.42));

    burst.className = "press-burst";
    burst.dataset.pressState = state;
    burst.style.setProperty("--press-x", `${x}px`);
    burst.style.setProperty("--press-y", `${y}px`);
    burst.style.setProperty("--press-size", `${size}px`);
    layer.append(burst);
    burst.addEventListener("animationend", () => burst.remove(), { once: true });
  };

  const triggerPress = (target: HTMLElement, x: number, y: number) => {
    pulseTarget(target);
    emitBurst(x, y, target);
  };

  document.addEventListener(
    "pointerdown",
    (event) => {
      if (event.button !== 0) return;
      const target = getPressTarget(event.target);
      if (!target) return;
      lastPointerTarget = target;
      lastPointerAt = window.performance.now();
      triggerPress(target, event.clientX, event.clientY);
    },
    { passive: true }
  );

  document.addEventListener("click", (event) => {
    const target = getPressTarget(event.target);
    if (!target) return;
    const isPointerDuplicate = target === lastPointerTarget && window.performance.now() - lastPointerAt < 420;
    if (isPointerDuplicate) return;

    const rect = target.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;
    triggerPress(target, x, y);
  });
}
