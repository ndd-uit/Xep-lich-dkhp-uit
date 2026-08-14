import { ClassModel } from './types';
import { copyTextToClipboard, findOverlapedClasses, hasFixedSchedule, hasOverlapSchedule } from './utils';

const createClass = (overrides: Partial<ClassModel>): ClassModel => ({
  STT: 1,
  MaMH: 'MATH001',
  MaLop: 'MATH001.1',
  TenMH: 'Môn kiểm thử',
  TenGV: undefined,
  MaGV: undefined,
  SiSo: '30',
  PhongHoc: undefined,
  SoTc: 3,
  ThucHanh: 1,
  HTGD: 'Trực tiếp',
  Thu: '2',
  Tiet: '1,2',
  CachTuan: '0',
  KhoaHoc: '2024',
  HocKy: '1',
  NamHoc: '2024',
  HeDT: 'Đại trà',
  KhoaQL: 'Khoa kiểm thử',
  NBD: '2024-01-01',
  NKT: '2024-05-01',
  GhiChu: '',
  NgonNgu: 'Tiếng Việt',
  ...overrides,
});

describe('schedule overlap', () => {
  test('identifies classes without a fixed schedule', () => {
    expect(hasFixedSchedule({ Thu: 'undefined', Tiet: 'undefined' })).toBe(false);
    expect(hasFixedSchedule({ Thu: '', Tiet: '' })).toBe(false);
    expect(hasFixedSchedule({ Thu: '*', Tiet: '*' })).toBe(false);
    expect(hasFixedSchedule({ Thu: '2', Tiet: '1,2' })).toBe(true);
  });

  test('allows selecting multiple classes whose schedules are undefined', () => {
    const firstClass = createClass({ MaLop: 'PRACTICE.1', Thu: 'undefined', Tiet: 'undefined' });
    const secondClass = createClass({ MaLop: 'PRACTICE.2', Thu: 'undefined', Tiet: 'undefined' });

    expect(hasOverlapSchedule([firstClass], secondClass)).toBe(false);
    expect(findOverlapedClasses([firstClass, secondClass])).toEqual({
      kept: [firstClass, secondClass],
      redundant: [],
    });
  });

  test('still prevents classes with the same fixed time slot', () => {
    const firstClass = createClass({ MaLop: 'FIXED.1', Thu: '3', Tiet: '4,5' });
    const secondClass = createClass({ MaLop: 'FIXED.2', Thu: '3', Tiet: '5,6' });

    expect(hasOverlapSchedule([firstClass], secondClass)).toBe(true);
  });

  test('treats empty and null placeholders as schedules without a fixed time', () => {
    const selectedClass = createClass({ MaLop: 'PRACTICE.1', Thu: '', Tiet: '' });
    const candidateClass = createClass({ MaLop: 'PRACTICE.2', Thu: ' null ', Tiet: 'NaN' });

    expect(hasOverlapSchedule([selectedClass], candidateClass)).toBe(false);
  });
});

describe('copyTextToClipboard', () => {
  test('writes text through the Clipboard API', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    await copyTextToClipboard('TKB-URL');

    expect(writeText).toHaveBeenCalledWith('TKB-URL');
  });
});
