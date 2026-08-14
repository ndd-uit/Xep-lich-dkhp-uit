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
