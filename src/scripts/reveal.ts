export {};

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const updateHeader = () => {
  document.body.classList.toggle("is-scrolled", window.scrollY > 10);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (!motionQuery.matches) {
  document.documentElement.classList.add("motion-ready");

  const pieceGroups = Array.from(
    document.querySelectorAll<HTMLElement>(
      ".section-heading, .about-copy, .contact-inner, .archive-hero, .work-detail-header, .work-detail-copy"
    )
  );

  pieceGroups.forEach((group) => {
    const rawPieces = Array.from(
      group.querySelectorAll<HTMLElement>(
        ".section-kicker, h1, h2, h3, p, .section-heading-copy, .contact-actions, .social-links, .qr-card, .work-meta, .work-tags"
      )
    );
    const pieces = rawPieces.filter((piece) => !rawPieces.some((other) => other !== piece && other.contains(piece)));

    pieces.forEach((piece, index) => {
      piece.dataset.motionPiece = "";
      piece.style.setProperty("--piece-delay", `${Math.min(index, 5) * 70}ms`);
    });
  });

  const imageTargets = Array.from(
    document.querySelectorAll<HTMLImageElement>(
      ".gallery-item img, .archive-card img, .video-cover img, .panorama-preview img, .work-detail-image img, .qr-card img"
    )
  );

  imageTargets.forEach((image, index) => {
    image.dataset.imageReveal = "";
    image.style.setProperty("--image-reveal-delay", `${Math.min(index % 8, 7) * 45}ms`);

    const revealImage = () => {
      window.requestAnimationFrame(() => image.classList.add("is-loaded"));
    };

    if (image.complete) {
      revealImage();
    } else {
      image.addEventListener("load", revealImage, { once: true });
      image.addEventListener("error", revealImage, { once: true });
    }
  });

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
    ".work-detail-copy"
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
