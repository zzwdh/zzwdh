export {};

const carousels = Array.from(document.querySelectorAll<HTMLElement>("[data-featured-carousel]"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const lightbox = document.querySelector<HTMLElement>(".lightbox");

carousels.forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll<HTMLElement>("[data-featured-slide]"));
  const dots = Array.from(carousel.querySelectorAll<HTMLButtonElement>("[data-featured-dot]"));
  const previousButton = carousel.querySelector<HTMLButtonElement>("[data-featured-prev]");
  const nextButton = carousel.querySelector<HTMLButtonElement>("[data-featured-next]");
  const status = carousel.querySelector<HTMLElement>("[data-featured-status]");
  const progress = carousel.querySelector<HTMLElement>("[data-featured-progress]");
  const interval = Number(carousel.dataset.interval ?? 5500);
  carousel.style.setProperty("--featured-interval", `${interval}ms`);

  if (slides.length <= 1) return;

  let activeIndex = 0;
  let timer: number | undefined;
  let isInteracting = false;
  let isLightboxOpen = false;

  const stop = () => {
    window.clearInterval(timer);
    timer = undefined;
    carousel.classList.remove("is-playing");
  };

  const canAutoplay = () => !reduceMotion && !isInteracting && !isLightboxOpen && !document.hidden;

  const restartProgress = () => {
    if (!progress || reduceMotion) return;
    progress.style.animation = "none";
    void progress.offsetWidth;
    progress.style.animation = "";
  };

  const start = () => {
    if (!canAutoplay() || timer) return;
    restartProgress();
    carousel.classList.add("is-playing");
    timer = window.setInterval(() => showSlide(activeIndex + 1), interval);
  };

  const setSlideState = (slide: HTMLElement, index: number) => {
    const isActive = index === activeIndex;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
    slide.inert = !isActive;
  };

  const showSlide = (nextIndex: number) => {
    activeIndex = (nextIndex + slides.length) % slides.length;

    slides.forEach(setSlideState);
    dots.forEach((dot, index) => {
      dot.setAttribute("aria-current", String(index === activeIndex));
    });

    if (status) {
      status.textContent = `第 ${activeIndex + 1} 组 / 共 ${slides.length} 组`;
    }

    if (timer) restartProgress();
  };

  const restart = () => {
    stop();
    start();
  };

  previousButton?.addEventListener("click", () => {
    showSlide(activeIndex - 1);
    restart();
  });

  nextButton?.addEventListener("click", () => {
    showSlide(activeIndex + 1);
    restart();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.featuredDot ?? 0));
      restart();
    });
  });

  carousel.addEventListener("pointerenter", () => {
    isInteracting = true;
    stop();
  });

  carousel.addEventListener("pointerleave", () => {
    isInteracting = false;
    start();
  });

  carousel.addEventListener("focusin", () => {
    isInteracting = true;
    stop();
  });

  carousel.addEventListener("focusout", (event) => {
    if (event.relatedTarget instanceof Node && carousel.contains(event.relatedTarget)) return;
    isInteracting = false;
    start();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  if (lightbox) {
    const observer = new MutationObserver(() => {
      isLightboxOpen = lightbox.classList.contains("is-open");
      if (isLightboxOpen) {
        stop();
      } else {
        start();
      }
    });
    observer.observe(lightbox, { attributes: true, attributeFilter: ["class"] });
  }

  showSlide(0);
  start();
});
