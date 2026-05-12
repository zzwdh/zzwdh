export {};

const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-archive-filter]"));
const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-archive-card]"));
const count = document.querySelector<HTMLElement>("[data-archive-count]");

const applyFilter = (selectedCategory: string) => {
  let visibleCount = 0;

  cards.forEach((card) => {
    const isVisible = selectedCategory === "all" || card.dataset.category === selectedCategory;
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  buttons.forEach((button) => {
    const isActive = button.dataset.archiveFilter === selectedCategory;
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (count) {
    count.textContent = `共 ${visibleCount} 张`;
  }
};

buttons.forEach((button) => {
  button.addEventListener("click", () => applyFilter(button.dataset.archiveFilter ?? "all"));
});
