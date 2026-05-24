import type * as Pannellum from "pannellum";

declare global {
  interface Window {
    pannellum?: typeof Pannellum;
  }
}

export {};

type PannellumViewer = {
  destroy?: () => void;
};

const section = document.querySelector<HTMLElement>("[data-panorama-section]");
const launchButtons = Array.from(section?.querySelectorAll<HTMLButtonElement>(".panorama-launch") ?? []);
const viewerElement = section?.querySelector<HTMLElement>(".panorama-viewer");
const statusElement = section?.querySelector<HTMLElement>(".panorama-status");
const previewImage = section?.querySelector<HTMLImageElement>(".panorama-preview img");

let viewer: PannellumViewer | undefined;
let activePanoramaUrl = "";
let isLoading = false;
let stylesheetPromise: Promise<void> | undefined;

const setStatus = (message: string) => {
  if (statusElement) statusElement.textContent = message;
};

const setButtonsDisabled = (disabled: boolean) => {
  launchButtons.forEach((button) => {
    button.disabled = disabled;
  });
};

const selectButton = (selectedButton: HTMLButtonElement) => {
  launchButtons.forEach((button) => {
    button.classList.toggle("is-selected", button === selectedButton);
  });
};

const ensureStylesheet = (href: string) => {
  if (document.querySelector(`link[href="${href}"]`)) {
    return Promise.resolve();
  }

  stylesheetPromise ??= new Promise<void>((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Unable to load stylesheet: ${href}`));
    document.head.append(link);
  });

  return stylesheetPromise;
};

const startPanorama = async (launchButton: HTMLButtonElement) => {
  if (!section || !viewerElement || isLoading) return;

  const panoramaUrl = launchButton.dataset.panorama;
  if (!panoramaUrl) return;

  if (activePanoramaUrl === panoramaUrl && section.classList.contains("is-active")) return;

  isLoading = true;
  setButtonsDisabled(true);
  selectButton(launchButton);
  setStatus(`正在确认${launchButton.dataset.title ?? "全景"}原图...`);

  if (previewImage && launchButton.dataset.preview) {
    previewImage.src = launchButton.dataset.preview;
  }

  try {
    const assetResponse = await fetch(panoramaUrl, { method: "HEAD" });
    if (!assetResponse.ok) {
      throw new Error(`Panorama image is unavailable: ${assetResponse.status}`);
    }

    setStatus("正在加载原图全景...");
    await ensureStylesheet("/vendor/pannellum.css");
    await import("pannellum");
    const pannellum = window.pannellum;

    if (!pannellum?.viewer) {
      throw new Error("Pannellum viewer is unavailable.");
    }

    viewer?.destroy?.();
    viewerElement.innerHTML = "";
    section.classList.add("is-active");
    activePanoramaUrl = panoramaUrl;
    setStatus("原图已打开，拖拽画面即可浏览 360 度全景。");
    viewer = pannellum.viewer(viewerElement, {
      type: "equirectangular",
      panorama: panoramaUrl,
      autoLoad: true,
      autoRotate: -1,
      compass: false,
      hfov: 105,
      yaw: Number(launchButton.dataset.yaw ?? 0),
      pitch: Number(launchButton.dataset.pitch ?? 0),
      showControls: true
    }) as PannellumViewer;
  } catch (error) {
    activePanoramaUrl = "";
    section.classList.remove("is-active");
    setStatus("全景查看器暂时无法启动。请确认原图已放在 public/panorama/，例如 pano-02.JPG。");
    console.error(error);
  } finally {
    isLoading = false;
    setButtonsDisabled(false);
  }
};

launchButtons.forEach((button) => {
  button.addEventListener("click", () => startPanorama(button));
});

if ("IntersectionObserver" in window && section && launchButtons.length) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        launchButtons.forEach((button) => button.classList.add("is-ready"));
        observer.disconnect();
      }
    },
    { rootMargin: "160px" }
  );
  observer.observe(section);
}
