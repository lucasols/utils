import { castToNumber } from './castValues';
import { clampMax } from './mathUtils';

export const MINUTE_AS_MS = 60 * 1000;
export const HOUR_AS_MS = 60 * MINUTE_AS_MS;
export const DAY_AS_MS = 24 * HOUR_AS_MS;
export const WEEK_AS_MS = 7 * DAY_AS_MS;
export const MONTH_AS_MS = 30 * DAY_AS_MS;
export const YEAR_AS_MS = 365 * DAY_AS_MS;

export const HOUR_AS_SECS = 60 * 60;
export const DAY_AS_SECS = 24 * HOUR_AS_SECS;
export const WEEK_AS_SECS = 7 * DAY_AS_SECS;
export const MONTH_AS_SECS = 30 * DAY_AS_SECS;
export const YEAR_AS_SECS = 365 * DAY_AS_SECS;

export function dateStringOrNullToUnixMs(
  isoString: string | null | undefined,
): number | null {
  if (!isoString) return null;

  const unixMs = new Date(isoString).getTime();

  if (isNaN(unixMs)) return null;

  return unixMs;
}

export function msToTimeString(
  ms: number,
  format: 'minutes' | 'seconds' | 'milliseconds',
  hoursMinLength = 2,
) {
  const { hours, minutes, seconds, milliseconds } = msToDurationObj(ms);

  const hoursString = padTimeVal(hours, hoursMinLength);
  const minutesString = padTimeVal(minutes);

  if (format === 'minutes') {
    return `${hoursString}:${minutesString}`;
  }

  const secondsString = padTimeVal(seconds);

  if (format === 'seconds') {
    return `${hoursString}:${minutesString}:${secondsString}`;
  }

  return `${hoursString}:${minutesString}:${secondsString}:${padTimeVal(
    milliseconds,
    3,
  )}`;
}

function padTimeVal(val: number, maxLength = 2) {
  return val.toString().padStart(maxLength, '0');
}

export function parseTimeStringToMs(timeString: string) {
  if (!timeString.trim()) return 0;

  const [hours, minutes, seconds, ms] = timeString.split(':');

  return (
    getTimeStringPartToInt(hours) * HOUR_AS_MS +
    clampMax(getTimeStringPartToInt(minutes), 59) * MINUTE_AS_MS +
    clampMax(getTimeStringPartToInt(seconds), 59) * 1000 +
    getTimeStringPartToInt(ms, 3)
  );
}

function getTimeStringPartToInt(
  timeStringPart: string | undefined,
  length?: number,
) {
  if (!timeStringPart?.trim()) return 0;

  let string = timeStringPart.replaceAll('_', '0');
  string = string.replaceAll('-', '');

  if (length) {
    string = string.padEnd(length, '0');

    if (string.length > length) {
      string = string.slice(0, length);
    }
  }

  const num = castToNumber(string);

  if (!num) return 0;

  return Math.floor(num);
}

function msToDurationObj(
  ms: number,
): Record<'milliseconds' | 'seconds' | 'minutes' | 'hours', number> {
  return {
    milliseconds: ms % 1000,
    seconds: Math.floor(ms / 1000) % 60,
    minutes: Math.floor(ms / 1000 / 60) % 60,
    hours: Math.floor(ms / 1000 / 60 / 60),
  };
}

export function getUnixSeconds() {
  return Math.floor(Date.now() / 1000);
}

export type DurationObj = {
  ms?: number;
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
};

export function durationObjToMs(durationObj: DurationObj) {
  return (
    (durationObj.hours ?? 0) * HOUR_AS_MS +
    (durationObj.minutes ?? 0) * MINUTE_AS_MS +
    (durationObj.seconds ?? 0) * 1000 +
    (durationObj.ms ?? 0) +
    (durationObj.days ?? 0) * DAY_AS_MS
  );
}
