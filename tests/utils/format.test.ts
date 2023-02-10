import { formatNum, randomString } from '../../src/utils/format';

describe('formatNum', () => {
  test('formats number correctly', () => {
    expect(formatNum(1000)).toBe('1,000');
    expect(formatNum(1000.11)).toBe('1,000.11');
    expect(formatNum('1000.11')).toBe('1,000.11');
  });
});

describe('randomString', () => {
  test('generates random string of specified length', () => {
    const result = randomString(10);
    expect(result.length).toBe(10);
    expect(typeof result).toBe('string');
  });
});
