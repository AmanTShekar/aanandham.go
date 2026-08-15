// ── CORE UTILITIES ──

/**
 * Format a number or numeric string as Indian Rupee currency (₹)
 * @param {number|string} amount
 * @returns {string} e.g. "₹4,999"
 */
export const inr = (amount) => {
  const num = typeof amount === 'number' ? amount : Number(amount) || 0;
  return '₹' + num.toLocaleString('en-IN');
};

/**
 * Format date string into human-friendly format
 * @param {string|Date} date
 * @returns {string} e.g. "Aug 15, 2026"
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Clamp a number between min and max
 */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * Safely parse JSON from storage
 */
export const safeJsonParse = (str, fallback = null) => {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch (e) {
    return fallback;
  }
};
