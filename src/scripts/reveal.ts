export {};

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const updateHeader = () => {
  document.body.classList.toggle("is-scrolled", window.scrollY > 10);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (!motionQuery.matches) {
  document.documentElement.classList.add("motion-ready");

  const revealSelectors = [
    ".section-heading",
    ".gallery-item",
    ".video-card",
    ".panorama-showcase",
    ".about-copy",
    ".contact-inner",
    ".archive-hero",
    ".archive-card",
    ".work-detail-header",
    ".work-detail-image",
    ".work-detail-copy",
    ".viewer-control",
    ".viewer-stage"
  ];

  const revealTargets = Array.from(document.querySelectorAll<HTMLElement>(revealSelectors.join(",")));

  revealTargets.forEach((element, index) => {
    element.dataset.reveal = "";
    element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
  });

  const revealNow = (element: HTMLElement) => {
    element.classList.add("is-visible");
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealNow(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    revealTargets.forEach((element) => observer.observe(element));
  } else {
    revealTargets.forEach(revealNow);
  }
}
