export const tietOnline = {
  index: 13,
  stringValue: '*',
  label: 'Online',
} as const;

export const timeLookup = [
  /* tiet 1 */ '(7:30 - 8:15)',
  /* tiet 2 */ '(8:15 - 9:00)',
  /* tiet 3 */ '(9:00 - 9:45)',
  /* tiet 4 */ '(10:00 - 10:45)',
  /* tiet 5 */ '(10:45 - 11:30)',
  /* tiet 6 */ '(13:00 - 13:45)',
  /* tiet 7 */ '(13:45 - 14:30)',
  /* tiet 8 */ '(14:30 - 15:15)',
  /* tiet 9 */ '(15:30 - 16:15)',
  /* tiet 10 */ '(16:15 - 17:00)',
  /* tiet 11 */ '🌚',
  /* tiet 12 */ '🌚',
  /* tiet 13 */ '🌚',
  /* tiet 14 */ tietOnline.label,
];

export const getTietIndex = (tietString: string): number => {
  if (tietString === tietOnline.stringValue) return tietOnline.index; // Thứ 3 Tiết * -> Thứ 3 Học Online
  if (tietString === '0') return 9;
  return Number(tietString) - 1;
};

// Giữ canvas dưới các giới hạn phổ biến của trình duyệt, đặc biệt là Safari
// trên thiết bị di động. TKB có nhiều lớp chưa có lịch cố định có thể rất cao.
const MAX_CANVAS_EDGE = 8192;
const MAX_CANVAS_PIXELS = 16_000_000;

export const getSafeCanvasScale = (width: number, height: number, devicePixelRatio = 1): number => {
  if (width <= 0 || height <= 0) return 1;

  const desiredScale = Math.min(Math.max(devicePixelRatio, 1), 2);
  const edgeScale = MAX_CANVAS_EDGE / Math.max(width, height);
  const areaScale = Math.sqrt(MAX_CANVAS_PIXELS / (width * height));

  return Math.max(0.1, Math.min(desiredScale, edgeScale, areaScale));
};

const UNSUPPORTED_COLOR_FUNCTION = /\b(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\s*\(/i;
const HTML2CANVAS_COLOR_FALLBACKS = {
  color: 'rgb(22, 39, 56)',
  'background-color': 'rgba(0, 0, 0, 0)',
  'border-top-color': 'rgb(213, 225, 231)',
  'border-right-color': 'rgb(213, 225, 231)',
  'border-bottom-color': 'rgb(213, 225, 231)',
  'border-left-color': 'rgb(213, 225, 231)',
  'outline-color': 'rgba(0, 0, 0, 0)',
  'text-decoration-color': 'currentcolor',
  fill: 'currentcolor',
  stroke: 'currentcolor',
  'background-image': 'none',
  'border-image-source': 'none',
  'box-shadow': 'none',
  'text-shadow': 'none',
} as const;

type StylableElement = Element & { style: CSSStyleDeclaration };

const isStylableElement = (element: Element): element is StylableElement => 'style' in element;

const sanitizeElementColors = (element: Element, view: Window): void => {
  if (!isStylableElement(element)) return;

  const computedStyle = view.getComputedStyle(element);
  for (const [property, fallback] of Object.entries(HTML2CANVAS_COLOR_FALLBACKS)) {
    if (UNSUPPORTED_COLOR_FUNCTION.test(computedStyle.getPropertyValue(property))) {
      element.style.setProperty(property, fallback, 'important');
    }
  }
};

/**
 * html2canvas 1.4 cannot parse CSS Color Level 4 functions. Browser
 * extensions can inject these colors even when the application does not use
 * them, so only sanitize the detached document created for image export.
 */
export const sanitizeHtml2CanvasColors = (root: HTMLElement): void => {
  const view = root.ownerDocument.defaultView;
  if (!view) return;

  const elements = [root, ...Array.from(root.querySelectorAll('*'))];
  for (const element of elements) sanitizeElementColors(element, view);
};

/** html2canvas parses the document background before parsing the target tree. */
export const sanitizeHtml2CanvasDocument = (documentClone: Document, root: HTMLElement): void => {
  const view = documentClone.defaultView;
  if (!view) return;

  sanitizeElementColors(documentClone.documentElement, view);
  sanitizeElementColors(documentClone.body, view);
  sanitizeHtml2CanvasColors(root);
};

export const isBrowserExtensionElement = (element: Element): boolean => {
  const marker = `${element.tagName} ${element.id} ${element.className}`.toLowerCase();
  const resourceUrl = element.getAttribute('src') || element.getAttribute('href') || '';

  return (
    marker.includes('grammarly') ||
    resourceUrl.startsWith('chrome-extension://') ||
    resourceUrl.startsWith('moz-extension://')
  );
};

const pngDataUrlToBlob = (dataUrl: string): Blob => {
  const prefix = 'data:image/png;base64,';
  if (!dataUrl.startsWith(prefix)) throw new Error('Không thể đọc dữ liệu ảnh PNG.');

  const binary = window.atob(dataUrl.slice(prefix.length));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);

  return new Blob([bytes], { type: 'image/png' });
};

export const canvasToPngBlob = (canvasElement: HTMLCanvasElement): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const useDataUrlFallback = () => {
      try {
        resolve(pngDataUrlToBlob(canvasElement.toDataURL('image/png')));
      } catch {
        reject(new Error('Không thể tạo ảnh PNG từ thời khóa biểu.'));
      }
    };

    if (!canvasElement.toBlob) {
      useDataUrlFallback();
      return;
    }

    canvasElement.toBlob((blob) => (blob ? resolve(blob) : useDataUrlFallback()), 'image/png');
  });
};

export const downloadBlob = (blob: Blob, filename = 'thoikhoabieu.png') => {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  // Một số trình duyệt chỉ bắt đầu đọc blob sau khi click đã kết thúc. Thu hồi
  // URL ngay ở task kế tiếp có thể làm việc tải ảnh bị hủy mà không báo lỗi.
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
};
