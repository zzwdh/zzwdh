const lightbox = document.querySelector<HTMLElement>(".lightbox");
const lightboxImage = lightbox?.querySelector<HTMLImageElement>("img");
const lightboxCaption = lightbox?.querySelector<HTMLElement>("figcaption");
const closeButton = lightbox?.querySelector<HTMLButtonElement>(".lightbox-close");
const previousButton = lightbox?.querySelector<HTMLButtonElement>(".lightbox-prev");
const nextButton = lightbox?.querySelector<HTMLButtonElement>(".lightbox-next");
const storyLink = lightbox?.querySelector<HTMLAnchorElement>("[data-lightbox-story]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const galleryItems = Array.from(
  document.querySelectorAll<HTMLButtonElement>(".gallery-item:not(.is-missing):not(:disabled)")
);

let activeIndex = 0;
let storyTimer: number | undefined;
let previousFocus: HTMLElement | null = null;

const hideStoryLink = () => {
  window.clearTimeout(storyTimer);
  if (!storyLink) return;
  storyLink.classList.remove("is-visible");
  storyLink.setAttribute("aria-hidden", "true");
  storyLink.setAttribute("tabindex", "-1");
};

const queueStoryLink = (item: HTMLButtonElement) => {
  hideStoryLink();
  if (!storyLink || !item.dataset.storyUrl) return;

  storyLink.href = item.dataset.storyUrl;
  storyTimer = window.setTimeout(
    () => {
      if (!lightbox?.classList.contains("is-open")) return;
      storyLink.classList.add("is-visible");
      storyLink.setAttribute("aria-hidden", "false");
      storyLink.removeAttribute("tabindex");
    },
    reduceMotion ? 700 : 2600
  );
};

const setLightboxDirection = (direction: number, wasOpen: boolean) => {
  if (!lightbox || reduceMotion) return;

  lightbox.dataset.lightboxDirection = direction > 0 ? "next" : direction < 0 ? "previous" : "open";
  lightbox.classList.remove("is-switching");

  if (wasOpen && direction !== 0) {
    void lightbox.offsetWidth;
    lightbox.classList.add("is-switching");
  }
};

const openLightbox = (item: HTMLButtonElement, direction = 0) => {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;

  const image = item.querySelector<HTMLImageElement>("img");
  if (!image) return;

  const wasOpen = lightbox.classList.contains("is-open");
  activeIndex = galleryItems.indexOf(item);
  if (!wasOpen) {
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }
  lightboxImage.src = item.dataset.fullSrc || image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = item.dataset.caption || image.alt;
  setLightboxDirection(direction, wasOpen);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  queueStoryLink(item);
  closeButton?.focus();
};

const closeLightbox = () => {
  if (!lightbox) return;
  hideStoryLink();
  lightbox.classList.remove("is-open");
  lightbox.classList.remove("is-switching");
  delete lightbox.dataset.lightboxDirection;
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  previousFocus?.focus();
};

const showAdjacent = (direction: number) => {
  if (!lightbox?.classList.contains("is-open") || !galleryItems.length) return;
  activeIndex = (activeIndex + direction + galleryItems.length) % galleryItems.length;
  openLightbox(galleryItems[activeIndex], direction);
};

galleryItems.forEach((item) => {
  item.addEventListener("click", () => openLightbox(item));
});

closeButton?.addEventListener("click", closeLightbox);
previousButton?.addEventListener("click", () => showAdjacent(-1));
nextButton?.addEventListener("click", () => showAdjacent(1));

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("is-open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showAdjacent(-1);
  if (event.key === "ArrowRight") showAdjacent(1);
});
