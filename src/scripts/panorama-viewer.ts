declare global {
  interface Window {
    pannellum?: typeof import("pannellum");
  }
}

export {};

type PannellumViewer = {
  destroy?: () => void;
};

const root = document.querySelector<HTMLElement>("[data-online-panorama-viewer]");
const fileInput = root?.querySelector<HTMLInputElement>(".viewer-file");
const dropZone = root?.querySelector<HTMLElement>("[data-viewer-drop]");
const viewerElement = root?.querySelector<HTMLElement>(".online-panorama-canvas");
const statusElement = root?.querySelector<HTMLElement>(".viewer-status");
const clearButton = root?.querySelector<HTMLButtonElement>("[data-viewer-clear]");
const sampleButtons = Array.from(root?.querySelectorAll<HTMLButtonElement>(".viewer-sample") ?? []);

let viewer: PannellumViewer | undefined;
let localObjectUrl = "";
let stylesheetPromise: Promise<void> | undefined;

const setStatus = (message: string) => {
  if (statusElement) statusElement.textContent = message;
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

const revokeLocalUrl = () => {
  if (!localObjectUrl) return;
  URL.revokeObjectURL(localObjectUrl);
  localObjectUrl = "";
};

const resetViewer = () => {
  viewer?.destroy?.();
  viewer = undefined;
  if (viewerElement) viewerElement.innerHTML = "";
  root?.classList.remove("has-viewer", "is-dragging");
};

const openPanorama = async (panoramaUrl: string, title: string, yaw = 0, pitch = 0) => {
  if (!root || !viewerElement) return;

  setStatus(`正在打开${title}...`);

  try {
    await ensureStylesheet("/vendor/pannellum.css");
    await import("pannellum");
    const pannellum = window.pannellum;

    if (!pannellum?.viewer) {
      throw new Error("Pannellum viewer is unavailable.");
    }

    resetViewer();
    root.classList.add("has-viewer");
    viewer = pannellum.viewer(viewerElement, {
      type: "equirectangular",
      panorama: panoramaUrl,
      autoLoad: true,
      compass: false,
      hfov: 105,
      yaw,
      pitch,
      showControls: true
    }) as PannellumViewer;
    setStatus(`${title}已打开。`);
  } catch (error) {
    resetViewer();
    setStatus("全景照片暂时无法打开。请确认图片是 2:1 的 equirectangular 全景图。");
    console.error(error);
  }
};

const openFile = (file: File) => {
  if (!file.type.startsWith("image/")) {
    setStatus("请选择图片文件。");
    return;
  }

  revokeLocalUrl();
  localObjectUrl = URL.createObjectURL(file);
  void openPanorama(localObjectUrl, file.name);
};

fileInput?.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (file) openFile(file);
});

dropZone?.addEventListener("dragover", (event) => {
  event.preventDefault();
  root?.classList.add("is-dragging");
});

dropZone?.addEventListener("dragleave", () => {
  root?.classList.remove("is-dragging");
});

dropZone?.addEventListener("drop", (event) => {
  event.preventDefault();
  root?.classList.remove("is-dragging");
  const file = event.dataTransfer?.files?.[0];
  if (file) openFile(file);
});

sampleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const panoramaUrl = button.dataset.samplePanorama;
    if (!panoramaUrl) return;

    revokeLocalUrl();
    void openPanorama(
      panoramaUrl,
      button.dataset.sampleTitle ?? "站内全景",
      Number(button.dataset.yaw ?? 0),
      Number(button.dataset.pitch ?? 0)
    );
  });
});

clearButton?.addEventListener("click", () => {
  resetViewer();
  revokeLocalUrl();
  if (fileInput) fileInput.value = "";
  setStatus("等待照片。");
});
