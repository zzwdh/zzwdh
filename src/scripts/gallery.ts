const lightbox = document.querySelector<HTMLElement>(".lightbox");
const lightboxImage = lightbox?.querySelector<HTMLImageElement>("img");
const lightboxCaption = lightbox?.querySelector<HTMLElement>("figcaption");
const closeButton = lightbox?.querySelector<HTMLButtonElement>(".lightbox-close");
const previousButton = lightbox?.querySelector<HTMLButtonElement>(".lightbox-prev");
const nextButton = lightbox?.querySelector<HTMLButtonElement>(".lightbox-next");

const galleryItems = Array.from(
  document.querySelectorAll<HTMLButtonElement>(".gallery-item:not(.is-missing):not(:disabled)")
);

let activeIndex = 0;

const openLightbox = (item: HTMLButtonElement) => {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;

  const image = item.querySelector<HTMLImageElement>("img");
  if (!image) return;

  activeIndex = galleryItems.indexOf(item);
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = item.dataset.caption || image.alt;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

const showAdjacent = (direction: number) => {
  if (!lightbox?.classList.contains("is-open") || !galleryItems.length) return;
  activeIndex = (activeIndex + direction + galleryItems.length) % galleryItems.length;
  openLightbox(galleryItems[activeIndex]);
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
