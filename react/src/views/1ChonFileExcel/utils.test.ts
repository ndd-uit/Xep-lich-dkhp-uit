import { arrayToTkbObject } from './utils';

describe('arrayToTkbObject', () => {
  test('keeps missing schedule cells empty instead of the text undefined', () => {
    const row = Array.from({ length: 23 });
    row[0] = 1;
    row[1] = 'TEST001';
    row[2] = 'TEST001.1';
    row[7] = 3;

    const classModel = arrayToTkbObject(row);

    expect(classModel.Thu).toBe('');
    expect(classModel.Tiet).toBe('');
    expect(classModel.CachTuan).toBe('');
    expect(classModel.NBD).toBe('');
    expect(classModel.NKT).toBe('');
  });

  test('trims schedule values read from Excel', () => {
    const row = Array.from({ length: 23 });
    row[7] = 3;
    row[10] = ' 2 ';
    row[11] = ' 1,2 ';

    const classModel = arrayToTkbObject(row);

    expect(classModel.Thu).toBe('2');
    expect(classModel.Tiet).toBe('1,2');
  });
});
