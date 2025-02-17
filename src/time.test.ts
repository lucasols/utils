import { describe, expect, test } from 'vitest';
import {
  HOUR_AS_MS,
  MINUTE_AS_MS,
  msToTimeString,
  parseTimeStringToMs,
} from './time';

describe('msToTimeString', () => {
  test('should format time with minutes', () => {
    expect(msToTimeString(2 * HOUR_AS_MS + 30 * MINUTE_AS_MS, 'minutes')).toBe(
      '02:30',
    );
    expect(msToTimeString(14 * HOUR_AS_MS + 5 * MINUTE_AS_MS, 'minutes')).toBe(
      '14:05',
    );
    expect(msToTimeString(0, 'minutes')).toBe('00:00');
  });

  test('should format time with seconds', () => {
    expect(
      msToTimeString(2 * HOUR_AS_MS + 30 * MINUTE_AS_MS + 15 * 1000, 'seconds'),
    ).toBe('02:30:15');
    expect(
      msToTimeString(14 * HOUR_AS_MS + 5 * MINUTE_AS_MS + 45 * 1000, 'seconds'),
    ).toBe('14:05:45');
    expect(msToTimeString(0, 'seconds')).toBe('00:00:00');
  });

  test('should format time with milliseconds', () => {
    expect(
      msToTimeString(
        2 * HOUR_AS_MS + 30 * MINUTE_AS_MS + 15 * 1000 + 123,
        'milliseconds',
      ),
    ).toBe('02:30:15:123');
    expect(
      msToTimeString(
        14 * HOUR_AS_MS + 5 * MINUTE_AS_MS + 45 * 1000 + 7,
        'milliseconds',
      ),
    ).toBe('14:05:45:007');
    expect(msToTimeString(0, 'milliseconds')).toBe('00:00:00:000');
  });

  test('should handle custom hours padding', () => {
    expect(
      msToTimeString(2 * HOUR_AS_MS + 30 * MINUTE_AS_MS, 'minutes', 3),
    ).toBe('002:30');
    expect(
      msToTimeString(14 * HOUR_AS_MS + 5 * MINUTE_AS_MS, 'minutes', 4),
    ).toBe('0014:05');
  });
});

function getMs(hours: number, minutes: number, seconds: number, ms: number) {
  return hours * HOUR_AS_MS + minutes * MINUTE_AS_MS + seconds * 1000 + ms;
}

describe('parseTimeStringToMs', () => {
  test('handle empty values', () => {
    expect(parseTimeStringToMs('')).toBe(0);
  });

  test('handles complete time string with milliseconds', () => {
    expect(parseTimeStringToMs('02:30:15:123')).toBe(getMs(2, 30, 15, 123));
    expect(parseTimeStringToMs('14:05:45:007')).toBe(getMs(14, 5, 45, 7));
    expect(parseTimeStringToMs('00:00:00:000')).toBe(0);
    expect(parseTimeStringToMs('4298:00:00:000')).toBe(4298 * HOUR_AS_MS);
  });

  test('should parse time string with seconds', () => {
    expect(parseTimeStringToMs('02:30:15')).toBe(getMs(2, 30, 15, 0));
    expect(parseTimeStringToMs('14:05:45')).toBe(getMs(14, 5, 45, 0));
  });

  test('should parse time string with only hours and minutes', () => {
    expect(parseTimeStringToMs('02:30')).toBe(getMs(2, 30, 0, 0));
    expect(parseTimeStringToMs('14:05')).toBe(getMs(14, 5, 0, 0));
    expect(parseTimeStringToMs('001:00')).toBe(HOUR_AS_MS);
  });

  test('should handle partial time strings', () => {
    expect(parseTimeStringToMs('02:0')).toBe(2 * HOUR_AS_MS);
    expect(parseTimeStringToMs('2:00')).toBe(2 * HOUR_AS_MS);
    expect(parseTimeStringToMs('02:00:0_')).toBe(getMs(2, 0, 0, 0));
    expect(parseTimeStringToMs('02:__:0_')).toBe(getMs(2, 0, 0, 0));
    expect(parseTimeStringToMs('02:__:_')).toBe(getMs(2, 0, 0, 0));
    expect(parseTimeStringToMs('02:____:_')).toBe(getMs(2, 0, 0, 0));
    expect(parseTimeStringToMs('02:____:20')).toBe(getMs(2, 0, 20, 0));
    expect(parseTimeStringToMs('02:1.2:_')).toBe(getMs(2, 1, 0, 0));
    expect(parseTimeStringToMs('000:1_:001')).toBe(getMs(0, 10, 1, 0));
  });

  test('should handle partial time strings with ms', () => {
    expect(parseTimeStringToMs('000:01:01:2__')).toBe(getMs(0, 1, 1, 200));
    expect(parseTimeStringToMs('000:0_:_1:2__')).toBe(getMs(0, 0, 1, 200));
    expect(parseTimeStringToMs('000:0_:001:2__')).toBe(getMs(0, 0, 1, 200));
    expect(parseTimeStringToMs('000:1_:001:2')).toBe(getMs(0, 10, 1, 200));
    expect(parseTimeStringToMs('000:10:001:2345')).toBe(getMs(0, 10, 1, 234));
  });

  test('clamp max values', () => {
    expect(parseTimeStringToMs('000:80:00:00')).toBe(getMs(0, 59, 0, 0));
    expect(parseTimeStringToMs('000:00:60:00')).toBe(getMs(0, 0, 59, 0));
  });

  test('ignore negative values', () => {
    expect(parseTimeStringToMs('000:00:-1:00')).toBe(getMs(0, 0, 1, 0));
    expect(parseTimeStringToMs('-10:00:00:00')).toBe(getMs(10, 0, 0, 0));
  });
});
