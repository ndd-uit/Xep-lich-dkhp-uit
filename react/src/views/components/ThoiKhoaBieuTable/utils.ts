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

export const canvasToPngBlob = (canvasElement: HTMLCanvasElement): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvasElement.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Không thể tạo ảnh PNG từ thời khóa biểu.'));
      }
    }, 'image/png');
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
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
};
