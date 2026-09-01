/**
 * KrishiSetu Real-Time Dynamic Date & Time Utilities
 * Provides dynamic dates, days of week, relative timestamps, and localized (English/Marathi) formats.
 */

const MARATHI_MONTHS = [
  'जानेवारी',
  'फेब्रुवारी',
  'मार्च',
  'एप्रिल',
  'मे',
  'जून',
  'जुलै',
  'ऑगस्ट',
  'सप्टेंबर',
  'ऑक्टोबर',
  'नोव्हेंबर',
  'डिसेंबर',
];

const MARATHI_DAYS = [
  'रविवार',
  'सोमवार',
  'मंगळवार',
  'बुधवार',
  'गुरुवार',
  'शुक्रवार',
  'शनिवार',
];

const MARATHI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export const toMarathiDigits = (num) => {
  return String(num).replace(/[0-9]/g, (digit) => MARATHI_DIGITS[Number(digit)]);
};

/**
 * Format date in English (e.g. "1 Sep 2026", "28 Aug 2026")
 */
export const getFormattedDate = (date = new Date(), options = {}) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  });
};

export const getTodayFormatted = (date = new Date(), options = {}) => {
  return getFormattedDate(date, options);
};

/**
 * Format today's date in Marathi with Devanagari numerals (e.g. "१ सप्टेंबर २०२६")
 */
export const getTodayMarathiFormatted = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  const day = d.getDate();
  const monthIdx = d.getMonth();
  const year = d.getFullYear();
  return `${toMarathiDigits(day)} ${MARATHI_MONTHS[monthIdx]} ${toMarathiDigits(year)}`;
};

/**
 * Generate localized Live Rate header badge
 * English: "Today's Live Rates (1 Sep 2026)"
 * Marathi: "आजचे थेट दर (१ सप्टेंबर २०२६)"
 */
export const getLiveRateBadgeLabel = (language = 'en', date = new Date()) => {
  if (language === 'mr') {
    return `आजचे थेट दर (${getTodayMarathiFormatted(date)})`;
  }
  return `Today's Live Rates (${getFormattedDate(date)})`;
};

/**
 * Get formatted date relative to today (+/- daysOffset)
 */
export const getRelativeDate = (daysOffset = 0, options = {}) => {
  const d = new Date(Date.now() + daysOffset * 86400000);
  return getFormattedDate(d, options);
};

/**
 * Get ISO date string (YYYY-MM-DD) relative to today
 */
export const getRelativeDateISO = (daysOffset = 0) => {
  const d = new Date(Date.now() + daysOffset * 86400000);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format relative date time string (e.g. "Today, 08:30 AM", "31 Aug 2026, 11:45 AM")
 */
export const getRelativeDateTime = (daysOffset = 0, timeStr = '10:00 AM') => {
  if (daysOffset === 0) return `Today, ${timeStr}`;
  if (daysOffset === 1) return `Tomorrow, ${timeStr}`;
  if (daysOffset === -1) return `Yesterday, ${timeStr}`;
  return `${getRelativeDate(daysOffset)}, ${timeStr}`;
};

/**
 * Get day name for offset (e.g. "Tuesday", "Wednesday")
 */
export const getRelativeDayName = (daysOffset = 0, language = 'en') => {
  const d = new Date(Date.now() + daysOffset * 86400000);
  if (language === 'mr') {
    return MARATHI_DAYS[d.getDay()];
  }
  return d.toLocaleDateString('en-US', { weekday: 'long' });
};

/**
 * Generate 5-day agricultural weather forecast data starting from today
 */
export const getForecastDays = () => {
  const weatherPresets = [
    { temp: '32°C / 21°C', weather: 'Sunny', icon: '☀️', rain: '0%', humidity: '48%', wind: '14 km/h', advice: 'Optimal for field harvesting and open-air shed drying.' },
    { temp: '33°C / 21°C', weather: 'Partly Cloudy', icon: '⛅', rain: '10%', humidity: '52%', wind: '12 km/h', advice: 'Favorable storage conditions, low decay risk.' },
    { temp: '32°C / 20°C', weather: 'Light Rain Shower', icon: '🌧️', rain: '65%', humidity: '74%', wind: '18 km/h', advice: 'Ensure onion storage sheds are covered with tarpaulin.' },
    { temp: '31°C / 19°C', weather: 'Moderate Rain', icon: '🌧️', rain: '80%', humidity: '82%', wind: '22 km/h', advice: 'Avoid transporting produce in open tractor trailers.' },
    { temp: '30°C / 18°C', weather: 'Thunderstorm', icon: '⛈️', rain: '85%', humidity: '85%', wind: '25 km/h', advice: 'Keep drain channels clear in low-lying plots.' },
  ];

  return weatherPresets.map((preset, idx) => {
    const dayName = getRelativeDayName(idx);
    const dayLabel = idx === 0 ? `${dayName} (Today)` : idx === 1 ? `${dayName} (Tomorrow)` : dayName;
    const dateFormatted = getRelativeDate(idx);
    return {
      ...preset,
      day: dayLabel,
      dayName,
      date: dateFormatted,
    };
  });
};

/**
 * Get today formatted in standard MM/DD/YYYY format
 */
export const getTodayMMDDYYYY = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};
