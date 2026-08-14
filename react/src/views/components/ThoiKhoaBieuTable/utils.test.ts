import { canvasToPngBlob, downloadBlob, getSafeCanvasScale } from './utils';

describe('timetable image utilities', () => {
  test('creates a PNG blob from a canvas', async () => {
    const pngBlob = new Blob(['image'], { type: 'image/png' });
    const canvas = {
      toBlob: vi.fn((callback: BlobCallback) => callback(pngBlob)),
    } as unknown as HTMLCanvasElement;

    await expect(canvasToPngBlob(canvas)).resolves.toBe(pngBlob);
  });

  test('falls back to a PNG data URL when toBlob returns null', async () => {
    const canvas = {
      toBlob: vi.fn((callback: BlobCallback) => callback(null)),
      toDataURL: vi.fn(() => 'data:image/png;base64,aW1hZ2U='),
    } as unknown as HTMLCanvasElement;

    const blob = await canvasToPngBlob(canvas);

    expect(blob.type).toBe('image/png');
    expect(blob.size).toBeGreaterThan(0);
  });

  test('rejects when neither canvas export method can create a PNG', async () => {
    const canvas = {
      toBlob: vi.fn((callback: BlobCallback) => callback(null)),
      toDataURL: vi.fn(() => {
        throw new Error('Canvas is too large');
      }),
    } as unknown as HTMLCanvasElement;

    await expect(canvasToPngBlob(canvas)).rejects.toThrow('Không thể tạo ảnh PNG');
  });

  test('downloads a blob and releases its object URL', () => {
    vi.useFakeTimers();
    const createObjectURL = vi.fn(() => 'blob:timetable');
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    const pngBlob = new Blob(['image'], { type: 'image/png' });

    downloadBlob(pngBlob, 'tkb.png');
    vi.runAllTimers();

    expect(createObjectURL).toHaveBeenCalledWith(pngBlob);
    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:timetable');

    click.mockRestore();
    vi.useRealTimers();
  });

  test('reduces the scale for a very tall timetable', () => {
    const scale = getSafeCanvasScale(1200, 20_000, 2);

    expect(scale).toBeLessThan(1);
    expect(1200 * scale * 20_000 * scale).toBeLessThanOrEqual(16_000_000);
    expect(20_000 * scale).toBeLessThanOrEqual(8192);
  });
});
