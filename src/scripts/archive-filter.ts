export {};

const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-archive-filter]"));
const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-archive-card]"));
const count = document.querySelector<HTMLElement>("[data-archive-count]");
const grid = document.querySelector<HTMLElement>(".archive-grid");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let filterRun = 0;

const applyFilter = (selectedCategory: string) => {
  filterRun += 1;
  const currentRun = filterRun;
  let visibleCount = 0;
  let visibleIndex = 0;

  grid?.classList.add("is-filtering");

  cards.forEach((card) => {
    const isVisible = selectedCategory === "all" || card.dataset.category === selectedCategory;
    card.classList.remove("is-entering", "is-leaving");

    if (isVisible) {
      card.hidden = false;
      card.style.setProperty("--archive-filter-delay", `${Math.min(visibleIndex, 8) * 45}ms`);
      visibleIndex += 1;
      visibleCount += 1;

      if (!reduceMotion) {
        window.requestAnimationFrame(() => {
          if (currentRun !== filterRun) return;
          card.classList.add("is-entering");
        });
        window.setTimeout(
          () => {
            if (currentRun === filterRun) card.classList.remove("is-entering");
          },
          520 + visibleIndex * 45
        );
      }
      return;
    }

    if (reduceMotion || card.hidden) {
      card.hidden = true;
      return;
    }

    card.classList.add("is-leaving");
    window.setTimeout(() => {
      if (currentRun !== filterRun) return;
      card.hidden = true;
      card.classList.remove("is-leaving");
    }, 260);
  });

  buttons.forEach((button) => {
    const isActive = button.dataset.archiveFilter === selectedCategory;
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (count) {
    count.textContent = `共 ${visibleCount} 张`;
  }

  window.setTimeout(
    () => {
      if (currentRun === filterRun) grid?.classList.remove("is-filtering");
    },
    reduceMotion ? 0 : 720
  );
};

buttons.forEach((button) => {
  button.addEventListener("click", () => applyFilter(button.dataset.archiveFilter ?? "all"));
});
