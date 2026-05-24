export {};

const nudge = document.querySelector<HTMLElement>("[data-story-nudge]");
const panel = document.querySelector<HTMLElement>("[data-story-panel]");
const openButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-story-open]"));
const closeButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-story-close], [data-story-dismiss]")
);
const backdrop = document.querySelector<HTMLElement>(".story-backdrop");
const firstCloseButton = document.querySelector<HTMLButtonElement>("[data-story-panel] [data-story-close]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let hasDismissed = false;
let previousFocus: HTMLElement | null = null;

const showNudge = () => {
  if (!nudge || hasDismissed || panel?.classList.contains("is-open")) return;
  nudge.classList.add("is-visible");
  nudge.setAttribute("aria-hidden", "false");
  nudge.inert = false;
};

const hideNudge = () => {
  if (!nudge) return;
  nudge.classList.remove("is-visible");
  nudge.setAttribute("aria-hidden", "true");
  nudge.inert = true;
};

const openPanel = () => {
  if (!panel) return;
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  hideNudge();
  panel.classList.add("is-open");
  backdrop?.classList.add("is-visible");
  panel.setAttribute("aria-hidden", "false");
  panel.inert = false;
  document.body.classList.add("story-is-open");
  firstCloseButton?.focus();
};

const closePanel = () => {
  panel?.classList.remove("is-open");
  backdrop?.classList.remove("is-visible");
  panel?.setAttribute("aria-hidden", "true");
  if (panel) panel.inert = true;
  document.body.classList.remove("story-is-open");
  previousFocus?.focus();
  previousFocus = null;
};

const dismissNudge = () => {
  hasDismissed = true;
  hideNudge();
  closePanel();
};

window.setTimeout(showNudge, reduceMotion ? 900 : 2800);

openButtons.forEach((button) => {
  button.addEventListener("click", openPanel);
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.hasAttribute("data-story-dismiss")) {
      dismissNudge();
    } else {
      closePanel();
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePanel();
});
