/**
 * Format a decimal value as a percentage number
 * @param value - The value to format (0-1 range, e.g., 0.856 = 85.6%)
 * @param digitsToFixed - Number of decimal places (default: 1)
 * @returns Formatted percentage as a number, or 0 if value is undefined/null
 * @example
 * formatPercent(0.856) // 85.6
 * formatPercent(0.8567, 2) // 85.67
 * formatPercent(undefined) // 0
 */
export const formatPercent = (value: number | undefined | null, digitsToFixed = 1): number => {
  if (value === undefined || value === null) return 0;
  try {
    return Number((value * 100).toFixed(digitsToFixed));
  } catch (error) {
    console.error('Error formatting percent:', error);
    return 0;
  }
};

/**
 * Format a decimal value as a percentage string with unit
 * @param value - The value to format (0-1 range, e.g., 0.856 = 85.6%)
 * @param digitsToFixed - Number of decimal places (default: 1)
 * @param unit - Whether to include the % symbol (default: true)
 * @returns Formatted percentage string, or "0%" (or "0" if unit=false) if value is undefined/null
 * @example
 * formatPercentString(0.856) // "85.6%"
 * formatPercentString(0.856, 1, false) // "85.6"
 * formatPercentString(0.8567, 2) // "85.67%"
 * formatPercentString(undefined) // "0%"
 */
export const formatPercentString = (value: number | undefined | null, digitsToFixed = 1, unit = true): string => {
  if (value === undefined || value === null) return unit ? '0%' : '0';
  try {
    return (value * 100).toFixed(digitsToFixed) + (unit ? '%' : '');
  } catch (error) {
    console.error('Error formatting percent:', error);
    return unit ? '0%' : '0';
  }
};

/**
 * Format duration in milliseconds to human-readable format
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string
 * @example
 * formatDuration(500) // "500ms"
 * formatDuration(5000) // "5.00s"
 * formatDuration(125000) // "2m 5s"
 */
export const formatDuration = (ms: number | null | undefined): string => {
  if (ms === null || ms === undefined) return 'N/A';
  
  if (ms < 1000) {
    return `${ms.toFixed(2)}ms`;
  }
  
  const seconds = Math.floor(ms / 1000);
  const remainingMs = ms % 1000;
  
  if (seconds < 60) {
    return remainingMs > 0 
      ? `${seconds}.${String(remainingMs).padStart(3, '0').substring(0, 2)}s`
      : `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}m ${remainingSeconds}s`;
};

/**
 * Format a timestamp to localized date/time string
 * @param timestamp - The timestamp to format (string, number, or Date)
 *                    - If number is less than 10000000000, treated as Unix time (seconds)
 *                    - Otherwise treated as milliseconds
 * @param locale - Locale string (default: 'en-US')
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date/time string
 * @example
 * formatDateTime(Date.now()) // "12/14/2025, 10:30:45 AM"
 * formatDateTime(1703419845) // "12/24/2023, 10:30:45 AM" (Unix seconds)
 * formatDateTime(Date.now(), 'ja-JP') // "2025/12/14 10:30:45"
 */
export const formatDateTime = (
  timestamp: string | number | Date,
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = {}
): string => {
  try {
    let date: Date;
    
    if (typeof timestamp === 'number') {
      // Unix time (seconds) is typically less than 10000000000 (Sep 2286)
      // Millisecond timestamps are larger
      date = timestamp < 10000000000 
        ? new Date(timestamp * 1000)  // Convert seconds to milliseconds
        : new Date(timestamp);         // Already in milliseconds
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleString(locale, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(timestamp);
  }
};

/**
 * Add +/- prefix to a value
 * @param value - The value to add prefix to
 * @returns Value with +/- prefix (+ for positive, - already included for negative)
 * @example
 * formatWithSign(5) // "+5"
 * formatWithSign(-3) // "-3"
 * formatWithSign(0) // "+0"
 */
export const formatWithSign = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const prefix = numValue >= 0 ? '+' : '';
  return `${prefix}${value}`;
};

/**
 * Format percentage change value with +/- prefix
 * @param value - The change value (e.g., 0.05 = +5%)
 * @param digitsToFixed - Number of decimal places (default: 2)
 * @returns Formatted change string with +/- prefix
 * @example
 * formatPercentChange(0.05) // "+5.00%"
 * formatPercentChange(-0.03) // "-3.00%"
 * formatPercentChange(0.1, 1) // "+10.0%"
 */
export const formatPercentChange = (value: number, digitsToFixed = 2): string => {
  return formatWithSign((value * 100).toFixed(digitsToFixed)) + '%';
};

/**
 * Format duration change value with +/- prefix
 * @param ms - The change value in milliseconds
 * @returns Formatted duration change string with +/- prefix
 * @example
 * formatDurationChange(500) // "+500.00ms"
 * formatDurationChange(-5000) // "-5.00s"
 * formatDurationChange(125000) // "+2m 5s"
 */
export const formatDurationChange = (ms: number | null | undefined): string => {
  if (ms === null || ms === undefined) return 'N/A';
  return formatWithSign(formatDuration(ms));
};

/**
 * Format numeric change value with +/- prefix
 * @param value - The change value
 * @returns Formatted change string with +/- prefix
 * @example
 * formatNumericChange(500) // "+500"
 * formatNumericChange(-300) // "-300"
 * formatNumericChange(0) // "±0"
 */
export const formatNumericChange = (value: number): string => {
  if (value === 0) return '±0';
  return value > 0 ? `+${value}` : `${value}`;
};

/**
 * @deprecated Use formatPercentChange instead
 * @see formatPercentChange
 */
export const formatChange = formatPercentChange;

/**
 * Format a label from camelCase or snake_case to Title Case
 * @param key - The key to format
 * @returns Formatted label in Title Case
 * @example
 * formatLabel('testName') // "Test Name"
 * formatLabel('test_name') // "Test Name"
 * formatLabel('TEST_NAME') // "TEST NAME"
 */
export const formatLabel = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

/**
 * Format a value for display
 * @param value - The value to format
 * @returns Formatted value string
 * @example
 * formatValue(null) // "N/A"
 * formatValue({foo: 'bar'}) // '{"foo":"bar"}'
 * formatValue(123) // "123"
 */
export const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};
