export {};

const pointerQuery = window.matchMedia("(pointer: fine)");
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const cursor = document.querySelector<HTMLElement>(".focus-cursor");
const ring = cursor?.querySelector<HTMLElement>(".focus-cursor-ring");
const dot = cursor?.querySelector<HTMLElement>(".focus-cursor-dot");
const label = cursor?.querySelector<HTMLElement>(".focus-cursor-label");
const hero = document.querySelector<HTMLElement>(".hero");

const labels = {
  view: "VIEW",
  play: "PLAY",
  panorama: "360",
  link: ""
} as const;

type CursorState = keyof typeof labels;

const canRun = Boolean(cursor && ring && dot && label && pointerQuery.matches && !motionQuery.matches);

if (canRun && cursor && ring && dot && label) {
  document.documentElement.classList.add("focus-cursor-ready");

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let ringX = pointerX;
  let ringY = pointerY;
  let frame = 0;

  const setCursorState = (state: CursorState | "") => {
    cursor.dataset.state = state;
    label.textContent = state ? labels[state] : "";
  };

  const updateTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) {
      setCursorState("");
      return;
    }

    const cursorTarget = target.closest<HTMLElement>("[data-cursor]");
    const state = cursorTarget?.dataset.cursor;

    if (state === "view" || state === "play" || state === "panorama" || state === "link") {
      setCursorState(state);
    } else {
      setCursorState("");
    }
  };

  const updateHero = () => {
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    const isInsideHero =
      pointerX >= rect.left && pointerX <= rect.right && pointerY >= rect.top && pointerY <= rect.bottom;

    if (!isInsideHero) {
      hero.style.removeProperty("--hero-pointer-x");
      hero.style.removeProperty("--hero-pointer-y");
      hero.style.removeProperty("--hero-shift-x");
      hero.style.removeProperty("--hero-shift-y");
      return;
    }

    const relativeX = (pointerX - rect.left) / rect.width;
    const relativeY = (pointerY - rect.top) / rect.height;
    const shiftX = (relativeX - 0.5) * 20;
    const shiftY = (relativeY - 0.5) * 16;

    hero.style.setProperty("--hero-pointer-x", `${relativeX * 100}%`);
    hero.style.setProperty("--hero-pointer-y", `${relativeY * 100}%`);
    hero.style.setProperty("--hero-shift-x", `${shiftX.toFixed(2)}px`);
    hero.style.setProperty("--hero-shift-y", `${shiftY.toFixed(2)}px`);
  };

  const render = () => {
    ringX += (pointerX - ringX) * 0.18;
    ringY += (pointerY - ringY) * 0.18;

    cursor.style.setProperty("--cursor-x", `${pointerX}px`);
    cursor.style.setProperty("--cursor-y", `${pointerY}px`);
    cursor.style.setProperty("--cursor-ring-x", `${ringX}px`);
    cursor.style.setProperty("--cursor-ring-y", `${ringY}px`);
    updateHero();

    frame = window.requestAnimationFrame(render);
  };

  const showCursor = () => {
    cursor.classList.add("is-visible");
  };

  const hideCursor = () => {
    cursor.classList.remove("is-visible");
    setCursorState("");
  };

  document.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      showCursor();
      updateTarget(event.target);
    },
    { passive: true }
  );

  document.addEventListener("pointerover", (event) => updateTarget(event.target), { passive: true });
  document.addEventListener("pointerleave", hideCursor, { passive: true });

  frame = window.requestAnimationFrame(render);

  window.addEventListener("pagehide", () => {
    window.cancelAnimationFrame(frame);
  });
}
