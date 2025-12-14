/**
 * Format a decimal value as a percentage number
 * @param value - The value to format (0-1 range, e.g., 0.856 = 85.6%)
 * @param digitsToFixed - Number of decimal places (default: 1)
 * @returns Formatted percentage as a number
 * @example
 * formatPercent(0.856) // 85.6
 * formatPercent(0.8567, 2) // 85.67
 */
export const formatPercent = (value: number, digitsToFixed = 1): number => {
  try {
    return Number((value * 100).toFixed(digitsToFixed));
  } catch (error) {
    console.error('Error formatting percent:', error);
    return Number(value);
  }
};

/**
 * Format a decimal value as a percentage string with unit
 * @param value - The value to format (0-1 range, e.g., 0.856 = 85.6%)
 * @param digitsToFixed - Number of decimal places (default: 1)
 * @param unit - Whether to include the % symbol (default: true)
 * @returns Formatted percentage string
 * @example
 * formatPercentString(0.856) // "85.6%"
 * formatPercentString(0.856, 1, false) // "85.6"
 * formatPercentString(0.8567, 2) // "85.67%"
 */
export const formatPercentString = (value: number, digitsToFixed = 1, unit = true): string => {
  try {
    return (value * 100).toFixed(digitsToFixed) + (unit ? '%' : '');
  } catch (error) {
    console.error('Error formatting percent:', error);
    return String(value);
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
    return `${ms}ms`;
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
 * @param locale - Locale string (default: 'en-US')
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date/time string
 * @example
 * formatDateTime(Date.now()) // "12/14/2025, 10:30:45 AM"
 * formatDateTime(Date.now(), 'ja-JP') // "2025/12/14 10:30:45"
 */
export const formatDateTime = (
  timestamp: string | number | Date,
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = {}
): string => {
  try {
    return new Date(timestamp).toLocaleString(locale, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(timestamp);
  }
};

/**
 * Format percentage change value with +/- prefix
 * @param value - The change value (e.g., 0.05 = +5%)
 * @param digitsToFixed - Number of decimal places (default: 2)
 * @returns Formatted change string with +/- prefix
 * @example
 * formatChange(0.05) // "+5.00%"
 * formatChange(-0.03) // "-3.00%"
 * formatChange(0.1, 1) // "+10.0%"
 */
export const formatChange = (value: number, digitsToFixed = 2): string => {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${(value * 100).toFixed(digitsToFixed)}%`;
};

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
