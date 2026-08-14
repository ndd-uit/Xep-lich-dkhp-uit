import { canvasToPngBlob, downloadBlob } from './utils';

describe('timetable image utilities', () => {
  test('creates a PNG blob from a canvas', async () => {
    const pngBlob = new Blob(['image'], { type: 'image/png' });
    const canvas = {
      toBlob: vi.fn((callback: BlobCallback) => callback(pngBlob)),
    } as unknown as HTMLCanvasElement;

    await expect(canvasToPngBlob(canvas)).resolves.toBe(pngBlob);
  });

  test('rejects when the browser cannot create a PNG blob', async () => {
    const canvas = {
      toBlob: vi.fn((callback: BlobCallback) => callback(null)),
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
});
