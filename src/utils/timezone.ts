/**
 * Timezone utilities for Edge Trader
 * Supports IANA time zones using JavaScript's native Intl.DateTimeFormat API
 * Accounts automatically for daylight saving time (DST).
 */

export interface TimezoneOption {
  iana: string;
  label: string;
  region: string;
  isPopularTradingZone?: boolean;
}

export const DEFAULT_TIMEZONE = 'Africa/Nairobi';

// Curated list of prominent trading hubs, forex centers, and global financial zones
export const SUPPORTED_TIMEZONES: TimezoneOption[] = [
  // Required & Core Trading Zones
  {
    iana: 'Africa/Nairobi',
    label: 'Nairobi (East Africa Time)',
    region: 'Africa',
    isPopularTradingZone: true,
  },
  {
    iana: 'Etc/UTC',
    label: 'UTC (Coordinated Universal Time)',
    region: 'Global / Standard',
    isPopularTradingZone: true,
  },
  {
    iana: 'Europe/London',
    label: 'London (GMT / British Summer Time)',
    region: 'Europe (London Session)',
    isPopularTradingZone: true,
  },
  {
    iana: 'America/New_York',
    label: 'New York (Eastern Time)',
    region: 'North America (NY Session)',
    isPopularTradingZone: true,
  },
  {
    iana: 'America/Chicago',
    label: 'Chicago (Central Time / CME)',
    region: 'North America',
    isPopularTradingZone: true,
  },
  {
    iana: 'Asia/Tokyo',
    label: 'Tokyo (Japan Standard Time)',
    region: 'Asia (Tokyo Session)',
    isPopularTradingZone: true,
  },
  {
    iana: 'Australia/Sydney',
    label: 'Sydney (AEST / AEDT)',
    region: 'Asia-Pacific (Sydney Session)',
    isPopularTradingZone: true,
  },

  // Additional Major Financial & African Centers
  {
    iana: 'Europe/Frankfurt',
    label: 'Frankfurt (CET / CEST)',
    region: 'Europe (Frankfurt Session)',
  },
  {
    iana: 'Europe/Zurich',
    label: 'Zurich (CET / CEST)',
    region: 'Europe',
  },
  {
    iana: 'Europe/Paris',
    label: 'Paris (CET / CEST)',
    region: 'Europe',
  },
  {
    iana: 'Asia/Singapore',
    label: 'Singapore (SGT)',
    region: 'Asia',
    isPopularTradingZone: true,
  },
  {
    iana: 'Asia/Hong_Kong',
    label: 'Hong Kong (HKT)',
    region: 'Asia',
    isPopularTradingZone: true,
  },
  {
    iana: 'Asia/Dubai',
    label: 'Dubai (Gulf Standard Time)',
    region: 'Middle East',
    isPopularTradingZone: true,
  },
  {
    iana: 'Africa/Johannesburg',
    label: 'Johannesburg (SAST)',
    region: 'Africa',
  },
  {
    iana: 'Africa/Lagos',
    label: 'Lagos (West Africa Time)',
    region: 'Africa',
  },
  {
    iana: 'Africa/Cairo',
    label: 'Cairo (Eastern European Time)',
    region: 'Africa',
  },
  {
    iana: 'America/Toronto',
    label: 'Toronto (Eastern Time)',
    region: 'North America',
  },
  {
    iana: 'America/Los_Angeles',
    label: 'Los Angeles (Pacific Time)',
    region: 'North America',
  },
  {
    iana: 'Pacific/Auckland',
    label: 'Auckland (NZST / NZDT)',
    region: 'Asia-Pacific (Wellington/Auckland Open)',
  },
  {
    iana: 'Asia/Kolkata',
    label: 'Mumbai / Kolkata (IST)',
    region: 'Asia',
  },
];

/**
 * Validates if an IANA timezone string is recognized by the browser runtime
 */
export function isValidTimezone(tz: string | null | undefined): boolean {
  if (!tz || typeof tz !== 'string') return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns validated timezone or fallback to Africa/Nairobi
 */
export function sanitizeTimezone(tz: string | null | undefined): string {
  if (tz && isValidTimezone(tz)) {
    return tz;
  }
  return DEFAULT_TIMEZONE;
}

/**
 * Gets the current formatted offset string (e.g. "UTC+3", "UTC-4", "UTC+0")
 * accounting automatically for DST on the given date.
 */
export function getTimezoneOffsetString(timeZone: string, date: Date = new Date()): string {
  const safeTz = sanitizeTimezone(timeZone);
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: safeTz,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find((p) => p.type === 'timeZoneName')?.value;
    if (tzPart) {
      return tzPart.replace('GMT', 'UTC');
    }
  } catch {
    // fallback if shortOffset not supported
  }

  // Exact math calculation
  try {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: safeTz }));
    const diffMinutes = Math.round((tzDate.getTime() - utcDate.getTime()) / 60000);
    const sign = diffMinutes >= 0 ? '+' : '-';
    const absMinutes = Math.abs(diffMinutes);
    const hours = Math.floor(absMinutes / 60);
    const minutes = absMinutes % 60;
    return `UTC${sign}${hours}${minutes > 0 ? `:${String(minutes).padStart(2, '0')}` : ''}`;
  } catch {
    return 'UTC';
  }
}

/**
 * Format a date/timestamp to a full human-readable string in target timezone
 * e.g. "Monday, October 19, 2026"
 */
export function formatDateDisplay(
  dateInput: Date | string | number,
  timeZone: string
): string {
  const date = parseToDate(dateInput);
  if (!date) return 'Invalid Date';
  const safeTz = sanitizeTimezone(timeZone);

  return new Intl.DateTimeFormat('en-US', {
    timeZone: safeTz,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format date and time for table cells and card views
 * e.g. "2026-10-19 17:30" or with seconds
 */
export function formatDateTime(
  dateInput: Date | string | number,
  timeZone: string,
  includeSeconds = false
): string {
  const date = parseToDate(dateInput);
  if (!date) return '—';
  const safeTz = sanitizeTimezone(timeZone);

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: safeTz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
    hour12: false,
  });

  // en-CA produces "YYYY-MM-DD, HH:mm:ss" or similar
  return formatter.format(date).replace(',', '');
}

/**
 * Format compact date/time for dense table rows
 * e.g. "10-19 17:30"
 */
export function formatCompactDateTime(
  dateInput: Date | string | number,
  timeZone: string
): string {
  const date = parseToDate(dateInput);
  if (!date) return '—';
  const safeTz = sanitizeTimezone(timeZone);

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: safeTz,
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return formatter.format(date).replace(',', '');
}

/**
 * Format clock time only (e.g. "17:30:45")
 */
export function formatClockTime(
  dateInput: Date | string | number,
  timeZone: string,
  includeSeconds = true
): string {
  const date = parseToDate(dateInput);
  if (!date) return '--:--:--';
  const safeTz = sanitizeTimezone(timeZone);

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: safeTz,
    hour: '2-digit',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
    hour12: false,
  }).format(date);
}

/**
 * Converts an ISO 8601 UTC timestamp to the local YYYY-MM-DDTHH:mm string
 * for an HTML `<input type="datetime-local">` in the chosen timezone.
 */
export function toDatetimeLocalInputValue(
  dateInput: Date | string | number,
  timeZone: string
): string {
  const date = parseToDate(dateInput);
  if (!date) {
    return new Date().toISOString().slice(0, 16);
  }
  const safeTz = sanitizeTimezone(timeZone);

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: safeTz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });

  const parts = formatter.formatToParts(date);
  const findPart = (type: string) => parts.find((p) => p.type === type)?.value || '00';

  const year = findPart('year');
  const month = findPart('month');
  const day = findPart('day');
  const hour = findPart('hour');
  const minute = findPart('minute');

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

/**
 * Parses a YYYY-MM-DDTHH:mm string entered in a specific timezone
 * and converts it to a standard unambiguous ISO 8601 UTC string (e.g. "2026-10-19T14:30:00.000Z").
 * Preserves the exact instant entered in that timezone.
 */
export function fromDatetimeLocalInputValue(
  inputValue: string,
  timeZone: string
): string {
  if (!inputValue) return new Date().toISOString();
  const safeTz = sanitizeTimezone(timeZone);

  // Parse year, month, day, hours, minutes from input
  const match = inputValue.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return new Date().toISOString();

  const [, yStr, mStr, dStr, hStr, minStr] = match;
  const targetYear = parseInt(yStr, 10);
  const targetMonth = parseInt(mStr, 10);
  const targetDay = parseInt(dStr, 10);
  const targetHour = parseInt(hStr, 10);
  const targetMin = parseInt(minStr, 10);

  // Start with a UTC guess
  const guessUtc = new Date(Date.UTC(targetYear, targetMonth - 1, targetDay, targetHour, targetMin, 0));

  // Determine what date/time this guess produces in target timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: safeTz,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23',
  });

  const parts = formatter.formatToParts(guessUtc);
  const findVal = (t: string) => parseInt(parts.find((p) => p.type === t)?.value || '0', 10);

  const renderedYear = findVal('year');
  const renderedMonth = findVal('month');
  const renderedDay = findVal('day');
  const renderedHour = findVal('hour');
  const renderedMin = findVal('minute');

  const renderedUtc = new Date(Date.UTC(renderedYear, renderedMonth - 1, renderedDay, renderedHour, renderedMin, 0));
  const diffMs = guessUtc.getTime() - renderedUtc.getTime();

  // Correct the instant so that when rendered in safeTz, it matches exactly
  const correctedInstant = new Date(guessUtc.getTime() + diffMs);
  return correctedInstant.toISOString();
}

/**
 * Safely parse date input into Date object
 */
export function parseToDate(input: Date | string | number | null | undefined): Date | null {
  if (!input) return null;
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }
  const parsed = new Date(input);
  return isNaN(parsed.getTime()) ? null : parsed;
}
